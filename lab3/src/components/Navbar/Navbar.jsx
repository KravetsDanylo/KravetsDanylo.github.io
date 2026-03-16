import { NavLink } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import './Navbar.css'

function Navbar() {
  const cartCount = useCart().getCartCount()

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
            <li>
              <NavLink to="/profile">Профіль</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
