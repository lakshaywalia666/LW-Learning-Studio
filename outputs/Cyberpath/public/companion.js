import {studyPendingEntry} from './study-features.js?v=studio47';
import {enrolledCourseIds} from './onboarding.js?v=studio47';
import {allTopics,topicProgress,isVerified,isoDate} from './model.js?v=studio47';
import {topicTasks,taskState,courseTaskQueue} from './course-tasks.js?v=studio47';
export const DEFAULT_DEVICE={reminder:{enabled:false,time:'19:00',days:[1,2,3,4,5,6],courseId:'active'},backup:{frequency:'daily',keep:14}};
export function devicePreferences(value={}){
 const r={...DEFAULT_DEVICE.reminder,...value.reminder},b={...DEFAULT_DEVICE.backup,...value.backup};
 if(typeof r.enabled!=='boolean'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(r.time)||!Array.isArray(r.days)||!r.days.length||r.days.some(d=>!Number.isInteger(d)||d<1||d>7)||typeof r.courseId!=='string'||!['daily','hourly','changes'].includes(b.frequency)||![7,14,30,60].includes(Number(b.keep)))throw new Error('Choose a valid reminder time, study days, and backup history size.');
 return{reminder:{...r,days:[...new Set(r.days)].sort()},backup:{frequency:b.frequency,keep:Number(b.keep)}};
}
export function courseTopicTrail(data,state){
 return allTopics(data,state).filter(topic=>{const p=topicProgress(topic,state);return p.included&&p.status!=='Parked';}).map(topic=>{const tasks=topicTasks(topic).filter(task=>task.required!==false),verified=isVerified(topic,state),done=tasks.filter(task=>verified||taskState(state,topic.id,task).done).length;return{topic,done,total:tasks.length,complete:done===tasks.length};});
}
export function courseSummary(data,state){
 const trail=courseTopicTrail(data,state),stages=data.stages.map(s=>({...s,total:0,completed:0}));let completedTopics=0,completedTasks=0,totalTasks=0,next=null;
 for(const{topic,done,total,complete}of trail){totalTasks+=total;completedTasks+=done;if(complete)completedTopics++;else if(topicTasks(topic).some(task=>task.required!==false&&!taskState(state,topic.id,task).done&&!(state.studyDeferred||[]).includes(topic.id+'::'+task.id)))next||=topic;const stage=stages.find(s=>s.id===topic.stage);if(stage){stage.total++;if(complete)stage.completed++;}}
 const queued=studyPendingEntry(courseTaskQueue(data,state),state);next=queued?.topic||null;return{id:data.meta.course.id,title:data.meta.course.title,color:data.meta.course.color,completedTopics,totalTopics:trail.length,completedTasks,totalTasks,percent:totalTasks?Math.round(completedTasks/totalTasks*100):0,nextTopic:next?.title||(trail.some(t=>!t.complete)?'Skipped tasks are waiting':'Your selected path is complete'),nextTopicId:next?.id||'',nextTask:queued?.task.title||'',nextTaskId:courseTaskQueue(data,state).find(t=>!t.done)?.task.id||'',completedStages:stages.filter(s=>s.total>0&&s.completed===s.total).length,stages,courseComplete:trail.length>0&&completedTopics===trail.length};
}

