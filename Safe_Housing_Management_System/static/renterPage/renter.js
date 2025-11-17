// Renter Dashboard JavaScript
console.log("🎯 Initializing renter dashboard...");

// Global variables
let selectedAmenities = [];
let currentFilters = {
    amenities: [],
    priceMin: 0,
    priceMax: 50000,
    location: 'all',
    search: ''
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Renter page loaded successfully!');
    initializeDashboard();
});

function initializeDashboard() {
    setupFilterModal();
    setupViewDetailsButtons();
    setupDropdown();
    setupRealTimeFilters();
    updateFilterCount();
    console.log("✅ Dashboard initialized successfully!");
}

// FILTER MODAL FUNCTIONALITY
function setupFilterModal() {
    const filterButton = document.getElementById('filterToggleBtn');
    const filterModal = document.getElementById('filterModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeFilterBtn = document.getElementById('closeFilterBtn');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');

    if (!filterButton || !filterModal) {
        console.error("❌ Filter modal elements not found");
        return;
    }

    // Open modal
    filterButton.addEventListener('click', openModal);
    
    // Close modal
    closeFilterBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // Apply filters
    applyFiltersBtn.addEventListener('click', function() {
        applyFilters();
        updateFilterCount();
        closeModal();
    });
    
    // Clear filters
    clearFiltersBtn.addEventListener('click', function() {
        clearAllFilters();
        closeModal();
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });

    console.log("✅ Filter modal setup complete");
}

function openModal() {
    const filterModal = document.getElementById('filterModal');
    const modalOverlay = document.getElementById('modalOverlay');
    
    filterModal.style.cssText = 'right: 0 !important; display: block !important; visibility: visible !important; z-index: 10000 !important;';
    modalOverlay.style.cssText = 'display: block !important; z-index: 9999 !important;';
}

function closeModal() {
    const filterModal = document.getElementById('filterModal');
    const modalOverlay = document.getElementById('modalOverlay');
    
    filterModal.style.cssText = 'right: -400px !important;';
    modalOverlay.style.cssText = 'display: none !important;';
}

// VIEW DETAILS BUTTONS
function setupViewDetailsButtons() {
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    console.log(`🔍 Found ${viewDetailsButtons.length} view details buttons`);
    
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            console.log("✅ View Details button CLICKED!");
            e.preventDefault();
            e.stopPropagation();
            
            const propertyId = this.getAttribute('data-property-id');
            console.log('Property ID:', propertyId);
            
            if (propertyId) {
                const url = `/renter/property/${propertyId}/`;
                console.log('Navigating to:', url);
                window.location.href = url;
            }
        });
        
        button.style.cursor = 'pointer';
    });
}

// DROPDOWN FUNCTIONALITY
function setupDropdown() {
    const userDropdownBtn = document.getElementById('userDropdownBtn');
    const userDropdown = document.getElementById('userDropdown');

    if (userDropdownBtn && userDropdown) {
        userDropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });

        document.addEventListener('click', function(e) {
            if (!userDropdownBtn.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });

        const dropdownItems = document.querySelectorAll('.user-dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                userDropdown.classList.remove('active');
            });
        });

        userDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

// REAL-TIME FILTERS
function setupRealTimeFilters() {
    // Search input
    document.getElementById('search').addEventListener('input', function() {
        applyFilters();
        updateFilterCount();
    });
    
    // Location select
    document.getElementById('location').addEventListener('change', function() {
        applyFilters();
        updateFilterCount();
    });
    
    // Price inputs
    document.getElementById('price-min').addEventListener('input', function() {
        applyFilters();
        updateFilterCount();
    });
    
    document.getElementById('price-max').addEventListener('input', function() {
        applyFilters();
        updateFilterCount();
    });
    
    // Amenity checkboxes
    const amenityCheckboxes = document.querySelectorAll('input[name="amenities"]');
    amenityCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectedAmenities();
            updateFilterCount();
            applyFilters();
        });
    });
}

