import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import TeachersSection from './components/TeachersSection';
import ClassesSection from './components/ClassesSection';
import FeeSection from './components/FeeSection';
import EnquiryForm from './components/EnquiryForm';
import GallerySection from './components/GallerySection';
import TestimonialsSection from './components/TestimonialsSection';
import NoticesSection from './components/NoticesSection';
import ContactSection from './components/ContactSection';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import { api } from './api';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [adminOpen, setAdminOpen] = useState(false);

  // Live API data state
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [fees, setFees] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [siteContent, setSiteContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      const [t, c, f, a, g, tm, sc] = await Promise.all([
        api.getTeachers(),
        api.getClasses(),
        api.getFees(),
        api.getAnnouncements(),
        api.getGallery(),
        api.getTestimonials(),
        api.getContent()
      ]);
      setTeachers(t || []);
      setClasses(c || []);
      setFees(f || []);
      setAnnouncements(a || []);
      setGallery(g || []);
      setTestimonials(tm || []);
      setSiteContent(sc || {});
    } catch (err) {
      console.error('Error fetching live data from Aarohan API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    // Auto sync live data every 2 seconds & on tab focus
    const interval = setInterval(fetchAllData, 2000);
    window.addEventListener('focus', fetchAllData);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', fetchAllData);
    };
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-root">
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onOpenAdmin={() => setAdminOpen(true)}
        announcements={announcements}
        contactData={siteContent?.contact}
      />

      <main>
        <Hero
          heroData={siteContent?.hero}
          onBookDemo={() => scrollToSection('enquiry')}
          onContactUs={() => scrollToSection('contact')}
        />

        <AboutSection aboutData={siteContent?.about} />

        <TeachersSection teachers={teachers} />

        <ClassesSection classes={classes} />

        <FeeSection fees={fees} onEnquire={() => scrollToSection('enquiry')} />

        <EnquiryForm />

        <NoticesSection announcements={announcements} />

        <GallerySection gallery={gallery} />

        <TestimonialsSection testimonials={testimonials} />

        <ContactSection contactData={siteContent?.contact} />
      </main>

      <Footer
        onOpenAdmin={() => setAdminOpen(true)}
        contactData={siteContent?.contact}
      />

      {/* Admin Panel Modal Overlay */}
      <AdminPanel
        isOpen={adminOpen}
        onClose={() => {
          setAdminOpen(false);
          fetchAllData();
        }}
        onDataChanged={fetchAllData}
      />
    </div>
  );
}
