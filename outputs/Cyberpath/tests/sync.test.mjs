import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {startSyncServer} from '../../../tools/sync-server.mjs';
import {SyncClient,newPairingCode,pairingIdentity,encryptSnapshot,decryptSnapshot,validateSyncEndpoint,syncFingerprint} from '../public/sync-client.js';
const snapshot=(title='Local')=>({format:'cyberpath-workspace',version:2,exportedAt:new Date().toISOString(),workspace:{version:2,revision:1,updatedAt:'a',settings:{name:title},courses:{},customCourses:[],learning:{pages:[],upgrades:{backup:{},cycle:{studyMinutes:25,phase:'idle',endsAt:null,remainingMs:0,rounds:0}}}},localFiles:[],activityHistory:[]});
test('sync encrypts complete snapshots, authenticates changes and derives stable room identities',async()=>{
 const code=newPairingCode(),payload=snapshot('Private notebook'),envelope=await encryptSnapshot(payload,code);assert.equal(code.length,32);assert.ok(!JSON.stringify(envelope).includes('Private notebook'));assert.deepEqual(await decryptSnapshot(envelope,code),payload);assert.deepEqual(await pairingIdentity(code),await pairingIdentity(code));assert.notDeepEqual(await pairingIdentity(newPairingCode()),await pairingIdentity(code));await assert.rejects(()=>decryptSnapshot(envelope,newPairingCode()),/could not be decrypted/);const changed={...envelope,ciphertext:(envelope.ciphertext[0]==='A'?'B':'A')+envelope.ciphertext.slice(1)};await assert.rejects(()=>decryptSnapshot(changed,code));
});
test('sync requires HTTPS except loopback and rejects credentials or query secrets in server addresses',()=>{
 assert.equal(validateSyncEndpoint('https://sync.example/base/'),'https://sync.example/base');assert.equal(validateSyncEndpoint('http://localhost:4318/'),'http://localhost:4318');for(const url of ['http://example.org','file:///tmp/sync','https://user:pass@example.org','https://example.org?code=secret','https://example.org#code'])assert.throws(()=>validateSyncEndpoint(url));
});
test('sync ignores device-specific metadata while noticing changes to notes, progress and cycle preferences',async()=>{
 const a=snapshot(),b=structuredClone(a);b.workspace.revision=99;b.workspace.updatedAt='different';b.exportedAt='later';b.workspace.devicePreferences={reminder:true};b.workspace.learning.upgrades.backup={lastPreparedAt:'now'};b.workspace.learning.upgrades.cycle.endsAt=99999;assert.equal(await syncFingerprint(a),await syncFingerprint(b));b.workspace.learning.upgrades.cycle.studyMinutes=45;assert.notEqual(await syncFingerprint(a),await syncFingerprint(b));b.workspace.learning.upgrades.cycle.studyMinutes=25;b.workspace.learning.pages.push({id:'p',title:'New note'});assert.notEqual(await syncFingerprint(a),await syncFingerprint(b));
});
test('two devices exchange encrypted work, stop on divergent edits, recover offline and use revision checks',async t=>{
 const directory=await fs.mkdtemp(path.join(os.tmpdir(),'lw-sync-test-')),server=await startSyncServer({port:0,directory});t.after(async()=>{await new Promise(resolve=>server.close(resolve));await fs.rm(directory,{recursive:true,force:true});});const endpoint='http://127.0.0.1:'+server.address().port,code=newPairingCode();
 const device=(payload)=>{const holder={payload,config:{enabled:true,endpoint,code},applied:0};holder.client=new SyncClient({getConfig:()=>holder.config,saveConfig:async c=>{holder.config=c;},createBackup:async()=>structuredClone(holder.payload),applyRemote:async p=>{holder.payload=p;holder.applied++;}});return holder;};
 const a=device(snapshot('First')),b=device(snapshot('Second'));assert.equal((await a.client.exchange()).status,'pushed');const initial=await b.client.exchange();assert.equal(initial.status,'conflict');assert.equal(b.applied,0);assert.equal((await b.client.exchange('pull',{expectedRevision:initial.revision})).status,'pulled');assert.equal(b.payload.workspace.settings.name,'First');assert.equal((await a.client.exchange()).status,'unchanged');
 a.payload.workspace.learning.pages.push({id:'a',title:'A new idea'});assert.equal((await a.client.exchange()).status,'pushed');assert.equal((await b.client.exchange()).status,'pulled');assert.equal(b.payload.workspace.learning.pages[0].title,'A new idea');
 a.payload.workspace.settings.name='A edit';b.payload.workspace.settings.name='B edit';assert.equal((await a.client.exchange()).status,'pushed');const conflict=await b.client.exchange();assert.equal(conflict.status,'conflict');assert.equal(b.payload.workspace.settings.name,'B edit');
 // The user must see a newer remote before replacing it if it changed after the conflict dialog.
 a.payload.workspace.settings.name='A newer edit';await a.client.exchange();assert.equal((await b.client.exchange('push',{expectedRevision:conflict.revision})).status,'retry-conflict');const latest=await b.client.exchange();assert.equal((await b.client.exchange('push',{expectedRevision:latest.revision})).status,'pushed');assert.equal((await a.client.exchange()).status,'pulled');assert.equal(a.payload.workspace.settings.name,'B edit');
 const files=await fs.readdir(directory),stored=await fs.readFile(path.join(directory,files[0]),'utf8');assert.ok(!stored.includes('B edit'));assert.ok(!stored.includes('A new idea'));
 const {room,token}=await pairingIdentity(code),url=endpoint+'/v1/rooms/'+room;const wrong=await fetch(url,{headers:{Authorization:'Bearer '+'0'.repeat(64)}});assert.equal(wrong.status,403);
 const stale=await fetch(url,{method:'PUT',headers:{Authorization:'Bearer '+token,'If-Match':'0','Content-Type':'application/json'},body:'{}'});assert.equal(stale.status,409);
 const offline=a.client.request;a.client.request=async()=>{throw new Error('Offline');};a.payload.workspace.settings.name='Offline edit';await assert.rejects(()=>a.client.exchange(),/Offline/);assert.equal(a.payload.workspace.settings.name,'Offline edit');a.client.request=offline;assert.equal((await a.client.exchange()).status,'pushed');
});
test('a local edit during a network pull becomes a conflict instead of being overwritten',async()=>{
 const code=newPairingCode(),old=snapshot(),remote=snapshot('Remote'),envelope=await encryptSnapshot(remote,code);let local=structuredClone(old),applied=false;const config={enabled:true,endpoint:'http://localhost:4318',code,hash:await syncFingerprint(old),revision:1};const client=new SyncClient({getConfig:()=>config,saveConfig:async()=>{},createBackup:async()=>structuredClone(local),applyRemote:async()=>{applied=true;},request:async()=>{local.workspace.settings.name='Typed while waiting';return {ok:true,status:200,json:async()=>({revision:2,envelope})};}});assert.equal((await client.exchange()).status,'conflict');assert.equal(applied,false);assert.equal(local.workspace.settings.name,'Typed while waiting');
});
test('a disconnected device does not apply or continue a pending network exchange',async()=>{
 const code=newPairingCode();let config={enabled:true,endpoint:'http://localhost:4318',code},applied=false;const client=new SyncClient({getConfig:()=>config,saveConfig:async c=>{config=c;},createBackup:async()=>snapshot(),applyRemote:async()=>{applied=true;},request:async()=>{config={enabled:false};return {ok:false,status:404};}});await assert.rejects(()=>client.exchange(),/connection changed/);assert.equal(applied,false);assert.equal(config.enabled,false);
});
test('network service refuses nonlocal cleartext hosting',async()=>{await assert.rejects(()=>startSyncServer({host:'0.0.0.0',port:0}),/requires TLS/);});

