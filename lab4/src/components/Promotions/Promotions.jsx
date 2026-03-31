// src/components/Promotions/Promotions.jsx
// Promotions component with Firestore integration
import { useState, useEffect } from 'react'
import { getPromotions } from '../../services/firestore'
import './Promotions.css'

function Promotions() {
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch promotions from Firestore on mount
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true)
        const data = await getPromotions()
        setPromotions(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching promotions:', err)
        setError('Не вдалося завантажити акції. Спробуйте пізніше.')
      } finally {
        setLoading(false)
      }
    }

    fetchPromotions()
  }, [])

  // Loading state
  if (loading) {
    return (
      <section className="promotions-section">
        <h2 className="page-title">Акції та спеціальні пропозиції</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Завантаження акцій...</p>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className="promotions-section">
        <h2 className="page-title">Акції та спеціальні пропозиції</h2>
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="promotions-section">
      <h2 className="page-title">Акції та спеціальні пропозиції</h2>
      <div className="promo-grid">
        {promotions.map((promo) => (
          <article key={promo.id} className="promo-block">
            <div className="promo-text">
              <h3>{promo.title}</h3>
              <p>{promo.description}</p>
            </div>
            <div className="promo-discount">{promo.discount}</div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Promotions
