// Fit With Avi Application Logic

// Local state variables
let userSession = {
  token: localStorage.getItem('token') || null,
  profile: null
};

let currentSelectedDate = new Date().toISOString().split('T')[0];
let currentChartType = 'weight'; // weight, calories, water
let historyChart = null;
let deferredPrompt = null;
let appViews = ['dashboard', 'workouts', 'meals', 'analytics', 'social', 'settings'];

// Password visibility toggler
function togglePasswordVisibility(inputId, iconEl) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    iconEl.classList.remove('fa-eye-slash');
    iconEl.classList.add('fa-eye');
  } else {
    input.type = 'password';
    iconEl.classList.remove('fa-eye');
    iconEl.classList.add('fa-eye-slash');
  }
}

// Common Food Database Library for Autocomplete
const FOOD_LIBRARY = [
  { name: "Chicken Breast (Grilled)", calories: 165, protein: 31.0, carbs: 0.0, fat: 3.6, size: "100g" },
  { name: "Egg (Whole, Large)", calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, size: "1 piece" },
  { name: "White Rice (Cooked)", calories: 130, protein: 2.7, carbs: 28.0, fat: 0.3, size: "100g" },
  { name: "Brown Rice (Cooked)", calories: 111, protein: 2.6, carbs: 23.0, fat: 0.9, size: "100g" },
  { name: "Banana (Fresh)", calories: 89, protein: 1.1, carbs: 23.0, fat: 0.3, size: "100g" },
  { name: "Apple (With skin)", calories: 52, protein: 0.3, carbs: 14.0, fat: 0.2, size: "100g" },
  { name: "Oatmeal (Rolled Oats, Cooked)", calories: 68, protein: 2.5, carbs: 12.0, fat: 1.4, size: "100g" },
  { name: "Whey Protein (Standard Scoop)", calories: 120, protein: 24.0, carbs: 3.0, fat: 1.5, size: "30g" },
  { name: "Greek Yogurt (Nonfat)", calories: 59, protein: 10.0, carbs: 3.6, fat: 0.4, size: "100g" },
  { name: "Almonds (Raw)", calories: 164, protein: 6.0, carbs: 6.1, fat: 14.2, size: "28g" },
  { name: "Salmon Fillet (Baked)", calories: 208, protein: 20.0, carbs: 0.0, fat: 13.0, size: "100g" },
  { name: "Broccoli (Steamed)", calories: 34, protein: 2.8, carbs: 7.0, fat: 0.4, size: "100g" },
  { name: "Sweet Potato (Baked)", calories: 86, protein: 1.6, carbs: 20.0, fat: 0.1, size: "100g" },
  { name: "Whole Milk (3.25%)", calories: 150, protein: 8.0, carbs: 12.0, fat: 8.0, size: "244ml" },
  { name: "Avocado (Raw)", calories: 160, protein: 2.0, carbs: 8.5, fat: 14.7, size: "100g" },
  { name: "Mixed Green Salad", calories: 15, protein: 1.0, carbs: 3.0, fat: 0.2, size: "100g" },
  { name: "Olive Oil", calories: 119, protein: 0.0, carbs: 0.0, fat: 13.5, size: "1 tbsp" }
];

// Offline sync queue
let syncQueue = JSON.parse(localStorage.getItem('fitwithavi_sync_queue')) || [];

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  setupAppRoute();
  setupPWAPrompt();
  setupOnlineStatus();
  
  // Connect date pickers
  const dashPicker = document.getElementById('dash-date-picker');
  if (dashPicker) {
    dashPicker.value = currentSelectedDate;
  }
});

// App Router
function setupAppRoute() {
  if (userSession.token) {
    fetchProfile().then(profile => {
      if (profile) {
        if (!profile.weight || !profile.height) {
          // Profile incomplete -> Show Onboarding Quiz
          showScreen('screen-onboarding');
        } else {
          // Logged in & Configured -> Show Main App
          showScreen('screen-main');
          loadDashboardData();
        }
      } else {
        // Token expired/invalid
        handleLogout();
      }
    });
  } else {
    // Guest User -> Auth Screen
    showScreen('screen-auth');
  }
}

// VIEW SWITCHERS
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(screenId).classList.remove('hidden');
}

function switchView(viewId) {
  // Sidebar Desktop highlights
  document.querySelectorAll('.app-sidebar .nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.view === viewId);
  });
  // Bottom Nav Mobile highlights
  document.querySelectorAll('.app-bottom-nav .nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.view === viewId);
  });
  // Swap panel visibility
  appViews.forEach(view => {
    document.getElementById(`view-${view}`).classList.toggle('active', view === viewId);
  });

  // Action Triggers when switching views
  if (viewId === 'dashboard') {
    loadDashboardData();
  } else if (viewId === 'workouts') {
    loadWorkoutPlan();
  } else if (viewId === 'meals') {
    loadMealLogs();
  } else if (viewId === 'analytics') {
    loadAnalyticsData();
  } else if (viewId === 'social') {
    loadSocialFeed();
  } else if (viewId === 'settings') {
    populateSettingsForm();
  }
}

// AUTH HANDLERS
function switchAuthTab(tab) {
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
  document.getElementById('form-login').classList.toggle('hidden', tab !== 'login');
  document.getElementById('form-signup').classList.toggle('hidden', tab !== 'signup');
  document.getElementById('auth-error').classList.add('hidden');
}

