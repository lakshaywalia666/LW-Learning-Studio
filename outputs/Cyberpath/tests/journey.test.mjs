import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {validateCoursePack,createWorkspace} from '../public/workspace.js';
import {defaultState,completeTask} from '../public/model.js';
import {ensureCourseTask,setChecklistItem} from '../public/course-tasks.js';
import {finishWorkLesson,undoWorkTopic,treeGrowth} from '../public/studio.js';
import {courseSummary,knowledgeMap,forestMilestones,companionSummary} from '../public/companion.js';
import {staircaseProgress,staircaseTopics,topicStair} from '../public/staircase.js';
import {courseRoute} from '../public/journey.js';
import {studyBrief} from '../public/study.js';
const sample=JSON.parse(await fs.readFile(new URL('./fixtures/course.lw',import.meta.url),'utf8'));
const fresh=()=>{const data=validateCoursePack(structuredClone(sample));return{data,state:defaultState(data)};};
test('every staircase target is a real selected topic, including completed work done ahead of order',()=>{
 const{data,state}=fresh();let steps=staircaseTopics(data,state);assert.deepEqual(steps.map(s=>s.topicId),data.topics.map(t=>t.id));const topic=data.topics[1],task=topic.tasks[0];for(const item of task.checklist)if(item.required!==false)setChecklistItem(state,topic.id,task,item.id,true);const row=ensureCourseTask(state,topic,task,'2026-10-30');completeTask(state,'2026-10-30',row.id,true);steps=staircaseTopics(data,state);assert.equal(steps[0].topicId,topic.id);assert.equal(steps[0].climbed,true);assert.equal(steps[1].topicId,data.topics[0].id);assert.equal(topicStair(data,state,topic.id).number,1);assert.equal(staircaseProgress(data,state).steps[0].topicId,topic.id);state.progress[topic.id]={included:false};assert.equal(topicStair(data,state,topic.id),null);
});
test('one saved task updates partial stairs, tree, map, widget and course summary without awarding a whole topic',()=>{
 const{data}=fresh(),w=createWorkspace([data]),state=w.courses[data.meta.course.id],topic=data.topics[0],task=topic.tasks[0];for(const item of task.checklist)if(item.required!==false)setChecklistItem(state,topic.id,task,item.id,true);const row=ensureCourseTask(state,topic,task,'2026-10-30');completeTask(state,'2026-10-30',row.id,true);
 assert.equal(treeGrowth(data,state).tasks,1);assert.equal(topicStair(data,state,topic.id).tasksDone,1);assert.equal(staircaseProgress(data,state).climbed,0);assert.equal(knowledgeMap(data,state,{stageId:topic.stage}).nodes.find(n=>n.id===topic.id).done,1);assert.equal(courseSummary(data,state).completedTasks,1);assert.equal(companionSummary([data],w).courses[0].completedTasks,1);assert.equal(forestMilestones([{data,state}]).find(r=>r.id==='flowers').unlocked,false);
 const record=finishWorkLesson(data,state,topic.id,'2026-10-30');assert.equal(staircaseProgress(data,state).climbed,1);assert.equal(forestMilestones([{data,state}]).find(r=>r.id==='flowers').unlocked,true);undoWorkTopic(state,record);assert.equal(treeGrowth(data,state).tasks,1);assert.equal(topicStair(data,state,topic.id).tasksDone,1);assert.equal(staircaseProgress(data,state).climbed,0);assert.equal(forestMilestones([{data,state}]).find(r=>r.id==='flowers').unlocked,false);assert.equal(courseSummary(data,state).completedTopics,0);
});
test('study brief preserves authored instructions, merges task references and leaves learner state unchanged',()=>{
 const{data,state}=fresh(),topic=data.topics[0],before=structuredClone(state),brief=studyBrief(data,state,topic);assert.deepEqual(brief.tasks,topic.tasks.filter(t=>t.required));assert.equal(brief.minutes,brief.tasks.reduce((n,t)=>n+t.minutes,0));assert.equal(brief.done,0);assert.equal(new Set(brief.resources.map(r=>r.id)).size,brief.resources.length);assert.ok(brief.projects.some(project=>project.id==='PROJECT-01'));const next=studyBrief(data,state,data.topics[1]);assert.equal(next.prerequisites[0].id,topic.id);assert.deepEqual(state,before);
});
test('a linked knowledge node is shown even when its section exceeds the map display cap',()=>{
 const{data,state}=fresh();data.topics=Array.from({length:200},(_,i)=>({...data.topics[0],id:'NODE-'+i,title:'Node '+i,requires:[]}));const focusId='NODE-199',map=knowledgeMap(data,state,{stageId:data.topics[0].stage,focusId});assert.equal(map.shown,120);assert.ok(map.nodes.some(n=>n.id===focusId));assert.equal(map.total,200);
});
test('journey links retain both the course and selected topic, and reject unknown routes',()=>{
 const href=courseRoute('knowledge','course-a','TOPIC-001'),query=new URLSearchParams(href.split('?')[1]);assert.equal(href.split('?')[0],'#/knowledge');assert.equal(query.get('course'),'course-a');assert.equal(query.get('topic'),'TOPIC-001');assert.equal(courseRoute('growth','new-course'),'#/growth?course=new-course');assert.throws(()=>courseRoute('javascript:alert(1)','x'));
});
