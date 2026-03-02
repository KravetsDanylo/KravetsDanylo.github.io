/**
 * SportClub - JavaScript для Лабораторної роботи №2
 * Реалізує:
 * - Фільтрацію товарів (приховування позначених як "Очікується")
 * - Логіку кошика (додавання товарів, зміна статусу кнопок)
 * - Розрахунок вартості замовлення
 */

// ============================================
// 1. ФІЛЬТРАЦІЯ ТОВАРІВ
// ============================================

/**
 * Функція фільтрує товари при завантаженні сторінки
 * Приховує товари з позначкою "Очікується" (out-of-stock)
 * Використовує цикл while для перебору
 */
function filterProducts() {
    // Знаходимо всі картки товарів у секції #products
    const productCards = document.querySelectorAll('#products .product-card');
    
    // Використовуємо цикл while для перебору
    let index = 0;
    while (index < productCards.length) {
        const card = productCards[index];
        // Перевіряємо, чи є позначка "Очікується"
        const availabilityElement = card.querySelector('.availability.out-of-stock');
        
        if (availabilityElement) {
            // Ховаємо картку товару, якщо він позначений як "Очікується"
            card.style.display = 'none';
        }
        index++;
    }
}

// ============================================
// 2. ЛОГІКА КОШИКА
// ============================================

// Масив для зберігання товарів у кошику
let cartItems = [];

/**
 * Обробник кліку на кнопку "В кошик"
 * - Змінює текст кнопки на "Товар у кошику"
 * - Робить кнопку неактивною
 * - Додає товар до кошика
 */
function handleAddToCart(event) {
    const button = event.target;
    
    // Перевіряємо, чи кнопка не є disabled
    if (button.disabled) {
        return;
    }
    
    // Отримуємо дані з картки товару
    const productCard = button.closest('.product-card');
    const productId = productCard.dataset.id;
    const productName = productCard.querySelector('h3').textContent;
    const priceText = productCard.querySelector('.price').textContent;
    // Перетворюємо ціну з рядка "3 500 грн" на число 3500
    const price = parseInt(priceText.replace(/\s/g, '').replace('грн', '').trim());
    
    // Змінюємо текст кнопки
    button.textContent = 'Товар у кошику';
    
    // Робимо кнопку неактивною
    button.disabled = true;
    
    // Додаємо товар до кошика
    addToCart(productId, productName, price);
}

/**
 * Додає товар до масиву кошика та оновлює відображення
 * @param {string} id - ID товару
 * @param {string} name - Назва товару
 * @param {number} price - Ціна товару
 */
function addToCart(id, name, price) {
    // Перевіряємо, чи товар вже є в кошику
    const existingItem = cartItems.find(item => item.id === id);
    
    if (existingItem) {
        // Якщо товар вже є, збільшуємо кількість
        existingItem.quantity++;
    } else {
        // Додаємо новий товар
        cartItems.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    // Оновлюємо відображення кошика
    renderCart();
    // Оновлюємо загальну суму
    updateTotalAmount();
}

/**
 * Відображає товари в кошику (секція #orders)
 * Використовує createElement, appendChild, textContent, innerHTML
 */
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    
    // Очищаємо поточний вміст
    cartItemsContainer.innerHTML = '';
    
    if (cartItems.length === 0) {
        // Кошик порожній
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Кошик порожній';
        emptyMessage.className = 'cart-empty';
        cartItemsContainer.appendChild(emptyMessage);
        return;
    }
    
    // Створюємо елементи для кожного товару
    let index = 0;
    while (index < cartItems.length) {
        const item = cartItems[index];
        const itemElement = createCartItemElement(item);
        cartItemsContainer.appendChild(itemElement);
        index++;
    }
}

/**
 * Створює DOM-елемент для товару в кошику
 * @param {Object} item - Об'єкт товару
 * @returns {HTMLElement} - DOM-елемент картки товару
 */
function createCartItemElement(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.dataset.id = item.id;
    
    // Інформація про товар
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
    
    // Кількість
    const quantityDiv = document.createElement('div');
    quantityDiv.className = 'cart-item-quantity';
    
    const label = document.createElement('label');
    label.textContent = 'К-сть:';
    label.htmlFor = `quantity-${item.id}`;
    
    const input = document.createElement('input');
    input.type = 'number';
    input.id = `quantity-${item.id}`;
    input.min = '1';
    input.value = item.quantity;
    
    // Додаємо обробник зміни кількості
    input.addEventListener('change', function() {
        updateQuantity(item.id, parseInt(this.value));
    });
    
    quantityDiv.appendChild(label);
    quantityDiv.appendChild(input);
    
    // Загальна вартість для товару
    const totalDiv = document.createElement('div');
    totalDiv.className = 'cart-item-total';
    const itemTotal = item.price * item.quantity;
    totalDiv.textContent = `${itemTotal} грн`;
    
    // Додаємо всі елементи до картки
    itemDiv.appendChild(infoDiv);
    itemDiv.appendChild(quantityDiv);
    itemDiv.appendChild(totalDiv);
    
    return itemDiv;
}

/**
 * Оновлює кількість товару в кошику
 * @param {string} id - ID товару
 * @param {number} newQuantity - Нова кількість
 */
function updateQuantity(id, newQuantity) {
    const item = cartItems.find(item => item.id === id);
    
    if (item) {
        if (newQuantity <= 0) {
            // Якщо кількість 0 або від'ємна, видаляємо товар
            removeFromCart(id);
        } else {
            item.quantity = newQuantity;
            // Оновлюємо відображення
            renderCart();
            updateTotalAmount();
        }
    }
}

/**
 * Видаляє товар з кошика
 * @param {string} id - ID товару
 */
function removeFromCart(id) {
    // Фільтруємо масив, залишаючи тільки товари з іншим ID
    cartItems = cartItems.filter(item => item.id !== id);
    
    // Знаходимо відповідну кнопку в продуктах і повертаємо її стан
    const productCard = document.querySelector(`.product-card[data-id="${id}"]`);
    if (productCard) {
        const button = productCard.querySelector('.btn');
        if (button) {
            button.textContent = 'В кошик';
            button.disabled = false;
        }
    }
    
    // Оновлюємо відображення
    renderCart();
    updateTotalAmount();
}

// ============================================
// 3. РОЗРАХУНОК ВАРТОСТІ
// ============================================

/**
 * Оновлює загальну суму замовлення
 * Обчислює суму всіх товарів з урахуванням кількості
 */
function updateTotalAmount() {
    const totalElement = document.getElementById('total-amount');
    let total = 0;
    
    // Обчислюємо загальну суму
    let index = 0;
    while (index < cartItems.length) {
        const item = cartItems[index];
        total += item.price * item.quantity;
        index++;
    }
    
    // Відображаємо суму
    totalElement.textContent = `${total} грн`;
}

// ============================================
// 4. ІНІЦІАЛІЗАЦІЯ
// ============================================

/**
 * Ініціалізація додатка
 * Викликається після завантаження DOM
 */
function init() {
    // Фільтруємо товари (приховуємо "Очікується")
    filterProducts();
    
    // Знаходимо всі кнопки "В кошик" і додаємо обробники
    const addToCartButtons = document.querySelectorAll('#products .btn:not(:disabled)');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
    
    // Початкове відображення кошика
    renderCart();
    updateTotalAmount();
}

// Запускаємо додаток після завантаження DOM
document.addEventListener('DOMContentLoaded', init);
