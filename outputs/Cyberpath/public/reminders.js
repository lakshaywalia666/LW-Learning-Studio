// Personal reminders deliberately never write course progress, study days or forest rewards.
import {normalizeReminderExtras,isReminderWorkday,calendarDayInZone} from './reminder-extras.js?v=studio47';
import {uid} from './model.js?v=studio47';
import {normalizeRepeatRule,customRepeatDay,shiftDay,daysBetween} from './schedule.js?v=studio47';
export const REPEAT_LABELS={none:'Does not repeat',daily:'Every day',weekly:'Every week',monthly:'Every month',yearly:'Every year',custom:'Custom schedule'};
export function localDay(now=new Date()){return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;}
export function validDay(value){if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||value<'1900-01-01')return false;const date=new Date(value+'T12:00:00');return Number.isFinite(date.getTime())&&localDay(date)===value;}
export const validTime=value=>value===''||typeof value==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(value);
const validId=value=>typeof value==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(value);
const stamp=value=>typeof value==='string'&&Number.isFinite(Date.parse(value));
const validSnooze=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)&&stamp(value);
export const LABEL_COLORS={theme:'var(--accent)',blue:'#386bdd',green:'#278763',purple:'#8a57c2',rose:'#bf4f77',orange:'#ad6e2e'};
export function ensureOrganizer(w){w.learning||={};if(w.learning.organizer===undefined)w.learning.organizer={version:1,items:[]};return w.learning.organizer;}
export function validateOrganizer(w){
 const o=ensureOrganizer(w);if(!o||o.version!==1||!Array.isArray(o.items)||o.items.length>10000)throw new Error('Keep up to 10,000 personal reminders.');
 const ids=new Set();for(const r of o.items){if(!r||!validId(r.id)||ids.has(r.id)||typeof r.title!=='string'||!r.title.trim()||r.title.length>240||typeof r.note!=='string'||r.note.length>5000||!(validDay(r.date)||r.date===''&&!r.notify&&!r.time&&r.repeat==='none')||!validTime(r.time)||typeof r.notify!=='boolean'||r.notify&&!r.time||!Object.hasOwn(REPEAT_LABELS,r.repeat)||!['pending','completed','archived'].includes(r.status)||!stamp(r.createdAt)||!stamp(r.updatedAt)||!Number.isInteger(r.editRevision)||r.editRevision<0||r.status==='completed'&&!stamp(r.completedAt)||r.status!=='completed'&&r.completedAt!==''||!Number.isInteger(r.anchorDay)||r.anchorDay<1||r.anchorDay>31||!Number.isInteger(r.anchorMonth)||r.anchorMonth<1||r.anchorMonth>12||r.nextId!==''&&!validId(r.nextId)||r.parentId!==''&&!validId(r.parentId))throw new Error('A reminder has invalid dates or details.');
  if(r.extra!==undefined)normalizeReminderExtras(r.extra);if(r.rule!==undefined)normalizeRepeatRule(r.rule);if(r.occurrence!==undefined&&(!Number.isInteger(r.occurrence)||r.occurrence<1||r.occurrence>10000)||r.list!==undefined&&(typeof r.list!=='string'||r.list.length>80)||r.priority!==undefined&&![0,1,2,3].includes(r.priority)||r.labelColor!==undefined&&!Object.hasOwn(LABEL_COLORS,r.labelColor)||r.alertDate!==undefined&&r.alertDate!==''&&!validDay(r.alertDate)||r.snoozedUntil!==undefined&&r.snoozedUntil!==''&&!validSnooze(r.snoozedUntil))throw new Error('Invalid reminder options.');ids.add(r.id);}
 const byId=new Map(o.items.map(r=>[r.id,r]));
 for(const r of o.items){if(r.nextId&&(!ids.has(r.nextId)||r.nextId===r.id||byId.get(r.nextId).parentId!==r.id||r.status!=='completed')||r.parentId&&(!ids.has(r.parentId)||r.parentId===r.id||byId.get(r.parentId).nextId!==r.id))throw new Error('A repeating reminder link is missing.');}
 const checked=new Set();for(const r of o.items){let current=r;const path=new Set();while(current&&!checked.has(current.id)){if(path.has(current.id))throw new Error('Repeating reminder history cannot contain a cycle.');path.add(current.id);current=byId.get(current.nextId);}for(const id of path)checked.add(id);}
 return o;
}
function fields(input){
 const title=String(input.title??'').trim(),note=String(input.note??'').trim(),date=input.date,time=input.time||'',repeat=input.repeat||'none',notify=Boolean(input.notify);
 if(!title||title.length>240)throw new Error('Add a title between 1 and 240 characters.');if(note.length>5000)throw new Error('Keep the note below 5,000 characters.');if(!(validDay(date)||date===''&&!time&&!notify&&repeat==='none'))throw new Error('Choose a real date, or leave an untimed reminder in Someday.');if(!validTime(time))throw new Error('Choose a valid time.');if(notify&&!time)throw new Error('Choose a time for the phone alert.');if(!Object.hasOwn(REPEAT_LABELS,repeat))throw new Error('Choose a repeat schedule.');
 const rule=normalizeRepeatRule({...input.rule,unit:repeat==='custom'?input.rule?.unit:({daily:'day',weekly:'week',monthly:'month',yearly:'year'}[repeat]||input.rule?.unit)}),list=String(input.list??'').trim(),priority=Number(input.priority??0),alertDate=input.alertDate||'';
 if(list.length>80||![0,1,2,3].includes(priority))throw new Error('Choose a valid list and priority.');if(alertDate&&!validDay(alertDate))throw new Error('Choose a valid alert date.');if(rule.endDate&&date&&rule.endDate<date)throw new Error('The repeat end date must follow its first date.');
 const labelColor=input.labelColor||'theme';if(!Object.hasOwn(LABEL_COLORS,labelColor))throw new Error('Choose a label colour.');return {title,note,date,time,repeat,notify,rule,list,priority,labelColor,alertDate,snoozedUntil:'',...(input.extra!==undefined?{extra:normalizeReminderExtras(input.extra)}:{})};
}
export function saveReminder(w,input,id='',now=new Date()){
 const o=ensureOrganizer(w),at=now.toISOString();let r=id?o.items.find(r=>r.id===id):null;const value=fields({...r,...input});
 if(id&&!r)throw new Error('This reminder is no longer available.');if(r&&r.status!=='pending')throw new Error('Reopen this reminder before editing it.');
 if(!r&&o.items.length>=10000)throw new Error('The reminder collection is full. Export a backup before adding more.');
 const anchorChanged=!r||r.date!==value.date||r.repeat!==value.repeat;
 if(!r){r={id:uid('reminder'),status:'pending',createdAt:at,completedAt:'',nextId:'',parentId:'',editRevision:0,occurrence:1};o.items.push(r);}
 if(id)r.editRevision++;Object.assign(r,value,{updatedAt:at});if(anchorChanged){r.anchorDay=Number(value.date.slice(8))||1;r.anchorMonth=Number(value.date.slice(5,7))||1;}return r;
}
export function nextReminderDay(r,after=localDay()){let candidate=nextBaseReminderDay(r,after);for(let i=0;candidate&&!isReminderWorkday(r,candidate);i++){if(i>3660)throw new Error('No matching repeat date was found within the next schedule.');candidate=nextBaseReminderDay(r,candidate);}return candidate;}
function nextBaseReminderDay(r,after=localDay()){
 if(r.repeat==='none')return '';
 const rule=normalizeRepeatRule(r.rule);if(rule.count&&(r.occurrence||1)>=rule.count)return '';
 if(r.repeat==='custom'||rule.afterCompletion||rule.interval!==1||rule.weekdays.length||rule.ordinal)return customRepeatDay({...r,rule:{...rule,unit:r.repeat==='custom'?rule.unit:({daily:'day',weekly:'week',monthly:'month',yearly:'year'}[r.repeat])}},after);
 const start=new Date(r.date+'T12:00:00'),limit=r.date>after?r.date:after,until=new Date(limit+'T12:00:00');
 if(r.repeat==='daily'||r.repeat==='weekly'){
  const step=r.repeat==='daily'?1:7,days=(Date.UTC(until.getFullYear(),until.getMonth(),until.getDate())-Date.UTC(start.getFullYear(),start.getMonth(),start.getDate()))/86400000;
  start.setDate(start.getDate()+(Math.floor(days/step)+1)*step);
 }else if(r.repeat==='monthly'){
  const jump=Math.max(1,(until.getFullYear()-start.getFullYear())*12+until.getMonth()-start.getMonth());start.setDate(1);start.setMonth(start.getMonth()+jump);start.setDate(Math.min(r.anchorDay,new Date(start.getFullYear(),start.getMonth()+1,0).getDate()));
  if(localDay(start)<=limit){start.setDate(1);start.setMonth(start.getMonth()+1);start.setDate(Math.min(r.anchorDay,new Date(start.getFullYear(),start.getMonth()+1,0).getDate()));}
 }else{
  start.setDate(1);start.setFullYear(start.getFullYear()+Math.max(1,until.getFullYear()-start.getFullYear()));start.setMonth(r.anchorMonth-1);start.setDate(Math.min(r.anchorDay,new Date(start.getFullYear(),r.anchorMonth,0).getDate()));
  if(localDay(start)<=limit){start.setDate(1);start.setFullYear(start.getFullYear()+1);start.setDate(Math.min(r.anchorDay,new Date(start.getFullYear(),r.anchorMonth,0).getDate()));}
 }
 const day=localDay(start);if(!validDay(day))throw new Error('The repeat date is outside the supported calendar.');return rule.endDate&&day>rule.endDate?'':day;
}
export function completeReminder(w,id,now=new Date()){
 const o=ensureOrganizer(w),r=o.items.find(r=>r.id===id);if(!r||r.status!=='pending')throw new Error('This reminder has already moved on.');
 const nextDate=nextReminderDay(r,calendarDayInZone(now,r.extra?.timeZone||'local'));if(nextDate&&(o.items.length>=10000||(r.occurrence||1)>=10000))throw new Error('The reminder collection or repeat history is full. Export a backup before starting a new reminder.');
 const at=now.toISOString();let next=null;if(nextDate){const alertDate=r.alertDate?shiftDay(nextDate,daysBetween(r.date,r.alertDate)):'';next={...structuredClone(r),id:uid('reminder'),date:nextDate,alertDate,snoozedUntil:'',occurrence:(r.occurrence||1)+1,status:'pending',completedAt:'',createdAt:at,updatedAt:at,nextId:'',parentId:r.id,editRevision:0};}
 r.status='completed';r.completedAt=at;r.updatedAt=at;r.nextId=next?.id||'';if(next)o.items.push(next);return {id:r.id,nextId:r.nextId};
}
export function undoReminder(w,id,now=new Date()){
 const o=ensureOrganizer(w),r=o.items.find(r=>r.id===id);if(!r||r.status!=='completed')throw new Error('Choose a completed reminder.');
 if(r.nextId){const next=o.items.find(n=>n.id===r.nextId);if(!next||next.status!=='pending'||next.editRevision!==0||next.nextId)throw new Error('The next occurrence has changed. Keep its history and create a separate reminder instead.');o.items=o.items.filter(n=>n.id!==r.nextId);}
 r.status='pending';r.completedAt='';r.nextId='';r.updatedAt=now.toISOString();return r;
}
export function archiveReminder(w,id,now=new Date()){const r=ensureOrganizer(w).items.find(r=>r.id===id);if(!r||r.status!=='pending')throw new Error('Choose an unfinished reminder.');r.status='archived';r.updatedAt=now.toISOString();return r;}
export function restoreReminder(w,id,now=new Date()){const r=ensureOrganizer(w).items.find(r=>r.id===id);if(!r||r.status!=='archived')throw new Error('Choose an archived reminder.');r.status='pending';r.updatedAt=now.toISOString();return r;}
export function snoozeReminder(w,id,until,now=new Date()){const r=ensureOrganizer(w).items.find(r=>r.id===id),date=new Date(until);if(!r||r.status!=='pending'||!r.notify||!r.time)throw new Error('Choose an unfinished reminder with a phone alert.');if(!Number.isFinite(+date)||date<=now||date.getFullYear()>9999)throw new Error('Choose a future snooze time.');r.snoozedUntil=date.toISOString();r.editRevision++;r.updatedAt=now.toISOString();return r;}
export function bulkReminders(w,ids,changes,now=new Date()){
 if(!Array.isArray(ids)||!ids.length||new Set(ids).size!==ids.length)throw new Error('Select reminders first.');const copy={learning:{organizer:structuredClone(ensureOrganizer(w))}},o=ensureOrganizer(copy);
 for(const id of ids){const r=o.items.find(r=>r.id===id);if(!r||r.status!=='pending')throw new Error('Bulk actions apply to unfinished reminders.');if(changes.archive)archiveReminder(copy,id,now);else{const patch={...changes};if(changes.date&&r.alertDate&&!Object.hasOwn(changes,'alertDate'))patch.alertDate=shiftDay(changes.date,daysBetween(r.date,r.alertDate));saveReminder(copy,{...r,...patch},id,now);}}validateOrganizer(copy);w.learning.organizer=o;return ids.length;
}
export function reminderRows(w,view='today',date=localDay()){
 const rows=ensureOrganizer(w).items.filter(r=>view==='completed'?r.status==='completed':view==='archived'?r.status==='archived':view==='day'?r.status!=='archived'&&r.date===date:r.status==='pending'&&(view==='someday'?r.date==='':view==='all'?true:view==='upcoming'?r.date>date:Boolean(r.date)&&r.date<=date));
 return rows.sort(view==='completed'?(a,b)=>b.completedAt.localeCompare(a.completedAt):(a,b)=>a.date.localeCompare(b.date)||(a.time||'99:99').localeCompare(b.time||'99:99')||a.createdAt.localeCompare(b.createdAt));
}
