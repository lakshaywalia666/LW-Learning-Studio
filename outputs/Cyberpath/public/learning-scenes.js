import {livingForestModel,hitForestTopic} from './living-forest-model.js?v=studio47';
export const LEARNING_SCENES=Object.freeze([
 {id:'forest',name:'Forest',title:'Your living forest',place:'grove',places:'groves',marker:'leaf',description:'Trees and wildflowers grow with your learning.',hint:'Each leaf marks a completed topic. Tap one to revisit it.'},
 {id:'islands',name:'Learning Islands',title:'Your learning islands',place:'island',places:'islands',marker:'landmark',description:'Build a floating island for every course.',hint:'Each landmark marks a completed topic. Tap one to revisit it.'},
 {id:'city',name:'Knowledge City',title:'Your knowledge city',place:'district',places:'districts',marker:'building',description:'Watch your skills become a city of knowledge.',hint:'Each building marks a completed topic. Tap one to revisit it.'},
 {id:'constellations',name:'Constellations',title:'Your skill constellations',place:'constellation',places:'constellations',marker:'star',description:'Light up a connected sky of completed topics.',hint:'Each star marks a completed topic. Tap one to revisit it.'},
 {id:'orbs',name:'Progress Orbs',title:'Your progress orbs',place:'orb',places:'orbs',marker:'bead',description:'Glowing progress orbs with colourful revolving satellites.',hint:'Tap a small topic bead to revisit completed work.'}
]);
export const sceneDefinition=id=>LEARNING_SCENES.find(scene=>scene.id===id)||LEARNING_SCENES[0];
export function validateScenePreferences(learning){
 if(learning.worldAnimations!==undefined&&typeof learning.worldAnimations!=='boolean')throw new Error('Invalid world animation preference.');
 if(learning.sceneRendering!==undefined&&!['auto','3d','2d'].includes(learning.sceneRendering))throw new Error('Invalid scene rendering preference.');
 if(learning.visualScene!==undefined&&!LEARNING_SCENES.some(s=>s.id===learning.visualScene))throw new Error('Unknown learning scene.');
 if(learning.sceneCameras!==undefined){const cameras=learning.sceneCameras;if(!cameras||typeof cameras!=='object'||Array.isArray(cameras))throw new Error('Invalid scene cameras.');for(const[id,camera]of Object.entries(cameras)){if(!LEARNING_SCENES.some(s=>s.id===id)||!camera||camera.version!==2||![camera.x,camera.y,camera.scale].every(Number.isFinite)||camera.scale<(camera.renderer==='3d'?.01:.65)||camera.scale>1000)throw new Error('Invalid scene camera.');}}
}
export function learningSceneModel(records,sceneId='forest'){
 const base=livingForestModel(records),scene=sceneDefinition(sceneId);
 const plots=base.plots.map(plot=>({...plot,topics:plot.topics.map((topic,i)=>{
  if(scene.id==='forest')return{...topic};
  const count=plot.topics.length,angle=i*2.399963+(plot.seed%100)/13;let x,y;
  if(scene.id==='islands'){const radius=50+12*Math.sqrt(i+1);x=plot.x+Math.cos(angle)*radius;y=plot.y-5+Math.sin(angle)*radius*.42;}
  else if(scene.id==='city'){const columns=Math.max(2,Math.ceil(Math.sqrt(count))),column=i%columns,row=Math.floor(i/columns);x=plot.x+(column-row)*32;y=plot.y+40+(column+row-columns+1)*17;}
  else if(scene.id==='constellations'){const radius=85+12*Math.sqrt(i+1);x=plot.x+Math.cos(angle)*radius;y=plot.y-90+Math.sin(angle)*radius*.7;}
  else{const ring=Math.floor(i/36),inRing=Math.min(36,count-ring*36),a=(i%36)*Math.PI*2/Math.max(6,inRing)-Math.PI/2,radius=155+ring*24;x=plot.x+Math.cos(a)*radius;y=plot.y-90+Math.sin(a)*radius*.8;}
  return{...topic,x,y};
 })}));
 const bounds={...base.bounds};for(const plot of plots)for(const t of plot.topics){bounds.left=Math.min(bounds.left,t.x-50);bounds.right=Math.max(bounds.right,t.x+50);bounds.top=Math.min(bounds.top,t.y-100);bounds.bottom=Math.max(bounds.bottom,t.y+90);}
 return{...base,plots,bounds,scene};
}
export function sceneThumbnail(id){
 const shapes={
 forest:'<path d="M0 77Q50 60 100 76T180 72V110H0Z" fill="#375e4b"/><path d="M71 84V42m44 42V53" stroke="#a5b28d" stroke-width="4"/><circle cx="72" cy="39" r="25" fill="#7eae73"/><circle cx="61" cy="34" r="17" fill="#a7c788"/><circle cx="113" cy="54" r="18" fill="#5e986a"/>',
 islands:'<ellipse cx="90" cy="64" rx="56" ry="18" fill="#bcce9a"/><path d="m34 64 28 34 36 9 49-44Z" fill="#6d8d8c"/><path d="m62 72 8 29 28 6 49-44Z" fill="#405e75"/><path d="M102 70V26l-14-8-14 8v39" fill="#e3dfc3"/><path d="m74 26 14 8 14-8-14-8Z" fill="#f4edce"/><path d="M58 69v29" stroke="#b1e9ef" stroke-width="5"/>',
 city:'<path d="m20 83 68-39 72 39-68 28Z" fill="#344760"/><path d="m42 77 18 10V44L42 34Z" fill="#658ba3"/><path d="m60 87 16-9V35l-16 9Z" fill="#3c637d"/><path d="m42 34 18 10 16-9-18-10Z" fill="#99bec8"/><path d="m84 83 24 14V28L84 14Z" fill="#7ca3b5"/><path d="m108 97 22-13V15l-22 13Z" fill="#476880"/><path d="m84 14 24 14 22-13L106 1Z" fill="#c0d8d5"/><path d="M91 36v32m9-27v33m15-35v29" stroke="#d7e6b4" stroke-width="3"/>',
 constellations:'<path d="m36 71 37-39 43 12 29 38-64 2-8-52" fill="none" stroke="#aeb2ee" stroke-width="1.2"/><g fill="#e4e4ff"><circle cx="36" cy="71" r="4"/><circle cx="73" cy="32" r="6"/><circle cx="116" cy="44" r="4"/><circle cx="145" cy="82" r="5"/><circle cx="81" cy="84" r="4"/></g><g fill="#b8c5f0" opacity=".4"><circle cx="25" cy="26" r="1"/><circle cx="141" cy="21" r="2"/><circle cx="51" cy="94" r="1"/></g>',
 orbs:'<ellipse cx="90" cy="91" rx="34" ry="5" fill="#090e2229"/><circle cx="90" cy="55" r="33" fill="#b3c5e329" stroke="#deebff90"/><path d="M67 34q19-16 42 0" fill="none" stroke="#ffffff90" stroke-width="3"/><ellipse cx="90" cy="55" rx="49" ry="19" transform="rotate(-24 90 55)" fill="none" stroke="#9acbfa" stroke-width="2"/><circle cx="134" cy="36" r="6" fill="#62d9ff"/><circle cx="52" cy="73" r="5" fill="#e49bff"/><circle cx="115" cy="87" r="4" fill="#ffc981"/><text x="90" y="61" fill="#edf4ff" font-family="system-ui" font-size="17" font-weight="600" text-anchor="middle">✦</text>'
 };
 const bg={forest:'#14352e',islands:'#6b97ad',city:'#1c2d47',constellations:'#18162f',orbs:'#0c1126'};
 return`<svg viewBox="0 0 180 110" aria-hidden="true"><rect width="180" height="110" rx="14" fill="${bg[id]||bg.forest}"/>${shapes[id]||shapes.forest}</svg>`;
}

// Offset the whole illustration, its labels and its hit targets together.
export function worldMotionOffset(scene,seed,time){
 if(scene==='islands')return{x:Math.sin(time*.32+seed%17)*3,y:Math.sin(time*.52+seed%11)*10};
 if(scene==='orbs')return{x:0,y:Math.sin(time*.65+seed%13)*7};
 return{x:0,y:0};
}
export function hitLearningSceneTopic(model,x,y,time,radius=20){
 for(const plot of model.plots){const offset=worldMotionOffset(model.scene.id,plot.seed,time),topic=hitForestTopic({plots:[plot]},x-offset.x,y-offset.y,radius);if(topic)return topic;}
 return null;
}
