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

# BƯỚC 9/12: BÁO CÁO R01–R09

## Mục tiêu bước này
Làm module báo cáo Phase 1 (R01–R09) cho Owner/ Manager (và Cashier xem ca của mình). Số liệu phải **khớp từng đồng** với giao dịch gốc và truy ngược được tới đơn.

## 9.1 Dữ liệu demo lịch sử
Sinh **trong bộ nhớ khi khởi động** (không lưu `localStorage` để tránh phình) lịch sử **14 ngày kinh doanh** gần nhất, mỗi ngày 60–120 đơn, **xác định (deterministic)** theo seed cố định để kết quả lặp lại: đủ kênh (tại bàn, quầy, mang về, QR, app giao hàng), đủ phương thức thanh toán, vài đơn huỷ/ void/ tặng/ giảm giá, vài ca với chênh lệch quỹ, đỉnh giờ 11:30–13:00 và 18:00–20:00. Dữ liệu sinh ra phải đi qua **chính các hàm domain** của bước 5 và 7 (tính tiền, payment, ca) để không có số liệu mâu thuẫn.

## 9.2 Quy ước tính toán (bắt buộc)
- **Ngày kinh doanh** theo `business_day_cutoff` (04:00): đơn lúc 01:30 thuộc ngày kinh doanh hôm trước.
- **Doanh thu thuần** = tổng món − giảm giá − hoàn. **Phí dịch vụ, phụ thu, tip hiển thị riêng**, không cộng vào doanh thu thuần.
- Doanh thu theo phương thức ghi theo thời điểm `confirmed` (BR-CASH-016).
- Báo cáo ca và ngày **đối chiếu được**: tổng các ca trong ngày = tổng ngày.
- Múi giờ Asia/Ho_Chi_Minh; tiền VND không thập phân.
- Bộ lọc chung: cửa hàng, khoảng ngày kinh doanh (hôm nay, hôm qua, 7 ngày, 14 ngày, tuỳ chọn), ca, kênh, nhân viên. **Truy ngược được tới đơn** (bấm vào số hoặc dòng thì mở danh sách đơn tạo nên con số đó).
- Quyền: `report.sales.view` (Manager, Owner; Cashier chỉ ca của mình), `report.export` (xuất để Phase 2: bước này chỉ hiện nút bị vô hiệu kèm ghi chú "Sắp có"). Báo cáo lợi nhuận/ giá vốn **không** làm.
- R01 realtime (cập nhật khi đơn đổi). Các báo cáo khác có cờ "đang cập nhật" khi dữ liệu đang tính lại (mô phỏng độ trễ ngắn).

## 9.3 Danh mục báo cáo
| Mã | Báo cáo | Vai trò | Công thức / nội dung |
|---|---|---|---|
| R01 | Tổng quan hôm nay | Owner, Manager | Doanh thu, số đơn, giá trị trung bình/ đơn, đơn đang mở, bàn đang dùng. Thẻ chỉ số có so sánh với hôm qua |
| R02 | Doanh thu theo ngày/ tuần/ tháng | Owner, Manager | Σ payment `confirmed` − hoàn, theo ngày kinh doanh. Biểu đồ đường + bảng |
| R03 | Doanh thu theo phương thức thanh toán | Owner | Tiền mặt, VietQR, thẻ, ví, app giao hàng; phục vụ kê khai. Biểu đồ cột + bảng |
| R04 | Doanh thu theo kênh | Owner, Manager | Tại bàn, quầy, mang về, QR, app giao hàng |
| R05 | Báo cáo ca thu ngân | Manager, Cashier | Đầu ca, bán (theo phương thức), thu/ chi, hoàn, phải có, đếm, chênh lệch |
| R06 | Món bán chạy/ chậm | Owner, Manager | Số lượng, doanh thu, % tổng; sắp xếp tăng/ giảm |
| R07 | Đơn huỷ/ void/ tặng/ giảm giá | Owner, Manager | Theo người, lý do, giá trị; đánh dấu bất thường (vượt ngưỡng cấu hình) |
| R08 | Giờ cao điểm | Manager | Số đơn theo giờ và theo thứ trong tuần (bản đồ nhiệt hoặc cột) |
| R09 | Thời gian chế biến | Manager | `accepted → ready` trung bình/ p90 theo món và theo station |

