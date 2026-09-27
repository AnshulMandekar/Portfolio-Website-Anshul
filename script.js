document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const container = document.querySelector('.slides-container');
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot-wrapper');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const currentNumEl = document.getElementById('current-num');
  const modeToggleBtn = document.getElementById('mode-toggle');
  const progressFill = document.getElementById('progress-fill');

  let activeIndex = 0;
  let lastAnnouncedIndex = -1;
  const totalSlides = slides.length;
  let isPresentationMode = true;

  // Overlays (command palette, lightbox, mini-game) add a lock here so the
  // slide keyboard shortcuts stay out of their way while they are open.
  const keyLocks = new Set();

  // Initialize slides indexing
  slides.forEach((slide, idx) => {
    slide.dataset.slideIndex = idx;
    slide.setAttribute('id', `slide-${idx}`);
  });

  // Function to scroll to a specific slide index
  function scrollToSlide(index) {
    if (index < 0 || index >= totalSlides) return;

    const targetSlide = document.getElementById(`slide-${index}`);
    if (isPresentationMode) {
      targetSlide.scrollIntoView({ behavior: 'smooth' });
    } else {
      // In document mode, scroll with an offset for the header if needed
      const headerOffset = 80;
      const elementPosition = targetSlide.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    activeIndex = index;
    updateUI(activeIndex);
  }

  // Update Dots, Arrows, and Counter
  function updateUI(index) {
    // Update active class on slides
    slides.forEach((slide, idx) => {
      if (idx === index) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update active class on dots
    dots.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update presentation control buttons
    if (prevBtn && nextBtn && currentNumEl) {
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === totalSlides - 1;

      // Update presentation counter (format like 01 / 11)
      const currentFormatted = String(index + 1).padStart(2, '0');
      const totalFormatted = String(totalSlides).padStart(2, '0');
      currentNumEl.innerHTML = `<span>${currentFormatted}</span> / ${totalFormatted}`;
    }

    // Top progress bar
    if (progressFill) {
      progressFill.style.width = `${(index / Math.max(1, totalSlides - 1)) * 100}%`;
    }

    // Let the interactive modules know which slide is now on screen
    if (index !== lastAnnouncedIndex) {
      lastAnnouncedIndex = index;
      document.dispatchEvent(new CustomEvent('slidechange', { detail: { index, slide: slides[index] } }));
    }
  }

  // Set up Intersection Observer for scrolling detection in Presentation Mode
  const observerOptions = {
    root: isPresentationMode ? container : null,
    threshold: 0.45 // Trigger when 45% of the slide is in view
  };

  const observer = new IntersectionObserver((entries) => {
    if (!isPresentationMode) return;

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = parseInt(entry.target.dataset.slideIndex, 10);
        activeIndex = index;
        updateUI(activeIndex);
      }
    });
  }, observerOptions);

  // Start observing slides
  slides.forEach(slide => observer.observe(slide));

  // Arrow Nav Clicks
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (activeIndex > 0) scrollToSlide(activeIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (activeIndex < totalSlides - 1) scrollToSlide(activeIndex + 1);
    });
  }

  // Navigation Dots Clicks
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      scrollToSlide(idx);
    });
  });

  // Mouse clicks shouldn't leave focus parked on a button, otherwise the
  // next Space press re-activates it instead of advancing the slides.
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button, [role="button"]');
    if (btn && e.detail > 0 && !btn.closest('.cmdk, .lightbox')) btn.blur();
  });

  // Keyboard Event Navigation (Only in Presentation Mode)
  window.addEventListener('keydown', (e) => {
    if (!isPresentationMode) return;
    if (keyLocks.size > 0) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    // Don't intercept if user is typing in form inputs
    const active = document.activeElement;
    if (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA') return;
    // Let Space/Enter activate a focused button or link
    if (e.key === ' ' && active.closest('button, a, [role="button"]')) return;

    // Prevent scrolling default behavior for arrow keys & space inside presentation mode
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
      if (activeIndex < totalSlides - 1) scrollToSlide(activeIndex + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
      if (activeIndex > 0) scrollToSlide(activeIndex - 1);
    } else if (e.key === 'Home') {
      scrollToSlide(0);
    } else if (e.key === 'End') {
      scrollToSlide(totalSlides - 1);
    }
  });

  // Presentation Mode vs Document Mode Toggling
  if (modeToggleBtn) {
    modeToggleBtn.addEventListener('click', () => {
      isPresentationMode = !isPresentationMode;

      const sidebar = document.querySelector('.sidebar-dots');
      const presControls = document.querySelector('.pres-controls');

      if (isPresentationMode) {
        body.classList.remove('document-mode');
        body.classList.add('presentation-mode');

        if (sidebar) sidebar.classList.remove('hidden');
        if (presControls) presControls.classList.remove('hidden');

        modeToggleBtn.innerHTML = '<i class="fas fa-file-alt"></i> Document View';

        // Relayout and snap to current active slide
        setTimeout(() => {
          scrollToSlide(activeIndex);
        }, 100);
      } else {
        body.classList.remove('presentation-mode');
        body.classList.add('document-mode');

        if (sidebar) sidebar.classList.add('hidden');
        if (presControls) presControls.classList.add('hidden');

        modeToggleBtn.innerHTML = '<i class="fas fa-play"></i> Present Mode';

        // Remove transitions style during window scroll to prevent layout jumpiness
        scrollToSlide(activeIndex);
      }
    });
  }


  // Wire up the interactive layer before the first slidechange fires
  initInteractiveLayer({
    slides,
    dots,
    container,
    keyLocks,
    scrollToSlide,
    get activeIndex() { return activeIndex; }
  });

  // Set initial UI state
  updateUI(activeIndex);

  // ── Touch Swipe Support (Mobile) ──────────────────────────────
  // Allows mobile users to swipe up/down to navigate slides.
  let touchStartX = 0;
  let touchStartY = 0;
  const SWIPE_THRESHOLD = 50; // minimum px to count as a swipe

  container.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    if (!isPresentationMode) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;

    // Only treat as vertical swipe if the vertical component dominates
    if (Math.abs(deltaY) < SWIPE_THRESHOLD) return;
    if (Math.abs(deltaX) > Math.abs(deltaY)) return;

    if (deltaY < 0) {
      // Swiped UP → go to next slide
      if (activeIndex < totalSlides - 1) scrollToSlide(activeIndex + 1);
    } else {
      // Swiped DOWN → go to previous slide
      if (activeIndex > 0) scrollToSlide(activeIndex - 1);
    }
  }, { passive: true });
  // ──────────────────────────────────────────────────────────────
});

