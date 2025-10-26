// Sample Philippine property data
const properties = [
    {
        id: 1,
        title: "Modern Condo in BGC",
        location: "Taguig, Metro Manila",
        bedrooms: 2,
        bathrooms: 2,
        sqft: 850,
        price: 35000,
        rating: 4.8,
        reviews: 24,
        amenities: ["WiFi", "Parking", "Gym", "Pool", "AC"],
        image_url: "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
    },
    {
        id: 2,
        title: "Cozy Apartment in Makati",
        location: "Makati, Metro Manila",
        bedrooms: 1,
        bathrooms: 1,
        sqft: 500,
        price: 18000,
        rating: 4.5,
        reviews: 15,
        amenities: ["WiFi", "Parking", "Kitchen", "AC"],
        image_url: "https://images.unsplash.com/photo-1641243418336-502b640ea5f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
    },
    {
        id: 3,
        title: "Spacious House in Quezon City",
        location: "Quezon City, Metro Manila",
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1200,
        price: 28000,
        rating: 4.9,
        reviews: 31,
        amenities: ["WiFi", "Parking", "Garden", "Pet Friendly"],
        image_url: "https://images.unsplash.com/photo-1741764014072-68953e93cd48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
    },
    {
        id: 4,
        title: "Beachfront Condo in Cebu",
        location: "Cebu City, Cebu",
        bedrooms: 2,
        bathrooms: 2,
        sqft: 900,
        price: 32000,
        rating: 4.7,
        reviews: 20,
        amenities: ["WiFi", "Pool", "Beach Access", "AC", "Parking"],
        image_url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
    },
    {
        id: 5,
        title: "Mountain View Apartment in Baguio",
        location: "Baguio, Benguet",
        bedrooms: 2,
        bathrooms: 1,
        sqft: 750,
        price: 15000,
        rating: 4.6,
        reviews: 18,
        amenities: ["WiFi", "Heating", "Mountain View", "Parking"],
        image_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
    }
];

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadProperties();
    setupEventListeners();
});

function loadProperties() {
    const container = document.getElementById('property-container');
    container.innerHTML = '';
    
    properties.forEach(property => {
        const propertyCard = createPropertyCard(property);
        container.appendChild(propertyCard);
    });
    
    updatePropertyCount();
}

function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.innerHTML = `
        <img src="${property.image_url}" alt="${property.title}" class="property-image"
             onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'">
        <div class="property-content">
            <h3 class="property-title">${property.title}</h3>
            <p class="property-location">📍 ${property.location}</p>
            <div class="property-details">
                <span>🛏️ ${property.bedrooms} ${property.bedrooms === 1 ? 'bed' : 'beds'}</span>
                <span>🚿 ${property.bathrooms} ${property.bathrooms === 1 ? 'bath' : 'baths'}</span>
                <span>📏 ${property.sqft} sqft</span>
            </div>
            <div class="property-price">₱${property.price.toLocaleString()}/mo</div>
            <div class="property-rating">
                <span class="rating-star">★</span>
                <span>${property.rating} (${property.reviews} reviews)</span>
            </div>
            <div class="amenities">
                ${property.amenities.slice(0, 4).map(amenity => 
                    `<span class="amenity-badge">${amenity}</span>`
                ).join('')}
                ${property.amenities.length > 4 ? 
                    `<span class="amenity-badge">+${property.amenities.length - 4}</span>` : ''
                }
            </div>
        </div>
    `;
    
    return card;
}

function setupEventListeners() {
    // Search and filter functionality
    document.getElementById('search').addEventListener('input', filterProperties);
    document.getElementById('location').addEventListener('change', filterProperties);
    document.getElementById('price-min').addEventListener('input', filterProperties);
    document.getElementById('price-max').addEventListener('input', filterProperties);
    
    // View toggle functionality
    document.getElementById('grid-view').addEventListener('click', () => toggleView('grid'));
    document.getElementById('list-view').addEventListener('click', () => toggleView('list'));
}

function filterProperties() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const locationFilter = document.getElementById('location').value;
    const minPrice = parseInt(document.getElementById('price-min').value) || 0;
    const maxPrice = parseInt(document.getElementById('price-max').value) || 100000;
    
    const filteredProperties = properties.filter(property => {
        const matchesSearch = property.title.toLowerCase().includes(searchTerm) || 
                            property.location.toLowerCase().includes(searchTerm);
        const matchesLocation = locationFilter === 'all' || 
                              property.location.toLowerCase().includes(locationFilter.toLowerCase());
        const matchesPrice = property.price >= minPrice && property.price <= maxPrice;
        
        return matchesSearch && matchesLocation && matchesPrice;
    });
    
    displayFilteredProperties(filteredProperties);
}

function displayFilteredProperties(filteredProperties) {
    const container = document.getElementById('property-container');
    container.innerHTML = '';
    
    filteredProperties.forEach(property => {
        const propertyCard = createPropertyCard(property);
        container.appendChild(propertyCard);
    });
    
    updatePropertyCount(filteredProperties.length);
}

function updatePropertyCount(count) {
    const countElement = document.getElementById('property-count');
    countElement.textContent = count !== undefined ? count : properties.length;
}

function toggleView(viewType) {
    const container = document.getElementById('property-container');
    const gridBtn = document.getElementById('grid-view');
    const listBtn = document.getElementById('list-view');
    
    if (viewType === 'grid') {
        container.className = 'property-grid';
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
    } else {
        container.className = 'property-list';
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
    }
}