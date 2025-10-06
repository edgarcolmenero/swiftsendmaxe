import { Header } from '@widgets/Header';
import { ContactSection } from '@widgets/ContactSection';
import { Footer } from '@widgets/Footer';
import { ChatWidget } from '@widgets/ChatWidget';

export function ContactPage() {
  return (
    <div className="page-contact">
      <Header />
      <main>
        <ContactSection />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
