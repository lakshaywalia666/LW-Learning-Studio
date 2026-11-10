import {forestRandom} from './living-forest-model.js?v=studio47';
const tau=Math.PI*2;
const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
const rgb=(v,a=1)=>`rgba(${v.join(',')},${a})`;
const hex=value=>/^#[a-f\d]{6}$/i.test(value)?[1,3,5].map(i=>parseInt(value.slice(i,i+2),16)):[145,185,255];
function oval(c,x,y,rx,ry,fill){c.fillStyle=fill;c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,tau);c.fill();}
function polygon(c,points,fill,stroke){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=.8;c.stroke();}}
export function createScenePainter(c,project,model){
 const scene=model.scene.id,rand=forestRandom(9831),stars=Array.from({length:100},()=>({x:rand(),y:rand(),r:.4+rand()*1.4,phase:rand()*tau}));
 const glowSprites=new Map();
 let width=1,height=1,k=1,env,t=0;
 function star(x,y,size,fill){c.save();c.translate(x,y);c.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4-Math.PI/2,r=i%2?size*.32:size;i?c.lineTo(Math.cos(a)*r,Math.sin(a)*r):c.moveTo(Math.cos(a)*r,Math.sin(a)*r);}c.closePath();c.fillStyle=fill;c.fill();c.restore();}
 function glow(x,y,r,color,alpha=.22){const key=color.join(',');let sprite=glowSprites.get(key);if(!sprite){sprite=document.createElement('canvas');sprite.width=sprite.height=192;const q=sprite.getContext('2d'),g=q.createRadialGradient(96,96,1,96,96,96);g.addColorStop(0,rgb(color,1));g.addColorStop(.4,rgb(color,.38));g.addColorStop(1,rgb(color,0));q.fillStyle=g;q.fillRect(0,0,192,192);if(glowSprites.size>=32)glowSprites.delete(glowSprites.keys().next().value);glowSprites.set(key,sprite);}c.save();c.globalAlpha*=Math.max(0,alpha);c.drawImage(sprite,x-r,y-r,r*2,r*2);c.restore();}
 function box(x,y,size,h,color,lit=false){const p=project(x,y),w=size*k/2,d=size*k*.23,z=h*k,day=env.daylight,ink=hex(color),roof=mix(ink,[229,239,231],.23+day*.22);
  polygon(c,[[p.x-w,p.y-z],[p.x,p.y-z+d],[p.x,p.y+d],[p.x-w,p.y]],rgb(mix(ink,[10,25,42],.17)),rgb([224,240,244],.12));
  polygon(c,[[p.x,p.y-z+d],[p.x+w,p.y-z],[p.x+w,p.y],[p.x,p.y+d]],rgb(mix(ink,[11,22,40],.4)),rgb([220,235,244],.1));
  polygon(c,[[p.x-w,p.y-z],[p.x,p.y-z-d],[p.x+w,p.y-z],[p.x,p.y-z+d]],env.kind==='snow'?rgb(mix(roof,[246,251,253],.7)):rgb(roof),rgb([230,246,248],.25));
  if(h>35){const rows=Math.min(8,Math.floor(h/19));for(let row=0;row<rows;row++)for(let side=0;side<2;side++){const yy=p.y-z+(row+1)*15*k,xx=p.x+(side?-1:1)*w*.4;c.fillStyle=lit&&day<.6?`rgba(244,221,166,${.45+.25*Math.sin(t*.35+row*1.7+side+x*.01)})`:'#c9e9ed65';c.beginPath();c.roundRect(xx-2*k,yy,3*k,5*k,1*k);c.fill();}}
 }
 function sky(){
  const palettes={islands:[[17,32,56],[115,170,190],[40,69,89],[220,234,220]],city:[[13,23,43],[104,143,171],[32,47,73],[216,202,187]],constellations:[[9,12,29],[31,48,80],[27,24,58],[79,83,125]],orbs:[[6,9,22],[6,9,22],[14,18,40],[14,18,40]]},p=palettes[scene],d=scene==='orbs'?0:env.daylight*(env.kind==='rain'?.7:1),g=c.createLinearGradient(0,0,0,height);g.addColorStop(0,rgb(mix(p[0],p[1],d)));g.addColorStop(1,rgb(mix(p[2],p[3],d)));c.fillStyle=g;c.fillRect(0,0,width,height);
  if(scene==='constellations'||scene==='orbs'||env.daylight<.5){for(const s of stars){const alpha=(scene==='orbs'?.2:scene==='constellations'?.4:.55)*(1+.15*Math.sin(t*.5+s.phase));oval(c,s.x*width,s.y*height,s.r,s.r,rgb([210,224,255],alpha));}}
  if(scene==='islands'||scene==='city'){const x=width*.75,y=height*.24;glow(x,y,width*.45,env.daylight>.5?[248,231,180]:[176,200,230],env.kind==='rain'?.08:.16);oval(c,x,y,env.daylight>.5?23:18,env.daylight>.5?23:18,env.daylight>.5?'#fff0cba0':'#e2e9ec9c');if(env.daylight<.5)oval(c,x-7,y-5,17,17,rgb(mix(p[0],p[1],d)));}
  if(scene==='islands'){for(let i=0;i<7;i++){const x=((i*.23*width+t*(3+i))%(width+350))-170,y=height*(.25+i*.09);oval(c,x,y,150+i*12,20+i*3,rgb([225,239,242],.04+env.daylight*.05));}const mist=c.createLinearGradient(0,height*.65,0,height);mist.addColorStop(0,'#d8e7e800');mist.addColorStop(1,env.daylight>.5?'#dce9eb9c':'#7eabbf25');c.fillStyle=mist;c.fillRect(0,0,width,height);}
  if(scene==='city'){const floor=c.createLinearGradient(0,height*.42,0,height);floor.addColorStop(0,rgb(mix([18,31,48],[105,139,151],d),0));floor.addColorStop(1,rgb(mix([14,26,44],[101,125,137],d)));c.fillStyle=floor;c.fillRect(0,height*.4,width,height*.6);c.strokeStyle=env.daylight>.5?'#f3eee118':'#b4cce619';c.lineWidth=.7;c.beginPath();for(let i=-8;i<18;i++){const x=i*100;c.moveTo(x,height*.46);c.lineTo(x+width*.6,height);c.moveTo(x,height*.46);c.lineTo(x-width*.6,height);}c.stroke();}
  if(scene==='constellations'){const phase=t%23;if(phase<1.3){const progress=phase/1.3,x=width*(.12+progress*.6),y=height*(.18+progress*.16),tail=50,meteor=c.createLinearGradient(x-tail,y-tail*.27,x,y);meteor.addColorStop(0,'#dcecff00');meteor.addColorStop(1,`rgba(227,240,255,${Math.sin(progress*Math.PI)*.7})`);c.strokeStyle=meteor;c.lineWidth=1.2;c.beginPath();c.moveTo(x-tail,y-tail*.27);c.lineTo(x,y);c.stroke();}glow(width*.2+Math.sin(t*.08)*30,height*.42,width*.6,[134,104,199],.16);glow(width*.8,height*.7,width*.7,[80,148,180],.12);}
  if(scene==='orbs'){glow(width*.2+Math.sin(t*.1)*15,height*.35,width*.7,[78,103,238],.17);glow(width*.85,height*.62,width*.55,[194,76,183],.12);glow(width*.48,height*.9,width*.5,[50,175,197],.06);}
 }
 function island(plot){const p=project(plot.x,plot.y),radius=plot.radius*(.65+plot.growth*.3)*k,ry=radius*.39,depth=(90+plot.growth*65)*k,grass=env.daylight>.5?['#a9bc90','#7da789']:['#527b77','#355968'];
  const rock=c.createLinearGradient(p.x-radius,p.y,p.x+radius,p.y+depth);rock.addColorStop(0,'#9aaaa0');rock.addColorStop(.4,'#5d7c85');rock.addColorStop(1,'#2c485e');
  c.beginPath();c.moveTo(p.x-radius,p.y);c.bezierCurveTo(p.x-radius*.7,p.y+ry+depth*.3,p.x-radius*.28,p.y+ry+depth,p.x+radius*.18,p.y+depth+ry*.5);c.lineTo(p.x+radius*.69,p.y+depth*.52);c.lineTo(p.x+radius,p.y);c.closePath();c.fillStyle=rock;c.fill();
  polygon(c,[[p.x-radius*.6,p.y+ry*.55],[p.x-radius*.22,p.y+depth+ry*.64],[p.x+radius*.18,p.y+depth+ry*.5],[p.x+radius*.52,p.y+ry*.5]],'#2e506a4d');
  const turf=c.createLinearGradient(p.x,p.y-ry,p.x,p.y+ry);turf.addColorStop(0,grass[0]);turf.addColorStop(1,grass[1]);oval(c,p.x,p.y,radius,ry,turf);c.strokeStyle='#d8e3b780';c.lineWidth=1.5*k;c.beginPath();c.ellipse(p.x,p.y,radius*.94,ry*.9,0,0,Math.PI);c.stroke();
  const random=forestRandom(plot.seed+58);for(let i=0;i<Math.min(18,plot.topics.length*2);i++){const a=random()*tau,r=radius*(.58+random()*.3);oval(c,p.x+Math.cos(a)*r,p.y+Math.sin(a)*r*.37,2.2*k,1.7*k,i%3?'#f0e1bb':'#dabfe4');}
  const waterX=p.x-radius*.5,waterY=p.y+ry*.83;c.strokeStyle='#bce9ec90';c.lineWidth=7*k;c.beginPath();c.moveTo(waterX,waterY);c.bezierCurveTo(waterX+6*k,waterY+depth*.3,waterX-5*k,waterY+depth*.75,waterX+10*k,waterY+depth*1.25);c.stroke();c.strokeStyle='#e6f8faaa';c.lineWidth=2*k;c.beginPath();const drop=(t*.3)%1;c.moveTo(waterX+2*k,waterY+drop*depth);c.lineTo(waterX+3*k,waterY+(drop+.18)*depth);c.stroke();
  for(let i=0;i<5;i++){const phase=(t*.42+i*.2)%1,dx=Math.sin(i*2+t)*5*k;oval(c,waterX+dx,waterY+depth*(.8+phase*.5),2*k*(1-phase),5*k*(1-phase),rgb([228,248,246],(1-phase)*.45));}
  for(let i=0;i<2;i++){const phase=(t*.35+i*.5)%1;oval(c,waterX+8*k,waterY+depth*1.18,(5+phase*20)*k,(2+phase*4)*k,rgb([216,242,239],(1-phase)*.1));}
  if(plot.summary.completedTasks){box(plot.x,plot.y-45,65,75+plot.growth*155,'#b5c4bb',env.daylight<.6);const top=project(plot.x,plot.y-45-(75+plot.growth*155));glow(top.x,top.y,28*k,hex(plot.color),.35);}
  else{const q=project(plot.x,plot.y-10);oval(c,q.x,q.y-8*k,10*k,10*k,'#e5e9d291');c.strokeStyle='#e6e8c25c';c.lineWidth=2*k;c.beginPath();c.moveTo(q.x,q.y);c.lineTo(q.x,q.y-26*k);c.stroke();}
  const count=Math.min(20,plot.topics.length);for(let i=0;i<count;i++){const topic=plot.topics[i];box(topic.x,topic.y,21,9+(i%3)*5,i%3?'#dfdcc3':'#91b6c3',false);}
  if(model.rewards.find(r=>r.id==='trail')?.unlocked){c.strokeStyle='#e0e3c686';c.lineWidth=5*k;const a=project(plot.x-60,plot.y+35),b=project(plot.x+60,plot.y+35);c.beginPath();c.moveTo(a.x,a.y);c.quadraticCurveTo(p.x,p.y+45*k,b.x,b.y);c.stroke();}
 }
 function city(plot){const p=project(plot.x,plot.y+25),r=(170+plot.growth*95)*k,color=hex(plot.color);polygon(c,[[p.x-r,p.y],[p.x,p.y-r*.44],[p.x+r,p.y],[p.x,p.y+r*.44]],env.daylight>.5?'#718a926b':'#23364db5','#c0d6dc29');
  c.strokeStyle='#c8d7dc40';c.lineWidth=5*k;c.beginPath();c.moveTo(p.x-r*.88,p.y);c.lineTo(p.x+r*.88,p.y);c.moveTo(p.x,p.y-r*.38);c.lineTo(p.x,p.y+r*.38);c.stroke();
  if(!plot.summary.completedTasks){box(plot.x,plot.y-40,70,10,'#8d9ea6');c.strokeStyle='#d6e3df70';c.lineWidth=2*k;for(const dx of [-29,29]){const q=project(plot.x+dx,plot.y-40);c.beginPath();c.moveTo(q.x,q.y);c.lineTo(q.x,q.y-18*k);c.stroke();}}
  else{box(plot.x,plot.y-35,75,90+plot.growth*190,'#849fae',true);const q=project(plot.x,plot.y-35);c.strokeStyle=rgb(color,.8);c.lineWidth=2*k;c.beginPath();c.moveTo(q.x,q.y-(90+plot.growth*190)*k-15*k);c.lineTo(q.x,q.y-(90+plot.growth*190)*k-3*k);c.stroke();}
  const random=forestRandom(plot.seed);for(const topic of plot.topics.slice(0,40)){const h=28+random()*70+plot.growth*45;box(topic.x,topic.y,28,h,['#8aafbe','#7b9baf','#a6b6bc','#6e94a6'][Math.floor(random()*4)],true);}
  if(plot.summary.completedTasks){for(let i=0;i<3;i++){const distance=((t*(.045+i*.008)+i*.32)%1)*4,edge=Math.floor(distance),u=distance-edge,route=[[-.75,0],[0,-.31],[.75,0],[0,.31]],a=route[edge],b=route[(edge+1)%4],x=p.x+(a[0]+(b[0]-a[0])*u)*r,y=p.y+(a[1]+(b[1]-a[1])*u)*r;ctxCar(x,y,i,Math.atan2(b[1]-a[1],b[0]-a[0]));}const top=project(plot.x,plot.y-35);glow(top.x,top.y-(107+plot.growth*190)*k,8*k,color,.25+.2*Math.sin(t*2));}
  if(model.rewards.find(r=>r.id==='flowers')?.unlocked){const q=project(plot.x-105,plot.y+15);oval(c,q.x,q.y,29*k,13*k,'#94b69580');for(let i=0;i<5;i++)oval(c,q.x+(i-2)*9*k,q.y,3*k,2*k,'#e4d5ae');}
  if(model.rewards.find(r=>r.id==='pond')?.unlocked){const q=project(plot.x+120,plot.y+20);oval(c,q.x,q.y,27*k,12*k,'#6fbbc18c');c.strokeStyle='#d8f2ee9e';c.lineWidth=2*k;c.beginPath();c.moveTo(q.x,q.y);c.quadraticCurveTo(q.x-6*k,q.y-35*k,q.x+4*k,q.y-37*k);c.stroke();for(let i=0;i<4;i++){const phase=(t*.65+i*.25)%1;oval(c,q.x+Math.sin(i)*phase*8*k,q.y-37*k+phase*29*k,1*k,2*k,'#d3efec99');}}
 }
 function ctxCar(x,y,index,angle){c.save();c.translate(x,y);c.rotate(angle);c.fillStyle=['#d2c7a5','#bcced9','#c3bcda'][index];c.beginPath();c.roundRect(-4*k,-2*k,8*k,4*k,1.5*k);c.fill();c.fillStyle='#e6f3ed';c.fillRect(2*k,-1.4*k,1*k,2.8*k);c.restore();}
 function constellation(plot){const p=project(plot.x,plot.y-90),color=mix(hex(plot.color),[179,168,244],.5);glow(p.x,p.y,(170+plot.growth*70)*k,color,.2+plot.growth*.15);glow(p.x,p.y,25*k,color,.65);star(p.x,p.y,(10+plot.growth*12+Math.sin(t*.8+plot.seed)*.7)*k,'#f0eddd');
  c.strokeStyle=rgb(color,.38);c.lineWidth=Math.max(.7,1.1*k);c.beginPath();let last=p;for(const topic of plot.topics){const q=project(topic.x,topic.y);c.moveTo(last.x,last.y);c.lineTo(q.x,q.y);last=q;}c.stroke();
  for(const [index,topic]of plot.topics.entries()){const q=project(topic.x,topic.y),pulse=.75+.25*Math.sin(t*1.3+index*1.7);glow(q.x,q.y,(11+pulse*4)*k,color,.18+pulse*.15);star(q.x,q.y,(3.5+pulse+(topic.verified?1:0))*k,'#dce9f8');}
  if(plot.topics.length){const distance=((t*.08+plot.seed%19/19)%1)*plot.topics.length,index=Math.floor(distance),u=distance-index,from=index?project(plot.topics[index-1].x,plot.topics[index-1].y):p,to=project(plot.topics[index].x,plot.topics[index].y),x=from.x+(to.x-from.x)*u,y=from.y+(to.y-from.y)*u;glow(x,y,8*k,color,.5);oval(c,x,y,1.7*k,1.7*k,'#edf5ff');}
  if(model.rewards.find(r=>r.id==='pond')?.unlocked){c.strokeStyle=rgb(color,.3);c.lineWidth=1*k;c.beginPath();c.ellipse(p.x,p.y,140*k,48*k,-.4,0,tau);c.stroke();}
 }
 function orb(plot){
  const p=project(plot.x,plot.y-90),r=(112+plot.growth*34)*k,color=hex(plot.color),ratio=plot.summary.totalTasks?plot.summary.completedTasks/plot.summary.totalTasks:0;
  const palette=[[83,216,255],[174,135,255],[255,130,196],[255,203,113],[111,237,200]];
  const lanes=[{rx:r*1.62,ry:r*.57,tilt:-.38},{rx:r*1.48,ry:r*.8,tilt:.64},{rx:r*1.77,ry:r*.5,tilt:-.89}];
  // These five colour satellites are ambient scenery; authored topic beads below
  // retain their canonical positions, counts and click targets.
  const satellites=palette.map((ink,i)=>{const lane=lanes[i%lanes.length],direction=i%2?-1:1,angle=t*(.18+i*.018)*direction+i*tau/5+plot.seed%17,xx=Math.cos(angle)*lane.rx,yy=Math.sin(angle)*lane.ry;return{...lane,ink,direction,angle,x:p.x+xx*Math.cos(lane.tilt)-yy*Math.sin(lane.tilt),y:p.y+xx*Math.sin(lane.tilt)+yy*Math.cos(lane.tilt),front:Math.sin(angle)>=0,size:Math.max(3,r*(.065+(i%3)*.018))};});
  function orbitLanes(front){for(const [i,lane]of lanes.entries()){c.strokeStyle=rgb(palette[i],front?.22:.12);c.lineWidth=Math.max(.65,k);c.beginPath();c.ellipse(p.x,p.y,lane.rx,lane.ry,lane.tilt,front?0:Math.PI,front?Math.PI:tau);c.stroke();}}
  function satellite(s){c.save();c.globalAlpha=s.front?1:.6;c.translate(p.x,p.y);c.rotate(s.tilt);c.strokeStyle=rgb(s.ink,.55);c.lineWidth=Math.max(1,k*1.5);c.lineCap='round';c.beginPath();c.ellipse(0,0,s.rx,s.ry,0,s.angle-s.direction*.28,s.angle,s.direction<0);c.stroke();c.restore();glow(s.x,s.y,s.size*3.8,s.ink,s.front?.48:.22);const g=c.createRadialGradient(s.x-s.size*.32,s.y-s.size*.4,.2,s.x,s.y,s.size);g.addColorStop(0,rgb(mix(s.ink,[255,255,255],.85)));g.addColorStop(.28,rgb(mix(s.ink,[255,255,255],.3)));g.addColorStop(.7,rgb(s.ink));g.addColorStop(1,rgb(mix(s.ink,[14,20,56],.55)));oval(c,s.x,s.y,s.size,s.size,g);}
  oval(c,p.x,p.y+r+35*k,r*.7,10*k,'#01040d70');glow(p.x,p.y,r*2.1,mix(color,[110,131,255],.55),.2);
  orbitLanes(false);satellites.filter(s=>!s.front).forEach(satellite);
  oval(c,p.x,p.y,r,r,'#101a35');
  const glass=c.createRadialGradient(p.x-r*.48,p.y-r*.52,1,p.x,p.y,r);glass.addColorStop(0,'#afdaff69');glass.addColorStop(.38,'#6d89e23c');glass.addColorStop(.75,'#2c376644');glass.addColorStop(1,'#6372b42b');oval(c,p.x,p.y,r,r,glass);
  glow(p.x+r*.55,p.y+r*.25,r*.9,[171,104,255],.18);glow(p.x-r*.43,p.y-r*.35,r*.55,[99,211,255],.13);
  const rim=c.createLinearGradient(p.x-r,p.y-r,p.x+r,p.y+r);rim.addColorStop(0,'#b2e5ffbf');rim.addColorStop(.4,'#8695e157');rim.addColorStop(.75,'#bca1f285');rim.addColorStop(1,'#74d7ed9c');c.strokeStyle=rim;c.lineWidth=1.4;c.beginPath();c.arc(p.x,p.y,r,0,tau);c.stroke();
  c.strokeStyle=rgb(color,.18);c.lineWidth=3*k;c.beginPath();c.arc(p.x,p.y,r+12*k,0,tau);c.stroke();if(ratio){c.strokeStyle=rgb(color,.95);c.lineWidth=3.5*k;c.lineCap='round';c.beginPath();c.arc(p.x,p.y,r+12*k,-Math.PI/2,-Math.PI/2+tau*ratio);c.stroke();}
  c.strokeStyle='#e2f1ffac';c.lineWidth=2*k;c.beginPath();c.arc(p.x-3*k,p.y-3*k,r*.88,-2.45,-1.07);c.stroke();
  c.fillStyle='#f1f5ff';c.textAlign='center';c.font=`500 ${Math.max(17,41*k)}px system-ui`;c.fillText(plot.summary.percent+'%',p.x,p.y+8*k);c.fillStyle='#a7b7d9';c.font=`500 ${Math.max(7,9*k)}px system-ui`;c.fillText('TASKS COMPLETE',p.x,p.y+32*k);c.textAlign='start';
  orbitLanes(true);satellites.filter(s=>s.front).forEach(satellite);
  for(const topic of plot.topics){const q=project(topic.x,topic.y);glow(q.x,q.y,7*k,color,.35);oval(c,q.x,q.y,3.5*k,3.5*k,rgb(mix(color,[245,249,255],.55)));}
 }

 return{
  dispose(){glowSprites.clear();},
  background(time,environment,w,h,scale){t=time;env=environment;width=w;height=h;k=scale;sky();},
  plot(plot,time){t=time;if(scene==='islands')island(plot);else if(scene==='city')city(plot);else if(scene==='constellations')constellation(plot);else orb(plot);},
  marker(x,y,size,selected){if(scene==='constellations'){glow(x,y,size*2,[183,196,255],selected?.5:.18);star(x,y,size,selected?'#ffe9ac':'#d4e9ff');}else if(scene==='orbs'){oval(c,x,y,size+2,size+2,'#162943c9');oval(c,x,y,size,size,selected?'#f2dca6':'#bfdaf5');}else{const fill=selected?'#f0d6a0':scene==='city'?'#c2dfeb':'#e6e4bf';polygon(c,[[x,y-size],[x+size,y],[x,y+size],[x-size,y]],fill,'#24455b88');c.strokeStyle='#48636b';c.lineWidth=1;c.beginPath();c.moveTo(x-3,y);c.lineTo(x-1,y+2);c.lineTo(x+3,y-3);c.stroke();}}
 };
}
