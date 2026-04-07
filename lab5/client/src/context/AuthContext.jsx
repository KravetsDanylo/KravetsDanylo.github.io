// src/context/AuthContext.jsx
// Context for managing user authentication state with API integration

import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  getIdToken,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../firebase'
import { getWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist } from '../services/api'

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
      if (currentUser) {
        // Get ID token and store it
        getIdToken(currentUser).then(token => {
          const userData = {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            token
          }
          localStorage.setItem('authUser', JSON.stringify(userData))
          setUser(userData)
        })
      } else {
        localStorage.removeItem('authUser')
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  /**
   * Register a new user with email and password
   */
  const register = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName })
      
      // Get the ID token after registration
      const token = await getIdToken(userCredential.user)
      
      // Store user data with token
      const userData = {
        uid: userCredential.user.uid,
        email,
        displayName,
        token
      }
      localStorage.setItem('authUser', JSON.stringify(userData))
      
      return userCredential
    } catch (error) {
      throw error
    }
  }

  /**
   * Login user with email and password
   */
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const token = await getIdToken(userCredential.user)
      
      const userData = {
        uid: userCredential.user.uid,
        email,
        displayName: userCredential.user.displayName,
        token
      }
      localStorage.setItem('authUser', JSON.stringify(userData))
      
      return userCredential
    } catch (error) {
      throw error
    }
  }

  /**
   * Logout current user
   */
  const logout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem('authUser')
    } catch (error) {
      throw error
    }
  }

  /**
   * Add item to user's wishlist via API
   */
  const addToWishlist = async (userId, product) => {
    try {
      await apiAddToWishlist(userId, product)
    } catch (error) {
      throw error
    }
  }

  /**
   * Remove item from user's wishlist via API
   */
  const removeFromWishlist = async (userId, productId) => {
    try {
      await apiRemoveFromWishlist(userId, productId)
    } catch (error) {
      throw error
    }
  }

  /**
   * Get user's wishlist via API
   */
  const getWishlistData = async (userId) => {
    try {
      return await getWishlist(userId)
    } catch (error) {
      throw error
    }
  }

  /**
   * Check if product is in wishlist
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
    getWishlist: getWishlistData,
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
