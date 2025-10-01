const root = document.documentElement;
const header = document.querySelector('.ss-header');
const mobileMenu = document.getElementById('mobileMenu');
const hamburger = document.querySelector('.hamburger');
const prefersReducedMotion = window.matchMedia
  ? window.matchMedia('(prefers-reduced-motion: reduce)')
  : { matches: false };

root.classList.remove('no-js');

let headerHeight = 0;
let resizeTimer;

function measureHeader() {
  headerHeight = header ? header.getBoundingClientRect().height : 0;
  root.style.setProperty('--header-offset', `${headerHeight}px`);
}

function scheduleMeasure() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(measureHeader, 150);
}

function closeMobileMenu() {
  if (mobileMenu) {
    mobileMenu.hidden = true;
  }
  document.body.style.overflow = '';
  hamburger?.setAttribute('aria-expanded', 'false');
}

function scrollToTarget(target, updateHash = true) {
  if (!target) return;

  const targetRect = target.getBoundingClientRect();
  const currentScroll = window.scrollY ?? window.pageYOffset ?? 0;
  const targetTop = currentScroll + targetRect.top - (headerHeight + 16);
  const top = Math.max(targetTop, 0);

  window.scrollTo({
    top,
    behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
  });

  if (updateHash && target.id) {
    const hash = `#${target.id}`;
    if (hash !== window.location.hash) {
      if (history.pushState) {
        history.pushState(null, '', hash);
        window.dispatchEvent(new Event('hashchange'));
      } else {
        window.location.hash = hash;
      }
    }
  }

  if (typeof target.focus === 'function') {
    setTimeout(() => {
      const previousTabIndex = target.getAttribute('tabindex');
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      if (previousTabIndex === null) {
        target.removeAttribute('tabindex');
      } else {
        target.setAttribute('tabindex', previousTabIndex);
      }
    }, 300);
  }
}

function getTargetFromLink(link) {
  if (!link) return null;

  if (link.hasAttribute('data-scroll-to')) {
    const selector = link.dataset.scrollTo?.trim();
    if (!selector) return null;
    if (selector.startsWith('#')) {
      const id = selector.slice(1);
      return document.getElementById(id) ?? document.querySelector(selector);
    }
    return document.querySelector(selector);
  }

  const href = link.getAttribute('href');
  if (!href || !href.startsWith('#')) return null;
  const id = href.slice(1);
  if (!id) return null;
  return document.getElementById(id) ?? document.querySelector(href);
}

document.addEventListener('click', (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  const origin = event.target instanceof Element ? event.target : null;
  const link = origin?.closest("a[href^="#"]:not([href="#"]), [data-scroll-to]");
  if (!link) return;

  const target = getTargetFromLink(link);
  if (!target) return;

  event.preventDefault();
  closeMobileMenu();

  requestAnimationFrame(() => {
    measureHeader();
    scrollToTarget(target);
  });
});

window.addEventListener('load', () => {
  measureHeader();

  const hash = window.location.hash;
  if (!hash) return;

  const target = document.getElementById(hash.replace(/^#/, ''));
  if (!target) return;

  requestAnimationFrame(() => {
    measureHeader();
    scrollToTarget(target, false);
  });
});

window.addEventListener('resize', scheduleMeasure);
document.addEventListener('header:measure', () => {
  requestAnimationFrame(measureHeader);
});

measureHeader();
