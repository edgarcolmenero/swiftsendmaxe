import { Header } from '@widgets/Header';
import { Footer } from '@widgets/Footer';
import { ChatWidget } from '@widgets/ChatWidget';
import { useCalendarData } from '@features/useCalendarData';

export function CalendarPage() {
  const { availability, events } = useCalendarData();

  const handleSlotClick = (date: string, time: string) => {
    const subject = encodeURIComponent(`SwiftSend meeting request — ${date} @ ${time}`);
    window.location.href = `mailto:swift.send.marketing@gmail.com?subject=${subject}`;
  };

  return (
    <div className="page-calendar">
      <Header />
      <main className="calendar" id="calendar">
        <section className="calendar__section" aria-labelledby="calendar-open-title">
          <div className="calendar__head">
            <h1 id="calendar-open-title">Open Dates to Meet</h1>
            <p>Pick a time that works for you or text +1 (510) 519-1128 to coordinate directly.</p>
          </div>
          <div className="calendar__grid">
            {availability.map((day) => (
              <article key={day.date} className="calendar__day">
                <header>
                  <h2>{new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', weekday: 'short' })}</h2>
                  <span className="calendar__tz">{day.tz}</span>
                </header>
                <ul>
                  {day.slots.map((slot) => (
                    <li key={slot}>
                      <button type="button" onClick={() => handleSlotClick(day.date, slot)}>
                        {slot}
                      </button>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="calendar__section" aria-labelledby="calendar-updates-title">
          <div className="calendar__head">
            <h2 id="calendar-updates-title">Key Dates &amp; Updates</h2>
            <p>Stay in the loop on releases, promos, and events.</p>
          </div>
          <ul className="calendar__timeline">
            {events.map((event) => (
              <li key={event.id} className="calendar__event" data-type={event.type}>
                <div className="calendar__event-date">
                  {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="calendar__event-body">
                  <h3>{event.title}</h3>
                  {event.badge && <span className="calendar__badge">{event.badge}</span>}
                  <p>{event.summary}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
