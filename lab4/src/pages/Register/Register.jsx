// src/pages/Register/Register.jsx
// Register page component
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Register.css'

function Register() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Паролі не співпадають')
      return
    }

    // Validate password length
    if (password.length < 6) {
      setError('Пароль має містити щонайменше 6 символів')
      return
    }

    setLoading(true)

    try {
      await register(email, password, displayName)
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
      case 'auth/email-already-in-use':
        return 'Цей email вже зареєстровано'
      case 'auth/invalid-email':
        return 'Невірна адреса електронної пошти'
      case 'auth/operation-not-allowed':
        return 'Операція заборонена'
      case 'auth/weak-password':
        return 'Занадто слабкий пароль'
      default:
        return 'Сталася помилка. Спробуйте ще раз.'
    }
  }

  return (
    <section className="register-page">
      <div className="auth-container">
        <h2 className="auth-title">Реєстрація</h2>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="displayName">Ім'я</label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ваше ім'я"
              required
            />
          </div>
          
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
              minLength={6}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Підтвердіть пароль</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Завантаження...' : 'Зареєструватися'}
          </button>
        </form>
        
        <p className="auth-switch">
          Вже маєте акаунт? <Link to="/login">Увійти</Link>
        </p>
      </div>
    </section>
  )
}

export default Register
