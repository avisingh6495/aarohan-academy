import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity, Image,
  TextInput, Alert, RefreshControl, SafeAreaView, StatusBar, Switch
} from 'react-native';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [refreshing, setRefreshing] = useState(false);

  // Live Data State
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [fees, setFees] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Push Notifications State
  const [pushEnabled, setPushEnabled] = useState(true);
  const [notificationBanner, setNotificationBanner] = useState('🔔 Reminder: Sunday Free Demo Class at 10:00 AM');

  // Quick Mobile Admin State
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminNoticeTitle, setAdminNoticeTitle] = useState('');
  const [adminNoticeContent, setAdminNoticeContent] = useState('');

  const fetchMobileData = async () => {
    try {
      const [tRes, cRes, fRes, aRes] = await Promise.all([
        fetch(`${API_BASE}/teachers`).then(r => r.json()),
        fetch(`${API_BASE}/classes`).then(r => r.json()),
        fetch(`${API_BASE}/fees`).then(r => r.json()),
        fetch(`${API_BASE}/announcements`).then(r => r.json())
      ]);
      setTeachers(tRes || []);
      setClasses(cRes || []);
      setFees(fRes || []);
      setAnnouncements(aRes || []);
    } catch (e) {
      console.log('Mobile App offline or connecting to cached data:', e);
      // Fallback offline cache seed if API server is offline
      setTeachers([
        { id: 1, name: 'Avinash Singh', qualification: 'B.Tech & M.Tech (IIT Kanpur)', experience: '8+ Yrs Exp', subjects: ['Mathematics', 'Physics'] },
        { id: 2, name: 'Shreya Singh', qualification: 'BCA & MCA (Nalanda Univ)', experience: '6+ Yrs Exp', subjects: ['Computer Basics', 'English'] }
      ]);
      setClasses([
        { id: 1, grade_level: 'Class 1st to 5th', title: 'Primary Foundation Wing', batch_timings: '3:30 PM - 5:30 PM' },
        { id: 2, grade_level: 'Class 6th to 8th', title: 'Middle School Excellence Wing', batch_timings: '4:30 PM - 6:30 PM' },
        { id: 3, grade_level: 'Class 9th & 10th', title: 'Board Exam Mastery Wing', batch_timings: '5:00 PM - 7:30 PM' }
      ]);
    }
  };

  useEffect(() => {
    fetchMobileData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMobileData();
    setRefreshing(false);
  };

  const handlePostQuickNotice = async () => {
    if (!adminNoticeTitle || !adminNoticeContent) {
      Alert.alert('Error', 'Please enter title and content');
      return;
    }
    try {
      const token = localStorage.getItem('aarohan_admin_token');
      await fetch(`${API_BASE}/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: adminNoticeTitle, content: adminNoticeContent, tag: 'Urgent' })
      });
      Alert.alert('Success', 'Notice posted from Mobile Admin!');
      setAdminNoticeTitle('');
      setAdminNoticeContent('');
      fetchMobileData();
    } catch (err) {
      Alert.alert('Error', 'Mobile post failed: Ensure logged in on web admin');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Mobile App Header Bar */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Text style={{ color: '#F97316', fontWeight: 'bold', fontSize: 18 }}>A</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Aarohan Academy</Text>
            <Text style={styles.headerSub}>Class 1 to 10 Coaching</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.adminBadgeBtn}
          onPress={() => setActiveTab('Contact')}
        >
          <Text style={{ color: '#FFF', fontSize: 11, fontWeight: 'bold' }}>📲 Mobile App</Text>
        </TouchableOpacity>
      </View>

      {/* Push Notification Alert Banner */}
      {pushEnabled && (
        <View style={styles.notificationBanner}>
          <Text style={styles.notifText}>{notificationBanner}</Text>
        </View>
      )}

      {/* Scrollable View Content */}
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* 1. HOME TAB */}
        {activeTab === 'Home' && (
          <View style={styles.sectionContainer}>
            {/* Hero Card */}
            <View style={styles.heroCard}>
              <Text style={styles.heroTag}>⭐ ADMISSIONS OPEN 2026-27</Text>
              <Text style={styles.heroTitle}>Building Strong Foundations</Text>
              <Text style={styles.heroSub}>
                Specialized coaching for Class 1st to 10th with IIT Kanpur alumni & small batch focus (Max 15).
              </Text>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => Alert.alert('Demo Booking', 'Call +91 98765 43210 to book your demo slot!')}>
                <Text style={styles.btnText}>Book Free Demo Class</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statNum}>10+</Text>
                <Text style={styles.statLabel}>Years Exp</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNum}>15</Text>
                <Text style={styles.statLabel}>Max Batch</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNum}>95%+</Text>
                <Text style={styles.statLabel}>Board Score</Text>
              </View>
            </View>

            {/* Breaking Announcements Preview */}
            <Text style={styles.sectionHeading}>📢 Latest Announcements</Text>
            {announcements.slice(0, 2).map((item, idx) => (
              <View key={idx} style={styles.card}>
                <View style={styles.tagRow}>
                  <Text style={styles.tagBadge}>{item.tag || 'Notice'}</Text>
                  <Text style={styles.dateText}>{item.date_str}</Text>
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardBody}>{item.content}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 2. COURSES TAB */}
        {activeTab === 'Courses' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>📚 Classes Offered (Class 1-10)</Text>

            {classes.map((cls) => (
              <View key={cls.id} style={styles.card}>
                <Text style={styles.gradeBadge}>{cls.grade_level}</Text>
                <Text style={styles.cardTitle}>{cls.title}</Text>
                <Text style={{ color: '#0D9488', fontWeight: 'bold', marginBottom: 4 }}>
                  ⏰ Timings: {cls.batch_timings}
                </Text>
                <Text style={{ color: '#64748B', fontSize: 13, marginBottom: 8 }}>
                  👥 Capacity: {cls.batch_size}
                </Text>
                <Text style={styles.cardBody}>{cls.description}</Text>
              </View>
            ))}

            {/* Fee Table Preview */}
            <Text style={[styles.sectionHeading, { marginTop: 20 }]}>💰 Fee Structure</Text>
            {fees.map((fee) => (
              <View key={fee.id} style={[styles.card, { backgroundColor: '#F8FAFC' }]}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#0F172A' }}>{fee.class_category}</Text>
                <Text style={{ color: '#F97316', fontWeight: 'bold', fontSize: 14 }}>{fee.monthly_fee}</Text>
                <Text style={{ color: '#64748B', fontSize: 12, marginTop: 4 }}>{fee.notes}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 3. TEACHERS TAB */}
        {activeTab === 'Teachers' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>👨‍🏫 Expert Faculty</Text>

            {teachers.map((t) => (
              <View key={t.id} style={styles.teacherCard}>
                <Image
                  source={{ uri: t.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' }}
                  style={styles.teacherImage}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.teacherName}>{t.name}</Text>
                  <Text style={styles.teacherQual}>{t.qualification}</Text>
                  <Text style={styles.teacherExp}>{t.experience || 'Faculty Mentor'}</Text>
                  <Text style={{ color: '#64748B', fontSize: 12, marginTop: 4 }}>{t.bio}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 4. NOTICES TAB */}
        {activeTab === 'Notices' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>🔔 Push Notifications & Alerts</Text>

            {/* Notification Settings Toggle */}
            <View style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
              <View>
                <Text style={{ fontWeight: 'bold', color: '#0F172A' }}>Class Push Notifications</Text>
                <Text style={{ fontSize: '12', color: '#64748B' }}>Receive test alerts & holiday updates</Text>
              </View>
              <Switch value={pushEnabled} onValueChange={setPushEnabled} trackColor={{ false: '#767577', true: '#F97316' }} />
            </View>

            {announcements.map((a) => (
              <View key={a.id} style={styles.card}>
                <Text style={styles.tagBadge}>{a.tag || 'Notice'}</Text>
                <Text style={styles.cardTitle}>{a.title}</Text>
                <Text style={styles.cardBody}>{a.content}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 5. CONTACT & ADMIN TAB */}
        {activeTab === 'Contact' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>📞 Contact Academy</Text>

            <View style={styles.card}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Aarohan Academy Center</Text>
              <Text style={{ color: '#64748B', marginVertical: 6 }}>
                📍 Sector 4, Main Knowledge Highway, City Central
              </Text>
              <Text style={{ color: '#0D9488', fontWeight: 'bold' }}>📞 Phone: +91 98765 43210</Text>
              <Text style={{ color: '#0F172A', fontWeight: '500', marginTop: 4 }}>✉️ Email: info@aarohanacademy.edu.in</Text>
            </View>

            {/* Mobile Admin Quick Access Portal */}
            <TouchableOpacity
              style={[styles.card, { backgroundColor: '#0F172A', marginTop: 15 }]}
              onPress={() => setAdminLoggedIn(!adminLoggedIn)}
            >
              <Text style={{ color: '#F97316', fontWeight: 'bold', fontSize: 16 }}>
                🔐 {adminLoggedIn ? 'Mobile Admin Active' : 'Mobile Admin Login'}
              </Text>
              <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 4 }}>
                {adminLoggedIn ? 'Tap to close quick admin tools' : 'Tap to enable quick announcement posting on the go'}
              </Text>
            </TouchableOpacity>

            {adminLoggedIn && (
              <View style={[styles.card, { borderColor: '#F97316', borderWidth: 1 }]}>
                <Text style={{ fontWeight: 'bold', marginBottom: 8, color: '#0F172A' }}>⚡ Post Quick Notice from Mobile</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Notice Title"
                  value={adminNoticeTitle}
                  onChangeText={setAdminNoticeTitle}
                />
                <TextInput
                  style={[styles.input, { height: 70 }]}
                  placeholder="Notice Content..."
                  multiline
                  value={adminNoticeContent}
                  onChangeText={setAdminNoticeContent}
                />
                <TouchableOpacity style={styles.primaryBtn} onPress={handlePostQuickNotice}>
                  <Text style={styles.btnText}>Post Notice to App & Web</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation Tab Bar */}
      <View style={styles.navBar}>
        {['Home', 'Courses', 'Teachers', 'Notices', 'Contact'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.navTab}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.navTabLabel, activeTab === tab && styles.navTabActive]}>
              {tab === 'Home' ? '🏠' : tab === 'Courses' ? '📚' : tab === 'Teachers' ? '👨‍🏫' : tab === 'Notices' ? '🔔' : '📞'}
            </Text>
            <Text style={[styles.navTabText, activeTab === tab && styles.navTabActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justify: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerSub: {
    color: '#94A3B8',
    fontSize: 11,
  },
  adminBadgeBtn: {
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  notificationBanner: {
    backgroundColor: '#FFF7ED',
    borderBottomWidth: 1,
    borderBottomColor: '#FED7AA',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  notifText: {
    color: '#C2410C',
    fontWeight: 'bold',
    fontSize: 12,
  },
  content: {
    flex: 1,
  },
  sectionContainer: {
    padding: 16,
  },
  heroCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  heroTag: {
    color: '#F97316',
    fontWeight: 'bold',
    fontSize: 11,
    marginBottom: 6,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 8,
  },
  heroSub: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  primaryBtn: {
    backgroundColor: '#F97316',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    flex: 0.31,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statNum: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  tagBadge: {
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    color: '#F97316',
    fontWeight: 'bold',
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dateText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#0F172A',
    marginBottom: 4,
  },
  cardBody: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  gradeBadge: {
    backgroundColor: '#CCFBF1',
    color: '#0D9488',
    fontWeight: 'bold',
    fontSize: 11,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  teacherCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  teacherImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  teacherName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0F172A',
  },
  teacherQual: {
    color: '#F97316',
    fontWeight: 'bold',
    fontSize: 12,
  },
  teacherExp: {
    color: '#0D9488',
    fontSize: 11,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    marginBottom: 10,
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 8,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
  },
  navTabLabel: {
    fontSize: 18,
  },
  navTabText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  navTabActive: {
    color: '#F97316',
    fontWeight: 'bold',
  },
});
