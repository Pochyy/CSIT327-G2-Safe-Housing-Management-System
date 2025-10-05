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
