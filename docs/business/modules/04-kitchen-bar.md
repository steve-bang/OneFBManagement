# Phân hệ 04. Bếp & Pha chế (Phase 1)

## 1. Mục tiêu & người dùng
Nhận món theo từng station, chế biến, báo xong, xử lý sự cố. Kitchen, Bartender; Waiter nhận thông báo.

## 2. Thuật ngữ riêng
Station, Ticket (phiếu), KDS, Hàng đợi, Ưu tiên, Tem ly, Món lỗi, Làm lại (remake).

## 3. Quy trình chính
1. Round được gửi -> hệ thống tạo ticket cho từng station.
2. Station hiển thị món trong hàng đợi (theo thời gian gửi); phát âm báo.
3. Nhận món (accept) -> đang làm (preparing) -> xong (ready).
4. Món xong: thông báo cho Waiter/Cashier; hiển thị số/tên (quầy).
5. Giao món -> `served` (do Waiter/Cashier bấm).
6. Sự cố: báo hết nguyên liệu, làm hỏng (remake), khách từ chối.

## 4. Quy tắc nghiệp vụ
- **BR-KIT-001** Phân tuyến theo `product.station`; một ticket thuộc một station; một round có thể sinh nhiều ticket.
- **BR-KIT-002** Hàng đợi theo thứ tự gửi; ưu tiên (rush) do Manager/Waiter đánh dấu, đẩy lên đầu.
- **BR-KIT-003** Hiển thị: bàn/số, món, option nổi bật, **ghi chú đỏ**, thời gian chờ (đổi màu khi trễ ngưỡng, mặc định 10/15 phút).
- **BR-KIT-004** Station có thể bật **tự nhận** (bỏ bước accept) cho quán đơn giản (mặc định bật ở P1 để ít thao tác).
- **BR-KIT-005** Nhóm món cùng bàn/ cùng round hiển thị gần nhau; hỗ trợ "giữ để ra cùng lúc" (hold/fire) ở P2.
- **BR-KIT-006** Báo hết nguyên liệu: chọn món/option -> đặt `sold_out` (BR-MENU-005) -> các order đang chờ có món đó chuyển `out_of_stock` và báo Waiter; không tự huỷ cho tới khi Waiter xử lý.
- **BR-KIT-007** Món làm hỏng/ làm lại: tạo item bù cùng giá 0, ghi hao hụt, lý do bắt buộc ("làm sai", "rơi vỡ", "khách trả lại").
- **BR-KIT-008** Huỷ món khi bếp đã nhận: bếp thấy cảnh báo huỷ nổi bật, xác nhận đã dừng; nếu đã nấu xong, ghi hao hụt theo quyết định ở BR-ORD-005.
- **BR-KIT-009** In: phiếu bếp theo station (khổ 58/80mm) gồm bàn, giờ, người gọi, món, option, ghi chú; **tem ly** một tem cho mỗi ly đồ uống (tên món, option, số thứ tự/tên khách); in tự động khi gửi hoặc khi nhận.
- **BR-KIT-010** In lại phiếu có đánh dấu "IN LẠI"; in lại bị ghi log.
- **BR-KIT-011** Thời gian chế biến thực tế (accepted -> ready) lưu để báo cáo.
- **BR-KIT-012** Một Kitchen user gắn một hoặc nhiều station; chỉ thấy station của mình.

## 5. Vòng đời
Item: `pending -> accepted -> preparing -> ready -> served`; `out_of_stock | cancelled | voided`.
Ticket: `open -> done`.

## 6. Màn hình
KDS (cột Mới / Đang làm / Xong), Chi tiết món, Nút "Hết món", "Làm lại", Lịch sử ticket, Cài đặt station.

## 7. Quyền
`kitchen.view`, `kitchen.update_status`, `kitchen.report_issue`, `kitchen.prioritize`, `station.manage`.

## 8. Ngoại lệ
- Mất mạng ở bếp: KDS hiển thị cảnh báo đỏ "mất kết nối"; máy in dự phòng của quầy; khi có mạng đồng bộ.
- Máy in hết giấy: cảnh báo cho quản lý; KDS tiếp tục.
- Order đổi bàn: phiếu mới in "ĐỔI BÀN A1 -> A5".
- Quá tải giờ cao điểm: hiển thị số món đang chờ; Manager có thể tạm tắt món chậm.
- Món nhiều phần (combo) chia nhiều station: Waiter thấy tiến độ từng phần, chỉ "sẵn sàng" khi đủ (cấu hình).

## 9. Sự kiện
`kitchen_ticket.created`, `order_item.status_changed`, `order_item.out_of_stock`, `item_issue.reported`.

## 10. Dữ liệu
`station, kitchen_ticket, item_issue` + `order_item`.

## 11. Báo cáo
Thời gian chế biến trung bình theo món/station, món trễ, số lần làm lại và lý do, tỷ lệ hết món.

## 12. Câu hỏi mở
- Quán thích **phiếu in** hay **màn hình KDS**? Cả hai cùng lúc?
- Mỗi quán có mấy máy in, khổ giấy, kết nối LAN hay Bluetooth?
- Quy tắc tem ly: in cho từng ly hay gộp? Nội dung?
- Có cần xuất món theo "đợt" (khai vị -> món chính) không?

## 13. Phase
P1: KDS/phiếu in, trạng thái, hết món, làm lại, in tem ly. P2: giữ/xuất đợt, thời gian chế biến chi tiết. P3: ưu tiên tự động theo thời gian chờ.
