const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, 'aarohan-db.json');

let dbData = {
  admin_users: [],
  teachers: [],
  classes: [],
  fees: [],
  announcements: [],
  enquiries: [],
  gallery: [],
  testimonials: [],
  site_content: {}
};

function loadDatabase() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      dbData = JSON.parse(raw);
    } catch (e) {
      console.error('Error loading DB file, re-initializing:', e);
      seedInitialData();
    }
  } else {
    seedInitialData();
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save DB file:', e);
  }
}

function seedInitialData() {
  // Seed Admin
  if (!dbData.admin_users || dbData.admin_users.length === 0) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('admin123', salt);
    dbData.admin_users = [{ id: 1, username: 'admin', password_hash: hash, role: 'admin' }];
  }

  // Seed Teachers
  if (!dbData.teachers || dbData.teachers.length === 0) {
    dbData.teachers = [
      {
        id: 1,
        name: 'Avinash Singh',
        qualification: 'B.Tech & M.Tech (IIT Kanpur)',
        experience: '8+ Years Teaching Experience',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        subjects: ['Mathematics', 'Physics', 'Chemistry', 'Mental Ability'],
        bio: 'Passionate educator specializing in conceptual clarity and analytical problem solving for middle & high school students.',
        highlight: true,
        display_order: 1
      },
      {
        id: 2,
        name: 'Shreya Singh',
        qualification: 'BCA & MCA (Nalanda University)',
        experience: '6+ Years Teaching Experience',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        subjects: ['Computer Basics', 'English Grammar', 'Hindi Literature', 'Social Studies'],
        bio: 'Expert in interactive teaching methods, foundation literacy, and computer literacy for young learners.',
        highlight: true,
        display_order: 2
      }
    ];
  }

  // Seed Classes
  if (!dbData.classes || dbData.classes.length === 0) {
    dbData.classes = [
      {
        id: 1,
        grade_level: 'Class 1st to 5th',
        title: 'Primary Foundation Wing',
        subjects: ['Mathematics', 'Science (EVS)', 'English', 'Hindi', 'Basic Computer'],
        batch_timings: 'Evening: 3:30 PM - 5:30 PM',
        batch_size: 'Max 12 Students',
        description: 'Focus on strong reading, basic arithmetic, curiosity building, and handwriting improvement.',
        icon: 'book-open'
      },
      {
        id: 2,
        grade_level: 'Class 6th to 8th',
        title: 'Middle School Excellence Wing',
        subjects: ['Mathematics', 'General Science', 'English Grammar', 'Hindi', 'Social Studies', 'Computer Basics'],
        batch_timings: 'Evening: 4:30 PM - 6:30 PM',
        batch_size: 'Max 15 Students',
        description: 'Building solid conceptual foundations in Science & Math, regular weekly tests, and homework guidance.',
        icon: 'award'
      },
      {
        id: 3,
        grade_level: 'Class 9th & 10th',
        title: 'Board Exam Mastery Wing',
        subjects: ['Mathematics (Standard & Basic)', 'Physics', 'Chemistry', 'Biology', 'English', 'Social Science'],
        batch_timings: 'Evening: 5:00 PM - 7:30 PM',
        batch_size: 'Max 15 Students',
        description: 'Rigorous board exam preparation, previous 10-year question practice, mock test series, and 1-on-1 doubt clearing.',
        icon: 'graduation-cap'
      }
    ];
  }

  // Seed Fees
  if (!dbData.fees || dbData.fees.length === 0) {
    dbData.fees = [
      {
        id: 1,
        class_category: 'Primary Wing',
        grade_range: 'Class 1st to 5th',
        monthly_fee: '₹1,200 / month',
        quarterly_fee: '₹3,300 / quarter',
        admission_fee: 'Free Registration',
        features: ['All Core Subjects', 'Small Batch (12 Max)', 'Weekly Worksheets', 'Personalized Attention'],
        notes: 'Special 10% discount on sibling enrollment.'
      },
      {
        id: 2,
        class_category: 'Middle School',
        grade_range: 'Class 6th to 8th',
        monthly_fee: '₹1,800 / month',
        quarterly_fee: '₹5,000 / quarter',
        admission_fee: 'Free Registration',
        features: ['Maths, Science & English Focus', 'Weekly Assessment Tests', 'Science Experiment Demos', 'Doubt Clearing Sessions'],
        notes: 'Fee includes test series material and revision notes.'
      },
      {
        id: 3,
        class_category: 'Secondary / Board Prep',
        grade_range: 'Class 9th & 10th',
        monthly_fee: '₹2,500 / month',
        quarterly_fee: '₹7,000 / quarter',
        admission_fee: 'Free Registration',
        features: ['Complete CBSE/ICSE Board Syllabus', '10+ Mock Board Exams', 'IIT-Kanpur Mentorship Sessions', 'Sample Papers & Answer Key Reviews'],
        notes: 'Special crash course discounts available before board exams.'
      }
    ];
  }

  // Seed Announcements
  if (!dbData.announcements || dbData.announcements.length === 0) {
    dbData.announcements = [
      {
        id: 1,
        title: 'Free Sunday Demo Classes for Class 8, 9 & 10',
        content: 'Join our interactive demo session on Sunday at 10:00 AM. Meet IIT Kanpur alumnus Er. Avinash Singh for Mathematics & Science strategies.',
        tag: 'Urgent',
        date_str: 'Sep 15, 2026',
        is_pinned: true
      },
      {
        id: 2,
        title: 'Monthly Assessment Test Schedule Announced',
        content: 'The monthly chapter test for Class 6th to 10th will be held on Friday. Syllabus has been shared in batch WhatsApp groups.',
        tag: 'Exam',
        date_str: 'Sep 18, 2026',
        is_pinned: false
      },
      {
        id: 3,
        title: 'Parent-Teacher Meeting (PTM)',
        content: 'Quarterly progress report meeting is scheduled for Saturday, 4:00 PM to 7:00 PM. All parents are warmly invited.',
        tag: 'Notice',
        date_str: 'Sep 20, 2026',
        is_pinned: false
      }
    ];
  }

  // Seed Gallery
  if (!dbData.gallery || dbData.gallery.length === 0) {
    dbData.gallery = [
      {
        id: 1,
        title: 'Smart Interactive Classroom',
        category: 'Classroom',
        image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
        caption: 'Air-conditioned modern classroom with digital boards and comfortable seating.'
      },
      {
        id: 2,
        title: 'Hands-On Science Experiment Session',
        category: 'Science Lab',
        image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
        caption: 'Students exploring physics & chemistry practical concepts under teacher supervision.'
      },
      {
        id: 3,
        title: 'Annual Achievers Award Ceremony',
        category: 'Achievements',
        image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
        caption: 'Felicitation of Class 10th Board toppers achieving 95%+ marks.'
      },
      {
        id: 4,
        title: 'Computer Basics & Coding Workshop',
        category: 'Events',
        image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
        caption: 'Shreya Singh guiding students in basic programming and digital literacy.'
      }
    ];
  }

  // Seed Testimonials
  if (!dbData.testimonials || dbData.testimonials.length === 0) {
    dbData.testimonials = [
      {
        id: 1,
        name: 'Rajesh Kumar Sharma',
        role: 'Parent of Aryan (Class 9)',
        quote: 'Aarohan Academy transformed my son’s interest in Science and Mathematics. Avinash Sir explains complex physics concepts with everyday examples. Aryan scored 94% in his mid-terms!',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      },
      {
        id: 2,
        name: 'Pooja Verma',
        role: 'Parent of Ananya (Class 5)',
        quote: 'The small batch size of 12 students ensures my daughter gets personal attention. Shreya Ma’am is extremely patient and friendly. Her handwriting and English grammar improved tremendously.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
      },
      {
        id: 3,
        name: 'Rohan Gupta',
        role: 'Class 10 Student (96.4% CBSE)',
        quote: 'The regular Sunday mock tests and previous year question discussions at Aarohan Academy gave me full confidence for my board exams. Highly recommended!',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
      }
    ];
  }

  // Seed Site Content
  if (!dbData.site_content || Object.keys(dbData.site_content).length === 0) {
    dbData.site_content = {
      hero: {
        title: "Building Strong Academic Foundations for Tomorrow's Leaders",
        tagline: "Building strong foundations, Class 1 to 10",
        subtitle: "Personalized coaching with small batch sizes, expert faculty from IIT Kanpur & top universities, and concept-first learning.",
        badge: "⭐ Admissions Open for Session 2026-27"
      },
      about: {
        mission: "To empower students from Class 1 to 10 with deep conceptual understanding, analytical thinking, and confidence to excel academically and beyond.",
        philosophy: "We believe no student is weak—they only need the right guidance, small batch focus, and clear foundational concepts.",
        whyChooseUs: [
          "IIT Kanpur & MCA Expert Faculty",
          "Strictly Small Batch Size (Max 12-15 Students)",
          "Weekly Assessment Tests & Homework Monitoring",
          "Dedicated Doubt Resolution Hours",
          "Regular PTMs & Progress Reports to Parents"
        ]
      },
      contact: {
        address: "Aarohan Academy, Main Knowledge Highway, Near City Central Library, Sector 4",
        phone: "+91 98765 43210 / +91 98765 43211",
        email: "info@aarohanacademy.edu.in",
        hours: "Mon - Sat: 3:00 PM - 8:00 PM | Sun: 9:00 AM - 1:00 PM",
        mapEmbedUrl: "https://maps.google.com/maps?q=IIT+Kanpur&t=&z=13&ie=UTF8&iwloc=&output=embed"
      }
    };
  }

  saveDatabase();
}

