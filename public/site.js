/* Every page opens at its top (or at its #anchor), on navigation, refresh and back/forward. */
(function(){
  try{ if('scrollRestoration' in history) history.scrollRestoration='manual'; }catch(e){}
  var userMoved=false;
  function mark(){ userMoved=true; }
  ['wheel','touchmove','keydown','mousedown'].forEach(function(t){ window.addEventListener(t,mark,{passive:true,once:true}); });
  function toStart(force){
    if(userMoved && !force) return;
    var id=window.__psekAnchor || (location.hash && location.hash.length>1 ? decodeURIComponent(location.hash.slice(1)) : '');
    var el=id && id!=='demo' ? document.getElementById(id) : null;
    if(el){ el.scrollIntoView({block:'start'}); return; }
    window.scrollTo(0,0); document.documentElement.scrollTop=0; if(document.body) document.body.scrollTop=0;
    /* Also brings the page top into view when the site is shown inside a scrolling frame. */
    if(window.self!==window.top){ try{ document.documentElement.scrollIntoView({block:'start'}); }catch(e){} window.scrollTo(0,0); }
  }
  toStart(true);
  document.addEventListener('DOMContentLoaded',function(){ toStart(); });
  window.addEventListener('load',function(){ toStart(); setTimeout(toStart,120); setTimeout(toStart,450); });
  window.addEventListener('pageshow',function(e){ if(e.persisted){ userMoved=false; toStart(true); } });
  window.addEventListener('beforeunload',function(){ window.scrollTo(0,0); });
})();
(function(){
  var d=document, w=window, root=d.documentElement;
  root.classList.add('js');
  var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* header state */
  var hdr=d.querySelector('.hdr');
  function onScroll(){ if(hdr) hdr.classList.toggle('scrolled', w.scrollY>8);
    var m=d.querySelector('.mcta'); if(m){ m.classList.toggle('show', w.scrollY>520); } }
  w.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* mega menus */
  d.querySelectorAll('[data-menu]').forEach(function(btn){
    var panel=d.getElementById(btn.getAttribute('data-menu'));
    btn.addEventListener('click', function(e){ e.stopPropagation();
      var open=btn.getAttribute('aria-expanded')==='true';
      closeAll(); if(!open){ btn.setAttribute('aria-expanded','true'); panel.classList.add('open'); } });
  });
  function closeAll(){ d.querySelectorAll('[data-menu]').forEach(function(b){ b.setAttribute('aria-expanded','false'); var p=d.getElementById(b.getAttribute('data-menu')); if(p) p.classList.remove('open'); }); }
  d.addEventListener('click', function(e){ if(!e.target.closest('.mega')) closeAll(); });
  d.addEventListener('keydown', function(e){ if(e.key==='Escape'){ closeAll(); closeM(); } });

  /* mobile nav */
  var mnav=d.getElementById('mnav');
  function closeM(){ if(mnav){ mnav.hidden=true; d.body.style.overflow=''; } }
  d.querySelectorAll('[data-mnav-open]').forEach(function(b){ b.addEventListener('click', function(){ mnav.hidden=false; d.body.style.overflow='hidden'; }); });
  d.querySelectorAll('[data-mnav-close]').forEach(function(b){ b.addEventListener('click', closeM); });

  /* reveal */
  if('IntersectionObserver' in w && !reduce){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.remove('pre'); io.unobserve(e.target);} }); },{rootMargin:'0px 0px -8% 0px'});
    d.querySelectorAll('.rv').forEach(function(el){ var r=el.getBoundingClientRect(); if(r.top>w.innerHeight){ el.classList.add('pre'); io.observe(el);} });
  }

  /* story chapters to stage scenes */
  var chapters=d.querySelectorAll('.chapter');
  if(chapters.length && 'IntersectionObserver' in w){
    var setScene=function(i){ chapters.forEach(function(c,k){ c.classList.toggle('on',k===i); });
      d.querySelectorAll('.stage .scene').forEach(function(s,k){ s.classList.toggle('on',k===i); }); };
    var co=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ setScene([].indexOf.call(chapters,e.target)); } }); },{rootMargin:'-45% 0px -45% 0px'});
    chapters.forEach(function(c){ co.observe(c); }); setScene(0);
  }

  /* hero threads */
  var cv=d.querySelector('canvas.threads');
  if(cv && cv.getContext){
    var ctx=cv.getContext('2d'), W=0,H=0, t=0, dpr=Math.min(w.devicePixelRatio||1,2);
    var lines=[]; for(var i=0;i<26;i++){ lines.push({y:Math.random(), a:12+Math.random()*40, f:.6+Math.random()*1.6, p:Math.random()*6, s:.15+Math.random()*.5, teal:Math.random()<.22}); }
    var size=function(){ W=cv.clientWidth; H=cv.clientHeight; cv.width=W*dpr; cv.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); };
    size(); w.addEventListener('resize', size);
    var draw=function(){ ctx.clearRect(0,0,W,H);
      lines.forEach(function(l){ ctx.beginPath();
        for(var x=0;x<=W;x+=14){ var y=l.y*H + Math.sin(x/W*Math.PI*2*l.f + l.p + t*l.s)*l.a; x===0?ctx.moveTo(x,y):ctx.lineTo(x,y); }
        ctx.strokeStyle=l.teal?'rgba(45,212,191,.55)':'rgba(163,173,194,.16)'; ctx.lineWidth=l.teal?1.2:1; ctx.stroke(); });
      lines.forEach(function(l){ if(!l.teal) return; var x=((t*40*l.s*3)%(W+200))-100; var y=l.y*H+Math.sin(x/W*Math.PI*2*l.f+l.p+t*l.s)*l.a;
        var g=ctx.createRadialGradient(x,y,0,x,y,14); g.addColorStop(0,'rgba(94,234,212,.95)'); g.addColorStop(1,'rgba(94,234,212,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,14,0,7); ctx.fill(); });
    };
    if(reduce){ draw(); } else { (function loop(){ t+=0.016; draw(); w.requestAnimationFrame(loop); })(); }
  }

  /* tabs (generic) */
  d.querySelectorAll('[data-tabs]').forEach(function(g){
    var btns=g.querySelectorAll('[role="tab"]');
    btns.forEach(function(b){ b.addEventListener('click', function(){
      btns.forEach(function(x){ x.setAttribute('aria-selected', x===b?'true':'false'); var p=d.getElementById(x.getAttribute('aria-controls')); if(p) p.hidden = x!==b; });
    }); });
  });

  /* relationship graph */
  var gsvg=d.getElementById('rel-graph');
  if(gsvg){
    var ENTS=JSON.parse(d.getElementById('rel-data').textContent);
    var names=Object.keys(ENTS), cx=300, cy=230, R=180;
    var pos={}; names.forEach(function(n,i){ var a=-Math.PI/2+i*2*Math.PI/names.length; pos[n]=[cx+R*Math.cos(a), cy+R*Math.sin(a)*.82]; });
    function render(sel){
      var s='';
      names.forEach(function(n){ (ENTS[n].links||[]).forEach(function(m){ var on=(n===sel||m===sel); if(!pos[m])return;
        s+='<line x1="'+pos[n][0]+'" y1="'+pos[n][1]+'" x2="'+pos[m][0]+'" y2="'+pos[m][1]+'" stroke="'+(on?'#2DD4BF':'rgba(163,173,194,.14)')+'" stroke-width="'+(on?1.6:1)+'"/>'; }); });
      names.forEach(function(n){ var on=n===sel, near=sel && (ENTS[sel].links||[]).indexOf(n)>-1;
        s+='<g><circle cx="'+pos[n][0]+'" cy="'+pos[n][1]+'" r="'+(on?11:7)+'" fill="'+(on?'#2DD4BF':near?'#5EEAD4':'#2A3550')+'"/>'+
          '<text x="'+pos[n][0]+'" y="'+(pos[n][1]+(pos[n][1]<cy?-18:28))+'" text-anchor="middle" font-family="Geist, system-ui, sans-serif" font-size="13" fill="'+(on||near?'#FFFFFF':'#A3ADC2')+'">'+n+'</text></g>'; });
      gsvg.innerHTML=s;
      var desc=d.getElementById('ent-desc'); if(desc && sel){ desc.innerHTML='<b>'+sel+'.</b> '+ENTS[sel].d+'<div class="muted" style="margin-top:8px;font-size:14px">Direct connections: '+ENTS[sel].links.join(' · ')+'</div>'; }
      d.querySelectorAll('.ent').forEach(function(b){ b.setAttribute('aria-pressed', b.textContent===sel?'true':'false'); });
    }
    d.querySelectorAll('.ent').forEach(function(b){ b.addEventListener('click', function(){ render(b.textContent); }); });
    render('Processing Activity');
  }

  /* globe */
  var gl=d.querySelector('canvas.globe');
  if(gl && gl.getContext){
    var JUR=JSON.parse(d.getElementById('jur-data').textContent);
    var g2=gl.getContext('2d'), rot=-1.2, tilt=0.35, sel=JUR[0].k, drag=null, dpr2=Math.min(w.devicePixelRatio||1,2);
    var pts=[]; for(var la=-80;la<=80;la+=6){ var n=Math.max(6,Math.round(60*Math.cos(la*Math.PI/180))); for(var k=0;k<n;k++){ pts.push([la*Math.PI/180,(k/n)*2*Math.PI]); } }
    var sz=function(){ var s=gl.clientWidth; gl.width=s*dpr2; gl.height=s*dpr2; g2.setTransform(dpr2,0,0,dpr2,0,0); };
    sz(); w.addEventListener('resize', sz);
    function proj(lat,lon,S){ var x=Math.cos(lat)*Math.sin(lon+rot), y=Math.sin(lat), z=Math.cos(lat)*Math.cos(lon+rot);
      var y2=y*Math.cos(tilt)-z*Math.sin(tilt), z2=y*Math.sin(tilt)+z*Math.cos(tilt); return [S/2+x*S*.42, S/2-y2*S*.42, z2]; }
    /* real continents: Natural Earth land as a dot grid (loaded async; graticule shows until then) */
    var land=null;
    if(w.fetch){ fetch('/land-dots.json').then(function(r){return r.json();}).then(function(j){
      land=j.map(function(p){ return [p[0]*Math.PI/180, p[1]*Math.PI/180]; }); }).catch(function(){}); }
    function rrect(x,y,wd,h,r){ g2.beginPath(); g2.moveTo(x+r,y); g2.arcTo(x+wd,y,x+wd,y+h,r); g2.arcTo(x+wd,y+h,x,y+h,r); g2.arcTo(x,y+h,x,y,r); g2.arcTo(x,y,x+wd,y,r); g2.closePath(); }
    function drawG(t){ var S=gl.clientWidth, cx=S/2, cy=S/2, R=S*.42; g2.clearRect(0,0,S,S);
      /* atmosphere halo */
      var halo=g2.createRadialGradient(cx,cy,R*.88,cx,cy,R*1.22);
      halo.addColorStop(0,'rgba(45,212,191,0)'); halo.addColorStop(.55,'rgba(45,212,191,.13)'); halo.addColorStop(1,'rgba(45,212,191,0)');
      g2.fillStyle=halo; g2.beginPath(); g2.arc(cx,cy,R*1.22,0,7); g2.fill();
      /* sphere body, lit from the top-left */
      var body=g2.createRadialGradient(cx-R*.35,cy-R*.4,R*.08,cx,cy,R);
      body.addColorStop(0,'#243C6A'); body.addColorStop(.5,'#13203C'); body.addColorStop(1,'#0A1226');
      g2.fillStyle=body; g2.beginPath(); g2.arc(cx,cy,R,0,7); g2.fill();
      /* glassy sheen sweeping across + fixed specular highlight (clipped to sphere) */
      g2.save(); g2.beginPath(); g2.arc(cx,cy,R,0,7); g2.clip();
      var sp=reduce?.35:((t*.00005)%1), x0=(sp*2-.5)*S;
      var sheen=g2.createLinearGradient(x0-S*.22,0,x0+S*.22,S*.35);
      sheen.addColorStop(0,'rgba(255,255,255,0)'); sheen.addColorStop(.5,'rgba(255,255,255,.05)'); sheen.addColorStop(1,'rgba(255,255,255,0)');
      g2.fillStyle=sheen; g2.fillRect(0,0,S,S);
      var spec=g2.createRadialGradient(cx-R*.42,cy-R*.46,0,cx-R*.42,cy-R*.46,R*.65);
      spec.addColorStop(0,'rgba(255,255,255,.1)'); spec.addColorStop(1,'rgba(255,255,255,0)');
      g2.fillStyle=spec; g2.fillRect(0,0,S,S);
      g2.restore();
      /* rim light */
      g2.strokeStyle='rgba(94,234,212,.3)'; g2.lineWidth=1.2; g2.beginPath(); g2.arc(cx,cy,R,0,7); g2.stroke();
      /* continents (or graticule until land data arrives), depth-faded */
      var dsz=Math.max(1.6,S*.0042);
      if(land){ for(var i=0;i<land.length;i++){ var q=proj(land[i][0],land[i][1],S);
        if(q[2]>0){ g2.fillStyle='rgba(176,200,235,'+(0.12+q[2]*.5).toFixed(3)+')'; g2.fillRect(q[0]-dsz/2,q[1]-dsz/2,dsz,dsz); } } }
      else{ pts.forEach(function(p){ var q=proj(p[0],p[1],S); if(q[2]>0){ g2.fillStyle='rgba(163,173,194,'+(0.08+q[2]*.3)+')'; g2.fillRect(q[0],q[1],1.4,1.4);} }); }
      /* jurisdiction pins: stem + glowing head, nearest drawn last */
      var vis=[]; JUR.forEach(function(j){ var q=proj(j.lat*Math.PI/180,j.lon*Math.PI/180,S); if(q[2]>0) vis.push([j,q]); });
      vis.sort(function(a,b){ return a[1][2]-b[1][2]; });
      vis.forEach(function(v){ var j=v[0], q=v[1], on=j.k===sel, z=q[2], px=q[0], py=q[1], h=on?16:10, hr=on?5.5:3.5;
        if(on){ var pp=reduce?.5:((t*.0011)%1), pr=6+pp*16;
          g2.strokeStyle='rgba(45,212,191,'+(.55*(1-pp)).toFixed(3)+')'; g2.lineWidth=1.5;
          g2.beginPath(); g2.ellipse(px,py,pr,pr*.45,0,0,7); g2.stroke(); }
        g2.strokeStyle='rgba(94,234,212,'+(0.25+z*.4).toFixed(3)+')'; g2.lineWidth=1.4;
        g2.beginPath(); g2.moveTo(px,py); g2.lineTo(px,py-h); g2.stroke();
        g2.fillStyle='rgba(94,234,212,'+(0.3+z*.3).toFixed(3)+')'; g2.beginPath(); g2.arc(px,py,1.8,0,7); g2.fill();
        var gg=g2.createRadialGradient(px,py-h,0,px,py-h,hr*3);
        gg.addColorStop(0,'rgba(45,212,191,'+(on?.55:.35)+')'); gg.addColorStop(1,'rgba(45,212,191,0)');
        g2.fillStyle=gg; g2.beginPath(); g2.arc(px,py-h,hr*3,0,7); g2.fill();
        g2.fillStyle=on?'#2DD4BF':'rgba(94,234,212,'+(0.55+z*.4).toFixed(3)+')'; g2.beginPath(); g2.arc(px,py-h,hr,0,7); g2.fill();
        g2.fillStyle='rgba(255,255,255,'+(on?1:.8)+')'; g2.beginPath(); g2.arc(px,py-h,on?2.2:1.3,0,7); g2.fill();
        if(on){ g2.font='500 13px Geist, system-ui, sans-serif'; var tw=g2.measureText(j.n).width;
          var lx=px+14, ly=py-h-30; if(lx+tw+22>S) lx=px-tw-36; if(ly<4) ly=py+10;
          g2.fillStyle='rgba(13,22,40,.8)'; rrect(lx,ly,tw+20,26,13); g2.fill();
          g2.strokeStyle='rgba(94,234,212,.4)'; g2.lineWidth=1; g2.stroke();
          g2.fillStyle='#FFFFFF'; g2.fillText(j.n,lx+10,ly+17); } });
    }
    var target=null, vel=0, moved=0;
    function loop(t){ if(drag===null){ if(target!==null){ var dlt=((target-rot+Math.PI*3)%(Math.PI*2))-Math.PI; rot+=dlt*.08; if(Math.abs(dlt)<.002) target=null; }
      else if(Math.abs(vel)>0.0004){ rot+=vel; vel*=.95; }
      else if(!reduce){ rot+=0.0018; } } drawG(t||0); w.requestAnimationFrame(loop); }
    w.requestAnimationFrame(loop);
    function select(k){ var j=JUR.filter(function(x){return x.k===k;})[0]; if(!j) return; sel=k; target=-j.lon*Math.PI/180; vel=0;
      d.querySelectorAll('.jur').forEach(function(x){ x.setAttribute('aria-pressed', x.getAttribute('data-k')===k?'true':'false'); });
      var btn=d.querySelector('.jur[data-k="'+k+'"]');
      if(btn){ var p=btn.parentNode; if(p.scrollWidth>p.clientWidth){ p.scrollTo({left:btn.offsetLeft-p.clientWidth/2+btn.offsetWidth/2,behavior:reduce?'auto':'smooth'}); } }
      var info=d.getElementById('jur-info'); if(info){ info.innerHTML='<b style="color:#fff">'+j.law+'</b><br><span class="muted">'+j.d+'</span>';
        info.classList.remove('pop'); void info.offsetWidth; info.classList.add('pop'); } }
    function pinAt(e){ var r=gl.getBoundingClientRect(), S=gl.clientWidth, mx=e.clientX-r.left, my=e.clientY-r.top, best=null, bd=1e9;
      JUR.forEach(function(j){ var q=proj(j.lat*Math.PI/180,j.lon*Math.PI/180,S); if(q[2]<=0) return;
        var dd=(mx-q[0])*(mx-q[0])+(my-(q[1]-11))*(my-(q[1]-11)); if(dd<bd){ bd=dd; best=j; } });
      var th=Math.max(20,S*.055); return (best && bd<th*th)?best:null; }
    gl.addEventListener('pointerdown', function(e){ drag=e.clientX; moved=0; target=null; vel=0; gl.setPointerCapture(e.pointerId); });
    gl.addEventListener('pointermove', function(e){
      if(drag!==null){ var dx=e.clientX-drag; rot+=dx*.008; vel=dx*.008; moved+=Math.abs(dx); drag=e.clientX; }
      else { gl.style.cursor=pinAt(e)?'pointer':'grab'; } });
    gl.addEventListener('pointerup', function(e){
      if(drag!==null && moved<6){ var hit=pinAt(e); if(hit) select(hit.k); }
      drag=null; });
    gl.addEventListener('pointercancel', function(){ drag=null; });
    d.querySelectorAll('.jur').forEach(function(b){ b.addEventListener('click', function(){ select(b.getAttribute('data-k')); }); });
  }

  /* applicability assessment */
  var aform=d.getElementById('applic');
  if(aform){ aform.addEventListener('change', function(){
    var loc=aform.loc.value, users=aform.users.value, out=[];
    if(loc==='in'||users==='yes') out.push('India: DPDP Act, 2023 and DPDP Rules, 2025 (digital personal data processed in India, or offering goods/services to people in India)');
    if(loc==='eu'||users==='yes') out.push('EU/EEA: GDPR (establishment in the EU, or offering to / monitoring people in the EU)');
    if(loc==='ca'||users==='yes') out.push('California: CCPA/CPRA (for-profit businesses meeting revenue or volume thresholds)');
    if(aform.data.value==='children') out.push('Children\'s data: verifiable parental consent duties (DPDP s.9) and equivalent rules elsewhere');
    d.getElementById('applic-out').innerHTML = out.length? '<ul>'+out.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul>' : '<p class="muted">Choose your location and whether you serve users in other jurisdictions.</p>';
  }); }

  /* forms (demo only) */
  d.querySelectorAll('form[data-demo]').forEach(function(f){
    f.addEventListener('submit', function(e){ e.preventDefault(); var em=f.querySelector('input[type=email]'); var er=f.querySelector('.err');
      if(em && /@(gmail|yahoo|outlook|hotmail)\./i.test(em.value)){ if(er){ er.hidden=false; er.textContent='Use your work email so we can prepare a walkthrough for your organisation.'; } em.focus(); return; }
      if(er) er.hidden=true; var ok=f.querySelector('.ok-msg'); if(ok){ ok.hidden=false; ok.focus(); } });
  });

  /* copy buttons */
  d.querySelectorAll('[data-copy]').forEach(function(b){ b.addEventListener('click', function(){ var t=b.getAttribute('data-copy');
    var done=function(){ var o=b.textContent; b.textContent='Copied'; setTimeout(function(){ b.textContent=o; },1600); };
    if(navigator.clipboard){ navigator.clipboard.writeText(t).then(done,function(){}); } }); });
})();

