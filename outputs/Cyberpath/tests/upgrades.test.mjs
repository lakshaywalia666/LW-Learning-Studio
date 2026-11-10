import test from 'node:test';
import assert from 'node:assert/strict';
import {simpleCourse} from '../public/simple-course.js';
import {createWorkspace,validateWorkspace,validateCoursePack,exportCourseContent} from '../public/workspace.js';
import {ensureLearning,markImportant,reviewQueue,newPage} from '../public/learning.js';
import {ensureUpgrades,validateUpgrades,reorderTopic,compareCourseContent,inspectCourseText,validateLessonMedia,snoozeReview,noteOutline,cycleStart,cyclePause,cycleTick,homeLearningSummary,widgetDescription} from '../public/upgrades.js';
import {learningStreak,activityDates} from '../public/streaks.js';
import {finishWorkStep,workQueue} from '../public/studio.js';
import {VoiceRecorder} from '../public/voice-recorder.js';
import {backupStatus} from '../public/upgrade-markup.js';
import {studyLessonMedia} from '../public/upgrades.js';
const setup=()=>{const data=simpleCourse('Drawing','Shapes: Learn circles\nLight: Understand shadows\nColour: Mix colours'),w=createWorkspace([data]);ensureLearning(w);ensureUpgrades(w);return {data,w,state:w.courses[data.meta.course.id]};};
test('settings access keeps active control references linked through repeated reads and validation',()=>{
 const {w}=setup(),settings=ensureUpgrades(w),cycle=settings.cycle;ensureUpgrades(w).cycle={...ensureUpgrades(w).cycle,studyMinutes:1};validateUpgrades(w);assert.equal(w.learning.upgrades.cycle.studyMinutes,1);assert.equal(ensureUpgrades(w),settings);assert.notEqual(settings.cycle,cycle);
});

