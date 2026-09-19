import React, { useState, useEffect } from 'react';
import {
  Shield, LogOut, Users, BookOpen, DollarSign, Bell, Inbox, Image as ImageIcon,
  Plus, Trash2, Edit3, CheckCircle, AlertCircle, RefreshCw, MapPin, Phone, Mail, Clock, Map, Upload
} from 'lucide-react';
import { api } from '../api';

export default function AdminPanel({ isOpen, onClose, onDataChanged }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Admin Data state
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [fees, setFees] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [siteContent, setSiteContent] = useState({});

  // Contact Info Form State
  const [contactForm, setContactForm] = useState({
    address: '',
    phone: '',
    email: '',
    hours: '',
    mapEmbedUrl: ''
  });

  // Modal / Form state for CRUD operations
  const [modalMode, setModalMode] = useState(null); // 'edit_teacher', 'edit_class', 'edit_fee', 'edit_notice', 'add_gallery'
  const [currentItem, setCurrentItem] = useState({});

  useEffect(() => {
    if (isOpen) {
      checkAuth();
    }
  }, [isOpen]);

  const checkAuth = async () => {
    try {
      await api.verifyAuth();
      setIsAuthenticated(true);
      fetchAllAdminData();
    } catch (e) {
      setIsAuthenticated(false);
    }
  };

  const fetchAllAdminData = async () => {
    try {
      const [t, c, f, a, e, g, sc] = await Promise.all([
        api.getTeachers(),
        api.getClasses(),
        api.getFees(),
        api.getAnnouncements(),
        api.getEnquiries(),
        api.getGallery(),
        api.getContent()
      ]);
      setTeachers(t || []);
      setClasses(c || []);
      setFees(f || []);
      setAnnouncements(a || []);
      setEnquiries(e || []);
      setGallery(g || []);
      setSiteContent(sc || {});

      if (sc && sc.contact) {
        setContactForm({
          address: sc.contact.address || '',
          phone: sc.contact.phone || '',
          email: sc.contact.email || '',
          hours: sc.contact.hours || sc.contact.timings || '',
          mapEmbedUrl: sc.contact.mapEmbedUrl || sc.contact.map_iframe || ''
        });
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    try {
      await api.loginAdmin(username, password);
      setIsAuthenticated(true);
      fetchAllAdminData();
    } catch (err) {
      setLoginError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logoutAdmin();
    setIsAuthenticated(false);
  };

  // Local File Upload Helper with Canvas Compression (resizes to max 800px & 80% JPEG quality)
  const handleFileUpload = (e, callback) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 800; // max 800px width/height for fast loading
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to lightweight JPEG Data URL
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
        callback(compressedBase64);
      };
      img.onerror = () => {
        callback(event.target.result);
      };
    };
  };


  // --- TEACHER CRUD ---
  const handleSaveTeacher = async (e) => {
    e.preventDefault();
    try {
      const subjectsArr = typeof currentItem.subjects === 'string'
        ? currentItem.subjects.split(',').map(s => s.trim())
        : currentItem.subjects;

      const payload = { ...currentItem, subjects: subjectsArr };

      if (currentItem.id) {
        await api.updateTeacher(currentItem.id, payload);
      } else {
        await api.addTeacher(payload);
      }
      setModalMode(null);
      fetchAllAdminData();
      onDataChanged();
    } catch (err) {
      alert('Error saving teacher: ' + err.message);
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm('Delete this teacher profile?')) return;
    try {
      await api.deleteTeacher(id);
      fetchAllAdminData();
      onDataChanged();
    } catch (err) {
      alert('Failed to delete teacher');
    }
  };

  // --- CLASS & TIMINGS CRUD ---
  const handleSaveClass = async (e) => {
    e.preventDefault();
    try {
      const subjectsArr = typeof currentItem.subjects === 'string'
        ? currentItem.subjects.split(',').map(s => s.trim())
        : currentItem.subjects;

      const payload = { ...currentItem, subjects: subjectsArr };

      if (currentItem.id) {
        await api.updateClass(currentItem.id, payload);
      } else {
        await api.addClass(payload);
      }
      setModalMode(null);
      fetchAllAdminData();
      onDataChanged();
    } catch (err) {
      alert('Error saving class details: ' + err.message);
    }
  };

  const handleDeleteClass = async (id) => {
    if (!window.confirm('Delete this class wing?')) return;
    try {
      await api.deleteClass(id);
      fetchAllAdminData();
      onDataChanged();
    } catch (err) {
      alert('Failed to delete class');
    }
  };

  // --- FEE STRUCTURE CRUD ---
  const handleSaveFee = async (e) => {
    e.preventDefault();
    try {
      const featuresArr = typeof currentItem.features === 'string'
        ? currentItem.features.split(',').map(f => f.trim())
        : currentItem.features;

      const payload = { ...currentItem, features: featuresArr };

      if (currentItem.id) {
        await api.updateFee(currentItem.id, payload);
      } else {
        await api.addFee(payload);
      }
      setModalMode(null);
      fetchAllAdminData();
      onDataChanged();
    } catch (err) {
      alert('Error saving fee structure: ' + err.message);
    }
  };

  const handleDeleteFee = async (id) => {
    if (!window.confirm('Delete fee plan?')) return;
    try {
      await api.deleteFee(id);
      fetchAllAdminData();
      onDataChanged();
    } catch (err) {
      alert('Failed to delete fee plan');
    }
  };

  // --- ANNOUNCEMENT CRUD ---
  const handleSaveNotice = async (e) => {
    e.preventDefault();
    try {
      await api.addAnnouncement(currentItem);
      setModalMode(null);
      fetchAllAdminData();
      onDataChanged();
    } catch (err) {
      alert('Error posting announcement: ' + err.message);
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Delete announcement?')) return;
    try {
      await api.deleteAnnouncement(id);
      fetchAllAdminData();
      onDataChanged();
    } catch (err) {
      alert('Failed to delete notice');
    }
  };

  // --- GALLERY CRUD ---
  const handleSaveGallery = async (e) => {
    e.preventDefault();
    try {
      await api.addGallery(currentItem);
      setModalMode(null);
      fetchAllAdminData();
      onDataChanged();
    } catch (err) {
      alert('Error adding photo: ' + err.message);
    }
  };

  const handleDeleteGallery = async (id) => {
    if (!window.confirm('Delete photo from gallery?')) return;
    try {
      await api.deleteGallery(id);
      fetchAllAdminData();
      onDataChanged();
    } catch (err) {
      alert('Failed to delete gallery item');
    }
  };

  // --- CONTACT INFO UPDATE ---
  const handleSaveContact = async (e) => {
    e.preventDefault();
    try {
      await api.updateContent('contact', contactForm);
      alert('✅ Contact Details & Google Map updated successfully!');
      fetchAllAdminData();
      onDataChanged();
    } catch (err) {
      alert('Failed to update contact details: ' + err.message);
    }
  };

  // --- ENQUIRIES STATUS & DELETE ---
  const handleUpdateEnquiryStatus = async (id, status) => {
    try {
      await api.updateEnquiryStatus(id, status);
      fetchAllAdminData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm('Delete enquiry record?')) return;
    try {
      await api.deleteEnquiry(id);
      fetchAllAdminData();
    } catch (err) {
      alert('Failed to delete enquiry');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ padding: 0 }}>
      <div
        className="modal-content"
        style={{
          maxWidth: '1240px',
          width: '96%',
          height: '92vh',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Admin Header with proper alignment & spacing */}
        <div
          style={{
            background: 'var(--primary-navy)',
            color: 'white',
            padding: '1rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            width: '100%'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '1.2rem', fontWeight: 800 }}>
            <Shield color="#F97316" size={24} /> 
            <span>Aarohan Academy Admin Portal</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginLeft: 'auto' }}>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="btn"
                style={{
                  background: '#EF4444',
                  color: 'white',
                  fontSize: '0.825rem',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <LogOut size={15} /> Logout
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                color: '#94A3B8',
                fontSize: '1.5rem',
                cursor: 'pointer',
                lineHeight: 1,
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.color = '#FFF'}
              onMouseOut={(e) => e.target.style.color = '#94A3B8'}
              aria-label="Close Admin Modal"
            >
              ✕
            </button>
          </div>
        </div>

        {!isAuthenticated ? (
          /* Login Form (Cleaned without credentials hint) */
          <div style={{ padding: '3rem 1.5rem', maxWidth: '440px', margin: 'auto', width: '100%' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.5rem' }}>
              Admin Authentication
            </h2>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
              Sign in to manage faculty, classes, fees, notices, contact details, and admission enquiries.
            </p>

            {loginError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={18} /> {loginError}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
              </button>
            </form>
          </div>
        ) : (
          /* Admin Main Layout */
          <div className="admin-layout" style={{ flexGrow: 1, minHeight: 0 }}>
            {/* Responsive Sidebar Navigation */}
            <div className="admin-sidebar">
              <ul className="admin-nav">
                <li
                  className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <Shield size={18} /> Overview
                </li>
                <li
                  className={`admin-nav-item ${activeTab === 'teachers' ? 'active' : ''}`}
                  onClick={() => setActiveTab('teachers')}
                >
                  <Users size={18} /> Teachers ({teachers.length})
                </li>
                <li
                  className={`admin-nav-item ${activeTab === 'classes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('classes')}
                >
                  <BookOpen size={18} /> Classes & Timings ({classes.length})
                </li>
                <li
                  className={`admin-nav-item ${activeTab === 'fees' ? 'active' : ''}`}
                  onClick={() => setActiveTab('fees')}
                >
                  <DollarSign size={18} /> Fee Structure ({fees.length})
                </li>
                <li
                  className={`admin-nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
                  onClick={() => setActiveTab('gallery')}
                >
                  <ImageIcon size={18} /> Gallery ({gallery.length})
                </li>
                <li
                  className={`admin-nav-item ${activeTab === 'notices' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notices')}
                >
                  <Bell size={18} /> Announcements ({announcements.length})
                </li>
                <li
                  className={`admin-nav-item ${activeTab === 'contact' ? 'active' : ''}`}
                  onClick={() => setActiveTab('contact')}
                >
                  <MapPin size={18} /> Contact & Address
                </li>
                <li
                  className={`admin-nav-item ${activeTab === 'enquiries' ? 'active' : ''}`}
                  onClick={() => setActiveTab('enquiries')}
                >
                  <Inbox size={18} /> Enquiries ({enquiries.length})
                </li>
              </ul>
            </div>

            {/* Admin Main Content Area */}
            <div className="admin-main" style={{ overflowY: 'auto' }}>
              {/* DASHBOARD OVERVIEW */}
              {activeTab === 'dashboard' && (
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Dashboard Overview</h2>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ borderLeft: '4px solid var(--accent-orange)' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Faculty Members</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800 }}>{teachers.length}</div>
                    </div>

                    <div className="card" style={{ borderLeft: '4px solid var(--accent-teal)' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Active Wings</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800 }}>{classes.length}</div>
                    </div>

                    <div className="card" style={{ borderLeft: '4px solid #6366F1' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Admission Enquiries</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800 }}>{enquiries.length}</div>
                    </div>

                    <div className="card" style={{ borderLeft: '4px solid #EC4899' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Gallery Photos</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800 }}>{gallery.length}</div>
                    </div>
                  </div>

                  {/* Recent Admission Enquiries */}
                  <div className="card">
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Recent Enquiries</h3>
                    <div className="fee-table-container">
                      <table className="fee-table">
                        <thead>
                          <tr>
                            <th>Student & Parent</th>
                            <th>Class</th>
                            <th>Phone</th>
                            <th>Slot</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {enquiries.slice(0, 5).map((e) => (
                            <tr key={e.id}>
                              <td>{e.student_name} <br /><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Parent: {e.parent_name}</span></td>
                              <td>{e.student_class}</td>
                              <td>{e.phone}</td>
                              <td>{e.demo_slot}</td>
                              <td><span className="badge badge-orange">{e.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TEACHERS TAB */}
              {activeTab === 'teachers' && (
                <div>
                  <div className="admin-header">
                    <h2>Faculty Members ({teachers.length})</h2>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setCurrentItem({ name: '', qualification: '', experience: '', photo: '', subjects: '', bio: '', highlight: true });
                        setModalMode('edit_teacher');
                      }}
                    >
                      <Plus size={18} /> Add New Teacher
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {teachers.map((t) => (
                      <div className="card" key={t.id}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                          <img src={t.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'} alt={t.name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{t.name}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--accent-orange)', fontWeight: 600 }}>{t.qualification}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                            onClick={() => {
                              setCurrentItem({ ...t, subjects: Array.isArray(t.subjects) ? t.subjects.join(', ') : t.subjects });
                              setModalMode('edit_teacher');
                            }}
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                          <button
                            className="btn"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: '#FEE2E2', color: '#991B1B' }}
                            onClick={() => handleDeleteTeacher(t.id)}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CLASSES & TIMINGS TAB */}
              {activeTab === 'classes' && (
                <div>
                  <div className="admin-header">
                    <h2>Manage Classes & Batch Timings ({classes.length})</h2>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setCurrentItem({ title: '', grade_level: '', batch_timings: '', batch_size: '', description: '', subjects: '' });
                        setModalMode('edit_class');
                      }}
                    >
                      <Plus size={18} /> Add New Class
                    </button>
                  </div>

                  <div className="fee-table-container">
                    <table className="fee-table">
                      <thead>
                        <tr>
                          <th>Wing & Grade Level</th>
                          <th>Title</th>
                          <th>Batch Timings</th>
                          <th>Capacity</th>
                          <th>Subjects Offered</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classes.map((cls) => (
                          <tr key={cls.id}>
                            <td>
                              <span className="badge badge-orange">{cls.grade_level}</span>
                            </td>
                            <td><strong>{cls.title}</strong></td>
                            <td><span style={{ fontWeight: 600, color: '#0D9488' }}>{cls.batch_timings}</span></td>
                            <td>{cls.batch_size}</td>
                            <td>
                              <div style={{ fontSize: '0.85rem' }}>
                                {Array.isArray(cls.subjects) ? cls.subjects.join(', ') : cls.subjects}
                              </div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                  className="btn btn-outline"
                                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                                  onClick={() => {
                                    setCurrentItem({ ...cls, subjects: Array.isArray(cls.subjects) ? cls.subjects.join(', ') : cls.subjects });
                                    setModalMode('edit_class');
                                  }}
                                >
                                  <Edit3 size={14} /> Edit
                                </button>
                                <button
                                  className="btn"
                                  style={{ padding: '0.3rem 0.6rem', background: '#FEE2E2', color: '#991B1B', fontSize: '0.8rem' }}
                                  onClick={() => handleDeleteClass(cls.id)}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* FEE STRUCTURE TAB */}
              {activeTab === 'fees' && (
                <div>
                  <div className="admin-header">
                    <h2>Manage Fee Structure ({fees.length})</h2>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setCurrentItem({ class_category: '', grade_range: '', monthly_fee: '', quarterly_fee: '', admission_fee: 'Free Registration', features: '', notes: '' });
                        setModalMode('edit_fee');
                      }}
                    >
                      <Plus size={18} /> Add Fee Plan
                    </button>
                  </div>

                  <div className="fee-table-container">
                    <table className="fee-table">
                      <thead>
                        <tr>
                          <th>Category & Grades</th>
                          <th>Monthly Tuition Fee</th>
                          <th>Quarterly Fee</th>
                          <th>Admission Fee</th>
                          <th>Notes & Policy</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fees.map((fee) => (
                          <tr key={fee.id}>
                            <td>
                              <strong>{fee.class_category}</strong><br />
                              <span style={{ fontSize: '0.85rem', color: 'var(--accent-orange)', fontWeight: 600 }}>{fee.grade_range}</span>
                            </td>
                            <td><span className="fee-price">{fee.monthly_fee}</span></td>
                            <td><span style={{ color: '#0D9488', fontWeight: 600 }}>{fee.quarterly_fee}</span></td>
                            <td><span className="badge badge-teal">{fee.admission_fee}</span></td>
                            <td><span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{fee.notes}</span></td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                  className="btn btn-outline"
                                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                                  onClick={() => {
                                    setCurrentItem({ ...fee, features: Array.isArray(fee.features) ? fee.features.join(', ') : fee.features });
                                    setModalMode('edit_fee');
                                  }}
                                >
                                  <Edit3 size={14} /> Edit
                                </button>
                                <button
                                  className="btn"
                                  style={{ padding: '0.3rem 0.6rem', background: '#FEE2E2', color: '#991B1B', fontSize: '0.8rem' }}
                                  onClick={() => handleDeleteFee(fee.id)}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* GALLERY MANAGER TAB */}
              {activeTab === 'gallery' && (
                <div>
                  <div className="admin-header">
                    <h2>Manage Campus Gallery Photos ({gallery.length})</h2>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setCurrentItem({ title: '', category: 'Classroom', image_url: '', caption: '' });
                        setModalMode('add_gallery');
                      }}
                    >
                      <Plus size={18} /> Upload / Add Photo
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                    {gallery.map((g) => (
                      <div className="card" key={g.id} style={{ padding: 0, overflow: 'hidden' }}>
                        <img src={g.image_url} alt={g.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                        <div style={{ padding: '1rem' }}>
                          <span className="badge badge-navy" style={{ marginBottom: '0.4rem' }}>{g.category}</span>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{g.title}</h4>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>{g.caption}</p>
                          <button
                            className="btn"
                            style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.3rem 0.6rem', width: '100%', fontSize: '0.8rem' }}
                            onClick={() => handleDeleteGallery(g.id)}
                          >
                            <Trash2 size={14} /> Delete Photo
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ANNOUNCEMENTS TAB */}
              {activeTab === 'notices' && (
                <div>
                  <div className="admin-header">
                    <h2>Notices & Announcements ({announcements.length})</h2>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setCurrentItem({ title: '', content: '', tag: 'Notice', is_pinned: false });
                        setModalMode('edit_notice');
                      }}
                    >
                      <Plus size={18} /> Add Announcement
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {announcements.map((a) => (
                      <div className="card" key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem' }}>
                            <span className="badge badge-orange">{a.tag || a.type}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.date_str || a.created_at}</span>
                          </div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{a.title}</h4>
                          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{a.content}</p>
                        </div>
                        <button
                          className="btn"
                          style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.4rem 0.8rem' }}
                          onClick={() => handleDeleteNotice(a.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CONTACT & ADDRESS EDIT TAB */}
              {activeTab === 'contact' && (
                <div>
                  <div className="admin-header">
                    <h2>Edit Academy Contact & Location Details</h2>
                  </div>

                  <div className="card" style={{ maxWidth: '700px' }}>
                    <form onSubmit={handleSaveContact}>
                      <div className="form-group">
                        <label className="form-label">
                          <MapPin size={16} inline style={{ marginRight: '4px' }} /> Center Address
                        </label>
                        <textarea
                          rows="3"
                          className="form-textarea"
                          value={contactForm.address}
                          onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                          required
                        ></textarea>
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <Phone size={16} inline style={{ marginRight: '4px' }} /> Phone & WhatsApp Numbers
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <Mail size={16} inline style={{ marginRight: '4px' }} /> Official Email Address
                        </label>
                        <input
                          type="email"
                          className="form-input"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <Clock size={16} inline style={{ marginRight: '4px' }} /> Center Operating Hours
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          value={contactForm.hours}
                          onChange={(e) => setContactForm({ ...contactForm, hours: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <Map size={16} inline style={{ marginRight: '4px' }} /> Google Maps Embed URL / Location Link
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          value={contactForm.mapEmbedUrl}
                          onChange={(e) => setContactForm({ ...contactForm, mapEmbedUrl: e.target.value })}
                          placeholder="Paste Google Maps URL or embed link..."
                        />
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.5rem', width: '100%' }}>
                        Save Contact & Address Details
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* ENQUIRIES TAB */}
              {activeTab === 'enquiries' && (
                <div>
                  <div className="admin-header">
                    <h2>Admission Enquiries ({enquiries.length})</h2>
                    <button className="btn btn-outline" onClick={fetchAllAdminData}>
                      <RefreshCw size={16} /> Refresh List
                    </button>
                  </div>

                  <div className="fee-table-container">
                    <table className="fee-table">
                      <thead>
                        <tr>
                          <th>Student & Parent</th>
                          <th>Class</th>
                          <th>Contact Details</th>
                          <th>Demo Slot</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enquiries.map((e) => (
                          <tr key={e.id}>
                            <td>
                              <strong>{e.student_name}</strong><br />
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Parent: {e.parent_name}</span>
                            </td>
                            <td>{e.student_class}</td>
                            <td>
                              📞 {e.phone}<br />
                              {e.email && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>✉️ {e.email}</span>}
                            </td>
                            <td>{e.demo_slot}</td>
                            <td>
                              <select
                                className="form-select"
                                style={{ padding: '0.3rem', fontSize: '0.8rem' }}
                                value={e.status}
                                onChange={(ev) => handleUpdateEnquiryStatus(e.id, ev.target.value)}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Enrolled">Enrolled</option>
                              </select>
                            </td>
                            <td>
                              <button
                                className="btn"
                                style={{ padding: '0.3rem 0.6rem', background: '#FEE2E2', color: '#991B1B' }}
                                onClick={() => handleDeleteEnquiry(e.id)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL: Edit/Add Teacher (with Local System Image Upload option) */}
        {modalMode === 'edit_teacher' && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '550px' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem' }}>
                {currentItem.id ? 'Edit Teacher Profile' : 'Add New Teacher'}
              </h3>
              <form onSubmit={handleSaveTeacher}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentItem.name || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Qualifications (e.g. B.Tech (IIT Kanpur))</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentItem.qualification || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, qualification: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Experience (e.g. 8+ Years)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentItem.experience || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, experience: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Subjects (comma-separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentItem.subjects || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, subjects: e.target.value })}
                    placeholder="Mathematics, Physics, Chemistry"
                  />
                </div>

                {/* Local System File Upload + URL Input for Teacher */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Upload size={16} color="#F97316" /> Teacher Photo (Local System Upload OR URL)
                  </label>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        id="teacher-file-input"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload(e, (base64) => setCurrentItem({ ...currentItem, photo: base64 }))}
                      />
                      <label
                        htmlFor="teacher-file-input"
                        className="btn btn-outline"
                        style={{ width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#F8FAFC' }}
                      >
                        <Upload size={16} /> Choose Image File from Device/Folder
                      </label>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>— OR Paste Direct Image URL —</div>

                    <input
                      type="text"
                      className="form-input"
                      value={currentItem.photo || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, photo: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                    />

                    {/* Image Preview */}
                    {currentItem.photo && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#F1F5F9', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                        <img src={currentItem.photo} alt="Preview" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                        <span style={{ fontSize: '0.8rem', color: '#0D9488', fontWeight: 600 }}>✓ Photo Selected</span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setModalMode(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Teacher</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Edit/Add Class & Timings */}
        {modalMode === 'edit_class' && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '550px' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem' }}>
                {currentItem.id ? 'Edit Class Wing & Timings' : 'Add New Class Wing'}
              </h3>
              <form onSubmit={handleSaveClass}>
                <div className="form-group">
                  <label className="form-label">Wing Title (e.g. Primary Foundation Wing)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentItem.title || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Grade Level (e.g. Class 1st to 5th)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentItem.grade_level || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, grade_level: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Batch Timings (e.g. Evening: 3:30 PM - 5:30 PM)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentItem.batch_timings || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, batch_timings: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Batch Size / Capacity (e.g. Max 15 Students)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentItem.batch_size || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, batch_size: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Covered Subjects (comma-separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentItem.subjects || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, subjects: e.target.value })}
                    placeholder="Mathematics, General Science, English"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows="3"
                    className="form-textarea"
                    value={currentItem.description || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                  ></textarea>
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setModalMode(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Class</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Edit/Add Fee Plan */}
        {modalMode === 'edit_fee' && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '550px' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem' }}>
                {currentItem.id ? 'Edit Fee Plan' : 'Add Fee Plan'}
              </h3>
              <form onSubmit={handleSaveFee}>
                <div className="form-group">
                  <label className="form-label">Class Category (e.g. Middle School)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentItem.class_category || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, class_category: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Grade Range (e.g. Class 6th to 8th)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentItem.grade_range || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, grade_range: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Monthly Fee (e.g. ₹1,800 / month)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentItem.monthly_fee || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, monthly_fee: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Quarterly Fee (e.g. ₹5,000 / quarter)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentItem.quarterly_fee || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, quarterly_fee: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Admission Fee</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentItem.admission_fee || 'Free Registration'}
                    onChange={(e) => setCurrentItem({ ...currentItem, admission_fee: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Inclusions / Features (comma-separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentItem.features || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, features: e.target.value })}
                    placeholder="Weekly Tests, Doubts Sessions, Revision Notes"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Notes & Discount Policy</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentItem.notes || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, notes: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setModalMode(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Fee Plan</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Upload / Add Gallery Photo (with Local System Image Upload option) */}
        {modalMode === 'add_gallery' && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '550px' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem' }}>Add Gallery Photo</h3>
              <form onSubmit={handleSaveGallery}>
                <div className="form-group">
                  <label className="form-label">Photo Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentItem.title || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={currentItem.category || 'Classroom'}
                    onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                  >
                    <option value="Classroom">Classroom</option>
                    <option value="Science Lab">Science Lab</option>
                    <option value="Events">Events</option>
                    <option value="Achievements">Achievements</option>
                  </select>
                </div>

                {/* Local System File Upload + URL Input for Gallery */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Upload size={16} color="#F97316" /> Image File (Upload from Computer OR URL)
                  </label>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        id="gallery-file-input"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload(e, (base64) => setCurrentItem({ ...currentItem, image_url: base64 }))}
                      />
                      <label
                        htmlFor="gallery-file-input"
                        className="btn btn-outline"
                        style={{ width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#F8FAFC' }}
                      >
                        <Upload size={16} /> Choose Image File from Device/Folder
                      </label>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>— OR Paste Direct Photo Link —</div>

                    <input
                      type="text"
                      className="form-input"
                      value={currentItem.image_url || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, image_url: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                    />

                    {/* Image Preview */}
                    {currentItem.image_url && (
                      <div style={{ background: '#F1F5F9', padding: '0.5rem', borderRadius: '8px' }}>
                        <img src={currentItem.image_url} alt="Preview" style={{ width: '100%', height: '140px', borderRadius: '6px', objectFit: 'cover' }} />
                        <div style={{ fontSize: '0.75rem', color: '#0D9488', fontWeight: 600, marginTop: '0.25rem', textAlign: 'center' }}>✓ Image Ready to Upload</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Caption / Description</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentItem.caption || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, caption: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setModalMode(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Upload Photo</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Edit/Add Notice */}
        {modalMode === 'edit_notice' && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '550px' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem' }}>Add Announcement</h3>
              <form onSubmit={handleSaveNotice}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentItem.title || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tag</label>
                  <select
                    className="form-select"
                    value={currentItem.tag || 'Notice'}
                    onChange={(e) => setCurrentItem({ ...currentItem, tag: e.target.value })}
                  >
                    <option value="Notice">Notice</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Exam">Exam Schedule</option>
                    <option value="Holiday">Holiday</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Content</label>
                  <textarea
                    rows="4"
                    className="form-textarea"
                    value={currentItem.content || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, content: e.target.value })}
                    required
                  ></textarea>
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setModalMode(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Post Notice</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