/* ===== v3 interactions ===== */
(function(){
  var d=document, w=window;
  var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* feature tabs */
  d.querySelectorAll('[data-tabs]').forEach(function(t){
    var bs=t.querySelectorAll('[role=tab]'), ps=t.querySelectorAll('[role=tabpanel]');
    function sel(i, focus){ bs.forEach(function(b,k){ b.classList.toggle('on',k===i); b.setAttribute('aria-selected',k===i); b.tabIndex=k===i?0:-1; });
      ps.forEach(function(p,k){ p.classList.toggle('on',k===i); }); if(focus) bs[i].focus(); }
    bs.forEach(function(b,i){ b.addEventListener('click',function(){ sel(i); });
      b.addEventListener('keydown',function(e){ if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();sel((i+1)%bs.length,1);} if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();sel((i-1+bs.length)%bs.length,1);} }); });
    sel(0);
  });

  /* workflow stepper: auto-advances while visible, stops on interaction */
  d.querySelectorAll('[data-stepper]').forEach(function(s){
    var bs=s.querySelectorAll('.stp-b'), ps=s.querySelectorAll('.stp-p'), bar=s.querySelector('.stp-bar i'), cur=0, timer=null, manual=false, D=5000;
    function show(i){ cur=i; bs.forEach(function(b,k){ b.classList.toggle('on',k===i); b.setAttribute('aria-selected',k===i); });
      ps.forEach(function(p,k){ p.classList.toggle('on',k===i); });
      var l=bs[i].parentNode; if(l.scrollWidth>l.clientWidth){ l.scrollTo({left:bs[i].offsetLeft-20,behavior:reduce?'auto':'smooth'}); }
      if(!manual && !reduce){ s.classList.remove('run'); void bar.offsetWidth; s.style.setProperty('--stp-d',D+'ms'); s.classList.add('run'); } }
    function tick(){ clearTimeout(timer); if(manual||reduce) return; timer=setTimeout(function(){ show((cur+1)%bs.length); tick(); }, D); }
    bs.forEach(function(b,i){ b.addEventListener('click',function(){ manual=true; clearTimeout(timer); s.classList.remove('run'); bar.style.width='100%'; show(i); }); });
    if('IntersectionObserver' in w){ new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ if(!manual){ show(cur); tick(); } } else { clearTimeout(timer); } }); },{threshold:.4}).observe(s); }
  });

  /* sub-navigation: scroll spy + sticky state */
  var sn=d.querySelector('.subnav');
  if(sn){
    var links=[].slice.call(sn.querySelectorAll('.sn-links a')), secs=links.map(function(a){ return d.querySelector(a.getAttribute('href')); });
    function spy(){ var y=w.scrollY+160, on=-1; secs.forEach(function(s,i){ if(s && s.offsetTop<=y) on=i; });
      links.forEach(function(a,i){ a.classList.toggle('on',i===on); });
      if(on>=0){ var l=links[on], box=l.parentNode; if(l.offsetLeft<box.scrollLeft||l.offsetLeft+l.offsetWidth>box.scrollLeft+box.clientWidth) box.scrollLeft=l.offsetLeft-12; }
      sn.classList.toggle('stuck', sn.getBoundingClientRect().top<=70); }
    w.addEventListener('scroll',spy,{passive:true}); spy();
  }

  /* ===== Book-a-demo popup ===== */
  var ARW='<svg class="ico-arr" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var FOCUS=[["","Choose one"],["data-discovery","Data discovery"],["ropa","Data map and ROPA"],["consent-management","Consent management"],["cookie-consent","Cookie consent"],["vendor-management","Vendor risk"],["dsar","Data subject requests"],["breach-response","Incident management"],["dpia","DPIA and assessments"],["obligation-cockpit","Obligation Cockpit"],["privacy-assessments","Privacy assessments (service)"],["privacy-staffing","Privacy staffing (service)"],["virtual-dpo-ciso","Virtual DPO / CISO (service)"]];
  var here=window.__psekPage||(location.pathname.split('/').pop()||'').replace('.html','');
  function opts(a,selv){ return a.map(function(o){ return '<option value="'+o[0]+'"'+(o[0]===selv?' selected':'')+'>'+o[1]+'</option>'; }).join(''); }
  var html='<dialog class="dm" id="demo-modal" aria-labelledby="dm-t">'+
   '<div class="dm-in"><aside class="dm-side"><div class="dm-brand"><span class="dm-dot"></span>PrivacySEK</div>'+
   '<h2>See PrivacySEK on <em>your</em> data.</h2>'+
   '<p>A 30-minute walkthrough with a privacy specialist, shaped around your systems and priorities.</p>'+
   '<ul><li><b>Your priorities first</b><span>We open with the area you choose.</span></li><li><b>Your duties, mapped</b><span>DPDP, GDPR and CCPA obligations for your role.</span></li><li><b>Straight answers</b><span>Deployment, connectors, security and timelines.</span></li></ul>'+
   '<div class="dm-foot">We reply within one business day</div></aside>'+
   '<div class="dm-main"><button class="dm-x" type="button" aria-label="Close" data-dm-close><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>'+
   '<form class="dm-form" novalidate><div class="dm-head"><span class="dm-eb">Request a demo</span><h3 id="dm-t">Tell us a little about you</h3></div>'+
   '<div class="dm-grid">'+
   '<div class="dm-f"><label for="dm-n">Full name</label><input id="dm-n" name="name" required autocomplete="name"></div>'+
   '<div class="dm-f"><label for="dm-e">Work email</label><input id="dm-e" name="email" type="email" required autocomplete="email"></div>'+
   '<div class="dm-f"><label for="dm-p">Mobile number</label><div class="dm-ph"><select aria-label="Country code" name="cc"><option>+91</option><option>+1</option><option>+44</option><option>+971</option><option>+65</option><option>+61</option><option>+49</option><option>+33</option></select><input id="dm-p" name="mobile" type="tel" inputmode="tel" required autocomplete="tel-national" placeholder="98765 43210"></div></div>'+
   '<div class="dm-f"><label for="dm-c">Company</label><input id="dm-c" name="company" required autocomplete="organization"></div>'+
   '<div class="dm-f"><label for="dm-r">Your role</label><select id="dm-r" name="role"><option>DPO or privacy lead</option><option>CISO or security</option><option>Legal or compliance</option><option>CTO, IT or data</option><option>Founder or CXO</option><option>GCC leadership</option><option>Other</option></select></div>'+
   '<div class="dm-f"><label for="dm-s">Company size</label><select id="dm-s" name="size"><option>1 to 200</option><option selected>201 to 1,000</option><option>1,001 to 5,000</option><option>5,000+</option></select></div>'+
   '<div class="dm-f dm-wide"><label for="dm-i">What should we focus on?</label><select id="dm-i" name="focus">'+opts(FOCUS,here)+'</select></div>'+
   '<div class="dm-f dm-wide dm-msg"><label for="dm-m">Anything we should know? <i>Optional</i></label><input id="dm-m" name="msg" placeholder="Systems, deadlines, regulators"></div>'+
   '</div><small class="dm-err" hidden></small>'+
   '<button class="btn btn-p dm-sub" type="submit"><span>Request my demo</span> <span class="arr">'+ARW+'</span></button>'+
   '<p class="dm-legal">We use these details only to arrange your demo. <a href="/privacy-policy">Privacy Policy</a></p></form>'+
   '<div class="dm-ok" hidden tabindex="-1"><div class="dm-check"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24"/><path d="M15 27l7 7 15-16"/></svg></div><h3>Request received</h3><p>Thank you<b class="dm-who"></b>. A privacy specialist will contact you at <b class="dm-mail"></b> within one business day to set a time.</p><button class="btn btn-g" type="button" data-dm-close>Back to the page</button></div>'+
   '</div></div></dialog>';
  var holder=d.createElement('div'); holder.innerHTML=html; d.body.appendChild(holder.firstChild);
  var dm=d.getElementById('demo-modal'), form=dm.querySelector('.dm-form'), ok=dm.querySelector('.dm-ok'), err=dm.querySelector('.dm-err'), lastFocus=null;
  function open(e){ if(e){ e.preventDefault(); } lastFocus=d.activeElement;
    if(form.hidden){ form.reset(); form.hidden=false; ok.hidden=true; }
    if(typeof dm.showModal==='function'){ dm.showModal(); } else { dm.setAttribute('open',''); }
    d.documentElement.classList.add('dm-lock'); setTimeout(function(){ var n=dm.querySelector('#dm-n'); if(n && w.innerWidth>860) n.focus({preventScroll:true}); },60); }
  function close(){ dm.classList.add('closing'); setTimeout(function(){ dm.classList.remove('closing'); if(dm.close) dm.close(); else dm.removeAttribute('open'); d.documentElement.classList.remove('dm-lock'); if(lastFocus && lastFocus.focus) lastFocus.focus({preventScroll:true}); },220); }
  d.addEventListener('click',function(e){ var a=e.target.closest('a[href="/contact"],a[href="/contact"],[data-demo-open]');
    if(a && (a.classList.contains('btn') || a.hasAttribute('data-demo-open'))){ open(e); } });
  dm.querySelectorAll('[data-dm-close]').forEach(function(b){ b.addEventListener('click',close); });
  dm.addEventListener('cancel',function(e){ e.preventDefault(); close(); });
  dm.addEventListener('click',function(e){ if(e.target===dm) close(); });
  form.addEventListener('submit',function(e){ e.preventDefault(); var bad=null, msg='';
    form.querySelectorAll('[required]').forEach(function(i){ var v=i.value.trim(), f=!v;
      if(!f && i.type==='email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){ f=true; msg='Please enter a valid work email.'; }
      if(!f && i.type==='tel' && v.replace(/\D/g,'').length<7){ f=true; msg='Please enter a valid mobile number.'; }
      i.classList.toggle('bad',f); if(f && !bad) bad=i; });
    if(bad){ err.textContent = msg || 'Please fill in the highlighted fields.'; err.hidden=false; bad.focus({preventScroll:true}); return; }
    err.hidden=true;
    /* Lead capture: send new FormData(form) to your CRM or form endpoint here. */
    var sub=form.querySelector('.dm-sub'); sub.classList.add('busy'); sub.disabled=true;
    setTimeout(function(){ var n=form.querySelector('#dm-n').value.trim().split(' ')[0];
      dm.querySelector('.dm-who').textContent=n?', '+n:''; dm.querySelector('.dm-mail').textContent=form.querySelector('#dm-e').value.trim();
      form.hidden=true; ok.hidden=false; ok.focus({preventScroll:true}); sub.classList.remove('busy'); sub.disabled=false; },700); });
  form.querySelectorAll('input').forEach(function(i){ i.addEventListener('input',function(){ i.classList.remove('bad'); }); });
  if(location.hash==='#demo') open();
})();

