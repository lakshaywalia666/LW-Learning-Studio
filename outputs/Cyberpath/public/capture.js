import {uid} from './model.js?v=studio47';

export const HOME_CARDS=['continue','goal','backup','shortcuts','reminders','favourites','briefing','courses','footer','help'];
export const START_ROUTES=['resume','dashboard','work','reminders','notebook','inbox','agenda','cards'];
const text=(v,n)=>typeof v==='string'&&v.length<=n;
const id=v=>typeof v==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(v);
const stamp=v=>typeof v==='string'&&Number.isFinite(Date.parse(v));
export function ensureCapture(w){
 w.learning||={};
 if(w.learning.capture===undefined)w.learning.capture={version:1,items:[],favourites:[],recent:[],searches:[],reflections:[],home:{order:[...HOME_CARDS],hidden:[],start:'resume'}};
 return w.learning.capture;
}
export function validateCapture(w){
 const c=ensureCapture(w);if(!c||c.version!==1)throw new Error('Invalid capture preferences.');
 for(const key of ['items','favourites','recent','searches','reflections'])if(!Array.isArray(c[key])||c[key].length>(key==='items'?10000:key==='reflections'?3660:200))throw new Error('Invalid '+key+' collection.');
 const ids=new Set();for(const item of c.items){if(!item||!id(item.id)||ids.has(item.id)||!text(item.text,10000)||!item.text.trim()||!['inbox','archived','converted'].includes(item.status)||!['idea','distraction'].includes(item.kind)||!text(item.target,300)||!stamp(item.createdAt)||!stamp(item.updatedAt))throw new Error('Invalid inbox item.');ids.add(item.id);}
 const safeTarget=t=>text(t,300)&&/^([a-z][a-z0-9-]{0,50})(\?[a-zA-Z0-9%_.+=&-]*)?$/.test(t);
 for(const collection of ['favourites','recent']){const targets=new Set();for(const row of c[collection]){if(!row||!text(row.title,240)||!safeTarget(row.target)||targets.has(row.target)||collection==='recent'&&!stamp(row.at))throw new Error('Invalid saved destination.');targets.add(row.target);}}
 for(const s of c.searches)if(!s||!id(s.id)||!text(s.title,100)||!text(s.query,300)||!s.query.trim())throw new Error('Invalid saved search.');
 for(const r of c.reflections)if(!r||!/^\d{4}-\d{2}-\d{2}$/.test(r.date)||!text(r.text,5000)||!text(r.next,2000))throw new Error('Invalid daily reflection.');
 const h=c.home;if(!h||!Array.isArray(h.order)||h.order.length!==HOME_CARDS.length||new Set(h.order).size!==HOME_CARDS.length||h.order.some(k=>!HOME_CARDS.includes(k))||!Array.isArray(h.hidden)||new Set(h.hidden).size!==h.hidden.length||h.hidden.some(k=>!HOME_CARDS.includes(k))||!START_ROUTES.includes(h.start))throw new Error('Choose valid Home preferences.');
 return c;
}
export function addCapture(w,value,kind='idea',now=new Date()){
 const c=ensureCapture(w),valueText=String(value??'').trim();if(!valueText||valueText.length>10000)throw new Error('Write between 1 and 10,000 characters.');if(!['idea','distraction'].includes(kind))throw new Error('Choose a valid capture type.');if(c.items.length>=10000)throw new Error('The inbox is full. Export a backup before adding more.');
 const row={id:uid('capture'),text:valueText,kind,status:'inbox',target:'',createdAt:now.toISOString(),updatedAt:now.toISOString()};c.items.unshift(row);return row;
}
export function updateCapture(w,itemId,action,target='',now=new Date()){
 const item=ensureCapture(w).items.find(i=>i.id===itemId);if(!item)throw new Error('This inbox item is unavailable.');
 if(!['archive','restore','convert'].includes(action)||action==='convert'&&!target)throw new Error('Choose a capture action.');
 item.status=action==='archive'?'archived':action==='restore'?'inbox':'converted';item.target=action==='convert'?target:item.target;item.updatedAt=now.toISOString();return item;
}
export function toggleFavourite(w,title,target){
 const c=ensureCapture(w),at=c.favourites.findIndex(r=>r.target===target);if(at>=0)c.favourites.splice(at,1);else{if(c.favourites.length>=200)throw new Error('Keep up to 200 favourites.');const probe={learning:{capture:structuredClone(c)}};ensureCapture(probe).favourites.push({title:String(title).slice(0,240),target});validateCapture(probe);c.favourites.push({title:String(title).slice(0,240),target});}return at<0;
}
export function rememberDestination(w,title,target,now=new Date()){
 const c=ensureCapture(w);if(!/^([a-z][a-z0-9-]{0,50})(\?|$)/.test(target))return false;
 if(c.recent[0]?.target===target)return false;c.recent=[{title:String(title).slice(0,240),target,at:now.toISOString()},...c.recent.filter(r=>r.target!==target)].slice(0,30);return true;
}
export function saveSearch(w,title,query){const c=ensureCapture(w);title=String(title||query).trim();query=String(query||'').trim();if(!title||title.length>100||!query||query.length>300)throw new Error('Keep the search name below 100 characters and query below 300.');if(c.searches.length>=200)throw new Error('Keep up to 200 saved searches.');const row={id:uid('search'),title,query};c.searches.push(row);return row;}
export function saveReflection(w,date,value,next){const c=ensureCapture(w);if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!text(value,5000)||!text(next,2000))throw new Error('Keep the reflection below 5,000 characters.');const row={date,text:value,next};const at=c.reflections.findIndex(r=>r.date===date);if(at>=0)c.reflections[at]=row;else c.reflections.unshift(row);c.reflections=c.reflections.slice(0,3660);return row;}
export function setHomePreferences(w,{order,hidden,start}){const candidate={learning:{capture:structuredClone(ensureCapture(w))}};ensureCapture(candidate).home={order,hidden,start};validateCapture(candidate);ensureCapture(w).home=structuredClone(candidate.learning.capture.home);return ensureCapture(w).home;}
