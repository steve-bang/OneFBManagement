# OneFB Management

Design token cho nền tảng quản lý F&B (SaaS multi-tenant): POS và KDS trên tablet Android 8–11" nằm ngang, app điện thoại cho phục vụ, quản lý, chủ quán, PWA quét QR cho khách, và web admin cho chuỗi và kế toán. Token là nguồn chung cho React Native (Expo) và web (PWA, Next.js). Bảng màu theo hướng Stripe-inspired: blurple làm màu chính, navy cho chữ, nền xám xanh nhạt. Đây là bảng tham khảo từ nhận diện công khai, không phải token chính thức của Stripe.

## Cấu trúc ba tầng

| Tầng | Ví dụ | Quy tắc |
|---|---|---|
| Gốc (primitive) | `brand-600`, `slate-50` | Thang 50–950 cho 10 màu (slate, night, brand, orange, green, red, amber, blue, pink, cyan). Chỉ dùng làm đích alias, không dùng trong component. |
| Ngữ nghĩa (semantic) | `bg-surface`, `text-secondary`, `bg-action` | Component luôn dùng tầng này. Mỗi token có giá trị riêng cho theme sáng và tối. |
| Component | `table-card-min`, `kds-ticket-width`, `row-comfortable` | Chỉ khi một component cần kích thước riêng. |

## Quy ước đặt tên

Tên theo `loại-vai trò-trạng thái`:
- `bg-*`: màu nền. `text-*`: màu chữ và icon. `border-*`: viền.
- `bg-action`, `bg-action-hover`, `bg-action-pressed`: ba trạng thái tương tác của nút chính.
- `feedback-danger/success/warning/info`: chữ và icon phản hồi. `bg-*-subtle` + `text-*-subtle`: nền và chữ của thông báo.
- Trạng thái nghiệp vụ F&B: `bg-table-*` / `text-table-*` (free, occupied, payment, reserved, help), `bg-item-*` (new, preparing, ready, served, cancelled), `bg-sla-*` (ok, warn, late), `bg-conn-offline`.
- `chart-1` … `chart-6`: chuỗi dữ liệu báo cáo.
- Khoảng cách theo bậc `space-100` (4px), `space-200` (8px), `space-400` (16px)… Tên không đổi khi chỉnh giá trị.

## Nội dung

- Ít chữ, ít bước. Nhân viên hay đổi, nhiều bạn làm bán thời gian, phải dùng được sau vài phút.
- Nút nói đúng việc sẽ xảy ra: "Gửi bếp", "Thanh toán", "Huỷ món". Không dùng "OK" trống.
- Tiền VND viết `85.000 ₫`: dấu chấm phân tách nghìn, không số thập phân, chữ số đều (`font-variant-numeric: tabular-nums`).
- Giờ 24 giờ (`14:30`). Thời gian chờ ở bếp `mm:ss`.
- Chuỗi tiếng Anh dài hơn khoảng 30%: không đặt chiều rộng cố định cho nhãn.

## Nền tảng hình ảnh

- **Màu**: nền xám xanh rất nhạt `bg-page`, thẻ trắng `bg-surface`, chữ navy `text-primary`. Blurple `brand-600` (#533AFD) cho nút chính, liên kết, focus. Cam chuyển sang vai trò riêng: bàn đang phục vụ. Hồng cho bàn đã đặt, cyan cho món đã giao.
- **Gradient**: `gradient-brand`, `gradient-cool`, `gradient-warm`. Chỉ dùng cho landing, hero, tính năng AI, bảng giá, empty state. Không dùng cho bảng, form hay nút.
- **Hai theme**: sáng cho điện thoại, quầy, khách, web admin; tối cho KDS và quán thiếu sáng.
- **Trạng thái** luôn kèm nhãn hoặc icon, không bao giờ chỉ màu. Biểu đồ luôn kèm nhãn trực tiếp hoặc chú giải.
- **Chữ**: Be Vietnam Pro, dự phòng `system-ui`. Bốn thang theo thiết bị: Web admin, Điện thoại, Tablet POS, KDS. Nội dung chính tối thiểu 14px.
- **Vùng chạm**: `target-min` 44; `target-comfortable` 48 điện thoại; `target-pos` 56 quầy; `target-kds` 72 bếp. Hai vùng chạm cách nhau ít nhất `space-200`.
- **Bo góc và bóng**: nút, thẻ `radius-md` (8px); modal, phiếu bếp `radius-lg` (12px). Bóng pha navy mảnh (`shadow-sm/md/overlay`). Ưu tiên viền `border-subtle` hơn bóng đổ trên tablet giá rẻ.

## Chuyển động

Định dạng này không có token chuyển động, quy ước như sau.

| Tên | Giá trị | Dùng cho |
|---|---|---|
| fast | 120ms | Nhấn nút, đổi tab |
| base | 200ms | Mở sheet, đổi trạng thái thẻ |
| slow | 320ms | Modal, chuyển màn hình |

Easing `ease-out`. Tôn trọng `prefers-reduced-motion`. Chỉ nháy khi `bg-table-help` và `bg-sla-late`, kèm âm báo vì bếp ồn.

## Mật độ

- `row-compact` (40px): bảng cho quản lý và web admin.
- `row-comfortable` (56px): mặc định điện thoại và POS.
- `row-touch` (72px): KDS và bàn phím PIN.

## Quy tắc dùng token

1. Component chỉ dùng token ngữ nghĩa, không dùng thang gốc và không dùng màu thô.
2. Nền chứa chữ trắng dùng `bg-action`. `text-muted` chỉ đặt trên `bg-surface`. Nền chọn nhẹ dùng `bg-brand-subtle` với `text-on-brand-subtle`.
3. Hộp PIN duyệt giảm giá, void, mở két dùng `z-pin-approval`, luôn trên modal. Phím dùng `pin-key`.
4. Banner mất kết nối dùng `bg-conn-offline` / `text-conn-offline`, `z-offline`, cố định đầu màn hình, không đóng được khi còn mất mạng.
5. PWA khách: nút gọi món cố định đáy, `target-comfortable`, ảnh món tỉ lệ 4:3, dung lượng khởi tạo dưới 1 MB.
6. Web admin: sidebar `sidebar-width`, nội dung tối đa `content-max`, chữ `admin-*`, chỉ số lớn `admin-metric`.

## Còn thiếu

Chưa có logo, icon và file font (Be Vietnam Pro nạp từ Google Fonts). Giá trị màu là đề xuất, cần chốt cùng nhận diện thương hiệu. Nên bổ sung chế độ tương phản cao cho KDS khi có người dùng thật.
