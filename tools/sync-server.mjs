import http from 'node:http';
import https from 'node:https';
import path from 'node:path';
import {readFile,writeFile,mkdir,rename,stat} from 'node:fs/promises';
import {timingSafeEqual,createHash,randomUUID} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const hash=value=>createHash('sha256').update(value).digest('hex');
export function createSyncHandler({directory,maxBytes=205000000}={}){
 const locks=new Map();
 async function locked(id,action){const previous=locks.get(id)||Promise.resolve();let release;const current=new Promise(resolve=>release=resolve);locks.set(id,current);await previous;try{return await action();}finally{release();if(locks.get(id)===current)locks.delete(id);}}
 return async(req,res)=>{
  const headers={'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET, PUT, OPTIONS','Access-Control-Allow-Headers':'Authorization, Content-Type, If-Match'};
  const send=(status,data)=>{res.writeHead(status,headers);res.end(JSON.stringify(data));};
  if(req.method==='OPTIONS')return send(204,{});
  if(req.url==='/health'&&req.method==='GET')return send(200,{service:'lw-encrypted-sync',version:1});
  const match=req.url?.match(/^\/v1\/rooms\/([a-f0-9]{64})$/),token=req.headers.authorization?.match(/^Bearer ([a-f0-9]{64})$/)?.[1];
  if(!match)return send(404,{error:'Not found'});if(!token)return send(401,{error:'Pairing token required'});
  const id=match[1],file=path.join(directory,id+'.json');
  try{return await locked(id,async()=>{
   let row;try{if((await stat(file)).size>maxBytes+2048)throw new Error('Snapshot too large');row=JSON.parse(await readFile(file,'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
   if(row){const saved=Buffer.from(row.tokenHash,'hex'),provided=Buffer.from(hash(token),'hex');if(saved.length!==provided.length||!timingSafeEqual(saved,provided))return send(403,{error:'Pairing token does not match'});}
   if(req.method==='GET')return row?send(200,{revision:row.revision,updatedAt:row.updatedAt,envelope:row.envelope}):send(404,{error:'Workspace has not synced yet'});
   if(req.method!=='PUT')return send(405,{error:'Method not allowed'});
   if(!/^\d+$/.test(String(req.headers['if-match']||''))||Number(req.headers['if-match'])!==(row?.revision||0))return send(409,{error:'Another device saved a newer revision'});
   let length=0,chunks=[];for await(const chunk of req){length+=chunk.length;if(length>maxBytes)return send(413,{error:'Encrypted snapshot exceeds the size limit'});chunks.push(chunk);}
   let body;try{body=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{return send(400,{error:'Invalid JSON'});}
   const e=body.envelope;if(e?.format!=='lw-encrypted-sync'||e.version!==1||typeof e.ciphertext!=='string'||!/^[A-Za-z0-9+/]{22}==$/.test(e.salt||'')||!/^[A-Za-z0-9+/]{16}$/.test(e.iv||'')||!/^[A-Za-z0-9+/]*={0,2}$/.test(e.ciphertext)||e.ciphertext.length<24)return send(400,{error:'Only encrypted workspace snapshots are accepted'});
   await mkdir(directory,{recursive:true,mode:0o700});const next={revision:(row?.revision||0)+1,updatedAt:new Date().toISOString(),tokenHash:hash(token),envelope:e},temporary=file+'.'+randomUUID()+'.tmp';
   await writeFile(temporary,JSON.stringify(next),{mode:0o600});await rename(temporary,file);return send(200,{revision:next.revision,updatedAt:next.updatedAt});
  });}catch{return send(500,{error:'The encrypted workspace could not be stored'});}
 };
}
export async function startSyncServer({host='127.0.0.1',port=4318,directory=path.resolve('work/sync-data'),cert,key}={}){
 if(!cert&&!['127.0.0.1','localhost','::1'].includes(host))throw new Error('A network sync server requires TLS_CERT and TLS_KEY.');
 if(Boolean(cert)!==Boolean(key))throw new Error('Provide both TLS_CERT and TLS_KEY.');
 const handler=createSyncHandler({directory}),server=cert?https.createServer({cert:await readFile(cert),key:await readFile(key)},handler):http.createServer(handler);
 server.requestTimeout=120000;server.headersTimeout=15000;await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,host,resolve);});return server;
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 const server=await startSyncServer({host:process.env.LW_SYNC_HOST||'127.0.0.1',port:Number(process.env.LW_SYNC_PORT||4318),directory:path.resolve(process.env.LW_SYNC_DATA||'work/sync-data'),cert:process.env.LW_SYNC_TLS_CERT,key:process.env.LW_SYNC_TLS_KEY});
 console.log('LW encrypted sync is listening on port '+server.address().port+'. Pairing is optional; local app data remains available offline.');
 for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
}
