document.addEventListener('DOMContentLoaded', function() {
   
    updateCartCounter();
    
    // Load wishlist items
    loadWishlistItems();
});

// Function to load wishlist items into the grid
function loadWishlistItems() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistItems = document.getElementById('wishlist-items');
    const wishlistContent = document.getElementById('wishlist-content');
    const emptyWishlist = document.getElementById('empty-wishlist');
    
    if (wishlist.length === 0) {
        wishlistContent.style.display = 'none';
        emptyWishlist.style.display = 'block';
        return;
    }
    
    wishlistContent.style.display = 'block';
    emptyWishlist.style.display = 'none';
    
    // Clear existing items
    wishlistItems.innerHTML = '';
    
    // Populate wishlist items
    wishlist.forEach(item => {
        const wishlistItem = document.createElement('div');
        wishlistItem.classList.add('wishlist-item');
        wishlistItem.innerHTML = `
            <button onclick="removeFromWishlist(${item.id})" class="wishlist-remove">&times;</button>
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p class="price">$${item.price.toFixed(2)}</p>
            <p class="description">${item.description || 'No description available'}</p>
            <div class="wishlist-actions">
                <button onclick="moveToCart(${item.id})" class="submit-btn">Add to Cart</button>
            </div>
        `;
        
        wishlistItems.appendChild(wishlistItem);
    });
}

// Function to remove an item from the wishlist
function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Find the product to get its name for the notification
    const product = wishlist.find(item => item.id === productId);
    const productName = product ? product.name : 'Item';
    
    // Remove the item
    wishlist = wishlist.filter(item => item.id !== productId);
    
    // Update localStorage and refresh display
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    loadWishlistItems();
    
    showNotification(`Removed ${productName} from wishlist`, 'info');
}

// Function to move an item from wishlist to cart
function moveToCart(productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const product = wishlist.find(item => item.id === productId);
    
    if (product) {
        // Add to cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({...product, quantity: 1});
        }
        
        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Remove from wishlist
        removeFromWishlist(productId);
        
        // Update UI
        updateCartCounter();
        
        showNotification(`${product.name} added to cart`, 'success');
    }
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
