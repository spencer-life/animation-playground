import { mkdir, readFile, writeFile, readdir, rm, copyFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'dist');
const revision = 'e8a175de22ae1e49370fc144c1f3bb9aeedf988d';
const sourceRoot = `https://github.com/emilkowalski/skills/blob/${revision}/skills/`;
const colors = { lavender: '#e8e4f3', peach: '#f5dfd0', blue: '#dfe8f8', green: '#dfece5', sand: '#eee9dc', graphite: '#e2e5ea' };
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
const scriptSafe = value => value.replace(/<\/script/gi, '<\\/script');

await rm(out, { recursive: true, force: true });
await mkdir(resolve(out, 'assets'), { recursive: true });
await mkdir(resolve(out, 'examples'), { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js']) await copyFile(resolve(root, 'src', file), resolve(out, file));
await copyFile(resolve(root, 'src/favicon.svg'), resolve(out, 'assets/favicon.svg'));
await copyFile(resolve(root, 'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'), resolve(out, 'assets/inter-latin.woff2'));
await writeFile(resolve(out, '.nojekyll'), '');

const base = await readFile(resolve(root, 'src/demo-base.css'), 'utf8');
const runtime = await readFile(resolve(root, 'src/demo-runtime.js'), 'utf8');
const ownLicense = await readFile(resolve(root, 'LICENSE'), 'utf8');
const motionLicense = await readFile(resolve(root, 'node_modules/motion/LICENSE.md'), 'utf8');
const emilLicense = ownLicense.replace('Copyright (c) 2026 Animation Playground contributors', 'Copyright (c) 2026 Emil Kowalski');
const bundled = await build({ entryPoints: [resolve(root, 'src/motion-entry.js')], bundle: true, minify: true, write: false, format: 'iife', globalName: 'Motion', platform: 'browser', target: 'es2022', legalComments: 'inline' });
const motion = bundled.outputFiles[0].text;
const files = (await readdir(resolve(root, 'src/recipes'))).filter(file => file.endsWith('.mjs')).sort();
const recipes = [];
for (const file of files) recipes.push(...(await import(resolve(root, 'src/recipes', file))).default.map(recipe => ({ ...recipe, module: `src/recipes/${file}` })));
if (recipes.length !== 36) throw new Error(`Expected 36 recipes, found ${recipes.length}`);
const featured = ['sliding-tabs', 'spring-orb', 'card-stack', 'hold-confirm', 'staggered-words', 'toggle-switch'];
recipes.sort((a, b) => {
  const ai = featured.indexOf(a.id), bi = featured.indexOf(b.id);
  if (ai !== -1 || bi !== -1) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  return a.title.localeCompare(b.title);
});
const catalog = [];
let fullReference = '# Animation Playground — complete agent reference\n\n36 original animation examples informed by Emil Kowalski’s skills.\n\n';
fullReference += 'Use the standalone examples/{id}.html as the authoritative executable source. Every file includes the base styles and runtime; Motion examples also embed the pinned Motion 14.1.0 runtime. No external network dependency is needed to run a downloaded example.\n\n';
fullReference += 'When adapting: preserve native semantics, keyboard and touch operation, exact timing, interruption behavior, and reduced-motion states. Keep educational playback distinct from everyday interface motion. Source modules are in src/recipes/. Do not paste only a component stylesheet without its shared tokens.\n\n';

for (const recipe of recipes) {
  const { html, css, js, ...metadata } = recipe;
  const sourceUrl = sourceRoot + (recipe.source || 'animate/SKILL.md');
  const background = colors[recipe.color] || colors.lavender;
  const code = `<!doctype html>
<!-- ${escape(recipe.title)} — Animation Playground. Original adaptation. MIT.
     Principles: ${sourceUrl}
     Complete standalone example. ${recipe.usesMotion ? 'Includes Motion 14.1.0 (MIT).' : 'No external dependencies.'}

${ownLicense}
Upstream principles and adapted recipes:
${emilLicense}
${recipe.usesMotion ? `Bundled Motion license:\n${motionLicense}` : ''}
-->
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(recipe.title)} — Animation Playground</title>
  <style>
${base}
html { background: ${background}; }
${css}
  </style>
</head>
<body>
${html}
<script>
${scriptSafe(runtime)}
</script>
${recipe.usesMotion ? `<script>\n/* Motion 14.1.0 — Copyright Motion B.V. and contributors. MIT. See THIRD_PARTY_NOTICES.md in the repository. */\n${scriptSafe(motion)}\n</script>` : ''}
<script>
(() => {
${scriptSafe(js)}
})();
</script>
</body>
</html>
`;
  await writeFile(resolve(out, 'examples', `${recipe.id}.html`), code);
  const content = {
    ...metadata,
    sourceUrl,
    code,
    snippets: {
      html,
      css: `/* Complete base styles and recipe styles. */\n${base}\nhtml { background: ${background}; }\n${css}`,
      js: `${recipe.usesMotion ? '/* This study uses Motion 14.1.0. Copy Full HTML for the embedded runtime. */\n' : ''}${runtime}\n\n(() => {\n${js}\n})();`,
    },
    // Compact educational source shown by default; Full HTML is the runnable export.
    study: { html, css, js },
  };
  await writeFile(resolve(out, 'examples', `${recipe.id}.json`), JSON.stringify(content));
  catalog.push({ ...metadata, sourceUrl, example: `examples/${recipe.id}.html`, details: `examples/${recipe.id}.json`, link: `?animation=${recipe.id}`, background, dependencies: recipe.usesMotion ? ['Motion 14.1.0 (bundled)'] : [] });
  fullReference += `## ${recipe.title} [${recipe.id}]\n\nCategory: ${recipe.category}. Purpose: ${recipe.purpose}. Trigger: ${recipe.trigger}.\n${recipe.description}\n\nUse: ${recipe.useWhen}\nAvoid: ${recipe.avoidWhen}\nTiming: ${recipe.duration}; easing: ${recipe.easing}.\nReduced motion: ${recipe.reducedMotion}\nPrinciple: ${recipe.principle}\nDependencies: ${recipe.usesMotion ? 'Motion 14.1.0, bundled into the full HTML' : 'None; native browser APIs'}.\nExample: examples/${recipe.id}.html\nSource module: ${recipe.module}\nReference: ${sourceUrl}\n\n### Markup\n\n\`\`\`html\n${html}\n\`\`\`\n\n### Styles\n\n\`\`\`css\n${css}\n\`\`\`\n\n### Behavior\n\n\`\`\`js\n${js}\n\`\`\`\n\n`;
}
await writeFile(resolve(out, 'catalog.json'), JSON.stringify({ schemaVersion: 1, title: 'Animation Playground', sourceRevision: revision, count: catalog.length, recipes: catalog }));
await writeFile(resolve(out, 'llms-full.txt'), fullReference);
await writeFile(resolve(out, 'llms.txt'), `# Animation Playground\n\nA collection of 36 complete, portable web animation examples.\n\n- [Catalog](./catalog.json): identifiers, behavior, timing, dependencies, source references.\n- [Full reference](./llms-full.txt): complete educational source and use constraints.\n- [Standalone examples](./examples/): each HTML file includes everything it needs.\n- [GitHub](https://github.com/spencer-life/animation-playground): editable source, build instructions, agent guidance.\n\nUse ?animation={id} for a focused workbench. Preserve IDs, accessibility, reduction, cancellation, and timing when adapting. Native CSS and WAAPI first; Motion only for spring/gesture examples.\n`);
await writeFile(resolve(out, 'examples/index.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Standalone animation examples</title><style>body{max-width:800px;margin:40px auto;padding:20px;font:16px/1.6 system-ui;color:#20242b}a{color:#3358d4}li{margin:12px 0}</style><h1>Standalone animation examples</h1><p>Each file contains its complete styles and behavior. <a href="../">Open the playground</a>.</p><ul>${catalog.map(recipe => `<li><a href="./${recipe.id}.html">${escape(recipe.title)}</a> — ${escape(recipe.description)}</li>`).join('')}</ul></html>`);
for (const file of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) {
  try { await copyFile(resolve(root, file), resolve(out, file)); } catch (error) { if (error.code !== 'ENOENT') throw error; }
}
console.log(`Built ${catalog.length} complete examples, searchable catalog, and agent references into dist/.`);