## 9.4 Màn hình
- `/reports`: trang chủ báo cáo: R01 làm thẻ chỉ số + biểu đồ nhỏ ở đầu, danh sách R02–R09 theo nhóm (Doanh thu, Vận hành, Kiểm soát).
- Mỗi báo cáo: `PageHeader` + bộ lọc + biểu đồ (dùng `BarChart`/`LineChart` token `chart-1…6`, có chú giải/ nhãn trực tiếp, mô tả bằng văn bản cho trình đọc màn hình) + bảng chi tiết (`DataTable`, số căn phải, chữ số đều) + nút "Xem các đơn" truy ngược.
- Điện thoại: thẻ chỉ số xếp dọc, biểu đồ cuộn ngang trong khung riêng, bảng cuộn ngang trong khung riêng; web admin: lưới nhiều cột.
- Trạng thái đủ 6: đang tải (skeleton), rỗng ("Chưa có đơn trong khoảng này"), dữ liệu, lỗi, mất mạng, không đủ quyền.
- Tránh bóng đổ nặng và hoạt hình trên bảng dài; danh sách dài dùng phân trang hoặc ảo hoá.

## Tiêu chí nghiệm thu
- [ ] **R02 khớp tổng giao dịch**: tổng doanh thu 14 ngày bằng Σ payment `confirmed` − hoàn tính độc lập bằng hàm khác (thêm một kiểm tra trong `/dev/scenarios`).
- [ ] **R05 khớp** công thức chốt ca ở bước 7 và tổng các ca trong ngày = tổng ngày ở R02.
- [ ] Đơn lúc 01:30 thuộc ngày kinh doanh trước; thử đổi `business_day_cutoff` thì số liệu đổi đúng.
- [ ] Doanh thu thuần không gồm phí dịch vụ, phụ thu, tip; các khoản này hiện riêng.
- [ ] Bấm một con số bất kỳ mở đúng danh sách đơn tạo nên nó; tổng danh sách đơn = con số.
- [ ] Bộ lọc kênh, ca, nhân viên, khoảng ngày áp dụng đúng cho mọi báo cáo.
- [ ] Cashier chỉ thấy R05 của ca mình; Waiter không vào được `/reports`.
- [ ] R07 liệt kê đúng đơn huỷ/ void/ tặng/ giảm giá kèm người và lý do; đánh dấu bất thường theo ngưỡng.
- [ ] R09 dùng thời gian `accepted → ready` thực tế từ KDS.
- [ ] Mọi biểu đồ có chú giải/ nhãn trực tiếp; không phân biệt chỉ bằng màu.
- [ ] Không có báo cáo giá vốn/ lợi nhuận/ kho/ nhân sự (ngoài phạm vi Phase 1).

---

## CÁCH BÁO CÁO KHI XONG BƯỚC NÀY

Khi hoàn tất, trả lời đúng 3 phần, ngắn gọn:
1. **File đã tạo/ sửa** (danh sách, mỗi file một dòng nói mục đích).
2. **Tự kiểm tra**: chép lại từng mục trong "Tiêu chí nghiệm thu" ở trên và ghi **Đạt** hoặc **Chưa đạt (lý do)**. Không ghi Đạt nếu chưa chắc ứng dụng chạy được.
3. **Quyết định mặc định bạn đã tự chọn** ở chỗ nghiệp vụ mơ hồ, mỗi quyết định một dòng, để tôi xác nhận.

Ứng dụng phải chạy được ngay, không lỗi console, không lỗi TypeScript.
