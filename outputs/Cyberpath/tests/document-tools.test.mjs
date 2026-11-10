import test from 'node:test';import assert from 'node:assert/strict';
import {createWorkspace,workspaceBackup,parseWorkspaceBackup} from '../public/workspace.js';
import {FULL_PAGE,validatePageCorners,pageProjection,rectifyPixels,saveDocument,documentSearchRows} from '../public/document-tools.js';
import {LocalDocumentJob} from '../public/local-ocr.js';
test('perspective projection maps all four output corners back to the chosen paper corners',()=>{
 const points=[{x:.1,y:.2},{x:.8,y:.1},{x:.9,y:.9},{x:.2,y:.8}],map=pageProjection(points);
 for(const [i,[u,v]]of [[0,[0,0]],[1,[1,0]],[2,[1,1]],[3,[0,1]]]){const p=map(u,v);assert(Math.abs(p.x-points[i].x)<1e-9);assert(Math.abs(p.y-points[i].y)<1e-9);}
 assert.throws(()=>validatePageCorners([FULL_PAGE[0],FULL_PAGE[2],FULL_PAGE[1],FULL_PAGE[3]]),/clockwise/);assert.throws(()=>validatePageCorners([{x:0,y:0},{x:.01,y:0},{x:.01,y:.01},{x:0,y:.01}]),/larger/);
});
test('page rectification preserves corner colours, rotates correctly and bounds output memory',()=>{
 const data=new Uint8ClampedArray([255,0,0,255,0,255,0,255,0,0,255,255,255,255,255,255]),normal=rectifyPixels({data,width:2,height:2,points:FULL_PAGE});assert.deepEqual([...normal.data.slice(0,4)],[255,0,0,255]);assert.deepEqual([...normal.data.slice(-4)],[255,255,255,255]);const rotated=rectifyPixels({data,width:2,height:2,points:FULL_PAGE,rotation:90});assert.deepEqual([...rotated.data.slice(0,4)],[0,0,255,255]);const gray=rectifyPixels({data,width:2,height:2,points:FULL_PAGE,mode:'gray'});assert.equal(gray.data[0],gray.data[1]);assert.equal(gray.data[1],gray.data[2]);assert.throws(()=>rectifyPixels({data,width:10000,height:10000,points:FULL_PAGE}),/five million/);
});
test('saved recognized text and both file references survive backup without touching courses or the original input',()=>{
 const w=createWorkspace(),before=structuredClone(w.courses),input={title:'A printed page',text:'PRIVATE RECOGNIZED TEXT',language:'eng',source:{assetId:'original',hash:'a'.repeat(64),page:0},processed:{assetId:'processed',hash:'b'.repeat(64)},points:structuredClone(FULL_PAGE),rotation:0,mode:'paper'},row=saveDocument(w,input);input.points[0].x=.9;assert.equal(row.points[0].x,0);assert.deepEqual(w.courses,before);const restored=parseWorkspaceBackup(JSON.stringify(workspaceBackup(w)));assert.deepEqual(restored.learning.documents,w.learning.documents);assert(documentSearchRows(restored)[0].text.includes('PRIVATE'));const snapshot=structuredClone(row);assert.throws(()=>saveDocument(w,{...row,points:[]},row.id),/corners/);assert.deepEqual(row,snapshot);
});
test('cancelling a local OCR job terminates it and rejects late results instead of applying text',async()=>{
 const workers=[],factory=()=>{const w={terminated:false,postMessage(){},terminate(){this.terminated=true;}};workers.push(w);return w;},job=new LocalDocumentJob({factory,timeout:1000});
 const first=job.run('ocr',{image:'sample',language:'eng'});const rejected=assert.rejects(first,{name:'AbortError'});job.cancel();await rejected;assert.equal(workers[0].terminated,true);const second=job.run('ocr',{image:'next',language:'hin'});workers[0].onmessage({data:{ok:true,text:'Stale'}});workers[1].onmessage({data:{ok:true,text:'Current'}});assert.equal((await second).text,'Current');assert.equal(workers[1].terminated,true);assert.equal(job.active,null);
});
