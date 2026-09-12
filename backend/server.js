const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5050;
const JWT_SECRET = process.env.JWT_SECRET || 'aarohan_academy_super_secret_jwt_key_2026';

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://avisingh6495.github.io',
  /^https:\/\/avisingh6495\.github\.io.*/
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser (curl, Render health checks)
    if (allowedOrigins.some(o => (typeof o === 'string' ? o === origin : o.test(origin)))) {
      return callback(null, true);
    }
    callback(new Error('CORS: origin not allowed: ' + origin));
  },
  credentials: true
}));
app.use(express.json());

// Auth Middleware for protected routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token || token === 'null' || token === 'undefined') {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired session token.' });
    }
    req.user = user;
    next();
  });
}

// ----------------------------------------------------
// 1. AUTHENTICATION ENDPOINTS
// ----------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const admin = db.findAdmin(username);
  if (!admin) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const validPassword = bcrypt.compareSync(password, admin.password_hash);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: { id: admin.id, username: admin.username, role: 'admin' }
  });
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// ----------------------------------------------------
// 2. TEACHERS ENDPOINTS
// ----------------------------------------------------
app.get('/api/teachers', (req, res) => {
  res.json(db.getTeachers());
});

app.post('/api/teachers', authenticateToken, (req, res) => {
  const { name, qualification, experience, photo, subjects, bio, highlight, display_order } = req.body;
  if (!name || !qualification) {
    return res.status(400).json({ error: 'Name and qualification are required.' });
  }
  const teacher = db.addTeacher({
    name,
    qualification,
    experience: experience || '',
    photo: photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    subjects: Array.isArray(subjects) ? subjects : [subjects],
    bio: bio || '',
    highlight: Boolean(highlight),
    display_order: display_order || 0
  });
  res.status(201).json({ id: teacher.id, message: 'Teacher added successfully', teacher });
});

app.put('/api/teachers/:id', authenticateToken, (req, res) => {
  const teacher = db.updateTeacher(req.params.id, req.body);
  if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
  res.json({ message: 'Teacher updated successfully', teacher });
});

app.delete('/api/teachers/:id', authenticateToken, (req, res) => {
  db.deleteTeacher(req.params.id);
  res.json({ message: 'Teacher deleted successfully' });
});

// ----------------------------------------------------
// 3. CLASSES ENDPOINTS
// ----------------------------------------------------
app.get('/api/classes', (req, res) => {
  res.json(db.getClasses());
});

app.post('/api/classes', authenticateToken, (req, res) => {
  const newClass = db.addClass(req.body);
  res.status(201).json({ id: newClass.id, message: 'Class added successfully', class: newClass });
});

app.put('/api/classes/:id', authenticateToken, (req, res) => {
  const updated = db.updateClass(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Class not found' });
  res.json({ message: 'Class updated successfully', class: updated });
});

app.delete('/api/classes/:id', authenticateToken, (req, res) => {
  db.deleteClass(req.params.id);
  res.json({ message: 'Class deleted successfully' });
});

// ----------------------------------------------------
// 4. FEES ENDPOINTS
// ----------------------------------------------------
app.get('/api/fees', (req, res) => {
  res.json(db.getFees());
});

app.post('/api/fees', authenticateToken, (req, res) => {
  const fee = db.addFee(req.body);
  res.status(201).json({ id: fee.id, message: 'Fee structure added successfully', fee });
});

app.put('/api/fees/:id', authenticateToken, (req, res) => {
  const fee = db.updateFee(req.params.id, req.body);
  if (!fee) return res.status(404).json({ error: 'Fee entry not found' });
  res.json({ message: 'Fee structure updated successfully', fee });
});

app.delete('/api/fees/:id', authenticateToken, (req, res) => {
  db.deleteFee(req.params.id);
  res.json({ message: 'Fee entry deleted successfully' });
});

// ----------------------------------------------------
// 5. ANNOUNCEMENTS / NOTICES ENDPOINTS
// ----------------------------------------------------
app.get('/api/announcements', (req, res) => {
  res.json(db.getAnnouncements());
});

app.post('/api/announcements', authenticateToken, (req, res) => {
  const { title, content, tag, date_str, is_pinned } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  const currentDate = date_str || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const notice = db.addAnnouncement({ title, content, tag: tag || 'Notice', date_str: currentDate, is_pinned: Boolean(is_pinned) });
  res.status(201).json({ id: notice.id, message: 'Announcement created successfully', notice });
});

app.delete('/api/announcements/:id', authenticateToken, (req, res) => {
  db.deleteAnnouncement(req.params.id);
  res.json({ message: 'Announcement deleted successfully' });
});

// ----------------------------------------------------
// 6. ENQUIRIES / ADMISSIONS ENDPOINTS
// ----------------------------------------------------
app.get('/api/enquiries', authenticateToken, (req, res) => {
  res.json(db.getEnquiries());
});

app.post('/api/enquiries', (req, res) => {
  const { student_name, parent_name, student_class, phone, email, preferred_subjects, demo_slot, message } = req.body;

  if (!student_name || !parent_name || !phone || !student_class) {
    return res.status(400).json({ error: 'Student Name, Parent Name, Class, and Phone Number are required.' });
  }

  const enquiry = db.addEnquiry({ student_name, parent_name, student_class, phone, email, preferred_subjects, demo_slot, message });
  res.status(201).json({
    id: enquiry.id,
    message: 'Enquiry submitted successfully! Our counselor will reach out shortly.'
  });
});

app.put('/api/enquiries/:id/status', authenticateToken, (req, res) => {
  const enquiry = db.updateEnquiryStatus(req.params.id, req.body.status);
  if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
  res.json({ message: 'Status updated successfully', enquiry });
});

app.delete('/api/enquiries/:id', authenticateToken, (req, res) => {
  db.deleteEnquiry(req.params.id);
  res.json({ message: 'Enquiry deleted successfully' });
});

// ----------------------------------------------------
// 7. GALLERY & TESTIMONIALS & SITE CONTENT
// ----------------------------------------------------
app.get('/api/gallery', (req, res) => res.json(db.getGallery()));

app.post('/api/gallery', authenticateToken, (req, res) => {
  const { title, category, image_url, caption } = req.body;
  if (!title || !image_url) {
    return res.status(400).json({ error: 'Title and image URL are required.' });
  }
  const item = db.addGalleryItem({ title, category: category || 'Classroom', image_url, caption: caption || '' });
  res.status(201).json({ message: 'Gallery photo uploaded successfully', item });
});

app.delete('/api/gallery/:id', authenticateToken, (req, res) => {
  db.deleteGalleryItem(req.params.id);
  res.json({ message: 'Gallery photo deleted successfully' });
});
app.get('/api/testimonials', (req, res) => res.json(db.getTestimonials()));
app.get('/api/content', (req, res) => res.json(db.getContent()));

app.put('/api/content/:key', authenticateToken, (req, res) => {
  const updated = db.updateContent(req.params.key, req.body);
  res.json({ message: `Content section '${req.params.key}' updated successfully`, content: updated });
});

// ----------------------------------------------------
// 8. STATIC FRONTEND SERVING
// ----------------------------------------------------
const distPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Aarohan Academy REST API & Web Server listening on port ${PORT}`);
});
