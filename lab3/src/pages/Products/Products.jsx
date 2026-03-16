import { useState, useMemo } from 'react'
import ProductCard from '../../components/ProductCard/ProductCard'
import { products } from '../../data/products'
import './Products.css'

const SORT_OPTIONS = {
  NONE: 'none',
  PRICE_ASC: 'price-asc',
  PRICE_DESC: 'price-desc',
  RATING_HIGH: 'rating-high',
  RATING_LOW: 'rating-low'
}

function Products() {
  const [sortOption, setSortOption] = useState(SORT_OPTIONS.NONE)

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
        return sorted
    }
  }, [sortOption])

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
