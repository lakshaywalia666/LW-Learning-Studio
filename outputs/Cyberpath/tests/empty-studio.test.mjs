import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createWorkspace,validateWorkspace,workspaceBackup,parseWorkspaceBackup,newCourse,validateCoursePack,courseData,listCourses} from '../public/workspace.js';
import {initializeSetup,saveProfileName,finishSetup,needsSetup,enrolledCourseIds} from '../public/onboarding.js';
import {emptyStudioContext} from '../public/empty-studio.js';
import {createStartUI} from '../public/start-ui.js';
import {defaultState} from '../public/model.js';
import {companionSummary} from '../public/companion.js';
import {newPage,ensureLearning} from '../public/learning.js';

test('a fresh studio has no installed or hidden courses and can complete setup without one',()=>{
 const w=createWorkspace();initializeSetup(w,true);saveProfileName(w,'Alex');finishSetup(w);
 assert.equal(needsSetup(w),false);assert.deepEqual(w.courses,{});assert.deepEqual(w.customCourses,[]);assert.equal(w.settings.activeCourseId,'');
 assert.deepEqual(enrolledCourseIds(w),[]);assert.deepEqual(companionSummary([],w).courses,[]);
 const ctx=emptyStudioContext(w);assert.deepEqual(ctx.data.topics,[]);assert.deepEqual(ctx.data.stages,[]);assert.deepEqual(w.courses,{});
 const ui=createStartUI({workspace:()=>w,records:()=>[],allCourses:()=>[],editingName:()=>false,icon:()=>''});
 assert.match(ui.coursesView(true),/Open my studio/);assert.match(ui.homeView(),/Create your first course and add a task/);
 assert.doesNotMatch(ui.coursesView(true),/\.lw|data-action="import-course"/);
});

test('notes and preferences survive saving and restoring a studio with zero courses',()=>{
 const w=createWorkspace();initializeSetup(w,true);saveProfileName(w,'Noor');finishSetup(w);
 const {state}=emptyStudioContext(w);state.settings.theme='light';state.settings.dailyMinutes=45;
 newPage(w,{title:'App ideas'}).blocks[0].text='Build the app before adding content.';
 const copy=parseWorkspaceBackup(JSON.stringify(workspaceBackup(w)));
 assert.equal(copy.settings.name,'Noor');assert.equal(copy.settings.theme,'light');assert.equal(copy.settings.dailyMinutes,45);
 assert.equal(copy.learning.pages[0].blocks[0].text,'Build the app before adding content.');assert.equal(needsSetup(copy),false);
 assert.deepEqual(copy.courses,{});assert.deepEqual(copy.customCourses,[]);assert.equal(copy.settings.activeCourseId,'');
});

test('a course can be added later without replacing the empty studio profile or notebook',()=>{
 const w=createWorkspace();initializeSetup(w,true);saveProfileName(w,'Alex');finishSetup(w);newPage(w,{title:'Keep this note'});
 const content=newCourse('My course','');w.customCourses.push(content);w.courses[content.meta.course.id]=defaultState(content);finishSetup(w,content.meta.course.id);
 const copy=parseWorkspaceBackup(JSON.stringify(workspaceBackup(w)));
 assert.equal(listCourses([],copy).length,1);assert.deepEqual(courseData([],copy,content.meta.course.id).topics,[]);
 assert.equal(copy.settings.name,'Alex');assert.equal(copy.learning.pages[0].title,'Keep this note');
 assert.deepEqual(enrolledCourseIds(copy),[content.meta.course.id]);
});

test('restore validation keeps live catalog content unchanged and applies overrides only to the candidate',async()=>{
 const sample=JSON.parse(await fs.readFile(new URL('./fixtures/course.lw',import.meta.url),'utf8'));
 const catalog=[validateCoursePack(sample)],before=structuredClone(catalog),w=createWorkspace(catalog),id=catalog[0].meta.course.id;
 ensureLearning(w).courseOverrides={[id]:structuredClone(catalog[0])};w.learning.courseOverrides[id].topics[0].title='Candidate title';
 const candidate=parseWorkspaceBackup(JSON.stringify(workspaceBackup(w)),catalog);
 assert.deepEqual(catalog,before);assert.equal(courseData(catalog,candidate,id).topics[0].title,'Candidate title');
 w.courses[id].sessions=[{id:'bad',minutes:-1}];assert.throws(()=>validateWorkspace(w,catalog));assert.deepEqual(catalog,before);
});

test('backups with missing course content fail clearly instead of restoring orphaned records',()=>{
 const w=createWorkspace();w.courses.missing=defaultState({});assert.throws(()=>validateWorkspace(w),/missing the course content/);
 assert.throws(()=>parseWorkspaceBackup(JSON.stringify({format:'cyberpath-backup',state:{}})),/legacy backup needs its course content/);
});
