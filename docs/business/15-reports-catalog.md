# Danh mục báo cáo

Mọi báo cáo có bộ lọc: store, khoảng ngày kinh doanh, ca, kênh, nhân viên. Truy ngược được tới đơn. Xuất Excel/PDF (Phase 2).

| Mã | Báo cáo | Vai trò | Công thức/ ghi chú | Phase |
|---|---|---|---|---|
| R01 | Tổng quan hôm nay | Owner, Manager | Doanh thu, số đơn, giá trị TB, đơn đang mở, bàn đang dùng | P1 |
| R02 | Doanh thu theo ngày/ tuần/ tháng | Owner, Manager, KT | Σ payment confirmed - hoàn; theo ngày kinh doanh | P1 |
| R03 | Doanh thu theo phương thức thanh toán | Owner, KT | Tiền mặt, VietQR, thẻ, ví, app giao hàng; phục vụ kê khai | P1 |
| R04 | Doanh thu theo kênh | Owner, Manager | Tại bàn, quầy, mang về, QR, app | P1 |
| R05 | Báo cáo ca thu ngân | Manager, Cashier | Đầu ca, bán, thu/chi, hoàn, phải có, đếm, chênh lệch | P1 |
| R06 | Món bán chạy/ chậm | Owner, Manager | Số lượng, doanh thu, % tổng | P1 |
| R07 | Đơn huỷ/ void/ tặng/ giảm giá | Owner, Manager | Theo người, lý do, giá trị; phát hiện bất thường | P1 |
| R08 | Giờ cao điểm | Manager | Đơn theo giờ/ thứ | P1 |
| R09 | Thời gian chế biến | Manager | Accepted -> ready theo món/ station | P1 |
| R10 | Doanh thu theo nhân viên/ ca làm | Manager | Đơn do ai tạo/ thu | P2 |
| R11 | Nhập - xuất - tồn | Stock, Manager | Đầu kỳ + nhập - xuất = cuối kỳ | P2 |
| R12 | Hao hụt | Manager, Owner | Theo lý do/ nguyên liệu/ giá trị | P2 |
| R13 | Giá vốn & lợi nhuận gộp theo món | Owner, KT | Giá bán - giá vốn định lượng | P2 |
| R14 | Chi phí theo danh mục | Owner, KT | Từ mua hàng + thu chi + nhập tay | P2 |
| R15 | Lợi nhuận ước tính | Owner | R02 - giá vốn - chi phí; ghi rõ "ước tính" | P2 |
| R16 | Công nợ nhà cung cấp | Owner, KT | Phát sinh, đã trả, còn nợ, đến hạn | P2 |
| R17 | Bảng công nhân viên | Manager, KT | Giờ làm, muộn, tăng ca, nghỉ | P2 |
| R18 | Khách hàng/ tích điểm/ voucher | Owner | Mới, quay lại, hiệu quả khuyến mãi | P3 |
| R19 | So sánh chi nhánh | Owner | Doanh thu, giá vốn, năng suất | P3 |
| R20 | Dự báo nhu cầu | Owner | Theo lịch sử + ngày trong tuần | P3 |

## Quy ước tính toán
- **Ngày kinh doanh**: theo `business_day_cutoff`.
- **Doanh thu thuần** = tổng món - giảm giá - hoàn; phí dịch vụ/ phụ thu/ tip hiển thị riêng.
- Báo cáo ca và ngày đối chiếu được với nhau (tổng ca = tổng ngày).
- Số liệu realtime cho R01; các báo cáo còn lại chạy từ bảng tổng hợp, có cờ "đang cập nhật".
- Múi giờ: Asia/Ho_Chi_Minh; tiền: VND không thập phân.
