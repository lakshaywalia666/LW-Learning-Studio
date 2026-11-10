import {newPage,ensureLearning} from './learning.js?v=studio47';
import {addCapture} from './capture.js?v=studio47';
import {uid} from './model.js?v=studio47';

export const INCOMING_LIMIT=25000000;
const media=/^(image\/(png|jpeg|webp|gif)|audio\/(mpeg|mp3|wav|x-wav|ogg|mp4|aac|webm|flac)|application\/pdf|text\/(plain|markdown))$/;
export function incomingType(name,reported=''){
 const ext=String(name).split('.').pop().toLowerCase(),type=String(reported).split(';')[0].toLowerCase();
 if(ext==='lw')return 'application/vnd.lw.course+json';
 const fallback={png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',gif:'image/gif',pdf:'application/pdf',txt:'text/plain',md:'text/markdown',mp3:'audio/mpeg',m4a:'audio/mp4',wav:'audio/wav',ogg:'audio/ogg',aac:'audio/aac',webm:'audio/webm',flac:'audio/flac'};
 const result=['md','txt'].includes(ext)?fallback[ext]:!type||type==='application/octet-stream'?fallback[ext]:type==='audio/x-m4a'?'audio/mp4':type==='audio/vnd.wave'?'audio/wav':type;
 if(!media.test(result||''))throw new Error('Choose a .lw course, picture, PDF, text file or audio recording.');
 return result;
}
export function reviewIncoming(value,profileId){
 if(!value||value.version!==1||value.profileId!==profileId)throw new Error('Review this item in the profile that received it.');
 if(typeof value.token!=='string'||!/^[a-zA-Z0-9_-]{1,100}$/.test(value.token))throw new Error('This shared item is unavailable.');
 if(value.kind==='text'){
  if(typeof value.text!=='string'||!value.text.trim()||value.text.length>10000)throw new Error('Keep shared text between 1 and 10,000 characters.');
  return {version:1,profileId,token:value.token,kind:'text',text:value.text.trim(),name:'Shared text'};
 }
 if(value.kind!=='file'||typeof value.name!=='string'||!value.name.trim()||value.name.length>240||!Number.isInteger(value.bytes)||value.bytes<1||value.bytes>INCOMING_LIMIT)throw new Error('Choose one file smaller than 25 MB.');
 const type=incomingType(value.name,value.type),name=value.name.replace(/[\u0000-\u001f\u007f]/g,' ').trim();
 if(type==='application/vnd.lw.course+json'){
  if(typeof value.text!=='string'||!value.text.trim()||new TextEncoder().encode(value.text).length!==value.bytes)throw new Error('The course file could not be read.');
  return {version:1,profileId,token:value.token,kind:'course',name,text:value.text,bytes:value.bytes,type};
 }
 if(typeof value.dataURL!=='string')throw new Error('The shared file is missing.');
 const match=value.dataURL.match(/^data:([^;,]+);base64,([A-Za-z0-9+/]*={0,2})$/);
 if(!match||match[1]!==type||match[2].length%4!==0||match[2].length/4*3-(match[2].endsWith('==')?2:match[2].endsWith('=')?1:0)!==value.bytes)throw new Error('The shared file is incomplete or has a different type.');
 return {version:1,profileId,token:value.token,kind:'file',name,type,bytes:value.bytes,dataURL:value.dataURL};
}
export function keepIncomingText(w,text,destination){
 const item=reviewIncoming({version:1,profileId:'local',token:'review',kind:'text',text},'local');
 if(destination==='inbox')return {target:'inbox',row:addCapture(w,item.text)};
 if(destination!=='note')throw new Error('Choose Notes or Inbox.');
 const page=newPage(w,{title:item.text.split('\n')[0].slice(0,160)});page.blocks[0].text=item.text;return {target:'notebook?page='+page.id,row:page};
}
export function keepIncomingFile(w,item,asset){
 if(item.kind!=='file'||asset.type!==item.type||asset.bytes!==item.bytes)throw new Error('Review this file again.');
 const learning=ensureLearning(w);if(learning.assets.some(a=>a.id===asset.id))throw new Error('This file was already added.');
 learning.assets.push(asset);const page=newPage(w,{title:item.name.slice(0,160)});
 page.blocks=[{id:uid('block'),type:item.type.startsWith('image/')?'image':item.type.startsWith('audio/')?'audio':'file',text:item.name,assetId:asset.id,checked:false}];
 return page;
}
