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

# BƯỚC 5/12: POS VÀ QUẢN LÝ ĐƠN

## Mục tiêu bước này
Làm module POS/ Order theo **luồng A (tại bàn, nhân viên gọi món)** và **luồng C (gọi tại quầy)**, cùng mang về và nhập tay đơn app giao hàng. Thanh toán để bước 7; ở bước này nút "Thanh toán" chỉ chuyển bàn sang `needs_payment` và mở màn hình thanh toán trống ghi "Làm ở bước 7".

## 5.1 Tính tiền (`src/domain/pricing.ts`, hàm thuần, có kiểm thử trong `/dev/scenarios` ở bước 12)
`computeOrderTotals(order, storeConfig)` theo **đúng thứ tự BR-ORD-007**:
1. Tạm tính = Σ (giá snapshot + Σ giá cộng thêm option) × số lượng, bỏ qua món `cancelled`, `voided` và món "quán chịu".
2. Trừ giảm giá (dòng hoặc toàn bill; % hoặc số tiền) và món tặng giá 0.
3. Cộng phụ thu và **phí dịch vụ** (% trên tạm tính **sau giảm giá**; mặc định tắt; tắt được cho một bill nếu có quyền).
4. Thuế: giá niêm yết đã gồm VAT nên chỉ **hiển thị** phần thuế (tách ngược), không cộng thêm.
5. Làm tròn theo cấu hình (mặc định **không làm tròn**).
6. Tổng. Tiền là số nguyên VND, không bao giờ thập phân.
Trả về từng dòng riêng (tạm tính, giảm giá, phụ thu, phí dịch vụ, thuế hiển thị, làm tròn, tổng) để giao diện hiển thị rõ.

## 5.2 Quy tắc order bắt buộc
- **BR-ORD-001** Mã đơn `MMdd-nnnn` tăng dần theo cửa hàng và ngày kinh doanh; số thứ tự quầy reset mỗi ngày.
- **BR-ORD-002** Món chưa gửi: sửa/ xoá tự do. Đã gửi: thêm được; xoá phải qua huỷ có lý do.
- **BR-ORD-003** Không gửi order rỗng. Gửi lại dùng `idempotencyKey` để không trùng phiếu.
- **BR-ORD-004** Order item chụp lại snapshot tên, giá, thuế, option, station khi gửi.
- **BR-ORD-005** Huỷ món theo trạng thái:
  - `pending`/`accepted` (bếp chưa làm): Waiter huỷ được, **bắt buộc lý do**; bếp nhận thông báo; không tính tiền.
  - `preparing`/`ready`/`served`: **cần Manager duyệt bằng PIN**; chọn "khách vẫn trả" hoặc "quán chịu"; quán chịu thì ghi hao hụt và audit; item chuyển `voided`.
- **BR-ORD-006** Giảm giá theo % hoặc số tiền, theo dòng hoặc toàn bill. Trong ngưỡng (cài đặt, mặc định 10%) Cashier tự áp; **vượt ngưỡng cần Manager duyệt PIN**. Waiter không có quyền giảm giá.
- **BR-ORD-008** Phí dịch vụ tắt cho một bill cần quyền.
- **BR-ORD-009** Món tặng/ thử/ nhân viên: loại điều chỉnh "tặng" giá 0, **lý do bắt buộc**, cần quyền `order.comp` (Cashier cần PIN duyệt), báo cáo riêng.
- **BR-ORD-010** Order mở quá N giờ không hoạt động (mặc định 3 giờ) thì cảnh báo, **không tự đóng**.
- **BR-ORD-011** Đơn mang về/ app giao hàng: không bàn; có thể phụ thu bao bì; ghi tên, SĐT, **mã đơn đối tác** (GrabFood, ShopeeFood, BeFood, khác).
- **BR-ORD-012** Gọi thêm sau khi `paid`: tạo **order mới**, không mở lại order đã trả.
- **BR-ORD-013** Order `closed` cấm sửa trực tiếp, chỉ hoàn/ điều chỉnh (bước 7).
- **BR-ORD-014** Số lượng nguyên dương (trừ món thập phân).
- **BR-ORD-015** Ghi chú món tối đa 200 ký tự; có **cụm từ nhanh** ("ít đường", "không cay", "không hành", "mang đi").

Vòng đời order: `draft → submitted → in_progress → ready → served → paid → closed`; `cancelled` khi toàn bộ món huỷ trước thanh toán. `ready`/`served` **suy ra** từ các item.
Vòng đời item: `pending → accepted → preparing → ready → served`; nhánh `cancelled`, `voided`, `out_of_stock`.

