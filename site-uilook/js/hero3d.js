/* UiLook — hero 3D: liquid chrome form (original shader, three.js).
   Falls back to the static orb image when WebGL is unavailable or the user prefers reduced motion. */
import * as THREE from 'three';

const host = document.getElementById('hero-3d');
const stage = document.getElementById('hero-visual');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (host && stage && !reduce) {
  try { init(); } catch (e) { /* keep static fallback */ }
}

function init() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  /* --- warm studio environment (dark room, cream light strips, one purple glint) --- */
  const env = new THREE.Scene();
  env.add(new THREE.Mesh(new THREE.BoxGeometry(12, 12, 12), new THREE.MeshBasicMaterial({ color: 0x15150f, side: THREE.BackSide })));
  const strip = (w, h, x, y, z, color, power) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(power), side: THREE.DoubleSide }));
    m.position.set(x, y, z); m.lookAt(0, 0, 0); env.add(m);
  };
  strip(9, 2.2, 0, 5.4, 1.2, 0xfffdf2, 6.0);     // top softbox
  strip(1.6, 7, -5.6, 0.4, 0.8, 0xffffff, 5.0);  // left strip
  strip(2.2, 6, 5.4, -0.2, 1.8, 0xf6f6f4, 4.0);  // right strip
  strip(6, 0.9, 0, -5.0, 2.6, 0xe8e7d9, 2.4);    // floor bounce
  strip(0.6, 1.4, 3.6, 3.2, -3.8, 0x7a52c7, 3.0); // small purple glint
  strip(4, 4, 0, 0, -5.8, 0x57584b, 0.6);        // back fill (olive)
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(env, 0.035).texture;

  const scene = new THREE.Scene();
  scene.environment = envTex;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, 6.4);

  const small = window.innerWidth < 640;
  const geo = new THREE.SphereGeometry(1, small ? 144 : 224, small ? 96 : 160);

  const U = {
    uTime: { value: 0 },
    uAmp: { value: 0.5 },
    uFreq: { value: 0.7 },
    uWarp: { value: 0.24 },
    uPointer: { value: new THREE.Vector3(0, 0, 1) },
    uPull: { value: 0 },
    uRippleDir: { value: new THREE.Vector3(0, 0, 1) },
    uRippleT: { value: 10 },
  };

  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xc9c8bd, metalness: 1, roughness: 0.05,
    clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.0,
  });

  const GLSL = /* glsl */`
    uniform float uTime, uAmp, uFreq, uWarp, uPull, uRippleT;
    uniform vec3 uPointer, uRippleDir;
    vec3 ui_m289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 ui_m289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 ui_perm(vec4 x){return ui_m289(((x*34.0)+10.0)*x);}
    vec4 ui_tis(vec4 r){return 1.79284291400159-0.85373472095314*r;}
    float ui_noise(vec3 v){
      const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
      vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
      vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
      vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
      i=ui_m289(i);
      vec4 p=ui_perm(ui_perm(ui_perm(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
      float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
      vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
      vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
      vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
      vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
      vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
      vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
      vec4 nr=ui_tis(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0*=nr.x; p1*=nr.y; p2*=nr.z; p3*=nr.w;
      vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
      return 105.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
    }
    float ui_disp(vec3 s){
      float t=uTime;
      vec3 w=s*uFreq+vec3(0.0,t*0.23,t*0.17);
      vec3 warp=vec3(ui_noise(w+vec3(3.1,0.0,0.0)),ui_noise(w+vec3(0.0,7.7,0.0)),ui_noise(w+vec3(0.0,0.0,1.9)));
      float n=ui_noise(s*uFreq+warp*uWarp+vec3(t*0.11,-t*0.09,t*0.13));
      float d=n*uAmp;
      d+=ui_noise(s*uFreq*1.6+vec3(t*0.21))*uAmp*0.09;
      float pr=max(dot(s,uPointer),0.0); d+=pow(pr,7.0)*uPull;
      float rd=distance(s,uRippleDir);
      d+=sin(rd*14.0-uRippleT*9.0)*exp(-uRippleT*2.2)*0.07*smoothstep(1.3,0.0,rd);
      return d;
    }
    vec3 ui_pos(vec3 s){return s*(1.0+ui_disp(s));}
    void ui_basis(vec3 n,out vec3 t,out vec3 b){
      float sg=n.z>=0.0?1.0:-1.0; float a=-1.0/(sg+n.z); float bb=n.x*n.y*a;
      t=vec3(1.0+sg*n.x*n.x*a,sg*bb,-sg*n.x); b=vec3(bb,sg+n.y*n.y*a,-n.y);
    }
  `;

  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, U);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\n' + GLSL)
      .replace('#include <beginnormal_vertex>', `
        vec3 uiS=normalize(position); vec3 uiT; vec3 uiB; ui_basis(uiS,uiT,uiB);
        float uiE=0.01;
        vec3 uiQ0=ui_pos(uiS);
        vec3 uiQ1=ui_pos(normalize(uiS+uiT*uiE));
        vec3 uiQ2=ui_pos(normalize(uiS+uiB*uiE));
        vec3 objectNormal=normalize(cross(uiQ1-uiQ0,uiQ2-uiQ0));
        if(dot(objectNormal,uiS)<0.0) objectNormal=-objectNormal;
        #ifdef USE_TANGENT
          vec3 objectTangent=vec3(tangent.xyz);
        #endif
      `)
      .replace('#include <begin_vertex>', 'vec3 transformed=uiQ0;');
  };

  const mesh = new THREE.Mesh(geo, mat);
  const group = new THREE.Group();
  group.add(mesh);
  scene.add(group);

  /* --- sizing --- */
  let W = 1, H = 1;
  function resize() {
    const r = host.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    // keep the form fully visible on narrow viewports
    const fit = W / H < 1 ? 1.12 / (W / H) : 1;
    camera.position.z = 6.4 * Math.min(fit, 1.6);
    camera.updateProjectionMatrix();
  }
  resize();
  new ResizeObserver(resize).observe(host);

  /* --- interaction --- */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, inside: false };
  let agitate = 0, agitateT = 0, scrollP = 0;
  stage.addEventListener('pointermove', (e) => {
    const r = stage.getBoundingClientRect();
    pointer.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
    pointer.inside = true;
  }, { passive: true });
  stage.addEventListener('pointerleave', () => { pointer.inside = false; pointer.tx = 0; pointer.ty = 0; });
  stage.addEventListener('pointerdown', () => {
    U.uRippleDir.value.copy(U.uPointer.value);
    U.uRippleT.value = 0;
    agitateT = 1.2;
  });

  function onScroll() {
    const r = stage.getBoundingClientRect();
    scrollP = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- run only while visible --- */
  let visible = true, running = false, last = performance.now(), born = last;
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) start(); }, { rootMargin: '120px' }).observe(stage);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) start(); });

  const tmp = new THREE.Vector3();
  const inv = new THREE.Quaternion();
  const easeOutBack = (x) => { const c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };

  function frame(now) {
    if (!visible || document.hidden) { running = false; return; }
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const life = (now - born) / 1000;

    pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 4);
    pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 4);

    agitateT = Math.max(0, agitateT - dt);
    const targetAg = (pointer.inside ? 0.45 : 0) + (agitateT > 0 ? 1 : 0);
    agitate += (targetAg - agitate) * Math.min(1, dt * 3);

    U.uTime.value += dt * (0.55 + agitate * 1.6 + scrollP * 0.8);
    U.uRippleT.value += dt;

    // intro: liquid drop settles
    const intro = Math.min(1, life / 1.8);
    const introAmp = (1 - intro) * 0.35;
    U.uAmp.value = 0.5 + introAmp + scrollP * 0.16 + agitate * 0.08;
    U.uWarp.value = 0.24 + scrollP * 0.3;

    // rotation follows the cursor + idle spin + scroll twist
    group.rotation.y += dt * (0.12 + agitate * 0.25);
    mesh.rotation.x += ((pointer.y * 0.5 + scrollP * 0.9) - mesh.rotation.x) * Math.min(1, dt * 2.5);
    mesh.rotation.z += ((-pointer.x * 0.35) - mesh.rotation.z) * Math.min(1, dt * 2.5);
    group.position.x += ((pointer.x * 0.18) - group.position.x) * Math.min(1, dt * 2);
    group.position.y += ((-pointer.y * 0.12 + scrollP * 0.6) - group.position.y) * Math.min(1, dt * 2);
    const s = easeOutBack(intro) * (1 - scrollP * 0.22);
    group.scale.setScalar(Math.max(0.001, s));

    // pointer direction in object space (for the "pull" bulge and click ripple)
    tmp.set(pointer.x * 1.2, -pointer.y * 1.0, 1).normalize();
    mesh.getWorldQuaternion(inv); inv.invert();
    tmp.applyQuaternion(inv);
    U.uPointer.value.lerp(tmp, Math.min(1, dt * 6)).normalize();
    U.uPull.value += ((pointer.inside ? 0.16 : 0) - U.uPull.value) * Math.min(1, dt * 3);

    renderer.render(scene, camera);
    if (!host.classList.contains('is-live')) host.classList.add('is-live');
    requestAnimationFrame(frame);
  }
  function start() { if (!running && visible && !document.hidden) { running = true; last = performance.now(); requestAnimationFrame(frame); } }
  start();
}