// Initialize Database on load
loadDatabase();

module.exports = {
  getData: () => dbData,
  saveData: saveDatabase,

  // Helper Methods
  findAdmin: (username) => dbData.admin_users.find(u => u.username === username),

  getTeachers: () => dbData.teachers,
  addTeacher: (item) => {
    const newItem = { id: Date.now(), ...item };
    dbData.teachers.push(newItem);
    saveDatabase();
    return newItem;
  },
  updateTeacher: (id, data) => {
    const idx = dbData.teachers.findIndex(t => t.id === parseInt(id));
    if (idx !== -1) {
      dbData.teachers[idx] = { ...dbData.teachers[idx], ...data };
      saveDatabase();
      return dbData.teachers[idx];
    }
    return null;
  },
  deleteTeacher: (id) => {
    dbData.teachers = dbData.teachers.filter(t => t.id !== parseInt(id));
    saveDatabase();
  },

  getClasses: () => dbData.classes,
  addClass: (item) => {
    const newItem = { id: Date.now(), ...item };
    dbData.classes.push(newItem);
    saveDatabase();
    return newItem;
  },
  updateClass: (id, data) => {
    const idx = dbData.classes.findIndex(c => c.id === parseInt(id));
    if (idx !== -1) {
      dbData.classes[idx] = { ...dbData.classes[idx], ...data };
      saveDatabase();
      return dbData.classes[idx];
    }
    return null;
  },
  deleteClass: (id) => {
    dbData.classes = dbData.classes.filter(c => c.id !== parseInt(id));
    saveDatabase();
  },

  getFees: () => dbData.fees,
  addFee: (item) => {
    const newItem = { id: Date.now(), ...item };
    dbData.fees.push(newItem);
    saveDatabase();
    return newItem;
  },
  updateFee: (id, data) => {
    const idx = dbData.fees.findIndex(f => f.id === parseInt(id));
    if (idx !== -1) {
      dbData.fees[idx] = { ...dbData.fees[idx], ...data };
      saveDatabase();
      return dbData.fees[idx];
    }
    return null;
  },
  deleteFee: (id) => {
    dbData.fees = dbData.fees.filter(f => f.id !== parseInt(id));
    saveDatabase();
  },

  getAnnouncements: () => dbData.announcements,
  addAnnouncement: (item) => {
    const newItem = { id: Date.now(), created_at: new Date().toISOString(), ...item };
    dbData.announcements.unshift(newItem);
    saveDatabase();
    return newItem;
  },
  deleteAnnouncement: (id) => {
    dbData.announcements = dbData.announcements.filter(a => a.id !== parseInt(id));
    saveDatabase();
  },

  getEnquiries: () => dbData.enquiries,
  addEnquiry: (item) => {
    const newItem = { id: Date.now(), status: 'Pending', created_at: new Date().toISOString(), ...item };
    dbData.enquiries.unshift(newItem);
    saveDatabase();
    return newItem;
  },
  updateEnquiryStatus: (id, status) => {
    const enquiry = dbData.enquiries.find(e => e.id === parseInt(id));
    if (enquiry) {
      enquiry.status = status;
      saveDatabase();
      return enquiry;
    }
    return null;
  },
  deleteEnquiry: (id) => {
    dbData.enquiries = dbData.enquiries.filter(e => e.id !== parseInt(id));
    saveDatabase();
  },

  getGallery: () => dbData.gallery,
  addGalleryItem: (item) => {
    const newItem = { id: Date.now(), ...item };
    dbData.gallery.unshift(newItem);
    saveDatabase();
    return newItem;
  },
  deleteGalleryItem: (id) => {
    dbData.gallery = dbData.gallery.filter(g => g.id !== parseInt(id));
    saveDatabase();
  },
  getTestimonials: () => dbData.testimonials,
  getContent: () => dbData.site_content,
  updateContent: (key, data) => {
    dbData.site_content[key] = data;
    saveDatabase();
    return dbData.site_content[key];
  }
};
