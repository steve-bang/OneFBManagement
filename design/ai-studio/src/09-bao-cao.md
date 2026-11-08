# BƯỚC 9/12: BÁO CÁO R01–R09

## Mục tiêu bước này
Làm module báo cáo Phase 1 (R01–R09) cho Owner/ Manager (và Cashier xem ca của mình). Số liệu phải **khớp từng đồng** với giao dịch gốc và truy ngược được tới đơn.

## 9.1 Dữ liệu demo lịch sử
Sinh **trong bộ nhớ khi khởi động** (không lưu `localStorage` để tránh phình) lịch sử **14 ngày kinh doanh** gần nhất, mỗi ngày 60–120 đơn, **xác định (deterministic)** theo seed cố định để kết quả lặp lại: đủ kênh (tại bàn, quầy, mang về, QR, app giao hàng), đủ phương thức thanh toán, vài đơn huỷ/ void/ tặng/ giảm giá, vài ca với chênh lệch quỹ, đỉnh giờ 11:30–13:00 và 18:00–20:00. Dữ liệu sinh ra phải đi qua **chính các hàm domain** của bước 5 và 7 (tính tiền, payment, ca) để không có số liệu mâu thuẫn.

## 9.2 Quy ước tính toán (bắt buộc)
- **Ngày kinh doanh** theo `business_day_cutoff` (04:00): đơn lúc 01:30 thuộc ngày kinh doanh hôm trước.
- **Doanh thu thuần** = tổng món − giảm giá − hoàn. **Phí dịch vụ, phụ thu, tip hiển thị riêng**, không cộng vào doanh thu thuần.
- Doanh thu theo phương thức ghi theo thời điểm `confirmed` (BR-CASH-016).
- Báo cáo ca và ngày **đối chiếu được**: tổng các ca trong ngày = tổng ngày.
- Múi giờ Asia/Ho_Chi_Minh; tiền VND không thập phân.
- Bộ lọc chung: cửa hàng, khoảng ngày kinh doanh (hôm nay, hôm qua, 7 ngày, 14 ngày, tuỳ chọn), ca, kênh, nhân viên. **Truy ngược được tới đơn** (bấm vào số hoặc dòng thì mở danh sách đơn tạo nên con số đó).
- Quyền: `report.sales.view` (Manager, Owner; Cashier chỉ ca của mình), `report.export` (xuất để Phase 2: bước này chỉ hiện nút bị vô hiệu kèm ghi chú "Sắp có"). Báo cáo lợi nhuận/ giá vốn **không** làm.
- R01 realtime (cập nhật khi đơn đổi). Các báo cáo khác có cờ "đang cập nhật" khi dữ liệu đang tính lại (mô phỏng độ trễ ngắn).

## 9.3 Danh mục báo cáo
| Mã | Báo cáo | Vai trò | Công thức / nội dung |
|---|---|---|---|
| R01 | Tổng quan hôm nay | Owner, Manager | Doanh thu, số đơn, giá trị trung bình/ đơn, đơn đang mở, bàn đang dùng. Thẻ chỉ số có so sánh với hôm qua |
| R02 | Doanh thu theo ngày/ tuần/ tháng | Owner, Manager | Σ payment `confirmed` − hoàn, theo ngày kinh doanh. Biểu đồ đường + bảng |
| R03 | Doanh thu theo phương thức thanh toán | Owner | Tiền mặt, VietQR, thẻ, ví, app giao hàng; phục vụ kê khai. Biểu đồ cột + bảng |
| R04 | Doanh thu theo kênh | Owner, Manager | Tại bàn, quầy, mang về, QR, app giao hàng |
| R05 | Báo cáo ca thu ngân | Manager, Cashier | Đầu ca, bán (theo phương thức), thu/ chi, hoàn, phải có, đếm, chênh lệch |
| R06 | Món bán chạy/ chậm | Owner, Manager | Số lượng, doanh thu, % tổng; sắp xếp tăng/ giảm |
| R07 | Đơn huỷ/ void/ tặng/ giảm giá | Owner, Manager | Theo người, lý do, giá trị; đánh dấu bất thường (vượt ngưỡng cấu hình) |
| R08 | Giờ cao điểm | Manager | Số đơn theo giờ và theo thứ trong tuần (bản đồ nhiệt hoặc cột) |
| R09 | Thời gian chế biến | Manager | `accepted → ready` trung bình/ p90 theo món và theo station |

## 9.4 Màn hình
- `/reports`: trang chủ báo cáo: R01 làm thẻ chỉ số + biểu đồ nhỏ ở đầu, danh sách R02–R09 theo nhóm (Doanh thu, Vận hành, Kiểm soát).
- Mỗi báo cáo: `PageHeader` + bộ lọc + biểu đồ (dùng `BarChart`/`LineChart` token `chart-1…6`, có chú giải/ nhãn trực tiếp, mô tả bằng văn bản cho trình đọc màn hình) + bảng chi tiết (`DataTable`, số căn phải, chữ số đều) + nút "Xem các đơn" truy ngược.
- Điện thoại: thẻ chỉ số xếp dọc, biểu đồ cuộn ngang trong khung riêng, bảng cuộn ngang trong khung riêng; web admin: lưới nhiều cột.
- Trạng thái đủ 6: đang tải (skeleton), rỗng ("Chưa có đơn trong khoảng này"), dữ liệu, lỗi, mất mạng, không đủ quyền.
- Tránh bóng đổ nặng và hoạt hình trên bảng dài; danh sách dài dùng phân trang hoặc ảo hoá.

## Tiêu chí nghiệm thu
- [ ] **R02 khớp tổng giao dịch**: tổng doanh thu 14 ngày bằng Σ payment `confirmed` − hoàn tính độc lập bằng hàm khác (thêm một kiểm tra trong `/dev/scenarios`).
- [ ] **R05 khớp** công thức chốt ca ở bước 7 và tổng các ca trong ngày = tổng ngày ở R02.
- [ ] Đơn lúc 01:30 thuộc ngày kinh doanh trước; thử đổi `business_day_cutoff` thì số liệu đổi đúng.
- [ ] Doanh thu thuần không gồm phí dịch vụ, phụ thu, tip; các khoản này hiện riêng.
- [ ] Bấm một con số bất kỳ mở đúng danh sách đơn tạo nên nó; tổng danh sách đơn = con số.
- [ ] Bộ lọc kênh, ca, nhân viên, khoảng ngày áp dụng đúng cho mọi báo cáo.
- [ ] Cashier chỉ thấy R05 của ca mình; Waiter không vào được `/reports`.
- [ ] R07 liệt kê đúng đơn huỷ/ void/ tặng/ giảm giá kèm người và lý do; đánh dấu bất thường theo ngưỡng.
- [ ] R09 dùng thời gian `accepted → ready` thực tế từ KDS.
- [ ] Mọi biểu đồ có chú giải/ nhãn trực tiếp; không phân biệt chỉ bằng màu.
- [ ] Không có báo cáo giá vốn/ lợi nhuận/ kho/ nhân sự (ngoài phạm vi Phase 1).
