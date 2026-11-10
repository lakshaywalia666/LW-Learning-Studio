import {bindLivingForest} from './living-forest.js?v=studio47';
// Every world uses the illustrated renderer and the same canonical progress.
export function bindLearningWorld(viewport,options){
 viewport.dataset.renderer='illustrated';
 return bindLivingForest(viewport,{...options,initialView:options.initialView?.renderer==='3d'?null:options.initialView});
}
