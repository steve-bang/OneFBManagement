# Luồng nghiệp vụ xuyên suốt

Ba kịch bản vận hành chuẩn. Mỗi bước nêu **actor**, **hành động**, **kết quả hệ thống**, **sự kiện phát ra**.

## Luồng A. Ăn tại bàn, nhân viên gọi món (quán ăn)

| # | Actor | Hành động | Hệ thống |
|---|---|---|---|
| 1 | Khách vào | Phục vụ chọn bàn trống trên sơ đồ, nhập số khách | Tạo `table_session`, bàn -> `occupied` |
| 2 | Phục vụ | Chọn món, tuỳ chọn, ghi chú ("không hành"), bấm Gửi | Tạo `order` (nếu chưa có) + `round 1`; item -> `pending` |
| 3 | Hệ thống | Tách món theo station | Tạo ticket cho Bếp nóng, Bar...; in phiếu hoặc hiện KDS; `order.round_sent` |
| 4 | Bếp | Nhận, đang làm, xong | item `accepted -> preparing -> ready`; `order_item.status_changed` |
| 5 | Phục vụ | Nhận thông báo "món sẵn sàng" -> mang ra -> bấm Đã phục vụ | item `served` |
| 6 | Khách | Gọi thêm | round 2 lặp bước 2-5 |
| 7 | Khách | Xin tính tiền | Phục vụ bấm "Yêu cầu thanh toán"; bàn -> `needs_payment`; thu ngân thấy bill |
| 8 | Thu ngân | Mở order -> kiểm tra -> áp khuyến mãi (nếu có) -> in bill tạm tính | Khoá thêm món (hoặc cảnh báo) |
| 9 | Thu ngân | Chọn phương thức: tiền mặt / VietQR / kết hợp | Tạo `payment`; VietQR hiển thị mã động |
| 10 | Thu ngân | Nhận tiền -> xác nhận | `payment.confirmed`; order -> `paid` |
| 11 | Hệ thống | Hậu xử lý | Ghi doanh thu vào ca thu ngân, trừ kho theo định lượng, cộng điểm (nếu có), audit |
| 12 | Phục vụ | Dọn bàn | Bàn `cleaning -> available`; kết thúc phiên |

## Luồng B. Khách tự gọi qua QR (tại bàn)

| # | Actor | Hành động | Hệ thống |
|---|---|---|---|
| 1 | Khách | Quét QR bàn | Mở PWA, nhận diện store+bàn, tạo/lấy phiên khách (cookie) |
| 2 | Khách | Xem menu, chọn món, giỏ hàng, bấm Gửi | Order `submitted_by=customer`; trạng thái chờ xác nhận (xem BR-QR) |
| 3 | Phục vụ/Thu ngân | Nhận thông báo đơn QR mới, xác nhận hoặc tự động nhận (cấu hình) | Chuyển xuống bếp |
| 4 | Bếp -> Phục vụ | Như luồng A bước 4-5 | Khách thấy trạng thái trên PWA |
| 5 | Khách | Bấm "Thanh toán" | Hiện VietQR + tổng tiền, hoặc "Gọi nhân viên tính tiền" |
| 6 | Thu ngân | Xác nhận đã nhận | Như luồng A bước 10-12 |

Điểm khác biệt: không có nhân viên chạm vào lúc gọi món, nên cần **cơ chế chống lạm dụng** (rate limit, xác nhận bởi nhân viên, kiểm tra bàn đang mở).

## Luồng C. Gọi tại quầy (trà sữa, cà phê take-away)

| # | Actor | Hành động | Hệ thống |
|---|---|---|---|
| 1 | Thu ngân | Chọn món (size, đường, đá, topping), nhập tên/số | Order `channel=counter`, số thứ tự trong ngày |
| 2 | Thu ngân | Thanh toán ngay (tiền mặt/VietQR) | `payment.confirmed` |
| 3 | Hệ thống | Gửi pha chế | In **tem ly** theo từng ly, hiện trên KDS bar |
| 4 | Pha chế | Làm xong -> dán tem -> bấm Xong | item `ready`; màn hình gọi số/tên |
| 5 | Thu ngân | Giao ly cho khách | item `served`; order `closed` |

