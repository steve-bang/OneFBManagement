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
