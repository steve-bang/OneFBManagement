# Bối cảnh vận hành và pháp lý Việt Nam

> **Cảnh báo sử dụng**: phần pháp lý/thuế là tổng hợp từ nguồn thứ cấp (tin tức, bài của nhà cung cấp phần mềm), chưa đối chiếu văn bản gốc. Mỗi mục có nhãn:
> **[N]** = thông tin từ nguồn thứ cấp, cần kế toán/luật sư xác nhận. **[V]** = thói quen vận hành, cần xác nhận với người trong nghề.
> Hệ thống phải **cấu hình được** các thông số này, không hard-code.

## 1. Loại hình kinh doanh
- Phần lớn quán nhỏ là **hộ kinh doanh**; chuỗi lớn thường là **doanh nghiệp**. [V]
- Từ 2026 thuế khoán bị bãi bỏ; hộ kinh doanh chuyển sang tự kê khai theo doanh thu, kê khai điện tử, phải khai tài khoản ngân hàng/ví dùng kinh doanh. (Nghị quyết 198/2025/QH15; Nghị định 68/2026/NĐ-CP) [N]
- Ngưỡng doanh thu và nhóm kê khai các nguồn chưa thống nhất (500 triệu hay 1 tỷ). **Không đưa số cứng vào hệ thống**; hệ thống chỉ cần xuất **doanh thu theo kỳ** đúng phương thức thanh toán để chủ/kế toán kê khai. [N]
- Hệ quả thiết kế: báo cáo doanh thu theo ngày/tháng/quý, tách theo phương thức thanh toán (tiền mặt, chuyển khoản…); `tenant.business_type` (hộ KD/doanh nghiệp) là cấu hình.

## 2. Hoá đơn
- Hộ/doanh nghiệp bán lẻ dịch vụ ăn uống phải dùng hoá đơn điện tử, có loại **khởi tạo từ máy tính tiền** kết nối cơ quan thuế khi đủ điều kiện. Khách chỉ có thông tin người mua trên hoá đơn khi yêu cầu. (Nghị định 123/2020 sửa đổi bởi Nghị định 70/2025) [N]
- **Quyết định dự án**: chưa triển khai HĐĐT ở giai đoạn đầu. Hệ thống phải:
  - lưu đủ dữ liệu để sau này xuất HĐĐT (mặt hàng, thuế suất, tổng tiền, thời điểm, phương thức);
  - cho phép đánh dấu "khách yêu cầu xuất hoá đơn" + thu thập MST/tên công ty (lưu để xử lý sau);
  - **bill tạm tính/phiếu thanh toán không phải hoá đơn thuế**; in rõ dòng "Phiếu thanh toán, không có giá trị xuất hoá đơn".

## 3. Thuế GTGT (VAT)
- Dịch vụ ăn uống thuế suất 10%; giảm còn 8% trong giai đoạn 01/07/2025 đến hết 31/12/2026 nếu không thuộc nhóm loại trừ. (Nghị định 174/2025/NĐ-CP) [N]
- Hộ kinh doanh nộp thuế theo tỷ lệ % doanh thu thay vì khấu trừ VAT; doanh nghiệp theo phương pháp khấu trừ có thể khác. [N]
- Thói quen: **giá niêm yết đã bao gồm VAT** (khách thấy giá nào trả giá đó). [V]
- Thiết kế: `product.tax_rate` (có thể 0), `store.price_includes_tax` (mặc định true), `tenant.tax_regime`. Bill hiển thị: tổng cộng; chi tiết thuế chỉ khi bật. Thuế suất áp theo **ngày bán**, có lịch sử thay đổi (vì mức giảm hết hạn cuối 2026).

## 4. Thanh toán
- Phương thức phổ biến: tiền mặt, **chuyển khoản qua QR (VietQR/app ngân hàng)** rất phổ biến, ví MoMo/ZaloPay, thẻ qua máy POS ngân hàng riêng, app giao hàng. [V]
- VietQR động: số tiền + nội dung chuyển khoản (mã bill) điền sẵn; khách quét bằng app ngân hàng. **Hệ thống chỉ sinh QR; thu ngân kiểm tra tài khoản/loa báo tiền và xác nhận.** (quyết định dự án)
- Rủi ro thực tế: khách đưa ảnh chụp màn hình chuyển khoản giả. Quy tắc: thu ngân đối chiếu với **app ngân hàng của quán/loa**, không chỉ tin ảnh khách. Ghi `confirmed_by`.
- Tiền mặt VND: không có xu; thối lẻ theo bội 1.000đ hoặc 500đ; làm tròn tuỳ cấu hình (mặc định không làm tròn trên bill, làm tròn khi tính tiền mặt nếu bật).
- Trả bằng nhiều phương thức cho một bill (một phần tiền mặt, một phần chuyển khoản) rất thường gặp.
- Tài khoản ngân hàng kinh doanh của hộ KD phải khai báo cho cơ quan thuế. [N] Hệ thống lưu tài khoản nhận tiền theo store để sinh VietQR.

