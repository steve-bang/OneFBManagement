# BƯỚC 4/12: THỰC ĐƠN VÀ SƠ ĐỒ BÀN

## Mục tiêu bước này
Làm module **Menu** và module **Bàn**. Mọi hành động phải đi qua `can()` (bước 3) và ghi audit khi nhạy cảm. Dùng đúng component ở bước 2.

## 4.1 Thực đơn (`/menu`)
**Quy trình**: danh mục → món (tên, mô tả, ảnh, giá, thuế, station, đơn vị, thời gian chế biến ước tính) → gắn nhóm tuỳ chọn (min/ max, bắt buộc, giá cộng thêm) → bật/ tắt bán → đánh dấu tạm hết → xuất bản có hiệu lực ngay trên POS và QR.

Quy tắc bắt buộc:
- **BR-MENU-001** Giá nguyên VND ≥ 0; không phải bội số 500 thì **cảnh báo** (không chặn) vì không có xu.
- **BR-MENU-002** Mỗi món thuộc đúng một station chính (Bếp nóng/ Bar).
- **BR-MENU-003** Nhóm tuỳ chọn có `min`, `max`, `required`; `required` thì mặc định chọn sẵn mục `isDefault` (đường 100%, đá vừa, size M).
- **BR-MENU-004** Giá cuối = giá món + tổng giá cộng thêm của option, nhân số lượng.
- **BR-MENU-005** Món `sold_out` **vẫn hiện nhưng không cho gọi**. Có cờ "hết trong ngày" tự bật lại khi sang ngày kinh doanh mới.
- **BR-MENU-006** Đổi giá không ảnh hưởng order đã gửi (snapshot). Đổi giá cần quyền `menu.price.update` và ghi audit (giá cũ, giá mới).
- **BR-MENU-007** Món bán theo cân/ đơn vị thập phân cho phép số lượng thập phân tối đa 3 chữ số kèm đơn vị.
- **BR-MENU-008** Xoá món chỉ **ẩn** (`isActive=false`), không xoá cứng nếu đã có đơn.
- **BR-MENU-009** Giá theo khung giờ (Phase 1: quy tắc đơn giản, ví dụ "Happy hour 14:00–17:00 giảm giá"). Nếu nhiều quy tắc khớp thì ưu tiên khung hẹp hơn; xung đột khi lưu thì báo lỗi.
- **BR-MENU-010** Giá niêm yết đã gồm VAT theo cài đặt cửa hàng; thuế suất theo món.
- **BR-MENU-012** Tên, mô tả, ảnh có bản tiếng Anh tuỳ chọn cho menu khách.

Màn hình:
- Quản lý (Manager/ Owner): danh sách danh mục và món (tìm kiếm, lọc theo danh mục, station, tình trạng), chi tiết món (form), nhóm tuỳ chọn (tạo, sắp xếp, gắn vào món), giá khung giờ, bật/ tắt bán.
- Waiter/ Cashier: chỉ thấy menu bán và nút "Đánh dấu hết" nếu có quyền (`menu.soldout.toggle`).
- Kitchen/ Bar: nút "Hết món" cho món của station mình (nối ở bước 6).
- Ảnh món: cho chọn ảnh từ máy (lưu dạng data URL, giới hạn 300KB, nén) hoặc dùng khung giữ chỗ.
- Trạng thái món: `draft → active → inactive`; tình trạng bán `available | sold_out | scheduled_off`. Món tự `scheduled_off` ngoài khung giờ bán.

## 4.2 Bàn (`/tables`)
**Vòng đời bàn**: `available → reserved → occupied → needs_payment → cleaning → available`; `occupied → occupied` khi gọi thêm; `needs_payment → occupied` khi thêm món sau đó; `reserved → available` khi quá giờ hoặc huỷ.
Ai chuyển trạng thái: Waiter (mở bàn, dọn), Cashier (đóng sau thanh toán), Manager (mọi chuyển).

