const C='accademia-v1';
const CORE=['./','./index.html','./data.js','./qmap.js','./courses.js','./gear.js','./gearall.js','./manifest.webmanifest','./icon-192.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url); if(e.request.method!=='GET'||u.origin!==location.origin) return;
  const core=/\.(html|js|webmanifest)$/.test(u.pathname)||u.pathname.endsWith('/');
  if(core){ // rete prima (aggiornamenti), cache se offline
    e.respondWith(fetch(e.request).then(r=>{ const c=r.clone(); caches.open(C).then(x=>x.put(e.request,c)); return r; }).catch(()=>caches.match(e.request)));
  } else { // immagini e dati: cache prima
    e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request).then(r=>{ const c=r.clone(); caches.open(C).then(x=>x.put(e.request,c)); return r; })));
  }
});
