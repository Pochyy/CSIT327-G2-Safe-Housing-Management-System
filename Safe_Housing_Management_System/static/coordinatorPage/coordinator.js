// Coordinator Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Coordinator Dashboard loaded');
    
    // Initialize user dropdown
    const userDropdownBtn = document.getElementById('userDropdownBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userDropdownBtn && userDropdown) {
        userDropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userDropdownBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });
    }
    
    // Confirm approve/reject actions
    const approveButtons = document.querySelectorAll('.btn-approve');
    const rejectButtons = document.querySelectorAll('.btn-reject');
    
    approveButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const form = this.closest('form');
            showCustomConfirm(
                'Approve Property',
                'Are you sure you want to approve this property? It will become visible to renters.',
                function() {
                    if (form) form.submit();
                }
            );
        });
    });
    
    rejectButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Don't prevent default for reject - goes to reject form
            console.log('Reject button clicked');
        });
    });
    
    // Filter functionality
    const filterItems = document.querySelectorAll('.filter-item');
    if (filterItems.length > 0) {
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
                    } else if (filterType.includes('pending') && status === 'pending') {
                        card.style.display = 'block';
                    } else if (filterType.includes('approved') && status === 'approved') {
                        card.style.display = 'block';
                    } else if (filterType.includes('rejected') && status === 'rejected') {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
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
    
    // Close modal when clicking outside
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
});

// Property details modal functions
function showPropertyDetails(propertyId) {
    console.log('Loading property details for ID:', propertyId);
    
    // Show loading state
    const modal = document.getElementById('detailsModal');
    const content = document.getElementById('propertyDetailsContent');
    content.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p style="margin-top: 20px; color: #6b7280;">Loading property details...</p>
        </div>
    `;
    modal.classList.add('active');
    
    // Fetch property details via AJAX
    fetch(`/coordinator/property/details/${propertyId}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Property details loaded:', data);
            
            // Format amenities list
            let amenitiesList = '';
            if (data.amenities && data.amenities.length > 0) {
                data.amenities.forEach(amenity => {
                    amenitiesList += `<div class="amenity-badge">${amenity}</div>`;
                });
            } else {
                amenitiesList = '<p>No amenities listed</p>';
            }
            
            // Format status badge
            let statusBadge = '';
            if (data.status === 'Pending') {
                statusBadge = '<span class="status-badge status-pending">Pending</span>';
            } else if (data.status === 'Approved') {
                statusBadge = '<span class="status-badge status-approved">Approved</span>';
            } else if (data.status === 'Rejected') {
                statusBadge = '<span class="status-badge status-rejected">Rejected</span>';
            }
            
            // Populate modal with property details
            content.innerHTML = `
                <div class="details-grid">
                    <div>
                        <h3 style="margin-bottom: 10px; color: #2C6E6F;">
                            <i class="fas fa-home"></i> Property Information
                        </h3>
                        <p><strong>Name:</strong> ${data.property_name}</p>
                        <p><strong>Location:</strong> ${data.location}</p>
                        <p><strong>Price:</strong> ₱${parseFloat(data.price).toLocaleString()}/month</p>
                        <p><strong>Size:</strong> ${data.area} sq ft</p>
                        <p><strong>Bedrooms:</strong> ${data.beds}</p>
                        <p><strong>Bathrooms:</strong> ${data.bathrooms}</p>
                        <p><strong>Status:</strong> ${statusBadge}</p>
                    </div>
                    <div>
                        <h3 style="margin-bottom: 10px; color: #2C6E6F;">
                            <i class="fas fa-user"></i> Landlord Information
                        </h3>
                        <p><strong>Name:</strong> ${data.landlord_name}</p>
                        <p><strong>Email:</strong> ${data.landlord_email}</p>
                        <p><strong>Phone:</strong> ${data.landlord_phone || 'Not provided'}</p>
                        <p><strong>Member since:</strong> ${data.landlord_joined}</p>
                    </div>
                </div>
                
                <div class="details-section">
                    <h3 style="margin-bottom: 10px; color: #2C6E6F;">
                        <i class="fas fa-align-left"></i> Description
                    </h3>
                    <p style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; line-height: 1.6;">
                        ${data.property_description || 'No description provided'}
                    </p>
                </div>
                
                <div class="details-section">
                    <h3 style="margin-bottom: 10px; color: #2C6E6F;">
                        <i class="fas fa-check-circle"></i> Amenities & Features
                    </h3>
                    <div class="amenities-grid">
                        ${data.amenities_html || '<p>No amenities listed</p>'}
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeDetailsModal()">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error loading property details:', error);
            content.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #ef4444;"></i>
                    <p style="margin-top: 20px; color: #ef4444;">
                        Error loading property details. Please try again.
                    </p>
                    <button type="button" class="btn btn-secondary" onclick="closeDetailsModal()">
                        Close
                    </button>
                </div>
            `;
        });
}