// Project Image Slider Logic (Multi-image support)
window.moveProjectSlider = function(sliderId, direction) {
  const slider = document.getElementById(sliderId);
  if (!slider) return;
  const slides = slider.querySelectorAll('.slide-img');
  const dots = slider.querySelectorAll('.slider-dot');
  let activeIdx = 0;

  slides.forEach((slide, idx) => {
    if (slide.classList.contains('active')) {
      activeIdx = idx;
    }
  });

  let newIdx = activeIdx + direction;
  if (newIdx < 0) newIdx = slides.length - 1;
  if (newIdx >= slides.length) newIdx = 0;

  setProjectSlider(sliderId, newIdx);
};

window.setProjectSlider = function(sliderId, targetIdx) {
  const slider = document.getElementById(sliderId);
  if (!slider) return;
  const slides = slider.querySelectorAll('.slide-img');
  const dots = slider.querySelectorAll('.slider-dot');

  slides.forEach((slide, idx) => {
    if (idx === targetIdx) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });

  dots.forEach((dot, idx) => {
    if (idx === targetIdx) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  slider.dispatchEvent(new CustomEvent('sliderchange', { detail: { index: targetIdx } }));
};


// ═══════════════════════════════════════════════════════════════
//  INTERACTIVE LAYER
// ═══════════════════════════════════════════════════════════════

const EMAIL = 'anshulmandekar21@gmail.com';

function initInteractiveLayer(app) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  initCursorSpotlight(finePointer, reduceMotion);
  initHeroCanvas(app, reduceMotion);
  initTypewriter(reduceMotion);
  initCopyButtons();
  initCounters(app, reduceMotion);
  initCardEffects(finePointer, reduceMotion);
  initStagger(app, reduceMotion);
  initMagnetic(finePointer, reduceMotion);
  initSkillLinks(app);
  initSliders(app, reduceMotion);
  initLightbox(app);
  initCommandPalette(app);
  initConsoleGame(app);
  initKonami(reduceMotion);
}

// ── Toasts ──────────────────────────────────────────────────────
function showToast(message, icon = 'fa-check-circle') {
  const stack = document.getElementById('toast-stack');
  if (!stack) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  const i = document.createElement('i');
  i.className = `fas ${icon}`;
  toast.append(i, document.createTextNode(message));
  stack.append(toast);
  setTimeout(() => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 320);
  }, 2400);
}

async function copyToClipboard(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(message);
  } catch (err) {
    // Fallback for browsers without the async clipboard API
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.append(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    // Clipboard blocked entirely: at least show the address so it can be copied by hand
    showToast(ok ? message : text, ok ? 'fa-check-circle' : 'fa-envelope');
  }
}

function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => copyToClipboard(btn.dataset.copy, 'Email copied to clipboard'));
  });
}

// ── Cursor spotlight ────────────────────────────────────────────
function initCursorSpotlight(finePointer, reduceMotion) {
  if (!finePointer || reduceMotion) return;
  let x = 0, y = 0, queued = false;
  window.addEventListener('mousemove', (e) => {
    x = e.clientX;
    y = e.clientY;
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      document.body.style.setProperty('--mx', `${x}px`);
      document.body.style.setProperty('--my', `${y}px`);
    });
  }, { passive: true });
}

