
// All functionality in one DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function () {
    console.log('Safe Haven Landlord Dashboard loaded successfully!');

    // DEBUG: Check if dropdown elements exist
    const userDropdownBtn = document.getElementById('userDropdownBtn');
    const userDropdown = document.getElementById('userDropdown');
    console.log('Dropdown Button:', userDropdownBtn);
    console.log('Dropdown Menu:', userDropdown);

    // USER DROPDOWN - SIMPLE VERSION
    if (userDropdownBtn && userDropdown) {
        console.log('✅ Dropdown elements found');

        userDropdownBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            console.log('🎯 Dropdown clicked!');
            userDropdown.classList.toggle('active');
        });

        // Close when clicking outside
        document.addEventListener('click', function (e) {
            if (!userDropdownBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
                console.log('🔒 Dropdown closed (outside click)');
            }
        });

        // Close dropdown when clicking on items
        const dropdownItems = document.querySelectorAll('.user-dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function () {
                userDropdown.classList.remove('active');
            });
        });
    } else {
        console.log('❌ Dropdown elements NOT found');
    }


    // Notification dropdown functionality
    const notificationIcon = document.querySelector('.notification-icon');
    const notificationsDropdown = document.querySelector('.notifications-dropdown');

    console.log('🔔 DEBUG - Notification Icon found:', !!notificationIcon);
    console.log('🔔 DEBUG - Notifications Dropdown found:', !!notificationsDropdown);

    if (notificationIcon && notificationsDropdown) {
        console.log('✅ Notification elements found - adding event listeners');

        // Toggle dropdown
        notificationIcon.addEventListener('click', function (e) {
            e.stopPropagation();
            console.log('🎯 Notification icon CLICKED!');
            console.log('📂 Current display:', notificationsDropdown.style.display);
            console.log('📂 Current classes:', notificationsDropdown.className);
            notificationsDropdown.classList.toggle('active');
            console.log('📂 New classes:', notificationsDropdown.className);

        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!notificationIcon.contains(e.target) && !notificationsDropdown.contains(e.target)) {
                notificationsDropdown.classList.remove('active');
            }
        });

        // Mark as read functionality
        // Mark as read functionality
        const markReadButtons = document.querySelectorAll('.mark-read-btn');
        markReadButtons.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const notificationId = this.getAttribute('data-notification-id');
                markNotificationRead(notificationId);
            });
        });

        // Mark all as read
        const markAllReadBtn = document.querySelector('.mark-all-read');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', function () {
                markAllNotificationsRead();
            });
        }


    } else {
        console.log('❌ Notification elements NOT found');
    }

    // Toggle notification dropdown
    document.addEventListener('DOMContentLoaded', function () {
        const bellBtn = document.getElementById('notificationBellBtn');
        const dropdown = document.getElementById('notificationsDropdown');

        if (bellBtn && dropdown) {
            bellBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            });

            // Close when clicking outside
            document.addEventListener('click', function (e) {
                if (!bellBtn.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.style.display = 'none';
                }
            });
        }
    });
    // Modal functionality
    const modalOverlay = document.getElementById('modalOverlay');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    if (modalOverlay && openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            console.log("Opened Modal")
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
        item.addEventListener('click', function () {
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

    // Mark notification as read
    function markNotificationRead(notificationId) {
        fetch(`/landlord/notifications/mark-read/${notificationId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Find the notification item
                    const item = document.querySelector(`[data-notification-id="${notificationId}"]`);
                    if (item) {
                        // Remove the unread class (this removes blue background)
                        item.classList.remove('unread');

                        // Hide the mark-as-read button
                        const btn = item.querySelector('.mark-read-btn');
                        if (btn) {
                            btn.style.display = 'none';
                        }

                        // DON'T remove, hide, or modify the item itself
                        // The notification stays visible
                    }

                    // Update badge count
                    updateNotificationBadge();
                }
            })
            .catch(error => {
                console.error('Error marking notification as read:', error);
            });
    }


    // Mark all notifications as read
    function markAllNotificationsRead() {
        fetch('/landlord/notifications/mark-all-read/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Mark all as read, don't remove
                    document.querySelectorAll('.notification-item.unread').forEach(item => {
                        item.classList.remove('unread');
                        item.querySelector('.mark-read-btn').style.display = 'none';
                    });

                    // Remove badge
                    const badge = document.querySelector('.notification-badge');
                    if (badge) {
                        badge.remove();
                    }

                    // Hide footer
                    const footer = document.querySelector('.notifications-footer');
                    if (footer) {
                        footer.style.display = 'none';
                    }

                    // Update unread count text
                    const unreadCount = document.querySelector('.unread-count');
                    if (unreadCount) {
                        unreadCount.remove();
                    }
                }
            });
    }


    // Update notification badge count
    function updateNotificationBadge() {
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        const badge = document.querySelector('.notification-badge');
        const countText = document.querySelector('.unread-count');

        if (unreadCount === 0) {
            if (badge) badge.remove();
            if (countText) countText.remove();
            const footer = document.querySelector('.notifications-footer');
            if (footer) footer.style.display = 'none';
        } else {
            if (badge) badge.textContent = unreadCount;
            if (countText) countText.textContent = `${unreadCount} unread`;
        }
    }

    // Image upload functionality
    const imageUpload = document.getElementById('imageUpload');
    const imageFileName = document.getElementById('imageFileName');
    const imageInput = document.getElementById('id_image');

    if (imageUpload && imageInput) {
        imageUpload.addEventListener('click', () => {
            imageInput.click();
            console.log("Image Picker opened!")
        });

        imageInput.addEventListener('change', function (e) {
            if (this.files && this.files[0]) {
                const fileName = this.files[0].name;
                console.log(imageInput.files)

                if (imageFileName) {
                    imageFileName.textContent = 'Selected: ' + fileName;

                    console.log("Selected:", fileName)
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

        // Find and update the delete button
        const deleteBtn = card.querySelector('.btn-delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                const propertyId = this.getAttribute('data-property-id');
                console.log('🗑️ Delete clicked for property ID:', propertyId);
                deleteProperty(propertyId, card);
            });
        }
    });

    // REAL DELETE FUNCTION
    // REAL DELETE FUNCTION (WITH CUSTOM MODAL)
    window.deleteProperty = function(propertyId, cardElement) {
        console.log('🔥 deleteProperty called with ID:', propertyId);
        

        showCustomConfirm(
            'Delete Property',
            'Are you sure you want to delete this property? This action cannot be undone.',
            function () {
                // Show loading state
                cardElement.style.opacity = '0.5';
                const deleteBtn = cardElement.querySelector('.btn-delete');
                if (deleteBtn) {
                    deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
                    deleteBtn.disabled = true;
                }

                // Send DELETE request to server
                fetch(`/landlord/delete-property/${propertyId}/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken'),
                        'Content-Type': 'application/json',
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            // Success - remove card with animation
                            cardElement.style.transition = 'all 0.3s ease';
                            cardElement.style.height = cardElement.offsetHeight + 'px';
                            cardElement.offsetHeight; // Force reflow
                            cardElement.style.height = '0';
                            cardElement.style.opacity = '0';
                            cardElement.style.margin = '0';
                            cardElement.style.padding = '0';

                            setTimeout(() => {
                                cardElement.remove();
                                // Show success message
                                showNotification('Property deleted successfully', 'success');
                            }, 300);
                        } else {
                            // Error - reset button state
                            if (deleteBtn) {
                                deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
                                deleteBtn.disabled = false;
                            }
                            cardElement.style.opacity = '1';
                            showNotification(data.message || 'Error deleting property', 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        if (deleteBtn) {
                            deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
                            deleteBtn.disabled = false;
                        }
                        cardElement.style.opacity = '1';
                        showNotification('Error deleting property', 'error');
                    });
            }
        );
    }

    // EDIT PROPERTY FUNCTIONALITY
    function editProperty(propertyId) {
        console.log('✏️ Edit clicked for property:', propertyId);

        // Show loading state
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            submitBtn.disabled = true;
        }

        // Fetch property data
        fetch(`/landlord/edit-property/${propertyId}/`)
            .then(response => response.json())
            .then(propertyData => {
                console.log('📦 Property data loaded:', propertyData);

                // Populate form with property data
                populateEditForm(propertyData);

                // Change modal to edit mode
                document.getElementById('modalTitle').textContent = 'Edit Property';
                document.getElementById('modalSubtitle').textContent = 'Update your property details';
                document.getElementById('formAction').value = 'edit';
                document.getElementById('propertyId').value = propertyId;
                document.getElementById('submitBtn').textContent = 'Update Property';

                // Show modal
                document.getElementById('modalOverlay').classList.add('active');

                // Reset button state
                if (submitBtn) {
                    submitBtn.innerHTML = 'Update Property';
                    submitBtn.disabled = false;
                }
            })
            .catch(error => {
                console.error('💥 Error loading property data:', error);
                showNotification('Error loading property data', 'error');
                if (submitBtn) {
                    submitBtn.innerHTML = 'Update Property';
                    submitBtn.disabled = false;
                }
            });
    }

    // POPULATE FORM WITH PROPERTY DATA
    function populateEditForm(propertyData) {
        // Basic fields
        document.getElementById('id_property_name').value = propertyData.property_name || '';
        document.getElementById('id_location').value = propertyData.location || '';
        document.getElementById('id_price').value = propertyData.price || '';
        document.getElementById('id_beds').value = propertyData.beds || '';
        document.getElementById('id_bathrooms').value = propertyData.bathrooms || '';
        document.getElementById('id_area').value = propertyData.area || '';
        document.getElementById('id_property_description').value = propertyData.property_description || '';

        // Checkbox fields
        const checkboxes = [
            'electricity', 'water', 'internet', 'airconditioning', 'kitchen', 'shared_kitchen',
            'private_bathroom', 'shared_bathroom', 'secure_locks', 'cctv', 'gated_compound',
            'security_guard', 'parking', 'furnished', 'pet_friendly'
        ];

        checkboxes.forEach(field => {
            const checkbox = document.getElementById(`id_${field}`);
            if (checkbox) {
                checkbox.checked = propertyData[field] || false;
            }
        });

        // Show current image if exists
        if (propertyData.image_url) {
            const imageFileName = document.getElementById('imageFileName');
            if (imageFileName) {
                imageFileName.textContent = 'Current: ' + propertyData.image_url.split('/').pop();
                imageFileName.style.display = 'block';
            }
        }
    }

    // UPDATE FORM SUBMISSION HANDLER
    function setupFormSubmission() {
        const propertyForm = document.getElementById('propertyForm');
        if (propertyForm) {
            propertyForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const formAction = document.getElementById('formAction').value;
                const propertyId = document.getElementById('propertyId').value;
                const submitBtn = document.getElementById('submitBtn');

                // Show loading state
                if (submitBtn) {
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
                    submitBtn.disabled = true;
                }

                console.log(imageInput.files); // before creating FormData

                const formData = new FormData(this);

                let url = '/landlord/add-property/';
                if (formAction === 'edit') {
                    url = `/landlord/edit-property/${propertyId}/`;
                }

                fetch(url, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            showNotification(data.message, 'success');
                            closeModal();
                            // Reload page to see changes
                            setTimeout(() => {
                                window.location.reload();
                            }, 1500);
                        } else {
                            showNotification(data.message, 'error');
                            // Reset button state on error
                            if (submitBtn) {
                                submitBtn.innerHTML = formAction === 'edit' ? 'Update Property' : 'Submit for Approval';
                                submitBtn.disabled = false;
                            }
                        }
                    })
                    .catch(error => {
                        console.error('💥 Form submission error:', error);
                        showNotification('Error saving property', 'error');
                        if (submitBtn) {
                            submitBtn.innerHTML = formAction === 'edit' ? 'Update Property' : 'Submit for Approval';
                            submitBtn.disabled = false;
                        }
                    });
            });
        }
    }

    // UPDATE EDIT BUTTON EVENT LISTENERS
    function setupEditButtons() {
        console.log('🔄 Setting up edit buttons...');

        const editButtons = document.querySelectorAll('.btn-edit');
        console.log('Found edit buttons:', editButtons.length);

        editButtons.forEach((btn, index) => {
            const propertyId = btn.getAttribute('data-property-id');
            console.log(`Setting up edit button ${index + 1} for property:`, propertyId);

            // Remove any existing event listeners by cloning
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);

            // Add click event to the new button
            newBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎯 Edit button CLICKED for property:', propertyId);
                editProperty(propertyId);
            });

            console.log('✅ Edit button setup complete for property:', propertyId);
        });
    }

    // HELPER FUNCTIONS
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transition: all 0.3s ease;
            ${type === 'success' ? 'background: #10b981;' : ''}
            ${type === 'error' ? 'background: #ef4444;' : ''}
            ${type === 'info' ? 'background: #3b82f6;' : ''}
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Reset modal to add mode when closed
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function (e) {
            if (e.target === modalOverlay) {
                // Reset to add mode when modal closes
                document.getElementById('modalTitle').textContent = 'Add New Property';
                document.getElementById('modalSubtitle').textContent = 'Fill in the details below to list a new property';
                document.getElementById('formAction').value = 'add';
                document.getElementById('submitBtn').textContent = 'Submit for Approval';
                document.getElementById('propertyForm').reset();
            }
        });
    }

    // INITIALIZE EVERYTHING
    setupFormSubmission();
    setupEditButtons();
});


