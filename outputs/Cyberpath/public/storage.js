import {profileKey,ACTIVE_PROFILE} from './profiles.js?v=studio47';
const DB=profileKey('lw-studio-raw-v1');let database;
export async function openStore(){
 if(database)return database;
 database=await new Promise((resolve,reject)=>{const request=indexedDB.open(DB,1);request.onupgradeneeded=()=>{request.result.createObjectStore('records');request.result.createObjectStore('snapshots',{keyPath:'id'});};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);request.onblocked=()=>reject(new Error('Close older LW Learning Studio tabs and reopen the app.'));});
 database.onversionchange=()=>{database.close();database=null;};return database;
}
export async function readState(){if(globalThis.AndroidApp?.getState){const raw=globalThis.AndroidApp.getState(ACTIVE_PROFILE);if(!raw)return null;const value=JSON.parse(raw);if(value.nativeError)throw new Error(value.nativeError);return value;}const db=await openStore();return new Promise((resolve,reject)=>{const tx=db.transaction('records'),r=tx.objectStore('records').get('state');r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error);});}
export async function writeState(state,expectedRevision){
 if(globalThis.AndroidApp?.saveState){const result=JSON.parse(globalThis.AndroidApp.saveState(JSON.stringify(state),expectedRevision,ACTIVE_PROFILE));if(!result.ok){const error=new Error(result.conflict?'A newer workspace was saved. Restart the app before editing.':result.error||'The phone could not save progress.');if(result.conflict)error.code='CONFLICT';throw error;}return{...state,revision:result.revision,updatedAt:result.updatedAt};}
 const db=await openStore();return new Promise((resolve,reject)=>{const tx=db.transaction('records','readwrite'),store=tx.objectStore('records');let saved,error;
  const get=store.get('state');get.onsuccess=()=>{const revision=get.result?.revision||0;if(revision!==expectedRevision){error=new Error('Another tab saved changes. Reload this tab before editing.');error.code='CONFLICT';tx.abort();return;}saved={...structuredClone(state),revision:revision+1,updatedAt:new Date().toISOString()};store.put(saved,'state');};
  tx.oncomplete=()=>resolve(saved);tx.onerror=()=>reject(error||tx.error||new Error('Progress could not be saved.'));tx.onabort=()=>reject(error||tx.error||new Error('Progress could not be saved.'));
 });
}
export async function saveSnapshot(state,label='Automatic daily backup'){
 const db=await openStore();return new Promise((resolve,reject)=>{const tx=db.transaction('snapshots','readwrite'),store=tx.objectStore('snapshots');store.put({id:Date.now().toString(),createdAt:new Date().toISOString(),label,state:structuredClone(state)});const get=store.getAll();get.onsuccess=()=>{const rows=get.result.sort((a,b)=>b.createdAt.localeCompare(a.createdAt));for(const row of rows.slice(10))store.delete(row.id);};tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});
}
export async function listSnapshots(){const db=await openStore();return new Promise((resolve,reject)=>{const r=db.transaction('snapshots').objectStore('snapshots').getAll();r.onsuccess=()=>resolve(r.result.sort((a,b)=>b.createdAt.localeCompare(a.createdAt)));r.onerror=()=>reject(r.error);});}
