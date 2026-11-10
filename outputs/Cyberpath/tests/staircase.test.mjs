import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {validateCoursePack,createWorkspace,workspaceBackup,parseWorkspaceBackup} from '../public/workspace.js';
import {defaultState,completeTask,stats,isVerified} from '../public/model.js';
import {ensureCourseTask,setChecklistItem} from '../public/course-tasks.js';
import {finishWorkLesson,finishWorkTopic,undoWorkTopic} from '../public/studio.js';
import {stairLevel,staircaseProgress} from '../public/staircase.js';
const sample=JSON.parse(await fs.readFile(new URL('./fixtures/course.lw',import.meta.url),'utf8'));
const fresh=()=>{const data=validateCoursePack(structuredClone(sample));return{data,state:defaultState(data)};};
function longCourse(){const p=structuredClone(sample),topic=p.data.topics[0];p.data.topics=Array.from({length:15},(_,i)=>({...structuredClone(topic),id:'CLIMB-'+(i+1),title:'Learning topic '+(i+1),requires:[],tasks:[{...structuredClone(topic.tasks[0]),id:'study',checklist:[]}]}));return validateCoursePack(p);}
test('a course starts on the ground and earns one stair only after all required tasks finish',()=>{
 const{data,state}=fresh(),topic=data.topics[0];let climb=staircaseProgress(data,state);assert.equal(climb.climbed,0);assert.equal(climb.level,1);assert.equal(climb.percent,0);assert.equal(climb.steps[0].next,true);
 const task=topic.tasks[0];for(const item of task.checklist)if(item.required!==false)setChecklistItem(state,topic.id,task,item.id,true);finishWorkTopic(data,state,topic.id,'2026-10-30',task.id);assert.equal(staircaseProgress(data,state).climbed,0);
 finishWorkLesson(data,state,topic.id,'2026-10-30');climb=staircaseProgress(data,state);assert.equal(climb.climbed,1);assert.equal(climb.steps[0].current,true);assert.equal(climb.steps[1].next,true);assert.equal(climb.percent,50);assert.equal(isVerified(topic,state),false);assert.equal(stats(data,state).minutes,0);
});
test('ten stairs advance to the next level, short final flights finish without a phantom level',()=>{
 const data=longCourse(),state=defaultState(data);let record;for(let i=0;i<10;i++)record=finishWorkLesson(data,state,data.topics[i].id,'2026-10-30');let climb=staircaseProgress(data,state);assert.deepEqual([climb.climbed,climb.level,climb.percent,climb.remaining],[10,2,0,5]);assert.equal(climb.steps[0].number,11);assert.equal(climb.steps[0].next,true);
 undoWorkTopic(state,record);climb=staircaseProgress(data,state);assert.deepEqual([climb.climbed,climb.level,climb.percent],[9,1,90]);for(let i=9;i<15;i++)finishWorkLesson(data,state,data.topics[i].id,'2026-10-30');climb=staircaseProgress(data,state);assert.equal(climb.complete,true);assert.equal(climb.percent,100);assert.equal(climb.level,2);assert.equal(climb.remaining,0);assert.equal(climb.steps.at(-1).current,true);assert.deepEqual([stairLevel(10,10).level,stairLevel(10,10).percent],[1,100]);
});
test('level navigation is clamped and never changes completion or the current level',()=>{
 const data=longCourse(),state=defaultState(data),before=structuredClone(state);assert.equal(staircaseProgress(data,state,99).viewedLevel,2);assert.equal(staircaseProgress(data,state,-2).viewedLevel,1);assert.equal(staircaseProgress(data,state,'bad').viewedLevel,1);assert.equal(staircaseProgress(data,state,2).level,1);assert.equal(staircaseProgress(data,state,2).climbed,0);assert.deepEqual(state,before);
});
test('working ahead earns one stair per topic and reopening a task removes its stair',()=>{
 const data=longCourse(),state=defaultState(data),topic=data.topics[13],task=topic.tasks[0],row=ensureCourseTask(state,topic,task,'2026-10-30');completeTask(state,'2026-10-30',row.id,true);let climb=staircaseProgress(data,state);assert.equal(climb.climbed,1);assert.equal(climb.steps[0].current,true);assert.equal(climb.nextTopicId,data.topics[0].id);completeTask(state,'2026-10-30',row.id,false);assert.equal(staircaseProgress(data,state).climbed,0);
});
test('courses and imported copies keep separate staircases through backup and restore',()=>{
 const{data}=fresh(),second=structuredClone(data);second.meta.course.id='another-course';const catalog=[data,second],w=createWorkspace(catalog);finishWorkLesson(data,w.courses[data.meta.course.id],data.topics[0].id,'2026-10-30');const restored=parseWorkspaceBackup(JSON.stringify(workspaceBackup(w)),catalog);assert.equal(staircaseProgress(data,restored.courses[data.meta.course.id]).climbed,1);assert.equal(staircaseProgress(second,restored.courses[second.meta.course.id]).climbed,0);
});
test('excluded and parked topics do not count; an empty selected path has no stairs or false finish',()=>{
 const{data,state}=fresh();finishWorkLesson(data,state,data.topics[0].id,'2026-10-30');state.progress[data.topics[0].id]={...state.progress[data.topics[0].id],included:false};assert.equal(staircaseProgress(data,state).climbed,0);assert.equal(staircaseProgress(data,state).total,1);state.progress[data.topics[1].id]={...state.progress[data.topics[1].id],status:'Parked'};const climb=staircaseProgress(data,state);assert.equal(climb.total,0);assert.equal(climb.complete,false);assert.equal(climb.level,1);assert.deepEqual(climb.steps,[]);assert.equal(climb.percent,0);
});
