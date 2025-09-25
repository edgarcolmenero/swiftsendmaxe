(function () {
  const PROCESS_DATA = {
    discover: {
      num: '01',
      label: 'DISCOVER',
      title: 'Align on the mission',
      copy: 'Stakeholder interviews, metrics, and constraints shape an achievable roadmap.',
      body: 'Stakeholder interviews, metrics, and constraints shape an achievable roadmap.',
      bullets: [
        'Business goals + constraints mapping',
        'Technical + data audit',
        'Roadmap + estimate buy-in',
      ],
      accent: 'discover',
      accentRgb: '45, 139, 255',
      accentRgbAlt: '29, 229, 255',
    },
    design: {
      num: '02',
      label: 'DESIGN',
      title: 'Design the experience',
      copy: 'Flows, prototypes, and system design make the product tangible fast.',
      body: 'Flows, prototypes, and system design make the product tangible fast.',
      bullets: [
        'UX flows + prototypes',
        'System design & API contracts',
        'Feasibility + fast iterations',
      ],
      accent: 'design',
      accentRgb: '162, 72, 255',
      accentRgbAlt: '255, 100, 242',
    },
    build: {
      num: '03',
      label: 'BUILD',
      title: 'Ship in integrated sprints',
      copy: 'Full-stack teams deliver production-ready slices with QA and automation baked in.',
      body: 'Full-stack teams deliver production-ready slices with QA and automation baked in.',
      bullets: [
        'Sprint slices to prod',
        'Automated testing & CI',
        'Observability from day one',
      ],
      accent: 'build',
      accentRgb: '255, 138, 60',
      accentRgbAlt: '255, 69, 84',
    },
    launch: {
      num: '04',
      label: 'LAUNCH',
      title: 'Launch & optimize',
      copy: 'We orchestrate go-live, train teams, and monitor performance to iterate quickly.',
      body: 'We orchestrate go-live, train teams, and monitor performance to iterate quickly.',
      bullets: [
        'Go-live & training',
        'KPIs & dashboards',
        'Continuous optimization',
      ],
      accent: 'launch',
      accentRgb: '68, 242, 141',
      accentRgbAlt: '30, 203, 121',
    },
  };

  const STAGGER_STEP = 0.08;
  const ACCENT_CLASSES = Object.keys(PROCESS_DATA).map((slug) => `is-${slug}`);

  const initProcess = () => {
    const section = document.getElementById('process') || document.querySelector('[data-process-section]');
    if (!section) return;

    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const signal = controller ? controller.signal : undefined;

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = () => reduceMotionQuery.matches;

    const randomInRange = (min, max) => Math.random() * (max - min) + min;
    const randomIntInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const isCompactViewport = () => {
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth || section.clientWidth || 0;
      return viewportWidth < 768;
    };

    const starsHost = section.querySelector('.process-stars');
    let starsRenderPending = false;
    let pendingForceStars = false;
    let lastStarsConfigKey = '';

    const renderStars = (force = false) => {
      if (!starsHost) return;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth || section.clientWidth || 0;
      const isCompact = viewportWidth < 768;
      const reducedMotion = prefersReducedMotion();
      const configKey = `${isCompact ? 'compact' : 'full'}|${reducedMotion ? 'reduce' : 'motion'}`;
      if (!force && configKey === lastStarsConfigKey) {
        return;
      }
      lastStarsConfigKey = configKey;

      const starsRange = isCompact ? [48, 72] : [96, 144];
      const glowsRange = isCompact ? [8, 12] : [16, 24];
      const totalStars = randomIntInRange(starsRange[0], starsRange[1]);
      const totalGlows = randomIntInRange(glowsRange[0], glowsRange[1]);

      const shouldAnimate = !reducedMotion;
      const fragment = document.createDocumentFragment();
      starsHost.innerHTML = '';

      for (let i = 0; i < totalStars; i += 1) {
        const star = document.createElement('span');
        star.className = 'process-star';
        star.style.setProperty('--x', `${randomInRange(0, 100).toFixed(2)}%`);
        star.style.setProperty('--y', `${randomInRange(0, 100).toFixed(2)}%`);
        const size = randomInRange(1.2, 3);
        star.style.setProperty('--size', `${size.toFixed(2)}px`);
        const opacity = randomInRange(0.4, 0.9);
        star.style.setProperty('--opacity', opacity.toFixed(2));

        if (shouldAnimate && Math.random() > 0.32) {
          star.classList.add('process-star--twinkle');
          star.style.setProperty('--twinkle-duration', `${randomInRange(2.6, 5).toFixed(2)}s`);
          star.style.setProperty('--twinkle-delay', `${randomInRange(0, 5).toFixed(2)}s`);
        }

        fragment.appendChild(star);
      }

      for (let i = 0; i < totalGlows; i += 1) {
        const glow = document.createElement('span');
        glow.className = 'process-star process-star--glow';
        glow.style.setProperty('--x', `${randomInRange(0, 100).toFixed(2)}%`);
        glow.style.setProperty('--y', `${randomInRange(0, 100).toFixed(2)}%`);
        const size = isCompact ? randomInRange(10, 16) : randomInRange(18, 26);
        const opacity = isCompact ? randomInRange(0.16, 0.32) : randomInRange(0.2, 0.42);
        glow.style.setProperty('--size', `${size.toFixed(2)}px`);
        glow.style.setProperty('--glow-opacity', opacity.toFixed(2));
        glow.style.setProperty('--opacity', opacity.toFixed(2));

        if (shouldAnimate && Math.random() > 0.45) {
          glow.classList.add('process-star--twinkle');
          glow.style.setProperty('--twinkle-duration', `${randomInRange(2.8, 5.4).toFixed(2)}s`);
          glow.style.setProperty('--twinkle-delay', `${randomInRange(0, 4.2).toFixed(2)}s`);
        }

        fragment.appendChild(glow);
      }

      starsHost.appendChild(fragment);
    };

    const scheduleStarRender = ({ force = false } = {}) => {
      if (!starsHost) return;
      pendingForceStars = pendingForceStars || force;
      if (starsRenderPending) return;
      starsRenderPending = true;
      window.requestAnimationFrame(() => {
        starsRenderPending = false;
        const shouldForce = pendingForceStars;
        pendingForceStars = false;
        renderStars(shouldForce);
      });
    };

    if (starsHost) {
      scheduleStarRender({ force: true });
    }

    const toggleSectionVisibility = (isVisible) => {
      section.classList.toggle('is-visible', Boolean(isVisible));
    };

    const computeInitialVisibility = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
      return rect.bottom > 0 && rect.right > 0 && rect.top < viewportHeight && rect.left < viewportWidth;
    };

    let sectionVisibilityObserver;
    if (typeof IntersectionObserver === 'function') {
      sectionVisibilityObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.target !== section) return;
            toggleSectionVisibility(entry.isIntersecting);
          });
        },
        { threshold: 0.2 }
      );
      sectionVisibilityObserver.observe(section);
      toggleSectionVisibility(computeInitialVisibility());
    } else {
      toggleSectionVisibility(true);
    }

    const revealTargets = Array.from(section.querySelectorAll('[data-reveal]'));
    revealTargets.forEach((target, index) => {
      target.style.setProperty('--process-reveal-delay', `${(index * STAGGER_STEP).toFixed(2)}s`);
      if (section.classList.contains('has-seen')) {
        target.classList.add('is-in');
      }
    });

    const stepArticles = Array.from(section.querySelectorAll('[data-process-step]'));
    const buttons = stepArticles.map((article) => article.querySelector('.process-step-button')).filter(Boolean);
    if (!buttons.length) {
      if (controller) controller.abort();
      if (sectionVisibilityObserver) sectionVisibilityObserver.disconnect();
      return;
    }

    const slugForIndex = stepArticles.map((article, index) => {
      const slugAttr = article.getAttribute('data-step-slug');
      if (slugAttr && PROCESS_DATA[slugAttr]) {
        return slugAttr;
      }
      const button = buttons[index];
      if (button && button.id) {
        const match = button.id.match(/process-step-(.+)/);
        if (match && PROCESS_DATA[match[1]]) {
          return match[1];
        }
      }
      const fallback = Object.keys(PROCESS_DATA)[index];
      return fallback || Object.keys(PROCESS_DATA)[0];
    });

    stepArticles.forEach((article, index) => {
      const slug = slugForIndex[index];
      const button = buttons[index];
      const data = PROCESS_DATA[slug];
      if (!data || !button) return;
      article.classList.add(`process-step--${slug}`);
      const badgeNum = button.querySelector('.process-step__badge-num');
      if (badgeNum) badgeNum.textContent = data.num || '';
      const badgeLabel = button.querySelector('.process-step__badge-label');
      if (badgeLabel) badgeLabel.textContent = (data.label || '').toString();
      const titleEl = button.querySelector('.process-step__title');
      if (titleEl) titleEl.textContent = data.title || '';
      const copyEl = button.querySelector('.process-step__copy');
      if (copyEl) copyEl.textContent = data.copy || data.body || '';
    });

    const card = section.querySelector('[data-process-detail]');
    const cardElements = card
      ? {
          badgeNum: card.querySelector('.process-badge-num'),
          badgeLabel: card.querySelector('.process-badge-label'),
          title: card.querySelector('.process-detail-title'),
          body: card.querySelector('.process-detail-body'),
          list: card.querySelector('.process-detail-list'),
        }
      : null;

    const baseline = section.querySelector('.process-baseline');
    const baselineFill = section.querySelector('[data-process-baseline-fill], .process-baseline__fill');
    const runner = section.querySelector('[data-process-runner]');
    const stepsHost = section.querySelector('.process-steps');
    let bubble = baseline ? baseline.querySelector('.process-bubble') : null;
    if (baseline && !bubble) {
      bubble = document.createElement('span');
      bubble.className = 'process-bubble';
      bubble.setAttribute('aria-hidden', 'true');
      baseline.appendChild(bubble);
    }

    let bubbleRAF = 0;
    let lastBubbleEmit = 0;
    const bubbleCooldown = 600;

    const updateDetailCard = (slug) => {
      if (!cardElements) return;
      const data = PROCESS_DATA[slug];
      if (!data) return;
      if (cardElements.badgeNum) cardElements.badgeNum.textContent = data.num || '';
      if (cardElements.badgeLabel) cardElements.badgeLabel.textContent = (data.label || '').toString();
      if (cardElements.title) cardElements.title.textContent = data.title || '';
      if (cardElements.body) cardElements.body.textContent = data.body || '';
      if (cardElements.list) {
        cardElements.list.innerHTML = '';
        if (Array.isArray(data.bullets)) {
          data.bullets.forEach((bullet) => {
            const item = document.createElement('li');
            item.textContent = bullet;
            cardElements.list.appendChild(item);
          });
        }
      }
    };

    const applyCardAccent = (slug) => {
      if (!card) return;
      ACCENT_CLASSES.forEach((className) => card.classList.remove(className));
      const data = PROCESS_DATA[slug];
      if (data && data.accent) {
        card.classList.add(`is-${data.accent}`);
      }
    };

    const applyAccentVariables = (slug) => {
      const data = PROCESS_DATA[slug];
      if (!data) return;
      const accentRgb = data.accentRgb || '';
      if (runner) {
        runner.style.setProperty('--runner-accent-rgb', accentRgb);
      }
      if (baselineFill) {
        baselineFill.style.setProperty('--runner-accent-rgb', accentRgb);
      }
      if (bubble) {
        bubble.style.setProperty('--runner-accent-rgb', accentRgb);
      }
    };

    const playCardSwap = (skipAnimation) => {
      if (!card) return;
      card.classList.remove('is-swapping');
      if (skipAnimation) return;
      void card.offsetWidth;
      card.classList.add('is-swapping');
    };

    const measureAndEmitBubble = (index, { allowEmit = true } = {}) => {
      if (!baseline || !bubble || !buttons[index] || isCompactViewport()) return;
      const baselineRect = baseline.getBoundingClientRect();
      const targetRect = buttons[index].getBoundingClientRect();
      if (!baselineRect.width) return;
      const centerX = targetRect.left + targetRect.width / 2;
      const offsetX = clamp(centerX - baselineRect.left, 0, baselineRect.width);
      bubble.style.setProperty('--bubble-x', `${offsetX.toFixed(2)}px`);
      const scale = clamp(targetRect.width / 28, 7, 9);
      bubble.style.setProperty('--bubble-scale', scale.toFixed(2));
      if (!allowEmit) return;
      const now = typeof performance !== 'undefined' && typeof performance.now === 'function' ? performance.now() : Date.now();
      if (now - lastBubbleEmit < bubbleCooldown) return;
      lastBubbleEmit = now;
      bubble.classList.remove('process-bubble-emit');
      void bubble.offsetWidth;
      bubble.classList.add('process-bubble-emit');
    };

    const scheduleBubbleUpdate = (index, { allowEmit = true } = {}) => {
      if (!baseline || !bubble || !buttons[index] || isCompactViewport()) return;
      window.cancelAnimationFrame(bubbleRAF);
      bubbleRAF = window.requestAnimationFrame(() => {
        bubbleRAF = 0;
        measureAndEmitBubble(index, { allowEmit });
      });
    };

    const updateBaselineFill = (index) => {
      if (!baselineFill || !buttons[index]) return;
      if (isCompactViewport()) {
        const total = buttons.length;
        const progress = total > 1 ? index / (total - 1) : 1;
        baselineFill.style.width = '100%';
        baselineFill.style.setProperty('--process-baseline-progress', progress.toFixed(4));
        return;
      }
      const trackRect = baselineFill.parentElement ? baselineFill.parentElement.getBoundingClientRect() : baseline.getBoundingClientRect();
      const targetRect = buttons[index].getBoundingClientRect();
      if (!trackRect.width) return;
      const width = clamp(targetRect.left + targetRect.width / 2 - trackRect.left, 0, trackRect.width);
      baselineFill.style.height = '100%';
      baselineFill.style.width = `${Math.round(width)}px`;
      baselineFill.style.setProperty('--process-baseline-progress', '1');
      baselineFill.style.setProperty('--process-baseline-fill', `${Math.round(width)}px`);
    };

    const runnerHasTransform = () => runner && runner.style && typeof runner.style.transform === 'string';

    const applyRunnerPosition = (index, { immediate = false } = {}) => {
      if (!runner || !buttons[index] || isCompactViewport()) return;
      const parent = runner.parentElement || section;
      const parentRect = parent.getBoundingClientRect();
      const targetRect = buttons[index].getBoundingClientRect();
      const runnerWidth = runner.offsetWidth || 0;
      const x = targetRect.left + targetRect.width / 2 - parentRect.left - runnerWidth / 2;
      const setTransform = () => {
        const rounded = Math.round(x);
        runner.style.setProperty('--runner-x', `${rounded}px`);
        runner.style.transform = `translate3d(${rounded}px, 0, 0)`;
      };
      if (prefersReducedMotion() || immediate || !runnerHasTransform()) {
        const previousTransition = runner.style.transition;
        runner.style.transition = 'none';
        setTransform();
        void runner.offsetWidth;
        runner.style.transition = previousTransition;
      } else {
        setTransform();
      }
    };

    let resizeRAF = 0;
    const refreshGeometry = ({ immediate = false } = {}) => {
      window.cancelAnimationFrame(resizeRAF);
      resizeRAF = window.requestAnimationFrame(() => {
        resizeRAF = 0;
        updateBaselineFill(activeIndex);
        if (!isCompactViewport()) {
          applyRunnerPosition(activeIndex, { immediate });
          measureAndEmitBubble(activeIndex, { allowEmit: false });
        }
      });
    };

    const setAriaCurrent = (index) => {
      buttons.forEach((button, idx) => {
        if (!button) return;
        button.setAttribute('aria-current', idx === index ? 'step' : 'false');
      });
    };

    const stepsHostScroll = stepsHost;
    const scrollActiveIntoView = (index) => {
      if (!stepsHostScroll || !isCompactViewport()) return;
      const article = stepArticles[index];
      if (!article) return;
      const behavior = prefersReducedMotion() ? 'auto' : 'smooth';
      article.scrollIntoView({ block: 'nearest', inline: 'center', behavior });
    };

    let activeIndex = stepArticles.findIndex((article) => article.classList.contains('is-active'));
    if (activeIndex < 0) {
      activeIndex = buttons.findIndex((button) => button.getAttribute('aria-current') === 'step');
    }
    if (activeIndex < 0) activeIndex = 0;

    const setActiveStep = (index, { focus = false, immediate = false } = {}) => {
      if (!buttons.length) return;
      const total = buttons.length;
      const nextIndex = ((index % total) + total) % total;
      if (activeIndex === nextIndex && !immediate) return;
      const previousIndex = activeIndex;
      activeIndex = nextIndex;
      stepArticles.forEach((article, idx) => {
        article.classList.toggle('is-active', idx === nextIndex);
      });
      setAriaCurrent(nextIndex);
      const slug = slugForIndex[nextIndex];
      applyAccentVariables(slug);
      updateDetailCard(slug);
      applyCardAccent(slug);
      playCardSwap(immediate || previousIndex === nextIndex);
      updateBaselineFill(nextIndex);
      if (!isCompactViewport()) {
        applyRunnerPosition(nextIndex, { immediate });
        scheduleBubbleUpdate(nextIndex, { allowEmit: !immediate });
      }
      scrollActiveIntoView(nextIndex);
      if (focus) {
        buttons[nextIndex].focus();
      }
    };

    buttons.forEach((button, index) => {
      if (!button) return;
      button.setAttribute('type', 'button');
      button.addEventListener(
        'click',
        () => {
          setActiveStep(index, { focus: false });
        },
        { signal }
      );
      button.addEventListener(
        'keydown',
        (event) => {
          if (event.defaultPrevented) return;
          switch (event.key) {
            case 'ArrowRight':
            case 'ArrowDown': {
              event.preventDefault();
              setActiveStep(index + 1, { focus: true });
              break;
            }
            case 'ArrowLeft':
            case 'ArrowUp': {
              event.preventDefault();
              setActiveStep(index - 1, { focus: true });
              break;
            }
            case 'Home': {
              event.preventDefault();
              setActiveStep(0, { focus: true });
              break;
            }
            case 'End': {
              event.preventDefault();
              setActiveStep(buttons.length - 1, { focus: true });
              break;
            }
            default:
          }
        },
        { signal }
      );
    });

    if (stepsHostScroll) {
      let swipeState = null;
      stepsHostScroll.addEventListener(
        'pointerdown',
        (event) => {
          if (!isCompactViewport()) return;
          if (event.pointerType && event.pointerType !== 'touch' && event.pointerType !== 'pen') return;
          swipeState = {
            id: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            startTime: typeof performance !== 'undefined' && typeof performance.now === 'function' ? performance.now() : Date.now(),
          };
          stepsHostScroll.setPointerCapture(event.pointerId);
        },
        { signal }
      );

      stepsHostScroll.addEventListener(
        'pointermove',
        (event) => {
          if (!swipeState || event.pointerId !== swipeState.id) return;
          swipeState.lastX = event.clientX;
          swipeState.lastY = event.clientY;
        },
        { signal, passive: true }
      );

      const handleSwipeEnd = (event) => {
        if (!swipeState || event.pointerId !== swipeState.id) return;
        stepsHostScroll.releasePointerCapture(event.pointerId);
        const endX = event.clientX;
        const endY = event.clientY;
        const dx = endX - swipeState.startX;
        const dy = endY - swipeState.startY;
        const dt =
          (typeof performance !== 'undefined' && typeof performance.now === 'function' ? performance.now() : Date.now()) -
          swipeState.startTime;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        const velocity = dt > 0 ? absDx / dt : 0;
        const distanceThreshold = 40;
        const velocityThreshold = 0.35;
        if (absDx > absDy && (absDx > distanceThreshold || velocity > velocityThreshold)) {
          if (dx < 0) {
            setActiveStep(activeIndex + 1, { focus: false });
          } else if (dx > 0) {
            setActiveStep(activeIndex - 1, { focus: false });
          }
        }
        swipeState = null;
      };

      stepsHostScroll.addEventListener('pointerup', handleSwipeEnd, { signal });
      stepsHostScroll.addEventListener('pointercancel', handleSwipeEnd, { signal });
    }

    let previousCompact = isCompactViewport();

    const handleResize = () => {
      scheduleStarRender();
      const compact = isCompactViewport();
      if (compact !== previousCompact) {
        previousCompact = compact;
        setActiveStep(activeIndex, { immediate: true });
      } else {
        refreshGeometry({ immediate: true });
      }
      if (!compact) {
        scheduleBubbleUpdate(activeIndex, { allowEmit: false });
      }
    };

    const handleReduceMotionChange = () => {
      scheduleStarRender({ force: true });
      refreshGeometry({ immediate: true });
    };

    window.addEventListener('resize', handleResize, { signal });
    window.addEventListener('orientationchange', handleResize, { signal });

    if (typeof reduceMotionQuery.addEventListener === 'function') {
      reduceMotionQuery.addEventListener('change', handleReduceMotionChange, { signal });
    } else if (typeof reduceMotionQuery.addListener === 'function') {
      reduceMotionQuery.addListener(handleReduceMotionChange);
      if (controller && signal) {
        signal.addEventListener('abort', () => {
          reduceMotionQuery.removeListener(handleReduceMotionChange);
        });
      }
    }

    let revealObserver;
    const markRevealTargets = () => {
      section.classList.add('is-in');
      revealTargets.forEach((target) => target.classList.add('is-in'));
    };

    const triggerReveal = () => {
      if (section.classList.contains('has-seen')) return;
      section.classList.add('has-seen');
      markRevealTargets();
      if (!isCompactViewport()) {
        window.requestAnimationFrame(() => {
          refreshGeometry({ immediate: true });
          applyRunnerPosition(activeIndex, { immediate: true });
        });
      }
      if (revealObserver) {
        revealObserver.disconnect();
      }
    };

    if (section.classList.contains('has-seen')) {
      markRevealTargets();
    } else if (typeof IntersectionObserver === 'function') {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.target === section && entry.isIntersecting) {
              triggerReveal();
            }
          });
        },
        { threshold: 0.2, rootMargin: '0px 0px -12% 0px' }
      );
      revealObserver.observe(section);
      if (computeInitialVisibility()) {
        triggerReveal();
      }
    } else {
      triggerReveal();
    }

    const cleanup = () => {
      if (controller) {
        controller.abort();
      }
      if (sectionVisibilityObserver) {
        sectionVisibilityObserver.disconnect();
      }
      if (revealObserver) {
        revealObserver.disconnect();
      }
      window.cancelAnimationFrame(resizeRAF);
      window.cancelAnimationFrame(bubbleRAF);
    };

    window.addEventListener('pagehide', cleanup, { once: true });
    window.addEventListener('beforeunload', cleanup, { once: true });

    section.classList.add('is-enhanced');

    const initialSlug = slugForIndex[activeIndex];
    applyAccentVariables(initialSlug);
    updateDetailCard(initialSlug);
    applyCardAccent(initialSlug);
    setAriaCurrent(activeIndex);
    setActiveStep(activeIndex, { immediate: true });
    refreshGeometry({ immediate: true });
    if (!isCompactViewport()) {
      scheduleBubbleUpdate(activeIndex, { allowEmit: false });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProcess, { once: true });
  } else {
    initProcess();
  }
})();
