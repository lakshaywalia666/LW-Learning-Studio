import test from 'node:test';import assert from 'node:assert/strict';
import {createWorkspace,workspaceBackup,parseWorkspaceBackup} from '../public/workspace.js';
import {reviewIncoming,incomingType,keepIncomingText,keepIncomingFile} from '../public/incoming.js';
const base={version:1,token:'share-test',profileId:'default'};
test('incoming review refuses foreign profiles, active content and incomplete media',()=>{
 assert.throws(()=>reviewIncoming({...base,kind:'text',text:'hello'},'other'),/profile/);
 assert.throws(()=>incomingType('page.html','text/html'),/Choose/);assert.throws(()=>incomingType('picture.png','text/html'),/Choose/);
 assert.equal(incomingType('my.LW','application/octet-stream'),'application/vnd.lw.course+json');
 for(const extra of [{bytes:2,dataURL:'data:image/png;base64,YQ=='},{bytes:1,dataURL:'data:image/jpeg;base64,YQ=='},{bytes:1,dataURL:'https://remote/picture.png'}])assert.throws(()=>reviewIncoming({...base,kind:'file',name:'image.png',type:'image/png',...extra},'default'),/incomplete|type/);
 const file=reviewIncoming({...base,kind:'file',name:'image.png',type:'image/png',bytes:1,dataURL:'data:image/png;base64,YQ=='},'default');assert.equal(file.bytes,1);
});
test('shared text stays literal until review, then saves only the chosen note or inbox',()=>{
 const w=createWorkspace(),before=structuredClone(w.courses),text='https://example.com/?q=<script>alert(1)</script>';
 const reviewed=reviewIncoming({...base,kind:'text',text},'default');assert.equal(w.learning?.pages?.length||0,0);const kept=keepIncomingText(w,reviewed.text,'note');assert.equal(kept.row.blocks[0].text,text);assert(kept.target.startsWith('notebook?page='));
 keepIncomingText(w,'A second thought','inbox');assert.equal(w.learning.capture.items.length,1);assert.equal(w.learning.pages.length,1);assert.deepEqual(w.courses,before);assert.throws(()=>keepIncomingText(w,'hello','study'),/Notes or Inbox/);
 assert.equal(parseWorkspaceBackup(JSON.stringify(workspaceBackup(w))).learning.pages.length,1);
});
test('shared attachment keeps a notebook dependency and never creates course completion',()=>{
 const w=createWorkspace(),before=structuredClone(w.courses),file=reviewIncoming({...base,kind:'file',name:'memo.wav',type:'audio/wav',bytes:1,dataURL:'data:audio/wav;base64,YQ=='},'default');
 const asset={id:'file-test',name:'memo.wav',type:'audio/wav',bytes:1,createdAt:new Date().toISOString()},page=keepIncomingFile(w,file,asset);assert.equal(page.blocks[0].type,'audio');assert.equal(page.blocks[0].assetId,asset.id);assert.deepEqual(w.courses,before);assert.throws(()=>keepIncomingFile(w,file,asset),/already/);
 const restored=parseWorkspaceBackup(JSON.stringify(workspaceBackup(w)));assert.equal(restored.learning.assets.length,1);assert.equal(restored.learning.pages[0].blocks[0].assetId,asset.id);
});
test('course intake retains exact text for the normal signed-course importer without executing it',()=>{
 const text='{"format":"lw-signed-course","untrusted":"<script>"}',bytes=new TextEncoder().encode(text).length,item=reviewIncoming({...base,kind:'file',name:'course.lw',type:'application/octet-stream',bytes,text},'default');assert.equal(item.kind,'course');assert.equal(item.text,text);assert.throws(()=>reviewIncoming({...base,kind:'file',name:'course.lw',bytes:bytes+1,text},'default'),/could not be read/);
});
