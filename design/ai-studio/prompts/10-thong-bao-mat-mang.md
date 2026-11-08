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

# BƯỚC 10/12: THÔNG BÁO THỜI GIAN THỰC VÀ CHỊU LỖI MẠNG

## Mục tiêu bước này
Hoàn thiện hai thứ xuyên suốt: (1) thông báo và sự kiện realtime giữa các vai trò, (2) chế độ chịu lỗi khi mạng chập chờn (Phase 1 **không** làm offline hoàn toàn). Nối vào mọi bước trước qua `eventBus` và `api.ts`.

## 10.1 Sự kiện và thông báo
Nguyên tắc: realtime cho thao tác tại cửa hàng; mỗi thông báo có **loại, mức ưu tiên, người nhận (vai trò/ người/ station), hành động khi chạm**; thông báo quan trọng **có âm báo**; nhóm **bắt buộc không tắt được**; chống trùng bằng `dedupe_key`; gộp khi dồn dập.

Danh mục (người nhận, ưu tiên, nội dung):
| Sự kiện | Người nhận | Ưu tiên | Ghi chú |
|---|---|---|---|
| Round mới gửi | Station liên quan | Cao | Âm + hiện phiếu |
| Đơn QR chờ xác nhận | Waiter, Cashier | Cao | Hiện đếm số chờ |
| Món sẵn sàng | Waiter phụ trách bàn (hoặc khu vực) | Cao | Quầy: màn hình gọi số |
| Món hết / lỗi | Waiter, Manager | Cao | |
| Món bị huỷ khi bếp đã nhận | Station | Cao | Âm nổi bật |
| Khách gọi nhân viên / xin nước / tính tiền | Waiter khu vực, Cashier | Cao | Quá N phút không ai nhận thì **leo thang Manager** |
| Yêu cầu duyệt (giảm giá, void) | Manager có mặt | Cao | Hoặc nhập PIN tại chỗ |
| Payment VietQR chờ xác nhận | Cashier | Trung bình | |
| Bàn quá thời gian / bỏ quên | Manager | Thấp | |
| Chênh lệch quỹ lớn, void/ giảm giá bất thường | Owner | Cao | Theo ngưỡng cấu hình |
| Mất kết nối thiết bị / máy in | Manager | Cao | |

- Sự kiện có `event_id` và `seq` tăng theo cửa hàng. Client nhận thiếu `seq` thì **kéo bù** từ `last_seq` (mô phỏng bằng hàm `resync(lastSeq)` đọc lại từ store).
- **Phòng (rooms)** mô phỏng: `store`, `station:<id>`, `table:<id>`, `user:<id>`, `guest:<session>`. Chỉ người trong phòng nhận sự kiện.
- **Chống nhiễu**: gộp "món sẵn sàng" theo bàn trong cửa sổ **10 giây** (một thông báo "Bàn 5: 3 món sẵn sàng"); giờ yên tĩnh cho thông báo không khẩn ngoài giờ mở cửa; leo thang gọi nhân viên không ai nhận sau N phút (mặc định 3 phút) báo Manager.
- Hiển thị: thông báo trong ứng dụng (chuông có số chưa đọc, ngăn thông báo), toast ngắn cho sự kiện đến khi đang dùng, banner cho lỗi quan trọng. **Âm báo** bằng Web Audio: tối đa **hai âm khác nhau** (đơn mới/ món sẵn sàng một âm; cần hỗ trợ/ quá hạn/ lỗi một âm khác), bật/ tắt theo thiết bị và theo loại; nhóm bắt buộc (round mới, đơn QR chờ, món sẵn sàng, món hết, khách gọi, yêu cầu duyệt, mất kết nối) **không tắt được**; nút "Bật âm báo" vì trình duyệt chặn tự phát.
- Không phụ thuộc chỉ vào âm thanh và màu: luôn có chữ và icon; chỉ nháy ở bàn gọi hỗ trợ và món quá hạn, tắt khi `prefers-reduced-motion`.
- Cập nhật realtime **không làm nhảy vị trí** phần tử người dùng đang thao tác (ví dụ không đổi thứ tự thẻ bàn đúng lúc đang chạm).
- Hiển thị thời gian theo giờ máy chủ giả `now()`, không theo đồng hồ thiết bị.

