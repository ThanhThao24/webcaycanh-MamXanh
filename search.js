document.addEventListener("DOMContentLoaded", () => {
  const CART_KEY = "mamxanh_cart";
  const PRODUCTS_KEY = "mamxanh_products";

  const MOCK_PRODUCTS = [
    {
      id: "bang-singapore",
      name: "Bàng Singapore",
      latin: "Ficus Lyrata",
      category: "CỔ ĐIỂN NHIỆT ĐỚI",
      categorySlug: "cay-trong-nha",
      price: 600000,
      description:
        "Điểm nhấn nghệ thuật tối thượng cho không gian nội thất hiện đại.",
      images: [
        "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&h=800&fit=crop",
      ],
      tags: ["Ánh sáng mạnh", "Kích thước lớn"],
    },
    {
      id: "trau-ba-la-xea",
      name: "Trầu Bà lá xẻ Thái",
      latin: "Monstera Deliciosa",
      category: "MẪU CÂY QUÝ HIẾM",
      categorySlug: "cay-trong-nha",
      price: 800000,
      description: "Dòng biến dị quý hiếm với các đốm trắng như dải ngân hà.",
      images: [
        "https://images.unsplash.com/photo-1616690248297-41bdfc24f2a7?w=600&h=800&fit=crop",
      ],
      tags: ["Ánh sáng vừa", "Dễ chăm sóc"],
    },
    {
      id: "luoi-ho",
      name: "Lưỡi Hổ",
      latin: "Sansevieria Trifasciata",
      category: "DỄ CHĂM SÓC",
      categorySlug: "cay-trong-nha",
      price: 280000,
      description:
        "Cây lọc không khí hàng đầu, thanh lọc formaldehyde và benzene.",
      images: [
        "https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=600&h=800&fit=crop",
      ],
      tags: ["Ít ánh sáng", "Tiết kiệm nước"],
    },
    {
      id: "lan-y",
      name: "Lan Ý",
      latin: "Spathiphyllum",
      category: "LỌC KHÔNG KHÍ",
      categorySlug: "cay-trong-nha",
      price: 320000,
      description:
        "Lan Ý với những bông hoa trắng tinh khôi mang đến không gian thanh lọc.",
      images: [
        "https://images.unsplash.com/photo-1593694676695-3ed2-a42c6-9508-91aa96d85d7?w=600&h=800&fit=crop",
      ],
      tags: ["Ít ánh sáng", "Thân thiện thú cưng"],
    },
    {
      id: "kim-tien",
      name: "Kim Tiền",
      latin: "Zamioculcas Zamiifolia",
      category: "CÂY PHONG THỦY",
      categorySlug: "cay-phong-thuy",
      price: 450000,
      description: "Kim Tiền là biểu tượng của tài lộc và may mắn.",
      images: [
        "https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=600&h=800&fit=crop",
      ],
      tags: ["Ít ánh sáng", "May mắn tài lộc"],
    },
    {
      id: "sen-da",
      name: "Sen Đá",
      latin: "Echeveria",
      category: "ĐỂ BÀN",
      categorySlug: "cay-ngoai-troi",
      price: 150000,
      description: "Sen Đá với hàng trăm loài đa dạng về hình dạng và màu sắc.",
      images: [
        "https://images.unsplash.com/photo-1446071103084-c257b5f70672?w=600&h=800&fit=crop",
      ],
      tags: ["Nắng mạnh", "Để bàn"],
    },
    {
      id: "dieu-hong",
      name: "Địa Hoàng",
      latin: "Anthurium Andraeanum",
      category: "CỔ ĐIỂN NHIỆT ĐỚI",
      categorySlug: "cay-trong-nha",
      price: 520000,
      description:
        "Hoa địa hoàng đỏ rực rỡ mang lại nguồn năng lượng tích cực.",
      images: [
        "https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=600&h=800&fit=crop",
      ],
      tags: ["Ánh sáng vừa", "Hoa đẹp"],
    },
    {
      id: "trau-ba-leo",
      name: "Trầu Bà Leo",
      latin: "Pothos Aureum",
      category: "DỄ CHĂM SÓC",
      categorySlug: "cay-trong-nha",
      price: 180000,
      description: "Cây leo dễ trồng, thích hợp trang trí kệ, ban công.",
      images: [
        "https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=600&h=800&fit=crop",
      ],
      tags: ["Ít ánh sáng", "Dễ chăm sóc"],
    },
    {
      id: "co-nha",
      name: "Cỏ Nhà",
      latin: "Chlorophytum Comosum",
      category: "LỌC KHÔNG KHÍ",
      categorySlug: "cay-trong-nha",
      price: 220000,
      description: "Cỏ nhảy xèm lọc không khí tuyệt vời, dễ nhân giống.",
      images: [
        "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600&h=800&fit=crop",
      ],
      tags: ["Ánh sáng vừa", "Lọc không khí"],
    },
  ];

  // Init products in localStorage
  function initProducts() {
    if (window.MXStore) {
      window.MXStore.getProducts();
      return;
    }
    try {
      const existing = localStorage.getItem(PRODUCTS_KEY);
      if (!existing) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(MOCK_PRODUCTS));
      }
    } catch (e) {}
  }

  function getProducts() {
    if (window.MXStore) {
      return window.MXStore.getProducts();
    }
    try {
      return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || MOCK_PRODUCTS;
    } catch (e) {
      return MOCK_PRODUCTS;
    }
  }

  function formatPrice(price) {
    return window.MXStore
      ? window.MXStore.formatPrice(price)
      : Number(price).toLocaleString("vi-VN") + "đ";
  }

  function showToast(message) {
    const container = document.getElementById("toast-container");
    if (container) {
      const toast = document.createElement("div");
      toast.className = "toast success";
      toast.textContent = message;
      container.appendChild(toast);
      setTimeout(() => {
        toast.style.animation = "toastOut 0.3s ease forwards";
        setTimeout(() => toast.remove(), 300);
      }, 2500);
      return;
    }

    const existing = document.querySelector(".search-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "search-toast";
    toast.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            ${message}
        `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = "toastIn 0.3s ease reverse";
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  function addToCart(product) {
    if (window.MXStore) {
      window.MXStore.addToCart(product, 1);
      showToast(`Đã thêm "${product.name}" vào giỏ hàng.`);
      return;
    }
    try {
      let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
      const existingIndex = cart.findIndex((item) => item.id === product.id);

      if (existingIndex >= 0) {
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          productName: product.name,
          price: product.price,
          quantity: 1,
          image: product.images ? product.images[0] : null,
        });
      }

      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      window.MXCartBadge?.sync(cart);
      showToast(`Đã thêm "${product.name}" vào giỏ hàng.`);
    } catch (e) {}
  }

  // State
  let allProducts = [];
  let activeFilter = "all";
  let searchQuery = "";

  // DOM Elements
  const searchInput = document.getElementById("search-input");
  const searchClear = document.getElementById("search-clear");
  const resultsGrid = document.getElementById("search-results-grid");
  const resultsMeta = document.getElementById("results-count-text");
  const emptyState = document.getElementById("search-empty-state");
  const loadingEl = document.getElementById("search-loading");

  function renderProducts(products) {
    if (products.length === 0) {
      resultsGrid.classList.add("hidden");
      emptyState.classList.remove("hidden");
      resultsMeta.textContent = "Không có kết quả";
      return;
    }

    emptyState.classList.add("hidden");
    resultsGrid.classList.remove("hidden");

    resultsGrid.innerHTML = products
      .map(
        (product) => `
            <div class="search-result-card" data-id="${product.id}">
                <div class="search-result-image">
                    <img src="${product.images[0]}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&h=800&fit=crop'">
                    <span class="search-result-badge">${product.category}</span>
                    <button class="search-result-add-btn" data-product-id="${product.id}" aria-label="Thêm vào giỏ hàng">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="white" stroke-width="1.5"/><rect x="10.25" y="0" width="1.5" height="24" rx="0.75" fill="white"/><rect x="0" y="10.25" width="24" height="1.5" rx="0.75" fill="white"/></svg>
                    </button>
                </div>
                <div class="search-result-info">
                    <div class="search-result-name-row">
                        <span class="search-result-name">${product.name}</span>
                        <span class="search-result-price">${formatPrice(product.price)}</span>
                    </div>
                    <span class="search-result-latin">${product.latin}</span>
                    <div class="search-result-tags">
                        ${product.tags.map((tag) => `<span class="product-tag">${tag}</span>`).join("")}
                    </div>
                </div>
            </div>
        `,
      )
      .join("");

    // Click product to detail
    resultsGrid.querySelectorAll(".search-result-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (!e.target.closest(".search-result-add-btn")) {
          const id = card.dataset.id;
          window.location.href = `product_detail.html?id=${id}`;
        }
      });
    });

    // Add to cart buttons
    resultsGrid.querySelectorAll(".search-result-add-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const productId = btn.dataset.productId;
        const product = allProducts.find((p) => p.id === productId);
        if (product) addToCart(product);
      });
    });
  }

  function filterProducts() {
    let filtered = allProducts;

    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.latin.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    // Filter by category
    if (activeFilter !== "all") {
      filtered = filtered.filter((p) => p.categorySlug === activeFilter);
    }

    return filtered;
  }

  function updateResults() {
    const filtered = filterProducts();
    const visibleProducts = searchQuery ? filtered : filtered.slice(0, 3);
    const queryText = searchQuery ? `"${searchQuery}"` : "Tất cả sản phẩm";
    const countText =
      filtered.length === 0
        ? `Không có kết quả cho ${queryText}`
        : searchQuery
          ? `${filtered.length} sản phẩm cho ${queryText}`
          : `Hiển thị ${visibleProducts.length} kết quả`;
    resultsMeta.textContent = countText;
    renderProducts(visibleProducts);
  }

  // Debounce utility
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // Search input
  const debouncedSearch = debounce(() => {
    searchQuery = searchInput.value.trim();
    searchClear.classList.toggle("hidden", !searchQuery);
    updateResults();
  }, 300);

  if (searchInput) {
    searchInput.addEventListener("input", debouncedSearch);
  }

  // Clear button
  if (searchClear) {
    searchClear.addEventListener("click", () => {
      searchInput.value = "";
      searchQuery = "";
      searchClear.classList.add("hidden");
      searchInput.focus();
      updateResults();
    });
  }

  // Filter chips
  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-chip")
        .forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      activeFilter = chip.dataset.filter;
      updateResults();
    });
  });

  // Suggestion buttons
  document.querySelectorAll(".suggestion-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const suggestion = btn.dataset.suggest;
      searchInput.value = suggestion;
      searchQuery = suggestion;
      searchClear.classList.remove("hidden");
      updateResults();
    });
  });

  // Load products and check URL param
  function init() {
    initProducts();
    allProducts = getProducts();

    // Check URL param
    const params = new URLSearchParams(window.location.search);
    const urlQuery = params.get("q");
    if (urlQuery) {
      searchInput.value = urlQuery;
      searchQuery = urlQuery;
      searchClear.classList.remove("hidden");
      updateResults();
    } else {
      resultsGrid.querySelectorAll(".search-result-card").forEach((card) => {
        card.addEventListener("click", () => {
          const id = card.dataset.id;
          if (id) window.location.href = `product_detail.html?id=${id}`;
        });
      });
    }

    window.MXCartBadge?.sync();
  }

  init();
});
