const C='predicacion-v7';
const ASSETS=['./','./index.html','./sw.js'];

self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open(C)
      .then(c=>c.addAll(ASSETS).catch(()=>c.add('./').catch(()=>{})))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>
      Promise.all(keys.filter(k=>k!==C).map(k=>caches.delete(k)))
    ).then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||!e.request.url.startsWith('http'))return;
  const u=new URL(e.request.url);
  if(u.hostname==='api.github.com'||u.pathname.endsWith('.pdf'))return;

  e.respondWith(
    fetch(e.request)
      .then(r=>{
        if(r.ok&&u.origin===self.location.origin){
          const cp=r.clone();
          caches.open(C).then(c=>c.put(e.request,cp));
        }
        return r;
      })
      .catch(()=>caches.match(e.request).then(m=>m||caches.match('./')||caches.match('./index.html')))
  );
});
