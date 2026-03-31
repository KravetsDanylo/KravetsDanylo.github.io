import { useCart } from '../../context/CartContext'
import './Cart.css'

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uk-UA').format(price) + ' грн'
  }

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity, 10)
    if (isNaN(quantity) || quantity <= 0) {
      removeFromCart(productId)
    } else {
      updateQuantity(productId, Math.min(quantity, 10))
    }
  }

  if (cartItems.length === 0) {
    return (
      <section className="cart-page">
        <h2 className="page-title">Ваш кошик</h2>
        <div className="cart-empty">
          <p>Кошик порожній</p>
        </div>
      </section>
    )
  }

  return (
    <section className="cart-page">
      <h2 className="page-title">Ваш кошик</h2>
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item" data-id={item.id}>
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">{formatPrice(item.price)}/од.</div>
              </div>
              <div className="cart-item-quantity">
                <label htmlFor={`quantity-${item.id}`}>К-сть:</label>
                <input
                  type="number"
                  id={`quantity-${item.id}`}
                  min="1"
                  max="10"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                />
              </div>
              <div className="cart-item-total">
                {formatPrice(item.price * item.quantity)}
              </div>
              <div className="cart-item-actions">
                <button
                  className="remove-item-btn"
                  onClick={() => removeFromCart(item.id)}
                  title="Видалити товар повністю"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <div className="summary-row">
            <span>Загальна сума:</span>
            <span id="total-amount">{formatPrice(getCartTotal())}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Cart
