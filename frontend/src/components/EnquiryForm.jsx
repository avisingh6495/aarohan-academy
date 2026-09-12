import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Sparkles, User, Phone, Mail, BookOpen } from 'lucide-react';
import { api } from '../api';

export default function EnquiryForm() {
  const [formData, setFormData] = useState({
    student_name: '',
    parent_name: '',
    student_class: 'Class 8th',
    phone: '',
    email: '',
    preferred_subjects: 'Mathematics & Science',
    demo_slot: 'Sunday 10:00 AM',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Form Validation
    if (!formData.student_name.trim()) {
      return setError('Please enter the Student Name.');
    }
    if (!formData.parent_name.trim()) {
      return setError('Please enter the Parent Name.');
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      return setError('Please enter a valid 10-digit Phone Number.');
    }

    try {
      setLoading(true);
      const res = await api.submitEnquiry(formData);
      setSuccessMsg(res.message || 'Enquiry submitted successfully! Our counselor will call you within 24 hours.');
      setFormData({
        student_name: '',
        parent_name: '',
        student_class: 'Class 8th',
        phone: '',
        email: '',
        preferred_subjects: 'Mathematics & Science',
        demo_slot: 'Sunday 10:00 AM',
        message: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section section-bg" id="enquiry">
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="section-header">
            <div className="section-subtitle">Get Started Today</div>
            <h2 className="section-title">Book a Free Demo Class / Admission Enquiry</h2>
            <p className="section-description">
              Fill out the form below to schedule a free interactive demo class or ask any questions regarding batches and admissions.
            </p>
          </div>

          <div className="form-card">
            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {successMsg ? (
              <div style={{ textAlignment: 'center', padding: '2rem 1rem', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', background: 'var(--accent-teal-light)', color: 'var(--accent-teal)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--primary-navy)' }}>
                  Enquiry Received!
                </h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  {successMsg}
                </p>
                <button className="btn btn-primary" onClick={() => setSuccessMsg('')}>
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  {/* Student Name */}
                  <div className="form-group">
                    <label className="form-label">
                      <User size={15} inline style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Student Name *
                    </label>
                    <input
                      type="text"
                      name="student_name"
                      className="form-input"
                      placeholder="e.g. Master Aryan Sharma"
                      value={formData.student_name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Parent Name */}
                  <div className="form-group">
                    <label className="form-label">Parent / Guardian Name *</label>
                    <input
                      type="text"
                      name="parent_name"
                      className="form-input"
                      placeholder="e.g. Rajesh Kumar Sharma"
                      value={formData.parent_name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Class Selection */}
                  <div className="form-group">
                    <label className="form-label">
                      <BookOpen size={15} inline style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Student Class *
                    </label>
                    <select
                      name="student_class"
                      className="form-select"
                      value={formData.student_class}
                      onChange={handleChange}
                      required
                    >
                      {['Class 1st', 'Class 2nd', 'Class 3rd', 'Class 4th', 'Class 5th', 'Class 6th', 'Class 7th', 'Class 8th', 'Class 9th', 'Class 10th'].map((cls) => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>

                  {/* Phone Number */}
                  <div className="form-group">
                    <label className="form-label">
                      <Phone size={15} inline style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Contact Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label className="form-label">
                      <Mail size={15} inline style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      placeholder="e.g. parent@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Preferred Demo Slot */}
                  <div className="form-group">
                    <label className="form-label">Preferred Demo Slot</label>
                    <select
                      name="demo_slot"
                      className="form-select"
                      value={formData.demo_slot}
                      onChange={handleChange}
                    >
                      <option value="Sunday 10:00 AM">Sunday Morning (10:00 AM)</option>
                      <option value="Sunday 4:00 PM">Sunday Evening (4:00 PM)</option>
                      <option value="Weekday Evening (5 PM)">Weekday Evening (5:00 PM)</option>
                    </select>
                  </div>
                </div>

                {/* Preferred Subjects */}
                <div className="form-group">
                  <label className="form-label">Preferred Subjects / Interest</label>
                  <input
                    type="text"
                    name="preferred_subjects"
                    className="form-input"
                    placeholder="e.g. Mathematics, Science, All Subjects"
                    value={formData.preferred_subjects}
                    onChange={handleChange}
                  />
                </div>

                {/* Additional Message */}
                <div className="form-group">
                  <label className="form-label">Additional Queries or Message</label>
                  <textarea
                    name="message"
                    rows="3"
                    className="form-textarea"
                    placeholder="Mention any specific areas where the student needs extra focus..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
                  disabled={loading}
                >
                  {loading ? 'Submitting Enquiry...' : (
                    <>
                      <Send size={18} /> Submit Demo Enquiry
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
