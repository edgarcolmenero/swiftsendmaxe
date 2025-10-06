import { useEffect } from 'react';
import { useSmoothScroll } from '@features/useSmoothScroll';

export function Hero() {
  const smoothScroll = useSmoothScroll();

  useEffect(() => {
    const canvas = document.getElementById('fx-stars') as HTMLCanvasElement | null;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.0005 + 0.0002,
    }));

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * 0.6 * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight * 0.6}px`;
    };

    resize();

    let animationFrame = 0;

    const render = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';
      for (const star of stars) {
        const x = star.x * canvas.width;
        const y = star.y * canvas.height;
        const alpha = 0.5 + Math.sin(star.a) * 0.5;
        ctx.fillStyle = `rgba(214, 60, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, star.r * window.devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
        star.a += star.speed;
      }
      animationFrame = requestAnimationFrame(render);
    };

    render();

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section id="home" className="hero">
      <canvas id="fx-stars" aria-hidden="true" />
      <div className="spark-field" data-spark-field aria-hidden="true" />

      <div className="hero-inner">
        <div className="tile-wrap" aria-hidden="true">
          <div className="tile">
            <span className="tile-s">s</span>
            <span className="orbit o1" />
            <span className="orbit o2" />
            <span className="orbit o3" />
          </div>
        </div>

        <h1 className="display">
          Your Software.
          <br />
          <span className="grad-word">Your</span> Stack.
          <br />
          Your Savings.
        </h1>

        <p className="lede">
          We craft software, engineer data, automate with AI, and grow digital presence — clean, modern, and fee-smart.
        </p>

        <div className="cta">
          <a href="#contact" className="btn btn-primary" onClick={smoothScroll}>
            <span>Start a Build</span>
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="cta-arrow"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#portfolio" className="btn btn-ghost underline-seq" onClick={smoothScroll}>
            See Our Work
          </a>
        </div>
      </div>
    </section>
  );
}
