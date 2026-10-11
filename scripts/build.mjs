import { mkdir, readFile, writeFile, readdir, rm, copyFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { collections, enrichRecipe } from '../src/collections.mjs';
import { validateCatalog } from '../src/catalog-contract.mjs';
import { defaults, themeCss, resolveTheme, palettes, accents } from '../src/theme.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'dist');
const revision = 'e8a175de22ae1e49370fc144c1f3bb9aeedf988d';
const sourceRoot = `https://github.com/emilkowalski/skills/blob/${revision}/skills/`;
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
const scriptSafe = value => value.replace(/<\/script/gi, '<\\/script');

await rm(out, { recursive: true, force: true });
await mkdir(resolve(out, 'assets'), { recursive: true });
await mkdir(resolve(out, 'examples'), { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'theme.mjs', 'gallery-playback.js']) await copyFile(resolve(root, 'src', file), resolve(out, file));
await copyFile(resolve(root, 'src/favicon.svg'), resolve(out, 'assets/favicon.svg'));
await copyFile(resolve(root, 'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'), resolve(out, 'assets/inter-latin.woff2'));
await writeFile(resolve(out, '.nojekyll'), '');

const base = await readFile(resolve(root, 'src/demo-base.css'), 'utf8');
const runtime = await readFile(resolve(root, 'src/demo-runtime.js'), 'utf8');
const ownLicense = await readFile(resolve(root, 'LICENSE'), 'utf8');
const motionLicense = await readFile(resolve(root, 'node_modules/motion/LICENSE.md'), 'utf8');
const emilLicense = ownLicense.replace('Copyright (c) 2026 Animation Playground contributors', 'Copyright (c) 2026 Emil Kowalski');
const radixLicense = ownLicense.replace('Copyright (c) 2026 Animation Playground contributors', 'Copyright (c) 2021-2022 Modulz\nCopyright (c) 2022-Present WorkOS');
const bundled = await build({ entryPoints: [resolve(root, 'src/motion-entry.js')], bundle: true, minify: true, write: false, format: 'iife', globalName: 'Motion', platform: 'browser', target: 'es2022', legalComments: 'inline' });
const motion = bundled.outputFiles[0].text;
const themeBundle = (await build({ entryPoints: [resolve(root, 'src/theme.mjs')], bundle: true, minify: true, write: false, format: 'iife', globalName: 'PlaygroundTheme', platform: 'browser', target: 'es2022' })).outputFiles[0].text;
const files = (await readdir(resolve(root, 'src/recipes'))).filter(file => file.endsWith('.mjs')).sort();
const recipes = [];
for (const file of files) recipes.push(...(await import(resolve(root, 'src/recipes', file))).default.map(recipe => enrichRecipe({ ...recipe, module: `src/recipes/${file}` })));
validateCatalog(recipes, collections);
const featured = ['sliding-tabs', 'upload-queue', 'perspective-gallery', 'bulk-selection-toolbar', 'kanban-move', 'text-marquee', 'chart-range', 'spring-orb', 'form-success', 'hold-confirm', 'particle-burst', 'split-pane'];
recipes.sort((a, b) => {
  const ai = featured.indexOf(a.id), bi = featured.indexOf(b.id);
  if (ai !== -1 || bi !== -1) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  return a.title.localeCompare(b.title);
});
const catalog = [];
let fullReference = `# Animation Playground — complete agent reference\n\n${recipes.length} original animation examples informed by Emil Kowalski’s skills.\n\n`;
fullReference += 'Use the standalone examples/{id}.html as the authoritative executable source. Every file includes the base styles and runtime; Motion examples also embed the pinned Motion 14.1.0 runtime. No external network dependency is needed to run a downloaded example.\n\n';
fullReference += 'When adapting: preserve native semantics, keyboard and touch operation, exact timing, interruption behavior, and reduced-motion states. Keep educational playback distinct from everyday interface motion. Source modules are in src/recipes/. Do not paste only a component stylesheet without its shared tokens.\n\n';
fullReference += 'Discovery: catalog.json includes project collections, everyday/expressive intent, starter/intermediate complexity, and technology. Themes use semantic CSS custom properties. Append ?palette=radix&mode=dark&accent=indigo to a standalone example to preview a project palette. Available palettes: original, radix, geist (Geist-inspired neutrals), custom. Custom colors use custom=%237c5ce7. Exported full HTML embeds the chosen palette and works offline. theme-presets.json describes available options.\n\n';

for (const recipe of recipes) {
  const { html, css, js, ...metadata } = recipe;
  const sourceUrl = sourceRoot + (recipe.source || 'animate/SKILL.md');
  const background = resolveTheme(defaults, recipe.color)['demo-bg'];
  const paletteCss = themeCss(defaults, recipe.color);
  const code = `<!doctype html>
<!-- ${escape(recipe.title)} — Animation Playground. Original adaptation. MIT.
     Principles: ${sourceUrl}
     Complete standalone example. ${recipe.usesMotion ? 'Includes Motion 14.1.0 (MIT).' : 'No external dependencies.'}

${ownLicense}
Upstream principles and adapted recipes:
${emilLicense}
Radix Colors (embedded palette values):
${radixLicense}
${recipe.usesMotion ? `Bundled Motion license:\n${motionLicense}` : ''}
-->
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(recipe.title)} — Animation Playground</title>
  <style>
${base}
${css}
  </style>
  <style id="playground-theme">
${paletteCss}
</style>
  <script id="playground-theme-config" type="application/json">${JSON.stringify({ ...defaults, color: recipe.color })}</script>
  <script>${scriptSafe(themeBundle)}\nPlaygroundTheme.installTheme();</script>
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
      css: `/* Complete base styles and recipe styles. */\n${base}\n${css}\n/* Selected palette. Override these semantic roles inside your project. */\n${paletteCss}`,
      js: `${recipe.usesMotion ? '/* This study uses Motion 14.1.0. Copy Full HTML for the embedded runtime. */\n' : ''}${runtime}\n\n(() => {\n${js}\n})();`,
    },
    // Compact educational source shown by default; Full HTML is the runnable export.
    study: { html, css, js },
  };
  await writeFile(resolve(out, 'examples', `${recipe.id}.json`), JSON.stringify(content));
  catalog.push({ ...metadata, sourceUrl, example: `examples/${recipe.id}.html`, details: `examples/${recipe.id}.json`, link: `?animation=${recipe.id}`, background, dependencies: recipe.usesMotion ? ['Motion 14.1.0 (bundled)'] : [] });
  fullReference += `## ${recipe.title} [${recipe.id}]\n\nCategory: ${recipe.category}. Intent: ${recipe.intent}. Complexity: ${recipe.complexity}. Collections: ${recipe.collections.join(', ')}. Purpose: ${recipe.purpose}. Trigger: ${recipe.trigger}.\n${recipe.description}\n\nUse: ${recipe.useWhen}\nAvoid: ${recipe.avoidWhen}\nTiming: ${recipe.duration}; easing: ${recipe.easing}.\nReduced motion: ${recipe.reducedMotion}\nPrinciple: ${recipe.principle}\nDependencies: ${recipe.usesMotion ? 'Motion 14.1.0, bundled into the full HTML' : 'None; native browser APIs'}.\nExample: examples/${recipe.id}.html\nSource module: ${recipe.module}\nReference: ${sourceUrl}\n\n### Markup\n\n\`\`\`html\n${html}\n\`\`\`\n\n### Styles\n\n\`\`\`css\n${css}\n\`\`\`\n\n### Behavior\n\n\`\`\`js\n${js}\n\`\`\`\n\n`;
}
await writeFile(resolve(out, 'catalog.json'), JSON.stringify({ schemaVersion: 1, title: 'Animation Playground', sourceRevision: revision, count: catalog.length, collections, recipes: catalog }));
await writeFile(resolve(out, 'theme-presets.json'), JSON.stringify({ schemaVersion: 1, palettes, accents, modes: ['light', 'dark'], defaults, tokens: Object.keys(resolveTheme(defaults)), docs: 'https://github.com/spencer-life/animation-playground/blob/main/docs/theming.md' }));
await writeFile(resolve(out, 'llms-full.txt'), fullReference);
await writeFile(resolve(out, 'llms.txt'), `# Animation Playground\n\nA collection of ${catalog.length} complete, portable web animation examples.\n\n- [Catalog](./catalog.json): collections, intent, complexity, identifiers, behavior, timing, dependencies, source references.\n- [Theme presets](./theme-presets.json): palettes, accents, appearance modes, semantic color roles.\n- [Full reference](./llms-full.txt): complete educational source and use constraints.\n- [Standalone examples](./examples/): each HTML file includes everything it needs.\n- [GitHub](https://github.com/spencer-life/animation-playground): editable source, build instructions, agent guidance.\n\nUse ?animation={id} for a focused workbench. Add palette=radix&mode=dark&accent=indigo to preserve project colors. Preserve IDs, accessibility, reduction, cancellation, and timing when adapting. Native CSS and WAAPI first; Motion only for spring/gesture examples.\n`);
await writeFile(resolve(out, 'examples/index.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Standalone animation examples</title><style>body{max-width:800px;margin:40px auto;padding:20px;font:16px/1.6 system-ui;color:#20242b}a{color:#3358d4}li{margin:12px 0}</style><h1>Standalone animation examples</h1><p>Each file contains its complete styles and behavior. <a href="../">Open the playground</a>.</p><ul>${catalog.map(recipe => `<li><a href="./${recipe.id}.html">${escape(recipe.title)}</a> — ${escape(recipe.description)}</li>`).join('')}</ul></html>`);
for (const file of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) {
  try { await copyFile(resolve(root, file), resolve(out, file)); } catch (error) { if (error.code !== 'ENOENT') throw error; }
}
console.log(`Built ${catalog.length} complete examples, searchable catalog, and agent references into dist/.`);
