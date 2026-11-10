import test from 'node:test';
import assert from 'node:assert/strict';
import {readProfiles,prepareProfileDisplay,profileKey} from '../public/profiles.js';
import {simpleCourse} from '../public/simple-course.js';
import {createWorkspace} from '../public/workspace.js';
import {finishWorkStep} from '../public/studio.js';
test('the old automatic display name can be cleaned without changing study data or storage keys',()=>{
 const data=simpleCourse('Drawing','Circles: Draw a circle.'),w=createWorkspace([data]),state=w.courses[data.meta.course.id];w.settings.name='Learner';state.settings.name='Learner';finishWorkStep(data,state,data.topics[0].id,'learn','2026-11-02');const before=structuredClone(state);prepareProfileDisplay(w);assert.equal(w.settings.name,'');assert.equal(state.settings.name,'');before.settings.name='';assert.deepEqual(state,before);assert.equal(profileKey('lw-studio-raw-v1','default'),'lw-studio-raw-v1');
});
test('profile wording cleanup retains existing IDs, selection and personal names',()=>{
 const id='learner-'+'a'.repeat(24),registry={version:1,activeId:id,profiles:[{id:'default',name:'Learner'},{id,name:'Alex'}]},read=readProfiles({getItem:()=>JSON.stringify(registry)});assert.equal(read.profiles[0].name,'My profile');assert.equal(read.profiles[1].name,'Alex');assert.equal(read.activeId,id);assert.equal(read.profiles[1].id,id);
});