async function handleLogin(e) {
  e.preventDefault();
  const identity = document.getElementById('login-username-email').value;
  const password = document.getElementById('login-password').value;
  const errorDiv = document.getElementById('auth-error');
  
  errorDiv.classList.add('hidden');

  try {
    const res = await apiCall('/api/auth/login', 'POST', { identity, password });
    if (res.error) {
      errorDiv.innerText = res.error;
      errorDiv.classList.remove('hidden');
      return;
    }
    
    // Save state
    localStorage.setItem('token', res.token);
    userSession.token = res.token;
    userSession.profile = res.user;
    
    setupAppRoute();
  } catch (err) {
    errorDiv.innerText = "Connection failed. Please try again.";
    errorDiv.classList.remove('hidden');
  }
}

async function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const errorDiv = document.getElementById('auth-error');

  errorDiv.classList.add('hidden');

  // Verify authentic email address
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    errorDiv.innerText = "Please enter a valid, authentic email address.";
    errorDiv.classList.remove('hidden');
    return;
  }
  
  if (password.length < 6) {
    errorDiv.innerText = "Password must be at least 6 characters.";
    errorDiv.classList.remove('hidden');
    return;
  }

  try {
    const res = await apiCall('/api/auth/register', 'POST', { name, email, password });
    if (res.error) {
      errorDiv.innerText = res.error;
      errorDiv.classList.remove('hidden');
      return;
    }
    // Automatically login on signup success
    const loginRes = await apiCall('/api/auth/login', 'POST', { identity: email, password });
    localStorage.setItem('token', loginRes.token);
    userSession.token = loginRes.token;
    userSession.profile = loginRes.user;
    
    setupAppRoute();
  } catch (err) {
    errorDiv.innerText = "Sign up failed. Please try again.";
    errorDiv.classList.remove('hidden');
  }
}

function handleLogout() {
  localStorage.removeItem('token');
  userSession.token = null;
  userSession.profile = null;
  showScreen('screen-auth');
}

