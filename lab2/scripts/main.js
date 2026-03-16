// Main entry point - imports and initializes all modules
import { initProducts } from './products.js';
import { initCart, handleAddToCart } from './cart.js';
import { initUI } from './ui.js';

function init() {
  // Initialize product filtering
  initProducts();

  // Setup cart event listeners
  const addToCartButtons = document.querySelectorAll('#products .btn:not(:disabled)');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', handleAddToCart);
  });

  // Initialize cart
  initCart();

  // Initialize UI effects
  initUI();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
