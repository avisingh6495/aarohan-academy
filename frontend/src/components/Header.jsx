import React, { useState } from 'react';
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
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
              <Phone size={13} color="#F97316" /> {contact.phone}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
              <Mail size={13} color="#F97316" /> {contact.email}
            </span>
          </div>

          {/* Right: announcement badge + admin button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {latestNotice && (
              <button
                onClick={() => handleNavClick('notices')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  transition: 'all 0.2s ease',
                  color: '#F1F5F9',
                  fontFamily: 'inherit',
                }}
                title="Click to view all Notices & Announcements"
              >
                <span style={{
                  background: '#F97316',
                  color: 'white',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '4px',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                }}>NEW</span>
                <span style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '280px',
                  fontWeight: 500,
                }}>
                  {latestNotice.title} →
                </span>
              </button>
            )}

            <button
              onClick={onOpenAdmin}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: '#CBD5E1',
                fontSize: '0.78rem',
                padding: '0.22rem 0.65rem',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
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

          {/* Desktop Navigation */}
          <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            {navItems.map((item) => (
              <li key={item.id}>
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
            <li>
              <button
                className="btn btn-primary"
                onClick={() => handleNavClick('enquiry')}
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
              >
                <Sparkles size={13} /> Book Demo
              </button>
            </li>
          </ul>

          {/* Mobile Menu Toggle */}
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
