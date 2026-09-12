// Robust API Helper for Aarohan Academy Frontend & Admin

// ⚡ Production backend URL (Render.com) — update this after deploying to Render
const RENDER_BACKEND_URL = 'https://aarohan-academy.onrender.com/api';

const getApiBase = () => {
  if (typeof window !== 'undefined') {
    const { hostname, port } = window.location;
    // Local dev (Vite)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5050/api';
    }
    // GitHub Pages or any other hosted domain → use Render backend
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

  try {
    const res = await fetch(url, { ...options, headers, cache: 'no-store' });
    const text = await res.text();
    
    let json = {};
    if (text) {
      try {
        json = JSON.parse(text);
      } catch (e) {
        json = { error: text };
      }
    }

    if (!res.ok) {
      const errorMsg = json && json.error 
        ? String(json.error) 
        : `Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }

    return json;
  } catch (err) {
    if (err.name === 'TypeError' || err.message.includes('pattern') || err.message.includes('fetch')) {
      throw new Error('Connection error: Unable to reach backend server. Please try again.');
    }
    throw err;
  }
}

export const api = {
  // Public Requests
  async getTeachers() {
    return request('/teachers');
  },

  async getClasses() {
    return request('/classes');
  },

  async getFees() {
    return request('/fees');
  },

  async getAnnouncements() {
    return request('/announcements');
  },

  async getGallery() {
    return request('/gallery');
  },

  async getTestimonials() {
    return request('/testimonials');
  },

  async getContent() {
    return request('/content');
  },

  async submitEnquiry(data) {
    return request('/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  // Auth & Admin Requests
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

  async verifyAuth() {
    return request('/auth/verify');
  },

  logoutAdmin() {
    localStorage.removeItem('aarohan_admin_token');
  },

  // Admin CRUD for Teachers
  async addTeacher(data) {
    return request('/teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async updateTeacher(id, data) {
    return request(`/teachers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async deleteTeacher(id) {
    return request(`/teachers/${id}`, {
      method: 'DELETE'
    });
  },

  // Admin CRUD for Classes
  async addClass(data) {
    return request('/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async updateClass(id, data) {
    return request(`/classes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async deleteClass(id) {
    return request(`/classes/${id}`, {
      method: 'DELETE'
    });
  },

  // Admin CRUD for Fees
  async addFee(data) {
    return request('/fees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async updateFee(id, data) {
    return request(`/fees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async deleteFee(id) {
    return request(`/fees/${id}`, {
      method: 'DELETE'
    });
  },

  // Admin CRUD for Announcements
  async addAnnouncement(data) {
    return request('/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async deleteAnnouncement(id) {
    return request(`/announcements/${id}`, {
      method: 'DELETE'
    });
  },

  // Admin View Enquiries
  async getEnquiries() {
    return request('/enquiries');
  },

  async updateEnquiryStatus(id, status) {
    return request(`/enquiries/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  },

  async deleteEnquiry(id) {
    return request(`/enquiries/${id}`, {
      method: 'DELETE'
    });
  },

  // Admin Gallery CRUD
  async addGallery(data) {
    return request('/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async deleteGallery(id) {
    return request(`/gallery/${id}`, {
      method: 'DELETE'
    });
  },

  // Admin Content / Contact Update
  async updateContent(key, data) {
    return request(`/content/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
};
