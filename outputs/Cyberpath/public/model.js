import {validateStudyState} from './study-features.js?v=studio47';
import {learningStreak,activityDates} from './streaks.js?v=studio47';
import{courseTaskQueue,materializeTask,setCourseTaskDone,validateTopicTasks,migrateTaskProgress,topicTasks,taskKey}from'./course-tasks.js?v=studio47';
export const VERSION=1;
export const TOPIC_STATUSES=['Not started','Learning','Practicing','Review','Complete','Parked'];
export const PROJECT_STATUSES=['Not started','In progress','Blocked','Complete','Parked'];
export const ACTIVITIES=['Study','Lab','Build','Review','Assessment','Research','Report','Teaching'];
export const RUBRIC=['New','Can explain','Guided practice','Independent','Can fix and validate','Can review and teach'];
export const isoDate=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export function addDays(value,n){const date=new Date(value+'T12:00:00');date.setDate(date.getDate()+n);return isoDate(date);}
export function dateDiff(a,b){return Math.round((Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/86400000);}
export function weekStart(value=isoDate()){const date=new Date(value+'T12:00:00');return addDays(value,-((date.getDay()+6)%7));}
export const uid=(prefix='item')=>`${prefix}-${globalThis.crypto?.randomUUID?.().replaceAll('-','').slice(0,14)||Date.now().toString(36)+Math.random().toString(36).slice(2,7)}`;
export const allTopics=(data,state)=>[...data.topics,...state.custom.topics];
export const allProjects=(data,state)=>[...data.projects,...state.custom.projects];
export const allResources=(data,state)=>[...data.resources,...state.custom.resources].map(r=>({...r,...state.resourceEdits[r.id]}));
export const allTools=(data,state)=>[...data.tools,...state.custom.tools];
export const allLabs=(data,state)=>[...data.labs,...state.custom.labs];
export function defaultState(data){return{version:VERSION,revision:0,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),settings:{name:'',dailyMinutes:90,weeklyHours:12,journeyStart:'2026-11-02',targetFinishDate:'',theme:'light',paletteId:'pearl',soundId:'chime',performance:'auto',motion:'system',sound:true,haptics:true,volume:0.16,focusTopicId:'',careerId:'general',studyDays:[1,2,3,4,5,6]},progress:{},taskProgress:{},projects:{},tools:{},labs:{},resourceEdits:{},favourites:[],stageReviews:{},weekly:{},days:{},sessions:structuredClone(data.initialSessions||[]),notes:structuredClone(data.initialNotes||[]),events:[],timer:null,custom:{topics:[],projects:[],resources:[],tools:[],labs:[]}};}
export function topicProgress(topic,state){return{included:topic.route==='Core',status:'Not started',proficiency:0,targetDate:'',demonstratedDate:'',reviewDays:30,evidence:'',notes:'',...topic.initial,...state.progress[topic.id]};}
export function projectProgress(project,state){return{status:'Not started',targetDate:'',evidence:'',reviewedDate:'',notes:'',...project.initial,...state.projects[project.id]};}
export function toolProgress(tool,state){return{status:'Not started',lastPracticed:'',evidence:'',notes:'',...tool.initial,...state.tools[tool.id]};}
export function labProgress(lab,state){return{status:'Planned',version:'',restoredDate:'',maintenanceDate:'',evidence:'',notes:'',...lab.initial,...state.labs[lab.id]};}
export function isVerified(topic,state){const p=topicProgress(topic,state);return p.status==='Complete'&&Number(p.proficiency)>=3&&Boolean(p.evidence.trim())&&Boolean(p.demonstratedDate);}
export function projectVerified(project,state){const p=projectProgress(project,state);return p.status==='Complete'&&Boolean(p.evidence.trim())&&Boolean(p.reviewedDate);}
export function reviewDate(topic,state){const p=topicProgress(topic,state);return p.demonstratedDate?addDays(p.demonstratedDate,Number(p.reviewDays)||30):'';}
export function dueTopics(data,state,date=isoDate()){return allTopics(data,state).filter(t=>topicProgress(t,state).included&&reviewDate(t,state)&&reviewDate(t,state)<=date).sort((a,b)=>reviewDate(a,state).localeCompare(reviewDate(b,state)));}
export function currentStage(data,state){const topics=allTopics(data,state);return data.stages.find(s=>topics.some(t=>t.stage===s.id&&topicProgress(t,state).included&&!isVerified(t,state)))||(topics.length?data.stages.at(-1):data.stages[0]);}
export function stageStats(stage,data,state){const topics=allTopics(data,state).filter(t=>t.stage===stage.id&&topicProgress(t,state).included),verified=topics.filter(t=>isVerified(t,state)).length;
 const required=stage.projects.map(id=>allProjects(data,state).find(p=>p.id===id)).filter(Boolean),projectCount=required.filter(p=>projectVerified(p,state)).length;
 const gate={...stage,...state.stageReviews[stage.id]},reviewed=Boolean(topics.length&&verified===topics.length&&projectCount===required.length&&gate.evidence&&gate.reviewedDate);
 return{selected:topics.length,verified,percent:topics.length?Math.round(verified/topics.length*100):0,hours:topics.reduce((sum,t)=>sum+Number(t.hours||0),0),required,projectCount,reviewed};}
