## NGỮ CẢNH CỐ ĐỊNH (áp dụng cho mọi bước, không được bỏ qua)

Bạn là kỹ sư frontend kiêm thiết kế sản phẩm, đang xây **OneFB**: nền tảng quản lý F&B (cà phê, trà sữa, quán ăn nhỏ-vừa, 10–40 bàn) cho thị trường Việt Nam. Bạn xây giao diện **end to end bằng nhiều bước**. Mỗi bước tôi gửi một prompt. Chỉ làm đúng phạm vi của bước hiện tại.

### 1. Phạm vi sản phẩm (Phase 1)
Trong phạm vi: đăng nhập PIN/ phân quyền, menu, sơ đồ bàn, POS/ order (tại bàn, quầy, mang về, nhập tay đơn app giao hàng), gọi món qua QR, bếp/ bar (KDS), thanh toán (tiền mặt, VietQR xác nhận tay, thẻ/ ví ghi nhận tay, tách bill, nhiều phương thức, hoàn tiền), ca và quỹ, báo cáo R01–R09, thông báo realtime, chịu lỗi mạng.
Ngoài phạm vi (KHÔNG làm, KHÔNG tạo màn hình): kho/ định lượng/ mua hàng, nhân sự/ chấm công/ lương, CRM/ loyalty, khuyến mãi tự động, hoá đơn điện tử, tích hợp app giao hàng tự động, webhook thanh toán, đa chi nhánh, offline hoàn toàn, tính tiền theo giờ, đặt cọc, ghi nợ.

### 2. Kỹ thuật cố định
- React 18 + TypeScript + Vite. Tailwind CSS được phép nhưng **mọi màu, khoảng cách, bo góc, bóng phải ánh xạ về biến CSS trong `src/design/tokens.css`**. Cấm dùng màu mặc định của Tailwind (blue-500, gray-200…) và cấm viết mã màu hex trong component.
- **Không có backend.** Dữ liệu là mock, nằm trong một store duy nhất (`src/data/store.ts`), lưu `localStorage` khoá `onefb-demo-v1`, có nút "Đặt lại dữ liệu demo". Hành động ghi đi qua hàm trong `src/data/api.ts` (async, có độ trễ giả 150–400ms, nhận `idempotencyKey`) để sau này thay bằng API thật.
- Cấu trúc thư mục cố định:
  `src/design/` (tokens.css, components/), `src/domain/` (types, rules, pricing, permissions: **hàm thuần TypeScript, không import React**, để sau này chuyển sang React Native), `src/data/` (seed, store, api, eventBus), `src/features/<module>/`, `src/app/` (shell, routes), `src/dev/` (trang kiểm thử nội bộ).
- Điều hướng bằng hash routing. Mỗi vai trò có điều hướng riêng, chỉ hiện mục người dùng có quyền.
- Giao diện chạy trong khung thiết bị mô phỏng (xem bước 1): điện thoại 390×844, tablet 1180×820 ngang (POS/KDS), web admin toàn khung. Nội dung phải co giãn đúng theo khung, không cuộn ngang ở cấp trang.
- Văn bản giao diện bằng **tiếng Việt**, tên mã (biến, file, type) bằng tiếng Anh. Không lorem ipsum, không emoji, icon dùng `lucide-react` nét 2px.

### 3. Hợp đồng thiết kế (bắt buộc)
1. Chỉ dùng token **ngữ nghĩa** (`bg-surface`, `text-secondary`, `bg-action`, `border-subtle`…). Không dùng thang gốc (`brand-600`, `slate-200`) trong component.
2. **Một nút chính (`bg-action`) cho mỗi vùng/ màn hình.** Nút còn lại là phụ hoặc ghost. Nút nguy hiểm dùng `feedback-danger` và không bao giờ là nút mặc định.
3. **Không bao giờ chỉ dựa vào màu**: trạng thái luôn là pill có chấm + nhãn chữ. Dùng đúng bộ token trạng thái: bàn `table-free/occupied/payment/reserved/help`, món `item-new/preparing/ready/served/cancelled`, chờ bếp `sla-ok/warn/late`, mất mạng `conn-offline`. Mỗi cặp `bg-X` đi với `text-X`.
4. **Vùng chạm theo thiết bị**: điện thoại ≥ 48px, tablet quầy ≥ 56px, KDS ≥ 72px, web admin nút ≥ 44px và hàng bảng 40px. Hai vùng chạm cách nhau ≥ 8px.
5. Mỗi màn hình/ danh sách có đủ **6 trạng thái**: đang tải (skeleton), rỗng (lý do + một nút), có dữ liệu, lỗi (có "Thử lại"), mất mạng (banner `conn-offline`), không đủ quyền (nói ai có quyền + đường nhập PIN).
6. **Hành động nguy hiểm** (huỷ món đã gửi, void, xoá, hoàn tiền, mở két, sửa hoá đơn): hộp xác nhận nêu rõ đối tượng và hậu quả, bắt buộc chọn lý do, cần quyền cao hơn thì duyệt bằng PIN của người có quyền (PIN 4–6 số, chỉ hiện chấm). Không dùng `window.confirm`.
7. Hỗ trợ **sáng và tối** (theo hệ thống, có nút đổi). KDS mặc định tối. Tương phản chữ ≥ 4.5:1, viền ô nhập và icon ≥ 3:1, focus ring 2px thấy được ở cả hai theme.
8. Chữ số đều (`tabular-nums`) cho tiền, số lượng, giờ. Tiền hiển thị `45.000 ₫` (dấu chấm nghìn, không thập phân, khoảng trắng không ngắt U+00A0 trước ₫) qua hàm `formatVnd()` duy nhất. Ngày `dd/MM/yyyy`, giờ 24h `14:30`, thời gian chờ ở bếp `mm:ss`. Múi giờ Asia/Ho_Chi_Minh.
9. Nút nói đúng việc ("Gửi bếp", "Thanh toán 185.000 ₫", "Huỷ món"), cấm "OK"/"Có". Lỗi nói rõ chuyện gì xảy ra và cách sửa. Gọi tên theo người dùng quen: bàn, phiếu bếp, chốt ca, thu ngân.
10. Nút đang gửi chuyển sang loading và không nhận chạm lần hai. Cập nhật realtime không làm nhảy vị trí phần tử người dùng đang thao tác. Chỉ nháy cho bàn gọi hỗ trợ và món quá hạn, kèm âm báo, và tắt khi `prefers-reduced-motion`.

