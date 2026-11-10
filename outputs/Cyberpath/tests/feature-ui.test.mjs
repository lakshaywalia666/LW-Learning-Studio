import test from 'node:test';import assert from 'node:assert/strict';import {featureUI} from '../public/feature-ui.js';
test('a delayed save closes only its original sheet and leaves a newly opened sheet intact',async()=>{
 const previous=globalThis.document;try{const w={learning:{value:1}},dialog={open:true,firstElementChild:{}},events=[];globalThis.document={querySelector:()=>dialog};let finish,started;const ready=new Promise(resolve=>started=resolve),ctx={workspace:()=>w,flush:()=>{},persist:()=>{},commit:()=>{started();return new Promise(resolve=>finish=resolve);},closeModal:()=>{dialog.open=false;events.push('closed');},render:()=>{},toast:()=>{}};
 const kit=featureUI(ctx,'sample'),pending=kit.commit(w=>w.learning.value=2);await ready;const next={};dialog.firstElementChild=next;finish();await pending;assert.equal(dialog.open,true);assert.equal(dialog.firstElementChild,next);assert.deepEqual(events,[]);assert.equal(w.learning.value,2);
 }finally{globalThis.document=previous;}
});
test('a completed save closes its own sheet and a failed save restores prior data',async()=>{
 const previous=globalThis.document;try{const w={learning:{value:1}},dialog={open:true,firstElementChild:{}},ctx={workspace:()=>w,flush:()=>{},persist:()=>{},commit:async()=>{},closeModal:()=>{dialog.open=false;},render:()=>{},toast:()=>{}};globalThis.document={querySelector:()=>dialog};const kit=featureUI(ctx,'sample');await kit.commit(w=>w.learning.value=2);assert.equal(dialog.open,false);dialog.open=true;ctx.commit=async()=>{throw new Error('Storage unavailable');};await assert.rejects(()=>kit.commit(w=>w.learning.value=3),/Storage/);assert.equal(w.learning.value,2);assert.equal(dialog.open,true);
 }finally{globalThis.document=previous;}
});
