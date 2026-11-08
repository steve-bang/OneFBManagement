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

# BƯỚC 1/12: NỀN TẢNG DỰ ÁN

## Mục tiêu bước này
Dựng khung dự án chạy được: token, khung thiết bị mô phỏng, điều hướng, kiểu dữ liệu, store mock, dữ liệu mẫu và các hàm tiện ích. **Chưa làm màn hình nghiệp vụ.** Mỗi module chỉ có một trang trống ghi tên module.

## 1.1 Token (nguồn sự thật của giao diện)
Tạo file `src/design/tokens.css` với **đúng nội dung** dưới đây, không sửa, không thêm bớt. Import file này ở gốc ứng dụng. Nạp font **Be Vietnam Pro** (400, 500, 600, 700) từ Google Fonts, dự phòng `system-ui`. Đặt `body { background: var(--bg-page); color: var(--text-primary); font-family: var(--font-sans); }`.

Nếu dùng Tailwind: cấu hình `theme.extend` ánh xạ về biến CSS, ví dụ `colors: { surface: 'var(--bg-surface)', page: 'var(--bg-page)', action: 'var(--bg-action)', ... }` cho **tất cả** token ngữ nghĩa, `spacing`, `borderRadius`, `boxShadow`. Tắt bảng màu mặc định của Tailwind.

