import {normalizeReminderExtras,zonedReminderInstant} from './reminder-extras.js?v=studio47';
export function reminderCalendarEvent(reminder,minutes=30){
 if(!reminder||!/^\d{4}-\d{2}-\d{2}$/.test(reminder.date)||!Number.isInteger(minutes)||minutes<5||minutes>1440)throw new Error('Choose a dated reminder and an event length of 5–1,440 minutes.');
 const options=normalizeReminderExtras(reminder.extra),allDay=!reminder.time,timeZone=allDay?'UTC':options.timeZone==='local'?new Intl.DateTimeFormat().resolvedOptions().timeZone:options.timeZone;
 // Resolve the due time, not an early alert or a snoozed notification.
 const start=allDay?zonedReminderInstant(reminder.date,'00:00','UTC'):zonedReminderInstant(reminder.date,reminder.time,timeZone),end=start+(allDay?86400000:minutes*60000);
 return {title:reminder.title,description:reminder.note||'',start,end,allDay,timeZone};
}