// ── Hero constellation (reacts to the cursor) ───────────────────
function initHeroCanvas(app, reduceMotion) {
  const canvas = document.querySelector('.hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const heroIndex = [...app.slides].indexOf(canvas.closest('.slide'));
  const mouse = { x: -9999, y: -9999 };
  const LINK = 120, REACH = 170;
  let w = 0, h = 0, nodes = [], running = false, rafId = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(90, (w * h) / 16000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.4 + 0.6,
      accent: Math.random() < 0.2
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const n of nodes) {
      if (!reduceMotion) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        // Nodes drift away from the cursor, opening a little pocket around it
        const dx = n.x - mouse.x, dy = n.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < REACH && d > 1) {
          n.x += (dx / d) * 0.6;
          n.y += (dy / d) * 0.6;
        }
      }
    }
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(255,255,255,${(1 - d / LINK) * 0.14})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (dm < REACH + 40) {
        ctx.strokeStyle = `rgba(124,131,232,${(1 - dm / (REACH + 40)) * 0.5})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
    for (const n of nodes) {
      ctx.fillStyle = n.accent ? 'rgba(124,131,232,0.9)' : 'rgba(255,255,255,0.45)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop() {
    draw();
    if (running) rafId = requestAnimationFrame(loop);
  }

  function setRunning(on) {
    if (on === running) return;
    running = on;
    cancelAnimationFrame(rafId);
    if (on && !reduceMotion) loop();
    else if (on) draw();
  }

  window.addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  }, { passive: true });
  document.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });
  window.addEventListener('resize', () => { resize(); if (!running) draw(); });
  document.addEventListener('visibilitychange', () => setRunning(!document.hidden && app.activeIndex === heroIndex));
  document.addEventListener('slidechange', (e) => setRunning(e.detail.index === heroIndex));

  resize();
}

// ── Typewriter in the hero ──────────────────────────────────────
function initTypewriter(reduceMotion) {
  const el = document.getElementById('typed-text');
  if (!el || reduceMotion) return;
  const phrases = [
    'multi-agent LLM systems',
    'deep learning pipelines',
    'scalable cloud apps on AWS',
    'real-time MERN platforms'
  ];
  let p = 0, len = phrases[0].length, deleting = true;
  el.textContent = phrases[0];

  function tick() {
    const phrase = phrases[p];
    if (deleting) {
      len--;
      el.textContent = phrase.slice(0, len);
      if (len === 0) {
        deleting = false;
        p = (p + 1) % phrases.length;
        return setTimeout(tick, 350);
      }
      return setTimeout(tick, 32);
    }
    const next = phrases[p];
    len++;
    el.textContent = next.slice(0, len);
    if (len === next.length) {
      deleting = true;
      return setTimeout(tick, 2200);
    }
    return setTimeout(tick, 65);
  }
  setTimeout(tick, 2600);
}

// ── Count-up metrics (runs once, the first time the slide shows) ─
function initCounters(app, reduceMotion) {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length || reduceMotion) return;
  const bySlide = new Map();
  nums.forEach(el => {
    const idx = [...app.slides].indexOf(el.closest('.slide'));
    if (!bySlide.has(idx)) bySlide.set(idx, []);
    bySlide.get(idx).push(el);
    el.textContent = '0';
  });

  document.addEventListener('slidechange', (e) => {
    const list = bySlide.get(e.detail.index);
    if (!list) return;
    bySlide.delete(e.detail.index);
    list.forEach((el, k) => animateCount(el, parseInt(el.dataset.count, 10), 1400, 250 + k * 150));
  });
}

function animateCount(el, target, duration, delay) {
  const start = performance.now() + delay;
  function step(now) {
    const t = Math.min(1, Math.max(0, (now - start) / duration));
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = String(Math.round(target * eased) || 0);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ── Card spotlight + 3D tilt ────────────────────────────────────
function initCardEffects(finePointer, reduceMotion) {
  if (!finePointer) return;
  document.querySelectorAll('.metric-card, .project-idx-card, .skill-category, .cert-item, .honor-item').forEach(card => {
    card.classList.add('spotlight');
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--sx', `${e.clientX - r.left}px`);
      card.style.setProperty('--sy', `${e.clientY - r.top}px`);
    });
  });

  if (reduceMotion) return;
  document.querySelectorAll('.project-idx-card, .metric-card').forEach(card => {
    const lift = card.classList.contains('project-idx-card') ? -6 : -4;
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg) translateY(${lift}px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// ── Staggered entrance for slide contents ───────────────────────
function initStagger(app, reduceMotion) {
  if (reduceMotion) return;
  const items = [
    '.metric-card', '.skill-category', '.project-idx-card', '.job-bullets li', '.project-desc li',
    '.paper-bullets li', '.edu-item', '.cert-item', '.honor-item', '.bored-highlight-item',
    '.project-tech .skill-tag', '.project-links'
  ].join(', ');

  app.slides.forEach(slide => {
    let i = 0;
    slide.querySelectorAll(items).forEach(el => {
      el.classList.add('stagger');
      el.style.setProperty('--i', Math.min(i++, 14));
    });
    // Skill tags ripple in category by category
    slide.querySelectorAll('.skills-grid .skills-tags').forEach((wrap, c) => {
      wrap.querySelectorAll('.skill-tag').forEach((tag, j) => {
        tag.classList.add('stagger');
        tag.style.setProperty('--i', (c * 1.2 + 1 + j * 0.3).toFixed(2));
      });
    });
  });
}

// ── Magnetic buttons ────────────────────────────────────────────
function initMagnetic(finePointer, reduceMotion) {
  if (!finePointer || reduceMotion) return;
  document.querySelectorAll('.hero-socials .social-btn, .play-game-btn, .bar-icon-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      btn.style.translate = `${(x * 0.18).toFixed(1)}px ${(y * 0.28).toFixed(1)}px`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.translate = ''; });
  });
}

// ── Skill → project cross-links ─────────────────────────────────
// Keywords searched for in each experience / project / research slide.
// Tags not listed here fall back to their own text.
const SKILL_KEYWORDS = {
  'Data Structures & Algorithms (DSA)': ['DSA'],
  'Object-Oriented Programming (OOPs)': ['OOP'],
  'MERN Stack': ['MERN', 'React.js', 'Express.js'],
  'AWS EC2 / S3': ['EC2', 'S3'],
  'AWS ELB / ASG': ['ELB', 'ASG', 'Load Balancing', 'Auto Scaling'],
  'AWS Parameter Store': ['Parameter Store'],
  'IAM Roles & Security Groups': ['IAM', 'security groups'],
  'REST APIs & JWT': ['REST API', 'REST APIs', 'JWT'],
  'WebSockets (Socket.io)': ['WebSockets', 'Socket.IO'],
  'LangChain & LangGraph': ['LangChain', 'LangGraph'],
  'Google Gemini LLMs': ['Gemini'],
  'LLM Agents': ['multi-agent', 'agents'],
  'RAG Pipelines': ['RAG'],
  'ChromaDB Vector Store': ['ChromaDB'],
  'YOLOv8 / YOLOv9': ['YOLOv8', 'YOLOv9'],
  'CNNs & Deep Learning': ['CNN', 'Deep Learning'],
  'Conditional WGAN-GP': ['WGAN-GP'],
  'TensorRT (Inference Acceleration)': ['TensorRT'],
  'Streamlit Dashboards': ['Streamlit'],
  'Explainable AI (XAI)': ['Explainable', 'XAI'],
  'Git & GitHub': ['GitHub'],
  'Mermaid.js': ['Mermaid.js'],
  'Linux Systems': ['Linux'],
  'TCP/IP Networking': ['TCP/IP', 'network flow'],
  'DNS Infrastructure': ['DNS'],
  'React.js': ['React.js', 'React client'],
  'GANs': ['GANs', 'Generative Adversarial'],
  'CNN': ['CNN'],
  'Web Push API': ['Web Push'],
  'MongoDB Atlas': ['MongoDB Atlas'],
  'Gemini 2.5 Flash': ['Gemini 2.5'],
  'Gemini 3.5 Flash': ['Gemini 3.5']
};

function keywordRegex(k) {
  const esc = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![A-Za-z0-9])${esc}(?![A-Za-z0-9])`, 'i');
}

