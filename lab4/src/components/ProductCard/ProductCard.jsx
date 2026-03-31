// src/components/ProductCard/ProductCard.jsx
// Product card component with wishlist functionality
import { useState, useEffect } from 'react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import './ProductCard.css'

function ProductCard({ product }) {
  const { id, name, price, rating, description, image, inStock } = product
  const { addToCart, isInCart } = useCart()
  const { user, addToWishlist, removeFromWishlist, getWishlist } = useAuth()
  const alreadyInCart = isInCart(id)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)

  // Check if product is in wishlist on mount and when user changes
  useEffect(() => {
    const checkWishlist = async () => {
      if (user && user.uid) {
        try {
          const wishlist = await getWishlist(user.uid)
          setIsWishlisted(wishlist.some(item => item.id === id))
        } catch (error) {
          console.error('Error checking wishlist:', error)
        }
      } else {
        setIsWishlisted(false)
      }
    }
    checkWishlist()
  }, [user, id, getWishlist])

  // Generate star rating display
  const renderStars = () => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const stars = []

    for (let i = 0; i < fullStars; i++) {
      stars.push('★')
    }
    if (hasHalfStar) {
      stars.push('☆')
    }

    return stars.join('')
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uk-UA').format(price) + ' грн'
  }

  const handleAddToCart = () => {
    if (inStock && !alreadyInCart) {
      addToCart(product)
    }
  }

  // Toggle wishlist status
  const handleWishlistToggle = async () => {
    if (!user || !user.uid) return
    
    setWishlistLoading(true)
    try {
      if (isWishlisted) {
        await removeFromWishlist(user.uid, id)
        setIsWishlisted(false)
      } else {
        await addToWishlist(user.uid, product)
        setIsWishlisted(true)
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    } finally {
      setWishlistLoading(false)
    }
  }

  return (
    <article className="product-card" data-id={id}>
      <img src={image} alt={name} />
      <div className="card-content">
        <h3>{name}</h3>
        <p className="description">{description}</p>
        <p className="price">{formatPrice(price)}</p>
        <p className={`availability ${inStock ? 'in-stock' : 'out-of-stock'}`}>
          {inStock ? 'В наявності' : 'Очікується'}
        </p>
        <p className="rating">
          Рейтинг: {renderStars()} ({rating})
        </p>
        
        <div className="card-actions">
          <button
            className={`btn ${!inStock || alreadyInCart ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={!inStock || alreadyInCart}
          >
            {alreadyInCart ? 'Товар у кошику' : 'В кошик'}
          </button>
          
          {/* Wishlist button - only visible for authenticated users */}
          {user && (
            <button
              className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              title={isWishlisted ? 'Прибрати з бажаного' : 'Додати до бажаного'}
            >
              <span className="heart-icon">{isWishlisted ? '❤️' : '🤍'}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProductCard
