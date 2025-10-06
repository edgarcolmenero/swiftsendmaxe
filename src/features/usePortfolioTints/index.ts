import { useEffect } from 'react';

const DEFAULT_TINTS = [
  'linear-gradient(140deg, rgba(90, 141, 255, 0.78), rgba(177, 102, 255, 0.78))',
  'linear-gradient(140deg, rgba(255, 122, 24, 0.78), rgba(214, 60, 255, 0.78))',
  'linear-gradient(140deg, rgba(64, 221, 255, 0.68), rgba(154, 112, 255, 0.78))',
];

export function usePortfolioTints(selector = '[data-portfolio-card]') {
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (cards.length === 0) {
      return;
    }

    cards.forEach((card, index) => {
      const tint = DEFAULT_TINTS[index % DEFAULT_TINTS.length];
      const media = card.querySelector<HTMLElement>('.pf-card__media');
      if (media) {
        media.style.setProperty('--media-tint', tint);
      }
    });
  }, [selector]);
}
