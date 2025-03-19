const products = [
    {
        id: 1,
        name: "TrailMaster Hiking Boots",
        price: 129.99,
        category: "footwear",
        image: "images/products/hiking-boots.jpg",
        description: "Durable and waterproof hiking boots with excellent ankle support for challenging trails.",
        inStock: true,
        isNew: false,
        isFeatured: true
    },
    {
        id: 2,
        name: "LightTrek Backpack 45L",
        price: 89.99,
        category: "gear",
        image: "images/products/backpack.jpg",
        description: "Lightweight and comfortable backpack with multiple compartments and rain cover.",
        inStock: true,
        isNew: false,
        isFeatured: true
    },
    {
        id: 3,
        name: "All-Weather Tent 2-Person",
        price: 199.99,
        category: "shelter",
        image: "images/products/tent.jpg",
        description: "Easy setup tent that withstands heavy rain and wind, perfect for weekend adventures.",
        inStock: true,
        isNew: false,
        isFeatured: true
    },
    {
        id: 4,
        name: "Wilderness First Aid Kit",
        price: 45.99,
        category: "safety",
        image: "images/products/first-aid.jpg",
        description: "Comprehensive first aid kit designed specifically for outdoor emergencies.",
        inStock: true,
        isNew: false,
        isFeatured: true
    },
    {
        id: 5,
        name: "TrailBlazer Trekking Poles",
        price: 59.99,
        category: "gear",
        image: "images/products/trekking-poles.jpg",
        description: "Adjustable aluminum trekking poles with comfortable grips and anti-shock features.",
        inStock: true,
        isNew: true,
        isFeatured: false
    },
    {
        id: 6,
        name: "Alpine Water Filter",
        price: 34.99,
        category: "safety",
        image: "images/products/water-filter.jpg",
        description: "Portable water filter that removes 99.9% of bacteria and parasites from stream water.",
        inStock: true,
        isNew: true,
        isFeatured: false
    },
    {
        id: 7,
        name: "SummitSeeker GPS Watch",
        price: 159.99,
        category: "gear",
        image: "images/products/gps-watch.jpg",
        description: "Advanced GPS watch with topographic maps, altitude tracking, and weather alerts.",
        inStock: true,
        isNew: true,
        isFeatured: false
    },
    {
        id: 8,
        name: "Ultralight Sleeping Bag",
        price: 129.99,
        category: "shelter",
        image: "images/products/sleeping-bag.jpg",
        description: "Compact sleeping bag rated for 20°F, weighing only 2.5 pounds.",
        inStock: true,
        isNew: true,
        isFeatured: false
    },
    {
        id: 9,
        name: "Trailside Cooking Set",
        price: 79.99,
        category: "gear",
        image: "images/products/cooking-set.jpg",
        description: "Compact nesting cookware set including pot, pan, and utensils for backcountry cooking.",
        inStock: false,
        isNew: false,
        isFeatured: true
    },
    {
        id: 10,
        name: "Mountain Stream Water Bottle",
        price: 24.99,
        category: "gear",
        image: "images/products/water-bottle.jpg",
        description: "Insulated 32oz water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
        inStock: true,
        isNew: false,
        isFeatured: true
    },
    {
        id: 11,
        name: "TrailRunner Lightweight Shoes",
        price: 109.99,
        category: "footwear",
        image: "images/products/trail-shoes.jpg",
        description: "Lightweight and breathable trail running shoes with excellent grip on various terrains.",
        inStock: true,
        isNew: false,
        isFeatured: false
    },
    {
        id: 12,
        name: "Pocket Multi-Tool",
        price: 29.99,
        category: "gear",
        image: "images/products/multi-tool.jpg",
        description: "Compact 15-in-1 multi-tool perfect for camping and hiking emergencies.",
        inStock: true,
        isNew: false,
        isFeatured: false
    }
];

// Function to display products on the home page or products page
function displayProducts(productsToDisplay, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    productsToDisplay.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <a href="product-detail.html?id=${product.id}" class="product-link">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">$${product.price}</p>
                <p class="description">${product.description || 'No description available'}</p>
            </a>
            <div class="product-controls">
                <button onclick="event.stopPropagation(); addToCart(${product.id})">Add to Cart</button>
                <button onclick="event.stopPropagation(); addToWishlist(${product.id})" class="wishlist-btn">❤</button>
            </div>
        `;
        container.appendChild(productItem);
    });
}
