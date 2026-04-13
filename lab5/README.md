# SportClub Online Store - Lab 5

This repository contains the completed setup for Lab 5. This project simulates an online sports store with a full-stack architecture.

## Project Structure

The structure is divided into two separate applications:

- `client/` - A modern React application built with **Vite**. It handling dynamic UI rendering, managing the user's wishlist, real-time data fetching directly from Firestore and utilizing modern hooks and router-based navigation.
- `server/` - An **Express.js** backend running on **Node.js**. This server utilizes the Firebase Admin SDK to allow for secure data manipulation from secure API endpoints (like wishlist management and static file serving) utilizing JWT Token based authentication for user-specific operations.

## Technologies Used

### Frontend (Client)
- React 18
- Vite
- Firebase Client SDK (Auth, Firestore)
- React Router DOM
- Vanilla CSS and HTML5

### Backend (Server)
- Node.js
- Express.js
- Firebase Admin SDK
- CORS Middleware

## Development Setup

### 1. Prerequisites
- Node.js (v18+)
- A new or existing Firebase Project (with Firestore and Authentication Enabled)

### 2. Backend (Server) Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate a Firebase Service Account Key:
   - Go to Firebase Console -> **Project Settings** -> **Service accounts** -> **Generate new private key**.
   - Download the file and place it in the `server` folder, renaming it to `serviceAccountKey.json`.
4. Run the development server:
   ```bash
   npm run dev
   ```
   > The server usually starts at `http://localhost:5000`

### 3. Frontend (Client) Setup
1. Navigate into the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add Environment Variables:
   - Create a `.env` file in the `client` directory based on `.env` with your Firebase Configuration variables:
     ```env
     VITE_API_URL=http://localhost:5000/api
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```
4. Run the React Development client:
   ```bash
   npm run dev
   ```

## API Endpoints (Server)

- `GET /api/products` - Returns a list of all products from Firestore.
- `GET /api/promotions` - Returns a list of all promotions from Firestore.
- `GET /api/wishlist/:userId` - Returns the user's wishlist (Requires Auth Bearer Token).
- `POST /api/wishlist/:userId` - Adds a product to the user's wishlist (Requires Auth Bearer Token).
- `DELETE /api/wishlist/:userId/:productId` - Removes a product from the user's wishlist (Requires Auth Bearer Token).

## Deployment

Refer to the [DEPLOYMENT.md](DEPLOYMENT.md) guide for information on deploying the backend to Render and the frontend to Netlify.
