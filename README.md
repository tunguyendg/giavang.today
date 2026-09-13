# giavang.today

Ứng dụng theo dõi giá vàng tại Việt Nam, quản lý danh mục cá nhân và tạo cảnh báo giá theo tài khoản người dùng.

## Tính năng hiện có

### Giá vàng
- Theo dõi vàng thế giới XAU/USD
- Theo dõi các loại vàng phổ biến tại Việt Nam
- Giá mua vào / bán ra
- Biến động giá
- Tự động cập nhật mỗi 5 phút
- Biểu đồ lịch sử 1 / 7 / 30 ngày

### Tài khoản
- Đăng ký tài khoản
- Xác nhận email
- Đăng nhập bằng JWT
- Xem thông tin tài khoản
- Đăng xuất

### Danh mục vàng
- Thêm vàng vào danh mục
- Theo dõi số lượng và giá vốn
- Tính giá trị hiện tại
- Tính lãi / lỗ và tỷ lệ %
- Xóa tài sản khỏi danh mục
- Dữ liệu được lưu theo từng tài khoản

Giá trị hiện tại của danh mục được ước tính theo giá mua vào của từng loại vàng.

### Cảnh báo giá
- Chọn loại vàng
- Chọn điều kiện:
  - Giá giảm xuống dưới hoặc bằng mức đặt
  - Giá tăng lên trên hoặc bằng mức đặt
- Lưu cảnh báo theo tài khoản
- Backend kiểm tra cảnh báo mỗi 5 phút
- Gửi Web Push khi giá chạm ngưỡng
- Sau khi gửi thành công, alert được đánh dấu `triggered`

### Web Push
- Browser PushSubscription
- VAPID
- Service Worker
- Subscription được lưu trong MongoDB
- Một user có thể có nhiều thiết bị
- Subscription hết hạn có thể được tự động loại bỏ

### Telegram

Tính năng cảnh báo qua Telegram đang được phát triển.

Hiện tại người dùng có thể sử dụng Web Push để nhận cảnh báo trực tiếp trên trình duyệt.

---

# Tech Stack

## Frontend

- React
- Vite
- React Router
- Recharts
- Lucide React
- CSS

## Backend

- Node.js
- Express
- Mongoose
- JWT
- bcryptjs
- node-cron
- web-push
- Axios
- Resend

## Database

- MongoDB Atlas

## Email

- Resend

## Gold Data

Backend lấy dữ liệu giá vàng từ provider bên ngoài thông qua service abstraction:

```text
Frontend
   ↓
Express API
   ↓
goldProvider
   ↓
Gold price provider