function initSkillLinks(app) {
  // Slides that count as evidence of a skill
  const targets = [];
  app.slides.forEach((slide, idx) => {
    const content = slide.querySelector('.project-info, .job-card, .research-info');
    if (!content) return;
    const dotLabel = app.dots[idx] && app.dots[idx].querySelector('.dot-label');
    targets.push({
      idx,
      label: dotLabel ? dotLabel.textContent.replace(/^Project:\s*/, '') : `Slide ${idx + 1}`,
      text: content.textContent.replace(/\s+/g, ' ')
    });
  });

  const pop = document.createElement('div');
  pop.className = 'skill-pop';
  pop.id = 'skill-pop';
  pop.setAttribute('role', 'dialog');
  pop.setAttribute('aria-label', 'Where this skill was used');
  document.body.append(pop);
  let current = null;

  function keywordsFor(label) {
    return SKILL_KEYWORDS[label] || label.split(/\s*(?:&|\/|,|\(|\))\s*/).filter(k => k.length > 1);
  }

  function place(tag) {
    const r = tag.getBoundingClientRect();
    const pw = pop.offsetWidth, ph = pop.offsetHeight;
    const left = Math.max(12, Math.min(r.left + r.width / 2 - pw / 2, window.innerWidth - pw - 12));
    let top = r.bottom + 10;
    if (top + ph > window.innerHeight - 12) top = r.top - ph - 10;
    pop.style.left = `${left}px`;
    pop.style.top = `${Math.max(12, top)}px`;
  }

  function open(tag) {
    close();
    current = tag;
    tag.classList.add('is-selected');
    tag.setAttribute('aria-expanded', 'true');

    const label = tag.textContent.trim();
    const kws = keywordsFor(label).map(keywordRegex);
    const ownSlide = [...app.slides].indexOf(tag.closest('.slide'));
    const fromSkills = !!tag.closest('.skills-grid');
    const hits = targets.filter(t => t.idx !== ownSlide && kws.some(re => re.test(t.text)));

    pop.textContent = '';
    const title = document.createElement('div');
    title.className = 'skill-pop-title';
    const name = document.createElement('b');
    name.textContent = label;
    title.append(fromSkills ? 'Where I used ' : 'Also used in ', name);
    pop.append(title);

    if (hits.length) {
      const ul = document.createElement('ul');
      ul.className = 'skill-pop-list';
      hits.forEach(hit => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        const meta = document.createElement('span');
        meta.textContent = `Slide ${String(hit.idx + 1).padStart(2, '0')} →`;
        btn.append(hit.label, meta);
        btn.addEventListener('click', () => { close(); app.scrollToSlide(hit.idx); });
        li.append(btn);
        ul.append(li);
      });
      pop.append(ul);
    } else {
      const p = document.createElement('p');
      p.className = 'skill-pop-empty';
      p.textContent = fromSkills
        ? 'Part of my core toolkit — not tied to one specific project on these slides.'
        : 'Only featured in this project so far.';
      pop.append(p);
    }

    place(tag);
    pop.classList.add('open');
  }

  function close() {
    if (!current) return;
    current.classList.remove('is-selected');
    current.setAttribute('aria-expanded', 'false');
    current = null;
    pop.classList.remove('open');
  }

  document.querySelectorAll('.skills-grid .skill-tag, .project-tech .skill-tag').forEach(tag => {
    tag.classList.add('is-interactive');
    tag.tabIndex = 0;
    tag.setAttribute('role', 'button');
    tag.setAttribute('aria-expanded', 'false');
    tag.setAttribute('aria-controls', 'skill-pop');
    const toggle = () => (current === tag ? close() : open(tag));
    tag.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
    tag.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }
    });
  });

  document.addEventListener('click', (e) => { if (current && !pop.contains(e.target)) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && current) {
      const tag = current;
      close();
      tag.focus();
    }
  });
  document.addEventListener('slidechange', close);
  window.addEventListener('resize', close);
}

