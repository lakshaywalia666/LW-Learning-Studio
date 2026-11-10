import {homeUpgradePanels} from './upgrade-markup.js?v=studio47';
import {greeting} from './onboarding.js?v=studio47';
import {workQueue} from './studio.js?v=studio47';
const e=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function renderAppHome(ctx){
 const w=ctx.workspace(),records=ctx.records(),active=records.find(r=>r.course.id===w.settings.activeCourseId)||records[0];
 const queue=active?workQueue(active.data,active.state):null,topic=queue?.next,hasPath=Boolean(queue?.topics.length);
 const hasContent=Boolean(active&&(active.data.topics.length||active.state.custom.topics.length));
 const action=(label,name,attrs='',kind='primary')=>`<button class="button ${kind}" data-action="${name}" ${attrs}>${label}</button>`;
 const icon=ctx.icon,date=new Date().toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'});
 const title=topic?.title||(queue?.deferredCount?'A little pause. A fresh start.':hasPath?'Look how far you’ve come.':active?'Your next chapter starts here.':'What would you like to learn?');
 const description=topic?(active.data.stages.find(s=>s.id===topic.stage)?.title||'Pick up where you left off.'):queue?.deferredCount?'Your skipped tasks are ready when you are.':hasPath?'Your course is complete. Keep exploring at your own pace.':active?'Add your first task. Make it something you’re curious about.':'Create your first course and add a task. One small step is all it takes.';
 const continueButton=active?(hasPath?action((topic?'Continue learning':'Open course')+icon('arrow','sm'),'course',`data-id="${e(active.course.id)}"`):action((hasContent?'Choose topics':'Add tasks')+icon('plus','sm'),'navigate',`data-route="${hasContent?'topics':'builder'}"`)):action('Add your first course'+icon('plus','sm'),'navigate','data-route="courses"');
 return `<section class="studio-home app-home">
  <header class="home-greeting">
   <div><span class="home-date">${e(date)}</span><h1>Today<span class="title-period">.</span></h1><p data-studio-greeting>${e(greeting()+(w.settings.name?', '+w.settings.name:'')+'.')}</p></div>
   <div class="home-header-actions"><button class="app-round-button" data-action="search" aria-label="Search topics and resources">${icon('search')}</button><button class="home-avatar" data-feature="profiles" aria-label="Profiles">${w.settings.name?e(w.settings.name.trim().slice(0,1).toUpperCase()):icon('person')}</button></div>
  </header>
  <section class="home-continue ${active?'has-course':'first-course'}">
   <div class="home-continue-top"><span class="home-kicker">${active?'PICK UP YOUR PATH':'A LITTLE CURIOSITY. A NEW BEGINNING.'}</span>${active?`<span class="home-course-pill" style="--course-tint:${e(active.course.color)}">${icon(active.course.icon||'book','sm')}${e(active.course.title)}</span>`:''}</div>
   <div class="home-hero-content"><div><h2>${e(title)}</h2><p>${e(description)}</p></div><div class="home-book-art" aria-hidden="true"><span class="book-halo"></span><span class="book-sheet book-sheet-back"></span><span class="book-sheet book-sheet-front">${icon('book')}<i></i><i></i></span><span class="book-spark">${icon('spark')}</span></div></div>
   ${hasPath?`<div class="home-course-progress"><span>${queue.tasksDone} of ${queue.tasksTotal} tasks complete</span><div class="progress-line"><span style="width:${queue.tasksTotal?queue.tasksDone/queue.tasksTotal*100:0}%"></span></div></div>`:''}
   <div class="home-continue-actions">${continueButton}</div>
  </section>
  ${homeUpgradePanels(w,records)}
  <div class="home-shortcuts"><a href="#/notebook"><span class="shortcut-icon notes-icon">${icon('note')}</span><span><strong>My notes</strong><small>Keep a thought</small></span>${icon('chevron','sm')}</a><a href="#/forest"><span class="shortcut-icon worlds-icon">${icon('tree')}</span><span><strong>My worlds</strong><small>Watch it grow</small></span>${icon('chevron','sm')}</a></div>
  ${records.length?`<section class="home-course-section"><div class="home-section-heading"><h2>Your courses</h2>${action(icon('plus','sm')+'Add course','navigate','data-route="courses"','text-button')}</div><div class="home-course-list">${records.map(r=>{const q=workQueue(r.data,r.state);return `<button class="home-course-row" data-action="course" data-id="${e(r.course.id)}"><span class="start-course-icon" style="--course-tint:${e(r.course.color)}">${icon(r.course.icon||'book')}</span><span><strong>${e(r.course.title)}</strong><small>${q.learned.size} of ${q.topics.length} topics learned</small></span>${icon('chevron','sm')}</button>`;}).join('')}</div></section>`:''}
  <div class="home-footer-links"><a href="#/learning-insights">${icon('chart','sm')}Your progress${icon('chevron','sm')}</a>${action(w.settings.name?'Edit your name':'Add your name','edit-profile','','text-button')}</div>
  <details class="home-how"><summary>A little help getting started ${icon('down','sm')}</summary><ol><li><strong>Open Study.</strong> Tap your current task to see what to learn.</li><li><strong>Learn your way.</strong> Use the linked resources or your own sources.</li><li><strong>Tap Done.</strong> Your next task appears, and your progress grows.</li></ol><a href="#/guide">Open the guide ${icon('arrow','sm')}</a></details>
 </section>`;
}
