import { readFile, readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

// A focused delivery check, not a substitute for an independent security audit.
const index = await readFile('src/index.html','utf8');
assert(!/<script[^>]+src=["']https?:/i.test(index),'The site must not depend on third-party runtime script hosts.');
for (const file of (await readdir('src/recipes')).filter(file => file.endsWith('.mjs'))) {
  const source = await readFile(`src/recipes/${file}`,'utf8');
  assert(!/\b(?:eval|document\.write)\s*\(/.test(source),`${file}: no dynamic evaluation or document.write.`);
}
const app = await readFile('src/app.js','utf8');
assert(app.includes('sandbox="allow-scripts"'),'Demo frames must retain the opaque-origin script sandbox.');
assert(!app.includes('allow-same-origin'),'Do not grant same-origin access to demo frames.');
console.log('PASS: local runtime assets, isolated demo frames, and no recipe dynamic evaluation.');
const result = spawnSync('pnpm',['audit','--prod','--audit-level=high'],{stdio:'inherit'});
process.exit(result.status ?? 1);
