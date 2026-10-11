import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { enrichRecipe } from '../src/collections.mjs';

const modules = (await readdir('src/recipes')).filter(file => file.endsWith('.mjs'));
const recipes = (await Promise.all(modules.map(file => import(`../src/recipes/${file}`)))).flatMap(module => module.default);
assert(recipes.length >= 44,'The expanded collection must retain at least 44 distinct examples.');
const ids = new Set();
const required = ['id','title','category','description','purpose','useWhen','avoidWhen','principle','duration','easing','trigger','tech','color','reducedMotion','source','html','css','js'];
for (const recipe of recipes) {
  enrichRecipe(recipe);
  for (const field of required) assert.equal(typeof recipe[field],'string',`${recipe.id}: ${field} must be a string.`);
  assert.match(recipe.id,/^[a-z][a-z0-9-]+$/);
  assert(!ids.has(recipe.id),`Duplicate ID: ${recipe.id}`);
  ids.add(recipe.id);
  assert(['feedback','navigation','layout','text','entrances','expressive'].includes(recipe.category));
  assert(Array.isArray(recipe.tags) && recipe.tags.length > 0,`${recipe.id}: search vocabulary required.`);
  assert(recipe.description.length > 25 && recipe.description.length < 220,`${recipe.id}: brief explanation must be useful and concise.`);
  assert(!/transition\s*:\s*all\b/i.test(recipe.css),`${recipe.id}: enumerate transition properties.`);
  assert(!/scale\(\s*0\s*\)/.test(recipe.css + recipe.js),`${recipe.id}: no scale-zero entrances.`);
  assert(!/\bease-in\s*(;|,|\})/.test(recipe.css),`${recipe.id}: ease-in delays interface feedback.`);
  assert(!/easing\s*:\s*['"]ease-out['"]/.test(recipe.js),`${recipe.id}: deliberate motion must use the shared custom ease-out curve.`);
  assert(!/<script\b/i.test(recipe.html),`${recipe.id}: put behavior in js for source consistency.`);
  assert(!/#[a-f\d]{3,8}\b/i.test(recipe.css),`${recipe.id}: use semantic color tokens, not fixed recipe colors.`);
  assert(!/\b(?:fill|stroke|style)=["'][^"']*#[a-f\d]{3,8}\b/i.test(recipe.html),`${recipe.id}: SVG and inline styles must use semantic colors.`);
  new vm.Script(`(() => {\n${recipe.js}\n})();`,{filename:recipe.id});
  assert(recipe.js.includes('Demo.onReplay'),`${recipe.id}: replay contract required.`);
  // An SVG namespace URI identifies markup; resource attributes load content.
  assert(!/\b(?:src|srcset|href|xlink:href|poster)\s*=\s*["']\s*(?:https?:)?\/\//i.test(recipe.html),`${recipe.id}: previews must not fetch external assets.`);
}
for (const file of ['src/app.js','src/demo-runtime.js','src/theme.mjs','src/collections.mjs']) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding:'utf8' });
  assert.equal(result.status, 0, `${file}: ${result.stderr}`);
}
const packageJson = JSON.parse(await readFile('package.json','utf8'));
for (const version of Object.values({...packageJson.dependencies,...packageJson.devDependencies})) assert.match(version,/^\d+\.\d+\.\d+$/,'Direct dependency versions must be exact.');
console.log(`PASS: ${recipes.length} unique recipes; complete metadata, parseable scripts, motion rules, and pinned dependencies.`);
