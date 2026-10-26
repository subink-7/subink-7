/* ============================================================
   Subin's Dev Quest — Retro Pixel Portfolio
   Game mechanics: XP bar, sound system, quest filters, nav
   ============================================================ */

(function(){
  'use strict';

  // ---------- Audio context (user gesture required) ----------
  let audioCtx = null;
  let soundEnabled = true;
  const muteBtn = document.getElementById('muteBtn');
  const muteStatus = document.getElementById('muteStatus');
  const audioOverlay = document.getElementById('audioOverlay');

  function initAudio(){
    if(!audioCtx){
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new Ctx();
    }
    if(audioCtx.state === 'suspended'){
      audioCtx.resume();
    }
  }

  function playTone(type, freq, duration, vol = 0.08){
    if(!soundEnabled || !audioCtx) return;
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + duration);
  }

  function playHover(){ playTone('square', 400, 0.05, 0.03); }
  function playClick(){ playTone('square', 600, 0.08, 0.06); }
  function playLevelUp(){
    playTone('square', 520, 0.1);
    setTimeout(()=> playTone('square', 780, 0.15), 80);
    setTimeout(()=> playTone('square', 1040, 0.25), 160);
  }

  // Mute toggle
  muteBtn.addEventListener('click', ()=>{
    soundEnabled = !soundEnabled;
    muteBtn.classList.toggle('muted', !soundEnabled);
    muteBtn.textContent = soundEnabled ? '🔊' : '🔇';
    muteStatus.textContent = soundEnabled ? '🔊' : '🔇';
    playClick();
  });

  // Boot overlay: wait for any key then remove
  document.addEventListener('keydown', ()=>{
    initAudio();
    audioOverlay.classList.add('hidden');
    playClick();
  }, {once: true});

  // ---------- Hover sound on interactive elements ----------
  document.addEventListener('mouseover', (e)=>{
    if(!soundEnabled) return;
    const target = e.target;
    if(target.matches('a, button, .filter-btn, .btn-pixel, .mute-btn, .social-btn')){
      playHover();
    }
  }, true);

  // ---------- Smooth scroll for anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener('click', (e)=>{
      const href = link.getAttribute('href');
      if(href.length > 1 && document.querySelector(href)){
        e.preventDefault();
        playClick();
        document.querySelector(href).scrollIntoView({behavior:'smooth'});
      }
    });
  });

  // ---------- XP bar on scroll ----------
  const xpFill = document.getElementById('xpFill');
  const xpText = document.getElementById('xpText');
  const charLevel = document.getElementById('charLevel');

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  let lastLevel = 1;

  function updateXP(){
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    xpFill.style.width = scrollPct + '%';
    xpText.textContent = `LEVEL ${lastLevel} — ${Math.round(scrollPct)}%`;

    // Level thresholds for flavor
    const level = Math.floor(scrollPct / 25) + 1;
    if(level !== lastLevel && level <= 4){
      lastLevel = level;
      charLevel.textContent = level;
      playLevelUp();
    }
  }

  window.addEventListener('scroll', updateXP, {passive:true});
  window.addEventListener('load', updateXP);

  // ---------- Quest filter buttons ----------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const questCards = document.querySelectorAll('.quest-card');

  filterBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      playClick();
      filterBtns.forEach(b=> b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      questCards.forEach(card=>{
        if(filter === 'all' || card.getAttribute('data-filter') === filter){
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ---------- Header scroll effect ----------
  const header = document.getElementById('header');
  let lastScroll = 0;
  window.addEventListener('scroll', ()=>{
    const st = window.pageYOffset;
    if(st > 100){
      header.style.borderBottomWidth = '4px';
    } else {
      header.style.borderBottomWidth = '3px';
    }
    lastScroll = st;
  }, {passive:true});

  // ---------- Disable placeholder links (no console spam) ----------
  document.querySelectorAll('a[href="#"].disabled, .btn-pixel.disabled').forEach(el=>{
    el.addEventListener('click', (e)=> e.preventDefault());
  });

  // Reveal audio overlay initially
  audioOverlay.classList.remove('hidden');

})();
