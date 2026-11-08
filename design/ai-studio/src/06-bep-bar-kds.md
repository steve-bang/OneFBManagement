# BƯỚC 6/12: BẾP / BAR (KDS), PHIẾU IN VÀ TEM LY

## Mục tiêu bước này
Làm màn hình KDS cho bếp và bar, hiển thị gọi số ở quầy, màn hình giao món cho Waiter/ Cashier, phiếu in và tem ly. Nối với order đã gửi ở bước 5 qua `eventBus`.

## 6.1 Quy tắc bắt buộc
- **BR-KIT-001** Phân tuyến theo `product.station`; một ticket thuộc một station; một round có thể sinh nhiều ticket.
- **BR-KIT-002** Hàng đợi theo thứ tự gửi; món **ưu tiên (rush)** do Manager/ Waiter đánh dấu được đẩy lên đầu.
- **BR-KIT-003** Hiển thị: bàn/ số, món, option nổi bật, **ghi chú màu đỏ**, thời gian chờ đổi màu theo ngưỡng: đúng hạn (`sla-ok`) dưới 10 phút, sắp trễ (`sla-warn`) từ 10 phút, quá hạn (`sla-late`) từ 15 phút. Ngưỡng lấy từ cài đặt cửa hàng.
- **BR-KIT-004** Station có thể bật **tự nhận** (bỏ bước accept); mặc định **bật** ở Phase 1 để ít thao tác. Khi tắt: món `pending → accepted` bằng một nút "Nhận".
- **BR-KIT-006** Báo hết nguyên liệu: chọn món/ option → đặt `sold_out` → các order đang chờ có món đó chuyển `out_of_stock` và **báo Waiter**; không tự huỷ cho tới khi Waiter xử lý.
- **BR-KIT-007** Làm hỏng/ làm lại: tạo item bù giá 0, ghi hao hụt, **lý do bắt buộc** ("làm sai", "rơi vỡ", "khách trả lại").
- **BR-KIT-008** Huỷ món khi bếp đã nhận: bếp thấy **cảnh báo huỷ nổi bật** (`item-cancelled`), phải **xác nhận đã dừng**; nếu đã nấu xong thì ghi hao hụt theo quyết định ở BR-ORD-005.
- **BR-KIT-009** In: phiếu bếp theo station (khổ 58/80mm) gồm bàn, giờ, người gọi, món, option, ghi chú; **tem ly** một tem cho mỗi ly đồ uống (tên món, option, số thứ tự hoặc tên khách).
- **BR-KIT-010** In lại có dấu "IN LẠI" và ghi log.
- **BR-KIT-011** Lưu thời gian chế biến thực tế (`accepted → ready`) để báo cáo R09.
- **BR-KIT-012** Một Kitchen user gắn một hoặc nhiều station, **chỉ thấy station của mình**.

Vòng đời item: `pending → accepted → preparing → ready → served`; nhánh `out_of_stock | cancelled | voided`. Ticket: `open → done`.

## 6.2 Màn hình KDS (`/kitchen`) — thiết bị KDS, theme tối mặc định
- Ba cột: **Mới / Đang làm / Xong**. Mỗi phiếu là một thẻ rộng ~260px: đầu phiếu có **số bàn** (28/36, 700) và **đồng hồ** `mm:ss` (32/40, 700) đổi màu theo `sla-*`; dưới là các dòng món 20/28 với option và ghi chú đỏ; chân phiếu là nút lớn **"Xong món"** cao 72px (một chạm, không phụ thuộc cử chỉ vuốt).
- Đồng hồ chạy thật mỗi giây từ `now()`.
- Phiếu `sla-late` nháy nhẹ kèm âm báo (tắt khi `prefers-reduced-motion`; vẫn hiện nhãn "Quá hạn"). Phiếu mới phát âm báo (xem bước 10 để tinh chỉnh; bước này dùng một âm đơn giản bằng Web Audio, người dùng bật âm bằng một nút "Bật âm báo" vì trình duyệt chặn tự phát).
- Đầu màn hình: tên station, số phiếu đang chờ (cỡ lớn), nút chuyển station (nếu người dùng có nhiều station), công tắc tự nhận, trạng thái kết nối. Cảnh báo đỏ `OfflineBanner` khi mất mạng.
- Thao tác trên món: Nhận (nếu tự nhận tắt), Bắt đầu, Xong, **Hết món** (chọn món/ option → xác nhận hậu quả), **Làm lại** (bắt buộc chọn lý do), đánh dấu **ưu tiên** (nút cho Manager/ Waiter).
- Phiếu có món bị huỷ: hiện dải cảnh báo nổi bật, món bị gạch, nút "Đã dừng" bắt buộc bấm mới biến mất.
- Lịch sử phiếu trong ngày (đã xong), in lại phiếu/ tem (có dấu "IN LẠI", ghi log).
- Cài đặt station (Manager): tên station, ngưỡng cảnh báo, tự nhận, máy in gắn với station.
- Kitchen/ Bartender **chỉ thấy station của mình**; Manager/ Owner xem được mọi station.