/* ===== v3 services interactions ===== */
(function(){
  var d=document, w=window;
  /* assessment situation picker */
  var acs=d.querySelector('.acs');
  d.querySelectorAll('[data-sit]').forEach(function(b){ b.addEventListener('click',function(){
    var k=b.getAttribute('data-sit');
    d.querySelectorAll('[data-sit]').forEach(function(x){ x.classList.toggle('on',x===b); x.setAttribute('aria-pressed',x===b); });
    acs.classList.toggle('filtered',k!=='all');
    var first=null;
    acs.querySelectorAll('.ac').forEach(function(c){ var on=k!=='all' && (' '+c.getAttribute('data-tags')+' ').indexOf(' '+k+' ')>-1; c.classList.toggle('hl',on); if(on&&!first) first=c; });
    if(first && w.innerWidth<700){ first.scrollIntoView({behavior:'smooth',block:'center'}); }
  }); });
  /* role filter */
  d.querySelectorAll('[data-rf]').forEach(function(b){ b.addEventListener('click',function(){
    var k=b.getAttribute('data-rf');
    d.querySelectorAll('[data-rf]').forEach(function(x){ x.classList.toggle('on',x===b); x.setAttribute('aria-pressed',x===b); });
    d.querySelectorAll('.rc').forEach(function(c){ c.classList.toggle('off', k!=='all' && c.getAttribute('data-rk')!==k); });
  }); });
  /* count-up for stats */
  var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nums=d.querySelectorAll('.kst b');
  if(nums.length && 'IntersectionObserver' in w && !reduce){
    var io=new IntersectionObserver(function(es){ es.forEach(function(en){ if(!en.isIntersecting) return; io.unobserve(en.target);
      var el=en.target, txt=el.textContent, m=txt.match(/^([^\d]*)([\d.]+)(.*)$/); if(!m ) return;
      var end=parseFloat(m[2]), dec=(m[2].split('.')[1]||'').length, t0=null;
      function f(t){ if(!t0) t0=t; var p=Math.min(1,(t-t0)/1100), v=end*(1-Math.pow(1-p,3)); el.textContent=m[1]+v.toFixed(dec)+m[3]; if(p<1) requestAnimationFrame(f); }
      requestAnimationFrame(f); }); },{threshold:.6});
    nums.forEach(function(n){ io.observe(n); });
  }
})();

