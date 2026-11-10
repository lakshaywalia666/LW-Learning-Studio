import {profileKey} from './profiles.js?v=studio47';
import {ensureUpgrades,validateUpgrades,reorderTopic,newLessonMedia,validateLessonMedia,noteOutline,snoozeReview,cycleStart,cyclePause,cycleTick,homeLearningSummary,studyLessonMedia} from './upgrades.js?v=studio47';
import {readingControls,restControls,cycleControls,cyclePanel,widgetControls,syncControls,lessonMediaHTML,builderMediaHTML,backupStatus,escapeHTML as e,upgradeButton as button} from './upgrade-markup.js?v=studio47';
import {SyncClient,newPairingCode,validateSyncEndpoint,pairingIdentity} from './sync-client.js?v=studio47';
import {VoiceRecorder} from './voice-recorder.js?v=studio47';
import {newPage} from './learning.js?v=studio47';
import {fileDataURL,storeFile} from './library-store.js?v=studio47';
import {isoDate,addDays,uid} from './model.js?v=studio47';

const PAIRING_KEY=profileKey('lw-sync-pairing');
export function createUpgradesUI(ctx){
 const w=ctx.workspace,u=()=>ensureUpgrades(w());
 let dragged='',pendingBackup=false,recorder=null,recordContext=null,recordSaving=null,nextSync=Date.now()+30000,syncConflict=false,conflictRevision,nativeBackground=false;
 const readConfig=()=>{try{return JSON.parse(localStorage.getItem(PAIRING_KEY)||'{}');}catch{return {};}};
 const saveConfig=async config=>{localStorage.setItem(PAIRING_KEY,JSON.stringify(config));window.AndroidApp?.setSyncEndpoint?.(config.enabled?config.endpoint:'');};
 const sync=new SyncClient({getConfig:readConfig,saveConfig,createBackup:ctx.syncBackup,applyRemote:payload=>ctx.restore(payload,{sync:true})});
 const save=()=>ctx.persist({metadataOnly:true});
 const modal=(title,body)=>ctx.modal(`<div class="dialog-content upgrade-dialog"><div class="dialog-head"><h2>${e(title)}</h2>${button('×','close','aria-label="Close dialog"')}</div>${body}</div>`);
 const fail=error=>ctx.toast(error.message||String(error),true);
 function applyReading(){const r=u().reading,root=document.documentElement;root.style.setProperty('--reading-size',r.fontSize+'px');root.style.setProperty('--reading-leading',r.lineHeight);root.style.setProperty('--reading-tracking',r.letterSpacing+'em');root.dataset.readingContrast=r.contrast;root.dataset.largeTargets=String(r.largeTargets);}
 function append(host,html,marker){if(!host||host.querySelector(`[data-upgrade-host="${marker}"]`))return;const box=document.createElement('div');box.dataset.upgradeHost=marker;box.innerHTML=html;host.append(box);}
 function hydrate(){
  applyReading();const route=ctx.route(),main=document.querySelector('#main');if(!main)return;
  if(route==='settings')append(main,readingControls(w())+restControls(w())+cycleControls(w())+widgetControls(w(),ctx.records())+syncControls(readConfig()),'settings');
  if(route==='appearance')append(main,readingControls(w()),'reading');
  if(route==='device')append(main,widgetControls(w(),ctx.records())+syncControls(readConfig()),'device');
  if(route==='work'){
   const card=main.querySelector('[data-study-task]'),media=studyLessonMedia(ctx.data(),ctx.state(),card?.dataset.studyTopic,card?.dataset.studyTask);
   append(main.querySelector('.focus-explanation'),lessonMediaHTML(media,card?.dataset.studyTopic),'lesson');
   append(main.querySelector('.focus-more>div'),cyclePanel(w()),'cycle');
  }
  if(route==='builder'){
   const access=ctx.builder();if(access.topic)append(main.querySelector('.builder-editor'),builderMediaHTML(access.topic),'media');
   for(const node of main.querySelectorAll('.builder-topics [data-action="learn-builder-select"]')){
    node.draggable=true;node.dataset.reorderTopic=node.dataset.id;node.title='Drag to reorder topics';
    const index=access.data.topics.findIndex(t=>t.id===node.dataset.id),row=document.createElement('div');row.className='upgrade-topic-row';node.before(row);row.append(node);
    const controls=document.createElement('div');controls.className='upgrade-reorder';controls.innerHTML=button('↑','move-topic',`data-id="${e(node.dataset.id)}" data-step="-1" aria-label="Move ${e(access.data.topics[index].title)} up" ${index===0?'disabled':''}`,'ghost small')+button('↓','move-topic',`data-id="${e(node.dataset.id)}" data-step="1" aria-label="Move ${e(access.data.topics[index].title)} down" ${index===access.data.topics.length-1?'disabled':''}`,'ghost small');row.append(controls);
   }
  }
  if(route==='notebook'){
   const tools=main.querySelector('.note-tools-popover');append(tools||main,button('Record voice note','record-open','','ghost small')+(ctx.page()?button('Make a course from this page','note-course','','ghost small'):''),'notebook');
  }
  if(route==='reviews'){
   for(const node of main.querySelectorAll('[data-action="learn-review-result"][data-result="good"]')){
    const host=node.parentElement;append(host,button('<span data-ui-text>Tomorrow</span>','snooze',`data-course="${e(node.dataset.course)}" data-id="${e(node.dataset.id)}"`,'ghost small')+button('Choose date','snooze-date',`data-course="${e(node.dataset.course)}" data-id="${e(node.dataset.id)}"`,'ghost small'),'snooze');
   }
  }
  for(const host of main.querySelectorAll('[data-cycle-panel]'))host.innerHTML=cyclePanel(w());
  updateClock();updateBackup();
 }
 function updateBackup(){let status;try{status=JSON.parse(window.AndroidApp?.getDeviceStatus?.()||'null');}catch{}const b=backupStatus(w(),status);for(const host of document.querySelectorAll('[data-backup-status]'))host.textContent=b.label+(b.at?' · '+new Date(b.at).toLocaleString():'');}
 function prepared(){pendingBackup=true;u().backup.lastPreparedAt=new Date().toISOString();save();updateBackup();}
 function nativeBackup(event){if(!pendingBackup)return;pendingBackup=false;if(event.detail==='saved'){u().backup.lastSavedAt=new Date().toISOString();save();updateBackup();}}
 function updateClock(){const c=u().cycle,ms=c.endsAt===null?(c.remainingMs||c.studyMinutes*60000):Math.max(0,c.endsAt-Date.now()),seconds=Math.ceil(ms/1000);for(const host of document.querySelectorAll('[data-cycle-clock]'))host.textContent=Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');for(const host of document.querySelectorAll('[data-upgrade=cycle-toggle]'))host.textContent=c.endsAt===null?'Start / resume':'Pause';for(const host of document.querySelectorAll('[data-cycle-phase]'))host.textContent=({idle:'Focus timer',study:'Study time',break:'Break time','long-break':'Long break',ready:'Ready for another round'})[c.phase];}
 async function runSync(choice='auto',manual=false){
  if(document.hidden||nativeBackground||syncConflict&&choice==='auto')return;nextSync=Date.now()+30000;
  try{
   const result=await sync.exchange(choice,choice==='auto'?{}:{expectedRevision:conflictRevision});
   if(result.status==='conflict'){
    syncConflict=true;conflictRevision=result.revision;const counts=p=>Object.keys(p.workspace?.courses||{}).length+' courses · '+(p.workspace?.learning?.pages?.length||0)+' notebook pages';
    modal('Choose which workspace to use',`<p>Both devices have work to keep. A local restore point is saved before receiving another workspace.</p><div class="upgrade-compare"><div><h3>This device</h3><p>${e(counts(result.local))}</p></div><div><h3>Other device</h3><p>${e(counts(result.remote))}</p></div></div><p>Review or export a backup first if you need both versions. This choice replaces one whole workspace; it does not merge individual notes.</p><div class="button-row">${button('Receive other workspace','sync-pull','','primary')}${button('Send this workspace','sync-push')}${button('Decide later','sync-later')}</div>`);
   }else if(result.status==='retry-conflict'){ctx.toast('Another device saved during sync. Sync again to review the newest version.',true);}
   else if(manual&&!['disabled','busy'].includes(result.status))ctx.toast(result.status==='pulled'?'Workspace received.':result.status==='pushed'?'Workspace sent.':'Both devices are up to date.');
   updateSyncStatus();
  }catch(error){if(manual)fail(error);updateSyncStatus();}
 }
 function updateSyncStatus(){const c=readConfig();for(const host of document.querySelectorAll('[data-sync-status]'))host.textContent=c.error?'Waiting: '+c.error:c.lastSync?'Last synced '+new Date(c.lastSync).toLocaleString():c.enabled?'Connected; ready to sync':'Sync is off. No workspace data is sent.';}
 function tick(){
  if(!w())return;const before=u().cycle,after=cycleTick(before);if(before!==after){u().cycle=after;save();ctx.toast(after.phase==='study'?'Your next study round has started.':after.phase==='ready'?'Break complete. Start another round when ready.':'Study round complete. Take a break.');for(const host of document.querySelectorAll('[data-upgrade-host="cycle"],[data-cycle-panel]'))host.innerHTML=cyclePanel(w());}updateClock();
  const c=readConfig();if(c.enabled&&c.automatic&&!document.hidden&&!nativeBackground&&navigator.onLine!==false&&Date.now()>nextSync&&!document.activeElement?.closest('input,textarea,select,[contenteditable=true]'))void runSync();
 }
 function recordModal(){modal('Record a voice note',`<p>Record up to ten minutes. Your recording is saved as an audio block in this notebook.</p><p role="status" data-record-status>Microphone is off.</p><div class="button-row">${button('<span data-ui-text>Start recording</span>','record-start','','primary')}${button('<span data-ui-text>Stop & save</span>','record-save','disabled')}${button('<span data-ui-text>Cancel recording</span>','record-cancel')}</div>`);}
 async function startRecording(){
  if(recorder)throw new Error('Finish the current recording first.');
  ctx.flush();recordContext={workspace:w(),pageId:ctx.page()?.id};
  recorder=new VoiceRecorder({onState:state=>{const host=document.querySelector('[data-record-status]');if(host)host.textContent=state==='recording'?'Recording…':'Recording stopped.';if(state==='stopped'&&!recordSaving)void saveRecording();}});
  try{await recorder.start();if(recorder?.recorder){document.querySelector('[data-upgrade="record-start"]')?.setAttribute('disabled','');document.querySelector('[data-upgrade="record-save"]')?.removeAttribute('disabled');}}
  catch(error){recorder=null;throw error;}
 }
 async function saveRecording(cancel=false){
  if(recordSaving)return recordSaving;if(!recorder)return;
  const current=recorder,context=recordContext;recordSaving=(async()=>{
   try{const blob=await current.stop(cancel);if(cancel||!blob?.size)return;if(context.workspace!==w())throw new Error('Workspace changed. Record your note again in this workspace.');
    const suffix=blob.type.includes('mp4')?'m4a':blob.type.includes('ogg')?'ogg':blob.type.includes('wav')?'wav':'webm',file=new File([blob],'Voice note '+new Date().toISOString().replaceAll(':','-')+'.'+suffix,{type:blob.type.split(';')[0]}),meta=await storeFile(file);
    let page=w().learning.pages.find(p=>p.id===context.pageId&&!p.trashed);if(!page)page=newPage(w(),{title:'Voice note'});
    w().learning.assets.push(meta);page.blocks.push({id:uid('block'),type:'audio',text:meta.name,assetId:meta.id,checked:false});page.updatedAt=new Date().toISOString();save();await ctx.commit();ctx.closeModal();ctx.navigate('notebook?page='+encodeURIComponent(page.id));ctx.render();ctx.toast('Voice note saved.');
   }catch(error){fail(error);}finally{recorder=null;recordContext=null;recordSaving=null;document.querySelector('[data-upgrade=record-start]')?.removeAttribute('disabled');document.querySelector('[data-upgrade=record-save]')?.setAttribute('disabled','');}
  })();return recordSaving;
 }
 function pick(accept){return new Promise(resolve=>{const input=document.createElement('input');input.type='file';input.accept=accept;input.style.display='none';document.body.append(input);input.onchange=()=>{const file=input.files?.[0];input.remove();resolve(file);};input.oncancel=()=>{input.remove();resolve(null);};input.click();});}
 async function attachLesson(kind){
  const access=ctx.builder();access.flush();const topic=access.topic,workspace=w();if(!topic)throw new Error('Add a topic first.');const file=await pick(kind==='image'?'image/png,image/jpeg,image/webp,image/gif':kind==='pdf'?'application/pdf,.pdf':'audio/*');if(!file)return;if(file.size>5000000)throw new Error('Choose a file smaller than 5 MB.');
  const item=newLessonMedia(kind,file.name,await fileDataURL(file));if(workspace!==w())throw new Error('Workspace changed. Please add the file again.');validateLessonMedia([...(topic.lessonMedia||[]),item]);if(access.data.topics.reduce((n,t)=>n+(t.lessonMedia||[]).reduce((total,m)=>total+m.dataURL.length,0),0)+item.dataURL.length>12000000)throw new Error('Keep all course images and audio below 9 MB in total.');topic.lessonMedia=[...(topic.lessonMedia||[]),item];access.save();ctx.render();
 }
 async function act(node){const action=node.dataset.upgrade,id=node.dataset.id,course=node.dataset.course;
  switch(action){
   case'close':ctx.closeModal();break;
   case'goal':modal('Set today’s learning goal',`<form data-upgrade-form="goal"><label class="upgrade-field">Minutes per day<input name="minutes" type="number" value="${w().learning.dailyMinutes}" min="5" max="1440" required></label><button class="button primary">Save daily goal</button></form>`);break;
   case'backup':await ctx.exportBackup();break;
   case'move-topic':{const access=ctx.builder();access.flush();const index=access.data.topics.findIndex(t=>t.id===id);reorderTopic(access.data,id,index+Number(node.dataset.step));access.save();ctx.render();break;}
   case'lesson-image':await attachLesson('image');break;
   case'lesson-audio':await attachLesson('audio');break;
   case'lesson-pdf':await attachLesson('pdf');break;
   case'lesson-remove':{const access=ctx.builder();access.flush();access.topic.lessonMedia=(access.topic.lessonMedia||[]).filter(m=>m.id!==id);access.save();ctx.render();break;}
   case'note-course':{ctx.flush();const page=ctx.page();modal('Make a course from your notes',`<p>Headings and list items become topics. The text below them becomes “What to learn.” Edit this short outline before creating the course.</p><form data-upgrade-form="note-course"><label class="upgrade-field">Course name<input name="title" value="${e(page.title)}" required maxlength="100"></label><label class="upgrade-field">Topics — one per line<textarea name="outline" rows="10" required>${e(noteOutline(page))}</textarea></label><p>Your original notebook page is kept.</p><button class="button primary">Create course</button></form>`);break;}
   case'record-open':recordModal();break;
   case'record-start':await startRecording();break;
   case'record-save':await saveRecording();break;
   case'record-cancel':await saveRecording(true);ctx.closeModal();break;
   case'snooze':snoozeReview(w(),course,id,addDays(isoDate(),1));save();ctx.render();ctx.toast('Review moved to tomorrow.');break;
   case'snooze-date':modal('Choose a review date',`<form data-upgrade-form="snooze" data-course="${e(course)}" data-id="${e(id)}"><label class="upgrade-field">Review date<input name="date" type="date" min="${isoDate()}" max="${addDays(isoDate(),3650)}" value="${addDays(isoDate(),1)}" required></label><button class="button primary">Move review</button></form>`);break;
   case'cycle-toggle':u().cycle=u().cycle.endsAt===null?cycleStart(u().cycle):cyclePause(u().cycle);save();ctx.render();break;
   case'cycle-reset':u().cycle={...u().cycle,phase:'idle',rounds:0,remainingMs:0,endsAt:null};save();ctx.render();break;
   case'cycle-settings':modal('Study & break cycles',cycleControls(w()));for(const host of document.querySelectorAll('[data-cycle-panel]'))host.innerHTML=cyclePanel(w());updateClock();break;
   case'new-code':{const input=node.closest('form').elements.code;input.value=newPairingCode();input.focus();break;}
   case'sync-now':await runSync('auto',true);break;
   case'sync-pull':case'sync-push':syncConflict=false;ctx.closeModal();await runSync(action==='sync-pull'?'pull':'push',true);break;
   case'sync-later':syncConflict=true;ctx.closeModal();ctx.toast('Sync paused until you choose Sync now.');break;
   case'sync-off':await saveConfig({enabled:false});syncConflict=false;ctx.render();ctx.toast('Device disconnected. Your local workspace is kept.');break;
  }
 }
 async function submit(form){const data=new FormData(form),kind=form.dataset.upgradeForm,old=structuredClone(u());
  try{switch(kind){
   case'goal':{const value=Number(data.get('minutes'));if(!Number.isInteger(value)||value<5||value>1440)throw new Error('Choose 5–1440 minutes.');w().learning.dailyMinutes=value;break;}
   case'reading':u().reading={fontSize:Number(data.get('fontSize')),lineHeight:Number(data.get('lineHeight')),letterSpacing:Number(data.get('letterSpacing')),contrast:data.get('contrast'),largeTargets:data.has('largeTargets')};break;
   case'rest-days':u().restAwareStreaks=data.has('enabled');u().restDays=data.getAll('days').map(Number);break;
   case'cycle':u().cycle={...u().cycle,...Object.fromEntries(['studyMinutes','breakMinutes','longBreakMinutes','longEvery'].map(key=>[key,Number(data.get(key))])),autoContinue:data.has('autoContinue'),phase:'idle',remainingMs:0,endsAt:null};break;
   case'widget':u().widgetMode=data.get('mode');break;
   case'snooze':snoozeReview(w(),form.dataset.course,form.dataset.id,data.get('date'));break;
   case'note-course':ctx.addCourse(data.get('title'),data.get('outline'));ctx.closeModal();return;
   case'sync':{const endpoint=validateSyncEndpoint(data.get('endpoint').trim()),code=data.get('code').trim();await pairingIdentity(code);const previous=readConfig(),same=previous.endpoint===endpoint&&previous.code===code;await saveConfig({...(same?previous:{}),enabled:true,endpoint,code,automatic:data.has('automatic')});syncConflict=false;ctx.render();await runSync('auto',true);return;}
  }validateUpgrades(w());save();await ctx.commit();ctx.closeModal();ctx.render();ctx.toast('Saved.');}
  catch(error){w().learning.upgrades=old;throw error;}
 }
 document.addEventListener('click',event=>{const node=event.target.closest('[data-upgrade]');if(!node||node.disabled)return;event.preventDefault();if(node.dataset.upgrade==='sync-now')syncConflict=false;void act(node).catch(fail);});
 document.addEventListener('submit',event=>{const form=event.target.closest('[data-upgrade-form]');if(!form)return;event.preventDefault();void submit(form).catch(fail);});
 document.addEventListener('dragstart',event=>{const node=event.target.closest('[data-reorder-topic]');if(!node)return;dragged=node.dataset.reorderTopic;event.dataTransfer?.setData('text/plain',dragged);});
 document.addEventListener('dragover',event=>{if(dragged&&event.target.closest('[data-reorder-topic]'))event.preventDefault();});
 document.addEventListener('drop',event=>{const target=event.target.closest('[data-reorder-topic]');if(!dragged||!target)return;event.preventDefault();try{const access=ctx.builder();access.flush();reorderTopic(access.data,dragged,access.data.topics.findIndex(t=>t.id===target.dataset.reorderTopic));access.save();ctx.render();}catch(error){fail(error);}dragged='';});
 document.addEventListener('dragend',()=>{dragged='';});
 function background(){nativeBackground=true;if(u().cycle.endsAt!==null){u().cycle=cyclePause(u().cycle);save();}if(recorder)void saveRecording();}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)background();else{nativeBackground=false;nextSync=Date.now()+1000;updateClock();updateBackup();}});
 window.addEventListener('online',()=>{nextSync=Date.now()+1000;});window.addEventListener('native-backup',nativeBackup);window.addEventListener('native-device-status',updateBackup);window.addEventListener('native-foreground',()=>{nativeBackground=false;nextSync=Date.now()+1000;updateClock();updateBackup();});
 document.querySelector('#modal')?.addEventListener('close',()=>{if(recorder&&!recordSaving)void saveRecording();});
 window.addEventListener('pagehide',()=>{if(recorder)void saveRecording();});
 if(window.AndroidApp?.setSyncEndpoint){const c=readConfig();window.AndroidApp.setSyncEndpoint(c.enabled?c.endpoint:'');}
 return {waitForSync:async()=>{const previous=nativeBackground;nativeBackground=true;while(sync.busy)await new Promise(resolve=>setTimeout(resolve,100));return ()=>{nativeBackground=previous;};},hydrate,tick,background,applyReading,prepared,beforeReplace:async()=>{if(recorder)await saveRecording();},syncBackupSummary:()=>homeLearningSummary(ctx.records(),w())};
}
