/* Aviso de cookies: aparece uma vez e lembra a escolha neste navegador. */
(function () {
  'use strict';
  var KEY = 'mastio-aviso-cookies';
  var box = document.getElementById('cookie-banner');
  if (!box) return;
  var seen = false;
  try { seen = localStorage.getItem(KEY) === '1'; } catch (e) { /* sem armazenamento: mostra sempre */ }
  if (seen) return;

  var root = document.documentElement;
  var sync = function () { root.style.setProperty('--cb-h', box.offsetHeight + 'px'); };
  box.hidden = false;
  root.classList.add('has-cb');
  sync();
  requestAnimationFrame(function () { box.classList.add('is-in'); });
  window.addEventListener('resize', sync);

  var ok = box.querySelector('[data-cb-ok]');
  if (ok) ok.addEventListener('click', function () {
    try { localStorage.setItem(KEY, '1'); } catch (e) { /* ignora */ }
    box.classList.remove('is-in');
    root.classList.remove('has-cb');
    root.style.removeProperty('--cb-h');
    setTimeout(function () { box.hidden = true; }, 500);
  });
})();
