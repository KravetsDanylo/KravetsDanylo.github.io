import { useCart } from '../../context/CartContext'
import './ProductCard.css'

function ProductCard({ product }) {
  const { id, name, price, rating, description, image, inStock } = product
  const { addToCart, isInCart } = useCart()
  const alreadyInCart = isInCart(id)

  // Generate star rating display
  const renderStars = () => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const stars = []

    for (let i = 0; i < fullStars; i++) {
      stars.push('★')
    }
    if (hasHalfStar) {
      stars.push('☆')
    }

    return stars.join('')
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uk-UA').format(price) + ' грн'
  }

  const handleAddToCart = () => {
    if (inStock && !alreadyInCart) {
      addToCart(product)
    }
  }

  return (
    <article className="product-card" data-id={id}>
      <img src={image} alt={name} />
      <div className="card-content">
        <h3>{name}</h3>
        <p className="description">{description}</p>
        <p className="price">{formatPrice(price)}</p>
        <p className={`availability ${inStock ? 'in-stock' : 'out-of-stock'}`}>
          {inStock ? 'В наявності' : 'Очікується'}
        </p>
        <p className="rating">
          Рейтинг: {renderStars()} ({rating})
        </p>
        <button
          className={`btn ${!inStock || alreadyInCart ? 'disabled' : ''}`}
          onClick={handleAddToCart}
          disabled={!inStock || alreadyInCart}
        >
          {alreadyInCart ? 'Товар у кошику' : 'В кошик'}
        </button>
      </div>
    </article>
  )
}

export default ProductCard