export function topicMinutes(id,state){return state.sessions.filter(s=>s.topicId===id).reduce((sum,s)=>sum+Number(s.minutes||0),0);}
export function dayMinutes(date,state){return state.sessions.filter(s=>s.date===date).reduce((sum,s)=>sum+Number(s.minutes||0),0);}
export function stats(data,state,date=isoDate()){
 const selected=allTopics(data,state).filter(t=>topicProgress(t,state).included),verified=selected.filter(t=>isVerified(t,state)),start=weekStart(date),end=addDays(start,7);
 const sessions=state.sessions.filter(s=>s.date>=start&&s.date<end);
 const streak=learningStreak(activityDates(state),date,{enabled:state.settings.restAwareStreaks===true,restDays:state.settings.restDays||[]});
 return{selected:selected.length,verified:verified.length,percent:selected.length?Math.round(100*verified.length/selected.length):0,minutes:state.sessions.reduce((sum,s)=>sum+Number(s.minutes||0),0),weekMinutes:sessions.reduce((sum,s)=>sum+Number(s.minutes||0),0),todayMinutes:dayMinutes(date,state),streak,due:dueTopics(data,state,date).length,openHours:selected.filter(t=>!isVerified(t,state)).reduce((sum,t)=>sum+Number(t.hours||0),0)};
}
export function focusTopic(data,state){const topics=allTopics(data,state),explicit=topics.find(t=>t.id===state.settings.focusTopicId&&topicProgress(t,state).included&&!isVerified(t,state));if(explicit)return explicit;
 const next=courseTaskQueue(data,state).find(entry=>!entry.done);if(next)return next.topic;
 const stage=currentStage(data,state),candidates=topics.filter(t=>t.stage===stage.id&&topicProgress(t,state).included&&!isVerified(t,state)&&topicProgress(t,state).status!=='Parked');
 return candidates.find(t=>['Learning','Practicing','Review'].includes(topicProgress(t,state).status))||candidates[0]||topics.find(t=>topicProgress(t,state).included&&!isVerified(t,state));
}
export function makeDayPlan(data,state,date=isoDate()){
 const budget=Number(state.settings.dailyMinutes)||90,tasks=[],due=dueTopics(data,state,date)[0];let remaining=budget;
 if(due&&budget>=40){const n=Math.min(15,Math.round(budget*.18));tasks.push({id:uid('task'),kind:'Review',title:'Recall: '+due.title,detail:'Explain the concept without notes, then attempt a fresh example. Record a new demonstration date after successful practice.',minutes:n,topicId:due.id,projectId:'',done:false,manual:false,createdAt:new Date().toISOString()});remaining-=n;}
 for(const{topic,task}of courseTaskQueue(data,state).filter(t=>!t.done)){
  if(remaining<=0||tasks.length>=100)break;const planned=Math.min(task.minutes,remaining);if(planned<5&&task.minutes>=5)break;
  tasks.push(materializeTask(topic,task,planned));remaining-=planned;if(planned<task.minutes)break;
 }
 if(!tasks.length){const empty=!allTopics(data,state).length;tasks.push({id:uid('task'),kind:empty?'Build':'Review',title:empty?'Outline your first learning topic':'Reassess a completed skill',detail:empty?'Open All topics and add the first thing you want to learn.':'Attempt a fresh challenge and record independent evidence.',minutes:Math.min(30,budget),topicId:'',projectId:'',done:false,manual:false,createdAt:new Date().toISOString()});}
 return{date,tasks,reflection:'',nextAction:'',generatedAt:new Date().toISOString(),lwTasksVersion:2};
}
export function completeTask(state,date,id,done){const row=state.days[date]?.tasks.find(t=>t.id===id);if(!row)return;if(row.curriculumKey){setCourseTaskDone(state,date,row,done);return;}row.done=done;row.completedAt=done?new Date().toISOString():'';}

