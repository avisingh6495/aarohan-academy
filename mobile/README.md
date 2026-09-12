# PulseFit Mobile Deployment Guide

PulseFit is designed with a **unified responsive architecture**. This means the frontend codebase functions as both a web dashboard and a fully installable mobile application.

---

## Option 1: Progressive Web App (PWA) (Recommended)
PWAs are installable directly from mobile web browsers, providing an app-like icon on the homescreen, support for offline caching, fast load times, and standalone interface frames (hiding browser address bars).

### How to Install:
1. **Android (Chrome)**:
   - Start the PulseFit server: `python3 server.py`.
   - Open your mobile browser and navigate to the server's IP address (e.g., `http://192.168.x.x:8000`).
   - A banner at the bottom will prompt you to **"Install App"**. Click it.
   - Alternatively, tap the vertical three-dots menu and select **"Add to Home screen"**.

2. **iOS (Safari)**:
   - Navigate to the server's URL.
   - Tap the **Share** button (upward arrow in a box).
   - Scroll down and select **"Add to Home Screen"**.
   - Tap **Add** in the top right corner.

---

## Option 2: Wrap via Capacitor (For App Store & Google Play Store)
If you wish to bundle this web frontend into an installable native iOS/Android shell to publish on official app stores, you can use **Capacitor** (by Ionic):

1. **Initialize Capacitor in the workspace**:
   ```bash
   npm init @capacitor/app mobile-app
   ```
2. **Configure static folder**:
   Set the web directory parameter `webDir` to point to our `/frontend` directory in your `capacitor.config.json`.
3. **Add native platforms**:
   ```bash
   npx cap add android
   npx cap add ios
   ```
4. **Build and Sync files**:
   ```bash
   npx cap sync
   ```
5. **Open in native SDKs** (Xcode for iOS / Android Studio for Android) to compile, sign, and build release packages:
   ```bash
   npx cap open android
   npx cap open ios
   ```

---

## Option 3: Cross-Platform REST API Integration (Flutter / React Native)
Both platforms share the same standard REST API endpoints. If you decide to build a custom native UI from scratch, your mobile app can make standard HTTP network requests (using `http` in Dart or `fetch` in JavaScript) to:
- `POST /api/auth/register` (Register)
- `POST /api/auth/login` (Authentication)
- `GET/POST /api/profile` (Calorie target calculation and setups)
- `GET /api/dashboard` (Combined water/food logs, step status, and calorie totals)
- `POST /api/logs/water` (Log fluid)
- `POST /api/logs/food` (Log foods and macronutrients)
- `GET /api/workouts` (Fetch daily tailored plans)
