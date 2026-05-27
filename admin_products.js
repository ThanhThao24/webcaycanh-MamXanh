document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'mx_products';
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

    // --- localStorage CRUD ---
    function loadProducts() {
        if (window.MXStore) return window.MXStore.getProducts();
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
        return [
            {
                id: 'prod-001', name: 'Monstera Deliciosa', sku: 'LVC-MON-001',
                category: 'Nhiệt đới',
                img: 'assets/figma/5c898a50-38eb-4a36-a1ed-be7783c672bd.jpg',
                price: '1,250,000đ', stock: 42, stockMax: 50, active: true
            },
            {
                id: 'prod-002', name: 'Cây Bàng Singapore', sku: 'LVC-FIG-042',
                category: 'Cây trong nhà',
                img: 'assets/figma/0053868c-dffe-4641-929c-c43e57fe78e3.jpg',
                price: '2,800,000đ', stock: 3, stockMax: 25, active: true
            },
        ];
    }

    function saveProducts(prods) {
        if (window.MXStore) {
            window.MXStore.saveProducts(prods);
            return;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prods));
    }

    function toAdminAsset(path) {
        if (!path) return '';
        if (/^https?:\/\//.test(path) || path.startsWith('../')) return path;
        return path.startsWith('assets/') ? '../' + path : path;
    }

    function generateId() {
        return 'prod-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    }

    function stockPercent(stock, max) {
        return max > 0 ? Math.min(100, Math.round((stock / max) * 100)) : 0;
    }

    function stockColor(pct) {
        if (pct <= 15) return '#60233e';
        if (pct <= 40) return '#f59e0b';
        return '#2d5a27';
    }

    function buildProductRow(prod) {
        const tr = document.createElement('tr');
        tr.dataset.id = prod.id;
        const stock = Number(prod.stock ?? 0);
        const stockMax = Number(prod.stockMax || Math.max(stock, 100));
        const pct = stockPercent(stock, stockMax);
        const sColor = stockColor(pct);
        const isLow = pct <= 15;
        const img = toAdminAsset(prod.img || prod.images?.[0] || '');
        const price = window.MXStore ? window.MXStore.formatPrice(prod.price) : prod.price;
        tr.style.borderBottom = '1px solid #eeeee9';
        if (isLow) tr.style.backgroundColor = 'rgba(96,35,62,0.03)';

        tr.innerHTML = `
            <td style="padding: 24px 32px;">
                <div class="product-img" style="width: 64px; height: 80px; background-color: #f4f4ef; border-radius: 16px; overflow: hidden;">
                    <img src="${img}" alt="${prod.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'">
                </div>
            </td>
            <td style="padding: 25.5px 32px;">
                <div class="product-name-col" style="display: flex; flex-direction: column;">
                    <span class="product-name" style="font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 18px; color: #154212;">${prod.name}</span>
                    <span class="product-sku" style="font-family: 'Inter', sans-serif; font-size: 12px; color: rgba(66,73,62,0.6); letter-spacing: 0.6px;">Mã SP: ${prod.sku}</span>
                </div>
            </td>
            <td style="padding: 48px 32px;">
                <div class="category-badge" style="background-color: #f2ddc0; color: #70604a; padding: 4px 12px; border-radius: 9999px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 10px; text-transform: uppercase; width: fit-content; text-align: center;">${prod.category}</div>
            </td>
            <td style="padding: 0 32px;"><span class="product-price" style="font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 16px; color: #154212;">${price}</span></td>
            <td style="padding: 0 64px 0 32px;">
                <div class="stock-info" style="display: flex; align-items: center; gap: 8px;">
                    <div class="stock-bar" style="flex: 1; height: 6px; background-color: #e8e8e3; border-radius: 9999px; position: relative; overflow: hidden;">
                        <div class="stock-fill" style="position: absolute; left: 0; top: 0; height: 100%; background-color: ${sColor}; width: ${pct}%;"></div>
                    </div>
                    <span class="stock-count" style="font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14px; color: ${isLow ? '#60233e' : '#42493e'};">${stock}</span>
                </div>
            </td>
            <td class="actions" style="padding: 0 32px; text-align: right;">
                <div style="display: flex; justify-content: flex-end; gap: 8px;">
                    <button class="action-btn" data-action="Edit" title="Sửa" style="background: none; border: none; padding: 8px; cursor: pointer;"><img src="../assets/figma/dbdf139c-7f3a-4a3a-95d5-40cd336e9c3e.svg" alt="Edit" style="width: 18px;"></button>
                    <button class="action-btn" data-action="Delete" title="Xóa" style="background: none; border: none; padding: 8px; cursor: pointer;"><img src="../assets/figma/88eb4ffb-7ab8-4c3b-892d-d0f307d44580.svg" alt="Delete" style="width: 16px;"></button>
                    <button class="action-btn" data-action="View" title="Xem" style="background: none; border: none; padding: 8px; cursor: pointer;"><img src="../assets/figma/a1735569-7705-4f84-9255-ed8ff870116b.svg" alt="View" style="width: 22px;"></button>
                </div>
            </td>
        `;
        return tr;
    }

    // Initial load
    let products = loadProducts();
    saveProducts(products);
    if (tableBody) {
        tableBody.innerHTML = '';
        products.forEach(prod => {
            tableBody.appendChild(buildProductRow(prod));
        });
    }

    // Add product button
    document.querySelectorAll('button').forEach(btn => {
        if (btn.textContent.includes('Thêm sản phẩm')) {
            btn.addEventListener('click', () => {
                const seq = products.length + 1;
                const newProd = {
                    id: generateId(),
                    name: `Sản phẩm mới ${seq}`,
                    sku: 'NEW-' + String(seq).padStart(3, '0'),
                    category: 'Mới',
                    images: [],
                    price: 0,
                    stock: 0,
                    stockMax: 100,
                    active: true
                };
                products.unshift(newProd);
                saveProducts(products);
                if (tableBody) {
                    const row = buildProductRow(newProd);
                    tableBody.prepend(row);
                }
                showNotice('Đã thêm sản phẩm mới.', 'success');
            });
        }
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

            if (action === 'Delete') {
                const confirmDelete = confirm('Bạn có chắc chắn muốn xóa sản phẩm này?');
                if (confirmDelete) {
                    products = products.filter(p => p.id !== id);
                    saveProducts(products);
                    row.style.opacity = '0.5';
                    setTimeout(() => row.remove(), 300);
                    showNotice('Đã xóa sản phẩm.', 'success');
                }
            } else if (action === 'Edit') {
                const editing = row.dataset.editing === 'true';
                row.dataset.editing = editing ? 'false' : 'true';
                const editableNodes = row.querySelectorAll('.product-name, .product-price, .stock-count');
                editableNodes.forEach((node) => {
                    node.contentEditable = editing ? 'false' : 'true';
                    node.style.outline = editing ? 'none' : '1px dashed #154212';
                    if (!editing) node.focus();
                });
                if (editing) {
                    const prod = products.find(p => p.id === id);
                    if (prod) {
                        const nameEl = row.querySelector('.product-name');
                        const priceEl = row.querySelector('.product-price');
                        const stockEl = row.querySelector('.stock-count');
                        if (nameEl) prod.name = nameEl.textContent.trim();
                        if (priceEl) prod.price = window.MXStore ? window.MXStore.parsePrice(priceEl.textContent) : priceEl.textContent.trim();
                        if (stockEl) prod.stock = parseInt(stockEl.textContent.trim()) || 0;
                        saveProducts(products);
                    }
                    showNotice('Đã lưu chỉnh sửa sản phẩm.', 'success');
                } else {
                    showNotice('Đang chỉnh sửa trực tiếp trên bảng.', 'info');
                }
            } else if (action === 'View') {
                window.location.href = '../product_detail.html';
            }
        });
    }

    // Pagination
    const pageNums = document.querySelectorAll('.page-num');
    pageNums.forEach(numBtn => {
        numBtn.addEventListener('click', () => {
            pageNums.forEach(btn => {
                btn.style.backgroundColor = '';
                btn.style.color = '#1a1c19';
                btn.style.borderColor = 'rgba(194,201,187,0.3)';
            });
            numBtn.style.backgroundColor = '#154212';
            numBtn.style.color = 'white';
            numBtn.style.borderColor = '#154212';
        });
    });

    // Filter boxes
    const filters = document.querySelectorAll('.filter-box');
    filters.forEach(filter => {
        filter.style.cursor = 'pointer';
        filter.addEventListener('click', () => {
            const select = filter.querySelector('select');
            if (select) {
                select.focus();
                filter.classList.toggle('active');
            }
        });
    });
});
