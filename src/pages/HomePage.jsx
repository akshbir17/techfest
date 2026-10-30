import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import EventsPage from './EventsPage';
import CoordinatorsSection from '../components/sections/CoordinatorsSection';
import RegistrationSection from '../components/sections/RegistrationSection';
import ContactSection from '../components/sections/ContactSection';

const HomePage = () => {
  return (
    <main className="content-layer">
      <HeroSection />
      <AboutSection />
      {/* Scroll 2nd shows events */}
      <EventsPage isEmbedded={true} />
      <CoordinatorsSection />
      <RegistrationSection />
      <ContactSection />
    </main>
  );
};

export default HomePage;
