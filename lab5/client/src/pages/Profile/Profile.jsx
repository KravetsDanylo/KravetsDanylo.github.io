// src/pages/Profile/Profile.jsx
// Profile page component with wishlist functionality and logout button
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import './Profile.css'

function Profile() {
  const { user, logout, getWishlist, removeFromWishlist } = useAuth()
  const { addToCart, isInCart } = useCart()
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState([])
  const [wishlistLoading, setWishlistLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Fetch wishlist on mount and when user changes
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user && user.uid) {
        try {
          setWishlistLoading(true)
          const data = await getWishlist(user.uid)
          setWishlist(data)
        } catch (error) {
          console.error('Error fetching wishlist:', error)
        } finally {
          setWishlistLoading(false)
        }
      }
    }

    fetchWishlist()
  }, [user, getWishlist])

  // Add wishlist item to cart (only if in stock)
  const handleAddToCart = (product) => {
    if (product.inStock) {
      addToCart(product)
    }
  }

  // Remove item from wishlist
  const handleRemoveFromWishlist = async (productId) => {
    if (user && user.uid) {
      try {
        await removeFromWishlist(user.uid, productId)
        setWishlist(prev => prev.filter(item => item.id !== productId))
      } catch (error) {
        console.error('Error removing from wishlist:', error)
      }
    }
  }

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Show loading only when auth is still loading (user is null, not undefined)
  if (user === null || user === undefined) {
    return (
      <section className="profile-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Завантаження...</p>
        </div>
      </section>
    )
  }

  // If user exists but isLoggingOut is true, show logging out state
  if (isLoggingOut) {
    return (
      <section className="profile-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Вихід з системи...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="profile-page">
      <h2 className="page-title">Мій профіль</h2>

      <div className="profile-layout">
        {/* User Info Section */}
        <div className="profile-info">
          <div className="avatar">
            {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
          </div>
          <h3>{user.displayName || 'Користувач'}</h3>
          <p className="profile-email">{user.email}</p>
          <p className="profile-status">Статус: Постійний клієнт</p>

          {/* Logout button */}
          <button
            className="btn-logout"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Вихід...' : 'Вийти'}
          </button>
        </div>

        {/* Profile Details Section */}
        <div className="profile-details">
          <article className="history">
            <h4>Історія покупок</h4>
            <ul>
              <li>
                Килимок для йоги (12.01.2026) — <strong>Виконано</strong>
              </li>
              <li>
                Еспандер трубчастий (05.11.2025) — <strong>Виконано</strong>
              </li>
            </ul>
          </article>

          {/* Wishlist Section */}
          <article className="wishlist">
            <h4>Бажані товари</h4>

            {wishlistLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Завантаження бажаного...</p>
              </div>
            ) : wishlist.length === 0 ? (
              <p className="wishlist-empty">Немає товарів у бажаному</p>
            ) : (
              <ul className="wishlist-items">
                {wishlist.map((item) => {
                  const itemIsInCart = isInCart(item.id)
                  return (
                    <li key={item.id} className="wishlist-item">
                      <div className="wishlist-item-info">
                        <span className="wishlist-item-name">{item.name}</span>
                        <span className="wishlist-item-price">{item.price} грн</span>
                        {!item.inStock && (
                          <span className="wishlist-item-stock out-of-stock">Немає в наявності</span>
                        )}
                        {itemIsInCart && (
                          <span className="wishlist-item-stock in-cart">У кошику</span>
                        )}
                      </div>
                      <div className="wishlist-item-actions">
                        <button
                          className={`btn-add-to-cart ${(!item.inStock || itemIsInCart) ? 'disabled' : ''}`}
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.inStock || itemIsInCart}
                          title={
                            !item.inStock
                              ? 'Товару немає в наявності'
                              : itemIsInCart
                              ? 'Вже в кошику'
                              : 'Додати в кошик'
                          }
                        >
                          {itemIsInCart ? 'У кошику' : 'Додати в кошик'}
                        </button>
                        <button
                          className="btn-remove"
                          onClick={() => handleRemoveFromWishlist(item.id)}
                        >
                          Видалити
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </article>
        </div>
      </div>
    </section>
  )
}

export default Profile
