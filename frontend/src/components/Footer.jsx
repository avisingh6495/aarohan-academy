import React from 'react';
import { BookOpen, Phone, Mail, MapPin, Shield } from 'lucide-react';

export default function Footer({ onOpenAdmin, contactData }) {
  const contact = contactData || {
    address: "Sector 4, Main Knowledge Highway, City Central",
    phone: "+91 98765 43210",
    email: "info@aarohanacademy.edu.in"
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', fontWeight: 800, fontSize: '1.4rem', marginBottom: '1rem' }}>
              <div className="logo-icon" style={{ width: '38px', height: '38px' }}>
                <BookOpen size={20} />
              </div>
              Aarohan Academy
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Building strong academic foundations for students from Class 1 to Class 10. Experienced faculty, small batch sizes, and concept-oriented coaching.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={onOpenAdmin}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.825rem',
                  color: '#F97316',
                  background: 'rgba(249, 115, 22, 0.1)',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(249, 115, 22, 0.3)'
                }}
              >
                <Shield size={14} /> Admin Portal Access
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#teachers">Our Faculty</a></li>
              <li><a href="#classes">Classes Offered</a></li>
              <li><a href="#fees">Fee Structure</a></li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Academic Wings</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li>Primary Wing (Class 1-5)</li>
              <li>Middle Wing (Class 6-8)</li>
              <li>Secondary Board Wing (Class 9-10)</li>
              <li>CBSE / ICSE Board Prep</li>
              <li>Maths & Science Olympiad</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Contact Info</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <MapPin size={16} color="#F97316" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{contact.address}</span>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Phone size={16} color="#F97316" style={{ flexShrink: 0 }} />
                <span>{contact.phone}</span>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Mail size={16} color="#F97316" style={{ flexShrink: 0 }} />
                <span>{contact.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div style={{ fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} Aarohan Academy. All rights reserved. Built for Class 1 to 10 Academic Excellence.
          </div>
          <div style={{ fontSize: '0.85rem' }}>
            Designed & Maintained by <span style={{ color: '#F97316', fontWeight: 600 }}>Aarohan Tech Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
