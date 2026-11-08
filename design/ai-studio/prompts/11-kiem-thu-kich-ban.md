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

# BƯỚC 11/12: KIỂM THỬ THEO KỊCH BẢN NGHIỆM THU

## Mục tiêu bước này
Dựng trang `/dev/scenarios`: **chạy tự động** các kịch bản nghiệm thu Phase 1 trên chính các hàm domain và store, hiện bảng Đạt/ Không đạt. Nếu kịch bản nào không đạt thì **sửa lỗi ở mã nguồn** (không sửa kịch bản cho dễ qua). Không thêm tính năng mới.

## 11.1 Cách dựng
- Mỗi kịch bản là một hàm async nhận một **store sạch** (nạp seed mới trong bộ nhớ, không đụng `localStorage` thật), đi qua các hàm thật của `src/domain` và `src/data/api.ts` (không viết lại logic trong kịch bản), rồi `assert` kết quả.
- Trang hiển thị bảng: mã kịch bản, tên, trạng thái (Đạt/ Không đạt/ Đang chạy), thời gian, chi tiết các bước và giá trị mong đợi/ thực tế khi lỗi. Nút "Chạy tất cả" và "Chạy lại kịch bản này". Có tổng kết "x/y đạt".
- Dùng `StatusPill` cho kết quả, `DataTable` cho bảng. Trang chỉ hiện trong công cụ demo, không nằm trong điều hướng sản phẩm.

## 11.2 Kịch bản bắt buộc
**Luồng chuẩn**
- **K01 Luồng A (tại bàn)**: mở bàn → gọi món có option → gửi (2 ticket đúng station) → bếp làm xong → Waiter "Đã phục vụ" → gọi thêm round 2 → "Yêu cầu thanh toán" (bàn `needs_payment`) → thanh toán tiền mặt → order `paid` → `closed` → bàn `cleaning` → `available`.
- **K02 Luồng B (QR)**: khách gửi đơn ở chế độ cần xác nhận → chờ nhân viên → xác nhận → xuống bếp → khách thấy trạng thái → thanh toán VietQR `pending` → thu ngân xác nhận → `paid`.
- **K03 Luồng C (quầy)**: tạo đơn quầy có số thứ tự → thanh toán ngay → ly xuống Bar có tem → `ready` → `served` → `closed`.

**Bảy tình huống đặc biệt**
- **K04 Gọi thêm**: sau `paid` gọi thêm tạo order **mới**, order cũ không đổi.
- **K05 Hai khách cùng bàn qua QR**: hai phiên khách chung một order, mỗi item ghi đúng `guestSessionId`, mỗi người chỉ huỷ được món chưa nhận của mình.
- **K06 Tách bill**: ba cách (theo món, chia đều 3, theo số tiền); order chỉ `paid` khi tổng phần = tổng order; thiếu 1 đồng thì chưa `paid`.
- **K07 Huỷ khi đã làm**: món `preparing` bị huỷ cần PIN Manager; người yêu cầu không tự duyệt; chọn "quán chịu" → ghi hao hụt, audit có hai người, món `voided`, không tính tiền.
- **K08 Chuyển bàn**: giữ nguyên order và lịch sử; bàn đích phải hợp lệ; bếp nhận thông báo bàn mới.
- **K09 Chuyển khoản chưa xác nhận**: payment `pending`, **không đóng bàn**; chọn phương thức khác hoặc xác nhận sau thì mới `paid`.
- **K10 Hết món**: bếp báo hết sau khi khách gọi → item `out_of_stock`, Waiter được báo, menu `sold_out`, đơn không tự huỷ; đổi món hoặc huỷ không tính tiền.

**Tiền và ca**
- **K11 Chốt ca khớp**: `Σ payment tiền mặt + đầu ca + thu − chi − hoàn tiền mặt = phải có` đúng từng đồng trên một ca có đủ bán, thu, chi, hoàn.
- **K12 Tính tiền**: bộ ca kiểm thử `computeOrderTotals` (có giảm giá %, giảm số tiền theo dòng, phí dịch vụ, tặng, làm tròn bật/ tắt, thuế hiển thị). Ví dụ bắt buộc: tạm tính 200.000, giảm 10%, phí dịch vụ 5% sau giảm → tổng 189.000.
- **K13 Hoàn tiền**: không sửa payment cũ, tạo `refund`, cần duyệt, trừ quỹ ca hiện tại.
- **K14 Chặn chốt ca**: còn payment `pending` thì không chốt được; order mở chuyển sang ca kế.

