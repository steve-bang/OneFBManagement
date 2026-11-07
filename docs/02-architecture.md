# 02. Kiến trúc hệ thống

```
 Customer PWA (QR)   Staff/Owner App (RN+Expo, phone)   POS/KDS (RN+Expo, tablet)   Web Admin (Next.js, Phase 4)
        \                         |                              |                          /
         +------------------------+------- HTTPS / WebSocket -----+-------------------------+
                                  |
                          NestJS API (modular monolith)
        Auth/RBAC | Orders | Tables | Menu | Kitchen | Inventory | Payments | ...
              |            |              |                |
         PostgreSQL      Redis        S3-compatible     Integrations
       (RLS theo tenant) (cache,queue,  (ảnh, tài liệu)  VietQR/payment, e-invoice,
                          pub/sub)                        printer, FCM/APNs
```

## Nguyên tắc
1. **Modular monolith** NestJS, mỗi phân hệ một module, giao tiếp qua service + domain event. Tách service sau nếu cần.
2. **Multi-tenant**: mọi bảng nghiệp vụ có `tenant_id` (và `store_id` nếu theo chi nhánh).
   Cô lập bằng PostgreSQL Row-Level Security (`SET app.tenant_id` mỗi request) cộng kiểm tra ở tầng service.
3. **RBAC**: `Membership(user, tenant, store?) → Role → Permission`. Một user có thể thuộc nhiều tenant/store với vai trò khác nhau. Kiểm tra theo permission, không theo tên vai trò.
4. **Backend là nguồn chân lý**: client không tự tính tiền/tồn kho. Giá, khuyến mãi, thuế tính ở server; đơn lưu **snapshot** giá/tên món tại thời điểm đặt.
5. **Realtime**: WebSocket (Socket.IO) room theo `store:{id}`, `table:{id}`, `station:{id}`; Redis pub/sub để scale ngang. Sự kiện: `order.created`, `order_item.status_changed`, `table.status_changed`, `payment.confirmed`, `staff.called`.
6. **Event-driven nội bộ**: `payment.confirmed` → ghi sổ quỹ, trừ kho (BullMQ job), cộng điểm, xuất HĐĐT. Job idempotent, có retry.
7. **Idempotency & tiền**: mọi lệnh ghi quan trọng nhận `Idempotency-Key`. Thanh toán VietQR giai đoạn đầu: thu ngân xác nhận tay (có audit log); sau này thêm webhook + job đối soát qua `PaymentProvider`.
8. **Audit log** append-only cho thao tác nhạy cảm (huỷ món, giảm giá, hoàn tiền, đổi giá, sửa quyền, chênh lệch quỹ).
9. **QR bàn**: URL `https://<domain>/t/<signed_token>` -> token ký (HMAC) gắn `store+table`, có thể xoay (rotate) khi bị lạm dụng. Phiên khách (`table_session`) cho phép nhiều khách cùng đặt trên một bàn.
10. **Hợp đồng API**: REST + OpenAPI, sinh type cho client; versioning `/v1`.

## Stack
React Native + Expo (staff/tablet), PWA React/Next (customer), NestJS, PostgreSQL, Redis + BullMQ, Socket.IO, S3-compatible, FCM/APNs.

## Cấu trúc repo đề xuất (monorepo)
```
apps/api            NestJS
apps/mobile         Expo (staff, owner, POS, KDS theo role/thiết bị)
apps/customer-web   PWA khách QR
apps/admin-web      Next.js (Phase 4)
packages/shared     types, zod schema, hằng số permission
docs/
```

## Trạng thái cốt lõi
- **Order**: `draft → submitted → in_progress → ready → served → (paid) → closed`; `cancelled`.
- **OrderItem**: `pending → accepted → preparing → ready → served`; `cancelled | voided | out_of_stock`.
- **Table**: `available | reserved | occupied | needs_payment | cleaning`.
- **Payment**: `pending → confirmed | failed | expired`; `refunded`.

## Tình huống thực tế -> cách xử lý
| Tình huống | Xử lý |
|---|---|
| Đặt thêm món sau khi gửi | Order mở; thêm `order_round` mới, mỗi round gửi bếp riêng |
| Hai khách cùng bàn đặt | Chung `table_session`/order; mỗi item ghi `placed_by` |
| Thanh toán một phần/chia bill | `Payment` nhiều dòng trên một order; `bill_split` theo item hoặc số tiền |
| Huỷ món khi bếp đã làm | Cần quyền + lý do; item thành `voided`, ghi hao hụt, audit log |
| Chuyển bàn | Đổi `order.table_id`, lưu `table_transfer`; lịch sử order giữ nguyên |
| Khách báo đã chuyển khoản | Thu ngân kiểm tra tài khoản rồi xác nhận tay; `pending` không tự huỷ khi chưa có người xử lý |
| Bếp báo hết món | Item `out_of_stock`, thông báo phục vụ + khách; menu tự đánh dấu tạm hết |
