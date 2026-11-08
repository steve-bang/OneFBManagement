# Quy tắc thiết kế giao diện

Bộ quy tắc bắt buộc khi thiết kế và dựng UI cho OneFB (POS, KDS, app điện thoại, PWA khách QR, web admin). Mọi quy tắc đều dựa trên bối cảnh quán F&B Việt Nam trong `business/01-personas-and-roles.md`, `business/02-vietnam-context.md` và `business/16-nonfunctional.md`.

> **Trạng thái**: v0.1. Mục đánh dấu [N] cần xác nhận với người trong nghề hoặc sau khi thử với người dùng thật.

## 0. Cách dùng

- Mỗi quy tắc có mã `UI-<NHÓM>-nnn` để trích dẫn trong review và ticket.
- **PHẢI** (MUST): vi phạm là lỗi, không được merge. **NÊN** (SHOULD): có thể bỏ qua nếu ghi rõ lý do trong PR.
- Token là nguồn sự thật của giá trị (màu, cỡ chữ, khoảng cách). Tài liệu này là nguồn sự thật của **cách dùng**. Bảng token và UI kit mẫu: artifact "OneFB Design Tokens" và "OneFB UI Kit" (xem mục 16).
- Khi quy tắc xung đột với một yêu cầu nghiệp vụ, nghiệp vụ thắng, và ghi ngoại lệ vào mục 15.

## 1. Nguyên tắc nền

| Mã | Nguyên tắc | Hệ quả thiết kế |
|---|---|---|
| UI-GEN-001 | **Nhanh và một tay.** Phục vụ đứng, tay kia cầm khay. | Thao tác chính trong tầm ngón cái, đáy màn hình. Không dùng cử chỉ hai ngón là cách duy nhất. |
| UI-GEN-002 | **Ít chữ, ít bước.** Nhân viên bán thời gian phải dùng được sau dưới 15 phút. | Mỗi màn hình một việc chính. Gửi món tối đa 3 chạm từ khi chọn bàn. |
| UI-GEN-003 | **Không bao giờ chỉ dựa vào màu.** Môi trường sáng chói, người dùng có thể mù màu. | Trạng thái luôn kèm nhãn chữ hoặc icon. |
| UI-GEN-004 | **Làm sai khó, sửa sai dễ.** Tiền và kho là dữ liệu thật. | Hành động nguy hiểm có xác nhận hoặc PIN. Có huỷ, hoàn tác. |
| UI-GEN-005 | **Mạng yếu phải nhìn thấy.** Wi-Fi quán chập chờn. | Luôn hiển thị trạng thái kết nối. Không để người dùng tưởng đã gửi khi chưa. |
| UI-GEN-006 | **Một thiết kế, nhiều thiết bị, theo ngữ cảnh.** | Cùng token, khác mật độ: điện thoại, tablet quầy, KDS, web. |
| UI-GEN-007 | **Quen thuộc hơn sáng tạo.** | Dùng mẫu giao diện đã có trong UI kit trước khi tạo mẫu mới. |

## 2. Token

- **UI-TOK-001 (PHẢI)** Không viết giá trị màu, cỡ chữ, khoảng cách, bo góc, bóng bằng tay trong component. Chỉ dùng token.
- **UI-TOK-002 (PHẢI)** Component chỉ dùng token **ngữ nghĩa** (`bg-surface`, `text-secondary`, `bg-action`). Không dùng thang gốc (`brand-600`, `slate-200`) trực tiếp. Ngoại lệ: minh hoạ, biểu đồ, ghi rõ trong PR.
- **UI-TOK-003 (PHẢI)** Tên token theo `loại-vai trò-trạng thái`: `bg-*`, `text-*`, `border-*`, `feedback-*`, `space-*`, `radius-*`, `shadow-*`, `z-*`.
- **UI-TOK-004 (PHẢI)** Thêm token mới theo quy trình ở mục 14. Không thêm token chỉ dùng một lần.
- **UI-TOK-005 (NÊN)** Cần giá trị chưa có thì dùng bậc gần nhất, không nội suy (`space-300` hoặc `space-400`, không `14px`).
- **UI-TOK-006 (PHẢI)** Mọi token màu có giá trị cho cả theme sáng và tối. Component không được chứa `if (dark)`.

