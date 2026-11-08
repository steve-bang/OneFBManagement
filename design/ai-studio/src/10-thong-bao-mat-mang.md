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
