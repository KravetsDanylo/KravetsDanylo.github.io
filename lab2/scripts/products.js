// Products module - handles product filtering and display

export function filterProducts() {
  const productCards = document.querySelectorAll('#products .product-card');

  let index = 0;
  while (index < productCards.length) {
    const card = productCards[index];
    const availabilityElement = card.querySelector('.availability.out-of-stock');

    if (availabilityElement) {
      card.style.display = 'none';
    }
    index++;
  }
}

export function initProducts() {
  filterProducts();
}
