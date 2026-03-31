# Firebase Setup Instructions

## Lab 4: SportClub Online Store with Firebase Authentication & Firestore

This document provides instructions for setting up Firebase for your React application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add a project" or "Create a project"
3. Enter a project name (e.g., "sportclub-lab4")
4. Follow the setup wizard to create your project

## Step 2: Enable Firebase Authentication

1. In Firebase Console, go to **Authentication** in the left sidebar
2. Click **Get Started**
3. Go to the **Sign-in method** tab
4. Enable **Email/Password** sign-in method
5. Click **Save**

## Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (e.g., europe-west)
5. Click **Enable**

### Firestore Security Rules (Test Mode)

For development, use these rules (go to Firestore > Rules):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /products {
      allow read: if true;
      allow write: if false; // Only allow writes via Firebase Console or CLI
    }
    match /promotions {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## Step 4: Get Firebase Configuration

1. Go to **Project Settings** (gear icon in the sidebar)
2. Scroll down to **Your apps** section
3. Click the **Web** icon (</>) to add a web app
4. Register your app with a name (e.g., "SportClub Web App")
5. Copy the `firebaseConfig` object

## Step 5: Update Firebase Configuration in Your App

Open `lab4/src/firebase.js` and replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID'
}
```

## Step 6: Populate Firestore with Initial Data

Go to **Firestore Database** > **Start collection** and create the following collections:

### Collection: `products`

Add documents with these fields:

| Field | Type | Example Value |
|-------|------|---------------|
| id | number | 1 |
| name | string | "Кросівки бігові Pro" |
| price | number | 3500 |
| rating | number | 4.8 |
| description | string | "Легкі та дихаючі кросівки..." |
| image | string | "/resources/snickers.jpg" |
| inStock | boolean | true |

Example products to add:

1. **Product 1:**
   - id: 1
   - name: "Кросівки бігові Pro"
   - price: 3500
   - rating: 4.8
   - description: "Легкі та дихаючі кросівки для професійного бігу по асфальту."
   - image: "/resources/snickers.jpg"
   - inStock: true

2. **Product 2:**
   - id: 2
   - name: "Пляшка для води Eco"
   - price: 450
   - rating: 4.2
   - description: "Ергономічна пляшка об'ємом 1 літр з безпечного пластику Tritan."
   - image: "/resources/bottle.jpg"
   - inStock: true

3. **Product 3:**
   - id: 3
   - name: "Гантелі розбірні"
   - price: 1800
   - rating: 4.9
   - description: "Набір розбірних гантелей для домашніх тренувань."
   - image: "/resources/dumbbells.jpg"
   - inStock: false

### Collection: `promotions`

Add documents with these fields:

| Field | Type | Example Value |
|-------|------|---------------|
| id | number | 1 |
| title | string | "Зимовий розпродаж" |
| description | string | "Отримайте знижку на всі зимові куртки..." |
| discount | string | "-30%" |

Example promotions to add:

1. **Promotion 1:**
   - id: 1
   - title: "Зимовий розпродаж"
   - description: "Отримайте знижку на всі зимові куртки та термобілизну."
   - discount: "-30%"

2. **Promotion 2:**
   - id: 2
   - title: "1+1 = 3"
   - description: "Купуйте дві пари шкарпеток для фітнесу та отримайте третю у подарунок!"
   - discount: "Подарунок"

## Step 7: Run Your Application

```bash
cd lab4
npm run dev
```

## Features Implemented

### 1. Authentication (Firebase Auth)
- User registration with email/password
- User login/logout
- Auth state persistence

### 2. Firestore Database
- Products loaded from Firestore
- Promotions loaded from Firestore
- Loading states and error handling

### 3. Wishlist (User-specific)
- Add/remove products to wishlist
- Wishlist stored in user's Firestore document
- Only visible for authenticated users
- Add wishlist items to cart

### 4. UI Updates
- Navbar shows auth-based navigation
- Login/Register pages
- Profile page with wishlist
- ProductCard with wishlist button (heart icon)

## Testing the Application

1. **Register a new account:**
   - Go to `/register`
   - Enter your name, email, and password

2. **Login:**
   - Go to `/login`
   - Enter your credentials

3. **Add to wishlist:**
   - Browse products on the home page
   - Click the heart icon on any product card (only visible when logged in)

4. **View wishlist:**
   - Go to Profile page
   - See your wishlist items
   - Add items to cart from wishlist

5. **View products and promotions:**
   - Products are loaded from Firestore
   - Promotions are loaded from Firestore
