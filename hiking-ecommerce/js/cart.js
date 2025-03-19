document.addEventListener('DOMContentLoaded', function() {
    // Update cart counter
    updateCartCounter();
    
    // Load cart items
    loadCartItems();
    
    // Load product suggestions
    loadProductSuggestions();
});

// Function to load cart items into the table
function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsTable = document.getElementById('cart-items-table');
    const summaryItems = document.getElementById('summary-items');
    const cartContent = document.getElementById('cart-content');
    const emptyCart = document.getElementById('empty-cart');
    
    if (cart.length === 0) {
        cartContent.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }
    
    cartContent.style.display = 'block';
    emptyCart.style.display = 'none';
    
    // Clear existing items
    cartItemsTable.innerHTML = '';
    summaryItems.innerHTML = '';
    
    let cartTotal = 0;
    
    // Populate cart items
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        cartTotal += itemTotal;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div>
                        <h3>${item.name}</h3>
                        <p class="item-sku">SKU: HIKE-${item.id.toString().padStart(4, '0')}</p>
                    </div>
                </div>
            </td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <div class="item-quantity">
                    <button class="quantity-btn" onclick="updateItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="number" min="1" value="${item.quantity}" id="qty-${item.id}" class="quantity-input">
                    <button class="quantity-btn" onclick="updateItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </td>
            <td>$${itemTotal.toFixed(2)}</td>
            <td>
                <button onclick="removeCartItem(${item.id})" class="remove-item">&times;</button>
            </td>
        `;
        
        cartItemsTable.appendChild(row);
        
        // Add to summary
        const summaryItem = document.createElement('div');
        summaryItem.style.display = 'flex';
        summaryItem.style.justifyContent = 'space-between';
        summaryItem.style.marginBottom = '10px';
        summaryItem.innerHTML = `
            <span>${item.name} × ${item.quantity}</span>
            <span>$${itemTotal.toFixed(2)}</span>
        `;
        
        summaryItems.appendChild(summaryItem);
    });
    
    // Update cart total
    document.getElementById('cart-total-amount').textContent = `$${cartTotal.toFixed(2)}`;
}

// Function to remove an item from the cart
function removeCartItem(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Find the product to get its name for the notification
    const product = cart.find(item => item.id === productId);
    const productName = product ? product.name : 'Item';
    
    // Remove the item
    cart = cart.filter(item => item.id !== productId);
    
    // Update localStorage and refresh display
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    loadCartItems();
    
    showNotification(`Removed ${productName} from cart`, 'info');
}

// Function to update an item's quantity
function updateItemQuantity(productId, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (newQuantity <= 0) {
        removeCartItem(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        
        // Update input field value for real-time feedback
        const qtyInput = document.getElementById(`qty-${productId}`);
        if (qtyInput) {
            qtyInput.value = newQuantity;
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter();
        loadCartItems();
    }
}

// Function to update all quantities from input fields
function updateAllQuantities() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let updated = false;
    
    cart.forEach(item => {
        const qtyInput = document.getElementById(`qty-${item.id}`);
        if (qtyInput) {
            const newQty = parseInt(qtyInput.value);
            if (newQty > 0 && newQty !== item.quantity) {
                item.quantity = newQty;
                updated = true;
            }
        }
    });
    
    if (updated) {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter();
        loadCartItems();
        showNotification('Cart updated successfully', 'success');
    }
}

// Function to clear the entire cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.setItem('cart', JSON.stringify([]));
        updateCartCounter();
        loadCartItems();
        showNotification('Cart has been cleared', 'info');
    }
}

// Function to load product suggestions based on cart items or popular products
function loadProductSuggestions() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const suggestionsContainer = document.getElementById('product-suggestions');
    
    // Get all products
    let suggestions = [];
    
    if (cart.length > 0) {
        // Filter out products that are already in cart
        const cartIds = cart.map(item => item.id);
        suggestions = products.filter(product => !cartIds.includes(product.id));
    } else {
        // If cart is empty, show some popular items
        suggestions = products.slice(0, 4);
    }
    
    // Randomize and limit to 4
    suggestions = suggestions.sort(() => 0.5 - Math.random()).slice(0, 4);
    
    suggestionsContainer.innerHTML = '';
    
    suggestions.forEach(product => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">$${product.price}</p>
            <button onclick="addToCartFromSuggestion(${product.id})" class="submit-btn">Add to Cart</button>
        `;
        
        suggestionsContainer.appendChild(suggestionItem);
    });
}

// Function to add a product from suggestions to cart
function addToCartFromSuggestion(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({...product, quantity: 1});
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter();
        loadCartItems();
        loadProductSuggestions(); // Refresh suggestions
        
        showNotification(`Added ${product.name} to cart`, 'success');
    }
}

// Show notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.classList.add('cart-notification');
    if (type === 'error') {
        notification.style.backgroundColor = '#e74c3c';
    } else if (type === 'info') {
        notification.style.backgroundColor = '#3498db';
    }
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 2000);
    }, 10);
}

// Update cart counter function
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartCounter.textContent = itemCount;
        cartCounter.style.display = itemCount ? 'block' : 'none';
    }
}
