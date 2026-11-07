# 00. Kế hoạch viết tài liệu nghiệp vụ

Mục tiêu: bộ tài liệu nghiệp vụ đủ chi tiết để thiết kế UI và viết code mà không phải đoán, và **đúng thực tế vận hành F&B tại Việt Nam**.

> **Trạng thái**: bộ tài liệu `docs/business/` đã có bản đầu (v0.1). Các mục đánh dấu [N] và "Câu hỏi mở" cần xác nhận với người trong nghề/ kế toán.

## A. Cấu trúc thư mục

```
docs/
  00-documentation-plan.md        (file này)
  01-decisions.md  02-architecture.md  03-data-model.md   (đã có)
  business/
    00-glossary.md                Thuật ngữ (order, bill, ca, phiếu bếp, bàn, tab...)
    01-personas-and-roles.md      Vai trò thực tế ở quán VN, ma trận quyền
    02-vietnam-context.md         Bối cảnh vận hành & pháp lý VN (xem mục C)
    03-end-to-end-flows.md        Luồng xuyên suốt + tình huống ngoại lệ
    modules/
      01-pos-order.md   02-table-floor.md   03-qr-ordering.md   04-kitchen-bar.md
      05-inventory.md   06-staff-shift.md   07-cashier-cash.md   08-finance-reports.md
      09-menu-product.md  10-crm-loyalty.md  11-purchasing.md   12-admin-control.md
    13-notifications-and-realtime.md   Sự kiện, thông báo, âm báo
    14-permissions-matrix.md           Permission code x vai trò
    15-reports-catalog.md              Danh sách báo cáo, công thức
    16-nonfunctional.md                Hiệu năng, offline, bảo mật, in ấn, thiết bị
    17-phase1-scope.md                 Cắt phạm vi Phase 1, tiêu chí nghiệm thu
```

## B. Mẫu chuẩn cho mỗi phân hệ (`modules/*.md`)
1. Mục tiêu và người dùng
2. Thuật ngữ riêng
3. Quy trình chính (từng bước, ai làm gì)
4. Quy tắc nghiệp vụ (đánh số `BR-<MOD>-001`; điều kiện, ngoại lệ, làm tròn, giới hạn)
5. Vòng đời trạng thái (bảng chuyển trạng thái, ai được chuyển)
6. Màn hình và hành động theo vai trò (danh sách, chưa phải UI chi tiết)
7. Quyền thao tác (permission code)
8. Tình huống ngoại lệ thực tế (bắt buộc)
9. Sự kiện phát ra / nhận (realtime, audit log)
10. Dữ liệu liên quan (trỏ về `03-data-model.md`)
11. Báo cáo / số liệu cần có
12. Câu hỏi mở / cần xác nhận với người làm nghề
13. Phase (P1/P2/P3 cho từng tính năng)

## C. Các chủ đề đặc thù Việt Nam cần nghiên cứu và đưa vào tài liệu
Mỗi mục gắn nhãn **[Đã xác minh nguồn chính thức]** hoặc **[Cần kế toán/luật sư xác nhận]**; không ghi chắc chắn khi chưa có văn bản gốc.

| Chủ đề | Nội dung cần làm rõ | Phân hệ ảnh hưởng |
|---|---|---|
| Loại hình kinh doanh | Hộ kinh doanh vs doanh nghiệp: nghĩa vụ khác nhau; thuế khoán bị bãi bỏ từ 2026 (Nghị quyết 198/2025/QH15, Nghị định 68/2026/NĐ-CP), nhóm doanh thu, kê khai theo tháng/quý | 07, 08, 12 |
| Hóa đơn | HĐĐT từ máy tính tiền (Nghị định 70/2025/NĐ-CP sửa đổi 123/2020), khi nào bắt buộc, khách lấy hoặc không lấy hóa đơn, hóa đơn cuối ngày. **Tạm hoãn triển khai**, chỉ ghi nhận yêu cầu | 01, 07, 08 |
| Thuế GTGT | Thuế suất dịch vụ ăn uống (10%, giảm còn 8% đến hết 2026 theo NĐ 174/2025/NĐ-CP nếu đủ điều kiện), giá niêm yết đã gồm hay chưa gồm VAT, hiển thị trên bill | 01, 07, 09 |
| Thanh toán | VietQR (thu ngân xác nhận tay), tiền mặt, thẻ/POS ngân hàng, ví điện tử, Grab/ShopeeFood, thanh toán nhiều phương thức, tip | 07 |
| Dữ liệu cá nhân | Luật BVDLCN 91/2025/QH15 và Nghị định 356/2025/NĐ-CP (hiệu lực 01/2026; thay Nghị định 13/2023): đồng ý khi thu SĐT khách, loyalty, camera, dữ liệu nhân viên | 10, 06, 12 |
| Lao động | Bộ luật Lao động: giờ làm, tăng ca, ca đêm, nghỉ phép, thử việc, lương theo giờ/ca, BHXH; cách quán VN thường trả lương (theo ca, theo giờ, tip chia) | 06 |
| An toàn thực phẩm | Truy xuất lô, hạn dùng, FIFO/FEFO, kiểm tra nhập hàng, giấy tờ ATTP | 05, 11 |
| Vận hành đặc thù VN | Phiếu bếp in giấy, chuông/gọi tên, "bàn gọi thêm", đặt cọc bàn tiệc, phụ thu (giờ cao điểm, lễ), phí dịch vụ, khuyến mãi theo khung giờ, khách xuất hóa đơn công ty, order qua app giao đồ ăn, mang về, tính tiền theo giờ (billiards/karaoke: ngoài phạm vi), đồ uống pha chế theo size/đường/đá | 01–04, 09 |
| Giao hàng | Tích hợp GrabFood/ShopeeFood/BeFood: đối soát, phí hoa hồng, đơn tự giao | 01, 07, 08 |
| Kế toán nội bộ | Giá vốn (bình quân gia quyền/FIFO), hao hụt, kiểm kê, chi phí cố định, công nợ nhà cung cấp, chứng từ thu chi | 05, 08, 11 |
| Phần cứng | Máy in nhiệt khổ 58/80mm (LAN/Bluetooth), ngăn kéo tiền, máy quét mã, tablet Android phổ biến, mạng chập chờn | 16 |

