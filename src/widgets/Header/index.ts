const HEADER_FADE_MIN = 120;
const HEADER_FADE_MAX = 220;
const HEADER_FADE_THRESHOLD = 220;
const SAFE = Math.min(Math.max(HEADER_FADE_THRESHOLD, HEADER_FADE_MIN), HEADER_FADE_MAX);

export const initHeader = () => {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  const hero = document.querySelector<HTMLElement>('.hero');
  const hamburger = document.querySelector<HTMLButtonElement>('.hamburger');
  const mobile = document.getElementById('mobileMenu');
  const closeBtn = mobile?.querySelector<HTMLButtonElement>('.overlay-close') ?? null;

  const blend = () => {
    const y = scrollY || document.documentElement.scrollTop || 0;
    if (hero && hero.getBoundingClientRect().bottom > 72) {
      header.classList.remove('header-fade');
      return;
    }
    if (y <= HEADER_FADE_MIN) {
      header.classList.remove('header-fade');
      return;
    }
    header.classList.toggle('header-fade', y > SAFE);
  };

  const open = () => {
    if (!mobile) return;
    mobile.hidden = false;
    document.body.style.overflow = 'hidden';
    hamburger?.setAttribute('aria-expanded', 'true');
  };
  const close = () => {
    if (!mobile) return;
    mobile.hidden = true;
    document.body.style.overflow = '';
    hamburger?.setAttribute('aria-expanded', 'false');
  };

  hamburger?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  mobile?.addEventListener('click', (e) => {
    if (e.target === mobile) close();
  });
  mobile
    ?.querySelectorAll('a[href^="#"], a[href^="/#"]')
    .forEach((a) => a.addEventListener('click', close));

  blend();
  addEventListener('scroll', blend, { passive: true });
  addEventListener('resize', blend);
};
