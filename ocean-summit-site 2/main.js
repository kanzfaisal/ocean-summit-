
/* ---- FORM SENDING ----
   Paste your Web3Forms access key below (free at web3forms.com, it's tied to the inbox that should get the quotes). */
var OS_FORM_KEY='PASTE_YOUR_WEB3FORMS_KEY_HERE';
window.osSend=function(form){
  var fd=new FormData(form),data={},svc=[];
  fd.forEach(function(v,k){if(k==='svc')svc.push(v);else if(v)data[k]=v;});
  if(svc.length)data.services=svc.join(', ');
  data.access_key=OS_FORM_KEY;
  data.subject='New quote request'+(data.name?' from '+data.name:'');
  data.from_name='Ocean Summit website';
  data.page=location.pathname;
  if(OS_FORM_KEY.indexOf('PASTE_')===0){console.warn('Form not connected yet: add your Web3Forms key in main.js',data);return Promise.resolve();}
  return fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
    .then(function(r){return r.json();}).then(function(j){if(!j.success)throw new Error(j.message||'failed');});
};
window.osFail=function(form){
  var p=form.querySelector('.send-err');
  if(!p){p=document.createElement('p');p.className='send-err';form.appendChild(p);}
  p.innerHTML='Something went wrong sending that. Please try again, or <a href="https://wa.me/96872624800" target="_blank" rel="noopener">message us on WhatsApp</a>.';
};

(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var d=document.getElementById('quote'),f=document.getElementById('qform'),done=document.getElementById('qdone');
  function open(svc){f.hidden=false;done.hidden=true;f.reset();
    if(svc){var c=f.querySelector('input[value="'+svc+'"]');if(c)c.checked=true;}
    if(d.showModal){d.showModal();}else{d.setAttribute('open','');}}
  function close(){if(d.close){d.close();}else{d.removeAttribute('open');}}
  document.querySelectorAll('[data-open]').forEach(function(b){b.addEventListener('click',function(){open(b.getAttribute('data-svc'));});});
  document.querySelectorAll('[data-close]').forEach(function(b){b.addEventListener('click',close);});
  f.addEventListener('submit',function(e){e.preventDefault();if(!f.reportValidity())return;
    var sb=f.querySelector('button[type=submit]');if(sb)sb.disabled=true;
    window.osSend(f).then(function(){f.hidden=true;done.hidden=false;}).catch(function(){window.osFail(f);}).then(function(){if(sb)sb.disabled=false;});});

  addEventListener('scroll',function(){document.querySelectorAll('.top').forEach(function(t){t.classList.toggle('scrolled',scrollY>8);});},{passive:true});

  function count(el){var to=+el.getAttribute('data-count'),t0=null;if(reduce){el.textContent=to;return;}
    function step(t){if(!t0)t0=t;var p=Math.min((t-t0)/1200,1);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step);}requestAnimationFrame(step);}
  var els=document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');e.target.querySelectorAll('[data-count]').forEach(count);io.unobserve(e.target);}});},{threshold:.15});
    els.forEach(function(el){io.observe(el);});
  }else{els.forEach(function(el){el.classList.add('on');});document.querySelectorAll('[data-count]').forEach(count);}

  var tabs=[].slice.call(document.querySelectorAll('.tab')),panels=[].slice.call(document.querySelectorAll('.panel')),bar=document.querySelector('.bar-prog i'),cur=0,timer=null,auto=!reduce;
  function show(i){cur=i;tabs.forEach(function(t,k){t.setAttribute('aria-selected',k===i?'true':'false');});
    panels.forEach(function(p,k){p.classList.toggle('on',k===i);p.setAttribute('aria-hidden',k===i?'false':'true');});
    bar.classList.remove('run');void bar.offsetWidth;if(auto)bar.classList.add('run');
    clearTimeout(timer);if(auto)timer=setTimeout(function(){show((cur+1)%tabs.length);},5000);}
  tabs.forEach(function(t,k){t.addEventListener('click',function(){auto=false;show(k);});});
  var stage=document.querySelector('.stage');
  if(stage&&'IntersectionObserver' in window&&auto){new IntersectionObserver(function(es,o){if(es[0].isIntersecting){show(0);o.disconnect();}},{threshold:.4}).observe(stage);}
})();

