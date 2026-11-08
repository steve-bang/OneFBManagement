const fs = require('fs');
const dir = __dirname + '/project/';
const NOW = new Date().toISOString().replace(/\.\d+Z$/, 'Z');

const color = [];
const add = (name, value, usage) => color.push({ name, value, usage });

// ---- Tầng 1: thang màu gốc (không dùng trực tiếp trong component) ----
const scales = {
  slate: { 0: '#FFFFFF', 50: '#F6F9FC', 100: '#EDF2F8', 200: '#E5EDF5', 300: '#CBD6E4', 400: '#9AA9BD', 500: '#64748D', 600: '#50617A', 700: '#3A4D68', 800: '#273449', 900: '#0A2540' },
  night: { 800: '#1A2236', 900: '#111827', 950: '#0A0E1A' },
  brand: { 50: '#F3F3FF', 100: '#E2E4FF', 200: '#C9CCFF', 300: '#A9AAFE', 400: '#7F7DFC', 500: '#635BFF', 600: '#533AFD', 700: '#4434D4', 800: '#3A2BA8', 900: '#2A2078', 950: '#1A1450' },
  orange: { 50: '#FFF4EC', 100: '#FFE3D1', 200: '#FFC7A3', 300: '#FFA46B', 400: '#FB8A4B', 500: '#FF6118', 600: '#C2410C', 700: '#9A3309', 800: '#7A2907', 900: '#5A2108', 950: '#3A1405' },
  green: { 50: '#F0FBF6', 100: '#D6F5E7', 200: '#A9EACB', 300: '#6FD9AB', 400: '#3DD598', 500: '#24B47E', 600: '#15845A', 700: '#116B49', 800: '#0F5539', 900: '#0E3F2B', 950: '#072619' },
  red: { 50: '#FEF1F4', 100: '#FCDDE5', 200: '#FFD0DC', 300: '#F59AB0', 400: '#EC6A8A', 500: '#D9507A', 600: '#C63860', 700: '#A82D50', 800: '#861F3E', 900: '#5A1630', 950: '#3A0D1E' },
  amber: { 50: '#FFFBEB', 100: '#FEF0C3', 200: '#FDE9A6', 300: '#FCD34D', 400: '#FFC043', 500: '#D97706', 600: '#B45309', 700: '#92400E', 800: '#78350F', 900: '#5A4208', 950: '#3B2A05' },
  blue: { 50: '#F0F5FF', 100: '#DCE8FF', 200: '#BFD4FF', 300: '#93C5FD', 400: '#60A5FA', 500: '#3B82F6', 600: '#1D4ED8', 700: '#1E40AF', 800: '#1E3A8A', 900: '#1E2F5C', 950: '#14204A' },
  pink: { 50: '#FFF1FB', 100: '#FFDDF4', 200: '#FFC2EA', 300: '#FB93DC', 400: '#F66FD3', 500: '#F44BCC', 600: '#C42FA3', 700: '#9E2582', 800: '#7E1E69', 900: '#4D1441', 950: '#2E0C27' },
  cyan: { 50: '#F0FCFF', 100: '#D4F6FF', 200: '#AAEEFF', 300: '#80E9FF', 400: '#4FD4EE', 500: '#1FB5D4', 600: '#0E8FAE', 700: '#0B7390', 800: '#0A5A71', 900: '#0A3E4F', 950: '#062733' },
};
const scaleNote = {
  slate: 'Xám xanh trung tính cho nền, chữ, viền. 900 là navy của chữ chính.',
  night: 'Ba nền tối cho theme tối: canvas, surface, elevated.',
  brand: 'Blurple thương hiệu. 600 cho nền nút ở theme sáng, 500 ở theme tối.',
  orange: 'Cam: bàn đang phục vụ và điểm nhấn gradient.',
  green: 'Thành công, món xong, đã thanh toán.',
  red: 'Lỗi, huỷ, quá hạn, mất kết nối.',
  amber: 'Cảnh báo, món chờ lâu.',
  blue: 'Thông tin, chờ thanh toán.',
  pink: 'Bàn đã đặt, điểm nhấn gradient.',
  cyan: 'Món đã giao khách, điểm nhấn gradient.',
};
for (const [s, steps] of Object.entries(scales))
  for (const [k, v] of Object.entries(steps))
    add(`${s}-${k}`, v, `Thang gốc ${s} bậc ${k}. ${scaleNote[s]} Không dùng trực tiếp trong component, dùng token ngữ nghĩa.`);

