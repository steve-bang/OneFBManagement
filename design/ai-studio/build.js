// Ghép prompt cho Google AI Studio: header + nội dung từng bước + footer.
// Chạy: node design/ai-studio/build.js
const fs = require('fs');
const path = require('path');

const root = __dirname;
const src = path.join(root, 'src');
const out = path.join(root, 'prompts');
fs.mkdirSync(out, { recursive: true });

// 1. tokens.css sinh từ tokens.json (cùng cách với UI kit)
const tokens = JSON.parse(fs.readFileSync(path.join(root, '../design-system/project/tokens.json'), 'utf8'));
const ref = (v) => { const m = /^\{(.+)\}$/.exec(v); return m ? `var(--${m[1]})` : v; };
const light = [], dark = [];
for (const t of tokens.color.tokens) {
  if (typeof t.value === 'string') light.push(`--${t.name}: ${ref(t.value)};`);
  else { light.push(`--${t.name}: ${ref(t.value.light)};`); dark.push(`--${t.name}: ${ref(t.value.dark)};`); }
}
const fixed = [];
for (const fam of ['spacing', 'radius', 'shadow', 'zIndex', 'gradient'])
  for (const t of tokens[fam].tokens) fixed.push(`--${t.name}: ${t.value};`);
fixed.push(`--font-sans: ${tokens.type.families.sans};`);
const type = [];
for (const g of tokens.type.groups) for (const s of g.styles)
  type.push(`.${s.name} { font-size: ${s.fontSize}; line-height: ${s.lineHeight}; font-weight: ${s.fontWeight}; }`);
const ind = (a) => a.map((x) => '  ' + x).join('\n');
const tokensCss = `/* OneFB design tokens — sinh từ design/design-system/project/tokens.json. Không sửa tay. */
:root {
${ind(light)}
${ind(fixed)}
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${dark.map((x) => '    ' + x).join('\n')}
    color-scheme: dark;
  }
}
:root[data-theme="dark"] {
${ind(dark)}
  color-scheme: dark;
}
/* Thang chữ theo thiết bị */
${type.join('\n')}
`;
fs.writeFileSync(path.join(root, 'tokens.css'), tokensCss);

