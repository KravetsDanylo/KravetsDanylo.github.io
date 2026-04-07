// src/services/api.js
// API service for making HTTP requests to the backend server

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Get Firebase ID token from localStorage
 */
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('authUser'))
  return user?.token || null
}

/**
 * Generic fetch wrapper with auth token
 */
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = getToken()

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Request failed')
  }

  return data
}

/**
 * Products API functions
 */

// Get all products
export const getProducts = async () => {
  const data = await fetchWithAuth('/products')
  return data || []
}

/**
 * Promotions API functions
 */

// Get all promotions
export const getPromotions = async () => {
  const data = await fetchWithAuth('/promotions')
  return data || []
}

/**
 * Wishlist API functions
 */

// Get user's wishlist
export const getWishlist = async (userId) => {
  const data = await fetchWithAuth(`/wishlist/${userId}`)
  return data.wishlist || []
}

// Add item to wishlist
export const addToWishlist = async (userId, product) => {
  const data = await fetchWithAuth(`/wishlist/${userId}`, {
    method: 'POST',
    body: JSON.stringify(product)
  })
  return data
}

// Remove item from wishlist
export const removeFromWishlist = async (userId, productId) => {
  const data = await fetchWithAuth(`/wishlist/${userId}/${productId}`, {
    method: 'DELETE'
  })
  return data
}

export default {
  getProducts,
  getPromotions,
  getWishlist,
  addToWishlist,
  removeFromWishlist
}
