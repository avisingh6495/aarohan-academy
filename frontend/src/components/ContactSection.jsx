import React from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';

// Helper to convert any user-pasted Google Maps URL (embed URL, iframe code, share link, or lat/lng) into a working embed URL
function formatMapEmbedUrl(inputUrl) {
  if (!inputUrl) {
    return "https://maps.google.com/maps?q=IIT+Kanpur&t=&z=14&ie=UTF8&iwloc=&output=embed";
  }

  const str = String(inputUrl).trim();

  // 1. If user pasted iframe HTML snippet: <iframe src="..." ...></iframe>
  const iframeSrcMatch = str.match(/src=["']([^"']+)["']/i);
  if (iframeSrcMatch && iframeSrcMatch[1]) {
    return iframeSrcMatch[1];
  }

  // 2. If already an embed URL
  if (str.includes('google.com/maps/embed') || str.includes('output=embed')) {
    return str;
  }

  // 3. If user pasted a Google Maps URL with lat/long: e.g. /@25.2715759,83.0074158,16z
  const coordsMatch = str.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (coordsMatch) {
    const lat = coordsMatch[1];
    const lng = coordsMatch[2];
    return `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }

  // 4. If place URL: /place/Location+Name
  const placeMatch = str.match(/place\/([^/]+)/);
  if (placeMatch) {
    const place = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    return `https://maps.google.com/maps?q=${encodeURIComponent(place)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }

  // 5. Fallback: treat string as address query
  return `https://maps.google.com/maps?q=${encodeURIComponent(str)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

export default function ContactSection({ contactData }) {
  const data = contactData || {
    address: "Aarohan Academy, Bala ji Extension Bhagwanpur Lanka",
    phone: "+91 9580770243",
    email: "avisingh6495@gmail.com",
    hours: "Mon - Sat: 3:00 PM - 7:00 PM",
    mapEmbedUrl: "https://maps.google.com/maps?q=Bala+ji+Extension+Bhagwanpur+Lanka&t=&z=15&ie=UTF8&iwloc=&output=embed"
  };

  const mapUrl = formatMapEmbedUrl(data.mapEmbedUrl || data.map_iframe || data.address);
  const cleanPhone = data.phone ? data.phone.split('/')[0].replace(/[^0-9+]/g, '') : '+919580770243';

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

        <div className="contact-grid">
          {/* Contact Details & Map */}
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.25rem' }}>Academy Center Details</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(249,115,22,0.1)', color: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.925rem' }}>Address</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{data.address}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(13,148,136,0.1)', color: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.925rem' }}>Phone & WhatsApp</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{data.phone}</div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      <a href={`tel:${cleanPhone}`} className="btn btn-outline" style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem' }}>
                        <Phone size={12} /> Call Now
                      </a>
                      <a href={`https://wa.me/${cleanPhone.replace('+', '')}`} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem', background: '#25D366', borderColor: '#25D366' }}>
                        <MessageCircle size={12} /> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.925rem' }}>Email Address</div>
                    <a href={`mailto:${data.email}`} style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'underline' }}>{data.email}</a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(15,23,42,0.1)', color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.925rem' }}>Center Hours</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{data.hours || data.timings}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Google Map Embed */}
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '260px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)' }}>
              <iframe
                title="Aarohan Academy Map Location"
                src={mapUrl}
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
                <textarea className="form-textarea" rows="4" placeholder="How can we help you?" required></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Send size={16} /> Send Direct Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
