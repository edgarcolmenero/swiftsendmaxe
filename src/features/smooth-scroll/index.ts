import { urlState } from '@app/providers/url-state';

const measureHeader = () => document.querySelector<HTMLElement>('.ss-header')?.getBoundingClientRect().height ?? 0;

export const initSmoothScroll = () => {
  let headerH = measureHeader();
  const scheduleMeasure = () => {
    headerH = measureHeader();
  };

  const focusTarget = (t: HTMLElement) => {
    const prev = t.getAttribute('tabindex');
    t.setAttribute('tabindex', '-1');
    t.focus({ preventScroll: true });
    setTimeout(() => (prev === null ? t.removeAttribute('tabindex') : t.setAttribute('tabindex', prev)), 0);
  };

  const scrollToTarget = (t: HTMLElement, updateHash: boolean) => {
    const rect = t.getBoundingClientRect();
    const top = Math.max((scrollY || pageYOffset || 0) + rect.top - (headerH + 16), 0);
    scrollTo({ top, behavior: 'smooth' });
    if (updateHash && t.id) urlState.setHash(`#${t.id}`);
    setTimeout(() => focusTarget(t), 300);
  };

  document.addEventListener('click', (e) => {
    if (
      e.defaultPrevented ||
      (e as MouseEvent).button !== 0 ||
      (e as MouseEvent).metaKey ||
      (e as MouseEvent).ctrlKey
    ) {
      return;
    }
    const origin = e.target instanceof Element ? e.target : null;
    const link = origin?.closest<HTMLAnchorElement>('a[href^="#"]:not([href="#"]), a[href^="/#"]');
    if (!link) return;

    const href = link.getAttribute('href') || '';
    const isHome = location.pathname === '/' || location.pathname.endsWith('/home/');
    if (href.startsWith('/#') && !isHome) return;

    const id = href.replace(/^\/?#/, '');
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    headerH = measureHeader();
    scrollToTarget(target, true);
  });

  addEventListener('load', () => {
    headerH = measureHeader();
    const id = location.hash.replace(/^#/, '');
    if (!id) return;
    const t = document.getElementById(id);
    if (!t) return;
    scrollToTarget(t, false);
  });

  addEventListener('resize', () => setTimeout(scheduleMeasure, 150));
};
