#!/usr/bin/env node
import fs from 'node:fs/promises';
import {validateCoursePack} from '../Cyberpath/public/workspace.js';
const file=process.argv[2];
if(!file){console.error('Usage: node validate-lw.mjs /path/to/course.lw');process.exitCode=2;}
else try{
 const info=await fs.stat(file);if(info.size>16000000)throw new Error('Choose a course file smaller than 16 MB.');
 const payload=JSON.parse(await fs.readFile(file,'utf8'));if(payload.format!=='lw-learning-studio'||payload.kind!=='course')throw new Error('Expected an LW course file.');
 const data=validateCoursePack(payload),tasks=data.topics.flatMap(t=>t.tasks),items=tasks.reduce((sum,t)=>sum+t.checklist.length,0);
 console.log(`VALID LW v${payload.version}: ${data.meta.course.title}\n${data.stages.length} stages · ${data.topics.length} topics · ${tasks.length} tasks · ${items} checkbox items\n${data.projects.length} projects · ${data.resources.length} resources · ${data.tools.length} tools · ${data.labs.length} labs`);
}catch(error){console.error('INVALID LW: '+error.message);process.exitCode=1;}
