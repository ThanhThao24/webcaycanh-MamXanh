document.addEventListener('DOMContentLoaded', () => {
    window.MXCartBadge?.sync();

    const showNotice = (message, type = 'info') => {
        const notice = document.createElement('div');
        const bg = type === 'success' ? '#154212' : type === 'warning' ? '#7f4f24' : '#1f2937';
        notice.textContent = message;
        notice.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bg};
            color: #fff;
            padding: 10px 14px;
            border-radius: 8px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            font-size: 14px;
        `;
        document.body.appendChild(notice);
        setTimeout(() => notice.remove(), 2200);
    };

    const session = window.MXStore?.read(window.MXStore.keys.session, null);
    const user = window.MXStore?.read(window.MXStore.keys.user, null);
    if (user?.email || session?.email) {
        const email = user?.email || session?.email;
        const emailFields = Array.from(document.querySelectorAll('.main-info-card .info-group p'));
        const emailField = emailFields.find(field => field.textContent.includes('@'));
        if (emailField) emailField.textContent = email;
    }

    const orders = window.MXStore?.getOrders?.() || [];
    const orderItems = document.querySelectorAll('.recent-orders-card .order-item');
    orders.slice(0, orderItems.length).forEach((order, index) => {
        const item = orderItems[index];
        const price = item.querySelector('.price');
        const status = window.MXStore.statusFlow?.find(entry => entry.id === order.status);
        if (price) price.textContent = window.MXStore.formatPrice(order.total);
        const badge = item.querySelector('.status-badge');
        if (badge && status) badge.textContent = status.text.toUpperCase();
        item.dataset.orderId = order.id;
    });

    orderItems.forEach((item) => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            const orderId = item.dataset.orderId || orders[0]?.id || 'MX-2026-888';
            window.location.href = `tracking.html?order=${encodeURIComponent(orderId)}`;
        });
    });

    // Sidebar nav items
    const navItems = document.querySelectorAll('.profile-sidebar .nav-item');
    navItems.forEach(item => {
        const label = (item.querySelector('span')?.textContent || item.textContent).trim().toLowerCase();
        
        item.addEventListener('click', (e) => {
            const href = item.getAttribute('href');
            
            // Special handling for "Đơn hàng" link
            if (label.includes('đơn hàng')) {
                e.preventDefault();
                const latestOrder = orders[0];
                if (latestOrder) {
                    window.location.href = `tracking.html?order=${encodeURIComponent(latestOrder.id)}`;
                } else {
                    showNotice('Bạn chưa có đơn hàng nào.', 'warning');
                }
                return;
            }
            
            if (href && href !== '#' && !href.endsWith('profile.html')) {
                // Allow navigation to other pages
                return;
            }
            // Only prevent default for profile.html or #
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Edit profile button
    const editBtn = document.querySelector('.btn-edit-profile');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            const editableFields = document.querySelectorAll('.main-info-card h3, .main-info-card .info-group p');
            const editing = editBtn.dataset.editing === 'true';
            editBtn.dataset.editing = editing ? 'false' : 'true';

            editableFields.forEach((field) => {
                field.contentEditable = editing ? 'false' : 'true';
                field.style.outline = editing ? 'none' : '1px dashed #154212';
                if (!editing) field.focus();
            });

            const label = editBtn.querySelector('span');
            if (label) label.textContent = editing ? 'Chỉnh sửa thông tin' : 'Lưu thông tin';
            showNotice(editing ? 'Đã lưu thay đổi hồ sơ.' : 'Đang chỉnh sửa hồ sơ.', 'info');
        });
    }

    // Change avatar button
    const avatarBtn = document.querySelector('.btn-change-avatar');
    if (avatarBtn) {
        avatarBtn.addEventListener('click', () => {
            let picker = document.querySelector('#avatarPicker');
            if (!picker) {
                picker = document.createElement('input');
                picker.type = 'file';
                picker.accept = 'image/*';
                picker.id = 'avatarPicker';
                picker.style.display = 'none';
                document.body.appendChild(picker);
            }

            picker.onchange = () => {
                const file = picker.files?.[0];
                if (!file) return;
                const avatar = document.querySelector('.avatar-box img');
                if (avatar) {
                    avatar.src = URL.createObjectURL(file);
                    showNotice('Đã cập nhật ảnh đại diện.', 'success');
                }
            };

            picker.click();
        });
    }

    // Logout button
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            const confirmLogout = confirm('Bạn có chắc chắn muốn đăng xuất không?');
            if (confirmLogout) {
                localStorage.removeItem('mamxanh_session');
                window.location.href = 'login.html';
            }
        });
    }
});
