# Thông báo & sự kiện thời gian thực

## 1. Nguyên tắc
- Realtime (WebSocket) cho thao tác tại cửa hàng; push (FCM/APNs) chỉ cho người **không mở app**.
- Mỗi thông báo có: loại, mức ưu tiên, người nhận (vai trò/ người/ station), hành động khi chạm.
- Thông báo quan trọng phải **có âm báo** (bếp ồn); người dùng không tắt được nhóm "bắt buộc".
- Không gửi trùng: thông báo gắn `dedupe_key`; gộp khi dồn dập (vd 5 món xong cùng lúc).

## 2. Danh mục sự kiện và người nhận

| Sự kiện | Người nhận | Kênh | Ưu tiên | Ghi chú |
|---|---|---|---|---|
| Round mới gửi | Station liên quan | Realtime + âm + in | Cao | Bếp/ bar |
| Đơn QR chờ xác nhận | Waiter, Cashier | Realtime + âm + push | Cao | Hiện đếm số chờ |
| Món sẵn sàng | Waiter phụ trách bàn (hoặc khu vực) | Realtime + âm + push | Cao | Quầy: màn hình gọi số |
| Món hết/ lỗi | Waiter, Manager | Realtime + âm | Cao | |
| Món bị huỷ khi bếp đã nhận | Station | Realtime + âm nổi bật | Cao | |
| Khách gọi nhân viên/ xin nước/ tính tiền | Waiter khu vực, Cashier | Realtime + âm + push | Cao | Quá hạn N phút leo thang Manager |
| Yêu cầu duyệt (giảm giá, void) | Manager có mặt | Realtime + push | Cao | Hoặc nhập PIN tại chỗ |
| Payment VietQR chờ xác nhận | Cashier | Realtime | TB | |
| Bàn quá thời gian/ bỏ quên | Manager | Realtime | Thấp | |
| Tồn thấp/ sắp hết hạn | Manager, Stock keeper | Push hằng ngày | Thấp | |
| Chênh lệch quỹ lớn, void/ giảm giá bất thường | Owner | Push | Cao | Cấu hình ngưỡng |
| Lịch làm đã đăng/ đổi | Nhân viên | Push | TB | |
| Mất kết nối thiết bị/ máy in | Manager | Realtime | Cao | |

## 3. Phòng (rooms) realtime
`store:{id}` (chung), `station:{id}`, `table:{id}`, `user:{id}`, `guest:{session}`.

## 4. Độ tin cậy
- Sự kiện có `event_id`, `seq` theo store; client nhận thiếu thì **kéo bù** (resync) qua REST từ `last_seq`.
- Gửi lại khi mất kết nối; hành động ghi dùng `Idempotency-Key`.
- Trạng thái thiết bị (online/ offline) hiển thị rõ ràng ở mọi màn hình quan trọng.
- Thời gian hiển thị theo giờ máy chủ để tránh lệch đồng hồ thiết bị.

## 5. Quy tắc chống nhiễu
- Gộp thông báo "món sẵn sàng" theo bàn trong cửa sổ 10 giây.
- Giờ yên tĩnh cho thông báo không khẩn (ngoài giờ mở cửa).
- Leo thang: gọi nhân viên không ai nhận sau N phút -> báo Manager.
