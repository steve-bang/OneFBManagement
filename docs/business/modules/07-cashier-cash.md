# Phân hệ 07. Thu ngân & Quản lý tiền (Phase 1: thanh toán; Phase 2: ca, quỹ nâng cao)

## 1. Mục tiêu & người dùng
Thanh toán bill, quản lý ca thu ngân, két tiền, thu chi, hoàn tiền, đối soát cuối ca. Cashier chủ yếu; Manager duyệt; Owner/Kế toán xem.

## 2. Thuật ngữ riêng
Ca thu ngân, Tiền đầu ca, Chốt ca, Chênh lệch quỹ, Thu/Chi, Hoàn tiền (refund), Xác nhận thanh toán.

## 3. Quy trình chính
**Thanh toán**
1. Mở order cần thanh toán -> kiểm tra -> in bill tạm tính.
2. Chọn phương thức (một hoặc nhiều).
3. Tiền mặt: nhập số khách đưa -> hệ thống tính thối.
4. VietQR: hiện mã động -> khách quét -> thu ngân kiểm tra tài khoản -> **Xác nhận đã nhận tiền**.
5. Đủ tiền -> order `paid`; bill in/ gửi; bàn `cleaning`.

**Ca**
1. Mở ca: nhập tiền đầu ca (đếm), chọn quầy/thiết bị.
2. Trong ca: bán, thu/chi, hoàn.
3. Chốt ca: hệ thống tính số phải có = đầu ca + tiền mặt bán + thu - chi - hoàn tiền mặt; thu ngân nhập số đếm thực; ghi chênh lệch; Manager duyệt nếu vượt ngưỡng.

## 4. Quy tắc nghiệp vụ
- **BR-CASH-001** Phải có **ca đang mở** mới tạo thanh toán; mỗi thu ngân một ca mở trên một thiết bị tại một thời điểm.
- **BR-CASH-002** Mỗi payment thuộc đúng một ca; tổng payment `confirmed` của order phải bằng tổng phải trả để order `paid`.
- **BR-CASH-003** Tiền mặt: `received`, `change = received - due`; thối theo bội số tiền Việt hiện lưu hành (1.000đ; cấu hình 500đ); không nhận số lẻ dưới 1.000đ nếu bật làm tròn.
- **BR-CASH-004** VietQR: mã chứa số tiền và nội dung = mã bill; `payment` trạng thái `pending` cho tới khi **người dùng có quyền `payment.confirm` bấm xác nhận**; ghi `confirmed_by`, thời điểm; có ô ghi chú mã giao dịch ngân hàng (tuỳ chọn).
- **BR-CASH-005** Chuyển khoản sai số tiền (thiếu/thừa): thiếu -> thêm payment khác để đủ; thừa -> ghi nhận "thừa tiền", cho trả lại tiền mặt hoặc giữ làm điểm/ tip (cấu hình), có lý do.
- **BR-CASH-006** Tách bill: tạo nhiều payment cho cùng order theo phần (theo món, chia đều N người, theo số tiền); tổng phần = tổng order; order chỉ `paid` khi đủ.
- **BR-CASH-007** Nhiều phương thức một bill: tổng các payment = số phải trả.
- **BR-CASH-008** Thanh toán qua thẻ (máy POS ngân hàng riêng): thu ngân tự quẹt, chỉ ghi nhận "đã thanh toán thẻ" (+ 4 số cuối/ mã chuẩn chi tuỳ chọn); hệ thống không tích hợp ở P1.
- **BR-CASH-009** Ghi nợ: mặc định tắt; bật theo store + khách đã đăng ký + quyền; sinh công nợ phải thu (Phase 2).
- **BR-CASH-010** **Hoàn tiền/ điều chỉnh sau thanh toán**: không sửa payment cũ; tạo `refund` có lý do và người duyệt (Manager); hoàn tiền mặt trừ vào quỹ ca hiện tại.
- **BR-CASH-011** Thu/chi tiền mặt: loại (mua đá, trả shipper, nộp tiền bớt két), số tiền, lý do, ảnh chứng từ (tuỳ chọn), người duyệt nếu vượt ngưỡng.
- **BR-CASH-012** Mở két không bán hàng cần quyền và ghi log.
- **BR-CASH-013** Chênh lệch quỹ: |chênh lệch| ≤ ngưỡng tự chấp nhận (cấu hình); lớn hơn cần Manager ghi chú; luôn lưu và báo cáo theo thu ngân.
- **BR-CASH-014** Không chốt ca khi còn order `paid` dở dang hoặc payment `pending`; phải xử lý (xác nhận/huỷ).
- **BR-CASH-015** Order mở (chưa thanh toán) khi chốt ca **không** bị đóng; chuyển sang ca kế tiếp (đơn thuộc store).
- **BR-CASH-016** Doanh thu theo phương thức được ghi nhận theo thời điểm `confirmed`, thuộc ngày/ca lúc xác nhận.
- **BR-CASH-017** Tip: ghi nhận tách khỏi doanh thu (`tip_amount`), phương thức nhận, người nhận (tuỳ cấu hình chia).
- **BR-CASH-018** Bill/ phiếu thanh toán in ghi rõ "Không phải hoá đơn VAT" (xem `02-vietnam-context.md`).
- **BR-CASH-019** Đánh dấu "khách yêu cầu xuất hoá đơn" + lưu MST/ tên đơn vị/ địa chỉ/ email để xử lý sau (HĐĐT chưa triển khai).

