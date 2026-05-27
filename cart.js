/* ============================================================
   js/cart.js — Cart Page Logic
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  renderCartFromStore();
  initQuantityControls();
  initRemoveButtons();
  initCheckout();
  initContinueShopping();
  initPromoCode();
  initUpsellCards();
  syncToLocalStorage();
  window.MXCartBadge?.sync();
});

/* ---------- Navbar Active Link ---------- */
function initNavbar() {
  const navLinks = document.querySelectorAll(".nav-center .nav-link");
  navLinks.forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (href === "cart.html") {
      link.classList.add("active");
    }
  });
}

/* ---------- Sync cart items with localStorage ---------- */
const CART_KEY = "mx_cart_items";

function getCartItems() {
  if (window.MXStore) return window.MXStore.getCart();
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCartItems(items) {
  if (window.MXStore) {
    window.MXStore.saveCart(items);
    return;
  }
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.MXCartBadge?.sync(items);
}

function renderCartFromStore() {
  const list = document.getElementById("cart-items-list");
  if (!list || !window.MXStore) return;

  const items = window.MXStore.getCart();
  list.innerHTML = "";

  if (items.length === 0) {
    recalculateTotal();
    showEmptyCart();
    return;
  }

  items.forEach((item) => {
    const product = window.MXStore.getProductById(item.id) || item;
    const image =
      item.id === "bang-singapore"
        ? "assets/figma/cart-bang-singapore.png"
        : item.id === "trau-ba-la-xe" || item.id === "trau-ba-la-xea"
          ? "assets/figma/cart-trau-ba.png"
          : item.image || product.images?.[0] || "";
    const row = document.createElement("div");
    row.className = "cart-product-item";
    row.dataset.id = item.id;
    row.dataset.price = String(item.price || product.price || 0);
    row.innerHTML = `
      <div class="cart-item-image">
        <img src="${image}" alt="${item.name}" />
      </div>
      <div class="cart-item-info">
        <div class="cart-item-top">
          <div class="cart-item-meta">
            <span class="cart-item-tag">${product.category || "MẦM XANH"}</span>
            <h3 class="cart-item-name">${item.name}</h3>
          </div>
          <span class="cart-item-price">${window.MXStore.formatPrice(item.price)}</span>
        </div>
        <p class="cart-item-desc">${product.description || "Sản phẩm cây xanh được tuyển chọn."}</p>
        <div class="cart-item-bottom">
          <div class="cart-qty-control">
            <button class="cart-qty-btn cart-qty-minus" type="button" aria-label="Giảm số lượng">
              <span class="cart-qty-symbol" aria-hidden="true">-</span>
            </button>
            <span class="cart-qty-value">${item.quantity || 1}</span>
            <button class="cart-qty-btn cart-qty-plus" type="button" aria-label="Tăng số lượng">
              <span class="cart-qty-symbol" aria-hidden="true">+</span>
            </button>
          </div>
          <button class="cart-remove-btn" type="button" aria-label="Loại bỏ sản phẩm">
            <span class="cart-remove-icon" aria-hidden="true">×</span>
            Loại bỏ
          </button>
        </div>
      </div>
    `;
    list.appendChild(row);
  });

  recalculateTotal();
}

function syncToLocalStorage() {
  const cartItems = document.querySelectorAll(".cart-product-item");
  const items = [];

  cartItems.forEach((el) => {
    const id = el.dataset.id;
    const price = parseInt(el.dataset.price || "0", 10);
    const quantity = parseInt(
      el.querySelector(".cart-qty-value")?.textContent || "1",
      10,
    );
    const name = el.querySelector(".cart-item-name")?.textContent || "";
    const image = el.querySelector(".cart-item-image img")?.src || "";

    items.push({ id, name, price, quantity, image });
  });

  saveCartItems(items);

  recalculateTotal();
}

/* ---------- Quantity Controls ---------- */
function initQuantityControls() {
  const updateLocalStorageQty = () => {
    const cartItems = document.querySelectorAll(".cart-product-item");
    const items = [];

    cartItems.forEach((el) => {
      const id = el.dataset.id;
      const price = parseInt(el.dataset.price || "0", 10);
      const quantity = parseInt(
        el.querySelector(".cart-qty-value")?.textContent || "1",
        10,
      );
      const name = el.querySelector(".cart-item-name")?.textContent || "";
      const image = el.querySelector(".cart-item-image img")?.src || "";
      items.push({ id, name, price, quantity, image });
    });

    saveCartItems(items);
    recalculateTotal();
  };

  document.querySelectorAll(".cart-qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const isPlus =
        btn.classList.contains("cart-qty-plus") ||
        btn.getAttribute("aria-label") === "Tăng số lượng";
      const qtySpan = btn.parentElement.querySelector(".cart-qty-value");

      if (!qtySpan) return;

      let val = parseInt(qtySpan.textContent, 10) || 1;

      if (isPlus) {
        val++;
      } else if (val > 1) {
        val--;
      }

      qtySpan.textContent = val;
      updateLocalStorageQty();
    });
  });
}

/* ---------- Remove Buttons ---------- */
function initRemoveButtons() {
  document.querySelectorAll(".cart-remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const item = e.currentTarget.closest(".cart-product-item");
      if (!item) return;

      const itemName =
        item.querySelector(".cart-item-name")?.textContent || "Sản phẩm";
      item.style.transition = "opacity 0.3s, transform 0.3s";
      item.style.opacity = "0";
      item.style.transform = "translateX(-20px)";

      setTimeout(() => {
        item.remove();
        syncToLocalStorage();
        recalculateTotal();

        // If no more items, show empty state
        const remaining = document.querySelectorAll(".cart-product-item");
        if (remaining.length === 0) {
          showEmptyCart();
        }
      }, 300);

      showToast(`Đã xóa "${itemName}" khỏi giỏ hàng.`, "success");
    });
  });
}

