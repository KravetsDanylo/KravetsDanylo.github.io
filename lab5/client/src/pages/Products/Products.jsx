// src/pages/Products/Products.jsx
// Products page component with Firestore integration
import { useState, useEffect, useMemo } from 'react'
import ProductCard from '../../components/ProductCard/ProductCard'
import { getProducts } from '../../services/firestore'
import './Products.css'

// Sort options constant
const SORT_OPTIONS = {
  NONE: 'none',
  PRICE_ASC: 'price-asc',
  PRICE_DESC: 'price-desc',
  RATING_HIGH: 'rating-high',
  RATING_LOW: 'rating-low'
}

function Products() {
  const [sortOption, setSortOption] = useState(SORT_OPTIONS.NONE)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch products from Firestore on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await getProducts()
        setProducts(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Не вдалося завантажити продукти. Спробуйте пізніше.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Sort products based on selected option
  const sortedProducts = useMemo(() => {
    const sorted = [...products]

    switch (sortOption) {
      case SORT_OPTIONS.PRICE_ASC:
        return sorted.sort((a, b) => a.price - b.price)
      case SORT_OPTIONS.PRICE_DESC:
        return sorted.sort((a, b) => b.price - a.price)
      case SORT_OPTIONS.RATING_HIGH:
        return sorted.sort((a, b) => b.rating - a.rating)
      case SORT_OPTIONS.RATING_LOW:
        return sorted.sort((a, b) => a.rating - b.rating)
      default:
        // Return products in their original order (as received from Firestore)
        return products
    }
  }, [sortOption, products])

  // Loading state
  if (loading) {
    return (
      <section className="products-page">
        <h2 className="page-title">Наші товари</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Завантаження продуктів...</p>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className="products-page">
        <h2 className="page-title">Наші товари</h2>
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="products-page">
      <h2 className="page-title">Наші товари</h2>

      <div className="sort-controls">
        <label htmlFor="sort-select">Сортувати за:</label>
        <select
          id="sort-select"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="sort-select"
        >
          <option value={SORT_OPTIONS.NONE}>- (за замовчуванням)</option>
          <option value={SORT_OPTIONS.PRICE_ASC}>Ціною (від дешевих до дорогих)</option>
          <option value={SORT_OPTIONS.PRICE_DESC}>Ціною (від дорогих до дешевих)</option>
          <option value={SORT_OPTIONS.RATING_HIGH}>Рейтингом (від вищого)</option>
          <option value={SORT_OPTIONS.RATING_LOW}>Рейтингом (від нижчого)</option>
        </select>
      </div>

      <div className="product-grid">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default Products
