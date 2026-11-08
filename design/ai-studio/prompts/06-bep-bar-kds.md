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

# BƯỚC 6/12: BẾP / BAR (KDS), PHIẾU IN VÀ TEM LY

## Mục tiêu bước này
Làm màn hình KDS cho bếp và bar, hiển thị gọi số ở quầy, màn hình giao món cho Waiter/ Cashier, phiếu in và tem ly. Nối với order đã gửi ở bước 5 qua `eventBus`.

## 6.1 Quy tắc bắt buộc
- **BR-KIT-001** Phân tuyến theo `product.station`; một ticket thuộc một station; một round có thể sinh nhiều ticket.
- **BR-KIT-002** Hàng đợi theo thứ tự gửi; món **ưu tiên (rush)** do Manager/ Waiter đánh dấu được đẩy lên đầu.
- **BR-KIT-003** Hiển thị: bàn/ số, món, option nổi bật, **ghi chú màu đỏ**, thời gian chờ đổi màu theo ngưỡng: đúng hạn (`sla-ok`) dưới 10 phút, sắp trễ (`sla-warn`) từ 10 phút, quá hạn (`sla-late`) từ 15 phút. Ngưỡng lấy từ cài đặt cửa hàng.
- **BR-KIT-004** Station có thể bật **tự nhận** (bỏ bước accept); mặc định **bật** ở Phase 1 để ít thao tác. Khi tắt: món `pending → accepted` bằng một nút "Nhận".
- **BR-KIT-006** Báo hết nguyên liệu: chọn món/ option → đặt `sold_out` → các order đang chờ có món đó chuyển `out_of_stock` và **báo Waiter**; không tự huỷ cho tới khi Waiter xử lý.
- **BR-KIT-007** Làm hỏng/ làm lại: tạo item bù giá 0, ghi hao hụt, **lý do bắt buộc** ("làm sai", "rơi vỡ", "khách trả lại").
- **BR-KIT-008** Huỷ món khi bếp đã nhận: bếp thấy **cảnh báo huỷ nổi bật** (`item-cancelled`), phải **xác nhận đã dừng**; nếu đã nấu xong thì ghi hao hụt theo quyết định ở BR-ORD-005.
- **BR-KIT-009** In: phiếu bếp theo station (khổ 58/80mm) gồm bàn, giờ, người gọi, món, option, ghi chú; **tem ly** một tem cho mỗi ly đồ uống (tên món, option, số thứ tự hoặc tên khách).
- **BR-KIT-010** In lại có dấu "IN LẠI" và ghi log.
- **BR-KIT-011** Lưu thời gian chế biến thực tế (`accepted → ready`) để báo cáo R09.
- **BR-KIT-012** Một Kitchen user gắn một hoặc nhiều station, **chỉ thấy station của mình**.

Vòng đời item: `pending → accepted → preparing → ready → served`; nhánh `out_of_stock | cancelled | voided`. Ticket: `open → done`.

## 6.2 Màn hình KDS (`/kitchen`) — thiết bị KDS, theme tối mặc định
- Ba cột: **Mới / Đang làm / Xong**. Mỗi phiếu là một thẻ rộng ~260px: đầu phiếu có **số bàn** (28/36, 700) và **đồng hồ** `mm:ss` (32/40, 700) đổi màu theo `sla-*`; dưới là các dòng món 20/28 với option và ghi chú đỏ; chân phiếu là nút lớn **"Xong món"** cao 72px (một chạm, không phụ thuộc cử chỉ vuốt).
- Đồng hồ chạy thật mỗi giây từ `now()`.
- Phiếu `sla-late` nháy nhẹ kèm âm báo (tắt khi `prefers-reduced-motion`; vẫn hiện nhãn "Quá hạn"). Phiếu mới phát âm báo (xem bước 10 để tinh chỉnh; bước này dùng một âm đơn giản bằng Web Audio, người dùng bật âm bằng một nút "Bật âm báo" vì trình duyệt chặn tự phát).
- Đầu màn hình: tên station, số phiếu đang chờ (cỡ lớn), nút chuyển station (nếu người dùng có nhiều station), công tắc tự nhận, trạng thái kết nối. Cảnh báo đỏ `OfflineBanner` khi mất mạng.
- Thao tác trên món: Nhận (nếu tự nhận tắt), Bắt đầu, Xong, **Hết món** (chọn món/ option → xác nhận hậu quả), **Làm lại** (bắt buộc chọn lý do), đánh dấu **ưu tiên** (nút cho Manager/ Waiter).
- Phiếu có món bị huỷ: hiện dải cảnh báo nổi bật, món bị gạch, nút "Đã dừng" bắt buộc bấm mới biến mất.
- Lịch sử phiếu trong ngày (đã xong), in lại phiếu/ tem (có dấu "IN LẠI", ghi log).
- Cài đặt station (Manager): tên station, ngưỡng cảnh báo, tự nhận, máy in gắn với station.
- Kitchen/ Bartender **chỉ thấy station của mình**; Manager/ Owner xem được mọi station.

