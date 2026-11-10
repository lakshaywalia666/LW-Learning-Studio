// The microphone is acquired only after the user explicitly starts a recording.
export class VoiceRecorder {
 constructor({mediaDevices=globalThis.navigator?.mediaDevices,Recorder=globalThis.MediaRecorder,onState=()=>{},maxBytes=24000000,maxMs=600000}={}){Object.assign(this,{mediaDevices,Recorder,onState,maxBytes,maxMs});this.stream=null;this.recorder=null;this.cancelled=false;this.starting=false;}
 async start(){
  if(this.starting||this.recorder)throw new Error('A recording is already in progress.');
  if(!this.mediaDevices?.getUserMedia||!this.Recorder)throw new Error('Recording is unavailable here. Use a supported browser or the Android app, or attach an audio file.');
  this.starting=true;this.cancelled=false;
  try{
   this.stream=await this.mediaDevices.getUserMedia({audio:true});
   if(this.cancelled){this.release();return;}
   const mime=['audio/webm;codecs=opus','audio/webm','audio/mp4','audio/ogg;codecs=opus'].find(type=>this.Recorder.isTypeSupported?.(type));
   const recorder=this.recorder=new this.Recorder(this.stream,mime?{mimeType:mime}:{});this.chunks=[];this.bytes=0;
   this.result=new Promise((resolve,reject)=>{this.resolve=resolve;this.reject=reject;});
   // A rejected result is handled by stop(), even if the platform reports an early error.
   this.result.catch(()=>{});
   recorder.ondataavailable=event=>{if(event.data?.size){this.chunks.push(event.data);this.bytes+=event.data.size;if(this.bytes>this.maxBytes){this.failure=new Error('The recording reached its size limit. Please make a shorter note.');void this.stop().catch(()=>{});}}};
   recorder.onerror=()=>{this.failure=new Error('The microphone stopped unexpectedly. Try recording again.');void this.stop().catch(()=>{});};
   recorder.onstop=()=>{clearTimeout(this.limit);this.release();const blob=this.cancelled?null:new Blob(this.chunks,{type:recorder.mimeType||mime||'audio/webm'});this.recorder=null;this.onState('stopped');this.failure?this.reject(this.failure):this.resolve(blob);};
   this.failure=null;recorder.start(1000);this.limit=setTimeout(()=>{void this.stop().catch(()=>{});},this.maxMs);this.onState('recording');
  }catch(error){this.release();this.recorder=null;throw new Error(error.name==='NotAllowedError'?'Microphone permission was denied. You can allow it in device settings or attach an audio file.':error.message);}
  finally{this.starting=false;}
 }
 release(){for(const track of this.stream?.getTracks?.()||[])track.stop();this.stream=null;}
 async stop(cancel=false){this.cancelled ||= cancel;const recorder=this.recorder;if(!recorder){if(this.starting)this.cancelled=true;this.release();return null;}if(recorder.state!=='inactive')recorder.stop();return this.result;}
}
