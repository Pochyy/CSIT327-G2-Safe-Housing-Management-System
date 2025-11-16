// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Renter page loaded successfully!');
    setupEventListeners();
    setupDropdown();
    setupFilterModal();
    updatePropertyCount();
    updateFilterCount();
});

let selectedAmenities = [];// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Renter page loaded successfully!');
    setupEventListeners();
    setupDropdown();
    setupFilterModal();
    updatePropertyCount();
    updateFilterCount();
});

let selectedAmenities = [];

function setupEventListeners() {
    // Basic filter event listeners
    document.getElementById('search').addEventListener('input', filterProperties);
    document.getElementById('location').addEventListener('change', filterProperties);
    document.getElementById('price-min').addEventListener('input', filterProperties);
    document.getElementById('price-max').addEventListener('input', filterProperties);
    
    // View toggle functionality
    document.getElementById('grid-view').addEventListener('click', () => toggleView('grid'));
    document.getElementById('list-view').addEventListener('click', () => toggleView('list'));
    
    // View details buttons
    setupViewDetailsButtons();
}

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

function setupFilterModal() {
    const filterToggleBtn = document.getElementById('filterToggleBtn');
    const closeFilterBtn = document.getElementById('closeFilterBtn');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const filterModal = document.getElementById('filterModal');
    const modalOverlay = document.getElementById('modalOverlay');
    
    console.log('Setting up filter modal with elements:', {
        button: !!filterToggleBtn,
        modal: !!filterModal,
        overlay: !!modalOverlay
    });
    
    // Open filter modal - USING INLINE STYLES
    if (filterToggleBtn && filterModal) {
        filterToggleBtn.addEventListener('click', function() {
            console.log('Opening modal with inline styles');
            // Use inline styles instead of CSS classes
            filterModal.style.right = '0';
            if (modalOverlay) {
                modalOverlay.style.display = 'block';
            }
        });
    } else {
        console.error('Missing elements for modal:', {
            button: !filterToggleBtn,
            modal: !filterModal
        });
    }
    
    // Close filter modal - USING INLINE STYLES
    if (closeFilterBtn && filterModal) {
        closeFilterBtn.addEventListener('click', function() {
            console.log('Closing modal');
            filterModal.style.right = '-400px';
            if (modalOverlay) {
                modalOverlay.style.display = 'none';
            }
        });
    }
    
    // Apply filters
    if (applyFiltersBtn && filterModal) {
        applyFiltersBtn.addEventListener('click', function() {
            console.log('Applying filters');
            filterModal.style.right = '-400px';
            if (modalOverlay) {
                modalOverlay.style.display = 'none';
            }
            filterProperties();
        });
    }
    
    // Clear all filters
    if (clearFiltersBtn && filterModal) {
        clearFiltersBtn.addEventListener('click', function() {
            console.log('Clearing all filters');
            // Clear all amenity checkboxes
            const checkboxes = document.querySelectorAll('input[name="amenities"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Clear price inputs
            document.getElementById('price-min').value = '0';
            document.getElementById('price-max').value = '50000';
            
            // Clear location
            document.getElementById('location').value = 'all';
            
            // Clear search
            document.getElementById('search').value = '';
            
            selectedAmenities = [];
            updateFilterCount();
            filterProperties();
            filterModal.style.right = '-400px';
            if (modalOverlay) {
                modalOverlay.style.display = 'none';
            }
        });
    }
    
    // Update selected amenities when checkboxes change
    const checkboxes = document.querySelectorAll('input[name="amenities"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectedAmenities();
            updateFilterCount();
        });
    });
    
    // Close modal when clicking outside (on overlay)
    if (modalOverlay && filterModal) {
        modalOverlay.addEventListener('click', function() {
            console.log('Closing modal via overlay click');
            filterModal.style.right = '-400px';
            modalOverlay.style.display = 'none';
        });
    }
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && filterModal) {
            console.log('Closing modal via Escape key');
            filterModal.style.right = '-400px';
            if (modalOverlay) {
                modalOverlay.style.display = 'none';
            }
        }
    });
}

function updateSelectedAmenities() {
    selectedAmenities = [];
    const checkboxes = document.querySelectorAll('input[name="amenities"]:checked');
    checkboxes.forEach(checkbox => {
        selectedAmenities.push(checkbox.value);
    });
    console.log('Selected amenities:', selectedAmenities);
}

