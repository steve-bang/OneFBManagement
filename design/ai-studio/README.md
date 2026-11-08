# Chiến lược prompt: dựng giao diện OneFB bằng Google AI Studio

Bộ prompt để dán lần lượt vào **Google AI Studio (chế độ Build)** và để AI tự dựng giao diện **end to end** cho Phase 1, đúng nghiệp vụ trong `docs/business/` và đúng quy tắc thiết kế trong `docs/design/00-ui-design-rules.md`.

> Bộ prompt **chưa được thử trên Google AI Studio**. Hãy chạy bước 1 và 2 trước, kiểm tra kết quả, rồi mới đi tiếp. Tên menu, giới hạn độ dài và tính năng của AI Studio thay đổi theo thời gian, nên hãy theo giao diện thực tế bạn thấy.

## 1. Cách dùng nhanh

1. Mở Google AI Studio, tạo một ứng dụng mới ở chế độ Build.
2. Mở file `prompts/01-nen-tang.md`, **sao chép toàn bộ**, dán vào ô nhập, gửi.
3. Đợi AI chạy xong, **chạy thử ứng dụng**, kiểm tra theo danh sách "Tiêu chí nghiệm thu" ở cuối prompt (AI cũng tự báo Đạt/ Chưa đạt).
4. Đạt thì sang prompt tiếp theo. Không đạt thì dùng mẫu sửa lỗi trong `prompts/13-mau-sua-loi.md`.
5. Sau **mỗi bước đạt**, lưu một mốc (lưu phiên bản hoặc xuất ra GitHub nếu AI Studio cho phép) để quay lại nếu bước sau làm hỏng.

Mỗi file trong `prompts/` đã **tự chứa đủ ngữ cảnh** (hợp đồng thiết kế, bất biến nghiệp vụ, nghiệp vụ của bước, tiêu chí nghiệm thu, cách báo cáo). Bạn chỉ cần dán, không phải ghép thêm gì. Cũng có trang có nút sao chép: `prompts.html`.

## 2. Vì sao chia 12 bước

| Nguyên tắc | Lý do |
|---|---|
| Mỗi bước một phạm vi, có tiêu chí nghiệm thu | AI làm một yêu cầu quá lớn thường bỏ sót hoặc làm nửa vời. Nghiệm thu từng bước thì lỗi không dồn lại |
| Lặp lại "Ngữ cảnh cố định" ở đầu mỗi prompt | Cuộc trò chuyện dài làm AI quên quy tắc. Mỗi bước nạp lại hợp đồng thiết kế và bất biến nghiệp vụ |
| Token trước, component sau, màn hình sau cùng | Mọi màn hình dùng chung một nguồn màu và component, nên không lệch thiết kế |
| Nghiệp vụ nằm trong hàm thuần `src/domain/` | Tính tiền, quyền, trạng thái kiểm thử được độc lập với giao diện, và sau này chuyển sang React Native/ NestJS không phải viết lại |
| Mọi ghi dữ liệu đi qua `src/data/api.ts` | Sau này thay bằng API thật mà không đụng giao diện |
| Kịch bản nghiệm thu chạy tự động (bước 11) | Không phải tin lời AI "đã xong"; có bảng Đạt/ Không đạt |
| Rà soát thiết kế cuối (bước 12) | Bắt các vi phạm quy tắc đã tích tụ qua nhiều bước |

## 3. Lộ trình

| Bước | File | Nội dung | Phụ thuộc |
|---|---|---|---|
| 1 | `01-nen-tang` | Token, khung thiết bị, kiểu dữ liệu, store mock, seed, tiện ích | |
| 2 | `02-thanh-phan-ui` | Thư viện component và trang `/dev/ui` | 1 |
| 3 | `03-dang-nhap-phan-quyen` | Đăng nhập PIN, phân quyền theo ma trận, duyệt PIN, audit, quản trị cửa hàng | 1, 2 |
| 4 | `04-thuc-don-ban` | Thực đơn, sơ đồ bàn, đặt bàn, QR bàn | 3 |
| 5 | `05-pos-order` | POS, order, tính tiền, huỷ/ giảm giá/ tặng, bill | 4 |
| 6 | `06-bep-bar-kds` | KDS, gọi số, giao món, phiếu in, tem ly | 5 |
| 7 | `07-thanh-toan-ca-quy` | Thanh toán, tách bill, hoàn tiền, ca, thu/ chi | 5, 6 |
| 8 | `08-khach-qr` | Khách gọi món qua QR, nhân viên xác nhận đơn QR | 4, 5, 6, 7 |
| 9 | `09-bao-cao` | Báo cáo R01–R09 | 7 |
| 10 | `10-thong-bao-mat-mang` | Thông báo realtime, hàng đợi gửi lại, chịu lỗi mạng | 5–8 |
| 11 | `11-kiem-thu-kich-ban` | 24 kịch bản nghiệm thu chạy tự động, sửa lỗi | 1–10 |
| 12 | `12-ra-soat-thiet-ke` | Kiểm toán thiết kế, sửa vi phạm | 1–11 |
| | `13-mau-sua-loi` | Mẫu prompt sửa lỗi, đổi quy tắc, nạp lại ngữ cảnh, bàn giao | |

