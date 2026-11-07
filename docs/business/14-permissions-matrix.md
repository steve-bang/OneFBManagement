# Ma trận phân quyền

Ký hiệu: **✔** mặc định cho phép, **P** cho phép nếu có phê duyệt tại chỗ (PIN người có quyền), **O** tuỳ cấu hình store, **-** không.
Owner luôn ✔ trong tenant của mình. Chủ có thể nhân bản role và sửa.

| Permission | Owner | Manager | Cashier | Waiter | Kitchen/Bar | Stock | Accountant |
|---|---|---|---|---|---|---|---|
| menu.read | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| menu.manage | ✔ | ✔ | - | - | - | - | - |
| menu.price.update | ✔ | O | - | - | - | - | - |
| menu.soldout.toggle | ✔ | ✔ | ✔ | O | ✔ | - | - |
| table.view / table.open | ✔ | ✔ | ✔ | ✔ | - | - | - |
| table.transfer / merge / split | ✔ | ✔ | ✔ | ✔ | - | - | - |
| table.manage (sơ đồ, QR) | ✔ | ✔ | - | - | - | - | - |
| reservation.manage | ✔ | ✔ | ✔ | ✔ | - | - | - |
| order.create / update / send | ✔ | ✔ | ✔ | ✔ | - | - | - |
| order.cancel_item.unsent | ✔ | ✔ | ✔ | ✔ | - | - | - |
| order.cancel_item (đã gửi, chưa làm) | ✔ | ✔ | ✔ | ✔ | - | - | - |
| order.void (đã làm) | ✔ | ✔ | P | P | - | - | - |
| order.discount.apply (≤ ngưỡng) | ✔ | ✔ | ✔ | - | - | - | - |
| order.discount.over_limit | ✔ | ✔ | P | - | - | - | - |
| order.comp (tặng) | ✔ | ✔ | P | - | - | - | - |
| qr.order.confirm | ✔ | ✔ | ✔ | ✔ | - | - | - |
| kitchen.view / update_status | ✔ | ✔ | - | - | ✔ (station mình) | - | - |
| kitchen.report_issue | ✔ | ✔ | - | ✔ | ✔ | - | - |
| payment.create | ✔ | ✔ | ✔ | O | - | - | - |
| payment.confirm (VietQR) | ✔ | ✔ | ✔ | - | - | - | - |
| payment.refund | ✔ | ✔ | P | - | - | - | - |
| cash.shift.open / close | ✔ | ✔ | ✔ | - | - | - | - |
| cash.shift.close_other | ✔ | ✔ | - | - | - | - | - |
| cash.movement.create (thu/chi) | ✔ | ✔ | ✔ | - | - | - | ✔ (xem) |
| cash.drawer.open (không bán) | ✔ | ✔ | P | - | - | - | - |
| cash.variance.approve | ✔ | ✔ | - | - | - | - | - |
| inventory.view | ✔ | ✔ | - | - | - | ✔ | ✔ |
| inventory.receive / adjust / waste / stocktake | ✔ | ✔ | - | - | - | ✔ | - |
| recipe.manage / cost.view | ✔ | O | - | - | - | - | ✔ |
| purchase.request | ✔ | ✔ | - | - | - | ✔ | - |
| purchase.approve | ✔ | O | - | - | - | - | - |
| purchase.receive | ✔ | ✔ | - | - | - | ✔ | - |
| staff.manage | ✔ | O | - | - | - | - | - |
| role.manage | ✔ | - | - | - | - | - | - |
| schedule.manage | ✔ | ✔ | - | - | - | - | - |
| attendance.self | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | - |
| attendance.adjust / leave.approve | ✔ | ✔ | - | - | - | - | - |
| payroll.view | ✔ | - | - | - | - | - | ✔ |
| report.sales.view | ✔ | ✔ | O (ca mình) | - | - | - | ✔ |
| report.profit.view | ✔ | O | - | - | - | - | ✔ |
| report.export | ✔ | O | - | - | - | - | ✔ |
| expense.manage | ✔ | ✔ | - | - | - | - | ✔ |
| customer.view / manage | ✔ | ✔ | ✔ (xem/ gắn) | - | - | - | - |
| voucher.manage / promotion.manage | ✔ | O | - | - | - | - | - |
| audit.view | ✔ | O | - | - | - | - | ✔ |
| store.settings.manage | ✔ | O | - | - | - | - | - |
| approval.decide | ✔ | ✔ | - | - | - | - | - |
| device.manage | ✔ | ✔ | - | - | - | - | - |

## Quy tắc
1. **Phạm vi**: permission gắn với phạm vi (tenant hoặc store). Manager chi nhánh A không thấy chi nhánh B.
2. **Tách quyền tiền** (maker-checker): người tạo yêu cầu hoàn/ giảm vượt ngưỡng không tự duyệt.
3. **PIN duyệt (P)**: người duyệt phải có permission tương ứng; ghi audit với cả hai người.
4. Quyền xem tài chính (`report.profit.view`, `payroll.view`) tách khỏi quyền vận hành.
5. Nhân viên thử việc: role mặc định hạn chế (Waiter/ Cashier không có discount, void).
6. Mọi thay đổi role/permission là sự kiện audit.
