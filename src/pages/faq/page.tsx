import { Header } from '@widgets/Header';
import { Footer } from '@widgets/Footer';
import { ChatWidget } from '@widgets/ChatWidget';
import { useFaqAccordion } from '@features/useFaqAccordion';

export function FaqPage() {
  const { items, openId, toggle, filter, setFilter, onKeyDown } = useFaqAccordion();

  return (
    <div className="page-faq">
      <Header />
      <main className="faq-page" id="faq">
        <section className="faq" aria-labelledby="faq-title">
          <div className="faq__inner">
            <header className="faq__head">
              <h1 id="faq-title" className="faq__title">
                Frequently Asked Questions
              </h1>
              <p className="faq__lede">Answers about packs, process, labs, and timelines.</p>
              <label className="faq__filter">
                <span className="faq__filterLabel">Filter</span>
                <input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Search FAQ" />
              </label>
            </header>

            <div className="faq__accordion" role="tablist">
              {items.map((item, index) => {
                const isOpen = openId === item.id;
                return (
                  <article key={item.id} className={`faq-item${isOpen ? ' is-open' : ''}`}>
                    <h2>
                      <button
                        type="button"
                        data-faq-id={item.id}
                        className="faq-item__trigger"
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${item.id}`}
                        id={`faq-trigger-${item.id}`}
                        onClick={() => toggle(item.id)}
                        onKeyDown={(event) => onKeyDown(event, index)}
                      >
                        {item.q}
                      </button>
                    </h2>
                    <div
                      id={`faq-panel-${item.id}`}
                      className="faq-item__panel"
                      role="region"
                      aria-labelledby={`faq-trigger-${item.id}`}
                      hidden={!isOpen}
                    >
                      <p>{item.a}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
