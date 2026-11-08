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
