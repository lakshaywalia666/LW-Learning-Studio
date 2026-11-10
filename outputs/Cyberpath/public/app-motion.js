// One motion controller for the app shell. Re-rendering a form never restarts its entrance.
export function createAppMotion({reduced}){
 let lastRoute='',tabHost=null,indicator=null,resize=null,indicatorMotion=null,pressed=null,pressPoint=null,frame=0;
 let restingHeight=window.visualViewport?.height||innerHeight,restingWidth=innerWidth;
 function updateKeyboard(){
  const height=window.visualViewport?.height||innerHeight,width=innerWidth;
  const editing=document.activeElement?.matches('textarea,input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=button]):not([type=submit]),[contenteditable=true]');
  const rotated=Math.abs(width-restingWidth)>70;
  if(!editing||rotated){restingHeight=height;restingWidth=width;}
  document.documentElement.dataset.appKeyboard=String(Boolean(editing&&!rotated&&restingHeight-height>140));
 }
 window.visualViewport?.addEventListener('resize',updateKeyboard,{passive:true});
 window.addEventListener('resize',updateKeyboard,{passive:true});
 document.addEventListener('focusin',updateKeyboard);
 document.addEventListener('focusout',()=>requestAnimationFrame(updateKeyboard));
 const running=new Set();
 const animate=(node,frames,options)=>{
  const scale=Number(getComputedStyle(document.documentElement).getPropertyValue('--motion-scale')||1);if(!node||reduced()||scale===0||typeof node.animate!=='function')return;options={...options,duration:options.duration*scale,delay:(options.delay||0)*scale};
  const animation=node.animate(frames,options);running.add(animation);
  animation.finished.catch(()=>{}).finally(()=>running.delete(animation));return animation;
 };
 function clearPress(){pressed?.classList.remove('app-pressed');pressed=null;pressPoint=null;cancelAnimationFrame(frame);frame=0;}
 document.addEventListener('pointerdown',event=>{
  if(event.button!==0||reduced())return;
  const node=event.target.closest('.button,.app-round-button,.home-avatar,.bottom-link,.home-course-row,.home-shortcuts a,.app-menu-link,.app-menu-profile');
  if(!node||node.disabled)return;clearPress();pressed=node;
  const bounds=node.getBoundingClientRect();node.style.setProperty('--touch-x',event.clientX-bounds.left+'px');node.style.setProperty('--touch-y',event.clientY-bounds.top+'px');
  pressPoint={x:event.clientX,y:event.clientY};node.classList.add('app-pressed');
 },{passive:true});
 document.addEventListener('pointermove',event=>{
  if(!pressed||!pressPoint)return;
  if(Math.hypot(event.clientX-pressPoint.x,event.clientY-pressPoint.y)>14){clearPress();return;}
  if(frame)return;const x=event.clientX,y=event.clientY;
  frame=requestAnimationFrame(()=>{frame=0;if(!pressed)return;const bounds=pressed.getBoundingClientRect();pressed.style.setProperty('--touch-x',x-bounds.left+'px');pressed.style.setProperty('--touch-y',y-bounds.top+'px');});
 },{passive:true});
 for(const name of ['pointerup','pointercancel','dragstart'])document.addEventListener(name,clearPress,{passive:true});
 window.addEventListener('blur',clearPress);
 document.addEventListener('visibilitychange',()=>{document.documentElement.dataset.appBackground=String(document.hidden);if(document.hidden)clearPress();});
 function positionIndicator(){
  const host=document.querySelector('.tabbar-main');if(!host)return;
  if(host!==tabHost){resize?.disconnect();tabHost=host;indicator=document.createElement('span');indicator.className='glass-tab-indicator';indicator.setAttribute('aria-hidden','true');host.prepend(indicator);if(typeof ResizeObserver!=='undefined'){resize=new ResizeObserver(()=>positionIndicator());resize.observe(host);}}
  const active=host.querySelector('.bottom-link.active');
  if(!active){indicator.style.opacity='0';return;}
  const parent=host.getBoundingClientRect(),target=active.getBoundingClientRect();
  const border=parseFloat(getComputedStyle(host).borderLeftWidth)||0;
  const x=target.left-parent.left-border,width=target.width;
  const previous=getComputedStyle(indicator).transform;
  indicatorMotion?.cancel();indicator.style.width=width+'px';indicator.style.transform=`translateX(${x}px)`;indicator.style.opacity='1';
  if(previous!=='none'&&!reduced())indicatorMotion=animate(indicator,[{transform:previous},{transform:`translateX(${x}px)`}],{duration:430,easing:'cubic-bezier(.22,1.18,.36,1)'});
 }
 function render(route){
  clearPress();positionIndicator();
  if(lastRoute===route)return;lastRoute=route;
  for(const animation of running)if(animation!==indicatorMotion)animation.cancel();
  if(reduced()||route==='forest')return;
  const main=document.querySelector('#main');if(!main)return;
  const home=main.querySelector('.app-home'),study=main.querySelector('.focused-study');
  const nodes=home?['.home-greeting','.home-continue','.upgrade-home-goal','.home-shortcuts','.home-course-section','.upgrade-home-backup','.home-footer-links'].map(s=>home.querySelector(s)).filter(Boolean):study?[...study.children].slice(0,7):[...main.children].slice(0,7);
  nodes.forEach((node,index)=>animate(node,[{opacity:0,transform:'translateY(12px) scale(.993)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:440,delay:Math.min(index*42,210),easing:'cubic-bezier(.22,.8,.2,1)',fill:'backwards'}));
 }
 function sheetOpened(modal){
  if(reduced())return;
  const items=modal.querySelectorAll('.app-menu-shortcuts>.app-menu-link');
  items.forEach((node,index)=>animate(node,[{opacity:0,transform:'translateY(9px) scale(.98)'},{opacity:1,transform:'none'}],{duration:360,delay:85+index*35,easing:'cubic-bezier(.22,.8,.2,1)',fill:'backwards'}));
 }
 return {render,sheetOpened};
}
