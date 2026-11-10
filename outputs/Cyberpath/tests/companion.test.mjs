import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createWorkspace,validateCoursePack,workspaceBackup,parseWorkspaceBackup} from '../public/workspace.js';
import {defaultState} from '../public/model.js';
import {finishWorkLesson,undoWorkTopic} from '../public/studio.js';
import {devicePreferences,courseSummary,companionSummary,forestMilestones,knowledgeMap,validatePrerequisites,nextReminder} from '../public/companion.js';
import {forestArt} from '../public/forest.js';
const pack=JSON.parse(await fs.readFile(new URL('./fixtures/course.lw',import.meta.url),'utf8'));
const setup=()=>{const data=validateCoursePack(structuredClone(pack));return{data,state:defaultState(data)};};
test('widget summary follows the next topic and selected course without mixing progress',()=>{
 const{data}=setup(),second=structuredClone(data);second.meta.course.id='second';second.meta.course.title='Second course';const w=createWorkspace([data,second]);finishWorkLesson(data,w.courses[data.meta.course.id],data.topics[0].id,'2026-10-30');w.settings.activeCourseId='second';const summary=companionSummary([data,second],w);assert.equal(summary.activeCourseId,'second');assert.equal(summary.courses[0].nextTopicId,data.topics[1].id);assert.equal(summary.courses[0].completedTasks,2);assert.equal(summary.courses[1].completedTasks,0);assert.equal(summary.courses[1].nextTopicId,second.topics[0].id);
});
test('milestones and scene unlocks follow completed topics and sections, and Undo removes unearned scenery',()=>{
 const{data,state}=setup(),records=[{data,state,course:data.meta.course}];assert.equal(forestMilestones(records).filter(r=>r.unlocked).length,0);assert.ok(!forestArt(records).includes('class="forest-flower"'));const record=finishWorkLesson(data,state,data.topics[0].id,'2026-10-30');const unlocked=forestMilestones(records).filter(r=>r.unlocked).map(r=>r.id);assert.deepEqual(unlocked,['flowers','trail']);assert.match(forestArt(records),/class="forest-flower"/);assert.match(forestArt(records),/class="forest-trail"/);assert.ok(!forestArt(records).includes('class="forest-pond"'));undoWorkTopic(state,record);assert.equal(forestMilestones(records).filter(r=>r.unlocked).length,0);
});
test('all forest scenery appears only after its own threshold is met',()=>{
 const{data,state}=setup();finishWorkLesson(data,state,data.topics[0].id,'2026-10-30');finishWorkLesson(data,state,data.topics[1].id,'2026-10-30');const records=Array.from({length:5},()=>({data,state,course:data.meta.course}));const rewards=forestMilestones(records);assert.equal(rewards.filter(r=>r.unlocked).length,5);const art=forestArt(records);for(const cls of ['forest-flower','forest-trail','forest-fireflies','forest-pond','forest-pavilion'])assert.ok(art.includes('class="'+cls+'"'),cls);assert.equal(courseSummary(data,state).courseComplete,true);
});
test('knowledge map renders declared prerequisites and keeps suggested order distinct',()=>{
 const{data,state}=setup();let map=knowledgeMap(data,state);assert.deepEqual(map.edges,[{from:'ST01',to:'ST02',kind:'prerequisite'}]);assert.equal(map.nodes.length,2);assert.ok(map.nodes[1].y>map.nodes[0].y);delete data.stages[1].requires;data.stages[1].prerequisites='Earlier stages';map=knowledgeMap(data,state);assert.equal(map.edges[0].kind,'sequence');assert.equal(knowledgeMap(data,state,{stageId:'ST01'}).nodes.length,1);
});
test('unknown and cyclic explicit prerequisites are rejected during LW import',()=>{
 for(const change of [p=>p.data.topics[1].requires=['MISSING'],p=>p.data.topics[0].requires=['START-002'],p=>p.data.stages[0].requires=['ST02']]){const bad=structuredClone(pack);change(bad);assert.throws(()=>validateCoursePack(bad));}
});
test('large prerequisite chains validate without recursive stack limits and map searches cap visible nodes',()=>{
 const{data,state}=setup();data.topics=Array.from({length:10000},(_,i)=>({...data.topics[0],id:'N'+i,title:'Topic '+i,requires:i?['N'+(i-1)]:[]}));assert.doesNotThrow(()=>validatePrerequisites(data));const map=knowledgeMap(data,state,{stageId:'ST01'});assert.equal(map.total,10000);assert.equal(map.shown,120);assert.ok(knowledgeMap(data,state,{stageId:'ST01',query:'Topic 9999'}).nodes.some(n=>n.id==='N9999'));
});
test('reminder and backup preview preferences validate and survive a workspace backup',()=>{
 const{data}=setup(),w=createWorkspace([data]);w.devicePreferences=devicePreferences({reminder:{enabled:true,time:'20:45',days:[7,1,1],courseId:'active'},backup:{frequency:'changes',keep:30}});const restored=parseWorkspaceBackup(JSON.stringify(workspaceBackup(w)),[data]);assert.deepEqual(restored.devicePreferences.reminder.days,[1,7]);assert.equal(restored.devicePreferences.backup.keep,30);assert.throws(()=>devicePreferences({reminder:{time:'25:00'}}));assert.throws(()=>devicePreferences({reminder:{days:[]}}));assert.throws(()=>devicePreferences({backup:{keep:0}}));
});
test('reminder preview chooses future selected weekdays across month boundaries',()=>{
 const now=new Date(2026,9,30,21,0),next=nextReminder('19:00',[1,2,3,4,5],now);assert.equal(next.getMonth(),10);assert.equal(next.getDate(),2);assert.equal(next.getDay(),1);assert.equal(next.getHours(),19);assert.equal(nextReminder('19:00',[5],new Date(2026,9,30,18)).getDate(),30);assert.equal(nextReminder('19:00',[],now),null);
});

test('topic maps include prerequisite context from another section',()=>{const{data,state}=setup(),map=knowledgeMap(data,state,{stageId:'ST02'});assert.equal(map.shown,1);assert.equal(map.contextCount,1);assert.ok(map.nodes.find(n=>n.id==='START-001'&&n.context));assert.ok(map.edges.some(e=>e.from==='START-001'&&e.to==='START-002'));});
