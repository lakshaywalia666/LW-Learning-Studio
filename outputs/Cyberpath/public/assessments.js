import {uid} from './model.js?v=studio47';
const id=v=>typeof v==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(v)&&!['__proto__','prototype','constructor'].includes(v);
const text=(v,n)=>typeof v==='string'&&v.length<=n;
const stamp=v=>typeof v==='string'&&Number.isFinite(Date.parse(v));
const clean=v=>String(v??'').trim();
const normalized=v=>clean(v).replace(/\s+/g,' ').toLowerCase();
export function ensureAssessments(w){w.learning||={};if(w.learning.assessments===undefined)w.learning.assessments={version:1,questions:[],sessions:[]};return w.learning.assessments;}
function validateQuestion(q){
 if(!q||!id(q.id)||!text(q.prompt,10000)||!q.prompt.trim()||!text(q.subject,160)||!text(q.skill,160)||!text(q.explanation,10000)||!['choice','text','number'].includes(q.type)||!['easy','medium','hard'].includes(q.difficulty)||typeof q.archived!=='boolean'||!stamp(q.createdAt)||!stamp(q.updatedAt))throw new Error('Add a question, subject and valid answer details.');
 if(!Array.isArray(q.options)||q.options.length>10||q.options.some(o=>!text(o,1000))||!Array.isArray(q.accepted)||q.accepted.length>30||q.accepted.some(o=>!text(o,2000)))throw new Error('Keep choices and accepted answers within their size limits.');
 if(q.type==='choice'&&(!Array.isArray(q.options)||q.options.length<2||q.options.length>10||q.options.some(o=>!text(o,1000)||!o.trim())||!Number.isInteger(q.correct)||q.correct<0||q.correct>=q.options.length))throw new Error('Add 2–10 choices and the correct choice number.');
 if(q.type==='text'&&(!Array.isArray(q.accepted)||!q.accepted.length||q.accepted.length>30||q.accepted.some(a=>!text(a,2000)||!a.trim())))throw new Error('Add up to 30 accepted answers, one per line.');
 if(q.type==='number'){const n=q.numeric;if(!n||!['tolerance','range'].includes(n.mode)||!text(n.unit,40)||!Number.isFinite(n.value)||!Number.isFinite(n.tolerance)||n.tolerance<0||!Number.isFinite(n.min)||!Number.isFinite(n.max)||n.min>n.max)throw new Error('Use finite numbers, a non-negative tolerance and an ordered range.');}
 return q;
}
function validateAnswer(q,value){if(!text(value,q.type==='text'?2000:240)||q.type==='choice'&&value!==''&&(!/^\d$/.test(value)||Number(value)>=q.options.length))throw new Error('Enter a valid answer.');}
export function validateAssessments(w){
 const a=ensureAssessments(w);if(!a||a.version!==1||!Array.isArray(a.questions)||a.questions.length>5000||!Array.isArray(a.sessions)||a.sessions.length>200)throw new Error('Invalid question or test collection.');
 const ids=new Set();for(const q of a.questions){validateQuestion(q);if(ids.has(q.id))throw new Error('Repeated question ID.');ids.add(q.id);}const sessionIds=new Set();let active=0;
 for(const s of a.sessions){if(!s||!id(s.id)||sessionIds.has(s.id)||!text(s.title,240)||!s.title.trim()||!['active','finished'].includes(s.status)||!stamp(s.startedAt)||!text(s.finishedAt,40)||s.finishedAt&&!stamp(s.finishedAt)||!text(s.endsAt,40)||s.endsAt&&(!stamp(s.endsAt)||Date.parse(s.endsAt)<=Date.parse(s.startedAt)||Date.parse(s.endsAt)-Date.parse(s.startedAt)>240*60000)||!Array.isArray(s.questions)||s.questions.length<1||s.questions.length>50||!Array.isArray(s.answers)||s.answers.length!==s.questions.length||!Array.isArray(s.results)||s.status==='active'&&(s.results.length||s.finishedAt)||s.status==='finished'&&(s.results.length!==s.questions.length||!s.finishedAt))throw new Error('Invalid saved test.');sessionIds.add(s.id);if(s.status==='active')active++;const seen=new Set();for(let i=0;i<s.questions.length;i++){const q=validateQuestion(s.questions[i]),answer=s.answers[i];if(seen.has(q.id)||!answer||answer.questionId!==q.id)throw new Error('Invalid test answer links.');seen.add(q.id);validateAnswer(q,answer.value);if(s.status==='finished'){const r=s.results[i],expected=checkAnswer(q,answer.value);if(!r||r.questionId!==q.id||r.correct!==expected.correct||r.given!==answer.value||r.expected!==expected.expected)throw new Error('Test results do not match the saved answers.');}}}
 if(active>1)throw new Error('Finish the current test before starting another.');return a;
}
export function saveQuestion(w,value,questionId='',now=new Date()){
 const a=ensureAssessments(w),old=a.questions.find(q=>q.id===questionId);if(questionId&&!old)throw new Error('This question is unavailable.');
 const options=Array.isArray(value.options)?value.options:String(value.options||'').split(/\r?\n/).map(clean).filter(Boolean),accepted=Array.isArray(value.accepted)?value.accepted:String(value.accepted||'').split(/\r?\n/).map(clean).filter(Boolean);
 const numeric=value.numeric||{mode:value.numericMode||'tolerance',value:Number(value.numericValue||0),tolerance:Number(value.tolerance||0),min:Number(value.min||0),max:Number(value.max||0),unit:clean(value.unit)};
 const q={id:old?.id||uid('question'),type:value.type||'choice',prompt:clean(value.prompt),subject:clean(value.subject),skill:clean(value.skill),difficulty:value.difficulty||'medium',explanation:clean(value.explanation),options,correct:Number(value.correct??0),accepted,numeric,archived:old?.archived||false,createdAt:old?.createdAt||now.toISOString(),updatedAt:now.toISOString()};validateQuestion(q);if(!old&&a.questions.length>=5000)throw new Error('The bank holds up to 5,000 questions. Export a backup before adding more.');if(old)Object.assign(old,q);else a.questions.unshift(q);return q;
}
export function archiveQuestion(w,questionId,archived,now=new Date()){const q=ensureAssessments(w).questions.find(q=>q.id===questionId);if(!q)throw new Error('This question is unavailable.');q.archived=Boolean(archived);q.updatedAt=now.toISOString();return q;}
export function questionSelection(w,{subjects=[],skill='',difficulty='',archived=false,search=''}={}){return ensureAssessments(w).questions.filter(q=>q.archived===archived&&(!subjects.length||subjects.includes(q.subject))&&(!skill||normalized(q.skill).includes(normalized(skill)))&&(!difficulty||q.difficulty===difficulty)&&(!search||normalized(q.prompt+' '+q.subject+' '+q.skill).includes(normalized(search))));}
export function checkAnswer(q,value){
 validateAnswer(q,value);if(q.type==='choice')return {correct:value!==''&&Number(value)===q.correct,expected:q.options[q.correct]};
 if(q.type==='text')return {correct:value.trim()!==''&&q.accepted.some(a=>normalized(a)===normalized(value)),expected:q.accepted.join(' / ')};
 const n=q.numeric,expected=n.mode==='range'?`${n.min} to ${n.max}${n.unit?' '+n.unit:''}`:`${n.value}${n.unit?' '+n.unit:''}${n.tolerance?' ± '+n.tolerance:''}`;
 const match=value.match(/^\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)\s*(.*?)\s*$/),answer=match?Number(match[1]):NaN,unit=match?.[2]||'',scale=n.mode==='range'?Math.max(Math.abs(n.min),Math.abs(n.max)):Math.abs(n.value),epsilon=Number.EPSILON*Math.max(1,Math.abs(answer),scale)*4;
 return {correct:Number.isFinite(answer)&&unit===n.unit&&(n.mode==='range'?answer>=n.min-epsilon&&answer<=n.max+epsilon:Math.abs(answer-n.value)<=n.tolerance+epsilon),expected};
}
export function activeAssessment(w){return ensureAssessments(w).sessions.find(s=>s.status==='active')||null;}
export function startAssessment(w,{title='Practice',questionIds=[],questions=null,count=10,minutes=0,shuffle=true}={},now=new Date(),random=Math.random){
 const a=ensureAssessments(w);if(activeAssessment(w))throw new Error('Finish the current test first.');if(a.sessions.length>=200)throw new Error('Keep up to 200 saved tests. Export a backup before adding more.');if(!Number.isInteger(count)||count<1||count>50||!Number.isInteger(minutes)||minutes<0||minutes>240||!text(title,240)||!title.trim())throw new Error('Choose 1–50 questions and 0–240 minutes.');
 const wanted=new Set(questionIds);let source=questions?structuredClone(questions):a.questions.filter(q=>wanted.has(q.id)&&!q.archived).map(q=>structuredClone(q));if(!source.length||new Set(source.map(q=>q.id)).size!==source.length)throw new Error('Choose available questions first.');source.forEach(validateQuestion);if(shuffle)for(let i=source.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[source[i],source[j]]=[source[j],source[i]];}source=source.slice(0,count);
 const s={id:uid('exam'),title:title.trim(),status:'active',startedAt:now.toISOString(),endsAt:minutes?new Date(+now+minutes*60000).toISOString():'',finishedAt:'',questions:source,answers:source.map(q=>({questionId:q.id,value:''})),results:[]};a.sessions.unshift(s);return s;
}
export function finishAssessment(w,sessionId,now=new Date()){
 const s=ensureAssessments(w).sessions.find(s=>s.id===sessionId);if(!s)throw new Error('This test is unavailable.');if(s.status==='finished')return s;
 const results=s.questions.map((q,i)=>({questionId:q.id,given:s.answers[i].value,...checkAnswer(q,s.answers[i].value)}));s.results=results;s.status='finished';s.finishedAt=s.endsAt&&now>=new Date(s.endsAt)?s.endsAt:now.toISOString();return s;
}
export function saveAssessmentAnswer(w,sessionId,questionId,value,now=new Date()){
 const s=ensureAssessments(w).sessions.find(s=>s.id===sessionId);if(!s||s.status!=='active')throw new Error('This test has already finished.');if(s.endsAt&&now>=new Date(s.endsAt))return {expired:true,session:finishAssessment(w,sessionId,now)};
 const at=s.questions.findIndex(q=>q.id===questionId);if(at<0)throw new Error('This question is not in the test.');validateAnswer(s.questions[at],value);s.answers[at].value=value;return {expired:false,session:s};
}
export function expireAssessment(w,now=new Date()){const s=activeAssessment(w);return s?.endsAt&&now>=new Date(s.endsAt)?finishAssessment(w,s.id,now):null;}
export function assessmentMistakes(w){
 const groups=new Map();for(const s of [...ensureAssessments(w).sessions].filter(s=>s.status==='finished').reverse().sort((a,b)=>a.startedAt.localeCompare(b.startedAt)))for(let i=0;i<s.questions.length;i++){const q=s.questions[i],r=s.results[i];let group=groups.get(q.id);if(!group){group={question:q,history:[],everWrong:false,correct:false};groups.set(q.id,group);}group.question=q;group.history.push({sessionId:s.id,title:s.title,at:s.finishedAt,given:r.given,expected:r.expected,correct:r.correct});group.everWrong||=!r.correct;group.correct=r.correct;}
 return [...groups.values()].filter(g=>g.everWrong).sort((a,b)=>a.correct-b.correct||b.history.at(-1).at.localeCompare(a.history.at(-1).at));
}
export function courseExerciseMistakes(w,records=[]){
 const groups=new Map(),definitions=new Map(),courses=new Map(records.map(r=>[r.data.meta.course.id,r]));for(const x of [...records.flatMap(r=>(r.data.exercises||[]).map(x=>({...x,courseId:r.data.meta.course.id}))),...(w.learning?.exercises||[])])definitions.set(x.courseId+'::'+x.id,x);
 for(const attempt of [...(w.learning?.attempts||[])].filter(x=>x&&id(x.exerciseId)&&typeof x.courseId==='string'&&stamp(x.at)&&Number.isFinite(x.score)).sort((a,b)=>a.at.localeCompare(b.at))){
  const key=attempt.courseId+'::'+attempt.exerciseId,definition=definitions.get(key),snapshot=attempt.reviewSnapshot||{},record=courses.get(attempt.courseId),type=snapshot.type||definition?.type||'scenario';let group=groups.get(key);
  if(!group){group={courseId:attempt.courseId,exerciseId:attempt.exerciseId,courseTitle:record?.data.meta.course.title||'Course unavailable',title:'Course exercise',prompt:'',explanation:'',expected:'',history:[],everWrong:false,correct:false,available:Boolean(definition&&record)};groups.set(key,group);}
  group.title=snapshot.title||definition?.title||group.title;group.prompt=snapshot.prompt||definition?.prompt||group.prompt;group.explanation=snapshot.explanation||definition?.rubric||group.explanation;group.expected=snapshot.expected||(type==='quiz'?definition?.options?.[definition.correct]:'')||'';
  const correct=attempt.score>=(type==='quiz'?3:2);group.history.push({at:attempt.at,given:String(attempt.answer||''),correct,score:attempt.score,pageId:attempt.pageId||''});group.everWrong||=!correct;group.correct=correct;group.selfRated=type!=='quiz';
 }
 return [...groups.values()].filter(g=>g.everWrong).sort((a,b)=>a.correct-b.correct||b.history.at(-1).at.localeCompare(a.history.at(-1).at));
}