// ---- Tầng 2: ngữ nghĩa (bg-*, text-*, border-*, action, feedback) ----
const sem = (name, l, d, usage) => add(name, { light: `{${l}}`, dark: `{${d || l}}` }, usage);
sem('bg-page', 'slate-50', 'night-950', 'Nền trang (canvas). text-primary và text-secondary đặt trực tiếp lên đây.');
sem('bg-surface', 'slate-0', 'night-900', 'Thẻ, sheet, modal, phiếu bếp.');
sem('bg-sunken', 'slate-100', 'night-800', 'Vùng lõm và nổi nhẹ: ô nhập, hàng xen kẽ, nền nhóm.');
sem('bg-scrim', 'slate-900', 'night-950', 'Lớp phủ sau modal. Dùng với độ mờ 50%.');
sem('bg-brand', 'brand-600', 'brand-500', 'Khối thương hiệu lớn, logo. Không đặt chữ nhỏ lên trên trừ text-on-action.');
sem('bg-brand-subtle', 'brand-100', 'brand-900', 'Nền nhấn nhẹ: mục điều hướng đang chọn, hàng được chọn.');
sem('text-on-brand-subtle', 'brand-800', 'brand-100', 'Chữ trên bg-brand-subtle. Đạt 4.5:1.');
sem('bg-action', 'brand-600', 'brand-500', 'Nền nút chính: Thanh toán, Gửi bếp. Chữ trắng đạt 6:1 ở theme sáng.');
sem('bg-action-hover', 'brand-700', 'brand-600', 'Nút chính khi rê chuột hoặc giữ.');
sem('bg-action-pressed', 'brand-800', 'brand-700', 'Nút chính khi đang nhấn.');
sem('text-on-action', 'slate-0', 'slate-0', 'Chữ trên bg-action và các biến thể.');
sem('text-primary', 'slate-900', 'slate-50', 'Chữ chính, tiêu đề và số tiền (navy).');
sem('text-secondary', 'slate-600', 'slate-400', 'Chữ phụ, nhãn, giờ ngồi. Đạt 4.5:1 trên bg-page.');
sem('text-muted', 'slate-500', 'slate-400', 'Chữ gợi ý, placeholder. Chỉ dùng trên bg-surface (4.7:1).');
sem('text-brand', 'brand-600', 'brand-300', 'Liên kết và chữ nhấn thương hiệu. Đạt 4.5:1.');
sem('border-subtle', 'slate-200', 'slate-800', 'Đường kẻ phân vùng, viền thẻ.');
sem('border-control', 'slate-500', 'slate-500', 'Viền ô nhập và nút phụ. Đạt 3:1 trên bg-surface ở cả hai theme.');
sem('focus-ring', 'brand-600', 'brand-300', 'Vòng focus 2px cách phần tử 2px. Bắt buộc cho bàn phím và chuột.');
sem('feedback-danger', 'red-600', 'red-400', 'Chữ và icon lỗi, huỷ món, void.');
sem('feedback-success', 'green-600', 'green-400', 'Chữ và icon hoàn tất, đã đối chiếu.');
sem('feedback-warning', 'amber-600', 'amber-400', 'Chữ và icon cần chú ý: sắp hết hàng, chênh quỹ nhỏ.');
sem('feedback-info', 'blue-600', 'blue-400', 'Chữ và icon thông tin trung tính.');
const sub = (n, c, label) => {
  sem(`bg-${n}-subtle`, `${c}-100`, `${c}-900`, `Nền thông báo ${label}.`);
  sem(`text-${n}-subtle`, `${c}-800`, `${c}-100`, `Chữ trên bg-${n}-subtle. Đạt 4.5:1.`);
};
sub('danger', 'red', 'lỗi');
sub('success', 'green', 'thành công');
sub('warning', 'amber', 'cảnh báo');
sub('info', 'blue', 'thông tin');

