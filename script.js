/* ═══════════════════════════════════════════════════════
   TAB SWITCHING & SCROLL ANIMATIONS
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Tab Navigation ───
  const tabs = document.querySelectorAll('.nav-tab');
  const pages = document.querySelectorAll('.page');

  function switchTab(tabName) {
    // Update tab buttons
    tabs.forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update pages
    pages.forEach(p => {
      if (p.id === tabName) {
        p.classList.add('active');
        // Small delay so `display: block` applies before the opacity transition
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            p.classList.add('visible');
          });
        });
      } else {
        p.classList.remove('visible');
        // Wait for transition out, then hide
        const handler = () => {
          if (!p.classList.contains('visible')) {
            p.classList.remove('active');
          }
          p.removeEventListener('transitionend', handler);
        };
        p.addEventListener('transitionend', handler);
        // Fallback in case transitionend doesn't fire
        setTimeout(() => {
          if (!p.classList.contains('visible')) {
            p.classList.remove('active');
          }
        }, 600);
      }
    });

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Re-trigger fade-in animations for new page
    setTimeout(() => observeFadeIns(), 100);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab.dataset.tab);
    });
  });

  // Show the default page on load
  const activePage = document.querySelector('.page.active');
  if (activePage) {
    requestAnimationFrame(() => {
      activePage.classList.add('visible');
    });
  }

  // ─── Scroll-triggered Fade-ins ───
  function observeFadeIns() {
    const fadeEls = document.querySelectorAll('.fade-in:not(.in-view)');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      fadeEls.forEach(el => observer.observe(el));
    } else {
      // Fallback
      fadeEls.forEach(el => el.classList.add('in-view'));
    }
  }

  observeFadeIns();

  // ─── Navbar subtle background on scroll ───
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
      navbar.style.background = 'rgba(10, 10, 10, 0.85)';
    }
  }, { passive: true });

  // ─── ProfileCard: Tilt & Pointer Tracking ───
  const pcWrap = document.getElementById('profile-card-wrapper');
  const pcCard = document.getElementById('profile-card');

  if (pcWrap && pcCard) {
    const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
    const round = (v, p = 3) => parseFloat(v.toFixed(p));
    const adjust = (v, fMin, fMax, tMin, tMax) => round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));
    const easeInOutCubic = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

    let rafId = null;

    function updateCard(offsetX, offsetY) {
      const w = pcCard.clientWidth;
      const h = pcCard.clientHeight;
      const pX = clamp((100 / w) * offsetX);
      const pY = clamp((100 / h) * offsetY);
      const cX = pX - 50;
      const cY = pY - 50;

      const props = {
        '--pointer-x': `${pX}%`,
        '--pointer-y': `${pY}%`,
        '--background-x': `${adjust(pX, 0, 100, 35, 65)}%`,
        '--background-y': `${adjust(pY, 0, 100, 35, 65)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(pY - 50, pX - 50) / 50, 0, 1)}`,
        '--pointer-from-top': `${pY / 100}`,
        '--pointer-from-left': `${pX / 100}`,
        '--rotate-x': `${round(-(cX / 5))}deg`,
        '--rotate-y': `${round(cY / 4)}deg`,
      };
      for (const [k, v] of Object.entries(props)) {
        pcWrap.style.setProperty(k, v);
      }
    }

    function smoothReturn(duration, startX, startY) {
      const startTime = performance.now();
      const targetX = pcWrap.clientWidth / 2;
      const targetY = pcWrap.clientHeight / 2;

      function loop(now) {
        const elapsed = now - startTime;
        const progress = clamp(elapsed / duration);
        const eased = easeInOutCubic(progress);
        updateCard(adjust(eased, 0, 1, startX, targetX), adjust(eased, 0, 1, startY, targetY));
        if (progress < 1) rafId = requestAnimationFrame(loop);
      }
      rafId = requestAnimationFrame(loop);
    }

    pcCard.addEventListener('pointerenter', () => {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      pcWrap.classList.add('active');
      pcCard.classList.add('active');
    });

    pcCard.addEventListener('pointermove', (e) => {
      const rect = pcCard.getBoundingClientRect();
      updateCard(e.clientX - rect.left, e.clientY - rect.top);
    });

    pcCard.addEventListener('pointerleave', (e) => {
      smoothReturn(600, e.offsetX, e.offsetY);
      pcWrap.classList.remove('active');
      pcCard.classList.remove('active');
    });

    // Initial intro animation
    const initX = pcWrap.clientWidth - 70;
    const initY = 60;
    updateCard(initX, initY);
    smoothReturn(1500, initX, initY);

    // Contact Me → LinkedIn
    const contactBtn = document.getElementById('pc-contact-btn');
    if (contactBtn) {
      contactBtn.addEventListener('click', () => {
        window.open('https://www.linkedin.com/in/aayush-narang10', '_blank');
      });
    }
  }

});
