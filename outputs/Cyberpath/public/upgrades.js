import {topicTasks} from './course-tasks.js?v=studio47';
import {isoDate,addDays,uid} from './model.js?v=studio47';

export const DEFAULT_UPGRADES={version:1,reading:{fontSize:16,lineHeight:1.65,letterSpacing:0,contrast:'normal',largeTargets:false},restAwareStreaks:true,restDays:[7],widgetMode:'next',backup:{},cycle:{studyMinutes:25,breakMinutes:5,longBreakMinutes:15,longEvery:4,autoContinue:false,phase:'idle',rounds:0,remainingMs:0,endsAt:null}};
export function ensureUpgrades(w){
 w.learning||={};const current=w.learning.upgrades||={};
 for(const [key,value] of Object.entries(DEFAULT_UPGRADES))if(current[key]===undefined)current[key]=structuredClone(value);
 for(const key of ['reading','backup','cycle']){current[key]||={};for(const [field,value] of Object.entries(DEFAULT_UPGRADES[key]))if(current[key][field]===undefined)current[key][field]=structuredClone(value);}
 return current;
}
export function validateUpgrades(w){
 const u=ensureUpgrades(w),r=u.reading,c=u.cycle;
 if(u.version!==1||!Number.isFinite(r.fontSize)||r.fontSize<14||r.fontSize>26||!Number.isFinite(r.lineHeight)||r.lineHeight<1.3||r.lineHeight>2.2||!Number.isFinite(r.letterSpacing)||r.letterSpacing<0||r.letterSpacing>.12||!['normal','high'].includes(r.contrast)||typeof r.largeTargets!=='boolean')throw new Error('Choose valid reading and accessibility settings.');
 if(typeof u.restAwareStreaks!=='boolean'||!Array.isArray(u.restDays)||u.restDays.length>7||new Set(u.restDays).size!==u.restDays.length||u.restDays.some(d=>!Number.isInteger(d)||d<1||d>7)||!['next','daily','notes'].includes(u.widgetMode))throw new Error('Choose valid rest days and widget settings.');
 for(const key of ['studyMinutes','breakMinutes','longBreakMinutes'])if(!Number.isInteger(c[key])||c[key]<1||c[key]>180)throw new Error('Study and break periods must be 1–180 minutes.');
 if(!Number.isInteger(c.longEvery)||c.longEvery<1||c.longEvery>12||typeof c.autoContinue!=='boolean'||!['idle','study','break','long-break','ready'].includes(c.phase)||!Number.isInteger(c.rounds)||c.rounds<0||!Number.isFinite(c.remainingMs)||c.remainingMs<0||c.remainingMs>10800000||c.endsAt!==null&&(!Number.isFinite(c.endsAt)||c.endsAt<0))throw new Error('Invalid study/break timer state.');
 return u;
}
export function reorderTopic(data,id,targetIndex){
 const from=data.topics.findIndex(t=>t.id===id);if(from<0)throw new Error('Choose an available topic.');
 if(!Number.isInteger(targetIndex)||targetIndex<0||targetIndex>=data.topics.length)throw new Error('Choose a valid topic position.');
 const [topic]=data.topics.splice(from,1);data.topics.splice(targetIndex,0,topic);return topic;
}
export function validateLessonMedia(value=[]){
 if(!Array.isArray(value)||value.length>8)throw new Error('Add at most eight lesson attachments per topic.');
 const ids=new Set();let total=0;
 for(const item of value){
  if(!item||!/^[A-Za-z0-9_-]{1,100}$/.test(item.id)||ids.has(item.id)||typeof item.name!=='string'||item.name.length>240||typeof item.dataURL!=='string')throw new Error('A lesson attachment needs a unique ID and a name.');
  const match=item.dataURL.match(/^data:(image\/(?:png|jpeg|webp|gif)|audio\/[A-Za-z0-9.+-]+|video\/(?:mp4|webm)|application\/pdf);base64,([A-Za-z0-9+/]*={0,2})$/);
  if(!match||!['image','audio','video','pdf'].includes(item.kind)||(item.kind==='pdf'?match[1]!=='application/pdf':!match[1].startsWith(item.kind+'/'))||item.dataURL.length>8000000||(match[2].length*3/4-(match[2].endsWith('==')?2:match[2].endsWith('=')?1:0))>5000000)throw new Error('Use an image, audio, MP4/WebM video or PDF smaller than 5 MB.');
  for(const [key,max]of [['alt',500],['transcript',10000]])if(item[key]!==undefined&&(typeof item[key]!=='string'||item[key].length>max))throw new Error('Use up to '+max+' characters for '+key+'.');
  if(item.kind==='pdf'&&!atob(match[2].slice(0,12)).startsWith('%PDF-'))throw new Error('Choose a readable PDF worksheet.');total+=item.dataURL.length;ids.add(item.id);
 }
 if(total>12000000)throw new Error('Keep lesson attachments below 9 MB in total so the course remains easy to share.');
 return value;
}
export function compareCourseContent(oldData,incoming){
 const old=new Map((oldData?.topics||[]).map(t=>[t.id,t])),next=new Map(incoming.topics.map(t=>[t.id,t]));
 const added=incoming.topics.filter(t=>!old.has(t.id)),removed=[...old.values()].filter(t=>!next.has(t.id)),changed=[];
 for(const topic of incoming.topics){const before=old.get(topic.id);if(!before)continue;const fields=[];for(const field of ['title','stage','scope','practice','evidenceRequired','tasks','lessonMedia','recall','requires','resources'])if(JSON.stringify(before[field]??null)!==JSON.stringify(topic[field]??null))fields.push(field);if(fields.length)changed.push({id:topic.id,title:topic.title,fields,before,after:topic});}
 const sharedOld=[...old.keys()].filter(id=>next.has(id)),sharedNew=[...next.keys()].filter(id=>old.has(id));
 return {added,removed,changed,reordered:JSON.stringify(sharedOld)!==JSON.stringify(sharedNew)};
}
export function inspectCourseText(text,validate){
 if(new TextEncoder().encode(text).byteLength>16000000)throw new Error('This course is larger than 16 MB. Reduce its images or audio and export it again.');
 let payload;try{payload=JSON.parse(text);}catch(error){const pos=Number(String(error.message).match(/position (\d+)/)?.[1]);const line=Number.isFinite(pos)?text.slice(0,pos).split('\n').length:null;throw new Error('The course file is not readable JSON'+(line?' near line '+line:'')+'. Export it again from the course builder.');}
 let pack;try{pack=validate(structuredClone(payload));}catch(error){const data=payload.data||payload,topic=data.topics?.find(t=>String(error.message).includes(t.id));throw new Error((topic?'In “'+topic.title+'”: ':'Course needs attention: ')+error.message);}
 const warnings=[];const brief=pack.topics.filter(t=>!t.scope?.trim()||t.tasks.every(task=>!task.instructions?.trim()||task.instructions==='Learn about '+t.title+'.')).length;
 if(brief)warnings.push(brief+' topic'+(brief===1?' needs':'s need')+' a fuller learning explanation. You can add it in the simple editor.');
 return {payload,pack,warnings};
}
export function snoozeReview(w,courseId,topicId,target,today=isoDate()){
 const review=w.learning?.important?.[courseId]?.[topicId];if(!review)throw new Error('Mark this topic important before scheduling a review.');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(target)||(!Number.isFinite(Date.parse(target+'T12:00:00Z'))||new Date(target+'T12:00:00Z').toISOString().slice(0,10)!==target)||target<today||target>addDays(today,3650))throw new Error('Choose a review date from today to ten years ahead.');
 review.due=target;review.snoozedAt=new Date().toISOString();return review;
}
export function noteOutline(page){
 const rows=[];let current=null;
 for(const b of page.blocks){const text=b.text.trim();if(!text||['image','audio','file','divider','page'].includes(b.type))continue;
  if(['heading','subheading','bullet','numbered','todo'].includes(b.type)){current={title:text.slice(0,160),scope:[]};rows.push(current);}
  else if(current)current.scope.push(text.replace(/\s+/g,' '));
  else{current={title:text.replace(/\s+/g,' ').slice(0,100),scope:[text.replace(/\s+/g,' ')]};rows.push(current);}
 }
 return rows.map(r=>r.title+(r.scope.length?': '+r.scope.join(' '):'')).join('\n');
}
export function cycleStart(cycle,now=Date.now()){
 const c={...cycle};if(c.phase==='idle'||c.phase==='ready'){c.phase='study';c.remainingMs=c.studyMinutes*60000;}c.endsAt=now+(c.remainingMs||c.studyMinutes*60000);return c;
}
export function cyclePause(cycle,now=Date.now()){const c=cycleTick(cycle,now);return {...c,remainingMs:c.endsAt===null?c.remainingMs:Math.max(0,c.endsAt-now),endsAt:null};}
export function cycleTick(cycle,now=Date.now()){
 if(cycle.endsAt===null||now<cycle.endsAt)return cycle;
 const c={...cycle};if(c.phase==='study'){c.rounds++;c.phase=c.rounds%c.longEvery===0?'long-break':'break';c.remainingMs=(c.phase==='long-break'?c.longBreakMinutes:c.breakMinutes)*60000;c.endsAt=now+c.remainingMs;}
 else{c.phase=c.autoContinue?'study':'ready';c.remainingMs=c.studyMinutes*60000;c.endsAt=c.autoContinue?now+c.remainingMs:null;}return c;
}
export function homeLearningSummary(records,w,date=isoDate()){
 const minutes=records.reduce((n,r)=>n+r.state.sessions.filter(s=>s.date===date).reduce((v,s)=>v+s.minutes,0),0),tasks=records.reduce((n,r)=>n+(r.state.days[date]?.tasks||[]).filter(t=>t.done).length,0),goal=w.learning?.dailyMinutes||90;
 return {date,minutes,tasks,goal,percent:Math.min(100,Math.round(minutes/goal*100)),remaining:Math.max(0,goal-minutes)};
}
export function widgetDescription(mode,summary,w){
 if(mode==='daily')return {title:'Today’s learning',text:summary.minutes+' / '+summary.goal+' minutes',percent:summary.percent,action:'Open plan',route:'day'};
 if(mode==='notes'){const pages=(w.learning?.pages||[]).filter(p=>!p.trashed).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));return {title:'Quick notes',text:pages[0]?.title||'Capture your next idea',percent:0,action:'New note',route:'notebook',quickNote:true};}
 return {title:'Next task',text:w.companionData?.courses?.find(c=>c.id===w.settings.activeCourseId)?.nextTask||w.companionData?.courses?.find(c=>c.id===w.settings.activeCourseId)?.nextTopic||'Add a course when you are ready',percent:w.companionData?.courses?.find(c=>c.id===w.settings.activeCourseId)?.percent||0,action:'Continue',route:'work'};
}
export function newLessonMedia(kind,name,dataURL){const item={id:uid('media'),kind,name,dataURL};validateLessonMedia([item]);return item;}

export function studyLessonMedia(data,state,topicId,taskId){const topic=[...data.topics,...state.custom.topics].find(t=>t.id===topicId);return topic&&topicTasks(topic).some(task=>task.id===taskId)?topic.lessonMedia||[]:[];}
