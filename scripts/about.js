// SwiftSend — About Section
// Subtle + performant: reveal-on-view, portrait micro parallax.
// No pointer-tracking on achievements (CSS handles hover effects).
// GPU-only transforms/opacity. Reduced-motion safe.

const hasDoc = typeof document !== 'undefined';
const hasWin = typeof window !== 'undefined';

function initAbout() {
  if (!hasDoc) return;

  const section = document.querySelector('#about.about') || document.getElementById('about');
  if (!section) return;

  // Gate reveal styles to JS sessions only
  document.body.classList.add('is-about-js');

  const prefersReduced =
    hasWin &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------------
     Reveal-on-view (one-shot)
  ------------------------------------------------------- */
  const revealTargets = Array.from(section.querySelectorAll('[data-reveal]'));
  if (revealTargets.length) {
    if (!prefersReduced && 'IntersectionObserver' in window) {
      const ro = new IntersectionObserver(
        entries => {
          entries.forEach(e => {
            if (e.isIntersecting) {
              e.target.classList.add('is-in');
              ro.unobserve(e.target);
            }
          });
        },
        { threshold: 0.18 }
      );
      revealTargets.forEach(el => ro.observe(el));
    } else {
      // Fallback: visible immediately
      revealTargets.forEach(el => el.classList.add('is-in'));
    }
  }

  /* -------------------------------------------------------
     Desktop-only micro parallax on the portrait (very subtle)
     - Translates the .about__avatar by a few px based on pointer position
     - Disabled on coarse pointers and reduced-motion
  ------------------------------------------------------- */
  const avatar = section.querySelector('.about__avatar');
  const profileArea = section.querySelector('.about__profile');

  const pointerFine =
    hasWin &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: fine)').matches;

  if (avatar && profileArea && pointerFine && !prefersReduced) {
    let rect = null;
    let raf = 0;
    const MAX_X = 4; // px
    const MAX_Y = 3; // px

    const update = (nx, ny) => {
      // nx/ny are 0..1 within profileArea
      const dx = (nx - 0.5) * 2 * MAX_X;
      const dy = (ny - 0.5) * 2 * MAX_Y;
      avatar.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;
    };

    const onMove = e => {
      if (!rect) rect = profileArea.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;

      if (raf) return;
      raf = requestAnimationFrame(() => {
        const clampedX = Math.min(1, Math.max(0, nx));
        const clampedY = Math.min(1, Math.max(0, ny));
        update(clampedX, clampedY);
        raf = 0;
      });
    };

    const reset = () => {
      avatar.style.transform = 'translate3d(0,0,0)';
      rect = null;
    };

    profileArea.addEventListener('mousemove', onMove);
    profileArea.addEventListener('mouseleave', reset);
    window.addEventListener('resize', () => (rect = null));
    window.addEventListener('scroll', () => (rect = null), { passive: true });
  }
}

/* -------------------------------------------------------
   Boot
------------------------------------------------------- */
function boot() {
  try {
    initAbout();
  } catch (err) {
    console.error('[about init]', err);
  }
}

if (hasDoc) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
}

export {};