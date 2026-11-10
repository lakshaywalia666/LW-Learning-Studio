import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'public');
const host=process.env.CYBERPATH_HOST||'127.0.0.1';
const port=Number(process.env.CYBERPATH_PORT||4317);
const types={'.woff2':'font/woff2','.woff':'font/woff','.jpg':'image/jpeg','.jpeg':'image/jpeg','.hdr':'application/octet-stream','.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.wasm':'application/wasm','.ttf':'font/ttf','.pfb':'application/octet-stream','.bcmap':'application/octet-stream','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json','.xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'};
const server=http.createServer(async(req,res)=>{
 try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});return res.end('Method not allowed');}
  const url=new URL(req.url,'http://localhost');
  let name;try{name=decodeURIComponent(url.pathname);}catch{res.writeHead(400);return res.end('Invalid path');}
  const file=path.resolve(root,'.'+(name==='/'?'/index.html':name));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end('Forbidden');}
  const info=await stat(file);if(!info.isFile()){res.writeHead(404);return res.end('Not found');}
  const body=await readFile(file);
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':body.length,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Content-Security-Policy':"default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https: http://localhost:* http://127.0.0.1:* https://geocoding-api.open-meteo.com; media-src 'self' data: blob:; font-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'self'"});
  res.end(req.method==='HEAD'?undefined:body);
 }catch(error){res.writeHead(error.code==='ENOENT'?404:500);res.end(error.code==='ENOENT'?'Not found':'Unable to serve this file');}
});
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`Port ${port} is busy. Use CYBERPATH_PORT=4318 node server.mjs`:error.message);process.exitCode=1;});
server.listen(port,host,()=>console.log(`LW Learning Studio is ready at http://localhost:${port}\nProgress stays in this browser. Export backups from Settings.\nPress Control+C to stop the server.`));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(()=>process.exit(0)));
