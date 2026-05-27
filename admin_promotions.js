document.addEventListener('DOMContentLoaded', () => {
  const store = window.MXStore;
  let promotions = store?.getPromotions() || [];

  const tbody = document.querySelector('.promo-table tbody');
  const statVals = document.querySelectorAll('.promo-stat-card .stat-val');

  updateStats();
  renderPromotions();

  document.querySelector('.btn-primary-solid')?.addEventListener('click', () => {
    const newPromo = {
      id: 'promo-' + Date.now(),
      name: 'Khuyến mãi mới',
      desc: 'Mô tả khuyến mãi',
      code: 'CODE' + Math.floor(Math.random() * 10000),
      type: 'percent',
      value: 10,
      status: 'running',
      usage: 0,
      usageMax: 100
    };
    promotions.unshift(newPromo);
    store?.savePromotions(promotions);
    updateStats();
    renderPromotions();
    toast('Đã thêm mã khuyến mãi mới');
  });

  document.querySelectorAll('.page-num').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.page-num').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  function updateStats() {
    const running = promotions.filter(p => p.status === 'running').length;
    const totalUsage = promotions.reduce((s, p) => s + (p.usage || 0), 0);
    if (statVals[0]) statVals[0].textContent = running;
    if (statVals[1]) statVals[1].textContent = totalUsage.toLocaleString('vi-VN');
  }

  function renderPromotions() {
    if (!tbody) return;
    const iconBgs = ['bg-gray-light', 'bg-yellow', 'bg-green-light'];
    const iconSrcs = [
      '../assets/figma/6002c68d-0c6a-46a6-832f-62c6fa671152.svg',
      '../assets/figma/3d8000fe-e5ca-41e1-b2f5-6bf86352827b.svg',
      '../assets/figma/6002c68d-0c6a-46a6-832f-62c6fa671152.svg'
    ];
    const statusMap = {
      running:   { cls: 'bg-green-light text-green-light',   text: 'Đang Chạy' },
      scheduled: { cls: 'bg-yellow text-brown',              text: 'Lên lịch' },
      expired:   { cls: 'bg-gray-light text-gray',           text: 'Hết hạn' },
      paused:    { cls: 'bg-gray-light',                     text: 'Tạm Dừng' },
    };
    tbody.innerHTML = promotions.map((promo, i) => {
      const st = statusMap[promo.status] || statusMap.paused;
      const statusCls = st.cls;
      const statusText = st.text;
      const discountText = promo.type === 'percent'
        ? `Phần trăm (${promo.value}%)`
        : `Số tiền (${Math.round((promo.value || 0) / 1000)}k)`;
      const usagePct = promo.usageMax ? Math.round(((promo.usage || 0) / promo.usageMax) * 100) : 0;
      return `
        <tr data-index="${i}">
          <td>
            <div class="promo-name-col">
              <div class="promo-icon ${iconBgs[i % iconBgs.length]}">
                <img src="${iconSrcs[i % iconSrcs.length]}" alt="icon">
              </div>
              <div class="promo-info">
                <h4><span class="promo-name-text" contenteditable="false">${promo.name}</span></h4>
                <p>${promo.desc || ''}</p>
              </div>
            </div>
          </td>
          <td><span class="code-badge">${promo.code}</span></td>
          <td><span class="discount-val">${discountText}</span></td>
          <td>
            <div class="usage-col">
              <div class="usage-stats">
                <span>${promo.usage || 0}/${promo.usageMax || 0}</span>
                <span>${usagePct}%</span>
              </div>
              <div class="usage-bar">
                <div class="usage-fill" style="width:${usagePct}%"></div>
              </div>
            </div>
          </td>
          <td><span class="status-badge ${statusCls}">${statusText}</span></td>
          <td>
            <div class="actions">
              <button class="action-btn btn-promo-copy" title="Sao chép code"><img src="../assets/figma/532537d8-93ba-4c9d-96fa-2de1f9b24a15.svg" alt="Copy"></button>
              <button class="action-btn btn-promo-edit" title="Sửa"><img src="../assets/figma/1674064b-d40b-4ef9-a62a-4de433d3815d.svg" alt="Edit"></button>
              <button class="action-btn btn-promo-delete" title="Xóa"><img src="../assets/figma/f5149786-c302-4d1f-9ed5-c21381e3d625.svg" alt="Delete"></button>
            </div>
          </td>
        </tr>`;
    }).join('');

    tbody.querySelectorAll('.btn-promo-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = +btn.closest('tr').dataset.index;
        navigator.clipboard?.writeText(promotions[idx].code).catch(() => {});
        toast(`Đã sao chép: ${promotions[idx].code}`);
      });
    });

    tbody.querySelectorAll('.btn-promo-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('tr');
        const idx = +row.dataset.index;
        const nameEl = row.querySelector('.promo-name-text');
        const editing = nameEl.contentEditable === 'true';
        if (editing) {
          promotions[idx].name = nameEl.textContent.trim();
          store?.savePromotions(promotions);
          toast('Đã lưu thay đổi');
        }
        nameEl.contentEditable = String(!editing);
        nameEl.style.outline = editing ? 'none' : '1px dashed #154212';
      });
    });

    tbody.querySelectorAll('.btn-promo-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = +btn.closest('tr').dataset.index;
        if (confirm(`Xóa khuyến mãi "${promotions[idx].name}"?`)) {
          promotions.splice(idx, 1);
          store?.savePromotions(promotions);
          updateStats();
          renderPromotions();
          toast('Đã xóa khuyến mãi');
        }
      });
    });
  }

  function toast(msg) {
    const el = document.createElement('div');
    el.textContent = msg;
    el.style.cssText = 'position:fixed;top:20px;right:20px;background:#154212;color:#fff;padding:10px 14px;border-radius:8px;z-index:9999;font-family:Inter,sans-serif;font-size:14px;box-shadow:0 8px 20px rgba(0,0,0,.2)';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  }
});
