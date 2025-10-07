// SwiftSend Max 3.0 — Header interactions
// - Keep header transparent while hero is visible
// - Add very subtle .header-fade only after scrolling past hero
// - Mobile menu overlay & active nav link

const header = document.querySelector('[data-header]');
const hamburger = document.querySelector('.hamburger');
const mobile = document.getElementById('mobileMenu');
const closeBtn = mobile?.querySelector('.overlay-close');
const hero = document.querySelector('.hero');

const HEADER_FADE_MIN = 120;   // never add fade before this scroll distance
const HEADER_FADE_MAX = 220;   // keep the veil subtle even if threshold changes
const HEADER_FADE_THRESHOLD = 220; // existing logic target
const HEADER_FADE_SAFE = Math.min(Math.max(HEADER_FADE_THRESHOLD, HEADER_FADE_MIN), HEADER_FADE_MAX);

// -------- Header blend logic --------
function applyHeaderBlend() {
  if (!header) return;

  const y = window.scrollY || document.documentElement.scrollTop;

  // If the hero is still beneath the header, keep it transparent.
  if (hero) {
    const rect = hero.getBoundingClientRect();
    const heroStillUnderHeader = rect.bottom > 72; // hero not scrolled past header height
    if (heroStillUnderHeader) {
      header.classList.remove('header-fade');
      return;
    }
  }

  // Guard so the veil never appears during the initial tiny scroll.
  if (y <= HEADER_FADE_MIN) {
    header.classList.remove('header-fade');
    return;
  }

  // Only after we’re well past the hero, add a faint veil.
  header.classList.toggle('header-fade', y > HEADER_FADE_SAFE);
}

// Initialize + listeners
applyHeaderBlend();
window.addEventListener('scroll', applyHeaderBlend, { passive: true });
window.addEventListener('resize', applyHeaderBlend);

// -------- Mobile menu --------
function openMenu() {
  if (!mobile) return;
  mobile.hidden = false;
  document.body.style.overflow = 'hidden';
  hamburger?.setAttribute('aria-expanded', 'true');
}
function closeMenu() {
  if (!mobile) return;
  mobile.hidden = true;
  document.body.style.overflow = '';
  hamburger?.setAttribute('aria-expanded', 'false');
}
hamburger?.addEventListener('click', openMenu);
closeBtn?.addEventListener('click', closeMenu);
// Close when clicking the overlay backdrop (outside panel)
mobile?.addEventListener('click', (e) => { if (e.target === mobile) closeMenu(); });
// Close after selecting a link
mobile?.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', closeMenu));

// -------- Active nav link (hash-based) --------
function setActiveFromHash() {
  const hash = window.location.hash || '#home';
  document.querySelectorAll('.nav-pill').forEach(el => el.classList.remove('is-active'));
  const target = document.querySelector(`.nav-pill[href="${hash}"]`);
  if (target) target.classList.add('is-active');
}
window.addEventListener('hashchange', setActiveFromHash);
setActiveFromHash();