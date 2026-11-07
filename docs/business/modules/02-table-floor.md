# Phân hệ 02. Bàn & Sơ đồ (Phase 1)

## 1. Mục tiêu & người dùng
Quản lý sơ đồ bàn, trạng thái, phiên bàn, đặt bàn. Waiter/Cashier thao tác hằng ngày; Manager cấu hình.

## 2. Thuật ngữ riêng
Khu vực, Bàn, Phiên bàn, Chuyển/Gộp/Tách bàn, Đặt bàn (reservation), Bàn tạm (walk-in), Mã QR bàn.

## 3. Quy trình chính
1. Manager tạo khu vực, bàn (mã, số ghế, vị trí trên sơ đồ).
2. Sinh và in QR cho từng bàn.
3. Khách tới: Waiter mở bàn (số khách) -> phiên bắt đầu.
4. Trong phiên: gọi món, chuyển/gộp/tách bàn.
5. Thanh toán xong: bàn sang `cleaning`; Waiter dọn -> `available`.
6. Đặt bàn: tạo -> tới giờ giữ bàn `reserved` -> khách đến thì mở bàn.

## 4. Quy tắc nghiệp vụ
- **BR-TBL-001** Mã bàn duy nhất trong store, ngắn dễ đọc (A1, 12, VIP2).
- **BR-TBL-002** Một bàn tối đa một phiên mở (ràng buộc DB).
- **BR-TBL-003** Bàn có order chưa thanh toán không được `available`.
- **BR-TBL-004** Chuyển bàn: bàn đích phải `available` hoặc `reserved` của chính khách; giữ nguyên order/lịch sử; ghi `table_transfer`; bếp/bar nhận thông báo bàn mới.
- **BR-TBL-005** Gộp bàn: các order được hợp nhất vào order của bàn chính; các bàn phụ trỏ tới order chính; hiển thị "gộp với A1". Không gộp nếu có order đã thanh toán một phần ở bàn phụ (phải xử lý trước).
- **BR-TBL-006** Tách bàn/ tách món: chọn các dòng món chuyển sang order mới (bàn khác hoặc cùng bàn); món đã `served`/đang chế biến vẫn chuyển được, giữ trạng thái.
- **BR-TBL-007** Bàn `needs_payment` tự về `occupied` nếu thêm món sau đó.
- **BR-TBL-008** Mã QR bàn là token ký; xoay token (rotate) vô hiệu hoá QR cũ; tự động xoay khi phiên bàn kết thúc nếu cấu hình "QR dùng một phiên" (mặc định tắt).
- **BR-TBL-009** Đặt bàn giữ tối đa N phút sau giờ hẹn (mặc định 15) rồi tự nhả và báo quản lý.
- **BR-TBL-010** Đặt bàn nhóm lớn có thể yêu cầu **đặt cọc**; tiền cọc trừ vào bill cuối (Phase 2).
- **BR-TBL-011** Hiển thị thời gian bàn đã ngồi; cảnh báo vượt ngưỡng (cấu hình) cho quản lý.
- **BR-TBL-012** Quán không dùng bàn (take-away): store có chế độ `no_table`; ẩn module bàn.

## 5. Vòng đời bàn
`available -> reserved -> occupied -> needs_payment -> cleaning -> available`.
`occupied -> occupied` (gọi thêm); `needs_payment -> occupied`; `reserved -> available` (quá giờ, huỷ).
Ai chuyển: Waiter (mở bàn, dọn), Cashier (đóng sau thanh toán), Manager (mọi chuyển).

## 6. Màn hình
Sơ đồ bàn theo khu vực (màu theo trạng thái, giờ ngồi, tổng tạm tính), Chi tiết bàn, Mở bàn, Chuyển/Gộp/Tách, Danh sách đặt bàn, Cấu hình sơ đồ & in QR.

## 7. Quyền
`table.view`, `table.open`, `table.transfer`, `table.merge`, `table.split`, `table.manage`, `reservation.manage`.

## 8. Ngoại lệ
- Khách đổi chỗ khi bếp đang làm: chuyển bàn, phiếu bếp đã in không đổi nhưng KDS hiển thị bàn mới.
- Hai nhân viên cùng bấm mở một bàn: người thứ hai nhận lỗi "bàn đã mở bởi X", đi tới bàn đó.
- Khách quét QR bàn **chưa mở**: hệ thống tự tạo phiên "QR" chờ nhân viên xác nhận hoặc theo cấu hình tự mở.
- Bàn bị bỏ quên (không thanh toán, không order lâu): cảnh báo quản lý dọn.

## 9. Sự kiện
`table.status_changed`, `table.transferred`, `table.merged`, `reservation.created/arrived/no_show`.

## 10. Dữ liệu
`area, table, table_session, table_transfer, reservation`.

## 11. Báo cáo
Vòng quay bàn, thời gian ngồi trung bình, doanh thu/bàn, giờ cao điểm.

## 12. Câu hỏi mở
- Quán có thật sự dùng sơ đồ kéo thả, hay danh sách bàn đơn giản là đủ (P1)?
- Quy tắc **tính tiền theo giờ** (bida, karaoke) có nằm ngoài phạm vi (đang giả định ngoài)?
- Quán có hay ghép bàn với khách lạ không?

## 13. Phase
P1: sơ đồ cơ bản, mở/đóng, chuyển, gộp, QR, đặt bàn đơn giản. P2: đặt cọc, nhắc đặt bàn. P3: đặt bàn trực tuyến cho khách.
