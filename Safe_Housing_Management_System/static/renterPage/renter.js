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
    console.log('Page loaded successfully!');
    
    // Check which page we're on
    const isDashboard = document.getElementById('property-container');
    const isPropertyDetails = document.querySelector('.property-details-container');
    
    if (isDashboard) {
        initializeDashboard();
    } else if (isPropertyDetails) {
        initializePropertyDetails();
    }
});

function initializeDashboard() {
    setupFilterModal();
    setupViewDetailsButtons();
    setupDropdown();
    setupRealTimeFilters();
    updateFilterCount();
    console.log("✅ Dashboard initialized successfully!");
}

function initializePropertyDetails() {
    console.log("✅ Property details page initialization");
    setupDropdown();
    setupContactModal();
    setupCommentFunctionality();
    setupTextareaAutoResize();
    
    // Ensure two-column layout on page load
    const grid = document.querySelector('.property-details-grid');
    if (grid) {
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = '1fr 1fr';
    }
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
        console.log("ℹ️ Filter modal not found (not on dashboard page)");
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

// PROPERTY DETAILS SPECIFIC FUNCTIONS
function setupContactModal() {
    const contactModalOverlay = document.getElementById('contactModalOverlay');
    
    if (contactModalOverlay) {
        // Close modal when clicking outside
        contactModalOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeContactModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeContactModal();
            }
        });
    }
}

function setupCommentFunctionality() {
    console.log("🔧 Setting up comment functionality...");
    
    // Remove onclick attributes and add proper event listeners
    document.querySelectorAll('.reply-btn').forEach(btn => {
        // Remove existing onclick attribute to prevent conflicts
        btn.removeAttribute('onclick');
        
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            // Get comment ID from the parent comment item
            const commentItem = this.closest('.comment-item');
            if (commentItem) {
                const commentId = commentItem.id.replace('comment-', '');
                console.log('Reply button clicked for comment:', commentId);
                toggleReplyForm(commentId);
            }
        });
    });
    
    // Form submission handling
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const commentInput = this.querySelector('.comment-input');
            const submitBtn = this.querySelector('.comment-submit-btn');
            
            // Basic validation
            if (commentInput.value.trim().length < 5) {
                alert('Please write a comment with at least 5 characters.');
                commentInput.focus();
                return;
            }
            
            // Disable button to prevent multiple submissions
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';
            
            // Submit form
            this.submit();
        });
    }
    
    // Reply form submissions
    document.querySelectorAll('.reply-form form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const replyInput = this.querySelector('.reply-input');
            const submitBtn = this.querySelector('.reply-submit-btn');
            
            if (replyInput.value.trim().length < 3) {
                alert('Please write a reply with at least 3 characters.');
                replyInput.focus();
                return;
            }
            
            // Disable button to prevent multiple submissions
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';
            
            // Submit form
            this.submit();
        });
    });
    
    // Smooth scrolling for new comments
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('new_comment')) {
        const commentId = urlParams.get('new_comment');
        const commentElement = document.getElementById(`comment-${commentId}`);
        if (commentElement) {
            setTimeout(() => {
                commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                commentElement.style.animation = 'pulse 1.5s';
            }, 300);
        }
    }
    
    console.log("✅ Comment functionality setup complete");
}

function setupTextareaAutoResize() {
    // Auto-resize textareas as user types
    document.querySelectorAll('.comment-input, .reply-input').forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
        
        // Initialize height
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight) + 'px';
    });
}

// CONTACT MODAL FUNCTIONS (make them global)
window.contactLandlord = function() {
    const contactModal = document.getElementById('contactModalOverlay');
    if (contactModal) {
        contactModal.style.display = 'block';
    }
};

window.closeContactModal = function() {
    const contactModal = document.getElementById('contactModalOverlay');
    if (contactModal) {
        contactModal.style.display = 'none';
    }
};

