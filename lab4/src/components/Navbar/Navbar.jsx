// src/components/Navbar/Navbar.jsx
// Navigation bar component with authentication-aware links
import { NavLink } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const { getCartCount } = useCart()
  const { user } = useAuth()
  const cartCount = getCartCount()

  return (
    <header className="site-header">
      <div className="container header-content">
        <div className="logo">
          <h1>SportClub</h1>
        </div>
        <nav className="main-nav">
          <ul>
            <li>
              <NavLink to="/" end>
                Продукти
              </NavLink>
            </li>
            <li>
              <NavLink to="/cart">
                Кошик
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/promotions">Акції</NavLink>
            </li>
            
            {/* Auth-based navigation */}
            {user ? (
              <>
                <li>
                  <NavLink to="/profile">Профіль</NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/login">Увійти</NavLink>
                </li>
                <li>
                  <NavLink to="/register">Реєстрація</NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
