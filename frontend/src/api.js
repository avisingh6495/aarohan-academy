// Robust API Helper for Aarohan Academy Frontend & Admin
// Syncs with Render REST API backend with automatic LocalStorage fail-safe fallback.

const RENDER_BACKEND_URL = 'https://aarohan-academy.onrender.com/api';

// Initial default seed data in case backend server is unreachable
const defaultSeedData = {
  teachers: [
    {
      id: '1',
      name: 'Avinash Singh',
      qualification: 'B.Tech & M.Tech (IIT Kanpur)',
      experience: '8+ Years Teaching Experience',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      subjects: ['Physics', 'Mathematics', 'Science (Class 9-10)', 'Mental Ability & Olympiad Prep'],
      bio: 'Ex-IITian dedicated to building crystal clear foundational concepts in Physics & Mathematics. Guided over 500+ students to top academic ranks.',
      highlight: 'IIT Kanpur Alumnus',
      display_order: 1
    },
    {
      id: '2',
      name: 'Shreya Singh',
      qualification: 'BCA & MCA (Nalanda Open University)',
      experience: '6+ Years Teaching Experience',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      subjects: ['English Literature & Grammar', 'Hindi', 'Social Studies (SST)', 'Computer Basics & Coding'],
      bio: 'Expert educator specializing in language mastery, SST, and basic computer logic for middle school students. Passionate about interactive, engaging learning.',
      highlight: 'MCA Rank Holder',
      display_order: 2
    }
  ],
  classes: [
    {
      id: '1',
      standard: 'Class 1 to 5',
      name: 'Primary Foundation Wing',
      subjects: ['Mathematics', 'English', 'Hindi', 'Environmental Studies (EVS)', 'Computer Basics'],
      batch_timings: '3:30 PM - 5:00 PM (Mon to Fri)',
      batch_size: 'Max 12 Students',
      description: 'Nurturing curiosity, strong reading habits, basic math logic, and clean handwriting.',
      display_order: 1
    },
    {
      id: '2',
      standard: 'Class 6 to 8',
      name: 'Middle School Prep',
      subjects: ['Science (Phy/Chem/Bio)', 'Mathematics', 'English', 'Hindi', 'Social Studies', 'Computer Science'],
      batch_timings: '5:00 PM - 6:45 PM (Mon to Sat)',
      batch_size: 'Max 15 Students',
      description: 'Focusing on subject depth, problem-solving skills, and preparing for school unit tests.',
      display_order: 2
    },
    {
      id: '3',
      standard: 'Class 9 & 10',
      name: 'Board Excellence Batch',
      subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English', 'Social Science'],
      batch_timings: '6:45 PM - 8:30 PM (Mon to Sat)',
      batch_size: 'Max 15 Students',
      description: 'Comprehensive Board Exam preparation, NCERT mastery, weekly test series, and previous year papers.',
      display_order: 3
    }
  ],
  fees: [
    {
      id: '1',
      class_category: 'Class 1 to 5',
      monthly_fee: '₹1,200',
      quarterly_fee: '₹3,300 (Save ₹300)',
      registration_fee: '₹200 (One-time)',
      inclusions: 'All subjects, printed workbooks, weekly tests, parent progress app',
      display_order: 1
    },
    {
      id: '2',
      class_category: 'Class 6 to 8',
      monthly_fee: '₹1,800',
      quarterly_fee: '₹5,000 (Save ₹400)',
      registration_fee: '₹300 (One-time)',
      inclusions: 'All 6 core subjects, monthly revision tests, Olympiad guidance, doubt sessions',
      display_order: 2
    },
    {
      id: '3',
      class_category: 'Class 9 & 10',
      monthly_fee: '₹2,500',
      quarterly_fee: '₹7,000 (Save ₹500)',
      registration_fee: '₹300 (One-time)',
      inclusions: 'Complete Science & Math Board prep, PYQ chapterwise booklets, 10 Full Mock Tests',
      display_order: 3
    }
  ],
  announcements: [
    {
      id: '1',
      title: '🎯 Free Demo Classes open for Academic Year 2026-27!',
      content: 'Book your 3-day free trial class for Class 1 to 10. Limited seats per batch.',
      type: 'Urgent',
      created_at: new Date().toLocaleDateString('en-IN')
    },
    {
      id: '2',
      title: '📝 Mid-Term Scholarship Test for Class 8-10 scheduled for next Sunday',
      content: 'Up to 50% fee concession for top 5 performers in Science & Math mock test.',
      type: 'Exam',
      created_at: new Date().toLocaleDateString('en-IN')
    }
  ],
  gallery: [
    { id: '1', title: 'Interactive Smart Classroom Session', category: 'Classroom', image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80' },
    { id: '2', title: 'Science Experiment Demonstration', category: 'Labs', image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80' },
    { id: '3', title: 'Annual Student Felicitation Ceremony', category: 'Events', image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80' }
  ],
  testimonials: [
    { id: '1', name: 'Rajesh Sharma', role: 'Parent of Class 10 Student', comment: 'Avinash Sir’s physics conceptual clarity helped my son score 95% in Class 10 boards. Highly recommended!', rating: 5 },
    { id: '2', name: 'Sunita Verma', role: 'Parent of Class 5 Student', comment: 'Shreya Ma’am is extremely patient with young kids. My daughter’s English grammar & confidence improved tremendously.', rating: 5 }
  ],
  content: {
    contact: {
      address: 'Aarohan Academy, Main Knowledge Highway, Near Central Park, City Center',
      phone: '+91 98765 43210',
      email: 'info@aarohanacademy.edu.in',
      timings: 'Monday - Saturday: 8:00 AM - 8:30 PM',
      whatsapp: '+919876543210',
      map_iframe: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.2582718151!2d80.3318!3d26.4499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDI2Jz5OSSA4MMKwMTknNTQuNSJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin'
    },
    hero: {
      title: 'Building Strong Foundations, Class 1 to 10',
      subtitle: 'Expert faculty, small batch sizes, individual doubt resolution, and proven academic results.',
      cta_primary: 'Book a Free Demo Class',
      cta_secondary: 'Contact Us'
    },
    about: {
      mission: 'To empower students from Class 1 to 10 with deep conceptual clarity, academic discipline, and self-confidence through personalized attention and experienced guidance.',
      philosophy: 'We believe every child can excel when given the right environment, clear fundamentals, and consistent encouragement rather than rote learning.'
    }
  },
  enquiries: []
};

// Initialize LocalStorage Data Store if empty
function getLocalStore() {
  const data = localStorage.getItem('aarohan_local_db');
  if (data) {
    try { return JSON.parse(data); } catch (e) {}
  }
  localStorage.setItem('aarohan_local_db', JSON.stringify(defaultSeedData));
  return defaultSeedData;
}

function saveLocalStore(store) {
  try {
    localStorage.setItem('aarohan_local_db', JSON.stringify(store));
  } catch (e) {
    console.error('LocalStorage save error:', e);
  }
}

const getApiBase = () => {
  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5050/api';
    }
    return RENDER_BACKEND_URL;
  }
  return 'http://localhost:5050/api';
};

function getAuthHeader() {
  const token = localStorage.getItem('aarohan_admin_token');
  if (token && token !== 'null' && token !== 'undefined') {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
}

// Request wrapper with automatic fail-safe fallback to LocalStorage
async function request(endpoint, options = {}) {
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${getApiBase()}${endpoint}${separator}_t=${Date.now()}`;
  const headers = { 
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    ...options.headers 
  };
  
  const authHeader = getAuthHeader();
  if (authHeader.Authorization) {
    headers['Authorization'] = authHeader.Authorization;
  }

  // Create a timeout controller so slow/spinning-down free servers fallback gracefully without hanging
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(url, { ...options, headers, cache: 'no-store', signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) {
      // If server returned 401/403 for wrong password, pass error through
      if (res.status === 401 || res.status === 403) {
        const text = await res.text();
        let json = {};
        try { json = JSON.parse(text); } catch (e) { json = { error: text }; }
        throw new Error(json.error || 'Invalid credentials.');
      }
      throw new Error(`HTTP ${res.status}`);
    }
    const json = await res.json();
    return json;
  } catch (err) {
    clearTimeout(timeoutId);
    // If backend REST server is unreachable or offline, perform operation locally via LocalStorage
    if (err.message === 'Invalid credentials.') {
      throw err;
    }
    return handleLocalFallback(endpoint, options);
  }
}

// LocalStorage Fallback Handler
function handleLocalFallback(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const store = getLocalStore();
  const body = options.body ? JSON.parse(options.body) : {};

  // 1. Auth endpoints
  if (endpoint === '/auth/login' && method === 'POST') {
    if (body.username === 'admin' && body.password === 'admin123') {
      const mockToken = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('aarohan_admin_token', mockToken);
      return { message: 'Login successful', token: mockToken, user: { id: '1', username: 'admin', role: 'admin' } };
    }
    throw new Error('Invalid username or password.');
  }

  if (endpoint === '/auth/verify') {
    const token = localStorage.getItem('aarohan_admin_token');
    if (token) return { valid: true, user: { username: 'admin', role: 'admin' } };
    throw new Error('Access denied.');
  }

  // 2. Teachers
  if (endpoint === '/teachers') {
    if (method === 'GET') return store.teachers || [];
    if (method === 'POST') {
      const newTeacher = { id: String(Date.now()), ...body };
      store.teachers.push(newTeacher);
      saveLocalStore(store);
      return newTeacher;
    }
  }
  if (endpoint.startsWith('/teachers/') && method === 'PUT') {
    const id = endpoint.split('/')[2];
    const idx = store.teachers.findIndex(t => String(t.id) === String(id));
    if (idx !== -1) {
      store.teachers[idx] = { ...store.teachers[idx], ...body };
      saveLocalStore(store);
      return store.teachers[idx];
    }
  }
  if (endpoint.startsWith('/teachers/') && method === 'DELETE') {
    const id = endpoint.split('/')[2];
    store.teachers = store.teachers.filter(t => String(t.id) !== String(id));
    saveLocalStore(store);
    return { success: true };
  }

  // 3. Classes
  if (endpoint === '/classes') {
    if (method === 'GET') return store.classes || [];
    if (method === 'POST') {
      const newClass = { id: String(Date.now()), ...body };
      store.classes.push(newClass);
      saveLocalStore(store);
      return newClass;
    }
  }
  if (endpoint.startsWith('/classes/') && method === 'PUT') {
    const id = endpoint.split('/')[2];
    const idx = store.classes.findIndex(c => String(c.id) === String(id));
    if (idx !== -1) {
      store.classes[idx] = { ...store.classes[idx], ...body };
      saveLocalStore(store);
      return store.classes[idx];
    }
  }
  if (endpoint.startsWith('/classes/') && method === 'DELETE') {
    const id = endpoint.split('/')[2];
    store.classes = store.classes.filter(c => String(c.id) !== String(id));
    saveLocalStore(store);
    return { success: true };
  }

  // 4. Fees
  if (endpoint === '/fees') {
    if (method === 'GET') return store.fees || [];
    if (method === 'POST') {
      const newFee = { id: String(Date.now()), ...body };
      store.fees.push(newFee);
      saveLocalStore(store);
      return newFee;
    }
  }
  if (endpoint.startsWith('/fees/') && method === 'PUT') {
    const id = endpoint.split('/')[2];
    const idx = store.fees.findIndex(f => String(f.id) === String(id));
    if (idx !== -1) {
      store.fees[idx] = { ...store.fees[idx], ...body };
      saveLocalStore(store);
      return store.fees[idx];
    }
  }
  if (endpoint.startsWith('/fees/') && method === 'DELETE') {
    const id = endpoint.split('/')[2];
    store.fees = store.fees.filter(f => String(f.id) !== String(id));
    saveLocalStore(store);
    return { success: true };
  }

  // 5. Announcements
  if (endpoint === '/announcements') {
    if (method === 'GET') return store.announcements || [];
    if (method === 'POST') {
      const newNotice = { id: String(Date.now()), created_at: new Date().toLocaleDateString('en-IN'), ...body };
      store.announcements.unshift(newNotice);
      saveLocalStore(store);
      return newNotice;
    }
  }
  if (endpoint.startsWith('/announcements/') && method === 'DELETE') {
    const id = endpoint.split('/')[2];
    store.announcements = store.announcements.filter(a => String(a.id) !== String(id));
    saveLocalStore(store);
    return { success: true };
  }

  // 6. Gallery
  if (endpoint === '/gallery') {
    if (method === 'GET') return store.gallery || [];
    if (method === 'POST') {
      const newItem = { id: String(Date.now()), ...body };
      store.gallery.push(newItem);
      saveLocalStore(store);
      return newItem;
    }
  }
  if (endpoint.startsWith('/gallery/') && method === 'DELETE') {
    const id = endpoint.split('/')[2];
    store.gallery = store.gallery.filter(g => String(g.id) !== String(id));
    saveLocalStore(store);
    return { success: true };
  }

  // 7. Testimonials
  if (endpoint === '/testimonials' && method === 'GET') {
    return store.testimonials || [];
  }

  // 8. Content (Contact, Hero, About)
  if (endpoint === '/content' && method === 'GET') {
    return store.content || defaultSeedData.content;
  }
  if (endpoint.startsWith('/content/') && method === 'PUT') {
    const key = endpoint.split('/')[2];
    if (!store.content) store.content = { ...defaultSeedData.content };
    store.content[key] = { ...store.content[key], ...body };
    saveLocalStore(store);
    return store.content[key];
  }

  // 9. Enquiries
  if (endpoint === '/enquiries') {
    if (method === 'GET') return store.enquiries || [];
    if (method === 'POST') {
      const newEnquiry = { id: String(Date.now()), created_at: new Date().toLocaleDateString('en-IN'), status: 'Pending', ...body };
      if (!store.enquiries) store.enquiries = [];
      store.enquiries.unshift(newEnquiry);
      saveLocalStore(store);
      return { success: true, message: 'Enquiry submitted successfully' };
    }
  }
  if (endpoint.includes('/status') && method === 'PUT') {
    const parts = endpoint.split('/');
    const id = parts[2];
    const idx = (store.enquiries || []).findIndex(e => String(e.id) === String(id));
    if (idx !== -1) {
      store.enquiries[idx].status = body.status;
      saveLocalStore(store);
      return store.enquiries[idx];
    }
  }

  return [];
}

export const api = {
  getTeachers() { return request('/teachers'); },
  getClasses() { return request('/classes'); },
  getFees() { return request('/fees'); },
  getAnnouncements() { return request('/announcements'); },
  getGallery() { return request('/gallery'); },
  getTestimonials() { return request('/testimonials'); },
  getContent() { return request('/content'); },

  submitEnquiry(data) {
    return request('/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async loginAdmin(username, password) {
    const json = await request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (json.token) {
      localStorage.setItem('aarohan_admin_token', json.token);
    }
    return json;
  },

  verifyAuth() { return request('/auth/verify'); },
  logoutAdmin() { localStorage.removeItem('aarohan_admin_token'); },

  addTeacher(data) {
    return request('/teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },
  updateTeacher(id, data) {
    return request(`/teachers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },
  deleteTeacher(id) {
    return request(`/teachers/${id}`, { method: 'DELETE' });
  },

  addClass(data) {
    return request('/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },
  updateClass(id, data) {
    return request(`/classes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },
  deleteClass(id) {
    return request(`/classes/${id}`, { method: 'DELETE' });
  },

  addFee(data) {
    return request('/fees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },
  updateFee(id, data) {
    return request(`/fees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },
  deleteFee(id) {
    return request(`/fees/${id}`, { method: 'DELETE' });
  },

  addAnnouncement(data) {
    return request('/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },
  deleteAnnouncement(id) {
    return request(`/announcements/${id}`, { method: 'DELETE' });
  },

  getEnquiries() { return request('/enquiries'); },
  updateEnquiryStatus(id, status) {
    return request(`/enquiries/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  },
  deleteEnquiry(id) {
    return request(`/enquiries/${id}`, { method: 'DELETE' });
  },

  addGallery(data) {
    return request('/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },
  deleteGallery(id) {
    return request(`/gallery/${id}`, { method: 'DELETE' });
  },

  updateContent(key, data) {
    return request(`/content/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
};