// ── Sliders: autoplay, counter, swipe and ←/→ keys ──────────────
function initSliders(app, reduceMotion) {
  const AUTOPLAY_MS = 5000;

  document.querySelectorAll('.project-visual.slider').forEach(slider => {
    const imgs = [...slider.querySelectorAll('.slide-img')];
    const slide = slider.closest('.slide');

    const count = document.createElement('div');
    count.className = 'slider-count';
    const bar = document.createElement('div');
    bar.className = 'slider-progress';
    bar.style.setProperty('--autoplay', `${AUTOPLAY_MS}ms`);
    slider.append(count, bar);

    // The progress bar's CSS animation doubles as the autoplay timer,
    // so hovering / focusing the slider pauses it for free.
    function restartBar() {
      bar.classList.remove('run');
      if (reduceMotion || !slide.classList.contains('active')) return;
      void bar.offsetWidth;
      bar.classList.add('run');
    }
    function update() {
      const i = imgs.findIndex(im => im.classList.contains('active'));
      count.textContent = `${i + 1} / ${imgs.length}`;
      restartBar();
    }

    bar.addEventListener('animationend', () => window.moveProjectSlider(slider.id, 1));
    slider.addEventListener('sliderchange', update);
    document.addEventListener('slidechange', restartBar);

    let sx = 0, sy = 0;
    slider.addEventListener('touchstart', (e) => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
    }, { passive: true });
    slider.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) window.moveProjectSlider(slider.id, dx < 0 ? 1 : -1);
    }, { passive: true });

    update();
  });

  window.addEventListener('keydown', (e) => {
    if (app.keyLocks.size || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const tag = document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    const slider = app.slides[app.activeIndex].querySelector('.project-visual.slider');
    if (!slider) return;
    e.preventDefault();
    window.moveProjectSlider(slider.id, e.key === 'ArrowRight' ? 1 : -1);
  });
}

// ── Lightbox for project visuals ────────────────────────────────
function initLightbox(app) {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  const counter = document.getElementById('lightbox-count');
  let group = [], idx = 0, sourceSlider = null, lastFocus = null;

  function render() {
    const im = group[idx];
    img.src = im.currentSrc || im.src;
    img.alt = im.alt;
    caption.textContent = im.alt;
    counter.textContent = `${idx + 1} / ${group.length}`;
  }

  function open(images, start, slider) {
    group = images;
    idx = start;
    sourceSlider = slider;
    lb.classList.toggle('single', images.length < 2);
    render();
    lastFocus = document.activeElement;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open', 'overlay-open');
    app.keyLocks.add('lightbox');
    lb.querySelector('.lb-close').focus();
  }

  function close() {
    if (!lb.classList.contains('open')) return;
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open', 'overlay-open');
    app.keyLocks.delete('lightbox');
    if (sourceSlider) window.setProjectSlider(sourceSlider.id, idx);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function step(d) {
    idx = (idx + d + group.length) % group.length;
    render();
  }

  document.querySelectorAll('.project-visual').forEach(visual => {
    const images = [...visual.querySelectorAll('img')];
    if (!images.length) return;
    const slider = visual.classList.contains('slider') ? visual : null;
    const openCurrent = () => {
      const cur = images.findIndex(im => im.classList.contains('active'));
      open(images, Math.max(0, cur), slider);
    };
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'visual-expand';
    btn.setAttribute('aria-label', 'View image fullscreen');
    btn.innerHTML = '<i class="fas fa-expand"></i>';
    btn.addEventListener('click', openCurrent);
    visual.append(btn);
    images.forEach(im => im.addEventListener('click', openCurrent));
  });

  lb.querySelectorAll('[data-lb-close]').forEach(el => el.addEventListener('click', close));
  document.getElementById('lb-prev').addEventListener('click', () => step(-1));
  document.getElementById('lb-next').addEventListener('click', () => step(1));

  let sx = 0;
  lb.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    if (group.length > 1 && Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  }, { passive: true });

  window.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft' && group.length > 1) step(-1);
    else if (e.key === 'ArrowRight' && group.length > 1) step(1);
    else if (e.key === 'Tab') trapFocus(e, lb);
  });
}

function trapFocus(e, root) {
  const focusables = [...root.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])')]
    .filter(el => el.offsetParent !== null);
  if (!focusables.length) return;
  const first = focusables[0], last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

// ── Command palette (Ctrl/⌘ + K or "/") ─────────────────────────
const SLIDE_ICONS = [
  'fa-home', 'fa-user', 'fa-code', 'fa-briefcase', 'fa-th-large', 'fa-folder-open', 'fa-folder-open',
  'fa-folder-open', 'fa-folder-open', 'fa-folder-open', 'fa-folder-open', 'fa-flask', 'fa-graduation-cap', 'fa-gamepad'
];

