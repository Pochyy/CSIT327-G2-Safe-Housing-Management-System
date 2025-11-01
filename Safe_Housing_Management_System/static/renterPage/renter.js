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
    setupDropdown();
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

function setupDropdown() {
    const userDropdownBtn = document.getElementById('userDropdownBtn');
    const userDropdown = document.getElementById('userDropdown');

    if (userDropdownBtn && userDropdown) {
        // Toggle dropdown on click
        userDropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userDropdownBtn.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });

        // Close dropdown when clicking on dropdown items
        const dropdownItems = document.querySelectorAll('.user-dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                userDropdown.classList.remove('active');
                
                // Handle specific dropdown items
                if (this.id === 'logoutBtn') {
                    showLogoutConfirmation();
                } else if (this.textContent.includes('Profile')) {
                    console.log('Profile clicked');
                    // Add profile logic here
                    showProfilePage();
                } else if (this.textContent.includes('Settings')) {
                    console.log('Settings clicked');
                    // Add settings logic here
                    showSettingsPage();
                }
            });
        });

        // Prevent dropdown from closing when clicking inside it
        userDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

function showLogoutConfirmation() {
    // Create custom confirmation modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            max-width: 400px;
            width: 90%;
            text-align: center;
        ">
            <div style="font-size: 3rem; color: #8B0000; margin-bottom: 1rem;">⚠️</div>
            <h3 style="color: #1F2937; margin-bottom: 0.5rem; font-size: 1.25rem;">Logout Confirmation</h3>
            <p style="color: #6B7280; margin-bottom: 2rem;">Are you sure you want to logout? You'll need to sign in again to access your account.</p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button id="cancelLogout" style="
                    padding: 0.75rem 1.5rem;
                    border: 1px solid #D1D5DB;
                    background: white;
                    color: #374151;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                ">Cancel</button>
                <button id="confirmLogout" style="
                    padding: 0.75rem 1.5rem;
                    border: none;
                    background: #8B0000;
                    color: white;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                ">Yes, Logout</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners for the modal buttons
    document.getElementById('cancelLogout').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    document.getElementById('confirmLogout').addEventListener('click', function() {
        // Perform logout action
        performLogout();
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function performLogout() {
    // Show loading state
    const confirmBtn = document.getElementById('confirmLogout');
    confirmBtn.innerHTML = 'Logging out...';
    confirmBtn.disabled = true;
    
    // Simulate API call or cleanup
    setTimeout(() => {
        // Clear any user data from localStorage/sessionStorage
        localStorage.removeItem('userToken');
        sessionStorage.removeItem('userData');
        
        // Redirect to login page
        window.location.href = '/login'; // Change this to your actual login page URL
        
        // If you're using Django templates, you might use:
        // window.location.href = "{% url 'login' %}";
    }, 1000);
}

function showProfilePage() {
    // Add your profile page navigation logic here
    console.log('Navigating to profile page');
    // window.location.href = '/profile';
}

function showSettingsPage() {
    // Add your settings page navigation logic here
    console.log('Navigating to settings page');
    // window.location.href = '/settings';
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