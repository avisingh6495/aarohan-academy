import React, { useState, useEffect } from 'react';
import { BookOpen, Phone, Mail, Menu, X, Shield, Sparkles } from 'lucide-react';

export default function Header({ activeSection, setActiveSection, onOpenAdmin, announcements = [], contactData }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const contact = contactData || {
    phone: "+91 98765 43210",
    email: "info@aarohanacademy.edu.in"
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'teachers', label: 'Teachers' },
    { id: 'classes', label: 'Classes' },
    { id: 'fees', label: 'Fees' },
    { id: 'notices', label: 'Notices' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'testimonials', label: 'Reviews' },
    { id: 'contact', label: 'Contact' },
  ];

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (id) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const latestNotice = announcements.length > 0 ? announcements[0] : null;

  return (
    <header className="header">
      {/* Top info bar */}
      <div className="header-top-bar">
        <div className="container header-top-content">
          {/* Left: contact info */}
          <div className="header-contact-info">
            <a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`} className="header-top-link">
              <Phone size={13} color="#F97316" /> {contact.phone}
            </a>
            <a href={`mailto:${contact.email}`} className="header-top-link header-email-desktop">
              <Mail size={13} color="#F97316" /> {contact.email}
            </a>
          </div>

          {/* Right: announcement badge + admin button */}
          <div className="header-top-actions">
            {latestNotice && (
              <button
                onClick={() => handleNavClick('notices')}
                className="header-notice-btn"
                title="Click to view all Notices & Announcements"
              >
                <span className="notice-new-tag">NEW</span>
                <span className="notice-title-text">
                  {latestNotice.title} →
                </span>
              </button>
            )}

            <button
              onClick={onOpenAdmin}
              className="header-admin-btn"
            >
              <Shield size={12} color="#F97316" /> Admin
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container">
        <nav className="navbar">
          {/* Logo */}
          <a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }} className="logo">
            <div className="logo-icon">
              <BookOpen size={20} />
            </div>
            <div>
              <div style={{ lineHeight: 1.1, fontSize: '1.25rem' }}>Aarohan Academy</div>
              <div style={{ fontSize: '0.65rem', fontWeight: 500, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                Building Strong Foundations · Class 1–10
              </div>
            </div>
          </a>

          {/* Mobile backdrop overlay */}
          {mobileMenuOpen && (
            <div
              className="mobile-backdrop"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Desktop & Mobile Navigation Links */}
          <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            {navItems.map((item) => (
              <li key={item.id} style={{ width: mobileMenuOpen ? '100%' : 'auto' }}>
                <a
                  href={`#${item.id}`}
                  className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li style={{ width: mobileMenuOpen ? '100%' : 'auto', marginTop: mobileMenuOpen ? '0.5rem' : 0 }}>
              <button
                className="btn btn-primary nav-cta-btn"
                onClick={() => handleNavClick('enquiry')}
              >
                <Sparkles size={14} /> Book Free Demo
              </button>
            </li>
          </ul>

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </nav>
      </div>
    </header>
  );
}
