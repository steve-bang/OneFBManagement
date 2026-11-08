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

# BƯỚC 2/12: BỘ THÀNH PHẦN GIAO DIỆN (UI KIT)

## Mục tiêu bước này
Dựng thư viện component dùng chung trong `src/design/components/` và trang xem trước `/dev/ui`. Các bước sau **chỉ được dùng component ở đây**, không tự tạo nút, ô nhập, pill, modal riêng.

## 2.1 Nguyên tắc chung cho mọi component
- Chỉ dùng token ngữ nghĩa. Nhận cỡ theo `useDevice()`: vùng chạm 48/56/72/44px, thang chữ theo thiết bị:
  - web admin: nhãn 12/16 (500), nội dung 14/20, tiêu đề 20/28 (600), chỉ số 30/38 (700).
  - điện thoại: nhãn 13/18, nội dung 15/22, tiêu đề 18/26, giá 20/28 (700), số lớn 28/36.
  - tablet POS: nhãn 14/20, nội dung 16/24, tiêu đề 20/28, giá 24/32, số lớn 32/40.
  - KDS: nhãn 18/24, nội dung 20/28 (500), số bàn 28/36 (700), đồng hồ 32/40 (700), số lớn 48/56.
- Đủ trạng thái tương tác: mặc định, hover (chỉ khi có chuột), pressed, focus-visible (vòng `focus-ring` 2px cách 2px), disabled, loading. Hỗ trợ bàn phím và `aria-*` đúng (`aria-pressed`, `aria-checked`, `aria-current`, `aria-invalid`, `aria-live`).
- Chuyển động 120/200/320ms `ease-out`; tắt khi `prefers-reduced-motion`.
- Mỗi component xuất props có kiểu rõ ràng, có thể dùng độc lập.

## 2.2 Danh sách component và hành vi bắt buộc
**Nút**: `Button` (biến thể `primary | secondary | ghost | danger`, cỡ theo thiết bị, `loading` chặn chạm lần hai và hiện nhãn "Đang gửi…", `disabled`), `IconButton` (có `aria-label` bắt buộc). Primary dùng `bg-action`, hover `bg-action-hover`, pressed `bg-action-pressed`, chữ `text-on-action`. Danger dùng `feedback-danger` nền và `text-on-action` chữ.

**Biểu mẫu**: `TextField` (nhãn cố định phía trên, gợi ý, lỗi nằm dưới có icon và viền `feedback-danger`, kiểu bàn phím `numeric/tel`), `SearchField`, `Select`, `Textarea`, `Switch` (`role="switch"`), `SegmentedControl`, `Stepper` (tăng giảm số lượng, tối thiểu 1, nút tròn đủ vùng chạm), `Checkbox`, `Radio`, `MoneyInput` (nhập số nguyên VND, hiện `formatVnd`, cảnh báo nếu không là bội số 500).

**Trạng thái**: `StatusPill` nhận `domain: 'table'|'item'|'sla'|'order'|'payment'|'shift'` và `status`, tự map sang token và nhãn tiếng Việt, luôn có chấm và chữ. Nhãn: bàn (Trống, Đang phục vụ, Chờ thanh toán, Đã đặt, Gọi hỗ trợ, Đang dọn), món (Mới, Đang làm, Đã xong, Đã giao, Đã huỷ, Đã làm huỷ, Hết món), chờ bếp (Đúng hạn, Sắp trễ, Quá hạn), order (Nháp, Đã gửi, Đang làm, Sẵn sàng, Đã phục vụ, Đã thanh toán, Đã đóng, Đã huỷ), payment (Chờ xác nhận, Đã nhận, Thất bại, Đã huỷ, Đã hoàn), ca (Đang mở, Đang chốt, Đã chốt). `Alert` (4 loại `success|info|warning|danger`, dùng `bg-*-subtle`/`text-*-subtle`, có icon).

**Thẻ và hiển thị**: `Card` (`bg-surface`, viền `border-subtle`, `radius-md`), `TableCard` (tên bàn, pill, giờ ngồi, tạm tính, bàn gọi hỗ trợ nháy nhẹ; chỉ một vùng chạm chính), `MenuItemCard` (khung ảnh 4:3 có ảnh giữ chỗ, tên, giá; món hết hàng vẫn hiện, nút "Hết hàng" vô hiệu), `KpiCard` (nhãn, số lớn, chênh lệch so kỳ trước có mũi tên + số), `BarChart` và `LineChart` tự vẽ bằng SVG theo token `chart-1…6` kèm chú giải và nhãn trực tiếp, `DataTable` (hàng cao 40px, tiêu đề cột `admin-label`, số căn phải chữ số đều, cuộn ngang trong khung riêng, có loading/ rỗng/ lỗi), `Skeleton`, `Avatar`, `Divider`, `Badge` (số đếm).

**Điều hướng**: `BottomTabs` (tối đa 5 mục, mục chọn dùng `bg-brand-subtle` + `text-on-brand-subtle` + `aria-current`), `SideNav` (rộng 240px, nhóm mục có tiêu đề), `Tabs`, `Breadcrumb`, `PageHeader` (tiêu đề + hành động chính).

