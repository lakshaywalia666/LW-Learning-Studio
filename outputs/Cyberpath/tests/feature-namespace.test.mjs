import test from 'node:test';import assert from 'node:assert/strict';import {featureUI} from '../public/feature-ui.js';
test('hyphenated feature namespaces dispatch button, form and close actions using real dataset keys',async()=>{
 const oldDocument=globalThis.document,oldFormData=globalThis.FormData,listeners={},received=[],workspace={};let closes=0;
 const node={isConnected:true,dataset:{deviceExtra:'calendar'},closest:()=>null},form={dataset:{deviceExtraForm:'calendar'},closest:()=>null,querySelector:()=>null};
 globalThis.document={addEventListener:(name,fn)=>listeners[name]=fn};globalThis.FormData=class{*[Symbol.iterator](){yield ['minutes','30'];}};
 try{featureUI({workspace:()=>workspace,closeModal:()=>closes++,toast:message=>{throw new Error(message);}},'device-extra').events(action=>received.push(action),(kind,v)=>received.push([kind,v.minutes]));
  listeners.click({target:{closest:()=>node},preventDefault(){}});await new Promise(resolve=>setImmediate(resolve));assert.deepEqual(received,['calendar']);
  listeners.submit({target:{closest:()=>form},preventDefault(){}});await new Promise(resolve=>setImmediate(resolve));assert.deepEqual(received,['calendar',['calendar','30']]);
  node.dataset.deviceExtra='close';listeners.click({target:{closest:()=>node},preventDefault(){}});assert.equal(closes,1);
 }finally{globalThis.document=oldDocument;globalThis.FormData=oldFormData;}
});
