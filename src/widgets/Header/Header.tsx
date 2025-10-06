import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { useSmoothScroll } from '@features/useSmoothScroll';
import { useActiveSectionLink } from '@features/useActiveSectionLink';

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'portfolio', label: 'Work' },
  { id: 'labs', label: 'Labs' },
  { id: 'packs', label: 'Packs' },
  { id: 'contact', label: 'Contact' },
];

const ICON_LINKS = [
  {
    href: 'mailto:swift.send.marketing@gmail.com',
    label: 'Email',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <polyline points="3 7.5 12 13 21 7.5" />
      </svg>
    ),
  },
  {
    href: 'sms:+15105191128',
    label: 'Message',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    href: 'tel:+15105191128',
    label: 'Call',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2 4.11 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.45-1.2a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    href: '/calendar',
    label: 'Calendar',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
];

export function Header() {
  const smoothScroll = useSmoothScroll();
  const sectionIds = useMemo(() => NAV_LINKS.map((link) => link.id), []);
  const activeSection = useActiveSectionLink(sectionIds);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isHomePage = window.location.pathname === '/' || window.location.pathname === '/home';
  const overlayRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';
      const focusable = overlayRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      focusable?.[0]?.focus();

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          setIsMenuOpen(false);
        } else if (event.key === 'Tab' && focusable && focusable.length > 0) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }

    document.body.style.overflow = '';
    previouslyFocusedElement.current?.focus({ preventScroll: true });
    previouslyFocusedElement.current = null;
    return () => {};
  }, [isMenuOpen]);

  const navLinks = useMemo(() => {
    const home = isHomePage;
    return NAV_LINKS.map((link) => ({
      ...link,
      href: home ? `#${link.id}` : `/#${link.id}`,
      isActive: activeSection === link.id,
    }));
  }, [activeSection, isHomePage]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={clsx('ss-header', { 'is-scrolled': isScrolled })} data-header>
      <div className="container header-row">
        <a
          href={isHomePage ? '#home' : '/#home'}
          className="brand"
          aria-label="SwiftSend"
          onClick={(event) => {
            if (isHomePage) smoothScroll(event);
          }}
        >
          <span className="brand-badge">S</span>
          <span className="brand-text">SwiftSend</span>
        </a>

        <nav className="nav-desktop" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={clsx('nav-pill', { 'is-active': link.isActive })}
              onClick={(event) => {
                if (isHomePage) smoothScroll(event);
              }}
            >
              <span>{link.label}</span>
            </a>
          ))}
        </nav>

        <div className="header-icons">
          {ICON_LINKS.map((icon) => (
            <a key={icon.label} className="icon-btn" aria-label={icon.label} href={icon.href}>
              {icon.icon}
            </a>
          ))}

          <button
            className="hamburger"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobileMenu"
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        id="mobileMenu"
        className="mobile-overlay"
        hidden={!isMenuOpen}
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
      >
        <div className="overlay-panel">
          <div className="overlay-top">
            <span className="brand-badge" aria-hidden="true">
              S
            </span>
            <button className="overlay-close" type="button" aria-label="Close menu" onClick={closeMenu}>
              ✕
            </button>
          </div>

          <nav className="overlay-nav" aria-label="Mobile">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={clsx({ 'is-active': link.isActive })}
                onClick={(event) => {
                  if (isHomePage) {
                    smoothScroll(event);
                  }
                  closeMenu();
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="overlay-icons">
            {ICON_LINKS.map((icon) => (
              <a key={icon.label} className="icon-btn" aria-label={`${icon.label} (mobile)`} href={icon.href}>
                {icon.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
