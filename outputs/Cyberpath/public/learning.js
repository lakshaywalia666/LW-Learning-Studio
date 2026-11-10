import {indexedSearch,invalidateSearchIndex} from './search-index.js?v=studio47';
import {validateVoiceTools} from './voice-tools.js?v=studio47';
import {validateDocuments,documentSearchRows} from './document-tools.js?v=studio47';
import {mediaSearchRows} from './media-tools.js?v=studio47';
import {validateMediaTools} from './media-tools.js?v=studio47';
import {validateDataSafety} from './data-safety.js?v=studio47';
import {validateAuthorTools} from './author-tools.js?v=studio47';
import {validateStudyLearning,ensureStudyLearning} from './study-features.js?v=studio47';
import {validatePersonalWorlds} from './personal-worlds.js?v=studio47';
import {validateNoteTools,validateSpecialBlocks} from './note-tools.js?v=studio47';
import {validatePersonalize} from './personalize.js?v=studio47';
import {validateFocus} from './focus-tools.js?v=studio47';
import {validateAssessments} from './assessments.js?v=studio47';
import {validatePlanning} from './planning.js?v=studio47';
import {validatePractice} from './practice-tools.js?v=studio47';
import {validateCapture} from './capture.js?v=studio47';
import {validateDesign} from './design.js?v=studio47';
import {validateOrganizer} from './reminders.js?v=studio47';
import {profileKey} from './profiles.js?v=studio47';
import {validateUpgrades} from './upgrades.js?v=studio47';
import {validateSetup} from './onboarding.js?v=studio47';
import {validateScenePreferences} from './learning-scenes.js?v=studio47';
import {validateForestEnvironment} from './forest-environment.js?v=studio47';
import {isoDate,addDays,uid,allTopics,topicProgress,isVerified,defaultState} from './model.js?v=studio47';
import {topicTasks,taskState} from './course-tasks.js?v=studio47';
import {treeGrowth} from './studio.js?v=studio47';
import {courseSummary} from './companion.js?v=studio47';
export function validateExercises(exercises,topicIds){if(exercises===undefined)return[];if(!Array.isArray(exercises)||exercises.length>10000)throw new Error('Invalid exercise collection.');const ids=new Set();for(const x of exercises){if(!/^[A-Za-z0-9_-]{1,100}$/.test(x.id)||ids.has(x.id)||!['quiz','scenario','rubric','speaking'].includes(x.type)||typeof x.title!=='string'||!x.title.trim()||typeof x.prompt!=='string'||x.topicId&&!topicIds.has(x.topicId))throw new Error('Invalid exercise definition.');ids.add(x.id);if(x.type==='quiz'&&(!Array.isArray(x.options)||x.options.length<2||x.options.length>20||x.options.some(o=>typeof o!=='string')||!Number.isInteger(x.correct)||x.correct<0||x.correct>=x.options.length))throw new Error('A quiz needs choices and a valid answer.');}return exercises;}
export const blockTypes=['paragraph','heading','subheading','bullet','numbered','todo','quote','code','toggle','divider','image','file','audio','page','table','equation','drawing'];
export function ensureLearning(w){
 const old=w.learning||{};w.learning={version:1,dailyMinutes:90,holiday:{from:'',to:''},catchUp:false,resume:{},important:{},pages:[],assets:[],library:[],exercises:[],attempts:[],links:[],builderDraft:null,...old};ensureStudyLearning(w);return w.learning;
}
export function recoverNotebookDrafts(w,storage=globalThis.localStorage){
 const l=ensureLearning(w);let recovered=0;
 for(const saved of l.pages){try{
  const draft=JSON.parse(storage?.getItem(profileKey('lw-note-draft-'+saved.id))||'null');
  if(!draft||draft.id!==saved.id||typeof draft.updatedAt!=='string'||!Number.isFinite(Date.parse(draft.updatedAt))||draft.updatedAt<=saved.updatedAt||draft.updatedAt<=(l.noteRestoreAt||''))continue;
  validateLearning({learning:{...l,pages:l.pages.map(p=>p.id===saved.id?draft:p)}});
  Object.assign(saved,draft);recovered++;
 }catch{}}
 return recovered;
}
export function markNotebookRestored(w,at=new Date().toISOString()){ensureLearning(w).noteRestoreAt=at;}
export function validateLearning(w){
 validateDesign(w);validateOrganizer(w);validateCapture(w);validatePractice(w);validatePlanning(w);validateAssessments(w);validateFocus(w);validatePersonalize(w);validateNoteTools(w);validatePersonalWorlds(w);validateAuthorTools(w);validateDataSafety(w);validateMediaTools(w);validateDocuments(w);validateVoiceTools(w);
 const l=ensureLearning(w);if(l.interfaceLanguage!==undefined&&!['en','hi'].includes(l.interfaceLanguage))throw new Error('Choose a supported app language.');validateUpgrades(w);validateStudyLearning(w);validateSetup(l.setup);validateScenePreferences(l);if(l.forestEnvironment)validateForestEnvironment(l.forestEnvironment);if(l.version!==1||!Number.isFinite(l.dailyMinutes)||l.dailyMinutes<5||l.dailyMinutes>1440)throw new Error('Invalid learning preferences.');
 for(const name of ['pages','assets','library','exercises','attempts','links'])if(!Array.isArray(l[name])||l[name].length>50000)throw new Error('Invalid '+name+' collection.');
 if(!l.important||typeof l.important!=='object'||!l.resume||typeof l.resume!=='object'||!l.holiday||typeof l.holiday!=='object')throw new Error('Invalid learning settings.');const pages=new Set();for(const p of l.pages){if(!/^[a-zA-Z0-9_-]{1,100}$/.test(p.id)||pages.has(p.id)||typeof p.title!=='string'||!Array.isArray(p.blocks)||p.blocks.length>10000)throw new Error('Invalid notebook page.');pages.add(p.id);for(const b of p.blocks)if(!blockTypes.includes(b.type)||typeof b.text!=='string'||b.text.length>100000)throw new Error('Invalid notebook block.');validateSpecialBlocks(p);}
 for(const p of l.pages){let id=p.parentId,visited=new Set([p.id]);while(id){if(visited.has(id)||!pages.has(id))throw new Error('Notebook pages must have valid, non-cyclic parents.');visited.add(id);id=l.pages.find(p=>p.id===id)?.parentId;}}
 for(const a of l.assets)if(!/^[a-zA-Z0-9_-]{1,100}$/.test(a.id)||typeof a.name!=='string'||typeof a.type!=='string'||!Number.isFinite(a.bytes)||a.bytes<0)throw new Error('Invalid attachment.');
 for(const value of Object.values(l.important)){if(!value||typeof value!=='object')throw new Error('Invalid important topics.');for(const r of Object.values(value)){r.results||=[];if(!Array.isArray(r.results)||r.results.some(x=>!['again','hard','good','easy'].includes(x.result)||typeof x.date!=='string'))throw new Error('Invalid review history.');if(!Number.isFinite(r.interval)||r.interval<1||r.interval>3650||!/^\d{4}-\d{2}-\d{2}$/.test(r.due))throw new Error('Invalid important-topic review schedule.');}}
 return l;
}
export function topicDone(topic,state){return isVerified(topic,state)||topicTasks(topic).filter(t=>t.required!==false).every(t=>taskState(state,topic.id,t).done);}
export function markImportant(w,courseId,topicId,enabled=true,date=isoDate()){
 const l=ensureLearning(w);l.important[courseId]||={};if(!enabled){delete l.important[courseId][topicId];return;}l.important[courseId][topicId]||={interval:7,due:addDays(date,7),lastReviewed:'',results:[]};
}
export function reviewTopic(w,courseId,topicId,result,date=isoDate()){
 if(!['again','hard','good','easy'].includes(result))throw new Error('Choose a review result.');markImportant(w,courseId,topicId,true,date);const r=w.learning.important[courseId][topicId];r.interval=result==='again'?1:result==='hard'?Math.max(1,Math.round(r.interval*.7)):Math.min(365,result==='easy'?r.interval*3:r.interval*2);r.lastReviewed=date;r.due=addDays(date,r.interval);r.results.push({date,result});return r;
}
export function onHoliday(w,date=isoDate()){const h=ensureLearning(w).holiday;return Boolean(h.from&&h.to&&h.from<=date&&date<=h.to);}
export function reviewQueue(records,w,date=isoDate()){
 const l=ensureLearning(w);return records.flatMap(({data,state})=>allTopics(data,state).map(topic=>({courseId:data.meta.course.id,courseTitle:data.meta.course.title,topic,review:l.important[data.meta.course.id]?.[topic.id]})).filter(row=>row.review&&row.review.due<=date)).sort((a,b)=>a.review.due.localeCompare(b.review.due));
}
export function prerequisiteIds(topic,data,state){const all=allTopics(data,state),known=new Set(all.map(t=>t.id));return(topic.requires??(String(topic.prerequisites||'').match(/[A-Za-z0-9_-]+/g)||[]).filter(id=>known.has(id)));}
export function readiness(topic,data,state){return prerequisiteIds(topic,data,state).map(id=>allTopics(data,state).find(t=>t.id===id)).filter(Boolean).filter(parent=>!topicDone(parent,state));}
export function dailyOverview(records,w,date=isoDate()){
 const l=ensureLearning(w),done=records.reduce((n,r)=>n+(r.state.days[date]?.tasks||[]).filter(t=>t.done).length,0),minutes=records.reduce((n,r)=>n+r.state.sessions.filter(s=>s.date===date).reduce((sum,s)=>sum+s.minutes,0),0),due=reviewQueue(records,w,date),rows=[],budget=l.dailyMinutes;
 if(!onHoliday(w,date)){for(const row of due.slice(0,l.catchUp?4:2)){const available=budget-rows.reduce((n,r)=>n+r.minutes,0);if(available<=0)break;rows.push({...row,kind:'Review',minutes:Math.min(10,available),reason:'Important topic due '+row.review.due});}
 const choices=records.map(r=>({...r,topics:allTopics(r.data,r.state).filter(t=>{const p=topicProgress(t,r.state);return p.included&&p.status!=='Parked'&&!topicDone(t,r.state);})}));let used=rows.reduce((n,t)=>n+t.minutes,0),round=0;
 while(used<budget&&round<100){let added=false;for(const record of choices){const candidate=record.topics.find(t=>!rows.some(row=>row.courseId===record.data.meta.course.id&&row.topic.id===t.id&&row.kind==='Study')&&!readiness(t,record.data,record.state).length)||record.topics.find(t=>!rows.some(row=>row.courseId===record.data.meta.course.id&&row.topic.id===t.id&&row.kind==='Study'));if(!candidate)continue;const missing=readiness(candidate,record.data,record.state);const estimate=topicTasks(candidate).filter(t=>t.required!==false&&!taskState(record.state,candidate.id,t).done).reduce((n,t)=>n+t.minutes,0),chunk=Math.min(Math.max(1,estimate),budget-used,l.catchUp?20:30);if(used>=budget)break;rows.push({courseId:record.data.meta.course.id,courseTitle:record.data.meta.course.title,topic:candidate,kind:'Study',minutes:chunk,reason:missing.length?'Suggested next; '+missing.length+' prerequisite(s) to revisit':'Next unfinished topic with its foundations ready'});used+=chunk;added=true;}if(!added)break;round++;}}
 return{date,budget,minutes,done,due:due.length,holiday:onHoliday(w,date),rows,remaining:Math.max(0,budget-minutes),extra:Math.max(0,minutes-budget)};
}
export function newPage(w,{title='Untitled',parentId='',courseId='',topicId='',projectId=''}={}){const page={id:uid('page'),title,icon:'📝',parentId,courseId,topicId,projectId,tags:'',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),trashed:false,blocks:[{id:uid('block'),type:'paragraph',text:'',checked:false}]};ensureLearning(w).pages.push(page);return page;}
export function pageMarkdown(page){return '# '+page.title+'\n\n'+page.blocks.map(b=>b.type==='heading'?'# '+b.text:b.type==='subheading'?'## '+b.text:b.type==='bullet'?'- '+b.text:b.type==='numbered'?'1. '+b.text:b.type==='todo'?'- ['+(b.checked?'x':' ')+'] '+b.text:b.type==='code'?'```\n'+b.text+'\n```':b.type==='quote'?'> '+b.text:b.type==='divider'?'---':b.type==='image'||b.type==='file'||b.type==='audio'?'['+b.text+'](attachment:'+b.assetId+')':b.text).join('\n\n');}
export function markdownBlocks(text){let code=false,buffer=[],out=[];const push=(type,text,checked=false)=>out.push({id:uid('block'),type,text,checked});for(const line of text.replaceAll('\r','').split('\n')){if(line.startsWith('```')){if(code){push('code',buffer.join('\n'));buffer=[];}code=!code;continue;}if(code){buffer.push(line);continue;}if(/^#{1,6} /.test(line))push(line.startsWith('# ')?'heading':'subheading',line.replace(/^#+ /,''));else if(/^[-*] \[[ xX]\] /.test(line))push('todo',line.slice(6),/[xX]/.test(line.slice(0,5)));else if(/^[-*] /.test(line))push('bullet',line.slice(2));else if(/^\d+\. /.test(line))push('numbered',line.replace(/^\d+\. /,''));else if(/^> /.test(line))push('quote',line.slice(2));else if(/^---+$/.test(line))push('divider','');else if(line.trim())push('paragraph',line);}if(code)push('code',buffer.join('\n'));return out.length?out:[{id:uid('block'),type:'paragraph',text:'',checked:false}];}
export function collectSearchRows(records,w){const rows=[];const add=(kind,title,text,courseId,id,topicId='')=>rows.push({kind,title,text:String(text??''),courseId,id,topicId});for(const{data,state}of records){const id=data.meta.course.id;for(const t of allTopics(data,state)){add('topic',t.title,t.scope+' '+t.practice+' '+t.id,id,t.id,t.id);for(const task of topicTasks(t)){add('task',task.title,task.instructions,id,task.id,t.id);const note=w.learning?.taskNotes?.[id]?.[t.id+'::'+task.id];if(note)add('task',task.title+' · My note',note.text,id,task.id,t.id);}}for(const n of state.notes)add('research',n.question,n.notes+' '+n.observed,id,n.id,n.topicId);for(const p of data.projects)add('project',p.title,p.task,id,p.id);for(const r of data.resources)add('resource',r.title,r.use,id,r.id);}
 for(const p of ensureLearning(w).pages.filter(p=>!p.trashed))add('page',p.title,pageMarkdown(p),p.courseId,p.id,p.topicId);for(const r of w.learning.library)add('reading',r.title,r.markdown||r.annotations?.map(a=>a.text).join(' ')||'',r.courseId,r.id,r.topicId);for(const r of w.learning.organizer?.items||[])if(r.status!=='archived')add('reminder',r.title,r.note+' '+(r.list||'')+' '+r.date+' '+r.status,'',r.id);for(const r of w.learning.capture?.items||[])if(r.status==='inbox')add('capture','Inbox thought',r.text,'',r.id);for(const row of [...mediaSearchRows(w),...documentSearchRows(w)])add(row.kind,row.title,row.text,row.courseId,row.id,row.topicId);return rows;}
export function searchLibrary(records,w,query,options={}){return indexedSearch(w,()=>collectSearchRows(records,w),query,options);}
export function globalSearch(records,w,query){invalidateSearchIndex(w);return searchLibrary(records,w,query).rows;}
export function captureProgress(w){const out={};for(const[id,s]of Object.entries(w.courses)){out[id]={taskProgress:structuredClone(s.taskProgress||{}),progress:structuredClone(s.progress||{}),projects:structuredClone(s.projects||{}),sessions:structuredClone(s.sessions||[]),days:Object.fromEntries(Object.entries(s.days).map(([date,day])=>[date,day.tasks.filter(t=>!t.curriculumKey&&(t.done||t.completedAt)).map(t=>({id:t.id,title:t.title,topicId:t.topicId,curriculumKey:t.curriculumKey,done:t.done,completedAt:t.completedAt,resolvedDate:t.resolvedDate}))]))};}return out;}
export function progressChanges(before,after){const changes=[];for(const courseId of new Set([...Object.keys(before),...Object.keys(after)])){const a=before[courseId]||{},b=after[courseId]||{};for(const field of ['taskProgress','progress','projects','days']){for(const key of new Set([...Object.keys(a[field]||{}),...Object.keys(b[field]||{})])){const old=a[field]?.[key],value=b[field]?.[key];if(JSON.stringify(old)!==JSON.stringify(value))changes.push({courseId,field,key,before:old??null,after:value??null});}}if(JSON.stringify(a.sessions||[])!==JSON.stringify(b.sessions||[]))changes.push({courseId,field:'sessions',key:'',before:a.sessions||[],after:b.sessions||[]});}return changes;}
export function historyEntry(w,before,records,label='Progress updated'){
 const after=captureProgress(w),changes=progressChanges(before,after);if(!changes.length)return null;const done=changes.filter(c=>c.field==='taskProgress'&&!c.before?.done&&c.after?.done),undone=changes.filter(c=>c.field==='taskProgress'&&c.before?.done&&!c.after?.done);if(done.length)label=done.length+' task'+(done.length===1?'':'s')+' completed';else if(undone.length)label=undone.length+' task'+(undone.length===1?'':'s')+' reopened';
 return{id:uid('event'),at:new Date().toISOString(),label,changes,growth:records.map(({data,state})=>({id:data.meta.course.id,...treeGrowth(data,state),...(()=>{const s=courseSummary(data,state);return{title:s.title,completedTopics:s.completedTopics,totalTopics:s.totalTopics,completedTasks:s.completedTasks,totalTasks:s.totalTasks,completedStages:s.completedStages};})(),minutes:state.sessions.reduce((n,s)=>n+s.minutes,0)}))};
}
export function undoHistory(w,event){for(const c of event.changes){const s=w.courses[c.courseId];if(!s)throw new Error('This course is no longer available.');const current=c.field==='sessions'?s.sessions:c.field==='days'?(s.days[c.key]?.tasks||[]).filter(t=>!t.curriculumKey&&(t.done||t.completedAt)).map(t=>({id:t.id,title:t.title,topicId:t.topicId,curriculumKey:t.curriculumKey,done:t.done,completedAt:t.completedAt,resolvedDate:t.resolvedDate})):s[c.field]?.[c.key];if(JSON.stringify(current??null)!==JSON.stringify(c.after))throw new Error('Later changes affect this record. Undo the newer action first.');}
 for(const c of [...event.changes].reverse()){const s=w.courses[c.courseId];if(c.field==='sessions')s.sessions=structuredClone(c.before);else if(c.field==='days'){const old=new Map((c.before||[]).map(t=>[t.id,t]));for(const row of s.days[c.key]?.tasks||[]){if(row.curriculumKey)continue;const prior=old.get(row.id);row.done=Boolean(prior?.done);row.completedAt=prior?.completedAt||'';row.resolvedDate=prior?.resolvedDate||'';}}else if(c.before===null)delete s[c.field][c.key];else s[c.field][c.key]=structuredClone(c.before);if(c.field==='taskProgress'){const prior=s.taskProgress[c.key];for(const[date,day]of Object.entries(s.days))for(const row of day.tasks)if(row.curriculumKey===c.key){row.done=Boolean(prior?.done&&prior.completedDate===date&&prior.dayTaskId===row.id);row.completedAt=row.done?prior.completedAt||'':'';row.resolvedDate=prior?.done?prior.completedDate:'';}}}
}
export function checklistFromText(text,previous=[]){
 const used=new Set();return text.split('\n').filter(line=>line.trim()).map(line=>{const title=line.replace(/^\?\s*/,'').trim(),match=previous.find(item=>item.title.trim()===title&&!used.has(item.id));if(match)used.add(match.id);return{id:match?.id||uid('check'),title,required:!line.startsWith('?')};});
}
export function updateDiff(oldData,incoming){const old=new Map(oldData.topics.map(t=>[t.id,t])),next=new Map(incoming.topics.map(t=>[t.id,t]));return{added:[...next].filter(([id])=>!old.has(id)).map(([,t])=>t),changed:[...next].filter(([id,t])=>old.has(id)&&JSON.stringify(t)!==JSON.stringify(old.get(id))).map(([,t])=>t),retired:[...old].filter(([id])=>!next.has(id)).map(([,t])=>t)};}
export function applyCourseUpdate(w,catalog,incoming){
 const id=incoming.meta.course.id,source=[...catalog,...w.customCourses].find(d=>d.meta.course.id===id);if(!source)throw new Error('Import the course before updating it.');const diff=updateDiff(source,incoming),state=w.courses[id],merged=structuredClone(incoming),stageIds=new Set(merged.stages.map(s=>s.id));
 // Keep retired content available so its personal records and links remain valid.
 for(const stage of source.stages)if(!stageIds.has(stage.id))merged.stages.push({...stage,retired:true});for(const topic of diff.retired)merged.topics.push({...structuredClone(topic),retired:true});
 for(const collection of ['resources','projects','tools','labs']){const ids=new Set(merged[collection].map(r=>r.id));for(const row of source[collection])if(!ids.has(row.id))merged[collection].push(structuredClone(row));}
 for(const topic of merged.topics){
  const previous=source.topics.find(t=>t.id===topic.id)||state.custom.topics.find(t=>t.id===topic.id);if(!previous)continue;
  const ids=new Set(topic.tasks.map(t=>t.id));for(const task of topicTasks(previous))if(!ids.has(task.id))topic.tasks.push({...structuredClone(task),required:false});
  for(const task of [...topic.tasks]){
   const old=topicTasks(previous).find(t=>t.id===task.id),key=topic.id+'::'+task.id,saved=state.taskProgress[key];if(!old||!saved)continue;
   const known=new Set(task.checklist.map(c=>c.id)),removed=Object.keys(saved.checks).filter(id=>!known.has(id)),needsRefresh=saved.done&&task.checklist.some(c=>c.required!==false&&!saved.checks[c.id]);
   if(needsRefresh||removed.some(id=>saved.checks[id])){
    const archived={...structuredClone(old),id:old.id.slice(0,65)+'-'+uid('archive'),title:'Previous version · '+old.title,required:false};topic.tasks.push(archived);const archiveKey=topic.id+'::'+archived.id;state.taskProgress[archiveKey]=structuredClone(saved);
    if(saved.done)for(const day of Object.values(state.days))for(const row of day.tasks)if(row.curriculumKey===key){row.curriculumKey=archiveKey;row.courseTaskId=archived.id;}
    state.taskProgress[key]={...saved,done:false,completedAt:'',completedDate:'',dayTaskId:''};
   }
   state.taskProgress[key].checks=Object.fromEntries(Object.entries(saved.checks).filter(([id])=>known.has(id)));
   for(const day of Object.values(state.days))for(const row of day.tasks)if(row.curriculumKey===key&&!row.done){row.checklist=structuredClone(task.checklist);row.title=task.title;row.detail=task.instructions;row.estimatedMinutes=task.minutes;}
  }
 }

 for(const name of ['topics','projects','resources','tools','labs']){const ids=new Set(merged[name].map(row=>row.id));state.custom[name]=state.custom[name].filter(row=>!ids.has(row.id));}if(state.custom.stages){const ids=new Set(merged.stages.map(row=>row.id));state.custom.stages=state.custom.stages.filter(row=>!ids.has(row.id));}
 const index=w.customCourses.findIndex(d=>d.meta.course.id===id);if(index>=0)w.customCourses[index]=merged;else{const n=catalog.findIndex(d=>d.meta.course.id===id);catalog[n]=merged;ensureLearning(w).courseOverrides||={};w.learning.courseOverrides[id]=merged;}
 for(const topic of diff.retired)state.progress[topic.id]={...topicProgress(topic,state),included:false};return diff;
}
export function forestAt(records,date){return records.map(r=>{const state=structuredClone(r.state);state.sessions=state.sessions.filter(s=>s.date<=date);for(const[key,day]of Object.entries(state.days))if(key>date)for(const t of day.tasks)t.done=false;for(const p of Object.values(state.taskProgress||{}))if(p.completedDate>date){p.done=false;p.completedDate='';p.completedAt='';}for(const p of Object.values(state.progress))if(p.demonstratedDate>date)p.status='Learning';return{...r,state};});}
export function crossConnections(records,w,courseId,topicId){const current=records.find(r=>r.data.meta.course.id===courseId),topic=current&&allTopics(current.data,current.state).find(t=>t.id===topicId);if(!topic)return[];const stop=new Set(['and','the','for','with','basics','fundamentals','introduction','security','learning','your','from','into']),words=topic.title.toLowerCase().match(/[a-z0-9]+/g)?.filter(t=>t.length>2&&!stop.has(t))||[];const explicit=ensureLearning(w).links.filter(l=>l.fromCourse===courseId&&l.fromTopic===topicId||l.toCourse===courseId&&l.toTopic===topicId);const rows=[];for(const record of records)if(record.data.meta.course.id!==courseId)for(const t of allTopics(record.data,record.state)){const manual=explicit.some(l=>(l.fromCourse===record.data.meta.course.id&&l.fromTopic===t.id)||(l.toCourse===record.data.meta.course.id&&l.toTopic===t.id)),score=words.filter(word=>t.title.toLowerCase().includes(word)).length;if(manual||score)rows.push({courseId:record.data.meta.course.id,courseTitle:record.data.meta.course.title,topic:t,score:manual?100:score,manual});}return rows.sort((a,b)=>b.score-a.score).slice(0,8);}
