import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {validateCoursePack,createWorkspace,exportCourseContent,workspaceBackup,parseWorkspaceBackup} from '../public/workspace.js';
import {defaultState,makeDayPlan,completeTask,validateState,stats,isVerified} from '../public/model.js';
import {topicTasks,taskState,setChecklistItem,ensureCourseTask,courseTaskQueue,taskKey,migrateTaskProgress} from '../public/course-tasks.js';
import {workQueue,finishWorkTopic,finishWorkLesson,undoWorkTopic,treeGrowth} from '../public/studio.js';
const sample=JSON.parse(await fs.readFile(new URL('./fixtures/course.lw',import.meta.url),'utf8'));
const fresh=()=>{const data=validateCoursePack(structuredClone(sample));return{data,state:defaultState(data)};};
const ready=(state,topic,task)=>{for(const item of task.checklist)if(item.required!==false)setChecklistItem(state,topic.id,task,item.id,true);};
test('v2 imports an authored course with exact tasks, instructions, checkboxes, project links and optional items',()=>{
 const{data,state}=fresh(),first=data.topics[0].tasks[0];assert.equal(data.topics.length,2);assert.equal(first.id,'choose-goal');assert.equal(first.checklist.length,3);assert.equal(first.checklist[2].required,false);assert.equal(first.projectId,'PROJECT-01');assert.match(first.instructions,/another person/);assert.equal(Object.keys(state.taskProgress).length,0);assert.equal(workQueue(data,state).tasksTotal,3);assert.equal(courseTaskQueue(data,state,{optional:true}).length,4);
});
test('required checkbox items gate both the bubble and the Today parent checkbox',()=>{
 const{data,state}=fresh(),topic=data.topics[0],task=topic.tasks[0];state.days['2026-10-30']=makeDayPlan(data,state,'2026-10-30');const row=state.days['2026-10-30'].tasks.find(t=>t.courseTaskId===task.id);
 assert.throws(()=>finishWorkTopic(data,state,topic.id,'2026-10-30',task.id),/required checkbox/);assert.throws(()=>completeTask(state,'2026-10-30',row.id,true),/required checkbox/);
 setChecklistItem(state,topic.id,task,'pick-skill',true);assert.throws(()=>completeTask(state,'2026-10-30',row.id,true));setChecklistItem(state,topic.id,task,'define-result',true);completeTask(state,'2026-10-30',row.id,true);
 assert.equal(taskState(state,topic.id,task).done,true);assert.equal(workQueue(data,state).step.id,'plan-session');assert.equal(stats(data,state,'2026-10-30').minutes,0);assert.equal(isVerified(topic,state),false);
});
test('Today and Work share one completion and multiple planned days do not duplicate history',()=>{
 const{data,state}=fresh(),topic=data.topics[0],task=topic.tasks[0];ready(state,topic,task);const first=ensureCourseTask(state,topic,task,'2026-10-30'),future=ensureCourseTask(state,topic,task,'2026-10-31');
 completeTask(state,'2026-10-30',first.id,true);assert.equal(future.done,false);assert.equal(future.resolvedDate,'2026-10-30');assert.equal(workQueue(data,state).tasksDone,1);assert.equal(treeGrowth(data,state).tasks,1);assert.equal(taskState(state,topic.id,task).completedDate,'2026-10-30');
 const rows=state.days['2026-10-30'].tasks.length;assert.throws(()=>finishWorkTopic(data,state,topic.id,'2026-10-30',task.id));assert.equal(state.days['2026-10-30'].tasks.length,rows);
});
test('unchecking a required child reopens its completed task and its original dated history',()=>{
 const{data,state}=fresh(),topic=data.topics[0],task=topic.tasks[0];ready(state,topic,task);const record=finishWorkTopic(data,state,topic.id,'2026-10-30',task.id);setChecklistItem(state,topic.id,task,'pick-skill',false);
 assert.equal(taskState(state,topic.id,task).done,false);assert.equal(state.days['2026-10-30'].tasks.find(t=>t.id===record.taskId).done,false);assert.equal(workQueue(data,state).step.id,task.id);assert.equal(treeGrowth(data,state).tasks,0);
});
test('optional checkbox items and optional tasks do not block the required course sequence',()=>{
 const{data,state}=fresh();for(const entry of courseTaskQueue(data,state)){ready(state,entry.topic,entry.task);finishWorkTopic(data,state,entry.topic.id,'2026-10-30',entry.task.id);}
 assert.equal(workQueue(data,state).next,null);assert.equal(workQueue(data,state).tasksDone,3);assert.equal(workQueue(data,state).completed,2);assert.equal(taskState(state,data.topics[0].id,data.topics[0].tasks[0]).checks.share,undefined);assert.equal(taskState(state,data.topics[0].id,data.topics[0].tasks[2]).done,false);
});
test('workspace backups retain partial checkboxes and dated completions, while course exports contain only content',()=>{
 const{data}=fresh(),w=createWorkspace([data]),state=w.courses[data.meta.course.id],topic=data.topics[0],task=topic.tasks[0];setChecklistItem(state,topic.id,task,'pick-skill',true);
 let restored=parseWorkspaceBackup(JSON.stringify(workspaceBackup(w)),[data]);assert.equal(taskState(restored.courses[data.meta.course.id],topic.id,task).checks['pick-skill'],true);ready(state,topic,task);finishWorkTopic(data,state,topic.id,'2026-10-30',task.id);
 restored=parseWorkspaceBackup(JSON.stringify(workspaceBackup(w)),[data]);assert.equal(taskState(restored.courses[data.meta.course.id],topic.id,task).completedDate,'2026-10-30');
 const pack=exportCourseContent(data,state);assert.equal(pack.version,2);assert.deepEqual(pack.data.topics[0].tasks,topic.tasks);assert.equal(pack.data.taskProgress,undefined);assert.equal(taskState(defaultState(validateCoursePack(pack)),topic.id,task).done,false);
});
test('author IDs, task fields, checkbox IDs, resource references, versions and missing task arrays are validated',()=>{
 const bad=mutate=>{const p=structuredClone(sample);mutate(p);assert.throws(()=>validateCoursePack(p));};
 bad(p=>p.data.topics[0].tasks.push(p.data.topics[0].tasks[0]));bad(p=>p.data.topics[0].tasks[0].checklist.push(p.data.topics[0].tasks[0].checklist[0]));bad(p=>p.data.topics[0].tasks[0].onclick='anything');bad(p=>p.data.topics[0].tasks[0].resources=['UNKNOWN']);bad(p=>p.version=99);bad(p=>delete p.data.topics[0].tasks);bad(p=>p.data.topics[0].tasks[0].minutes=-1);bad(p=>p.data.topics[0].tasks[0].checklist[0].required='yes');
});
test('legacy course packs become explicit tasks and old Work study records migrate without inventing practice',()=>{
 const p=structuredClone(sample);p.version=1;for(const topic of p.data.topics)delete topic.tasks;const data=validateCoursePack(p),state=defaultState(data),topic=data.topics[0];assert.deepEqual(topic.tasks.map(t=>t.id),['study','practice','evidence']);state.days['2026-10-29']={tasks:[{id:'old-work-1',title:'Study: '+topic.title,minutes:30,topicId:topic.id,done:true,studioWork:true,completedAt:'2026-10-29T10:00:00Z'}]};
 migrateTaskProgress(data,state);assert.equal(taskState(state,topic.id,topic.tasks[0]).done,true);assert.equal(taskState(state,topic.id,topic.tasks[1]).done,false);assert.equal(workQueue(data,state).step.id,'practice');assert.equal(state.days['2026-10-29'].tasks[0].completedAt,'2026-10-29T10:00:00Z');assert.doesNotThrow(()=>validateState(state,data));
});
test('a short daily time box preserves the authored full estimate, title and instructions',()=>{
 const{data,state}=fresh();state.settings.dailyMinutes=15;data.topics[0].tasks[0].minutes=120;const day=makeDayPlan(data,state,'2026-10-30');assert.equal(day.tasks.length,1);assert.equal(day.tasks[0].minutes,15);assert.equal(day.tasks[0].estimatedMinutes,120);assert.equal(day.tasks[0].title,data.topics[0].tasks[0].title);assert.equal(day.tasks[0].detail,data.topics[0].tasks[0].instructions);assert.equal(day.tasks[0].done,false);
});
test('malformed task progress and missing required checks are rejected by backup validation',()=>{
 const{data,state}=fresh(),topic=data.topics[0],task=topic.tasks[0];state.taskProgress[taskKey(topic.id,task.id)]={done:true,checks:{},completedDate:'2026-10-30'};assert.throws(()=>validateState(state,data));state.taskProgress={UNKNOWN:{done:false,checks:{}}};assert.throws(()=>validateState(state,data));
});

