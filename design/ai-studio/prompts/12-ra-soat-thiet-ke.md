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

# BƯỚC 12/12: RÀ SOÁT THIẾT KẾ VÀ HOÀN THIỆN

## Mục tiêu bước này
Tự kiểm toán toàn bộ giao diện theo hợp đồng thiết kế ở phần "Ngữ cảnh cố định" mục 3, rồi **sửa mọi vi phạm**. Không thêm tính năng mới. Không đổi hành vi nghiệp vụ đã qua kiểm thử ở bước 11 (chạy lại `/dev/scenarios` sau khi sửa, phải vẫn đạt).

## 12.1 Kiểm toán tự động bằng mã
Viết một script kiểm tra (chạy được bằng một lệnh hoặc một trang `/dev/audit`) và báo cáo:
1. **Màu viết tay**: tìm mã hex, `rgb()`, `hsl()` và tên màu trong `src/` (ngoài `tokens.css`). Mỗi lần xuất hiện là vi phạm trừ trường hợp có chú thích `design-exception:` kèm lý do.
2. **Thang gốc**: tìm việc dùng token gốc (`brand-`, `slate-`, `night-`, `orange-`, `green-`, `red-`, `amber-`, `blue-`, `pink-`, `cyan-` kèm số) trong component ngoài `src/design/` và biểu đồ.
3. **Giá trị px viết tay** cho khoảng cách, bo góc, cỡ chữ (ngoài kích thước vùng chạm từ `useDevice`).
4. **Nút**: mỗi màn hình có đúng một `Button variant="primary"` trong mỗi vùng; nút `danger` không phải nút mặc định/ nút được focus đầu tiên trong hộp xác nhận.
5. **Trạng thái chỉ bằng màu**: mọi hiển thị trạng thái phải qua `StatusPill` (có chấm + chữ); không tô màu nền thẻ để thay cho nhãn.
6. **`window.confirm/alert/prompt`**: không được dùng.
7. **`React` trong `src/domain/`**: không được import.
8. **Nút icon không có `aria-label`**; ô nhập không có nhãn; hình ảnh không có `alt`.
9. **Ô tương tác nhỏ hơn mức tối thiểu**: đo `getBoundingClientRect` của mọi `button, a, input, select, [role=button]` ở mỗi thiết bị, báo cáo cái nhỏ hơn 44px (điện thoại 48, POS 56, KDS 72).

## 12.2 Kiểm toán theo màn hình (làm lần lượt, ghi thành bảng)
Với **mỗi route** và **mỗi thiết bị áp dụng**, ở **cả sáng và tối**, kiểm tra và ghi **Đạt / Vi phạm (mã quy tắc)**:
- 6 trạng thái: tải, rỗng, dữ liệu, lỗi (có "Thử lại"), mất mạng (banner), không đủ quyền.
- Tương phản chữ ≥ 4.5:1, viền ô nhập/ icon/ focus ≥ 3:1 (dùng công thức tương phản WCAG trong script, đọc giá trị thật từ `getComputedStyle`).
- Focus ring thấy rõ; tab bằng bàn phím đi hết và đúng thứ tự; Esc đóng modal; trả focus khi đóng.
- Cỡ chữ hệ thống 130% không cắt chữ hay che nút; không cuộn ngang ở cấp trang ở mọi khung.
- Văn bản: nút nói đúng việc (không "OK/ Có"), lỗi nói rõ cách sửa, đúng thuật ngữ Việt (bàn, phiếu bếp, chốt ca, thu ngân), tiền qua `formatVnd`, số dùng chữ số đều.
- Hành động nguy hiểm: có xác nhận nêu hậu quả, có lý do, cần quyền cao thì có PIN; không dùng `window.confirm`.
- `prefers-reduced-motion`: tắt nháy và chuyển động trang trí.
- Hiệu năng: danh sách dài dùng phân trang hoặc ảo hoá; không render hàng nghìn phần tử một lúc.

## 12.3 Sửa và báo cáo
1. Liệt kê **toàn bộ vi phạm** theo bảng: route, thiết bị, theme, mã quy tắc, mô tả, file/ dòng.
2. Sửa **từng** vi phạm ở gốc (dùng token/ component đúng, không dùng ngoại lệ trừ khi thật sự cần).
3. Chạy lại script 12.1 và `/dev/scenarios` (bước 11); phải **0 vi phạm** và **24/24 Đạt**, hoặc nêu rõ cái còn lại và lý do.
4. Cập nhật trang `/dev/ui` để phản ánh mọi component và trạng thái thực tế đang dùng.

## Tiêu chí nghiệm thu
- [ ] Script kiểm toán chạy được và báo 0 màu viết tay, 0 token gốc sai chỗ, 0 `window.confirm`.
- [ ] Bảng kiểm toán theo màn hình có đủ mọi route × thiết bị × theme, và tất cả đều Đạt.
- [ ] Mọi vùng chạm đạt mức của thiết bị (đo thật, không đoán).
- [ ] Tương phản đạt ở cả hai theme (số đo thật trong báo cáo).
- [ ] `/dev/scenarios` vẫn 24/24 Đạt sau khi sửa.
- [ ] Mọi ngoại lệ còn lại được liệt kê kèm lý do.

---

## CÁCH BÁO CÁO KHI XONG BƯỚC NÀY

Khi hoàn tất, trả lời đúng 3 phần, ngắn gọn:
1. **File đã tạo/ sửa** (danh sách, mỗi file một dòng nói mục đích).
2. **Tự kiểm tra**: chép lại từng mục trong "Tiêu chí nghiệm thu" ở trên và ghi **Đạt** hoặc **Chưa đạt (lý do)**. Không ghi Đạt nếu chưa chắc ứng dụng chạy được.
3. **Quyết định mặc định bạn đã tự chọn** ở chỗ nghiệp vụ mơ hồ, mỗi quyết định một dòng, để tôi xác nhận.

Ứng dụng phải chạy được ngay, không lỗi console, không lỗi TypeScript.