function closeDetailsModal() {
    document.getElementById('detailsModal').classList.remove('active');
}

// Show notification
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
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Helper function to get CSRF token
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

// Rejection Modal Functions
function showRejectModal() {
    const modal = document.getElementById('rejectModal');
    if (modal) {
        modal.style.cssText = 'display: flex !important; position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; z-index: 99999 !important; background: rgba(0, 0, 0, 0.6) !important; align-items: center !important; justify-content: center !important; visibility: visible !important; opacity: 1 !important;';
    }
}

function closeRejectModal() {
    const modal = document.getElementById('rejectModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Make functions globally accessible
window.showRejectModal = showRejectModal;
window.closeRejectModal = closeRejectModal;


// Toggle inline rejection form
function toggleRejectForm() {
    const form = document.getElementById('rejectFormSection');
    if (form.style.display === 'none') {
        form.style.display = 'block';
        // Smooth scroll to form
        setTimeout(() => {
            form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    } else {
        form.style.display = 'none';
    }
}

window.toggleRejectForm = toggleRejectForm;

// Review History Instant Filtering (No Page Reload)
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-tab-simple');
    const tableRows = document.querySelectorAll('.history-table tbody tr');
    
    if (filterButtons.length > 0 && tableRows.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter type
                const filterType = this.getAttribute('data-filter');
                
                // Filter rows
                tableRows.forEach(row => {
                    const statusBadge = row.querySelector('.status-badge-table');
                    
                    if (!statusBadge) {
                        row.style.display = 'none';
                        return;
                    }
                    
                    const isApproved = statusBadge.classList.contains('approved');
                    const isRejected = statusBadge.classList.contains('rejected');
                    
                    if (filterType === 'all') {
                        row.style.display = '';
                    } else if (filterType === 'approved' && isApproved) {
                        row.style.display = '';
                    } else if (filterType === 'rejected' && isRejected) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        });
    }
});

// ============================================
// CUSTOM CONFIRMATION MODAL (NO BROWSER ALERTS)
// ============================================
let confirmCallback = null;

window.showCustomConfirm = function(title, message, onConfirm) {
    const modal = document.getElementById('customConfirmModal');
    const titleEl = document.getElementById('confirmModalTitle');
    const messageEl = document.getElementById('confirmModalMessage');
    const confirmBtn = document.getElementById('confirmModalBtn');
    
    if (!modal) {
        console.error('Custom confirm modal not found!');
        return;
    }
    
    titleEl.textContent = title;
    messageEl.textContent = message;
    modal.classList.add('active');
    
    confirmCallback = onConfirm;
    
    // Handle confirm button click
    confirmBtn.onclick = function() {
        if (confirmCallback) {
            confirmCallback();
        }
        closeCustomConfirm();
    };
}

window.closeCustomConfirm = function() {
    const modal = document.getElementById('customConfirmModal');
    if (modal) {
        modal.classList.remove('active');
    }
    confirmCallback = null;
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('customConfirmModal');
    if (modal && e.target === modal) {
        closeCustomConfirm();
    }
});

// Close modal on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeCustomConfirm();
    }
});

