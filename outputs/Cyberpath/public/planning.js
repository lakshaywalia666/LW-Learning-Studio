import {uid} from './model.js?v=studio47';
import {courseTaskQueue} from './course-tasks.js?v=studio47';
import {realDay,shiftDay,daysBetween,calendarDay} from './schedule.js?v=studio47';

const id=v=>typeof v==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(v);
const text=(v,n)=>typeof v==='string'&&v.length<=n;
const stamp=v=>typeof v==='string'&&Number.isFinite(Date.parse(v));
export const clockMinutes=v=>typeof v==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(v)?Number(v.slice(0,2))*60+Number(v.slice(3)):NaN;
export const minuteClock=n=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
export function ensurePlanning(w){w.learning||={};if(w.learning.planning===undefined)w.learning.planning={version:1,revision:0,availability:[],blocks:[],plans:[]};return w.learning.planning;}
export function validatePlanning(w){
 const p=ensurePlanning(w);if(!p||p.version!==1||!Number.isSafeInteger(p.revision)||p.revision<0)throw new Error('Invalid schedule.');
 const seen=new Set();for(const [key,max] of [['availability',70],['blocks',10000],['plans',100]]){if(!Array.isArray(p[key])||p[key].length>max)throw new Error('The '+key+' collection is too large.');for(const row of p[key]){if(!row||!id(row.id)||seen.has(row.id))throw new Error('Invalid or repeated schedule ID.');seen.add(row.id);}}
 for(const a of p.availability)if(!Number.isInteger(a.weekday)||a.weekday<0||a.weekday>6||!Number.isFinite(clockMinutes(a.start))||!Number.isFinite(clockMinutes(a.end))||clockMinutes(a.start)>=clockMinutes(a.end))throw new Error('Choose a weekday and an end after the start.');
 for(const b of p.blocks)if(!text(b.title,240)||!b.title.trim()||!realDay(b.date)||!Number.isFinite(clockMinutes(b.start))||!Number.isInteger(b.duration)||b.duration<1||clockMinutes(b.start)+b.duration>1440||!['activity','study','busy'].includes(b.kind)||!['planned','archived'].includes(b.status)||!['courseId','topicId','taskId','planId'].every(k=>b[k]===''||id(b[k]))||!stamp(b.createdAt)||!stamp(b.updatedAt))throw new Error('Choose a title, date and duration that fits within one day.');
 for(const plan of p.plans)if(!text(plan.title,240)||!plan.title.trim()||!realDay(plan.startDate)||!realDay(plan.deadline)||plan.startDate>plan.deadline||daysBetween(plan.startDate,plan.deadline)>730||!Array.isArray(plan.courseIds)||!plan.courseIds.length||plan.courseIds.length>100||new Set(plan.courseIds).size!==plan.courseIds.length||plan.courseIds.some(c=>!id(c))||!['active','archived'].includes(plan.status)||!stamp(plan.createdAt)||!stamp(plan.updatedAt))throw new Error('Choose courses and a deadline within two years of the start.');
 return p;
}
function update(w,run){const candidate={learning:{planning:structuredClone(ensurePlanning(w))}};const value=run(candidate.learning.planning);candidate.learning.planning.revision++;validatePlanning(candidate);w.learning.planning=candidate.learning.planning;return value;}
export function saveAvailability(w,value,existingId=''){
 return update(w,p=>{const row={id:existingId||uid('window'),weekday:Number(value.weekday),start:String(value.start||''),end:String(value.end||'')},at=p.availability.findIndex(a=>a.id===existingId);if(existingId&&at<0)throw new Error('This study window is unavailable.');if(at>=0)p.availability[at]=row;else p.availability.push(row);return row;});
}
export function removeAvailability(w,windowId){return update(w,p=>{const at=p.availability.findIndex(a=>a.id===windowId);if(at<0)throw new Error('This study window is unavailable.');p.availability.splice(at,1);});}
export function saveTimeBlock(w,value,existingId='',now=new Date()){
 return update(w,p=>{const old=existingId?p.blocks.find(b=>b.id===existingId):null;if(existingId&&!old)throw new Error('This time block is unavailable.');if(old?.planId)throw new Error('Use the deadline plan preview to move its study blocks.');const row={id:old?.id||uid('block'),title:String(value.title||'').trim(),date:value.date,start:value.start,duration:Number(value.duration),kind:value.kind||'activity',status:old?.status||'planned',courseId:value.courseId||'',topicId:'',taskId:'',planId:'',createdAt:old?.createdAt||now.toISOString(),updatedAt:now.toISOString()};if(old)Object.assign(old,row);else p.blocks.push(row);return row;});
}
export function setBlockArchived(w,blockId,archived,now=new Date()){return update(w,p=>{const b=p.blocks.find(b=>b.id===blockId);if(!b)throw new Error('This time block is unavailable.');if(b.planId)throw new Error('Manage generated blocks through their deadline plan.');b.status=archived?'archived':'planned';b.updatedAt=now.toISOString();return b;});}
export const blocksOverlap=(a,b)=>a.date===b.date&&clockMinutes(a.start)<clockMinutes(b.start)+b.duration&&clockMinutes(b.start)<clockMinutes(a.start)+a.duration;
export function blockConflicts(w,block){return ensurePlanning(w).blocks.filter(b=>b.status==='planned'&&b.id!==block.id&&blocksOverlap(block,b));}
export function remainingPlanTasks(records,courseIds){
 const result=[];for(const courseId of courseIds){const record=records.find(r=>r.data.meta.course.id===courseId);if(!record)throw new Error('A selected course is unavailable. Choose the plan courses again.');for(const {topic,task,done} of courseTaskQueue(record.data,record.state))if(!done)result.push({courseId,courseTitle:record.data.meta.course.title,topicId:topic.id,taskId:task.id,title:task.title,minutes:task.minutes});}return result;
}
const signature=tasks=>JSON.stringify(tasks);
const isFuture=(b,now)=>b.date>calendarDay(now)||b.date===calendarDay(now)&&clockMinutes(b.start)>=now.getHours()*60+now.getMinutes();
function mergedWindows(rows){const out=[];for(const row of rows.sort((a,b)=>a[0]-b[0])){const last=out.at(-1);if(last&&row[0]<=last[1])last[1]=Math.max(last[1],row[1]);else out.push([...row]);}return out;}
export function previewDeadlinePlan(w,records,value,{planId='',now=new Date()}={}){
 const p=validatePlanning(w),old=planId?p.plans.find(x=>x.id===planId):null;if(planId&&!old)throw new Error('This deadline plan is unavailable.');
 const draft={id:planId||uid('plan'),title:String(value.title||'').trim(),courseIds:[...(value.courseIds||[])],startDate:value.startDate,deadline:value.deadline,status:'active',createdAt:old?.createdAt||now.toISOString(),updatedAt:now.toISOString()};
 const probe={learning:{planning:{...p,plans:[draft]}}};validatePlanning(probe);
 if(p.plans.some(x=>x.id!==planId&&x.status==='active'&&x.courseIds.some(c=>draft.courseIds.includes(c))))throw new Error('A selected course already has an active deadline plan. Edit or archive that plan first.');
 if(!p.availability.length)throw new Error('Add at least one weekly study window first.');
 const tasks=remainingPlanTasks(records,draft.courseIds);if(tasks.length>5000)throw new Error('Plan up to 5,000 unfinished tasks at once. Select fewer courses.');
 const replace=planId?p.blocks.filter(b=>b.planId===planId&&b.status==='planned'&&isFuture(b,now)):[];const removed=new Set(replace.map(b=>b.id));
 const occupied=new Map();for(const b of p.blocks)if(b.status==='planned'&&!removed.has(b.id)){if(!occupied.has(b.date))occupied.set(b.date,[]);occupied.get(b.date).push([clockMinutes(b.start),clockMinutes(b.start)+b.duration]);}
 const from=draft.startDate>calendarDay(now)?draft.startDate:calendarDay(now),slots=[];
 if(from<=draft.deadline)for(let offset=0;offset<=daysBetween(from,draft.deadline);offset++){const date=shiftDay(from,offset);
  const weekday=new Date(date+'T12:00:00').getDay(),floor=date===calendarDay(now)?Math.min(1440,now.getHours()*60+now.getMinutes()+5):0;
  let windows=mergedWindows(p.availability.filter(a=>a.weekday===weekday).map(a=>[Math.max(floor,clockMinutes(a.start)),clockMinutes(a.end)]).filter(([a,b])=>a<b));
  for(const [start,end] of mergedWindows(occupied.get(date)||[]))windows=windows.flatMap(([a,b])=>end<=a||start>=b?[[a,b]]:[[a,Math.min(b,start)],[Math.max(a,end),b]].filter(([x,y])=>x<y));
  for(const [start,end] of windows)slots.push({date,start,end});
 }
 const blocks=[],unplaced=[];let at=0;
 for(const task of tasks){let minutes=task.minutes;while(minutes&&at<slots.length){const slot=slots[at],duration=Math.min(minutes,slot.end-slot.start);if(duration){blocks.push({id:uid('block'),title:task.title,date:slot.date,start:minuteClock(slot.start),duration,kind:'study',status:'planned',courseId:task.courseId,topicId:task.topicId,taskId:task.taskId,planId:draft.id,createdAt:now.toISOString(),updatedAt:now.toISOString()});slot.start+=duration;minutes-=duration;}if(slot.start===slot.end)at++;}if(minutes)unplaced.push({...task,minutes});}
 if(p.blocks.length+blocks.length>10000)throw new Error('The schedule has reached its block limit. Export a backup before extending it.');
 return {plan:draft,blocks,unplaced,taskCount:tasks.length,totalMinutes:tasks.reduce((n,t)=>n+t.minutes,0),scheduledMinutes:blocks.reduce((n,b)=>n+b.duration,0),replaceIds:replace.map(b=>b.id),missed:p.blocks.filter(b=>b.planId===planId&&b.status==='planned'&&!isFuture(b,now)&&tasks.some(t=>t.courseId===b.courseId&&t.topicId===b.topicId&&t.taskId===b.taskId)).length,revision:p.revision,taskSignature:signature(tasks),generatedAt:now.toISOString()};
}
export function applyDeadlinePlan(w,records,preview,now=new Date()){
 if(!preview||preview.revision!==ensurePlanning(w).revision||signature(remainingPlanTasks(records,preview.plan.courseIds))!==preview.taskSignature)throw new Error('The schedule or coursework changed. Generate a fresh preview.');
 if(preview.blocks.some(b=>!isFuture(b,now)))throw new Error('A suggested start time has passed. Generate a fresh preview.');
 return update(w,p=>{const at=p.plans.findIndex(x=>x.id===preview.plan.id);if(at>=0)p.plans[at]=structuredClone(preview.plan);else p.plans.push(structuredClone(preview.plan));const replaced=new Set(preview.replaceIds);for(const b of p.blocks)if(replaced.has(b.id)){b.status='archived';b.updatedAt=now.toISOString();}p.blocks.push(...structuredClone(preview.blocks));return p.plans.find(x=>x.id===preview.plan.id);});
}
export function archiveDeadlinePlan(w,planId,now=new Date()){return update(w,p=>{const plan=p.plans.find(x=>x.id===planId);if(!plan)throw new Error('This deadline plan is unavailable.');plan.status='archived';plan.updatedAt=now.toISOString();for(const b of p.blocks)if(b.planId===planId&&b.status==='planned'&&isFuture(b,now)){b.status='archived';b.updatedAt=now.toISOString();}return plan;});}
