const encoder=new TextEncoder(),decoder=new TextDecoder();
const b64=bytes=>{let text='';for(let i=0;i<bytes.length;i+=16384)text+=String.fromCharCode(...bytes.subarray(i,i+16384));return btoa(text);};
const unb64=text=>Uint8Array.from(atob(text),c=>c.charCodeAt(0));
const hex=bytes=>[...bytes].map(b=>b.toString(16).padStart(2,'0')).join('');
const digest=async text=>hex(new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(text))));
export function validateSyncEndpoint(value){
 let url;try{url=new URL(value);}catch{throw new Error('Enter a valid HTTPS sync server address.');}if(url.username||url.password||url.search||url.hash)throw new Error('Use a server address without a password, query, or fragment.');
 if(url.protocol!=='https:'&&!(url.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(url.hostname)))throw new Error('Device sync needs HTTPS. HTTP is allowed only for a local desktop test.');
 return url.href.replace(/\/+$/,'');
}
export function newPairingCode(){return b64(crypto.getRandomValues(new Uint8Array(24))).replaceAll('+','-').replaceAll('/','_').replaceAll('=','');}
export async function pairingIdentity(code){
 if(typeof code!=='string'||!/^[A-Za-z0-9_-]{24,128}$/.test(code))throw new Error('Use the generated pairing code from your other device.');
 return {room:await digest('LW room v1\n'+code),token:await digest('LW auth v1\n'+code)};
}
async function encryptionKey(code,salt){
 const material=await crypto.subtle.importKey('raw',encoder.encode(code),'PBKDF2',false,['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:210000,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
export async function encryptSnapshot(payload,code){
 const bytes=encoder.encode(JSON.stringify(payload));if(bytes.length>150000000)throw new Error('The workspace exceeds the 150 MB sync limit.');
 const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),key=await encryptionKey(code,salt);
 const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:encoder.encode('lw-sync-v1')},key,bytes);
 return {format:'lw-encrypted-sync',version:1,salt:b64(salt),iv:b64(iv),ciphertext:b64(new Uint8Array(encrypted))};
}
export async function decryptSnapshot(envelope,code){
 if(envelope?.format!=='lw-encrypted-sync'||envelope.version!==1||typeof envelope.ciphertext!=='string'||envelope.ciphertext.length>200000024)throw new Error('The sync server returned an unsupported snapshot.');
 try{const salt=unb64(envelope.salt),iv=unb64(envelope.iv);if(salt.length!==16||iv.length!==12)throw new Error('Invalid encryption parameters');const key=await encryptionKey(code,salt);return JSON.parse(decoder.decode(await crypto.subtle.decrypt({name:'AES-GCM',iv,additionalData:encoder.encode('lw-sync-v1')},key,unb64(envelope.ciphertext))));}
 catch{throw new Error('This snapshot could not be decrypted. Check that both devices use the same pairing code.');}
}
function canonical(value){if(Array.isArray(value))return value.map(canonical);if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])]));return value;}
export async function syncFingerprint(payload){
 const copy=structuredClone(payload);delete copy.exportedAt;const w=copy.workspace;
 if(w){delete w.revision;delete w.updatedAt;delete w.companionData;delete w.devicePreferences;
  if(w.learning){delete w.learning.resume;delete w.learning.pendingHistory;delete w.learning.noteRestoreAt;if(w.learning.capture)delete w.learning.capture.recent;if(w.learning.upgrades){delete w.learning.upgrades.backup;const c=w.learning.upgrades.cycle;if(c)for(const k of ['phase','remainingMs','endsAt','rounds'])delete c[k];}}
 }
 copy.activityHistory?.sort((a,b)=>a.id.localeCompare(b.id));copy.localFiles?.sort((a,b)=>a.id.localeCompare(b.id));
 return digest(JSON.stringify(canonical(copy)));
}
export class SyncClient{
 constructor({getConfig,saveConfig,createBackup,applyRemote,request=(...args)=>globalThis.fetch(...args)}){Object.assign(this,{getConfig,saveConfig,createBackup,applyRemote,request});this.busy=false;}
 async exchange(choice='auto',{expectedRevision}={}){
  if(this.busy)return {status:'busy'};this.busy=true;
  try{
   const config=this.getConfig();if(!config?.enabled)return {status:'disabled'};
   const endpoint=validateSyncEndpoint(config.endpoint),identity=await pairingIdentity(config.code),url=endpoint+'/v1/rooms/'+identity.room,headers={'Authorization':'Bearer '+identity.token};
   const connected=()=>{const current=this.getConfig();if(!current.enabled||current.endpoint!==config.endpoint||current.code!==config.code)throw new Error('Sync connection changed.');};
   const request=async(options,ms)=>{connected();const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),ms);try{return await this.request(url,{...options,signal:controller.signal});}finally{clearTimeout(timer);}};
   const local=await this.createBackup(),hash=await syncFingerprint(local),response=await request({headers,cache:'no-store'},20000);connected();
   if(!response.ok&&response.status!==404)throw new Error('Sync server returned '+response.status+'. Check the server and pairing code.');
   const remote=response.status===404?null:await response.json();
   if(remote&&(!Number.isInteger(remote.revision)||remote.revision<1||!remote.envelope))throw new Error('Invalid sync revision.');
   if(expectedRevision!==undefined&&remote?.revision!==expectedRevision)return {status:'retry-conflict'};
   const changed=Boolean(config.hash&&config.hash!==hash),newRemote=remote&&remote.revision!==(config.revision||0);
   if(remote&&choice==='auto'&&newRemote&&(!config.hash||changed))return {status:'conflict',remote:await decryptSnapshot(remote.envelope,config.code),revision:remote.revision,local};
   if(remote&&(choice==='pull'||choice==='auto'&&newRemote)){
    const payload=await decryptSnapshot(remote.envelope,config.code);connected();const currentHash=await syncFingerprint(await this.createBackup());if(currentHash!==hash)return {status:'conflict',remote:payload,revision:remote.revision,local:await this.createBackup()};await this.applyRemote(payload);
    const after=await syncFingerprint(await this.createBackup());connected();await this.saveConfig({...config,revision:remote.revision,hash:after,lastSync:new Date().toISOString(),error:''});return {status:'pulled'};
   }
   if(remote&&choice==='auto'&&config.hash===hash)return {status:'unchanged'};
   const envelope=await encryptSnapshot(local,config.code),put=await request({method:'PUT',headers:{...headers,'Content-Type':'application/json','If-Match':String(remote?.revision||0)},body:JSON.stringify({envelope})},120000);
   if(put.status===409)return {status:'retry-conflict'};
   if(!put.ok)throw new Error('The workspace could not sync ('+put.status+'). Your local work is still saved.');
   const saved=await put.json();if(!Number.isInteger(saved.revision)||saved.revision!==(remote?.revision||0)+1)throw new Error('Invalid saved sync revision.');connected();await this.saveConfig({...config,revision:saved.revision,hash,lastSync:new Date().toISOString(),error:''});return {status:'pushed'};
  }catch(error){const config=this.getConfig();if(config?.enabled)await this.saveConfig({...config,error:error.message});throw error;}finally{this.busy=false;}
 }
}