Quy tắc bắt buộc:
- **BR-TBL-001** Mã bàn duy nhất trong cửa hàng, ngắn dễ đọc (A1, 12, VIP2).
- **BR-TBL-002** Một bàn tối đa **một phiên mở**.
- **BR-TBL-003** Bàn còn order chưa thanh toán **không thể** về `available`.
- **BR-TBL-004** Chuyển bàn: bàn đích phải `available` hoặc `reserved` của chính khách; giữ nguyên order và lịch sử; ghi `table_transfer`; bếp/ bar nhận thông báo "bàn mới".
- **BR-TBL-005** Gộp bàn: hợp nhất order vào order của bàn chính; bàn phụ trỏ tới order chính và hiện "gộp với A1"; **không gộp** nếu bàn phụ đã thanh toán một phần.
- **BR-TBL-006** Tách bàn/ tách món: chọn các dòng chuyển sang order mới (bàn khác hoặc cùng bàn); món đã `served` hoặc đang chế biến vẫn chuyển được, giữ trạng thái.
- **BR-TBL-007** Bàn `needs_payment` tự về `occupied` nếu có món mới.
- **BR-TBL-008** Mã QR bàn là token ký, có `version`; **xoay token** làm QR cũ vô hiệu; tuỳ chọn "QR dùng một phiên" (mặc định tắt).
- **BR-TBL-009** Đặt bàn giữ tối đa N phút sau giờ hẹn (mặc định 15) rồi tự nhả và báo quản lý.
- **BR-TBL-011** Hiện thời gian bàn đã ngồi; cảnh báo vượt ngưỡng (cấu hình, mặc định 90 phút) cho quản lý.
- **BR-TBL-012** Chế độ `no_table`: ẩn hoàn toàn module bàn.

Màn hình:
- **Sơ đồ bàn** theo khu vực (tab khu vực), mỗi bàn là `TableCard` (trạng thái, giờ ngồi, tạm tính). Điện thoại: lưới 2 cột; tablet: bố cục theo vị trí lưới; có bộ lọc theo trạng thái. Bàn `table-help` nháy nhẹ.
- **Chi tiết bàn** (sheet/ panel): order đang mở, các món theo trạng thái, nút "Gọi món" (sang POS), "Yêu cầu thanh toán" (→ `needs_payment`), Chuyển/ Gộp/ Tách, Dọn bàn.
- **Mở bàn**: nhập số khách → tạo phiên → `occupied`.
- **Chuyển / Gộp / Tách**: luồng chọn bàn đích hoặc chọn món (có xem trước kết quả trước khi xác nhận).
- **Đặt bàn**: danh sách đặt bàn trong ngày, tạo/ sửa/ huỷ, tên, SĐT, số người, giờ; đánh dấu "khách đã đến" thì mở bàn. Quá giờ giữ bàn tự nhả và có thông báo.
- **Cấu hình sơ đồ và in QR** (Manager, cần `table.manage`): thêm/ sửa khu vực và bàn (mã, số ghế), kéo thả vị trí trên lưới, in QR từng bàn (trang xem trước in, có tên quán, số bàn, mã QR vẽ bằng thư viện `qrcode`, nội dung là URL `#/qr?t=<token>`), nút "Xoay QR" có xác nhận.

## Tiêu chí nghiệm thu
- [ ] Tạo món có nhóm tuỳ chọn; giá không bội số 500 hiện cảnh báo nhưng lưu được.
- [ ] Đổi giá bởi người không có `menu.price.update` bị chặn; có quyền thì ghi audit với giá cũ, giá mới.
- [ ] Món `sold_out` hiện trong danh sách nhưng nút Thêm bị vô hiệu và ghi "Hết hàng"; "hết trong ngày" tự bật lại khi sang ngày kinh doanh mới (kiểm tra bằng hàm `businessDay`).
- [ ] Xoá món đã có đơn chỉ ẩn, không mất khỏi đơn cũ.
- [ ] Mở bàn đã có phiên bị chặn; dọn bàn còn order chưa trả bị chặn.
- [ ] Chuyển bàn giữ nguyên order, bàn đích bắt buộc `available` hoặc `reserved` của chính khách.
- [ ] Gộp bàn bị chặn khi bàn phụ đã thanh toán một phần; sau gộp bàn phụ hiện "gộp với …".
- [ ] Tách món chuyển được món đang chế biến sang order mới giữ nguyên trạng thái.
- [ ] Xoay QR làm token cũ mở ra trang lỗi thân thiện (kiểm tra ở bước 8).
- [ ] Đặt bàn quá 15 phút tự nhả và có thông báo cho quản lý.
- [ ] Chế độ `no_table` ẩn hẳn module bàn khỏi điều hướng.
- [ ] Thao tác theo quyền: Waiter không sửa được sơ đồ, Cashier không đổi giá.
- [ ] Mọi màn hình đủ 6 trạng thái và đúng vùng chạm theo thiết bị.
