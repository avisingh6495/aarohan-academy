import React from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';

export default function ContactSection({ contactData }) {
  const data = contactData || {
    address: "Aarohan Academy, Main Knowledge Highway, Near City Central Library, Sector 4",
    phone: "+91 98765 43210 / +91 98765 43211",
    email: "info@aarohanacademy.edu.in",
    hours: "Mon - Sat: 3:00 PM - 8:00 PM | Sun: 9:00 AM - 1:00 PM",
    mapEmbedUrl: "https://maps.google.com/maps?q=IIT+Kanpur&t=&z=13&ie=UTF8&iwloc=&output=embed"
  };

  return (
    <section className="section section-bg" id="contact">
      <div className="container">
        <div className="section-header">
          <div className="section-subtitle">Get In Touch</div>
          <h2 className="section-title">Contact Aarohan Academy</h2>
          <p className="section-description">
            We are always here to answer your questions and assist with student enrollment.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
          {/* Contact Details & Map */}
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.25rem' }}>Academy Center Details</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(249,115,22,0.1)', color: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.925rem' }}>Address</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{data.address}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(13,148,136,0.1)', color: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.925rem' }}>Phone & WhatsApp</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{data.phone}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.925rem' }}>Email Address</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{data.email}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(15,23,42,0.1)', color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.925rem' }}>Center Hours</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{data.hours}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Embed */}
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '220px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)' }}>
              <iframe
                title="Aarohan Academy Map Location"
                src={data.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Quick Direct Message */}
          <div className="card">
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.25rem' }}>Send Us a Direct Message</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert('Message sent! We will reply shortly.'); }}>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input type="text" className="form-input" placeholder="e.g. Ramesh Kumar" required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone / Mobile Number</label>
                <input type="tel" className="form-input" placeholder="e.g. 9876543210" required />
              </div>
              <div className="form-group">
                <label className="form-label">Your Query</label>
                <textarea rows="4" className="form-textarea" placeholder="How can we help you?" required></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Send size={16} /> Send Quick Message
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="btn" style={{ background: '#25D366', color: 'white', fontSize: '0.875rem' }}>
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
