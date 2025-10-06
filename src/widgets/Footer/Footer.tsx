import type { MouseEvent } from 'react';
import { useSmoothScroll } from '@features/useSmoothScroll';

export function Footer() {
  const smoothScroll = useSmoothScroll();
  const isHomePage = typeof window !== 'undefined' ? window.location.pathname === '/' || window.location.pathname === '/home' : true;
  const getHref = (id: string) => (isHomePage ? `#${id}` : `/#${id}`);
  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isHomePage) {
      smoothScroll(event);
    }
  };

  return (
    <footer className="footer" data-footer>
      <div className="footer__inner">
        <section className="footer__brand">
          <span className="f-logo" aria-hidden="true">
            <span className="f-logo__grad">S</span>
          </span>
          <h3 className="f-name">SwiftSend</h3>
          <p className="f-tag">Never Stay Satisfied.</p>
          <p className="f-desc">Building the future of digital solutions, one project at a time.</p>
        </section>

        <nav className="footer__links" aria-label="Quick Links">
          <h4 className="f-colTitle">Quick Links</h4>
          <ul className="f-cols">
            <li>
              <a href={getHref('home')} onClick={handleNavClick}>
                Home
              </a>
            </li>
            <li>
              <a href={getHref('portfolio')} onClick={handleNavClick}>
                Work
              </a>
            </li>
            <li>
              <a href={getHref('packs')} onClick={handleNavClick}>
                Packs
              </a>
            </li>
            <li>
              <a href={getHref('contact')} onClick={handleNavClick}>
                Contact
              </a>
            </li>

            <li>
              <a href={getHref('services')} onClick={handleNavClick}>
                Services
              </a>
            </li>
            <li>
              <a href={getHref('labs')} onClick={handleNavClick}>
                Labs
              </a>
            </li>
            <li>
              <a href={getHref('about')} onClick={handleNavClick}>
                About
              </a>
            </li>
          </ul>
        </nav>

        <section className="footer__contact" aria-label="Connect">
          <h4 className="f-colTitle">Connect</h4>
          <ul className="f-connect">
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M4 4h16v16H4z" opacity=".08" />
                <path fill="currentColor" d="M4 6l8 5 8-5v12H4z" />
                <path fill="currentColor" d="M20 6H4l8 5z" />
              </svg>
              <a href="mailto:swift.send.marketing@gmail.com">swift.send.marketing@gmail.com</a>
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z" opacity=".08" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
              </svg>
              <a href="https://instagram.com/swiftsend.dev" target="_blank" rel="noopener">
                @swiftsend.dev
              </a>
            </li>
          </ul>

          <div className="f-social">
            <a className="f-icn" aria-label="Email" href="mailto:swift.send.marketing@gmail.com">
              <span>✉️</span>
            </a>
            <a className="f-icn" aria-label="Instagram" href="https://instagram.com/swiftsend.dev" target="_blank" rel="noopener">
              <span>◎</span>
            </a>
          </div>
        </section>
      </div>

      <div className="footer__bar">
        <p className="f-copy">© 2025 SwiftSend. All Rights Reserved.</p>
        <nav className="f-legal" aria-label="Legal">
          <a href="#" className="underline-seq">
            Privacy Policy
          </a>
          <a href="#" className="underline-seq">
            Terms of Service
          </a>
        </nav>
      </div>
    </footer>
  );
}