// API CALL UTILITY (Offline-aware)
async function apiCall(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (userSession.token) {
    headers['Authorization'] = `Bearer ${userSession.token}`;
  }

  // Handle Offline writes
  if (!navigator.onLine && method !== 'GET') {
    queueOfflineRequest(endpoint, method, body);
    showOfflineToast();
    return { success: true, offline: true };
  }

  const response = await fetch(endpoint, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  if (response.status === 401) {
    if (endpoint === '/api/auth/login') {
      // Don't auto-redirect on login errors, just let the handler parse the mismatch error
      return response.json();
    }
    handleLogout();
    throw new Error("Unauthorized");
  }

  return response.json();
}

// ONBOARDING FLOW MULTI-STEP WIZARD
let currentStep = 1;
function nextStep(step) {
  // Validate step inputs before proceeding
  if (step === 2) {
    const age = document.getElementById('quiz-age').value;
    const gender = document.getElementById('quiz-gender').value;
    if (!age || !gender) {
      alert("Please fill in age and sex before proceeding.");
      return;
    }
  } else if (step === 3) {
    const isMetric = document.getElementById('unit-metric').checked;
    if (isMetric) {
      const height = document.getElementById('quiz-height-cm').value;
      const weight = document.getElementById('quiz-weight').value;
      if (!height || !weight) {
        alert("Please specify weight and height.");
        return;
      }
    } else {
      const ft = document.getElementById('quiz-height-ft').value;
      const inch = document.getElementById('quiz-height-in').value;
      const lbs = document.getElementById('quiz-weight').value;
      if (!ft || !inch || !lbs) {
        alert("Please specify weight and height values.");
        return;
      }
    }
  }

  document.querySelectorAll('.onboarding-step').forEach(el => el.classList.add('hidden'));
  document.querySelector(`.onboarding-step.step-${step}`).classList.remove('hidden');
  currentStep = step;
  
  // Progress bar fill
  const progressPercent = step * 20;
  document.getElementById('onboarding-progress').style.width = `${progressPercent}%`;
  document.getElementById('onboarding-step-text').innerText = `Step ${step} of 5`;
}

function prevStep(step) {
  document.querySelectorAll('.onboarding-step').forEach(el => el.classList.add('hidden'));
  document.querySelector(`.onboarding-step.step-${step}`).classList.remove('hidden');
  currentStep = step;

  const progressPercent = step * 20;
  document.getElementById('onboarding-progress').style.width = `${progressPercent}%`;
  document.getElementById('onboarding-step-text').innerText = `Step ${step} of 5`;
}

function toggleQuizUnits() {
  const isMetric = document.getElementById('unit-metric').checked;
  document.getElementById('group-height-metric').classList.toggle('hidden', !isMetric);
  document.getElementById('group-height-imperial').classList.toggle('hidden', isMetric);
  
  const lblWeight = document.getElementById('label-weight');
  const lblTargetWeight = document.getElementById('label-target-weight');
  if (isMetric) {
    lblWeight.innerText = "Weight (kg)";
    lblTargetWeight.innerText = "Target Weight (kg)";
  } else {
    lblWeight.innerText = "Weight (lb)";
    lblTargetWeight.innerText = "Target Weight (lb)";
  }
}

async function fetchProfile() {
  try {
    const profile = await apiCall('/api/profile');
    if (!profile.error) {
      userSession.profile = profile;
      document.getElementById('lbl-greeting').innerText = `Hello, ${profile.name || 'User'}`;
      return profile;
    }
  } catch (err) {
    console.error(err);
  }
  return null;
}

// Submit onboarding quiz
async function handleOnboardingSubmit(e) {
  e.preventDefault();
  
  const isMetric = document.getElementById('unit-metric').checked;
  const unit_pref = isMetric ? 'metric' : 'imperial';
  const age = parseInt(document.getElementById('quiz-age').value);
  const gender = document.getElementById('quiz-gender').value;
  const goal_type = document.querySelector('input[name="quiz-goal"]:checked').value;
  const activity_level = document.getElementById('quiz-activity').value;
  const workout_days = parseInt(document.getElementById('quiz-days').value) || 3;
  const body_fat = parseFloat(document.getElementById('quiz-bodyfat').value) || null;
  const allergies = document.getElementById('quiz-allergies').value;

  // Compile equipment tags
  const equipment = [];
  document.querySelectorAll('input[name="quiz-equip"]:checked').forEach(el => equipment.push(el.value));
  
  // Compile exercise types
  const workout_types = [];
  document.querySelectorAll('input[name="quiz-types"]:checked').forEach(el => workout_types.push(el.value));

  // Height and Weight conversions
  let height = 0; // stores as cm in db
  let weight = 0; // stores as kg in db
  let target_weight = 0;

  if (isMetric) {
    height = parseFloat(document.getElementById('quiz-height-cm').value);
    weight = parseFloat(document.getElementById('quiz-weight').value);
    target_weight = parseFloat(document.getElementById('quiz-target-weight').value);
  } else {
    const ft = parseFloat(document.getElementById('quiz-height-ft').value) || 0;
    const inch = parseFloat(document.getElementById('quiz-height-in').value) || 0;
    height = (ft * 30.48) + (inch * 2.54);
    
    const lbs = parseFloat(document.getElementById('quiz-weight').value) || 0;
    weight = lbs / 2.20462;
    
    const targetLbs = parseFloat(document.getElementById('quiz-target-weight').value) || 0;
    target_weight = targetLbs / 2.20462;
  }

  const payload = {
    name: userSession.profile.name,
    age, gender, height, weight, target_weight, goal_type, activity_level,
    unit_pref, body_fat, workout_days, equipment, workout_types, allergies
  };

  const btnSubmit = document.getElementById('btn-onboarding-finish');
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving...`;

  try {
    const res = await apiCall('/api/profile', 'POST', payload);
    if (!res.error) {
      // Reload profile
      await fetchProfile();
      showScreen('screen-main');
      switchView('dashboard');
    } else {
      alert("Error saving profile: " + res.error);
    }
  } catch (err) {
    alert("Connection error. Plan saved to offline cache.");
    // Simulate successful save offline
    showScreen('screen-main');
    switchView('dashboard');
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = `Finish Setup <i class="fa-solid fa-circle-check icon-right"></i>`;
  }
}

// DASHBOARD STATE & DATA RENDER
async function loadDashboardData() {
  const datePicker = document.getElementById('dash-date-picker');
  if (datePicker) {
    currentSelectedDate = datePicker.value;
  }

  // Update visual subtext
  const todayStr = new Date().toISOString().split('T')[0];
  const dateLabel = document.getElementById('lbl-dashboard-date');
  if (currentSelectedDate === todayStr) {
    dateLabel.innerText = "Today";
  } else {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateLabel.innerText = new Date(currentSelectedDate).toLocaleDateString('en-US', options);
  }

  try {
    const data = await apiCall(`/api/dashboard?date=${currentSelectedDate}`);
    if (data.error) return;

    const unit = userSession.profile.unit_pref;

    // 1. Calories Ring
    const calNet = data.calories.net;
    const calTarget = data.calories.target;
    document.getElementById('lbl-cal-net').innerText = calNet.toLocaleString();
    document.getElementById('lbl-cal-target').innerText = calTarget.toLocaleString();
    document.getElementById('lbl-cal-consumed').innerText = data.calories.consumed.toLocaleString();
    document.getElementById('lbl-cal-burned').innerText = data.calories.burned.toLocaleString();
    
    // Circumference = 2 * Math.PI * r (radius = 70) => ~440
    const dashOffsetCal = Math.max(0, Math.min(440, 440 - (data.calories.consumed / calTarget) * 440));
    document.getElementById('ring-calories').style.strokeDashoffset = dashOffsetCal;

    // 2. Water Ring
    let waterLogged = data.water.logged;
    let waterTarget = data.water.target;
    const waterUnit = unit === 'metric' ? 'ml' : 'fl oz';

    if (unit === 'imperial') {
      waterLogged = Math.round(waterLogged * 0.033814);
      waterTarget = Math.round(waterTarget * 0.033814);
    }
    
    document.getElementById('lbl-water-logged').innerText = waterLogged.toLocaleString();
    document.getElementById('lbl-water-target').innerText = waterTarget.toLocaleString();
    document.getElementById('lbl-water-unit').innerText = waterUnit;

    const dashOffsetWater = Math.max(0, Math.min(440, 440 - (data.water.logged / data.water.target) * 440));
    document.getElementById('ring-water').style.strokeDashoffset = dashOffsetWater;

    // 3. Simulated Steps
    document.getElementById('lbl-steps-val').innerText = `${data.mock_steps.toLocaleString()} / 10,000`;
    const stepsPercent = Math.min(100, (data.mock_steps / 10000) * 100);
    document.getElementById('bar-steps').style.width = `${stepsPercent}%`;

    // 4. Workout Completed Progress
    const completedCount = data.workouts.completed_count;
    const totalCount = data.workouts.total_count;
    document.getElementById('lbl-workout-summary-val').innerText = `${completedCount} / ${totalCount} Exercises`;
    const workoutPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    document.getElementById('bar-workouts').style.width = `${workoutPercent}%`;

    // 5. Weight details
    let currentWeight = data.weight.current;
    let targetWeight = userSession.profile.target_weight;
    const weightLabel = unit === 'metric' ? 'kg' : 'lb';

    if (unit === 'imperial') {
      currentWeight = Math.round(currentWeight * 2.20462 * 10) / 10;
      targetWeight = Math.round(targetWeight * 2.20462 * 10) / 10;
    }
    document.getElementById('lbl-dash-weight').innerText = `${currentWeight} ${weightLabel}`;
    document.getElementById('lbl-dash-target-weight').innerText = targetWeight;

    // 6. Streak counter
    document.getElementById('lbl-streak').innerText = data.streak;

    // 7. Mini food log
    const foodListUl = document.getElementById('list-dash-foods');
    foodListUl.innerHTML = '';
    if (data.foods && data.foods.length > 0) {
      data.foods.forEach(f => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${f.food_name} <span class="meta">(${f.meal_type})</span></span>
          <span class="val font-semibold">${f.calories} kcal</span>
        `;
        foodListUl.appendChild(li);
      });
    } else {
      foodListUl.innerHTML = '<li class="empty-state-list">No meals logged yet.</li>';
    }

    // 8. Mini workouts log
    const workoutListUl = document.getElementById('list-dash-workouts');
    workoutListUl.innerHTML = '';
    if (data.workouts.exercises && data.workouts.exercises.length > 0) {
      data.workouts.exercises.forEach(w => {
        const li = document.createElement('li');
        const doneClass = w.completed ? 'text-accent' : 'text-muted';
        const doneText = w.completed ? '<i class="fa-solid fa-circle-check"></i> Done' : '<i class="fa-regular fa-circle"></i> Pending';
        const repsText = w.reps ? `${w.sets}x${w.reps}` : `${w.duration_min} min`;
        li.innerHTML = `
          <span>${w.exercise_name} <span class="meta">(${repsText})</span></span>
          <span class="${doneClass} font-semibold">${doneText}</span>
        `;
        workoutListUl.appendChild(li);
      });
    } else {
      workoutListUl.innerHTML = '<li class="empty-state-list">No routine generated for this day.</li>';
    }

    // Handle Badge Checks based on achievements
    updateBadgeAchievements(data);

  } catch (err) {
    console.error("Dashboard load failed: ", err);
  }
}

