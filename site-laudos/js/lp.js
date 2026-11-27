/* Landing page: reveal ao rolar, nav flutuante e acordeão do FAQ. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };

  /* reveal */
  var targets = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* nav flutuante */
  var nav = $('#lpnav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('is-scrolled', (window.scrollY || window.pageYOffset) > 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* FAQ acordeão */
  var items = $$('.lp-faq__item');
  items.forEach(function (it) {
    var q = $('.lp-faq__q', it);
    var a = $('.lp-faq__a', it);
    var open = q.getAttribute('aria-expanded') === 'true';
    it.classList.toggle('is-open', open);
    if (!open) a.setAttribute('inert', '');
    q.addEventListener('click', function () {
      var willOpen = !it.classList.contains('is-open');
      items.forEach(function (o) {
        var oa = $('.lp-faq__a', o), oq = $('.lp-faq__q', o);
        var on = (o === it) ? willOpen : false;
        o.classList.toggle('is-open', on);
        oq.setAttribute('aria-expanded', String(on));
        if (on) oa.removeAttribute('inert'); else oa.setAttribute('inert', '');
      });
    });
  });
})();
