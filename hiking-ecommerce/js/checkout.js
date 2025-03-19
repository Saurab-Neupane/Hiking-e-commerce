document.addEventListener('DOMContentLoaded', function() {
    // Retrieve cart from local storage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    
    // Update cart counter
    updateCartCounter();
    
    // Display cart items in checkout
    let subtotal = 0;
    let shippingCost = 0;
    if (cart.length === 0) {
        checkoutItems.innerHTML = '<p>Your cart is empty. <a href="index.html">Continue shopping</a></p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const checkoutItem = document.createElement('div');
            checkoutItem.classList.add('checkout-item');
            checkoutItem.innerHTML = `
                <div>${item.name} × ${item.quantity}</div>
                <div>$${itemTotal.toFixed(2)}</div>
            `;
            checkoutItems.appendChild(checkoutItem);
        });
    }
    
    updateTotals(subtotal, shippingCost);
    
    // Input validation for card fields
    document.getElementById('card-number')?.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let newVal = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                newVal += ' ';
            }
            newVal += value[i];
        }
        e.target.value = newVal.substring(0, 19);
    });

    document.getElementById('expiry')?.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value.substring(0, 5);
    });

    document.getElementById('cvv')?.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '').substring(0, 3);
    });
});

// Global variables for checkout process
let selectedShipping = { method: 'standard', cost: 5.99 };
let selectedPayment = 'credit';
let currentStep = 1;

// Navigation functions
function nextStep(step) {
    // Validate current step before proceeding
    if (!validateCurrentStep()) {
        return false;
    }
    
    // Hide current step and show next step
    document.querySelectorAll('.step-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.checkout-step').forEach(step => step.classList.remove('active'));
    
    document.getElementById(`step${step}`).classList.add('active');
    document.getElementById(`step${step}-indicator`).classList.add('active');
    
    currentStep = step;
    
    // Additional step-specific actions
    if (step === 4) {
        populateReviewPage();
    }
    
    // Scroll to top of the checkout container
    document.querySelector('.checkout-container').scrollIntoView({ behavior: 'smooth' });
    
    return true;
}

function prevStep(step) {
    document.querySelectorAll('.step-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.checkout-step').forEach(step => step.classList.remove('active'));
    
    document.getElementById(`step${step}`).classList.add('active');
    document.getElementById(`step${step}-indicator`).classList.add('active');
    
    currentStep = step;
}

function validateCurrentStep() {
    let valid = true;
    
    if (currentStep === 1) {
        // Validate shipping information
        const requiredFields = ['fullname', 'email', 'phone', 'address', 'city', 'state', 'zip', 'country'];
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (!input.value.trim()) {
                markInvalid(input);
                valid = false;
            } else {
                markValid(input);
            }
        });
        
        // Email validation
        const email = document.getElementById('email');
        if (email.value && !validateEmail(email.value)) {
            markInvalid(email);
            showNotification('Please enter a valid email address', 'error');
            valid = false;
        }
    }
    
    if (currentStep === 2) {
        // Validate shipping selection
        if (!selectedShipping.method) {
            showNotification('Please select a shipping method', 'error');
            valid = false;
        }
    }
    
    if (currentStep === 3) {
        // Validate payment information based on selected method
        if (selectedPayment === 'credit') {
            const paymentFields = ['card-number', 'card-name', 'expiry', 'cvv'];
            paymentFields.forEach(field => {
                const input = document.getElementById(field);
                if (!input.value.trim()) {
                    markInvalid(input);
                    valid = false;
                } else {
                    markValid(input);
                }
            });
            
            // Card number validation (simple check for length)
            const cardNum = document.getElementById('card-number').value.replace(/\s/g, '');
            if (cardNum.length < 16) {
                markInvalid(document.getElementById('card-number'));
                valid = false;
            }
        }
    }
    
    if (!valid) {
        showNotification('Please fill in all required fields correctly', 'error');
    }
    
    return valid;
}

function markInvalid(input) {
    input.style.borderColor = '#e74c3c';
}