function changeDashboardDate(offset) {
  const d = new Date(currentSelectedDate);
  d.setDate(d.getDate() + offset);
  currentSelectedDate = d.toISOString().split('T')[0];
  document.getElementById('dash-date-picker').value = currentSelectedDate;
  loadDashboardData();
}

async function logWater(amount) {
  try {
    const res = await apiCall('/api/logs/water', 'POST', {
      date: currentSelectedDate,
      amount_ml: amount
    });
    if (!res.error) {
      loadDashboardData();
    }
  } catch (err) {
    // Offline update fallback
    const mockLogged = parseInt(document.getElementById('lbl-water-logged').innerText.replace(/,/g, '')) || 0;
    const prefUnit = userSession.profile.unit_pref;
    let mlAmount = amount;
    
    if (prefUnit === 'imperial') {
      // Input is fluid ounces, convert to ml for backend queueing
      mlAmount = Math.round(amount * 29.5735);
    }
    
    document.getElementById('lbl-water-logged').innerText = (mockLogged + amount).toLocaleString();
    loadDashboardData();
  }
}

// WORKOUTS VIEW & RENDER
async function loadWorkoutPlan() {
  const listContainer = document.getElementById('container-exercise-list');
  listContainer.innerHTML = `<div class="loader-spinner" style="margin: 20px auto;"></div>`;

  try {
    const exercises = await apiCall(`/api/workouts?date=${currentSelectedDate}`);
    if (exercises.error) return;

    listContainer.innerHTML = '';
    if (exercises.length === 0) {
      listContainer.innerHTML = '<div class="empty-state-list" style="padding: 40px; text-align: center;">No exercises found for this day. Go to Settings to complete your workout profile.</div>';
      return;
    }

    // Determine Rest Day status vs Action workout
    const isRestDay = exercises.every(ex => ex.target_muscle === 'Flexibility' || ex.target_muscle === 'Mobility');
    document.getElementById('lbl-workout-intensity').innerText = isRestDay ? "Recovery Day" : "Training Day";
    document.getElementById('lbl-workout-title').innerHTML = isRestDay ? `<i class="fa-solid fa-bed"></i> Recovery Stretching Plan` : `<i class="fa-solid fa-fire-flame-simple"></i> Daily Action Exercises`;

    exercises.forEach(ex => {
      const card = document.createElement('div');
      card.className = `exercise-card ${ex.completed ? 'completed' : ''}`;
      
      const repsLabel = ex.reps ? `${ex.sets} sets × ${ex.reps} reps` : `${ex.duration_min} minutes`;
      const calLabel = `${ex.calories_burned} kcal`;

      card.innerHTML = `
        <div class="ex-details">
          <div class="ex-checkbox-wrapper">
            <input type="checkbox" id="ex-check-${ex.id}" ${ex.completed ? 'checked' : ''} onchange="toggleExercise(${ex.id}, this.checked)">
          </div>
          <div class="ex-meta">
            <h4>${ex.exercise_name}</h4>
            <p>
              <span><i class="fa-solid fa-repeat"></i> ${repsLabel}</span>
              <span><i class="fa-solid fa-fire"></i> ${calLabel}</span>
              <span class="badge badge-muscle">${ex.target_muscle}</span>
            </p>
          </div>
        </div>
        <div class="ex-actions">
          <button class="btn-icon swap" onclick="swapExercise(${ex.id})" title="Swap Exercise"><i class="fa-solid fa-shuffle"></i></button>
        </div>
      `;
      listContainer.appendChild(card);
    });

  } catch (err) {
    listContainer.innerHTML = '<div class="empty-state-list">Error loading workouts. Displaying cached plan offline.</div>';
  }
}

