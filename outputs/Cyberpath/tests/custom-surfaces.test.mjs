import test from 'node:test';import assert from 'node:assert/strict';import {customColorSurface,contrastRatio} from '../public/personalize.js';
test('custom colours keep text and controls readable independently of the scheduled theme',()=>{
 for(const colors of [{text:'#1c2130',background:'#f3f4f8',accent:'#245de8'},{text:'#ffffff',background:'#101818',accent:'#bae593'},{text:'#767676',background:'#ffffff',accent:'#767676'}]){
  const result=customColorSurface({enabled:true,...colors});for(const panel of ['--bg','--panel','--panel2','--panel3','--app-paper','--app-inset','--app-glass']){assert(contrastRatio(result.vars['--text'],result.vars[panel])>=4.5);assert(contrastRatio(result.vars['--muted'],result.vars[panel])>=4.5);assert(contrastRatio(result.vars['--accent'],result.vars[panel])>=4.5);}assert(contrastRatio(result.vars['--border'],colors.background)>=3);assert(contrastRatio(result.vars['--custom-on-accent'],colors.accent)>=4.5);
 }
 assert.equal(customColorSurface({enabled:true,text:'#1c2130',background:'#f3f4f8',accent:'#245de8'}).mode,'light');assert.equal(customColorSurface({enabled:true,text:'#ffffff',background:'#101818',accent:'#bae593'}).mode,'dark');
});
test('disabled custom surfaces use the theme, and unreadable colours cannot generate overrides',()=>{assert.equal(customColorSurface({enabled:false}),null);assert.throws(()=>customColorSurface({enabled:true,text:'#fff',background:'#000000',accent:'#ffffff'}),/4.5/);assert.throws(()=>customColorSurface({enabled:true,text:'#eeeeee',background:'#ffffff',accent:'#245de8'}),/4.5/);});
