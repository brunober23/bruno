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
    window.__lenis=lenis}catch(e){lenis=null}
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
  var revealEls=$$('[data-reveal],[data-split],[data-hl],[data-frame]');
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
  var bar=$('#progress'),fab=$('#fab'),svcCards=$$('.svc'),diagPanel=$('.diag-panel');
  var dotsEl=document.createElement('div');dotsEl.className='dots';dotsEl.setAttribute('aria-hidden','true');document.body.insertBefore(dotsEl,document.body.firstChild);
  var hidden={contato:false,rodape:false,diagnostico:false},ticking=false,lastY=0,fabUp=false,idleT;
  function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
  function update(){
    ticking=false;
    var y=window.pageYOffset,vh=window.innerHeight,max=document.documentElement.scrollHeight-vh;
    if(bar&&!reduce)bar.style.transform='scaleX('+(max>0?clamp(y/max,0,1):0)+')';
    if(!reduce){
      if(dotsEl)dotsEl.style.setProperty('--bgy',(-(y*.15)%24).toFixed(1)+'px');
      if(svcCards.length&&window.innerWidth>=960){
        for(var ci=0;ci<svcCards.length-1;ci++){
          var ra=svcCards[ci].getBoundingClientRect(),rb=svcCards[ci+1].getBoundingClientRect();
          var cp=clamp((ra.bottom-rb.top)/Math.max(1,ra.height),0,1);
          svcCards[ci].style.transform='scale('+(1-cp*.06).toFixed(4)+')';
        }
      }else if(svcCards.length){svcCards.forEach(function(c){c.style.transform=''})}
      if(diagPanel){
        var dr=diagPanel.getBoundingClientRect(),dp=clamp((vh-dr.top)/(vh*.75),0,1),de=1-Math.pow(1-dp,3);
        var dpad=Math.max(0,(parseFloat(getComputedStyle(diagPanel).paddingLeft)||24)-12);
        diagPanel.style.clipPath='inset(0 '+((1-de)*Math.min(56,dpad)).toFixed(1)+'px round 8px)';
      }
    }
    var dy=y-lastY;
    if(Math.abs(dy)>4){
      fabUp=dy<0;lastY=y;
      clearTimeout(idleT);idleT=setTimeout(function(){fabUp=false;update()},3000);
    }
    if(fab)fab.classList.toggle('show',y>vh*.6&&!hidden.contato&&!hidden.rodape&&!(hidden.diagnostico&&window.innerWidth>=1024));
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


  /* =================== Round 6: more motion =================== */
  var fine=window.matchMedia('(pointer: fine)').matches;

  /* ---------- Hero: morphing checkerboard blob + glitch bars ---------- */
  var stage=$('#hero-visual'),blobSvg=$('#hv-blob');
  var hp={x:0,y:0,tx:0,ty:0};
  if(stage){
    stage.addEventListener('pointermove',function(e){var r=stage.getBoundingClientRect();hp.tx=((e.clientX-r.left)/r.width)*2-1;hp.ty=((e.clientY-r.top)/r.height)*2-1},{passive:true});
    stage.addEventListener('pointerleave',function(){hp.tx=0;hp.ty=0});
  }
  if(blobSvg&&stage){
    var bMain=$('.blob-main',blobSvg),bSat=$('.blob-sat',blobSvg),bw=1,bh=1;
    var bsize=function(){var r=blobSvg.getBoundingClientRect();bw=Math.max(1,r.width);bh=Math.max(1,r.height);blobSvg.setAttribute('viewBox','0 0 '+bw.toFixed(0)+' '+bh.toFixed(0))};
    bsize();window.addEventListener('resize',bsize);
    var blobPath=function(cx,cy,rx,ry,t,seed,amp,n){
      var pts=[],i;
      for(i=0;i<n;i++){
        var a=i/n*Math.PI*2+seed*.3;
        var k=1+amp*(.55*Math.sin(t*.7+seed+i*1.7)+.45*Math.sin(t*1.13+seed*2.1+i*2.9));
        pts.push([cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k]);
      }
      var d='M'+pts[0][0].toFixed(1)+' '+pts[0][1].toFixed(1);
      for(i=0;i<n;i++){
        var p0=pts[(i-1+n)%n],p1=pts[i],p2=pts[(i+1)%n],p3=pts[(i+2)%n];
        d+='C'+(p1[0]+(p2[0]-p0[0])/6).toFixed(1)+' '+(p1[1]+(p2[1]-p0[1])/6).toFixed(1)+' '+(p2[0]-(p3[0]-p1[0])/6).toFixed(1)+' '+(p2[1]-(p3[1]-p1[1])/6).toFixed(1)+' '+p2[0].toFixed(1)+' '+p2[1].toFixed(1);
      }
      return d+'Z';
    };
    var heroScroll=function(){var r=stage.getBoundingClientRect();return clamp(-r.top/Math.max(1,r.height),0,1)};
    var glitches=$$('.hv-glitch',stage);
    var bt=Math.random()*10,blast=performance.now(),bvis=true,brun=false;
    var drawBlob=function(t){
      var wide=bw>=640,sc=1-heroScroll()*.18;
      var ox=-hp.x*14,oy=-hp.y*10;
      bMain.setAttribute('d',blobPath(bw*.5+ox,bh*.52+oy,Math.min(bw*(wide?.34:.46),430)*sc,bh*.4*sc,t,1.3,.16,9));
      bSat.setAttribute('d',blobPath(bw*(wide?.77:.76)+ox*1.8,bh*(wide?.34:.18)+oy*1.8,Math.min(bw*(wide?.12:.13),150)*sc,bh*(wide?.17:.12)*sc,t*1.3,4.2,.22,7));
    };
    var blobLoop=function(now){
      if(!bvis){brun=false;return}
      var dt=Math.min(.05,(now-blast)/1000);blast=now;bt+=dt;
      hp.x+=(hp.tx-hp.x)*Math.min(1,dt*3);hp.y+=(hp.ty-hp.y)*Math.min(1,dt*3);
      drawBlob(bt);
      glitches.forEach(function(g,i){var d=(i+1)*6;g.style.transform='translate3d('+(hp.x*d).toFixed(1)+'px,'+(hp.y*d*.6).toFixed(1)+'px,0)'});
      requestAnimationFrame(blobLoop);
    };
    drawBlob(bt);
    if(!reduce){
      new IntersectionObserver(function(es){bvis=es[0].isIntersecting;if(bvis&&!brun){brun=true;blast=performance.now();requestAnimationFrame(blobLoop)}},{rootMargin:'100px'}).observe(stage);
      var widths={k:[8,16,24,32,48],o:[8,16,24,40,64],y:[16,24,40,56,72,96]};
      var pick=function(a){return a[Math.floor(Math.random()*a.length)]};
      var setW=function(g){$$('i',g).forEach(function(seg){seg.style.setProperty('--w',pick(widths[seg.className]||widths.k)+'px')})};
      var glitch=function(){
        if(bvis&&!document.hidden){
          var g=pick(glitches);
          setW(g);
          g.style.translate=(Math.random()*24-12).toFixed(0)+'px '+(Math.random()*6-3).toFixed(0)+'px';
          setTimeout(function(){g.style.translate='0 0'},160);
        }
        setTimeout(glitch,900+Math.random()*1600);
      };
      glitches.forEach(setW);
      setTimeout(glitch,1400);
    }
  }

  /* ---------- Eyebrow scramble (terminal feel) ---------- */
  var CH='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/_<>';
  var brows=$$('.sec .eyebrow, .hero .eyebrow').filter(function(e){return !e.closest('.mock')&&!e.children.length});
  brows.forEach(function(el){
    var txt=el.textContent.trim();el.textContent='';
    var sr=document.createElement('span');sr.className='sr-only';sr.textContent=txt;
    var vis=document.createElement('span');vis.className='scr';vis.setAttribute('aria-hidden','true');vis.textContent=txt;
    el.appendChild(sr);el.appendChild(vis);el._scr={vis:vis,txt:txt};
  });
  function scramble(el){
    var o=el._scr;if(!o)return;
    var dur=Math.min(1100,350+o.txt.length*28),t0=null;
    function f(t){
      if(t0===null)t0=t;
      var p=Math.min(1,(t-t0)/dur),out='';
      for(var i=0;i<o.txt.length;i++){
        var c=o.txt[i];
        out+=(c===' '||p>=(i+1)/o.txt.length*.9+.1*Math.random())?c:CH[Math.floor(Math.random()*CH.length)];
      }
      o.vis.textContent=p<1?out:o.txt;
      if(p<1)requestAnimationFrame(f);
    }
    requestAnimationFrame(f);
  }
  if(!reduce&&'IntersectionObserver' in window){
    var sio=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){scramble(en.target);sio.unobserve(en.target)}})},{threshold:.8});
    brows.forEach(function(e){sio.observe(e)});
  }

  /* ---------- Magnetic buttons ---------- */
  if(fine&&!reduce){
    $$('.btn').forEach(function(b){
      if(b.id==='fab')return;
      b.addEventListener('pointermove',function(e){
        var r=b.getBoundingClientRect();
        var dx=(e.clientX-(r.left+r.width/2))/r.width,dy=(e.clientY-(r.top+r.height/2))/r.height;
        b.style.translate=(dx*12).toFixed(1)+'px '+(dy*8).toFixed(1)+'px';
      });
      b.addEventListener('pointerleave',function(){b.style.translate='0 0'});
    });
  }

  /* ---------- Mockups: play when visible, tilt with the cursor ---------- */
  var mocks=$$('[data-mock]');
  if('IntersectionObserver' in window){
    var mio=new IntersectionObserver(function(es){es.forEach(function(en){en.target.classList.toggle('is-play',en.isIntersecting)})},{threshold:.15});
    mocks.forEach(function(m){mio.observe(m)});
  }else{mocks.forEach(function(m){m.classList.add('is-play')})}
  if(fine&&!reduce){
    mocks.forEach(function(m){
      m.addEventListener('pointermove',function(e){
        var r=m.getBoundingClientRect();
        m.style.setProperty('--mx',(((e.clientX-r.left)/r.width)*2-1).toFixed(3));
        m.style.setProperty('--my',(((e.clientY-r.top)/r.height)*2-1).toFixed(3));
      });
      m.addEventListener('pointerleave',function(){m.style.setProperty('--mx','0');m.style.setProperty('--my','0')});
    });
  }

  /* ---------- Tools marquee: speed and direction follow the scroll ---------- */
  var mq=$('.marquee'),mt=mq&&$('.marquee-track',mq);
  if(mq&&mt&&!reduce){
    mq.classList.add('is-js');
    var mx=0,half=1,mhover=false,mvel=0,mdir=1,mlastY=window.pageYOffset,mlast=performance.now(),mvis=true,mrun=false;
    var msize=function(){half=Math.max(1,mt.scrollWidth/2)};
    msize();window.addEventListener('resize',msize);
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(msize);
    mq.addEventListener('pointerenter',function(){mhover=true});
    mq.addEventListener('pointerleave',function(){mhover=false});
    var mloop=function(now){
      if(!mvis){mrun=false;return}
      var dt=Math.min(.05,(now-mlast)/1000);mlast=now;
      var sy=window.pageYOffset,dv=sy-mlastY;mlastY=sy;
      mvel+=(dv-mvel)*.12;
      if(Math.abs(dv)>1)mdir=dv>0?1:-1;
      var speed=mhover?0:44+Math.min(700,Math.abs(mvel)*36);
      mx-=mdir*speed*dt;
      if(mx<=-half)mx+=half;if(mx>0)mx-=half;
      mt.style.transform='translate3d('+mx.toFixed(1)+'px,0,0) skewX('+clamp(-mvel*.35,-10,10).toFixed(2)+'deg)';
      requestAnimationFrame(mloop);
    };
    new IntersectionObserver(function(es){mvis=es[0].isIntersecting;if(mvis&&!mrun){mrun=true;mlast=performance.now();requestAnimationFrame(mloop)}}).observe(mq);
  }

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
