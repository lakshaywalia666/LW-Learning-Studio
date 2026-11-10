import test from 'node:test';import assert from 'node:assert/strict';
import {createWorkspace,workspaceBackup,parseWorkspaceBackup} from '../public/workspace.js';
import {createDeck,saveCard,rateCard,validatePractice} from '../public/practice-tools.js';
import {normalizedCover,validateImageMask,imageCardMarkup} from '../public/image-masks.js';
const image=()=>({assetId:'image-one',hash:'a'.repeat(64),description:'A diagram of a leaf',regions:[{id:'cover-one',x:.1,y:.2,width:.3,height:.1,answer:'Blade'}]});
test('covers use image-relative coordinates and reject tiny, non-finite or out-of-bounds regions',()=>{
 assert.deepEqual(normalizedCover({x:.5,y:.6},{x:.1,y:.2}),{x:.1,y:.2,width:.4,height:.39999999999999997});
 assert.throws(()=>normalizedCover({x:0,y:0},{x:.001,y:.1}),/larger/);assert.throws(()=>normalizedCover({x:NaN,y:0},{x:.5,y:.5}),/inside/);
 for(const change of [{x:-.1},{x:.9},{width:0},{height:NaN},{answer:''}]){const value=image();Object.assign(value.regions[0],change);assert.throws(()=>validateImageMask(value),/inside/);}
 const duplicate=image();duplicate.regions.push({...duplicate.regions[0]});assert.throws(()=>validateImageMask(duplicate),/inside/);
});
test('image cards keep covers and answers through backups, rate independently and never alter study',()=>{
 const w=createWorkspace(),deck=createDeck(w,'Botany'),before=structuredClone(w.courses),card=saveCard(w,{deckId:deck.id,type:'image',front:'Name this part',back:'Look at its shape.',image:image()});
 validatePractice(w);const restored=parseWorkspaceBackup(JSON.stringify(workspaceBackup(w)));assert.deepEqual(restored.learning.practice.cards[0].image,card.image);
 rateCard(w,card.id,'good',new Date('2026-11-04T09:00:00Z'));assert.equal(card.reviews.length,1);assert.deepEqual(w.courses,before);assert.equal(card.type,'image');
 const source=image();saveCard(w,{deckId:deck.id,type:'image',front:'A second part',image:source});source.regions[0].answer='Mutated elsewhere';assert.equal(w.learning.practice.cards[1].image.regions[0].answer,'Blade');
});
test('invalid image edits leave the prior card intact, and hidden markup contains no answer',()=>{
 const w=createWorkspace(),deck=createDeck(w,'Diagrams'),card=saveCard(w,{deckId:deck.id,type:'image',front:'Name it',image:image()}),before=structuredClone(card),bad=image();bad.regions[0].width=2;
 assert.throws(()=>saveCard(w,{deckId:deck.id,type:'image',front:'Bad change',image:bad},card.id),/inside/);assert.deepEqual(card,before);assert.equal(imageCardMarkup(card,false).includes('Blade'),false);
 saveCard(w,{deckId:deck.id,type:'basic',front:'Question',back:'Answer'},card.id);assert.equal(card.image,undefined);assert.equal(card.reviews.length,0);
});
