const labsSection = document.querySelector('#labs');

if (labsSection) {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopMedia = window.matchMedia('(min-width: 768px)');

  const labsItems = [
    {
      id: 'swiftpay-mini',
      title: 'SwiftPay Mini',
      blurb: 'One-page checkout links with auto receipts.',
      status: 'Beta',
      accent: 'orange',
      statusClass: 'labs-status--beta',
      href: '#',
      icon: `
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <rect x="5.5" y="7.5" width="21" height="13" rx="2.6" ry="2.6"></rect>
          <path d="M5 13.5h22"></path>
          <path d="M10.5 17h6" stroke-linecap="round"></path>
          <path d="M8.5 22.5h6.5" stroke-linecap="round"></path>
        </svg>`
    },
    {
      id: 'site-in-a-day',
      title: 'Site-in-a-Day',
      blurb: 'Flat-rate, brand-colored sites shipped fast.',
      status: 'Live',
      accent: 'green',
      statusClass: 'labs-status--live',
      href: '#',
      icon: `
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <rect x="5" y="6.5" width="22" height="18" rx="3" ry="3"></rect>
          <path d="M5 12.5h22"></path>
          <path d="M11 18.5h6" stroke-linecap="round"></path>
          <path d="M11 22.5h10" stroke-linecap="round"></path>
        </svg>`
    },
    {
      id: 'fee-optimizer',
      title: 'Fee Optimizer Widget',
      blurb: '\u201cPay by Bank & save\u201d nudges + estimator.',
      status: 'Coming Soon',
      accent: 'cyan',
      statusClass: 'labs-status--coming',
      href: '#',
      icon: `
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="16" cy="16" r="9"></circle>
          <path d="M16 10v12" stroke-linecap="round"></path>
          <path d="M12 14h8" stroke-linecap="round"></path>
          <path d="M12 18h4" stroke-linecap="round"></path>
        </svg>`
    },
    {
      id: 'leads-autopilot',
      title: 'Leads Autopilot',
      blurb: 'Form \u2192 CRM \u2192 AI triage \u2192 calendar booking.',
      status: 'Beta',
      accent: 'purple',
      statusClass: 'labs-status--beta',
      href: '#',
      icon: `
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M8.5 9.5h15" stroke-linecap="round"></path>
          <path d="M8.5 15.5h10" stroke-linecap="round"></path>
          <path d="M8.5 21.5h5.5" stroke-linecap="round"></path>
          <path d="M21 15.5 24.5 19l-3.5 3.5" stroke-linecap="round"></path>
        </svg>`
    },
    {
      id: 'doc-copilot',
      title: 'Doc Copilot',
      blurb: 'PDFs into Q&A bots with citations.',
      status: 'Prototype',
      accent: 'rose',
      statusClass: 'labs-status--prototype',
      href: '#',
      icon: `
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M11 6.5h9.5L25.5 12v13.5H11z"></path>
          <path d="M20 6.5v6h6" stroke-linecap="round"></path>
          <path d="M14 16.5h8" stroke-linecap="round"></path>
          <path d="M14 20.5h5" stroke-linecap="round"></path>
        </svg>`
    },
    {
      id: 'site-health-monitor',
      title: 'Site Health Monitor',
      blurb: 'Uptime + Lighthouse snapshots with alerts.',
      status: 'Beta',
      accent: 'blueCyan',
      statusClass: 'labs-status--beta-alt',
      href: '#',
      icon: `
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M6.5 22.5 11 14.5l4 7 4.5-10 5 11" stroke-linecap="round"></path>
          <path d="M6 25.5h20" stroke-linecap="round"></path>
          <path d="M7.5 9.5h17" stroke-linecap="round"></path>
        </svg>`
    }
  ];

  const grid = labsSection.querySelector('[data-labs-grid]');

  if (grid) {
    const fragment = document.createDocumentFragment();

    labsItems.forEach((item, index) => {
      const card = document.createElement('li');
      card.className = `labs-card labs-card--${item.accent}`;
      card.setAttribute('role', 'article');
      const titleId = `${item.id}-title`;
      card.setAttribute('aria-labelledby', titleId);
      card.dataset.reveal = '';
      card.dataset.revealIndex = String(index + 2); // head + subtitle occupy 0/1

      const statusLabel = document.createElement('span');
      statusLabel.className = `labs-status ${item.statusClass}`;
      statusLabel.textContent = item.status;
      statusLabel.setAttribute('aria-label', `Status: ${item.status}`);

      const iconWrap = document.createElement('div');
      iconWrap.className = 'labs-icon';
      iconWrap.innerHTML = item.icon;
      iconWrap.setAttribute('aria-hidden', 'true');

      const body = document.createElement('div');
      body.className = 'labs-card-body';

      const title = document.createElement('h3');
      title.className = 'labs-card-title';
      title.id = titleId;
      title.textContent = item.title;

      const blurb = document.createElement('p');
      blurb.className = 'labs-card-blurb';
      blurb.textContent = item.blurb;

      const cta = document.createElement('a');
      cta.className = 'labs-cta';
      cta.href = item.href;
      cta.textContent = 'Learn More';

      const rail = document.createElement('div');
      rail.className = 'labs-rail labs-rail--comet';

      body.append(title, blurb, cta, rail);

      card.append(iconWrap, statusLabel, body);

      fragment.appendChild(card);
    });

    grid.appendChild(fragment);
  }

  const starsContainer = labsSection.querySelector('.labs-stars');

  if (starsContainer && !starsContainer.dataset.built) {
    const orbNode = starsContainer.querySelector('.labs-orb');
    const fragment = document.createDocumentFragment();

    const randomBetween = (min, max) => Math.random() * (max - min) + min;
    const starColors = [
      'rgba(255, 228, 255, 0.88)',
      'rgba(182, 140, 255, 0.92)',
      'rgba(255, 186, 232, 0.94)',
      'rgba(214, 192, 255, 0.9)'
    ];
    const glowColors = [
      'rgba(255, 160, 220, 0.34)',
      'rgba(198, 144, 255, 0.32)',
      'rgba(255, 190, 150, 0.28)'
    ];
    const baseStarRange = { min: 48, max: 72 };
    const baseGlowRange = { min: 8, max: 12 };
    const densityMultiplier = desktopMedia.matches ? 4 : 2;

    const createPoint = (className, options) => {
      const el = document.createElement('span');
      el.className = className;
      el.style.setProperty('--left', `${options.left.toFixed(2)}%`);
      el.style.setProperty('--top', `${options.top.toFixed(2)}%`);
      el.style.setProperty('--size', `${options.size.toFixed(2)}px`);
      el.style.setProperty('--twinkle-duration', `${options.duration.toFixed(2)}s`);
      el.style.setProperty('--twinkle-delay', `${options.delay.toFixed(2)}s`);
      el.style.setProperty('--twinkle-min', options.twinkleMin.toFixed(2));
      el.style.setProperty('--twinkle-max', options.twinkleMax.toFixed(2));
      if (options.color) {
        el.style.setProperty('--color', options.color);
      }
      if (options.glowColor) {
        el.style.setProperty('--glow-color', options.glowColor);
      }
      if (options.blur) {
        el.style.setProperty('--blur', `${options.blur.toFixed(2)}px`);
      }
      fragment.appendChild(el);
    };

    const starMin = baseStarRange.min * densityMultiplier;
    const starMax = baseStarRange.max * densityMultiplier;
    const starCount = Math.floor(randomBetween(starMin, starMax + 1));
    for (let i = 0; i < starCount; i += 1) {
      const minOpacity = randomBetween(0.32, 0.52);
      const maxOpacity = Math.min(minOpacity + randomBetween(0.18, 0.32), 0.95);
      createPoint('labs-star', {
        left: randomBetween(-4, 104),
        top: randomBetween(-6, 106),
        size: randomBetween(1, 2.2),
        duration: randomBetween(2.5, 5),
        delay: randomBetween(0, 3),
        twinkleMin: minOpacity,
        twinkleMax: maxOpacity,
        color: starColors[Math.floor(Math.random() * starColors.length)]
      });
    }

    const glowMin = baseGlowRange.min * densityMultiplier;
    const glowMax = baseGlowRange.max * densityMultiplier;
    const glowCount = Math.floor(randomBetween(glowMin, glowMax + 1));
    for (let i = 0; i < glowCount; i += 1) {
      const minOpacity = randomBetween(0.18, 0.32);
      const maxOpacity = Math.min(minOpacity + randomBetween(0.16, 0.28), 0.78);
      createPoint('labs-glow', {
        left: randomBetween(-8, 108),
        top: randomBetween(-12, 112),
        size: randomBetween(3.2, 6.4),
        duration: randomBetween(3, 5.4),
        delay: randomBetween(0, 3),
        twinkleMin: minOpacity,
        twinkleMax: maxOpacity,
        glowColor: glowColors[Math.floor(Math.random() * glowColors.length)],
        blur: randomBetween(4, 8)
      });
    }

    requestAnimationFrame(() => {
      if (orbNode) {
        starsContainer.insertBefore(fragment, orbNode);
      } else {
        starsContainer.appendChild(fragment);
      }
      starsContainer.dataset.built = 'true';
    });
  }

  const isRailStatic = labsSection.classList.contains('rail-static');
  const revealItems = Array.from(labsSection.querySelectorAll('[data-reveal]'));
  const seen = new WeakSet();
  const cometCooldowns = new WeakMap();
  const COMET_COOLDOWN = 2000;

  const canPlayComet = () => !isRailStatic && !isReducedMotion.matches;

  const playComet = (rail) => {
    if (!rail || !canPlayComet()) return;
    rail.classList.remove('is-playing');
    requestAnimationFrame(() => {
      if (!canPlayComet()) return;
      rail.classList.add('is-playing');
    });
  };

  const attemptComet = (card, rail, force = false) => {
    if (!rail || !canPlayComet()) return;
    const now = performance.now();
    const last = cometCooldowns.get(card) || 0;
    if (!force && now - last < COMET_COOLDOWN) return;
    cometCooldowns.set(card, now);
    playComet(rail);
  };

  if (revealItems.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        observer.unobserve(entry.target);
        if (seen.has(entry.target)) return;
        seen.add(entry.target);

        const index = Number(entry.target.dataset.revealIndex || 0);
        const delay = Math.min(60 + index * 18, 200);

        requestAnimationFrame(() => {
          window.setTimeout(() => {
            entry.target.classList.add('is-in');
            if (entry.target.classList.contains('labs-card')) {
              entry.target.classList.add('has-seen');
              const rail = entry.target.querySelector('.labs-rail--comet');
              attemptComet(entry.target, rail, true);
            }
          }, delay);
        });
      });
    }, {
      rootMargin: '0px 0px -10%',
      threshold: 0.12
    });

    revealItems.forEach((item) => observer.observe(item));

    const cleanup = () => observer.disconnect();
    window.addEventListener('beforeunload', cleanup, { once: true });
  }

  const cards = Array.from(labsSection.querySelectorAll('.labs-card'));
  cards.forEach((card) => {
    const rail = card.querySelector('.labs-rail--comet');

    if (rail) {
      rail.addEventListener('animationend', (event) => {
        if (event.animationName === 'labs-comet-pass') {
          rail.classList.remove('is-playing');
        }
      });
    }

    card.addEventListener('pointerenter', () => {
      card.classList.add('is-hovered');
      attemptComet(card, rail);
    });

    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-hovered');
    });

    card.addEventListener('focusin', () => {
      card.classList.add('is-hovered');
      attemptComet(card, rail);
    });

    card.addEventListener('focusout', () => {
      card.classList.remove('is-hovered');
    });
  });

  isReducedMotion.addEventListener('change', () => {
    if (!isReducedMotion.matches) return;
    cards.forEach((card) => {
      const rail = card.querySelector('.labs-rail--comet');
      if (rail) {
        rail.classList.remove('is-playing');
      }
    });
  });

  const orb = labsSection.querySelector('[data-labs-orb]');
  let rafId = null;

  const applyParallax = () => {
    rafId = null;
    if (!orb) return;
    const allowMotion = !isReducedMotion.matches && desktopMedia.matches;
    if (!allowMotion) {
      orb.style.transform = 'translate3d(0, 0, 0)';
      return;
    }

    const rect = labsSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;
    const progress = Math.min(Math.max(1 - (rect.top + rect.height * 0.5) / (viewportHeight + rect.height), -1), 1);
    const offsetY = Math.max(Math.min(progress * 12, 10), -10);
    const offsetX = Math.max(Math.min(progress * 6, 5), -5);
    orb.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
  };

  const requestParallax = () => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(applyParallax);
  };

  const cleanupParallax = () => {
    window.removeEventListener('scroll', requestParallax);
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const bindParallax = () => {
    if (!orb) return;
    cleanupParallax();
    if (isReducedMotion.matches || !desktopMedia.matches) {
      orb.style.transform = 'translate3d(0, 0, 0)';
      return;
    }

    window.addEventListener('scroll', requestParallax, { passive: true });
    requestParallax();
  };

  bindParallax();

  isReducedMotion.addEventListener('change', bindParallax);
  desktopMedia.addEventListener('change', bindParallax);

  window.addEventListener('resize', requestParallax, { passive: true });
}
