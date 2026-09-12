import React from 'react';
import { ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';

export default function FeeSection({ fees = [], onEnquire }) {
  return (
    <section className="section" id="fees">
      <div className="container">
        <div className="section-header">
          <div className="section-subtitle">Affordable Quality Education</div>
          <h2 className="section-title">Transparent Fee Structure</h2>
          <p className="section-description">
            No hidden costs. Affordable monthly & quarterly fee plans designed to provide maximum educational value.
          </p>
        </div>

        {/* Mobile scroll hint */}
        <div className="mobile-scroll-hint">
          <span>👈 Swipe table horizontally to view full fees & inclusions 👉</span>
        </div>

        {/* Fee Table */}
        <div className="fee-table-container">
          <table className="fee-table">
            <thead>
              <tr>
                <th>Wing & Class Category</th>
                <th>Monthly Tuition Fee</th>
                <th>Quarterly Special Fee</th>
                <th>Registration</th>
                <th>Key Inclusions</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee) => (
                <tr key={fee.id}>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--primary-navy)' }}>
                      {fee.class_category}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-orange)', fontWeight: 600 }}>
                      {fee.grade_range}
                    </div>
                  </td>
                  <td>
                    <span className="fee-price">{fee.monthly_fee}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#0D9488' }}>{fee.quarterly_fee || 'Available on request'}</span>
                  </td>
                  <td>
                    <span className="badge badge-teal">{fee.admission_fee || 'Free'}</span>
                  </td>
                  <td>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem' }}>
                      {Array.isArray(fee.features) && fee.features.map((feat, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                          <ShieldCheck size={14} color="#0D9488" /> {feat}
                        </li>
                      ))}
                    </ul>
                    {fee.notes && (
                      <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontStyle: 'italic' }}>
                        💡 {fee.notes}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notice & CTA */}
        <div style={{ marginTop: '2rem', background: '#F8FAFC', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <HelpCircle size={24} color="#F97316" />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>Need scholarship or installment assistance?</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>10% Sibling Discount & Merit-based concessions available.</div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={onEnquire}>
            Enquire About Fee Discount <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
