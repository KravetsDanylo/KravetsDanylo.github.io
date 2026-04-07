// src/services/firestore.js
// Firestore service functions that use the API server
import { getProducts as apiGetProducts, getPromotions as apiGetPromotions } from './api'

/**
 * Products Service Functions
 * These functions now use the API server instead of direct Firestore calls
 */

// Get all products from the API server
export const getProducts = async () => {
  try {
    return await apiGetProducts()
  } catch (error) {
    console.error('Error getting products:', error)
    throw error
  }
}

/**
 * Promotions Service Functions
 * These functions now use the API server instead of direct Firestore calls
 */

// Get all promotions from the API server
export const getPromotions = async () => {
  try {
    return await apiGetPromotions()
  } catch (error) {
    console.error('Error getting promotions:', error)
    throw error
  }
}

// Re-export add, update, delete functions for future use
// These would require additional API endpoints
export const addProduct = async (productData) => {
  console.warn('addProduct not implemented in API yet')
  throw new Error('addProduct not implemented')
}

export const updateProduct = async (productId, productData) => {
  console.warn('updateProduct not implemented in API yet')
  throw new Error('updateProduct not implemented')
}

export const deleteProduct = async (productId) => {
  console.warn('deleteProduct not implemented in API yet')
  throw new Error('deleteProduct not implemented')
}

export const addPromotion = async (promotionData) => {
  console.warn('addPromotion not implemented in API yet')
  throw new Error('addPromotion not implemented')
}

export const updatePromotion = async (promotionId, promotionData) => {
  console.warn('updatePromotion not implemented in API yet')
  throw new Error('updatePromotion not implemented')
}

export const deletePromotion = async (promotionId) => {
  console.warn('deletePromotion not implemented in API yet')
  throw new Error('deletePromotion not implemented')
}
