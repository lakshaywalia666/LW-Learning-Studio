import {uid} from './model.js?v=studio47';
import {newCourse} from './workspace.js?v=studio47';

// User-facing input is a task name and explanation. Internal IDs remain stable.
function taskRow(title,explanation='',line=0){
 title=String(title??'').trim();explanation=String(explanation??'').trim();
 const at=line?'Line '+line+': ':'';
 if(!title||title.length>160)throw new Error(at+'Use a task/topic name of 1–160 characters.');
 if(explanation.length>20000)throw new Error(at+'Keep the explanation under 20,001 characters.');
 return {title,explanation,line};
}
export function parseTaskList(text){
 const rows=[];
 for(const [index,raw] of String(text??'').split(/\r\n?|\n/).entries()){
  const line=raw.trim().replace(/^(?:(?:[-*•–—]|\d+[.)])\s+)?\[[ xX]\]\s+|^(?:[-*•–—]|\d+[.)])\s+/,'').trim();
  if(!line)continue;
  const separator=/\t+|\s+\|\s+|:\s+/.exec(line);
  rows.push(taskRow(separator?line.slice(0,separator.index):line,separator?line.slice(separator.index+separator[0].length):'',index+1));
 }
 if(!rows.length)throw new Error('Write at least one task, one per line.');
 if(rows.length>10000)throw new Error('A course can have at most 10,000 tasks/topics.');
 return rows;
}
export function addTaskTopics(data,rows,{stageId=data.stages[0]?.id,minutes=25}={}){
 if(!Array.isArray(rows)||!rows.length)throw new Error('Write at least one task.');
 if(data.topics.length+rows.length>10000)throw new Error('A course can have at most 10,000 tasks/topics.');
 if(!data.stages.some(s=>s.id===stageId))throw new Error('Choose an existing course section.');
 minutes=Number(minutes);if(!Number.isInteger(minutes)||minutes<1||minutes>1440)throw new Error('Choose 1–1,440 whole minutes per task.');
 // Validate the complete batch before changing the course.
 const clean=rows.map(row=>taskRow(row.title,row.explanation,row.line));
 const topics=clean.map(({title,explanation})=>{
  const scope=explanation||'Learn about '+title+'.';
  return {id:uid('topic'),title,stage:stageId,domain:'CUSTOM',domainName:'Learning',route:'Core',hours:minutes/60,scope,practice:'',evidenceRequired:'',prerequisites:'None',requires:[],resources:[],projects:[],tools:[],initial:{included:true},tasks:[{id:'learn',title,kind:'Study',minutes,instructions:scope,checklist:[],resources:[],tools:[],projectId:'',required:true}]};
 });
 data.topics.push(...topics);return topics;
}
export function addSimpleTopics(data,text,options={}){return addTaskTopics(data,parseTaskList(text),options);}

export function simpleCourse(title,text='',description='',color='#9ac6d8'){
 const data=newCourse(title,description,color,['Tasks']);
 if(String(text).trim())addSimpleTopics(data,text);
 return data;
}
