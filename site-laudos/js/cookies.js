/* Aviso de cookies com Consent Mode v2: Aceitar e Recusar com o mesmo destaque.
   O padrão é "negado"; a escolha fica salva neste navegador e pode ser trocada em "Gerenciar cookies". */
(function () {
  'use strict';
  var KEY = 'mastio-cookies';
  var box = document.getElementById('cookie-banner');
  if (!box) return;
  var root = document.documentElement;

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* sem armazenamento */ } }
  function consent(v) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('consent', 'update', { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v });
  }
  function sync() { root.style.setProperty('--cb-h', box.offsetHeight + 'px'); }
  function open() {
    box.hidden = false;
    root.classList.add('has-cb');
    sync();
    requestAnimationFrame(function () { box.classList.add('is-in'); });
  }
  function close() {
    box.classList.remove('is-in');
    root.classList.remove('has-cb');
    root.style.removeProperty('--cb-h');
    setTimeout(function () { box.hidden = true; }, 500);
  }

  if (read() === null) open();
  window.addEventListener('resize', function () { if (!box.hidden) sync(); });

  box.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cb]');
    if (!b) return;
    var v = b.getAttribute('data-cb');
    save(v);
    consent(v);
    close();
  });
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cb-open]')) { e.preventDefault(); if (box.hidden) open(); }
  });
})();