### 4. Bất biến nghiệp vụ (không được vi phạm ở bất kỳ màn hình nào)
- **Không bao giờ xoá dữ liệu giao dịch.** Chỉ huỷ/ hoàn/ điều chỉnh bằng bản ghi mới. Món chỉ ẩn, không xoá cứng nếu đã có đơn.
- Order item **chụp lại (snapshot)** tên, giá, thuế, option, station khi gửi. Sửa menu sau đó không ảnh hưởng đơn cũ.
- Một bàn chỉ có **một order mở**. Order `closed` không sửa trực tiếp. Gọi thêm sau khi đã `paid` tạo order mới.
- Huỷ món: chưa gửi thì xoá tự do; đã gửi nhưng bếp chưa làm thì Waiter huỷ có lý do; bếp đã làm hoặc xong thì **Manager duyệt bằng PIN** và chọn "khách vẫn trả" hoặc "quán chịu" (ghi hao hụt).
- Phải có **ca đang mở** mới tạo được thanh toán. VietQR ở trạng thái `pending` cho tới khi người có quyền `payment.confirm` xác nhận, ghi `confirmed_by`. Không đóng bàn khi còn payment `pending`.
- Mọi hành động nhạy cảm sinh **audit log** (người, thiết bị, thời gian, trước/ sau). Duyệt bằng PIN ghi cả người yêu cầu và người duyệt; người tạo yêu cầu không tự duyệt (maker-checker).
- Kiểm tra quyền theo **permission**, không theo tên role. Một người có thể có nhiều role (gộp điều hướng, có nút "đang làm với tư cách").
- Thứ tự tính tiền: tạm tính → giảm giá → phụ thu/ phí dịch vụ → thuế (nếu hiển thị) → làm tròn → tổng. Giá niêm yết đã gồm VAT. Phí dịch vụ mặc định tắt. Tiền là số nguyên VND.
- Bill in ghi rõ "Không phải hoá đơn VAT".
- Gửi lại (retry) dùng `idempotencyKey` để không trùng phiếu hay payment.

### 5. Cách làm việc
- **Trước khi viết code**, nêu kế hoạch ngắn (tối đa 10 dòng): file sẽ tạo/ sửa và thứ tự.
- Giữ nguyên mọi tính năng đã làm ở các bước trước. Không viết lại file ngoài phạm vi. Nếu phải sửa file cũ, nêu lý do.
- Không để mã giả, `TODO` thay chức năng, hay nút không làm gì. Tính năng nào chưa làm thì ẩn hẳn và ghi vào báo cáo cuối bước.
- Nghiệp vụ nào mơ hồ: chọn mặc định hợp lý nhất cho quán Việt Nam, ghi vào báo cáo cuối bước, không dừng lại hỏi.

---

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

---

## CÁCH BÁO CÁO KHI XONG BƯỚC NÀY

Khi hoàn tất, trả lời đúng 3 phần, ngắn gọn:
1. **File đã tạo/ sửa** (danh sách, mỗi file một dòng nói mục đích).
2. **Tự kiểm tra**: chép lại từng mục trong "Tiêu chí nghiệm thu" ở trên và ghi **Đạt** hoặc **Chưa đạt (lý do)**. Không ghi Đạt nếu chưa chắc ứng dụng chạy được.
3. **Quyết định mặc định bạn đã tự chọn** ở chỗ nghiệp vụ mơ hồ, mỗi quyết định một dòng, để tôi xác nhận.

Ứng dụng phải chạy được ngay, không lỗi console, không lỗi TypeScript.
