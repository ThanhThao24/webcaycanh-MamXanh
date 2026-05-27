# 🌿 Mầm Xanh - E-commerce Cây Cảnh

## 📋 Tổng quan
Website thương mại điện tử bán cây cảnh với đầy đủ tính năng cho khách hàng và admin.

## ✅ Tính năng đã hoàn thiện

### 🛒 **Frontend (Khách hàng)**
- ✅ Trang chủ với hero banner, bộ sưu tập, sản phẩm nổi bật
- ✅ Danh mục sản phẩm với filter, pagination
- ✅ Chi tiết sản phẩm với gallery, thông tin chăm sóc
- ✅ Giỏ hàng với tăng/giảm số lượng, mã giảm giá
- ✅ Thanh toán với form validation
- ✅ Theo dõi đơn hàng với timeline
- ✅ Tìm kiếm sản phẩm với filter
- ✅ Trang cá nhân với lịch sử đơn hàng
- ✅ Đăng nhập/Đăng ký với validation
- ✅ Tư vấn trực tuyến (chat)
- ✅ Tin tức & bài viết
- ✅ Hướng dẫn chăm sóc cây
- ✅ Các trang chính sách

### 🔧 **Backend (Admin)**
- ✅ Dashboard với thống kê, charts
- ✅ Quản lý sản phẩm (CRUD, inline editing)
- ✅ Quản lý đơn hàng (xem, cập nhật trạng thái, in hóa đơn)
- ✅ Quản lý danh mục (CRUD)
- ✅ Quản lý khuyến mãi (CRUD, activate/deactivate)
- ✅ Hỗ trợ khách hàng (view, reply, resolve)
- ✅ Phân tích dữ liệu (charts, export CSV)
- ✅ Báo cáo doanh thu (charts, compare periods)

## 🗂️ Cấu trúc File JavaScript

### Core
- `store.js` - Quản lý dữ liệu localStorage
- `cart_badge.js` - Badge giỏ hàng real-time

### Frontend
- `index.js` - Trang chủ
- `category.js` - Danh mục sản phẩm
- `product_detail.js` - Chi tiết sản phẩm
- `cart.js` - Giỏ hàng
- `checkout.js` - Thanh toán
- `tracking.js` - Theo dõi đơn hàng
- `success.js` - Đặt hàng thành công
- `search.js` - Tìm kiếm
- `profile.js` - Trang cá nhân
- `login.js` - Đăng nhập
- `register.js` - Đăng ký
- `consulting.js` - Tư vấn
- `news.js` - Tin tức
- `post.js` - Chi tiết bài viết
- `care_guide.js` - Hướng dẫn chăm sóc
- `policy_*.js` - Các trang chính sách

### Admin
- `dashboard.js` - Tổng quan
- `admin_products.js` - Quản lý sản phẩm
- `admin_orders.js` - Quản lý đơn hàng
- `admin_categories.js` - Quản lý danh mục
- `admin_promotions.js` - Quản lý khuyến mãi
- `admin_support.js` - Hỗ trợ khách hàng
- `admin_analytics.js` - Phân tích dữ liệu
- `admin_revenue.js` - Báo cáo doanh thu

## 🎨 Design System
- **Primary:** #154212 (xanh lá đậm)
- **Accent:** #f2ddc0 (be/vàng nhạt)
- **Fonts:** Manrope (heading), Inter (body)
- **Style:** Modern, clean, rounded corners

## 💾 Dữ liệu
- **Storage:** localStorage
- **Keys:** mamxanh_products, mamxanh_cart, mamxanh_orders, mamxanh_promotions, mamxanh_categories, mamxanh_user, mamxanh_session

## 🚀 Cách sử dụng
1. Mở `index.html` trong trình duyệt
2. Duyệt sản phẩm, thêm vào giỏ hàng
3. Thanh toán và theo dõi đơn hàng
4. Admin: Truy cập `admin/dashboard.html`
   - Demo account: admin@mamxanh.vn / 123456

## 📊 Thống kê
- **Tổng files JS:** 29 files
- **Tổng dòng code:** ~2500 lines
- **Tính năng:** 40+ features
- **Trang:** 25+ pages

## 🎯 Trạng thái
✅ **HOÀN THIỆN 100%** - Prototype đầy đủ tính năng

## 📝 Ghi chú
- Đây là prototype, không có backend thật
- Dữ liệu lưu trên localStorage
- Phù hợp cho demo, portfolio, hoặc base code để mở rộng

---
**Phát triển bởi:** Kiro AI Assistant  
**Ngày hoàn thành:** 28/04/2026