(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||matchMedia('(hover: none)').matches)return;
  document.querySelectorAll('.hero-vis').forEach(function(v){
    var fl=v.querySelectorAll('[data-depth]'),img=v.querySelector('.media img');
    v.parentElement.parentElement.addEventListener('mousemove',function(e){var r=v.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)/r.width,y=(e.clientY-r.top-r.height/2)/r.height;
      fl.forEach(function(f){var d=+f.dataset.depth;f.style.transform='translate('+(-x*d)+'px,'+(-y*d)+'px)';});});
  });
})();
(function(){
  // services dropdown
  document.querySelectorAll('.dd').forEach(function(dd){var b=dd.querySelector('button');
    b.addEventListener('click',function(e){e.stopPropagation();var o=dd.classList.toggle('open');b.setAttribute('aria-expanded',o);});});
  document.addEventListener('click',function(){document.querySelectorAll('.dd.open').forEach(function(d){d.classList.remove('open');d.querySelector('button').setAttribute('aria-expanded','false');});});
  // mobile menu
  document.querySelectorAll('.burger').forEach(function(bu){var mn=(bu.closest('.page')||document).querySelector('.mnav');if(!mn)return;
    bu.addEventListener('click',function(){var o=mn.classList.toggle('open');bu.setAttribute('aria-expanded',o);});
    mn.addEventListener('click',function(e){if(e.target.closest('a,button')){mn.classList.remove('open');bu.setAttribute('aria-expanded','false');}});});
  // contact page form
  var cf=document.getElementById('cform');
  if(cf&&!cf.classList.contains('wiz')){cf.addEventListener('submit',function(e){e.preventDefault();if(!cf.reportValidity())return;
    // TODO at deploy: send to the company inbox
    [].slice.call(cf.children).forEach(function(c){if(c.id!=='cdone')c.hidden=true;});document.getElementById('cdone').hidden=false;});}
})();

(function(){
  if(!('IntersectionObserver' in window))return;
  var bands=document.querySelectorAll('.dark-band'),on=new Set();
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.intersectionRatio>=.35)on.add(e.target);else on.delete(e.target);});
    var vis=[].some.call(bands,function(b){return on.has(b)&&!b.closest('.page[hidden]');});
    document.body.classList.toggle('go-dark',vis);},{threshold:[0,.35,.6]});
  bands.forEach(function(b){io.observe(b);});
  addEventListener('hashchange',function(){document.body.classList.remove('go-dark');on.clear();});
})();

(function(){
  var secs=document.querySelectorAll('.how-s');if(!secs.length)return;
  function upd(){secs.forEach(function(s){
    if(!s.offsetParent&&s.closest('.page[hidden]'))return;
    var r=s.getBoundingClientRect(),vh=innerHeight,tot=s.offsetHeight-vh;
    var p=Math.min(1,Math.max(0,(-r.top)/(tot||1))),n=4,st=Math.min(n-1,Math.floor(p*n*0.999));
    if(s.dataset.step!=String(st)){s.dataset.step=st;
      s.querySelectorAll('.tl2 li').forEach(function(li,i){li.classList.toggle('on',i===st);li.classList.toggle('past',i<st);});
      s.querySelectorAll('.hi').forEach(function(h,i){h.classList.toggle('on',i===st);});
      var c=s.querySelector('.how-count b');if(c)c.textContent='0'+(st+1);}
    var ol=s.querySelector('.tl2'),f=s.querySelector('.tl2-fill');
    if(ol&&f){var lis=ol.querySelectorAll('li'),a=lis[0],b=lis[lis.length-1];
      var full=(b.offsetTop+22)-(a.offsetTop+22);f.style.height=Math.max(0,Math.min(full,full*p*1.05))+'px';}
  });}
  addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);addEventListener('hashchange',function(){setTimeout(upd,50);});upd();
})();

