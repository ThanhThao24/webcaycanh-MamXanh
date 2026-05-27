document.addEventListener("DOMContentLoaded", () => {
  const CART_KEY = "mamxanh_cart";
  const PRODUCTS_KEY = "mamxanh_products";

  let quantity = 1;
  let currentProduct = null;

  // Mock product data
  const MOCK_PRODUCTS = [
    {
      id: "bang-singapore",
      name: "Bàng Singapore",
      latin: "Ficus Lyrata",
      category: "CỔ ĐIỂN NHIỆT ĐỚI",
      price: 600000,
      description:
        "Được biết đến với những tán lá rộng hình đàn violin đầy ấn tượng, Bàng Singapore là điểm nhấn nghệ thuật tối thượng cho không gian nội thất hiện đại. Các mẫu cây của chúng tôi được tuyển chọn kỹ lưỡng về sức khỏe và cấu trúc cành tán.",
      images: [
        "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&h=800&fit=crop",
      ],
      tags: ["Ánh sáng mạnh", "Kích thước lớn"],
      care: {
        light: "Sáng gián tiếp",
        water: "Mỗi 1-2 tuần",
        temp: "18 - 27°C",
      },
    },
    {
      id: "trau-ba-la-xea",
      name: "Trầu Bà lá xẻ Thái",
      latin: "Monstera Deliciosa",
      category: "MẪU CÂY QUÝ HIẾM",
      price: 800000,
      description:
        "Dòng biến dị quý hiếm với các đốm trắng như dải ngân hà, cây khỏe mạnh bền vững. Monstera Deliciosa là một trong những cây nội thất được yêu thích nhất nhờ vẻ đẹp độc đáo của lá xẻ.",
      images: [
        "https://images.unsplash.com/photo-1616690248297-41bdfc24f2a7?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1598880940080-ff9a29891b85?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1593691509543-c55fb32e7e8e?w=800&h=800&fit=crop",
      ],
      tags: ["Ánh sáng vừa", "Dễ chăm sóc"],
      care: { light: "Sáng nhẹ", water: "Mỗi tuần", temp: "18 - 30°C" },
    },
    {
      id: "luoi-ho",
      name: "Lưỡi Hổ",
      latin: "Sansevieria Trifasciata",
      category: "DỄ CHĂM SÓC",
      price: 280000,
      description:
        "Cây lọc không khí hàng đầu, thanh lọc formaldehyde và benzene. Lưỡi Hổ cực kỳ dễ chăm sóc, chịu được điều kiện khắc nghiệt và không cần tưới nước thường xuyên.",
      images: [
        "https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=800&fit=crop",
      ],
      tags: ["Ít ánh sáng", "Tiết kiệm nước"],
      care: { light: "Ít ánh sáng", water: "Mỗi 2-3 tuần", temp: "15 - 35°C" },
    },
    {
      id: "lan-y",
      name: "Lan Ý",
      latin: "Spathiphyllum",
      category: "LỌC KHÔNG KHÍ",
      price: 320000,
      description:
        "Lan Ý với những bông hoa trắng tinh khôi mang đến không gian thanh lọc và bình yên. Đây là loại cây lọc không khí tuyệt vời, thân thiện với vật nuôi.",
      images: [
        "https://images.unsplash.com/photo-1593694676695-3ed2-a42c6-9508-91aa96d85d7?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&h=800&fit=crop",
      ],
      tags: ["Ít ánh sáng", "Thân thiện thú cưng"],
      care: { light: "Sáng nhẹ", water: "Mỗi tuần", temp: "18 - 30°C" },
    },
    {
      id: "kim-tien",
      name: "Cây Kim Tiền",
      latin: "Zamioculcas Zamiifolia",
      category: "CÂY PHONG THỦY",
      price: 450000,
      description:
        "Kim Tiền là biểu tượng của tài lộc và may mắn. Với lá xanh bóng mượt mà, cây mang lại năng lượng tích cực cho không gian sống và làm việc.",
      images: [
        "https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&h=800&fit=crop",
      ],
      tags: ["Ít ánh sáng", "May mắn tài lộc"],
      care: { light: "Ít ánh sáng", water: "Mỗi 2-3 tuần", temp: "18 - 30°C" },
    },
    {
      id: "sen-da",
      name: "Sen Đá",
      latin: "Echeveria",
      category: "ĐỂ BÀN",
      price: 150000,
      description:
        "Sen Đá với hàng trăm loài đa dạng về hình dạng và màu sắc. Nhỏ gọn, dễ trồng, phù hợp để bàn làm việc, kệ sách hoặc trang trí không gian nhỏ.",
      images: [
        "https://images.unsplash.com/photo-1446071103084-c257b5f70672?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&h=800&fit=crop",
      ],
      tags: ["Nắng mạnh", "Để bàn"],
      care: { light: "Nắng trực tiếp", water: "Mỗi 2 tuần", temp: "15 - 35°C" },
    },
  ];

  // Save mock products to localStorage if not exists
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

  function getProductById(id) {
    if (window.MXStore) {
      return window.MXStore.getProductById(id) || MOCK_PRODUCTS[0];
    }
    const products = getProducts();
    return (
      products.find((p) => p.id === id) ||
      MOCK_PRODUCTS.find((p) => p.id === id) ||
      MOCK_PRODUCTS[0]
    );
  }

  function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id") || "bang-singapore";
  }

  function formatPrice(price) {
    return Number(price || 0).toLocaleString("vi-VN") + "₫";
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

    const toast = document.createElement("div");
    toast.className = "product-toast";
    toast.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            ${message}
        `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = "toastIn 0.3s ease reverse";
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  function loadProduct() {
    const productId = getProductIdFromURL();
    const product = getProductById(productId);
    currentProduct = product;

    // Update page title
    document.title = `Mầm Xanh - ${product.name}`;

    // Breadcrumb
    const breadcrumbEl = document.getElementById("breadcrumb-name");
    if (breadcrumbEl) breadcrumbEl.textContent = product.name;

    // Category tag
    const categoryEl = document.getElementById("product-category");
    if (categoryEl) categoryEl.textContent = product.category;

    // Name & latin
    const nameEl = document.getElementById("product-name");
    if (nameEl) nameEl.textContent = product.name;

    const latinEl = document.getElementById("product-latin");
    if (latinEl) latinEl.textContent = product.latin;

    // Price
    const priceEl = document.getElementById("product-price");
    if (priceEl) priceEl.textContent = formatPrice(product.price);

    // Description
    const descEl = document.getElementById("product-desc");
    if (descEl) descEl.textContent = product.description;

    // Tags
    const tagsEl = document.getElementById("product-tags");
    if (tagsEl) {
      tagsEl.innerHTML = product.tags
        .map((tag) => `<span class="product-tag">${tag}</span>`)
        .join("");
    }

    // Care guide
    if (product.care) {
      const lightEl = document.getElementById("care-light");
      const lightValEl = document.getElementById("care-light-value");
      if (lightValEl) lightValEl.textContent = product.care.light;
      if (lightEl)
        lightEl.textContent = `Yêu cầu: ${product.care.light}. Đây là loại cây cần ánh sáng để phát triển tốt.`;

      const waterEl = document.getElementById("care-water");
      const waterValEl = document.getElementById("care-water-value");
      if (waterValEl) waterValEl.textContent = product.care.water;
      if (waterEl)
        waterEl.textContent = `Tưới nước ${product.care.water.toLowerCase()}. Chỉ tưới khi đất khô, tránh tưới quá nhiều gây thối rễ.`;

      const tempEl = document.getElementById("care-temp");
      const tempValEl = document.getElementById("care-temp-value");
      if (tempValEl) tempValEl.textContent = product.care.temp;
      if (tempEl)
        tempEl.textContent = `Nhiệt độ lý tưởng ${product.care.temp.toLowerCase()}. Tránh đặt cây gần nơi có gió lùa hoặc điều hòa.`;
    }

    // Images
    if (product.images && product.images.length > 0) {
      const mainImage = document.getElementById("main-image");
      if (mainImage) mainImage.src = product.images[0];

      const thumbsContainer = document.getElementById("gallery-thumbs");
      if (thumbsContainer && product.images.length > 1) {
        thumbsContainer.innerHTML = product.images
          .map(
            (img, i) => `
                    <div class="thumb ${i === 0 ? "active" : ""}" data-src="${img}">
                        <img src="${img.replace("w=800&h=800", "w=300&h=300")}" alt="${product.name} ${i + 1}" onerror="this.src='${img}'">
                    </div>
                `,
          )
          .join("");

        // Thumbnail click
        thumbsContainer.querySelectorAll(".thumb").forEach((thumb) => {
          thumb.addEventListener("click", () => {
            const newSrc = thumb.dataset.src;
            if (mainImage) mainImage.src = newSrc;
            thumbsContainer
              .querySelectorAll(".thumb")
              .forEach((t) => t.classList.remove("active"));
            thumb.classList.add("active");
          });
        });
      }
    }

    // Load related products
    loadRelatedProducts(productId);
  }

  function loadRelatedProducts(currentId) {
    const products = getProducts();
    const related = products.filter((p) => p.id !== currentId).slice(0, 4);
    const container = document.getElementById("related-products");
    if (!container) return;

    container.innerHTML = related
      .map(
        (product) => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-card-image">
                    <img src="${product.images[0]}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=400&fit=crop'">
                    <span class="product-badge">${product.category}</span>
                    <div class="product-add-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="5.25" y="0" width="1.5" height="24" rx="0.75" fill="white"/><rect x="0" y="5.25" width="24" height="1.5" rx="0.75" fill="white"/></svg>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-name-row">
                        <span class="product-name">${product.name}</span>
                        <span class="product-price">${formatPrice(product.price)}</span>
                    </div>
                    <p class="product-desc">${product.latin}</p>
                    <div class="product-tags">
                        ${product.tags.map((t) => `<span class="product-tag">${t}</span>`).join("")}
                    </div>
                </div>
            </div>
        `,
      )
      .join("");

    // Click to product detail
    container.querySelectorAll(".product-card").forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.dataset.id;
        window.location.href = `product_detail.html?id=${id}`;
      });
    });

    // Add to cart from related
    container.querySelectorAll(".product-add-btn").forEach((btn, i) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const product = related[i];
        addToCart(product, 1);
      });
    });
  }

  // Quantity controls
  const qtyMinus = document.getElementById("qty-minus");
  const qtyPlus = document.getElementById("qty-plus");
  const qtyValue = document.getElementById("qty-value");

  if (qtyMinus) {
    qtyMinus.addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        if (qtyValue) qtyValue.textContent = quantity;
      }
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener("click", () => {
      quantity++;
      if (qtyValue) qtyValue.textContent = quantity;
    });
  }

  // Cart functions
  function addToCart(product, qty = 1) {
    if (window.MXStore) {
      window.MXStore.addToCart(product, qty);
      return;
    }
    try {
      let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
      const existingIndex = cart.findIndex((item) => item.id === product.id);

      if (existingIndex >= 0) {
        cart[existingIndex].quantity =
          (cart[existingIndex].quantity || 1) + qty;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          productName: product.name,
          price: product.price,
          quantity: qty,
          image: product.images ? product.images[0] : null,
        });
      }

      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      window.MXCartBadge?.sync(cart);
    } catch (e) {
      console.warn("Could not add to cart");
    }
  }

  // Add to cart button
  const addToCartBtn = document.getElementById("btn-add-cart");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      if (!currentProduct) return;
      addToCart(currentProduct, quantity);
      showToast("Đã thêm vào giỏ hàng.");
    });
  }

  // Buy now button
  const buyNowBtn = document.getElementById("btn-buy-now");
  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", () => {
      if (!currentProduct) return;
      addToCart(currentProduct, quantity);
      window.location.href = "checkout.html";
    });
  }

  // Init
  initProducts();
  loadProduct();

  // Update cart badge on load
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    window.MXCartBadge?.sync(cart);
  } catch (e) {}
});