test('reordering moves stable topics without changing completion and survives course update/export',()=>{
 const {data,w,state}=setup(),first=data.topics[0];finishWorkStep(data,state,first.id,first.tasks[0].id,'2026-11-02');const before=structuredClone(state);
 reorderTopic(data,data.topics[2].id,0);assert.deepEqual(state,before);assert.equal(workQueue(data,state).tasksDone,1);assert.equal(workQueue(data,state).step.title,'Colour');
 assert.deepEqual(validateCoursePack(exportCourseContent(data,state)).topics.map(t=>t.id),data.topics.map(t=>t.id));assert.equal(validateWorkspace(w,[data]).courses[data.meta.course.id].taskProgress[first.id+'::'+first.tasks[0].id]?.done,true);
});
test('Home uses real time and task records across courses, with a bounded goal percentage',()=>{
 const {data,w,state}=setup();state.sessions.push({date:'2026-11-02',minutes:40});finishWorkStep(data,state,data.topics[0].id,data.topics[0].tasks[0].id,'2026-11-02');w.learning.dailyMinutes=30;
 assert.deepEqual(homeLearningSummary([{data,state}],w,'2026-11-02'),{date:'2026-11-02',minutes:40,tasks:1,goal:30,percent:100,remaining:0});
});
test('backup status distinguishes a prepared browser download, a confirmed native save and folder failures',()=>{
 const {w}=setup(),b=ensureUpgrades(w).backup;assert.equal(backupStatus(w).label,'No full backup yet');b.lastPreparedAt='2026-11-01T12:00:00Z';assert.equal(backupStatus(w).label,'Backup prepared');b.lastSavedAt='2026-11-01T12:01:00Z';assert.equal(backupStatus(w).label,'Backup saved');const folder={lastAt:Date.parse('2026-11-02T12:00:00Z')};assert.equal(backupStatus(w,{backup:folder}).label,'Folder backup verified');folder.error='Reconnect your backup folder';assert.match(backupStatus(w,{backup:folder}).label,/needs attention/);
});
test('reading, rest-day and widget preferences round-trip and malformed choices are rejected',()=>{
 const {data,w}=setup(),u=ensureUpgrades(w);u.reading={fontSize:22,lineHeight:1.9,letterSpacing:.04,contrast:'high',largeTargets:true};u.restDays=[6,7];u.widgetMode='notes';assert.deepEqual(validateWorkspace(w,[data]).learning.upgrades,u);
 for(const field of ['fontSize','lineHeight','letterSpacing']){const copy=structuredClone(w);copy.learning.upgrades.reading[field]=999;assert.throws(()=>validateUpgrades(copy));}
 const copy=structuredClone(w);copy.learning.upgrades.restDays=[7,7];assert.throws(()=>validateUpgrades(copy));
});
test('media travels inside a course file and rejects active formats, oversized and mismatched attachments',()=>{
 const {data,state}=setup();data.topics[0].lessonMedia=[{id:'diagram',kind:'image',name:'circle.png',dataURL:'data:image/png;base64,aGVsbG8='},{id:'audio',kind:'audio',name:'intro.wav',dataURL:'data:audio/wav;base64,aGVsbG8='}];assert.deepEqual(validateCoursePack(exportCourseContent(data,state)).topics[0].lessonMedia,data.topics[0].lessonMedia);
 for(const url of ['https://other/image.png','data:image/svg+xml;base64,aGVsbG8=','data:text/html;base64,aGVsbG8='])assert.throws(()=>validateLessonMedia([{id:'x',kind:'image',name:'x',dataURL:url}]));
 assert.throws(()=>validateLessonMedia([{id:'x',kind:'audio',name:'x',dataURL:'data:image/png;base64,aGVsbG8='}]));
});
test('topics that reuse a task ID show only the media belonging to their own topic',()=>{
 const {data,state}=setup(),[first,second]=data.topics;assert.equal(first.tasks[0].id,second.tasks[0].id);first.lessonMedia=[{id:'diagram',kind:'image',name:'first.png',dataURL:'data:image/png;base64,aGVsbG8='}];assert.deepEqual(studyLessonMedia(data,state,second.id,second.tasks[0].id),[]);assert.deepEqual(studyLessonMedia(data,state,first.id,first.tasks[0].id),first.lessonMedia);assert.deepEqual(studyLessonMedia(data,state,first.id,'unavailable'),[]);
});
test('course comparison exposes order, wording, attachments, added and retired topics',()=>{
 const {data}=setup(),next=structuredClone(data);reorderTopic(next,next.topics[2].id,0);next.topics[0].scope='New explanation';next.topics.pop();next.topics.push({...data.topics[0],id:'new-topic'});const diff=compareCourseContent(data,next);assert.equal(diff.reordered,true);assert.equal(diff.added.length,1);assert.equal(diff.removed.length,1);assert.ok(diff.changed.some(t=>t.fields.includes('scope')));assert.throws(()=>inspectCourseText('{bad',validateCoursePack),/not readable JSON/);assert.ok(inspectCourseText(JSON.stringify(exportCourseContent(data,setup().state)),validateCoursePack).pack);
});
test('notebook outlines become short topic explanations while leaving the original page untouched',()=>{
 const {w}=setup(),page=newPage(w,{title:'Sketching'});page.blocks=[{type:'heading',text:'Perspective'},{type:'paragraph',text:'Draw a horizon and vanishing point.'},{type:'bullet',text:'Composition'},{type:'paragraph',text:'Arrange three objects.'},{type:'audio',text:'private recording'}];const before=structuredClone(page),outline=noteOutline(page),data=simpleCourse(page.title,outline);assert.equal(data.topics.length,2);assert.equal(data.topics[0].scope,'Draw a horizon and vanishing point.');assert.deepEqual(page,before);
});
test('snoozing updates only the review date and leaves interval, results and topic completion alone',()=>{
 const {data,w,state}=setup(),id=data.topics[0].id;markImportant(w,data.meta.course.id,id,true,'2026-10-01');const before=structuredClone(state),review=w.learning.important[data.meta.course.id][id],interval=review.interval;snoozeReview(w,data.meta.course.id,id,'2026-11-03','2026-11-02');assert.equal(review.interval,interval);assert.deepEqual(review.results,[]);assert.deepEqual(state,before);assert.equal(reviewQueue([{data,state}],w,'2026-11-02').length,0);assert.throws(()=>snoozeReview(w,data.meta.course.id,id,'2026-01-01','2026-11-02'));
});
test('study/break cycles pause, resume, take long breaks and never fabricate learning records',()=>{
 const {w,state}=setup(),before=structuredClone(state);let c={...ensureUpgrades(w).cycle,studyMinutes:1,breakMinutes:1,longBreakMinutes:2,longEvery:2};c=cycleStart(c,1000);c=cyclePause(c,31000);assert.equal(c.remainingMs,30000);c=cycleStart(c,50000);assert.equal(c.endsAt,80000);c=cycleTick(c,80000);assert.equal(c.phase,'break');c=cycleTick(c,140000);assert.equal(c.phase,'ready');assert.equal(c.endsAt,null);c=cycleTick(cycleStart(c,150000),210000);assert.equal(c.phase,'long-break');assert.equal(c.remainingMs,120000);assert.deepEqual(state,before);
});
test('streaks bridge planned rest dates, count real activity on rest dates and break on missed learning days',()=>{
 const dates=['2026-10-30','2026-10-31','2026-11-02'];assert.equal(learningStreak(dates,'2026-11-02',{enabled:true,restDays:[7]}),3);assert.equal(learningStreak(dates,'2026-11-02'),1);assert.equal(learningStreak(['2026-10-30'],'2026-11-02',{enabled:true,restDays:[6,7]}),1);assert.equal(learningStreak(dates,'2026-11-04',{enabled:true,restDays:[7]}),0);assert.equal(learningStreak([],'2026-11-02',{enabled:true,restDays:[1,2,3,4,5,6,7]}),0);
});
test('widget previews connect daily goal and quick note actions to real destinations',()=>{
 const {w}=setup();newPage(w,{title:'My recent idea'});const summary={minutes:10,goal:30,percent:33};assert.equal(widgetDescription('daily',summary,w).route,'day');assert.equal(widgetDescription('notes',summary,w).text,'My recent idea');assert.equal(widgetDescription('notes',summary,w).quickNote,true);
});
class FakeRecorder{
 static isTypeSupported(type){return type==='audio/webm';}
 constructor(){this.state='inactive';this.mimeType='audio/webm';}
 start(){this.state='recording';}
 stop(){this.state='inactive';queueMicrotask(()=>{this.ondataavailable({data:new Blob(['voice'])});this.onstop();});}
}
test('recording acquires audio only on Start and releases every track on Save and Cancel',async()=>{
 let acquired=0,released=0;const create=()=>new VoiceRecorder({Recorder:FakeRecorder,mediaDevices:{getUserMedia:async request=>{assert.deepEqual(request,{audio:true});acquired++;return {getTracks:()=>[{stop:()=>released++}]};}}});const r=create();assert.equal(acquired,0);await r.start();assert.equal(acquired,1);assert.equal((await r.stop()).size,5);assert.equal(released,1);const cancel=create();await cancel.start();assert.equal(await cancel.stop(true),null);assert.equal(released,2);
});
test('microphone permission failures are understandable and do not leave a running recorder',async()=>{
 const error=new Error('blocked');error.name='NotAllowedError';const r=new VoiceRecorder({Recorder:FakeRecorder,mediaDevices:{getUserMedia:async()=>{throw error;}}});await assert.rejects(()=>r.start(),/permission was denied/);assert.equal(r.recorder,null);assert.equal(r.stream,null);
});
test('closing a pending permission prompt cannot start an invisible recording later',async()=>{
 let approve,released=0;const r=new VoiceRecorder({Recorder:FakeRecorder,mediaDevices:{getUserMedia:()=>new Promise(resolve=>approve=resolve)}});const pending=r.start();await r.stop();approve({getTracks:()=>[{stop:()=>released++}]});await pending;assert.equal(r.recorder,null);assert.equal(released,1);
});
test('a real task completion counts as an active streak day without inventing any study minutes',()=>{
 const {data,state}=setup();finishWorkStep(data,state,data.topics[0].id,data.topics[0].tasks[0].id,'2026-11-02');assert.equal(learningStreak(activityDates(state),'2026-11-02'),1);assert.equal(state.sessions.length,0);
});