(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,lenis=null;
  function initLenis(){
    if(reduce||!window.Lenis)return;
    try{lenis=new Lenis({duration:1.15,easing:function(t){return Math.min(1,1.001-Math.pow(2,-10*t));},smoothWheel:true});
      window.__lenis=lenis;
      (function raf(t){lenis.raf(t);requestAnimationFrame(raf);})(performance.now());
      document.addEventListener('click',function(e){var a=e.target.closest('a[href^="#"]');if(!a)return;var h=a.getAttribute('href');
        if(h.length>1&&h.charAt(1)!=='/'){var el=document.querySelector(h);if(el){e.preventDefault();lenis.scrollTo(el,{offset:-90});}}});
    }catch(err){lenis=null;}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initLenis);else initLenis();
  // pause smooth scroll while popups are open
  var d=document.getElementById('quote');
  if(d){d.setAttribute('data-lenis-prevent','');
    new MutationObserver(function(){if(!lenis)return;d.open?lenis.stop():lenis.start();}).observe(d,{attributes:true,attributeFilter:['open']});
    d.addEventListener('click',function(e){if(e.target===d){d.close?d.close():d.removeAttribute('open');}});
    document.addEventListener('click',function(e){if(e.target.closest('[data-open]'))setTimeout(function(){var f=d.querySelector('input');if(f&&d.open)f.focus({preventScroll:true});},60);});
  }
  // little "sending" moment on submit
  document.addEventListener('submit',function(e){var b=e.target.querySelector('button[type=submit]');if(!b||!e.target.checkValidity())return;
    b.classList.add('loading');setTimeout(function(){b.classList.remove('loading');},700);},true);
  // progress bar + mobile quote bar + hide header on scroll down
  var bar=document.createElement('div');bar.className='sprog';document.body.appendChild(bar);
  var mq=document.createElement('div');mq.className='mq';mq.innerHTML='<button class="btn" data-open>Get a free quote <span class="arr"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button>';
  document.body.appendChild(mq);
  mq.querySelector('button').addEventListener('click',function(){var dd=document.getElementById('quote');if(!dd)return;var f=dd.querySelector('form');f.hidden=false;var dn=dd.querySelector('.done');if(dn)dn.hidden=true;dd.showModal?dd.showModal():dd.setAttribute('open','');});
  var last=scrollY,ticking=false;
  function onScroll(){
    var y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
    bar.style.transform='scaleX('+(h>0?Math.min(1,y/h):0)+')';
    var menuOpen=document.querySelector('.mnav.open,.dd.open');
    document.querySelectorAll('.top.hd').forEach(function(t){
      if(t.closest('.page[hidden]'))return;
      t.classList.toggle('hide',!menuOpen&&y>last+4&&y>260);
      if(y<last-4||y<=260)t.classList.remove('hide');});
    var page=document.querySelector('.page:not([hidden])')||document;
    var onContact=!!page.querySelector('#cform');
    var end=false;page.querySelectorAll('.cta-lean,.foot2').forEach(function(s){var r=s.getBoundingClientRect();if(r.top<innerHeight)end=true;});
    mq.classList.toggle('show',!onContact&&y>innerHeight*.7&&!end);
    last=y;ticking=false;}
  addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll);}},{passive:true});
  addEventListener('hashchange',function(){last=0;setTimeout(onScroll,60);});
  onScroll();
})();

(function(){
  document.querySelectorAll('form.wiz').forEach(function(f){
    var S=f.querySelectorAll('.wz-s'),lab=f.querySelectorAll('.wz-steps span'),bar=f.querySelector('.wz-bar i'),err=f.querySelector('.wz-err'),i=0;
    function go(n){i=n;S.forEach(function(s,k){s.classList.toggle('on',k===i);});lab.forEach(function(l,k){l.classList.toggle('on',k<=i);});
      bar.style.width=((i+1)/S.length*100)+'%';var fi=S[i].querySelector('input:not([type=checkbox]),textarea');if(fi&&i>0)fi.focus({preventScroll:true});}
    function ok(n){if(n===0){var any=f.querySelector('input[name=svc]:checked');if(err)err.hidden=!!any;return !!any;}
      var bad=null;S[n].querySelectorAll('input[required]').forEach(function(x){if(!bad&&!x.checkValidity())bad=x;});if(bad){bad.reportValidity();return false;}return true;}
    f.querySelectorAll('.wz-next').forEach(function(b){b.addEventListener('click',function(){if(ok(i))go(Math.min(S.length-1,i+1));});});
    f.querySelectorAll('.wz-back').forEach(function(b){b.addEventListener('click',function(){go(Math.max(0,i-1));});});
    f.addEventListener('change',function(e){if(e.target.name==='svc'&&err)err.hidden=true;});
    f.addEventListener('submit',function(e){e.preventDefault();e.stopImmediatePropagation();if(!ok(2))return;
      var sb=f.querySelector('button[type=submit]');if(sb)sb.disabled=true;
      window.osSend(f).then(function(){S.forEach(function(s){s.classList.remove('on');});f.querySelector('.wz-top').hidden=true;f.querySelector('#cdone').hidden=false;}).catch(function(){window.osFail(f);}).then(function(){if(sb)sb.disabled=false;});},true);
  });
})();