## 6.3 Quầy: gọi số và giao món
- **Màn hình gọi số** (route con `/kitchen/call`): danh sách số hoặc tên khách có ly **đã xong** (`ready`), cỡ chữ rất lớn, cho TV; số mới hiện đầu danh sách.
- **Giao món** cho Waiter/ Cashier: khi item `ready`, người phụ trách bàn nhận thông báo "Món sẵn sàng" (gộp theo bàn trong 10 giây); nút **"Đã phục vụ"** chuyển item `served`; khi mọi món `served` thì order suy ra `served`. Với đơn quầy: giao ly → `served` → có thể `closed` sau khi đã thanh toán (bước 7).
- Waiter nhận thông báo món hết (`out_of_stock`): chọn **đổi món** hoặc **huỷ không tính tiền**; menu tự đánh dấu hết.

## 6.4 Phiếu in và tem ly (xem trước, mô phỏng máy in)
- **Phiếu bếp** theo station, khổ chọn 58 hoặc 80mm: bàn/ số, giờ, người gọi, từng món với option và ghi chú in đậm, dấu "IN LẠI" nếu in lại.
- **Tem ly** (khổ tem nhỏ): mỗi ly một tem: tên món, size/ đường/ đá/ topping, số thứ tự hoặc tên khách, giờ.
- Tự động "in" (xem trước hiện trong ngăn thông báo nhỏ) khi gửi hoặc khi nhận theo cài đặt station. Thất bại in (mô phỏng "hết giấy") báo Manager và **KDS vẫn tiếp tục**.

## Tiêu chí nghiệm thu
- [ ] Gửi round ở POS thì phiếu hiện đúng station, đúng cột "Mới", có âm báo sau khi bật âm.
- [ ] Đồng hồ chạy thật; phiếu đổi `sla-ok → sla-warn` ở 10 phút và `sla-late` ở 15 phút (kiểm tra bằng cách đổi ngưỡng trong cài đặt xuống 1 và 2 phút).
- [ ] Với tự nhận bật: món vào thẳng "Đang làm". Tắt tự nhận: có nút Nhận.
- [ ] "Xong món" một chạm chuyển món sang `ready` và Waiter nhận thông báo đúng bàn; "Đã phục vụ" chuyển `served`.
- [ ] Hết món: món chuyển `out_of_stock`, Waiter được báo, menu đánh dấu `sold_out`, đơn không tự huỷ.
- [ ] Làm lại bắt buộc lý do, tạo item bù giá 0 và ghi hao hụt.
- [ ] Huỷ món khi bếp đã nhận: cảnh báo nổi bật, phiếu chỉ biến mất sau khi bấm "Đã dừng".
- [ ] Kitchen chỉ thấy station của mình; Manager thấy mọi station.
- [ ] Phiếu in và tem ly xem trước đúng khổ 58/80mm; in lại có dấu "IN LẠI" và ghi log.
- [ ] Mất mạng: KDS hiện cảnh báo đỏ cố định, không đóng được.
- [ ] Chữ ≥ 20px, nút thao tác ≥ 72px, không có thao tác nào chỉ làm được bằng vuốt.
- [ ] Màn hình gọi số hiện số của ly đã xong, cỡ chữ lớn.
