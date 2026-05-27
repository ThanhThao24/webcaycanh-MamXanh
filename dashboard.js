document.addEventListener('DOMContentLoaded', () => {
  const store = window.MXStore;
  const orders = store?.getOrders() || [];
  const products = store?.getProducts() || [];

  // ── Stat cards (4 in order: total sales, new orders, out-of-stock, revenue) ──
  const statValues = document.querySelectorAll('.stat-card .stat-value');
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => ['pending', 'processing'].includes(o.status)).length;
  const lowStock = products.filter(p => (p.stock || 0) < 10).length;

  if (statValues[0]) statValues[0].textContent = fmtUSD(totalRevenue);
  if (statValues[1]) statValues[1].textContent = orders.length;
  if (statValues[2]) statValues[2].textContent = lowStock + ' món';
  if (statValues[3]) statValues[3].textContent = fmtUSD(totalRevenue);

  const trendSpans = document.querySelectorAll('.stat-trend');
  if (trendSpans[0]) {
    const growth = orders.length ? '+' + Math.round((pendingOrders / Math.max(orders.length, 1)) * 100) + '%' : '+0%';
    trendSpans[0].textContent = growth;
  }

  // ── Recent orders list ──
  const orderList = document.querySelector('.order-list-mini');
  if (orderList && orders.length) {
    const statusMap = {
      pending: { text: 'Chờ xác nhận', cls: 'status-pending' },
      processing: { text: 'Đang xử lý', cls: 'status-pending' },
      shipping: { text: 'Đang giao', cls: 'status-pending' },
      delivered: { text: 'Đã giao', cls: 'status-delivered' },
      cancelled: { text: 'Đã hủy', cls: 'status-pending' },
    };
    const FALLBACK_IMG = '../assets/figma/6e589377-22cf-4778-8adf-97d4de3f388f.jpg';
    orderList.innerHTML = orders.slice(0, 3).map(order => {
      const item = order.items?.[0];
      const rawImg = item?.image || item?.img || item?.images?.[0] || '';
      const img = rawImg ? '../' + rawImg : FALLBACK_IMG;
      const st = statusMap[order.status] || statusMap.pending;
      const amount = store ? store.formatPrice(order.total) : (order.total || 0).toLocaleString('vi-VN') + 'đ';
      return `
        <div class="order-item-mini" style="cursor:pointer;" onclick="window.location.href='admin_orders.html'">
          <div class="order-item-img">
            <img src="${img}" alt="Plant" style="width:100%;height:100%;object-fit:cover;" onerror="this.onerror=null;this.src='${FALLBACK_IMG}';">
          </div>
          <div class="order-item-info">
            <p class="order-item-name">${item?.name || order.customer || 'Đơn hàng'}</p>
            <p class="order-item-meta">Đơn #${order.id} • ${amount}</p>
          </div>
          <span class="order-item-status ${st.cls}">${st.text}</span>
        </div>`;
    }).join('');
  }

  // ── Chart bars (animate from data) ──
  const bars = document.querySelectorAll('.chart-bar');
  if (bars.length && orders.length) {
    const now = new Date();
    const rawMonthly = Array.from({ length: bars.length }, (_, i) => {
      const m = (now.getMonth() - bars.length + 1 + i + 12) % 12;
      return orders
        .filter(o => new Date(o.date).getMonth() === m)
        .reduce((s, o) => s + (o.total || 0), 0);
    });
    const activeMonths = rawMonthly.filter(v => v > 0).length;
    const monthly = rawMonthly.map((v, i) => v || 20 + i * 5);
    const designHeights = [40, 60, 45, 75, 70, 90, 100, 85, 65, 55, 80, 95];
    const max = Math.max(...monthly, 1);
    bars.forEach((bar, i) => {
      const height = activeMonths < 4 ? designHeights[i % designHeights.length] : Math.max(16, Math.round((monthly[i] / max) * 100));
      bar.style.height = height + '%';
    });
  }

  // ── Pagination ──
  document.querySelectorAll('.page-num').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.page-num').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ── Header search → go to orders ──
  const searchInput = document.querySelector('.admin-search input');
  if (searchInput) {
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && searchInput.value.trim()) {
        window.location.href = 'admin_orders.html';
      }
    });
  }

  function fmtUSD(val) {
    return (val / 1000).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + ' $';
  }
});
