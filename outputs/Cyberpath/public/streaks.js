const previous=value=>new Date(Date.parse(value+'T12:00:00Z')-86400000).toISOString().slice(0,10);
export function learningStreak(dates,today,{restDays=[],enabled=false}={}){
 const active=new Set(dates.filter(date=>date<=today));if(!active.size)return 0;
 let date=active.has(today)?today:previous(today),count=0;
 for(let i=0;i<36600;i++){
  if(active.has(date))count++;
  else if(!enabled||!restDays.includes(new Date(date+'T12:00:00Z').getUTCDay()||7))break;
  date=previous(date);
 }
 return count;
}

export function activityDates(state){return [...new Set([...(state.sessions||[]).filter(s=>s.minutes>0).map(s=>s.date),...Object.entries(state.days||{}).filter(([,day])=>day.tasks?.some(t=>t.done)).map(([date])=>date)])];}
