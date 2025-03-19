const products = [
    {
        id: 1,
        name: "Trail Explorer Hiking Boots",
        price: 129.99,
        image: "images/product1.jpg",
        category: "footwear",
        description: "Waterproof hiking boots with excellent ankle support and grip.",
        brand: "TrekMaster",
        isNew: true
    },
    {
        id: 2,
        name: "Lightweight Backpack 35L",
        price: 89.99,
        image: "images/product2.jpg",
        category: "gear",
        description: "Durable and lightweight backpack perfect for day hikes.",
        brand: "MountainLife",
        isNew: true
    },
    {
        id: 3,
        name: "3-Season Camping Tent",
        price: 199.99,
        image: "images/product3.jpg",
        category: "shelter",
        description: "Easy to set up tent that sleeps 2 people comfortably.",
        brand: "OutdoorElite",
        isNew: true
    },
    {
        id: 4,
        name: "Wilderness First Aid Kit",
        price: 45.99,
        image: "images/product4.jpg",
        category: "safety",
        description: "Comprehensive first aid kit for hiking emergencies.",
        brand: "SafeTrails",
        isNew: true
    },
    {
        id: 5,
        name: "Trekking Poles (Pair)",
        price: 59.99,
        image: "images/product5.jpg",
        category: "gear",
        description: "Adjustable aluminum trekking poles for stability on difficult terrain.",
        brand: "TrekMaster"
    },
    {
        id: 6,
        name: "Insulated Water Bottle 32oz",
        price: 24.99,
        image: "images/product6.jpg",
        category: "gear",
        description: "Keeps your drinks cold for 24 hours or hot for 12 hours.",
        brand: "HydroTrail"
    },
    {
        id: 7,
        name: "Trail Running Shoes",
        price: 119.99,
        image: "images/product7.jpg",
        category: "footwear",
        description: "Lightweight shoes with excellent traction for trail running.",
        brand: "SpeedTrail"
    },
    {
        id: 8,
        name: "Sleeping Bag 20°F",
        price: 129.99,
        image: "images/product8.jpg",
        category: "shelter",
        description: "Warm sleeping bag rated for temperatures down to 20°F.",
        brand: "DreamCamp"
    }
];

// Cart functionality
let cart = [];
let wishlist = [];

// Initialize cart from localStorage
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        console.error('Error loading cart from localStorage', e);
        cart = [];
    }
    
    // Update cart counter
    updateCartCount();
    
    // Add event listener for cart button
    document.getElementById('cart-button').addEventListener('click', openCart);
    
    // Close the modal if clicked outside of content
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('cart-modal');
        if (modal && event.target === modal) {
            closeCart();
        }
    });
});

// Function to add a product to the cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product) {
        // Check if product already exists in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            // Increase quantity if product already in cart
            existingItem.quantity += 1;
        } else {
            // Add new product to cart
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart counter
        updateCartCount();
        
        // Show notification
        showNotification(`${product.name} added to cart!`, 'success');
    }
}

// Function to add product to cart from detail page with quantity
function addToCartFromDetail(productId) {
    const quantity = parseInt(document.getElementById('quantity').value);
    const product = products.find(p => p.id === productId);
    
    if (product) {
        // Check if product already exists in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            // Increase quantity if product already in cart
            existingItem.quantity += quantity;
        } else {
            // Add new product to cart
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart counter
        updateCartCount();
        
        // Show notification
        showNotification(`${quantity} × ${product.name} added to cart!`, 'success');
    }
}

// Function to update cart counter
function updateCartCount() {
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartCounter.textContent = itemCount;
        
        // Make counter visible if items exist
        if (itemCount > 0) {
            cartCounter.style.display = 'flex';
        } else {
            cartCounter.style.display = 'none';
        }
    }
}

// Function to open cart modal
function openCart() {
    const cartModal = document.getElementById('cart-modal');
    if (!cartModal) return;
    
    displayCartItems();
    cartModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling while modal is open
}

// Function to close cart modal
function closeCart() {
    const cartModal = document.getElementById('cart-modal');
    if (!cartModal) return;
    
    cartModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Enable scrolling again
}

// Function to display cart items
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    
    const cartTotalElement = document.getElementById('cart-total');
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        cartTotalElement.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='images/product-placeholder.jpg'">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">×</button>
            <div class="item-total">$${itemTotal.toFixed(2)}</div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

// Function to update cart item quantity
function updateCartItemQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;
    
    cart[itemIndex].quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
}

// Function to remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
}

// Function to add product to wishlist
function addToWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Get existing wishlist from localStorage
    let wishlist = [];
    try {
        wishlist = JSON.parse(localStorage.getItem('hiking_wishlist')) || [];
    } catch (e) {
        console.error('Error loading wishlist from localStorage', e);
        wishlist = [];
    }
    
    // Check if product is already in wishlist
    const existingItem = wishlist.find(item => item.id === productId);
    
    if (!existingItem) {
        wishlist.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
        });
        
        // Save to localStorage
        localStorage.setItem('hiking_wishlist', JSON.stringify(wishlist));
        
        // Show notification
        showNotification(`${product.name} added to wishlist!`, 'success');
    } else {
        // Show notification
        showNotification(`${product.name} is already in your wishlist!`, 'info');
    }
}

// Function to proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Save cart to session for checkout page
    sessionStorage.setItem('checkout_cart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
}

// Function to show notifications
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.classList.add('notification');
        document.body.appendChild(notification);
    }
    
    // Add appropriate class based on type
    notification.className = 'notification';
    notification.classList.add(type);
    notification.textContent = message;
    
    // Show the notification
    notification.style.display = 'block';
    notification.style.opacity = '1';
    notification.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.classList.remove('show');
        setTimeout(() => {
            notification.style.display = 'none';
        }, 500);
    }, 3000);
}