**Mất mạng và idempotency**
- **K15 Mất mạng 2 phút**: bật mất mạng giả lập, gửi order, tắt sau 2 phút (đẩy thời gian giả lập); sau đồng bộ có **đúng một** round, không mất, không trùng. Gửi lại cùng `idempotencyKey` trả kết quả cũ.
- **K16 Xung đột khi đồng bộ**: trong lúc mất mạng món bị đánh dấu hết ở bếp; sau đồng bộ hệ thống báo xung đột chứ không ghi đè.

**Quyền, audit, tenant**
- **K17 Ma trận quyền**: duyệt từng dòng ma trận ở bước 3 cho từng role, kết quả `can()` phải khớp (sinh bảng tự động từ ma trận).
- **K18 Quyền bị cấm**: người không có quyền không thực hiện được thao tác bị cấm qua `api.ts` (không chỉ ẩn nút).
- **K19 Audit**: mọi thao tác nhạy cảm trong bước 3 sinh audit đủ trường (người, thiết bị, thời gian, trước/ sau, lý do, người duyệt nếu có); không có hàm sửa/ xoá audit.
- **K20 Cô lập tenant**: tạo tenant thứ hai trong bộ nhớ có dữ liệu riêng; mọi truy vấn của người dùng tenant A **không bao giờ** trả bản ghi của tenant B (kiểm tra qua mọi hàm đọc của store/ api).
- **K21 Snapshot giá**: đổi giá và tên món sau khi gửi không đổi order cũ.
- **K22 Bất biến**: order `closed` không sửa trực tiếp; một bàn không có hai order mở; bàn còn order chưa trả không thể `available`.

**Báo cáo**
- **K23 R02 và R05 khớp**: R02 bằng tổng giao dịch tính độc lập; tổng các ca trong ngày = tổng ngày; đơn lúc 01:30 thuộc ngày kinh doanh trước.
- **K24 Truy ngược**: mỗi con số ở R01–R09 mở ra danh sách đơn có tổng bằng đúng con số đó.

## 11.3 Sau khi chạy
1. Chạy tất cả. Với mỗi kịch bản **Không đạt**, tìm lỗi ở mã nguồn domain/ data/ giao diện và sửa. Chạy lại cho tới khi tất cả Đạt.
2. Ghi ngắn trong báo cáo cuối: kịch bản nào từng lỗi, nguyên nhân, đã sửa ở file nào.
3. Nếu một kịch bản **không thể** đạt vì thiếu tính năng ở bước trước, ghi rõ kịch bản và thiếu gì, **đừng sửa kịch bản**.

## Tiêu chí nghiệm thu
- [ ] `/dev/scenarios` chạy được, có đủ K01–K24, hiện tổng kết x/24.
- [ ] Mọi kịch bản dùng store sạch trong bộ nhớ, không làm hỏng dữ liệu demo đang lưu.
- [ ] Kịch bản gọi hàm thật của domain/ api, không tự viết lại logic.
- [ ] Kết quả sau khi sửa: 24/24 Đạt, hoặc danh sách rõ ràng kịch bản chưa đạt kèm lý do.
- [ ] K12 cho tổng 189.000 ở ví dụ bắt buộc; K11 khớp từng đồng; K15 đúng một round sau đồng bộ.

---

## CÁCH BÁO CÁO KHI XONG BƯỚC NÀY

Khi hoàn tất, trả lời đúng 3 phần, ngắn gọn:
1. **File đã tạo/ sửa** (danh sách, mỗi file một dòng nói mục đích).
2. **Tự kiểm tra**: chép lại từng mục trong "Tiêu chí nghiệm thu" ở trên và ghi **Đạt** hoặc **Chưa đạt (lý do)**. Không ghi Đạt nếu chưa chắc ứng dụng chạy được.
3. **Quyết định mặc định bạn đã tự chọn** ở chỗ nghiệp vụ mơ hồ, mỗi quyết định một dòng, để tôi xác nhận.

Ứng dụng phải chạy được ngay, không lỗi console, không lỗi TypeScript.
