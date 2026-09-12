import React, { useState } from 'react';
import { BookOpen, Clock, Users, Check, Sparkles } from 'lucide-react';

export default function ClassesSection({ classes = [] }) {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredClasses = selectedFilter === 'All'
    ? classes
    : classes.filter(c => c.grade_level.toLowerCase().includes(selectedFilter.toLowerCase()));

  return (
    <section className="section section-bg" id="classes">
      <div className="container">
        <div className="section-header">
          <div className="section-subtitle">Comprehensive Curriculum</div>
          <h2 className="section-title">Classes Offered (Class 1 to 10)</h2>
          <p className="section-description">
            Structured batches designed to foster subject mastery, problem-solving skills, and academic confidence across all core school subjects.
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {['All', '1st to 5th', '6th to 8th', '9th & 10th'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedFilter(tab)}
              className={`btn ${selectedFilter === tab ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
            >
              {tab === 'All' ? 'All Classes (1st to 10th)' : `Class ${tab}`}
            </button>
          ))}
        </div>

        {/* Classes Grid */}
        <div className="classes-grid">
          {filteredClasses.map((item) => (
            <div className="card class-card" key={item.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="class-card-icon">
                  <BookOpen size={26} />
                </div>
                <span className="badge badge-orange">{item.grade_level}</span>
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                {item.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem', padding: '0.85rem', background: 'var(--bg-slate)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--primary-navy)' }}>
                  <Clock size={16} color="#F97316" /> <strong>Timings:</strong> {item.batch_timings}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--primary-navy)' }}>
                  <Users size={16} color="#0D9488" /> <strong>Batch Capacity:</strong> {item.batch_size}
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--primary-navy)' }}>
                Covered Subjects:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {Array.isArray(item.subjects) && item.subjects.map((sub, idx) => (
                  <span key={idx} className="subject-pill" style={{ background: '#EFF6FF', color: '#1E40AF', borderColor: '#BFDBFE' }}>
                    <Check size={12} inline style={{ marginRight: '4px' }} /> {sub}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
