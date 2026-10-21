const VERSION='gate42-story-v4.1';
const STATIC=['./','./index.html','./styles.css','./engine.js','./app.js','./manifest.webmanifest','./assets/gate42-mobile.webp','./assets/gate42-scene.webp','./assets/atlas.webp','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(STATIC)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;
 event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{if(response.ok){let clone=response.clone();caches.open(VERSION).then(c=>c.put(event.request,clone)).catch(()=>{});}return response;})));
});