// FIXED REPLY FORM FUNCTIONALITY
function toggleReplyForm(commentId) {
    console.log('toggleReplyForm called for comment:', commentId);
    
    const replyForm = document.getElementById(`replyForm-${commentId}`);
    const replyBtn = document.querySelector(`#comment-${commentId} .reply-btn`);
    
    if (!replyForm) {
        console.error('❌ Reply form not found:', `replyForm-${commentId}`);
        return;
    }
    
    if (!replyBtn) {
        console.error('❌ Reply button not found in comment:', commentId);
        return;
    }
    
    console.log('Reply form found:', replyForm);
    console.log('Reply button found:', replyBtn);
    
    // Check if this form is already active
    if (replyForm.classList.contains('active')) {
        // Hide this form
        replyForm.classList.remove('active');
        replyBtn.innerHTML = '<i class="fas fa-reply"></i> Reply';
        console.log('Hiding reply form for comment:', commentId);
    } else {
        // Hide any other open reply forms first
        document.querySelectorAll('.reply-form.active').forEach(form => {
            form.classList.remove('active');
            const otherId = form.id.replace('replyForm-', '');
            const otherBtn = document.querySelector(`#comment-${otherId} .reply-btn`);
            if (otherBtn) {
                otherBtn.innerHTML = '<i class="fas fa-reply"></i> Reply';
            }
        });
        
        // Show this form
        replyForm.classList.add('active');
        replyBtn.innerHTML = '<i class="fas fa-times"></i> Close';
        
        // Focus and auto-resize the textarea
        const textarea = replyForm.querySelector('.reply-input');
        if (textarea) {
            setTimeout(() => {
                textarea.focus();
                textarea.style.height = 'auto';
                textarea.style.height = (textarea.scrollHeight) + 'px';
            }, 50);
        }
        
        console.log('Showing reply form for comment:', commentId);
    }
    
    // Force display style for debugging
    console.log('Current display style:', replyForm.style.display);
    console.log('Current class list:', replyForm.classList.toString());
}

// Add a pulse animation for highlighting new comments
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(44, 110, 111, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(44, 110, 111, 0); }
        100% { box-shadow: 0 0 0 0 rgba(44, 110, 111, 0); }
    }
    
    /* Ensure reply form is visible when active */
    .reply-form.active {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
    }
`;
document.head.appendChild(style);

// REAL-TIME FILTERS (dashboard only)
function setupRealTimeFilters() {
    const searchInput = document.getElementById('search');
    const locationSelect = document.getElementById('location');
    const priceMinInput = document.getElementById('price-min');
    const priceMaxInput = document.getElementById('price-max');
    
    if (!searchInput || !locationSelect) {
        return; // Not on dashboard
    }
    
    searchInput.addEventListener('input', function() {
        applyFilters();
        updateFilterCount();
    });
    
    locationSelect.addEventListener('change', function() {
        applyFilters();
        updateFilterCount();
    });
    
    if (priceMinInput) {
        priceMinInput.addEventListener('input', function() {
            applyFilters();
            updateFilterCount();
        });
    }
    
    if (priceMaxInput) {
        priceMaxInput.addEventListener('input', function() {
            applyFilters();
            updateFilterCount();
        });
    }
    
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

// VIEW TOGGLE FUNCTIONALITY (dashboard only)
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

// FILTER FUNCTIONS (dashboard only)
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
    const location = document.getElementById('location').value.trim().toLowerCase();
    const search = document.getElementById('search').value.trim().toLowerCase();
    
    const propertyContainer = document.getElementById('property-container');
    if (!propertyContainer) return; // Not on dashboard
    
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
    if (propertyCount) {
        propertyCount.textContent = visibleCount;
    }
    
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
    const priceMinInput = document.getElementById('price-min');
    const priceMaxInput = document.getElementById('price-max');
    const locationInput = document.getElementById('location');
    const searchInput = document.getElementById('search');
    
    if (priceMinInput) priceMinInput.value = 0;
    if (priceMaxInput) priceMaxInput.value = 50000;
    if (locationInput) locationInput.value = '';
    if (searchInput) searchInput.value = '';
    
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
        if (location && location.trim() !== '') count++;
        if (search && search.trim() !== '') count++;
        
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
    if (!location) return true; // Show all if no location entered
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

// Scroll comments to top on page load
document.addEventListener('DOMContentLoaded', function() {
    const commentsList = document.getElementById('commentsList');
    if (commentsList) {
        commentsList.scrollTop = 0;
    }
});

document.querySelectorAll('.star-rating i').forEach(star => {
    star.addEventListener('click', function () {
        const value = this.getAttribute('data-value');
        document.getElementById('ratingValue').value = value;

        // highlight selected stars
        document.querySelectorAll('.star-rating i').forEach(s => {
            s.classList.remove('fa-solid');
            s.classList.add('fa-regular');
        });

        for (let i = 1; i <= value; i++) {
            const star = document.querySelector(`.star-rating i[data-value="${i}"]`);
            star.classList.remove('fa-regular');
            star.classList.add('fa-solid');
        }
    });
});
