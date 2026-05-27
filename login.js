document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEYS = window.MXStore?.keys || {
        user: 'mamxanh_user',
        session: 'mamxanh_session'
    };
    const DEMO_USERS = [
        {
            email: 'admin@mamxanh.vn',
            password: '123456',
            name: 'Quản trị Mầm Xanh',
            role: 'admin',
            redirectTo: 'admin/dashboard.html'
        },
        {
            email: 'user@mamxanh.vn',
            password: '123456',
            name: 'Khách hàng Mầm Xanh',
            role: 'customer',
            redirectTo: 'index.html'
        }
    ];

    // Redirect if already logged in
    const session = localStorage.getItem(STORAGE_KEYS.session);
    if (session) {
        window.location.href = 'index.html';
        return;
    }

    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailWrapper = document.getElementById('email-wrapper');
    const passwordWrapper = document.getElementById('password-wrapper');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const forgotLink = document.getElementById('forgot-password');
    const rememberMe = document.getElementById('remember-me');

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

    function setInputErrorStyle(wrapper, hasError) {
        if (hasError) {
            wrapper.style.backgroundColor = '#fde8e8';
            wrapper.style.outline = '1px solid #B42318';
        } else {
            wrapper.style.backgroundColor = '';
            wrapper.style.outline = '';
        }
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

    function getStoredUsers() {
        const stored = readJson(STORAGE_KEYS.user, null);
        if (!stored) return [];
        if (Array.isArray(stored)) return stored;
        return [stored];
    }

    function findUser(email, password) {
        const normalizedEmail = normalizeEmail(email);
        const users = [...getStoredUsers(), ...DEMO_USERS];
        return users.find((user) => {
            const userEmail = normalizeEmail(user.email || user.username);
            return userEmail === normalizedEmail && String(user.password || '') === String(password || '');
        }) || null;
    }

    function saveSession(user, remember) {
        const sessionData = {
            email: normalizeEmail(user.email || user.username),
            name: user.name || user.fullname || user.email || 'Mầm Xanh',
            role: user.role || 'customer',
            loginAt: new Date().toISOString(),
            rememberMe: Boolean(remember)
        };
        localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(sessionData));

        const existingUser = readJson(STORAGE_KEYS.user, null) || {};
        if (!Array.isArray(existingUser)) {
            localStorage.setItem(STORAGE_KEYS.user, JSON.stringify({
                ...existingUser,
                email: sessionData.email,
                name: sessionData.name,
                role: sessionData.role
            }));
        }

        window.location.href = user.redirectTo || 'index.html';
    }

    // Clear error on input
    emailInput.addEventListener('input', () => {
        if (emailWrapper.classList.contains('error')) {
            clearErrors();
            setInputErrorStyle(emailWrapper, false);
        }
    });

    passwordInput.addEventListener('input', () => {
        if (passwordWrapper.classList.contains('error')) {
            clearErrors();
            setInputErrorStyle(passwordWrapper, false);
        }
    });

    emailWrapper.addEventListener('click', () => emailInput.focus());
    passwordWrapper.addEventListener('click', () => passwordInput.focus());

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
        }

        if (!password) {
            showError(passwordWrapper, passwordError, 'Vui lòng nhập mật khẩu');
            setInputErrorStyle(passwordWrapper, true);
            hasError = true;
        }

        if (hasError) return;

        const user = findUser(email, password);

        if (user) {
            saveSession(user, rememberMe?.checked);
        } else {
            showError(passwordWrapper, passwordError, 'Email hoặc mật khẩu không đúng');
            setInputErrorStyle(passwordWrapper, true);
        }
    });

    // Forgot password
    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Chức năng khôi phục mật khẩu sẽ được gửi email (mock)');
        });
    }

    // Social login buttons
    const btnGoogle = document.getElementById('btn-google');
    const btnApple = document.getElementById('btn-apple');

    if (btnGoogle) {
        btnGoogle.addEventListener('click', () => {
            saveSession({
                email: 'google.user@mamxanh.vn',
                name: 'Google User',
                role: 'customer',
                redirectTo: 'index.html'
            }, true);
        });
    }

    if (btnApple) {
        btnApple.addEventListener('click', () => {
            saveSession({
                email: 'apple.user@mamxanh.vn',
                name: 'Apple User',
                role: 'customer',
                redirectTo: 'index.html'
            }, true);
        });
    }
});
