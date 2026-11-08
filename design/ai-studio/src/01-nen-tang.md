# BƯỚC 1/12: NỀN TẢNG DỰ ÁN

## Mục tiêu bước này
Dựng khung dự án chạy được: token, khung thiết bị mô phỏng, điều hướng, kiểu dữ liệu, store mock, dữ liệu mẫu và các hàm tiện ích. **Chưa làm màn hình nghiệp vụ.** Mỗi module chỉ có một trang trống ghi tên module.

## 1.1 Token (nguồn sự thật của giao diện)
Tạo file `src/design/tokens.css` với **đúng nội dung** dưới đây, không sửa, không thêm bớt. Import file này ở gốc ứng dụng. Nạp font **Be Vietnam Pro** (400, 500, 600, 700) từ Google Fonts, dự phòng `system-ui`. Đặt `body { background: var(--bg-page); color: var(--text-primary); font-family: var(--font-sans); }`.

Nếu dùng Tailwind: cấu hình `theme.extend` ánh xạ về biến CSS, ví dụ `colors: { surface: 'var(--bg-surface)', page: 'var(--bg-page)', action: 'var(--bg-action)', ... }` cho **tất cả** token ngữ nghĩa, `spacing`, `borderRadius`, `boxShadow`. Tắt bảng màu mặc định của Tailwind.

```css
{{TOKENS_CSS}}
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
