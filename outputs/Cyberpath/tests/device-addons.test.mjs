import test from 'node:test';import assert from 'node:assert/strict';
import {createWorkspace} from '../public/workspace.js';import {saveReminder} from '../public/reminders.js';
import {reminderCalendarEvent} from '../public/device-addons.js';
test('calendar preview copies the due time in its chosen zone and keeps LW recurrence and progress untouched',()=>{
 const w=createWorkspace(),r=saveReminder(w,{title:'Book discussion',note:'Bring a page',date:'2026-11-04',time:'09:00',repeat:'daily',notify:true,alertDate:'2026-11-03',extra:{timeZone:'Asia/Kolkata',alerts:[0,60]}});r.snoozedUntil='2026-11-05T09:00:00.000Z';const before=JSON.stringify(w),event=reminderCalendarEvent(r,45);
 assert.equal(event.start,Date.parse('2026-11-04T03:30:00Z'));assert.equal(event.end-event.start,45*60000);assert.equal(event.title,r.title);assert.equal(event.timeZone,'Asia/Kolkata');assert.equal(event.allDay,false);assert.equal(event.description,'Bring a page');assert.equal(event.recurrence,undefined);assert.equal(JSON.stringify(w),before);
});
test('all-day events retain the intended calendar date, while invalid or undated requests fail',()=>{
 const w=createWorkspace(),r=saveReminder(w,{title:'A rest day',date:'2026-11-04',time:'',repeat:'none',notify:false,extra:{timeZone:'America/Los_Angeles'}}),event=reminderCalendarEvent(r);
 assert.equal(event.allDay,true);assert.equal(event.timeZone,'UTC');assert.equal(event.start,Date.parse('2026-11-04T00:00:00Z'));assert.equal(event.end,Date.parse('2026-11-05T00:00:00Z'));
 assert.throws(()=>reminderCalendarEvent({...r,date:''}),/dated/);assert.throws(()=>reminderCalendarEvent({...r,date:'2026-02-30'}),/valid/);assert.throws(()=>reminderCalendarEvent(r,3),/length/);assert.throws(()=>reminderCalendarEvent(r,NaN),/length/);
});