Nguồn tham khảo ban đầu (cần đối chiếu văn bản gốc trước khi ghi vào tài liệu):
Nghị định 70/2025/NĐ-CP; Nghị quyết 198/2025/QH15 và Nghị định 68/2026/NĐ-CP; Nghị định 174/2025/NĐ-CP;
Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và Nghị định 356/2025/NĐ-CP. Kết quả tìm kiếm có chỗ chưa nhất quán
(ví dụ ngưỡng doanh thu 500 triệu hay 1 tỷ) nên **mọi con số pháp lý phải tra văn bản gốc**.

## D. Phương pháp
1. **Nghiên cứu**: tài liệu của các hệ thống VN (KiotViet, iPOS, MISA CukCuk, Sapo FnB, Haravan...) để lấy thuật ngữ và thói quen vận hành; văn bản pháp luật gốc cho phần C.
2. **Phỏng vấn nghề** (nên có 2–3 chủ quán/quản lý/thu ngân): danh sách câu hỏi nằm trong mỗi module, mục 12. Đây là nguồn chất lượng nhất, tôi không thay thế được.
3. **Viết theo thứ tự** (mục E), mỗi lô có một lượt review.
4. **Truy vết**: mỗi quy tắc `BR-*` liên kết tới permission, sự kiện và bảng dữ liệu; kiểm tra chéo cuối cùng.
5. **Giữ nhất quán**: thuật ngữ theo `00-glossary.md`; thay đổi quyết định thì cập nhật `01-decisions.md` trước.

## E. Thứ tự và lô công việc

| Lô | Nội dung | Ghi chú |
|---|---|---|
| 1 | Glossary, personas và vai trò, bối cảnh VN, luồng xuyên suốt | Nền tảng; cần review của bạn trước khi sang lô 2 |
| 2 | Phase 1 modules: 09 Menu, 02 Bàn, 01 POS/Order, 03 QR, 04 Bếp/Bar, 07 Thu ngân, 12 Admin | Chi tiết nhất |
| 3 | 13 Thông báo/realtime, 14 Ma trận quyền, 17 Phạm vi Phase 1, 16 Phi chức năng | Chốt Phase 1 |
| 4 | Phase 2 modules: 05 Kho, 11 Mua hàng, 06 Nhân sự/ca, 08 Tài chính, 15 Báo cáo | Mức vừa |
| 5 | Phase 3 modules: 10 CRM/Loyalty và phần nâng cao của 12 | Mức khung |
| 6 | Rà soát chéo, cập nhật `03-data-model.md` theo nghiệp vụ, danh sách câu hỏi mở | |

## F. Tiêu chí hoàn thành mỗi tài liệu
- Có đủ 13 mục của mẫu, không để trống mục 8 (ngoại lệ).
- Mỗi quy tắc đánh số, kiểm chứng được.
- Mỗi số liệu pháp lý có nguồn và nhãn xác minh.
- Câu hỏi mở được liệt kê rõ, không đoán thầm.

## G. Câu hỏi cần bạn chốt trước khi bắt đầu lô 1
1. **Đối tượng quán**: quán cà phê/trà sữa (ít bàn, pha chế nhiều), quán ăn/nhà hàng (nhiều món, bếp), hay cả hai? Ưu tiên loại nào ở Phase 1?
2. **Loại hình pháp lý của khách hàng mục tiêu**: chủ yếu hộ kinh doanh hay doanh nghiệp?
3. **Quy mô điển hình**: số bàn, số nhân viên mỗi ca, có bếp tách khu (bếp nóng, bếp lạnh, bar) hay không.
4. **Phí dịch vụ/phụ thu/tip**: quán mục tiêu có thu không, chia thế nào?
5. **Kênh giao hàng (GrabFood/ShopeeFood)**: nằm trong Phase 1, hay để sau?
6. Bạn có thể liên hệ vài người trong nghề để tôi chuẩn bị bộ câu hỏi phỏng vấn không?
