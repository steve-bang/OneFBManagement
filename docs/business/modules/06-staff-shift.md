# Phân hệ 06. Nhân sự & Ca làm (Phase 2)

## 1. Mục tiêu & người dùng
Hồ sơ nhân viên, xếp ca, chấm công, nghỉ phép, đổi ca, giao việc. Manager, Owner; nhân viên tự phục vụ.

## 2. Thuật ngữ riêng
Hồ sơ nhân viên, Vị trí (position), Ca mẫu, Lịch làm, Chấm công, Đổi ca, Nghỉ phép, Tăng ca, Đi muộn, Bảng công.

## 3. Quy trình chính
1. Tạo hồ sơ (sau khi mời ở Phân hệ 12): vị trí, loại hợp đồng (toàn thời gian/ bán thời gian), hình thức trả (giờ/ca/tháng).
2. Tạo ca mẫu; xếp lịch tuần (kéo/thả, sao chép tuần trước).
3. Nhân viên đăng ký/ xác nhận ca, xin đổi ca, xin nghỉ.
4. Chấm công vào/ra (nút trên app, có thể kèm vị trí/ mạng cửa hàng).
5. Quản lý duyệt, điều chỉnh công; chốt bảng công cuối kỳ -> xuất.

## 4. Quy tắc nghiệp vụ
- **BR-STF-001** Một nhân viên không có hai ca chồng giờ cùng store; cảnh báo xung đột giữa các store.
- **BR-STF-002** Chấm công: vào/ra, giờ thực tế vs giờ lịch; đi muộn quá N phút ghi cờ; thiếu chấm ra cần điều chỉnh bởi Manager (có lý do).
- **BR-STF-003** Ràng buộc chấm công: chỉ chấm trong cửa sổ quanh ca (vd -30/+60 phút) hoặc kết nối Wi-Fi/ vị trí quán (cấu hình). Chấm hộ là gian lận phổ biến: ghi thiết bị/ IP/ toạ độ để quản lý xem.
- **BR-STF-004** Đổi ca: hai bên đồng ý + Manager duyệt (cấu hình có thể tự duyệt).
- **BR-STF-005** Nghỉ phép: loại (phép năm, ốm, không lương), số dư phép theo chính sách quán; duyệt bởi Manager.
- **BR-STF-006** Tăng ca/ làm đêm/ ngày lễ: gắn cờ để kế toán áp hệ số theo Bộ luật Lao động; **hệ số cụ thể cấu hình và cần kế toán xác nhận**.
- **BR-STF-007** Bảng công xuất theo kỳ (tuần/ nửa tháng/ tháng); khoá kỳ sau khi chốt, chỉ Owner mở.
- **BR-STF-008** Hệ thống **không tính lương/ BHXH đầy đủ** ở P2; chỉ tính tạm: giờ công x đơn giá cho nhân viên theo giờ, để chủ tham khảo. Chốt sau khi kế toán xác nhận công thức.
- **BR-STF-009** Phân công nhiệm vụ: việc hằng ngày (checklist mở/ đóng quán), giao cho vị trí/ người, đánh dấu hoàn thành, ảnh minh chứng.
- **BR-STF-010** Đánh giá hiệu suất: chỉ số định lượng (số đơn, giá trị, void, chênh lệch quỹ, đánh giá khách) hiển thị cho Manager, **không tự động trừ lương**.
- **BR-STF-011** Dữ liệu nhạy cảm (CCCD, lương, tài khoản) bị hạn chế quyền xem (BR-ADM-014).
- **BR-STF-012** Nhân viên thử việc/ sinh viên có thể có hạn chế quyền mặc định (không giảm giá, không void).

## 5. Vòng đời
Lịch: `draft -> published`. Nghỉ/đổi ca: `pending -> approved|rejected`. Bảng công: `open -> locked -> exported`.

## 6. Màn hình
Danh sách nhân viên, Hồ sơ, Lịch làm tuần, Chấm công (nhân viên), Duyệt (đổi ca/ nghỉ/ công), Bảng công, Checklist.

## 7. Quyền
`staff.view`, `schedule.manage`, `attendance.self`, `attendance.adjust`, `leave.approve`, `timesheet.export`, `payroll.view`.

## 8. Ngoại lệ
- Nhân viên quên chấm ra: Manager điều chỉnh có lý do; hệ thống nhắc cuối ca.
- Ca thay đổi gấp trong ngày: thông báo đẩy cho người bị ảnh hưởng.
- Nhân viên bán thời gian đi làm bất thường theo ngày: lịch linh hoạt theo tuần.
- Nhân viên làm ở hai cửa hàng trong cùng ngày: kiểm tra chồng chéo.

## 9. Sự kiện
`schedule.published`, `attendance.checked_in/out`, `leave.requested/decided`.

## 10. Dữ liệu
`staff_profile, work_shift_template, schedule, attendance, shift_swap_request, leave_request, task, performance_review`.

## 11. Báo cáo
Giờ công, đi muộn, tăng ca, doanh thu theo nhân viên/ ca, tỷ lệ nghỉ.

## 12. Câu hỏi mở
- Quán chấm công bằng gì hiện nay (sổ, Zalo, vân tay)? Có chấp nhận chấm bằng app?
- Chính sách đi muộn/ phạt? (hệ thống chỉ ghi nhận, không tự phạt)
- Trả lương theo giờ/ca/tháng: tỷ lệ? Công thức tăng ca/ lễ cụ thể?
- Hợp đồng lao động/ BHXH có cần lưu trong hệ thống?

## 13. Phase
P2: hồ sơ, lịch, chấm công, nghỉ/đổi ca, bảng công. P3: đánh giá hiệu suất, tính lương tham khảo nâng cao.
