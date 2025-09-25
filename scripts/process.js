(function () {
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

    const starsHost = section.querySelector('.process-stars');
    let starsRenderPending = false;
    let pendingForceStars = false;
    let lastStarsConfigKey = '';
    const toggleSectionVisibility = (isVisible) => {
      section.classList.toggle('is-visible', Boolean(isVisible));
    };
    let sectionVisibilityObserver;

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
        const size = randomInRange(1.4, 3.4);
        star.style.setProperty('--size', `${size.toFixed(2)}px`);
        const opacity = randomInRange(0.42, 0.95);
        star.style.setProperty('--opacity', opacity.toFixed(2));

        if (shouldAnimate && Math.random() > 0.28) {
          star.classList.add('process-star--twinkle');
          star.style.setProperty('--twinkle-duration', `${randomInRange(2.5, 5).toFixed(2)}s`);
          star.style.setProperty('--twinkle-delay', `${randomInRange(0, 5).toFixed(2)}s`);
        }

        fragment.appendChild(star);
      }

      for (let i = 0; i < totalGlows; i += 1) {
        const glow = document.createElement('span');
        glow.className = 'process-star process-star--glow';
        glow.style.setProperty('--x', `${randomInRange(0, 100).toFixed(2)}%`);
        glow.style.setProperty('--y', `${randomInRange(0, 100).toFixed(2)}%`);
        const size = randomInRange(16, 34);
        const opacity = randomInRange(0.22, 0.48);
        glow.style.setProperty('--size', `${size.toFixed(2)}px`);
        glow.style.setProperty('--glow-opacity', opacity.toFixed(2));
        glow.style.setProperty('--opacity', opacity.toFixed(2));

        if (shouldAnimate && Math.random() > 0.45) {
          glow.classList.add('process-star--twinkle');
          glow.style.setProperty('--twinkle-duration', `${randomInRange(2.5, 5).toFixed(2)}s`);
          glow.style.setProperty('--twinkle-delay', `${randomInRange(0, 5).toFixed(2)}s`);
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

    const computeInitialVisibility = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
      return rect.bottom > 0 && rect.right > 0 && rect.top < viewportHeight && rect.left < viewportWidth;
    };

    if (typeof IntersectionObserver === 'function') {
      sectionVisibilityObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.target !== section) return;
            toggleSectionVisibility(entry.isIntersecting);
          });
        },
        {
          threshold: 0.2,
        }
      );
      sectionVisibilityObserver.observe(section);
      toggleSectionVisibility(computeInitialVisibility());
    } else {
      toggleSectionVisibility(true);
    }

    const stepData = new Map([
      [
        'discover',
        {
          number: '01',
          label: 'Discover & Align',
          title: 'Align on the mission',
          body:
            'Stakeholder interviews, system audits, and success metrics give us a 360° view. We scope intelligently and align the engagement around measurable outcomes.',
          copy: 'Stakeholder interviews, metrics, and constraints shape an achievable roadmap.',
          bullets: [
            'Business goals + constraints mapping',
            'Technical + data audit',
            'Roadmap + estimate buy-in',
          ],
          accent: 'discover',
          badge: 'Discover',
        },
      ],
      [
        'design',
        {
          number: '02',
          label: 'Design the Experience',
          title: 'Design the experience',
          body:
            'We translate requirements into flows, wireframes, and interface systems that feel fast and intuitive. Content, UX, and dev collaborate in real time.',
          copy: 'Flows, prototypes, and system design make the product tangible fast.',
          bullets: [
            'Service blueprints & user journeys',
            'Interactive prototypes',
            'Feedback loops with stakeholders',
          ],
          accent: 'design',
          badge: 'Design',
        },
      ],
      [
        'build',
        {
          number: '03',
          label: 'Build in Sprints',
          title: 'Ship in integrated sprints',
          body:
            'Engineers ship in short sprint cycles, pairing with QA to ensure quality. Automation, data wiring, and infrastructure land together.',
          copy: 'Full-stack teams deliver production-ready slices with QA and automation baked in.',
          bullets: [
            'Agile sprints with demo-ready drops',
            'Automated testing & observability',
            'Integrated data + AI layers',
          ],
          accent: 'build',
          badge: 'Build',
        },
      ],
      [
        'launch',
        {
          number: '04',
          label: 'Launch with Confidence',
          title: 'Launch & optimize',
          body:
            'We prep infrastructure, train teams, and execute the go-live plan. Performance is monitored so we can react quickly.',
          copy: 'We orchestrate go-live, train teams, and monitor performance to iterate quickly.',
          bullets: [
            'Playbooks for deployment & rollback',
            'Support + training sessions',
            'Performance dashboards',
          ],
          accent: 'launch',
          badge: 'Launch',
        },
      ],
    ]);

    const isCompactViewport = () => {
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth || section.clientWidth || 0;
      return viewportWidth < 768;
    };

    const revealables = Array.from(section.querySelectorAll('[data-process-reveal]'));
    const revealDelayStep = Number(section.getAttribute('data-process-reveal-step') || 0.09);

    revealables.forEach((element, index) => {
      element.style.setProperty('--process-reveal-delay', `${(index * revealDelayStep).toFixed(2)}s`);
    });

    let revealObserver;
    if (revealables.length) {
      const pending = new Set(revealables);
      const handleIntersection = (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target;
          target.classList.add('is-visible');
          pending.delete(target);
          revealObserver.unobserve(target);
        });
        if (!pending.size) {
          revealObserver.disconnect();
        }
      };

      revealObserver = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.35,
      });

      revealables.forEach((element) => revealObserver.observe(element));
    }

    const steps = Array.from(section.querySelectorAll('.process-step-button'));
    if (!steps.length) {
      if (revealObserver) revealObserver.disconnect();
      return;
    }

    const detail = section.querySelector('.process-detail');
    if (detail && !detail.hasAttribute('aria-live')) {
      detail.setAttribute('aria-live', 'polite');
    }

    const stepSlugs = steps.map((button, index) => {
      const identifier = button.id || '';
      const match = identifier.match(/process-step-(.+)/);
      return match ? match[1] : `step-${index}`;
    });

    const slugToIndex = new Map();
    stepSlugs.forEach((slug, index) => {
      if (!slugToIndex.has(slug)) {
        slugToIndex.set(slug, index);
      }
    });

    const detailAccentModifiers = Array.from(
      new Set(
        Array.from(stepData.values())
          .map((entry) => (entry && entry.accent ? `is-${entry.accent}` : null))
          .filter(Boolean)
      )
    );

    const accordionEntries = stepSlugs.map((slug) => {
      if (!slug) {
        return { slug: '', trigger: null, panel: null, item: null };
      }
      const trigger = detail ? detail.querySelector(`#process-accordion-${slug}`) : null;
      const panelId = trigger ? trigger.getAttribute('aria-controls') : null;
      const panel = panelId ? document.getElementById(panelId) : null;
      const item = trigger ? trigger.closest('[data-process-accordion-item], .process-accordion-item') : null;
      return { slug, trigger, panel, item };
    });

    const accordionBySlug = new Map();
    accordionEntries.forEach((entry) => {
      if (!entry || !entry.slug) return;
      accordionBySlug.set(entry.slug, entry);
      if (entry.trigger) {
        const expanded = entry.item ? entry.item.classList.contains('is-active') : false;
        entry.trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      }
    });

    const populateStepContent = (slug, button) => {
      if (!button) return;
      const data = stepData.get(slug);
      if (!data) return;

      const badge = button.querySelector('.process-step__badge');
      if (badge) {
        badge.innerHTML = '';
        const icon = document.createElement('span');
        icon.className = 'process-step__icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = data.number || '';
        badge.appendChild(icon);
        badge.appendChild(document.createTextNode(` ${data.badge || data.label || ''}`));
      }

      const titleEl = button.querySelector('.process-step__title');
      if (titleEl && data.title) {
        titleEl.textContent = data.title;
      }

      const copyEl = button.querySelector('.process-step__copy');
      if (copyEl && data.copy) {
        copyEl.textContent = data.copy;
      }
    };

    const populateDetailContent = (slug) => {
      const data = stepData.get(slug);
      const entry = slug ? accordionBySlug.get(slug) : null;
      if (!data || !entry) return;

      if (entry.trigger) {
        const numberEl = entry.trigger.querySelector('.process-accordion-number');
        if (numberEl) {
          numberEl.textContent = data.number || '';
        }
        const titleEl = entry.trigger.querySelector('.process-accordion-title');
        if (titleEl && data.label) {
          titleEl.textContent = data.label;
        }
      }

      if (entry.panel) {
        const panelTitle = entry.panel.querySelector('.process-panel__title');
        if (panelTitle && data.label) {
          panelTitle.textContent = data.label;
        }
        const panelBody = entry.panel.querySelector('.process-panel__body');
        if (panelBody && data.body) {
          panelBody.textContent = data.body;
        }
        const list = entry.panel.querySelector('.process-panel__list');
        if (list && Array.isArray(data.bullets)) {
          list.innerHTML = '';
          data.bullets.forEach((bullet) => {
            const item = document.createElement('li');
            item.textContent = bullet;
            list.appendChild(item);
          });
        }
      }
    };

    const applyDetailAccent = (slug) => {
      if (!detail) return;
      detailAccentModifiers.forEach((className) => {
        detail.classList.remove(className);
      });
      const data = stepData.get(slug);
      if (data && data.accent) {
        detail.classList.add(`is-${data.accent}`);
      }
    };

    const toggleAccordionState = (slug) => {
      accordionEntries.forEach((entry) => {
        if (!entry || !entry.slug) return;
        const isActive = entry.slug === slug;
        if (entry.item) {
          entry.item.classList.toggle('is-active', isActive);
        }
        if (entry.panel) {
          entry.panel.hidden = !isActive;
          entry.panel.classList.toggle('is-active', isActive);
        }
        if (entry.trigger) {
          entry.trigger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        }
      });
    };

    stepSlugs.forEach((slug, index) => {
      populateStepContent(slug, steps[index]);
      populateDetailContent(slug);
    });

    section.classList.add('is-enhanced');

    const runner = section.querySelector('[data-process-runner]');
    const baseline = section.querySelector('.process-baseline');
    const baselineFill = section.querySelector('[data-process-baseline-fill], .process-baseline__fill');
    const baselineTrack = baselineFill ? baselineFill.parentElement : null;
    let bubble = baseline ? baseline.querySelector('.process-bubble') : null;
    if (baseline && !bubble) {
      bubble = document.createElement('span');
      bubble.className = 'process-bubble';
      bubble.setAttribute('aria-hidden', 'true');
      baseline.appendChild(bubble);
    }
    const bubbleCooldown = 600;
    let lastBubbleEmit = 0;
    let bubbleRAF = 0;
    const measureAndEmitBubble = (index, { allowEmit = true } = {}) => {
      if (!baseline || !bubble || !steps[index] || isCompactViewport()) return;

      const baselineRect = baseline.getBoundingClientRect();
      const targetRect = steps[index].getBoundingClientRect();
      const hasBaseline = baselineRect.width || baselineRect.height;
      if (!hasBaseline) return;

      const isVertical = baselineRect.height > baselineRect.width;
      if (isVertical) {
        const centerY = targetRect.top + targetRect.height / 2;
        const offsetY = clamp(centerY - baselineRect.top, 0, baselineRect.height || 0);
        bubble.style.setProperty('--bubble-x', `${offsetY.toFixed(2)}px`);
      } else {
        const centerX = targetRect.left + targetRect.width / 2;
        const offsetX = clamp(centerX - baselineRect.left, 0, baselineRect.width || 0);
        bubble.style.setProperty('--bubble-x', `${offsetX.toFixed(2)}px`);
      }

      const referenceSize = isVertical ? targetRect.height : targetRect.width;
      const nextScale = clamp(referenceSize / 28, 7, 9);
      bubble.style.setProperty('--bubble-scale', nextScale.toFixed(2));

      if (!allowEmit) return;

      const now = typeof performance !== 'undefined' && typeof performance.now === 'function' ? performance.now() : Date.now();
      if (now - lastBubbleEmit < bubbleCooldown) {
        return;
      }

      lastBubbleEmit = now;
      bubble.classList.remove('process-bubble-emit');
      // Force reflow so the animation can restart when the class is re-added.
      void bubble.offsetWidth;
      bubble.classList.add('process-bubble-emit');
    };

    const scheduleBubbleUpdate = (index, { allowEmit = true } = {}) => {
      if (!baseline || !bubble || !steps[index] || isCompactViewport()) return;
      window.cancelAnimationFrame(bubbleRAF);
      bubbleRAF = window.requestAnimationFrame(() => {
        bubbleRAF = 0;
        measureAndEmitBubble(index, { allowEmit });
      });
    };
    let activeIndex = steps.findIndex((button) => button.getAttribute('aria-current') === 'step' || button.classList.contains('is-active'));
    if (activeIndex < 0) activeIndex = 0;

    let resizeRAF = 0;
    let previousCompact = isCompactViewport();

    const applyRunnerPosition = (index, { immediate = false } = {}) => {
      if (!runner || !steps[index] || isCompactViewport()) return;

      const parent = runner.parentElement || section;
      const parentRect = parent.getBoundingClientRect();
      const targetRect = steps[index].getBoundingClientRect();
      const runnerWidth = runner.offsetWidth || 0;
      const x = targetRect.left + targetRect.width / 2 - parentRect.left - runnerWidth / 2;

      const setTransform = () => {
        runner.style.setProperty('--runner-x', `${Math.round(x)}px`);
        runner.style.transform = `translate3d(${Math.round(x)}px, 0, 0)`;
      };

      if (prefersReducedMotion() || immediate) {
        const previousTransition = runner.style.transition;
        runner.style.transition = 'none';
        setTransform();
        // Force a reflow so the transition reset takes effect before restoring.
        void runner.offsetWidth;
        runner.style.transition = previousTransition;
      } else {
        setTransform();
      }
    };

    const updateBaselineFill = (index) => {
      if (!baselineFill || !baselineTrack || !steps[index] || isCompactViewport()) return;
      const trackRect = baselineTrack.getBoundingClientRect();
      const targetRect = steps[index].getBoundingClientRect();
      const isVertical = trackRect.height > trackRect.width;
      if (isVertical) {
        const height = clamp(targetRect.top + targetRect.height / 2 - trackRect.top, 0, trackRect.height || 0);
        baselineFill.style.height = `${Math.round(height)}px`;
        baselineFill.style.width = '100%';
        baselineFill.style.setProperty('--process-baseline-fill', `${Math.round(height)}px`);
        return;
      }

      const width = clamp(targetRect.left + targetRect.width / 2 - trackRect.left, 0, trackRect.width || 0);
      baselineFill.style.height = '100%';
      baselineFill.style.width = `${Math.round(width)}px`;
      baselineFill.style.setProperty('--process-baseline-fill', `${Math.round(width)}px`);
    };

    const refreshGeometry = (options = {}) => {
      window.cancelAnimationFrame(resizeRAF);
      if (isCompactViewport()) {
        resizeRAF = 0;
        return;
      }
      resizeRAF = window.requestAnimationFrame(() => {
        updateBaselineFill(activeIndex);
        applyRunnerPosition(activeIndex, options);
        measureAndEmitBubble(activeIndex, { allowEmit: false });
      });
    };

    const setActiveStep = (index, { focus = false, immediate = false } = {}) => {
      if (!steps.length) return;
      const nextIndex = ((index % steps.length) + steps.length) % steps.length;
      const compact = isCompactViewport();
      if (activeIndex === nextIndex && !immediate) {
        if (focus) steps[nextIndex].focus();
        if (!compact) {
          scheduleBubbleUpdate(nextIndex, { allowEmit: true });
        }
        return;
      }

      const previousButton = steps[activeIndex];
      if (previousButton) {
        previousButton.classList.remove('is-active');
        previousButton.removeAttribute('aria-current');
        previousButton.tabIndex = -1;
        const previousStepItem = previousButton.closest('[data-process-step], .process-step');
        if (previousStepItem) previousStepItem.classList.remove('is-active');
      }

      const nextButton = steps[nextIndex];
      const nextSlug = stepSlugs[nextIndex];

      if (detail) {
        populateDetailContent(nextSlug);
        applyDetailAccent(nextSlug);
      }

      toggleAccordionState(nextSlug);

      nextButton.classList.add('is-active');
      nextButton.setAttribute('aria-current', 'step');
      nextButton.tabIndex = 0;
      const nextStepItem = nextButton.closest('[data-process-step], .process-step');
      if (nextStepItem) nextStepItem.classList.add('is-active');

      activeIndex = nextIndex;
      section.setAttribute('data-process-active-index', String(activeIndex));

      if (!compact) {
        refreshGeometry({ immediate });
        scheduleBubbleUpdate(nextIndex, { allowEmit: !immediate });
      }

      if (focus) {
        nextButton.focus();
      }
    };

    steps.forEach((button, index) => {
      if (!button.hasAttribute('type')) {
        button.type = 'button';
      }
      if (index !== activeIndex) {
        button.tabIndex = -1;
      } else {
        button.tabIndex = 0;
      }
      const stepItem = button.closest('[data-process-step], .process-step');
      if (stepItem) {
        stepItem.dataset.processStepIndex = String(index);
      }
      button.addEventListener(
        'click',
        () => {
          setActiveStep(index, { focus: true });
        },
        { signal }
      );
      button.addEventListener(
        'keydown',
        (event) => {
          if (event.defaultPrevented) return;
          if (event.altKey || event.metaKey || event.ctrlKey) return;

          switch (event.key) {
            case 'Enter':
            case ' ': {
              event.preventDefault();
              setActiveStep(index, { focus: true });
              break;
            }
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
              setActiveStep(steps.length - 1, { focus: true });
              break;
            }
            default:
          }
        },
        { signal }
      );

      const toggleHover = (state) => {
        const targetStep = button.closest('[data-process-step], .process-step');
        if (!targetStep) return;
        if (state) {
          targetStep.classList.add('is-hover');
        } else {
          targetStep.classList.remove('is-hover');
        }
      };

      button.addEventListener('mouseenter', () => toggleHover(true), { signal });
      button.addEventListener('mouseleave', () => toggleHover(false), { signal });
      button.addEventListener('focus', () => toggleHover(true), { signal });
      button.addEventListener(
        'blur',
        (event) => {
          if (!button.contains(event.relatedTarget)) {
            toggleHover(false);
          }
        },
        { signal }
      );
    });

    accordionEntries.forEach((entry) => {
      if (!entry || !entry.trigger || !entry.slug) return;
      const targetIndex = slugToIndex.get(entry.slug);
      if (typeof targetIndex !== 'number') return;
      entry.trigger.addEventListener(
        'click',
        (event) => {
          if (event.defaultPrevented) return;
          setActiveStep(targetIndex, { focus: false });
        },
        { signal }
      );
    });

    const handleResize = () => {
      scheduleStarRender();
      const compact = isCompactViewport();
      if (compact !== previousCompact) {
        previousCompact = compact;
        setActiveStep(activeIndex, { immediate: true });
      }
      refreshGeometry({ immediate: true });
      scheduleBubbleUpdate(activeIndex, { allowEmit: false });
    };

    window.addEventListener('resize', handleResize, { signal });
    window.addEventListener(
      'orientationchange',
      handleResize,
      { signal }
    );

    const handleReduceMotionChange = () => {
      scheduleStarRender({ force: true });
      refreshGeometry({ immediate: true });
      scheduleBubbleUpdate(activeIndex, { allowEmit: false });
    };

    if (typeof reduceMotionQuery.addEventListener === 'function') {
      reduceMotionQuery.addEventListener('change', handleReduceMotionChange, { signal });
    } else if (typeof reduceMotionQuery.addListener === 'function') {
      reduceMotionQuery.addListener(handleReduceMotionChange);
      if (controller) {
        signal.addEventListener('abort', () => {
          reduceMotionQuery.removeListener(handleReduceMotionChange);
        });
      }
    }

    const cleanup = () => {
      if (controller) {
        controller.abort();
      }
      if (revealObserver) {
        revealObserver.disconnect();
      }
      if (sectionVisibilityObserver) {
        sectionVisibilityObserver.disconnect();
      }
      window.cancelAnimationFrame(bubbleRAF);
    };

    window.addEventListener('pagehide', cleanup, { once: true });
    window.addEventListener('beforeunload', cleanup, { once: true });

    setActiveStep(activeIndex, { immediate: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProcess, { once: true });
  } else {
    initProcess();
  }
})();