export function companionSummary(catalog,workspace){
 const enrolled=new Set(enrolledCourseIds(workspace)),courses=[...catalog,...workspace.customCourses].filter(source=>enrolled.has(source.meta.course.id)).map(source=>{const id=source.meta.course.id,state=workspace.courses[id],data={...source,stages:[...source.stages,...(state.custom.stages||[])]};return courseSummary(data,state);});
 return{version:1,updatedAt:new Date().toISOString(),activeCourseId:workspace.settings.activeCourseId,courses};
}
export function forestMilestones(records){
 const summaries=records.map(r=>r.summary||courseSummary(r.data,r.state)),topics=summaries.reduce((n,s)=>n+s.completedTopics,0),stages=summaries.reduce((n,s)=>n+s.completedStages,0),courses=summaries.filter(s=>s.courseComplete).length;
 return[
 {id:'flowers',name:'Wildflowers',description:'Complete your first topic.',value:topics,target:1,unlocked:topics>=1},
 {id:'trail',name:'Woodland trail',description:'Complete a course section.',value:stages,target:1,unlocked:stages>=1},
 {id:'fireflies',name:'Firefly glade',description:'Complete ten topics.',value:topics,target:10,unlocked:topics>=10},
 {id:'pond',name:'Reflection pond',description:'Complete three course sections.',value:stages,target:3,unlocked:stages>=3},
 {id:'pavilion',name:'Learning pavilion',description:'Complete one selected course path.',value:courses,target:1,unlocked:courses>=1}
 ];
}
const idsIn=(text,known)=>[...new Set((String(text||'').match(/[A-Za-z0-9_-]+/g)||[]).filter(id=>known.has(id)))];
export function validatePrerequisites(data){
 for(const[kind,rows]of [['stages',data.stages],['topics',data.topics]]){
  const ids=new Set(rows.map(r=>r.id)),adj=new Map();for(const row of rows){if(row.requires!==undefined&&(!Array.isArray(row.requires)||row.requires.some(id=>typeof id!=='string'||!ids.has(id)||id===row.id)))throw new Error(kind+'.'+row.id+'.requires: use IDs of other '+kind+' in this course.');if(row.requires)row.requires=[...new Set(row.requires)];adj.set(row.id,row.requires||[]);}
  const remaining=new Map([...adj].map(([id,parents])=>[id,parents.length])),children=new Map();for(const[id,parents]of adj)for(const parent of parents){if(!children.has(parent))children.set(parent,[]);children.get(parent).push(id);}const queue=[...remaining].filter(([,n])=>n===0).map(([id])=>id);let count=0;for(let i=0;i<queue.length;i++){const id=queue[i];count++;for(const child of children.get(id)||[]){remaining.set(child,remaining.get(child)-1);if(remaining.get(child)===0)queue.push(child);}}if(count!==rows.length)throw new Error(kind+': prerequisite cycle detected.');
 }
 return data;
}
export function knowledgeMap(data,state,{stageId='',query='',focusId=''}={}){
 const summary=courseSummary(data,state),all=allTopics(data,state),stageMode=!stageId,known=new Set((stageMode?data.stages:all).map(r=>r.id));let rows=stageMode?data.stages:all.filter(t=>t.stage===stageId);
 if(query.trim())rows=rows.filter(r=>(r.id+' '+r.title).toLowerCase().includes(query.trim().toLowerCase()));const total=rows.length,focus=rows.find(row=>row.id===focusId);rows=rows.slice(0,120);if(focus&&!rows.some(row=>row.id===focusId))rows=[...rows.slice(0,119),focus];const shown=rows.length,selected=new Set(rows.map(r=>r.id)),context=[];const source=stageMode?data.stages:all,lookup=new Map(source.map(r=>[r.id,r]));for(const row of rows)for(const parent of row.requires??idsIn(row.prerequisites,known))if(!selected.has(parent)&&lookup.has(parent)&&context.length<60&&!context.some(r=>r.id===parent))context.push({...lookup.get(parent),context:true});rows=[...context,...rows];const visible=new Set(rows.map(r=>r.id)),edges=[];
 for(const row of rows){const parents=row.requires??idsIn(row.prerequisites,known);for(const from of parents)if(from!==row.id&&visible.has(from))edges.push({from,to:row.id,kind:'prerequisite'});}
 if(!edges.length&&!query.trim())for(let i=1;i<rows.length;i++)edges.push({from:rows[i-1].id,to:rows[i].id,kind:'sequence'});
 const actual=edges.filter(e=>e.kind==='prerequisite'),ranks=new Map(rows.map(r=>[r.id,0]));for(let pass=0;pass<rows.length;pass++){let changed=false;for(const e of actual){const rank=Math.min(rows.length-1,(ranks.get(e.from)||0)+1);if(rank>(ranks.get(e.to)||0)){ranks.set(e.to,rank);changed=true;}}if(!changed)break;}
 const groups=new Map();rows.forEach(r=>{const rank=actual.length?ranks.get(r.id):0;if(!groups.has(rank))groups.set(rank,[]);groups.get(rank).push(r);});let y=30;const nodes=[];
 for(const[,group]of [...groups].sort(([a],[b])=>a-b)){group.forEach((row,i)=>{let done=0,count=0;if(stageMode){const s=summary.stages.find(s=>s.id===row.id);done=s?.completed||0;count=s?.total||0;}else{const defs=topicTasks(row).filter(t=>t.required!==false);done=defs.filter(t=>isVerified(row,state)||taskState(state,row.id,t).done).length;count=defs.length;}
 nodes.push({id:row.id,title:row.title,type:stageMode?'stage':'topic',x:(765-(Math.min(3,group.length-Math.floor(i/3)*3)*218+(Math.min(3,group.length-Math.floor(i/3)*3)-1)*26))/2+(i%3)*244,y:y+Math.floor(i/3)*145,width:218,height:105,done,total:count,context:Boolean(row.context),prerequisites:String(row.prerequisites||'None'),requires:row.requires||[],stage:row.stage});});y+=Math.ceil(group.length/3)*145;}
 return{nodes,edges,total,shown,contextCount:context.length,width:765,height:Math.max(210,y+25),stageMode};
}
export function nextReminder(time,days,now=new Date()){
 if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)||!Array.isArray(days)||!days.length)return null;const[h,m]=time.split(':').map(Number);
 for(let i=0;i<8;i++){const next=new Date(now);next.setDate(now.getDate()+i);next.setHours(h,m,0,0);const weekday=next.getDay()||7;if(days.includes(weekday)&&next>now)return next;}return null;
}
