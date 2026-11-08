# MẪU PROMPT CHO VIỆC SỬA LỖI VÀ ĐIỀU CHỈNH (dùng sau khi đã làm xong các bước)

Dán nguyên khối, thay phần trong `[...]`. Các mẫu này **không** kèm "Ngữ cảnh cố định" vì Google AI Studio vẫn giữ ngữ cảnh dự án; nếu trợ lý có vẻ quên quy tắc, dùng mẫu F để nạp lại.

## Mẫu A: sửa lỗi hiển thị hoặc hành vi
```
Có lỗi ở [route/ màn hình], thiết bị [điện thoại/ tablet/ KDS/ web admin], theme [sáng/ tối/ cả hai].
Hiện tượng: [mô tả cụ thể, bước tái hiện 1-2-3].
Mong đợi: [mô tả đúng theo quy tắc, ghi mã BR/ UI nếu biết].
Yêu cầu:
1. Tìm nguyên nhân gốc, nêu trong 3 dòng trước khi sửa.
2. Sửa ở gốc, không vá bằng cách thêm trường hợp riêng.
3. Không đổi hành vi ở màn hình khác. Nếu phải sửa file dùng chung, liệt kê các màn hình bị ảnh hưởng và kiểm tra lại.
4. Chạy lại /dev/scenarios, báo kịch bản nào đổi trạng thái.
Báo cáo: nguyên nhân, file đã sửa, cách tôi kiểm tra lại.
```

## Mẫu B: vi phạm nghiệp vụ
```
Hệ thống đang vi phạm quy tắc [mã BR, ví dụ BR-ORD-005] ở [màn hình].
Hiện tượng: [ví dụ: Waiter huỷ được món đang chế biến mà không cần PIN].
Quy tắc đúng: [chép lại câu quy tắc].
Yêu cầu: sửa ở tầng domain/ api để **không thể** vi phạm dù đi đường nào (không chỉ ẩn nút). Thêm một kịch bản mới vào /dev/scenarios tái hiện lỗi này và chứng minh đã sửa. Giữ nguyên các kịch bản K01–K24.
```

## Mẫu C: thay đổi nhỏ về giao diện
```
Ở [màn hình], thay đổi: [mô tả].
Ràng buộc: chỉ dùng token ngữ nghĩa và component hiện có; không thêm màu mới; giữ vùng chạm theo thiết bị; giữ đủ 6 trạng thái; hoạt động ở sáng và tối.
Chỉ sửa các file cần thiết, liệt kê trước khi sửa. Không sửa gì ngoài phạm vi này.
```

## Mẫu D: thêm trạng thái/ mẫu còn thiếu
```
Thêm component/ trạng thái còn thiếu: [ví dụ: ErrorState có nút Thử lại cho bảng báo cáo].
Thêm vào src/design/components/, đưa vào /dev/ui (sáng và tối, 4 thiết bị), rồi áp dụng vào [các màn hình cần dùng]. Không tạo bản sao ở nơi khác.
```

## Mẫu E: thay đổi quy tắc nghiệp vụ
```
Quy tắc [mã BR] đổi thành: [nội dung mới].
Yêu cầu: (1) sửa hàm domain liên quan, (2) cập nhật mọi màn hình/ nhãn/ thông báo phụ thuộc, (3) cập nhật seed nếu cần, (4) cập nhật các kịch bản /dev/scenarios bị ảnh hưởng và nêu rõ vì sao đổi, (5) liệt kê mọi nơi bạn đã sửa.
```

## Mẫu F: nạp lại ngữ cảnh khi trợ lý lệch hướng
```
Dừng lại. Bạn đang lệch khỏi hợp đồng của dự án. Đọc lại và tuân thủ:
- Chỉ dùng token ngữ nghĩa trong src/design/tokens.css; không màu hex, không thang gốc trong component.
- Chỉ dùng component trong src/design/components/; không tự tạo nút, modal, pill riêng.
- Một nút chính mỗi vùng; trạng thái luôn có chữ + chấm, không chỉ màu; đủ 6 trạng thái màn hình.
- Logic nghiệp vụ nằm trong src/domain (hàm thuần, không import React); mọi ghi dữ liệu qua src/data/api.ts với idempotencyKey; mọi hành động đi qua can() và ghi audit khi nhạy cảm.
- Không xoá dữ liệu giao dịch; snapshot giá; một bàn một order mở; closed không sửa.
- Không làm tính năng ngoài Phase 1.
Hãy liệt kê những chỗ bạn đã lệch ở bước vừa rồi, rồi sửa. Chưa làm gì khác.
```

## Mẫu G: bàn giao sang code thật
```
Chuẩn bị bàn giao sang kiến trúc thật (React Native + Expo cho nhân viên/ tablet, React PWA cho khách, NestJS + PostgreSQL phía máy chủ).
Yêu cầu, không đổi hành vi hiện có:
1. Liệt kê mọi hàm trong src/data/api.ts thành một bảng hợp đồng API (tên, đầu vào, đầu ra, lỗi, quyền cần có, có idempotencyKey hay không).
2. Liệt kê mọi sự kiện eventBus (tên, payload, người nhận).
3. Đảm bảo src/domain không phụ thuộc React hay trình duyệt, ghi các chỗ còn phụ thuộc.
4. Xuất tokens.css và danh sách component kèm props thành tài liệu ngắn.
Xuất kết quả dưới dạng file markdown trong docs/handoff/ của dự án.
```
