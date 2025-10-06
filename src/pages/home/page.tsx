import { Header } from '@widgets/Header';
import { Hero } from '@widgets/Hero';
import { AboutSection } from '@widgets/About';
import { ServicesSection } from '@widgets/Services';
import { PortfolioSection } from '@widgets/Portfolio';
import { LabsSection } from '@widgets/Labs';
import { PacksSection } from '@widgets/Packs';
import { ProcessSection } from '@widgets/Process';
import { ContactSection } from '@widgets/ContactSection';
import { Footer } from '@widgets/Footer';
import { ChatWidget } from '@widgets/ChatWidget';

export function HomePage() {
  return (
    <div className="page-home">
      <Header />
      <main>
        <Hero />
        <AboutSection />
        <ServicesSection />
        <PortfolioSection />
        <LabsSection />
        <PacksSection />
        <ProcessSection />
        <ContactSection />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
