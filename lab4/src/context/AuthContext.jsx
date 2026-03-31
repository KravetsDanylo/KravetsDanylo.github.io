// src/context/AuthContext.jsx
// Context for managing user authentication state
import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

// Create the authentication context
const AuthContext = createContext(null)

/**
 * AuthProvider component - wraps the app to provide authentication state
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  /**
   * Register a new user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {string} displayName - User's display name
   * @returns {Promise}
   */
  const register = async (email, password, displayName) => {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update user profile with display name
      await updateProfile(userCredential.user, { displayName })
      
      // Create user document in Firestore with initial wishlist
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        displayName,
        createdAt: new Date().toISOString(),
        wishlist: []
      })

      return userCredential
    } catch (error) {
      throw error
    }
  }

  /**
   * Login user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise}
   */
  const login = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      throw error
    }
  }

  /**
   * Logout current user
   * @returns {Promise}
   */
  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      throw error
    }
  }

  /**
   * Add item to user's wishlist in Firestore
   * @param {string} userId - User's ID
   * @param {object} product - Product to add
   * @returns {Promise}
   */
  const addToWishlist = async (userId, product) => {
    try {
      const userRef = doc(db, 'users', userId)
      const userDoc = await getDoc(userRef)
      
      if (userDoc.exists()) {
        const currentWishlist = userDoc.data().wishlist || []
        // Check if product is already in wishlist
        if (!currentWishlist.some(item => item.id === product.id)) {
          await setDoc(userRef, {
            wishlist: [...currentWishlist, product]
          }, { merge: true })
        }
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * Remove item from user's wishlist
   * @param {string} userId - User's ID
   * @param {number} productId - Product ID to remove
   * @returns {Promise}
   */
  const removeFromWishlist = async (userId, productId) => {
    try {
      const userRef = doc(db, 'users', userId)
      const userDoc = await getDoc(userRef)
      
      if (userDoc.exists()) {
        const currentWishlist = userDoc.data().wishlist || []
        const updatedWishlist = currentWishlist.filter(item => item.id !== productId)
        await setDoc(userRef, { wishlist: updatedWishlist }, { merge: true })
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * Get user's wishlist
   * @param {string} userId - User's ID
   * @returns {Promise<Array>}
   */
  const getWishlist = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId)
      const userDoc = await getDoc(userRef)
      
      if (userDoc.exists()) {
        return userDoc.data().wishlist || []
      }
      return []
    } catch (error) {
      throw error
    }
  }

  /**
   * Check if product is in wishlist
   * @param {string} userId - User's ID
   * @param {number} productId - Product ID
   * @returns {Promise<boolean>}
   */
  const isInWishlist = async (userId, productId) => {
    try {
      const wishlist = await getWishlist(userId)
      return wishlist.some(item => item.id === productId)
    } catch (error) {
      return false
    }
  }

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    isInWishlist
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