## 6.3 Quầy: gọi số và giao món
- **Màn hình gọi số** (route con `/kitchen/call`): danh sách số hoặc tên khách có ly **đã xong** (`ready`), cỡ chữ rất lớn, cho TV; số mới hiện đầu danh sách.
- **Giao món** cho Waiter/ Cashier: khi item `ready`, người phụ trách bàn nhận thông báo "Món sẵn sàng" (gộp theo bàn trong 10 giây); nút **"Đã phục vụ"** chuyển item `served`; khi mọi món `served` thì order suy ra `served`. Với đơn quầy: giao ly → `served` → có thể `closed` sau khi đã thanh toán (bước 7).
- Waiter nhận thông báo món hết (`out_of_stock`): chọn **đổi món** hoặc **huỷ không tính tiền**; menu tự đánh dấu hết.

## 6.4 Phiếu in và tem ly (xem trước, mô phỏng máy in)
- **Phiếu bếp** theo station, khổ chọn 58 hoặc 80mm: bàn/ số, giờ, người gọi, từng món với option và ghi chú in đậm, dấu "IN LẠI" nếu in lại.
- **Tem ly** (khổ tem nhỏ): mỗi ly một tem: tên món, size/ đường/ đá/ topping, số thứ tự hoặc tên khách, giờ.
- Tự động "in" (xem trước hiện trong ngăn thông báo nhỏ) khi gửi hoặc khi nhận theo cài đặt station. Thất bại in (mô phỏng "hết giấy") báo Manager và **KDS vẫn tiếp tục**.

## Tiêu chí nghiệm thu
- [ ] Gửi round ở POS thì phiếu hiện đúng station, đúng cột "Mới", có âm báo sau khi bật âm.
- [ ] Đồng hồ chạy thật; phiếu đổi `sla-ok → sla-warn` ở 10 phút và `sla-late` ở 15 phút (kiểm tra bằng cách đổi ngưỡng trong cài đặt xuống 1 và 2 phút).
- [ ] Với tự nhận bật: món vào thẳng "Đang làm". Tắt tự nhận: có nút Nhận.
- [ ] "Xong món" một chạm chuyển món sang `ready` và Waiter nhận thông báo đúng bàn; "Đã phục vụ" chuyển `served`.
- [ ] Hết món: món chuyển `out_of_stock`, Waiter được báo, menu đánh dấu `sold_out`, đơn không tự huỷ.
- [ ] Làm lại bắt buộc lý do, tạo item bù giá 0 và ghi hao hụt.
- [ ] Huỷ món khi bếp đã nhận: cảnh báo nổi bật, phiếu chỉ biến mất sau khi bấm "Đã dừng".
- [ ] Kitchen chỉ thấy station của mình; Manager thấy mọi station.
- [ ] Phiếu in và tem ly xem trước đúng khổ 58/80mm; in lại có dấu "IN LẠI" và ghi log.
- [ ] Mất mạng: KDS hiện cảnh báo đỏ cố định, không đóng được.
- [ ] Chữ ≥ 20px, nút thao tác ≥ 72px, không có thao tác nào chỉ làm được bằng vuốt.
- [ ] Màn hình gọi số hiện số của ly đã xong, cỡ chữ lớn.

---

## CÁCH BÁO CÁO KHI XONG BƯỚC NÀY

Khi hoàn tất, trả lời đúng 3 phần, ngắn gọn:
1. **File đã tạo/ sửa** (danh sách, mỗi file một dòng nói mục đích).
2. **Tự kiểm tra**: chép lại từng mục trong "Tiêu chí nghiệm thu" ở trên và ghi **Đạt** hoặc **Chưa đạt (lý do)**. Không ghi Đạt nếu chưa chắc ứng dụng chạy được.
3. **Quyết định mặc định bạn đã tự chọn** ở chỗ nghiệp vụ mơ hồ, mỗi quyết định một dòng, để tôi xác nhận.

Ứng dụng phải chạy được ngay, không lỗi console, không lỗi TypeScript.