function markValid(input) {
    input.style.borderColor = '';
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Shipping selection
function selectShipping(element, method) {
    // Visual selection
    document.querySelectorAll('.shipping-option').forEach(option => {
        option.classList.remove('selected');
    });
    element.classList.add('selected');
    
    // Set shipping data
    switch(method) {
        case 'express':
            selectedShipping = { method: 'express', cost: 12.99, name: 'Express Shipping (2-3 Business Days)' };
            break;
        case 'nextday':
            selectedShipping = { method: 'nextday', cost: 24.99, name: 'Next Day Delivery' };
            break;
        default:
            selectedShipping = { method: 'standard', cost: 5.99, name: 'Standard Shipping (5-7 Business Days)' };
    }
    
    updateTotals();
}

// Payment method selection
function selectPayment(element, method) {
    // Visual selection
    document.querySelectorAll('.payment-method').forEach(option => {
        option.classList.remove('selected');
    });
    element.classList.add('selected');
    
    // Hide all payment detail sections
    document.querySelectorAll('.payment-details').forEach(details => {
        details.style.display = 'none';
    });
    
    // Show selected payment details
    document.getElementById(`${method}-payment`).style.display = 'block';
    
    // Update selected payment method
    selectedPayment = method;
}

// Update order totals
function updateTotals(subtotal = null, shipping = null) {
    // If values not passed, use current values
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (subtotal === null) {
        subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    if (shipping === null) {
        shipping = selectedShipping.cost;
    }
    
    // Update DOM
    const total = subtotal + shipping;
    document.getElementById('shipping-amount').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('checkout-total').textContent = `$${total.toFixed(2)}`;
}

// Populate review page with order information
function populateReviewPage() {
    // Address summary
    const addressFields = ['fullname', 'address', 'city', 'state', 'zip', 'country'];
    const addressValues = addressFields.map(field => document.getElementById(field).value);
    document.getElementById('review-address').innerHTML = addressValues.join('<br>');
    
    // Shipping method summary
    document.getElementById('review-shipping').innerHTML = `
        <p>${selectedShipping.name}</p>
        <p>$${selectedShipping.cost.toFixed(2)}</p>
    `;
    
    // Payment method summary
    let paymentDetails = '';
    if (selectedPayment === 'credit') {
        const cardNumber = document.getElementById('card-number').value;
        const lastFour = cardNumber.slice(-4);
        paymentDetails = `Credit Card ending in ${lastFour}`;
    } else if (selectedPayment === 'paypal') {
        paymentDetails = 'PayPal';
    } else {
        paymentDetails = 'Apple Pay';
    }
    document.getElementById('review-payment').innerHTML = `<p>${paymentDetails}</p>`;
    
    // Update totals
    updateTotals();
}

// Place order function
function placeOrder() {
    if (!validateCurrentStep()) {
        return;
    }
    
    // Show loading state
    const orderButton = document.getElementById('place-order');
    const originalText = orderButton.textContent;
    orderButton.textContent = 'Processing...';
    orderButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Generate order information
        const orderNumber = 'ORD-' + Date.now().toString().slice(-8);
        const email = document.getElementById('email').value;
        
        // Store order in local storage for tracking
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const orderTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0) + selectedShipping.cost;
        
        const orderDetails = {
            orderNumber,
            date: new Date().toISOString(),
            items: cart,
            shipping: selectedShipping,
            payment: selectedPayment,
            status: 'Processing',
            email: email,
            address: {
                name: document.getElementById('fullname').value,
                street: document.getElementById('address').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zip: document.getElementById('zip').value,
                country: document.getElementById('country').value
            },
            total: orderTotal,
            statusHistory: [
                {
                    status: 'Order Placed',
                    date: new Date().toISOString(),
                    description: 'Your order has been received and is being processed.'
                }
            ],
            estimatedDelivery: getEstimatedDelivery(selectedShipping.method)
        };
        
        // Save to order history
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(orderDetails);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Clear cart
        localStorage.removeItem('cart');
        
        // Show confirmation
        document.querySelectorAll('.step-content').forEach(content => content.classList.remove('active'));
        document.getElementById('order-confirmation').style.display = 'block';
        document.getElementById('order-number').textContent = orderNumber;
        document.getElementById('confirmation-email').textContent = email;
        
        // Reset button state
        orderButton.textContent = originalText;
        orderButton.disabled = false;
        
    }, 2000); // Simulate 2 second processing time
}

// Calculate estimated delivery date
function getEstimatedDelivery(shippingMethod) {
    const today = new Date();
    let days;
    
    switch(shippingMethod) {
        case 'nextday':
            days = 1;
            break;
        case 'express':
            days = 3;
            break;
        default:
            days = 7;
    }
    
    // Skip weekends
    let businessDays = 0;
    let currentDate = new Date(today);
    
    while (businessDays < days) {
        currentDate.setDate(currentDate.getDate() + 1);
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            businessDays++;
        }
    }
    
    return currentDate.toISOString();
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
