const section = document.querySelector('[data-contact-section]');

if (section) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduceMotion = () => prefersReducedMotion.matches;

  const canvas = section.querySelector('#contact-stars');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let stars = [];
  let rafId = null;
  let isInView = false;
  let scrollOffset = 0;
  let resizeTimer = null;
  let observer;
  let scrollScheduled = false;

  const STAR_COLORS = [
    'rgba(255,255,255,0.85)',
    'rgba(214,60,255,0.78)',
    'rgba(255,150,43,0.72)'
  ];

  function initStars() {
    const count = 80 + Math.floor(Math.random() * 41);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0.6 + Math.random() * 1.6,
      speed: 0.08 + Math.random() * 0.12,
      drift: (Math.random() - 0.5) * 0.05,
      parallax: 0.04 + Math.random() * 0.18,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      alpha: 0.45 + Math.random() * 0.45
    }));
  }

  function sizeCanvas() {
    if (!canvas || !ctx) return;
    const rect = section.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    initStars();
    renderFrame(true);
  }

  function renderFrame(skipUpdate = false) {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    const parallaxShift = scrollOffset * 0.12;

    for (let i = 0; i < stars.length; i += 1) {
      const star = stars[i];

      if (!skipUpdate && !reduceMotion()) {
        star.y += star.speed;
        star.x += star.drift;

        if (star.y > height + 20) {
          star.y = -20;
        }
        if (star.x > width + 20) {
          star.x = -20;
        } else if (star.x < -20) {
          star.x = width + 20;
        }
      }

      const drawY = star.y + parallaxShift * star.parallax;

      ctx.globalAlpha = star.alpha;
      ctx.beginPath();
      ctx.fillStyle = star.color;
      ctx.arc(star.x, drawY, star.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    if (!skipUpdate && !reduceMotion() && isInView) {
      rafId = window.requestAnimationFrame(() => renderFrame(false));
    }
  }

  function startStars() {
    if (reduceMotion()) {
      renderFrame(true);
      return;
    }
    if (!rafId) {
      rafId = window.requestAnimationFrame(() => renderFrame(false));
    }
  }

  function stopStars() {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function handleScroll() {
    if (reduceMotion() || !isInView) return;
    if (scrollScheduled) return;
    scrollScheduled = true;
    window.requestAnimationFrame(() => {
      scrollScheduled = false;
      const rect = section.getBoundingClientRect();
      const visible = Math.max(0, Math.min(rect.height, window.innerHeight - rect.top));
      scrollOffset = visible * 0.2;
    });
  }

  function handleResize() {
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      sizeCanvas();
    }, 150);
  }

  if (canvas && ctx) {
    sizeCanvas();
    if (!reduceMotion()) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.target !== section) return;
          isInView = entry.isIntersecting;
          if (isInView) {
            startStars();
          } else {
            stopStars();
          }
        });
      }, { threshold: 0.15 });
      observer.observe(section);
    } else {
      renderFrame(true);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
  }

  const handleMotionChange = () => {
    stopStars();
    sizeCanvas();
    if (!reduceMotion() && isInView) {
      startStars();
    }
  };

  if (typeof prefersReducedMotion.addEventListener === 'function') {
    prefersReducedMotion.addEventListener('change', handleMotionChange);
  } else if (typeof prefersReducedMotion.addListener === 'function') {
    prefersReducedMotion.addListener(handleMotionChange);
  }

  const cards = section.querySelectorAll('.cardlike');
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => card.classList.add('is-hover'));
    card.addEventListener('mouseleave', () => card.classList.remove('is-hover'));
    card.addEventListener('focusin', () => card.classList.add('is-hover'));
    card.addEventListener('focusout', (event) => {
      if (!card.contains(event.relatedTarget)) {
        card.classList.remove('is-hover');
      }
    });
  });

  const form = section.querySelector('#build-form');
  const statusEl = section.querySelector('#form-status');
  const submitBtn = form?.querySelector('.cform__submit');
  const inputs = form ? Array.from(form.querySelectorAll('.cform__input')) : [];

  function setStatus(message, variant) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove('is-success', 'is-error');
    if (variant) {
      statusEl.classList.add(variant);
    }
  }

  function clearFieldState(field) {
    field.removeAttribute('aria-invalid');
  }

  function validateForm() {
    if (!form) return false;
    const nameField = form.querySelector('#name');
    const emailField = form.querySelector('#email');

    if (nameField && nameField.value.trim() === '') {
      nameField.setAttribute('aria-invalid', 'true');
      setStatus('Please enter your name.', 'is-error');
      nameField.focus();
      return false;
    }

    if (emailField) {
      const emailValue = emailField.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailValue)) {
        emailField.setAttribute('aria-invalid', 'true');
        setStatus('Enter a valid email address.', 'is-error');
        emailField.focus();
        return false;
      }
    }

    setStatus("Thanks! We’ll be in touch within 24 hours.", 'is-success');
    return true;
  }

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      inputs.forEach(clearFieldState);
      const isValid = validateForm();
      if (isValid && submitBtn && !reduceMotion()) {
        submitBtn.classList.add('is-shimmer');
        window.setTimeout(() => {
          submitBtn.classList.remove('is-shimmer');
        }, 1200);
      }
    });

    form.addEventListener('input', (event) => {
      const target = event.target;
      if (
        !(target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target instanceof HTMLSelectElement)
      ) {
        return;
      }
      target.removeAttribute('aria-invalid');
      if (statusEl) {
        statusEl.textContent = '';
        statusEl.classList.remove('is-success', 'is-error');
      }
    });
  }

  if (submitBtn) {
    const triggerShimmer = () => {
      if (reduceMotion()) return;
      submitBtn.classList.add('is-shimmer');
      window.setTimeout(() => {
        submitBtn.classList.remove('is-shimmer');
      }, 1200);
    };
    submitBtn.addEventListener('mouseenter', triggerShimmer);
    submitBtn.addEventListener('focus', triggerShimmer);
  }

  const estimatorSelect = section.querySelector('#ptype');
  const estimatorPlaceholder = section.querySelector('.est__placeholder');
  const estimatorResult = section.querySelector('.est__result');
  const estimatorPill = section.querySelector('[data-est-pill]');

  const savingsMap = {
    Starter: { text: 'Save ~10–20%', tone: 'gold' },
    Builder: { text: 'Save ~25–35%', tone: 'green' },
    Engine: { text: 'Save ~20–30%', tone: 'green' },
    Growth: { text: 'Save ~15–25%', tone: 'gold' }
  };

  function updateEstimator(value) {
    if (!estimatorPlaceholder || !estimatorResult || !estimatorPill) return;
    const info = savingsMap[value];
    if (!info) {
      estimatorPlaceholder.hidden = false;
      estimatorResult.hidden = true;
      estimatorPill.textContent = '';
      estimatorPill.classList.remove('est__pill--gold', 'est__pill--green');
      return;
    }

    estimatorPlaceholder.hidden = true;
    estimatorResult.hidden = false;
    estimatorPill.textContent = info.text;
    estimatorPill.classList.remove('est__pill--gold', 'est__pill--green');
    if (info.tone === 'green') {
      estimatorPill.classList.add('est__pill--green');
    } else {
      estimatorPill.classList.add('est__pill--gold');
    }
  }

  if (estimatorSelect) {
    estimatorSelect.addEventListener('change', (event) => {
      const { value } = event.target;
      updateEstimator(value);
    });
  }

  function cleanup() {
    stopStars();
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);
    if (observer) observer.disconnect();
    if (typeof prefersReducedMotion.removeEventListener === 'function') {
      prefersReducedMotion.removeEventListener('change', handleMotionChange);
    } else if (typeof prefersReducedMotion.removeListener === 'function') {
      prefersReducedMotion.removeListener(handleMotionChange);
    }
  }

  window.addEventListener('pagehide', cleanup, { once: true });
}

export {};