// ---- Trạng thái nghiệp vụ F&B: luôn kèm nhãn hoặc icon ----
const dom = (n, c, fgL, fgD, label, bgL = 100, bgD = 900) => {
  sem(`bg-${n}`, `${c}-${bgL}`, `${c}-${bgD}`, `${label} (nền).`);
  sem(`text-${n}`, `${c}-${fgL}`, `${c}-${fgD}`, `${label} (chữ). Đạt 4.5:1 trên bg-${n}.`);
};
sem('bg-table-free', 'slate-100', 'night-800', 'Bàn trống (nền).');
sem('text-table-free', 'slate-700', 'slate-300', 'Bàn trống (chữ). Đạt 4.5:1 trên bg-table-free.');
dom('table-occupied', 'orange', 800, 200, 'Bàn đang phục vụ');
dom('table-payment', 'blue', 800, 100, 'Bàn chờ thanh toán');
dom('table-reserved', 'pink', 800, 100, 'Bàn đã đặt');
dom('table-help', 'red', 700, 200, 'Bàn gọi hỗ trợ, nháy kèm âm báo');
dom('item-ready', 'green', 800, 100, 'Món đã xong');
dom('item-served', 'cyan', 800, 100, 'Món đã giao khách');
dom('sla-warn', 'amber', 800, 200, 'Món chờ lâu hơn ngưỡng cảnh báo');
const alias = (n, to, label) => {
  add(`bg-${n}`, `{bg-${to}}`, `${label} (nền).`);
  add(`text-${n}`, `{text-${to}}`, `${label} (chữ).`);
};
alias('item-new', 'table-free', 'Món mới nhận');
alias('item-preparing', 'table-occupied', 'Món đang chế biến');
alias('item-cancelled', 'table-help', 'Món đã huỷ, cảnh báo nổi bật ở bếp');
alias('sla-ok', 'item-ready', 'Món trong thời gian chuẩn');
alias('sla-late', 'table-help', 'Món quá hạn, nháy kèm âm báo');
alias('conn-offline', 'table-help', 'Banner mất kết nối');

// ---- Màu biểu đồ báo cáo ----
const chart = [['brand-600', 'brand-400'], ['cyan-600', 'cyan-300'], ['pink-600', 'pink-400'], ['orange-500', 'orange-400'], ['amber-500', 'amber-400'], ['slate-500', 'slate-400']];
chart.forEach(([l, d], i) => sem(`chart-${i + 1}`, l, d, `Màu chuỗi dữ liệu thứ ${i + 1}. Luôn kèm nhãn trực tiếp hoặc chú giải, không phân biệt chỉ bằng màu.`));

// ---- Khoảng cách, kích thước, component ----
const T = (name, value, usage) => ({ name, value, usage });
const spacing = [
  T('space-100', '4px', 'Khoảng cách trong chip, icon với chữ.'),
  T('space-200', '8px', 'Khoảng cách tối thiểu giữa hai vùng chạm.'),
  T('space-300', '12px', 'Padding trong thẻ nhỏ.'),
  T('space-400', '16px', 'Padding thẻ, lề màn hình điện thoại.'),
  T('space-500', '20px', 'Khoảng cách giữa nhóm trên điện thoại.'),
  T('space-600', '24px', 'Lề màn hình tablet và web admin.'),
  T('space-800', '32px', 'Khoảng cách giữa các khối lớn.'),
  T('space-1000', '40px', 'Khoảng thở quanh tiêu đề KDS.'),
  T('target-min', '44px', 'Vùng chạm tối thiểu cho mọi nút.'),
  T('target-comfortable', '48px', 'Nút trên điện thoại, thao tác một tay.'),
  T('target-pos', '56px', 'Nút trên tablet quầy thu ngân.'),
  T('target-kds', '72px', 'Nút ở bếp/bar, tay ướt, đứng xa màn hình.'),
  T('row-compact', '40px', 'Chiều cao hàng bảng cho quản lý và web admin (mật độ compact).'),
  T('row-comfortable', '56px', 'Chiều cao hàng danh sách mặc định trên điện thoại và POS.'),
  T('row-touch', '72px', 'Chiều cao hàng ở KDS (mật độ touch).'),
  T('pin-key', '80px', 'Phím số trong bàn phím PIN.'),
  T('sidebar-width', '240px', 'Thanh điều hướng web admin.'),
  T('content-max', '1200px', 'Bề rộng nội dung tối đa trên web admin.'),
  T('table-card-min', '104px', 'Chiều cao tối thiểu thẻ bàn trên sơ đồ.'),
  T('kds-ticket-width', '260px', 'Chiều rộng phiếu bếp trên KDS.'),
];
const radius = [
  T('radius-sm', '4px', 'Chip, badge, ô nhập nhỏ.'),
  T('radius-md', '8px', 'Nút, thẻ bàn, thẻ món.'),
  T('radius-lg', '12px', 'Sheet, modal, phiếu bếp.'),
  T('radius-full', '999px', 'Pill trạng thái, avatar.'),
];
const shadow = [
  T('shadow-sm', '0 1px 1px rgba(10,37,64,0.08)', 'Thẻ nổi nhẹ. Ưu tiên viền thay bóng trên tablet rẻ tiền.'),
  T('shadow-md', '0 3px 6px rgba(10,37,64,0.12)', 'Dropdown, thanh giỏ hàng cố định.'),
  T('shadow-overlay', '0 15px 35px rgba(50,50,93,0.2), 0 5px 15px rgba(0,0,0,0.12)', 'Modal, sheet duyệt PIN.'),
];
const zIndex = [
  T('z-sticky', '10', 'Thanh tiêu đề và thanh giỏ hàng dính.'),
  T('z-dropdown', '20', 'Menu thả xuống, popover.'),
  T('z-modal', '30', 'Modal và sheet.'),
  T('z-pin-approval', '40', 'Hộp PIN duyệt giảm giá, void, mở két. Luôn nằm trên modal.'),
  T('z-toast', '50', 'Thông báo ngắn.'),
  T('z-offline', '60', 'Banner mất kết nối, che mọi thứ trừ thao tác khẩn.'),
];

