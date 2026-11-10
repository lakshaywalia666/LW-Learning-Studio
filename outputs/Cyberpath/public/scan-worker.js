import {rectifyPixels} from './document-tools.js?v=studio47';
self.onmessage=event=>{try{const output=rectifyPixels(event.data);self.postMessage({ok:true,...output},[output.data.buffer]);}catch(error){self.postMessage({ok:false,error:error.message});}};
