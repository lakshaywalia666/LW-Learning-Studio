import {mediaHash} from './media-tools.js?v=studio47';
const identifier=v=>typeof v==='string'&&/^[A-Za-z0-9_-]{1,100}$/.test(v);
export const imageFingerprint=mediaHash;
export function validateImageMask(image){
 if(!image||!identifier(image.assetId)||!/^[a-f0-9]{64}$/.test(image.hash)||typeof image.description!=='string'||!image.description.trim()||image.description.length>1000||!Array.isArray(image.regions)||!image.regions.length||image.regions.length>30)throw new Error('Choose an image, describe it and cover 1–30 labels.');
 const ids=new Set();for(const r of image.regions){if(!r||!identifier(r.id)||ids.has(r.id)||![r.x,r.y,r.width,r.height].every(Number.isFinite)||r.x<0||r.y<0||r.width<.005||r.height<.005||r.x+r.width>1.000001||r.y+r.height>1.000001||typeof r.answer!=='string'||!r.answer.trim()||r.answer.length>1000)throw new Error('Keep every cover inside the image and give it an answer.');ids.add(r.id);}return image;
}
export function normalizedCover(start,end){
 const point=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.x<=1&&p.y>=0&&p.y<=1;
 if(!point(start)||!point(end))throw new Error('Draw inside the image.');const x=Math.min(start.x,end.x),y=Math.min(start.y,end.y),width=Math.abs(end.x-start.x),height=Math.abs(end.y-start.y);if(width<.005||height<.005)throw new Error('Draw a larger cover, or set its position below.');return {x,y,width,height};
}
export function imageCardMarkup(card,revealed=false){if(card.type!=='image')return '';return `<figure class="image-recall" data-recall-image="${card.id}" data-revealed="${revealed}"><p role="status">Opening local image…</p></figure>`;}
