import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Products from './pages/Products/Products'
import Cart from './pages/Cart/Cart'
import PromotionsPage from './pages/PromotionsPage/PromotionsPage'
import Profile from './pages/Profile/Profile'
import './App.css'

function App() {
  return (
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
              </Routes>
            </div>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  )
}

export default App