```css
/* OneFB design tokens — sinh từ design/design-system/project/tokens.json. Không sửa tay. */
:root {
  --slate-0: #FFFFFF;
  --slate-50: #F6F9FC;
  --slate-100: #EDF2F8;
  --slate-200: #E5EDF5;
  --slate-300: #CBD6E4;
  --slate-400: #9AA9BD;
  --slate-500: #64748D;
  --slate-600: #50617A;
  --slate-700: #3A4D68;
  --slate-800: #273449;
  --slate-900: #0A2540;
  --night-800: #1A2236;
  --night-900: #111827;
  --night-950: #0A0E1A;
  --brand-50: #F3F3FF;
  --brand-100: #E2E4FF;
  --brand-200: #C9CCFF;
  --brand-300: #A9AAFE;
  --brand-400: #7F7DFC;
  --brand-500: #635BFF;
  --brand-600: #533AFD;
  --brand-700: #4434D4;
  --brand-800: #3A2BA8;
  --brand-900: #2A2078;
  --brand-950: #1A1450;
  --orange-50: #FFF4EC;
  --orange-100: #FFE3D1;
  --orange-200: #FFC7A3;
  --orange-300: #FFA46B;
  --orange-400: #FB8A4B;
  --orange-500: #FF6118;
  --orange-600: #C2410C;
  --orange-700: #9A3309;
  --orange-800: #7A2907;
  --orange-900: #5A2108;
  --orange-950: #3A1405;
  --green-50: #F0FBF6;
  --green-100: #D6F5E7;
  --green-200: #A9EACB;
  --green-300: #6FD9AB;
  --green-400: #3DD598;
  --green-500: #24B47E;
  --green-600: #15845A;
  --green-700: #116B49;
  --green-800: #0F5539;
  --green-900: #0E3F2B;
  --green-950: #072619;
  --red-50: #FEF1F4;
  --red-100: #FCDDE5;
  --red-200: #FFD0DC;
  --red-300: #F59AB0;
  --red-400: #EC6A8A;
  --red-500: #D9507A;
  --red-600: #C63860;
  --red-700: #A82D50;
  --red-800: #861F3E;
  --red-900: #5A1630;
  --red-950: #3A0D1E;
  --amber-50: #FFFBEB;
  --amber-100: #FEF0C3;
  --amber-200: #FDE9A6;
  --amber-300: #FCD34D;
  --amber-400: #FFC043;
  --amber-500: #D97706;
  --amber-600: #B45309;
  --amber-700: #92400E;
  --amber-800: #78350F;
  --amber-900: #5A4208;
  --amber-950: #3B2A05;
  --blue-50: #F0F5FF;
  --blue-100: #DCE8FF;
  --blue-200: #BFD4FF;
  --blue-300: #93C5FD;
  --blue-400: #60A5FA;
  --blue-500: #3B82F6;
  --blue-600: #1D4ED8;
  --blue-700: #1E40AF;
  --blue-800: #1E3A8A;
  --blue-900: #1E2F5C;
  --blue-950: #14204A;
  --pink-50: #FFF1FB;
  --pink-100: #FFDDF4;
  --pink-200: #FFC2EA;
  --pink-300: #FB93DC;
  --pink-400: #F66FD3;
  --pink-500: #F44BCC;
  --pink-600: #C42FA3;
  --pink-700: #9E2582;
  --pink-800: #7E1E69;
  --pink-900: #4D1441;
  --pink-950: #2E0C27;
  --cyan-50: #F0FCFF;
  --cyan-100: #D4F6FF;
  --cyan-200: #AAEEFF;
  --cyan-300: #80E9FF;
  --cyan-400: #4FD4EE;
  --cyan-500: #1FB5D4;
  --cyan-600: #0E8FAE;
  --cyan-700: #0B7390;
  --cyan-800: #0A5A71;
  --cyan-900: #0A3E4F;
  --cyan-950: #062733;
  --bg-page: var(--slate-50);
  --bg-surface: var(--slate-0);
  --bg-sunken: var(--slate-100);
  --bg-scrim: var(--slate-900);
  --bg-brand: var(--brand-600);
  --bg-brand-subtle: var(--brand-100);
  --text-on-brand-subtle: var(--brand-800);
  --bg-action: var(--brand-600);
  --bg-action-hover: var(--brand-700);
  --bg-action-pressed: var(--brand-800);
  --text-on-action: var(--slate-0);
  --text-primary: var(--slate-900);
  --text-secondary: var(--slate-600);
  --text-muted: var(--slate-500);
  --text-brand: var(--brand-600);
  --border-subtle: var(--slate-200);
  --border-control: var(--slate-500);
  --focus-ring: var(--brand-600);
  --feedback-danger: var(--red-600);
  --feedback-success: var(--green-600);
  --feedback-warning: var(--amber-600);
  --feedback-info: var(--blue-600);
  --bg-danger-subtle: var(--red-100);
  --text-danger-subtle: var(--red-800);
  --bg-success-subtle: var(--green-100);
  --text-success-subtle: var(--green-800);
  --bg-warning-subtle: var(--amber-100);
  --text-warning-subtle: var(--amber-800);
  --bg-info-subtle: var(--blue-100);
  --text-info-subtle: var(--blue-800);
  --bg-table-free: var(--slate-100);
  --text-table-free: var(--slate-700);
  --bg-table-occupied: var(--orange-100);
  --text-table-occupied: var(--orange-800);
  --bg-table-payment: var(--blue-100);
  --text-table-payment: var(--blue-800);
  --bg-table-reserved: var(--pink-100);
  --text-table-reserved: var(--pink-800);
  --bg-table-help: var(--red-100);
  --text-table-help: var(--red-700);
  --bg-item-ready: var(--green-100);
  --text-item-ready: var(--green-800);
  --bg-item-served: var(--cyan-100);
  --text-item-served: var(--cyan-800);
  --bg-sla-warn: var(--amber-100);
  --text-sla-warn: var(--amber-800);
  --bg-item-new: var(--bg-table-free);
  --text-item-new: var(--text-table-free);
  --bg-item-preparing: var(--bg-table-occupied);
  --text-item-preparing: var(--text-table-occupied);
  --bg-item-cancelled: var(--bg-table-help);
  --text-item-cancelled: var(--text-table-help);
  --bg-sla-ok: var(--bg-item-ready);
  --text-sla-ok: var(--text-item-ready);
  --bg-sla-late: var(--bg-table-help);
  --text-sla-late: var(--text-table-help);
  --bg-conn-offline: var(--bg-table-help);
  --text-conn-offline: var(--text-table-help);
  --chart-1: var(--brand-600);
  --chart-2: var(--cyan-600);
  --chart-3: var(--pink-600);
  --chart-4: var(--orange-500);
  --chart-5: var(--amber-500);
  --chart-6: var(--slate-500);
  --space-100: 4px;
  --space-200: 8px;
  --space-300: 12px;
  --space-400: 16px;
  --space-500: 20px;
  --space-600: 24px;
  --space-800: 32px;
  --space-1000: 40px;
  --target-min: 44px;
  --target-comfortable: 48px;
  --target-pos: 56px;
  --target-kds: 72px;
  --row-compact: 40px;
  --row-comfortable: 56px;
  --row-touch: 72px;
  --pin-key: 80px;
  --sidebar-width: 240px;
  --content-max: 1200px;
  --table-card-min: 104px;
  --kds-ticket-width: 260px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 999px;
  --shadow-sm: 0 1px 1px rgba(10,37,64,0.08);
  --shadow-md: 0 3px 6px rgba(10,37,64,0.12);
  --shadow-overlay: 0 15px 35px rgba(50,50,93,0.2), 0 5px 15px rgba(0,0,0,0.12);
  --z-sticky: 10;
  --z-dropdown: 20;
  --z-modal: 30;
  --z-pin-approval: 40;
  --z-toast: 50;
  --z-offline: 60;
  --gradient-brand: linear-gradient(135deg, #533AFD 0%, #7F7DFC 35%, #F44BCC 70%, #FF6118 100%);
  --gradient-cool: linear-gradient(135deg, #533AFD 0%, #80E9FF 100%);
  --gradient-warm: linear-gradient(135deg, #F44BCC 0%, #FF6118 100%);
  --font-sans: "Be Vietnam Pro", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg-page: var(--night-950);
    --bg-surface: var(--night-900);
    --bg-sunken: var(--night-800);
    --bg-scrim: var(--night-950);
    --bg-brand: var(--brand-500);
    --bg-brand-subtle: var(--brand-900);
    --text-on-brand-subtle: var(--brand-100);
    --bg-action: var(--brand-500);
    --bg-action-hover: var(--brand-600);
    --bg-action-pressed: var(--brand-700);
    --text-on-action: var(--slate-0);
    --text-primary: var(--slate-50);
    --text-secondary: var(--slate-400);
    --text-muted: var(--slate-400);
    --text-brand: var(--brand-300);
    --border-subtle: var(--slate-800);
    --border-control: var(--slate-500);
    --focus-ring: var(--brand-300);
    --feedback-danger: var(--red-400);
    --feedback-success: var(--green-400);
    --feedback-warning: var(--amber-400);
    --feedback-info: var(--blue-400);
    --bg-danger-subtle: var(--red-900);
    --text-danger-subtle: var(--red-100);
    --bg-success-subtle: var(--green-900);
    --text-success-subtle: var(--green-100);
    --bg-warning-subtle: var(--amber-900);
    --text-warning-subtle: var(--amber-100);
    --bg-info-subtle: var(--blue-900);
    --text-info-subtle: var(--blue-100);
    --bg-table-free: var(--night-800);
    --text-table-free: var(--slate-300);
    --bg-table-occupied: var(--orange-900);
    --text-table-occupied: var(--orange-200);
    --bg-table-payment: var(--blue-900);
    --text-table-payment: var(--blue-100);
    --bg-table-reserved: var(--pink-900);
    --text-table-reserved: var(--pink-100);
    --bg-table-help: var(--red-900);
    --text-table-help: var(--red-200);
    --bg-item-ready: var(--green-900);
    --text-item-ready: var(--green-100);
    --bg-item-served: var(--cyan-900);
    --text-item-served: var(--cyan-100);
    --bg-sla-warn: var(--amber-900);
    --text-sla-warn: var(--amber-200);
    --chart-1: var(--brand-400);
    --chart-2: var(--cyan-300);
    --chart-3: var(--pink-400);
    --chart-4: var(--orange-400);
    --chart-5: var(--amber-400);
    --chart-6: var(--slate-400);
    color-scheme: dark;
  }
}
:root[data-theme="dark"] {
  --bg-page: var(--night-950);
  --bg-surface: var(--night-900);
  --bg-sunken: var(--night-800);
  --bg-scrim: var(--night-950);
  --bg-brand: var(--brand-500);
  --bg-brand-subtle: var(--brand-900);
  --text-on-brand-subtle: var(--brand-100);
  --bg-action: var(--brand-500);
  --bg-action-hover: var(--brand-600);
  --bg-action-pressed: var(--brand-700);
  --text-on-action: var(--slate-0);
  --text-primary: var(--slate-50);
  --text-secondary: var(--slate-400);
  --text-muted: var(--slate-400);
  --text-brand: var(--brand-300);
  --border-subtle: var(--slate-800);
  --border-control: var(--slate-500);
  --focus-ring: var(--brand-300);
  --feedback-danger: var(--red-400);
  --feedback-success: var(--green-400);
  --feedback-warning: var(--amber-400);
  --feedback-info: var(--blue-400);
  --bg-danger-subtle: var(--red-900);
  --text-danger-subtle: var(--red-100);
  --bg-success-subtle: var(--green-900);
  --text-success-subtle: var(--green-100);
  --bg-warning-subtle: var(--amber-900);
  --text-warning-subtle: var(--amber-100);
  --bg-info-subtle: var(--blue-900);
  --text-info-subtle: var(--blue-100);
  --bg-table-free: var(--night-800);
  --text-table-free: var(--slate-300);
  --bg-table-occupied: var(--orange-900);
  --text-table-occupied: var(--orange-200);
  --bg-table-payment: var(--blue-900);
  --text-table-payment: var(--blue-100);
  --bg-table-reserved: var(--pink-900);
  --text-table-reserved: var(--pink-100);
  --bg-table-help: var(--red-900);
  --text-table-help: var(--red-200);
  --bg-item-ready: var(--green-900);
  --text-item-ready: var(--green-100);
  --bg-item-served: var(--cyan-900);
  --text-item-served: var(--cyan-100);
  --bg-sla-warn: var(--amber-900);
  --text-sla-warn: var(--amber-200);
  --chart-1: var(--brand-400);
  --chart-2: var(--cyan-300);
  --chart-3: var(--pink-400);
  --chart-4: var(--orange-400);
  --chart-5: var(--amber-400);
  --chart-6: var(--slate-400);
  color-scheme: dark;
}
/* Thang chữ theo thiết bị */
.admin-label { font-size: 12px; line-height: 16px; font-weight: 500; }
.admin-body { font-size: 14px; line-height: 20px; font-weight: 400; }
.admin-title { font-size: 20px; line-height: 28px; font-weight: 600; }
.admin-heading { font-size: 24px; line-height: 32px; font-weight: 700; }
.admin-metric { font-size: 30px; line-height: 38px; font-weight: 700; }
.phone-body { font-size: 15px; line-height: 22px; font-weight: 400; }
.phone-label { font-size: 13px; line-height: 18px; font-weight: 500; }
.phone-title { font-size: 18px; line-height: 26px; font-weight: 600; }
.phone-price { font-size: 20px; line-height: 28px; font-weight: 700; }
.phone-display { font-size: 28px; line-height: 36px; font-weight: 700; }
.pos-body { font-size: 16px; line-height: 24px; font-weight: 400; }
.pos-label { font-size: 14px; line-height: 20px; font-weight: 500; }
.pos-title { font-size: 20px; line-height: 28px; font-weight: 600; }
.pos-price { font-size: 24px; line-height: 32px; font-weight: 700; }
.pos-display { font-size: 32px; line-height: 40px; font-weight: 700; }
.kds-body { font-size: 20px; line-height: 28px; font-weight: 500; }
.kds-label { font-size: 18px; line-height: 24px; font-weight: 500; }
.kds-title { font-size: 28px; line-height: 36px; font-weight: 700; }
.kds-timer { font-size: 32px; line-height: 40px; font-weight: 700; }
.kds-display { font-size: 48px; line-height: 56px; font-weight: 700; }
```