export function pace(data,state,date=isoDate()){
 const remaining=stats(data,state,date).openHours,planned=Number(state.settings.weeklyHours),start=addDays(date,-27),recent=state.sessions.filter(s=>s.date>=start&&s.date<=date);
 const first=recent.map(s=>s.date).sort()[0],observedDays=first?dateDiff(first,date)+1:0,observedHours=recent.reduce((sum,s)=>sum+Number(s.minutes),0)/60,observedWeekly=observedDays?observedHours/Math.max(7,observedDays)*7:0;
 const target=state.settings.targetFinishDate,days=target?dateDiff(date,target):0;
 const planStart=state.settings.journeyStart>date?state.settings.journeyStart:date;
 return{remaining,planned,plannedFinish:addDays(planStart,Math.ceil(remaining/planned)*7),observedWeekly,observedFinish:observedWeekly&&observedDays>=7?addDays(date,Math.ceil(remaining/observedWeekly)*7):'',target,requiredWeekly:days>0?remaining/(days/7):null,observedDays};
}
export function setCareer(data,state,career){state.settings.careerId=career.id;const domainSet=new Set(career.domains);for(const t of allTopics(data,state)){const p=topicProgress(t,state);state.progress[t.id]={...p,included:t.route==='Core'||domainSet.has(t.domain)};}state.settings.focusTopicId='';}
export function safeURL(value){try{const url=new URL(value);return['https:','http:'].includes(url.protocol)?url.href:'';}catch{return'';}}
export function backup(state){return{format:'cyberpath-backup',version:VERSION,exportedAt:new Date().toISOString(),state};}
const validDate=v=>typeof v==='string'&&(v===''||/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v+'T12:00:00Z')));
const idOk=v=>typeof v==='string'&&/^[A-Za-z0-9_-]{1,100}$/.test(v)&&!['__proto__','constructor','prototype'].includes(v);
export function validateState(input,data){
 if(!input||typeof input!=='object'||Array.isArray(input)||input.version!==VERSION)throw new Error('This backup uses an unsupported format or version.');
 let nodes=0;const walk=(value,depth=0)=>{if(++nodes>250000||depth>16)throw new Error('This backup is too large or deeply nested.');if(value&&typeof value==='object')for(const[k,v]of Object.entries(value)){if(['__proto__','constructor','prototype'].includes(k))throw new Error('This backup contains an invalid key.');walk(v,depth+1);}if(typeof value==='string'&&value.length>100000)throw new Error('A text field is too long.');};walk(input);
 const defaults=defaultState(data),state={...defaults,...structuredClone(input),settings:{...defaults.settings,...input.settings},custom:{...defaults.custom,...input.custom}};
 for(const name of ['topics','projects','resources','tools','labs'])if(!Array.isArray(state.custom[name])||state.custom[name].length>5000)throw new Error('Invalid custom '+name+'.');
 const knownStages=new Set(data.stages.map(s=>s.id));
 for(const t of state.custom.topics)if(!idOk(t.id)||typeof t.title!=='string'||!t.title.trim()||!knownStages.has(t.stage)||!Number.isFinite(Number(t.hours))||Number(t.hours)<=0||!Array.isArray(t.resources)||!Array.isArray(t.projects)||!Array.isArray(t.tools))throw new Error('A custom topic has missing or invalid fields.');
 for(const p of state.custom.projects)if(!idOk(p.id)||!p.title||!knownStages.has(p.stage))throw new Error('A custom project is invalid.');
 for(const r of state.custom.resources)if(!idOk(r.id)||!r.title||!safeURL(r.url))throw new Error('A resource needs a valid HTTP or HTTPS link.');
 const topicIds=new Set(allTopics(data,state).map(t=>t.id));if(topicIds.size!==allTopics(data,state).length)throw new Error('A custom topic duplicates an existing ID.');
 for(const t of state.custom.topics)validateTopicTasks(t,'custom.topics.'+t.id+'.tasks');
 for(const key of ['progress','taskProgress','projects','tools','labs','resourceEdits','stageReviews','weekly','days'])if(!state[key]||typeof state[key]!=='object'||Array.isArray(state[key]))throw new Error('Invalid '+key+' records.');
 for(const[id,p]of Object.entries(state.progress)){if(!topicIds.has(id)||!TOPIC_STATUSES.includes(p.status)||!Number.isInteger(Number(p.proficiency))||Number(p.proficiency)<0||Number(p.proficiency)>5||typeof p.included!=='boolean'||!validDate(p.targetDate)||!validDate(p.demonstratedDate)||!Number.isInteger(Number(p.reviewDays))||Number(p.reviewDays)<1||Number(p.reviewDays)>3650||typeof p.evidence!=='string'||typeof p.notes!=='string')throw new Error('Invalid progress for '+id+'.');}
 if(!Array.isArray(state.sessions)||state.sessions.length>50000)throw new Error('Invalid session log.');
 for(const s of state.sessions)if(!idOk(s.id)||!validDate(s.date)||!s.date||!topicIds.has(s.topicId)||!ACTIVITIES.includes(s.activity)||!Number.isFinite(Number(s.minutes))||Number(s.minutes)<=0||Number(s.minutes)>1440)throw new Error('A session has an invalid date, topic, activity, or duration.');
 if(!Array.isArray(state.notes)||state.notes.length>10000||!Array.isArray(state.favourites))throw new Error('Invalid notes or favourites.');
 for(const[date,day]of Object.entries(state.days)){if(!validDate(date)||!Array.isArray(day.tasks)||day.tasks.length>500)throw new Error('Invalid daily plan.');for(const task of day.tasks)if(!idOk(task.id)||typeof task.title!=='string'||!task.title.trim()||typeof task.done!=='boolean'||!Number.isFinite(Number(task.minutes))||Number(task.minutes)<1||Number(task.minutes)>1440)throw new Error('A daily task is invalid.');}
 if(!Number.isInteger(Number(state.settings.dailyMinutes))||Number(state.settings.dailyMinutes)<15||Number(state.settings.dailyMinutes)>600||!Number.isFinite(Number(state.settings.weeklyHours))||Number(state.settings.weeklyHours)<=0||Number(state.settings.weeklyHours)>100||!validDate(state.settings.journeyStart)||!['dark','light'].includes(state.settings.theme)||!['system','reduced','full'].includes(state.settings.motion))throw new Error('Study settings are invalid.');
 migrateTaskProgress(data,state);validateStudyState(state,data);
 const definitions=new Map(allTopics(data,state).flatMap(t=>topicTasks(t).map(task=>[taskKey(t.id,task.id),task])));
 for(const[key,p]of Object.entries(state.taskProgress)){
  const def=definitions.get(key);if(!def||!p||typeof p.done!=='boolean'||!p.checks||typeof p.checks!=='object'||Array.isArray(p.checks)||!validDate(p.completedDate||''))throw new Error('Invalid course task progress: '+key+'.');
  for(const[id,checked]of Object.entries(p.checks))if(!def.checklist.some(c=>c.id===id)||typeof checked!=='boolean')throw new Error('Invalid checkbox progress: '+key+'.'+id);
  if(p.done&&(!p.completedDate||def.checklist.some(c=>c.required!==false&&!p.checks[c.id])))throw new Error('A completed course task is missing its required checks or date.');
 }
 for(const day of Object.values(state.days))for(const row of day.tasks)if(row.curriculumKey){const def=definitions.get(row.curriculumKey);if(!def||row.curriculumKey!==taskKey(row.topicId,row.courseTaskId))throw new Error('A daily task has an invalid course task reference.');row.checklist=structuredClone(def.checklist);}
 return state;
}
export function parseBackup(text,data){if(text.length>16000000)throw new Error('Choose a backup smaller than 16 MB.');const payload=JSON.parse(text);if(payload.format!=='cyberpath-backup')throw new Error('Choose a Cyberpath JSON backup.');return validateState(payload.state,data);}
