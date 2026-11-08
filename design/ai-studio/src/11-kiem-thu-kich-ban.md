# BƯỚC 11/12: KIỂM THỬ THEO KỊCH BẢN NGHIỆM THU

## Mục tiêu bước này
Dựng trang `/dev/scenarios`: **chạy tự động** các kịch bản nghiệm thu Phase 1 trên chính các hàm domain và store, hiện bảng Đạt/ Không đạt. Nếu kịch bản nào không đạt thì **sửa lỗi ở mã nguồn** (không sửa kịch bản cho dễ qua). Không thêm tính năng mới.

## 11.1 Cách dựng
- Mỗi kịch bản là một hàm async nhận một **store sạch** (nạp seed mới trong bộ nhớ, không đụng `localStorage` thật), đi qua các hàm thật của `src/domain` và `src/data/api.ts` (không viết lại logic trong kịch bản), rồi `assert` kết quả.
- Trang hiển thị bảng: mã kịch bản, tên, trạng thái (Đạt/ Không đạt/ Đang chạy), thời gian, chi tiết các bước và giá trị mong đợi/ thực tế khi lỗi. Nút "Chạy tất cả" và "Chạy lại kịch bản này". Có tổng kết "x/y đạt".
- Dùng `StatusPill` cho kết quả, `DataTable` cho bảng. Trang chỉ hiện trong công cụ demo, không nằm trong điều hướng sản phẩm.

## 11.2 Kịch bản bắt buộc
**Luồng chuẩn**
- **K01 Luồng A (tại bàn)**: mở bàn → gọi món có option → gửi (2 ticket đúng station) → bếp làm xong → Waiter "Đã phục vụ" → gọi thêm round 2 → "Yêu cầu thanh toán" (bàn `needs_payment`) → thanh toán tiền mặt → order `paid` → `closed` → bàn `cleaning` → `available`.
- **K02 Luồng B (QR)**: khách gửi đơn ở chế độ cần xác nhận → chờ nhân viên → xác nhận → xuống bếp → khách thấy trạng thái → thanh toán VietQR `pending` → thu ngân xác nhận → `paid`.
- **K03 Luồng C (quầy)**: tạo đơn quầy có số thứ tự → thanh toán ngay → ly xuống Bar có tem → `ready` → `served` → `closed`.

**Bảy tình huống đặc biệt**
- **K04 Gọi thêm**: sau `paid` gọi thêm tạo order **mới**, order cũ không đổi.
- **K05 Hai khách cùng bàn qua QR**: hai phiên khách chung một order, mỗi item ghi đúng `guestSessionId`, mỗi người chỉ huỷ được món chưa nhận của mình.
- **K06 Tách bill**: ba cách (theo món, chia đều 3, theo số tiền); order chỉ `paid` khi tổng phần = tổng order; thiếu 1 đồng thì chưa `paid`.
- **K07 Huỷ khi đã làm**: món `preparing` bị huỷ cần PIN Manager; người yêu cầu không tự duyệt; chọn "quán chịu" → ghi hao hụt, audit có hai người, món `voided`, không tính tiền.
- **K08 Chuyển bàn**: giữ nguyên order và lịch sử; bàn đích phải hợp lệ; bếp nhận thông báo bàn mới.
- **K09 Chuyển khoản chưa xác nhận**: payment `pending`, **không đóng bàn**; chọn phương thức khác hoặc xác nhận sau thì mới `paid`.
- **K10 Hết món**: bếp báo hết sau khi khách gọi → item `out_of_stock`, Waiter được báo, menu `sold_out`, đơn không tự huỷ; đổi món hoặc huỷ không tính tiền.

