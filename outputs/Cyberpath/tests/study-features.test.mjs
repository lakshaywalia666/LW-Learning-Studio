import test from 'node:test';
import assert from 'node:assert/strict';
import {simpleCourse} from '../public/simple-course.js';
import {createWorkspace,validateWorkspace,validateCoursePack,exportCourseContent} from '../public/workspace.js';
import {ensureLearning,globalSearch} from '../public/learning.js';
import {skipStudyTask,resumeStudyTasks,duplicateTopic,saveTaskNote,getTaskNote,validateRecall,addRecallAttempt,completedRecallTopic,courseQuality} from '../public/study-features.js';
import {workQueue,finishWorkStep} from '../public/studio.js';
import {courseSummary} from '../public/companion.js';
import {validateLessonMedia} from '../public/upgrades.js';
import {taskState} from '../public/course-tasks.js';
import {profileKey,createProfile,readProfiles,validateProfiles,saveProfiles,selectProfile} from '../public/profiles.js';
import {readState,writeState} from '../public/storage.js';
import {initializeProfiles} from '../public/profiles.js';
import {putLocal,getLocal,listLocal} from '../public/library-store.js';
const setup=()=>{const data=simpleCourse('Art','Shapes: Draw a circle.\nLight: Draw one shadow.\nColour: Mix two colours.'),w=createWorkspace([data]);ensureLearning(w);return {data,w,state:w.courses[data.meta.course.id],id:data.meta.course.id};};
const defer=(data,state,topic)=>skipStudyTask(data,state,topic.id,topic.tasks[0].id);
test('Skip for now advances only Study and preserves unfinished progress, dates and logged time',()=>{
 const {data,state,w}=setup(),[a,b]=data.topics;defer(data,state,a);assert.equal(workQueue(data,state).next.id,b.id);assert.equal(workQueue(data,state).tasksDone,0);assert.equal(taskState(state,a.id,a.tasks[0]).done,false);assert.equal(state.sessions.length,0);assert.deepEqual(state.days,{});assert.equal(validateWorkspace(w,[data]).courses[data.meta.course.id].studyDeferred.length,1);assert.equal(exportCourseContent(data,state).data.studyDeferred,undefined);
});
test('all skipped tasks remain an unfinished course and can be resumed without fake rewards',()=>{
 const {data,state}=setup();for(const topic of data.topics)defer(data,state,topic);const q=workQueue(data,state),s=courseSummary(data,state);assert.equal(q.next,null);assert.equal(q.deferredCount,3);assert.equal(q.tasksDone,0);assert.equal(s.courseComplete,false);assert.equal(s.completedTopics,0);assert.equal(s.percent,0);assert.match(s.nextTopic,/Skipped/);resumeStudyTasks(state);assert.equal(workQueue(data,state).next.id,data.topics[0].id);
});
test('Return to task focuses the chosen skipped task and the widget follows that same task',()=>{
 const {data,state}=setup(),[a,b,c]=data.topics;defer(data,state,b);resumeStudyTasks(state,b.id+'::'+b.tasks[0].id);assert.equal(workQueue(data,state).next.id,b.id);assert.equal(courseSummary(data,state).nextTopicId,b.id);finishWorkStep(data,state,b.id,b.tasks[0].id,'2026-11-02');assert.equal(taskState(state,a.id,a.tasks[0]).done,false);assert.equal(workQueue(data,state).next.id,a.id);defer(data,state,a);assert.equal(workQueue(data,state).next.id,c.id);
});
test('corrupt skipped records are rejected and completed tasks cannot be skipped again',()=>{
 const {data,state,w}=setup(),a=data.topics[0];finishWorkStep(data,state,a.id,a.tasks[0].id,'2026-11-02');assert.throws(()=>defer(data,state,a),/unfinished/);state.studyDeferred=['unknown::learn'];assert.throws(()=>validateWorkspace(w,[data]),/skipped/);state.studyDeferred=[];state.studyFocusKey='unknown::learn';assert.throws(()=>validateWorkspace(w,[data]),/selected study/);
});
test('duplicating a completed topic creates independent topic/task/check/media IDs without copying progress',()=>{
 const {data,state}=setup(),a=data.topics[0];a.tasks[0].checklist=[{id:'check-a',title:'Draw it',required:true}];a.lessonMedia=[{id:'m',kind:'image',name:'a.png',dataURL:'data:image/png;base64,aGVsbG8='}];a.recall={question:'What did you draw?',answer:'A circle.'};finishWorkStep(data,state,a.id,a.tasks[0].id,'2026-11-02');const before=structuredClone(state),copy=duplicateTopic(data,a.id);assert.notEqual(copy.id,a.id);assert.notEqual(copy.tasks[0].id,a.tasks[0].id);assert.notEqual(copy.tasks[0].checklist[0].id,'check-a');assert.notEqual(copy.lessonMedia[0].id,'m');assert.deepEqual(state,before);assert.equal(taskState(state,copy.id,copy.tasks[0]).done,false);assert.deepEqual(copy.recall,a.recall);copy.scope='Different';assert.notEqual(a.scope,copy.scope);validateCoursePack(exportCourseContent(data,state));
});
test('quick notes are learner data, survive a full workspace round trip and stay out of course content',()=>{
 const {data,state,w,id}=setup(),a=data.topics[0];saveTaskNote(w,id,a.id,'learn','Private observation — नमस्ते');const restored=validateWorkspace(w,[data]);assert.equal(getTaskNote(restored,id,a.id,'learn'),'Private observation — नमस्ते');assert.ok(!JSON.stringify(exportCourseContent(data,state)).includes('Private observation'));assert.equal(globalSearch([{data,state}],w,'नमस्ते')[0].kind,'task');saveTaskNote(w,id,a.id,'learn','');assert.equal(getTaskNote(w,id,a.id,'learn'),'');
});
test('quick notes distinguish reused task IDs, different topics and different courses',()=>{
 const {data,w,id}=setup(),[a,b]=data.topics;saveTaskNote(w,id,a.id,'learn','First note');saveTaskNote(w,id,b.id,'learn','Second note');assert.equal(getTaskNote(w,id,a.id,'learn'),'First note');assert.equal(getTaskNote(w,id,b.id,'learn'),'Second note');assert.equal(getTaskNote(w,'another-course',a.id,'learn'),'');assert.throws(()=>saveTaskNote(w,id,a.id,'learn','x'.repeat(10001)),/10,000/);
});
test('an optional recall question appears only when its topic tasks finish',()=>{
 const {data,state}=setup(),a=data.topics[0];a.recall={question:'Name a curved shape.',answer:'A circle.'};assert.equal(completedRecallTopic(data,state,a.id),null);finishWorkStep(data,state,a.id,a.tasks[0].id,'2026-11-02');assert.equal(completedRecallTopic(data,state,a.id),a);validateRecall(a.recall);assert.throws(()=>validateRecall({question:'Question',answer:''}),/suggested answer/);
});
test('recall self-checks preserve completion and time, and only the authored question is shared in a course',()=>{
 const {data,state,w,id}=setup(),a=data.topics[0];a.recall={question:'Which shape?',answer:'Circle'};const before=structuredClone(state);addRecallAttempt(w,{courseId:id,topicId:a.id,question:a.recall.question,answer:'My private answer',result:'practise'});assert.deepEqual(state,before);assert.equal(validateWorkspace(w,[data]).learning.recallAttempts.length,1);const shared=exportCourseContent(data,state);assert.equal(shared.data.topics[0].recall.question,'Which shape?');assert.ok(!JSON.stringify(shared).includes('My private answer'));assert.throws(()=>addRecallAttempt(w,{courseId:id,topicId:a.id,question:'Q',answer:'x',result:'automatic'}));
});
test('PDF worksheets travel inside .lw and reject wrong MIME or missing PDF headers',()=>{
 const {data,state}=setup(),pdf={id:'sheet',kind:'pdf',name:'worksheet.pdf',dataURL:'data:application/pdf;base64,'+btoa('%PDF-1.7\nWorksheet')};data.topics[0].lessonMedia=[pdf];assert.deepEqual(validateCoursePack(exportCourseContent(data,state)).topics[0].lessonMedia,[pdf]);assert.throws(()=>validateLessonMedia([{...pdf,dataURL:'data:application/pdf;base64,'+btoa('Not a PDF')}]),/readable PDF/);assert.throws(()=>validateLessonMedia([{...pdf,dataURL:'data:image/png;base64,aGVsbG8='}]));
});
test('export checks identify missing explanations and attachments without mutating the draft',()=>{
 const {data,state}=setup();data.topics[0].scope='';data.topics[0].tasks[0].instructions='';let pack=exportCourseContent(data,state),before=structuredClone(pack),report=courseQuality(pack,validateCoursePack);assert.equal(report.errors,0);assert.equal(report.warnings,1);assert.deepEqual(pack,before);pack.data.topics[0].lessonMedia=[{id:'missing',kind:'pdf',name:'Missing.pdf'}];report=courseQuality(pack,validateCoursePack);assert.ok(report.errors>0);assert.ok(report.issues.some(i=>i.message.includes('Missing.pdf')));
});
test('profile namespaces keep existing default paths and isolate every learner storage surface',()=>{
 const id='learner-'+'a'.repeat(24);for(const key of ['lw-studio-raw-v1','lw-studio-raw-recovery','lw-note-draft-page1','lw-sync-pairing','lw-studio-raw-workspace']){assert.equal(profileKey(key,'default'),key);assert.notEqual(profileKey(key,id),key);assert.ok(profileKey(key,id).endsWith(id));}for(const id of ['../default','constructor','__proto__','learner-../../x'])assert.throws(()=>profileKey('db',id));
});
test('profile creation preserves the existing learner and starts with independent metadata',()=>{
 const registry=readProfiles({getItem:()=>null}),before=structuredClone(registry),created=createProfile(registry,'  Second learner  ');assert.deepEqual(registry,before);assert.equal(created.registry.profiles.length,2);assert.equal(created.profile.name,'Second learner');assert.notEqual(created.profile.id,'default');assert.equal(created.registry.activeId,'default');assert.throws(()=>createProfile(registry,''));assert.throws(()=>validateProfiles({...registry,activeId:'missing'}));assert.throws(()=>validateProfiles({...registry,profiles:[...registry.profiles,...registry.profiles]}));
});
test('a rejected native profile switch restores device registry and tab selection',()=>{
 const previousStorage=globalThis.localStorage,previousSession=globalThis.sessionStorage,previousNative=globalThis.AndroidApp,values=new Map(),sessions=new Map();globalThis.localStorage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)};globalThis.sessionStorage={getItem:k=>sessions.get(k)||null,setItem:(k,v)=>sessions.set(k,v)};
 try{const created=createProfile(readProfiles(),'Other');saveProfiles(created.registry);globalThis.AndroidApp={setActiveProfile:()=>JSON.stringify({ok:false,error:'Finish the file request'})};assert.throws(()=>selectProfile(created.profile.id),/Finish/);assert.equal(readProfiles().activeId,'default');assert.equal(sessions.get('lw-active-learner'),'default');}finally{globalThis.localStorage=previousStorage;globalThis.sessionStorage=previousSession;globalThis.AndroidApp=previousNative;}
});
test('native storage calls carry the page learner identity and a stale page cannot write another learner',async()=>{
 const old=globalThis.AndroidApp;let active='default',writes=0,profileSeen=[];
 globalThis.AndroidApp={getState:profile=>{profileSeen.push(profile);return profile===active?JSON.stringify({version:2,revision:0}):JSON.stringify({nativeError:'Learner changed'});},saveState:(text,revision,profile)=>{profileSeen.push(profile);if(profile!==active)return JSON.stringify({ok:false,error:'Learner changed'});writes++;return JSON.stringify({ok:true,revision:revision+1,updatedAt:'2026-11-02T00:00:00Z'});},putLibraryRecord:(key,value,profile)=>{profileSeen.push(profile);return JSON.stringify(profile===active?{ok:true}:{ok:false,error:'Learner changed'});},getLibraryRecord:(key,profile)=>JSON.stringify(profile===active?{id:'note'}:{nativeError:'Learner changed'}),listLibraryRecords:(kind,profile)=>JSON.stringify(profile===active?[]:{nativeError:'Learner changed'})};
 try{assert.equal((await readState()).revision,0);await writeState({version:2},0);await putLocal('journal','event-1',{id:'event-1'});assert.ok(profileSeen.every(p=>p==='default'));active='learner-'+'a'.repeat(24);await assert.rejects(()=>writeState({version:2},1),/Learner changed/);await assert.rejects(()=>putLocal('journal','event-2',{id:'event-2'}),/Learner changed/);await assert.rejects(()=>getLocal('journal','event-1'),/Learner changed/);await assert.rejects(()=>listLocal('journal'),/Learner changed/);assert.equal(writes,1);}finally{globalThis.AndroidApp=old;}
});
test('initializing a tab pins its learner without changing the last learner selected in another tab',()=>{
 const oldStorage=globalThis.localStorage,oldSession=globalThis.sessionStorage,created=createProfile(readProfiles({getItem:()=>null}),'Other learner'),values=new Map(),session=new Map();created.registry.activeId=created.profile.id;values.set('lw-learner-profiles',JSON.stringify(created.registry));globalThis.localStorage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)};globalThis.sessionStorage={setItem:(k,v)=>session.set(k,v)};try{initializeProfiles();assert.equal(session.get('lw-active-learner'),'default');assert.equal(readProfiles().activeId,created.profile.id);}finally{globalThis.localStorage=oldStorage;globalThis.sessionStorage=oldSession;}
});
