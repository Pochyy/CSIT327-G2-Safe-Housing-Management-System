// Modal functionality
const modalOverlay = document.getElementById('modalOverlay');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const savePropertyBtn = document.getElementById('savePropertyBtn');

// Open modal
openModalBtn.addEventListener('click', () => {
    modalOverlay.classList.add('active');
});

// Close modal
function closeModal() {
    modalOverlay.classList.remove('active');
}

closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

// Close modal when clicking outside
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// Collapsible amenity sections
const amenityGroups = document.querySelectorAll('.amenity-group');

amenityGroups.forEach(group => {
    const header = group.querySelector('.amenity-header');
    
    header.addEventListener('click', () => {
        group.classList.toggle('active');
    });
});

const imageUpload = document.getElementById('imageUpload');

imageUpload.addEventListener('click', () => {
    alert('To be added: this would open a file picker to upload property images.');
});

// Save property (placeholder functionality)
savePropertyBtn.addEventListener('click', () => {
    // Basic validation
    const propertyName = document.getElementById('propertyName').value;
    const propertyLocation = document.getElementById('propertyLocation').value;
    const propertyPrice = document.getElementById('propertyPrice').value;
    
    if (!propertyName || !propertyLocation || !propertyPrice) {
        alert('Please fill in all required fields: Property Name, Location, and Price.');
        return;
    }
    
    alert('Property submitted for approval successfully!');
    closeModal();
    
    // Reset form
    document.getElementById('propertyName').value = '';
    document.getElementById('propertyLocation').value = '';
    document.getElementById('beds').value = '';
    document.getElementById('baths').value = '';
    document.getElementById('area').value = '';
    document.getElementById('propertyPrice').value = '';
    
    // Uncheck all amenities
    const checkboxes = document.querySelectorAll('.amenity-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
});

// User dropdown functionality
const userDropdownBtn = document.getElementById('userDropdownBtn');
const userDropdown = document.getElementById('userDropdown');
const logoutBtn = document.getElementById('logoutBtn');

userDropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', () => {
    userDropdown.classList.remove('active');
});

// Logout functionality
logoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = "{% url 'logout' %}";
    }
});

// Filter functionality
const filterItems = document.querySelectorAll('.filter-item');
const propertyCards = document.querySelectorAll('.property-card');

filterItems.forEach(item => {
    item.addEventListener('click', () => {
        filterItems.forEach(filter => filter.classList.remove('active'));
        
        item.classList.add('active');
        
        const filterType = item.textContent.toLowerCase();
        
        if (filterType.includes('all')) {
            propertyCards.forEach(card => {
                card.style.display = 'block';
            });
        } else if (filterType.includes('approved')) {
            propertyCards.forEach(card => {
                card.style.display = 'block';
            });
        } else if (filterType.includes('pending')) {
            propertyCards.forEach(card => {
                card.style.display = 'none';
            });
        } else if (filterType.includes('rejected')) {
            propertyCards.forEach(card => {
                card.style.display = 'none';
            });
        }
    });
});

// Property card hover effects and actions
propertyCards.forEach(card => {
    // Add hover effect
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.12)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
    });
    
    // Add click functionality to show property details
    card.addEventListener('click', (e) => {
        if (e.target.classList.contains('property-action')) return;
        
        const title = card.querySelector('.property-title').textContent;
        alert(`Viewing details for: ${title}\n\nIn a real application, this would open a detailed view or edit form for the property.`);
    });
    
    // Add action buttons dynamically
    const propertyContent = card.querySelector('.property-content');
    const actionContainer = document.createElement('div');
    actionContainer.className = 'property-actions';
    actionContainer.style.marginTop = '15px';
    actionContainer.style.display = 'flex';
    actionContainer.style.gap = '10px';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'property-action';
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
    editBtn.style.padding = '8px 12px';
    editBtn.style.backgroundColor = 'transparent';
    editBtn.style.border = '1px solid var(--primary)';
    editBtn.style.borderRadius = '6px';
    editBtn.style.color = 'var(--primary)';
    editBtn.style.cursor = 'pointer';
    editBtn.style.fontSize = '13px';
    editBtn.style.transition = 'all 0.2s';
    
    editBtn.addEventListener('mouseenter', () => {
        editBtn.style.backgroundColor = 'var(--primary)';
        editBtn.style.color = 'white';
    });
    
    editBtn.addEventListener('mouseleave', () => {
        editBtn.style.backgroundColor = 'transparent';
        editBtn.style.color = 'var(--primary)';
    });
    
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const title = card.querySelector('.property-title').textContent;
        alert(`Editing property: ${title}`);
        // To add: edit form functionality
    });
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'property-action';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
    deleteBtn.style.padding = '8px 12px';
    deleteBtn.style.backgroundColor = 'transparent';
    deleteBtn.style.border = '1px solid var(--danger)';
    deleteBtn.style.borderRadius = '6px';
    deleteBtn.style.color = 'var(--danger)';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.fontSize = '13px';
    deleteBtn.style.transition = 'all 0.2s';
    
    deleteBtn.addEventListener('mouseenter', () => {
        deleteBtn.style.backgroundColor = 'var(--danger)';
        deleteBtn.style.color = 'white';
    });
    
    deleteBtn.addEventListener('mouseleave', () => {
        deleteBtn.style.backgroundColor = 'transparent';
        deleteBtn.style.color = 'var(--danger)';
    });
    
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const title = card.querySelector('.property-title').textContent;
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            card.style.opacity = '0.5';
            setTimeout(() => {
                alert(`Property "${title}" has been deleted.`);
                // To add: remove the property from the database
            }, 300);
        }
    });
    
    actionContainer.appendChild(editBtn);
    actionContainer.appendChild(deleteBtn);
    propertyContent.appendChild(actionContainer);
});

