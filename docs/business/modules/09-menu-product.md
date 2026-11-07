# Phân hệ 09. Menu & Sản phẩm (Phase 1)

## 1. Mục tiêu & người dùng
Quản lý danh mục món, giá, tuỳ chọn, trạng thái bán. Owner/Manager chỉnh; mọi vai trò khác chỉ đọc. Là nền cho POS, QR, bếp, kho.

## 2. Thuật ngữ riêng
Danh mục, Món (product), Nhóm tuỳ chọn (option group: size/đường/đá/topping), Tuỳ chọn (option), Combo, Station (khu chế biến), Món hết, Lịch bán, Giá theo khung giờ.

## 3. Quy trình chính
1. Tạo danh mục (Cà phê, Trà sữa, Món chính, Tráng miệng...).
2. Tạo món: tên, mô tả, ảnh, giá, thuế, station, đơn vị bán, thời gian chế biến ước tính.
3. Gắn nhóm tuỳ chọn (min/max) và giá cộng thêm.
4. Tạo combo, lịch bán, giá theo khung giờ (Phase 1: chỉ cờ bật/tắt và giá khung giờ đơn giản).
5. Bật/tắt bán; đánh dấu tạm hết.
6. Xuất bản: thay đổi có hiệu lực ngay trên POS/QR.

## 4. Quy tắc nghiệp vụ
- **BR-MENU-001** Giá là số nguyên VND ≥ 0; bội số 500đ khuyến nghị (cảnh báo nếu không, vì không có xu).
- **BR-MENU-002** Mỗi món thuộc đúng một station chính; option có thể chuyển station riêng (vd topping do quầy làm). Phase 1: chỉ station theo món.
- **BR-MENU-003** Nhóm tuỳ chọn có `min`, `max`, `required`. `required` mặc định chọn sẵn mục mặc định (vd đường 100%, đá 100%).
- **BR-MENU-004** Giá cuối = giá món + tổng giá cộng thêm của option; nhân số lượng.
- **BR-MENU-005** Món `sold_out` vẫn hiện nhưng không cho gọi; có thể tự bật lại theo ngày/ca (cờ "hết trong ngày").
- **BR-MENU-006** Đổi giá không ảnh hưởng order đã gửi (snapshot). Đổi giá cần quyền `menu.price.update` và ghi audit.
- **BR-MENU-007** Món bán theo cân/đơn vị thập phân cho phép `qty` thập phân (tối đa 3 chữ số) và `unit`.
- **BR-MENU-008** Xoá món: chỉ ẩn (`is_active=false`), không xoá cứng nếu đã có đơn.
- **BR-MENU-009** Giá theo khung giờ: nếu nhiều quy tắc khớp, ưu tiên quy tắc cụ thể hơn (store > tenant, khung hẹp > rộng); xung đột báo lỗi khi lưu.
- **BR-MENU-010** Giá niêm yết đã gồm thuế theo `store.price_includes_tax`; thuế suất theo món, có hiệu lực theo ngày.
- **BR-MENU-011** Menu có thể dùng chung cho nhiều store (tenant) và ghi đè giá/tình trạng theo store.
- **BR-MENU-012** Mô tả/ảnh/tên có bản tiếng Anh tuỳ chọn cho menu khách.

## 5. Vòng đời
Món: `draft -> active -> inactive`. Tình trạng bán: `available | sold_out | scheduled_off`.

## 6. Màn hình theo vai trò
Manager/Owner: Danh sách danh mục & món, Chi tiết món, Nhóm tuỳ chọn, Combo, Giá khung giờ, Nhập nhanh từ Excel (Phase 2).
Waiter/Cashier: chỉ thấy menu bán, nút "Đánh dấu hết" (có quyền).
Kitchen/Bar: nút "Hết món" cho món của station mình.

## 7. Quyền
`menu.read`, `menu.manage`, `menu.price.update`, `menu.soldout.toggle`.

## 8. Ngoại lệ thực tế
- Hết nguyên liệu giữa giờ cao điểm: bếp tắt món ngay, mọi thiết bị cập nhật dưới 3 giây; QR đang có món trong giỏ cảnh báo.
- Đổi giá trong lúc có đơn mở: đơn mở **giữ giá cũ** đã gửi; món chưa gửi lấy giá mới khi gửi.
- Món có topping hết (trân châu): tắt option, món chính vẫn bán.
- Món nhập tên rất dài/ ký tự đặc biệt: giới hạn độ dài, in tem ly cắt gọn (xem 04).

## 9. Sự kiện
`menu.updated`, `product.sold_out_changed`, `product.price_changed` (audit).

## 10. Dữ liệu
`category, product, option_group, option, combo, price_rule, station` (xem `docs/03-data-model.md`).

## 11. Báo cáo
Món bán chạy, món ít bán, doanh thu theo danh mục, số lần món hết.

## 12. Câu hỏi mở
- Quán có dùng **mã món/ SKU** riêng không? Có nhập tự do tên món khi khách gọi món ngoài menu ("món ngoài") không?
- Mức đường/đá thường chuẩn hoá ở mức nào? Đá/đường có ảnh hưởng định lượng kho không?
- Combo cố định hay cho chọn món trong nhóm?

## 13. Phase
P1: danh mục, món, option, sold-out, giá theo khung giờ cơ bản. P2: import Excel, combo nâng cao, định lượng. P3: giá theo chi nhánh phức tạp, lịch bán tự động.
