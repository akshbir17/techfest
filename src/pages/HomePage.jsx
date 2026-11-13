import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import EventsPage from './EventsPage';
import ThemesSection from '../components/sections/ThemesSection';
import ScheduleSection from '../components/sections/ScheduleSection';
import CoordinatorsSection from '../components/sections/CoordinatorsSection';
import RegistrationSection from '../components/sections/RegistrationSection';
import ContactSection from '../components/sections/ContactSection';

// Set to true when schedule is ready to be displayed
const SHOW_SCHEDULE = false;

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      
      const scrollToTarget = () => {
        const el = document.getElementById(targetId);
        if (el) {
          if (window.lenis) {
            window.lenis.resize();
            window.lenis.scrollTo(el, { offset: -70 });
          } else {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      };

      // Staged executions to ensure correct landing as dynamic elements and images render
      const t1 = setTimeout(scrollToTarget, 60);
      const t2 = setTimeout(scrollToTarget, 250);
      const t3 = setTimeout(scrollToTarget, 550);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [location.hash, location.pathname]);

  return (
    <main className="content-layer">
      <HeroSection />
      <AboutSection />
      {/* Scroll 2nd shows events */}
      <EventsPage isEmbedded={true} />
      <ThemesSection />
      {SHOW_SCHEDULE && <ScheduleSection />}
      <CoordinatorsSection />
      <RegistrationSection />
      <ContactSection />
    </main>
  );
};

export default HomePage;
