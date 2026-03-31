# SportClub Lab 4 - React Application with Firebase

This project is laboratory work #4 using React with Firebase Authentication and Firestore for the SportClub online store.

## Features

### Authentication (Firebase Auth)
- User registration with email/password
- User login/logout
- Auth state persistence
- Protected routes for authenticated users

### Firestore Database
- Products loaded from Firestore
- Promotions loaded from Firestore
- Loading states and error handling

### Wishlist (User-specific)
- Add/remove products to wishlist
- Wishlist stored in user's Firestore document
- Only visible for authenticated users
- Add wishlist items to cart

### Shopping Cart
- Add/remove items from cart
- Quantity management
- Cart total calculation

## Requirements

- Node.js (version 18+ recommended)
- npm (comes with Node.js)
- Firebase project with Authentication and Firestore enabled

## Installation & Setup

### 1. Install dependencies:
```bash
npm install
```

### 2. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable **Authentication** (Email/Password)
4. Enable **Firestore Database**
5. Copy your Firebase config

Open `src/firebase.js` and replace the placeholder values with your actual Firebase config:

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

### 3. Populate Firestore Database

Create the following collections in Firestore:

**Collection: `products`**
- id (number)
- name (string)
- price (number)
- rating (number)
- description (string)
- image (string)
- inStock (boolean)

**Collection: `promotions`**
- id (number)
- title (string)
- description (string)
- discount (string)

### 4. Run the development server:
```bash
npm run dev
```

### 5. Open your browser
Navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## Project Structure

```
lab4/
├── public/
│   ├── index.html          # HTML template
│   └── resources/          # Product images
├── src/
│   ├── components/         # React components
│   │   ├── Navbar/         # Navigation bar
│   │   ├── ProductCard/    # Product card
│   │   ├── Promotions/     # Promotions block
│   │   └── Footer/         # Footer
│   ├── pages/              # Application pages
│   │   ├── Products/       # Main page (products)
│   │   ├── Cart/           # Shopping cart
│   │   ├── PromotionsPage/ # Promotions page
│   │   ├── Profile/        # User profile
│   │   ├── Login/          # Login page
│   │   └── Register/       # Registration page
│   ├── context/            # React Context
│   │   ├── CartContext.jsx # Cart context
│   │   └── AuthContext.jsx # Auth context
│   ├── services/           # Firebase services
│   │   └── firestore.js    # Firestore functions
│   ├── data/               # Data
│   │   └── products.js     # Products list
│   ├── styles/             # Styles
│   │   └── variables.css   # CSS variables
│   ├── App.jsx             # Main component
│   ├── firebase.js         # Firebase config
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies and scripts
└── vite.config.js          # Vite configuration
```

## Functionality

### Components:
- **ProductCard**: Displays name, price, rating (stars), and "Add to Cart" button
- **Cart**: Shows cart items with quantity management and total calculation
- **Promotions**: Displays promotional offers
- **Profile**: User profile with avatar, status, and wishlist

### Routes:
- `/` - Main page (Products)
- `/cart` - Shopping cart
- `/promotions` - Promotions
- `/profile` - User profile (authenticated only)
- `/login` - Login page
- `/register` - Registration page

### Product Sorting:
- By price (low to high)
- By price (high to low)
- By rating (highest first)
- By rating (lowest first)

## Design

SportClub styling:
- Primary color: `#2563eb` (blue)
- Dark text: `#1e293b`
- White background: `#ffffff`
- Sticky header with blur effect
- Product cards with shadow and hover animation
- Gradient buttons: `linear-gradient(135deg, #2563eb, #4f46e5)`

## Technologies

- **React 18** - UI library
- **React Router DOM 6** - Routing
- **Firebase Auth** - User authentication
- **Firebase Firestore** - Cloud database
- **Vite** - Build tool
- **CSS** - Styling

## Firebase Setup

For detailed Firebase setup instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
