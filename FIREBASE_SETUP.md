# Firebase Setup Guide

## 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "swift-nourishing-life")
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## 3. Create Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

## 4. Get Firebase Configuration
1. In Firebase Console, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Web" icon (</>) to add a web app
4. Enter app nickname (e.g., "swift-nourishing-life-web")
5. Click "Register app"
6. Copy the configuration object

## 5. Setup Environment Variables
1. Create a `.env` file in your project root
2. Add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## 6. Create Admin User
1. Register a new account with email: `health@gmail.com`
2. This email will automatically get admin privileges
3. Use this account to access the admin dashboard

## 7. Firestore Security Rules (Optional for Production)
Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read FAQs
    match /faqs/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users can create feedback, admins can read/update
    match /feedback/{document} {
      allow create: if request.auth != null;
      allow read, update: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Features Implemented

### Authentication
- ✅ Firebase Email/Password authentication
- ✅ User registration with automatic role assignment
- ✅ Admin role for `health@gmail.com`
- ✅ Protected routes based on authentication status

### Admin Dashboard
- ✅ Real-time user count from Firebase
- ✅ Total diseases and meals count
- ✅ Feedback management system
- ✅ Reply to feedback and auto-add to FAQ

### Feedback System
- ✅ Users can submit ratings and feedback
- ✅ Feedback automatically sent to admin
- ✅ Admin can reply to feedback
- ✅ Replied feedback automatically added to FAQ page

### FAQ System
- ✅ Static FAQs + Dynamic FAQs from admin replies
- ✅ Real-time updates when admin replies to feedback

## Usage
1. Start the development server: `npm run dev`
2. Register with any email (use `health@gmail.com` for admin access)
3. Submit feedback through the Rating page
4. Admin can view and reply to feedback in the Dashboard
5. Replied feedback appears in the FAQ page