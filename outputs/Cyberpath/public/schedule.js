const pad=n=>String(n).padStart(2,'0');
export const calendarDay=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
export function realDay(v){if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v)||v<'1900-01-01')return false;const d=new Date(v+'T12:00:00');return Number.isFinite(+d)&&calendarDay(d)===v;}
export function shiftDay(day,days){if(!realDay(day)||!Number.isInteger(days))throw new Error('Choose a valid calendar date.');const d=new Date(day+'T12:00:00');d.setDate(d.getDate()+days);const result=calendarDay(d);if(!realDay(result))throw new Error('The date is outside the supported calendar.');return result;}
const dayNumber=day=>{const d=new Date(day+'T12:00:00');return Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000;};
export const daysBetween=(a,b)=>dayNumber(b)-dayNumber(a);
export function normalizeRepeatRule(value={}){
 if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Choose a valid repeat rule.');
 const rule={unit:value.unit??'day',interval:Number(value.interval??1),weekdays:value.weekdays??[],ordinal:value.ordinal??'',endDate:value.endDate??'',count:Number(value.count??0),afterCompletion:value.afterCompletion??false};
 if(!['day','week','month','year'].includes(rule.unit)||!Number.isInteger(rule.interval)||rule.interval<1||rule.interval>365||!Array.isArray(rule.weekdays)||new Set(rule.weekdays).size!==rule.weekdays.length||rule.weekdays.some(n=>!Number.isInteger(n)||n<0||n>6)||!['','1','2','3','4','last'].includes(rule.ordinal)||rule.ordinal&&(rule.unit!=='month'||rule.weekdays.length!==1)||rule.weekdays.length&&!['week','month'].includes(rule.unit)||rule.unit==='month'&&rule.weekdays.length&&!rule.ordinal||rule.endDate&&!realDay(rule.endDate)||!Number.isInteger(rule.count)||rule.count<0||rule.count>10000||typeof rule.afterCompletion!=='boolean')throw new Error('Choose valid repeat days, interval and ending. Monthly weekdays need a position.');return rule;
}
export function customRepeatDay(r,after){
 const rule=normalizeRepeatRule(r.rule),base=rule.afterCompletion?after:r.date,limit=base>after?base:after;
 if(rule.count&&(r.occurrence||1)>=rule.count)return '';
 const begin=new Date(base+'T12:00:00'),until=new Date(limit+'T12:00:00');let candidate;
 if(rule.unit==='day')candidate=shiftDay(base,(Math.floor(daysBetween(base,limit)/rule.interval)+1)*rule.interval);
 else if(rule.unit==='week'){
  const selected=rule.weekdays.length?rule.weekdays:[begin.getDay()],anchor=dayNumber(base)-(begin.getDay()+6)%7;let step=1;
  while(step<=rule.interval*7+7){const d=shiftDay(limit,step++),date=new Date(d+'T12:00:00'),week=Math.floor((dayNumber(d)-anchor)/7);if(week%rule.interval===0&&selected.includes(date.getDay())){candidate=d;break;}}
 }else if(rule.unit==='month'){
  const elapsed=(until.getFullYear()-begin.getFullYear())*12+until.getMonth()-begin.getMonth(),start=Math.floor(elapsed/rule.interval)*rule.interval;
  for(let n=start;n<=start+rule.interval*2;n+=rule.interval){const d=new Date(begin);d.setDate(1);d.setMonth(begin.getMonth()+n);
   if(rule.ordinal){const weekday=rule.weekdays[0];if(rule.ordinal==='last'){d.setMonth(d.getMonth()+1,0);d.setDate(d.getDate()-(d.getDay()-weekday+7)%7);}else d.setDate(1+(weekday-d.getDay()+7)%7+(Number(rule.ordinal)-1)*7);}
   else d.setDate(Math.min(rule.afterCompletion?begin.getDate():r.anchorDay,new Date(d.getFullYear(),d.getMonth()+1,0).getDate()));
   if(calendarDay(d)>limit){candidate=calendarDay(d);break;}
  }
 }else{
  const elapsed=until.getFullYear()-begin.getFullYear(),start=Math.floor(elapsed/rule.interval)*rule.interval;
  for(let n=start;n<=start+rule.interval;n+=rule.interval){const year=begin.getFullYear()+n,month=rule.afterCompletion?begin.getMonth()+1:r.anchorMonth,day=rule.afterCompletion?begin.getDate():r.anchorDay;const d=new Date(year,month-1,Math.min(day,new Date(year,month,0).getDate()),12);if(calendarDay(d)>limit){candidate=calendarDay(d);break;}}
 }
 if(!candidate||!realDay(candidate))throw new Error('The repeat date is outside the supported calendar.');return rule.endDate&&candidate>rule.endDate?'':candidate;
}
// Only explicit supported phrases are parsed. The UI always previews before saving.
export function parseReminderText(raw,now=new Date()){
 let title=String(raw||'').trim();if(!title||title.length>1000)throw new Error('Write a short reminder.');let date='',time='',repeat='none';const today=calendarDay(now);
 const consume=match=>{title=(title.slice(0,match.index)+' '+title.slice(match.index+match[0].length)).replace(/\s+/g,' ').trim();};
 let m=title.match(/\b(?:at\s+)?(1[0-2]|0?[1-9])(?::([0-5]\d))?\s*(am|pm)\b/i);if(m){let hour=Number(m[1])%12;if(m[3].toLowerCase()==='pm')hour+=12;time=pad(hour)+':'+(m[2]||'00');consume(m);}else if((m=title.match(/\b(?:at\s+)?([01]\d|2[0-3]):([0-5]\d)\b/))){time=m[1]+':'+m[2];consume(m);}
 if((m=title.match(/\b(\d{4}-\d{2}-\d{2})\b/))){if(!realDay(m[1]))throw new Error('That calendar date does not exist.');date=m[1];consume(m);}
 else if((m=title.match(/\b(today|tomorrow)\b/i))){date=shiftDay(today,m[1].toLowerCase()==='today'?0:1);consume(m);}
 else if((m=title.match(/\bin (\d{1,4}) (day|week)s?\b/i))){date=shiftDay(today,Number(m[1])*(m[2].toLowerCase()==='week'?7:1));consume(m);}
 else if((m=title.match(/\bnext (sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i))){const target=['sunday','monday','tuesday','wednesday','thursday','friday','saturday'].indexOf(m[1].toLowerCase());date=shiftDay(today,(target-now.getDay()+7)%7||7);consume(m);}
 if((m=title.match(/\bevery (day|week|month|year)\b/i))){repeat={day:'daily',week:'weekly',month:'monthly',year:'yearly'}[m[1].toLowerCase()];consume(m);date||=today;}
 if(!date&&time)date=today;if(!title)throw new Error('Add what you want to remember as well as its date.');return {title,date,time,repeat,note:'',notify:false,recognized:Boolean(date||time||repeat!=='none')};
}
export {remindersICS,parseCalendarICS} from './calendar-io.js?v=studio47';