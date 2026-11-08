const fs = require('fs');
const base = __dirname + '/';
const tokens = JSON.parse(fs.readFileSync(base + '../design-system/project/tokens.json', 'utf8'));
const ref = (v) => { const m = /^\{(.+)\}$/.exec(v); return m ? `var(--${m[1]})` : v; };

const light = [], dark = [];
for (const t of tokens.color.tokens) {
  if (typeof t.value === 'string') light.push(`--${t.name}:${ref(t.value)}`);
  else { light.push(`--${t.name}:${ref(t.value.light)}`); dark.push(`--${t.name}:${ref(t.value.dark)}`); }
}
const fixed = [];
for (const fam of ['spacing', 'radius', 'shadow', 'zIndex', 'gradient'])
  for (const t of tokens[fam].tokens) fixed.push(`--${t.name}:${t.value}`);
fixed.push(`--font-sans:${tokens.type.families.sans}`);

const rules = [];
for (const g of tokens.type.groups) for (const s of g.styles)
  rules.push(`.${s.name}{font-size:${s.fontSize};line-height:${s.lineHeight};font-weight:${s.fontWeight}}`);

const css = `:root{${light.join(';')};${fixed.join(';')};color-scheme:light}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){${dark.join(';')};color-scheme:dark}}
:root[data-theme="dark"]{${dark.join(';')};color-scheme:dark}
${rules.join('\n')}`;

const src = fs.readFileSync(base + 'kit.src.html', 'utf8');
fs.writeFileSync(base + 'onefb-ui-kit.html', src.replace('/*TOKENS*/', css));
console.log('built', css.length, 'bytes of token css');
