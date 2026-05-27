document.addEventListener('DOMContentLoaded', () => {
  const store = window.MXStore;
  let categories = store?.getCategories() || [];

  const tbody = document.querySelector('.categories-table tbody');
  const statLarges = document.querySelectorAll('.stat-large');

  updateStats();
  renderCategories();

  document.querySelector('.btn-primary-solid.btn-add')?.addEventListener('click', () => {
    const newCat = {
      id: 'cat-' + Date.now(),
      name: 'Danh mục mới',
      desc: 'Mô tả danh mục',
      qty: 0,
      active: true,
      image: ''
    };
    categories.unshift(newCat);
    store?.saveCategories(categories);
    updateStats();
    renderCategories();
    toast('Đã thêm danh mục mới');
  });

  const searchInput = document.querySelector('.admin-search input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      tbody?.querySelectorAll('tr').forEach(row => {
        const name = row.querySelector('.cat-name')?.textContent.toLowerCase() || '';
        row.style.display = name.includes(q) ? '' : 'none';
      });
    });
  }

  document.querySelectorAll('.page-num').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.page-num').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  function updateStats() {
    const total = categories.length;
    const active = categories.filter(c => c.active !== false).length;
    const hidden = total - active;
    if (statLarges[0]) statLarges[0].textContent = total;
    if (statLarges[1]) statLarges[1].textContent = active;
    if (statLarges[2]) statLarges[2].textContent = hidden;
  }

  function renderCategories() {
    if (!tbody) return;
    tbody.innerHTML = categories.map((cat, i) => {
      const imgSrc = cat.img || cat.image || '';
      const imgTag = imgSrc
        ? `<img src="../${imgSrc}" alt="${cat.name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'">`
        : '';
      const isActive = cat.active !== false;
      const statusCls = isActive ? 'bg-green-light text-green-light' : 'bg-gray-light';
      const statusText = isActive ? 'Hoạt động' : 'Tạm dừng';
      return `
        <tr data-index="${i}">
          <td><div class="cat-img">${imgTag}</div></td>
          <td><span class="cat-name" contenteditable="false">${cat.name}</span></td>
          <td><p class="cat-desc" contenteditable="false">${cat.desc || ''}</p></td>
          <td><span class="cat-qty">${cat.qty || 0}</span></td>
          <td><div class="status-badge ${statusCls}">${statusText}</div></td>
          <td>
            <div class="actions">
              <button class="action-btn btn-cat-edit" data-action="Edit" title="Sửa"><img src="../assets/figma/911c0eb3-5297-4f60-aa03-c90dca39ec79.svg" alt="Edit"></button>
              <button class="action-btn btn-cat-toggle" data-action="Toggle" title="Bật/Tắt"><img src="../assets/figma/7fb08ea8-71c5-41f1-8fb2-0d49255f7b61.svg" alt="View"></button>
              <button class="action-btn btn-cat-delete" data-action="Delete" title="Xóa"><img src="../assets/figma/9c55a93f-8bb7-4523-a579-1f343794660c.svg" alt="Delete"></button>
            </div>
          </td>
        </tr>`;
    }).join('');

    tbody.querySelectorAll('.btn-cat-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('tr');
        const idx = +row.dataset.index;
        const nameEl = row.querySelector('.cat-name');
        const descEl = row.querySelector('.cat-desc');
        const editing = nameEl.contentEditable === 'true';
        if (editing) {
          categories[idx].name = nameEl.textContent.trim();
          categories[idx].desc = descEl.textContent.trim();
          store?.saveCategories(categories);
          toast('Đã lưu thay đổi');
        }
        nameEl.contentEditable = String(!editing);
        descEl.contentEditable = String(!editing);
        nameEl.style.outline = editing ? 'none' : '1px dashed #154212';
        descEl.style.outline = editing ? 'none' : '1px dashed #154212';
      });
    });

    tbody.querySelectorAll('.btn-cat-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = +btn.closest('tr').dataset.index;
        categories[idx].active = categories[idx].active === false;
        store?.saveCategories(categories);
        updateStats();
        renderCategories();
        toast('Đã cập nhật trạng thái');
      });
    });

    tbody.querySelectorAll('.btn-cat-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = +btn.closest('tr').dataset.index;
        if (confirm(`Xóa danh mục "${categories[idx].name}"?`)) {
          categories.splice(idx, 1);
          store?.saveCategories(categories);
          updateStats();
          renderCategories();
          toast('Đã xóa danh mục');
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
