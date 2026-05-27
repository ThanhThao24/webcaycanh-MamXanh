/* ============================================================
   js/store.js — Shared client-side data store
   ============================================================ */

(function initMammXanhStore() {
  const KEYS = {
    products: "mamxanh_products",
    cart: "mamxanh_cart",
    orders: "mamxanh_orders",
    promotions: "mamxanh_promotions",
    categories: "mamxanh_categories",
    user: "mamxanh_user",
    session: "mamxanh_session",
    cartCount: "mx_cart_count",
  };

  const LEGACY_KEYS = {
    cart: ["mx_cart_items"],
    orders: ["mx_orders"],
    products: ["mx_products"],
    promotions: ["mx_promotions"],
    categories: ["mx_categories"],
  };

  const DEFAULT_PRODUCTS = [
    {
      id: "bang-singapore",
      name: "Bàng Singapore",
      latin: "Ficus Lyrata",
      sku: "MX-BAN-001",
      category: "Cây trong nhà",
      categorySlug: "cay-trong-nha",
      price: 600000,
      stock: 24,
      stockMax: 40,
      active: true,
      description:
        "Được biết đến với những tán lá rộng hình đàn violin đầy ấn tượng, Bàng Singapore là điểm nhấn nghệ thuật tối thượng cho không gian nội thất hiện đại. Các mẫu cây của chúng tôi được tuyển chọn kỹ lưỡng về sức khỏe và cấu trúc cành tán.",
      images: [
        "assets/figma/7362ee9c-83cb-4db8-b1a7-3bef2b33f6cc.png",
        "assets/figma/3f292c4e-d2c6-42b1-91be-3bb29474fc9e.png",
        "assets/figma/2dea73f1-b725-40d7-aa23-0a487132542b.png",
        "assets/figma/cart-bang-singapore.png",
      ],
      tags: ["Ánh sáng mạnh", "Kích thước lớn"],
      care: { light: "Sáng gián tiếp", water: "Mỗi 1-2 tuần", temp: "18 - 27°C" },
    },
    {
      id: "trau-ba-la-xe",
      name: "Trầu Bà lá xẻ Thái",
      latin: "Monstera Deliciosa",
      sku: "MX-MON-002",
      category: "Cây trong nhà",
      categorySlug: "cay-trong-nha",
      price: 800000,
      stock: 18,
      stockMax: 32,
      active: true,
      description:
        "Lá xẻ nhiệt đới nổi bật, dễ tạo chiều sâu cho không gian sống nhiều ánh sáng gián tiếp.",
      images: [
        "assets/figma/cart-trau-ba.png",
        "assets/figma/504168be-f3ba-40dd-9d02-b1968a5286a7.png",
        "assets/figma/c3d6e4b9-f8cb-4f90-9b72-0f95c37db2d2.png",
      ],
      tags: ["Ánh sáng vừa", "Dễ chăm sóc"],
      care: { light: "Sáng nhẹ", water: "Mỗi tuần", temp: "18 - 30°C" },
    },
    {
      id: "luoi-ho-laurenti",
      name: "Lưỡi hổ Laurenti",
      latin: "Sansevieria Trifasciata",
      sku: "MX-LHO-003",
      category: "Dễ chăm sóc",
      categorySlug: "cay-trong-nha",
      price: 600000,
      stock: 42,
      stockMax: 60,
      active: true,
      description:
        "Thanh lọc không khí và cực kỳ bền bỉ. Hoàn hảo cho không gian thiếu sáng.",
      images: [
        "assets/figma/0b792e64-6674-4316-9236-44d2610b4b45.jpg",
        "assets/figma/e2b7e060-89d0-4e77-8d46-758f09460557.png",
      ],
      tags: ["Ánh sáng yếu", "Thân thiện thú cưng"],
      care: { light: "Ít ánh sáng", water: "Mỗi 2-3 tuần", temp: "15 - 35°C" },
    },
    {
      id: "lan-y",
      name: "Lan Ý",
      latin: "Spathiphyllum",
      sku: "MX-LAN-004",
      category: "Lọc không khí",
      categorySlug: "cay-trong-nha",
      price: 320000,
      stock: 30,
      stockMax: 45,
      active: true,
      description:
        "Hoa trắng tinh khôi, giúp không gian mềm mại và dễ chịu hơn.",
      images: ["assets/figma/3cf2e8de-c0b8-4135-8dbd-c93a05c3e6b8.png"],
      tags: ["Ánh sáng yếu", "Lọc không khí"],
      care: { light: "Sáng nhẹ", water: "Mỗi tuần", temp: "18 - 30°C" },
    },
    {
      id: "kim-tien",
      name: "Cây Kim Tiền",
      latin: "Zamioculcas Zamiifolia",
      sku: "MX-KTI-005",
      category: "Phong thủy",
      categorySlug: "cay-phong-thuy",
      price: 450000,
      stock: 28,
      stockMax: 50,
      active: true,
      description:
        "Lá xanh bóng, biểu tượng tài lộc và may mắn cho nhà ở hoặc văn phòng.",
      images: ["assets/figma/91a02e1e-fd77-4e16-bb9f-b2b696737138.jpg"],
      tags: ["Ánh sáng yếu", "May mắn tài lộc"],
      care: { light: "Ít ánh sáng", water: "Mỗi 2-3 tuần", temp: "18 - 30°C" },
    },
    {
      id: "sen-da",
      name: "Sen đá",
      latin: "Echeveria",
      sku: "MX-SDA-006",
      category: "Để bàn",
      categorySlug: "cay-ngoai-troi",
      price: 350000,
      stock: 56,
      stockMax: 80,
      active: true,
      description:
        "Nhỏ gọn, đa dạng hình dáng, phù hợp kệ sách, bàn làm việc và góc decor nhỏ.",
      images: ["assets/figma/9697633d-bdd7-44be-8f07-987a08b66ae7.jpg"],
      tags: ["Nắng mạnh", "Để bàn"],
      care: { light: "Nắng trực tiếp", water: "Mỗi 2 tuần", temp: "15 - 35°C" },
    },
    {
      id: "o-liu-lun",
      name: "Ô liu lùn",
      latin: "Olea Europaea",
      sku: "MX-OLI-007",
      category: "Ngoài trời",
      categorySlug: "cay-ngoai-troi",
      price: 500000,
      stock: 16,
      stockMax: 30,
      active: true,
      description: "Dáng cây mộc mạc, hợp ban công nhiều nắng và góc sân nhỏ.",
      images: ["assets/figma/18f92f04-c249-4b0b-a048-bbe229c443ce.png"],
      tags: ["Ánh sáng mạnh", "Ngoài trời"],
      care: { light: "Nắng trực tiếp", water: "Mỗi tuần", temp: "18 - 32°C" },
    },
    {
      id: "duoi-cong",
      name: "Đuôi công",
      latin: "Calathea Makoyana",
      sku: "MX-DCO-008",
      category: "Cây trong nhà",
      categorySlug: "cay-trong-nha",
      price: 750000,
      stock: 14,
      stockMax: 24,
      active: true,
      description: "Vân lá mềm và giàu nhịp điệu, phù hợp không gian nội thất ẩm nhẹ.",
      images: ["assets/figma/c3d6e4b9-f8cb-4f90-9b72-0f95c37db2d2.png"],
      tags: ["Ánh sáng vừa", "Nhiệt đới"],
      care: { light: "Sáng gián tiếp", water: "Giữ ẩm nhẹ", temp: "18 - 28°C" },
    },
    {
      id: "bo-ba-sa-mac",
      name: "Bộ ba Sa mạc",
      latin: "Succulent Set",
      sku: "MX-SMC-009",
      category: "Để bàn",
      categorySlug: "cay-ngoai-troi",
      price: 850000,
      stock: 20,
      stockMax: 36,
      active: true,
      description: "Set cây mọng nước nhỏ gọn cho bàn làm việc, kệ sách và quà tặng.",
      images: ["assets/figma/402ccd75-5842-4a4d-a2ca-6784c0e5d07a.jpg"],
      tags: ["Nắng mạnh", "Để bàn"],
      care: { light: "Nắng nhẹ", water: "Mỗi 2 tuần", temp: "15 - 35°C" },
    },
  ];

  const DEFAULT_CATEGORIES = [
    { id: "cat-tropical", name: "Nhiệt đới", desc: "Các loài cây nhiệt đới với tán lá rộng và xanh mướt.", qty: 45, active: true, img: "assets/figma/caeef0bf-fe55-4d83-8c2b-3b43ee06cfdc.jpg" },
    { id: "cat-indoor",   name: "Trong nhà",  desc: "Cây lọc không khí, thích hợp trang trí không gian sống.", qty: 32, active: true, img: "assets/figma/7362ee9c-83cb-4db8-b1a7-3bef2b33f6cc.png" },
    { id: "cat-succulent", name: "Sen đá & Xương rồng", desc: "Các loài mọng nước đa dạng, dễ chăm sóc.", qty: 18, active: false, img: "assets/figma/9697633d-bdd7-44be-8f07-987a08b66ae7.jpg" },
    { id: "cat-rare",     name: "Giống cây quý hiếm", desc: "Bộ sưu tập những loài quý hiếm, đột biến gen đặc biệt.", qty: 12, active: true, img: "assets/figma/82118e07-e632-4236-851b-6d1e8510c991.jpg" },
  ];

  const DEFAULT_PROMOTIONS = [
    { id: "promo-bloom24",  code: "BLOOM24",  name: "Spring Bloom",            desc: "Giảm giá đầu xuân 2024",      type: "amount",  value: 50000, status: "running",   usage: 250, usageMax: 500 },
    { id: "promo-hello10",  code: "HELLO10",  name: "Welcome New User",        desc: "Ưu đãi khách hàng mới",       type: "percent", value: 15,    status: "running",   usage: 890, usageMax: 1000 },
    { id: "promo-succu20",  code: "SUCCU20",  name: "Flash Sale Succulents",   desc: "Giảm giá sen đá cuối tuần",   type: "percent", value: 20,    status: "scheduled", usage: 0,   usageMax: 200 },
    { id: "promo-winter23", code: "WINTER23", name: "Winter Sale 2023",        desc: "Xả kho mùa đông",             type: "percent", value: 30,    status: "expired",   usage: 500, usageMax: 500 },
  ];

  const DEFAULT_ORDERS = [
    {
      id: "ORD-2849",
      date: "2026-04-20T09:30:00.000Z",
      customer: "Nguyễn Văn Hiếu",
      items: [{ id: "bang-singapore", name: "Bàng Singapore", price: 600000, quantity: 1, image: "assets/figma/7362ee9c-83cb-4db8-b1a7-3bef2b33f6cc.png" }],
      shipping: { fullname: "Nguyễn Văn Hiếu", phone: "0908 123 456", email: "hieu@example.com", address: "12 Nguyễn Huệ", district: "Quận 1", city: "TP. Hồ Chí Minh" },
      payment: "bank",
      subtotal: 600000,
      discount: 0,
      total: 600000,
      status: "delivered",
    },
    {
      id: "ORD-2850",
      date: "2026-04-21T10:15:00.000Z",
      customer: "Trần Thị Lan",
      items: [{ id: "trau-ba-la-xe", name: "Trầu Bà lá xẻ Thái", price: 800000, quantity: 1, image: "assets/figma/504168be-f3ba-40dd-9d02-b1968a5286a7.png" }],
      shipping: { fullname: "Trần Thị Lan", phone: "0909 456 789", email: "lan@example.com", address: "88 Lê Lợi", district: "Quận 3", city: "TP. Hồ Chí Minh" },
      payment: "cod",
      subtotal: 800000,
      discount: 120000,
      total: 680000,
      status: "pending",
    },
    {
      id: "ORD-2851",
      date: "2026-04-21T15:40:00.000Z",
      customer: "Lê Minh",
      items: [{ id: "luoi-ho-laurenti", name: "Lưỡi hổ Laurenti", price: 600000, quantity: 8, image: "assets/figma/0b792e64-6674-4316-9236-44d2610b4b45.jpg" }],
      shipping: { fullname: "Lê Minh", phone: "0911 234 567", email: "minh.le@example.com", address: "55 Nguyễn Trãi", district: "Quận 5", city: "TP. Hồ Chí Minh" },
      payment: "card",
      subtotal: 4800000,
      discount: 0,
      total: 4800000,
      status: "processing",
    },
    {
      id: "ORD-2852",
      date: "2026-04-22T08:20:00.000Z",
      customer: "Phạm Văn Quý",
      items: [{ id: "sen-da", name: "Sen đá", price: 350000, quantity: 2, image: "assets/figma/9697633d-bdd7-44be-8f07-987a08b66ae7.jpg" }],
      shipping: { fullname: "Phạm Văn Quý", phone: "0907 888 999", email: "quy.pham@example.com", address: "21 Pasteur", district: "Quận 1", city: "TP. Hồ Chí Minh" },
      payment: "momo",
      subtotal: 700000,
      discount: 0,
      total: 850000,
      status: "cancelled",
    },
    {
      id: "ORD-2853",
      date: "2026-04-22T11:05:00.000Z",
      customer: "Kiều Duy",
      items: [{ id: "bang-singapore", name: "Bàng Singapore", price: 600000, quantity: 20, image: "assets/figma/7362ee9c-83cb-4db8-b1a7-3bef2b33f6cc.png" }],
      shipping: { fullname: "Kiều Duy", phone: "0903 555 222", email: "duy.kieu@example.com", address: "100 Cách Mạng Tháng 8", district: "Quận 3", city: "TP. Hồ Chí Minh" },
      payment: "bank",
      subtotal: 12000000,
      discount: 0,
      total: 12000000,
      status: "shipping",
    },
  ];

  const STATUS_FLOW = [
    { id: "pending", text: "Chờ xác nhận" },
    { id: "processing", text: "Đang xử lý" },
    { id: "shipping", text: "Đang giao hàng" },
    { id: "delivered", text: "Đã giao hàng" },
    { id: "cancelled", text: "Đã hủy" },
  ];

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  }

  function parsePrice(value) {
    if (typeof value === "number") return value;
    return Number(String(value || "0").replace(/[^\d]/g, "")) || 0;
  }

  function formatPrice(value) {
    return Number(value || 0).toLocaleString("vi-VN") + "đ";
  }

  function normalizeProduct(item, index = 0) {
    const id = item.id || item.sku || "product-" + (index + 1);
    let images = item.images?.length ? item.images : (item.image || item.img ? [item.image || item.img] : []);
    if (!images.length) {
      const def = DEFAULT_PRODUCTS.find((p) => p.id === id);
      if (def?.images?.length) images = def.images.slice();
    }
    const image = images[0] || "";
    return {
      id,
      name: item.name || item.productName || "Sản phẩm",
      latin: item.latin || item.sku || "",
      sku: item.sku || id.toUpperCase(),
      category: item.category || "Cây trong nhà",
      categorySlug: item.categorySlug || slugify(item.category || "cay-trong-nha"),
      price: parsePrice(item.price),
      stock: Number(item.stock ?? 20),
      stockMax: Number(item.stockMax ?? 50),
      active: item.active !== false,
      description: item.description || item.desc || "Cây xanh được tuyển chọn bởi Mầm Xanh.",
      image,
      images,
      tags: item.tags?.length ? item.tags : ["Dễ chăm sóc"],
      care: item.care || { light: "Sáng gián tiếp", water: "Mỗi tuần", temp: "18 - 30°C" },
    };
  }

  function normalizeCartItem(item, index = 0) {
    const id = item.id || item.productId || "cart-" + index;
    let image = item.image || item.images?.[0] || "";
    if (!image) {
      const def = DEFAULT_PRODUCTS.find((p) => p.id === id);
      image = def?.images?.[0] || "";
    }
    return {
      id,
      name: item.name || item.productName || "Sản phẩm",
      productName: item.productName || item.name || "Sản phẩm",
      price: parsePrice(item.price),
      quantity: Number(item.quantity || item.qty || 1),
      image,
    };
  }

  function normalizeOrder(order, index = 0) {
    const status = order.status || STATUS_FLOW[order.statusIndex || 0]?.id || "pending";
    return {
      id: order.id || "MX-" + Date.now() + "-" + index,
      date: order.date || new Date().toISOString(),
      customer: order.customer || order.shipping?.fullname || "Khách hàng",
      initials: order.initials || getInitials(order.customer || order.shipping?.fullname || "KH"),
      items: (order.items || []).map(normalizeCartItem),
      shipping: order.shipping || {},
      payment: order.payment || "",
      promo: order.promo || null,
      subtotal: parsePrice(order.subtotal || order.amount),
      discount: parsePrice(order.discount),
      total: parsePrice(order.total || order.amount),
      status,
    };
  }

  function getInitials(name) {
    return String(name)
      .trim()
      .split(/\s+/)
      .slice(-2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "KH";
  }

  function slugify(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function migrateArray(targetKey, legacyKeys, normalizer, defaults) {
    const current = read(targetKey, null);
    if (Array.isArray(current) && current.length) return current.map(normalizer);

    for (const legacyKey of legacyKeys) {
      const legacy = read(legacyKey, null);
      if (Array.isArray(legacy) && legacy.length) {
        const normalized = legacy.map(normalizer);
        write(targetKey, normalized);
        return normalized;
      }
    }

    const seeded = defaults.map(normalizer);
    write(targetKey, seeded);
    return seeded;
  }

  function getProducts() {
    return migrateArray(KEYS.products, LEGACY_KEYS.products, normalizeProduct, DEFAULT_PRODUCTS);
  }

  function saveProducts(products) {
    return write(KEYS.products, products.map(normalizeProduct));
  }

  function getProductById(id) {
    const products = getProducts();
    return products.find((product) => product.id === id) || products[0] || null;
  }

  function getCart() {
    return migrateArray(KEYS.cart, LEGACY_KEYS.cart, normalizeCartItem, []);
  }

  function saveCart(items) {
    const normalized = items.map(normalizeCartItem).filter((item) => item.quantity > 0);
    write(KEYS.cart, normalized);
    localStorage.setItem(KEYS.cartCount, String(totalCartCount(normalized)));
    window.MXCartBadge?.sync(normalized);
    return normalized;
  }

  function addToCart(product, quantity = 1) {
    const cart = getCart();
    const normalizedProduct = normalizeProduct(product);
    const existing = cart.find((item) => item.id === normalizedProduct.id);
    if (existing) {
      existing.quantity += Number(quantity || 1);
    } else {
      cart.push({
        id: normalizedProduct.id,
        name: normalizedProduct.name,
        productName: normalizedProduct.name,
        price: normalizedProduct.price,
        quantity: Number(quantity || 1),
        image: normalizedProduct.images[0] || "",
      });
    }
    return saveCart(cart);
  }

  function updateCartQty(id, quantity) {
    return saveCart(getCart().map((item) => (item.id === id ? { ...item, quantity } : item)));
  }

  function removeCartItem(id) {
    return saveCart(getCart().filter((item) => item.id !== id));
  }

  function clearCart() {
    return saveCart([]);
  }

  function totalCartCount(items = getCart()) {
    return items.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  }

  function getPromotions() {
    return migrateArray(KEYS.promotions, LEGACY_KEYS.promotions, (promo) => ({
      id: promo.id || "promo-" + promo.code,
      code: String(promo.code || "").toUpperCase(),
      name: promo.name || promo.desc || "Khuyến mãi",
      type: promo.type || (String(promo.discount || "").includes("%") ? "percent" : "amount"),
      value: Number(promo.value || String(promo.discount || "").match(/\d+/)?.[0] || 0),
      status: promo.status || "running",
      usage: Number(promo.usage || 0),
      usageMax: Number(promo.usageMax || 500),
    }), DEFAULT_PROMOTIONS);
  }

  function savePromotions(promotions) {
    return write(KEYS.promotions, promotions);
  }

  function getActivePromo(code) {
    const normalized = String(code || "").trim().toUpperCase();
    return getPromotions().find((promo) => promo.code === normalized && promo.status === "running") || null;
  }

  function calculateTotals(items = getCart(), promoCode = "") {
    const subtotal = items.reduce((sum, item) => sum + parsePrice(item.price) * Number(item.quantity || 1), 0);
    const shipping = 0;
    const promo = getActivePromo(promoCode);
    const discount = promo?.type === "percent" ? Math.round((subtotal * promo.value) / 100) : promo?.type === "amount" ? promo.value : 0;
    return { subtotal, shipping, discount, total: Math.max(0, subtotal + shipping - discount), promo };
  }

  function getOrders() {
    return migrateArray(KEYS.orders, LEGACY_KEYS.orders, normalizeOrder, DEFAULT_ORDERS);
  }

  function saveOrders(orders) {
    return write(KEYS.orders, orders.map(normalizeOrder));
  }

  function createOrder(order) {
    const orders = getOrders();
    const normalized = normalizeOrder({
      id: order.id || "MX-" + Date.now(),
      ...order,
      status: order.status || "pending",
    });
    orders.unshift(normalized);
    saveOrders(orders);
    return normalized;
  }

  function getOrderById(id) {
    return getOrders().find((order) => order.id === id) || null;
  }

  function updateOrderStatus(id, status) {
    const orders = getOrders();
    const order = orders.find((item) => item.id === id);
    if (order) order.status = status;
    saveOrders(orders);
    return order || null;
  }

  function getCategories() {
    const defaultImgByName = Object.fromEntries(DEFAULT_CATEGORIES.map(c => [c.name, c.img || ""]));
    return migrateArray(KEYS.categories, LEGACY_KEYS.categories, (cat, index) => {
      const img = cat.img || cat.image || defaultImgByName[cat.name] || "";
      return {
        id: cat.id || "cat-" + index,
        name: cat.name || "Danh mục",
        desc: cat.desc || "",
        img,
        image: img,
        qty: Number(cat.qty || 0),
        active: cat.active !== false,
      };
    }, DEFAULT_CATEGORIES);
  }

  function saveCategories(categories) {
    return write(KEYS.categories, categories);
  }

  window.MXStore = {
    keys: KEYS,
    statusFlow: STATUS_FLOW,
    read,
    write,
    parsePrice,
    formatPrice,
    slugify,
    getInitials,
    getProducts,
    saveProducts,
    getProductById,
    getCart,
    saveCart,
    addToCart,
    updateCartQty,
    removeCartItem,
    clearCart,
    totalCartCount,
    getPromotions,
    savePromotions,
    getActivePromo,
    calculateTotals,
    getOrders,
    saveOrders,
    createOrder,
    getOrderById,
    updateOrderStatus,
    getCategories,
    saveCategories,
  };

  getProducts();
  getPromotions();
  getCategories();
  getCart();
  getOrders();
})();
