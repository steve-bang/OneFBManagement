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

# BƯỚC 8/12: KHÁCH GỌI MÓN QUA QR (PWA)

## Mục tiêu bước này
Làm trải nghiệm khách tự gọi món (luồng B) trên điện thoại, và màn hình nhân viên xác nhận đơn QR. Giao diện khách **không dùng khung thiết bị và điều hướng của nhân viên**: là một ứng dụng độc lập ở route `#/qr`, chạy ở độ rộng điện thoại thật, nhẹ, không cần cài.

## 8.1 Quy tắc bắt buộc
- **BR-QR-001** URL `#/qr?t=<token>`; token ký, gắn `storeId + tableId + version` (mô phỏng chữ ký bằng hàm băm đơn giản, ghi chú rõ là mô phỏng). Token sai hoặc hết hạn (QR cũ sau khi xoay) → **trang lỗi thân thiện** ("Mã QR này không còn dùng được. Vui lòng nhờ nhân viên giúp").
- **BR-QR-002** Chế độ nhận đơn QR theo cài đặt cửa hàng: (a) **cần nhân viên xác nhận** (mặc định), (b) tự động nhận.
- **BR-QR-003** Chỉ gọi được khi bàn **đang mở**, hoặc cửa hàng bật "khách tự mở bàn". Bàn chưa mở: tạo **yêu cầu mở bàn** cho nhân viên và báo khách chờ.
- **BR-QR-004** Nhiều khách một bàn **dùng chung một order**; mỗi item ghi `guestSessionId`. Mỗi người chỉ huỷ được **món chưa được nhận** của chính mình.
- **BR-QR-005** Chống lạm dụng: giới hạn tần suất (5 round/ 10 phút), giới hạn số món mỗi lượt (tối đa 20), chặn phiên bàn đã đóng, token xoay được. Khi chạm giới hạn: thông báo rõ và hướng dẫn.
- **BR-QR-006** Món hết/ ngừng bán cập nhật ngay; món đã nằm trong giỏ bị đánh dấu "Hết hàng" và **không gửi được**.
- **BR-QR-007** Giá hiển thị là giá hiện tại; khi gửi, server tính lại và **báo nếu giá thay đổi** (cho khách xác nhận lại).
- **BR-QR-008** Khách **không thấy** giảm giá thủ công của nhân viên; chỉ thấy tổng tạm tính do server tính.
- **BR-QR-009** Thanh toán QR: hiện mã VietQR theo tổng bill (mô phỏng, ghi rõ minh hoạ); khi khách bấm "Tôi đã chuyển" thì trạng thái `awaiting_confirmation` **cho tới khi thu ngân xác nhận**. Có lựa chọn "Gọi nhân viên tính tiền".
- **BR-QR-010** Số điện thoại chỉ thu khi khách **chọn tích điểm**, kèm ô đồng ý **không tick sẵn**, không bắt buộc để gọi món.
- **BR-QR-011** Hỗ trợ **tiếng Việt và tiếng Anh** (chuyển nhanh ở đầu trang, nhớ lựa chọn); chữ lớn, thao tác một tay. Không đặt chiều rộng cố định cho nhãn (tiếng Anh dài hơn ~30%).
- **BR-QR-012** Khách **không huỷ** được món bếp đã nhận; chỉ có nút "Nhờ nhân viên huỷ" (tạo yêu cầu).
- **BR-QR-013** Nhẹ: ảnh nén, tải lười, khung giữ chỗ tỉ lệ 4:3, giỏ lưu cục bộ, menu cache; dung lượng khởi tạo mục tiêu dưới 1 MB (không tính ảnh). Thêm `manifest` PWA cơ bản.

Vòng đời đơn QR: `cart → awaiting_staff_confirm → submitted` (như order thường), hoặc `rejected` (nhân viên từ chối, có lý do hiện cho khách).

