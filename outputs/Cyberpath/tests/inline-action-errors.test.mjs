import test from 'node:test';import assert from 'node:assert/strict';import {featureUI} from '../public/feature-ui.js';
test('dialog action errors stay inside their form and late failures cannot write into a replacement dialog',async()=>{
 const previous=globalThis.document,listeners={},toasts=[],notice={isConnected:true,textContent:'old error'},workspace={},node={disabled:false,isConnected:true,dataset:{check:'preview'},closest:()=>({querySelector:()=>notice})};
 globalThis.document={addEventListener:(type,fn)=>listeners[type]=fn};
 try{const kit=featureUI({workspace:()=>workspace,toast:message=>toasts.push(message)},'check');let reject;kit.events(()=>new Promise((_,fail)=>reject=fail),()=>{});
  const event={target:{closest:()=>node},preventDefault(){}};listeners.click(event);await Promise.resolve();assert.equal(notice.textContent,'');reject(new Error('Choose four corners around the page.'));await new Promise(resolve=>setImmediate(resolve));assert.equal(notice.textContent,'Choose four corners around the page.');assert.equal(toasts.length,0);
  listeners.click(event);await Promise.resolve();node.isConnected=false;notice.isConnected=false;reject(new Error('The original action stopped.'));await new Promise(resolve=>setImmediate(resolve));assert.equal(notice.textContent,'');assert.deepEqual(toasts,['The original action stopped.']);
 }finally{globalThis.document=previous;}
});