function updateFilterCount() {
    const filterCount = document.getElementById('filterCount');
    if (filterCount) {
        const amenityCount = selectedAmenities.length;
        const priceMin = document.getElementById('price-min').value;
        const priceMax = document.getElementById('price-max').value;
        const location = document.getElementById('location').value;
        const search = document.getElementById('search').value;
        
        let count = amenityCount;
        
        // Count additional filters
        if (priceMin > 0 || priceMax < 50000) count++;
        if (location !== 'all') count++;
        if (search.trim() !== '') count++;
        
        filterCount.textContent = count;
    }
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
        const description = card.querySelector('.property-description').textContent.toLowerCase();
        const location = card.getAttribute('data-location');
        const price = parseFloat(card.getAttribute('data-price'));
        
        const matchesSearch = !searchTerm || 
                            title.includes(searchTerm) || 
                            description.includes(searchTerm) ||
                            location.includes(searchTerm) ||
                            checkAmenitiesText(card, searchTerm);
        
        const matchesLocation = locationFilter === 'all' || 
                              location.includes(locationFilter.toLowerCase());
        
        const matchesPrice = price >= minPrice && price <= maxPrice;
        
        const matchesAmenities = selectedAmenities.length === 0 || 
                               selectedAmenities.every(amenity => hasAmenity(card, amenity));
        
        if (matchesSearch && matchesLocation && matchesPrice && matchesAmenities) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    updatePropertyCount(visibleCount);
    
    // Show no properties message if none match
    const propertyContainer = document.getElementById('property-container');
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
    
    console.log(`Filtered properties: ${visibleCount} visible`);
}

function hasAmenity(card, amenity) {
    const amenityMap = {
        'electricity': 'Electricity',
        'water': 'Water',
        'internet': 'Internet',
        'airconditioning': 'AC',
        'kitchen': 'Kitchen',
        'shared_kitchen': 'Shared Kitchen',
        'private_bathroom': 'Private Bathroom',
        'shared_bathroom': 'Shared Bathroom',
        'secure_locks': 'Secure Locks',
        'cctv': 'CCTV',
        'gated_compound': 'Gated Compound',
        'security_guard': 'Security Guard',
        'parking': 'Parking',
        'furnished': 'Furnished',
        'pet_friendly': 'Pet Friendly'
    };
    
    const amenityText = amenityMap[amenity];
    if (!amenityText) return false;
    
    // Check amenities section
    const amenitiesSection = card.querySelector('.property-amenities');
    if (amenitiesSection && amenitiesSection.textContent.includes(amenityText)) return true;
    
    // Check safety section
    const safetySection = card.querySelector('.property-safety');
    if (safetySection && safetySection.textContent.includes(amenityText)) return true;
    
    return false;
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
    if (count !== undefined) {
        countElement.textContent = count;
    } else {
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

function setupViewDetailsButtons() {
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const propertyId = this.getAttribute('data-property-id');
            viewPropertyDetails(propertyId);
        });
    });
}

function viewPropertyDetails(propertyId) {
    console.log('Viewing details for property:', propertyId);
    // Add your property details logic here
    // This could redirect to a property details page or show a modal
    // window.location.href = `/property/${propertyId}/`;
}

function setupEventListeners() {
    // Basic filter event listeners
    document.getElementById('search').addEventListener('input', filterProperties);
    document.getElementById('location').addEventListener('change', filterProperties);
    document.getElementById('price-min').addEventListener('input', filterProperties);
    document.getElementById('price-max').addEventListener('input', filterProperties);
    
    // View toggle functionality
    document.getElementById('grid-view').addEventListener('click', () => toggleView('grid'));
    document.getElementById('list-view').addEventListener('click', () => toggleView('list'));
    
    // View details buttons
    setupViewDetailsButtons();
}

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

