(() => {
  'use strict';

  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const easeOutExpo = t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  /* ---------- 1. Scroll suave (Lenis) ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.25, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  const scrollY = () => (lenis ? lenis.scroll : window.scrollY);

  /* ---------- 2. Texto dividido por palavras (máscara que sobe) ---------- */
  $$('.split').forEach((el, n) => {
    const text = el.textContent.trim().replace(/\s+/g, ' ');
    el.setAttribute('aria-label', text);
    el.textContent = '';
    text.split(' ').forEach((word, i) => {
      const w = document.createElement('span');
      w.className = 'w';
      w.setAttribute('aria-hidden', 'true');
      const inner = document.createElement('i');
      inner.textContent = word;
      inner.style.setProperty('--i', i);
      w.appendChild(inner);
      el.appendChild(w);
      el.appendChild(document.createTextNode(' '));
    });
    if (el.classList.contains('hero__title')) el.style.setProperty('--base', '.25s');
  });

  /* ---------- 3. Reveal ao entrar no viewport ---------- */
  const revealTargets = $$('[data-reveal],[data-rise],.split');
  const heroTargets = new Set($$('.hero [data-rise], .hero .split'));
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' })
    : null;
  revealTargets.forEach(el => {
    if (heroTargets.has(el)) return;
    io ? io.observe(el) : el.classList.add('is-in');
  });

  // Sequência de entrada do hero
  const start = () => {
    root.classList.add('is-ready');
    heroTargets.forEach(el => el.classList.add('is-in'));
  };
  if (document.readyState === 'complete') requestAnimationFrame(start);
  else window.addEventListener('load', () => requestAnimationFrame(start), { once: true });
  setTimeout(start, 1800); // garantia caso o load demore

  /* ---------- 4. Contadores ---------- */
  const counters = $$('[data-count]');
  const runCount = el => {
    const end = parseFloat(el.dataset.count);
    const pre = el.dataset.prefix || '';
    const suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = pre + end + suf; return; }
    const dur = 2200;
    const t0 = performance.now();
    const tick = now => {
      const p = clamp((now - t0) / dur, 0, 1);
      el.textContent = pre + Math.round(end * easeOutExpo(p)) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (io) {
    const cio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(el => {
      el.textContent = (el.dataset.prefix || '') + '0' + (el.dataset.suffix || '');
      cio.observe(el);
    });
  }

  /* ---------- 5. Selos: acordeão + ativação por scroll ---------- */
  const seals = $$('.seal');
  const setSeal = target => seals.forEach(s => {
    const on = s === target;
    s.classList.toggle('is-active', on);
    $('.seal__btn', s).setAttribute('aria-expanded', String(on));
  });
  let userPicked = false;
  seals.forEach(s => $('.seal__btn', s).addEventListener('click', () => { userPicked = true; setSeal(s); }));
  if (io && seals.length) {
    const list = $('.seals__list');
    const sio = new IntersectionObserver(() => {}, { threshold: 0 });
    sio.observe(list);
    // Ativa o selo que cruza o centro da tela enquanto a lista rola
    const spySeals = () => {
      if (userPicked || !list) return;
      const r = list.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = clamp((innerHeight * 0.62 - r.top) / (r.height + innerHeight * 0.1), 0, 0.999);
      const idx = Math.floor(p * seals.length);
      if (!seals[idx].classList.contains('is-active')) setSeal(seals[idx]);
    };
    window.__spySeals = spySeals;
  }

  /* ---------- 6. Hover: spotlight nos cards + botões magnéticos ---------- */
  const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (fine && !reduce) {
    $$('.card').forEach(c => c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }));
    $$('.magnetic').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / r.width;
        const y = (e.clientY - r.top - r.height / 2) / r.height;
        b.style.transform = `translate3d(${x * 8}px, ${y * 6 - 2}px, 0)`;
      });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }


  /* ---------- 6b. Luz que segue o cursor em todo o site ---------- */
  if (fine && !reduce) {
    const glow = document.createElement('div');
    glow.className = 'cursor-light';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);
    let tx = innerWidth / 2, ty = innerHeight / 2, x = tx, y = ty, seen = false, raf = 0;
    const loop = () => {
      x += (tx - x) * 0.16; y += (ty - y) * 0.16;
      glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = (Math.abs(tx - x) + Math.abs(ty - y) > 0.3) ? requestAnimationFrame(loop) : 0;
    };
    window.addEventListener('pointermove', e => {
      tx = e.clientX; ty = e.clientY;
      if (!seen) { seen = true; x = tx; y = ty; glow.classList.add('is-on'); }
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => glow.classList.remove('is-on'));
    document.documentElement.addEventListener('pointerenter', () => seen && glow.classList.add('is-on'));
  }

  /* ---------- 7. Âncoras suaves + scrollspy ---------- */
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const t = id.length > 1 ? $(id) : null;
    if (!t) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(t, { offset: id === '#inicio' ? 0 : -40, duration: 1.6 });
    else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }));
  const spyLinks = $$('[data-spy]');
  const sections = ['inicio', 'credibilidade', 'solucoes', 'como-funciona', 'servicos'].map(id => document.getElementById(id));


  /* ---------- 7b. Como funciona: linha desenhada pelo scroll ---------- */
  const howTrack = $('.how__track');
  if (howTrack) {
    const path = $('.how__path'), tip = $('.how__tip'), list = $('.how__steps');
    const dots = $$('.how__dot'), steps = $$('.how__step');
    const mq = window.matchMedia('(max-width: 900px)');
    const total = path.getTotalLength();
    // fração do comprimento do caminho em que cada ponto fica
    const fr = dots.map(d => {
      const cx = +d.getAttribute('cx'); let lo = 0, hi = total;
      for (let i = 0; i < 28; i++) { const m = (lo + hi) / 2; path.getPointAtLength(m).x < cx ? lo = m : hi = m; }
      return lo / total;
    });
    let cur = 0, tgt = 0, raf = 0;
    const paint = () => {
      if (!mq.matches) {
        path.style.strokeDasharray = cur + ' 1';
        const pt = path.getPointAtLength(cur * total);
        tip.setAttribute('cx', pt.x); tip.setAttribute('cy', pt.y);
        tip.style.opacity = cur > 0.002 && cur < 0.995 ? 1 : 0;
        steps.forEach((s, i) => { const on = cur >= fr[i] - 0.004; s.classList.toggle('is-on', on); dots[i].classList.toggle('is-on', on); });
      } else {
        list.style.setProperty('--p', cur);
        steps.forEach(s => s.classList.toggle('is-on', cur >= (s.offsetTop + 14) / list.offsetHeight - 0.003));
      }
    };
    const tick = () => {
      raf = 0;
      const d = tgt - cur;
      if (Math.abs(d) < 0.0004) { cur = tgt; paint(); return; }
      cur += d * 0.11; paint(); raf = requestAnimationFrame(tick);
    };
    window.__how = () => {
      const mobile = mq.matches;
      const r = (mobile ? list : howTrack).getBoundingClientRect();
      tgt = mobile ? clamp((innerHeight * 0.72 - r.top) / r.height, 0, 1)
                   : clamp((innerHeight * 0.82 - r.top) / (innerHeight * 0.62), 0, 1);
      if (reduce) { cur = tgt = 1; paint(); return; }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const reset = () => { cur = 0; window.__how(); };
    if (mq.addEventListener) mq.addEventListener('change', reset); else mq.addListener(reset);
  }


  /* ---------- 7c. Soluções: palco imersivo ---------- */
  const svcx = $('[data-svcx]');
  if (svcx) {
    const items = $$('.svcx__item', svcx), figs = $$('.svcx__fig', svcx);
    const segs = $$('.svcx__prog i', svcx), stage = $('.svcx__stage', svcx);
    const desk = window.matchMedia('(min-width: 1025px)');
    const n = items.length;
    let active = -1;
    const setActive = i => {
      if (i === active) return;
      active = i;
      items.forEach((it, k) => {
        const on = k === i;
        it.classList.toggle('is-active', on);
        $('.svcx__head', it).setAttribute('aria-expanded', String(on));
      });
      figs.forEach((f, k) => { f.classList.toggle('is-active', k === i); f.classList.toggle('is-past', k < i); });
    };
    let lockUntil = 0;
    const ripple = (head, e) => {
      if (reduce) return;
      const r = head.getBoundingClientRect();
      const dot = document.createElement('span');
      dot.className = 'svcx__ripple';
      const size = Math.max(r.width, r.height) * 2;
      dot.style.width = dot.style.height = size + 'px';
      dot.style.left = ((e.clientX || r.left + r.width / 2) - r.left - size / 2) + 'px';
      dot.style.top = ((e.clientY || r.top + r.height / 2) - r.top - size / 2) + 'px';
      head.appendChild(dot);
      dot.addEventListener('animationend', () => dot.remove());
    };
    const goTo = (i, e) => {
      const head = $('.svcx__head', items[i]);
      if (e) ripple(head, e);
      if (!desk.matches) {
        // mobile: toque abre; toque no item aberto fecha
        if (i === active) {
          active = -1;
          items.forEach(it => { it.classList.remove('is-active'); $('.svcx__head', it).setAttribute('aria-expanded', 'false'); });
        } else setActive(i);
        return;
      }
      // desktop: troca na hora e leva o scroll até o trecho do serviço
      lockUntil = performance.now() + 1700;
      setActive(i);
      items.forEach((it, k) => it.style.setProperty('--lp', k === i ? 0.02 : 0));
      segs.forEach((s, k) => s.style.setProperty('--f', k < i ? 1 : 0));
      stage.classList.remove('is-kick'); void stage.offsetWidth; stage.classList.add('is-kick');
      const runway = svcx.offsetHeight - innerHeight;
      const y = svcx.getBoundingClientRect().top + scrollY() + runway * ((i + 0.04) / n);
      if (lenis) lenis.scrollTo(y, { duration: 1.4 });
      else window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
      setTimeout(() => window.__svcx && window.__svcx(), 1750);
    };
    items.forEach((it, k) => $('.svcx__head', it).addEventListener('click', e => goTo(k, e)));
    setActive(0);
    window.__svcx = () => {
      if (!desk.matches || performance.now() < lockUntil) return;
      const r = svcx.getBoundingClientRect();
      const runway = svcx.offsetHeight - innerHeight;
      const p = clamp(-r.top / runway, 0, 1);
      const idx = Math.min(n - 1, Math.floor(p * n));
      const local = clamp(p * n - idx, 0, 1);
      setActive(idx);
      items[idx].style.setProperty('--lp', local);
      segs.forEach((s, k) => s.style.setProperty('--f', k < idx ? 1 : k === idx ? local : 0));
      figs[idx].style.setProperty('--py', ((local - 0.5) * -28) + 'px');
    };
  }


  /* ---------- 7d. Serviços prestados: carrossel horizontal (scroll, arraste, abas, setas) ---------- */
  const lite = $('.lite');
  if (lite) {
    const run = $('.lite__run'), wheel = $('.lwheel'), track = $('.lwheel__track');
    const cards = $$('.lcard'), tabs = $$('.ltab'), count = $('.lite__count b'), fill = $('.lite__fill');
    const prev = $('.lite__prev'), next = $('.lite__next');
    const n = cards.length;
    const factor = () => (innerWidth < 900 ? 1.3 : 1.9);
    let travel = 0, runway = 0, cur = 0, tgt = 0, raf = 0, idx = -1, drag = null, blockClick = false;
    const clampN = (v, a, b) => Math.min(b, Math.max(a, v));
    // paradas igualmente espaçadas ao longo do percurso: cada serviço tem a sua, mesmo que os últimos caibam juntos na tela
    const stops = () => cards.map((_, i) => (n > 1 ? (i / (n - 1)) * travel : 0));
    const measure = () => {
      travel = Math.max(0, track.offsetWidth - innerWidth);
      runway = travel * factor();
      run.style.height = (innerHeight + runway) + 'px';
    };
    const setScroll = y => {
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    };
    const paint = () => {
      track.style.transform = 'translate3d(' + (-cur).toFixed(1) + 'px,0,0)';
      fill.style.transform = 'scaleX(' + (travel ? cur / travel : 0).toFixed(4) + ')';
      const best = travel ? Math.round((cur / travel) * (n - 1)) : 0;
      cards.forEach(c => {
        const r = c.getBoundingClientRect();
        c.style.opacity = clampN((r.right - 30) / (r.width * 0.55), 0.28, 1).toFixed(3);
      });
      if (best !== idx) {
        idx = best;
        count.textContent = String(best + 1).padStart(2, '0');
        tabs.forEach((t, j) => { t.classList.toggle('is-active', j === best); t.setAttribute('aria-selected', String(j === best)); });
        cards.forEach((c, j) => c.classList.toggle('is-active', j === best));
      }
    };
    const tick = () => {
      raf = 0;
      const d = tgt - cur;
      if (Math.abs(d) < 0.3) { cur = tgt; paint(); return; }
      cur += d * 0.14; paint(); raf = requestAnimationFrame(tick);
    };
    window.__lite = () => {
      const p = clampN(-run.getBoundingClientRect().top / Math.max(1, runway), 0, 1);
      tgt = p * travel;
      if (reduce) { cur = tgt; paint(); return; }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const runTop = () => run.getBoundingClientRect().top + scrollY();
    const goCard = i => {
      i = clampN(i, 0, n - 1);
      const y = runTop() + stops()[i] * (runway / Math.max(1, travel));
      if (lenis) lenis.scrollTo(y, { duration: 1.2 });
      else window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    };
    prev.addEventListener('click', () => goCard(idx - 1));
    next.addEventListener('click', () => goCard(idx + 1));
    tabs.forEach((t, j) => t.addEventListener('click', () => goCard(j)));

    // arraste lateral: converte o deslocamento da pista em rolagem da página
    wheel.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      drag = { x: e.clientX, s: scrollY(), moved: false };
    });
    window.addEventListener('pointermove', e => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; wheel.classList.add('is-drag'); }
      if (drag.moved) setScroll(drag.s - dx * (runway / Math.max(1, travel)));
    });
    const end = () => {
      if (drag && drag.moved) { blockClick = true; setTimeout(() => { blockClick = false; }, 60); }
      drag = null; wheel.classList.remove('is-drag');
    };
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    wheel.addEventListener('click', e => { if (blockClick) { e.preventDefault(); e.stopPropagation(); } }, true);
    wheel.addEventListener('dragstart', e => e.preventDefault());

    measure(); paint();
    window.addEventListener('resize', () => { measure(); window.__lite(); });
    window.addEventListener('load', () => { measure(); window.__lite(); });
  }

  /* ---------- 7f. Grade interativa no fundo claro ---------- */
  const mountGrid = (parent, cell) => {
    if (!parent) return;
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'igrid');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('data-slot', 'interactive-grid');
    parent.insertBefore(svg, parent.firstChild);
    let cols = 0, rows = 0, rects = [], on = -1;
    const build = () => {
      const b = svg.getBoundingClientRect();
      const c = Math.ceil(b.width / cell), r = Math.ceil(b.height / cell);
      if (c === cols && r === rows) return;
      cols = c; rows = r; on = -1; rects = [];
      const frag = document.createDocumentFragment();
      for (let i = 0; i < c * r; i++) {
        const el = document.createElementNS(NS, 'rect');
        el.setAttribute('x', (i % c) * cell);
        el.setAttribute('y', Math.floor(i / c) * cell);
        el.setAttribute('width', cell);
        el.setAttribute('height', cell);
        rects.push(el); frag.appendChild(el);
      }
      svg.replaceChildren(frag);
    };
    const set = i => {
      if (i === on) return;
      if (on >= 0 && rects[on]) rects[on].classList.remove('is-on');
      on = i;
      if (on >= 0 && rects[on]) rects[on].classList.add('is-on');
    };
    if (window.ResizeObserver) new ResizeObserver(build).observe(svg); else build();
    parent.addEventListener('pointermove', e => {
      const b = svg.getBoundingClientRect();
      const col = Math.floor((e.clientX - b.left) / cell), row = Math.floor((e.clientY - b.top) / cell);
      set(col >= 0 && row >= 0 && col < cols && row < rows ? row * cols + col : -1);
    });
    parent.addEventListener('pointerleave', () => set(-1));
  };
  mountGrid($('.lite__pin'), 40);
  mountGrid($('.eng-sec'), 40);
  mountGrid($('.faq-sec'), 40);


  /* ---------- 7g. FAQ: acordeão fluido com destaque que desliza ---------- */
  const faqFrame = $('.faq__frame');
  if (faqFrame) {
    const items = $$('.faq__item', faqFrame), hl = $('.faq__hl', faqFrame);
    const qs = items.map(it => $('.faq__q', it));
    let cur = null, touched = false, raf = 0, until = 0;
    const setOpen = (it, open) => {
      it.classList.toggle('is-open', open);
      $('.faq__q', it).setAttribute('aria-expanded', String(open));
      const a = $('.faq__a', it);
      if (open) a.removeAttribute('inert'); else a.setAttribute('inert', '');
    };
    items.forEach(it => setOpen(it, false));
    const sync = () => {
      if (!cur) return;
      hl.style.transform = 'translate3d(0,' + cur.offsetTop + 'px,0)';
      hl.style.height = cur.offsetHeight + 'px';
    };
    const follow = ms => {
      until = performance.now() + ms;
      if (raf) return;
      const loop = () => { sync(); raf = performance.now() < until ? requestAnimationFrame(loop) : 0; };
      raf = requestAnimationFrame(loop);
    };
    const hover = it => { cur = it; hl.classList.add('is-on'); follow(700); };
    items.forEach((it, k) => {
      const q = qs[k];
      it.addEventListener('pointerenter', () => hover(it));
      q.addEventListener('focus', () => hover(it));
      q.addEventListener('click', () => {
        touched = true;
        const open = !it.classList.contains('is-open');
        items.forEach(o => setOpen(o, o === it ? open : false));
        cur = it; hl.classList.add('is-on'); follow(1100);
      });
      q.addEventListener('keydown', e => {
        const go = i => { e.preventDefault(); qs[(i + qs.length) % qs.length].focus(); };
        if (e.key === 'ArrowDown') go(k + 1);
        else if (e.key === 'ArrowUp') go(k - 1);
        else if (e.key === 'Home') go(0);
        else if (e.key === 'End') go(qs.length - 1);
      });
    });
    faqFrame.addEventListener('pointerleave', () => hl.classList.remove('is-on'));
    window.addEventListener('resize', sync);
    // depois da entrada, a primeira resposta abre sozinha
    if ('IntersectionObserver' in window) {
      const fio = new IntersectionObserver(es => {
        if (!es[0].isIntersecting) return;
        fio.disconnect();
        setTimeout(() => { if (!touched) { setOpen(items[0], true); follow(1100); } }, reduce ? 0 : 1000);
      }, { threshold: 0.4 });
      fio.observe(faqFrame);
    } else setOpen(items[0], true);
  }

  /* ---------- 7e. Fundo escuro -> claro: cor chapada que muda com o scroll ---------- */
  const zone = $('#servicos');
  if (zone) {
    const prevWrap = $('.how .wrap'), pin = $('.lite__pin');
    const D = [23, 23, 33], L = [246, 245, 242];
    const smooth = t => t * t * (3 - 2 * t);
    const cl = v => Math.min(1, Math.max(0, v));
    let cur = 0, tgt = 0, raf = 0;
    const apply = () => {
      const k = smooth(cur);
      const c = D.map((d, i) => Math.round(d + (L[i] - d) * k));
      document.body.style.backgroundColor = 'rgb(' + c.join(',') + ')';
    };
    const step = () => {
      raf = 0;
      const d = tgt - cur;
      if (Math.abs(d) < 0.001) { cur = tgt; apply(); fades(); return; }
      cur += d * 0.12; apply(); fades(); raf = requestAnimationFrame(step);
    };
    let topNow = 1e9;
    const fades = () => {
      const vh = innerHeight;
      const out = cl((vh * 0.80 - topNow) / (vh * 0.22));
      if (prevWrap) prevWrap.style.opacity = String(1 - out);
      if (pin) pin.style.opacity = String(cl((smooth(cur) - 0.55) / 0.35));
    };
    window.__bg = () => {
      const vh = innerHeight;
      topNow = zone.getBoundingClientRect().top;
      tgt = cl((vh * 0.62 - topNow) / (vh * 0.40));
      if (reduce) { cur = tgt; apply(); fades(); return; }
      fades();
      if (!raf) raf = requestAnimationFrame(step);
    };
  }

  /* ---------- 8. Loop de scroll: progresso, nav, parallax ---------- */
  const nav = $('#nav');
  const bar = $('.progress span');
  const heroImgs = $$('.hero__img');
  const heroContent = $('.hero__content');
  const heroEl = $('.hero');
  const gridBg = null;
  const cardImgs = $$('[data-parallax-img]');

  let ticking = false;
  const update = () => {
    ticking = false;
    const y = scrollY();
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? clamp(y / max, 0, 1) : 0})`;
    nav.classList.toggle('is-scrolled', y > 40);

    if (!reduce) {
      const hh = heroEl.offsetHeight;
      if (y < hh * 1.2) {
        const p = clamp(y / hh, 0, 1);
        heroImgs.forEach(i => { i.style.transform = `translate3d(0, ${y * 0.22}px, 0) scale(${1.02 + p * 0.06})`; });
        heroContent.style.transform = `translate3d(0, ${y * 0.1}px, 0)`;
        heroContent.style.opacity = String(1 - clamp(p * 1.35, 0, 1));
      }
      if (gridBg) {
        const r = gridBg.parentElement.getBoundingClientRect();
        gridBg.style.transform = `translate3d(0, ${(-r.top) * 0.08}px, 0)`;
      }
      cardImgs.forEach(img => {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; // -0.5..0.5
        img.style.setProperty('--py', `${clamp(p, -0.5, 0.5) * -22}px`);
      });
    }

    // scrollspy
    let current = sections[0];
    sections.forEach(s => { if (s.getBoundingClientRect().top <= innerHeight * 0.4) current = s; });
    spyLinks.forEach(l => l.classList.toggle('is-active', l.dataset.spy === current.id));
    if (window.__spySeals) window.__spySeals();
    if (window.__how) window.__how();
    if (window.__svcx) window.__svcx();
    if (window.__lite) window.__lite();
    if (window.__bg) window.__bg();
  };
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  if (lenis) lenis.on('scroll', request);
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  update();
})();
