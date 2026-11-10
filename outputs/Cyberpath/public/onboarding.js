// Offline profile and course selection. Learning records keep their existing IDs.
export function greeting(date=new Date()){
 const hour=date.getHours();return hour>=5&&hour<12?'Good morning':hour>=12&&hour<17?'Good afternoon':'Good evening';
}
export function profileName(value){
 if(typeof value!=='string')throw new Error('Enter your name.');
 const name=value.trim().replace(/\s+/g,' ');
 if(!name||name.length>40||/[\u0000-\u001f\u007f]/.test(name))throw new Error('Use a name between 1 and 40 characters.');
 return name;
}
export function initializeSetup(workspace,fresh=false){
 workspace.learning||={};
 workspace.learning.setup||={version:1,completed:!fresh,courseIds:fresh?[]:Object.keys(workspace.courses)};
 return workspace.learning.setup;
}
export function validateSetup(setup){
 if(setup===undefined)return;
 if(!setup||setup.version!==1||typeof setup.completed!=='boolean'||!Array.isArray(setup.courseIds)||setup.courseIds.length>10000||new Set(setup.courseIds).size!==setup.courseIds.length||setup.courseIds.some(id=>typeof id!=='string'||!/^[a-z0-9_-]{1,100}$/.test(id)))throw new Error('Invalid profile setup preferences.');
}
export const needsSetup=workspace=>workspace.learning?.setup?.completed===false;
export function enrolledCourseIds(workspace){
 const setup=workspace.learning?.setup;
 if(!setup)return Object.keys(workspace.courses);
 const selected=new Set(setup.courseIds),learning=workspace.learning||{},referenced=new Set(['pages','library','exercises','attempts'].flatMap(key=>(learning[key]||[]).map(item=>item.courseId)).filter(Boolean));
 if(learning.resume?.courseId)referenced.add(learning.resume.courseId);
 for(const [id,reviews]of Object.entries(learning.important||{}))if(Object.keys(reviews||{}).length)referenced.add(id);
 // A legacy or restored learning record must never disappear behind setup.
 for(const [id,state]of Object.entries(workspace.courses))if(['progress','taskProgress','projects','tools','labs','stageReviews'].some(key=>Object.keys(state[key]||{}).length)||['sessions','notes','events'].some(key=>state[key]?.length)||Object.values(state.custom||{}).some(rows=>rows.length)||Object.values(state.days||{}).some(day=>day.reflection||day.nextAction||day.tasks?.some(task=>task.done||task.manual))||referenced.has(id))selected.add(id);
 return [...selected].filter(id=>Object.hasOwn(workspace.courses,id));
}
export function enrollCourse(workspace,id){
 if(!Object.hasOwn(workspace.courses,id))throw new Error('Choose an available course.');
 const setup=initializeSetup(workspace);if(!setup.courseIds.includes(id))setup.courseIds.push(id);
}
export function saveProfileName(workspace,value){
 const name=profileName(value);workspace.settings.name=name;
 for(const state of Object.values(workspace.courses))state.settings.name=name;
 return name;
}
export function finishSetup(workspace,id){
 const setup=initializeSetup(workspace);
 if(!setup.completed)profileName(workspace.settings.name);
 if(id){enrollCourse(workspace,id);workspace.settings.activeCourseId=id;workspace.courses[id].settings.onboarded=true;}
 setup.completed=true;
}