**Lớp phủ**: `Modal` (tiêu đề nói rõ việc, nút đóng luôn thấy, đóng bằng Esc và nút Back, khoá focus trong modal, trả focus khi đóng, lớp phủ `bg-scrim` 50%, `z-modal`), `BottomSheet` (điện thoại, kéo từ đáy, cùng quy tắc), `Toast` (tự tắt khoảng 3 giây, nói kết quả cụ thể, hỗ trợ nút "Hoàn tác" 5 giây, vùng `aria-live`, `z-toast`), `Tooltip`.

**Thành phần nghiệp vụ dùng chung**:
- `PinPad` (4–6 số, hiện chấm, phím cao 80px, nút "Xoá" và "Duyệt", khoá tạm 30 giây sau 5 lần sai, `z-pin-approval`, trên mọi modal, tiêu đề nói rõ việc cần duyệt).
- `ApprovalDialog`: nhận `action`, `requiredPermission`, `requesterId`; hiện PinPad; kiểm tra PIN thuộc người **khác người yêu cầu** và có quyền; trả `{approverId}`; ghi audit ở bước 3.
- `ConfirmDialog`: nêu **đối tượng và hậu quả** ("Huỷ 2× Phở bò tái nạm. Bếp đã nhận món."), có danh sách **lý do** bắt buộc chọn trước khi xác nhận, nút xác nhận là danger và không phải nút mặc định (nút Huỷ bỏ nhận focus đầu tiên).
- `OfflineBanner`: `conn-offline`, cố định đầu màn hình, `z-offline`, không đóng được khi còn mất mạng, nêu việc gì vẫn làm được ("Đơn mới sẽ được gửi khi có mạng").
- `SendStatus`: 3 mức "Đang gửi", "Đã gửi", "Chưa gửi (đang chờ mạng)".
- `EmptyState` (lý do + một nút), `ErrorState` (nói chuyện gì xảy ra, nút "Thử lại", mã lỗi nhỏ ở cuối), `PermissionDenied` ("Cần quản lý duyệt" kèm nút nhập PIN quản lý), `LoadingState`.
- `Money` (hiển thị tiền chữ số đều), `Timer` (mm:ss, đổi màu theo ngưỡng `sla`), `Qty`.

## 2.3 Trang `/dev/ui`
Hiển thị mọi component, mọi biến thể và mọi trạng thái, **sáng và tối cạnh nhau**, có công tắc chuyển thiết bị (`phone/pos/kds/admin`). Mỗi nhóm có tiêu đề và dòng nêu token chính dùng. Có đủ ví dụ: lưới 6 thẻ bàn ở 5 trạng thái, pill đủ bộ, 4 alert, bảng 5 dòng, biểu đồ cột và đường, PinPad 4 số và 6 số, ConfirmDialog huỷ món, ApprovalDialog, Toast có hoàn tác, OfflineBanner, EmptyState, ErrorState, PermissionDenied, Skeleton.

## Tiêu chí nghiệm thu
- [ ] Mọi component trong 2.2 tồn tại, có trong `/dev/ui` ở sáng và tối, ở 4 thiết bị.
- [ ] Không có mã màu hex hay giá trị px viết tay ngoài token (trừ kích thước vùng chạm lấy từ `useDevice`).
- [ ] Tab bằng bàn phím đi hết các phần tử, focus ring thấy rõ ở cả hai theme; Esc đóng modal.
- [ ] Nút `loading` không nhận chạm lần hai (thử bấm nhanh 5 lần chỉ gọi một lần).
- [ ] `StatusPill` hiển thị đúng token và nhãn cho mọi trạng thái; luôn có chấm và chữ.
- [ ] `ConfirmDialog` không cho xác nhận khi chưa chọn lý do; nút xác nhận không nhận focus đầu tiên.
- [ ] `ApprovalDialog` từ chối PIN của chính người yêu cầu và PIN của người không có quyền.
- [ ] `PinPad` 6 số hoạt động, hiện chấm, khoá 30 giây sau 5 lần sai.
- [ ] Biểu đồ có chú giải hoặc nhãn trực tiếp, không phân biệt chỉ bằng màu.
- [ ] Cỡ chữ hệ thống tăng 130% không cắt chữ hay che nút.

---

## CÁCH BÁO CÁO KHI XONG BƯỚC NÀY

Khi hoàn tất, trả lời đúng 3 phần, ngắn gọn:
1. **File đã tạo/ sửa** (danh sách, mỗi file một dòng nói mục đích).
2. **Tự kiểm tra**: chép lại từng mục trong "Tiêu chí nghiệm thu" ở trên và ghi **Đạt** hoặc **Chưa đạt (lý do)**. Không ghi Đạt nếu chưa chắc ứng dụng chạy được.
3. **Quyết định mặc định bạn đã tự chọn** ở chỗ nghiệp vụ mơ hồ, mỗi quyết định một dòng, để tôi xác nhận.

Ứng dụng phải chạy được ngay, không lỗi console, không lỗi TypeScript.
