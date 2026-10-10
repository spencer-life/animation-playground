import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import vm from 'node:vm';

const modules = (await readdir('src/recipes')).filter(file => file.endsWith('.mjs'));
const recipes = (await Promise.all(modules.map(file => import(`../src/recipes/${file}`)))).flatMap(module => module.default);
assert.equal(recipes.length,36,'The curated collection must contain 36 examples.');
const ids = new Set();
const required = ['id','title','category','description','purpose','useWhen','avoidWhen','principle','duration','easing','trigger','tech','color','reducedMotion','source','html','css','js'];
for (const recipe of recipes) {
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
  assert(!/<script\b/i.test(recipe.html),`${recipe.id}: put behavior in js for source consistency.`);
  new vm.Script(`(() => {\n${recipe.js}\n})();`,{filename:recipe.id});
  assert(recipe.js.includes('Demo.onReplay'),`${recipe.id}: replay contract required.`);
  // An SVG namespace URI identifies markup; resource attributes load content.
  assert(!/\b(?:src|srcset|href|xlink:href|poster)\s*=\s*["']\s*(?:https?:)?\/\//i.test(recipe.html),`${recipe.id}: previews must not fetch external assets.`);
}
for (const file of ['src/app.js','src/demo-runtime.js']) new vm.Script(await readFile(file,'utf8'),{filename:file});
const packageJson = JSON.parse(await readFile('package.json','utf8'));
for (const version of Object.values({...packageJson.dependencies,...packageJson.devDependencies})) assert.match(version,/^\d+\.\d+\.\d+$/,'Direct dependency versions must be exact.');
console.log(`PASS: ${recipes.length} unique recipes; complete metadata, parseable scripts, motion rules, and pinned dependencies.`);