**Tiền và ca**
- **K11 Chốt ca khớp**: `Σ payment tiền mặt + đầu ca + thu − chi − hoàn tiền mặt = phải có` đúng từng đồng trên một ca có đủ bán, thu, chi, hoàn.
- **K12 Tính tiền**: bộ ca kiểm thử `computeOrderTotals` (có giảm giá %, giảm số tiền theo dòng, phí dịch vụ, tặng, làm tròn bật/ tắt, thuế hiển thị). Ví dụ bắt buộc: tạm tính 200.000, giảm 10%, phí dịch vụ 5% sau giảm → tổng 189.000.
- **K13 Hoàn tiền**: không sửa payment cũ, tạo `refund`, cần duyệt, trừ quỹ ca hiện tại.
- **K14 Chặn chốt ca**: còn payment `pending` thì không chốt được; order mở chuyển sang ca kế.

**Mất mạng và idempotency**
- **K15 Mất mạng 2 phút**: bật mất mạng giả lập, gửi order, tắt sau 2 phút (đẩy thời gian giả lập); sau đồng bộ có **đúng một** round, không mất, không trùng. Gửi lại cùng `idempotencyKey` trả kết quả cũ.
- **K16 Xung đột khi đồng bộ**: trong lúc mất mạng món bị đánh dấu hết ở bếp; sau đồng bộ hệ thống báo xung đột chứ không ghi đè.

**Quyền, audit, tenant**
- **K17 Ma trận quyền**: duyệt từng dòng ma trận ở bước 3 cho từng role, kết quả `can()` phải khớp (sinh bảng tự động từ ma trận).
- **K18 Quyền bị cấm**: người không có quyền không thực hiện được thao tác bị cấm qua `api.ts` (không chỉ ẩn nút).
- **K19 Audit**: mọi thao tác nhạy cảm trong bước 3 sinh audit đủ trường (người, thiết bị, thời gian, trước/ sau, lý do, người duyệt nếu có); không có hàm sửa/ xoá audit.
- **K20 Cô lập tenant**: tạo tenant thứ hai trong bộ nhớ có dữ liệu riêng; mọi truy vấn của người dùng tenant A **không bao giờ** trả bản ghi của tenant B (kiểm tra qua mọi hàm đọc của store/ api).
- **K21 Snapshot giá**: đổi giá và tên món sau khi gửi không đổi order cũ.
- **K22 Bất biến**: order `closed` không sửa trực tiếp; một bàn không có hai order mở; bàn còn order chưa trả không thể `available`.

**Báo cáo**
- **K23 R02 và R05 khớp**: R02 bằng tổng giao dịch tính độc lập; tổng các ca trong ngày = tổng ngày; đơn lúc 01:30 thuộc ngày kinh doanh trước.
- **K24 Truy ngược**: mỗi con số ở R01–R09 mở ra danh sách đơn có tổng bằng đúng con số đó.

## 11.3 Sau khi chạy
1. Chạy tất cả. Với mỗi kịch bản **Không đạt**, tìm lỗi ở mã nguồn domain/ data/ giao diện và sửa. Chạy lại cho tới khi tất cả Đạt.
2. Ghi ngắn trong báo cáo cuối: kịch bản nào từng lỗi, nguyên nhân, đã sửa ở file nào.
3. Nếu một kịch bản **không thể** đạt vì thiếu tính năng ở bước trước, ghi rõ kịch bản và thiếu gì, **đừng sửa kịch bản**.

## Tiêu chí nghiệm thu
- [ ] `/dev/scenarios` chạy được, có đủ K01–K24, hiện tổng kết x/24.
- [ ] Mọi kịch bản dùng store sạch trong bộ nhớ, không làm hỏng dữ liệu demo đang lưu.
- [ ] Kịch bản gọi hàm thật của domain/ api, không tự viết lại logic.
- [ ] Kết quả sau khi sửa: 24/24 Đạt, hoặc danh sách rõ ràng kịch bản chưa đạt kèm lý do.
- [ ] K12 cho tổng 189.000 ở ví dụ bắt buộc; K11 khớp từng đồng; K15 đúng một round sau đồng bộ.