Thứ tự này theo luồng nghiệp vụ: nền tảng → quyền → hàng hoá và bàn → gọi món → bếp → thu tiền → khách tự gọi → báo cáo → độ tin cậy → kiểm thử → rà soát.

## 4. Quy trình cho mỗi bước

1. **Dán** nguyên prompt. Đừng cắt bớt, đừng gộp hai bước.
2. Đọc **kế hoạch** AI nêu (≤ 10 dòng). Nếu thấy AI định viết lại file cũ hoặc làm ngoài phạm vi, nhắn "Chỉ làm đúng phạm vi bước này".
3. Khi xong, đọc **báo cáo 3 phần**: file đã sửa, tự kiểm tra, quyết định mặc định đã tự chọn.
4. **Tự thử 5 việc** thay vì tin báo cáo: (a) app chạy không lỗi console, (b) làm một luồng chính từ đầu đến cuối, (c) thử một thao tác bị cấm (sai quyền), (d) đổi sang theme tối, (e) đổi thiết bị.
5. Xem **"quyết định mặc định"** AI đã tự chọn. Nếu sai với thực tế quán, dùng mẫu E (đổi quy tắc) ngay, đừng để dồn.
6. Lưu mốc, sang bước sau.

## 5. Khi có chuyện

| Tình huống | Làm gì |
|---|---|
| AI lệch hợp đồng (dùng màu hex, tự tạo nút, quên quyền) | Mẫu F trong `13-mau-sua-loi` |
| Có lỗi hiển thị hoặc logic | Mẫu A (lỗi chung) hoặc Mẫu B (vi phạm quy tắc nghiệp vụ) |
| AI làm hỏng thứ đã chạy | Quay lại mốc đã lưu, gửi lại prompt bước đó kèm câu "Giữ nguyên mọi thứ đã có" |
| Prompt bị cắt hoặc AI báo quá dài | Tách theo mục: gửi 1.1–1.3 trước, rồi 1.4–1.6; mỗi lần gửi kèm câu "Đây là phần x/y của bước n" |
| AI bỏ qua nghiệp vụ khó (tiền, ca) | Gửi lại riêng mục đó và yêu cầu viết kịch bản kiểm thử ở bước 11 trước khi sửa |

## 6. Những điều cần biết

- **Kết quả là bản mẫu chạy trên web** (React + TypeScript + mock data), không phải ứng dụng React Native hay hệ thống có backend. Logic nằm trong `src/domain/` để chuyển sang code thật sau (mẫu G trong `13-mau-sua-loi`).
- **Thanh toán, mã VietQR, chữ ký token QR, băm PIN đều là mô phỏng.** Không dùng cho tiền thật.
- Một số số mặc định **do mình đặt, chưa có xác nhận từ người trong nghề** (cần chốt theo mục "Câu hỏi mở" của `docs/business/17-phase1-scope.md`): bàn ngồi quá 90 phút thì cảnh báo, gọi nhân viên không ai nhận sau 3 phút thì leo thang, order mở quá 3 giờ không hoạt động thì cảnh báo, ngưỡng chênh lệch quỹ tự chấp nhận 20.000 ₫, ngưỡng giảm giá Cashier 10%.
- Ngưỡng chờ bếp theo `BR-KIT-003` là **10 phút cảnh báo, 15 phút quá hạn**. UI kit demo trong repo còn dùng 5 và 10 phút, bộ prompt dùng 10 và 15.
- Phạm vi chỉ là **Phase 1**. Kho, nhân sự, CRM, khuyến mãi tự động, hoá đơn điện tử, web admin nhiều chi nhánh bị loại có chủ đích trong "Ngữ cảnh cố định" để AI không tự làm thêm.
- Bạn nên thử bộ prompt với một người trong nghề (chủ quán, thu ngân) sau bước 7 và bước 8, vì đó là nơi nghiệp vụ nhạy nhất.

## 7. Cấu trúc thư mục

```
design/ai-studio/
  README.md            file này
  src/                 nguồn: _header.md, _footer.md, 01…13 (phần riêng của từng bước)
  prompts/             bản đã ghép sẵn, dán thẳng vào AI Studio
  prompts.html         trang có nút "Sao chép prompt" (bản dựng)
  tokens.css           CSS variables sinh từ tokens.json (đã nhúng trong prompt 01)
  build.js             ghép header + nội dung + footer, sinh prompts/, tokens.css, prompts.html
```

Sửa nội dung trong `src/`, rồi chạy `node design/ai-studio/build.js`. Không sửa trực tiếp file trong `prompts/`.

## 8. Tài liệu nguồn của bộ prompt

- Nghiệp vụ: `docs/business/modules/*.md`, `03-end-to-end-flows.md`, `13-notifications-and-realtime.md`, `14-permissions-matrix.md`, `15-reports-catalog.md`, `16-nonfunctional.md`, `17-phase1-scope.md`.
- Thiết kế: `docs/design/00-ui-design-rules.md`, `design/design-system/project/tokens.json`.