// 2. ghép prompt
const header = fs.readFileSync(path.join(src, '_header.md'), 'utf8').trim();
const footer = fs.readFileSync(path.join(src, '_footer.md'), 'utf8').trim();
const files = fs.readdirSync(src).filter((f) => /^\d\d-.*\.md$/.test(f)).sort();
const prompts = [];
for (const f of files) {
  let body = fs.readFileSync(path.join(src, f), 'utf8').trim().replace('{{TOKENS_CSS}}', tokensCss.trim());
  const isTemplate = f.startsWith('13-');
  const full = isTemplate ? body : `${header}\n\n---\n\n${body}\n\n---\n\n${footer}`;
  fs.writeFileSync(path.join(out, f), full + '\n');
  const title = (/^# (.+)$/m.exec(body) || [, f])[1];
  prompts.push({ file: f, title, text: full, template: isTemplate });
}

// 3. trang có nút sao chép
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const cards = prompts.map((p, i) => `
<article class="card" id="p${i}">
  <div class="head">
    <div><p class="step">${p.template ? 'Dùng khi cần' : 'Bước ' + (i + 1) + ' / 12'}</p><h2>${esc(p.title.replace(/^BƯỚC \d+\/12: /, ''))}</h2></div>
    <div class="act"><span class="size">${(p.text.length / 1000).toFixed(1)}k ký tự</span><button class="btn" type="button" data-copy="${i}">Sao chép prompt</button></div>
  </div>
  <details><summary>Xem nội dung</summary><pre id="t${i}">${esc(p.text)}</pre></details>
</article>`).join('\n');

const html = `<title>Bộ Prompt AI Studio</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap">
<style>
${tokensCss}
*{box-sizing:border-box}
body{margin:0;background:var(--bg-page);color:var(--text-primary);font-family:var(--font-sans);font-size:15px;line-height:22px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
.wrap{max-width:860px;margin:0 auto;padding-block:40px 80px;display:flex;flex-direction:column;gap:24px}
h1{margin:0;font-size:30px;line-height:38px;font-weight:700;text-wrap:balance}
h2{margin:0;font-size:18px;line-height:26px;font-weight:600}
p{margin:0}
.lede{color:var(--text-secondary);max-width:65ch}
.how{background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:20px;display:flex;flex-direction:column;gap:12px}
.how ol{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:6px}
.warn{background:var(--bg-warning-subtle);color:var(--text-warning-subtle);border-radius:var(--radius-md);padding:12px 16px;font-size:14px;line-height:20px}
.card{background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:16px 20px;display:flex;flex-direction:column;gap:12px}
.head{display:flex;justify-content:space-between;gap:16px;align-items:center;flex-wrap:wrap}
.head>div{min-width:0}
.step{font-size:12px;line-height:16px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--text-secondary)}
.act{display:flex;gap:12px;align-items:center}
.size{font-size:13px;color:var(--text-secondary);font-variant-numeric:tabular-nums}
.btn{min-height:44px;padding:0 18px;border:0;border-radius:var(--radius-md);background:var(--bg-action);color:var(--text-on-action);font:inherit;font-weight:600;cursor:pointer}
.btn:hover{background:var(--bg-action-hover)}
.btn:active{background:var(--bg-action-pressed)}
.btn.done{background:var(--bg-success-subtle);color:var(--text-success-subtle)}
:focus-visible{outline:2px solid var(--focus-ring);outline-offset:2px}
details summary{cursor:pointer;color:var(--text-brand);font-weight:500;min-height:32px;display:flex;align-items:center}
pre{margin:8px 0 0;max-height:420px;overflow:auto;background:var(--bg-sunken);border-radius:var(--radius-md);padding:14px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;line-height:18px;white-space:pre-wrap;word-break:break-word}
.toast{position:fixed;left:50%;transform:translateX(-50%);bottom:max(16px,env(safe-area-inset-bottom,0px));background:var(--bg-surface);border:1px solid var(--border-subtle);box-shadow:var(--shadow-md);border-radius:var(--radius-md);padding:10px 16px;z-index:50}
</style>
<div class="wrap">
  <header>
    <h1>Bộ prompt dựng giao diện OneFB bằng Google AI Studio</h1>
    <p class="lede">12 bước dán lần lượt vào Google AI Studio (chế độ Build). Mỗi prompt tự chứa đủ ngữ cảnh: hợp đồng thiết kế, bất biến nghiệp vụ, phạm vi của bước, tiêu chí nghiệm thu. Bấm "Sao chép prompt", dán, gửi, rồi kiểm tra theo danh sách nghiệm thu trước khi sang bước sau.</p>
  </header>
  <section class="how" aria-label="Cách dùng">
    <h2>Cách dùng</h2>
    <ol>
      <li>Làm đúng thứ tự từ bước 1. Không gộp hai bước, không cắt bớt prompt.</li>
      <li>Sau mỗi bước: chạy ứng dụng, tự thử một luồng chính, một thao tác sai quyền, theme tối và đổi thiết bị.</li>
      <li>Đạt thì lưu mốc rồi sang bước tiếp. Lỗi thì dùng mẫu sửa lỗi ở cuối trang.</li>
      <li>AI sẽ nêu "quyết định mặc định đã tự chọn". Đọc kỹ, sai với thực tế quán thì sửa ngay.</li>
    </ol>
    <p class="warn">Bộ prompt chưa được thử trên Google AI Studio. Hãy chạy bước 1 và 2 trước rồi mới đi tiếp. Thanh toán, mã VietQR và băm PIN là mô phỏng, không dùng cho tiền thật.</p>
  </section>
${cards}
</div>
<div class="toast" id="toast" hidden role="status"></div>
<script>
(function(){
  var texts=${JSON.stringify(prompts.map((p) => p.text)).replace(/</g, '\\u003c')};
  var toast=document.getElementById('toast'),th;
  function say(m){toast.textContent=m;toast.hidden=false;clearTimeout(th);th=setTimeout(function(){toast.hidden=true},2600)}
  function selectText(i){var d=document.querySelector('#p'+i+' details');d.open=true;var r=document.createRange();r.selectNodeContents(document.getElementById('t'+i));var s=getSelection();s.removeAllRanges();s.addRange(r)}
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-copy]');if(!b)return;var i=+b.dataset.copy;
    function ok(){var old=b.textContent;b.textContent='Đã sao chép';b.classList.add('done');say('Đã sao chép bước '+(i+1));setTimeout(function(){b.textContent=old;b.classList.remove('done')},2000)}
    function fail(){selectText(i);say('Không sao chép tự động được. Nội dung đã được chọn, bấm Ctrl+C hoặc Cmd+C')}
    try{navigator.clipboard.writeText(texts[i]).then(ok,fail)}catch(err){fail()}
  });
})();
</script>
`;
fs.writeFileSync(path.join(root, 'prompts.html'), html);
console.log('prompts:', prompts.length, '| sizes (k):', prompts.map((p) => (p.text.length / 1000).toFixed(1)).join(', '));
