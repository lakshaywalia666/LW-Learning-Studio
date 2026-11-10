import test from 'node:test';
import assert from 'node:assert/strict';
import {parseTaskList,addTaskTopics,addSimpleTopics,simpleCourse} from '../public/simple-course.js';
import {validateCoursePack,createWorkspace,courseData,workspaceBackup,parseWorkspaceBackup} from '../public/workspace.js';
import {applyCourseUpdate,newPage} from '../public/learning.js';
import {workQueue,finishWorkStep,undoWorkTopic} from '../public/studio.js';
import {staircaseProgress} from '../public/staircase.js';

test('pasted numbered, bulleted, checkbox, Hindi and spreadsheet lists preserve explanations',()=>{
 const rows=parseTaskList('1. First: Explain this.\r\n• Second\r\n- [x] Third: Still pending\r\nचौथा\tएक उदाहरण बनाइए\nFifth | Try it');
 assert.deepEqual(rows.map(r=>r.title),['First','Second','Third','चौथा','Fifth']);
 assert.equal(rows[2].explanation,'Still pending');assert.equal(rows[3].explanation,'एक उदाहरण बनाइए');assert.equal(rows[4].explanation,'Try it');
 const data=simpleCourse('Test');addTaskTopics(data,rows);assert.ok(data.topics.every(t=>!t.initial.done&&t.tasks[0].checklist.length===0));
});
test('plain titles keep times and URLs, while invalid lines identify their source position',()=>{
 assert.deepEqual(parseTaskList('Read https://example.com\nMeet at 10:30').map(r=>r.title),['Read https://example.com','Meet at 10:30']);
 assert.throws(()=>parseTaskList('\nValid\n: Missing name'),/Line 3/);
 assert.throws(()=>parseTaskList(' \n\t'),/at least one/);
});
test('a bulk addition respects its section and estimate without altering the original tasks',()=>{
 const data=simpleCourse('Study','Original: Keep this.');data.stages.push({...structuredClone(data.stages[0]),id:'SECOND',title:'Practice'});const old=structuredClone(data.topics[0]);
 const added=addSimpleTopics(data,'A: First\nB: Second',{stageId:'SECOND',minutes:15});
 assert.deepEqual(data.topics[0],old);assert.deepEqual(added.map(t=>t.stage),['SECOND','SECOND']);assert.ok(added.every(t=>t.hours===.25&&t.tasks[0].minutes===15));
 assert.doesNotThrow(()=>validateCoursePack(data));
});
test('a bad row, section or estimate never partially adds the batch',()=>{
 const data=simpleCourse('Test','Original'),before=structuredClone(data);
 for(const run of [()=>addSimpleTopics(data,'Good\n'+ 'x'.repeat(161)),()=>addSimpleTopics(data,'Good',{stageId:'MISSING'}),()=>addSimpleTopics(data,'Good',{minutes:0}),()=>addSimpleTopics(data,'Good',{minutes:1.5}),()=>addSimpleTopics(data,'Good',{minutes:1441})]){assert.throws(run);assert.deepEqual(data,before);}
});
test('single-task explanations preserve paragraphs and enforce the actual task text limit',()=>{
 const data=simpleCourse('Test');const [topic]=addTaskTopics(data,[{title:'Read',explanation:'First paragraph.\n\nSecond paragraph.'}]);
 assert.equal(topic.tasks[0].instructions,'First paragraph.\n\nSecond paragraph.');
 addTaskTopics(data,[{title:'Long but valid',explanation:'x'.repeat(20000)}]);assert.doesNotThrow(()=>validateCoursePack(data));
 const before=structuredClone(data);assert.throws(()=>addTaskTopics(data,[{title:'Good'},{title:'Too long',explanation:'x'.repeat(20001)}]));assert.deepEqual(data,before);
});
test('saving added tasks retains completion, updates stairs and survives a full workspace restore',()=>{
 const original=simpleCourse('Course','Existing: Already studied.'),catalog=[original],w=createWorkspace(catalog),id=original.meta.course.id,state=w.courses[id];newPage(w,{title:'Keep my note'});
 finishWorkStep(original,state,original.topics[0].id,'learn','2026-11-06');const completed=structuredClone(state.taskProgress);
 const draft=structuredClone(original);addSimpleTopics(draft,'Next: Learn this.\nLast: Try this.');applyCourseUpdate(w,catalog,draft);
 const data=courseData(catalog,w,id);assert.deepEqual(state.taskProgress,completed);assert.equal(workQueue(data,state).tasksDone,1);assert.equal(workQueue(data,state).tasksTotal,3);assert.equal(staircaseProgress(data,state).climbed,1);
 const q=workQueue(data,state),record=finishWorkStep(data,state,q.next.id,q.step.id,'2026-11-06');assert.equal(staircaseProgress(data,state).climbed,2);assert.equal(undoWorkTopic(state,record),true);assert.equal(staircaseProgress(data,state).climbed,1);assert.equal(state.sessions.length,0);
 const restored=parseWorkspaceBackup(JSON.stringify(workspaceBackup(w)),catalog);assert.equal(restored.learning.pages[0].title,'Keep my note');assert.equal(workQueue(courseData(catalog,restored,id),restored.courses[id]).tasksDone,1);
});
test('a thousand pasted tasks validate with unique IDs and no pre-completed work',()=>{
 const data=simpleCourse('Bulk');const rows=parseTaskList(Array.from({length:1000},(_,i)=>`${i+1}. Task ${i+1}: Explanation ${i+1}`).join('\n'));addTaskTopics(data,rows);assert.equal(new Set(data.topics.map(t=>t.id)).size,1000);assert.doesNotThrow(()=>validateCoursePack(data));
});
test('course capacity is checked before a large batch mutates anything',()=>{
 const data=simpleCourse('Test','Existing'),before=structuredClone(data);assert.throws(()=>addTaskTopics(data,Array.from({length:10000},()=>({title:'Task'}))),/10,000/);assert.deepEqual(data,before);
 assert.throws(()=>parseTaskList(Array(10001).fill('Task').join('\n')),/10,000/);
});