## 5. Vòng đời
Payment: `pending -> confirmed | failed | cancelled`; `confirmed -> refunded (một phần/ toàn bộ)`.
Ca: `open -> closing -> closed`; `closed -> reopened` (Manager, hiếm).
Order: `served -> paid -> closed`.

## 6. Màn hình
Màn hình thanh toán (tổng, các phần, phương thức), Số tiền khách đưa + thối, VietQR, Tách bill, Mở ca, Chốt ca (đếm tiền), Thu/Chi, Hoàn tiền, Lịch sử giao dịch, Báo cáo ca.

## 7. Quyền
`payment.create`, `payment.confirm`, `payment.refund`, `cash.shift.open/close`, `cash.shift.close_other`, `cash.movement.create`, `cash.drawer.open`, `cash.variance.approve`.

## 8. Ngoại lệ
- Khách trả bằng ảnh chụp chuyển khoản: thu ngân đối chiếu trên app ngân hàng/ loa; không xác nhận chỉ vì ảnh.
- Khách chuyển nhầm tài khoản quán khác/ chuyển hai lần: ghi nhận tiền thừa, xử lý hoàn thủ công bên ngoài hệ thống; đánh dấu giao dịch.
- Máy tính tiền/ tablet hỏng giữa chừng: dùng thiết bị khác; ca có thể tiếp tục với `device` mới, ghi log.
- Quên chốt ca qua đêm: ca vẫn mở; Manager chốt thay.
- Hai thu ngân dùng chung một két (một ca): quy định một ca = một người; đổi người = chốt/mở ca.
- Giá/ khuyến mãi sai phát hiện sau: hoàn & bán lại theo BR-CASH-010.
- Mất điện lúc thu tiền: payment `pending` được khôi phục, thu ngân kiểm tra lại thực tế.

## 9. Sự kiện
`payment.created`, `payment.confirmed`, `payment.refunded`, `cash_shift.opened/closed`, `cash.variance_detected`.

## 10. Dữ liệu
`cash_shift, cash_movement, payment, refund, payment_event` (xem `docs/03-data-model.md`).

## 11. Báo cáo
Doanh thu ngày/ca/thu ngân theo phương thức, chênh lệch quỹ, hoàn tiền, thu/chi, đối soát chuyển khoản (liệt kê payment VietQR để so khớp sao kê).

## 12. Câu hỏi mở
- Quán có chốt ca nhiều lần trong ngày hay một lần/ngày? Một hay nhiều quầy?
- Có dùng **máy POS thẻ** bao nhiêu % quán? Cần ghi gì?
- Ngưỡng chênh lệch quỹ tự chấp nhận bao nhiêu?
- Tip: chia thế nào, có tính vào doanh thu không (xem kế toán)?
- Có cần đặt cọc bàn tiệc và công nợ khách hàng doanh nghiệp (P2)?

## 13. Phase
P1: thanh toán tiền mặt/VietQR, tách bill, nhiều phương thức, mở/chốt ca cơ bản, hoàn tiền, thu chi. P2: đối soát chi tiết, công nợ, quỹ nâng cao. P3: tích hợp thanh toán tự động, HĐĐT.
