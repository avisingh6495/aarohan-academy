import React, { useState } from 'react';
import { Bell, Calendar, Pin, AlertTriangle } from 'lucide-react';

export default function NoticesSection({ announcements = [] }) {
  const [tagFilter, setTagFilter] = useState('All');

  const tags = ['All', 'Urgent', 'Exam', 'Notice', 'Holiday'];

  const filteredNotices = tagFilter === 'All'
    ? announcements
    : announcements.filter(a => a.tag === tagFilter);

  const getTagBadge = (tag) => {
    switch (tag) {
      case 'Urgent':
        return <span className="badge" style={{ background: '#FEE2E2', color: '#991B1B' }}>🚨 Urgent</span>;
      case 'Exam':
        return <span className="badge" style={{ background: '#FEF3C7', color: '#92400E' }}>📝 Exam Schedule</span>;
      case 'Holiday':
        return <span className="badge" style={{ background: '#DCFCE7', color: '#166534' }}>🌴 Holiday</span>;
      default:
        return <span className="badge badge-navy">📢 Notice</span>;
    }
  };

  return (
    <section className="section" id="notices">
      <div className="container">
        <div className="section-header">
          <div className="section-subtitle">Stay Updated</div>
          <h2 className="section-title">Latest Notices & Announcements</h2>
          <p className="section-description">
            Important updates regarding test schedules, holiday calendars, demo sessions, and parent meetings.
          </p>
        </div>

        {/* Tag Filters */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setTagFilter(t)}
              className={`btn ${tagFilter === t ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Notices Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className="card"
              style={{
                borderLeft: notice.is_pinned ? '5px solid #F97316' : '1px solid var(--border-light)',
                background: notice.is_pinned ? '#FFF7ED' : 'white'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                {getTagBadge(notice.tag)}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <Calendar size={14} /> {notice.date_str}
                  {notice.is_pinned && <Pin size={14} color="#F97316" inline style={{ marginLeft: '4px' }} />}
                </div>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--primary-navy)' }}>
                {notice.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {notice.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
