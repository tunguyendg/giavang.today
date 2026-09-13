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

Backend có cache để giảm số lần gọi upstream.

Kiến trúc
React Frontend
      │
      │ HTTP / JWT
      ▼
Express Backend
      │
      ├── Auth
      ├── Portfolio
      ├── Alerts
      ├── Push Subscription
      └── Gold API
      │
      ▼
MongoDB Atlas

Alert flow:

User tạo cảnh báo
       ↓
Alert lưu MongoDB
       ↓
Cron chạy mỗi 5 phút
       ↓
Lấy giá vàng hiện tại
       ↓
So sánh giá với target
       ↓
Tìm PushSubscription theo userId
       ↓
Gửi Web Push
       ↓
triggered = true
Chạy dự án local
1. Frontend

Từ thư mục root:

npm install
npm run dev

Frontend mặc định:

http://localhost:5173
2. Backend
cd server
npm install
npm run dev

Backend mặc định:

http://localhost:3000
Environment Variables
Frontend

File:

.env

Ví dụ:

VITE_API_URL=http://localhost:3000
VITE_VAPID_PUBLIC_KEY=your_public_vapid_key

Frontend sử dụng:

import.meta.env.VITE_API_URL

qua config:

src/config/api.js

Trong production có thể đổi thành:

VITE_API_URL=https://api.giavang.today

mà không cần sửa source code.

Backend

File:

server/.env

Các biến cần thiết:

PORT=3000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key

RESEND_API_KEY=your_resend_api_key

Không commit file .env hoặc secrets lên Git.

API
Gold
Lấy toàn bộ giá hiện tại
GET /api/gold
Lấy giá một loại vàng
GET /api/gold/:type

Ví dụ:

GET /api/gold/SJL1L10
Lấy lịch sử giá
GET /api/gold/:type/history?days=7

Ví dụ:

GET /api/gold/SJL1L10/history?days=30
Auth
Register
POST /api/auth/register
Login
POST /api/auth/login
Current user
GET /api/auth/me

Yêu cầu:

Authorization: Bearer <JWT>
Verify email
GET /api/auth/verify-email?token=...
Portfolio
Danh sách
GET /api/portfolio
Thêm
POST /api/portfolio
Xóa
DELETE /api/portfolio/:id

Các endpoint Portfolio yêu cầu JWT.

Alerts
Danh sách
GET /api/alerts
Tạo
POST /api/alerts
Xóa
DELETE /api/alerts/:id

Alerts được gắn với userId.

Push
Lưu browser subscription
POST /api/push/subscribe

Yêu cầu JWT.

MongoDB Collections

Hiện tại ứng dụng sử dụng các collection chính:

users
portfolios
alerts
pushsubscriptions

Quan hệ dữ liệu cơ bản:

User
├── Portfolio[]
├── Alert[]
└── PushSubscription[]

Các document liên quan user được liên kết bằng:

userId
Cấu trúc thư mục
giavang.today/
│
├── src/
│   ├── components/
│   │   └── Layout.jsx
│   │
│   ├── config/
│   │   └── api.js
│   │
│   ├── pages/
│   │   ├── Account.jsx
│   │   ├── Alerts.jsx
│   │   ├── ApiDocs.jsx
│   │   ├── Auth.jsx
│   │   ├── Home.jsx
│   │   ├── Portfolio.jsx
│   │   ├── Telegram.jsx
│   │   └── VerifyEmail.jsx
│   │
│   ├── services/
│   │   └── goldApi.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
│
├── public/
│   └── service-worker.js
│
├── server/
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── Alert.js
│   │   ├── Portfolio.js
│   │   ├── PushSubscription.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── alerts.js
│   │   ├── auth.js
│   │   ├── gold.js
│   │   ├── portfolio.js
│   │   └── push.js
│   │
│   ├── services/
│   │   ├── emailService.js
│   │   └── goldProvider.js
│   │
│   └── server.js
│
├── .env
├── package.json
└── README.md
Trạng thái phát triển
Hoàn thành
 Gold price API integration
 Price history
 Frontend dashboard
 MongoDB
 Register
 Login
 JWT
 Email verification
 Account page
 Portfolio persistence
 Portfolio P/L
 Alerts persistence
 Web Push
 PushSubscription persistence
 Cron alert engine
 Multi-device PushSubscription
 API URL config
 User-facing content cleanup
Roadmap
Trước deploy
 Production CORS configuration
 Production environment variables
 Production VAPID keys
 Resend domain verification
 Production email sender
 Review dev-only routes
 Final frontend / backend test
Deploy

Dự kiến:

giavang.today
→ React frontend

api.giavang.today
→ Express backend

MongoDB Atlas
→ Database
Sau deploy
 Edit Portfolio holding
 Alert management UI
 Re-enable triggered alerts
 Notification device management
 Telegram Bot
 PWA improvements
 Portfolio history
 Watchlist
 Additional gold providers
 Monitoring and logging
Production Notes

Frontend không nên hard-code backend URL.

Development:

VITE_API_URL=http://localhost:3000

Production:

VITE_API_URL=https://api.giavang.today

Nếu deploy backend trên shared hosting, cần kiểm tra khả năng duy trì background Node process.

Đối với alert scheduler, production có thể sử dụng hosting Cron Jobs thay vì phụ thuộc hoàn toàn vào node-cron.

giavang.today

Theo dõi giá vàng, quản lý danh mục và nhận cảnh báo khi giá chạm mức bạn quan tâm.