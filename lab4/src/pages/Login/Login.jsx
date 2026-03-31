// src/pages/Login/Login.jsx
// Login page component
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/profile')
    } catch (err) {
      setError(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  // Get user-friendly error message
  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'Невірна адреса електронної пошти'
      case 'auth/user-disabled':
        return 'Користувача вимкнено'
      case 'auth/user-not-found':
        return 'Користувача з такою email не знайдено'
      case 'auth/wrong-password':
        return 'Невірний пароль'
      case 'auth/invalid-credential':
        return 'Невірний email або пароль'
      default:
        return 'Сталася помилка. Спробуйте ще раз.'
    }
  }

  return (
    <section className="login-page">
      <div className="auth-container">
        <h2 className="auth-title">Увійти</h2>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Завантаження...' : 'Увійти'}
          </button>
        </form>
        
        <p className="auth-switch">
          Немає акаунту? <Link to="/register">Зареєструватися</Link>
        </p>
      </div>
    </section>
  )
}

export default Login