## 5.3 Màn hình
**POS** (`/pos`) là lưới món + giỏ:
- **Tablet ngang**: 2 vùng. Trái: thanh danh mục + ô tìm kiếm + lưới `MenuItemCard`. Phải: giỏ hàng luôn thấy (tên bàn/ kênh, các dòng với `Stepper`, ghi chú, tạm tính, tổng cỡ lớn). Chân giỏ: nút phụ "Giảm giá", nút phụ "In tạm tính", **nút chính duy nhất "Gửi bếp"**.
- **Điện thoại**: danh sách danh mục dạng chip cuộn ngang, lưới 2 cột, thanh giỏ **cố định đáy** (số món + tổng) mở sheet giỏ hàng; nút chính "Gửi bếp" cố định đáy trong sheet. **Gửi món tối đa 3 chạm từ khi chọn bàn.**
- Chọn món có option mở `BottomSheet` (điện thoại) hoặc `Modal` (tablet): các nhóm bắt buộc đã chọn sẵn mặc định, kiểm tra `min/max`, giá cuối cập nhật ngay, ghi chú + cụm từ nhanh, số lượng. Món `sold_out` không thêm được.
- **Kênh**: chọn khi tạo đơn: Tại bàn (chọn bàn từ sơ đồ), Quầy (nhập tên hoặc số, số thứ tự trong ngày), Mang về (tên, SĐT), Đơn app giao hàng (chọn đối tác, mã đơn, tên khách).
- **Gửi bếp**: tạo `round` mới, chia món theo `station` thành các `Ticket`; item `pending`; hiện `SendStatus` (Đang gửi → Đã gửi); phát sự kiện `order.round_sent` lên eventBus (bước 6 nhận). Nút loading không nhận chạm lần hai; dùng `idempotencyKey` cho mỗi lần gửi.
- **Chi tiết đơn**: danh sách món theo round, mỗi món có pill trạng thái đúng token, thao tác theo quyền: Huỷ món (xem 5.4), nút "Đã phục vụ" khi item `ready`, thêm món, đổi bàn, giảm giá, in tạm tính.
- **Danh sách đơn** (`/orders`): lọc theo kênh, trạng thái, bàn, tìm theo mã đơn; mỗi dòng có pill; mở chi tiết.
- **Lịch sử đơn**: đơn đã `closed` ở dạng chỉ đọc (cấm sửa), thấy lịch sử huỷ/ giảm giá/ hoàn.
- **In tạm tính (bill)**: xem trước dạng khổ 58/80mm: tên quán, địa chỉ, mã đơn, bàn, giờ, các dòng với option, tạm tính, giảm giá, phụ thu, phí dịch vụ, tổng, dòng "Không phải hoá đơn VAT". In lại có dấu "IN LẠI" và ghi audit.

## 5.4 Huỷ món, giảm giá, tặng (bắt buộc đúng)
- Huỷ món **chưa gửi**: xoá ngay, không cần lý do.
- Huỷ món `pending/accepted`: `ConfirmDialog` nêu "Huỷ 1× Cà phê sữa đá. Bếp sẽ nhận thông báo huỷ.", **bắt buộc chọn lý do** (khách đổi ý, gọi nhầm, hết món, khác); Waiter làm được.
- Huỷ món `preparing/ready/served`: `ConfirmDialog` + lý do + chọn "Khách vẫn trả" hoặc "Quán chịu" + `ApprovalDialog` (PIN Manager). Người duyệt khác người yêu cầu. Ghi audit.
- Giảm giá: ô nhập % hoặc số tiền, theo dòng hoặc toàn bill; vượt ngưỡng → `ApprovalDialog`. Hiện rõ từng bước tính tiền sau khi áp.
- Tặng món: lý do bắt buộc, cần duyệt với Cashier.
- Mọi thao tác trên ghi audit (lý do, người, người duyệt, trước/ sau).

## Tiêu chí nghiệm thu
- [ ] Luồng A: chọn bàn → mở bàn → thêm món có option → Gửi bếp → thấy món ở trạng thái `pending` và ticket tách đúng station; **≤ 3 chạm** từ chọn bàn đến gửi (đếm trên điện thoại).
- [ ] Luồng C: quầy tạo order có số thứ tự trong ngày; số thứ tự reset khi sang ngày kinh doanh mới.
- [ ] Mang về và đơn app giao hàng lưu đủ trường (mã đơn đối tác, tên, SĐT).
- [ ] `computeOrderTotals` đúng thứ tự: ví dụ tạm tính 200.000, giảm 10% (20.000), phí dịch vụ 5% trên 180.000 (9.000), tổng 189.000; không làm tròn khi tắt làm tròn.
- [ ] Gửi order rỗng bị chặn; bấm Gửi nhanh nhiều lần chỉ tạo một round.
- [ ] Huỷ món theo đúng 3 mức ở BR-ORD-005; mức 3 cần PIN Manager và không cho người yêu cầu tự duyệt.
- [ ] Cashier giảm 15% bị yêu cầu PIN; giảm 8% tự áp; Waiter không thấy nút giảm giá.
- [ ] Sửa giá món ở menu sau khi gửi **không** đổi giá trong order cũ (snapshot).
- [ ] Order `closed` không sửa được trực tiếp; gọi thêm sau `paid` tạo order mới.
- [ ] Món `sold_out` không thêm được; món có trong giỏ bị hết thì bị đánh dấu, không gửi được.
- [ ] Bill xem trước đúng khổ, có dòng "Không phải hoá đơn VAT"; in lại có dấu "IN LẠI" và audit.
- [ ] Mọi màn hình đủ 6 trạng thái; vùng chạm đúng theo thiết bị.

---

## CÁCH BÁO CÁO KHI XONG BƯỚC NÀY

Khi hoàn tất, trả lời đúng 3 phần, ngắn gọn:
1. **File đã tạo/ sửa** (danh sách, mỗi file một dòng nói mục đích).
2. **Tự kiểm tra**: chép lại từng mục trong "Tiêu chí nghiệm thu" ở trên và ghi **Đạt** hoặc **Chưa đạt (lý do)**. Không ghi Đạt nếu chưa chắc ứng dụng chạy được.
3. **Quyết định mặc định bạn đã tự chọn** ở chỗ nghiệp vụ mơ hồ, mỗi quyết định một dòng, để tôi xác nhận.

Ứng dụng phải chạy được ngay, không lỗi console, không lỗi TypeScript.