function setupFilterModal() {
    const filterToggleBtn = document.getElementById('filterToggleBtn');
    const closeFilterBtn = document.getElementById('closeFilterBtn');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const filterModal = document.getElementById('filterModal');
    const modalOverlay = document.getElementById('modalOverlay');
    
    console.log('Setting up filter modal with elements:', {
        button: !!filterToggleBtn,
        modal: !!filterModal,
        overlay: !!modalOverlay
    });
    
    // Open filter modal - USING INLINE STYLES
    if (filterToggleBtn && filterModal) {
        filterToggleBtn.addEventListener('click', function() {
            console.log('Opening modal with inline styles');
            // Use inline styles instead of CSS classes
            filterModal.style.right = '0';
            if (modalOverlay) {
                modalOverlay.style.display = 'block';
            }
        });
    } else {
        console.error('Missing elements for modal:', {
            button: !filterToggleBtn,
            modal: !filterModal
        });
    }
    
    // Close filter modal - USING INLINE STYLES
    if (closeFilterBtn && filterModal) {
        closeFilterBtn.addEventListener('click', function() {
            console.log('Closing modal');
            filterModal.style.right = '-400px';
            if (modalOverlay) {
                modalOverlay.style.display = 'none';
            }
        });
    }
    
    // Apply filters
    if (applyFiltersBtn && filterModal) {
        applyFiltersBtn.addEventListener('click', function() {
            console.log('Applying filters');
            filterModal.style.right = '-400px';
            if (modalOverlay) {
                modalOverlay.style.display = 'none';
            }
            filterProperties();
        });
    }
    
    // Clear all filters
    if (clearFiltersBtn && filterModal) {
        clearFiltersBtn.addEventListener('click', function() {
            console.log('Clearing all filters');
            // Clear all amenity checkboxes
            const checkboxes = document.querySelectorAll('input[name="amenities"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Clear price inputs
            document.getElementById('price-min').value = '0';
            document.getElementById('price-max').value = '50000';
            
            // Clear location
            document.getElementById('location').value = 'all';
            
            // Clear search
            document.getElementById('search').value = '';
            
            selectedAmenities = [];
            updateFilterCount();
            filterProperties();
            filterModal.style.right = '-400px';
            if (modalOverlay) {
                modalOverlay.style.display = 'none';
            }
        });
    }
    
    // Update selected amenities when checkboxes change
    const checkboxes = document.querySelectorAll('input[name="amenities"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectedAmenities();
            updateFilterCount();
        });
    });
    
    // Close modal when clicking outside (on overlay)
    if (modalOverlay && filterModal) {
        modalOverlay.addEventListener('click', function() {
            console.log('Closing modal via overlay click');
            filterModal.style.right = '-400px';
            modalOverlay.style.display = 'none';
        });
    }
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && filterModal) {
            console.log('Closing modal via Escape key');
            filterModal.style.right = '-400px';
            if (modalOverlay) {
                modalOverlay.style.display = 'none';
            }
        }
    });
}

function updateSelectedAmenities() {
    selectedAmenities = [];
    const checkboxes = document.querySelectorAll('input[name="amenities"]:checked');
    checkboxes.forEach(checkbox => {
        selectedAmenities.push(checkbox.value);
    });
    console.log('Selected amenities:', selectedAmenities);
}

function updateFilterCount() {
    const filterCount = document.getElementById('filterCount');
    if (filterCount) {
        filterCount.textContent = selectedAmenities.length;
    }
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
        const description = card.querySelector('.property-description').textContent.toLowerCase();
        const location = card.getAttribute('data-location');
        const price = parseFloat(card.getAttribute('data-price'));
        
        const matchesSearch = !searchTerm || 
                            title.includes(searchTerm) || 
                            description.includes(searchTerm) ||
                            location.includes(searchTerm) ||
                            checkAmenitiesText(card, searchTerm);
        
        const matchesLocation = locationFilter === 'all' || 
                              location.includes(locationFilter.toLowerCase());
        
        const matchesPrice = price >= minPrice && price <= maxPrice;
        
        const matchesAmenities = selectedAmenities.length === 0 || 
                               selectedAmenities.every(amenity => hasAmenity(card, amenity));
        
        if (matchesSearch && matchesLocation && matchesPrice && matchesAmenities) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    updatePropertyCount(visibleCount);
    console.log(`Filtered properties: ${visibleCount} visible`);
}

function hasAmenity(card, amenity) {
    const amenityMap = {
        'electricity': 'Electricity',
        'water': 'Water',
        'internet': 'Internet',
        'airconditioning': 'AC',
        'kitchen': 'Kitchen',
        'private_bathroom': 'Private bathroom',
        'secure_locks': 'Secure',
        'fire_extinguisher': 'Fire extinguisher',
        'cctv': 'CCTV',
        'parking': 'Parking',
        'furnished': 'Furnished',
        'pet_friendly': 'Pet Friendly'
    };
    
    const amenityText = amenityMap[amenity];
    if (!amenityText) return false;
    
    const amenitiesSection = card.querySelector('.property-amenities');
    if (amenitiesSection && amenitiesSection.textContent.includes(amenityText)) return true;
    
    const safetySection = card.querySelector('.property-safety');
    if (safetySection && safetySection.textContent.includes(amenityText)) return true;
    
    return false;
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
    if (count !== undefined) {
        countElement.textContent = count;
    } else {
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

function setupViewDetailsButtons() {
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const propertyId = this.getAttribute('data-property-id');
            viewPropertyDetails(propertyId);
        });
    });
}

function viewPropertyDetails(propertyId) {
    console.log('Viewing details for property:', propertyId);
}