function initCommandPalette(app) {
  const root = document.getElementById('cmdk');
  const input = document.getElementById('cmdk-input');
  const list = document.getElementById('cmdk-list');
  const trigger = document.getElementById('cmdk-open');
  if (!root || !input || !list) return;

  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  document.querySelectorAll('.cmdk-kbd').forEach(k => { k.textContent = isMac ? '⌘K' : 'Ctrl K'; });

  // Sections come straight from the slides so the palette never goes stale
  const items = [];
  app.dots.forEach((dot, i) => {
    const slide = app.slides[i];
    const label = dot.querySelector('.dot-label').textContent.trim();
    const keywords = [
      slide.querySelector('h3') && slide.querySelector('h3').textContent,
      slide.querySelector('.project-tagline') && slide.querySelector('.project-tagline').textContent,
      [...slide.querySelectorAll('.project-tech .skill-tag')].map(t => t.textContent).join(' ')
    ].filter(Boolean).join(' ');
    items.push({
      group: 'Sections', label, keywords,
      icon: `fas ${SLIDE_ICONS[i] || 'fa-circle'}`,
      meta: String(i + 1).padStart(2, '0'),
      run: () => app.scrollToSlide(i)
    });
  });

  items.push(
    { group: 'Actions', label: 'Copy email address', keywords: 'contact mail hire', icon: 'fas fa-copy', meta: EMAIL,
      run: () => copyToClipboard(EMAIL, 'Email copied to clipboard') },
    { group: 'Actions', label: 'Send me an email', keywords: 'contact mail hire', icon: 'fas fa-envelope',
      run: () => { window.location.href = `mailto:${EMAIL}`; } },
    { group: 'Actions', label: 'Launch the 3D world', keywords: 'game play three island', icon: 'fas fa-gamepad',
      run: () => { window.location.href = 'game.html'; } },
    { group: 'Actions', label: 'Play Bug Hunt on the ANSHUL 64', keywords: 'game snake mini console', icon: 'fas fa-bug',
      run: () => document.dispatchEvent(new CustomEvent('consolegame:start')) }
  );

  // External links are read from the page, labelled with the slide they live on
  document.querySelectorAll('.slide a[target="_blank"]').forEach(a => {
    const slideIdx = [...app.slides].indexOf(a.closest('.slide'));
    const dotLabel = app.dots[slideIdx].querySelector('.dot-label').textContent.replace(/^Project:\s*/, '');
    const text = a.textContent.trim();
    const iconEl = a.querySelector('i');
    items.push({
      group: 'Links',
      label: slideIdx === 0 ? text : `${dotLabel} — ${text}`,
      keywords: `${dotLabel} ${text} link open`,
      icon: iconEl ? iconEl.className : 'fas fa-external-link-alt',
      meta: new URL(a.href).hostname.replace(/^www\./, ''),
      run: () => window.open(a.href, '_blank', 'noopener')
    });
  });

  let results = [], active = 0, lastFocus = null;

  function score(item, q) {
    if (!q) return 1;
    const label = item.label.toLowerCase();
    if (label.startsWith(q)) return 4;
    if (label.includes(q)) return 3;
    if ((item.keywords || '').toLowerCase().includes(q)) return 2;
    let pos = 0;
    for (const ch of q) {
      pos = label.indexOf(ch, pos);
      if (pos === -1) return 0;
      pos++;
    }
    return 1;
  }

  function render() {
    const q = input.value.trim().toLowerCase();
    results = items
      .map((item, order) => ({ item, order, s: score(item, q) }))
      .filter(r => r.s > 0)
      .sort((a, b) => (q ? b.s - a.s : 0) || a.order - b.order)
      .map(r => r.item);
    active = Math.min(active, Math.max(0, results.length - 1));

    list.textContent = '';
    if (!results.length) {
      const li = document.createElement('li');
      li.className = 'cmdk-empty';
      li.textContent = 'No matches — try "projects", "LangGraph" or "email".';
      list.append(li);
      input.removeAttribute('aria-activedescendant');
      return;
    }

    let lastGroup = null;
    results.forEach((item, i) => {
      if (!q && item.group !== lastGroup) {
        lastGroup = item.group;
        const g = document.createElement('li');
        g.className = 'cmdk-group';
        g.setAttribute('role', 'presentation');
        g.textContent = item.group;
        list.append(g);
      }
      const li = document.createElement('li');
      li.className = `cmdk-item${i === active ? ' active' : ''}`;
      li.id = `cmdk-opt-${i}`;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(i === active));
      const icon = document.createElement('i');
      icon.className = `cmdk-icon ${item.icon}`;
      const label = document.createElement('span');
      label.className = 'cmdk-label';
      label.textContent = item.label;
      li.append(icon, label);
      if (item.meta) {
        const meta = document.createElement('span');
        meta.className = 'cmdk-meta';
        meta.textContent = item.meta;
        li.append(meta);
      }
      li.addEventListener('mousemove', () => { if (active !== i) setActive(i); });
      li.addEventListener('click', () => choose(i));
      list.append(li);
    });
    input.setAttribute('aria-activedescendant', `cmdk-opt-${active}`);
  }

  function setActive(i) {
    active = (i + results.length) % results.length;
    list.querySelectorAll('.cmdk-item').forEach((li, k) => {
      li.classList.toggle('active', k === active);
      li.setAttribute('aria-selected', String(k === active));
    });
    const el = document.getElementById(`cmdk-opt-${active}`);
    if (el) el.scrollIntoView({ block: 'nearest' });
    input.setAttribute('aria-activedescendant', `cmdk-opt-${active}`);
  }

  function choose(i) {
    const item = results[i];
    if (!item) return;
    close();
    item.run();
  }

  function open() {
    if (root.classList.contains('open')) return;
    lastFocus = document.activeElement;
    input.value = '';
    active = 0;
    render();
    root.classList.add('open');
    root.setAttribute('aria-hidden', 'false');
    document.body.classList.add('overlay-open');
    app.keyLocks.add('cmdk');
    input.focus();
  }

  function close() {
    if (!root.classList.contains('open')) return;
    root.classList.remove('open');
    root.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('overlay-open');
    app.keyLocks.delete('cmdk');
    if (lastFocus && lastFocus.focus && lastFocus !== document.body) lastFocus.focus();
    else input.blur();
  }

  input.addEventListener('input', () => { active = 0; render(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(active); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'Tab') e.preventDefault();
  });
  root.querySelectorAll('[data-cmdk-close]').forEach(el => el.addEventListener('click', close));
  if (trigger) trigger.addEventListener('click', open);

  window.addEventListener('keydown', (e) => {
    const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      root.classList.contains('open') ? close() : open();
    } else if (e.key === '/' && !typing && !app.keyLocks.size) {
      e.preventDefault();
      open();
    }
  });
}

