document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in (demo)
    let isLoggedIn = localStorage.getItem('isLoggedIn') || false;
    
    // For demo purposes, auto-login the user
    if (!isLoggedIn) {
        // Create demo user data
        const demoUser = {
            name: 'John Smith',
            email: 'john@example.com',
            phone: '555-123-4567',
            addresses: [
                {
                    id: 'addr-' + Date.now(),
                    name: 'John Smith',
                    street: '123 Main Street',
                    city: 'Seattle',
                    state: 'WA',
                    zip: '98101',
                    country: 'US',
                    phone: '555-123-4567',
                    isDefault: true
                }
            ]
        };
        
        localStorage.setItem('userData', JSON.stringify(demoUser));
        localStorage.setItem('isLoggedIn', 'true');
    }
    
    // Update cart counter
    updateCartCounter();
    
    // Load user data
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    // Tab navigation
    const tabs = document.querySelectorAll('.account-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Update active tab
            document.querySelectorAll('.account-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected tab content
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.getElementById(`${tabName}-tab`).classList.add('active');
            
            // Update URL hash
            window.location.hash = tabName;
        });
    });
    
    // Check if hash exists in URL and activate corresponding tab
    if (window.location.hash) {
        const hash = window.location.hash.substring(1); // Remove the # symbol
        const tab = document.querySelector(`.account-tab[data-tab="${hash}"]`);
        if (tab) {
            tab.click();
        }
    }
    
    // Populate profile data
    function populateProfileData() {
        if (userData) {
            document.getElementById('profile-name').value = userData.name || '';
            document.getElementById('profile-email').value = userData.email || '';
            document.getElementById('profile-phone').value = userData.phone || '';
        }
    }
    
    // Handle profile form submission
    document.getElementById('profile-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const updatedUser = {
            ...userData,
            name: document.getElementById('profile-name').value,
            email: document.getElementById('profile-email').value,
            phone: document.getElementById('profile-phone').value
        };
        
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        showNotification('Profile updated successfully', 'success');
    });
    
    // Handle password form submission
    document.getElementById('password-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Simple validation for demo
        if (!currentPassword || !newPassword || !confirmPassword) {
            showNotification('Please fill in all password fields', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showNotification('New passwords do not match', 'error');
            return;
        }
        
        // In a real app, you would verify the current password against stored password hash
        
        showNotification('Password changed successfully', 'success');
        this.reset();
    });
    
    // Populate orders data
    function loadOrders() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const ordersTableBody = document.getElementById('orders-table-body');
        const noOrders = document.getElementById('no-orders');
        
        if (orders.length === 0) {
            ordersTableBody.innerHTML = '';
            noOrders.style.display = 'block';
            return;
        }
        
        noOrders.style.display = 'none';
        ordersTableBody.innerHTML = '';
        
        orders.forEach(order => {
            const orderDate = new Date(order.date).toLocaleDateString();
            const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.orderNumber}</td>
                <td>${orderDate}</td>
                <td>${itemCount} item(s)</td>
                <td>$${order.total.toFixed(2)}</td>
                <td><span class="order-status status-${order.status.toLowerCase()}">${order.status}</span></td>
                <td><a href="track.html?order=${order.orderNumber}" class="btn">Track Order</a></td>
            `;
            
            ordersTableBody.appendChild(row);
        });
    }
    
    // Populate addresses
    function loadAddresses() {
        const addresses = userData?.addresses || [];
        const addressList = document.getElementById('address-list');
        const noAddresses = document.getElementById('no-addresses');
        
        if (addresses.length === 0) {
            addressList.innerHTML = '';
            noAddresses.style.display = 'block';
            return;
        }
        
        noAddresses.style.display = 'none';
        addressList.innerHTML = '';
        
        addresses.forEach(address => {
            const addressCard = document.createElement('div');
            addressCard.classList.add('address-card');
            addressCard.innerHTML = `
                <div class="address-actions">
                    <button onclick="editAddress('${address.id}')" class="btn">Edit</button>
                    <button onclick="removeAddress('${address.id}')" class="btn">Remove</button>
                </div>
                <p><strong>${address.name}</strong></p>
                <p>${address.street}</p>
                <p>${address.city}, ${address.state} ${address.zip}</p>
                <p>${address.country}</p>
                <p>Phone: ${address.phone}</p>
                ${address.isDefault ? '<p class="address-default">Default Address</p>' : ''}
            `;
            
            addressList.appendChild(addressCard);
        });
    }
    
    // Populate wishlist
    function loadWishlist() {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const wishlistItems = document.getElementById('wishlist-items');
        const noWishlist = document.getElementById('no-wishlist');
        
        if (wishlist.length === 0) {
            wishlistItems.innerHTML = '';
            noWishlist.style.display = 'block';
            return;
        }
        
        noWishlist.style.display = 'none';
        wishlistItems.innerHTML = '';
        
        wishlist.forEach(item => {
            const wishlistItem = document.createElement('div');
            wishlistItem.classList.add('wishlist-item');
            wishlistItem.innerHTML = `
                <button class="wishlist-remove" onclick="removeFromWishlist(${item.id})">×</button>
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p class="price">$${item.price}</p>
                <div class="wishlist-actions">
                    <button onclick="moveToCart(${item.id})" class="submit-btn">Add to Cart</button>
                </div>
            `;
            
            wishlistItems.appendChild(wishlistItem);
        });
    }
    
    // Initial function calls
    populateProfileData();
    loadOrders();
    loadAddresses();
    loadWishlist();
});

// Address form functions
function showAddAddressForm() {
    document.getElementById('address-form-container').style.display = 'block';
    document.getElementById('address-form').reset();
}

function hideAddressForm() {
    document.getElementById('address-form-container').style.display = 'none';
}

// Handle address form submission
document.getElementById('address-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const addresses = userData.addresses || [];
    
    // Create new address object
    const newAddress = {
        id: 'addr-' + Date.now(),
        name: document.getElementById('address-name').value,
        street: document.getElementById('address-street').value,
        city: document.getElementById('address-city').value,
        state: document.getElementById('address-state').value,
        zip: document.getElementById('address-zip').value,
        country: document.getElementById('address-country').value,
        phone: document.getElementById('address-phone').value,
        isDefault: document.getElementById('address-default').checked
    };
    
    // If this is set as default, unset other defaults
    if (newAddress.isDefault) {
        addresses.forEach(addr => addr.isDefault = false);
    }
    
    addresses.push(newAddress);
    userData.addresses = addresses;
    
    localStorage.setItem('userData', JSON.stringify(userData));
    
    hideAddressForm();
    showNotification('Address added successfully', 'success');
    
    // Reload addresses
    loadAddresses();
});

// Edit address function
function editAddress(addressId) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const address = userData.addresses.find(a => a.id === addressId);
    
    if (address) {
        document.getElementById('address-name').value = address.name;
        document.getElementById('address-street').value = address.street;
        document.getElementById('address-city').value = address.city;
        document.getElementById('address-state').value = address.state;
        document.getElementById('address-zip').value = address.zip;
        document.getElementById('address-country').value = address.country;
        document.getElementById('address-phone').value = address.phone;
        document.getElementById('address-default').checked = address.isDefault;
        
        // Store the address ID for update
        document.getElementById('address-form').dataset.addressId = addressId;
        
        showAddAddressForm();
    }
}

// Remove address function
function removeAddress(addressId) {
    if (confirm('Are you sure you want to remove this address?')) {
        const userData = JSON.parse(localStorage.getItem('userData'));
        userData.addresses = userData.addresses.filter(a => a.id !== addressId);
        
        localStorage.setItem('userData', JSON.stringify(userData));
        showNotification('Address removed successfully', 'success');
        
        // Reload addresses
        loadAddresses();
    }
}

// Wishlist functions
function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(item => item.id !== productId);
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    showNotification('Item removed from wishlist', 'info');
    
    loadWishlist();
}

function moveToCart(productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const product = wishlist.find(p => p.id === productId);
    
    if (product) {
        // Add to cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({...product, quantity: 1});
        }
        
        // Remove from wishlist
        removeFromWishlist(productId);
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter();
        
        showNotification(`${product.name} added to cart`, 'success');
    }
}

function logout() {
    if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'index.html';
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

// Helper function for cart counter
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartCounter.textContent = itemCount;
        cartCounter.style.display = itemCount ? 'block' : 'none';
    }
}
