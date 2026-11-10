import test from 'node:test';import assert from 'node:assert/strict';
import {createWorkspace,workspaceBackup,parseWorkspaceBackup} from '../public/workspace.js';
import {ensureFocus,saveFocusPreferences,startFocus,finishFocus,focusCountdown,validateFocus} from '../public/focus-tools.js';
test('countdown reaches zero without finishing a session, awarding time or changing course progress',()=>{
 const w=createWorkspace(),now=new Date('2026-11-04T10:00:00Z'),session=startFocus(w,{minutes:2,intention:'Read one paragraph'},now),before=structuredClone(w.courses);
 assert.equal(focusCountdown(w,now).remaining,120000);assert.equal(focusCountdown(w,new Date(+now+30000)).remaining,90000);const end=focusCountdown(w,new Date(+now+180000));assert.equal(end.remaining,0);assert.equal(end.reached,true);assert.equal(w.learning.focus.sessions[0].endedAt,'');assert.deepEqual(w.courses,before);
 finishFocus(w,session.id,'A clear idea',new Date(+now+200000));assert.equal(focusCountdown(w),null);assert.deepEqual(w.courses,before);
});
test('notification is opt-in per profile, survives backup and handles older focus preferences',()=>{
 const w=createWorkspace();assert.equal(ensureFocus(w).preferences.notify,false);saveFocusPreferences(w,{notify:true});const restored=parseWorkspaceBackup(JSON.stringify(workspaceBackup(w)));assert.equal(restored.learning.focus.preferences.notify,true);assert.equal(ensureFocus(createWorkspace()).preferences.notify,false);
 delete restored.learning.focus.preferences.notify;validateFocus(restored);assert.equal(restored.learning.focus.preferences.notify,false);assert.throws(()=>saveFocusPreferences(w,{notify:'true'}),/preferences/);assert.equal(w.learning.focus.preferences.notify,true);
});
