import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {simpleCourse,addSimpleTopics} from '../public/simple-course.js';
import {defaultState,stats} from '../public/model.js';
import {workQueue,finishWorkStep,undoWorkTopic} from '../public/studio.js';
import {validateCoursePack,createWorkspace,workspaceBackup,parseWorkspaceBackup,exportCourseContent} from '../public/workspace.js';
import {taskState} from '../public/course-tasks.js';
import {ensureLearning,newPage,markNotebookRestored,recoverNotebookDrafts} from '../public/learning.js';
import {companionSummary} from '../public/companion.js';
import {staircaseProgress} from '../public/staircase.js';
import {learningSceneModel} from '../public/learning-scenes.js';
const sample=JSON.parse(await fs.readFile(new URL('./fixtures/course.lw',import.meta.url),'utf8'));

test('Done completes one task and leaves the next task and topic untouched',()=>{
 const data=validateCoursePack(structuredClone(sample)),state=defaultState(data),topic=data.topics[0],task=topic.tasks[0];
 const record=finishWorkStep(data,state,topic.id,task.id,'2026-11-01');
 assert.equal(workQueue(data,state).tasksDone,1);assert.equal(workQueue(data,state).completed,0);
 assert.equal(workQueue(data,state).next.id,topic.id);assert.equal(workQueue(data,state).step.id,topic.tasks[1].id);
 assert.equal(taskState(state,topic.id,task).checks.share,undefined);assert.equal(taskState(state,topic.id,topic.tasks[1]).done,false);
 assert.equal(stats(data,state).minutes,0);assert.equal(undoWorkTopic(state,record),true);assert.equal(workQueue(data,state).step.id,task.id);
});

test('a stale Done button cannot complete the next task',()=>{
 const data=validateCoursePack(structuredClone(sample)),state=defaultState(data),q=workQueue(data,state);
 finishWorkStep(data,state,q.next.id,q.step.id,'2026-11-01');const before=structuredClone(state);
 assert.throws(()=>finishWorkStep(data,state,q.next.id,q.step.id,'2026-11-01'),/already moved on/);assert.deepEqual(state,before);
});

test('daily capacity is checked before Done changes required checklist items',()=>{
 const data=validateCoursePack(structuredClone(sample)),state=defaultState(data),q=workQueue(data,state);
 state.days['2026-11-01']={tasks:Array.from({length:500},(_,i)=>({id:'manual-'+i,title:'Manual',minutes:1,done:false}))};const before=structuredClone(state);
 assert.throws(()=>finishWorkStep(data,state,q.next.id,q.step.id,'2026-11-01'),/500/);assert.deepEqual(state,before);
});

test('task-by-task Done updates the same stairs, worlds, summaries, and backup records',()=>{
 const data=validateCoursePack(structuredClone(sample)),w=createWorkspace([data]),state=w.courses[data.meta.course.id],first=data.topics[0];
 for(const task of first.tasks.filter(t=>t.required!==false))finishWorkStep(data,state,first.id,task.id,'2026-11-01');
 const copy=parseWorkspaceBackup(JSON.stringify(workspaceBackup(w)),[data]),saved=copy.courses[data.meta.course.id];
 assert.equal(workQueue(data,saved).completed,1);assert.equal(staircaseProgress(data,saved).climbed,1);assert.equal(companionSummary([data],copy).courses[0].completedTasks,2);
 for(const scene of ['forest','islands','city','constellations','orbs'])assert.equal(learningSceneModel([{data,state:saved,course:data.meta.course}],scene).completedTopics,1);
});

test('a name and plain topic lines create a valid portable .lw course with one task per topic',()=>{
 const data=simpleCourse('My course','First topic: Understand this idea.\nSecond topic\n3. Third topic: Try a small example.');
 const ids=data.topics.map(t=>t.id),pack=exportCourseContent(data,defaultState(data)),copy=validateCoursePack(JSON.parse(JSON.stringify(pack)));
 assert.equal(copy.stages.length,1);assert.equal(copy.topics.length,3);assert.deepEqual(copy.topics.map(t=>t.id),ids);
 assert.equal(copy.topics[0].tasks[0].instructions,'Understand this idea.');assert.equal(copy.topics[2].title,'Third topic');
 assert.ok(copy.topics.every(t=>t.tasks.length===1&&t.tasks[0].checklist.length===0));
});

test('plain-list errors do not add partial topics and blank creation stays empty',()=>{
 const data=simpleCourse('An empty course');assert.deepEqual(data.topics,[]);assert.throws(()=>addSimpleTopics(data,'\n'),/at least one/);
 assert.throws(()=>addSimpleTopics(data,'Valid topic\n'+ 'x'.repeat(161)),/topic name/);assert.deepEqual(data.topics,[]);
});

test('a confirmed restore blocks older local drafts but recovers a genuinely new unsaved edit',()=>{
 const w=createWorkspace(),p=newPage(w,{title:'Notes'});p.updatedAt='2026-11-01T10:00:00.000Z';p.blocks[0].text='Backup version';
 const draft=structuredClone(p);draft.updatedAt='2026-11-01T11:00:00.000Z';draft.blocks[0].text='Before restore';
 const storage={getItem:()=>JSON.stringify(draft)};markNotebookRestored(w,'2026-11-01T12:00:00.000Z');
 assert.equal(recoverNotebookDrafts(w,storage),0);assert.equal(p.blocks[0].text,'Backup version');
 const copy=parseWorkspaceBackup(JSON.stringify(workspaceBackup(w)));assert.equal(copy.learning.noteRestoreAt,'2026-11-01T12:00:00.000Z');
 draft.updatedAt='2026-11-01T13:00:00.000Z';draft.blocks[0].text='New unsaved edit';assert.equal(recoverNotebookDrafts(w,storage),1);assert.equal(p.blocks[0].text,'New unsaved edit');
});

test('invalid recovered drafts cannot replace a valid notebook page',()=>{
 const w=createWorkspace(),p=newPage(w,{title:'Keep me'}),draft=structuredClone(p);p.updatedAt='2026-11-01T10:00:00.000Z';draft.updatedAt='2026-11-01T11:00:00.000Z';draft.parentId=p.id;
 assert.equal(recoverNotebookDrafts(w,{getItem:()=>JSON.stringify(draft)}),0);assert.equal(p.parentId,'');assert.equal(ensureLearning(w).pages.length,1);
});
