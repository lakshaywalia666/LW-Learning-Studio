export const DEFAULT_DESIGN={version:1,style:'glass',shape:'rounded',accent:'theme',density:'comfortable'};
export const DESIGN_ACCENTS={theme:null,blue:['#245de8','#91b9ff'],green:['#13764b','#8dd5ad'],purple:['#7549c8','#c6a5f3'],rose:['#b83868','#f1a2c2'],orange:['#a95110','#f6ba83']};
export function ensureDesign(w){w.learning||={};if(w.learning.design===undefined)w.learning.design=structuredClone(DEFAULT_DESIGN);return w.learning.design;}
export function validateDesign(w){const d=ensureDesign(w);if(!d||d.version!==1||!['glass','soft','solid'].includes(d.style)||!['pill','rounded','square'].includes(d.shape)||!Object.hasOwn(DESIGN_ACCENTS,d.accent)||!['compact','comfortable','large'].includes(d.density))throw new Error('Choose valid design presets.');return d;}
export function designAccent(design,mode,fallback){return DESIGN_ACCENTS[design.accent]?.[mode==='light'?0:1]||fallback;}
export function saveDesign(w,input){const candidate={learning:{design:{version:1,...input}}};validateDesign(candidate);w.learning||={};w.learning.design=structuredClone(candidate.learning.design);return w.learning.design;}
