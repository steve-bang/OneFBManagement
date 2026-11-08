# BƯỚC 7/12: THANH TOÁN, CA VÀ QUỸ

## Mục tiêu bước này
Làm module Thu ngân: thanh toán đủ phương thức, tách bill, hoàn tiền, ca làm việc, thu/ chi, mở két. Đây là phần **tiền thật**, mọi quy tắc phải đúng tuyệt đối. Nối với bước 5 (nút "Thanh toán") và bước 6 (đóng bàn).

## 7.1 Quy tắc bắt buộc
- **BR-CASH-001** Phải có **ca đang mở** mới tạo được thanh toán; mỗi thu ngân một ca mở trên một thiết bị tại một thời điểm.
- **BR-CASH-002** Mỗi payment thuộc đúng một ca; tổng payment `confirmed` của order phải **bằng** tổng phải trả thì order mới `paid`.
- **BR-CASH-003** Tiền mặt: nhập `received`, `change = received − due`; thối theo bội số tiền Việt lưu hành (1.000 ₫; cấu hình 500 ₫); khi bật làm tròn thì không nhận số lẻ dưới 1.000 ₫.
- **BR-CASH-004** VietQR: mã chứa **số tiền** và **nội dung = mã bill**; payment ở `pending` cho tới khi người có quyền `payment.confirm` bấm **"Xác nhận đã nhận tiền"**; ghi `confirmed_by`, thời điểm; có ô ghi mã giao dịch ngân hàng (tuỳ chọn). Nhắc thu ngân **đối chiếu với app ngân hàng hoặc loa của quán, không chỉ tin ảnh khách**.
- **BR-CASH-005** Chuyển khoản sai số tiền: thiếu thì thêm payment khác cho đủ; thừa thì ghi nhận "thừa tiền", cho trả lại tiền mặt hoặc giữ làm tip (cấu hình), có lý do.
- **BR-CASH-006** Tách bill: nhiều payment cho cùng order theo phần (theo món, chia đều N người, theo số tiền); tổng phần = tổng order; order chỉ `paid` khi đủ.
- **BR-CASH-007** Nhiều phương thức một bill: tổng các payment = số phải trả.
- **BR-CASH-008** Thẻ/ ví: thu ngân tự quẹt, chỉ ghi nhận "đã thanh toán thẻ" (+ 4 số cuối hoặc mã chuẩn chi, tuỳ chọn). Không tích hợp.
- **BR-CASH-010** Hoàn tiền/ điều chỉnh sau thanh toán: **không sửa payment cũ**; tạo bản ghi `refund` có lý do và người duyệt (Manager); hoàn tiền mặt **trừ vào quỹ ca hiện tại**. Khách đã trả mà quán lỡ huỷ: hoàn tiền ghi vào ca hiện tại.
- **BR-CASH-011** Thu/ chi tiền mặt: loại (mua đá, trả shipper, nộp tiền bớt két…), số tiền, lý do, ảnh chứng từ (tuỳ chọn), người duyệt nếu vượt ngưỡng.
- **BR-CASH-012** Mở két không bán hàng cần quyền (Cashier cần PIN duyệt) và ghi log.
- **BR-CASH-013** Chênh lệch quỹ: |chênh lệch| ≤ ngưỡng tự chấp nhận (cài đặt, mặc định 20.000 ₫) thì tự chấp nhận; lớn hơn **cần Manager ghi chú**. Luôn lưu và báo cáo theo thu ngân.
- **BR-CASH-014** **Không chốt ca** khi còn payment `pending` hoặc order ở trạng thái dở dang; phải xử lý (xác nhận/ huỷ) trước.
- **BR-CASH-015** Order mở chưa thanh toán khi chốt ca **không bị đóng**; chuyển sang ca kế tiếp (đơn thuộc cửa hàng, không thuộc ca).
- **BR-CASH-016** Doanh thu theo phương thức ghi theo thời điểm `confirmed`, thuộc ngày và ca lúc xác nhận.
- **BR-CASH-017** Tip tách khỏi doanh thu (`tip_amount`), ghi phương thức nhận và người nhận.
- **BR-CASH-018** Bill/ phiếu thanh toán in ghi "Không phải hoá đơn VAT".
- **BR-CASH-019** Đánh dấu "khách yêu cầu xuất hoá đơn": lưu MST, tên đơn vị, địa chỉ, email để xử lý sau (hoá đơn điện tử chưa làm).
- Sai tiền hoặc giảm giá nhầm **sau khi đã thanh toán**: **không sửa trực tiếp**, dùng hoàn/ điều chỉnh có lý do và duyệt.
- Khách bỏ về chưa trả: Manager ghi "khách bỏ về" (void toàn bill có lý do), ghi tổn thất.
- Nhân viên quên chốt ca: Manager chốt thay, ghi lý do, chênh lệch ghi cho ca đó.

Vòng đời: Payment `pending → confirmed | failed | cancelled`; `confirmed → refunded` (một phần hoặc toàn bộ). Ca `open → closing → closed` (`closed → reopened` do Manager, hiếm). Order `served → paid → closed`.

