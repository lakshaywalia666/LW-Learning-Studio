import {LibrarySearchIndex} from './search-index.js?v=studio47';
let index=null;
self.onmessage=event=>{const {id,rows,query,offset}=event.data;try{if(rows)index=new LibrarySearchIndex(rows);if(!index)throw new Error('Open search again to prepare the local index.');self.postMessage({id,...index.search(query,{limit:40,offset})});}catch(error){self.postMessage({id,error:error.message,rows:[],total:0});}};
