import {defaultState} from './model.js?v=studio47';

// A rendering context for the app shell, never an installed or exported course.
export function emptyStudioContext(workspace){
 const data={meta:{course:{id:'',title:'Learning Studio',description:'',color:'#bae593',icon:'book'}},stages:[],topics:[],projects:[],resources:[],tools:[],labs:[],weekly:[],careers:[],glossary:[],guide:[]};
 const state=defaultState(data);
 workspace.settings={...state.settings,...workspace.settings,activeCourseId:''};
 state.settings=workspace.settings;
 return {data,state};
}

export const COURSE_ROUTES=new Set(['work','today','path','topics','projects','planner','sessions','resources','tools','labs','notes','careers','glossary','analytics','growth','climb','knowledge','builder','exercises']);
