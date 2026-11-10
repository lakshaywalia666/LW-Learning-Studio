// CSS carries the animation; JS only updates a small tilt on pointer movement.
export function bindOrb(stage,{motion=()=>true}={}){
 const tilt=stage.querySelector('.orb-tilt'),button=stage.querySelector('.work-bubble');let frame=0,rx=0,ry=0,down=null,suppressClick=false,visible=true;
 const active=()=>{const enabled=motion()&&!document.hidden&&visible;stage.dataset.orbActive=String(enabled);if(!enabled){down=null;stage.classList.remove('orb-pressed');rx=ry=0;paint();}else if(!down){rx=-4;ry=7;paint();}};
 const paint=()=>{frame=0;tilt.style.setProperty('--orb-rx',rx.toFixed(2)+'deg');tilt.style.setProperty('--orb-ry',ry.toFixed(2)+'deg');};
 const update=()=>{if(!frame)frame=requestAnimationFrame(paint);};
 const move=e=>{if(!motion()||button.disabled||button.classList.contains('is-complete')||e.pointerType==='touch'&&!down)return;const rect=button.getBoundingClientRect(),nx=Math.max(-1,Math.min(1,(e.clientX-rect.left-rect.width/2)/(rect.width/2))),ny=Math.max(-1,Math.min(1,(e.clientY-rect.top-rect.height/2)/(rect.height/2)));rx=-ny*9;ry=nx*11;if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>10)suppressClick=true;update();};
 const start=e=>{if(!e.isPrimary||button.disabled)return;down={x:e.clientX,y:e.clientY};suppressClick=false;stage.classList.add('orb-pressed');move(e);};
 const end=()=>{down=null;rx=motion()?-4:0;ry=motion()?7:0;stage.classList.remove('orb-pressed');update();};
 const cancel=()=>{if(down)suppressClick=true;end();};
 const leave=()=>{if(down)cancel();else{rx=motion()?-4:0;ry=motion()?7:0;update();}};
 const click=e=>{if(suppressClick){suppressClick=false;e.preventDefault();e.stopImmediatePropagation();}};
 stage.addEventListener('pointermove',move);button.addEventListener('pointerdown',start);stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',cancel);stage.addEventListener('pointerleave',leave);stage.addEventListener('click',click,true);document.addEventListener('visibilitychange',active);
 const observer='IntersectionObserver'in window?new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;active();},{threshold:.05}):null;observer?.observe(stage);active();
 return{dispose(){cancelAnimationFrame(frame);observer?.disconnect();document.removeEventListener('visibilitychange',active);stage.removeEventListener('pointermove',move);button.removeEventListener('pointerdown',start);stage.removeEventListener('pointerup',end);stage.removeEventListener('pointercancel',cancel);stage.removeEventListener('pointerleave',leave);stage.removeEventListener('click',click,true);}};
}