## Các tình huống ngoại lệ chuẩn (áp dụng cho mọi luồng)

| Tình huống | Cách xử lý chuẩn | Quyền |
|---|---|---|
| Khách gọi nhầm, **chưa gửi bếp** | Xoá dòng món, không cần lý do | Waiter |
| Khách đổi/huỷ món **bếp chưa nhận** | Huỷ, bếp thấy phiếu huỷ, không tính tiền | Waiter (có lý do) |
| Huỷ món **bếp đã bắt đầu/đã xong** | Cần quản lý duyệt (PIN); chọn: khách vẫn trả / quán chịu; ghi hao hụt; audit | Manager |
| Bếp báo hết món sau khi khách gọi | Item `out_of_stock`; phục vụ báo khách; đổi món hoặc huỷ không tính tiền; menu tự đánh dấu hết | Kitchen, Waiter |
| Khách chuyển bàn | Dời order sang bàn mới giữ nguyên lịch sử; bếp được báo bàn mới | Waiter |
| Gộp bàn / tách bàn | Gộp: hợp nhất order. Tách: chọn món chuyển sang order mới | Waiter, Manager |
| Hai người cùng gọi qua QR một bàn | Cùng một order, mỗi item ghi người gọi | - |
| Tách bill theo món/ đầu người | Chia thành nhiều `payment`, mỗi phần thanh toán độc lập; order chỉ `paid` khi đủ | Cashier |
| Trả bằng nhiều phương thức | Nhiều `payment` trên một order, tổng = số phải trả | Cashier |
| Khách chuyển khoản nhưng thu ngân chưa thấy tiền | `payment` giữ `pending`; thu ngân kiểm tra; không đóng bàn cho tới khi xác nhận hoặc chọn phương thức khác | Cashier |
| Sai tiền nhập/ giảm giá nhầm sau khi đã thanh toán | Không sửa trực tiếp; **hoàn/điều chỉnh** có lý do + duyệt, tạo bút toán mới | Manager |
| Khách đã trả, quán lỡ huỷ | Hoàn tiền (refund) tạo bản ghi riêng, ghi vào ca hiện tại | Manager |
| Mất mạng ở quầy | Xem `16-nonfunctional.md` (chế độ dự phòng) | - |
| Mất điện giữa ca | Mở lại: khôi phục đơn mở; ca vẫn mở, phiên đăng nhập duy trì | - |
| Nhân viên quên chốt ca | Quản lý chốt thay; ghi lý do; chênh lệch ghi cho ca đó | Manager |
| Ca bàn giao giữa chừng | Thu ngân A chốt, thu ngân B mở ca mới; đơn đang mở thuộc store, không thuộc ca | - |
| Khách bỏ về chưa trả | Quản lý ghi "khách bỏ về" (void toàn bill có lý do), ghi tổn thất | Manager |
| Đơn app giao hàng huỷ sau khi bếp làm | Ghi hao hụt, cho phép đánh dấu "do đối tác" | Manager |

## Nguyên tắc chung
1. **Không bao giờ xoá dữ liệu giao dịch**; chỉ huỷ/ hoàn/ điều chỉnh bằng bản ghi mới.
2. Mọi hành động huỷ/giảm/sửa sau thanh toán đều có **lý do + người thực hiện + người duyệt**.
3. Một bàn chỉ có một order mở tại một thời điểm (gộp/tách xử lý bằng thao tác riêng).
4. Giá, tên món, thuế được **chụp lại (snapshot)** vào order item khi gửi; sửa menu sau đó không ảnh hưởng đơn cũ.
