document.addEventListener('DOMContentLoaded', () => {
    window.MXCartBadge?.sync();
    
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order');
    const type = params.get('type');
    
    if (type === 'consulting') {
        showConsultingSuccess();
    } else if (orderId) {
        loadOrderSuccess(orderId);
    }
    
    initConfetti();
    initCopyOrderId();
    initButtons();
});

function loadOrderSuccess(orderId) {
    const order = window.MXStore?.getOrderById(orderId);
    if (!order) return;
    
    const orderIdEl = document.getElementById('order-id');
    const orderTotalEl = document.getElementById('order-total');
    
    if (orderIdEl) orderIdEl.textContent = `#${order.id}`;
    if (orderTotalEl) orderTotalEl.textContent = window.MXStore.formatPrice(order.total);
}

function showConsultingSuccess() {
    const heading = document.querySelector('h1');
    const message = document.querySelector('.success-message');
    
    if (heading) heading.textContent = 'Đã gửi yêu cầu tư vấn!';
    if (message) message.textContent = 'Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.';
}

function initConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999;';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = Array.from({ length: 50 }, () => ({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 3 + 2,
        color: ['#154212', '#f2ddc0', '#2d5a27'][Math.floor(Math.random() * 3)],
        size: Math.random() * 8 + 4
    }));
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.y += p.vy;
            p.x += p.vx;
            if (p.y > canvas.height) p.y = -10;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        });
        requestAnimationFrame(animate);
    }
    
    animate();
    setTimeout(() => canvas.remove(), 3000);
}

function initCopyOrderId() {
    const copyBtn = document.getElementById('btn-copy-order');
    if (!copyBtn) return;
    
    copyBtn.addEventListener('click', () => {
        const orderIdEl = document.getElementById('order-id');
        const orderId = orderIdEl?.textContent || '';
        
        navigator.clipboard.writeText(orderId).then(() => {
            showToast('Đã copy mã đơn hàng');
        });
    });
}

function initButtons() {
    const trackBtn = document.getElementById('btn-track-order');
    const continueBtn = document.getElementById('btn-continue-shopping');
    
    if (trackBtn) {
        trackBtn.addEventListener('click', () => {
            const params = new URLSearchParams(window.location.search);
            const orderId = params.get('order');
            window.location.href = orderId ? `tracking.html?order=${orderId}` : 'profile.html';
        });
    }
    
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            window.location.href = 'category.html';
        });
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #154212; color: white; padding: 12px 16px; border-radius: 8px; z-index: 9999;';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}