## 5. Dữ liệu cá nhân
- Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và Nghị định 356/2025/NĐ-CP, hiệu lực 01/01/2026, thay Nghị định 13/2023. Số điện thoại thuộc dữ liệu cá nhân; thu thập phải có đồng ý rõ ràng, mục đích cụ thể. [N]
- Thiết kế:
  - Khách **không bắt buộc** nhập SĐT để gọi món/ trả tiền; SĐT chỉ cần cho tích điểm/ưu đãi và có **ô đồng ý** (không tick sẵn).
  - Lưu `consent_at`, `consent_purpose`; cho khách xem/xoá dữ liệu (yêu cầu qua cửa hàng).
  - Nhân viên: CCCD, lương, tài khoản ngân hàng là dữ liệu nhạy cảm, hạn chế quyền xem (chỉ Owner/Kế toán).
  - Không chụp/lưu ảnh khách; nếu chấm công bằng khuôn mặt, đó là dữ liệu sinh trắc học, **ngoài phạm vi**.
- Doanh nghiệp nhỏ có thể được miễn một số nghĩa vụ trong 5 năm đầu; cần tư vấn pháp lý. [N]

## 6. Lao động và nhân sự
- Theo Bộ luật Lao động: giờ làm bình thường, tăng ca, làm đêm, nghỉ phép, hợp đồng, BHXH. Quán thực tế dùng nhiều lao động bán thời gian trả **theo giờ hoặc theo ca**. [V][N]
- Phần mềm giai đoạn đầu **không tính lương đầy đủ/BHXH**; chỉ ghi giờ công, ca, tăng ca, đi muộn, nghỉ có phép, để xuất bảng công cho chủ/kế toán. Chốt công thức lương là Phase 2 và phải xác nhận với kế toán.
- Tip: chia tip tuỳ quán (chia đều/tỷ lệ/theo ca). Hệ thống ghi nhận tip tuỳ chọn và cho cấu hình quy tắc chia. Ảnh hưởng thuế/thu nhập cá nhân chưa xác minh. [N]

## 7. An toàn thực phẩm và kho
- Cần truy xuất nguyên liệu: lô, hạn dùng, nhà cung cấp; nguyên tắc nhập trước xuất trước (FIFO/FEFO); ghi hao hụt/huỷ hết hạn. [V]
- Đơn vị tính thực tế: kg, g, lít, ml, chai, lon, thùng, bó, quả; có **quy đổi đơn vị** (nhập thùng, dùng chai, pha chế theo ml).
- Nguyên liệu tươi (rau, thịt, hải sản) hao hụt tự nhiên khi sơ chế (tỷ lệ thành phẩm); công thức cần tính **tỷ lệ hao hụt sơ chế**.

## 8. Đặc thù vận hành F&B Việt Nam
- **Hai mô hình dịch vụ khác nhau, cần hỗ trợ cả hai**:
  1. *Phục vụ tại bàn* (quán ăn, cà phê ngồi): gọi món theo bàn, thanh toán cuối hoặc trả trước tuỳ quán.
  2. *Gọi tại quầy* (trà sữa, cà phê take-away, bánh mì): khách đặt ở quầy, trả trước, nhận **số thứ tự/ tên/ tem ly**; không có bàn. [V]
- **In ấn quan trọng**: phiếu bếp in giấy vẫn rất phổ biến; tem ly cho đồ uống; bill tạm tính; máy in nhiệt 58/80mm, nhiều quán nhiều máy in (quầy, bếp, bar). [V]
- **Tuỳ chọn đồ uống** chi tiết: size (M/L), mức đường (0/30/50/70/100%), mức đá, topping (trân châu, thạch...), mỗi cái có giá cộng thêm và ảnh hưởng định lượng. [V]
- **Gọi thêm liên tục**, khách đổi ý giữa chừng, **bàn đông dịp lễ/cuối tuần**, ghép bàn ngoài tiệc/ nhậu. [V]
- Món theo **cân/ theo con** (hải sản, lẩu), giá thay đổi theo ngày: cho phép nhập số lượng thập phân, giá tại thời điểm. [V]
- Món **tặng/ khuyến mãi mua 1 tặng 1/ combo**, **món nhân viên**, **món thử**: cần cách ghi nhận có lý do, không tính doanh thu hoặc tính giá 0 nhưng vẫn trừ kho.
- **Khuyến mãi theo khung giờ** (happy hour), theo ngày lễ.
- **Ghi nợ/ khách quen** ở quán truyền thống: cần cân nhắc, mặc định tắt, bật với quyền. [V]
- **Đặt cọc** khi đặt bàn tiệc nhóm lớn. [V]
- **App giao hàng** (GrabFood, ShopeeFood, BeFood): đơn đến từ tablet riêng của đối tác, quán phải nhập lại vào POS; doanh thu qua đối tác có phí hoa hồng và đối soát theo kỳ. Phase 1: nhập tay kênh "đơn app giao hàng"; tích hợp tự động để sau. [V]
- Mạng internet quán **không ổn định**; mất điện/mất mạng làm gián đoạn; cần chịu lỗi tối thiểu (xem `16-nonfunctional.md`).
- Ngôn ngữ giao diện: **tiếng Việt chính**, có tiếng Anh cho menu khách (khách du lịch). Tiền hiển thị `45.000 ₫` (dấu chấm ngăn nghìn, khoảng trắng không ngắt trước ₫).

## 9. Việc phải xác nhận với người trong nghề (danh sách tổng)
Xem mục "Câu hỏi mở" trong từng module và tổng hợp ở `17-phase1-scope.md`.