## 3. Màu và theme

- **UI-CLR-001 (PHẢI)** Màu chính `bg-action` (blurple) chỉ dành cho **một hành động chính trên mỗi màn hình hoặc mỗi vùng**: Gửi bếp, Thanh toán, Xác nhận. Các nút còn lại là nút phụ (`sec`) hoặc `ghost`.
- **UI-CLR-002 (PHẢI)** Màu trạng thái nghiệp vụ dùng đúng bộ token, không tự chế:

| Đối tượng | Trạng thái → token |
|---|---|
| Bàn | trống `table-free` · đang phục vụ `table-occupied` · chờ thanh toán `table-payment` · đã đặt `table-reserved` · gọi hỗ trợ `table-help` |
| Món | mới `item-new` · đang làm `item-preparing` · đã xong `item-ready` · đã giao `item-served` · đã huỷ `item-cancelled` |
| Bếp chờ | đúng hạn `sla-ok` · sắp trễ `sla-warn` · quá hạn `sla-late` |
| Kết nối | mất mạng `conn-offline` |

- **UI-CLR-003 (PHẢI)** Mỗi cặp nền/chữ dùng đúng cặp `bg-X` + `text-X`, không trộn cặp.
- **UI-CLR-004 (PHẢI)** Màu đỏ (`feedback-danger`, `table-help`, `sla-late`) chỉ dùng cho lỗi, huỷ, quá hạn, cần can thiệp. Không dùng đỏ để trang trí hoặc nhấn mạnh giá.
- **UI-CLR-005 (PHẢI)** Gradient (`gradient-*`) chỉ dùng cho landing, hero, tính năng AI, bảng giá, empty state. Cấm trên bảng, form, nút, KDS, POS.
- **UI-CLR-006 (PHẢI)** Hỗ trợ cả hai theme. Theme sáng là mặc định cho điện thoại, quầy, khách, web admin. Theme tối cho KDS và quán thiếu sáng. Theme theo thiết lập hệ thống, người dùng đổi được.
- **UI-CLR-007 (NÊN)** Tối đa 3 màu nhấn trên một màn hình (gồm màu trạng thái). Quá nhiều màu thì giảm nhãn trạng thái về xám.
- **UI-CLR-008 (NÊN)** Biểu đồ dùng `chart-1…6` theo thứ tự, kèm nhãn trực tiếp hoặc chú giải. Không quá 6 chuỗi trên một biểu đồ.

## 4. Chữ, số và định dạng

- **UI-TYP-001 (PHẢI)** Font Be Vietnam Pro, dự phòng `system-ui`. Phải hiển thị đủ dấu tiếng Việt (kiểm tra "Ệ", "Ữ", "Ặ") trên Android 9 trở lên.
- **UI-TYP-002 (PHẢI)** Dùng thang chữ theo thiết bị (`admin-*`, `phone-*`, `pos-*`, `kds-*`). Không dùng cỡ khác.
- **UI-TYP-003 (PHẢI)** Nội dung chính tối thiểu 14px (web admin có thể 14px, điện thoại 15px, POS 16px, KDS 20px). Nhãn phụ tối thiểu 12px, chỉ ở web admin.
- **UI-TYP-004 (PHẢI)** Số tiền, số lượng, giờ và đồng hồ dùng chữ số đều (`font-variant-numeric: tabular-nums`), căn phải trong bảng.
- **UI-TYP-005 (PHẢI)** Hỗ trợ cỡ chữ hệ thống lớn hơn (Dynamic Type, đến 130%) trên điện thoại và PWA khách mà không cắt chữ hay che nút.
- **UI-TYP-006 (PHẢI)** Định dạng Việt Nam [N]:
  - Tiền: `45.000đ` (dấu chấm phân tách nghìn, không số thập phân), theo `business/16-nonfunctional.md`. UI kit mẫu hiện hiển thị `45.000 ₫`, cần thống nhất.
  - Ngày: `dd/MM/yyyy`. Giờ: 24 giờ `14:30`. Thời gian chờ ở bếp: `mm:ss`.
  - Số điện thoại: `0901 234 567`.
