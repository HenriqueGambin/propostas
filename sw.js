// Service worker do app de propostas: permite instalar como aplicativo e abre a tela mesmo com internet instável.
// Sempre tenta a rede primeiro (para pegar a versão nova); a cópia guardada só é usada quando a rede falha.
// Os dados (Supabase) nunca passam por aqui: só arquivos do próprio site.
const CACHE = 'propostas-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copia = res.clone(); caches.open(CACHE).then(c => c.put(req, copia)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./index.html', { ignoreSearch: true })))
  );
});
