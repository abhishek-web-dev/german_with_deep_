/* GermanWithDeep — main.js */

// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if(navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
}, {passive:true});

// Hamburger
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if(hamburger && navLinks){
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }));
}

// Scroll reveal
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e,i) => {
    if(e.isIntersecting){
      setTimeout(() => e.target.classList.add('visible'), i * 75);
      revealObs.unobserve(e.target);
    }
  });
}, {threshold:0.1});
document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => revealObs.observe(el));

// Counter animation
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){
      const el = e.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      let curr = 0; const steps = 60;
      const timer = setInterval(() => {
        curr += target/steps;
        if(curr >= target){ curr = target; clearInterval(timer); }
        el.textContent = Math.floor(curr) + suffix;
      }, 2000/steps);
      counterObs.unobserve(el);
    }
  });
}, {threshold:0.5});
document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

// Gallery tabs
document.querySelectorAll('.gtab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.gtab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.gallery-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById(tab.dataset.panel);
    if(panel) panel.classList.add('active');
  });
});

// Typed text effect
const typedEl = document.getElementById('typedText');
if(typedEl){
  const words = ['German','Deutsch','Die Sprache','Your Future'];
  let wi=0, ci=0, del=false;
  function type(){
    const w = words[wi];
    typedEl.textContent = del ? w.substring(0,ci--) : w.substring(0,ci++);
    let delay = del ? 55 : 100;
    if(!del && ci === w.length+1){ delay=1800; del=true; }
    if(del && ci===0){ del=false; wi=(wi+1)%words.length; delay=280; }
    setTimeout(type,delay);
  }
  type();
}

// Contact form
const contactForm = document.getElementById('contactForm');
if(contactForm){
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    btn.textContent = 'Sending…'; btn.disabled = true;
    setTimeout(() => {
      const s = document.getElementById('formSuccess');
      if(s) s.style.display='block';
      contactForm.reset();
      btn.textContent = 'Send Application →';
      btn.disabled = false;
    }, 1500);
  });
}

// Active nav
const pg = window.location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  a.classList.toggle('active', a.getAttribute('href')===pg);
});

/* ── RESULTS SLIDER ─────────────────────────────────── */
(function () {
  const track   = document.getElementById('resultsTrack');
  const prevBtn = document.getElementById('rsPrev');
  const nextBtn = document.getElementById('rsNext');
  const dotsEl  = document.getElementById('rsDots');
  if (!track) return;

  /* How many slides visible at once */
  function perView() {
    return window.innerWidth >= 900 ? 3 : window.innerWidth >= 600 ? 2 : 1;
  }

  const slides = track.querySelectorAll('.result-slide');
  const total  = slides.length;
  let current  = 0;
  let timer;

  /* Build dots */
  function buildDots() {
    dotsEl.innerHTML = '';
    const pages = Math.ceil(total / perView());
    for (let i = 0; i < pages; i++) {
      const d = document.createElement('button');
      d.className = 'rs-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      d.addEventListener('click', () => goTo(i * perView()));
      dotsEl.appendChild(d);
    }
  }

  function updateDots() {
    const dots = dotsEl.querySelectorAll('.rs-dot');
    const page = Math.floor(current / perView());
    dots.forEach((d, i) => d.classList.toggle('active', i === page));
  }

  function goTo(idx) {
    const maxIdx = total - perView();
    current = Math.max(0, Math.min(idx, maxIdx));
    const pct = (100 / perView()) * current;
    track.style.transform = `translateX(-${pct}%)`;
    updateDots();
  }

  function next() { goTo(current + perView() >= total ? 0 : current + 1); }
  function prev() { goTo(current === 0 ? total - perView() : current - 1); }

  function startAuto() { timer = setInterval(next, 2800); }
  function stopAuto()  { clearInterval(timer); }

  nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
  prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });

  /* Touch / swipe support */
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; stopAuto(); }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    startAuto();
  });

  /* Pause on hover */
  track.closest('.results-slider-outer').addEventListener('mouseenter', stopAuto);
  track.closest('.results-slider-outer').addEventListener('mouseleave', startAuto);

  /* Re-init on resize */
  window.addEventListener('resize', () => { buildDots(); goTo(0); });

  buildDots();
  startAuto();
})();
