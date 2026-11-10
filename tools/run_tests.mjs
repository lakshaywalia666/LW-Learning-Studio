import {readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=fileURLToPath(new URL('../outputs/Cyberpath/',import.meta.url));
const files=(await readdir(new URL('../outputs/Cyberpath/tests/',import.meta.url))).filter(name=>name.endsWith('.test.mjs')).sort();
const result=spawnSync(process.execPath,['--test',...files.map(name=>'tests/'+name)],{cwd:root,stdio:'inherit'});
if(result.error){console.error(result.error.message);process.exit(1);}
process.exit(result.status??1);
