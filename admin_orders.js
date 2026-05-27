document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'mx_orders';
    const tableBody = document.querySelector('.data-table tbody');

    const showNotice = (message, type = 'info') => {
        const notice = document.createElement('div');
        const bg = type === 'success' ? '#154212' : type === 'warning' ? '#7f4f24' : '#1f2937';
        notice.textContent = message;
        notice.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: ${bg}; color: #fff;
            padding: 10px 14px; border-radius: 8px; box-shadow: 0 8px 20px rgba(0,0,0,0.2);
            z-index: 9999; font-size: 14px;
        `;
        document.body.appendChild(notice);
        setTimeout(() => notice.remove(), 2200);
    };

    const statusFlow = [
        { id: 'pending', text: 'Chờ xác nhận', aliases: ['chờ xử lý', 'chờ xác nhận'], className: 'status-badge', bg: 'rgba(242,221,192,0.3)', color: '#6b5c46' },
        { id: 'processing', text: 'Đang xử lý', aliases: ['đang xử lý'], className: 'status-badge', bg: 'rgba(21,66,18,0.05)', color: '#2d5a27' },
        { id: 'shipping', text: 'Đang giao hàng', aliases: ['đang giao', 'đang giao hàng'], className: 'status-badge', bg: 'rgba(21,66,18,0.05)', color: '#2d5a27' },
        { id: 'delivered', text: 'Đã giao hàng', aliases: ['đã giao', 'đã giao hàng'], className: 'status-badge', bg: 'rgba(21,66,18,0.05)', color: '#2d5a27' },
        { id: 'cancelled', text: 'Đã hủy', aliases: ['đã hủy'], className: 'status-badge', bg: 'rgba(96,35,62,0.1)', color: '#60233e' }
    ];

    function loadOrders() {
        if (window.MXStore) return window.MXStore.getOrders();
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
        return [
            { id: 'ORD-2849', customer: 'Nguyễn Văn Hiếu', initials: 'NH', bgColor: '#bcf0ae', date: '20/10/2023', amount: '2.500.000đ', statusIndex: 3 },
            { id: 'ORD-2850', customer: 'Trần Thị Lan', initials: 'TL', bgColor: '#f5dfc3', date: '21/10/2023', amount: '1.250.000đ', statusIndex: 0 },
            { id: 'ORD-2851', customer: 'Lê Minh', initials: 'LM', bgColor: '#ffd9e4', date: '21/10/2023', amount: '4.800.000đ', statusIndex: 1 },
        ];
    }

    function saveOrders(orders) {
        if (window.MXStore) {
            window.MXStore.saveOrders(orders);
            return;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    }

    function statusIndexOf(order) {
        if (typeof order.statusIndex === 'number') return order.statusIndex;
        const idx = statusFlow.findIndex(s => s.id === order.status);
        return idx >= 0 ? idx : 0;
    }

    const AVATAR_PALETTE = ['avatar-c0', 'avatar-c1', 'avatar-c2', 'avatar-c3', 'avatar-c4'];

    function avatarClass(name) {
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) % AVATAR_PALETTE.length;
        return AVATAR_PALETTE[hash];
    }

    function buildStatusBadge(indexOrStatus) {
        const index = typeof indexOrStatus === 'string'
            ? statusFlow.findIndex(s => s.id === indexOrStatus)
            : indexOrStatus;
        const s = statusFlow[index >= 0 ? index : 0] || statusFlow[0];
        return `<span class="status-badge ${s.id}">${s.text}</span>`;
    }

    function buildOrderRow(order) {
        const tr = document.createElement('tr');
        tr.dataset.id = order.id;
        tr.style.borderBottom = '1px solid rgba(194,201,187,0.1)';
        const amount = order.amount || (window.MXStore ? window.MXStore.formatPrice(order.total) : order.total);
        const date = order.date && order.date.includes('T') ? new Date(order.date).toLocaleDateString('vi-VN') : order.date;
        const customer = order.customer || order.shipping?.fullname || 'Khách hàng';
        const initials = order.initials || (customer.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()) || 'KH';
        const avClass = order.avatarClass || avatarClass(customer);
        tr.innerHTML = `
            <td style="padding: 32px;"><span class="order-id">#${order.id}</span></td>
            <td style="padding: 0 32px;">
                <div class="customer-info">
                    <div class="avatar ${avClass}">${initials}</div>
                    <span class="customer-name">${customer}</span>
                </div>
            </td>
            <td style="padding: 32px;">${date}</td>
            <td style="padding: 32px;"><span class="amount">${amount}</span></td>
            <td style="padding: 32px;">${buildStatusBadge(statusIndexOf(order))}</td>
            <td class="actions" style="padding: 32px;">
                <div>
                    <button class="action-btn" data-action="View" title="Xem"><img src="../assets/figma/8e197189-e72a-4e24-9ce3-4ee64ed26168.svg" alt="View"></button>
                    <button class="action-btn" data-action="Edit" title="Sửa"><img src="../assets/figma/041bb1be-597b-4c7b-af63-44260c9dd16e.svg" alt="Edit"></button>
                    <button class="action-btn" data-action="Print" title="In"><img src="../assets/figma/1d12b54d-5daa-4497-b975-fa0cda5f6742.svg" alt="Print"></button>
                </div>
            </td>
        `;
        return tr;
    }

    // Initial load
    let orders = loadOrders();
    saveOrders(orders);
    if (tableBody) {
        tableBody.innerHTML = '';
        orders.forEach(order => {
            tableBody.appendChild(buildOrderRow(order));
        });
    }

    // Filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => {
                t.style.backgroundColor = '';
                t.style.color = '#42493e';
            });
            tab.style.backgroundColor = '#2d5a27';
            tab.style.color = 'white';

            const filterText = tab.textContent.trim().toLowerCase();
            const rows = document.querySelectorAll('.data-table tbody tr');

            rows.forEach(row => {
                const orderId = row.dataset.id;
                const order = orders.find(o => o.id === orderId);
                if (!order) return;
                if (filterText === 'tất cả') {
                    row.style.display = '';
                } else {
                    const status = statusFlow[statusIndexOf(order)] || statusFlow[0];
                    row.style.display = status.aliases.some(alias => alias.includes(filterText)) ? '' : 'none';
                }
            });
        });
    });

    // Action buttons
    if (tableBody) {
        tableBody.addEventListener('click', (e) => {
            const btn = e.target.closest('.action-btn');
            if (!btn) return;

            const action = btn.dataset.action || btn.querySelector('img')?.getAttribute('alt');
            const row = btn.closest('tr');
            if (!row) return;
            const id = row.dataset.id;
            const order = orders.find(o => o.id === id);

            if (action === 'View') {
                window.location.href = `../tracking.html?order=${encodeURIComponent(id)}`;
            } else if (action === 'Edit' && order) {
                const nextIndex = (statusIndexOf(order) + 1) % statusFlow.length;
                order.statusIndex = nextIndex;
                order.status = statusFlow[nextIndex].id;
                saveOrders(orders);
                const badge = row.querySelector('.status-badge');
                if (badge) {
                    statusFlow.forEach(s => badge.classList.remove(s.id));
                    badge.classList.add(statusFlow[nextIndex].id);
                    badge.textContent = statusFlow[nextIndex].text;
                }
                showNotice(`Đã cập nhật trạng thái #${id}.`, 'success');
            } else if (action === 'Print') {
                const printWindow = window.open('', '_blank', 'width=800,height=600');
                if (!printWindow) return;
                printWindow.document.write(`
                    <html><head><title>Hóa đơn ${id}</title></head>
                    <body style="font-family: Arial, sans-serif; padding: 24px;">
                        <h2>Hóa đơn #${id}</h2>
                        <p>Khách hàng: ${order?.customer || order?.shipping?.fullname || ''}</p>
                        <p>Tổng tiền: ${order?.amount || (window.MXStore ? window.MXStore.formatPrice(order?.total || 0) : '')}</p>
                        <p>Trạng thái: ${statusFlow[statusIndexOf(order || {})]?.text || ''}</p>
                    </body></html>
                `);
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
                showNotice(`Đã mở bản in cho #${id}.`, 'info');
            }
        });
    }

    // Pagination
    const pageNums = document.querySelectorAll('.page-num');
    pageNums.forEach(numBtn => {
        numBtn.addEventListener('click', () => {
            pageNums.forEach(btn => {
                btn.style.backgroundColor = '';
                btn.style.color = '#42493e';
            });
            numBtn.style.backgroundColor = '#154212';
            numBtn.style.color = 'white';
        });
    });

    // Export CSV
    const exportBtn = document.querySelector('.btn-export');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const csvRows = [
                ['Mã đơn hàng', 'Khách hàng', 'Ngày đặt', 'Tổng tiền', 'Trạng thái'].join(',')
            ];
            orders.forEach(order => {
                const status = statusFlow[statusIndexOf(order)]?.text || '';
                const amount = order.amount || (window.MXStore ? window.MXStore.formatPrice(order.total) : order.total);
                csvRows.push([order.id, order.customer || order.shipping?.fullname || '', order.date, amount, status].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
            });
            const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'admin-orders.csv';
            a.click();
            URL.revokeObjectURL(url);
            showNotice('Đã xuất báo cáo CSV.', 'success');
        });
    }
});
