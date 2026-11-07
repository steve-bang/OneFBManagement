# Phân hệ 05. Kho & Nguyên liệu (Phase 2)

## 1. Mục tiêu & người dùng
Biết còn gì, dùng bao nhiêu, hao hụt bao nhiêu, khi nào cần nhập. Stock keeper, Manager, Owner.

## 2. Thuật ngữ riêng
Nguyên liệu, Đơn vị tồn, Đơn vị mua, Quy đổi, Định lượng (recipe), Lô (lot), Hạn dùng, Tồn tối thiểu, Kiểm kê, Hao hụt, Tỷ lệ thành phẩm (yield), Bán thành phẩm (nước syrup, topping nấu sẵn).

## 3. Quy trình chính
1. Khai báo nguyên liệu, đơn vị, quy đổi, tồn tối thiểu.
2. Nhập kho (từ đơn mua, hoặc nhập nhanh) theo lô, giá, hạn dùng.
3. Khai báo định lượng cho món/option.
4. Khi order `paid` (hoặc khi bếp làm xong, cấu hình) hệ thống trừ kho theo định lượng.
5. Ghi hao hụt, điều chỉnh, kiểm kê định kỳ.
6. Cảnh báo sắp hết/ sắp hết hạn.

## 4. Quy tắc nghiệp vụ
- **BR-INV-001** Tồn kho = tổng `stock_movement` (sổ cái chỉ thêm); không sửa số tồn trực tiếp, chỉ tạo điều chỉnh có lý do.
- **BR-INV-002** Mỗi nguyên liệu có **đơn vị cơ sở** (g, ml, cái) và quy đổi từ đơn vị mua (thùng 24 lon, chai 750ml, kg).
- **BR-INV-003** Định lượng: `qty` theo đơn vị cơ sở, có thể gắn theo option (size L +20ml sữa; topping trân châu 50g).
- **BR-INV-004** Thời điểm trừ kho cấu hình: (a) khi gửi bếp, (b) khi hoàn thành, (c) khi thanh toán. Mặc định (a) để phản ánh đã dùng nguyên liệu kể cả khi bị huỷ sau.
- **BR-INV-005** Món bị huỷ **trước khi làm**: hoàn lại kho (không ghi hao hụt). Sau khi làm: giữ trừ kho + ghi hao hụt.
- **BR-INV-006** Tồn có thể âm (vì thực tế bán trước khi nhập sổ): cảnh báo và báo cáo "tồn âm", không chặn bán.
- **BR-INV-007** FIFO/FEFO theo lô khi có lô và hạn dùng; nguyên liệu không lô dùng bình quân.
- **BR-INV-008** Giá vốn: **bình quân gia quyền** theo store (mặc định); FIFO tuỳ chọn. Chốt phương pháp sau khi hỏi kế toán.
- **BR-INV-009** Hao hụt sơ chế: tỷ lệ thành phẩm (vd rau còn 70% sau sơ chế) áp dụng khi nhập hoặc trong định lượng.
- **BR-INV-010** Kiểm kê: tạo phiếu kiểm theo kho/ nhóm, nhập số đếm, hệ thống tính chênh lệch, duyệt rồi sinh điều chỉnh.
- **BR-INV-011** Cảnh báo: dưới tồn tối thiểu, sắp hết hạn (N ngày), tồn âm.
- **BR-INV-012** Chuyển kho giữa store (chuỗi): phiếu chuyển 2 bước (xuất - nhận).
- **BR-INV-013** Bán thành phẩm: công thức riêng, sản xuất tiêu hao nguyên liệu, tạo tồn bán thành phẩm.
- **BR-INV-014** Nguyên liệu hết hạn: huỷ có lý do, ghi hao hụt; thường cần chụp ảnh (tuỳ chọn).

## 5. Vòng đời
Phiếu nhập: `draft -> confirmed`. Phiếu kiểm: `draft -> counting -> approved`. Lô: `active -> expired|depleted`.

## 6. Màn hình
Danh sách nguyên liệu, Nhập kho, Xuất/điều chỉnh, Hao hụt, Kiểm kê, Định lượng món, Cảnh báo, Lịch sử biến động.

## 7. Quyền
`inventory.view`, `inventory.receive`, `inventory.adjust`, `inventory.waste`, `inventory.stocktake`, `recipe.manage`, `cost.view`.

## 8. Ngoại lệ
- Quán không khai báo định lượng: chỉ dùng kho cho nguyên liệu quan trọng (cà phê, sữa); các món không có định lượng không trừ kho.
- Bán món khi chưa nhập kho: tồn âm, báo cáo xử lý.
- Nhập sai số lượng/ giá: điều chỉnh bằng phiếu mới, không sửa phiếu cũ.
- Đổi công thức: có hiệu lực từ thời điểm đổi, đơn cũ giữ công thức cũ (snapshot giá vốn).
- Nhân viên uống/ ăn thử: ghi loại "nhân viên/ thử món", không tính doanh thu, có tính hao.

## 9. Sự kiện
`stock.low`, `stock.expiring`, `stock_movement.created`.

## 10. Dữ liệu
`ingredient, unit_conversion, recipe_line, stock_lot, stock_movement, stocktake, waste_record`.

## 11. Báo cáo
Tồn kho, nhập-xuất-tồn, hao hụt, giá vốn lý thuyết vs thực tế, nguyên liệu sắp hết, tồn âm.

## 12. Câu hỏi mở
- Quán thực tế đã có định lượng chưa, hay chỉ ước chừng?
- Kiểm kê hằng ngày/ tuần/ tháng? Ai làm?
- Nguyên liệu tươi mua hằng ngày (rau, thịt) có cần quản lý theo lô?
- Phương pháp giá vốn của kế toán?

## 13. Phase
P2: nguyên liệu, nhập, định lượng, trừ kho, hao hụt, kiểm kê, cảnh báo. P3: lô/hạn nâng cao, chuyển kho chuỗi, dự báo nhu cầu.
