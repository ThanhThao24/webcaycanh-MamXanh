/* ============================================================
   js/index.js — Home Page Logic
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initHeroButton();
  initBentoGrid();
  initProductCards();
  initAddToCart();
  window.MXCartBadge?.sync();
});

/* ---------- Navbar Active Link ---------- */
function initNavbar() {
  const navLinks = document.querySelectorAll(".nav-center .nav-link");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  navLinks.forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

/* ---------- Hero "Khám phá" Button ---------- */
function initHeroButton() {
  const exploreBtn = document.querySelector(".btn-hero-explore");
  if (exploreBtn) {
    exploreBtn.addEventListener("click", () => {
      const bentoSection = document.getElementById("bento-grid");
      if (bentoSection) {
        bentoSection.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.location.href = "category.html";
      }
    });
  }
}

/* ---------- Bento Grid Hover Effects ---------- */
function initBentoGrid() {
  const bentoCards = document.querySelectorAll(".bento-card, .bento-item");

  bentoCards.forEach((card) => {
    card.addEventListener("click", () => {
      const title = card.querySelector(".bento-card-title, .bento-title");
      if (!title) return;
      const text = title.textContent.trim().toLowerCase();

      if (text.includes("phong thủy")) {
        window.location.href = "category.html?filter=fengshui";
      } else if (text.includes("dễ chăm") || text.includes("cây dễ")) {
        window.location.href = "category.html?filter=easy";
      } else if (text.includes("văn phòng")) {
        window.location.href = "category.html?filter=office";
      } else {
        window.location.href = "category.html";
      }
    });
  });
}

/* ---------- Product Card Click → Product Detail ---------- */
function initProductCards() {
  document.querySelectorAll(".product-card").forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", (e) => {
      // Don't navigate if clicking the add-to-cart button
      if (e.target.closest(".product-add-btn")) return;

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
      toast.style.animation = "toastOut 0.3s ease forwards";
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

  document.querySelectorAll(".product-add-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = btn.closest(".product-card");
      const product = {
        id: card.dataset.id || "",
        name: card.dataset.name || "",
        price: parseInt(card.dataset.price || "0", 10),
        image: card.querySelector("img")?.src || "",
      };

      addToCart(product);
      showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, "success");
    });
  });
}

/* ---------- Footer Link Handlers ---------- */
document.querySelectorAll(".footer a[href]").forEach((link) => {
  link.style.cursor = "pointer";
});

/* ---------- Lazy Load Images ---------- */
function initLazyLoad() {
  const images = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });
    images.forEach(img => observer.observe(img));
  } else {
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}
