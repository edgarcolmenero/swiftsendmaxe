import { useEffect, useState } from 'react';
import { useUrlState } from '@app/providers/url-state';

const DEFAULT_SECTIONS = ['home', 'about', 'services', 'portfolio', 'labs', 'packs', 'contact'];

export function useActiveSectionLink(sectionIds: string[] = DEFAULT_SECTIONS) {
  const { hash, setHash } = useUrlState();
  const [activeSection, setActiveSection] = useState<string>(() => hash || sectionIds[0]);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));
    if (!elements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          const id = visible[0].target.id;
          setActiveSection(id);
        }
      },
      {
        rootMargin: '-40% 0px -50% 0px',
        threshold: [0.1, 0.5, 1],
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sectionIds]);

  useEffect(() => {
    if (!activeSection || activeSection === hash) {
      return;
    }
    setHash(activeSection, { replace: true });
  }, [activeSection, hash, setHash]);

  return activeSection;
}
