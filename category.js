/* ============================================================
   js/category.js — Category/Shop Page Logic
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initFilters();
  initProductCards();
  initAddToCart();
  initPagination();
  initPromoBanner();
  window.MXCartBadge?.sync();
  applyFilters();
});

const filterState = {
  category: new Set(),
  light: new Set(),
};

let paginationState = null;

/* ---------- Navbar Active Link ---------- */
function initNavbar() {
  const navLinks = document.querySelectorAll(".nav-center .nav-link");
  navLinks.forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (href === "category.html") {
      link.classList.add("active");
    }
  });
}

/* ---------- Filter System ---------- */
function initFilters() {
  const filterItems = document.querySelectorAll(".filter-item");

  filterItems.forEach((item) => {
    item.addEventListener("click", () => {
      const group = item.dataset.group;
      const value = item.dataset.value;
      if (!group || !value || !filterState[group]) return;

      if (filterState[group].has(value)) {
        filterState[group].delete(value);
        item.classList.remove("active");
      } else {
        filterState[group].add(value);
        item.classList.add("active");
      }

      applyFilters();
    });
  });
}

function applyFilters() {
  const cards = document.querySelectorAll(".shop-card");
  const categoryFilters = Array.from(filterState.category);
  const lightFilters = Array.from(filterState.light);

  cards.forEach((card) => {
    const tags = (card.dataset.tags || "")
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    const categoryMatch =
      categoryFilters.length === 0 ||
      categoryFilters.some((cat) => tags.includes(cat));

    const lightMatch =
      lightFilters.length === 0 ||
      lightFilters.some((light) => tags.includes(light));

    card.classList.toggle(
      "is-hidden-by-filter",
      !(categoryMatch && lightMatch),
    );
  });

  resetPaginationToFirstPage();
}

/* ---------- Product Card → Detail ---------- */
function initProductCards() {
  document.querySelectorAll(".shop-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".shop-add-btn")) return;

      const id = card.dataset.id;
      const name = card.dataset.name;
      const price = card.dataset.price;

      if (id) {
        const params = new URLSearchParams({ id, name, price });
        window.location.href = `product_detail.html?${params.toString()}`;
      } else {
        window.location.href = "product_detail.html";
      }
    });
  });
}

/* ---------- Add to Cart ---------- */
function initAddToCart() {
  const showToast = (message, type = "success") => {
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
  };

  const addToCart = (product) => {
    if (window.MXStore) {
      window.MXStore.addToCart(product, 1);
      return;
    }
    window.MXCartBadge?.sync();
  };

  document.querySelectorAll(".shop-add-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = btn.closest(".shop-card");
      const product = {
        id: card.dataset.id || "",
        name: card.dataset.name || "",
        price: parseInt(card.dataset.price || "0", 10),
        image: card.querySelector(".shop-card-image img")?.src || "",
      };
      addToCart(product);
      showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, "success");
    });
  });
}

/* ---------- Pagination ---------- */
function initPagination() {
  const pageBtns = Array.from(
    document.querySelectorAll(".page-numbers .page-btn"),
  );
  const prevBtn = document.querySelector(".page-prev");
  const nextBtn = document.querySelector(".page-next");
  const cards = Array.from(document.querySelectorAll(".shop-card"));

  paginationState = {
    pageBtns,
    prevBtn,
    nextBtn,
    cards,
    perPage: 6,
    currentPage: 1,
  };

  pageBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = parseInt(btn.textContent, 10);
      if (Number.isNaN(page)) return;
      paginationState.currentPage = page;
      renderPagination();
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (paginationState.currentPage > 1) {
        paginationState.currentPage -= 1;
        renderPagination();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const visibleCards = getVisibleCards();
      const totalPages = Math.max(
        1,
        Math.ceil(visibleCards.length / paginationState.perPage),
      );
      if (paginationState.currentPage < totalPages) {
        paginationState.currentPage += 1;
        renderPagination();
      }
    });
  }

  renderPagination();
}

function getVisibleCards() {
  if (!paginationState) return [];
  return paginationState.cards.filter(
    (card) => !card.classList.contains("is-hidden-by-filter"),
  );
}

function renderPagination() {
  if (!paginationState) return;

  const { cards, pageBtns, prevBtn, nextBtn, perPage } = paginationState;
  const visibleCards = getVisibleCards();
  const totalPages = Math.max(1, Math.ceil(visibleCards.length / perPage));
  paginationState.currentPage = Math.min(
    paginationState.currentPage,
    totalPages,
  );

  const start = (paginationState.currentPage - 1) * perPage;
  const end = start + perPage;

  cards.forEach((card) => card.classList.add("is-hidden-by-page"));
  visibleCards.slice(start, end).forEach((card) => {
    card.classList.remove("is-hidden-by-page");
  });

  pageBtns.forEach((btn, index) => {
    const pageNum = index + 1;
    btn.classList.toggle("active", pageNum === paginationState.currentPage);
    btn.style.display = pageNum <= totalPages ? "" : "none";
    btn.disabled = pageNum > totalPages;
  });

  if (prevBtn) {
    prevBtn.disabled = paginationState.currentPage <= 1;
    prevBtn.style.opacity = paginationState.currentPage <= 1 ? "0.3" : "1";
  }

  if (nextBtn) {
    nextBtn.disabled = paginationState.currentPage >= totalPages;
    nextBtn.style.opacity =
      paginationState.currentPage >= totalPages ? "0.3" : "1";
  }
}

function resetPaginationToFirstPage() {
  if (!paginationState) return;
  paginationState.currentPage = 1;
  renderPagination();
}

/* ---------- Promo Banner ---------- */
function initPromoBanner() {
  const promoBtn = document.querySelector(".promo-action-btn");
  if (promoBtn) {
    promoBtn.addEventListener("click", () => {
      window.location.href = "checkout.html?promo=NEW15";
    });
  }
}