// VIEW TOGGLE FUNCTIONALITY
function setupViewToggle() {
    const gridView = document.getElementById('grid-view');
    const listView = document.getElementById('list-view');
    
    if (gridView && listView) {
        gridView.addEventListener('click', () => toggleView('grid'));
        listView.addEventListener('click', () => toggleView('list'));
    }
}

function toggleView(viewType) {
    const container = document.getElementById('property-container');
    const gridBtn = document.getElementById('grid-view');
    const listBtn = document.getElementById('list-view');
    
    if (!container || !gridBtn || !listBtn) return;
    
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

// FILTER FUNCTIONS
function updateSelectedAmenities() {
    selectedAmenities = [];
    const checkboxes = document.querySelectorAll('input[name="amenities"]:checked');
    checkboxes.forEach(checkbox => {
        selectedAmenities.push(checkbox.value);
    });
    console.log('Selected amenities:', selectedAmenities);
}

function getSelectedAmenities() {
    const selectedAmenities = [];
    const checkboxes = document.querySelectorAll('input[name="amenities"]:checked');
    checkboxes.forEach(checkbox => {
        selectedAmenities.push(checkbox.value);
    });
    return selectedAmenities;
}

function applyFilters() {
    const selectedAmenities = getSelectedAmenities();
    const priceMin = parseInt(document.getElementById('price-min').value) || 0;
    const priceMax = parseInt(document.getElementById('price-max').value) || 50000;
    const location = document.getElementById('location').value;
    const search = document.getElementById('search').value.trim().toLowerCase();
    
    const propertyContainer = document.getElementById('property-container');
    const propertyCards = propertyContainer.querySelectorAll('.property-card');
    let visibleCount = 0;
    
    propertyCards.forEach(card => {
        const matchesAmenities = propertyMatchesAmenities(card, selectedAmenities);
        const matchesPrice = propertyMatchesPrice(card, priceMin, priceMax);
        const matchesLocation = propertyMatchesLocation(card, location);
        const matchesSearch = propertyMatchesSearch(card, search);
        
        if (matchesAmenities && matchesPrice && matchesLocation && matchesSearch) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update property count
    const propertyCount = document.getElementById('property-count');
    propertyCount.textContent = visibleCount;
    
    // Show no properties message if none match
    const noProperties = propertyContainer.querySelector('.no-properties');
    if (visibleCount === 0 && !noProperties) {
        const noPropertiesDiv = document.createElement('div');
        noPropertiesDiv.className = 'no-properties';
        noPropertiesDiv.innerHTML = `
            <i class="fas fa-home fa-3x"></i>
            <h3>No Properties Match Your Filters</h3>
            <p>Try adjusting your filters to see more properties.</p>
        `;
        propertyContainer.appendChild(noPropertiesDiv);
    } else if (visibleCount > 0 && noProperties) {
        noProperties.remove();
    }
    
    currentFilters = {
        amenities: selectedAmenities,
        priceMin,
        priceMax,
        location,
        search
    };
    
    console.log(`Filtered properties: ${visibleCount} visible`);
}

function clearAllFilters() {
    // Clear checkboxes
    const checkboxes = document.querySelectorAll('input[name="amenities"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);
    
    // Reset inputs
    document.getElementById('price-min').value = 0;
    document.getElementById('price-max').value = 50000;
    document.getElementById('location').value = 'all';
    document.getElementById('search').value = '';
    
    // Apply cleared filters
    applyFilters();
    updateFilterCount();
}

function updateFilterCount() {
    const filterCount = document.getElementById('filterCount');
    if (filterCount) {
        const amenityCount = getSelectedAmenities().length;
        const priceMin = document.getElementById('price-min').value;
        const priceMax = document.getElementById('price-max').value;
        const location = document.getElementById('location').value;
        const search = document.getElementById('search').value;
        
        let count = amenityCount;
        if (priceMin > 0 || priceMax < 50000) count++;
        if (location !== 'all') count++;
        if (search.trim() !== '') count++;
        
        filterCount.textContent = count;
    }
}

// HELPER FUNCTIONS
function propertyMatchesAmenities(propertyCard, selectedAmenities) {
    if (selectedAmenities.length === 0) return true;
    
    for (const amenity of selectedAmenities) {
        let hasAmenity = false;
        const amenitiesSection = propertyCard.querySelector('.property-amenities');
        const safetySection = propertyCard.querySelector('.property-safety');
        
        switch(amenity) {
            case 'electricity': hasAmenity = amenitiesSection?.textContent.includes('Electricity'); break;
            case 'water': hasAmenity = amenitiesSection?.textContent.includes('Water'); break;
            case 'internet': hasAmenity = amenitiesSection?.textContent.includes('Internet'); break;
            case 'airconditioning': hasAmenity = amenitiesSection?.textContent.includes('AC'); break;
            case 'kitchen': hasAmenity = amenitiesSection?.textContent.includes('Kitchen'); break;
            case 'shared_kitchen': hasAmenity = amenitiesSection?.textContent.includes('Shared Kitchen'); break;
            case 'private_bathroom': hasAmenity = amenitiesSection?.textContent.includes('Private Bathroom'); break;
            case 'shared_bathroom': hasAmenity = amenitiesSection?.textContent.includes('Shared Bathroom'); break;
            case 'secure_locks': hasAmenity = safetySection?.textContent.includes('Secure Locks'); break;
            case 'cctv': hasAmenity = safetySection?.textContent.includes('CCTV'); break;
            case 'gated_compound': hasAmenity = safetySection?.textContent.includes('Gated Compound'); break;
            case 'security_guard': hasAmenity = safetySection?.textContent.includes('Security Guard'); break;
            case 'parking': hasAmenity = amenitiesSection?.textContent.includes('Parking'); break;
            case 'furnished': hasAmenity = amenitiesSection?.textContent.includes('Furnished'); break;
            case 'pet_friendly': hasAmenity = amenitiesSection?.textContent.includes('Pet Friendly'); break;
        }
        
        if (!hasAmenity) return false;
    }
    return true;
}

function propertyMatchesPrice(propertyCard, priceMin, priceMax) {
    const propertyPrice = parseInt(propertyCard.getAttribute('data-price')) || 0;
    return propertyPrice >= priceMin && propertyPrice <= priceMax;
}

function propertyMatchesLocation(propertyCard, location) {
    if (location === 'all') return true;
    const propertyLocation = propertyCard.getAttribute('data-location') || '';
    return propertyLocation.includes(location.toLowerCase());
}

function propertyMatchesSearch(propertyCard, searchTerm) {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const propertyTitle = propertyCard.querySelector('.property-title')?.textContent.toLowerCase() || '';
    const propertyLocation = propertyCard.querySelector('.property-location')?.textContent.toLowerCase() || '';
    const propertyDescription = propertyCard.querySelector('.property-description')?.textContent.toLowerCase() || '';
    
    return propertyTitle.includes(searchLower) || 
           propertyLocation.includes(searchLower) || 
           propertyDescription.includes(searchLower);
}

function checkAmenitiesText(card, searchTerm) {
    const amenitiesSection = card.querySelector('.property-amenities');
    const safetySection = card.querySelector('.property-safety');
    
    if (amenitiesSection && amenitiesSection.textContent.toLowerCase().includes(searchTerm)) return true;
    if (safetySection && safetySection.textContent.toLowerCase().includes(searchTerm)) return true;
    
    return false;
}

function updatePropertyCount(count) {
    const countElement = document.getElementById('property-count');
    if (countElement) {
        if (count !== undefined) {
            countElement.textContent = count;
        } else {
            const visibleCards = document.querySelectorAll('.property-card[style=""]').length + 
                            document.querySelectorAll('.property-card:not([style])').length;
            countElement.textContent = visibleCards;
        }
    }
}