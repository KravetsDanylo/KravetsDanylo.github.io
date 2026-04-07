// src/App.jsx
// Main application component with authentication provider and routes
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Products from './pages/Products/Products'
import Cart from './pages/Cart/Cart'
import PromotionsPage from './pages/PromotionsPage/PromotionsPage'
import Profile from './pages/Profile/Profile'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main className="page-content">
              <div className="container">
                <Routes>
                  <Route path="/" element={<Products />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/promotions" element={<PromotionsPage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </div>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