/* Hero explainer video card */
(function(){
  var card=document.querySelector('.vcard'); if(!card) return;
  var v=card.querySelector('.vc-video'),
      cover=card.querySelector('[data-vc=cover]'),
      resume=card.querySelector('[data-vc=resume]'),
      end=card.querySelector('[data-vc=end]'),
      replay=card.querySelector('[data-vc=replay]'),
      status=card.querySelector('[data-vc=status]'),
      row=card.querySelector('[data-vc=chapters]'),
      chaps=[].slice.call(card.querySelectorAll('.vc-ch')),
      trToggle=card.querySelector('[data-vc=trtoggle]'),
      trList=card.querySelector('[data-vc=transcript]'),
      trLines=trList?[].slice.call(trList.querySelectorAll('button[data-t]')):[];
  if(!v||!cover) return;
  var FALLBACK_DUR=60, idleStatus=status?status.textContent:'',
      reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      bounds=chaps.map(function(b){ return +b.getAttribute('data-t')||0; }),
      loaded=false, started=false, watched=false;
  function fmt(t){ t=Math.max(0,Math.floor(t)); return Math.floor(t/60)+':'+('0'+t%60).slice(-2); }
  function dur(){ return (v.duration&&isFinite(v.duration))?v.duration:FALLBACK_DUR; }
  function load(){
    if(loaded) return;
    var small=window.matchMedia&&window.matchMedia('(max-width: 640px)').matches;
    v.src=small?'/media/explainer-720.mp4':'/media/explainer-1080.mp4';
    v.load(); loaded=true;
  }
  function seekTo(t){
    if(v.readyState>=1){ v.currentTime=t; }
    else v.addEventListener('loadedmetadata',function h(){ v.removeEventListener('loadedmetadata',h); v.currentTime=t; });
  }
  function playFrom(t){
    load(); watched=false;
    if(end) end.hidden=true;
    cover.hidden=true; v.controls=true; v.muted=false;
    if(t!=null) seekTo(t);
    var p=v.play(); if(p&&p.catch) p.catch(function(){});
  }
  function setStatus(){
    if(!status) return;
    if(watched){ status.textContent='Watched'; status.classList.remove('live'); }
    else if(!started){ status.textContent=idleStatus; status.classList.remove('live'); }
    else if(v.paused){ status.textContent='Paused'; status.classList.remove('live'); }
    else { status.textContent='Playing · '+fmt(v.currentTime)+' / '+fmt(dur()); status.classList.add('live'); }
  }
  function update(){
    var t=v.currentTime||0, D=dur(), cur=-1, i;
    for(i=0;i<chaps.length;i++){
      var a=bounds[i], b=(i+1<bounds.length)?bounds[i+1]:D;
      var f=t<=a?0:(t>=b?1:(t-a)/(b-a));
      var bar=chaps[i].querySelector('.vc-ch-bar i'); if(bar) bar.style.width=(f*100)+'%';
      if(t>=a&&t<b) cur=i;
    }
    if(t>=D-0.25) cur=chaps.length-1;
    chaps.forEach(function(c,j){ c.classList.toggle('on',j===cur); });
    if(cur>-1&&row&&row.scrollWidth>row.clientWidth+4&&!v.paused){
      var el=chaps[cur], L=el.offsetLeft-row.offsetLeft, R=L+el.offsetWidth;
      if(L<row.scrollLeft+12||R>row.scrollLeft+row.clientWidth-12){
        if(row.scrollTo) row.scrollTo({left:Math.max(0,L-16),behavior:reduce?'auto':'smooth'});
        else row.scrollLeft=Math.max(0,L-16);
      }
    }
    var li=-1;
    for(i=0;i<trLines.length;i++){ if(t>=+trLines[i].getAttribute('data-t')) li=i; }
    trLines.forEach(function(b2,j){ b2.parentNode.classList.toggle('on',j===li&&started); });
    if(li>-1&&started&&trList&&!trList.hidden){
      var ln=trLines[li].parentNode, top=ln.offsetTop;
      if(top<trList.scrollTop||top+ln.offsetHeight>trList.scrollTop+trList.clientHeight)
        trList.scrollTop=top-trList.clientHeight/2+ln.offsetHeight/2;
    }
    setStatus();
  }
  cover.addEventListener('click',function(){ playFrom(0); });
  if(resume) resume.addEventListener('click',function(){ var p=v.play(); if(p&&p.catch) p.catch(function(){}); });
  if(replay) replay.addEventListener('click',function(){ playFrom(0); });
  chaps.forEach(function(b){ b.addEventListener('click',function(){ playFrom(+b.getAttribute('data-t')||0); }); });
  trLines.forEach(function(b){ b.addEventListener('click',function(){ playFrom(+b.getAttribute('data-t')||0); }); });
  if(trToggle&&trList) trToggle.addEventListener('click',function(){
    var open=trToggle.getAttribute('aria-expanded')==='true';
    trToggle.setAttribute('aria-expanded',open?'false':'true'); trList.hidden=open;
    if(!open) update();
  });
  v.addEventListener('play',function(){ started=true; watched=false; if(resume) resume.hidden=true; if(end) end.hidden=true; cover.hidden=true; update(); });
  v.addEventListener('pause',function(){ if(!v.ended&&resume) resume.hidden=!started; setStatus(); });
  v.addEventListener('ended',function(){ watched=true; if(resume) resume.hidden=true; if(end) end.hidden=false; update(); });
  v.addEventListener('timeupdate',update);
})();

