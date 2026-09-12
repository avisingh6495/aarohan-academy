import React from 'react';
import { Sparkles, Users, Award, ShieldCheck, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

export default function Hero({ onBookDemo, onContactUs, heroData }) {
  const content = heroData || {
    title: "Building Strong Academic Foundations for Class 1 to 10",
    tagline: "Building strong foundations, Class 1 to 10",
    subtitle: "Interactive learning with small batch sizes, experienced & Qualified faculty (from IIT Kanpur), and individual attention.",
    badge: "⭐ Admissions Open for Academic Session 2026-27"
  };

  return (
    <section className="hero" id="home">
      <div className="container">
        <div className="hero-grid">
          {/* Left Column Content */}
          <div>
            <div className="badge badge-orange" style={{ marginBottom: '1rem', fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
              <Sparkles size={16} /> {content.badge}
            </div>

            <h1 className="hero-title">
              Aarohan Academy <br />
              <span>{content.tagline}</span>
            </h1>

            <p className="hero-subtitle">
              {content.subtitle}
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <button className="btn btn-primary" onClick={onBookDemo}>
                Book a Free Demo Class <ArrowRight size={18} />
              </button>
              <button className="btn btn-outline" onClick={onContactUs}>
                Contact Us
              </button>
            </div>

            {/* Quick Feature Badges */}
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-navy)' }}>
                <CheckCircle2 size={18} color="#0D9488" /> IIT Kanpur Faculty
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-navy)' }}>
                <CheckCircle2 size={18} color="#0D9488" /> Small Batch (Max 15)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-navy)' }}>
                <CheckCircle2 size={18} color="#0D9488" /> Weekly Test Series
              </div>
            </div>

            {/* Stats Bar */}
            <div className="hero-stats">
              <div className="stat-card">
                <div className="stat-num">5+</div>
                <div className="stat-label">Years of Excellence</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">100+</div>
                <div className="stat-label">Students Guided</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">95%+</div>
                <div className="stat-label">Top Board Scores</div>
              </div>
            </div>
          </div>

          {/* Right Column Interactive Preview Card */}
          <div className="hero-card-preview">
            <div className="hero-card-header">
              <div style={{ background: 'var(--accent-teal-light)', padding: '0.75rem', borderRadius: '12px', color: 'var(--accent-teal)' }}>
                <Award size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Why Parents Trust Us</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Class 1st to 10th Core Coaching</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', gap: '0.75rem' }}>
                <Users size={22} color="#F97316" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.925rem' }}>Small Batch Focus (Max 12-15)</div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Every student gets individual attention and custom doubt sessions.</div>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', gap: '0.75rem' }}>
                <ShieldCheck size={22} color="#0D9488" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.925rem' }}>Top Qualified Faculty</div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Er. Avinash Singh (IIT Kanpur) & MCA faculty lead all subjects.</div>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', gap: '0.75rem' }}>
                <Clock size={22} color="#6366F1" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.925rem' }}>Convenient Evening Timings</div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>3:30 PM - 7:30 PM slots tailored for school students.</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', background: '#FFF7ED', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #FED7AA', textAlign: 'center' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#C2410C' }}>
                🚀 Free Trial Demo Class Available This Sunday!
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
