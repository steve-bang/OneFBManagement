const t = require('./project/tokens.json').color.tokens; const m = {}; t.forEach(x => m[x.name] = x.value);
const res = (n, th) => { let v = m[n]; if (typeof v === 'object') v = v[th]; const a = /^\{(.+)\}$/.exec(v); return a ? res(a[1], th) : v; };
const L = h => { const c = [1,3,5].map(i => parseInt(h.slice(i,i+2),16)/255).map(u => u<=.03928?u/12.92:((u+.055)/1.055)**2.4); return .2126*c[0]+.7152*c[1]+.0722*c[2]; };
const cr = (a,b) => { const x=L(a),y=L(b); return ((Math.max(x,y)+.05)/(Math.min(x,y)+.05)); };
const pairs = [['text-primary','bg-page',4.5],['text-primary','bg-surface',4.5],['text-secondary','bg-page',4.5],['text-secondary','bg-surface',4.5],['text-secondary','bg-sunken',4.5],['text-muted','bg-surface',4.5],['text-brand','bg-surface',4.5],['text-brand','bg-page',4.5],['text-on-action','bg-action',4.5],['text-on-action','bg-action-hover',4.5],['text-on-action','bg-action-pressed',4.5],['text-on-brand-subtle','bg-brand-subtle',4.5],['border-control','bg-surface',3],['focus-ring','bg-surface',3],['focus-ring','bg-page',3],['feedback-danger','bg-page',4.5],['feedback-danger','bg-surface',4.5],['feedback-success','bg-surface',4.5],['feedback-warning','bg-surface',4.5],['feedback-info','bg-surface',4.5]];
for (const n of Object.keys(m)) { const mm = /^bg-(.+)$/.exec(n); if (mm && m['text-'+mm[1]] && !['brand','brand-subtle'].includes(mm[1])) pairs.push(['text-'+mm[1], n, 4.5]); }
let bad = 0;
for (const th of ['light','dark']) for (const [f,b,min] of pairs) { if (!m[f]||!m[b]) continue; const r = cr(res(f,th),res(b,th)); if (r < min) { bad++; console.log(th, f, 'on', b, r.toFixed(2), '<', min); } }
console.log('checked', pairs.length*2, 'pairs, failing', bad);