const gradient = [
  T('gradient-brand', 'linear-gradient(135deg, #533AFD 0%, #7F7DFC 35%, #F44BCC 70%, #FF6118 100%)', 'Gradient đặc trưng: tím, violet, hồng, cam. Chỉ cho landing, hero, tính năng AI, bảng giá, empty state. Không dùng cho bảng, form hay nút.'),
  T('gradient-cool', 'linear-gradient(135deg, #533AFD 0%, #80E9FF 100%)', 'Tím sang cyan, dùng cho minh hoạ và nhãn nổi bật.'),
  T('gradient-warm', 'linear-gradient(135deg, #F44BCC 0%, #FF6118 100%)', 'Hồng sang cam, dùng cho khuyến mãi và điểm nhấn nhỏ.'),
];

const st = (name, fontSize, lineHeight, fontWeight, sample, usage) => ({ name, fontSize, lineHeight, fontWeight, sample, usage });
const groups = [
  { name: 'Web admin', family: 'sans', styles: [
    st('admin-label', '12px', '16px', 500, 'DOANH THU HÔM NAY', 'Nhãn cột, nhãn chỉ số.'),
    st('admin-body', '14px', '20px', 400, 'Báo cáo doanh thu theo ca', 'Nội dung bảng và form.'),
    st('admin-title', '20px', '28px', 600, 'Báo cáo bán hàng', 'Tiêu đề trang.'),
    st('admin-heading', '24px', '32px', 700, 'Tổng quan cửa hàng', 'Tiêu đề trang cấp cao nhất.'),
    st('admin-metric', '30px', '38px', 700, '12.450.000 ₫', 'Chỉ số lớn trên thẻ KPI. Chữ số đều.'),
  ] },
  { name: 'Điện thoại', family: 'sans', styles: [
    st('phone-body', '15px', '22px', 400, 'Trà đào cam sả, ít đá, ít ngọt', 'Nội dung chính, tên món.'),
    st('phone-label', '13px', '18px', 500, 'Bàn 12 · ngồi 25 phút', 'Nhãn, giờ ngồi, trạng thái.'),
    st('phone-title', '18px', '26px', 600, 'Chi tiết bàn 12', 'Tiêu đề màn hình.'),
    st('phone-price', '20px', '28px', 700, '85.000 ₫', 'Số tiền lớn. Luôn dùng chữ số đều.'),
    st('phone-display', '28px', '36px', 700, '4.250.000 ₫', 'Doanh thu hôm nay trên màn chủ quán.'),
  ] },
  { name: 'Tablet POS', family: 'sans', styles: [
    st('pos-body', '16px', '24px', 400, 'Bạc xỉu đá, thêm 1 shot', 'Nội dung chính trên quầy.'),
    st('pos-label', '14px', '20px', 500, 'Bàn 12 · ngồi 25 phút', 'Nhãn, trạng thái.'),
    st('pos-title', '20px', '28px', 600, 'Giỏ hàng', 'Tiêu đề cột.'),
    st('pos-price', '24px', '32px', 700, '85.000 ₫', 'Giá món, tạm tính.'),
    st('pos-display', '32px', '40px', 700, '1.275.000 ₫', 'Tổng thanh toán.'),
  ] },
  { name: 'KDS', family: 'sans', styles: [
    st('kds-body', '20px', '28px', 500, '2× Phở bò tái nạm', 'Dòng món trên phiếu bếp.'),
    st('kds-label', '18px', '24px', 500, 'Bàn 12 · 04:20', 'Số bàn, thời gian chờ.'),
    st('kds-title', '28px', '36px', 700, 'BÀN 12', 'Số bàn đầu phiếu.'),
    st('kds-timer', '32px', '40px', 700, '04:20', 'Đồng hồ chờ món. Đổi màu theo sla-ok/warn/late.'),
    st('kds-display', '48px', '56px', 700, '7 phiếu', 'Số phiếu đang chờ ở đầu màn hình.'),
  ] },
];

