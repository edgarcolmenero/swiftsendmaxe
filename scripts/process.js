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

      const baseStars = randomIntInRange(192, 288);
      const baseGlows = randomIntInRange(32, 48);
      const totalStars = isCompact ? Math.max(24, Math.round(baseStars / 2)) : baseStars;
      const totalGlows = isCompact ? Math.max(8, Math.round(baseGlows / 2)) : baseGlows;

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

    section.classList.add('is-enhanced');

    const runner = section.querySelector('[data-process-runner]');
    const baselineFill = section.querySelector('[data-process-baseline-fill], .process-baseline__fill');
    const baselineTrack = baselineFill ? baselineFill.parentElement : null;
    const panels = steps.map((button) => {
      const controlled = button.getAttribute('aria-controls');
      return controlled ? document.getElementById(controlled) : null;
    });

    let activeIndex = steps.findIndex((button) => button.getAttribute('aria-current') === 'step' || button.classList.contains('is-active'));
    if (activeIndex < 0) activeIndex = 0;

    let resizeRAF = 0;

    const applyRunnerPosition = (index, { immediate = false } = {}) => {
      if (!runner || !steps[index]) return;

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
      if (!baselineFill || !baselineTrack || !steps[index]) return;
      const trackRect = baselineTrack.getBoundingClientRect();
      const targetRect = steps[index].getBoundingClientRect();
      const width = clamp(targetRect.left + targetRect.width / 2 - trackRect.left, 0, trackRect.width || 0);
      baselineFill.style.width = `${Math.round(width)}px`;
      baselineFill.style.setProperty('--process-baseline-fill', `${Math.round(width)}px`);
    };

    const refreshGeometry = (options = {}) => {
      window.cancelAnimationFrame(resizeRAF);
      resizeRAF = window.requestAnimationFrame(() => {
        updateBaselineFill(activeIndex);
        applyRunnerPosition(activeIndex, options);
      });
    };

    const setActiveStep = (index, { focus = false, immediate = false } = {}) => {
      if (!steps.length) return;
      const nextIndex = ((index % steps.length) + steps.length) % steps.length;
      if (activeIndex === nextIndex && !immediate) {
        if (focus) steps[nextIndex].focus();
        return;
      }

      const previousButton = steps[activeIndex];
      const previousPanel = panels[activeIndex];
      if (previousButton) {
        previousButton.classList.remove('is-active');
        previousButton.removeAttribute('aria-current');
        previousButton.tabIndex = -1;
        const stepItem = previousButton.closest('[data-process-step], .process-step');
        if (stepItem) stepItem.classList.remove('is-active');
      }
      if (previousPanel) {
        previousPanel.classList.remove('is-active');
        previousPanel.hidden = true;
      }

      const nextButton = steps[nextIndex];
      const nextPanel = panels[nextIndex];
      nextButton.classList.add('is-active');
      nextButton.setAttribute('aria-current', 'step');
      nextButton.tabIndex = 0;
      const nextStepItem = nextButton.closest('[data-process-step], .process-step');
      if (nextStepItem) nextStepItem.classList.add('is-active');
      if (nextPanel) {
        nextPanel.hidden = false;
        nextPanel.classList.add('is-active');
      }

      activeIndex = nextIndex;
      section.setAttribute('data-process-active-index', String(activeIndex));
      refreshGeometry({ immediate });

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

    panels.forEach((panel, index) => {
      if (!panel) return;
      if (index === activeIndex) {
        panel.hidden = false;
        panel.classList.add('is-active');
      } else {
        panel.hidden = true;
        panel.classList.remove('is-active');
      }
    });

    const handleResize = () => {
      scheduleStarRender();
      refreshGeometry({ immediate: true });
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