Theme: mặc định theo `prefers-color-scheme`. Nút đổi giao diện có 3 trạng thái (tự động/ sáng/ tối): đặt hoặc xoá thuộc tính `data-theme` trên `<html>`.

## 1.2 Khung ứng dụng và công cụ demo
Tạo `src/app/Shell.tsx`: một thanh **Công cụ demo** cố định phía trên (không thuộc sản phẩm), gồm:
1. **Thiết bị**: Điện thoại (390×844), Tablet ngang (1180×820), KDS (1280×720, theme tối), Web admin (toàn khung). Ứng dụng hiển thị trong một khung có đúng kích thước đó, căn giữa, viền mảnh `border-subtle`, bo `radius-lg`. Dùng container có kích thước cố định, không dùng `iframe`.
2. **Đăng nhập nhanh như**: danh sách người dùng demo (xem 1.5) để đổi người dùng ngay không cần PIN (chỉ ở công cụ demo).
3. **Giao diện**: tự động/ sáng/ tối.
4. **Giả lập mất mạng**: công tắc (hành vi ở bước 10; bước này chỉ lưu cờ `network.online` vào store).
5. **Đặt lại dữ liệu demo**: xoá `localStorage` và nạp lại dữ liệu mẫu (có hộp xác nhận trong trang, không dùng `window.confirm`).

