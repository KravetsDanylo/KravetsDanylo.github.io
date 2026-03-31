// src/services/firestore.js
// Firestore service functions for products and promotions
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore'
import { db } from '../firebase'

/**
 * Products Service Functions
 */

// Get all products from Firestore
export const getProducts = async () => {
  try {
    const productsRef = collection(db, 'products')
    const querySnapshot = await getDocs(productsRef)
    
    const products = []
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return products
  } catch (error) {
    console.error('Error getting products:', error)
    throw error
  }
}

// Add a new product
export const addProduct = async (productData) => {
  try {
    const productsRef = collection(db, 'products')
    await addDoc(productsRef, productData)
  } catch (error) {
    console.error('Error adding product:', error)
    throw error
  }
}

// Update a product
export const updateProduct = async (productId, productData) => {
  try {
    const productRef = doc(db, 'products', productId)
    await updateDoc(productRef, productData)
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

// Delete a product
export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, 'products', productId)
    await deleteDoc(productRef)
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

/**
 * Promotions Service Functions
 */

// Get all promotions from Firestore
export const getPromotions = async () => {
  try {
    const promotionsRef = collection(db, 'promotions')
    const querySnapshot = await getDocs(promotionsRef)
    
    const promotions = []
    querySnapshot.forEach((doc) => {
      promotions.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return promotions
  } catch (error) {
    console.error('Error getting promotions:', error)
    throw error
  }
}

// Add a new promotion
export const addPromotion = async (promotionData) => {
  try {
    const promotionsRef = collection(db, 'promotions')
    await addDoc(promotionsRef, promotionData)
  } catch (error) {
    console.error('Error adding promotion:', error)
    throw error
  }
}

// Update a promotion
export const updatePromotion = async (promotionId, promotionData) => {
  try {
    const promotionRef = doc(db, 'promotions', promotionId)
    await updateDoc(promotionRef, promotionData)
  } catch (error) {
    console.error('Error updating promotion:', error)
    throw error
  }
}

// Delete a promotion
export const deletePromotion = async (promotionId) => {
  try {
    const promotionRef = doc(db, 'promotions', promotionId)
    await deleteDoc(promotionRef)
  } catch (error) {
    console.error('Error deleting promotion:', error)
    throw error
  }
}
