document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const container = document.querySelector('.slides-container');
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot-wrapper');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const currentNumEl = document.getElementById('current-num');
  const modeToggleBtn = document.getElementById('mode-toggle');
  
  let activeIndex = 0;
  const totalSlides = slides.length;
  let isPresentationMode = true;

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

  // Keyboard Event Navigation (Only in Presentation Mode)
  window.addEventListener('keydown', (e) => {
    if (!isPresentationMode) return;

    // Prevent scrolling default behavior for arrow keys & space inside presentation mode
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', ' '].includes(e.key)) {
      // Don't intercept if user is typing in form inputs
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
      }
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
};
