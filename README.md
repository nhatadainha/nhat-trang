# Hồng Nhật ❤️ Thu Trang

1. Cài Node.js LTS.
2. Mở terminal trong thư mục này.
3. Chạy `npm install`.
4. Chạy `npm start`.
5. Mở `http://localhost:3000`.
6. Admin: `http://localhost:3000/admin`.

Tài khoản mặc định: admin
Mật khẩu mặc định: admin123

Có thể đặt ADMIN_PASSWORD và SESSION_SECRET trước khi deploy.

Lưu ý: bản đầu dùng JSON + uploads để chạy dễ trên máy. Khi deploy Render lâu dài, nên chuyển DB sang MongoDB Atlas và ảnh sang Cloudinary/S3 để dữ liệu không mất khi instance thay đổi.