## 8.2 Màn hình khách
Thiết kế **một cột**, vùng chạm ≥ 48px, chữ nội dung ≥ 16px, nút hành động chính cố định đáy:
1. **Trang chủ quán**: tên quán, số bàn, chuyển ngôn ngữ, nút "Xem thực đơn", nút "Gọi nhân viên".
2. **Menu và tìm kiếm**: chip danh mục cuộn ngang, ô tìm kiếm, danh sách món có ảnh 4:3 (giữ chỗ), tên, giá, mô tả ngắn; món hết hàng vẫn hiện nhưng nút Thêm vô hiệu.
3. **Chi tiết món + option**: BottomSheet với nhóm tuỳ chọn (mặc định đã chọn), ghi chú, số lượng, giá cập nhật ngay, nút chính "Thêm vào giỏ".
4. **Giỏ hàng**: thanh giỏ cố định đáy → sheet giỏ: danh sách, `Stepper`, ghi chú, tạm tính, nút chính "Gửi cho quán". Hiện rõ khi đang chờ nhân viên xác nhận.
5. **Theo dõi đơn**: trạng thái từng món bằng **pill chữ + icon** (Đã nhận, Đang làm, Đã xong, Đã giao, Hết món, Từ chối + lý do); cập nhật thời gian thực từ eventBus.
6. **Gọi nhân viên**: nút nhanh "Gọi nhân viên", "Xin nước", "Tính tiền"; sau khi gọi hiện trạng thái "Đã báo nhân viên" và chống bấm liên tiếp.
7. **Thanh toán**: tổng tiền, VietQR minh hoạ, nút "Tôi đã chuyển" → màn hình "Đang chờ thu ngân xác nhận"; hoặc "Gọi nhân viên tính tiền".
8. **Đánh giá** (tuỳ chọn): 1–5 sao + nhận xét ngắn; hỏi SĐT tích điểm kèm ô đồng ý không tick sẵn.
- Mọi màn hình khách: đủ trạng thái tải (skeleton), lỗi (có "Thử lại"), mất mạng (banner, giỏ vẫn dùng được cục bộ), trang lỗi token.

## 8.3 Màn hình nhân viên cho đơn QR (`/orders` có tab "Đơn QR chờ xác nhận")
- Danh sách **đơn QR chờ xác nhận** kèm đếm số chờ và âm báo khi có đơn mới.
- Mỗi đơn: bàn, các món (ghi người gọi nếu nhiều khách), tổng; nút chính **"Xác nhận"** (chuyển `submitted`, xuống bếp như order thường) và nút phụ **"Từ chối"** (bắt buộc lý do, hiện cho khách).
- Nếu chế độ "tự động nhận" bật thì đơn vào thẳng bếp nhưng vẫn hiện trong danh sách để theo dõi.
- Yêu cầu mở bàn, yêu cầu gọi nhân viên, yêu cầu huỷ món, thông báo khách báo "đã chuyển khoản" xuất hiện ở đây và ở `/notifications`; chỉ người có `qr.order.confirm` xác nhận.
- Có **nút giả lập khách** trong công cụ demo: mở `#/qr?t=<token bàn đang chọn>` ở khung điện thoại bên cạnh, để thử đầy đủ luồng không cần quét thật.

## Tiêu chí nghiệm thu
- [ ] Mở `#/qr?t=<token hợp lệ>` thấy menu của đúng quán và đúng bàn; token sai hoặc đã xoay → trang lỗi thân thiện.
- [ ] Gửi đơn ở chế độ cần xác nhận: đơn vào "Đơn QR chờ xác nhận" kèm âm báo; sau khi nhân viên xác nhận mới xuống bếp; từ chối có lý do và khách thấy lý do.
- [ ] Hai phiên khách khác nhau cùng bàn dùng chung một order; mỗi người chỉ huỷ được món chưa nhận của mình; món bếp đã nhận chỉ có nút "Nhờ nhân viên huỷ".
- [ ] Gửi quá 5 round trong 10 phút bị chặn kèm thông báo rõ.
- [ ] Món vừa hết ở bếp: khách thấy đánh dấu ngay, không gửi được.
- [ ] Đổi giá món sau khi khách thêm vào giỏ: khi gửi, khách được báo giá thay đổi.
- [ ] Khách không thấy giảm giá thủ công của nhân viên.
- [ ] VietQR: "Tôi đã chuyển" → `awaiting_confirmation` cho tới khi thu ngân xác nhận (bước 7).
- [ ] SĐT chỉ hỏi khi khách chọn tích điểm; ô đồng ý không tick sẵn; gọi món không cần SĐT.
- [ ] Chuyển Việt/ Anh không vỡ bố cục; có tên tiếng Anh cho món đã nhập.
- [ ] Bàn chưa mở: khách thấy "yêu cầu mở bàn" và chờ nhân viên.
- [ ] Vùng chạm ≥ 48px, chữ ≥ 16px; nút chính cố định đáy; không cuộn ngang.

---

## CÁCH BÁO CÁO KHI XONG BƯỚC NÀY

Khi hoàn tất, trả lời đúng 3 phần, ngắn gọn:
1. **File đã tạo/ sửa** (danh sách, mỗi file một dòng nói mục đích).
2. **Tự kiểm tra**: chép lại từng mục trong "Tiêu chí nghiệm thu" ở trên và ghi **Đạt** hoặc **Chưa đạt (lý do)**. Không ghi Đạt nếu chưa chắc ứng dụng chạy được.
3. **Quyết định mặc định bạn đã tự chọn** ở chỗ nghiệp vụ mơ hồ, mỗi quyết định một dòng, để tôi xác nhận.

Ứng dụng phải chạy được ngay, không lỗi console, không lỗi TypeScript.