// ============================================
// CUSTOM CONFIRMATION MODAL (NO BROWSER ALERTS)
// ============================================
let confirmCallback = null;

window.showCustomConfirm = function (title, message, onConfirm) {
    console.log('🚨 showCustomConfirm CALLED!', title, message);

    const modal = document.getElementById('customConfirmModal');
    const content = document.querySelector('.custom-modal-content');

        // ✅ FORCE MOVE TO BODY IF IT'S SOMEWHERE ELSE
    if (modal && modal.parentElement.tagName !== 'BODY') {
        console.log('⚠️ Moving modal from', modal.parentElement.tagName, 'to BODY');
        document.body.appendChild(modal);
    
        
    const titleEl = document.getElementById('confirmModalTitle');
    const messageEl = document.getElementById('confirmModalMessage');
    const confirmBtn = document.getElementById('confirmModalBtn');

    
    if (!modal) {
        console.error('Custom confirm modal not found!');
        return;
    }

    // Set content
    titleEl.textContent = title;
    messageEl.textContent = message;

    // Store callback
    confirmCallback = onConfirm;

    confirmBtn.onclick = function() {
        console.log('✅ Confirm clicked!');
        if (confirmCallback) {
            confirmCallback();
        }
        closeCustomConfirm();
    };

    // SHOW the modal
    modal.style.display = 'flex';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';

    if (content) {
        content.style.width = '90%';
        content.style.maxWidth = '450px';
    }

    // Force reflow
    modal.offsetHeight;

    // Add active class to MODAL (not inner div)
    modal.classList.add('active');
}

    // Debug: Check what's visible
    console.log('Modal rect:', modal.getBoundingClientRect());
    console.log('Modal z-index:', getComputedStyle(modal).zIndex);
    console.log('Modal parent:', modal.parentElement);
    console.log('Modal parent HTML:', modal.parentElement.outerHTML);
    
}

window.closeCustomConfirm = function () {
    const modal = document.getElementById('customConfirmModal');
    if (modal) {
        modal.style.display = 'none';  // ✅ Immediate
        modal.style.visibility = 'hidden';
        modal.classList.remove('active');
    }
    confirmCallback = null;
}

// Close modal when clicking outside
document.addEventListener('click', function (e) {
    const modal = document.getElementById('customConfirmModal');
    const modalContent = document.querySelector('.custom-modal-content');
    if (modal && e.target === modal) {
        closeCustomConfirm();
    }
});

// Close modal on ESC key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeCustomConfirm();
    }
});
