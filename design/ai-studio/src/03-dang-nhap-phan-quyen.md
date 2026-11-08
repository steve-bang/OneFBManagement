# BƯỚC 3/12: ĐĂNG NHẬP, PHÂN QUYỀN, QUẢN TRỊ CỬA HÀNG

## Mục tiêu bước này
Làm toàn bộ nền tảng bảo mật và quản trị: đăng nhập, engine phân quyền theo ma trận, phê duyệt bằng PIN, audit log, quản lý nhân viên, vai trò, cấu hình cửa hàng, thiết bị, thông báo trong ứng dụng. Từ bước này, **mọi màn hình và hành động ở các bước sau phải đi qua `can()`** và ghi audit khi nhạy cảm.

## 3.1 Đăng nhập (`/login`)
- **Thiết bị dùng chung (tablet/ KDS)**: màn hình PIN (dùng `PinPad`). PIN 4–6 số **duy nhất trong cửa hàng**, nên chỉ nhập PIN là nhận ra người dùng. Sai 5 lần thì khoá tài khoản đó, **chỉ Manager mở khoá** (màn hình báo rõ). Tự khoá sau N phút không dùng (cấu hình ở cài đặt, mặc định 5 phút), mở lại bằng PIN, giữ nguyên màn hình đang làm.
- **Điện thoại cá nhân**: số điện thoại + mật khẩu (có "Gửi mã OTP" mô phỏng, mã cố định `123456`, ghi rõ trên màn hình là mã demo).
- **Chọn cửa hàng** nếu người dùng có nhiều membership (seed chỉ có một nên màn hình này chỉ cần dựng và tự bỏ qua khi một cửa hàng).
- **Đang làm với tư cách**: người có nhiều role (Nam) thấy nút đổi vai trò làm việc; điều hướng gộp các tab của mọi role của họ, nút đổi chỉ lọc ưu tiên.
- Đăng ký (stub 3 bước: số điện thoại + OTP, tên quán, cửa hàng đầu tiên) tạo tenant mới ở trạng thái `trial`. Chỉ cần dựng luồng, dữ liệu mới lưu vào store.
- Nút "Đăng xuất" và "Khoá màn hình" ở menu người dùng.

## 3.2 Engine phân quyền (`src/domain/permissions.ts`, thuần TypeScript)
`can(user, permission, context?) → 'allow' | 'approval' | 'deny'`.
- `allow` (✔): làm được. `approval` (P): làm được **nếu có người có quyền nhập PIN duyệt tại chỗ**. `deny` (-): chặn. `O` (tuỳ cấu hình cửa hàng): đọc từ cài đặt, mặc định `deny` trừ khi ghi chú khác ở dưới.
- Owner luôn `allow` trong tenant của mình. Quyền cộng gộp theo mọi role của người dùng. Phạm vi theo cửa hàng: không thấy dữ liệu cửa hàng khác.
- **Maker-checker**: người tạo yêu cầu không tự duyệt. Người duyệt phải có permission tương ứng (hoặc `approval.decide`).
- Hook `useCan(permission)` và component `<Can permission="..." fallback={<PermissionDenied/>}>`. Nút không đủ quyền: nếu là `approval` thì hiện bình thường và mở `ApprovalDialog` khi bấm; nếu là `deny` thì ẩn nút, và nếu người dùng vào thẳng route thì hiện `PermissionDenied`.

Ma trận (Phase 1). Ký hiệu: ✔ cho phép, P cần PIN duyệt, O tuỳ cấu hình, - không.