// ── ANSHUL 64: "Bug Hunt" on the handheld console ───────────────
function initConsoleGame(app) {
  const screen = document.getElementById('console-screen');
  const canvas = document.getElementById('console-canvas');
  if (!screen || !canvas) return;
  const card = screen.closest('.game-console-card');
  const ctx = canvas.getContext('2d');
  const slideIdx = [...app.slides].indexOf(screen.closest('.slide'));
  const COLS = 20, ROWS = 12, HUD = 16;
  const BEST_KEY = 'anshul64.bugHunt.best';
  const DIRS = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
  const KEY_DIRS = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right'
  };

  let best = 0;
  try { best = parseInt(localStorage.getItem(BEST_KEY), 10) || 0; } catch (e) { best = 0; }

  // idle → playing ⇄ paused → over
  let state = 'idle';
  let snake, dir, queued, bug, score, stepMs, acc = 0, last = 0, rafId = 0, flash = 0;
  let W = 0, H = 0, cell = 10, ox = 0, oy = 0;

  function resize() {
    const r = screen.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width;
    H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cell = Math.floor(Math.min((W - 8) / COLS, (H - HUD - 6) / ROWS));
    ox = Math.round((W - cell * COLS) / 2);
    oy = Math.round(HUD + (H - HUD - cell * ROWS) / 2);
  }

  function placeBug() {
    do {
      bug = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    } while (snake.some(s => s.x === bug.x && s.y === bug.y));
  }

  function reset() {
    snake = [{ x: 6, y: 6 }, { x: 5, y: 6 }, { x: 4, y: 6 }];
    dir = DIRS.right;
    queued = [];
    score = 0;
    stepMs = 150;
    acc = 0;
    placeBug();
  }

  function setLock(on) {
    if (on) app.keyLocks.add('console');
    else app.keyLocks.delete('console');
    card.classList.toggle('is-active', on);
  }

  function start() {
    resize();
    reset();
    state = 'playing';
    screen.classList.add('is-playing');
    setLock(true);
    last = performance.now();
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(loop);
  }

  function exit() {
    state = 'idle';
    cancelAnimationFrame(rafId);
    screen.classList.remove('is-playing');
    setLock(false);
  }

  function gameOver() {
    state = 'over';
    if (score > best) {
      const hadBest = best > 0;
      best = score;
      try { localStorage.setItem(BEST_KEY, String(best)); } catch (e) { /* storage unavailable */ }
      if (hadBest) showToast(`New Bug Hunt record: ${best} bugs fixed!`, 'fa-trophy');
    }
  }

  function loop(now) {
    rafId = requestAnimationFrame(loop);
    if (state === 'playing') {
      acc += Math.min(now - last, 250);
      while (acc >= stepMs && state === 'playing') {
        acc -= stepMs;
        tick();
      }
    }
    last = now;
    draw();
  }

  function tick() {
    // Apply at most one queued turn per step, ignoring direct reversals
    while (queued.length) {
      const next = queued.shift();
      if (next.x !== -dir.x || next.y !== -dir.y) { dir = next; break; }
    }
    const head = { x: (snake[0].x + dir.x + COLS) % COLS, y: (snake[0].y + dir.y + ROWS) % ROWS };
    if (snake.some((s, i) => i < snake.length - 1 && s.x === head.x && s.y === head.y)) {
      gameOver();
      return;
    }
    snake.unshift(head);
    if (head.x === bug.x && head.y === bug.y) {
      score++;
      stepMs = Math.max(70, stepMs - 5);
      flash = 8;
      placeBug();
    } else {
      snake.pop();
    }
  }

  function steer(name) {
    const d = DIRS[name];
    if (!d) return;
    if (state === 'idle') { start(); }
    if (state !== 'playing') return;
    if (queued.length < 3) queued.push(d);
  }

  function pressA() {
    if (state === 'idle' || state === 'over') start();
    else if (state === 'playing') state = 'paused';
    else if (state === 'paused') { state = 'playing'; last = performance.now(); }
  }

  function text(str, x, y, size, color, align = 'center') {
    ctx.font = `700 ${size}px Outfit, sans-serif`;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.fillText(str, x, y);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#080914';
    ctx.fillRect(0, 0, W, H);

    // HUD
    text(`BUGS FIXED ${score}`, 8, 9, 8, '#4ecdc4', 'left');
    text(`BEST ${Math.max(best, score)}`, W - 8, 9, 8, '#ff9ff3', 'right');

    // Grid dots
    ctx.fillStyle = 'rgba(124,131,232,0.12)';
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) ctx.fillRect(ox + x * cell + cell / 2 - 0.5, oy + y * cell + cell / 2 - 0.5, 1, 1);
    }

    // Bug (a tiny pixel beetle)
    const bx = ox + bug.x * cell, by = oy + bug.y * cell, u = cell / 5;
    ctx.fillStyle = '#ff5e57';
    ctx.fillRect(bx + u, by + u, u * 3, u * 3);
    ctx.fillStyle = '#ff9ff3';
    ctx.fillRect(bx + u * 2, by, u, u);
    ctx.fillRect(bx, by + u * 2, u, u);
    ctx.fillRect(bx + u * 4, by + u * 2, u, u);
    ctx.fillRect(bx + u, by + u * 4, u, u);
    ctx.fillRect(bx + u * 3, by + u * 4, u, u);

    // Snake: teal head fading to indigo
    snake.forEach((s, i) => {
      const t = i / Math.max(1, snake.length - 1);
      const r = Math.round(78 + (124 - 78) * t), g = Math.round(205 + (131 - 205) * t), b = Math.round(196 + (232 - 196) * t);
      ctx.fillStyle = i === 0 && flash > 0 ? '#ffffff' : `rgb(${r},${g},${b})`;
      ctx.fillRect(ox + s.x * cell + 1, oy + s.y * cell + 1, cell - 2, cell - 2);
    });
    if (flash > 0) flash--;

    if (state === 'paused' || state === 'over') {
      ctx.fillStyle = 'rgba(8,9,20,0.78)';
      ctx.fillRect(0, 0, W, H);
      if (state === 'paused') {
        text('PAUSED', W / 2, H / 2 - 8, 14, '#ffffff');
        text('A: RESUME · B: EXIT', W / 2, H / 2 + 12, 8, '#a0a0a0');
      } else {
        text('GAME OVER', W / 2, H / 2 - 16, 15, '#ff9ff3');
        text(`${score} BUG${score === 1 ? '' : 'S'} FIXED`, W / 2, H / 2 + 4, 10, '#4ecdc4');
        text('A: RETRY · B: EXIT', W / 2, H / 2 + 22, 8, '#a0a0a0');
      }
    }
  }

  function pressVisual(el) {
    if (!el) return;
    el.classList.add('pressed');
    setTimeout(() => el.classList.remove('pressed'), 120);
  }

  card.querySelectorAll('[data-dir]').forEach(btn => {
    btn.addEventListener('click', () => steer(btn.dataset.dir));
  });
  card.querySelectorAll('[data-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.btn === 'a') pressA();
      else if (btn.dataset.btn === 'b') exit();
      pressVisual(btn);
    });
  });

  window.addEventListener('keydown', (e) => {
    if (state === 'idle' || e.ctrlKey || e.metaKey || e.altKey) return;
    if (app.keyLocks.has('cmdk') || app.keyLocks.has('lightbox')) return;
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    if (KEY_DIRS[e.key]) {
      e.preventDefault();
      steer(KEY_DIRS[e.key]);
      pressVisual(card.querySelector(`[data-dir="${KEY_DIRS[e.key]}"]`));
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      pressA();
      pressVisual(card.querySelector('[data-btn="a"]'));
    } else if (e.key === 'Escape' || e.key === 'Backspace') {
      e.preventDefault();
      exit();
      pressVisual(card.querySelector('[data-btn="b"]'));
    }
  });

  document.addEventListener('slidechange', (e) => {
    if (e.detail.index !== slideIdx && state !== 'idle') exit();
  });
  document.addEventListener('consolegame:start', () => {
    app.scrollToSlide(slideIdx);
    setTimeout(start, 500);
  });
  window.addEventListener('resize', () => { if (state !== 'idle') resize(); });
}

