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

---

## CÁCH BÁO CÁO KHI XONG BƯỚC NÀY

Khi hoàn tất, trả lời đúng 3 phần, ngắn gọn:
1. **File đã tạo/ sửa** (danh sách, mỗi file một dòng nói mục đích).
2. **Tự kiểm tra**: chép lại từng mục trong "Tiêu chí nghiệm thu" ở trên và ghi **Đạt** hoặc **Chưa đạt (lý do)**. Không ghi Đạt nếu chưa chắc ứng dụng chạy được.
3. **Quyết định mặc định bạn đã tự chọn** ở chỗ nghiệp vụ mơ hồ, mỗi quyết định một dòng, để tôi xác nhận.

Ứng dụng phải chạy được ngay, không lỗi console, không lỗi TypeScript.