Cung cấp React context `useDevice()` trả về `'phone' | 'pos' | 'kds' | 'admin'` và các hằng số `targetSize` (48/56/72/44) để component ở bước sau dùng chung.

## 1.3 Điều hướng
Hash routing. Tạo trang trống (tiêu đề + dòng "Sẽ làm ở bước N") cho các route:
`/login`, `/tables`, `/pos`, `/orders`, `/kitchen`, `/cashier`, `/shift`, `/menu`, `/reports`, `/staff`, `/roles`, `/settings`, `/devices`, `/audit`, `/approvals`, `/notifications`, `/qr` (khách, không dùng khung thiết bị điện thoại của nhân viên), `/dev/ui`, `/dev/scenarios`.
Điều hướng phụ thuộc thiết bị: điện thoại dùng thanh tab đáy (tối đa 5 mục + "Khác"), tablet dùng thanh bên trái gọn, web admin dùng sidebar rộng 240px. Mục điều hướng do người dùng có quyền xem mới hiện (bước 3 sẽ nối quyền thật; bước này dùng danh sách mặc định theo vai trò chính).

## 1.4 Kiểu dữ liệu và store (`src/domain/types.ts`, `src/data/store.ts`)
Định nghĩa kiểu TypeScript (không dùng `any`) cho:
`Tenant, Store, User, Membership{userId, storeId, roleIds[], status}, Role{id, name, system, permissions[]}, Area, Table, TableSession, Reservation, Category, Product{id, name, nameEn?, description?, price, taxRate, station, unit, prepMinutes, isActive, soldOut: 'available'|'sold_out'|'sold_out_today'|'scheduled_off', optionGroupIds[]}, OptionGroup{id, name, min, max, required, options[]}, Option{id, name, priceDelta, isDefault}, Order{id, code, channel, tableId?, status, items[], rounds[], adjustments[], customerName?, phone?, partnerOrderCode?, createdBy, createdAt}, OrderItem{id, roundNo, productSnapshot{name, price, taxRate, optionsSnapshot[], station}, qty, note, status, guestSessionId?, cancelReason?}, Ticket, Payment{id, orderId, shiftId, method, amount, status, confirmedBy?, received?, change?, note?}, Refund, Shift, CashMovement, AuditLog{id, at, userId, approverId?, deviceId, action, entity, before?, after?, reason?}, Approval, Notification, GuestSession, Device`.