- **UI-TYP-007 (NÊN)** Một màn hình tối đa 3 cỡ chữ và 2 độ đậm. Tiêu đề căn trái, không in hoa toàn bộ trừ nhãn cột ngắn.
- **UI-TYP-008 (NÊN)** Độ dài dòng tối đa khoảng 65 ký tự cho đoạn văn (trợ giúp, mô tả).

## 5. Khoảng cách, vùng chạm, bố cục

- **UI-LAY-001 (PHẢI)** Khoảng cách dùng thang `space-100…1000` (bội số 4px). Lề màn hình: điện thoại `space-400`, tablet và web `space-600`.
- **UI-LAY-002 (PHẢI)** Vùng chạm theo thiết bị. Không nhỏ hơn mức tối thiểu của thiết bị:

| Thiết bị | Vùng chạm | Token | Ghi chú |
|---|---|---|---|
| Điện thoại (phục vụ, quản lý, chủ) | 48px | `target-comfortable` | Tối thiểu tuyệt đối 44px (`target-min`) |
| Tablet quầy (POS) | 56px | `target-pos` | Landscape 8–11" |
| KDS (bếp, bar) | 72px | `target-kds` | Tay ướt, đứng xa |
| Web admin (chuột) | 40px hàng, nút 44px | `row-compact` | Mật độ compact được phép |
| Khách QR (PWA) | 48px | `target-comfortable` | Người lớn tuổi |

- **UI-LAY-003 (PHẢI)** Hai vùng chạm cách nhau tối thiểu `space-200` (8px). Nút nguy hiểm không đặt sát nút chính.
- **UI-LAY-004 (PHẢI)** Cấu trúc theo thiết bị:
  - **Điện thoại**: một cột, điều hướng chính bằng tab đáy (tối đa 5 mục), nút hành động chính cố định đáy.
  - **Tablet POS**: landscape, 2 đến 3 vùng (menu | giỏ | thanh toán). Giỏ hàng luôn thấy khi chọn món.
  - **KDS**: lưới phiếu, không cuộn ngang. Phiếu rộng `kds-ticket-width`.
  - **Web admin**: sidebar `sidebar-width`, nội dung tối đa `content-max`.
  - **PWA khách**: một cột, nút gọi món cố định đáy, ảnh món tỉ lệ 4:3.
- **UI-LAY-005 (PHẢI)** Không có cuộn ngang ở cấp trang. Bảng rộng cuộn trong khung riêng.
- **UI-LAY-006 (PHẢI)** Tôn trọng vùng an toàn (tai thỏ, thanh điều hướng). Phần tử cố định mép màn hình cộng thêm `env(safe-area-inset-*)`.
- **UI-LAY-007 (NÊN)** Hành động thường dùng nằm nửa dưới màn hình điện thoại. Thông tin chỉ đọc nằm nửa trên.
- **UI-LAY-008 (NÊN)** Bo góc: nút và thẻ `radius-md`, modal và phiếu bếp `radius-lg`, chip và ô nhỏ `radius-sm`, pill `radius-full`. Không trộn trong cùng một nhóm.
- **UI-LAY-009 (NÊN)** Phân cấp bằng khoảng cách và viền `border-subtle` trước, bóng sau. Chỉ dùng bóng cho lớp nổi (dropdown, modal). Tablet giá rẻ hiển thị bóng kém.

## 6. Component

### 6.1 Nút
- **UI-CMP-001 (PHẢI)** Nhãn nói đúng việc sẽ xảy ra, động từ trước: "Gửi bếp", "Thanh toán 185.000đ", "Huỷ món". Cấm "OK", "Có", "Gửi" trống.
- **UI-CMP-002 (PHẢI)** Một nút chính mỗi vùng (UI-CLR-001). Nút nguy hiểm dùng `feedback-danger`, đặt xa nút chính.
- **UI-CMP-003 (PHẢI)** Nút có đủ trạng thái: mặc định, hover (web), pressed, focus, disabled, loading. Disabled phải có lý do hiển thị gần đó nếu người dùng không tự đoán được.
- **UI-CMP-004 (PHẢI)** Khi đang gửi, nút chuyển sang loading và **không nhận chạm lần hai** (tránh tạo phiếu trùng, dù API đã có `Idempotency-Key`).

