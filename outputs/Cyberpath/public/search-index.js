const normalize=value=>String(value??'').normalize('NFKC').toLowerCase();
const grams=value=>{const chars=Array.from(value),out=new Set();for(let n=0;n<chars.length-2;n++)out.add(chars.slice(n,n+3).join(''));return out;};
// In-memory only: private text never leaves the selected workspace.
export class LibrarySearchIndex {
 constructor(rows){this.rows=rows.map((r,n)=>({...r,order:n,hay:normalize(r.title+' '+r.text),titleKey:normalize(r.title)}));this.postings=new Map();this.fallback=[];for(const row of this.rows){const words=row.hay.match(/[\p{L}\p{M}\p{N}_-]+/gu)||[],unique=new Set();let count=0;for(const word of words){if(++count>2000){this.fallback.push(row.order);break;}for(const gram of grams(word))unique.add(gram);}for(const gram of unique){let list=this.postings.get(gram);if(!list)this.postings.set(gram,list=[]);list.push(row.order);}}}
 search(query,{limit=100,offset=0}={}){const terms=normalize(String(query).slice(0,300)).trim().split(/\s+/).filter(Boolean);if(!terms.length)return {rows:[],total:0};let candidates=null;for(const term of terms){if(!/^[\p{L}\p{M}\p{N}_-]+$/u.test(term))continue;for(const gram of grams(term)){const found=this.postings.get(gram)||[];if(candidates===null||found.length<candidates.length)candidates=found;}}
  const ids=candidates===null?this.rows.map((_,i)=>i):[...new Set([...candidates,...this.fallback])],matches=[];for(const id of ids){const row=this.rows[id];if(terms.every(t=>row.hay.includes(t)))matches.push({...row,score:terms.reduce((n,t)=>n+1+(row.titleKey.includes(t)?2:0),0)});}matches.sort((a,b)=>b.score-a.score||a.order-b.order);return {total:matches.length,rows:matches.slice(offset,offset+Math.max(1,Math.min(1000,limit))).map(({hay,titleKey,order,...row})=>({...row,text:String(row.text).slice(0,500)}))};
 }
}
const cache=new WeakMap(),epochKey=Symbol.for('lw.private-search-epoch');
export function invalidateSearchIndex(workspace){cache.delete(workspace);Object.defineProperty(workspace,epochKey,{value:(workspace[epochKey]||0)+1,writable:true,configurable:true,enumerable:false});}
export const searchEpoch=workspace=>workspace[epochKey]||0;
export function indexedSearch(workspace,rows,query,options){let value=cache.get(workspace);const epoch=searchEpoch(workspace);if(!value||value.revision!==workspace.revision||value.epoch!==epoch){value={revision:workspace.revision,epoch,index:new LibrarySearchIndex(rows())};cache.set(workspace,value);}return value.index.search(query,options);}
