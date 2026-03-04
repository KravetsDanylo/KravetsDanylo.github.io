

// ============================================
// 1. ФІЛЬТРАЦІЯ ТОВАРІВ
// ============================================

function filterProducts() {
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

// ============================================
// 2. ЛОГІКА КОШИКА
// ============================================


let cartItems = [];

function handleAddToCart(event) {
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

function addToCart(id, name, price) {

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

function renderCart() {
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
function updateQuantity(id, newQuantity) {
    const item = cartItems.find(item => item.id === id);
    
    if (item) {
        let showLimitMessage = false;

        // Захист від пустих інпутів або NaN
        if (isNaN(newQuantity) || newQuantity <= 0) {
            removeFromCart(id);
            return;
        }

        if (newQuantity > 10) {
            showLimitMessage = true;
            newQuantity = 10; 
        }

        item.quantity = newQuantity;
        
        // ЛОКАЛЬНЕ ОНОВЛЕННЯ DOM (щоб не втрачався фокус і не зникали повідомлення)
        const itemElement = document.querySelector(`.cart-item[data-id="${id}"]`);
        if (itemElement) {
            // Оновлюємо інпут, якщо він відрізняється
            const inputElement = itemElement.querySelector(`input[type="number"]`);
            if (inputElement && parseInt(inputElement.value) !== newQuantity) {
                inputElement.value = newQuantity;
            }
            
            // Оновлюємо загальну суму товару
            const totalDiv = itemElement.querySelector('.cart-item-total');
            if (totalDiv) {
                totalDiv.textContent = `${item.price * newQuantity} грн`;
            }
        }
        
        updateTotalAmount();
        
        // Виводимо повідомлення, якщо ліміт перевищено
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
            errorMsg.style.textAlign = 'right'; // Вирівнювання по правому краю
            
            itemElement.style.flexWrap = 'wrap'; 
            itemElement.appendChild(errorMsg);
        }
        
        errorMsg.textContent = message;

        // Автоматично прибираємо повідомлення через 3.5 секунди
        setTimeout(() => {
            if (errorMsg && errorMsg.parentNode) {
                errorMsg.parentNode.removeChild(errorMsg);
            }
        }, 3500);
    }
}
function removeFromCart(id) {

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

// ============================================
// 3. РОЗРАХУНОК ВАРТОСТІ
// ============================================

function updateTotalAmount() {
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
function highlightEvenProducts() {
    const titles = document.querySelectorAll('.product-card h3');
    

    for (let i = 0; i < titles.length; i++) {
        if (i % 2 === 0) {

            titles[i].style.color = 'var(--primary-color)'; // Робимо синім

            if (!titles[i].textContent.includes('[Sale]')) {
                titles[i].textContent = '[Sale] ' + titles[i].textContent;
            }
        } else {

            titles[i].style.color = 'var(--text-dark)';
        }
    }
}

function setupEventHandlers() {

    const toggleBtn = document.getElementById('toggle-mission-btn');
    const missionParagraphs = document.querySelectorAll('.company-desc p');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {

            for (let i = 0; i < missionParagraphs.length; i++) {
                const p = missionParagraphs[i];

                if (p.style.display === 'none') {
                    p.style.display = 'block';
                } else {
                    p.style.display = 'none';
                }
            }
        });
    }


    const navLinks = document.querySelectorAll('.main-nav a');
    for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener('click', function() {
            console.log('Ви клікнули на пункт меню: ' + this.textContent);
        });
    }


    const productCards = document.querySelectorAll('.product-card');
    for (let i = 0; i < productCards.length; i++) {
        productCards[i].addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f0f9ff'; // Світло-блакитний фон при наведенні
            this.style.transform = 'translateY(-10px) scale(1.02)'; // Посилюємо анімацію
        });
        
        productCards[i].addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'white'; // Повертаємо оригінальний фон
            this.style.transform = ''; // Зкидаємо transform для спрацювання CSS-правил
        });
    }
}

function setupReviewForm() {
    const form = document.getElementById('review-form');
    const nameInput = document.getElementById('reviewer-name');
    const textInput = document.getElementById('review-text');
    const errorMsg = document.getElementById('review-error');
    const reviewsContainer = document.getElementById('reviews-container');

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Запобігаємо перезавантаженню сторінки

            const nameValue = nameInput.value.trim();
            const textValue = textInput.value.trim();


            if (nameValue === '' || textValue === '') {

                errorMsg.style.display = 'block';
            } else {

                errorMsg.style.display = 'none';

                
                const reviewCard = document.createElement('div');
                reviewCard.className = 'review-item'; 
                
                reviewCard.style.padding = '1.5rem';
                reviewCard.style.backgroundColor = 'white';
                reviewCard.style.borderRadius = '8px';
                reviewCard.style.boxShadow = 'var(--card-shadow)';
                reviewCard.style.borderLeft = '4px solid var(--success)';

                const authorHeader = document.createElement('h4');
                authorHeader.textContent = nameValue;
                authorHeader.style.marginBottom = '0.5rem';

                const reviewParagraph = document.createElement('p');
                reviewParagraph.textContent = textValue;
                reviewParagraph.style.color = 'var(--text-light)';


                reviewCard.appendChild(authorHeader);
                reviewCard.appendChild(reviewParagraph);


                reviewsContainer.prepend(reviewCard);


                form.reset();
            }
        });
    }
}


function init() {

    filterProducts();
    

    const addToCartButtons = document.querySelectorAll('#products .btn:not(:disabled)');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
    

    renderCart();
    updateTotalAmount();

    highlightEvenProducts(); 
    setupEventHandlers();    
    setupReviewForm();       
}


document.addEventListener('DOMContentLoaded', init);