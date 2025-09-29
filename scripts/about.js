// SwiftSend — About Section
// Alive but subtle: starfield (CSS), portrait orbit (CSS), hover-dot on achievements,
// reveal-on-view, and desktop-only micro parallax drift. All GPU-only.
// No polling. Event delegation. Reduced-motion safe.

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
     Achievements hover-dot (appears only on hovered/focused card)
     - Delegated mousemove updates CSS vars --mx/--my on the active .achv-card
     - Keyboard focus uses CSS fallback position (right-center)
  ------------------------------------------------------- */
  const achvList = section.querySelector('.achv-list');
  if (achvList) {
    let raf = 0;
    let lastCard = null;

    const onMove = evt => {
      const card = evt.target.closest('.achv-card');
      if (!card || !achvList.contains(card)) return;

      // cache-avoid: only compute if pointer actually moves over a card
      const rect = card.getBoundingClientRect();
      const x = evt.clientX - rect.left;
      const y = evt.clientY - rect.top;

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // write to the hovered card only
        if (lastCard && lastCard !== card) {
          lastCard.style.removeProperty('--mx');
          lastCard.style.removeProperty('--my');
        }
        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);
        lastCard = card;
        raf = 0;
      });
    };

    const onLeave = () => {
      if (lastCard) {
        lastCard.style.removeProperty('--mx');
        lastCard.style.removeProperty('--my');
        lastCard = null;
      }
    };

    achvList.addEventListener('mousemove', onMove);
    achvList.addEventListener('mouseleave', onLeave);

    // For keyboard users, show dot on focus-within using CSS fallback coords; clear on focusout
    achvList.addEventListener('focusout', e => {
      const card = e.target.closest('.achv-card');
      if (card) {
        card.style.removeProperty('--mx');
        card.style.removeProperty('--my');
      }
    });
  }

  /* -------------------------------------------------------
     Desktop-only micro parallax on the portrait (very subtle)
     - Translates the .about__avatar by up to 3–4px based on pointer position
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
        update(Math.min(1, Math.max(0, nx)), Math.min(1, Math.max(0, ny)));
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
