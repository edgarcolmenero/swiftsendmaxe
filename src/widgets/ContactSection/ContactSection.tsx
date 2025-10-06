import { useContactEstimator } from '@features/useContactEstimator';
import { useFormValidate } from '@features/useFormValidate';

const PACK_OPTIONS = [
  { label: 'Starter', value: 'Starter' },
  { label: 'Builder', value: 'Builder' },
  { label: 'Engine', value: 'Engine' },
  { label: 'Growth', value: 'Growth' },
];

export function ContactSection() {
  const { handleSubmit, pending, status } = useFormValidate({
    onSubmit: async () => new Promise((resolve) => setTimeout(resolve, 600)),
  });
  const { selectedPack, resultText, selectPack } = useContactEstimator();

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title" data-contact-section>
      <canvas id="contact-stars" aria-hidden="true" />

      <div className="contact__inner">
        <header className="contact__head">
          <h2 id="contact-title" className="contact__title">
            Let’s Build <span className="grad-word">Together</span>
          </h2>
          <p className="contact__lede">Ready to transform your vision into reality? Get in touch and let’s start building.</p>
        </header>

        <div className="contact__grid">
          <form className="cform cardlike" id="build-form" noValidate aria-describedby="form-status" onSubmit={handleSubmit}>
            <div className="cform__row">
              <label className="cform__label" htmlFor="name">
                Name
              </label>
              <input className="cform__input" id="name" name="name" type="text" placeholder="Your name" autoComplete="name" required />
            </div>

            <div className="cform__row">
              <label className="cform__label" htmlFor="email">
                Email
              </label>
              <input
                className="cform__input"
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="cform__row">
              <label className="cform__label" htmlFor="ptype">
                Project Type
              </label>
              <div className="cform__selectWrap">
                <select
                  className="cform__input cform__select"
                  id="ptype"
                  name="ptype"
                  required
                  value={selectedPack ? selectedPack.charAt(0).toUpperCase() + selectedPack.slice(1) : ''}
                  onChange={(event) => selectPack(event.target.value)}
                >
                  <option value="" disabled>
                    Select project type
                  </option>
                  {PACK_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <svg className="cform__chev" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M7 10l5 5 5-5z" />
                </svg>
              </div>
            </div>

            <div className="cform__row">
              <label className="cform__label" htmlFor="industry">
                Industry <span className="cform__opt">(optional)</span>
              </label>
              <input
                className="cform__input"
                id="industry"
                name="industry"
                type="text"
                placeholder="e.g., Real Estate, E-commerce, Healthcare"
              />
            </div>

            <div className="cform__row cform__row--area">
              <label className="cform__label" htmlFor="message">
                Message
              </label>
              <textarea
                className="cform__input cform__area"
                id="message"
                name="message"
                placeholder="Tell us about your project..."
                rows={6}
                required
              />
            </div>

            <p id="form-status" className="cform__status" aria-live="polite">
              {status}
            </p>

            <button className="cform__submit" type="submit" disabled={pending}>
              <span>{pending ? 'Sending…' : 'Start a Build'}</span>
              <svg viewBox="0 0 24 24" className="cform__spark" aria-hidden="true">
                <path fill="currentColor" d="M12 2l1.8 4.6L18 8l-4.2 1.4L12 14l-1.8-4.6L6 8l4.2-1.4L12 2z" />
              </svg>
            </button>
          </form>

          <div className="contact__stack" aria-hidden="false">
            <section className="est cardlike" aria-labelledby="est-title">
              <div className="est__icon" aria-hidden="true">
                <span className="est__iconWrap">
                  <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm1 4v2h8V6H8zm0 4v2h8v-2H8zm0 4v2h5v-2H8z" />
                  </svg>
                </span>
              </div>
              <h3 id="est-title" className="est__title">
                Savings Estimator
              </h3>
              <p className="est__lede">See how much you could save with SwiftSend</p>

              <div className="est__panel" aria-live="polite">
                {!resultText && <p className="est__placeholder">Select a project type above to estimate your savings</p>}
                {resultText && (
                  <div className="est__result">
                    <span className="est__pill" data-est-pill>
                      {resultText.pill}
                    </span>
                    <p className="est__note">Estimated savings vs. typical agency rates: {resultText.amount}</p>
                  </div>
                )}
              </div>
            </section>

            <section className="touch cardlike" aria-labelledby="touch-title">
              <h3 id="touch-title" className="touch__title">
                Get in Touch
              </h3>
              <dl className="touch__list">
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href="mailto:swift.send.marketing@gmail.com">swift.send.marketing@gmail.com</a>
                  </dd>
                </div>
                <div>
                  <dt>SMS</dt>
                  <dd>
                    <a href="sms:+15105191128">+1 (510) 519-1128</a>
                  </dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a href="tel:+15105191128">+1 (510) 519-1128</a>
                  </dd>
                </div>
              </dl>
              <blockquote className="touch__quote">“Building the future, one project at a time.”</blockquote>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
