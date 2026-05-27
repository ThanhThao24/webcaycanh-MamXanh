document.addEventListener('DOMContentLoaded', () => {
    const CART_KEY = 'mamxanh_cart';
    const ORDERS_KEY = 'mamxanh_orders';
    const PROMO_KEY = 'mamxanh_promo';
    const cartStorageCountKey = 'mx_cart_count';

    let cart = [];
    let appliedPromo = null;
    let discountAmount = 0;

    // Promo codes
    const PROMO_CODES = {
        'NEW15': { type: 'percent', value: 15, label: 'Giảm 15%' },
        'MAMXANH10': { type: 'percent', value: 10, label: 'Giảm 10%' },
        'FREESHIP': { type: 'shipping', value: 0, label: 'Miễn phí vận chuyển' }
    };

    // Mock product images for when image is missing
    const DEFAULT_IMG = 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200&h=250&fit=crop';

    function loadCart() {
        if (window.MXStore) {
            cart = window.MXStore.getCart();
            return;
        }
        try {
            cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch (e) {
            cart = [];
        }
    }

    function saveCart() {
        if (window.MXStore) {
            window.MXStore.saveCart(cart);
            return;
        }
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function getProductImage(product) {
        if (product.image) return product.image;
        if (product.images && product.images.length > 0) return product.images[0];
        return DEFAULT_IMG;
    }

    function formatPrice(price) {
        return window.MXStore ? window.MXStore.formatPrice(price) : Number(price).toLocaleString('vi-VN') + 'đ';
    }

    function showToast(message, type = 'error') {
        const container = document.getElementById('toast-container');
        if (container) {
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.textContent = message;
            container.appendChild(toast);
            setTimeout(() => {
                toast.style.animation = 'toastOut 0.3s ease forwards';
                setTimeout(() => toast.remove(), 300);
            }, 2500);
            return;
        }

        const existing = document.querySelector('.checkout-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `checkout-toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    function renderSidebarItems() {
        const container = document.getElementById('sidebar-items');
        const emptyEl = document.getElementById('sidebar-empty');

        if (cart.length === 0) {
            if (emptyEl) emptyEl.style.display = '';
            return;
        }

        if (emptyEl) emptyEl.style.display = 'none';

        // Clear existing items (keep empty div)
        container.querySelectorAll('.sidebar-item').forEach(el => el.remove());

        cart.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'sidebar-item';
            itemEl.innerHTML = `
                <div class="sidebar-item-img">
                    <img src="${getProductImage(item)}" alt="${item.name || item.productName || ''}" onerror="this.src='${DEFAULT_IMG}'">
                </div>
                <div class="sidebar-item-info">
                    <div class="sidebar-item-name">${item.name || item.productName || ''}</div>
                    <div class="sidebar-item-meta">SL: ${item.quantity || 1}</div>
                </div>
                <div class="sidebar-item-price">${formatPrice((item.price || 0) * (item.quantity || 1))}</div>
            `;
            container.insertBefore(itemEl, emptyEl);
        });
    }

    function calculateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
        const shipping = 0; // Free shipping

        let total = subtotal;
        if (appliedPromo) {
            if (appliedPromo.type === 'percent') {
                discountAmount = Math.round(subtotal * appliedPromo.value / 100);
            } else {
                discountAmount = 0;
            }
            total = subtotal - discountAmount;
        }

        return { subtotal, shipping, discountAmount, total };
    }

    function updateTotalsDisplay() {
        const { subtotal, shipping, discountAmount, total } = calculateTotals();

        document.getElementById('summary-subtotal').textContent = formatPrice(subtotal);
        document.getElementById('summary-shipping').textContent = shipping === 0 ? 'Miễn phí' : formatPrice(shipping);
        document.getElementById('summary-total').textContent = formatPrice(total);

        const discountRow = document.getElementById('discount-row');
        if (appliedPromo && discountAmount > 0) {
            discountRow.classList.remove('hidden');
            document.getElementById('summary-discount').textContent = '-' + formatPrice(discountAmount);
        } else {
            discountRow.classList.add('hidden');
        }
    }

    // Promo code handling
    const promoInput = document.getElementById('promo-input');
    const promoBtn = document.getElementById('btn-apply-promo');
    const promoFeedback = document.getElementById('promo-feedback');

    if (promoBtn && promoInput) promoBtn.addEventListener('click', () => {
        const code = (promoInput.value || '').trim().toUpperCase();
        if (!code) {
            promoFeedback.textContent = 'Vui lòng nhập mã giảm giá.';
            promoFeedback.className = 'promo-feedback error';
            return;
        }

        const promo = window.MXStore ? window.MXStore.getActivePromo(code) : PROMO_CODES[code];
        if (promo) {
            appliedPromo = promo;
            promoFeedback.textContent = promo.label || promo.name || 'Đã áp dụng';
            promoFeedback.className = 'promo-feedback success';
            promoInput.disabled = true;
            promoBtn.textContent = 'Đã áp dụng';
            promoBtn.disabled = true;
            updateTotalsDisplay();
        } else {
            promoFeedback.textContent = 'Mã giảm giá không hợp lệ.';
            promoFeedback.className = 'promo-feedback error';
        }
    });

    if (promoInput && promoBtn) promoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') promoBtn.click();
    });

    // Form validation
    function validateForm() {
        const requiredFields = ['fullname', 'phone', 'address', 'city'];
        let isValid = true;
        let firstError = null;

        requiredFields.forEach(fieldId => {
            const input = document.getElementById(fieldId);
            const wrapper = input?.closest('.input-wrapper');
            if (input && !input.value.trim()) {
                if (wrapper) wrapper.classList.add('error');
                input.addEventListener('input', () => wrapper?.classList.remove('error'), { once: true });
                if (!firstError) firstError = input;
                isValid = false;
            } else {
                if (wrapper) wrapper.classList.remove('error');
            }
        });

        // Email validation
        const emailInput = document.getElementById('email');
        if (emailInput && emailInput.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                emailInput.closest('.input-wrapper')?.classList.add('error');
                if (!firstError) firstError = emailInput;
                isValid = false;
            }
        }

        // Payment validation
        const paymentSelected = document.querySelector('input[name="payment"]:checked');
        if (!paymentSelected) {
            showToast('Vui lòng chọn phương thức thanh toán.');
            isValid = false;
        }

        return isValid;
    }

    // Place order
    const placeOrderBtn = document.getElementById('btn-place-order');

    if (placeOrderBtn) placeOrderBtn.addEventListener('click', () => {
        if (!validateForm()) return;
        if (cart.length === 0) {
            showToast('Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi đặt hàng.');
            return;
        }

        const btnOriginal = placeOrderBtn.textContent;
        placeOrderBtn.disabled = true;
        placeOrderBtn.textContent = 'Đang xử lý...';

        const orderData = {
            id: 'MX-' + Date.now(),
            date: new Date().toISOString(),
            items: cart.map(item => ({
                id: item.id,
                name: item.name || item.productName,
                price: item.price,
                quantity: item.quantity || 1,
                image: getProductImage(item)
            })),
            shipping: {
                fullname: document.getElementById('fullname').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                email: document.getElementById('email')?.value.trim() || '',
                address: document.getElementById('address').value.trim(),
                district: document.getElementById('district')?.value.trim() || '',
                city: document.getElementById('city').value.trim(),
                note: document.getElementById('note')?.value.trim() || ''
            },
            payment: document.querySelector('input[name="payment"]:checked')?.value || '',
            promo: appliedPromo ? { code: promoInput.value.trim().toUpperCase(), ...appliedPromo } : null,
            subtotal: calculateTotals().subtotal,
            discount: discountAmount,
            total: calculateTotals().total,
            status: 'pending'
        };

        const order = window.MXStore ? window.MXStore.createOrder(orderData) : null;
        if (!order) {
            try {
                const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
                orders.unshift(orderData);
                localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
            } catch (e) {
                console.warn('Could not save order to localStorage');
            }
        }

        // Clear cart
        cart = [];
        if (window.MXStore) {
            window.MXStore.clearCart();
        } else {
            saveCart();
        }
        localStorage.setItem(cartStorageCountKey, '0');

        setTimeout(() => {
            showToast('Đặt hàng thành công!', 'success');
            setTimeout(() => {
                const orderId = order?.id || orderData.id;
                window.location.href = 'success.html?order=' + encodeURIComponent(orderId);
            }, 800);
        }, 600);
    });

    // Load cart on page load
    loadCart();
    const params = new URLSearchParams(window.location.search);
    const promoFromUrl = params.get('promo');
    if (promoFromUrl && promoInput) {
        promoInput.value = promoFromUrl;
        promoBtn.click();
    }
    renderSidebarItems();
    updateTotalsDisplay();
    window.MXCartBadge?.sync();
});