### 6.2 Biểu mẫu
- **UI-CMP-010 (PHẢI)** Mỗi ô nhập có nhãn hiển thị cố định phía trên. Placeholder không thay nhãn.
- **UI-CMP-011 (PHẢI)** Lỗi nằm ngay dưới ô, nói rõ cách sửa ("Giá phải lớn hơn 0. Nhập lại số tiền bằng đồng."), kèm viền `feedback-danger` và icon, không chỉ màu.
- **UI-CMP-012 (PHẢI)** Bàn phím đúng loại: số tiền và số lượng `numeric`, số điện thoại `tel`. Đặt `autocomplete` phù hợp.
- **UI-CMP-013 (NÊN)** Kiểm tra khi rời ô hoặc khi gửi, không báo lỗi khi người dùng mới bắt đầu gõ.
- **UI-CMP-014 (NÊN)** Nhập số lượng bằng bộ tăng giảm (`step`) thay vì gõ trên POS và điện thoại.
- **UI-CMP-015 (PHẢI)** Ghi chú món (ít đá, không hành) dùng lựa chọn nhanh trước, ô gõ tự do sau.

### 6.3 Trạng thái và thẻ
- **UI-CMP-020 (PHẢI)** Trạng thái hiển thị bằng pill có chấm và nhãn chữ (UI-GEN-003). Nhãn ngắn, một đến ba từ.
- **UI-CMP-021 (PHẢI)** Thẻ bàn hiển thị tối thiểu: tên bàn, trạng thái, và (khi có) giờ ngồi, tạm tính. Bàn `table-help` nháy nhẹ kèm âm báo (mục 10).
- **UI-CMP-022 (PHẢI)** Thẻ món hết hàng vẫn hiển thị, nút Thêm bị vô hiệu và ghi "Hết hàng". Không ẩn món.
- **UI-CMP-023 (NÊN)** Mỗi thẻ có một vùng chạm chính. Không đặt nút nhỏ lồng trong thẻ cũng có thể chạm.

### 6.4 Bảng dữ liệu (web admin)
- **UI-CMP-030 (PHẢI)** Hàng cao `row-compact`, tiêu đề cột `admin-label`, số căn phải và chữ số đều.
- **UI-CMP-031 (PHẢI)** Có trạng thái loading, rỗng, lỗi (mục 8). Cột trạng thái dùng pill, không dùng chỉ màu.
- **UI-CMP-032 (NÊN)** Hỗ trợ sắp xếp, lọc theo khoảng ngày, và xuất file. Giữ bộ lọc khi quay lại từ trang chi tiết.

### 6.5 Điều hướng
- **UI-CMP-040 (PHẢI)** Mục đang chọn phải thấy bằng `bg-brand-subtle` + `text-on-brand-subtle` và `aria-current`, không chỉ đổi màu chữ.
- **UI-CMP-041 (PHẢI)** Người nhiều vai trò thấy các tab gộp và nút "đang làm với tư cách" (xem `business/01-personas-and-roles.md` mục 3). Chỉ hiện mục người dùng có quyền xem.
- **UI-CMP-042 (NÊN)** Điện thoại: tối đa 5 mục tab đáy. Nhiều hơn thì gộp vào "Khác".

### 6.6 Modal, sheet, thông báo
- **UI-CMP-050 (PHẢI)** Modal có tiêu đề nói rõ việc, nút đóng hoặc huỷ luôn thấy, đóng được bằng phím Esc và nút Back (Android).
- **UI-CMP-051 (PHẢI)** Thông báo ngắn (toast) tự biến mất sau khoảng 3 giây, nói kết quả cụ thể ("Đã gửi bếp 3 món"). Lỗi quan trọng dùng banner hoặc modal, không dùng toast.
- **UI-CMP-052 (NÊN)** Ưu tiên sheet kéo từ đáy trên điện thoại, modal giữa màn hình trên tablet và web.
- **UI-CMP-053 (PHẢI)** Thứ tự lớp theo token: `z-sticky` < `z-dropdown` < `z-modal` < `z-pin-approval` < `z-toast` < `z-offline`.

