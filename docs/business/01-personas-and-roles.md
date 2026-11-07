# Vai trò thực tế trong quán và cách hệ thống ánh xạ

## 1. Thực tế nhân sự ở quán F&B Việt Nam
- Quán nhỏ (cà phê, trà sữa, quán ăn gia đình, 1 cửa hàng): **một người kiêm nhiều việc**. Chủ vừa quản lý vừa thu ngân; nhân viên vừa phục vụ vừa pha chế.
- Quán vừa (20–60 bàn): tách thu ngân, phục vụ, bếp/bar, có quản lý ca.
- Chuỗi: quản lý khu vực, quản lý cửa hàng, kế toán/mua hàng ở văn phòng.
- Nhân viên **hay thay đổi, nhiều làm bán thời gian/sinh viên**: onboarding phải nhanh (vài phút), UI ít chữ, ít bước.
- Đa số nhân viên dùng điện thoại Android tầm trung; quầy/bếp dùng tablet Android hoặc máy POS.

=> Nguyên tắc: **một người có thể giữ nhiều vai trò** (membership có nhiều role), không giả định mỗi người một vai trò.

## 2. Vai trò hệ thống

| Role | Mô tả | Thiết bị chính | Gắn phạm vi |
|---|---|---|---|
| Owner (Chủ) | Toàn quyền tenant, thấy tài chính, quản lý nhân sự/quyền | Điện thoại, web admin sau này | Toàn tenant |
| Manager (Quản lý) | Điều hành cửa hàng: duyệt huỷ/giảm giá, xem báo cáo, quản lý bàn/menu/ca | Điện thoại, tablet | Một hoặc nhiều store |
| Cashier (Thu ngân) | Bán hàng, thanh toán, mở/chốt ca | Tablet quầy | Store |
| Waiter (Phục vụ) | Nhận bàn, gọi món, giao món, gọi hỗ trợ | Điện thoại | Store |
| Kitchen (Bếp) | Nhận và chế biến món theo station | Tablet/KDS | Store + station |
| Bartender (Pha chế) | Như Kitchen, station bar | Tablet/KDS | Store + station |
| Stock keeper (Thủ kho) | Nhập/xuất/kiểm kê (Phase 2) | Điện thoại | Store |
| Accountant (Kế toán) | Chỉ xem tài chính, thu chi, xuất báo cáo (Phase 2) | Web | Tenant |
| Customer (Khách) | Quét QR, gọi món, trả tiền | Trình duyệt điện thoại | Phiên bàn |

Vai trò tuỳ biến: chủ tạo thêm role (vd "Phụ trách ca", "Thu ngân + phục vụ") bằng cách chọn tập permission.

## 3. Điều hướng theo vai trò
Giữ như `docs/` gốc mục 6. Người nhiều vai trò thấy gộp các tab, có nút đổi "đang làm với tư cách".

## 4. Nguyên tắc phân quyền
1. Kiểm tra theo **permission**, không theo tên role.
2. Một số hành động cần **phê duyệt tại chỗ** bằng PIN của người có quyền cao hơn (giảm giá vượt ngưỡng, void món đã chế biến, mở két không bán hàng, sửa hoá đơn đã thanh toán). Đây là thực tế rất phổ biến: thu ngân đang đứng quầy, quản lý đi ngang nhập mã.
3. Người dùng đăng nhập thiết bị dùng chung bằng **PIN 4–6 số** (nhanh), điện thoại cá nhân dùng số điện thoại + OTP/mật khẩu.
4. Ma trận chi tiết: `14-permissions-matrix.md`.

## 5. Chân dung ngắn
- **Chủ quán nhỏ (35–50 tuổi)**: quan tâm "hôm nay bán bao nhiêu, còn tiền trong két không, ai làm sai". Ít kiên nhẫn với cấu hình.
- **Thu ngân (20–30)**: cần nhanh, không sai tiền, chốt ca khớp, không bị khách chờ.
- **Phục vụ sinh viên (18–24)**: học nhanh, dùng một tay, môi trường ồn, nhiều bàn cùng lúc.
- **Bếp/bar**: tay ướt/bẩn, màn hình xa, cần chữ to, âm báo, ít chạm.
- **Khách**: không muốn cài app, không muốn đăng ký, muốn gọi món và trả tiền nhanh; nhiều người lớn tuổi, nhiều khách nước ngoài (cân nhắc hỗ trợ tiếng Anh).
