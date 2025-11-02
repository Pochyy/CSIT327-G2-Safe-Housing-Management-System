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

    // Notification functionality
    const notificationIcon = document.querySelector('.notification-icon');
    if (notificationIcon) {
        notificationIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            alert('Notification dropdown would open here with 3 new notifications');
        });
    }

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

        // Find and update the delete button
        const deleteBtn = card.querySelector('.btn-delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const propertyId = this.getAttribute('data-property-id'); 
                console.log('🗑️ Delete clicked for property ID:', propertyId);
                deleteProperty(propertyId, card);
            });
        }
    });

    // REAL DELETE FUNCTION
    function deleteProperty(propertyId, cardElement) {
        if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
            // Show loading state
            cardElement.style.opacity = '0.5';
            const deleteBtn = cardElement.querySelector('.btn-delete');
            if (deleteBtn) {
                deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
                deleteBtn.disabled = true;
            }

            // Send DELETE request to server
            fetch(`/landlord/delete-property/${propertyId}/`, {
                method: 'DELETE',
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
            propertyForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formAction = document.getElementById('formAction').value;
                const propertyId = document.getElementById('propertyId').value;
                const submitBtn = document.getElementById('submitBtn');
                
                // Show loading state
                if (submitBtn) {
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
                    submitBtn.disabled = true;
                }
                
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
            newBtn.addEventListener('click', function(e) {
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
        modalOverlay.addEventListener('click', function(e) {
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