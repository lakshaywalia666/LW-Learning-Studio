import {studyPendingEntry} from './study-features.js?v=studio47';
import{topicTasks,taskState,courseTaskQueue,ensureCourseTask,setCourseTaskDone,setChecklistItem,migrateTaskProgress}from'./course-tasks.js?v=studio47';
import {allTopics,topicProgress,isVerified,isoDate,uid,completeTask} from './model.js?v=studio47';

export const THEMES=[
 {id:'obsidian',name:'Obsidian',mode:'dark',colors:{background:'#0b0d12',surface:'#1b1e26',text:'#f5f6fa',muted:'#a7aebd',accent:'#91b9ff',glow:'#5c8dff'}},
 {id:'grove',name:'Grove',mode:'dark',colors:{background:'#0a1412',surface:'#172b25',text:'#edf5ef',muted:'#9eb4a7',accent:'#b8e6ad',glow:'#75bd8c'}},
 {id:'aurora',name:'Aurora',mode:'dark',colors:{background:'#100d1a',surface:'#282038',text:'#f4eefc',muted:'#b4a8c8',accent:'#d3baff',glow:'#9573d1'}},
 {id:'pearl',name:'Pearl',mode:'light',colors:{background:'#f3f4f8',surface:'#ffffff',text:'#1c2130',muted:'#667085',accent:'#245de8',glow:'#9ab6ff'}}
];
const hex=/^#[a-f0-9]{6}$/i;
export function validateTheme(input){
 const t=input?.format==='lw-learning-studio'&&input.kind==='theme'?input.theme:input;
 if(!t||!/^[-a-z0-9_]{1,60}$/i.test(t.id)||typeof t.name!=='string'||!t.name.trim()||t.name.length>60||!['dark','light'].includes(t.mode))throw new Error('Choose a valid LW theme file.');
 const colors={};for(const key of ['background','surface','text','muted','accent','glow']){if(!hex.test(t.colors?.[key]))throw new Error('Theme colors must be six-digit hex colors.');colors[key]=t.colors[key];}
 return {id:t.id,name:t.name.trim(),mode:t.mode,colors};
}
export const themePack=theme=>({format:'lw-learning-studio',version:1,kind:'theme',theme:validateTheme(theme)});
export function validateSound(sound){
 if(!sound||!/^[-a-z0-9_]{1,60}$/i.test(sound.id)||typeof sound.name!=='string'||!sound.name.trim()||sound.name.length>100||!/^data:audio\/(mpeg|mp3|wav|x-wav|ogg|mp4|aac|webm);base64,[A-Za-z0-9+/]+={0,2}$/.test(sound.dataURL||'')||sound.dataURL.length>700000)throw new Error('Choose an MP3, WAV, OGG, or M4A sound smaller than 500 KB.');
 return {id:sound.id,name:sound.name,dataURL:sound.dataURL};
}
export function validateStudio(value={}){
 if(!Array.isArray(value.themes??[])||!Array.isArray(value.sounds??[])||(value.themes?.length||0)>20||(value.sounds?.length||0)>5)throw new Error('Keep up to 20 custom themes and 5 imported sounds.');
 const themes=(value.themes||[]).map(validateTheme),sounds=(value.sounds||[]).map(validateSound);
 if(new Set(themes.map(t=>t.id)).size!==themes.length||new Set(sounds.map(s=>s.id)).size!==sounds.length)throw new Error('Theme and sound IDs must be unique.');
 return {themes,sounds};
}
export function resolveTheme(workspace){
 const choices=[...THEMES,...(workspace.studio?.themes||[])],id=workspace.settings.paletteId;
 return choices.find(t=>t.id===id)||THEMES.find(t=>t.mode===workspace.settings.theme)||THEMES[0];
}
export function coursePack(payload){
 if(payload?.format==='lw-learning-studio'){
  if(![1,2].includes(payload.version)||payload.kind!=='course'||!payload.data)throw new Error('This LW file is not a supported course.');
  return {data:payload.data,study:payload.study||{}};
 }
 return {data:payload?.format==='cyberpath-course'?payload.data:payload,study:{}};
}
export function workQueue(data,state){
 const entries=courseTaskQueue(data,state),pending=studyPendingEntry(entries,state),topics=allTopics(data,state).filter(t=>topicProgress(t,state).included&&topicProgress(t,state).status!=='Parked'),learned=new Set(topics.filter(t=>topicTasks(t).filter(task=>task.required!==false).every(task=>taskState(state,t.id,task).done)||isVerified(t,state)).map(t=>t.id));
 return{deferredCount:entries.filter(e=>!e.done&&(state.studyDeferred||[]).includes(e.topic.id+'::'+e.task.id)).length,topics,learned,next:pending?.topic||null,step:pending?.task||null,entries,completed:learned.size,tasksDone:entries.filter(e=>e.done).length,tasksTotal:entries.length};
}
export function finishWorkTopic(data,state,topicId,date=isoDate(),expectedTaskId=''){
 const queue=workQueue(data,state),topic=queue.next,task=queue.step;
 if(!topic||topic.id!==topicId||expectedTaskId&&task.id!==expectedTaskId)throw new Error('This task has already moved on.');
 const row=ensureCourseTask(state,topic,task,date);setCourseTaskDone(state,date,row,true);row.studioWork=true;
 const progress=topicProgress(topic,state);if(progress.status==='Not started')state.progress[topic.id]={...progress,status:'Learning'};
 return{date,taskId:row.id,topicId:topic.id,courseTaskId:task.id};
}
export function finishWorkStep(data,state,topicId,taskId,date=isoDate()){
 const queue=workQueue(data,state),topic=queue.next,task=queue.step;
 if(!topic||topic.id!==topicId||task.id!==taskId)throw new Error('This task has already moved on.');
 const rows=state.days[date]?.tasks||[],key=topic.id+'::'+task.id;
 if(rows.length>=500&&!rows.some(row=>row.curriculumKey===key))throw new Error('This day would exceed 500 task records. Continue on another day.');
 for(const item of task.checklist)if(item.required!==false)setChecklistItem(state,topic.id,task,item.id,true);
 return finishWorkTopic(data,state,topic.id,date,task.id);
}
export function undoWorkTopic(state,record){
 if(Array.isArray(record?.records)){let changed=false;for(const child of record.records)changed=undoWorkTopic(state,child)||changed;return changed;}
 const row=state.days[record?.date]?.tasks.find(t=>t.id===record.taskId);if(!row||!row.done)return false;completeTask(state,record.date,row.id,false);return true;
}
export function finishWorkLesson(data,state,topicId,date=isoDate()){
 const queue=workQueue(data,state),topic=queue.next;if(!topic||topic.id!==topicId)throw new Error('This topic has already moved on.');
 const pending=topicTasks(topic).filter(t=>t.required!==false&&!taskState(state,topic.id,t).done),rows=state.days[date]?.tasks||[],needed=pending.filter(t=>!rows.some(r=>r.curriculumKey===topic.id+'::'+t.id)).length;
 if(rows.length+needed>500)throw new Error('This day would exceed 500 task records. Finish this topic on another day.');
 const records=[];for(const task of pending){for(const item of task.checklist)if(item.required!==false)setChecklistItem(state,topic.id,task,item.id,true);records.push(finishWorkTopic(data,state,topic.id,date,task.id));}
 return{topicId,date,records};
}
export function treeGrowth(data,state){
 const tasks=Object.values(state.days).reduce((n,d)=>n+d.tasks.filter(t=>t.done).length,0),minutes=state.sessions.reduce((n,s)=>n+s.minutes,0),verified=allTopics(data,state).filter(t=>isVerified(t,state)).length;
 const points=tasks+minutes/30+verified*4;
 return {tasks,minutes,verified,points,level:points===0?0:Math.min(6,1+Math.floor(Math.log2(1+points/3)))};
}
