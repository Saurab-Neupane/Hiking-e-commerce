document.addEventListener('DOMContentLoaded', function() {
    // Load cart items from sessionStorage
    const cartItems = JSON.parse(sessionStorage.getItem('cartItems') || '[]');
    const cartTotal = sessionStorage.getItem('cartTotal') || '$0';
    
    displayOrderSummary(cartItems, cartTotal);
    initializeStripe();
});

function displayOrderSummary(cartItems, cartTotal) {
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    
    // Clear existing content
    checkoutItems.innerHTML = '';
    
    // Check if cart is empty
    if (!cartItems || cartItems.length === 0) {
        checkoutItems.innerHTML = '<p>Your cart is empty</p>';
        checkoutTotal.textContent = '$0';
        document.getElementById('submit-payment').disabled = true;
        return;
    }
    
    // Display each cart item
    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-summary-item';
        itemElement.innerHTML = `
            <span>${item.name} × ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        checkoutItems.appendChild(itemElement);
    });
    
    // Display total
    checkoutTotal.textContent = cartTotal;
}

function initializeStripe() {
    // Replace with your Stripe publishable key
    const stripe = Stripe('pk_test_yourPublishableKey');
    const elements = stripe.elements();
    
    // Create card element
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');
    
    // Handle form submission
    const form = document.getElementById('submit-payment');
    const cardErrors = document.getElementById('card-errors');
    
    form.addEventListener('click', async function(event) {
        event.preventDefault();
        
        // Disable the submit button to prevent repeated clicks
        form.disabled = true;
        form.textContent = 'Processing...';
        
        // Validate form fields
        const requiredFields = ['email', 'phone', 'fullname', 'address', 'city', 'state', 'zip', 'country'];
        let isFormValid = true;
        
        for (const fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                isFormValid = false;
                field.style.borderColor = 'red';
            } else {
                field.style.borderColor = '#ddd';
            }
        }
        
        if (!isFormValid) {
            cardErrors.textContent = 'Please fill in all required fields.';
            form.disabled = false;
            form.textContent = 'Pay Now';
            return;
        }
        
        try {
            // In a real application, you would:
            // 1. Create a payment intent on your server
            // 2. Confirm the payment with Stripe.js
            
            // For demonstration purposes, we'll simulate a successful payment
            setTimeout(() => {
                // Simulate payment processing
                const success = Math.random() > 0.2; // 80% success rate for demo
                
                if (success) {
                    alert('Payment successful! Thank you for your order.');
                    // Clear the cart
                    sessionStorage.removeItem('cartItems');
                    sessionStorage.removeItem('cartTotal');
                    // Redirect to order confirmation page
                    window.location.href = 'order-confirmation.html';
                } else {
                    cardErrors.textContent = 'Payment failed. Please try again.';
                    form.disabled = false;
                    form.textContent = 'Pay Now';
                }
            }, 2000);
            
            // In a real implementation, you would use:
            /*
            const { error, paymentIntent } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: document.getElementById('fullname').value,
                            email: document.getElementById('email').value
                        }
                    }
                }
            );
            
            if (error) {
                cardErrors.textContent = error.message;
                form.disabled = false;
                form.textContent = 'Pay Now';
            } else if (paymentIntent.status === 'succeeded') {
                // Payment is successful
                window.location.href = 'order-confirmation.html';
            }
            */
            
        } catch (error) {
            cardErrors.textContent = error.message;
            form.disabled = false;
            form.textContent = 'Pay Now';
        }
    });
    
    // Handle real-time validation errors
    cardElement.addEventListener('change', function(event) {
        if (event.error) {
            cardErrors.textContent = event.error.message;
        } else {
            cardErrors.textContent = '';
        }
    });
}
