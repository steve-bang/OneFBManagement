# BƯỚC 5/12: POS VÀ QUẢN LÝ ĐƠN

## Mục tiêu bước này
Làm module POS/ Order theo **luồng A (tại bàn, nhân viên gọi món)** và **luồng C (gọi tại quầy)**, cùng mang về và nhập tay đơn app giao hàng. Thanh toán để bước 7; ở bước này nút "Thanh toán" chỉ chuyển bàn sang `needs_payment` và mở màn hình thanh toán trống ghi "Làm ở bước 7".

## 5.1 Tính tiền (`src/domain/pricing.ts`, hàm thuần, có kiểm thử trong `/dev/scenarios` ở bước 12)
`computeOrderTotals(order, storeConfig)` theo **đúng thứ tự BR-ORD-007**:
1. Tạm tính = Σ (giá snapshot + Σ giá cộng thêm option) × số lượng, bỏ qua món `cancelled`, `voided` và món "quán chịu".
2. Trừ giảm giá (dòng hoặc toàn bill; % hoặc số tiền) và món tặng giá 0.
3. Cộng phụ thu và **phí dịch vụ** (% trên tạm tính **sau giảm giá**; mặc định tắt; tắt được cho một bill nếu có quyền).
4. Thuế: giá niêm yết đã gồm VAT nên chỉ **hiển thị** phần thuế (tách ngược), không cộng thêm.
5. Làm tròn theo cấu hình (mặc định **không làm tròn**).
6. Tổng. Tiền là số nguyên VND, không bao giờ thập phân.
Trả về từng dòng riêng (tạm tính, giảm giá, phụ thu, phí dịch vụ, thuế hiển thị, làm tròn, tổng) để giao diện hiển thị rõ.

## 5.2 Quy tắc order bắt buộc
- **BR-ORD-001** Mã đơn `MMdd-nnnn` tăng dần theo cửa hàng và ngày kinh doanh; số thứ tự quầy reset mỗi ngày.
- **BR-ORD-002** Món chưa gửi: sửa/ xoá tự do. Đã gửi: thêm được; xoá phải qua huỷ có lý do.
- **BR-ORD-003** Không gửi order rỗng. Gửi lại dùng `idempotencyKey` để không trùng phiếu.
- **BR-ORD-004** Order item chụp lại snapshot tên, giá, thuế, option, station khi gửi.
- **BR-ORD-005** Huỷ món theo trạng thái:
  - `pending`/`accepted` (bếp chưa làm): Waiter huỷ được, **bắt buộc lý do**; bếp nhận thông báo; không tính tiền.
  - `preparing`/`ready`/`served`: **cần Manager duyệt bằng PIN**; chọn "khách vẫn trả" hoặc "quán chịu"; quán chịu thì ghi hao hụt và audit; item chuyển `voided`.
- **BR-ORD-006** Giảm giá theo % hoặc số tiền, theo dòng hoặc toàn bill. Trong ngưỡng (cài đặt, mặc định 10%) Cashier tự áp; **vượt ngưỡng cần Manager duyệt PIN**. Waiter không có quyền giảm giá.
- **BR-ORD-008** Phí dịch vụ tắt cho một bill cần quyền.
- **BR-ORD-009** Món tặng/ thử/ nhân viên: loại điều chỉnh "tặng" giá 0, **lý do bắt buộc**, cần quyền `order.comp` (Cashier cần PIN duyệt), báo cáo riêng.
- **BR-ORD-010** Order mở quá N giờ không hoạt động (mặc định 3 giờ) thì cảnh báo, **không tự đóng**.
- **BR-ORD-011** Đơn mang về/ app giao hàng: không bàn; có thể phụ thu bao bì; ghi tên, SĐT, **mã đơn đối tác** (GrabFood, ShopeeFood, BeFood, khác).
- **BR-ORD-012** Gọi thêm sau khi `paid`: tạo **order mới**, không mở lại order đã trả.
- **BR-ORD-013** Order `closed` cấm sửa trực tiếp, chỉ hoàn/ điều chỉnh (bước 7).
- **BR-ORD-014** Số lượng nguyên dương (trừ món thập phân).
- **BR-ORD-015** Ghi chú món tối đa 200 ký tự; có **cụm từ nhanh** ("ít đường", "không cay", "không hành", "mang đi").

Vòng đời order: `draft → submitted → in_progress → ready → served → paid → closed`; `cancelled` khi toàn bộ món huỷ trước thanh toán. `ready`/`served` **suy ra** từ các item.
Vòng đời item: `pending → accepted → preparing → ready → served`; nhánh `cancelled`, `voided`, `out_of_stock`.