## 7. Hành động nguy hiểm và phê duyệt

Liên kết: `business/14-permissions-matrix.md`, `business/modules/01-pos-order.md` (BR-ORD-005).

- **UI-DNG-001 (PHẢI)** Hành động không hoàn tác được (huỷ món đã gửi, void, xoá, mở két không bán hàng, sửa hoá đơn đã thanh toán) phải có bước xác nhận nêu rõ **đối tượng và hậu quả**: "Huỷ 2× Phở bò tái nạm. Bếp đã nhận món."
- **UI-DNG-002 (PHẢI)** Hành động cần quyền cao hơn dùng hộp **PIN** (`z-pin-approval`), tiêu đề nói rõ việc cần duyệt, phím cao `pin-key` (80px), PIN 4 đến 6 số, chỉ hiện chấm. Ghi nhận người duyệt vào audit.
- **UI-DNG-003 (PHẢI)** Hành động huỷ hoặc void yêu cầu chọn **lý do** từ danh sách trước khi xác nhận.
- **UI-DNG-004 (PHẢI)** Nút nguy hiểm không bao giờ là nút mặc định (không phải nút được focus sẵn, không phải nút bên phải cùng).
- **UI-DNG-005 (NÊN)** Ưu tiên cho phép hoàn tác ngắn (toast có nút "Hoàn tác" trong 5 giây) cho thao tác ít rủi ro (xoá món chưa gửi), thay vì hỏi xác nhận.
- **UI-DNG-006 (PHẢI)** Khi bị chặn do thiếu quyền, nói rõ ai có quyền ("Cần quản lý duyệt") và đưa đường đi (nhập PIN quản lý), không chỉ ẩn nút.

## 8. Trạng thái của màn hình

Mỗi màn hình và mỗi danh sách PHẢI thiết kế đủ 6 trạng thái. Thiếu một trạng thái là chưa xong.

| Trạng thái | Quy tắc |
|---|---|
| Đang tải | **UI-STA-001** Khung xương (skeleton) giữ đúng bố cục, không dùng vòng quay toàn màn hình. Dữ liệu cache hiện ngay, cập nhật sau. |
| Rỗng | **UI-STA-002** Nói rõ lý do và việc nên làm tiếp, kèm một nút ("Chưa có đơn nào hôm nay. Mở bàn"). Có thể dùng gradient ở minh hoạ. |
| Có dữ liệu | Trạng thái thiết kế chính. |
| Lỗi | **UI-STA-003** Nói chuyện gì xảy ra và cách xử lý, có nút "Thử lại". Không hiển thị mã lỗi kỹ thuật cho người dùng cuối, ghi mã nhỏ ở cuối cho hỗ trợ. |
| Mất mạng | **UI-STA-004** Banner `conn-offline` cố định đầu màn hình, nội dung: mất kết nối và việc gì vẫn làm được. Không đóng được khi còn mất mạng. Hành động ghi vào hàng đợi, hiển thị rõ "chưa gửi". |
| Không đủ quyền | **UI-STA-005** Theo UI-DNG-006. |

- **UI-STA-006 (PHẢI)** Trạng thái gửi của mọi hành động ghi (order, thanh toán) có 3 mức hiển thị: đang gửi, đã gửi, chưa gửi (đang chờ mạng). Không dùng thông báo thành công khi chưa có xác nhận từ máy chủ.
- **UI-STA-007 (PHẢI)** Cập nhật thời gian thực không làm nhảy vị trí phần tử người dùng đang thao tác (ví dụ thẻ bàn đổi thứ tự đúng lúc đang chạm).

## 9. Thiết bị chuyên biệt

