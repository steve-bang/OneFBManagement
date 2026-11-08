# Thiết kế: token và UI kit

Mã nguồn của hai artifact "OneFB Design Tokens" và "OneFB UI Kit". Quy tắc dùng xem `docs/design/00-ui-design-rules.md`.

## Cấu trúc

```
design/
  design-system/
    project/
      tokens.json          Bộ token (nguồn sự thật): màu 2 theme, chữ, khoảng cách, bo góc, bóng, gradient, z-index
      README.md            Sách thương hiệu: nguyên tắc, quy ước đặt tên, quy tắc dùng token
      components/          Ví dụ xem trực tiếp: Button, TableCard, KdsTicket, PinPad, KpiCard, Cover
      design-system.json   Chỉ mục của artifact
    build.js               Sinh tokens.json, design-system.json và Cover
    check-contrast.js      Kiểm tra tương phản các cặp bg-*/text-* ở cả hai theme
  ui-kit/
    kit.src.html           Nguồn của UI kit (HTML, CSS, JS)
    build-kit.js           Sinh CSS variables từ tokens.json rồi ghép vào kit.src.html
    onefb-ui-kit.html      Bản dựng, mở trực tiếp trong trình duyệt
```

## Cách dùng

```bash
node design/design-system/build.js          # sinh lại tokens.json từ build.js
node design/design-system/check-contrast.js # phải báo failing 0
node design/ui-kit/build-kit.js             # sinh lại onefb-ui-kit.html
```

Sửa token trong `build.js` (không sửa tay `tokens.json`), chạy kiểm tra tương phản, rồi dựng lại UI kit. Quy trình thêm token: `docs/design/00-ui-design-rules.md` mục 14.1.

## Ghi chú

- Bảng màu theo hướng Stripe-inspired (blurple, navy, xám xanh). Đây là bảng tham khảo từ nhận diện công khai, không phải token chính thức của Stripe.
- `project/` giữ nguyên cấu trúc của artifact "OneFB Design Tokens". Các ví dụ trong `components/` dùng CSS variables do trang sinh ra từ `tokens.json`, nên chỉ hiển thị đúng khi mở trong artifact.
- `onefb-ui-kit.html` tự chứa mọi thứ, chỉ nạp font Be Vietnam Pro từ Google Fonts.
