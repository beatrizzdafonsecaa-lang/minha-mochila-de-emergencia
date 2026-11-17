/* ==========================================================
   sw.js — faz o site abrir sem internet depois da primeira visita.
   Guarda as páginas no aparelho. Ao mudar arquivos do site,
   aumente o número da VERSAO para os aparelhos atualizarem.
   ========================================================== */
var VERSAO = "mme-v3";
var ARQUIVOS = [
  "./", "index.html", "painel.html", "mochila.html", "estoque.html", "plano.html", "imprimir.html",
  "css/estilo.css",
  "js/dados.js", "js/icones.js", "js/comum.js", "js/perfil.js", "js/painel.js", "js/mochila.js",
  "js/estoque.js", "js/plano.js", "js/imprimir.js",
  "img/icone.svg", "manifest.webmanifest"
];

self.addEventListener("install", function (ev) {
  ev.waitUntil(caches.open(VERSAO).then(function (c) { return c.addAll(ARQUIVOS); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (ev) {
  ev.waitUntil(caches.keys().then(function (nomes) {
    return Promise.all(nomes.filter(function (n) { return n !== VERSAO; }).map(function (n) { return caches.delete(n); }));
  }));
  self.clients.claim();
});

/* Arquivos do site: tenta a internet primeiro (pega a versão nova);
   se não der, usa a cópia guardada. APIs externas não são guardadas aqui. */
self.addEventListener("fetch", function (ev) {
  var url = new URL(ev.request.url);
  if (ev.request.method !== "GET" || url.origin !== location.origin) return;
  ev.respondWith(
    fetch(ev.request).then(function (resposta) {
      var copia = resposta.clone();
      caches.open(VERSAO).then(function (c) { c.put(ev.request, copia); });
      return resposta;
    }).catch(function () {
      return caches.match(ev.request, { ignoreSearch: true });
    })
  );
});
