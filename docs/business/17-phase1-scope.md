# Phạm vi Phase 1 và tiêu chí nghiệm thu

## 1. Mục tiêu Phase 1
Một cửa hàng F&B nhỏ-vừa (cà phê, trà sữa, quán ăn, 10–40 bàn) vận hành hằng ngày: gọi món, gửi bếp/ bar, thanh toán tiền mặt/ VietQR, chốt ca, xem doanh thu cơ bản.

## 2. Trong phạm vi

| Nhóm | Tính năng |
|---|---|
| Nền tảng | Đăng ký tenant/ store, nhân viên, role, PIN, audit cơ bản, cấu hình store |
| Menu | Danh mục, món, option, sold-out, giá khung giờ cơ bản |
| Bàn | Sơ đồ, mở/ đóng, chuyển, gộp, tách, QR bàn, đặt bàn đơn giản |
| POS/ Order | Dine-in, quầy, mang về, nhập tay đơn app giao hàng; gửi bếp; void; giảm giá |
| QR | Gọi món, theo dõi, gọi nhân viên, xác nhận bởi nhân viên |
| Bếp/ bar | KDS + phiếu in + tem ly, hết món, làm lại |
| Thanh toán | Tiền mặt, VietQR (xác nhận tay), thẻ/ ví ghi nhận tay, tách bill, nhiều phương thức, hoàn tiền |
| Ca/ quỹ | Mở/ chốt ca, thu/ chi, chênh lệch |
| Báo cáo | R01–R09 |
| Vận hành | Thông báo realtime, chế độ chịu lỗi mạng, in ấn |

## 3. Ngoài phạm vi Phase 1
Kho/ định lượng/ mua hàng, nhân sự/ chấm công/ lương, CRM/ loyalty, khuyến mãi tự động, HĐĐT, tích hợp app giao hàng tự động, thanh toán tự động webhook, đa chi nhánh giao diện, web admin, offline hoàn toàn, tính tiền theo giờ, đặt cọc, ghi nợ.

## 4. Giả định đang dùng (chưa được xác nhận, cần chốt)
1. Quán mục tiêu: cà phê/ trà sữa và quán ăn nhỏ-vừa (cả hai).
2. Khách mục tiêu chủ yếu hộ kinh doanh.
3. Giá niêm yết đã gồm VAT; phí dịch vụ tuỳ chọn, mặc định tắt.
4. Quán có thể trả trước (quầy) hoặc trả sau (bàn); cấu hình theo store.
5. Đơn app giao hàng nhập tay trong P1.
6. Quán dùng một thu ngân tại một thời điểm.

## 5. Tiêu chí nghiệp thu (kịch bản)
1. Hoàn tất luồng A, B, C của `03-end-to-end-flows.md` không lỗi.
2. Đủ 7 tình huống đặc biệt trong mục 4 của tài liệu gốc (đặt thêm, hai khách cùng bàn, tách bill, huỷ khi đã làm, chuyển bàn, chuyển khoản chưa xác nhận, hết món) được xử lý đúng quy tắc.
3. Chốt ca khớp: Σ payment tiền mặt + đầu ca - chi - hoàn = số phải có.
4. Mất mạng 2 phút khi gửi order: không mất/ trùng đơn sau khi mạng về.
5. Người dùng không có quyền không thực hiện được thao tác bị cấm; mọi thao tác nhạy cảm có audit.
6. Hai tenant không thấy dữ liệu của nhau (kiểm thử tự động).
7. Báo cáo R02/R05 khớp với tổng giao dịch.

## 6. Tổng hợp câu hỏi mở cần phỏng vấn người trong nghề
Xem mục 12 của từng module. Ưu tiên cao nhất (ảnh hưởng thiết kế P1):
1. Trả trước hay trả sau, mô hình bàn hay quầy chiếm tỷ lệ nào?
2. Số máy in, khổ giấy, tem ly, KDS hay phiếu giấy?
3. Quy tắc giảm giá, ngưỡng, ai được duyệt?
4. Thực tế VietQR: xác nhận bằng loa/ app nào, có hay gặp chuyển khoản giả/ sai nội dung?
5. Chốt ca: một lần/ nhiều lần, chênh lệch tự chấp nhận bao nhiêu?
6. Tip, phí dịch vụ, phụ thu: có/ không và cách chia?
7. Mức độ cần offline thực tế?
8. Kế toán/ thuế: quán đang kê khai thế nào, cần xuất báo cáo dạng nào?

## 7. Việc cần làm tiếp theo
1. Phỏng vấn 2–3 quán và cập nhật câu trả lời.
2. Xác minh các điểm pháp lý đánh dấu [N] với kế toán/ luật sư.
3. Vẽ wireframe cho POS, KDS, QR, chốt ca theo phạm vi trên.
4. Cập nhật `docs/03-data-model.md` theo các quy tắc mới (đã thêm: ngày kinh doanh, tip, hoàn tiền, thuế theo ngày, xác nhận PIN, tem ly).
