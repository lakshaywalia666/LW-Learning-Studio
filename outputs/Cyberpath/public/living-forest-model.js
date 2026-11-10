import {courseTopicTrail,courseSummary,forestMilestones} from './companion.js?v=studio47';
import {topicTasks,taskState} from './course-tasks.js?v=studio47';
import {topicProgress,isVerified} from './model.js?v=studio47';
export function forestSeed(text){let n=2166136261;for(const char of String(text)){n^=char.charCodeAt(0);n=Math.imul(n,16777619);}return n>>>0;}
export function forestRandom(seed){let s=seed>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
export function livingForestModel(records){
 const columns=Math.min(3,Math.max(1,records.length)),rows=Math.ceil(records.length/columns),plots=records.map((record,index)=>{
  const summary=courseSummary(record.data,record.state),trail=courseTopicTrail(record.data,record.state),row=Math.floor(index/columns),count=Math.min(columns,records.length-row*columns),x=(index%columns-(count-1)/2)*700,y=(row-(rows-1)/2)*450,seed=forestSeed(record.course.id);
  const topics=trail.filter(t=>t.complete).map(({topic,done,total},i)=>{
   const definitions=topicTasks(topic).filter(t=>t.required!==false),dates=definitions.map(t=>taskState(record.state,topic.id,t).completedDate).filter(Boolean),p=topicProgress(topic,record.state),angle=i*2.399963+seed%100,radius=70+14*Math.sqrt(i+1);
   return{id:topic.id,title:topic.title,courseId:record.course.id,completedDate:isVerified(topic,record.state)?p.demonstratedDate:dates.sort().at(-1)||'',tasks:done,total,minutes:record.state.sessions.filter(s=>s.topicId===topic.id).reduce((n,s)=>n+s.minutes,0),verified:isVerified(topic,record.state),x:x+Math.cos(angle)*radius,y:y+65+Math.sin(angle)*radius*.6};
  });
  // Completion always controls the grove. Logged time never invents a completed topic.
  const growth=Math.min(1,Math.log2(1+summary.completedTopics+summary.completedTasks/6)/6),height=summary.completedTasks?125+growth*230:58,trees=summary.completedTopics?Math.min(24,1+Math.ceil(summary.completedTopics/3)):0;
  return{id:record.course.id,title:record.course.title,color:record.course.color||'#8bdbb4',x,y,seed,summary,topics,growth,height,trees,radius:190+Math.min(240,Math.sqrt(topics.length)*12),next:trail.find(t=>!t.complete)?.topic||null};
 });
 const bounds=plots.length?{left:Math.min(...plots.map(p=>p.x-p.radius)),right:Math.max(...plots.map(p=>p.x+p.radius)),top:Math.min(...plots.map(p=>p.y-370)),bottom:Math.max(...plots.map(p=>p.y+p.radius*.6+100))}:{left:-350,right:350,top:-300,bottom:200};
 return{plots,bounds,rewards:forestMilestones(records),completedTopics:plots.reduce((n,p)=>n+p.topics.length,0),completedTasks:plots.reduce((n,p)=>n+p.summary.completedTasks,0)};
}
export function hitForestTopic(model,x,y,radius=20){let best=null,distance=radius;for(const plot of model.plots)for(const topic of plot.topics){const d=Math.hypot(topic.x-x,topic.y-y);if(d<distance){best=topic;distance=d;}}return best;}
