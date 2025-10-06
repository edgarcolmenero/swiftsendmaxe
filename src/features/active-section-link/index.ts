import { urlState } from '@app/providers/url-state';

const ACTIVE = 'is-active';
const ATTR = 'aria-current';

const links = () =>
  Array.from(
    document.querySelectorAll<HTMLAnchorElement>(
      '.nav-desktop a[href^="#"], .nav-desktop a[href^="/#"], .overlay-nav a[href^="#"], .overlay-nav a[href^="/#"]'
    )
  );

const activate = (link?: HTMLAnchorElement) => {
  links().forEach((a) => {
    if (a === link) {
      a.classList.add(ACTIVE);
      a.setAttribute(ATTR, 'page');
    } else {
      a.classList.remove(ACTIVE);
      a.removeAttribute(ATTR);
    }
  });
};

export const initActiveSectionLink = () => {
  const map = new Map<HTMLElement, HTMLAnchorElement>();
  links().forEach((a) => {
    const id = (a.hash || '').replace(/^#/, '');
    const el = id ? document.getElementById(id) : null;
    if (el) map.set(el, a);
  });
  if (!map.size) return;

  const sections = Array.from(map.keys()).sort((a, b) => (a.offsetTop || 0) - (b.offsetTop || 0));

  const update = () => {
    const y = scrollY + 160;
    let current = sections[0];
    for (const s of sections) {
      if (s.offsetTop <= y) current = s;
      else break;
    }
    activate(map.get(current));
    urlState.setHash(`#${current.id}`, { replace: true });
  };

  addEventListener(
    'scroll',
    () => {
      requestAnimationFrame(update);
    },
    { passive: true }
  );
  addEventListener('resize', () => requestAnimationFrame(update));
  update();
};