/* ---------- Calculate & Update Totals ---------- */
function recalculateTotal() {
  let items = getCartItems();

  // If localStorage is empty, get from DOM
  if (items.length === 0) {
    const cartItems = document.querySelectorAll(".cart-product-item");
    cartItems.forEach((el) => {
      const id = el.dataset.id;
      const price = parseInt(el.dataset.price || "0", 10);
      const quantity = parseInt(
        el.querySelector(".cart-qty-value")?.textContent || "1",
        10,
      );
      const name = el.querySelector(".cart-item-name")?.textContent || "";
      const image = el.querySelector(".cart-item-image img")?.src || "";
      items.push({ id, name, price, quantity, image });
    });
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * (item.quantity || item.qty || 1),
    0,
  );
  const discount = parseFloat(sessionStorage.getItem("mx_discount") || "0");
  const discountAmount = Math.round(subtotal * discount);
  const total = subtotal - discountAmount;

  const subtotalEl = document.getElementById("summary-subtotal");
  const totalEl = document.getElementById("summary-total");

  if (subtotalEl) {
    subtotalEl.textContent = formatCurrency(subtotal);
  }
  if (totalEl) {
    totalEl.textContent = formatCurrency(total);
  }
}

/* ---------- Promo Code ---------- */
function initPromoCode() {
  const input = document.getElementById("promo-input");
  const applyBtn = document.getElementById("btn-apply-promo");
  const message = document.getElementById("promo-message");

  if (!input || !applyBtn) return;

  const applyPromo = () => {
    const code = (input.value || "").trim().toUpperCase();

    if (!code) {
      message.textContent = "Vui lòng nhập mã giảm giá.";
      message.className = "promo-message error";
      return;
    }

    if (code === "MAM15") {
      sessionStorage.setItem("mx_discount", "0.15");
      message.textContent = "Áp dụng thành công! Giảm 15% cho đơn hàng.";
      message.className = "promo-message success";
      recalculateTotal();
    } else {
      sessionStorage.removeItem("mx_discount");
      message.textContent = "Mã giảm giá không hợp lệ.";
      message.className = "promo-message error";
      recalculateTotal();
    }
  };

  applyBtn.addEventListener("click", applyPromo);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") applyPromo();
  });
}

/* ---------- Checkout Button ---------- */
function initCheckout() {
  const checkoutBtn = document.getElementById("btn-checkout-now");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const discount = sessionStorage.getItem("mx_discount");
      const promoCode = document
        .getElementById("promo-input")
        ?.value?.trim()
        .toUpperCase();
      const total = document.getElementById("summary-total")?.textContent || "";

      const params = new URLSearchParams();
      if (discount) params.set("discount", discount);
      if (promoCode) params.set("promo", promoCode);
      params.set("total", total);

      window.location.href = `checkout.html?${params.toString()}`;
    });
  }
}

/* ---------- Continue Shopping ---------- */
function initContinueShopping() {
  const continueBtn = document.getElementById("btn-continue-shopping");
  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      window.location.href = "category.html";
    });
  }
}

/* ---------- Upsell Cards ---------- */
function initUpsellCards() {
  const careCard = document.querySelector(".upsell-care");
  const shippingCard = document.querySelector(".upsell-shipping");

  if (careCard) {
    careCard.addEventListener("click", () => {
      window.location.href = "care_guide.html";
    });
  }

  if (shippingCard) {
    shippingCard.addEventListener("click", () => {
      showToast("Cam kết vận chuyển an toàn 100% từ Mầm Xanh!", "success");
    });
  }
}

/* ---------- Empty Cart State ---------- */
function showEmptyCart() {
  const cartItemsArea = document.querySelector(".cart-items-area");
  if (!cartItemsArea) return;

  const existingEmpty = document.querySelector(".cart-empty-state");
  if (existingEmpty) return;

  const emptyDiv = document.createElement("div");
  emptyDiv.className = "cart-empty-state";
  emptyDiv.style.cssText = `
        text-align: center;
        padding: 64px 32px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
    `;
  emptyDiv.innerHTML = `
        <div style="font-size: 64px;">🌿</div>
        <h3 style="font-family: var(--font-heading); font-size: 24px; color: var(--text); margin: 0;">Giỏ hàng trống</h3>
        <p style="font-family: var(--font-sans); font-size: 16px; color: var(--text-label); margin: 0;">Hãy khám phá những cây xanh tuyệt đẹp cho không gian sống của bạn.</p>
        <a href="category.html" style="background-color: var(--primary); color: white; padding: 12px 32px; border-radius: 999px; font-family: var(--font-sans); font-weight: 600; text-decoration: none; font-size: 14px;">Khám phá cửa hàng</a>
    `;

  cartItemsArea.insertBefore(emptyDiv, cartItemsArea.firstChild);
}

/* ---------- Toast Notification ---------- */
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "toastIn 0.3s ease reverse forwards";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/* ---------- Format Currency ---------- */
function formatCurrency(amount) {
  return window.MXStore
    ? window.MXStore.formatPrice(amount)
    : amount.toLocaleString("vi-VN") + "đ";
}
