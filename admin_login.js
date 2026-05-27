document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEYS = window.MXStore?.keys || {
        user: 'mamxanh_user',
        session: 'mamxanh_session'
    };

    const session = localStorage.getItem(STORAGE_KEYS.session);
    if (session) {
        try {
            const sessionData = JSON.parse(session);
            if (sessionData.role === 'admin') {
                window.location.href = 'dashboard.html';
                return;
            }
        } catch {}
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
        inputWrapper.style.backgroundColor = '#fde8e8';
        inputWrapper.style.outline = '1px solid #B42318';
    }

    emailInput.addEventListener('input', () => {
        if (emailWrapper.classList.contains('error')) {
            clearErrors();
            emailWrapper.style.backgroundColor = '';
            emailWrapper.style.outline = '';
        }
    });

    passwordInput.addEventListener('input', () => {
        if (passwordWrapper.classList.contains('error')) {
            clearErrors();
            passwordWrapper.style.backgroundColor = '';
            passwordWrapper.style.outline = '';
        }
    });

    emailWrapper.addEventListener('click', () => emailInput.focus());
    passwordWrapper.addEventListener('click', () => passwordInput.focus());

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        if (!email) {
            showError(emailWrapper, emailError, 'Vui lòng nhập địa chỉ email');
            return;
        }

        if (!password) {
            showError(passwordWrapper, passwordError, 'Vui lòng nhập mật khẩu');
            return;
        }

        if (email === 'admin@mamxanh.vn' && password === '123456') {
            const sessionData = {
                email: email,
                name: 'Quản trị Mầm Xanh',
                role: 'admin',
                loginAt: new Date().toISOString(),
                rememberMe: Boolean(rememberMe?.checked)
            };
            localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(sessionData));
            window.location.href = 'dashboard.html';
        } else {
            showError(passwordWrapper, passwordError, 'Email hoặc mật khẩu không đúng');
        }
    });

    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Vui lòng liên hệ quản trị hệ thống để khôi phục mật khẩu.');
        });
    }
});