Enum trạng thái theo đúng vòng đời:
- Bàn: `available | reserved | occupied | needs_payment | cleaning`.
- Order: `draft | submitted | in_progress | ready | served | paid | closed | cancelled`. `ready`/`served` của order suy ra từ các item, không tự gán.
- Order item: `pending | accepted | preparing | ready | served | cancelled | voided | out_of_stock`.
- Kênh order: `dine_in | counter | takeaway | delivery_app | qr`.
- Payment: `pending | confirmed | failed | cancelled | refunded`. Phương thức: `cash | vietqr | card | ewallet | delivery_partner`.
- Ca: `open | closing | closed`.
- Phê duyệt: `pending | approved | rejected | expired`.
- Đơn QR: `cart | awaiting_staff_confirm | submitted | rejected`.

Store: một nơi duy nhất, có `subscribe`, `getState`, các action thuần cập nhật bất biến, lưu `localStorage` mỗi lần đổi. Cung cấp hook `useStore(selector)`. Cung cấp `eventBus` (`emit(type, payload)`, `on(type, handler)`) với `event_id` và `seq` tăng dần theo store; chưa cần ai lắng nghe.
`src/data/api.ts`: hàm bọc async có độ trễ giả, nhận `idempotencyKey`, nếu cùng key đã xử lý thì trả kết quả cũ, nếu `network.online === false` thì ném lỗi `OfflineError` (bước 10 xử lý hàng đợi).