## 10.2 Chế độ chịu lỗi mạng (công tắc "Giả lập mất mạng" ở công cụ demo)
Mức Phase 1 bắt buộc ("chịu lỗi"):
1. **Trạng thái kết nối** hiển thị rõ ở mọi màn hình quan trọng: `OfflineBanner` cố định đầu màn hình khi mất mạng, nêu việc vẫn làm được; không đóng được khi còn mất mạng. KDS hiện cảnh báo đỏ.
2. **Hành động ghi** (gửi order, xác nhận payment, đổi trạng thái món…) vào **hàng đợi gửi lại** có `idempotencyKey`, lưu `localStorage`. Giao diện hiển thị `SendStatus`: Đang gửi / Đã gửi / **Chưa gửi (đang chờ mạng)**. **Không bao giờ hiện "thành công" khi chưa có xác nhận từ máy chủ**; không để người dùng tưởng đã gửi.
3. **Cache** menu và sơ đồ bàn để mở được khi mất mạng; vẫn **thêm món vào giỏ cục bộ** được.
4. In phiếu bếp/ bill qua mạng LAN cục bộ vẫn chạy khi mất internet (mô phỏng: máy in "trong LAN" in được khi mất mạng, máy in "qua cloud" thì không và báo rõ).
5. **Khi mạng trở lại**: tự đồng bộ hàng đợi theo thứ tự, thử lại có lùi dần (backoff), báo kết quả, và **báo xung đột** (ví dụ món đã hết, bàn đã đóng) để người dùng quyết định, không tự ghi đè.
6. **Không mất và không trùng đơn**: gửi lại cùng `idempotencyKey` luôn trả kết quả cũ.
- Hành động nguy hiểm khi mất mạng (hoàn tiền, xác nhận VietQR cần đối chiếu) hiện cảnh báo và **vẫn vào hàng đợi** nhưng đánh dấu cần kiểm tra khi đồng bộ.
- Mất điện giữa ca: tải lại trang thì đơn mở, ca mở và phiên đăng nhập được khôi phục từ `localStorage`.

## Tiêu chí nghiệm thu
- [ ] Gửi round ở POS, phiếu xuất hiện ở KDS đúng station kèm âm; Waiter nhận "món sẵn sàng" gộp theo bàn trong 10 giây.
- [ ] Đơn QR chờ xác nhận báo đúng Waiter/ Cashier kèm số đếm; gọi nhân viên không ai nhận sau 3 phút leo thang lên Manager.
- [ ] Nhóm thông báo bắt buộc không tắt được; nhóm còn lại tắt được; chỉ có hai âm khác nhau.
- [ ] Cùng một sự kiện không tạo hai thông báo (dedupe).
- [ ] **Mất mạng 2 phút khi gửi order**: bật giả lập mất mạng, gửi một round, tắt giả lập; sau khi mạng về có **đúng một** round, không mất, không trùng. Trong lúc mất mạng trạng thái là "Chưa gửi".
- [ ] Mất mạng: banner cố định, không đóng được; vẫn thêm món vào giỏ và mở được menu, sơ đồ bàn.
- [ ] Đồng bộ lại báo xung đột (món hết, bàn đã đóng) thay vì ghi đè.
- [ ] Tải lại trang giữa chừng không mất đơn mở, ca mở, phiên đăng nhập, hàng đợi chưa gửi.
- [ ] Không có chỗ nào hiện "Đã gửi" khi chưa có xác nhận.
- [ ] Cập nhật realtime không làm thẻ bàn nhảy chỗ dưới ngón tay.

---

## CÁCH BÁO CÁO KHI XONG BƯỚC NÀY

Khi hoàn tất, trả lời đúng 3 phần, ngắn gọn:
1. **File đã tạo/ sửa** (danh sách, mỗi file một dòng nói mục đích).
2. **Tự kiểm tra**: chép lại từng mục trong "Tiêu chí nghiệm thu" ở trên và ghi **Đạt** hoặc **Chưa đạt (lý do)**. Không ghi Đạt nếu chưa chắc ứng dụng chạy được.
3. **Quyết định mặc định bạn đã tự chọn** ở chỗ nghiệp vụ mơ hồ, mỗi quyết định một dòng, để tôi xác nhận.

Ứng dụng phải chạy được ngay, không lỗi console, không lỗi TypeScript.
