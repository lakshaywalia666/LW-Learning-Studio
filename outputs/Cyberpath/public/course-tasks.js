// LW course task definitions contain content only. Learner progress lives in state.taskProgress.
export const TASK_KINDS=['Study','Lab','Build','Review','Assessment','Research','Report','Teaching'];
const ID=/^[A-Za-z0-9_-]{1,100}$/;
const reserved=new Set(['__proto__','prototype','constructor']);
export const taskKey=(topicId,taskId)=>topicId+'::'+taskId;
const uid=()=>`ct-${globalThis.crypto?.randomUUID?.().replaceAll('-','').slice(0,18)||Date.now().toString(36)+Math.random().toString(36).slice(2,9)}`;
const dateNow=()=>{const d=new Date();return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
export function legacyTasks(topic){return[
 {id:'study',title:'Understand '+topic.title,kind:'Study',minutes:25,instructions:topic.scope||'Read and explain the key concepts.',checklist:[],resources:[...(topic.resources||[])],tools:[],projectId:'',required:true},
 {id:'practice',title:'Practice '+topic.title,kind:'Lab',minutes:45,instructions:topic.practice||'Attempt a practical exercise and check the result.',checklist:[],resources:[...(topic.resources||[])],tools:[...(topic.tools||[])],projectId:topic.projects?.[0]||'',required:true},
 {id:'evidence',title:'Explain and record your result',kind:'Review',minutes:15,instructions:topic.evidenceRequired||'Keep your result and explain what you learned.',checklist:[],resources:[],tools:[],projectId:'',required:true}
];}
export function topicTasks(topic){return Array.isArray(topic.tasks)&&topic.tasks.length?topic.tasks:legacyTasks(topic);}
export function validateTopicTasks(topic,path='topic.tasks',{strict=false}={}){
 if(!Array.isArray(topic.tasks)||!topic.tasks.length){if(strict)throw new Error(path+': add at least one task.');topic.tasks=legacyTasks(topic);}
 if(topic.tasks.length>200)throw new Error(path+': use at most 200 tasks per topic.');
 const ids=new Set();const text=(v,max,label,required=false)=>{if(typeof v!=='string'||v.length>max||(required&&!v.trim()))throw new Error(label+': expected '+(required?'nonempty ':'')+'text up to '+max+' characters.');return v;};
 topic.tasks=topic.tasks.map((source,i)=>{
  const at=path+'['+i+']';if(!source||typeof source!=='object'||Array.isArray(source))throw new Error(at+': expected a task object.');
  if(strict&&typeof source.instructions!=='string')throw new Error(at+'.instructions: expected task instructions.');
  const allowed=['id','title','kind','minutes','instructions','checklist','resources','tools','projectId','required','variants'];for(const key of Object.keys(source))if(!allowed.includes(key))throw new Error(at+'.'+key+': unsupported task field.');
  if(!ID.test(source.id)||reserved.has(source.id)||ids.has(source.id))throw new Error(at+'.id: use a unique ID containing letters, numbers, _ or -.');ids.add(source.id);
  if(!TASK_KINDS.includes(source.kind)||!Number.isInteger(source.minutes)||source.minutes<1||source.minutes>1440)throw new Error(at+': choose a supported activity and 1–1440 estimated minutes.');
  if(source.required!==undefined&&typeof source.required!=='boolean')throw new Error(at+'.required: expected true or false.');
  if(!Array.isArray(source.checklist)||source.checklist.length>100)throw new Error(at+'.checklist: expected up to 100 checkbox items (use [] if none).');
  const checks=new Set(),checklist=source.checklist.map((item,n)=>{const where=at+'.checklist['+n+']';if(!item||typeof item!=='object'||Array.isArray(item)||!ID.test(item.id)||reserved.has(item.id)||checks.has(item.id))throw new Error(where+'.id: expected a unique checkbox ID.');for(const k of Object.keys(item))if(!['id','title','required'].includes(k))throw new Error(where+'.'+k+': unsupported checkbox field.');if(item.required!==undefined&&typeof item.required!=='boolean')throw new Error(where+'.required: expected true or false.');checks.add(item.id);return{id:item.id,title:text(item.title,500,where+'.title',true),required:item.required!==false};});
  const links=key=>{const value=source[key]??[];if(!Array.isArray(value)||value.length>100||value.some(id=>!ID.test(id)||reserved.has(id)))throw new Error(at+'.'+key+': expected a list of reference IDs.');return[...new Set(value)];};
  const projectId=source.projectId??'';if(typeof projectId!=='string'||projectId&&(!ID.test(projectId)||reserved.has(projectId)))throw new Error(at+'.projectId: expected a project ID.');
  let variants;if(source.variants!==undefined){if(!source.variants||typeof source.variants!=='object'||Array.isArray(source.variants)||Object.keys(source.variants).some(k=>!['beginner','advanced','example','hint'].includes(k)))throw new Error(at+'.variants: use beginner, advanced, example or hint text.');variants=Object.fromEntries(Object.entries(source.variants).map(([k,v])=>[k,text(v,20000,at+'.variants.'+k)]));}
  return{id:source.id,title:text(source.title,240,at+'.title',true),kind:source.kind,minutes:source.minutes,instructions:text(source.instructions??'',20000,at+'.instructions'),checklist,resources:links('resources'),tools:links('tools'),projectId,required:source.required!==false,...(variants?{variants}:{})};
 });
 if(!topic.tasks.some(t=>t.required))throw new Error(path+': each topic needs at least one required task.');return topic.tasks;
}
export function taskState(state,topicId,task){const saved=state.taskProgress?.[taskKey(topicId,task.id)];return{done:false,checks:{},completedAt:'',completedDate:'',dayTaskId:'',...saved,checks:{...saved?.checks}};}
export function checklistReady(state,topicId,task){const p=taskState(state,topicId,task);return task.checklist.filter(c=>c.required!==false).every(c=>p.checks[c.id]===true);}
function verified(topic,state){const p={...topic.initial,...state.progress[topic.id]};return p.status==='Complete'&&Number(p.proficiency)>=3&&Boolean(p.evidence?.trim())&&Boolean(p.demonstratedDate);}
export function courseTaskQueue(data,state,{optional=false}={}){
 const topics=[...data.topics,...state.custom.topics].filter(t=>{const p={included:t.route==='Core',...t.initial,...state.progress[t.id]};return p.included&&p.status!=='Parked';}),entries=[];
 for(const topic of topics)for(const task of topicTasks(topic))if(optional||task.required!==false)entries.push({topic,task,done:taskState(state,topic.id,task).done||verified(topic,state)});
 return entries;
}
export function materializeTask(topic,task,minutes=task.minutes){return{id:uid(),kind:task.kind,title:task.title,detail:task.instructions,minutes,estimatedMinutes:task.minutes,topicId:topic.id,projectId:task.projectId||'',done:false,manual:false,curriculumKey:taskKey(topic.id,task.id),courseTaskId:task.id,checklist:structuredClone(task.checklist),resources:[...(task.resources||[])],tools:[...(task.tools||[])],createdAt:new Date().toISOString()};}
export function setCourseTaskDone(state,date,row,done){
 state.taskProgress||={};const key=row.curriculumKey,definition={id:row.courseTaskId,checklist:row.checklist||[]},before=taskState(state,row.topicId,definition);
 if(done&&!checklistReady(state,row.topicId,definition))throw new Error('Complete the required checkbox items before finishing this task.');
 const timestamp=done?new Date().toISOString():'';
 for(const[d,day]of Object.entries(state.days))for(const other of day.tasks)if(other.curriculumKey===key){other.done=Boolean(done&&d===date&&other.id===row.id);other.completedAt=other.done?timestamp:'';other.resolvedDate=done?date:'';}
 state.taskProgress[key]={...before,done:Boolean(done),completedAt:timestamp,completedDate:done?date:'',dayTaskId:done?row.id:''};return before;
}
export function setChecklistItem(state,topicId,task,itemId,checked){
 const item=task.checklist.find(c=>c.id===itemId);if(!item)throw new Error('Checkbox item not found.');state.taskProgress||={};const p=taskState(state,topicId,task);p.checks[itemId]=Boolean(checked);state.taskProgress[taskKey(topicId,task.id)]=p;
 if(!checked&&item.required!==false&&p.done){const row=state.days[p.completedDate]?.tasks.find(t=>t.id===p.dayTaskId);if(row)setCourseTaskDone(state,p.completedDate,row,false);else state.taskProgress[taskKey(topicId,task.id)]={...p,done:false,completedAt:'',completedDate:'',dayTaskId:''};}
}
export function ensureCourseTask(state,topic,task,date=dateNow(),{manual=true}={}){
 state.days[date]||={date,tasks:[],reflection:'',nextAction:''};const key=taskKey(topic.id,task.id),existing=state.days[date].tasks.find(t=>t.curriculumKey===key);
 if(existing)return existing;if(state.days[date].tasks.length>=500)throw new Error('This day already has 500 tasks. Choose another day.');const row=materializeTask(topic,task);row.manual=manual;state.days[date].tasks.push(row);return row;
}
export function migrateTaskProgress(data,state){
 state.taskProgress||={};const topics=new Map([...data.topics,...state.custom.topics].map(t=>[t.id,t]));
 for(const[date,day]of Object.entries(state.days).sort(([a],[b])=>a.localeCompare(b)))for(const row of day.tasks){
  const topic=topics.get(row.topicId);if(!topic)continue;
  // Old Work represented a study pass, so only its study task is migrated.
  if(!row.curriculumKey&&row.studioWork){const task=topicTasks(topic).find(t=>t.id==='study');if(task){row.curriculumKey=taskKey(topic.id,task.id);row.courseTaskId=task.id;row.checklist=structuredClone(task.checklist);}}
  if(row.curriculumKey&&row.done&&!state.taskProgress[row.curriculumKey])state.taskProgress[row.curriculumKey]={done:true,checks:Object.fromEntries((row.checklist||[]).map(c=>[c.id,true])),completedDate:date,completedAt:row.completedAt||date+'T12:00:00',dayTaskId:row.id};
 }
 return state;
}
