// Cart module - handles shopping cart functionality
let cartItems = [];

export function handleAddToCart(event) {
  const button = event.target;

  if (button.disabled) {
    return;
  }

  const productCard = button.closest('.product-card');
  const productId = productCard.dataset.id;
  const productName = productCard.querySelector('h3').textContent;
  const priceText = productCard.querySelector('.price').textContent;
  const price = parseInt(priceText.replace(/\s/g, '').replace('грн', '').trim());

  button.textContent = 'Товар у кошику';
  button.disabled = true;

  addToCart(productId, productName, price);
}

export function addToCart(id, name, price) {
  const existingItem = cartItems.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({
      id: id,
      name: name,
      price: price,
      quantity: 1
    });
  }

  renderCart();
  updateTotalAmount();
}

export function renderCart() {
  const cartItemsContainer = document.getElementById('cart-items');

  cartItemsContainer.innerHTML = '';

  if (cartItems.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'Кошик порожній';
    emptyMessage.className = 'cart-empty';
    cartItemsContainer.appendChild(emptyMessage);
    return;
  }

  let index = 0;
  while (index < cartItems.length) {
    const item = cartItems[index];
    const itemElement = createCartItemElement(item);
    cartItemsContainer.appendChild(itemElement);
    index++;
  }
}

function createCartItemElement(item) {
  const itemDiv = document.createElement('div');
  itemDiv.className = 'cart-item';
  itemDiv.dataset.id = item.id;

  const infoDiv = document.createElement('div');
  infoDiv.className = 'cart-item-info';

  const nameElement = document.createElement('div');
  nameElement.className = 'cart-item-name';
  nameElement.textContent = item.name;

  const priceElement = document.createElement('div');
  priceElement.className = 'cart-item-price';
  priceElement.textContent = `${item.price} грн/од.`;

  infoDiv.appendChild(nameElement);
  infoDiv.appendChild(priceElement);

  const quantityDiv = document.createElement('div');
  quantityDiv.className = 'cart-item-quantity';

  const label = document.createElement('label');
  label.textContent = 'К-сть:';
  label.htmlFor = `quantity-${item.id}`;

  const input = document.createElement('input');
  input.type = 'number';
  input.id = `quantity-${item.id}`;
  input.min = '1';
  input.max = '10';
  input.value = item.quantity;

  input.addEventListener('change', function() {
    updateQuantity(item.id, parseInt(this.value));
  });

  quantityDiv.appendChild(label);
  quantityDiv.appendChild(input);

  const totalDiv = document.createElement('div');
  totalDiv.className = 'cart-item-total';
  const itemTotal = item.price * item.quantity;
  totalDiv.textContent = `${itemTotal} грн`;

  const removeBtnDiv = document.createElement('div');
  removeBtnDiv.className = 'cart-item-actions';

  const removeBtn = document.createElement('button');
  removeBtn.innerHTML = '🗑️';
  removeBtn.className = 'remove-item-btn';
  removeBtn.title = 'Видалити товар повністю';

  removeBtn.addEventListener('click', function() {
    removeFromCart(item.id);
  });

  removeBtnDiv.appendChild(removeBtn);

  itemDiv.appendChild(infoDiv);
  itemDiv.appendChild(quantityDiv);
  itemDiv.appendChild(totalDiv);
  itemDiv.appendChild(removeBtnDiv);

  return itemDiv;
}

export function updateQuantity(id, newQuantity) {
  const item = cartItems.find(item => item.id === id);

  if (item) {
    let showLimitMessage = false;

    if (isNaN(newQuantity) || newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    if (newQuantity > 10) {
      showLimitMessage = true;
      newQuantity = 10;
    }

    item.quantity = newQuantity;

    const itemElement = document.querySelector(`.cart-item[data-id="${id}"]`);
    if (itemElement) {
      const inputElement = itemElement.querySelector(`input[type="number"]`);
      if (inputElement && parseInt(inputElement.value) !== newQuantity) {
        inputElement.value = newQuantity;
      }

      const totalDiv = itemElement.querySelector('.cart-item-total');
      if (totalDiv) {
        totalDiv.textContent = `${item.price * newQuantity} грн`;
      }
    }

    updateTotalAmount();

    if (showLimitMessage) {
      displayQuantityError(id, `На складі залишилось лише 10 одиниць товару "${item.name}"!`);
    }
  }
}

function displayQuantityError(id, message) {
  const itemElement = document.querySelector(`.cart-item[data-id="${id}"]`);

  if (itemElement) {
    let errorMsg = itemElement.querySelector('.quantity-limit-msg');

    if (!errorMsg) {
      errorMsg = document.createElement('div');
      errorMsg.className = 'quantity-limit-msg';

      errorMsg.style.color = 'var(--danger)';
      errorMsg.style.fontSize = '0.85rem';
      errorMsg.style.fontWeight = 'bold';
      errorMsg.style.width = '100%';
      errorMsg.style.marginTop = '0.5rem';
      errorMsg.style.textAlign = 'right';

      itemElement.style.flexWrap = 'wrap';
      itemElement.appendChild(errorMsg);
    }

    errorMsg.textContent = message;

    setTimeout(() => {
      if (errorMsg && errorMsg.parentNode) {
        errorMsg.parentNode.removeChild(errorMsg);
      }
    }, 3500);
  }
}

export function removeFromCart(id) {
  cartItems = cartItems.filter(item => item.id !== id);

  const productCard = document.querySelector(`.product-card[data-id="${id}"]`);
  if (productCard) {
    const button = productCard.querySelector('.btn');
    if (button) {
      button.textContent = 'В кошик';
      button.disabled = false;
    }
  }

  renderCart();
  updateTotalAmount();
}

export function updateTotalAmount() {
  const totalElement = document.getElementById('total-amount');
  let total = 0;

  let index = 0;
  while (index < cartItems.length) {
    const item = cartItems[index];
    total += item.price * item.quantity;
    index++;
  }

  totalElement.textContent = `${total} грн`;
}

export function initCart() {
  renderCart();
  updateTotalAmount();
}

export function getCartItems() {
  return cartItems;
}