### 9.1 KDS (bếp, bar)
- **UI-KDS-001 (PHẢI)** Chữ tối thiểu 20px nội dung, 28px số bàn, 32px đồng hồ. Đọc được ở khoảng cách 1,5 m.
- **UI-KDS-002 (PHẢI)** Màu đầu phiếu theo thời gian chờ (`sla-ok/warn/late`), ngưỡng cấu hình theo station (mặc định 5 phút và 10 phút [N]).
- **UI-KDS-003 (PHẢI)** Nút thao tác cao `target-kds`, một chạm cho "Xong món". Không dùng cử chỉ vuốt là cách duy nhất.
- **UI-KDS-004 (PHẢI)** Món bị huỷ hiển thị nổi bật (`item-cancelled`) và yêu cầu bếp xác nhận đã dừng (BR-KIT-008).
- **UI-KDS-005 (PHẢI)** Mặc định theme tối, tắt tự khoá màn hình, hiển thị cảnh báo đỏ khi mất kết nối.
- **UI-KDS-006 (NÊN)** Có chế độ tương phản cao khi ánh sáng bếp gắt [N].

### 9.2 POS quầy
- **UI-POS-001 (PHẢI)** Thêm món phản hồi tức thì (dưới 100ms, theo NFR). Cập nhật giỏ và tổng tiền cục bộ trước, đồng bộ sau.
- **UI-POS-002 (PHẢI)** Tổng thanh toán luôn thấy ở vùng thanh toán, cỡ `pos-display`. Hiển thị rõ giảm giá, phụ thu, phí dịch vụ thành các dòng riêng.
- **UI-POS-003 (PHẢI)** Màn hình thanh toán chỉ hiện các hình thức quán bật (tiền mặt, chuyển khoản/QR, thẻ…). Ghi nhận "đã đối chiếu" cho chuyển khoản (xem `business/02-vietnam-context.md`).

### 9.3 PWA khách quét QR
- **UI-QR-001 (PHẢI)** Không bắt cài app, không bắt đăng ký trước khi gọi món.
- **UI-QR-002 (PHẢI)** Tải lần đầu dưới 3 giây trên 4G, dung lượng khởi tạo dưới 1 MB (không tính ảnh). Ảnh món nạp lười, có khung giữ chỗ tỉ lệ 4:3.
- **UI-QR-003 (PHẢI)** Hỗ trợ tiếng Việt và tiếng Anh. Không đặt chiều rộng cố định cho nhãn (tiếng Anh dài hơn khoảng 30%).
- **UI-QR-004 (PHẢI)** Vùng chạm 48px trở lên, chữ nội dung 16px trở lên (người lớn tuổi).
- **UI-QR-005 (NÊN)** Hiển thị trạng thái đơn của khách (đã nhận, đang làm, đã xong) bằng nhãn chữ và icon.

## 10. Chuyển động, âm thanh, thời gian thực

- **UI-RT-001 (PHẢI)** Thời lượng chuyển động: nhanh 120ms (nhấn nút, đổi tab), cơ bản 200ms (mở sheet, đổi trạng thái), chậm 320ms (modal, chuyển màn hình). Easing `ease-out`.
- **UI-RT-002 (PHẢI)** Tôn trọng `prefers-reduced-motion`: tắt nháy và chuyển động trang trí.
- **UI-RT-003 (PHẢI)** Chỉ nháy cho hai trường hợp cần can thiệp: bàn gọi hỗ trợ (`table-help`) và món quá hạn (`sla-late`). Nháy kèm âm báo vì bếp ồn, nhưng không phụ thuộc vào âm báo.
- **UI-RT-004 (PHẢI)** Âm báo có thể bật/tắt theo thiết bị và theo loại sự kiện. Tối đa 2 âm khác nhau (đơn mới, cần hỗ trợ) để dễ phân biệt. Xem `business/13-notifications-and-realtime.md`.
- **UI-RT-005 (NÊN)** Không dùng chuyển động chỉ để trang trí trên POS, KDS.

## 11. Nội dung và văn phong giao diện