const tokens = {
  name: 'OneFB Management', version: 3,
  color: { themes: [{ id: 'light', name: 'Sáng' }, { id: 'dark', name: 'Tối' }], tokens: color },
  type: { fonts: [], families: { sans: '"Be Vietnam Pro", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }, groups },
  spacing: { tokens: spacing }, radius: { tokens: radius }, shadow: { tokens: shadow }, zIndex: { tokens: zIndex }, gradient: { tokens: gradient },
};
fs.writeFileSync(dir + 'tokens.json', JSON.stringify(tokens, null, 1));

const names = new Set();
for (const t of [...color, ...spacing, ...radius, ...shadow, ...zIndex, ...gradient]) {
  if (names.has(t.name)) throw new Error('dup ' + t.name);
  names.add(t.name);
}
for (const t of color) {
  const vs = typeof t.value === 'string' ? [t.value] : Object.values(t.value);
  for (const v of vs) { const m = /^\{(.+)\}$/.exec(v); if (m && !names.has(m[1])) throw new Error('missing alias ' + m[1] + ' in ' + t.name); }
}

const idx = JSON.parse(fs.readFileSync(dir + 'design-system.json', 'utf8'));
idx.lastChange = { by: 'Claude', at: NOW, via: 'Claude Code', note: 'Áp bảng màu Stripe-inspired: blurple, navy, xám xanh, gradient.' };
fs.writeFileSync(dir + 'design-system.json', JSON.stringify(idx, null, 1));

// Cover
const rects = [
  [0,0,2,'b5'],[2,0,1,'t'],[3,0,1,'k'],[4,0,1,'b6'],[5,0,2,'s'],
  [0,1,1,'k'],[1,1,1,'t'],[2,1,2,'b5'],[4,1,1,'i'],[5,1,1,'t'],[6,1,1,'b5'],
  [0,2,2,'t'],[2,2,1,'b6'],[3,2,1,'b5'],[4,2,2,'k'],[6,2,1,'s'],
  [0,3,1,'b5'],[1,3,1,'s'],[2,3,1,'t'],[3,3,2,'i'],[5,3,1,'k'],[6,3,1,'b6'],
];
const X0 = 500, Y0 = 20, U = 56, G = 8;
const svgRects = rects.map(([c, r, w, k]) =>
  `<rect class="${k}" x="${X0 + c * (U + G)}" y="${Y0 + r * (U + G)}" width="${w * U + (w - 1) * G}" height="${U}"/>`).join('\n  ');
const cover = `<!-- @dsCard height=288 -->
<!doctype html>
<html lang="vi"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;700&display=swap">
<style>
html,body{margin:0}
body{width:960px;height:288px;position:relative;overflow:hidden;background:var(--bg-page);font-family:var(--font-sans)}
svg{position:absolute;left:0;top:0}
.b5{fill:var(--brand-600)} .b6{fill:var(--brand-400)} .k{fill:var(--text-primary)} .s{fill:var(--cyan-400)} .i{fill:var(--pink-500)} .t{fill:var(--bg-sunken);stroke:var(--border-control);stroke-width:1}
rect{rx:var(--radius-md)}
.name{position:absolute;left:24px;bottom:24px;width:440px}
h1{margin:0;font-size:72px;line-height:.95;font-weight:700;color:var(--text-primary);letter-spacing:-.01em}
p{margin:16px 0 0;font-size:14px;line-height:20px;color:var(--text-secondary)}
</style></head><body>
<svg width="960" height="288" viewBox="0 0 960 288" aria-hidden="true">
<!--
blocks: brand-600 x5 (56 / 120 wide), brand-400 x4, text-primary x4, cyan-400 x3, pink-500 x2 + bg-sunken tint x5, all 56px tall (target-pos)
arrangement: sơ đồ bàn 7 cột x 4 hàng, gap 8 (space-200), một số ô gộp đôi như bàn dài
pattern: geometric, modular, dense UI → ô cắt bằng radius-md, giống sơ đồ bàn của quán
steps and radii: target-pos 56, space-200 8, radius-md 10
-->
  ${svgRects}
</svg>
<div class="name"><h1>OneFB<br>Management</h1><p>Quản lý quán F&amp;B nhanh, rõ, dùng được bằng một tay.</p></div>
</body></html>
`;
fs.writeFileSync(dir + 'components/Cover/preview.html', cover);
console.log('ok', color.length, 'colors');
