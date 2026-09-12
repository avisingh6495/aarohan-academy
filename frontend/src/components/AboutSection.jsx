import React from 'react';
import { Target, Lightbulb, Heart, CheckCircle } from 'lucide-react';

export default function AboutSection({ aboutData }) {
  const data = aboutData || {
    mission: "To empower students from Class 1 to 10 with deep conceptual understanding, analytical thinking, and confidence to excel academically and beyond.",
    philosophy: "We believe no student is weak—they only need the right guidance, small batch focus, and clear foundational concepts.",
    whyChooseUs: [
      "Expert Faculty",
      "Strictly Small Batch Size (Max 12-15 Students)",
      "Weekly Assessment Tests & Homework Monitoring",
      "Dedicated Doubt Resolution Hours",
      "Regular PTMs & Progress Reports to Parents"
    ]
  };

  return (
    <section className="section section-bg" id="about">
      <div className="container">
        <div className="section-header">
          <div className="section-subtitle">Who We Are</div>
          <h2 className="section-title">About Aarohan Academy</h2>
          <p className="section-description">
            Dedicated to nurturing young minds with quality education, core concept mastery, and academic discipline.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {/* Mission Card */}
          <div className="card">
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(249, 115, 22, 0.1)', color: 'var(--accent-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Target size={26} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>Our Mission</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.975rem' }}>{data.mission}</p>
          </div>

          {/* Philosophy Card */}
          <div className="card">
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(13, 148, 136, 0.1)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Lightbulb size={26} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>Teaching Philosophy</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.975rem' }}>{data.philosophy}</p>
          </div>

          {/* Student Centricity */}
          <div className="card">
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Heart size={26} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>Nurturing Environment</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.975rem' }}>
              We foster a warm, encouraging atmosphere where students feel comfortable asking questions and overcoming their academic anxieties.
            </p>
          </div>
        </div>

        {/* Why Choose Us Highlight Box */}
        <div style={{ background: 'var(--surface-white)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center', color: 'var(--primary-navy)' }}>
            Why Choose Aarohan Academy?
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {data.whyChooseUs.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-slate)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <CheckCircle size={20} color="#0D9488" style={{ flexShrink: 0 }} />
                <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--primary-navy)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
