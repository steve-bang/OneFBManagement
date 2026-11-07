# Thuật ngữ

> Thuật ngữ dùng thống nhất trong mọi tài liệu. Tên tiếng Anh trong ngoặc là tên dùng trong code/API.

| Thuật ngữ | Định nghĩa |
|---|---|
| Tenant (Chủ thể kinh doanh) | Một khách hàng SaaS: một quán hoặc một chuỗi. Sở hữu một hoặc nhiều Store. |
| Store (Cửa hàng / chi nhánh) | Một điểm bán vật lý. Có địa chỉ, giờ mở cửa, menu, bàn, kho riêng. |
| Order (Đơn / Order) | Tập các món khách gọi trong một lần phục vụ, thuộc một bàn hoặc một kênh (mang về, giao). |
| Round (Lượt gọi) | Một lần gửi món xuống bếp/bar. Một order có nhiều round (khách gọi thêm). |
| Order item (Dòng món) | Một món trong order, kèm tuỳ chọn, số lượng, ghi chú, trạng thái chế biến. |
| Bill (Hoá đơn tạm tính / phiếu thanh toán) | Bản tổng hợp tiền khách phải trả. "In bill" = in phiếu tạm tính cho khách xem trước khi trả. Khác với hoá đơn điện tử (thuế). |
| Hoá đơn điện tử (HĐĐT, e-invoice) | Chứng từ thuế. Ngoài phạm vi giai đoạn đầu. |
| Phiếu bếp / Phiếu pha chế (Kitchen ticket) | Chứng từ chuyển món xuống một khu chế biến (in giấy hoặc hiện trên màn hình KDS). |
| Tem ly (Cup label) | Nhãn dán lên ly đồ uống mang đi/tại quán (tên món, đường/đá, topping). Phổ biến ở quán trà sữa, cà phê. |
| KDS (Kitchen Display System) | Màn hình bếp/bar hiển thị hàng đợi món, thay phiếu in. |
| Khu chế biến (Station) | Nơi làm món: bếp nóng, bếp lạnh, bar/pha chế, quầy bánh... |
| Bàn (Table) / Khu vực (Area) | Bàn phục vụ; khu vực như tầng 1, sân vườn, phòng lạnh. |
| Phiên bàn (Table session) | Khoảng thời gian một nhóm khách ngồi bàn, từ mở bàn đến thanh toán xong và dọn bàn. |
| Gộp bàn / Tách bàn / Chuyển bàn | Gộp nhiều bàn thành một order / tách món sang bàn khác / dời nguyên order sang bàn khác. |
| Tách bill (Split bill) | Chia một order thành nhiều lần thanh toán (theo món, theo đầu người hoặc theo số tiền). |
| Ca làm việc (Work shift) | Khoảng làm của nhân viên (sáng, chiều, tối). |
| Ca thu ngân (Cash shift) | Một phiên bán hàng của một thu ngân tại một quầy, từ mở ca (có tiền đầu ca) đến chốt ca. |
| Tiền đầu ca (Opening float) | Tiền mặt có sẵn trong két khi mở ca để thối lẻ. |
| Chốt ca / Kết ca | Đếm tiền, đối chiếu với hệ thống, ghi chênh lệch, bàn giao. |
| Thu chi (Cash in/out) | Khoản tiền mặt ra/vào két ngoài tiền bán hàng (mua đá, trả tiền ship...). |
| VietQR | Chuẩn mã QR chuyển khoản liên ngân hàng. Hệ thống sinh mã, thu ngân xác nhận tay đã nhận tiền. |
| Phương thức thanh toán | Tiền mặt, VietQR/chuyển khoản, thẻ (máy POS ngân hàng), ví điện tử, thanh toán qua app giao hàng, ghi nợ. |
| Phí dịch vụ (Service charge) | Khoản % cộng thêm vào bill (một số nhà hàng). Tuỳ chọn theo cửa hàng. |
| Phụ thu (Surcharge) | Khoản cộng thêm theo điều kiện (giờ cao điểm, ngày lễ, mang về...). |
| Tip (Boa) | Tiền thưởng từ khách cho nhân viên. Không phải doanh thu quán nếu chia lại 100% cho nhân viên (xem 02-vietnam-context). |
| Món hết (Sold out / 86) | Món tạm không bán do hết nguyên liệu. |
| Void (Huỷ món có trách nhiệm) | Huỷ một dòng món đã gửi bếp; cần lý do và quyền. Khác "xoá" món chưa gửi. |
| Hao hụt (Waste) | Nguyên liệu/thành phẩm mất đi do đổ vỡ, hỏng, làm sai, hết hạn. |
| Định lượng / Công thức (Recipe/BOM) | Lượng nguyên liệu trên một đơn vị món. |
| Giá vốn (COGS) | Chi phí nguyên liệu của món đã bán. |
| Role / Permission | Vai trò / quyền chi tiết (vd `order.void`). |
| Membership | Việc một người dùng tham gia một tenant/store với một vai trò. |
| Audit log | Nhật ký không sửa được về thao tác nhạy cảm. |
| Idempotency | Gửi lại cùng một yêu cầu không tạo ra bản ghi trùng. |
