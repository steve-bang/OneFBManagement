# Phân hệ 08. Tài chính & Phân tích kinh doanh (Phase 2)

## 1. Mục tiêu & người dùng
Cho chủ biết doanh thu, chi phí, lợi nhuận ước tính, hiệu quả món/ca/nhân viên. Owner, Manager, Accountant.

## 2. Thuật ngữ riêng
Doanh thu gộp/ thuần, Giá vốn, Lợi nhuận gộp, Chi phí cố định/ biến đổi, Ngày kinh doanh, Điểm hoà vốn.

## 3. Quy trình chính
1. Hệ thống tổng hợp doanh thu từ payment/ order theo ngày kinh doanh.
2. Chi phí: thu chi két, mua hàng, chi phí nhập tay (thuê mặt bằng, điện, nước, lương, marketing).
3. Giá vốn từ kho (phân hệ 05).
4. Báo cáo theo ngày/ tuần/ tháng/ quý/ ca/ món/ nhân viên/ phương thức.
5. Xuất Excel/ PDF cho kế toán.

## 4. Quy tắc nghiệp vụ
- **BR-FIN-001** Doanh thu ghi nhận theo thời điểm payment `confirmed`, thuộc **ngày kinh doanh** (cutoff theo BR-ADM-012).
- **BR-FIN-002** Doanh thu thuần = tổng bán - giảm giá - hoàn tiền; **tách** phí dịch vụ, phụ thu, tip, thuế (nếu bật) thành dòng riêng.
- **BR-FIN-003** Phân loại doanh thu theo kênh (tại bàn, quầy, mang về, QR, app giao hàng) và phương thức thanh toán.
- **BR-FIN-004** Giá vốn lý thuyết = Σ(định lượng x giá vốn); giá vốn thực tế dựa trên kiểm kê; hiển thị chênh lệch.
- **BR-FIN-005** Lợi nhuận gộp = doanh thu thuần - giá vốn. **Lợi nhuận ước tính** = lợi nhuận gộp - chi phí; **không phải lợi nhuận kế toán/ thuế**; ghi rõ trên màn hình.
- **BR-FIN-006** Chi phí nhập có danh mục, ngày, số tiền, nguồn tiền, ảnh chứng từ; chi phí định kỳ lặp lại (thuê mặt bằng).
- **BR-FIN-007** Đơn app giao hàng: doanh thu theo giá bán, **hoa hồng đối tác là chi phí** (nhập khi đối soát); tiền về tài khoản theo kỳ đối soát, không phải ngay.
- **BR-FIN-008** Báo cáo chốt ngày: sau chốt (cấu hình), dữ liệu ngày bị khoá, thay đổi chỉ qua điều chỉnh có ghi nhận.
- **BR-FIN-009** Doanh thu phục vụ kê khai thuế: báo cáo "doanh thu theo kỳ" với phân tách theo phương thức để chủ/ kế toán kê khai (xem `02-vietnam-context.md`); không tự tính thuế phải nộp ở P2 (cần xác nhận quy định).
- **BR-FIN-010** Quyền xem tài chính tách riêng: Manager có thể chỉ xem doanh thu, không xem lợi nhuận/ lương.
- **BR-FIN-011** Số liệu nhất quán giữa báo cáo (một nguồn chân lý); mọi báo cáo truy ngược được tới đơn.

## 5. Vòng đời
Ngày kinh doanh: `open -> closed (khoá)`.

## 6. Màn hình
Tổng quan (hôm nay/ tuần/ tháng), Doanh thu, Món bán chạy, Giá vốn/ lợi nhuận, Chi phí, Nhân viên/ ca, Xuất báo cáo.

## 7. Quyền
`report.sales.view`, `report.profit.view`, `expense.manage`, `report.export`, `day.close`.

## 8. Ngoại lệ
- Hoàn tiền vào ngày khác ngày bán: ghi vào ngày hoàn, báo cáo hiển thị liên kết.
- Chi phí nhập muộn: ghi theo ngày thực chi, cho phép sửa nếu kỳ chưa khoá.
- Đơn mang qua ngày kinh doanh (quán đêm): xử lý bởi cutoff.

## 9. Sự kiện
`day.closed`, `expense.created`.

## 10. Dữ liệu
`expense, expense_category, daily_store_summary, product_daily_stats` + nguồn từ `order, payment, stock_movement`.

## 11. Báo cáo
Xem `15-reports-catalog.md`.

## 12. Câu hỏi mở
- Chủ thực sự muốn thấy gì đầu tiên mỗi sáng (3 số)?
- Có kế toán ngoài dùng phần mềm nào (MISA…) để xuất dữ liệu sang?
- Chi phí cố định hằng tháng phân bổ thế nào?

## 13. Phase
P2: doanh thu, chi phí, giá vốn, báo cáo cơ bản. P3: dự báo, so sánh chi nhánh. P4: báo cáo chuyên sâu trên web.
