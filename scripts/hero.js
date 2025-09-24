// Spark field (CSS-only particles) — no canvas required.
// Creates small glowing dots (like around the logo) across the hero.

window.addEventListener('load', () => {
    const field = document.querySelector('[data-spark-field]');
    if (!field) return;
  
    const COUNT = 110; // density
  
    const rand = (a, b) => Math.random() * (b - a) + a;
    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement('span');
      el.className = 'spark';
  
      // 20% purple, 10% orange, rest white
      const r = Math.random();
      if (r < 0.20) el.classList.add('purple');
      else if (r < 0.30) el.classList.add('orange');
  
      // random position (percent of hero)
      el.style.setProperty('--l', `${rand(0, 100)}%`);
      el.style.setProperty('--t', `${rand(0, 100)}%`);
  
      // size, amplitude, timing, delays
      el.style.setProperty('--sz', `${rand(2.5, 6)}px`);
      el.style.setProperty('--amp', `${rand(24, 60)}px`);
      el.style.setProperty('--dur', `${rand(7, 14)}s`);
      el.style.setProperty('--tw', `${rand(1.8, 3.2)}s`);
      el.style.setProperty('--d1', `${rand(0, 10)}s`);
      el.style.setProperty('--d2', `${rand(0, 2)}s`);
  
      // 50% float the opposite direction
      if (Math.random() < 0.5) el.style.animationDirection = 'alternate-reverse, normal';
  
      field.appendChild(el);
    }
  });
  