test('sync ignores recent navigation while preserving real capture, reminder and practice changes',async()=>{
 const a=snapshot();a.workspace.learning.capture={version:1,items:[],favourites:[],recent:[],searches:[],reflections:[],home:{start:'resume'}};a.workspace.learning.organizer={version:1,items:[]};a.workspace.learning.practice={version:1,decks:[],cards:[],pageTemplates:[],lessonTemplates:[]};
 const b=structuredClone(a);b.workspace.learning.capture.recent.push({title:'Opened a page',target:'notebook?page=page-1',at:'2026-11-03T12:00:00Z'});assert.equal(await syncFingerprint(a),await syncFingerprint(b));assert.equal(b.workspace.learning.capture.recent.length,1);
 b.workspace.learning.capture.items.push({id:'idea',text:'A real new idea'});assert.notEqual(await syncFingerprint(a),await syncFingerprint(b));b.workspace.learning.capture.items=[];
 b.workspace.learning.organizer.items.push({id:'reminder',title:'A real reminder'});assert.notEqual(await syncFingerprint(a),await syncFingerprint(b));b.workspace.learning.organizer.items=[];
 b.workspace.learning.practice.cards.push({id:'card',reviews:[{result:'good'}]});assert.notEqual(await syncFingerprint(a),await syncFingerprint(b));
});