| Permission | Owner | Manager | Cashier | Waiter | Kitchen/Bar |
|---|---|---|---|---|---|
| menu.read | ✔ | ✔ | ✔ | ✔ | ✔ |
| menu.manage | ✔ | ✔ | - | - | - |
| menu.price.update | ✔ | O | - | - | - |
| menu.soldout.toggle | ✔ | ✔ | ✔ | O | ✔ |
| table.view / table.open | ✔ | ✔ | ✔ | ✔ | - |
| table.transfer / merge / split | ✔ | ✔ | ✔ | ✔ | - |
| table.manage (sơ đồ, QR) | ✔ | ✔ | - | - | - |
| reservation.manage | ✔ | ✔ | ✔ | ✔ | - |
| order.create / update / send | ✔ | ✔ | ✔ | ✔ | - |
| order.cancel_item.unsent | ✔ | ✔ | ✔ | ✔ | - |
| order.cancel_item (đã gửi, chưa làm) | ✔ | ✔ | ✔ | ✔ | - |
| order.void (đã làm) | ✔ | ✔ | P | P | - |
| order.discount.apply (≤ ngưỡng) | ✔ | ✔ | ✔ | - | - |
| order.discount.over_limit | ✔ | ✔ | P | - | - |
| order.comp (tặng) | ✔ | ✔ | P | - | - |
| qr.order.confirm | ✔ | ✔ | ✔ | ✔ | - |
| kitchen.view / update_status | ✔ | ✔ | - | - | ✔ (station của mình) |
| kitchen.report_issue | ✔ | ✔ | - | ✔ | ✔ |
| payment.create | ✔ | ✔ | ✔ | O | - |
| payment.confirm (VietQR) | ✔ | ✔ | ✔ | - | - |
| payment.refund | ✔ | ✔ | P | - | - |
| cash.shift.open / close | ✔ | ✔ | ✔ | - | - |
| cash.shift.close_other | ✔ | ✔ | - | - | - |
| cash.movement.create (thu/chi) | ✔ | ✔ | ✔ | - | - |
| cash.drawer.open (không bán) | ✔ | ✔ | P | - | - |
| cash.variance.approve | ✔ | ✔ | - | - | - |
| staff.manage | ✔ | O | - | - | - |
| role.manage | ✔ | - | - | - | - |
| report.sales.view | ✔ | ✔ | O (chỉ ca của mình) | - | - |
| report.export | ✔ | O | - | - | - |
| audit.view | ✔ | O | - | - | - |
| store.settings.manage | ✔ | O | - | - | - |
| approval.decide | ✔ | ✔ | - | - | - |
| device.manage | ✔ | ✔ | - | - | - |

Mặc định `O` cho Manager = **bật** với `menu.price.update`, `staff.manage`, `report.export`, `audit.view`, `store.settings.manage`; `O` cho Cashier ở `report.sales.view` = bật (chỉ ca của mình); `O` cho Waiter ở `menu.soldout.toggle` = tắt. Nhân viên thử việc (cờ `probation`) không có discount, void.

## 3.3 Phê duyệt bằng PIN và audit
- `approvals.request(action, payload, requesterId)` mở `ApprovalDialog`; thành công ghi một `Approval` trạng thái `approved` và audit chứa **cả người yêu cầu và người duyệt**.
- Cũng cho phép yêu cầu duyệt **từ xa**: tạo `Approval` trạng thái `pending` hiện ở `/approvals` của Manager (có đếm số chờ), hết hạn sau 10 phút.
- `audit.write({action, entity, before, after, reason, approverId})` — **bắt buộc** cho: huỷ/void, giảm giá vượt ngưỡng, đổi giá, hoàn tiền, xác nhận thanh toán tay, mở két, sửa quyền/ role, đổi cấu hình tài khoản nhận tiền, vô hiệu hoá nhân viên, chốt ca có chênh lệch, in lại bill/phiếu. Log **chỉ thêm, không sửa/xoá** (không có hàm xoá).
- Mọi thay đổi role/ permission là sự kiện audit.

