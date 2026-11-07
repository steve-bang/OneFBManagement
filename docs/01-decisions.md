# 01. Quyết định sản phẩm đã chốt

| # | Hạng mục | Quyết định |
|---|---|---|
| 1 | Mô hình | SaaS multi-tenant (mỗi quán/chuỗi là một Tenant) |
| 2 | Quy mô | Đơn lẻ và chuỗi. Dữ liệu `Tenant → Store`; UI giai đoạn đầu chỉ một cửa hàng |
| 3 | QR khách | QR Web / PWA, không cần cài app |
| 4 | Thiết bị | Điện thoại: phục vụ, quản lý, chủ quán. Tablet: thu ngân, bếp (KDS) |
| 5 | Phạm vi | Thiết kế kiến trúc + mô hình dữ liệu đủ 12 phân hệ; xây theo Phase |
| 6 | Thanh toán | VietQR (thu ngân xác nhận thủ công đã nhận tiền) + tiền mặt |
| 7 | Thị trường | Chỉ Việt Nam: VND, hóa đơn điện tử theo quy định thuế VN |

## Giả định (chưa được xác nhận, cần chốt)
- **Offline**: Phase 1 KHÔNG bắt buộc chạy offline hoàn toàn. Thiết kế sẵn nền tảng:
  UUID sinh ở client, API idempotent (`Idempotency-Key`), hàng đợi gửi lại. Offline đầy đủ cho POS để Phase 2+.
- **Đối soát VietQR (đã chốt)**: hệ thống chỉ sinh mã VietQR (số tiền + nội dung chuyển khoản theo mã đơn).
  Thu ngân tự đối chiếu tiền vào tài khoản rồi bấm "Xác nhận đã nhận tiền". Phase 1 không tích hợp webhook ngân hàng.
  Thiết kế giữ `PaymentProvider` interface để sau này gắn payOS/SePay/Casso mà không đổi nghiệp vụ.
  Mọi lần xác nhận tay ghi `confirmed_by` + audit log.
- **Hóa đơn điện tử (NOTE, tạm bỏ qua)**: chưa triển khai trong giai đoạn đầu. Cần làm khi vận hành thực tế theo
  quy định thuế VN (tham khảo Nghị định 123/2020, Thông tư 78/2021; cần kế toán/nhà cung cấp xác nhận lại).
  Bảng `e_invoice` và adapter nhà cung cấp chỉ là chỗ dành sẵn, chưa build.
- Tiền tệ lưu số nguyên VND (`bigint`), không dùng float.