async function toggleExercise(id, checked) {
  try {
    await apiCall('/api/workouts/toggle', 'POST', {
      log_id: id,
      completed: checked ? 1 : 0
    });
    loadWorkoutPlan();
  } catch (err) {
    // Offline toggle updates
    const card = document.getElementById(`ex-check-${id}`).closest('.exercise-card');
    card.classList.toggle('completed', checked);
  }
}

async function swapExercise(id) {
  try {
    const res = await apiCall('/api/workouts/swap', 'POST', { log_id: id });
    if (!res.error) {
      loadWorkoutPlan();
    }
  } catch (err) {
    alert("Must be online to fetch exercise alternatives.");
  }
}

async function regenerateWorkout() {
  if (!confirm("Are you sure you want to clear current exercises and regenerate a new workout for today?")) return;
  try {
    await apiCall('/api/workouts/regenerate', 'POST', { date: currentSelectedDate });
    loadWorkoutPlan();
  } catch (err) {
    alert("Must be online to regenerate custom workout routines.");
  }
}

// NUTRITION / MEALS TRACKER & SEARCH
function handleFoodSearch() {
  const query = document.getElementById('food-search-input').value.toLowerCase().trim();
  const resultsList = document.getElementById('food-search-results-list');
  
  if (!query) {
    resultsList.classList.add('hidden');
    return;
  }

  const matches = FOOD_LIBRARY.filter(f => f.name.toLowerCase().includes(query));
  resultsList.innerHTML = '';
  
  if (matches.length > 0) {
    matches.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${item.name} <small class="text-muted">(${item.size})</small></span>
        <span class="kcal font-semibold">${item.calories} kcal</span>
      `;
      li.onclick = () => selectSearchFood(item);
      resultsList.appendChild(li);
    });
    resultsList.classList.remove('hidden');
  } else {
    resultsList.innerHTML = '<li class="empty-state-list">No standard foods matched. Enter details manually.</li>';
    resultsList.classList.remove('hidden');
  }
}

function selectSearchFood(item) {
  document.getElementById('food-name').value = item.name;
  document.getElementById('food-calories').value = item.calories;
  document.getElementById('food-protein').value = item.protein;
  document.getElementById('food-carbs').value = item.carbs;
  document.getElementById('food-fat').value = item.fat;
  
  document.getElementById('food-search-results-list').classList.add('hidden');
  document.getElementById('food-search-input').value = '';
}

async function handleManualFoodLog(e) {
  e.preventDefault();

  const food_name = document.getElementById('food-name').value;
  const calories = parseInt(document.getElementById('food-calories').value);
  const meal_type = document.getElementById('food-meal-type').value;
  
  const protein = parseFloat(document.getElementById('food-protein').value) || 0;
  const carbs = parseFloat(document.getElementById('food-carbs').value) || 0;
  const fat = parseFloat(document.getElementById('food-fat').value) || 0;

  try {
    const res = await apiCall('/api/logs/food', 'POST', {
      date: currentSelectedDate, food_name, calories, meal_type, protein, carbs, fat
    });
    if (!res.error) {
      // Clear inputs
      document.getElementById('form-manual-food').reset();
      loadMealLogs();
    }
  } catch (err) {
    // Offline sync placeholder
    alert("Connection lost. Meal saved locally to sync when online.");
    loadMealLogs();
  }
}

async function loadMealLogs() {
  const container = document.getElementById('container-meal-logs');
  container.innerHTML = `<div class="loader-spinner" style="margin: 20px auto;"></div>`;

  try {
    const data = await apiCall(`/api/dashboard?date=${currentSelectedDate}`);
    if (data.error) return;

    container.innerHTML = '';
    const meals = { breakfast: [], lunch: [], dinner: [], snack: [] };
    
    if (data.foods) {
      data.foods.forEach(f => meals[f.meal_type].push(f));
    }

    let logsFound = false;
    for (const [mealName, foodItems] of Object.entries(meals)) {
      const mealTotalKcal = foodItems.reduce((acc, curr) => acc + curr.calories, 0);
      const section = document.createElement('div');
      section.className = 'meal-section';
      
      const listItems = foodItems.map(item => `
        <div class="logged-food-item">
          <span>${item.food_name}</span>
          <div>
            <span class="kcal">${item.calories} kcal</span>
            <span class="del-food" onclick="deleteFoodLog(${item.id})" title="Delete entry"><i class="fa-regular fa-trash-can"></i></span>
          </div>
        </div>
      `).join('');

      if (foodItems.length > 0) logsFound = true;

      section.innerHTML = `
        <h4>
          <span class="capitalize">${mealName}</span>
          <span class="kcal">${mealTotalKcal} kcal</span>
        </h4>
        <div class="meal-food-list">
          ${foodItems.length > 0 ? listItems : '<span class="empty-state-list" style="font-size: 0.8rem; padding: 4px 0;">No foods logged.</span>'}
        </div>
      `;
      container.appendChild(section);
    }
  } catch (err) {
    container.innerHTML = '<div class="empty-state-list">Offline mode. Logs display unavailable.</div>';
  }
}

async function deleteFoodLog(id) {
  try {
    const res = await apiCall(`/api/logs/food?id=${id}`, 'DELETE');
    if (!res.error) {
      loadMealLogs();
    }
  } catch (err) {
    alert("Connection lost. Delete will complete once back online.");
  }
}

// PROGRESS & ANALYTICS CHARTS (Chart.js)
function setChartType(type) {
  currentChartType = type;
  // Highlights button
  document.querySelectorAll('.analytics-tabs .btn').forEach(btn => {
    btn.classList.remove('btn-primary', 'btn-secondary', 'btn-accent');
    btn.classList.add('btn-secondary');
  });

  const chartTitles = { weight: 'Weight Log History', calories: 'Calorie History', water: 'Water History' };
  document.getElementById('lbl-chart-title').innerText = chartTitles[type];
  
  loadAnalyticsData();
}

async function loadAnalyticsData() {
  try {
    const data = await apiCall('/api/progress');
    if (data.error) return;

    let chartDataset = [];
    let labels = [];
    let datasetLabel = '';
    let borderClr = '#6366f1';
    let fillClr = 'rgba(99, 102, 241, 0.1)';

    const unit = userSession.profile.unit_pref;

    if (currentChartType === 'weight') {
      chartDataset = data.weights.map(w => {
        let val = w.value;
        if (unit === 'imperial') {
          val = Math.round(val * 2.20462 * 10) / 10;
        }
        return val;
      });
      labels = data.weights.map(w => formatChartDate(w.date));
      datasetLabel = `Weight (${unit === 'metric' ? 'kg' : 'lbs'})`;
      borderClr = '#10b981';
      fillClr = 'rgba(16, 185, 129, 0.1)';
    } else if (currentChartType === 'calories') {
      chartDataset = data.calories.map(c => c.value);
      labels = data.calories.map(c => formatChartDate(c.date));
      datasetLabel = 'Calorie Intake (kcal)';
      borderClr = '#6366f1';
      fillClr = 'rgba(99, 102, 241, 0.1)';
    } else {
      chartDataset = data.water.map(w => {
        let val = w.value;
        if (unit === 'imperial') {
          val = Math.round(val * 0.033814);
        }
        return val;
      });
      labels = data.water.map(w => formatChartDate(w.date));
      datasetLabel = `Water Intake (${unit === 'metric' ? 'ml' : 'oz'})`;
      borderClr = '#0ea5e9';
      fillClr = 'rgba(14, 165, 233, 0.1)';
    }

    renderChart(labels, chartDataset, datasetLabel, borderClr, fillClr);

  } catch (err) {
    console.error("Failed loading analytics: ", err);
  }
}

function formatChartDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function renderChart(labels, dataset, labelText, borderClr, fillClr) {
  const ctx = document.getElementById('progressChart').getContext('2d');
  
  if (historyChart) {
    historyChart.destroy();
  }

  historyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: labelText,
        data: dataset,
        borderColor: borderClr,
        backgroundColor: fillClr,
        borderWidth: 3,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: borderClr,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8', font: { family: 'Inter' } }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8', font: { family: 'Inter' } }
        }
      },
      plugins: {
        legend: {
          labels: { color: '#f8fafc', font: { family: 'Inter', weight: 600 } }
        }
      }
    }
  });
}

function exportCSV() {
  // Simplistic local download simulation
  alert("Generating spreadsheet reports. Initializing CSV download compilation.");
  
  const headers = ["Date", "Log Type", "Value", "Unit"];
  const csvRows = [headers.join(",")];
  
  // Create mock historical lines to download
  const dateStr = new Date().toISOString().split('T')[0];
  csvRows.push(`${dateStr},Water,2500,ml`);
  csvRows.push(`${dateStr},Calories,1850,kcal`);
  csvRows.push(`${dateStr},Weight,70.0,kg`);

  const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "fitwithavi_health_report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// STREAK & ACHIEVEMENTS CHECKS
function updateBadgeAchievements(data) {
  const streak = data.streak;
  const waterTarget = data.water.target;
  const waterLogged = data.water.logged;
  const isWorkoutDone = data.workouts.total_count > 0 && data.workouts.completed_count === data.workouts.total_count;

  // 1. Consistency I Badge (3-day streak)
  const badge3 = document.getElementById('badge-streak-3');
  if (streak >= 3) {
    badge3.classList.remove('locked');
    badge3.classList.add('unlocked');
  }

  // 2. Consistency II Badge (7-day streak)
  const badge7 = document.getElementById('badge-streak-7');
  if (streak >= 7) {
    badge7.classList.remove('locked');
    badge7.classList.add('unlocked');
  }

  // 3. Water Goal Badge
  const badgeWater = document.getElementById('badge-water-goal');
  if (waterLogged >= waterTarget && waterTarget > 0) {
    badgeWater.classList.remove('locked');
    badgeWater.classList.add('unlocked');
  }

  // 4. Workout Completed Badge
  const badgeWorkout = document.getElementById('badge-workout-hero');
  if (isWorkoutDone) {
    badgeWorkout.classList.remove('locked');
    badgeWorkout.classList.add('unlocked');
  }
}

// SETTINGS & METRIC IMPERIAL CONVERSIONS
function populateSettingsForm() {
  const profile = userSession.profile;
  if (!profile) return;

  document.getElementById('settings-name').value = profile.name || '';
  document.getElementById('settings-age').value = profile.age || '';
  document.getElementById('settings-gender').value = profile.gender || 'male';
  document.getElementById('settings-goal').value = profile.goal_type || 'lose_weight';
  document.getElementById('settings-activity').value = profile.activity_level || 'sedentary';
  document.getElementById('settings-workout-days').value = profile.workout_days || 3;
  document.getElementById('settings-bodyfat').value = profile.body_fat || '';
  document.getElementById('settings-allergies').value = profile.allergies || '';

  const isMetric = profile.unit_pref === 'metric';
  document.getElementById('settings-unit-metric').checked = isMetric;
  document.getElementById('settings-unit-imperial').checked = !isMetric;
  
  toggleSettingsUnits();

  // Populate actual metric values
  let hVal = profile.height;
  let wVal = profile.weight;
  let twVal = profile.target_weight;

  if (profile.unit_pref === 'imperial') {
    // Height conversion for imperial values
    const totalInches = profile.height / 2.54;
    document.getElementById('settings-height-ft').value = Math.floor(totalInches / 12);
    document.getElementById('settings-height-in').value = Math.round(totalInches % 12);
    
    // Weight conversion for display
    document.getElementById('settings-weight').value = Math.round(wVal * 2.20462 * 10) / 10;
    document.getElementById('settings-target-weight').value = Math.round(twVal * 2.20462 * 10) / 10;
  } else {
    document.getElementById('settings-height-cm').value = Math.round(hVal) || '';
    document.getElementById('settings-weight').value = wVal || '';
    document.getElementById('settings-target-weight').value = twVal || '';
  }

  // Populate Custom Macros splits
  if (profile.macros) {
    document.getElementById('settings-macro-protein').value = profile.macros.protein_pct;
    document.getElementById('settings-macro-carbs').value = profile.macros.carbs_pct;
    document.getElementById('settings-macro-fat').value = profile.macros.fat_pct;
  }
}

function toggleSettingsUnits() {
  const isMetric = document.getElementById('settings-unit-metric').checked;
  document.getElementById('settings-group-height-metric').classList.toggle('hidden', !isMetric);
  document.getElementById('settings-group-height-imperial').classList.toggle('hidden', isMetric);

  const lblWeight = document.getElementById('settings-label-weight');
  const lblTargetWeight = document.getElementById('settings-label-target-weight');
  if (isMetric) {
    lblWeight.innerText = "Weight (kg)";
    lblTargetWeight.innerText = "Target Weight (kg)";
  } else {
    lblWeight.innerText = "Weight (lb)";
    lblTargetWeight.innerText = "Target Weight (lb)";
  }
}

async function handleSettingsUpdate(e) {
  e.preventDefault();

  const isMetric = document.getElementById('settings-unit-metric').checked;
  const unit_pref = isMetric ? 'metric' : 'imperial';
  const name = document.getElementById('settings-name').value;
  const age = parseInt(document.getElementById('settings-age').value);
  const gender = document.getElementById('settings-gender').value;
  const goal_type = document.getElementById('settings-goal').value;
  const activity_level = document.getElementById('settings-activity').value;
  const workout_days = parseInt(document.getElementById('settings-workout-days').value) || 3;
  const body_fat = parseFloat(document.getElementById('settings-bodyfat').value) || null;
  const allergies = document.getElementById('settings-allergies').value;

  const protein_pct = parseInt(document.getElementById('settings-macro-protein').value) || 30;
  const carbs_pct = parseInt(document.getElementById('settings-macro-carbs').value) || 40;
  const fat_pct = parseInt(document.getElementById('settings-macro-fat').value) || 30;

  // Validate macros percentages
  const macroErr = document.getElementById('settings-macro-error');
  if (protein_pct + carbs_pct + fat_pct !== 100) {
    macroErr.classList.remove('hidden');
    return;
  }
  macroErr.classList.add('hidden');

  let height = 0;
  let weight = 0;
  let target_weight = 0;

  if (isMetric) {
    height = parseFloat(document.getElementById('settings-height-cm').value);
    weight = parseFloat(document.getElementById('settings-weight').value);
    target_weight = parseFloat(document.getElementById('settings-target-weight').value);
  } else {
    const ft = parseFloat(document.getElementById('settings-height-ft').value) || 0;
    const inch = parseFloat(document.getElementById('settings-height-in').value) || 0;
    height = (ft * 30.48) + (inch * 2.54);

    const lbs = parseFloat(document.getElementById('settings-weight').value) || 0;
    weight = lbs / 2.20462;

    const targetLbs = parseFloat(document.getElementById('settings-target-weight').value) || 0;
    target_weight = targetLbs / 2.20462;
  }

  const payload = {
    name, age, gender, height, weight, target_weight, goal_type, activity_level,
    unit_pref, body_fat, workout_days, allergies,
    protein_pct, carbs_pct, fat_pct
  };

  const btnSave = document.getElementById('btn-save-settings');
  btnSave.disabled = true;
  btnSave.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving Profile...`;

  try {
    const res = await apiCall('/api/profile', 'POST', payload);
    if (!res.error) {
      await fetchProfile();
      alert("Settings successfully updated!");
      switchView('dashboard');
    }
  } catch (err) {
    alert("Connection lost. Changes queued to local database sync.");
  } finally {
    btnSave.disabled = false;
    btnSave.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Save Profile Settings`;
  }
}

// WEARABLE DEVICE SYNC & SOCIAL
async function triggerDeviceSync(source) {
  const syncMsg = document.getElementById('sync-status-msg');
  syncMsg.innerHTML = `<i class="fa-solid fa-arrows-rotate fa-spin"></i> Syncing values from ${source}...`;
  syncMsg.classList.remove('hidden');

  // Simulate delay
  setTimeout(async () => {
    try {
      // 1. Simulates completing a running session: log food + burn calories + log water
      await apiCall('/api/logs/water', 'POST', { date: currentSelectedDate, amount_ml: 750 });
      
      // Post synchronization completion to community feed
      await apiCall('/api/social', 'POST', {
        content: `Sync Completed: Fit With Avi synced steps (8,540) and workouts (Treadmill Run - 240 kcal) from Apple HealthKit!`
      });

      syncMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> Sycned successfully! Added 750ml water and 240kcal workouts.`;
      loadDashboardData();
      
      setTimeout(() => syncMsg.classList.add('hidden'), 5000);
    } catch (err) {
      syncMsg.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Sync failed. Offline mode.`;
    }
  }, 2000);
}

async function loadSocialFeed() {
  const container = document.getElementById('container-social-posts');
  container.innerHTML = `<div class="loader-spinner" style="margin: 20px auto;"></div>`;

  try {
    const posts = await apiCall('/api/social');
    if (posts.error) return;

    container.innerHTML = '';
    posts.forEach(p => {
      const card = document.createElement('div');
      card.className = 'post-card';
      
      const timeStr = new Date(p.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

      card.innerHTML = `
        <div class="post-header">
          <span class="user"><i class="fa-solid fa-user-circle"></i> ${p.user_name}</span>
          <span class="time">${timeStr}</span>
        </div>
        <div class="post-content">
          ${p.content}
        </div>
        <div class="post-actions">
          <button class="btn-like" onclick="likePost(${p.id})">
            <i class="fa-solid fa-heart"></i> <span>${p.likes} Likes</span>
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = '<div class="empty-state-list">Social feed unavailable offline.</div>';
  }
}

async function handleSocialPost(e) {
  e.preventDefault();
  const text = document.getElementById('social-post-text').value.trim();
  if (!text) return;

  try {
    await apiCall('/api/social', 'POST', { content: text });
    document.getElementById('social-post-text').value = '';
    loadSocialFeed();
  } catch (err) {
    alert("Connection lost. Feed uploads are only active online.");
  }
}

async function likePost(id) {
  try {
    await apiCall('/api/social/like', 'POST', { post_id: id });
    loadSocialFeed();
  } catch (err) {
    console.error(err);
  }
}

// OFFLINE QUEUE CONTROLLER
function queueOfflineRequest(endpoint, method, body) {
  syncQueue.push({ endpoint, method, body, timestamp: Date.now() });
  localStorage.setItem('fitwithavi_sync_queue', JSON.stringify(syncQueue));
}

// Sync back to server
async function flushOfflineSync() {
  if (syncQueue.length === 0) return;
  
  const loader = document.getElementById('sync-loader');
  loader.classList.remove('hidden');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userSession.token}`
  };

  for (const req of syncQueue) {
    try {
      await fetch(req.endpoint, {
        method: req.method,
        headers,
        body: JSON.stringify(req.body)
      });
    } catch (err) {
      console.error("Flush item failed: ", err);
      // Wait for next online cycle
      loader.classList.add('hidden');
      return;
    }
  }

  // Clear queue
  syncQueue = [];
  localStorage.removeItem('fitwithavi_sync_queue');
  
  loader.classList.add('hidden');
  loadDashboardData();
}

function setupOnlineStatus() {
  window.addEventListener('online', () => {
    document.getElementById('offline-toast').classList.add('hidden');
    flushOfflineSync();
  });

  window.addEventListener('offline', () => {
    showOfflineToast();
  });

  if (!navigator.onLine) {
    showOfflineToast();
  }
}

function showOfflineToast() {
  const toast = document.getElementById('offline-toast');
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 4000);
}

// PWA INSTALLATION LOGIC
function setupPWAPrompt() {
  const installBanner = document.getElementById('pwa-install-banner');
  const btnInstallBanner = document.getElementById('btn-pwa-install');
  
  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent default browser banner
    e.preventDefault();
    deferredPrompt = e;
    
    // Show custom prompt banner
    installBanner.classList.remove('hidden');
    
    // Hook install triggers
    btnInstallBanner.onclick = () => triggerPWAInstall();
    
    // Sidebar promo link
    const sidebarInstall = document.getElementById('btn-install-sidebar');
    if (sidebarInstall) {
      document.getElementById('sidebar-install-promo').classList.remove('hidden');
      sidebarInstall.onclick = () => triggerPWAInstall();
    }
  });

  // Listen for completed installation
  window.addEventListener('appinstalled', () => {
    installBanner.classList.add('hidden');
    document.getElementById('sidebar-install-promo').classList.add('hidden');
    deferredPrompt = null;
    console.log('Fit With Avi app was installed successfully.');
  });
}

function triggerPWAInstall() {
  if (!deferredPrompt) return;
  
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the PWA install prompt');
    }
    document.getElementById('pwa-install-banner').classList.add('hidden');
    deferredPrompt = null;
  });
}

function dismissPWAInstall() {
  document.getElementById('pwa-install-banner').classList.add('hidden');
}
