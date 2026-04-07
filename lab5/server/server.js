/**
 * Lab 5 Server - Express backend for SportClub Online Store
 * 
 * This server provides API endpoints for:
 * - Wishlist management (GET, POST, DELETE)
 * - Firebase Authentication middleware
 * - Static file serving
 */

import express from 'express'
import cors from 'cors'
import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Get current file directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 5000

// Initialize Firebase Admin SDK
try {
  
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
    : JSON.parse(readFileSync(join(__dirname, 'serviceAccountKey.json'), 'utf8'));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })
  console.log('Firebase Admin SDK initialized successfully')
} catch (error) {
  console.error('Firebase initialization error:', error.message)
}

// Get Firestore instance
const db = admin.firestore()

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://sportclub-app.netlify.app/'],
  credentials: true
}))
app.use(express.json())

// Serve static files from public directory
app.use('/resources', express.static(join(__dirname, 'public', 'resources')))

/**
 * Firebase Authentication Middleware
 * Verifies the Firebase ID token and attaches the decoded user info to req.user
 */
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token)
    req.user = decodedToken
    next()
  } catch (error) {
    console.error('Token verification error:', error)
    return res.status(403).json({ error: 'Invalid or expired token' })
  }
}

/**
 * Alternative middleware that allows requests without token
 * but validates token if provided
 */
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token)
      req.user = decodedToken
    } catch (error) {
      console.error('Optional auth error:', error.message)
      // Don't fail, just continue without user
    }
  }
  next()
}
/**
 * GET /api/products
 * Отримати всі продукти з Firestore
 */
app.get('/api/products', async (req, res) => {
  try {
    const productsSnapshot = await db.collection('products').get();
    const products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

/**
 * GET /api/promotions
 * Отримати всі акції з Firestore
 */
app.get('/api/promotions', async (req, res) => {
  try {
    const promotionsSnapshot = await db.collection('promotions').get();
    const promotions = promotionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(promotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    res.status(500).json({ error: 'Failed to fetch promotions' });
  }
});
// In-memory storage for demo purposes (replace with Firestore)
const wishlistStore = new Map()

/**
 * GET /api/wishlist/:userId
 * Get wishlist for a specific user
 */
app.get('/api/wishlist/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params
    
    // Verify the user is requesting their own wishlist
    if (req.user.uid !== userId) {
      return res.status(403).json({ error: 'Unauthorized to access this wishlist' })
    }

    // Get wishlist from Firestore
    const userRef = db.collection('users').doc(userId)
    const userDoc = await userRef.get()

    if (userDoc.exists) {
      const userData = userDoc.data()
      res.json({ wishlist: userData.wishlist || [] })
    } else {
      res.json({ wishlist: [] })
    }
  } catch (error) {
    console.error('Error getting wishlist:', error)
    res.status(500).json({ error: 'Failed to get wishlist' })
  }
})

/**
 * POST /api/wishlist/:userId
 * Add item to user's wishlist
 */
app.post('/api/wishlist/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params
    const product = req.body

    // Verify the user is adding to their own wishlist
    if (req.user.uid !== userId) {
      return res.status(403).json({ error: 'Unauthorized to modify this wishlist' })
    }

    // Validation: Check if product data is provided
    if (!product) {
      return res.status(400).json({ error: 'Product data is required' })
    }

    // Validation: Check required product fields
    if (!product.id || !product.name || !product.price) {
      return res.status(400).json({ error: 'Product must have id, name, and price' })
    }

    // Get current wishlist from Firestore
    const userRef = db.collection('users').doc(userId)
    const userDoc = await userRef.get()

    let wishlist = []
    if (userDoc.exists) {
      wishlist = userDoc.data().wishlist || []
    }

    // Validation: Check for duplicates
    if (wishlist.some(item => item.id === product.id)) {
      return res.status(409).json({ error: 'Product already in wishlist' })
    }

    // Add product to wishlist
    wishlist.push(product)

    // Save to Firestore
    await userRef.set({ wishlist }, { merge: true })

    res.status(201).json({ message: 'Product added to wishlist', wishlist })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    res.status(500).json({ error: 'Failed to add to wishlist' })
  }
})

/**
 * DELETE /api/wishlist/:userId/:productId
 * Remove item from user's wishlist
 */
app.delete('/api/wishlist/:userId/:productId', authenticateToken, async (req, res) => {
  try {
    const { userId, productId } = req.params

    // Verify the user is modifying their own wishlist
    if (req.user.uid !== userId) {
      return res.status(403).json({ error: 'Unauthorized to modify this wishlist' })
    }

    // Get current wishlist from Firestore
    const userRef = db.collection('users').doc(userId)
    const userDoc = await userRef.get()

    if (userDoc.exists) {
      let wishlist = userDoc.data().wishlist || []
      
      // Filter out the product
      const initialLength = wishlist.length
      wishlist = wishlist.filter(item => item.id !== productId)

      // Save to Firestore
      await userRef.set({ wishlist }, { merge: true })

      res.json({ message: 'Product removed from wishlist', wishlist })
    } else {
      res.json({ message: 'User not found', wishlist: [] })
    }
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    res.status(500).json({ error: 'Failed to remove from wishlist' })
  }
})

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`API endpoints available at http://localhost:${PORT}/api`)
})

export default app
