# Yêu cầu phi chức năng

## 1. Hiệu năng (mục tiêu P1, cửa hàng 40 bàn, 10 thiết bị)
- Gửi order -> bếp thấy: p95 < 2 giây (mạng ổn).
- Mở POS, tải menu: < 2 giây từ cache; thao tác thêm món phản hồi tức thì (< 100ms).
- QR PWA tải lần đầu < 3 giây trên 4G; dung lượng khởi tạo < 1 MB (không tính ảnh).
- Sơ đồ bàn cập nhật trạng thái < 2 giây.

## 2. Offline và mạng không ổn định (quyết định: P1 không bắt buộc chạy offline đầy đủ)
Thực tế quán VN: Wi-Fi chập chờn, 4G dự phòng, mất điện.
Mức P1 bắt buộc ("chịu lỗi"):
1. App hiển thị **trạng thái kết nối** rõ ràng.
2. Hành động ghi (gửi order, xác nhận payment) có **hàng đợi gửi lại + idempotency**; không để người dùng tưởng đã gửi khi chưa.
3. Menu và sơ đồ bàn **cache** để mở được khi mất mạng ngắn; thêm món vào giỏ cục bộ được.
4. In phiếu bếp/ bill qua mạng LAN cục bộ hoạt động khi mất internet (nếu thiết bị in trong LAN).
5. Khi mạng trở lại: đồng bộ, báo xung đột.
Ngoài P1: bán hàng hoàn toàn offline, đồng bộ nhiều thiết bị offline, bù trừ xung đột phức tạp (P2+, cần chốt phạm vi).

## 3. Độ tin cậy và dữ liệu
- Sao lưu tự động hằng ngày, khôi phục theo điểm thời gian; RPO ≤ 15 phút, RTO ≤ 4 giờ (mục tiêu).
- Dữ liệu giao dịch không xoá; xoá mềm danh mục.
- Nhật ký audit lưu tối thiểu theo quy định lưu trữ chứng từ (xác nhận với kế toán, thường nhiều năm).
- Đồng bộ thời gian: dùng giờ máy chủ.

## 4. Bảo mật
- Đăng nhập: SĐT + OTP/ mật khẩu; PIN cho thiết bị quầy; khoá sau số lần sai; mã hoá mật khẩu/ PIN (băm).
- Cô lập tenant bằng row-level security; kiểm thử xuyên tenant.
- TLS mọi kết nối; token ngắn hạn + refresh; thu hồi thiết bị.
- QR token ký, xoay được; giới hạn tần suất công khai; chống bot trên endpoint khách.
- Dữ liệu nhạy cảm (nhân viên, tài khoản ngân hàng) mã hoá trường; quyền xem tối thiểu.
- Tuân thủ bảo vệ dữ liệu cá nhân (đồng ý, quyền của chủ thể, thông báo vi phạm) — xem `02-vietnam-context.md`.
- Không lưu thông tin thẻ; không xử lý PAN.

## 5. Thiết bị và phần cứng
- Điện thoại Android (từ Android 9) và iOS; tablet Android 8–11" ưu tiên landscape cho POS/KDS.
- Máy in nhiệt khổ 58/80mm ESC/POS qua LAN (ưu tiên), Bluetooth/USB (tuỳ). Cần xác định các hãng phổ biến (Xprinter, Epson, ...).
- Máy quét mã vạch/ ngăn kéo tiền nối máy in (RJ11) (tuỳ chọn).
- Màn hình KDS: tablet/ TV box chạy trình duyệt hoặc app, chữ lớn, tắt tự khoá màn hình.
- Chống chạm nhầm: nút nguy hiểm (huỷ, void) có xác nhận.

## 6. Khả dụng/ UX vận hành
- Tiếng Việt chính; tiếng Anh cho menu khách; định dạng `45.000 ₫`, ngày `dd/MM/yyyy`.
- Thao tác một tay cho phục vụ; chữ lớn cho bếp; độ tương phản cao (ánh sáng cửa hàng).
- Tiêu chuẩn tiếp cận cơ bản (cỡ chữ, tương phản, nhãn).
- Đào tạo nhân viên mới < 15 phút cho vai trò Waiter/ Kitchen.

## 7. Khả năng mở rộng và vận hành
- Mục tiêu P1: 500 cửa hàng, 50 đơn/ giờ cao điểm/ cửa hàng; hệ thống thiết kế để tăng theo tenant.
- Giám sát, cảnh báo lỗi, log có `tenant_id`/ `store_id`; theo dõi độ trễ sự kiện realtime.
- Triển khai không gián đoạn trong giờ cao điểm (cửa sổ bảo trì ngoài giờ).

## 8. Tuân thủ
- Hoá đơn điện tử: chưa triển khai, nhưng dữ liệu chuẩn bị sẵn.
- Thuế/ kế toán: dữ liệu xuất được để kế toán dùng; không thay thế phần mềm kế toán.
