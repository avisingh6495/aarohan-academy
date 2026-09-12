import React from 'react';
import { Award, BookOpen, GraduationCap } from 'lucide-react';

export default function TeachersSection({ teachers = [] }) {
  return (
    <section className="section" id="teachers">
      <div className="container">
        <div className="section-header">
          <div className="section-subtitle">Meet Our Mentors</div>
          <h2 className="section-title">Experienced & Dedicated Teachers</h2>
          <p className="section-description">
            Our faculty combines academic excellence from premier institutes like IIT Kanpur with years of proven teaching experience.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {teachers.map((teacher) => (
            <div className="card teacher-card" key={teacher.id}>
              <div className="teacher-avatar-container">
                <img
                  src={teacher.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={teacher.name}
                  className="teacher-avatar"
                />
                {teacher.qualification && teacher.qualification.includes('IIT') && (
                  <div className="teacher-tag">
                    <span className="badge badge-orange" style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.15)', background: '#F97316', color: '#FFF' }}>
                      <GraduationCap size={14} /> IIT Kanpur Alumnus
                    </span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="teacher-name">{teacher.name}</h3>
                <div className="teacher-qual">{teacher.qualification}</div>
                <div className="teacher-exp">
                  <Award size={16} color="#0D9488" /> {teacher.experience || 'Experienced Faculty'}
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  {teacher.bio}
                </p>

                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <BookOpen size={15} color="#F97316" /> Subjects Taught:
                </div>
                <div className="subject-pills">
                  {Array.isArray(teacher.subjects) && teacher.subjects.map((sub, idx) => (
                    <span className="subject-pill" key={idx}>{sub}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