## 1.5 Dữ liệu mẫu (seed)
Một tenant "Cà Phê Sân Vườn" có **một** cửa hàng, múi giờ Asia/Ho_Chi_Minh, `business_day_cutoff = 04:00`, giá niêm yết đã gồm VAT, phí dịch vụ tắt (cấu hình 5% khi bật), ngưỡng giảm giá tự do của Thu ngân 10%, ngưỡng tự chấp nhận chênh lệch quỹ 20.000 ₫, chế độ đơn QR "cần nhân viên xác nhận", ngưỡng chờ bếp **10 phút cảnh báo, 15 phút quá hạn**, làm tròn tiền mặt tắt, tài khoản nhận VietQR mẫu (ngân hàng giả, tên chủ tài khoản giả).

**Người dùng demo** (PIN 4–6 số, duy nhất trong cửa hàng):
| Tên | Role | PIN |
|---|---|---|
| Chị Hoa | Owner | 123456 |
| Minh | Manager | 9999 |
| Lan | Cashier | 1111 |
| Hùng | Waiter | 2222 |
| Tuấn | Kitchen (station Bếp nóng) | 3333 |
| Vy | Bartender (station Bar) | 4444 |
| Nam | Waiter + Cashier (hai role, để thử "đang làm với tư cách") | 5555 |

**Khu vực và bàn**: Tầng 1 (bàn 1–10, 4 chỗ, bàn 9–10 là 6 chỗ), Sân vườn (bàn S1–S8, 4 chỗ), VIP (VIP1–VIP2, 8 chỗ). Đặt vị trí theo lưới. Mặc định: 4 bàn `occupied` kèm order mở có vài món ở các trạng thái khác nhau, 1 bàn `needs_payment`, 1 bàn `reserved` (đặt 19:30, tên "Anh Minh", 6 người), còn lại `available`.

**Station**: `Bếp nóng`, `Bar`.

