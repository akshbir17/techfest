import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import EventsPage from './EventsPage';
import ScheduleSection from '../components/sections/ScheduleSection';
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
      {/* HIDDEN: Schedule section (pending college approval for other events) */}
      {/* <ScheduleSection /> */}
      <CoordinatorsSection />
      <RegistrationSection />
      <ContactSection />
    </main>
  );
};

export default HomePage;
