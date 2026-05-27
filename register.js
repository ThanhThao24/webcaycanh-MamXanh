document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEYS = window.MXStore?.keys || {
        user: 'mamxanh_user',
        session: 'mamxanh_session'
    };

    // Redirect if already logged in
    const isLoggedIn = localStorage.getItem(STORAGE_KEYS.session);
    if (isLoggedIn) {
        window.location.href = 'index.html';
        return;
    }

    const form = document.getElementById('registerForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailWrapper = document.getElementById('email-wrapper');
    const passwordWrapper = document.getElementById('password-wrapper');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    function clearErrors() {
        emailWrapper.classList.remove('error');
        passwordWrapper.classList.remove('error');
        emailError.style.display = 'none';
        emailError.textContent = '';
        passwordError.style.display = 'none';
        passwordError.textContent = '';
    }

    function showError(inputWrapper, errorEl, message) {
        inputWrapper.classList.add('error');
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function normalizeEmail(value) {
        return String(value || '').trim().toLowerCase();
    }

    function readJson(key, fallback = null) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    }

    function setInputErrorStyle(wrapper, hasError) {
        if (hasError) {
            wrapper.style.backgroundColor = '#fde8e8';
            wrapper.style.outline = '1px solid #B42318';
        } else {
            wrapper.style.backgroundColor = '';
            wrapper.style.outline = '';
        }
    }

    // Real-time validation on blur
    emailInput.addEventListener('blur', () => {
        if (emailInput.value && !validateEmail(emailInput.value)) {
            showError(emailWrapper, emailError, 'Email không hợp lệ');
            setInputErrorStyle(emailWrapper, true);
        } else {
            clearErrors();
            setInputErrorStyle(emailWrapper, false);
        }
    });

    passwordInput.addEventListener('blur', () => {
        if (passwordInput.value && passwordInput.value.length < 6) {
            showError(passwordWrapper, passwordError, 'Mật khẩu phải có ít nhất 6 ký tự');
            setInputErrorStyle(passwordWrapper, true);
        } else {
            setInputErrorStyle(passwordWrapper, false);
        }
    });

    // Clear error on input
    emailInput.addEventListener('input', () => {
        if (emailWrapper.classList.contains('error')) {
            clearErrors();
            setInputErrorStyle(emailWrapper, false);
        }
    });

    emailWrapper.addEventListener('click', () => emailInput.focus());
    passwordWrapper.addEventListener('click', () => passwordInput.focus());

    passwordInput.addEventListener('input', () => {
        if (passwordWrapper.classList.contains('error')) {
            clearErrors();
            setInputErrorStyle(passwordWrapper, false);
        }
    });

    // Form submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();
        setInputErrorStyle(emailWrapper, false);
        setInputErrorStyle(passwordWrapper, false);

        const email = normalizeEmail(emailInput.value);
        const password = passwordInput.value;

        let hasError = false;

        if (!email) {
            showError(emailWrapper, emailError, 'Vui lòng nhập địa chỉ email');
            setInputErrorStyle(emailWrapper, true);
            hasError = true;
        } else if (!validateEmail(email)) {
            showError(emailWrapper, emailError, 'Email không hợp lệ');
            setInputErrorStyle(emailWrapper, true);
            hasError = true;
        }

        if (!password) {
            showError(passwordWrapper, passwordError, 'Vui lòng nhập mật khẩu');
            setInputErrorStyle(passwordWrapper, true);
            hasError = true;
        } else if (password.length < 6) {
            showError(passwordWrapper, passwordError, 'Mật khẩu phải có ít nhất 6 ký tự');
            setInputErrorStyle(passwordWrapper, true);
            hasError = true;
        }

        if (hasError) return;

        const existing = readJson(STORAGE_KEYS.user, null);
        const existingUsers = Array.isArray(existing) ? existing : existing ? [existing] : [];
        if (existingUsers.some(user => normalizeEmail(user.email || user.username) === email)) {
            showError(emailWrapper, emailError, 'Email này đã được đăng ký');
            setInputErrorStyle(emailWrapper, true);
            return;
        }

        // Mock registration: save user to localStorage
        const userData = {
            email: email,
            password: password,
            name: email.split('@')[0],
            role: 'customer',
            createdAt: new Date().toISOString()
        };
        const nextValue = Array.isArray(existing)
            ? [...existingUsers, userData]
            : existing
                ? [...existingUsers, userData]
                : userData;
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(nextValue));

        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        window.location.href = 'login.html';
    });

    // Social login buttons
    const btnGoogle = document.getElementById('btn-google');
    const btnApple = document.getElementById('btn-apple');

    if (btnGoogle) {
        btnGoogle.addEventListener('click', () => {
            alert('Đăng nhập Google (mock)');
        });
    }

    if (btnApple) {
        btnApple.addEventListener('click', () => {
            alert('Đăng nhập Apple (mock)');
        });
    }
});
