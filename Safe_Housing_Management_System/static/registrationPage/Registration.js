function selectUserType(element) {
    document.querySelectorAll('.user-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');
    const radioInput = element.querySelector('input[type="radio"]');
    radioInput.checked = true;
}
 
document.getElementById('confirm_password').addEventListener('input', function() {
    const password = document.getElementById('password').value;
    const confirmPassword = this.value;
   
    if (password !== confirmPassword) {
        this.style.borderColor = '#e74c3c';
    } else {
        this.style.borderColor = '#27ae60';
    }
});
 
// Modal functionality
const termsModal = document.getElementById('termsModal');
const privacyModal = document.getElementById('privacyModal');
const termsLink = document.getElementById('termsLink');
const privacyLink = document.getElementById('privacyLink');
const closeButtons = document.querySelectorAll('.close');
 
// Open Terms Modal
termsLink.addEventListener('click', function(e) {
    e.preventDefault();
    termsModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
});
 
// Open Privacy Modal
privacyLink.addEventListener('click', function(e) {
    e.preventDefault();
    privacyModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
});
 
// Close modals when clicking X
closeButtons.forEach(button => {
    button.addEventListener('click', function() {
        termsModal.style.display = 'none';
        privacyModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    });
});
 
// Close modals when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === termsModal) {
        termsModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    if (e.target === privacyModal) {
        privacyModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});
 
// Close modals with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        termsModal.style.display = 'none';
        privacyModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});
 
// Form validation for terms checkbox
document.getElementById('registerForm').addEventListener('submit', function(e) {
    const termsCheckbox = document.getElementById('terms');
    if (!termsCheckbox.checked) {
        e.preventDefault();
        alert('Please agree to the Terms of Service and Privacy Policy to continue.');
        termsCheckbox.focus();
    }
});