/* Contact: preselect "Primary interest" from ?interest= query */
(function(){
  var s=document.getElementById('f-int'); if(!s||!window.URLSearchParams) return;
  var q=new URLSearchParams(location.search).get('interest'); if(!q) return;
  q=q.replace(/-/g,' ').toLowerCase();
  [].slice.call(s.options).some(function(o){
    if(o.textContent.trim().toLowerCase()===q){ s.value=o.value||o.textContent; return true; }
    return false;
  });
})();

/* Integrations: connector grid (metadata traces pulse through the gutters to the hub) */
(function(){
  var host=document.querySelector('[data-cst]'); if(!host) return;
  var dataEl=document.getElementById('cst-data'); if(!dataEl) return;
  var DATA; try{ DATA=JSON.parse(dataEl.textContent); }catch(e){ return; }
  var svg=host.querySelector('.cst-svg'),
      hub=host.querySelector('.cst-hub'),
      flash=host.querySelector('[data-cst-flash]'),
      info=document.querySelector('[data-cst-info]'),
      legend=[].slice.call(document.querySelectorAll('[data-cst-g]')),
      reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      NS='http://www.w3.org/2000/svg',
      TAGS=['PII','SPI','PAN','Email'], ti=0, popT=0, lastScan=0,
      grid=null, tiles=[], traces=[], raf=0, running=false, sel='';
  function mix(){
    var idx={}, out=[], more=true;
    while(more){ more=false;
      DATA.groups.forEach(function(g){
        var i=idx[g.k]||0;
        if(i<g.items.length){ out.push({n:g.items[i],g:g.k}); idx[g.k]=i+1; more=true; }
      });
    }
    return out;
  }
  function build(){
    if(grid&&grid.parentNode){ host.appendChild(hub); grid.parentNode.removeChild(grid); }
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    tiles=[]; traces=[];
    var W=host.clientWidth||1000;
    var cols=W>=1020?9:(W>=820?8:(W>=620?6:4));
    var rows=cols>=8?6:(cols===6?7:8);
    var hc=Math.ceil(cols/2)-1, hr=Math.ceil(rows/2)-1;
    grid=document.createElement('div');
    grid.className='cst-tiles';
    grid.style.gridTemplateColumns='repeat('+cols+',minmax(0,1fr))';
    var all=mix(), k=0;
    for(var r=0;r<rows;r++) for(var c=0;c<cols;c++){
      if(r>=hr&&r<hr+2&&c>=hc&&c<hc+2) continue;
      if(k>=all.length) continue;
      var t=all[k++];
      var el=document.createElement('button');
      el.type='button'; el.className='cst-tile'; el.textContent=t.n; el.title=t.n;
      el.style.gridColumn=c+1; el.style.gridRow=r+1;
      (function(g){ el.addEventListener('click',function(){ select(g); }); })(t.g);
      grid.appendChild(el);
      tiles.push({el:el,g:t.g});
    }
    hub.style.gridColumn=(hc+1)+' / span 2';
    hub.style.gridRow=(hr+1)+' / span 2';
    grid.appendChild(hub);
    host.appendChild(grid);
    requestAnimationFrame(wire);
  }
  function wire(){
    var hostR=host.getBoundingClientRect(); if(!hostR.width) return;
    var hubR=hub.getBoundingClientRect();
    var b={x:hubR.left-hostR.left+hubR.width/2, y:hubR.top-hostR.top+hubR.height/2};
    svg.setAttribute('viewBox','0 0 '+hostR.width+' '+hostR.height);
    for(var i=0;i<tiles.length;i++){
      if(i%4!==1) continue;
      var tR=tiles[i].el.getBoundingClientRect();
      var a={x:tR.left-hostR.left+tR.width/2, y:tR.top-hostR.top+tR.height/2};
      var d=Math.abs(b.x-a.x)>Math.abs(b.y-a.y)
        ? 'M'+a.x+' '+a.y+' L'+b.x+' '+a.y+' L'+b.x+' '+b.y
        : 'M'+a.x+' '+a.y+' L'+a.x+' '+b.y+' L'+b.x+' '+b.y;
      var p=document.createElementNS(NS,'path');
      p.setAttribute('d',d); p.setAttribute('class','cst-trace');
      svg.appendChild(p);
      var tr={el:p,g:tiles[i].g,len:p.getTotalLength(),t:Math.random(),v:.0016+Math.random()*.0012,pu:null};
      if(!reduce){
        var pu=document.createElementNS(NS,'circle');
        pu.setAttribute('r','2.6'); pu.setAttribute('class','cst-pulse');
        svg.appendChild(pu); tr.pu=pu;
      }
      traces.push(tr);
    }
    applySel();
  }
  function frame(ts){
    for(var i=0;i<traces.length;i++){
      var tr=traces[i]; if(!tr.pu) continue;
      tr.t+=tr.v;
      if(tr.t>=1){ tr.t=0; pop(tr.g); }
      var pt=tr.el.getPointAtLength(tr.t*tr.len);
      tr.pu.setAttribute('cx',pt.x); tr.pu.setAttribute('cy',pt.y);
      tr.pu.setAttribute('opacity',tr.t<.1?tr.t*10:(tr.t>.9?(1-tr.t)*10:1));
    }
    if(ts-lastScan>1400&&tiles.length){ lastScan=ts; scan(); }
    raf=requestAnimationFrame(frame);
  }
  function scan(){
    var t=tiles[Math.floor(Math.random()*tiles.length)];
    if(!t||(sel&&t.g!==sel)) return;
    t.el.classList.add('scan');
    setTimeout(function(){ t.el.classList.remove('scan'); },900);
  }
  function pop(g){
    if(!flash||(sel&&g!==sel)) return;
    var now=Date.now(); if(now-popT<1100) return; popT=now;
    flash.textContent=TAGS[ti++%TAGS.length];
    flash.classList.add('on');
    setTimeout(function(){ flash.classList.remove('on'); },700);
  }
  function applySel(){
    tiles.forEach(function(t){ t.el.classList.toggle('dim',!!sel&&t.g!==sel); });
    traces.forEach(function(tr){
      tr.el.classList.toggle('dim',!!sel&&tr.g!==sel);
      if(tr.pu) tr.pu.classList.toggle('dim',!!sel&&tr.g!==sel);
    });
    legend.forEach(function(b){
      var on=b.getAttribute('data-cst-g')===sel;
      b.classList.toggle('on',on); b.setAttribute('aria-pressed',on?'true':'false');
    });
    if(info){
      var g=null; DATA.groups.forEach(function(x){ if(x.k===sel) g=x; });
      info.textContent=g?g.d:info.getAttribute('data-default');
    }
  }
  function select(k){ sel=(sel===k)?'':k; applySel(); }
  if(info) info.setAttribute('data-default',info.textContent);
  legend.forEach(function(b){ b.addEventListener('click',function(){ select(b.getAttribute('data-cst-g')); }); });
  build();
  var rt; window.addEventListener('resize',function(){ clearTimeout(rt); rt=setTimeout(build,200); });
  if(!reduce){
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){ es.forEach(function(en){
        if(en.isIntersecting){ if(!running){ running=true; raf=requestAnimationFrame(frame); } }
        else if(running){ running=false; cancelAnimationFrame(raf); }
      }); },{threshold:.15});
      io.observe(host);
    } else { raf=requestAnimationFrame(frame); }
  }
})();

