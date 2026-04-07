# Lab 5 - SportClub Online Store with Backend Server

## Overview

This project implements a client-server architecture for the SportClub online store with a React frontend and Node.js/Express backend. The backend handles wishlist operations using Firebase Admin SDK and Firestore.

## Project Structure

```
lab5/
├── client/          # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── data/
│   ├── package.json
│   └── vite.config.js
├── server/          # Express backend server
│   ├── server.js
│   ├── serviceAccountKey.json
│   └── package.json
└── serviceAccountKey.json  # Firebase service account key
```

## Features

- **User Authentication**: Firebase Authentication with ID token verification
- **Wishlist Management**: Add, remove, and view wishlist items
- **Product Browsing**: View products with sorting options
- **Shopping Cart**: Add/remove items and manage quantities
- **Responsive Design**: Mobile-friendly UI

## Installation

### Client Setup

```bash
cd lab5/client
npm install
cp .env.example .env
# Edit .env with your Firebase credentials
npm run dev
```

### Server Setup

```bash
cd lab5/server
npm install
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/wishlist/:userId | Get user's wishlist | Yes |
| POST | /api/wishlist/:userId | Add item to wishlist | Yes |
| DELETE | /api/wishlist/:userId/:productId | Remove item from wishlist | Yes |
| GET | /api/health | Health check | No |

## Environment Variables

### Client (.env)
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Server
The server uses `serviceAccountKey.json` for Firebase Admin SDK authentication.

## Validation Rules

The server implements the following validation:
- Product must have `id`, `name`, and `price` fields
- Duplicate products cannot be added to the same wishlist
- Users can only access/modify their own wishlist
- Firebase ID token must be valid for authenticated endpoints

## Technologies Used

- **Frontend**: React 18, Vite, React Router
- **Backend**: Node.js, Express
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Styling**: CSS3 with CSS Variables
