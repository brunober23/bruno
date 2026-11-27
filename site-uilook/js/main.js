(function(){
  'use strict';
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  var lenis=null;

  /* ---------- Lenis smooth scroll ---------- */
  if(!reduce&&window.Lenis){
    try{
      lenis=new window.Lenis({duration:1.15,easing:function(t){return Math.min(1,1.001-Math.pow(2,-10*t))},smoothWheel:true});
      var raf=function(t){lenis.raf(t);requestAnimationFrame(raf)};
      requestAnimationFrame(raf);
    }catch(e){lenis=null}
  }
  function goTo(target){
    if(lenis){lenis.scrollTo(target,{offset:-56,duration:1.4})}
    else{target.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'})}
  }

  /* ---------- Menu ---------- */
  var btn=$('#menu-btn'),panel=$('#menu-panel');
  function setMenu(open){
    btn.setAttribute('aria-expanded',String(open));
    btn.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
    panel.hidden=!open;
  }
  if(btn&&panel){
    btn.addEventListener('click',function(){setMenu(btn.getAttribute('aria-expanded')!=='true')});
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&btn.getAttribute('aria-expanded')==='true'){setMenu(false);btn.focus()}
    });
    window.matchMedia('(min-width:960px)').addEventListener('change',function(m){if(m.matches)setMenu(false)});
  }

  /* ---------- Anchor links ---------- */
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href^="#"]');
    if(!a)return;
    var id=a.getAttribute('href');
    if(id.length<2)return;
    var t=document.getElementById(id.slice(1));
    if(!t)return;
    e.preventDefault();
    setMenu(false);
    goTo(t);
    try{history.pushState(null,'',id)}catch(_){}
  });

  /* ---------- Split headings into masked words/lines ---------- */
  function splitNode(node){
    Array.prototype.slice.call(node.childNodes).forEach(function(n){
      if(n.nodeType===3){
        var parts=n.textContent.split(/(\s+)/),frag=document.createDocumentFragment();
        parts.forEach(function(p){
          if(!p)return;
          if(/^\s+$/.test(p)){frag.appendChild(document.createTextNode(' '));return}
          var w=document.createElement('span');w.className='w';
          var i=document.createElement('span');i.className='wi';i.textContent=p;
          w.appendChild(i);frag.appendChild(w);
        });
        n.parentNode.replaceChild(frag,n);
      }else if(n.nodeType===1&&!n.classList.contains('w')){splitNode(n)}
    });
  }
  function setLineDelays(h){
    var words=$$('.wi',h),line=-1,top=null;
    words.forEach(function(w){
      var y=w.parentNode.offsetTop;
      if(top===null||Math.abs(y-top)>4){line++;top=y}
      w.style.setProperty('--d',(line*110)+'ms');
    });
  }
  var splits=$$('[data-split]');
  if(!reduce){
    splits.forEach(splitNode);
    var run=function(){splits.forEach(setLineDelays)};
    run();
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(run);
    var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(run,200)});
  }

  /* ---------- Reveal on view ---------- */
  $$('[data-stagger]').forEach(function(p){
    $$('[data-reveal]',p).forEach(function(c,i){c.style.setProperty('--d',(i*100)+'ms')});
  });
  var revealEls=$$('[data-reveal],[data-split],[data-hl]');
  if(reduce||!('IntersectionObserver' in window)){
    revealEls.forEach(function(e){e.classList.add('is-in')});
  }else{
    var io=new IntersectionObserver(function(es){
      es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('is-in');io.unobserve(en.target)}});
    },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    revealEls.forEach(function(e){io.observe(e)});
  }

  /* ---------- Counters ---------- */
  var counters=$$('[data-count]');
  function runCount(el){
    var to=+el.dataset.count,pre=el.dataset.prefix||'',suf=el.dataset.suffix||'',dur=1400,t0=null;
    function f(t){
      if(t0===null)t0=t;
      var p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);
      el.textContent=pre+Math.round(to*e)+suf;
      if(p<1)requestAnimationFrame(f);
    }
    el.textContent=pre+'0'+suf;
    requestAnimationFrame(f);
  }
  if(!reduce&&'IntersectionObserver' in window){
    var cio=new IntersectionObserver(function(es){
      es.forEach(function(en){if(en.isIntersecting){runCount(en.target);cio.unobserve(en.target)}});
    },{threshold:.6});
    counters.forEach(function(c){cio.observe(c)});
  }

  /* ---------- FAQ accordion ---------- */
  var items=$$('.faq-btn');
  function setFaq(b,open){
    b.setAttribute('aria-expanded',String(open));
    document.getElementById(b.getAttribute('aria-controls')).classList.toggle('open',open);
  }
  items.forEach(function(b){
    b.addEventListener('click',function(){
      var open=b.getAttribute('aria-expanded')==='true';
      items.forEach(function(o){if(o!==b&&o.getAttribute('aria-expanded')==='true')setFaq(o,false)});
      setFaq(b,!open);
    });
  });

  /* ---------- Scroll-linked: progress, hero parallax, floating button ---------- */
  var bar=$('#progress'),hv=$('#hero-visual'),hvImg=hv&&$('.orb',hv),fab=$('#fab');
  var hidden={contato:false,rodape:false,diagnostico:false},ticking=false,lastY=0,fabUp=false,idleT;
  function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
  function update(){
    ticking=false;
    var y=window.pageYOffset,vh=window.innerHeight,max=document.documentElement.scrollHeight-vh;
    if(bar&&!reduce)bar.style.transform='scaleX('+(max>0?clamp(y/max,0,1):0)+')';
    if(hv&&hvImg&&!reduce){
      var r=hv.getBoundingClientRect(),p=clamp((vh-r.top)/(vh+r.height),0,1);
      hvImg.style.transform='translate3d(0,'+((p-.35)*-40).toFixed(1)+'px,0) scale('+(1+p*.1).toFixed(3)+')';
    }
    var dy=y-lastY;
    if(Math.abs(dy)>4){
      fabUp=dy<0;lastY=y;
      clearTimeout(idleT);idleT=setTimeout(function(){fabUp=false;update()},3000);
    }
    if(fab)fab.classList.toggle('show',y>vh*.6&&fabUp&&!hidden.contato&&!hidden.rodape&&!hidden.diagnostico);
  }
  function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(update)}}
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll,{passive:true});
  if('IntersectionObserver' in window){
    ['contato','rodape','diagnostico'].forEach(function(id){
      var el=document.getElementById(id);if(!el)return;
      new IntersectionObserver(function(es){hidden[id]=es[0].isIntersecting;onScroll()},{threshold:0,rootMargin:'-70% 0px 0px 0px'}).observe(el);
    });
  }
  update();

  /* ---------- Forms -> WhatsApp ---------- */
  var emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function check(input){
    var v=input.value.trim(),msg='';
    if(!v)msg='Preencha este campo.';
    else if(input.type==='email'&&!emailRe.test(v))msg='Informe um email válido, como nome@empresa.com.br.';
    else if(input.type==='tel'&&v.replace(/\D/g,'').length<10)msg='Informe um telefone com DDD, por exemplo (41) 99999-9999.';
    else if(input.name==='Nome completo'&&v.length<3)msg='Informe seu nome completo.';
    var f=input.closest('.field'),e=f.querySelector('.err');
    e.textContent=msg;
    if(msg){f.setAttribute('data-invalid','');input.setAttribute('aria-invalid','true')}
    else{f.removeAttribute('data-invalid');input.removeAttribute('aria-invalid')}
    return !msg;
  }
  $$('form[data-wa-form]').forEach(function(form){
    var inputs=$$('input,textarea',form);
    inputs.forEach(function(i){
      i.addEventListener('blur',function(){if(i.value||i.hasAttribute('aria-invalid'))check(i)});
      i.addEventListener('input',function(){if(i.hasAttribute('aria-invalid'))check(i)});
    });
    form.addEventListener('submit',function(ev){
      ev.preventDefault();
      var ok=true,first=null;
      inputs.forEach(function(i){if(!check(i)){ok=false;if(!first)first=i}});
      if(!ok){first.focus();return}
      var lines=['Olá, vim pelo site da UiLook e gostaria de conversar.',''];
      inputs.forEach(function(i){lines.push(i.name+': '+i.value.trim())});
      var url=window.UILOOK_WA+'&text='+encodeURIComponent(lines.join('\n'));
      window.open(url,'_blank','noopener');
      var okEl=form.parentNode.querySelector('.form-ok');
      okEl.textContent='Recebemos! Abrimos o WhatsApp para concluir o contato.';
      okEl.hidden=false;form.hidden=true;
      if(lenis)lenis.resize&&lenis.resize();
    });
  });
})();
