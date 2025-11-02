// All functionality in one DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    console.log('Safe Haven Landlord Dashboard loaded successfully!');

    // DEBUG: Check if dropdown elements exist
    const userDropdownBtn = document.getElementById('userDropdownBtn');
    const userDropdown = document.getElementById('userDropdown');
    console.log('Dropdown Button:', userDropdownBtn);
    console.log('Dropdown Menu:', userDropdown);

    // USER DROPDOWN - SIMPLE VERSION
    if (userDropdownBtn && userDropdown) {
        console.log('✅ Dropdown elements found');
        
        userDropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('🎯 Dropdown clicked!');
            userDropdown.classList.toggle('active');
        });

        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (!userDropdownBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
                console.log('🔒 Dropdown closed (outside click)');
            }
        });

        // Close dropdown when clicking on items
        const dropdownItems = document.querySelectorAll('.user-dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                userDropdown.classList.remove('active');
            });
        });
    } else {
        console.log('❌ Dropdown elements NOT found');
    }

    // NOTIFICATION FUNCTIONALITY - UPDATED
    const notificationIcon = document.querySelector('.notification-icon');
    const notificationsDropdown = document.querySelector('.notifications-dropdown');

    if (notificationIcon && notificationsDropdown) {
        console.log('✅ Notification elements found');
        
        notificationIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('🔔 Notification icon clicked');
            notificationsDropdown.classList.toggle('active');
        });

        // Close notifications when clicking outside
        document.addEventListener('click', function(e) {
            if (!notificationIcon.contains(e.target) && !notificationsDropdown.contains(e.target)) {
                notificationsDropdown.classList.remove('active');
            }
        });

        // Mark as read functionality
        const markReadButtons = document.querySelectorAll('.mark-read-btn');
        markReadButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const notificationItem = this.closest('.notification-item');
                const notificationId = notificationItem.dataset.notificationId;
                
                // Mark as read visually
                notificationItem.classList.remove('unread');
                this.style.display = 'none';
                
                // Update badge count
                updateNotificationBadge();
                
                // In a real app, you'd send AJAX request to mark as read
                console.log('Marking notification as read:', notificationId);
            });
        });

        // Mark all as read
        const markAllReadBtn = document.querySelector('.mark-all-read');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const unreadItems = document.querySelectorAll('.notification-item.unread');
                
                unreadItems.forEach(item => {
                    item.classList.remove('unread');
                    const markBtn = item.querySelector('.mark-read-btn');
                    if (markBtn) markBtn.style.display = 'none';
                });
                
                // Update badge count to 0
                const badge = document.querySelector('.notification-badge');
                if (badge) badge.style.display = 'none';
                
                // In a real app, you'd send AJAX request to mark all as read
                console.log('Marking all notifications as read');
            });
        }
    } else {
        console.log('❌ Notification elements NOT found');
    }

    // Modal functionality
    const modalOverlay = document.getElementById('modalOverlay');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    if (modalOverlay && openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            modalOverlay.classList.add('active');
        });
        
        function closeModal() {
            modalOverlay.classList.remove('active');
        }
        
        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
        
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Filter functionality
    const filterItems = document.querySelectorAll('.filter-item');
    filterItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            filterItems.forEach(filter => filter.classList.remove('active'));
            this.classList.add('active');
            
            const filterType = this.textContent.toLowerCase();
            const propertyCards = document.querySelectorAll('.property-card');
            
            propertyCards.forEach(card => {
                const status = card.getAttribute('data-status');
                if (filterType.includes('all')) {
                    card.style.display = 'block';
                } else if (filterType.includes('approved') && status === 'approved') {
                    card.style.display = 'block';
                } else if (filterType.includes('pending') && status === 'pending') {
                    card.style.display = 'block';
                } else if (filterType.includes('rejected') && status === 'rejected') {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Collapsible amenity sections
    const amenityGroups = document.querySelectorAll('.amenity-group');
    amenityGroups.forEach(group => {
        const header = group.querySelector('.amenity-header');
        if (header) {
            header.addEventListener('click', () => {
                group.classList.toggle('active');
            });
        }
    });

    // Image upload functionality
    const imageUpload = document.getElementById('imageUpload');
    const imageFileName = document.getElementById('imageFileName');
    const imageInput = document.getElementById('id_image');

    if (imageUpload && imageInput) {
        imageUpload.addEventListener('click', () => {
            imageInput.click();
        });

        imageInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const fileName = this.files[0].name;
                if (imageFileName) {
                    imageFileName.textContent = 'Selected: ' + fileName;
                    imageFileName.style.display = 'block';
                }
                imageUpload.style.borderColor = '#007bff';
                imageUpload.style.backgroundColor = '#f8f9ff';
            } else {
                if (imageFileName) {
                    imageFileName.style.display = 'none';
                }
                imageUpload.style.borderColor = '';
                imageUpload.style.backgroundColor = '';
            }
        });
    }

    // Property card hover effects
    const propertyCards = document.querySelectorAll('.property-card');
    propertyCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.12)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Escape key closes modal
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
        
        // Ctrl+N opens new property modal (when modal is not open)
        if (e.ctrlKey && e.key === 'n' && modalOverlay && !modalOverlay.classList.contains('active')) {
            e.preventDefault();
            modalOverlay.classList.add('active');
        }
    });
});

// Global functions for edit/delete property
function editProperty(propertyId) {
    console.log('Editing property:', propertyId);
    alert(`Editing property ID: ${propertyId}\n\nThis would open an edit form in a real application.`);
}

function deleteProperty(propertyId) {
    if (confirm('Are you sure you want to delete this property?')) {
        console.log('Deleting property:', propertyId);
        alert(`Property ID: ${propertyId} would be deleted in a real application.`);
    }
}

// Notification badge update function
function updateNotificationBadge() {
    const unreadCount = document.querySelectorAll('.notification-item.unread').length;
    const badge = document.querySelector('.notification-badge');
    
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}