// Notification functionality
const notificationIcon = document.querySelector('.notification-icon');
const notificationBadge = document.querySelector('.notification-badge');

notificationIcon.addEventListener('click', () => {
    // Create notification dropdown
    const notificationDropdown = document.createElement('div');
    notificationDropdown.className = 'notification-dropdown';
    notificationDropdown.style.position = 'absolute';
    notificationDropdown.style.top = '100%';
    notificationDropdown.style.right = '0';
    notificationDropdown.style.backgroundColor = 'white';
    notificationDropdown.style.borderRadius = '8px';
    notificationDropdown.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    notificationDropdown.style.padding = '15px';
    notificationDropdown.style.width = '300px';
    notificationDropdown.style.zIndex = '100';
    
    notificationDropdown.innerHTML = `
        <h3 style="margin-bottom: 15px; font-size: 16px; color: var(--dark);">Notifications</h3>
        <div class="notification-item" style="padding: 10px; border-bottom: 1px solid var(--border);">
            <div style="font-weight: 500; margin-bottom: 5px;">New booking request</div>
            <div style="font-size: 13px; color: var(--secondary);">Someone wants to book your Modern Downtown Apartment</div>
            <div style="font-size: 12px; color: var(--gray); margin-top: 5px;">2 hours ago</div>
        </div>
        <div class="notification-item" style="padding: 10px; border-bottom: 1px solid var(--border);">
            <div style="font-weight: 500; margin-bottom: 5px;">Payment received</div>
            <div style="font-size: 13px; color: var(--secondary);">Payment for Luxury Condo has been processed</div>
            <div style="font-size: 12px; color: var(--gray); margin-top: 5px;">1 day ago</div>
        </div>
        <div class="notification-item" style="padding: 10px;">
            <div style="font-weight: 500; margin-bottom: 5px;">Review received</div>
            <div style="font-size: 13px; color: var(--secondary);">You have a new 5-star review for Modern Downtown Apartment</div>
            <div style="font-size: 12px; color: var(--gray); margin-top: 5px;">3 days ago</div>
        </div>
        <div style="text-align: center; margin-top: 10px;">
            <button id="markAllRead" style="background: none; border: none; color: var(--primary); cursor: pointer; font-size: 13px;">Mark all as read</button>
        </div>
    `;
    
    // Check if dropdown already exists
    const existingDropdown = document.querySelector('.notification-dropdown');
    if (existingDropdown) {
        existingDropdown.remove();
        return;
    }
    
    notificationIcon.appendChild(notificationDropdown);
    
    // Mark all as read functionality
    const markAllReadBtn = document.getElementById('markAllRead');
    markAllReadBtn.addEventListener('click', () => {
        notificationBadge.style.display = 'none';
        notificationDropdown.remove();
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!notificationIcon.contains(e.target)) {
            notificationDropdown.remove();
        }
    });
});

// Form validation for modal
const formInputs = document.querySelectorAll('.form-input');
formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() === '') {
            input.style.borderColor = 'var(--danger)';
        } else {
            input.style.borderColor = 'var(--border)';
        }
    });
    
    input.addEventListener('focus', () => {
        input.style.borderColor = 'var(--primary)';
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key closes modal
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
    }
    
    // Ctrl+N opens new property modal (when modal is not open)
    if (e.ctrlKey && e.key === 'n' && !modalOverlay.classList.contains('active')) {
        e.preventDefault();
        modalOverlay.classList.add('active');
    }
});

// Add some sample data for demonstration
function addSampleProperties() {
    const propertiesContainer = document.querySelector('.properties-container');
    
    // Only add if we have less than 2 properties (to avoid duplicates)
    if (propertiesContainer.children.length >= 2) return;
    
    const sampleProperties = [
        {
            title: "Cozy Studio Unit",
            location: "Quezon City, Philippines",
            rating: "4.5",
            reviews: "12",
            more: "+3 more",
            price: "₱18,000"
        },
        {
            title: "Spacious Family Home",
            location: "Pasig, Philippines",
            rating: "4.9",
            reviews: "31",
            more: "+5 more",
            price: "₱65,000"
        }
    ];
    
    sampleProperties.forEach(property => {
        const propertyCard = document.createElement('div');
        propertyCard.className = 'property-card';
        
        propertyCard.innerHTML = `
            <div class="property-image">
                <div class="image-placeholder">
                    <i class="fas fa-image"></i> ${property.title.split(' ')[0]} ${property.title.split(' ')[1]}
                </div>
            </div>
            <div class="property-content">
                <h3 class="property-title">${property.title}</h3>
                <div class="property-location">
                    <i class="fas fa-map-marker-alt"></i> ${property.location}
                </div>
                <div class="property-reviews">
                    <i class="fas fa-star"></i> ${property.rating} (${property.reviews} reviews)
                </div>
                <div class="property-more">${property.more}</div>
                <div class="property-price">${property.price}<span class="price-period">/month</span></div>
            </div>
        `;
        
        propertiesContainer.appendChild(propertyCard);
    });
}

addSampleProperties();

console.log('Safe Haven Landlord Dashboard loaded successfully!');