// Readiness means the complete shell finished installing, not merely that a worker was registered.
export async function prepareOffline({serviceWorker=globalThis.navigator?.serviceWorker,setStatus=()=>{},timeoutMs=30000}={}){
 if(!serviceWorker){setStatus('unavailable');return false;}setStatus('preparing');
 try{const registration=await serviceWorker.register('./sw.js',{updateViaCache:'none'});try{await registration.update();}catch(error){if(!registration.active)throw error;}const worker=registration.installing||registration.waiting||registration.active;if(!worker)throw new Error('Offline files have not started installing.');
  await new Promise((resolve,reject)=>{let timer;const cleanup=()=>{clearTimeout(timer);worker.removeEventListener('statechange',changed);};const changed=()=>{if(worker.state==='activated'){cleanup();resolve();}else if(worker.state==='redundant'){cleanup();reject(new Error('The offline file download did not complete.'));}};worker.addEventListener('statechange',changed);timer=setTimeout(()=>{cleanup();reject(new Error('The offline file download is taking longer than expected. Reopen while connected to try again.'));},timeoutMs);changed();});setStatus('ready');return true;
 }catch(error){setStatus('failed',error.message);throw error;}
}