// ── Konami code easter egg ──────────────────────────────────────
function initKonami(reduceMotion) {
  const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let pos = 0;
  window.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = key === seq[pos] ? pos + 1 : (key === seq[0] ? 1 : 0);
    if (pos === seq.length) {
      pos = 0;
      showToast('Cheat code accepted — +30 lives!', 'fa-gamepad');
      if (!reduceMotion) launchConfetti();
    }
  });
}

function launchConfetti() {
  const canvas = document.createElement('canvas');
  canvas.className = 'confetti-canvas';
  document.body.append(canvas);
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);
  const colors = ['#7c83e8', '#4ecdc4', '#ff9ff3', '#ffe66d', '#ffffff'];
  const parts = Array.from({ length: 170 }, () => ({
    x: window.innerWidth / 2 + (Math.random() - 0.5) * 240,
    y: window.innerHeight * 0.4,
    vx: (Math.random() - 0.5) * 16,
    vy: -Math.random() * 15 - 4,
    w: 6 + Math.random() * 6,
    h: 8 + Math.random() * 8,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));
  const DURATION = 3200;
  const t0 = performance.now();
  (function frame(now) {
    const t = now - t0;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.globalAlpha = Math.max(0, 1 - t / DURATION);
    parts.forEach(p => {
      p.vy += 0.35;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot * 2)));
      ctx.restore();
    });
    if (t < DURATION) requestAnimationFrame(frame);
    else canvas.remove();
  })(t0);
}
