import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsSection({ testimonials = [] }) {
  return (
    <section className="section section-bg" id="testimonials">
      <div className="container">
        <div className="section-header">
          <div className="section-subtitle">Parent & Student Reviews</div>
          <h2 className="section-title">What Our Community Says</h2>
          <p className="section-description">
            Real feedback from parents and students who have experienced academic growth with Aarohan Academy.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {testimonials.map((item) => (
            <div className="card" key={item.id} style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '15px', right: '20px', color: 'rgba(249, 115, 22, 0.15)' }}>
                <Quote size={48} />
              </div>

              {/* Star Rating */}
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                {[...Array(item.rating || 5)].map((_, i) => (
                  <Star key={i} size={16} fill="#F97316" color="#F97316" />
                ))}
              </div>

              <p style={{ color: 'var(--text-dark)', fontSize: '0.975rem', fontStyle: 'italic', marginBottom: '1.5rem', flexGrow: 1, lineHeight: 1.6 }}>
                "{item.quote}"
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                <img
                  src={item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={item.name}
                  style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.975rem', color: 'var(--primary-navy)' }}>{item.name}</div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--accent-orange)', fontWeight: 600 }}>{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
