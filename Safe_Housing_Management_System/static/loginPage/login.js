document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.querySelector('input[name="remember"]');

    // Autofill username and set "Remember Me" if stored
    const savedUsername = localStorage.getItem('rememberedUsername');
    const savedPasswordHash = localStorage.getItem('rememberedPasswordHash');
    if (savedUsername && savedPasswordHash) {
        usernameInput.value = savedUsername;
        passwordInput.value = ""; // Do not autofill hash, let user enter password
        rememberCheckbox.checked = true;
    }

    loginForm.addEventListener('submit', function(e) {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username === '' || password === '') {
            e.preventDefault();
            alert('Please enter both username and password.');
            return;
        }

        // Save username and hashed password if "Remember Me" is checked
        if (rememberCheckbox.checked) {
            localStorage.setItem('rememberedUsername', username);
            if (window.CryptoJS) {
                const passwordHash = CryptoJS.SHA256(password).toString();
                localStorage.setItem('rememberedPasswordHash', passwordHash);
            }
        } else {
            localStorage.removeItem('rememberedUsername');
            localStorage.removeItem('rememberedPasswordHash');
        }
    });
});