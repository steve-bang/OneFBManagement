# BƯỚC 12/12: RÀ SOÁT THIẾT KẾ VÀ HOÀN THIỆN

## Mục tiêu bước này
Tự kiểm toán toàn bộ giao diện theo hợp đồng thiết kế ở phần "Ngữ cảnh cố định" mục 3, rồi **sửa mọi vi phạm**. Không thêm tính năng mới. Không đổi hành vi nghiệp vụ đã qua kiểm thử ở bước 11 (chạy lại `/dev/scenarios` sau khi sửa, phải vẫn đạt).

## 12.1 Kiểm toán tự động bằng mã
Viết một script kiểm tra (chạy được bằng một lệnh hoặc một trang `/dev/audit`) và báo cáo:
1. **Màu viết tay**: tìm mã hex, `rgb()`, `hsl()` và tên màu trong `src/` (ngoài `tokens.css`). Mỗi lần xuất hiện là vi phạm trừ trường hợp có chú thích `design-exception:` kèm lý do.
2. **Thang gốc**: tìm việc dùng token gốc (`brand-`, `slate-`, `night-`, `orange-`, `green-`, `red-`, `amber-`, `blue-`, `pink-`, `cyan-` kèm số) trong component ngoài `src/design/` và biểu đồ.
3. **Giá trị px viết tay** cho khoảng cách, bo góc, cỡ chữ (ngoài kích thước vùng chạm từ `useDevice`).
4. **Nút**: mỗi màn hình có đúng một `Button variant="primary"` trong mỗi vùng; nút `danger` không phải nút mặc định/ nút được focus đầu tiên trong hộp xác nhận.
5. **Trạng thái chỉ bằng màu**: mọi hiển thị trạng thái phải qua `StatusPill` (có chấm + chữ); không tô màu nền thẻ để thay cho nhãn.
6. **`window.confirm/alert/prompt`**: không được dùng.
7. **`React` trong `src/domain/`**: không được import.
8. **Nút icon không có `aria-label`**; ô nhập không có nhãn; hình ảnh không có `alt`.
9. **Ô tương tác nhỏ hơn mức tối thiểu**: đo `getBoundingClientRect` của mọi `button, a, input, select, [role=button]` ở mỗi thiết bị, báo cáo cái nhỏ hơn 44px (điện thoại 48, POS 56, KDS 72).

## 12.2 Kiểm toán theo màn hình (làm lần lượt, ghi thành bảng)
Với **mỗi route** và **mỗi thiết bị áp dụng**, ở **cả sáng và tối**, kiểm tra và ghi **Đạt / Vi phạm (mã quy tắc)**:
- 6 trạng thái: tải, rỗng, dữ liệu, lỗi (có "Thử lại"), mất mạng (banner), không đủ quyền.
- Tương phản chữ ≥ 4.5:1, viền ô nhập/ icon/ focus ≥ 3:1 (dùng công thức tương phản WCAG trong script, đọc giá trị thật từ `getComputedStyle`).
- Focus ring thấy rõ; tab bằng bàn phím đi hết và đúng thứ tự; Esc đóng modal; trả focus khi đóng.
- Cỡ chữ hệ thống 130% không cắt chữ hay che nút; không cuộn ngang ở cấp trang ở mọi khung.
- Văn bản: nút nói đúng việc (không "OK/ Có"), lỗi nói rõ cách sửa, đúng thuật ngữ Việt (bàn, phiếu bếp, chốt ca, thu ngân), tiền qua `formatVnd`, số dùng chữ số đều.
- Hành động nguy hiểm: có xác nhận nêu hậu quả, có lý do, cần quyền cao thì có PIN; không dùng `window.confirm`.
- `prefers-reduced-motion`: tắt nháy và chuyển động trang trí.
- Hiệu năng: danh sách dài dùng phân trang hoặc ảo hoá; không render hàng nghìn phần tử một lúc.

## 12.3 Sửa và báo cáo
1. Liệt kê **toàn bộ vi phạm** theo bảng: route, thiết bị, theme, mã quy tắc, mô tả, file/ dòng.
2. Sửa **từng** vi phạm ở gốc (dùng token/ component đúng, không dùng ngoại lệ trừ khi thật sự cần).
3. Chạy lại script 12.1 và `/dev/scenarios` (bước 11); phải **0 vi phạm** và **24/24 Đạt**, hoặc nêu rõ cái còn lại và lý do.
4. Cập nhật trang `/dev/ui` để phản ánh mọi component và trạng thái thực tế đang dùng.

## Tiêu chí nghiệm thu
- [ ] Script kiểm toán chạy được và báo 0 màu viết tay, 0 token gốc sai chỗ, 0 `window.confirm`.
- [ ] Bảng kiểm toán theo màn hình có đủ mọi route × thiết bị × theme, và tất cả đều Đạt.
- [ ] Mọi vùng chạm đạt mức của thiết bị (đo thật, không đoán).
- [ ] Tương phản đạt ở cả hai theme (số đo thật trong báo cáo).
- [ ] `/dev/scenarios` vẫn 24/24 Đạt sau khi sửa.
- [ ] Mọi ngoại lệ còn lại được liệt kê kèm lý do.
