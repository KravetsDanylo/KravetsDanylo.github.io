# Deployment Guide

This guide will walk you through the process of deploying the `server` to **Render** and the `client` to **Netlify**. Both are free tier friendly and pair excellently.

---

## 1. Deploying the Backend (Server) to Render

Render is a cloud provider that simplifies deploying full-stack and backend Node.js applications.

### Prerequisites:
- Your completed application must be committed and pushed to a GitHub repository.

### Steps:
1. Go to [Render](https://render.com) and log in or create an account via GitHub.
2. Click the **"New"** button and select **"Web Service"**.
3. Choose **"Build and deploy from a Git repository"**.
4. Connect to your GitHub account and find your repository containing the project.
5. In the settings configuration for the New Web Service, fill in the following:
   - **Name:** Choose a suitable name (e.g., `sportclub-backend`)
   - **Root Directory:** `lab5/server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Setting up the Firebase Credential:
   - Since you can't securely commit the `serviceAccountKey.json` to GitHub, Render allows setting environment variables.
   - Open your `serviceAccountKey.json` and minify it or copy its entire raw JSON string content.
   - Scroll down on Render to **"Environment Variables"**.
   - Add a key named `FIREBASE_SERVICE_ACCOUNT` and paste the raw JSON string content.
7. Click **"Create Web Service"**.
8. Render will now start building and deploying your app. Watch for the `"Render Live"` logs.
9. **Important:** Copy the generated Render URL (e.g., `https://sportclub-backend.onrender.com`). You will need this for the Client setup.

---

## 2. Deploying the Frontend (Client) to Netlify

Netlify is perfect for hosting statically built Single Page Applications such as Vite with React.

### Prerequisites:
- Successful server deployment on Render (need its URL).

### Steps:
1. Go to [Netlify](https://www.netlify.com/) and log in or create an account via GitHub.
2. From the Netlify Dashboard, click on **"Add new site"** -> **"Import an existing project"**.
3. Click on the **GitHub** button and authorize Netlify.
4. Select the repository containing your `lab5` project.
5. Configure the Build Settings:
   - **Base directory:** `lab5/client`
   - **Build command:** `npm run build`
   - **Publish directory:** `lab5/client/dist` (Netlify should auto-fill `dist` based on the base directory, making it `lab5/client/dist`)
6. Add your Environment Variables. Click on **"Add environment variables"** and input your specific configurations (matches what you have in `client/.env` locally):
   - `VITE_API_URL` = (Your Render URL you kept from earlier, ending in `/api`. E.g., `https://sportclub-backend.onrender.com/api`)
   - `VITE_FIREBASE_API_KEY` = your_api_key
   - `VITE_FIREBASE_AUTH_DOMAIN` = your_auth_domain
   - `VITE_FIREBASE_PROJECT_ID` = your_project_id
   - `VITE_FIREBASE_STORAGE_BUCKET` = your_storage_bucket
   - `VITE_FIREBASE_MESSAGING_SENDER_ID` = your_messaging_sender_id
   - `VITE_FIREBASE_APP_ID` = your_app_id
7. Click **"Deploy site"**. Netlify will take a moment to build the Vite app and assign you a URL.
8. Once the build finishes, you can preview the website by clicking on the generated link. 

### Fixing Client-Side Routing (React Router) on Netlify
Since React uses client-side routing, directly opening some routes or refreshing pages might show Netlify's 404 page.
If you didn't create a `_redirects` file:
1. Go to `client/public/`
2. Create a file named exactly `_redirects` (without any extension).
3. Insert this single line: `/* /index.html 200`
4. Commit and push this change to GitHub. Netlify will rebuild automatically and now your routing will work everywhere.

Celebrate, your full-stack Lab 5 application is now deployed!
