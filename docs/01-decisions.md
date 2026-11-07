# 01. Quyết định sản phẩm đã chốt

| # | Hạng mục | Quyết định |
|---|---|---|
| 1 | Mô hình | SaaS multi-tenant (mỗi quán/chuỗi là một Tenant) |
| 2 | Quy mô | Đơn lẻ và chuỗi. Dữ liệu `Tenant → Store`; UI giai đoạn đầu chỉ một cửa hàng |
| 3 | QR khách | QR Web / PWA, không cần cài app |
| 4 | Thiết bị | Điện thoại: phục vụ, quản lý, chủ quán. Tablet: thu ngân, bếp (KDS) |
| 5 | Phạm vi | Thiết kế kiến trúc + mô hình dữ liệu đủ 12 phân hệ; xây theo Phase |
| 6 | Thanh toán | VietQR (chuyển khoản QR) + tiền mặt |
| 7 | Thị trường | Chỉ Việt Nam: VND, hóa đơn điện tử theo quy định thuế VN |

## Giả định (chưa được xác nhận, cần chốt)
- **Offline**: Phase 1 KHÔNG bắt buộc chạy offline hoàn toàn. Thiết kế sẵn nền tảng:
  UUID sinh ở client, API idempotent (`Idempotency-Key`), hàng đợi gửi lại. Offline đầy đủ cho POS để Phase 2+.
- **Đối soát VietQR**: VietQR chỉ sinh mã QR. Để biết "đã nhận tiền" cần nguồn xác nhận
  (webhook từ ngân hàng/đơn vị trung gian như payOS, SePay, Casso... hoặc thu ngân xác nhận tay).
  Cần chọn đơn vị trung gian; thiết kế dùng `PaymentProvider` interface để thay được.
- **Hóa đơn điện tử**: tích hợp qua nhà cung cấp HĐĐT (VNPT, Viettel, MISA, ...) theo Nghị định 123/2020 và
  Thông tư 78/2021 (và quy định mới hơn nếu có). Chưa chọn nhà cung cấp; dùng adapter.
- Tiền tệ lưu số nguyên VND (`bigint`), không dùng float.
