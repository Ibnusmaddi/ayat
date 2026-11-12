const C='ayat-v1';
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./manifest.webmanifest','./icon-192.png'])).catch(()=>{}));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const q=e.request;
  if(q.method!=='GET'||new URL(q.url).origin!==location.origin)return;
  e.respondWith(
    fetch(q).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(q,cp));return r})
    .catch(()=>caches.match(q).then(m=>m||caches.match('./index.html')))
  );
});
