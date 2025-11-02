// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    setupDropdown();
    updatePropertyCount();
});

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
                
                // Handle specific dropdown items (EXCEPT LOGOUT - it's handled by the form)
                if (this.textContent.includes('Profile')) {
                    console.log('Profile clicked');
                    showProfilePage();
                } else if (this.textContent.includes('Settings')) {
                    console.log('Settings clicked');
                    showSettingsPage();
                }
                // Logout is handled by the form submission, so no need for JavaScript
            });
        });

        // Prevent dropdown from closing when clicking inside it
        userDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
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
    
    const propertyCards = document.querySelectorAll('.property-card');
    let visibleCount = 0;
    
    propertyCards.forEach(card => {
        const title = card.querySelector('.property-title').textContent.toLowerCase();
        const location = card.getAttribute('data-location');
        const price = parseFloat(card.getAttribute('data-price'));
        
        const matchesSearch = title.includes(searchTerm) || 
                            location.includes(searchTerm);
        const matchesLocation = locationFilter === 'all' || 
                              location.includes(locationFilter.toLowerCase());
        const matchesPrice = price >= minPrice && price <= maxPrice;
        
        if (matchesSearch && matchesLocation && matchesPrice) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    updatePropertyCount(visibleCount);
}

function updatePropertyCount(count) {
    const countElement = document.getElementById('property-count');
    if (count !== undefined) {
        countElement.textContent = count;
    } else {
        // Count all visible property cards
        const visibleCards = document.querySelectorAll('.property-card[style=""]').length + 
                           document.querySelectorAll('.property-card:not([style])').length;
        countElement.textContent = visibleCards;
    }
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