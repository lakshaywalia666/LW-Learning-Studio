const PAGES=new Set(['growth','climb','knowledge','work','today','forest','dashboard']);
export function courseRoute(page,courseId,topicId=''){
 if(!PAGES.has(page))throw new Error('Unknown learning view.');
 const params=new URLSearchParams({course:courseId});if(topicId)params.set('topic',topicId);
 return '#/'+page+'?'+params.toString();
}
