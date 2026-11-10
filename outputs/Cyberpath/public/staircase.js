import {courseSummary,courseTopicTrail} from './companion.js?v=studio47';
export const STAIRS_PER_LEVEL=10;
export function stairLevel(climbed,total){
 const levels=Math.max(1,Math.ceil(total/STAIRS_PER_LEVEL)),level=Math.min(levels,Math.floor(climbed/STAIRS_PER_LEVEL)+1),start=(level-1)*STAIRS_PER_LEVEL,end=Math.min(total,level*STAIRS_PER_LEVEL),span=end-start,complete=total>0&&climbed===total;
 return{level,levels,start,end,remaining:Math.max(0,end-climbed),percent:span?Math.round(Math.max(0,Math.min(span,climbed-start))/span*100):0,complete};
}
export function staircaseTopics(data,state){
 const trail=courseTopicTrail(data,state);
 return[...trail.filter(row=>row.complete),...trail.filter(row=>!row.complete)].map((row,i)=>({number:i+1,topicId:row.topic.id,title:row.topic.title,stage:row.topic.stage,climbed:row.complete,tasksDone:row.done,tasksTotal:row.total}));
}
export function topicStair(data,state,topicId){return staircaseTopics(data,state).find(step=>step.topicId===topicId)||null;}
export function staircaseProgress(data,state,requestedLevel=0){
 const summary=courseSummary(data,state),climbed=summary.completedTopics,total=summary.totalTopics,position=stairLevel(climbed,total),viewedLevel=Math.max(1,Math.min(position.levels,Math.trunc(Number(requestedLevel))||position.level)),first=(viewedLevel-1)*STAIRS_PER_LEVEL;
 return{...summary,climbed,total,...position,viewedLevel,first,steps:staircaseTopics(data,state).slice(first,first+STAIRS_PER_LEVEL).map(step=>({...step,current:step.number===climbed,next:step.number===climbed+1}))};
}
