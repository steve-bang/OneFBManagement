# Phân hệ 10. CRM & Khách hàng thân thiết (Phase 3)

## 1. Mục tiêu & người dùng
Nhận diện khách quen, tích điểm, ưu đãi, thu phản hồi. Cashier thao tác; Manager/Owner cấu hình.

## 2. Thuật ngữ riêng
Khách hàng, Điểm, Hạng thành viên, Voucher, Khuyến mãi, Phản hồi.

## 3. Quy trình chính
1. Khách đưa SĐT (hoặc nhập trên QR PWA, có đồng ý) -> tạo/ tìm hồ sơ.
2. Order gắn khách; khi `paid` cộng điểm theo quy tắc.
3. Dùng điểm/ voucher khi thanh toán.
4. Gửi voucher sinh nhật/ quay lại (kênh: SMS/Zalo ngoài phạm vi P3, chỉ hiển thị).
5. Khách đánh giá sau đơn.

## 4. Quy tắc nghiệp vụ
- **BR-CRM-001** Nhận diện khách theo **SĐT** duy nhất trong tenant (khách dùng chung cho mọi store).
- **BR-CRM-002** Thu SĐT chỉ khi có **đồng ý** ghi nhận thời điểm và mục đích (BR-QR-010; `02-vietnam-context.md`).
- **BR-CRM-003** Điểm cộng khi order `paid`, theo tỷ lệ trên doanh thu thuần (vd 10.000đ = 1 điểm); không cộng trên phần thanh toán bằng điểm/ voucher (cấu hình).
- **BR-CRM-004** Điểm có hạn dùng (cấu hình); hoàn điểm khi hoàn tiền tương ứng.
- **BR-CRM-005** Hạng thành viên theo chi tiêu 12 tháng; thăng/ giáng hạng định kỳ.
- **BR-CRM-006** Voucher: mã, loại (%/ số tiền/ tặng món), điều kiện (đơn tối thiểu, món, khung giờ), hạn, giới hạn lượt dùng; mỗi bill một voucher mặc định (cấu hình xếp chồng).
- **BR-CRM-007** Khuyến mãi tự động: mua X tặng Y, giảm theo khung giờ, combo; thứ tự áp dụng và loại trừ lẫn nhau được cấu hình; **áp dụng ở server**.
- **BR-CRM-008** Chống gian lận điểm: giới hạn cộng/ ngày, nhật ký, nhân viên không tự cộng điểm cho bản thân.
- **BR-CRM-009** Khách yêu cầu xoá dữ liệu: ẩn danh hoá (giữ đơn, xoá định danh).
- **BR-CRM-010** Phản hồi: điểm 1-5 + nhận xét; phản hồi thấp gửi cảnh báo cho Manager.

## 5. Vòng đời
Voucher: `draft -> active -> expired|exhausted`. Điểm: `earned -> redeemed|expired`.

## 6. Màn hình
Danh sách khách, Hồ sơ khách, Cấu hình điểm/ hạng, Voucher, Khuyến mãi, Phản hồi.

## 7. Quyền
`customer.view`, `customer.manage`, `loyalty.configure`, `voucher.manage`, `promotion.manage`, `feedback.view`.

## 8. Ngoại lệ
- Khách đổi SĐT: gộp hồ sơ có xác minh.
- Khách quên SĐT khi thanh toán: bổ sung điểm trong thời hạn (cấu hình) hoặc bỏ.
- Voucher dùng đồng thời trên hai thiết bị: server khoá lượt dùng.
- Khuyến mãi lỗi (cấu hình sai): tắt ngay; đơn đã áp dụng giữ nguyên.

## 9. Sự kiện
`customer.created`, `loyalty.earned/redeemed`, `voucher.redeemed`, `feedback.received`.

## 10. Dữ liệu
`customer, loyalty_account, loyalty_txn, tier, voucher, voucher_redemption, promotion, feedback`.

## 11. Báo cáo
Khách mới/ quay lại, tần suất, giá trị, hiệu quả voucher/ khuyến mãi, điểm lưu hành.

## 12. Câu hỏi mở
- Khách VN có sẵn sàng đưa SĐT để tích điểm không? Quán hiện đã có chương trình nào (thẻ giấy, Zalo OA)?
- Có cần tích hợp Zalo OA/ ZNS gửi tin?
- Quy tắc khuyến mãi thực tế quán đang chạy?

## 13. Phase
P3: toàn bộ. Cho phép gắn SĐT ở P2 nếu cần chuẩn bị dữ liệu.
