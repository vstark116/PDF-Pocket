# PDF Pocket - Quản lý và Xử lý PDF Toàn Diện

Chào mừng bạn đến với **PDF Pocket**! Đây là dự án ứng dụng web tiện ích giúp xử lý hàng loạt các tác vụ liên quan đến file PDF như Nối bật, Nén kích thước, và Chuyển đổi định dạng tệp tin.

## Hướng Dẫn Sử Dụng (Local Development)

Nếu bạn muốn chạy thử nghiệm ứng dụng này trên máy tính của mình (Local):

1. **Cài đặt thư viện:**
   Chạy lệnh sau trong Terminal tại thư mục dự án để cài đặt tất cả các gói mở rộng:
   ```bash
   npm install
   ```

2. **Khởi chạy ứng dụng:**
   Sử dụng lệnh sau để bắt đầu server Next.js ở chế độ phát triển (Development mode):
   ```bash
   npm run dev
   ```

3. **Sử dụng:**
   Mở trình duyệt và truy cập vào địa chỉ: [http://localhost:3000](http://localhost:3000)

## Hướng Dẫn Push Code và Deploy 🚀

Mỗi khi bạn có sửa đổi code (chẳng hạn như fix lỗi tính năng **Ảnh sang PDF**, **Nén PDF**, và **PDF sang Word**) và muốn cập nhật phiên bản mới nhất lên GitHub để các nền tảng chạy tự động (Vercel/Netlify) hoạt động, hãy tuần tự thực hiện các lệnh sau:

```bash
# 1. Thêm tất cả các file vừa sửa đổi và thư viện mới (mới cài đặt) vào track
git add .

# 2. Tạo commit ghi chú lại thay đổi vừa làm
git commit -m "fix: sửa lỗi công cụ Ảnh sang PDF, Nén PDF và PDF sang Word"

# 3. Đẩy code lên nhánh chính của GitHub (thường là nhánh main hoặc master)
git push origin main
```

*(Lưu ý: Nếu GitHub của bạn đang dùng tên nhánh chính là `master`, bạn hãy đổi dòng cuối thành `git push origin master` nhé).*

## Tính Năng Nổi Bật

- **Ghép PDF:** Gộp nhiều file PDF lại làm một.
- **Cắt PDF:** Tách 1 file lớn thành nhiều file nhỏ.
- **Ảnh sang PDF:** Ghép nhiều hình ảnh (.png, .jpg) thành 1 file PDF liên tục.
- Cùng nhiều công cụ quản lý file PDF tiện lợi khác như xóa trang, đánh số trang, xoay trang.