**Thực đơn** (giá nguyên VND, bội số 500):
- Cà phê (Bar): Cà phê đen đá 25.000, Cà phê sữa đá 29.000, Bạc xỉu 32.000, Cappuccino 45.000, Cold brew cam 49.000.
- Trà và trà sữa (Bar): Trà đào cam sả 39.000, Trà vải 39.000, Trà sữa trân châu 42.000, Trà sữa matcha 45.000, Hồng trà macchiato 42.000.
- Sinh tố và nước ép (Bar): Sinh tố bơ 45.000, Nước cam ép 38.000.
- Món chính (Bếp nóng): Phở bò tái nạm 55.000, Cơm tấm sườn bì 52.000, Bún chả 48.000, Mì Ý bò bằm 59.000, Cơm gà xối mỡ 49.000.
- Ăn vặt (Bếp nóng): Gỏi cuốn tôm thịt (2 cuốn) 35.000, Khoai tây chiên 30.000, Bánh flan 20.000.
- Một món `sold_out` (Cappuccino) và một món bán theo khung giờ (Bánh flan chỉ bán 10:00–21:00).
- Nhóm tuỳ chọn: **Size** (bắt buộc, chọn 1: S +0, M +5.000, L +10.000, mặc định M) cho đồ uống; **Đường** (bắt buộc: 0%, 50%, 70%, 100% mặc định 100%); **Đá** (bắt buộc: không đá, ít, vừa, nhiều, mặc định vừa); **Topping** (không bắt buộc, tối đa 3: trân châu +7.000, thạch dừa +7.000, pudding +8.000, kem cheese +12.000); **Thêm** cho món chính (không bắt buộc: thêm trứng +8.000, thêm thịt +15.000, ít cay, không hành).
- Tên tiếng Anh cho ít nhất 8 món.

Sinh sẵn một số order đang mở ở các bàn với món ở đủ các trạng thái `pending/ preparing/ ready/ served` để các bước sau có dữ liệu.

## 1.6 Hàm tiện ích (`src/domain/format.ts`)
`formatVnd(n)` → `45.000 ₫` với U+00A0 trước ₫; `formatDate`, `formatTime`, `formatDuration(seconds)` → `mm:ss`; `orderCode(date, seq)` → `MMdd-nnnn` (tăng dần theo cửa hàng và ngày kinh doanh, reset mỗi ngày); `businessDay(date, cutoff)`; `now()` là **giờ máy chủ giả** (một nguồn duy nhất, mọi nơi dùng `now()` thay vì `Date.now()`).

## Tiêu chí nghiệm thu
- [ ] Ứng dụng chạy, không lỗi console, không lỗi TypeScript.
- [ ] `tokens.css` đúng nguyên văn; không có mã màu hex nào ngoài file đó.
- [ ] Đổi được 4 thiết bị, 3 chế độ giao diện; khung đúng kích thước.
- [ ] Đổi "đăng nhập nhanh như" làm điều hướng thay đổi theo thiết bị (chưa cần theo quyền).
- [ ] Tải lại trang giữ nguyên dữ liệu; "Đặt lại dữ liệu demo" khôi phục seed.
- [ ] Seed đủ: 7 người dùng, 21 bàn, đủ thực đơn và nhóm tuỳ chọn, các order mở ở nhiều trạng thái.
- [ ] `formatVnd(45000)` trả `45.000 ₫` (có U+00A0); `orderCode` đúng định dạng.
- [ ] Mọi route trong 1.3 mở được và hiển thị trang trống đúng tên.
- [ ] `src/domain/` không import React.

---

## CÁCH BÁO CÁO KHI XONG BƯỚC NÀY

Khi hoàn tất, trả lời đúng 3 phần, ngắn gọn:
1. **File đã tạo/ sửa** (danh sách, mỗi file một dòng nói mục đích).
2. **Tự kiểm tra**: chép lại từng mục trong "Tiêu chí nghiệm thu" ở trên và ghi **Đạt** hoặc **Chưa đạt (lý do)**. Không ghi Đạt nếu chưa chắc ứng dụng chạy được.
3. **Quyết định mặc định bạn đã tự chọn** ở chỗ nghiệp vụ mơ hồ, mỗi quyết định một dòng, để tôi xác nhận.

Ứng dụng phải chạy được ngay, không lỗi console, không lỗi TypeScript.
