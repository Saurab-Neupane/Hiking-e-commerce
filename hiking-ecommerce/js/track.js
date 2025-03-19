document.addEventListener('DOMContentLoaded', function() {
    const trackingForm = document.querySelector('.tracking-form');
    const trackingDetails = document.getElementById('tracking-details');
    const noTrackingInfo = document.getElementById('no-tracking-info');
    
    // Update cart counter
    updateCartCounter();
    
    // Load any pre-filled order number from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const orderNumberParam = urlParams.get('order');
    if (orderNumberParam) {
        document.getElementById('order-number').value = orderNumberParam;
        fetchOrderTracking(orderNumberParam);
    }
    
    // Handle form submission for order tracking
    trackingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const orderNumber = document.getElementById('order-number').value.trim();
        
        if (!orderNumber) {
            showNotification('Please enter a valid order number', 'error');
            return;
        }
        
        fetchOrderTracking(orderNumber);
    });
    
    // Function to fetch order tracking information
    function fetchOrderTracking(orderNumber) {
        // First try to get data from localStorage (for demo purposes)
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const order = orders.find(o => o.orderNumber === orderNumber);
        
        if (!order) {
            showNotification(`No order found with number ${orderNumber}`, 'error');
            return;
        }
        
        // Display the tracking information
        displayOrderTracking(order);
        
        // Update URL with order parameter without reloading the page
        const url = new URL(window.location);
        url.searchParams.set('order', orderNumber);
        window.history.pushState({}, '', url);
    }
    
    // Function to display order tracking information
    function displayOrderTracking(order) {
        // Show tracking details and hide the "no info" message
        trackingDetails.style.display = 'block';
        noTrackingInfo.style.display = 'none';
        
        // Set basic order information
        document.getElementById('display-order-number').textContent = order.orderNumber;
        document.getElementById('order-date').textContent = formatDate(new Date(order.date));
        document.getElementById('estimated-delivery').textContent = formatDate(new Date(order.estimatedDelivery));
        
        // Set status and label color
        const statusLabel = document.getElementById('status-label');
        statusLabel.textContent = order.status;
        statusLabel.className = 'status-label';
        
        switch(order.status.toLowerCase()) {
            case 'processing':
                statusLabel.classList.add('status-processing');
                break;
            case 'shipped':
                statusLabel.classList.add('status-shipped');
                break;
            case 'delivered':
                statusLabel.classList.add('status-delivered');
                break;
            default:
                statusLabel.classList.add('status-processing');
        }
        
        // Set last updated date
        const lastUpdate = order.statusHistory && order.statusHistory.length > 0 
            ? new Date(order.statusHistory[0].date)
            : new Date(order.date);
        document.getElementById('last-updated').textContent = formatDate(lastUpdate);
        
        // Set delivery address
        const address = order.address;
        document.getElementById('delivery-address').textContent = 
            `${address.name}, ${address.street}, ${address.city}, ${address.state} ${address.zip}, ${address.country}`;
        
        // Set shipping method
        document.getElementById('shipping-method').textContent = order.shipping.name;
        
        // Generate tracking number if not available
        if (!order.trackingNumber) {
            order.trackingNumber = generateTrackingNumber();
        }
        document.getElementById('tracking-number').textContent = order.trackingNumber;
        
        // Populate timeline
        const timelineContainer = document.getElementById('timeline-container');
        timelineContainer.innerHTML = '';
        
        // If no status history exists, create a default one
        if (!order.statusHistory || order.statusHistory.length === 0) {
            order.statusHistory = [
                {
                    status: 'Order Placed',
                    date: order.date,
                    description: 'Your order has been received and is being processed.'
                }
            ];
        }
        
        // Add timeline items
        order.statusHistory.forEach((status, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.classList.add('timeline-item');
            timelineItem.innerHTML = `
                <div class="timeline-marker">${index + 1}</div>
                <div class="timeline-content">
                    <h4>${status.status}</h4>
                    <div class="timeline-date">${formatDate(new Date(status.date))}</div>
                    <p>${status.description}</p>
                </div>
            `;
            timelineContainer.appendChild(timelineItem);
        });
        
        // Populate order items
        const orderItemsList = document.getElementById('order-items-list');
        orderItemsList.innerHTML = '';
        
        if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
                const orderItem = document.createElement('div');
                orderItem.classList.add('cart-item');
                orderItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>$${item.price} × ${item.quantity}</p>
                    </div>
                `;
                orderItemsList.appendChild(orderItem);
            });
        } else {
            orderItemsList.innerHTML = '<p>No items found for this order.</p>';
        }
    }
    
    // Helper function to format dates
    function formatDate(date) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('en-US', options);
    }
    
    // Generate a random tracking number for demo purposes
    function generateTrackingNumber() {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < 12; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    // Helper function from script.js
    function updateCartCounter() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCounter = document.getElementById('cart-counter');
        if (cartCounter) {
            const itemCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);
            cartCounter.textContent = itemCount;
            cartCounter.style.display = itemCount ? 'block' : 'none';
        }
    }
    
    // Show notification function (copied from script.js for consistency)
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
});
