document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order');

    if (!orderId) {
        window.location.href = 'profile.html';
        return;
    }

    const order = window.MXStore?.getOrderById(orderId);
    if (!order) {
        showError('Không tìm thấy đơn hàng');
        return;
    }

    renderOrderInfo(order);
    renderTimeline(order);
    renderItems(order);
    initActions(order);
    window.MXCartBadge?.sync();

    function renderOrderInfo(order) {
        const orderIdEl = document.getElementById('order-id');
        const orderDateEl = document.getElementById('order-date');
        const orderStatusEl = document.getElementById('order-status');

        if (orderIdEl) orderIdEl.textContent = `#${order.id}`;
        if (orderDateEl) {
            const date = new Date(order.date);
            orderDateEl.textContent = date.toLocaleDateString('vi-VN', { 
                day: '2-digit', month: '2-digit', year: 'numeric' 
            });
        }
        if (orderStatusEl) {
            const status = window.MXStore.statusFlow.find(s => s.id === order.status);
            orderStatusEl.textContent = status?.text || 'Đang xử lý';
        }
    }

    function renderTimeline(order) {
        const timeline = document.querySelector('.tracking-timeline');
        if (!timeline) return;

        const statusIndex = window.MXStore.statusFlow.findIndex(s => s.id === order.status);
        const steps = window.MXStore.statusFlow.filter(s => s.id !== 'cancelled');

        timeline.innerHTML = steps.map((step, i) => {
            const isActive = i <= statusIndex;
            const isCurrent = i === statusIndex;
            return `
                <div class="timeline-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="timeline-title">${step.text}</div>
                        ${isCurrent ? '<div class="timeline-date">Hiện tại</div>' : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderItems(order) {
        const container = document.getElementById('order-items');
        if (!container) return;

        container.innerHTML = order.items.map(item => `
            <div class="order-item">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/figma/ffa71a92-4aa9-4c9a-885b-ef6879b7d9fc.png'">
                <div class="order-item-info">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-qty">SL: ${item.quantity}</div>
                </div>
                <div class="order-item-price">${window.MXStore.formatPrice(item.price * item.quantity)}</div>
            </div>
        `).join('');

        const subtotalEl = document.getElementById('order-subtotal');
        const discountEl = document.getElementById('order-discount');
        const totalEl = document.getElementById('order-total');

        if (subtotalEl) subtotalEl.textContent = window.MXStore.formatPrice(order.subtotal);
        if (discountEl) discountEl.textContent = order.discount ? `-${window.MXStore.formatPrice(order.discount)}` : '0đ';
        if (totalEl) totalEl.textContent = window.MXStore.formatPrice(order.total);
    }

    function initActions(order) {
        const printBtn = document.getElementById('btn-print');
        const cancelBtn = document.getElementById('btn-cancel');
        const backBtn = document.getElementById('btn-back');

        if (printBtn) {
            printBtn.addEventListener('click', () => {
                window.print();
            });
        }

        if (cancelBtn && order.status === 'pending') {
            cancelBtn.addEventListener('click', () => {
                if (confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
                    window.MXStore.updateOrderStatus(order.id, 'cancelled');
                    showToast('Đã hủy đơn hàng', 'success');
                    setTimeout(() => location.reload(), 1000);
                }
            });
        } else if (cancelBtn) {
            cancelBtn.style.display = 'none';
        }

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.location.href = 'profile.html';
            });
        }
    }

    function showError(message) {
        document.body.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 24px; text-align: center;">
                <h2 style="font-size: 24px; margin-bottom: 16px;">${message}</h2>
                <a href="index.html" style="background: #154212; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">Về trang chủ</a>
            </div>
        `;
    }

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toast.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #154212; color: white; padding: 12px 16px; border-radius: 8px; z-index: 9999;';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }
});