test('Done completes a supplied topic and its required checkboxes, then opens the next topic without written input',()=>{
 const{data,state}=fresh(),first=data.topics[0];const record=finishWorkLesson(data,state,first.id,'2026-10-30');assert.equal(record.records.length,2);assert.equal(workQueue(data,state).next.id,data.topics[1].id);assert.equal(workQueue(data,state).completed,1);assert.equal(treeGrowth(data,state).tasks,2);assert.equal(stats(data,state,'2026-10-30').minutes,0);assert.equal(isVerified(first,state),false);assert.equal(taskState(state,first.id,first.tasks[0]).checks['pick-skill'],true);assert.equal(taskState(state,first.id,first.tasks[0]).checks.share,undefined);assert.equal(taskState(state,first.id,first.tasks[2]).done,false);assert.doesNotThrow(()=>validateState(state,data));
 assert.equal(undoWorkTopic(state,record),true);assert.equal(workQueue(data,state).next.id,first.id);assert.equal(treeGrowth(data,state).tasks,0);
});
test('topic Done and Undo preserve tasks already completed on a different day',()=>{
 const{data,state}=fresh(),topic=data.topics[0],task=topic.tasks[0];ready(state,topic,task);const row=ensureCourseTask(state,topic,task,'2026-10-29');completeTask(state,'2026-10-29',row.id,true);const record=finishWorkLesson(data,state,topic.id,'2026-10-30');assert.equal(record.records.length,1);assert.equal(taskState(state,topic.id,task).completedDate,'2026-10-29');undoWorkTopic(state,record);assert.equal(taskState(state,topic.id,task).done,true);assert.equal(taskState(state,topic.id,topic.tasks[1]).done,false);
});
test('topic completion checks daily capacity before changing any task or checkbox',()=>{
 const{data,state}=fresh();state.days['2026-10-30']={tasks:Array.from({length:499},(_,i)=>({id:'manual-'+i,title:'Manual task',minutes:1,done:false}))};const before=structuredClone(state);assert.throws(()=>finishWorkLesson(data,state,data.topics[0].id,'2026-10-30'),/500/);assert.deepEqual(state,before);
});