- **UI-TXT-001 (PHẢI)** Tiếng Việt chính, giản dị, xưng hô trung tính. Gọi tên theo cách người dùng quen: "bàn", "phiếu bếp", "chốt ca", "thu ngân", không dùng thuật ngữ hệ thống ("order round", "payload").
- **UI-TXT-002 (PHẢI)** Câu chủ động, ngắn. Lỗi nói rõ chuyện gì xảy ra và cách sửa, không xin lỗi chung chung và không đổ lỗi cho người dùng.
- **UI-TXT-003 (PHẢI)** Dùng nhất quán một tên cho một khái niệm trên mọi thiết bị. Từ điển ở `business/00-glossary.md`.
- **UI-TXT-004 (NÊN)** Không dùng emoji để thay icon hoặc làm đầu mục. Icon dùng bộ SVG thống nhất, nét 2px, kèm nhãn khi nghĩa không rõ.
- **UI-TXT-005 (NÊN)** Tên nút và nhãn tối đa 3 đến 4 từ trên điện thoại.
- **UI-TXT-006 (NÊN)** Không dùng in hoa toàn bộ cho câu. Chỉ dùng cho số bàn trên KDS và nhãn cột ngắn.

## 12. Khả năng tiếp cận

Mục tiêu: **WCAG 2.2 mức AA**.

- **UI-A11Y-001 (PHẢI)** Tương phản chữ thường đạt 4.5:1, chữ lớn (từ 24px, hoặc 18,66px đậm) đạt 3:1, viền ô nhập, icon, vòng focus đạt 3:1, ở **cả hai theme**. Mọi cặp `bg-X` / `text-X` trong bộ token đã được kiểm tra.
- **UI-A11Y-002 (PHẢI)** Mọi phần tử tương tác có vòng focus `focus-ring` 2px, cách phần tử 2px, thấy được ở cả hai theme. Không dùng `outline: none` mà không thay thế.
- **UI-A11Y-003 (PHẢI)** Thao tác bằng bàn phím được trên web (POS có bàn phím rời, web admin): thứ tự Tab hợp lý, Enter/Space kích hoạt, Esc đóng.
- **UI-A11Y-004 (PHẢI)** Phần tử không có chữ (nút icon) có nhãn truy cập (`aria-label` hoặc `accessibilityLabel`). Trạng thái dùng thuộc tính chuẩn (`aria-pressed`, `aria-checked`, `aria-current`, `aria-invalid`).
- **UI-A11Y-005 (PHẢI)** Không truyền thông tin chỉ bằng màu, hình dạng hoặc âm thanh (UI-GEN-003, UI-RT-003).
- **UI-A11Y-006 (PHẢI)** Cập nhật động quan trọng (đơn mới, mất mạng, lỗi) được thông báo cho trình đọc màn hình bằng vùng `aria-live`.
- **UI-A11Y-007 (PHẢI)** Hỗ trợ phóng to chữ (UI-TYP-005) và định hướng ngang/dọc không mất chức năng (ngoại lệ: POS, KDS khoá landscape).
- **UI-A11Y-008 (NÊN)** Kiểm tra bằng trình đọc màn hình (TalkBack, VoiceOver) cho luồng khách QR và luồng thanh toán mỗi phiên bản.

## 13. Hiệu năng của giao diện

- **UI-PERF-001 (PHẢI)** Mở POS và tải menu dưới 2 giây từ cache. Thao tác thêm món phản hồi dưới 100ms.
- **UI-PERF-002 (PHẢI)** Sơ đồ bàn và phiếu bếp cập nhật dưới 2 giây từ khi sự kiện phát ra.
- **UI-PERF-003 (PHẢI)** Danh sách dài (menu, hoá đơn, báo cáo) dùng ảo hoá hoặc phân trang. Không render hàng nghìn phần tử.
- **UI-PERF-004 (NÊN)** Thiết kế cho điện thoại Android tầm trung: tránh bóng nhiều lớp, mờ nền (blur), và hoạt hình trên danh sách dài.
- **UI-PERF-005 (NÊN)** Ảnh món nén và có kích thước theo thiết bị, định dạng hiện đại (WebP/AVIF) cho PWA.

## 14. Quy trình thiết kế và giao việc

