document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.querySelector('input[name="remember"]');

    // Only autofill username if "Remember Me" was checked
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
        usernameInput.value = savedUsername;
        rememberCheckbox.checked = true;
        passwordInput.focus(); // Move cursor to password field
    }

    loginForm.addEventListener('submit', function(e) {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username === '' || password === '') {
            e.preventDefault();
            alert('Please enter both username and password.');
            return;
        }

        // Only store username (never store passwords or hashes in localStorage)
        if (rememberCheckbox.checked) {
            localStorage.setItem('rememberedUsername', username);
        } else {
            localStorage.removeItem('rememberedUsername');
        }
    });
});