## 7.2 Màn hình
**Thanh toán** (`/cashier`): danh sách order chờ thanh toán (bàn `needs_payment` và đơn quầy chưa trả), mở một order:
- Tổng phải trả hiển thị cỡ lớn (32/40) kèm các dòng tạm tính, giảm giá, phụ thu, phí dịch vụ, thuế hiển thị, làm tròn, tổng (dùng `computeOrderTotals`).
- Chọn phương thức (một hoặc nhiều): Tiền mặt, VietQR, Thẻ, Ví, Đối tác giao hàng. Mỗi lần thêm một dòng payment với số tiền; hiện **còn thiếu bao nhiêu**; chỉ khi đủ tổng, nút chính **"Xác nhận thanh toán"** mới bật.
- **Tiền mặt**: ô "Khách đưa", gợi ý nhanh các mệnh giá (50.000, 100.000, 200.000, 500.000, "Vừa đủ"), hiện **tiền thối** cỡ lớn, làm tròn theo cấu hình.
- **VietQR**: hiển thị mã QR vẽ bằng thư viện `qrcode` với nội dung mô phỏng chứa số tiền và mã bill (ghi rõ trên giao diện "Mã minh hoạ, không dùng để chuyển tiền thật"); payment `pending`; nút **"Xác nhận đã nhận tiền"** chỉ người có `payment.confirm`; ô mã giao dịch ngân hàng; dòng nhắc đối chiếu app ngân hàng/ loa; "Đổi phương thức" nếu chưa thấy tiền. **Không đóng bàn khi payment còn `pending`.**
- **Thẻ/ Ví**: ghi nhận tay.
- **Tách bill**: theo món (chọn các dòng), chia đều N người, theo số tiền; mỗi phần thanh toán độc lập; thanh tiến độ phần đã trả/ tổng; order chỉ `paid` khi đủ.
- **Tip**: ô nhập tip tách khỏi doanh thu, chọn phương thức nhận.
- **Hoá đơn**: công tắc "Khách yêu cầu xuất hoá đơn" với ô MST, tên đơn vị, địa chỉ, email.
- Sau khi `paid`: in bill (xem trước, "Không phải hoá đơn VAT"), bàn chuyển `cleaning`, Waiter dọn → `available`; order `closed`. Phát sự kiện để báo cáo.
- **Hoàn tiền** (`payment.refund`, Cashier cần PIN Manager): chọn payment đã `confirmed`, số tiền (một phần hoặc toàn bộ), lý do bắt buộc; tạo `refund`, **không sửa payment cũ**; hoàn tiền mặt trừ vào quỹ ca hiện tại.
- **Lịch sử giao dịch**: payment, hoàn, lọc theo ca, phương thức, trạng thái.

**Ca** (`/shift`):
- **Mở ca**: nhập tiền đầu ca (đếm tờ theo mệnh giá để tính tổng), chọn quầy/ thiết bị. Chặn nếu thu ngân đã có ca mở ở thiết bị khác.
- **Trong ca**: tổng quan ca (bán theo phương thức, thu, chi, hoàn), nút Thu/ Chi và Mở két.
- **Thu/ Chi**: form loại, số tiền, lý do, ảnh chứng từ (tuỳ chọn), vượt ngưỡng cần duyệt.
- **Chốt ca**: hệ thống tính `phải có = đầu ca + tiền mặt bán + thu − chi − hoàn tiền mặt`; thu ngân **nhập số đếm thực** (đếm theo mệnh giá); hiện chênh lệch; ≤ ngưỡng tự chấp nhận, lớn hơn cần ghi chú của Manager (PIN). Chặn khi còn payment `pending` (liệt kê để xử lý). Order mở được chuyển sang ca kế tiếp (có thông báo rõ).
- **Báo cáo ca R05**: đầu ca, bán, thu/ chi, hoàn, phải có, đếm, chênh lệch; in được.
- Manager chốt thay người quên chốt (cần `cash.shift.close_other`, ghi lý do và audit).

## Tiêu chí nghiệm thu
- [ ] Không mở ca thì không tạo được thanh toán (nút bị chặn, nói rõ lý do).
- [ ] Tiền mặt: khách đưa 200.000 cho bill 185.000 thì thối 15.000; làm tròn theo cấu hình.
- [ ] VietQR: payment `pending` cho tới khi người có quyền xác nhận; Waiter không có nút xác nhận; ghi `confirmed_by`; bàn **không đóng** khi còn `pending`.
- [ ] Tách bill 3 cách (theo món, chia đều, theo số tiền); order chỉ `paid` khi tổng phần = tổng order.
- [ ] Nhiều phương thức: tiền mặt + VietQR cho cùng bill; nút xác nhận chỉ bật khi tổng = số phải trả.
- [ ] Sau `paid`: bàn `cleaning`, Waiter dọn → `available`; order `closed` không sửa trực tiếp.
- [ ] Hoàn tiền không sửa payment cũ, tạo `refund` có lý do, cần Manager duyệt, trừ quỹ ca hiện tại.
- [ ] Chốt ca: `phải có = đầu ca + tiền mặt bán + thu − chi − hoàn tiền mặt` khớp từng đồng; chênh lệch > ngưỡng bắt buộc Manager ghi chú.
- [ ] Không chốt ca khi còn payment `pending`; order mở được chuyển sang ca kế tiếp.
- [ ] Tip tách khỏi doanh thu; hoá đơn yêu cầu lưu MST và thông tin.
- [ ] Bill in có dòng "Không phải hoá đơn VAT"; mọi thao tác nhạy cảm ghi audit.
- [ ] Mọi màn hình đủ 6 trạng thái; vùng chạm 56px ở tablet quầy.