## 3.4 Màn hình quản trị
- `/staff` **Quản lý nhân viên**: danh sách, mời (SĐT hoặc email, gán role và cửa hàng; trạng thái `invited → active → suspended → removed`), đặt/ đặt lại PIN (4–6 số, duy nhất, băm bằng hàm băm đơn giản trong mock và ghi chú rõ là mô phỏng), vô hiệu hoá (**không xoá**, lịch sử giữ nguyên), cờ thử việc. Dữ liệu cá nhân nhạy cảm (CCCD, tài khoản ngân hàng, lương) chỉ Owner/ Accountant thấy: dựng ô nhập CCCD và tài khoản ngân hàng, ẩn với người khác. Phải còn ít nhất một Owner.
- `/roles` **Vai trò và quyền**: ma trận permission × role dạng bảng. Role hệ thống (Owner, Manager, Cashier, Waiter, Kitchen, Bartender) không xoá được; **nhân bản và sửa** được (tên mới, tick quyền); tuỳ biến tạo role như "Phụ trách ca". Mọi thay đổi ghi audit.
- `/settings` **Cấu hình cửa hàng** (chia nhóm, lưu từng nhóm): thông tin quán, giờ mở cửa, múi giờ và `business_day_cutoff`, tài khoản nhận VietQR (**đổi cần Owner và hiện cảnh báo, ghi audit**), thuế (giá niêm yết đã gồm VAT), phí dịch vụ (bật/tắt, %), mẫu bill (có dòng "Không phải hoá đơn VAT"), máy in (danh sách mô phỏng: tên, khổ 58/80mm, vai trò: bếp/ bar/ quầy/ tem ly), ngưỡng giảm giá tự do (%), ngưỡng chênh lệch quỹ, chế độ đơn QR (cần xác nhận / tự nhận), ngưỡng chờ bếp (mặc định 10/15 phút), thời gian tự khoá thiết bị, chế độ không dùng bàn (`no_table`, ẩn module bàn).
- `/devices` **Thiết bị**: danh sách thiết bị đang đăng nhập (tên, loại, người dùng, lần cuối hoạt động, trạng thái online/offline), thu hồi thiết bị (có xác nhận), ghi audit.
- `/audit` **Nhật ký hoạt động**: bảng chỉ đọc, lọc theo loại hành động, người, khoảng ngày; mở dòng xem trước/ sau, người yêu cầu và người duyệt.
- `/approvals` **Phê duyệt chờ**: danh sách `pending`, nút Duyệt/ Từ chối (từ chối bắt buộc lý do; duyệt bằng PIN).
- `/notifications` **Thông báo**: danh sách trong ứng dụng, đánh dấu đã đọc, tắt loại không quan trọng (loại bắt buộc: round mới, đơn QR chờ, món sẵn sàng, món hết, khách gọi, yêu cầu duyệt, mất kết nối **không tắt được**). Chỉ làm khung và dữ liệu; nguồn sự kiện ở bước 10.

## Tiêu chí nghiệm thu
- [ ] Đăng nhập bằng PIN của 7 người demo; nhập sai 5 lần khoá tài khoản, Manager mở khoá được.
- [ ] Tự khoá sau thời gian cấu hình, mở lại bằng PIN, giữ nguyên màn hình.
- [ ] `can()` trả đúng `allow/approval/deny` cho mọi dòng ma trận (viết hàm kiểm thử nhỏ trong `/dev/scenarios` ở bước 12, bước này chỉ cần hàm chạy đúng).
- [ ] Waiter không thấy `/roles`, `/audit`, `/settings`; vào thẳng URL thì thấy `PermissionDenied`. Cashier thấy báo cáo chỉ của ca mình.
- [ ] Cashier bấm hành động `order.void` mở `ApprovalDialog`; PIN của chính Cashier bị từ chối; PIN của Minh được chấp nhận; audit ghi hai người.
- [ ] Nam (Waiter + Cashier) thấy điều hướng gộp và đổi được "đang làm với tư cách".
- [ ] Vô hiệu hoá nhân viên không xoá bản ghi; không xoá được Owner cuối cùng.
- [ ] Role hệ thống không xoá được, nhân bản và sửa được, sửa ghi audit.
- [ ] Đổi tài khoản VietQR cần Owner, hiện cảnh báo và ghi audit.
- [ ] Audit log không có chức năng sửa hay xoá.
- [ ] Mọi màn hình ở bước này đủ 6 trạng thái (tải, rỗng, dữ liệu, lỗi, mất mạng, không đủ quyền).
