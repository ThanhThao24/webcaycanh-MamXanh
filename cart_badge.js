/* ============================================================
   js/cart_badge.js — Shared Cart Badge Utility
   ============================================================ */

(function initCartBadgeUtility() {
  const CART_KEYS = ["mamxanh_cart", "mx_cart_items"];
  const COUNT_KEY = "mx_cart_count";

  function safeParse(raw) {
    try {
      return JSON.parse(raw || "[]");
    } catch {
      return [];
    }
  }

  function readItems() {
    if (window.MXStore) {
      return window.MXStore.getCart();
    }
    for (const key of CART_KEYS) {
      const items = safeParse(localStorage.getItem(key));
      if (Array.isArray(items) && items.length > 0) {
        return items;
      }
    }
    return [];
  }

  function totalCount(items) {
    return (items || []).reduce(
      (sum, item) => sum + (item.quantity || item.qty || 1),
      0,
    );
  }

  function ensureBadge(container) {
    let badge =
      container.querySelector(".cart-count-badge") ||
      container.querySelector(".cart-badge");

    if (!badge) {
      badge = document.createElement("span");
      badge.className = "cart-count-badge cart-badge";
      container.classList.add("cart-icon-anchor");
      container.appendChild(badge);
    } else if (!badge.classList.contains("cart-count-badge")) {
      badge.classList.add("cart-count-badge");
    }

    return badge;
  }

  function renderCount(count) {
    const cartIcon = document.querySelector('.cart-btn, a[href="cart.html"]');
    if (!cartIcon) return;

    const existing =
      cartIcon.querySelector(".cart-count-badge") ||
      cartIcon.querySelector(".cart-badge");

    if (count <= 0) {
      if (existing) existing.remove();
      return;
    }

    const badge = ensureBadge(cartIcon);
    badge.textContent = String(count);
  }

  function sync(explicitItems) {
    const items = Array.isArray(explicitItems)
      ? explicitItems
      : readItems();
    const count = totalCount(items);
    localStorage.setItem(COUNT_KEY, String(count));
    renderCount(count);
    return count;
  }

  window.MXCartBadge = {
    sync,
    totalCount,
    readItems,
  };

  document.addEventListener("DOMContentLoaded", () => {
    sync();
  });

  window.addEventListener("storage", (event) => {
    if (
      !event.key ||
      CART_KEYS.includes(event.key) ||
      event.key === COUNT_KEY
    ) {
      sync();
    }
  });
})();
