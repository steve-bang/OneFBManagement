# Phân hệ 01. POS & Quản lý đơn (Phase 1)

## 1. Mục tiêu & người dùng
Tạo, sửa, gửi, theo dõi, huỷ đơn mọi kênh. Cashier, Waiter tạo; Manager duyệt ngoại lệ.

## 2. Thuật ngữ riêng
Order, Round, Order item, Kênh (dine_in, counter, takeaway, delivery_app, qr), Mã đơn, Số thứ tự, Giảm giá, Phụ thu, Void.

## 3. Quy trình chính
1. Tạo order (gắn bàn hoặc kênh).
2. Thêm món: chọn món -> option -> số lượng -> ghi chú.
3. Gửi (Send): tạo round, chia theo station, in/hiện phiếu.
4. Sửa sau khi gửi: thêm món (round mới), huỷ/void (theo quy tắc).
5. Áp giảm giá/ khuyến mãi/ phí dịch vụ/ phụ thu (theo quyền).
6. In bill tạm tính.
7. Thanh toán (phân hệ 07) -> `paid` -> `closed`.

## 4. Quy tắc nghiệp vụ
- **BR-ORD-001** Mã đơn dễ đọc, tăng dần theo store+ngày (vd `0712-0034`); số thứ tự quầy reset mỗi ngày.
- **BR-ORD-002** Món chưa gửi: sửa/xoá tự do. Đã gửi: thêm được; xoá phải qua huỷ có lý do.
- **BR-ORD-003** Gửi order rỗng không được. Gửi lại (retry) dùng `Idempotency-Key` để không trùng phiếu.
- **BR-ORD-004** Order item lưu snapshot: tên, giá, thuế, option, station.
- **BR-ORD-005** Huỷ món theo trạng thái:
  - `pending`/`accepted` (bếp chưa làm): Waiter huỷ được, có lý do; bếp nhận thông báo, không tính tiền.
  - `preparing`/`ready`/`served`: **cần Manager duyệt (PIN)**; chọn "khách vẫn trả" hoặc "quán chịu"; nếu quán chịu thì ghi hao hụt (BR-INV) và audit.
- **BR-ORD-006** Giảm giá: theo % hoặc số tiền, theo dòng hoặc toàn bill; ngưỡng tự do (vd ≤10%) cho Cashier, vượt ngưỡng cần Manager. Ngưỡng cấu hình theo store.
- **BR-ORD-007** Thứ tự tính tiền: tạm tính -> khuyến mãi/giảm giá -> phụ thu/phí dịch vụ -> thuế (nếu hiển thị) -> làm tròn -> tổng. Làm tròn theo cấu hình, mặc định không làm tròn.
- **BR-ORD-008** Phí dịch vụ: % trên tạm tính sau giảm giá (cấu hình); có thể tắt cho một bill (cần quyền).
- **BR-ORD-009** Món tặng/ thử/ nhân viên: dùng loại điều chỉnh "tặng" giá 0 có lý do bắt buộc; vẫn trừ kho; báo cáo riêng.
- **BR-ORD-010** Order mở sau N giờ (cấu hình) không hoạt động: cảnh báo; không tự đóng.
- **BR-ORD-011** Đơn mang về/ app giao hàng: không bàn; có thể phụ thu bao bì; ghi tên/SĐT/mã đơn đối tác.
- **BR-ORD-012** Gọi thêm sau khi thanh toán: tạo order mới, không mở lại order đã `paid`.
- **BR-ORD-013** Khi order `closed`, mọi chỉnh sửa trực tiếp bị cấm; chỉ hoàn/điều chỉnh (BR-CASH).
- **BR-ORD-014** Số lượng nguyên dương (trừ món thập phân theo BR-MENU-007).
- **BR-ORD-015** Ghi chú món tối đa 200 ký tự; ghi chú đơn nhanh qua cụm từ có sẵn ("ít đường", "không cay").

## 5. Vòng đời
Order: `draft -> submitted -> in_progress -> ready -> served -> paid -> closed`; `cancelled` (khi toàn bộ món huỷ trước thanh toán).
Order item: `pending -> accepted -> preparing -> ready -> served`; nhánh: `cancelled` (trước khi làm), `voided` (sau khi làm), `out_of_stock`.
Order `ready`/`served` suy ra từ trạng thái các item (không tự gán).

## 6. Màn hình
POS (lưới món + giỏ), Chi tiết đơn, Danh sách đơn (lọc kênh/trạng thái/bàn), Gửi bếp, Huỷ món (lý do + duyệt), Giảm giá, In bill, Lịch sử đơn.

## 7. Quyền
`order.create`, `order.update`, `order.send`, `order.cancel_item.unsent`, `order.void`, `order.discount.apply`, `order.discount.over_limit`, `order.comp`, `order.view_all`, `order.reopen` (hạn chế cao).

## 8. Ngoại lệ
- Mất kết nối khi bấm Gửi: client giữ trong hàng đợi, thử lại có idempotency; hiển thị "chưa gửi" rõ ràng, không cho đóng app mà mất đơn.
- Hai thiết bị cùng sửa một order: server khoá lạc quan theo `version`; xung đột hiển thị tác vụ gộp.
- Món đã gửi nhưng in phiếu thất bại: báo lỗi máy in, cho in lại, ghi log; KDS vẫn nhận.
- Khách đổi món đã nấu (nhầm size): void món cũ + thêm món mới với lý do "đổi món".

## 9. Sự kiện
`order.created`, `order.round_sent`, `order_item.status_changed`, `order.item_voided`, `order.discount_applied`, `order.paid`, `order.closed`.

## 10. Dữ liệu
`order, order_item, order_adjustment, service_call` + `sequence`.

## 11. Báo cáo
Đơn theo kênh/giờ, đơn huỷ/void (theo người, lý do), giảm giá, giá trị đơn trung bình.

## 12. Câu hỏi mở
- Mức giảm giá Cashier tự áp dụng thường là bao nhiêu?
- Quán có **trả trước** (trả khi gọi) hay **trả sau** (ăn xong mới trả)? Cấu hình mặc định?
- Có cần in bill nhiều bản, in cho khách ký?
- Có dùng **mã khuyến mãi** nhập tay không (P1) hay chỉ giảm giá thủ công?

## 13. Phase
P1: toàn bộ luồng trên (trừ khuyến mãi tự động). P2: khuyến mãi tự động, import đơn app giao hàng. P3: tích hợp đối tác giao hàng.
