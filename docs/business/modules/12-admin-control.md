# Phân hệ 12. Quản trị & Kiểm soát (Phase 1: nền tảng; sau: nâng cao)

## 1. Mục tiêu & người dùng
Đăng ký tenant, cửa hàng, người dùng, vai trò, cấu hình, nhật ký, thông báo, phê duyệt. Owner/Manager.

## 2. Thuật ngữ riêng
Tenant, Store, Membership, Role, Permission, PIN, Audit log, Phê duyệt (approval), Cấu hình cửa hàng.

## 3. Quy trình chính
1. Chủ đăng ký (SĐT + OTP/email), tạo tenant, store đầu tiên.
2. Cấu hình store: tên, địa chỉ, giờ mở cửa, tài khoản nhận VietQR, thuế, phí dịch vụ, mẫu bill, máy in, ngưỡng giảm giá, chế độ QR.
3. Mời nhân viên (SĐT/ email) -> gán role + store -> nhân viên kích hoạt, đặt PIN.
4. Nhân viên đăng nhập (PIN trên thiết bị quầy; SĐT+mật khẩu/OTP trên điện thoại).
5. Thao tác nhạy cảm sinh audit log và yêu cầu duyệt (PIN) khi cần.
6. Quản lý thiết bị đã đăng nhập; thu hồi thiết bị.

## 4. Quy tắc nghiệp vụ
- **BR-ADM-001** Một người dùng nhận diện bằng SĐT (chính) hoặc email; một người có nhiều membership.
- **BR-ADM-002** Cô lập dữ liệu theo tenant; không có truy vấn xuyên tenant.
- **BR-ADM-003** Role hệ thống (Owner, Manager, Cashier, Waiter, Kitchen, Bartender, Stock keeper, Accountant) không xoá được; chủ có thể nhân bản và sửa permission.
- **BR-ADM-004** Phải còn ít nhất một Owner trong tenant.
- **BR-ADM-005** PIN 4–6 số, băm; khoá sau 5 lần sai (mở khoá bởi Manager); PIN duy nhất trong store.
- **BR-ADM-006** Phiên đăng nhập thiết bị quầy tự khoá sau N phút không dùng (cấu hình), mở bằng PIN.
- **BR-ADM-007** Nhân viên nghỉ việc: vô hiệu hoá membership, không xoá; lịch sử giữ nguyên (đơn, ca).
- **BR-ADM-008** **Audit log** bắt buộc cho: huỷ/void, giảm giá vượt ngưỡng, đổi giá, hoàn tiền, xác nhận thanh toán tay, mở két, sửa quyền/ role, thay đổi cấu hình tài khoản nhận tiền, xoá/ vô hiệu hoá nhân viên, chốt ca chênh lệch, in lại bill/phiếu. Log chỉ thêm, không sửa/xoá; lưu người, thiết bị, thời gian, trước/sau.
- **BR-ADM-009** Phê duyệt tại chỗ: người duyệt nhập PIN của chính họ; không dùng chung PIN; ghi cả người yêu cầu và người duyệt.
- **BR-ADM-010** Thay đổi cấu hình tài khoản ngân hàng nhận VietQR cần Owner và gửi cảnh báo (chống đổi tài khoản gian lận).
- **BR-ADM-011** Thông báo: loại, kênh (trong app, push, âm báo), người nhận theo vai trò/ store; người dùng tắt được loại không quan trọng.
- **BR-ADM-012** Múi giờ store (Asia/Ho_Chi_Minh mặc định); "ngày kinh doanh" có thể kết thúc sau nửa đêm (vd 04:00) cho quán đêm: cấu hình `business_day_cutoff`.
- **BR-ADM-013** Gói dịch vụ (SaaS plan) giới hạn số store/ người dùng/ tính năng (Phase 1: chưa tính phí, chỉ cờ tính năng).
- **BR-ADM-014** Dữ liệu cá nhân nhân viên (CCCD, tài khoản ngân hàng, lương) chỉ Owner/Accountant xem.
- **BR-ADM-015** Chủ yêu cầu xuất/ xoá dữ liệu: quy trình ghi nhận yêu cầu, thực hiện bởi quản trị hệ thống.

## 5. Vòng đời
Membership: `invited -> active -> suspended -> removed`.
Phê duyệt: `pending -> approved | rejected | expired`.
Tenant: `trial -> active -> suspended -> closed`.

## 6. Màn hình
Đăng ký/ đăng nhập, Chọn cửa hàng, Quản lý nhân viên, Vai trò & quyền, Cấu hình cửa hàng, Thiết bị, Nhật ký hoạt động, Thông báo, Phê duyệt chờ.

## 7. Quyền
`staff.manage`, `role.manage`, `store.settings.manage`, `audit.view`, `approval.decide`, `device.manage`, `tenant.billing.manage`.

## 8. Ngoại lệ
- Nhân viên mất điện thoại: Manager thu hồi phiên/ thiết bị.
- Quên PIN: Manager đặt lại; ghi log.
- Một người làm ở hai quán khác chủ: hai membership ở hai tenant; chọn tenant sau đăng nhập.
- Chủ muốn chuyển quyền sở hữu: quy trình chuyển Owner, có xác nhận hai bước.
- Quán đóng cửa nhiều ngày: không có ca, báo cáo ghi nhận ngày không doanh thu.

## 9. Sự kiện
`staff.invited`, `audit.logged`, `approval.requested/decided`, `device.revoked`.

## 10. Dữ liệu
`tenant, store, user, role, permission, role_permission, membership, audit_log, approval_request, notification, device`.

## 11. Báo cáo
Nhật ký theo người/ hành động, danh sách phê duyệt, hoạt động đăng nhập bất thường.

## 12. Câu hỏi mở
- Nhân viên dùng điện thoại cá nhân hay thiết bị chung của quán là chủ yếu?
- Chủ có muốn nhận cảnh báo ngay (push/Zalo/ SMS) khi có void/giảm giá/ chênh lệch lớn không?
- Quán đêm: giờ kết thúc ngày kinh doanh thường?

## 13. Phase
P1: tenant/store, nhân viên, role, PIN, audit cơ bản, cấu hình. P2: phê duyệt nâng cao, thông báo cho chủ. P3: đa chi nhánh, báo cáo giám sát, quản lý gói.