/* ===== DPIA: The Assessment Tool ===== */
(function(){
  var d=document, f=d.getElementById('dpia-tool'); if(!f) return;
  var ARW='<svg class="ico-arr" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var SEV={contact:1,hr:2,behav:2,ids:3,fin:3,loc:3,comms:3,cred:3,health:4,bio:4};
  var LBL={contact:'Contact details',ids:'Government IDs',fin:'Financial data',health:'Health data',bio:'Biometric data',loc:'Precise location',behav:'Online behaviour',comms:'Message or call content',hr:'HR records',cred:'Credentials',
    ai:'New technology or AI',auto:'Automated decisions',track:'Tracking or profiling',combine:'Combined datasets',proc:'Shared with processors',third:'Disclosed to other companies',xborder:'Transfer outside India',noret:'No retention period',children:"Children's data",disab:'Persons with disability'};
  var LIK={ai:1,auto:1,track:1,combine:.5,proc:.5,third:1,xborder:.5,noret:.5};
  var steps=f.querySelectorAll('.dt-step'), prog=d.querySelectorAll('.dt-prog li'), next=f.querySelector('[data-dt=next]'), back=f.querySelector('[data-dt=back]'), hint=f.querySelector('.dt-hint'), cur=0;
  function vals(n){ return [].slice.call(f.querySelectorAll('input[name='+n+']:checked')).map(function(i){return i.value;}); }
  function one(n){ var v=vals(n); return v[0]; }
  function has(a,x){ return a.indexOf(x)>-1; }
  function calc(){
    var data=vals('data'), ppl=vals('people'), ch=vals('char'), sf=vals('safe'), vol=+one('vol')||1, basis=one('basis'), sdf=one('sdf');
    var drivers=[];
    var sev=0; data.forEach(function(k){ if(SEV[k]>sev) sev=SEV[k]; if(SEV[k]>=3) drivers.push(LBL[k]); });
    if(!data.length) sev=0;
    if(has(ppl,'children')){ sev=Math.max(sev,3)+1; drivers.unshift(LBL.children); }
    if(has(ppl,'disab')){ sev+=.5; drivers.push(LBL.disab); }
    if(vol>=3) { sev+=.5; drivers.push(vol===4?'Over 10 lakh people':'1–10 lakh people'); }
    sev=Math.min(4,sev);
    var lik=1; ch.forEach(function(k){ lik+=LIK[k]||0; drivers.push(LBL[k]); });
    if(basis==='unsure'){ lik+=.5; drivers.push('Basis not decided'); }
    var mitig=Math.min(2, sf.length*.25); lik=Math.max(1,Math.min(4,lik-mitig));
    var started=data.length||ppl.length||ch.length;
    var score=started? Math.max(1,Math.round(Math.max(sev,1)*lik)) : 0;
    var level=score>=12?'Very high':score>=8?'High':score>=4?'Medium':'Low';
    // residual: all recommended safeguards in place
    var allSafe=10, rlik=Math.max(1,Math.min(4,(lik+mitig)-Math.min(2,allSafe*.25)));
    var rscore=started? Math.max(1,Math.round(Math.max(sev,1)*rlik)) : 0;
    var rlevel=rscore>=12?'Very high':rscore>=8?'High':rscore>=4?'Medium':'Low';
    // duties
    var duties=[];
    if(basis!=='legit') duties.push(['s.5, Rule 3','Itemised notice in clear and plain language, available in English or any Eighth Schedule language.']);
    if(basis==='consent'||basis==='unsure') duties.push(['s.6','Consent that is free, specific, informed, unconditional and unambiguous, and as easy to withdraw as to give.']);
    if(basis==='legit'||basis==='unsure') duties.push(['s.7','Record which listed legitimate use applies, and why.']);
    duties.push(['s.8(5), Rule 6','Reasonable security safeguards: encryption, obfuscation or masking, access control, logs kept for a year, backups.']);
    duties.push(['s.8(6), Rule 7','Breach intimation to the Board and affected people without delay, and a detailed report within 72 hours.']);
    duties.push(['s.8(7)','Erase data when the purpose is served or consent is withdrawn, unless the law requires retention.']);
    duties.push(['s.11–13, Rule 14','Access, correction and erasure rights, and grievances answered within 90 days.']);
    if(has(ch,'proc')) duties.push(['s.8(2)','Engage processors only under a valid contract, which should include security safeguards (Rule 6).']);
    if(has(ch,'xborder')) duties.push(['s.16','Transfers outside India must avoid countries the government restricts.']);
    if(has(ppl,'children')) duties.push(['s.9, Rule 10','Verifiable parental consent; no tracking, behavioural monitoring or targeted advertising directed at children.']);
    if(has(ppl,'disab')) duties.push(['s.9, Rule 11','Verifiable consent of the lawful guardian.']);
    if(sdf!=='no') duties.push(['s.10, Rule 13','For Significant Data Fiduciaries: DPO in India, independent data auditor, annual DPIA and audit.']);
    if(sdf!=='no' && (has(ch,'ai')||has(ch,'auto'))) duties.push(['Rule 13(3)','Due diligence that algorithmic software does not risk data principals\' rights.']);
    // mitigations
    var M=[], mod={notice:'consent-management',basis:'ropa',enc:'data-discovery',access:'data-discovery',logs:'obligation-cockpit',dpa:'vendor-management',breach:'breach-response',rights:'dsar',retention:'ropa',guardian:'consent-management'};
    var MT={notice:['Publish an itemised notice','List the data and purposes, how to withdraw and how to complain to the Board, in the languages your users read.'],
      basis:['Record the basis for each purpose','Document consent or the specific legitimate use relied on, in your processing register.'],
      enc:['Encrypt, mask or tokenise','Protect sensitive fields at rest and in transit, and mask them in non-production copies.'],
      access:['Restrict access by role','Grant least-privilege access and review it periodically.'],
      logs:['Keep access logs for a year','Log access to personal data and retain logs for at least one year to detect and investigate misuse.'],
      dpa:['Put processor contracts in place','Sign contracts that require security safeguards, breach notice and deletion on exit.'],
      breach:['Prepare the breach playbook','Assign roles and pre-draft the Board intimation, the 72-hour report and notices to people.'],
      rights:['Open a rights and grievance channel','Publish how to make requests and answer grievances within 90 days.'],
      retention:['Set retention and deletion','Define how long data is kept for this purpose and how it is erased.'],
      guardian:['Verify guardian consent','Verify a parent or lawful guardian before processing, and switch off tracking for under-18s.']};
    var need=['notice','basis','enc','access','logs','breach','rights','retention'];
    if(has(ch,'proc')||has(ch,'third')) need.push('dpa');
    if(has(ppl,'children')||has(ppl,'disab')) need.unshift('guardian');
    if(basis==='legit') need.splice(need.indexOf('notice'),1);
    need.forEach(function(k){ if(!has(sf,k)) M.push([MT[k][0],MT[k][1],mod[k]]); });
    if(has(ch,'ai')||has(ch,'auto')) M.splice(0,0,['Keep a human in the loop','Allow review of automated decisions with significant effect, and test models for unfair outcomes.','dpia']);
    if(has(ch,'xborder')) M.push(['Check transfer destinations','Confirm no destination is restricted under s.16, and record the transfer in your register.','ropa']);
    if(has(ch,'noret') && !has(sf,'retention')) {}
    var verdict = sdf==='yes' ? ['Mandatory','As a Significant Data Fiduciary, a DPIA and audit are required every twelve months.']
      : sdf==='maybe' && score>=4 ? ['Strongly recommended','If you are notified as an SDF, an annual DPIA becomes mandatory. Assess now.']
      : score>=8 ? ['Strongly recommended','The risk level justifies a full DPIA with recorded mitigations before or during processing.']
      : score>=4 ? ['Recommended','Document a proportionate assessment and track the gaps below.']
      : ['Screening record','Keep this screening on file and revisit it if the processing changes.'];
    return {sev:sev,lik:lik,score:score,level:level,rscore:rscore,rlevel:rlevel,drivers:drivers,duties:duties,M:M,verdict:verdict,started:started,name:(f.querySelector('#dt-name').value||'Untitled activity').trim()};
  }
  var gfg=d.getElementById('g-fg'), LEN=251.3; if(gfg){ gfg.style.strokeDasharray=LEN; gfg.style.strokeDashoffset=LEN; }
  function meter(){ var r=calc();
    d.getElementById('g-score').textContent=r.started? r.score : '–';
    d.getElementById('g-level').textContent=r.started? r.level+' risk' : 'Answer to begin';
    var lv=d.querySelector('.dt-meter'); lv.setAttribute('data-level', r.started? r.level.replace(' ','-').toLowerCase() : '');
    if(gfg) gfg.style.strokeDashoffset = LEN*(1-(r.started? r.score/16 : 0));
    d.getElementById('g-sev').style.width=(r.sev/4*100)+'%'; d.getElementById('g-lik').style.width=(r.started?(r.lik/4*100):0)+'%';
    var ul=d.getElementById('g-drivers'); ul.innerHTML = r.drivers.length? r.drivers.slice(0,6).map(function(x){return '<li>'+x+'</li>';}).join('') + (r.drivers.length>6?'<li class="muted">+'+(r.drivers.length-6)+' more</li>':'') : '<li class="muted">None yet</li>';
    return r; }
  f.addEventListener('change',meter); f.addEventListener('input',meter);
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function result(r, full){
    var top=r.drivers.slice(0,3), cls=r.level.replace(' ','-').toLowerCase();
    var h='<div class="dr-head"><div><span class="eyebrow">DPIA screening · '+new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})+'</span><h3>'+esc(r.name)+'</h3></div><span class="dr-badge '+cls+'">'+r.level+' risk · '+r.score+'/16</span></div>'+
      '<div class="dr-kpis"><div><small>Inherent risk</small><b class="'+cls+'">'+r.level+'</b><span>Score '+r.score+' of 16</span></div><div><small>Full DPIA</small><b>'+r.verdict[0]+'</b><span>'+r.verdict[1]+'</span></div><div><small>DPDP duties triggered</small><b>'+r.duties.length+'</b><span>Sections and Rules</span></div><div><small>Safeguards to add</small><b>'+r.M.length+'</b><span>Prioritised below</span></div></div>'+
      '<div class="dr-sec"><h4>Top risk drivers</h4>'+(top.length?'<ul class="dr-drv">'+top.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul>':'<p class="muted">No significant drivers selected.</p>')+'</div>';
    if(!full){
      h+='<div class="dr-gate"><div class="dr-blur" aria-hidden="true"><div class="dr-sec"><h4>DPDP duties triggered</h4><table class="ctbl"><tr><td class="ref">s.5, Rule 3</td><td>Itemised notice in clear and plain language…</td></tr><tr><td class="ref">s.8(5), Rule 6</td><td>Reasonable security safeguards…</td></tr><tr><td class="ref">s.8(6), Rule 7</td><td>Breach intimation…</td></tr></table></div><div class="dr-sec"><h4>Mitigation plan</h4><p>1. Encrypt, mask or tokenise…</p><p>2. Keep access logs for a year…</p></div></div>'+
        '<div class="dr-lock"><span class="eyebrow">Free full report</span><h4>Get the complete DPIA summary</h4><p>All '+r.duties.length+' DPDP duties with references, a '+r.M.length+'-step mitigation plan, residual risk after mitigation, and a PDF you can share.</p>'+
        '<div class="dr-form"><div class="dm-two"><div class="dm-f"><label for="dl-n">Full name</label><input id="dl-n" required autocomplete="name"></div><div class="dm-f"><label for="dl-e">Work email</label><input id="dl-e" type="email" required autocomplete="email"></div></div>'+
        '<div class="dm-two"><div class="dm-f"><label for="dl-c">Company</label><input id="dl-c" required autocomplete="organization"></div><div class="dm-f"><label for="dl-r">Role</label><select id="dl-r"><option>DPO / Privacy lead</option><option>CISO / Security</option><option>Legal / Compliance</option><option>CTO / IT / Data</option><option>Founder / CXO</option><option>Other</option></select></div></div>'+
        '<label class="dl-ok"><input type="checkbox" id="dl-talk"> I\'d like a privacy specialist to review this with me</label>'+
        '<button type="button" class="btn btn-p" data-dt="unlock">Unlock the full report <span class="arr">'+ARW+'</span></button><p class="dm-legal">We use these details to send your report and follow up. See our <a href="/privacy-policy">Privacy Policy</a>.</p></div></div></div>';
    } else {
      h+='<div class="dr-sec"><h4>DPDP duties triggered</h4><div class="ctbl-wrap"><table class="ctbl"><thead><tr><th>Reference</th><th>Duty</th></tr></thead><tbody>'+r.duties.map(function(x){return '<tr><td class="ref">'+x[0]+'</td><td>'+x[1]+'</td></tr>';}).join('')+'</tbody></table></div></div>'+
        '<div class="dr-sec"><h4>Prioritised mitigation plan</h4><ol class="dr-plan">'+(r.M.length? r.M.map(function(m){return '<li><div><b>'+m[0]+'</b><span>'+m[1]+'</span></div><a href="/platform/'+m[2]+'">How PrivacySEK helps '+ARW+'</a></li>';}).join('') : '<li><div><b>No gaps from your answers</b><span>Keep evidence that each safeguard works.</span></div></li>')+'</ol></div>'+
        '<div class="dr-sec dr-res"><div><small>Residual risk if the plan is completed</small><b class="'+r.rlevel.replace(' ','-').toLowerCase()+'">'+r.rlevel+'</b><span>Estimated score '+r.rscore+' of 16, down from '+r.score+'</span></div><div class="dr-act"><button type="button" class="btn btn-g" data-dt="print">Download PDF</button><a class="btn btn-p" href="/contact">Review it with an expert <span class="arr">'+ARW+'</span></a></div></div>'+
        '<p class="note">Indicative screening based on your answers, not legal advice. A full DPIA also covers necessity, proportionality, consultation and a recorded decision.</p>';
    }
    return h;
  }
  var res=d.getElementById('dt-result'), unlocked=false;
  function go(i){ cur=i; steps.forEach(function(s,k){ s.classList.toggle('on',k===i); });
    prog.forEach(function(p,k){ p.classList.toggle('on',k===i); p.classList.toggle('done',k<i); });
    back.hidden = i===0; next.hidden = i===4; hint.hidden = i===4;
    next.innerHTML = i===3 ? 'See my result <span class="arr">'+ARW+'</span>' : 'Continue <span class="arr">'+ARW+'</span>';
    if(i===4){ var r=meter(); res.innerHTML=result(r,unlocked); }
    var top=d.getElementById('tool').getBoundingClientRect().top+window.scrollY-90; if(window.scrollY>top) window.scrollTo({top:top,behavior:'smooth'}); }
  next.addEventListener('click',function(){
    if(cur===1 && !vals('data').length){ hint.textContent='Select at least one category of personal data.'; hint.classList.add('warn'); return; }
    hint.textContent='Your answers stay in your browser.'; hint.classList.remove('warn'); go(cur+1); });
  back.addEventListener('click',function(){ go(Math.max(0,cur-1)); });
  prog.forEach(function(p,k){ p.addEventListener('click',function(){ if(k<cur) go(k); }); });
  res.addEventListener('click',function(e){
    var b=e.target.closest('[data-dt]'); if(!b) return;
    if(b.getAttribute('data-dt')==='unlock'){
      var bad=null; ['dl-n','dl-e','dl-c'].forEach(function(id){ var i=d.getElementById(id), v=i.value.trim(), x=!v||(i.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)); i.classList.toggle('bad',x); if(x&&!bad) bad=i; });
      if(bad){ bad.focus(); return; }
      /* Lead capture: send {name,email,company,role,talk,activity,score} to your CRM endpoint here. */
      unlocked=true; res.innerHTML=result(calc(),true); res.classList.add('unlocked');
    }
    if(b.getAttribute('data-dt')==='print'){ window.print(); }
  });
  meter();
})();
