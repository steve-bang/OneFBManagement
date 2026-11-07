# Phân hệ 03. QR Ordering & Trải nghiệm khách (Phase 1)

## 1. Mục tiêu & người dùng
Khách tự gọi món và theo dõi đơn bằng trình duyệt điện thoại (PWA), không cài app, không bắt đăng nhập. Nhân viên nhận và xác nhận.

## 2. Thuật ngữ riêng
QR bàn, Phiên khách (guest session), Giỏ hàng, Đơn chờ xác nhận, Gọi nhân viên.

## 3. Quy trình chính
Xem `03-end-to-end-flows.md` luồng B. Chi tiết:
1. Quét QR -> URL chứa token ký -> server trả store, bàn, menu.
2. Tạo `guest_session` (cookie, hết hạn khi phiên bàn đóng hoặc 6 giờ).
3. Chọn món -> giỏ (lưu cục bộ) -> Gửi.
4. Order vào hàng chờ xác nhận hoặc tự nhận (cấu hình store).
5. Khách xem trạng thái từng món; gọi nhân viên/ xin nước/ xin tính tiền.
6. Thanh toán: hiện VietQR hoặc "Gọi thu ngân".
7. Tuỳ chọn: nhập SĐT để tích điểm (có đồng ý), đánh giá.

## 4. Quy tắc nghiệp vụ
- **BR-QR-001** Token QR ký HMAC, gắn `store_id+table_id+version`; sai/hết hạn: trang lỗi thân thiện.
- **BR-QR-002** Chế độ nhận đơn QR cấu hình theo store: (a) **cần nhân viên xác nhận** (mặc định, an toàn), (b) tự động nhận.
- **BR-QR-003** Chỉ gọi được khi bàn **đang mở** hoặc store bật "khách tự mở bàn". Bàn chưa mở: tạo yêu cầu mở bàn cho nhân viên.
- **BR-QR-004** Nhiều khách một bàn dùng chung order; mỗi item ghi `guest_session`. Mỗi người chỉ **huỷ món chưa nhận** của chính mình.
- **BR-QR-005** Chống lạm dụng: giới hạn tần suất gửi đơn (vd 5 round/10 phút), giới hạn số món mỗi lượt, chặn phiên bàn đã đóng, chống nhập QR từ xa (phiên cần mở ở bàn; token xoay được).
- **BR-QR-006** Món hết/ ngừng bán cập nhật tức thì; món đã trong giỏ bị đánh dấu và không gửi được.
- **BR-QR-007** Giá hiển thị là giá hiện tại; server tính lại khi gửi, báo nếu thay đổi.
- **BR-QR-008** Khách **không** thấy giảm giá thủ công của nhân viên; thấy tổng tạm tính do server tính.
- **BR-QR-009** Thanh toán QR: hiện mã VietQR theo tổng bill; sau khi khách báo "đã chuyển", trạng thái `awaiting_confirmation` cho tới khi thu ngân xác nhận.
- **BR-QR-010** SĐT chỉ thu khi khách chọn tích điểm, kèm ô đồng ý không tick sẵn; không bắt buộc để gọi món (xem `02-vietnam-context.md` mục 5).
- **BR-QR-011** Giao diện hỗ trợ tiếng Việt/ Anh; chữ lớn, thao tác một tay.
- **BR-QR-012** Khách không thể huỷ món đã được bếp nhận; chỉ yêu cầu nhân viên huỷ.
- **BR-QR-013** PWA tải nhanh trên mạng 3G/4G yếu: ảnh nén, tải lười, cache menu.

## 5. Vòng đời đơn QR
`cart -> awaiting_staff_confirm -> submitted (như order thường)`; hoặc `rejected` (nhân viên từ chối, có lý do hiện cho khách).

## 6. Màn hình (khách)
Trang chủ quán, Menu & tìm kiếm, Chi tiết món + option, Giỏ hàng, Theo dõi đơn, Gọi nhân viên, Thanh toán, Đánh giá.
Màn hình nhân viên: danh sách "đơn QR chờ xác nhận" với âm báo.

## 7. Quyền
Khách không có quyền; nhân viên: `qr.order.confirm`, `qr.order.reject`, `qr.table.rotate`.

## 8. Ngoại lệ
- Khách ngồi nhầm bàn/ quét QR bàn khác: nhân viên chuyển bàn; order đi theo.
- Người ngoài quán quét QR chụp lại: yêu cầu xác nhận nhân viên + xoay token khi phát hiện.
- Khách gửi nhầm: yêu cầu nhân viên huỷ trước khi bếp nhận (thời gian ngắn).
- Mất mạng giữa chừng: giỏ giữ cục bộ, gửi lại có idempotency.
- Khách đổi ngôn ngữ giữa chừng: giỏ giữ nguyên.

## 9. Sự kiện
`qr.order.pending`, `qr.order.confirmed/rejected`, `service_call.created`.

## 10. Dữ liệu
`guest_session`, `order` (`channel=qr`), `service_call`.

## 11. Báo cáo
Tỷ lệ đơn qua QR, thời gian từ gọi đến nhận món, số lần gọi nhân viên, đơn bị từ chối.

## 12. Câu hỏi mở
- Quán có sẵn lòng để khách tự trả bằng QR hay vẫn muốn thu ngân tới bàn?
- Có thu trước khi nấu (quán trà sữa) hay sau (quán ăn)?
- Mức độ tin tưởng khách: có cần OTP SĐT chống đặt phá?

## 13. Phase
P1: gọi món, theo dõi, gọi nhân viên, VietQR hiển thị. P2: tích điểm, đánh giá. P3: đa ngôn ngữ nâng cao, gợi ý món.
