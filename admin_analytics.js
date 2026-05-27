document.addEventListener('DOMContentLoaded', () => {
  const store = window.MXStore;
  const orders = store?.getOrders() || [];
  const products = store?.getProducts() || [];

  // Hardcoded fallbacks — used when stored products are stale or missing
  const PRODUCT_FALLBACKS = {
    'bang-singapore':    { name: 'Bàng Singapore',     category: 'Cây trong nhà',  image: 'assets/figma/7362ee9c-83cb-4db8-b1a7-3bef2b33f6cc.png' },
    'trau-ba-la-xe':     { name: 'Trầu Bà lá xẻ Thái', category: 'Cây trong nhà',  image: 'assets/figma/cart-trau-ba.png' },
    'luoi-ho-laurenti':  { name: 'Lưỡi hổ Laurenti',   category: 'Dễ chăm sóc',    image: 'assets/figma/0b792e64-6674-4316-9236-44d2610b4b45.jpg' },
    'lan-y':             { name: 'Lan Ý',              category: 'Lọc không khí',  image: 'assets/figma/3cf2e8de-c0b8-4135-8dbd-c93a05c3e6b8.png' },
    'kim-tien':          { name: 'Cây Kim Tiền',       category: 'Phong thủy',     image: 'assets/figma/91a02e1e-fd77-4e16-bb9f-b2b696737138.jpg' },
    'sen-da':            { name: 'Sen đá',             category: 'Để bàn',         image: 'assets/figma/9697633d-bdd7-44be-8f07-987a08b66ae7.jpg' },
    'o-liu-lun':         { name: 'Ô liu lùn',          category: 'Ngoài trời',     image: 'assets/figma/18f92f04-c249-4b0b-a048-bbe229c443ce.png' },
    'duoi-cong':         { name: 'Đuôi công',          category: 'Cây trong nhà',  image: 'assets/figma/c3d6e4b9-f8cb-4f90-9b72-0f95c37db2d2.png' },
    'bo-ba-sa-mac':      { name: 'Bộ ba Sa mạc',       category: 'Để bàn',         image: 'assets/figma/402ccd75-5842-4a4d-a2ca-6784c0e5d07a.jpg' },
  };
  const FALLBACK_IMG = '../assets/figma/6e589377-22cf-4778-8adf-97d4de3f388f.jpg';

  // ── KPI cards ──
  // Structure: .kpi-header > div:first-child > div (the value div, sibling of h3)
  const kpiValueDivs = document.querySelectorAll('.kpi-card .kpi-header > div:first-child > div');

  const customerSet = new Set(
    orders.map(o => o.customer || o.shipping?.fullname).filter(Boolean)
  );
  const newCustomers = customerSet.size;

  // Retention: customers who placed more than 1 order
  const ordersByCustomer = {};
  orders.forEach(o => {
    const key = o.customer || o.shipping?.fullname;
    if (key) ordersByCustomer[key] = (ordersByCustomer[key] || 0) + 1;
  });
  const repeatCount = Object.values(ordersByCustomer).filter(c => c > 1).length;
  const retentionRate = newCustomers ? Math.round((repeatCount / newCustomers) * 100) : 0;

  // LTV: total revenue / unique customers
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const ltv = newCustomers ? Math.round(totalRevenue / newCustomers) : 0;

  if (kpiValueDivs[0]) kpiValueDivs[0].textContent = newCustomers.toLocaleString('vi-VN');
  if (kpiValueDivs[1]) kpiValueDivs[1].textContent = retentionRate + '%';
  if (kpiValueDivs[2]) kpiValueDivs[2].textContent = (ltv / 1_000_000).toFixed(1) + 'M ₫';

  // Update donut chart % text
  const donutPct = document.querySelector('.donut-chart > div > div:nth-child(2)');
  if (donutPct) donutPct.textContent = retentionRate + '%';

  // ── Top products from order items ──
  const productSales = {};
  const productRevenue = {};
  orders.forEach(o => {
    (o.items || []).forEach(item => {
      const key = item.id || item.name;
      if (!key) return;
      productSales[key] = (productSales[key] || 0) + (item.qty || item.quantity || 1);
      productRevenue[key] = (productRevenue[key] || 0) +
        (item.price || 0) * (item.qty || item.quantity || 1);
    });
  });

  const productList = document.querySelector('.product-list');
  if (productList && Object.keys(productSales).length) {
    const topIds = Object.keys(productSales)
      .sort((a, b) => productSales[b] - productSales[a])
      .slice(0, 3);

    productList.innerHTML = topIds.map(pid => {
      const prod = products.find(p => p.id === pid || p.name === pid);
      const fb = PRODUCT_FALLBACKS[pid] || { name: pid, category: 'Sản phẩm', image: '' };
      const name = prod?.name || fb.name;
      const imagePath = prod?.image || prod?.img || prod?.images?.[0] || fb.image;
      const imgSrc = toAdminAsset(imagePath) || FALLBACK_IMG;
      const imgTag = `<img src="${imgSrc}" alt="${name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.onerror=null;this.src='${FALLBACK_IMG}';">`;
      const category = prod?.category || fb.category;
      const sold = productSales[pid];
      const rev = productRevenue[pid];
      const revStr = rev >= 1_000_000
        ? (rev / 1_000_000).toFixed(1) + 'M ₫'
        : (rev / 1000).toFixed(0) + 'k ₫';
      return `
        <div class="product-item">
          <div class="product-img">${imgTag}</div>
          <div class="product-info">
            <h4>${name}</h4>
            <p>${category}</p>
          </div>
          <div class="product-stats">
            <span>${sold}</span>
            <span>Đã bán</span>
          </div>
          <div class="product-revenue">
            <span>${revStr}</span>
            <span>Doanh thu</span>
          </div>
        </div>`;
    }).join('');
  }

  // ── Export ──
  document.querySelector('.export-btn')?.addEventListener('click', () => {
    const rows = [['Mã đơn', 'Ngày', 'Khách hàng', 'Tổng tiền', 'Trạng thái'].join(',')];
    orders.forEach(o => {
      rows.push([
        '#' + o.id,
        o.date || '',
        (o.customer || o.shipping?.fullname || '').replace(/,/g, ' '),
        o.total || 0,
        o.status || ''
      ].join(','));
    });
    const blob = new Blob(['﻿' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics-' + Date.now() + '.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast('Đã xuất báo cáo');
  });

  function toast(msg) {
    const el = document.createElement('div');
    el.textContent = msg;
    el.className = 'analytics-toast';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }

  function toAdminAsset(path) {
    if (!path) return '';
    if (/^https?:\/\//.test(path) || path.startsWith('../')) return path;
    return path.startsWith('assets/') ? '../' + path : path;
  }
});