## 5.3 Màn hình
**POS** (`/pos`) là lưới món + giỏ:
- **Tablet ngang**: 2 vùng. Trái: thanh danh mục + ô tìm kiếm + lưới `MenuItemCard`. Phải: giỏ hàng luôn thấy (tên bàn/ kênh, các dòng với `Stepper`, ghi chú, tạm tính, tổng cỡ lớn). Chân giỏ: nút phụ "Giảm giá", nút phụ "In tạm tính", **nút chính duy nhất "Gửi bếp"**.
- **Điện thoại**: danh sách danh mục dạng chip cuộn ngang, lưới 2 cột, thanh giỏ **cố định đáy** (số món + tổng) mở sheet giỏ hàng; nút chính "Gửi bếp" cố định đáy trong sheet. **Gửi món tối đa 3 chạm từ khi chọn bàn.**
- Chọn món có option mở `BottomSheet` (điện thoại) hoặc `Modal` (tablet): các nhóm bắt buộc đã chọn sẵn mặc định, kiểm tra `min/max`, giá cuối cập nhật ngay, ghi chú + cụm từ nhanh, số lượng. Món `sold_out` không thêm được.
- **Kênh**: chọn khi tạo đơn: Tại bàn (chọn bàn từ sơ đồ), Quầy (nhập tên hoặc số, số thứ tự trong ngày), Mang về (tên, SĐT), Đơn app giao hàng (chọn đối tác, mã đơn, tên khách).
- **Gửi bếp**: tạo `round` mới, chia món theo `station` thành các `Ticket`; item `pending`; hiện `SendStatus` (Đang gửi → Đã gửi); phát sự kiện `order.round_sent` lên eventBus (bước 6 nhận). Nút loading không nhận chạm lần hai; dùng `idempotencyKey` cho mỗi lần gửi.
- **Chi tiết đơn**: danh sách món theo round, mỗi món có pill trạng thái đúng token, thao tác theo quyền: Huỷ món (xem 5.4), nút "Đã phục vụ" khi item `ready`, thêm món, đổi bàn, giảm giá, in tạm tính.
- **Danh sách đơn** (`/orders`): lọc theo kênh, trạng thái, bàn, tìm theo mã đơn; mỗi dòng có pill; mở chi tiết.
- **Lịch sử đơn**: đơn đã `closed` ở dạng chỉ đọc (cấm sửa), thấy lịch sử huỷ/ giảm giá/ hoàn.
- **In tạm tính (bill)**: xem trước dạng khổ 58/80mm: tên quán, địa chỉ, mã đơn, bàn, giờ, các dòng với option, tạm tính, giảm giá, phụ thu, phí dịch vụ, tổng, dòng "Không phải hoá đơn VAT". In lại có dấu "IN LẠI" và ghi audit.

## 5.4 Huỷ món, giảm giá, tặng (bắt buộc đúng)
- Huỷ món **chưa gửi**: xoá ngay, không cần lý do.
- Huỷ món `pending/accepted`: `ConfirmDialog` nêu "Huỷ 1× Cà phê sữa đá. Bếp sẽ nhận thông báo huỷ.", **bắt buộc chọn lý do** (khách đổi ý, gọi nhầm, hết món, khác); Waiter làm được.
- Huỷ món `preparing/ready/served`: `ConfirmDialog` + lý do + chọn "Khách vẫn trả" hoặc "Quán chịu" + `ApprovalDialog` (PIN Manager). Người duyệt khác người yêu cầu. Ghi audit.
- Giảm giá: ô nhập % hoặc số tiền, theo dòng hoặc toàn bill; vượt ngưỡng → `ApprovalDialog`. Hiện rõ từng bước tính tiền sau khi áp.
- Tặng món: lý do bắt buộc, cần duyệt với Cashier.
- Mọi thao tác trên ghi audit (lý do, người, người duyệt, trước/ sau).

## Tiêu chí nghiệm thu
- [ ] Luồng A: chọn bàn → mở bàn → thêm món có option → Gửi bếp → thấy món ở trạng thái `pending` và ticket tách đúng station; **≤ 3 chạm** từ chọn bàn đến gửi (đếm trên điện thoại).
- [ ] Luồng C: quầy tạo order có số thứ tự trong ngày; số thứ tự reset khi sang ngày kinh doanh mới.
- [ ] Mang về và đơn app giao hàng lưu đủ trường (mã đơn đối tác, tên, SĐT).
- [ ] `computeOrderTotals` đúng thứ tự: ví dụ tạm tính 200.000, giảm 10% (20.000), phí dịch vụ 5% trên 180.000 (9.000), tổng 189.000; không làm tròn khi tắt làm tròn.
- [ ] Gửi order rỗng bị chặn; bấm Gửi nhanh nhiều lần chỉ tạo một round.
- [ ] Huỷ món theo đúng 3 mức ở BR-ORD-005; mức 3 cần PIN Manager và không cho người yêu cầu tự duyệt.
- [ ] Cashier giảm 15% bị yêu cầu PIN; giảm 8% tự áp; Waiter không thấy nút giảm giá.
- [ ] Sửa giá món ở menu sau khi gửi **không** đổi giá trong order cũ (snapshot).
- [ ] Order `closed` không sửa được trực tiếp; gọi thêm sau `paid` tạo order mới.
- [ ] Món `sold_out` không thêm được; món có trong giỏ bị hết thì bị đánh dấu, không gửi được.
- [ ] Bill xem trước đúng khổ, có dòng "Không phải hoá đơn VAT"; in lại có dấu "IN LẠI" và audit.
- [ ] Mọi màn hình đủ 6 trạng thái; vùng chạm đúng theo thiết bị.
