import {writeFile} from 'node:fs/promises';
import {saveReminder,nextReminderDay} from '../outputs/Cyberpath/public/reminders.js';
import {calendarDayInZone} from '../outputs/Cyberpath/public/reminder-extras.js';
const cases=[];const now=new Date('2026-11-05T12:00:00Z');
for(const date of ['2024-01-31','2024-02-29','2026-11-01'])for(const repeat of ['daily','weekly','monthly','yearly','custom'])for(const afterCompletion of [false,true]){
 const w={learning:{}},r=saveReminder(w,{title:'Parity fixture',note:'',date,time:'18:00',notify:true,repeat,rule:{unit:'month',interval:afterCompletion?2:1,afterCompletion},extra:{timeZone:'Asia/Kolkata',workdays:[1,2,3,4,5],holidays:['2026-11-06']}},'',now);let expected,expectedError=false;try{expected=nextReminderDay(r,calendarDayInZone(now,r.extra.timeZone));}catch{expectedError=true;}cases.push({row:r,now:now.toISOString(),expected:expected||'',expectedError});
}
for(const ordinal of ['1','2','3','4','last']){const w={learning:{}},r=saveReminder(w,{title:'Ordinal fixture',note:'',date:'2026-10-01',time:'18:00',notify:true,repeat:'custom',rule:{unit:'month',weekdays:[1],ordinal,interval:2},extra:{timeZone:'UTC'}},'',now);cases.push({row:r,now:now.toISOString(),expected:nextReminderDay(r,calendarDayInZone(now,'UTC'))});}
for(const rule of [{unit:'week',weekdays:[0,2,5],interval:3},{unit:'day',count:1},{unit:'day',endDate:'2026-11-02'}]){const w={learning:{}},r=saveReminder(w,{title:'End fixture',note:'',date:'2026-11-01',time:'18:00',notify:true,repeat:'custom',rule,extra:{timeZone:'America/New_York'}},'',now);cases.push({row:r,now:now.toISOString(),expected:nextReminderDay(r,calendarDayInZone(now,r.extra.timeZone))});}
{const w={learning:{}},r=saveReminder(w,{title:'Calendar boundary',note:'',date:'9999-12-31',time:'18:00',notify:true,repeat:'yearly'},'',now);cases.push({row:r,now:now.toISOString(),expected:'',expectedError:true});}
const serialized=JSON.stringify(cases);if(serialized.length>60000)throw new Error('Split Java fixture constant');
const java=`package com.cyberpath.learning;\npublic final class NativeReminderCases {public static final String JSON=${JSON.stringify(serialized)};}\n`;
await writeFile(new URL('../outputs/Cyberpath/tests/android/NativeReminderCases.java',import.meta.url),java);console.log(cases.length+' cross-language recurrence cases prepared from the JS model.');
