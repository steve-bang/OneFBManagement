# Phân hệ 11. Mua hàng & Nhà cung cấp (Phase 2)

## 1. Mục tiêu & người dùng
Đặt hàng nhà cung cấp, nhận hàng, theo dõi công nợ. Manager, Stock keeper, Owner/Kế toán.

## 2. Thuật ngữ riêng
Nhà cung cấp (NCC), Đề nghị mua, Đơn mua (PO), Phiếu nhận hàng (GRN), Công nợ phải trả, Chứng từ.

## 3. Quy trình chính
1. Tạo NCC (tên, SĐT, MST tuỳ chọn, điều khoản trả).
2. Đề nghị mua (từ cảnh báo tồn thấp hoặc thủ công) -> duyệt.
3. Tạo đơn mua gửi NCC (in/ gửi Zalo/ email dạng văn bản).
4. Nhận hàng: đối chiếu số lượng, chất lượng, hạn dùng -> nhập kho.
5. Ghi công nợ hoặc thanh toán ngay (thu chi từ két/ chuyển khoản).
6. Đối soát công nợ cuối kỳ.

## 4. Quy tắc nghiệp vụ
- **BR-PUR-001** Một đơn mua thuộc một NCC, một store.
- **BR-PUR-002** Nhận hàng một phần cho phép; đơn ở `partially_received` đến khi đủ hoặc đóng.
- **BR-PUR-003** Nhận hàng sinh phiếu nhập kho (BR-INV) với giá thực tế; chênh lệch giá so với PO được ghi và cảnh báo.
- **BR-PUR-004** Hàng không đạt chất lượng: ghi từ chối/ trả lại, không nhập kho, có lý do/ ảnh.
- **BR-PUR-005** Mua tiền mặt tại chợ (rất phổ biến): cho tạo "mua nhanh" không cần PO, có chứng từ/ ảnh, ghi chi từ két hoặc từ tiền của chủ.
- **BR-PUR-006** Công nợ: tổng tiền nhận hàng - đã trả; hạn thanh toán; cảnh báo đến hạn.
- **BR-PUR-007** Ngưỡng duyệt đơn mua theo giá trị (cấu hình).
- **BR-PUR-008** Giá NCC theo mặt hàng, lịch sử giá, so sánh giữa NCC.
- **BR-PUR-009** Chứng từ mua hàng (hoá đơn đầu vào) lưu ảnh/ file; **việc xử lý hoá đơn đầu vào/ thuế do kế toán, ngoài phạm vi** (ghi chú).

## 5. Vòng đời
PO: `draft -> approved -> sent -> partially_received -> received -> closed`; `cancelled`.

## 6. Màn hình
NCC, Đề nghị mua, Đơn mua, Nhận hàng, Mua nhanh, Công nợ, Thanh toán NCC.

## 7. Quyền
`supplier.manage`, `purchase.request`, `purchase.approve`, `purchase.receive`, `payable.manage`.

## 8. Ngoại lệ
- NCC giao thiếu/ dư: nhận thực tế, ghi chênh lệch.
- Hàng giao tới khi người phụ trách vắng: người khác nhận theo quyền, ghi lại.
- Giá thay đổi theo ngày (rau, hải sản): nhập giá tại lúc nhận.

## 9. Sự kiện
`po.approved`, `goods_received`, `payable.due_soon`.

## 10. Dữ liệu
`supplier, purchase_request, purchase_order(+line), goods_receipt(+line), supplier_payable, supplier_payment`.

## 11. Báo cáo
Chi mua theo NCC/ nhóm hàng, công nợ, biến động giá, thời gian giao hàng.

## 12. Câu hỏi mở
- Quán thực tế đặt hàng qua Zalo/ điện thoại? Có cần gửi PO tự động?
- Tỷ lệ mua tiền mặt không chứng từ?
- Chu kỳ công nợ NCC điển hình?

## 13. Phase
P2: NCC, đơn mua, nhận hàng, mua nhanh, công nợ. P3: gợi ý đặt hàng theo tiêu thụ.
