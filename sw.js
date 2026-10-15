// Service worker del calcolatore antivibranti G4 v3.12 (scritto da build.py): pagina e icone in cache, aggiornamento quando c'è rete.
const CACHE = 'g4calc-v3.12';
const FILE = ['./', './index.html', './manifest.webmanifest', './icone/icon-192.png', './icone/icon-512.png', './icone/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  const url = new URL(e.request.url); if(url.origin !== location.origin) return;
  // la pagina: prima la rete (così arrivano le versioni nuove), senza rete la copia in cache
  if(e.request.mode === 'navigate' || url.pathname.endsWith('/index.html')){
    e.respondWith(fetch(e.request).then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', copia)); return r; }).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