### 14.1 Thêm hoặc đổi token
1. Kiểm tra token hiện có đã đáp ứng chưa (UI-TOK-005).
2. Thêm vào thang gốc nếu là màu mới, rồi tạo token ngữ nghĩa trỏ về thang gốc, có giá trị cho cả hai theme.
3. Chạy kiểm tra tương phản cho mọi cặp bị ảnh hưởng (UI-A11Y-001).
4. Cập nhật bảng token, UI kit và ghi vào lịch sử thay đổi.

### 14.2 Checklist trước khi giao thiết kế (Definition of Ready)
- [ ] Dùng đúng thiết bị đích và đúng thang chữ, vùng chạm của thiết bị.
- [ ] Chỉ dùng token ngữ nghĩa, không có giá trị thô.
- [ ] Một nút chính mỗi vùng.
- [ ] Đủ 6 trạng thái màn hình (mục 8).
- [ ] Trạng thái nghiệp vụ dùng đúng bộ token, kèm nhãn.
- [ ] Hành động nguy hiểm có xác nhận hoặc PIN, có lý do, nêu hậu quả.
- [ ] Đã vẽ cho cả theme sáng và tối.
- [ ] Đã vẽ tình huống chữ dài (tên món dài, tiếng Anh, chữ phóng to).
- [ ] Nội dung giao diện đã duyệt theo mục 11.
- [ ] Đã xét vai trò và quyền: ai thấy, ai bấm được (`business/14-permissions-matrix.md`).

### 14.3 Checklist trước khi merge UI (Definition of Done)
- [ ] Không có màu, cỡ chữ, khoảng cách viết tay.
- [ ] Vùng chạm đạt mức của thiết bị (đo trên máy thật, không chỉ trình giả lập).
- [ ] Tương phản đạt ở hai theme; focus thấy được.
- [ ] Thử mất mạng: banner, hàng đợi, trạng thái "chưa gửi" hoạt động.
- [ ] Thử với cỡ chữ lớn và màn hình nhỏ nhất được hỗ trợ.
- [ ] Thử trên Android tầm trung, tablet 8" và (nếu có KDS) màn hình xa.
- [ ] Nút chính không nhận chạm hai lần khi đang gửi.
- [ ] Nhãn truy cập và `aria-*` có đủ.

### 14.4 Review thiết kế
- Người thiết kế tự duyệt theo 14.2 trước khi gửi.
- Người duyệt kiểm tra theo 14.3 trên bản chạy thật.
- Lỗi vi phạm PHẢI chặn merge. Vi phạm NÊN ghi lý do trong PR.

## 15. Ngoại lệ đã chấp nhận

Ghi tại đây mọi trường hợp bỏ qua quy tắc, kèm lý do và ngày.

| Ngày | Quy tắc | Ngoại lệ | Lý do |
|---|---|---|---|
| (trống) | | | |

## 16. Tài liệu liên quan

- Bảng token và component xem trực tiếp: artifact "OneFB Design Tokens" (token, README, ví dụ nút, thẻ bàn, phiếu bếp, bàn phím PIN, thẻ chỉ số) và "OneFB UI Kit" (bộ giao diện tương tác).
- `business/01-personas-and-roles.md`: vai trò và thiết bị.
- `business/13-notifications-and-realtime.md`: âm báo và sự kiện.
- `business/14-permissions-matrix.md`: ma trận quyền.
- `business/16-nonfunctional.md`: hiệu năng, thiết bị, khả dụng.
- `business/00-glossary.md`: thuật ngữ.

## 17. Câu hỏi mở [N]

1. Định dạng tiền: `45.000đ` (theo NFR) hay `45.000 ₫`? Cần thống nhất giữa tài liệu, UI kit và bản token.
2. Ngưỡng 5 phút và 10 phút của phiếu bếp có đúng với thực tế quán? Có cần cấu hình theo từng món hay station?
3. Có cần chế độ tương phản cao cho KDS ngay từ Phase 1?
4. Số lần chạm tối đa để gửi món (UI-GEN-002): 3 chạm có khả thi với menu nhiều option?
5. Bộ icon chính thức (đang dùng bộ SVG tự vẽ trong UI kit).
