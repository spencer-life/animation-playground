// Original, portable form and feedback studies informed by Emil's MIT guidance.
// The small authoring helpers below become inline source in every export.
import { recipeIcon } from '../recipe-icons.mjs';

const icon = (paths, size = 18) => `<svg class="study-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;
const mail = icon('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>');
const file = icon('<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Zm0 0v6h6M8 14h8M8 17h5"/>');
const eye = icon('<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/>');
const cloud = icon('<path d="M6 18a4 4 0 0 1-1-7.9A7 7 0 0 1 18.4 8a5 5 0 0 1-.4 10M9 15l3 3 3-3m-3 3V9"/>', 22);
const shared = String.raw`
.form-stage { gap: 12px; padding: 14px; }
.form-panel { width: min(100%, 320px); padding: 14px; border-radius: 15px; background: var(--paper); }
.form-panel h2, .form-title { font-size: 14px; line-height: 1.35; font-weight: 650; letter-spacing: -.015em; }
.form-kicker { margin-bottom: 5px; color: var(--muted); font-size: 10px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
.form-meta { font-size: 11px; line-height: 1.4; color: var(--muted); }
.form-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.form-mark { display: inline-grid; place-items: center; flex: none; width: 34px; height: 34px; border-radius: 10px; color: var(--accent-ink); background: var(--accent-soft); }
.form-action, .form-icon-button { display: inline-flex; align-items: center; justify-content: center; gap: 7px; min-height: 44px; border: 0; border-radius: 9px; background: var(--ink); color: var(--on-ink); font-size: 12px; font-weight: 600; padding: 9px 13px; cursor: pointer; }
.form-action.secondary { padding: 7.5px 11.5px; border: 1.5px solid var(--ink); background: transparent; color: var(--ink); }
.form-icon-button { width: 44px; padding: 0; flex: none; background: transparent; color: var(--muted); }
.form-action, .form-icon-button, .form-choice, .form-check { touch-action: manipulation; -webkit-tap-highlight-color: transparent; user-select: none; transition: scale calc(140ms * var(--time-scale)) var(--ease-out); }
.form-action:active:not(:disabled), .form-icon-button:active:not(:disabled), .form-choice:active, .form-check:active { scale: .97; }
.form-action:disabled { border-color: var(--line); color: var(--muted); background: color-mix(in srgb, var(--paper), var(--ink) 6%); cursor: default; }
.form-actions { display: flex; align-items: center; gap: 8px; }
.form-label { display: block; margin-bottom: 5px; color: var(--ink); font-size: 12px; font-weight: 600; }
.form-input { width: 100%; min-width: 0; min-height: 44px; padding: 9px 11px; border: 1px solid var(--line); border-radius: 9px; background: var(--paper); color: var(--ink); font-size: 16px; }
.form-input::placeholder { color: var(--muted); opacity: 1; }
.form-sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; border: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.form-check { position: relative; display: flex; align-items: center; gap: 10px; min-height: 44px; cursor: pointer; }
.form-check input { width: 18px; height: 18px; margin: 0; flex: none; accent-color: var(--accent-ink); }
.form-number { font-variant-numeric: tabular-nums; }
:root[data-keyboard="true"] .form-stage :is(.form-action, .form-icon-button, .form-choice, .form-check):active,
:root[data-reduced="true"] .form-stage :is(.form-action, .form-icon-button, .form-choice, .form-check):active { scale: 1; }
@media (prefers-reduced-motion: reduce) { :root:not([data-reduced="false"]) .form-stage :is(.form-action, .form-icon-button, .form-choice, .form-check):active { scale: 1; } }
@media (hover: hover) and (pointer: fine) { .form-action.secondary:not(:disabled):hover { background: color-mix(in srgb, var(--paper), var(--ink) 6%); } .form-icon-button:not(:disabled):hover { color: var(--ink); background: color-mix(in srgb, var(--paper), var(--ink) 6%); } }
@media (min-height: 300px) { .form-panel { padding: 20px; } .form-panel h2, .form-title { font-size: 16px; } .form-meta { font-size: 12px; } }
`;

export default [
  {
    id: 'checkbox-check',
    title: 'A check with intent',
    category: 'feedback',
    description: 'A native checkbox draws its checkmark into a quiet email preference row.',
    purpose: 'Feedback',
    useWhen: 'A settings form needs a clear, reversible on/off choice with a comfortably sized label.',
    avoidWhen: 'Rapid spreadsheet selection or a keyboard-heavy workflow where state should change without travel.',
    principle: 'Keep a frequent control subtle: the native checked state is immediate and only its pointer feedback draws.',
    duration: '140 ms press · 160 ms check',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Select the preference or replay',
    tech: 'CSS', color: 'green', tags: ['checkbox', 'settings', 'email', 'checkmark', 'preference'],
    intent: 'everyday', collections: ['product-ui'], complexity: 'starter', added: '2026-10-10',
    reducedMotion: 'The native checkbox and visible checkmark change immediately without drawing or press travel.',
    source: 'animate/RECIPES.md',
    html: `<main class="stage form-stage"><section class="form-panel check-panel" aria-label="Demo email preference">
  <div class="form-heading"><div><p class="form-kicker">Your inbox, quieter</p><h2>Email preferences</h2></div><span class="form-mark">${mail}</span></div>
  <label class="form-check check-row"><input type="checkbox" id="digest-check" checked><span class="check-box" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="m4 10 4 4 8-9" pathLength="1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span><strong>Weekly digest</strong><small>One useful email, every Friday.</small></span></label>
  <p class="form-meta check-foot">You can change this any time.</p>
</section></main>`,
    css: shared + String.raw`
.check-row { padding: 10px 0; gap: 12px; }
.check-row input { position: absolute; width: 1px; height: 1px; opacity: 0; }
.check-box { display: grid; place-items: center; width: 24px; height: 24px; flex: none; border: 1.5px solid var(--muted); border-radius: 7px; color: var(--on-accent); background: var(--paper); }
.check-box path { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset calc(160ms * var(--time-scale)) var(--ease-out); }
.check-row input:checked + .check-box { background: var(--accent); border-color: var(--accent-ink); }
.check-row input:checked + .check-box path { stroke-dashoffset: 0; }
.check-row input:focus-visible + .check-box { outline: 3px solid var(--accent-ink); outline-offset: 4px; }
.check-row strong, .check-row small { display: block; }
.check-row strong { font-size: 13px; font-weight: 600; }
.check-row small { margin-top: 2px; color: var(--muted); font-size: 11px; }
.check-foot { border-top: 1px solid var(--line); padding-top: 10px; margin-top: 8px; }
`,
    js: String.raw`
const checkbox = document.querySelector('#digest-check');
Demo.onReplay(() => {
  checkbox.checked = false;
  void checkbox.nextElementSibling.getBoundingClientRect();
  checkbox.checked = true;
});
`,
  },
  {
    id: 'radio-selection',
    title: 'One clear choice',
    category: 'feedback',
    description: 'Three native radio options give a selected delivery cadence a small, settled marker.',
    purpose: 'State indication',
    useWhen: 'A short settings group needs one mutually exclusive choice, such as notification frequency.',
    avoidWhen: 'Large option sets, navigation tabs, or animation that delays native arrow-key selection.',
    principle: 'The selected value changes at once; a 160 ms marker supports an occasional pointer decision.',
    duration: '140 ms press · 160 ms marker',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Choose a cadence or replay',
    tech: 'CSS', color: 'blue', tags: ['radio', 'selection', 'settings', 'frequency', 'native input', 'outline'],
    intent: 'everyday', collections: ['product-ui'], complexity: 'starter', added: '2026-10-10',
    reducedMotion: 'Radio selection and the marker update immediately; native keyboard behavior is preserved.',
    source: 'emil-design-eng/SKILL.md',
    html: `<main class="stage form-stage"><fieldset class="form-panel cadence-panel"><legend>Email cadence</legend><p class="form-meta">Choose how often you hear from us.</p><div class="cadence-options">
  <label class="form-choice cadence-choice"><input type="radio" name="cadence" value="live"><span class="cadence-dot" aria-hidden="true"></span><strong>As it happens</strong></label>
  <label class="form-choice cadence-choice"><input type="radio" name="cadence" value="daily" checked><span class="cadence-dot" aria-hidden="true"></span><strong>Daily</strong></label>
  <label class="form-choice cadence-choice"><input type="radio" name="cadence" value="weekly"><span class="cadence-dot" aria-hidden="true"></span><strong>Weekly</strong></label>
</div></fieldset></main>`,
    css: shared + String.raw`
.cadence-panel { margin: 0; border: 0; padding-top: 8px; }
.cadence-panel legend { float: left; width: 100%; padding: 0 0 7px; font-size: 14px; font-weight: 650; }
.cadence-panel > p { clear: both; }
.cadence-options { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; margin-top: 16px; }
.cadence-choice { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 9px; min-height: 82px; padding: 9.5px 3.5px; border: 1.5px solid var(--muted); border-radius: 10px; cursor: pointer; }
.cadence-choice input { position: absolute; width: 1px; height: 1px; opacity: 0; }
.cadence-choice strong { font-size: 10px; line-height: 1.25; font-weight: 600; text-align: center; }
.cadence-dot { display: grid; place-items: center; width: 20px; height: 20px; border: 1.5px solid var(--muted); border-radius: 50%; }
.cadence-dot::after { content: ''; width: 10px; height: 10px; border-radius: 50%; background: var(--accent-ink); opacity: 0; transform: scale(.95); transition: transform calc(160ms * var(--time-scale)) var(--ease-out), opacity calc(160ms * var(--time-scale)) var(--ease-out); }
.cadence-choice:has(input:checked) { border-color: var(--accent-ink); }
.cadence-choice input:checked + .cadence-dot::after { transform: scale(1); opacity: 1; }
.cadence-choice:has(input:focus-visible) { outline: 3px solid var(--accent-ink); outline-offset: 3px; }
`,
    js: String.raw`
const choices = [...document.querySelectorAll('[name="cadence"]')];
Demo.onReplay(() => { choices[0].checked = true; void choices[1].parentElement.offsetWidth; choices[1].checked = true; });
`,
  },
  {
    id: 'field-validation',
    title: 'An error in context',
    category: 'feedback',
    description: 'An email field keeps space for a precise validation message, fading the result into place.',
    purpose: 'Feedback',
    useWhen: 'A form can explain a correctable field error directly beside the input that caused it.',
    avoidWhen: 'Validation on every keystroke, vague error messages, or replacing server-side validation with a visual demo.',
    principle: 'Explain the fix without shaking the field or moving its neighbors; editing clears stale feedback immediately.',
    duration: '140 ms press · 180 ms message',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Check email, finish editing, or replay',
    tech: 'WAAPI', color: 'peach', tags: ['validation', 'email', 'form', 'error', 'helper text', 'solid'],
    intent: 'everyday', collections: ['product-ui', 'landing-pages'], complexity: 'starter', added: '2026-10-10',
    reducedMotion: 'The field state and specific message update instantly; nothing shakes or travels.',
    source: 'emil-design-eng/SKILL.md',
    html: `<main class="stage form-stage"><form class="form-panel validation-form" novalidate><label class="form-label" for="validation-email">Work email</label><input class="form-input" id="validation-email" type="email" value="hello@" required autocomplete="off" spellcheck="false" autocapitalize="none" aria-describedby="validation-message"><p id="validation-message" class="validation-message form-meta" role="status">Check the address before continuing.</p><button class="form-action" type="submit">Check email</button></form></main>`,
    css: shared + String.raw`
.validation-message { display: flex; align-items: center; min-height: 38px; margin: 4px 0; }
.validation-form[data-state="error"] .form-input { border-color: var(--danger); }
.validation-form[data-state="error"] .validation-message { color: var(--danger); }
.validation-form[data-state="valid"] .validation-message { color: var(--success); }
.validation-form .form-action { width: 100%; }
`,
    js: String.raw`
const form = document.querySelector('.validation-form');
const input = document.querySelector('#validation-email');
const message = document.querySelector('#validation-message');
let animation;
function validate(animate = true) {
  const from = ['running', 'paused'].includes(animation?.playState) ? getComputedStyle(message).opacity : .35;
  animation?.cancel();
  const valid = input.validity.valid;
  form.dataset.state = valid ? 'valid' : 'error';
  input.setAttribute('aria-invalid', String(!valid));
  message.textContent = valid ? 'The email format looks right.' : input.validity.valueMissing ? 'Enter your email address.' : 'Use a full address, like hello@example.com.';
  if (animate) animation = Demo.animate(message, [{ opacity: from }, { opacity: 1 }], { duration: 180, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
}
form.addEventListener('submit', event => { event.preventDefault(); validate(); });
input.addEventListener('blur', () => { if (input.value) validate(); });
input.addEventListener('input', () => {
  animation?.cancel();
  message.style.opacity = '1';
  form.dataset.state = 'editing';
  input.removeAttribute('aria-invalid');
  message.textContent = 'Check the address before continuing.';
});
Demo.onReplay(() => { input.value = 'hello@'; validate(); });
Demo.onCleanup(() => animation?.cancel());
`,
  },
  {
    id: 'password-reveal',
    title: 'Reveal, then conceal',
    category: 'feedback',
    description: 'A password visibility control keeps focus stable while a small eye detail confirms its state.',
    purpose: 'State indication',
    useWhen: 'Someone needs to inspect a password or passphrase they have just typed.',
    avoidWhen: 'Automatically exposing sensitive input, animating the password characters, or moving keyboard focus unexpectedly.',
    principle: 'Change the input type immediately and animate only the visibility icon, with a clear pressed state.',
    duration: '140 ms press · 160 ms icon',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Show or hide the demo password',
    tech: 'CSS', color: 'graphite', tags: ['password', 'visibility', 'input', 'eye', 'reveal', 'ghost'],
    intent: 'everyday', collections: ['product-ui'], complexity: 'starter', added: '2026-10-10',
    reducedMotion: 'The input type and accessible pressed state change instantly; the icon does not travel.',
    source: 'mobile-native/SKILL.md',
    html: `<main class="stage form-stage"><section class="form-panel"><p class="form-kicker">Sign-in detail</p><label class="form-label" for="reveal-password">Demo password</label><div class="password-field"><input class="form-input" id="reveal-password" type="password" value="made-for-the-web" autocomplete="off" spellcheck="false" autocapitalize="none"><button class="form-icon-button password-toggle" type="button" aria-label="Show password" aria-pressed="false" aria-controls="reveal-password">${eye}<span class="eye-slash" aria-hidden="true"></span></button></div><p class="form-meta password-note">A little visibility, when you ask for it.</p></section></main>`,
    css: shared + String.raw`
.password-field { display: flex; align-items: center; border: 1px solid var(--line); border-radius: 10px; }
.password-field .form-input { border: 0; background: transparent; padding-right: 0; }
.password-toggle { position: relative; margin-right: 2px; }
.eye-slash { position: absolute; width: 21px; height: 1.5px; border-radius: 2px; background: currentColor; transform: rotate(45deg) scaleX(1); transition: opacity calc(160ms * var(--time-scale)) var(--ease-out), transform calc(160ms * var(--time-scale)) var(--ease-out); }
.password-toggle[aria-pressed="true"] .eye-slash { opacity: 0; transform: rotate(45deg) scaleX(.95); }
.password-note { margin-top: 12px; }
`,
    js: String.raw`
const password = document.querySelector('#reveal-password');
const toggle = document.querySelector('.password-toggle');
function reveal(shown) {
  const start = password.selectionStart, end = password.selectionEnd;
  password.type = shown ? 'text' : 'password';
  if (document.activeElement === password && start !== null) password.setSelectionRange(start, end);
  toggle.setAttribute('aria-pressed', String(shown));
  toggle.setAttribute('aria-label', shown ? 'Hide password' : 'Show password');
}
toggle.addEventListener('click', () => reveal(password.type === 'password'));
Demo.onReplay(() => { password.value = 'made-for-the-web'; reveal(false); void toggle.offsetWidth; reveal(true); });
`,
  },
  {
    id: 'password-strength',
    title: 'A helpful strength hint',
    category: 'feedback',
    description: 'A four-part passphrase hint fills as a local length-and-variety demo meets its simple rules.',
    purpose: 'State indication',
    useWhen: 'An account form needs readable, specific guidance as someone creates a passphrase.',
    avoidWhen: 'Treating this simple length-and-variety sketch as a security score; use a tested strength estimator and your actual password policy in production.',
    principle: 'Keep typing and advice immediate; the tiny bars provide a secondary, restrained state cue.',
    duration: '160 ms bars · immediate typing',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Edit the demo passphrase or replay',
    tech: 'CSS', color: 'green', tags: ['password', 'strength', 'passphrase', 'validation', 'meter'],
    intent: 'everyday', collections: ['product-ui'], complexity: 'starter', added: '2026-10-10',
    reducedMotion: 'The text hint and bar states update instantly without filling travel.',
    source: 'emil-design-eng/SKILL.md',
    html: `<main class="stage form-stage"><section class="form-panel"><label class="form-label" for="strength-password">Demo passphrase</label><input class="form-input" id="strength-password" type="text" value="paperplanes" autocomplete="off" spellcheck="false" autocapitalize="none" aria-describedby="strength-message strength-note"><div class="strength-bars" aria-hidden="true"><span data-filled="true"><i></i></span><span><i></i></span><span><i></i></span><span><i></i></span></div><p class="strength-message form-meta" id="strength-message">Try 12 or more characters.</p><p class="strength-note form-meta" id="strength-note">Length & variety demo · not a security score</p></section></main>`,
    css: shared + String.raw`
.strength-bars { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin: 14px 0 9px; }
.strength-bars span { height: 5px; border-radius: 4px; overflow: hidden; background: var(--line); }
.strength-bars i { display: block; width: 100%; height: 100%; background: var(--accent-ink); transform: scaleX(.05); transform-origin: left; opacity: 0; transition: transform calc(160ms * var(--time-scale)) var(--ease-out), opacity calc(160ms * var(--time-scale)) var(--ease-out); }
.strength-bars [data-filled="true"] i { transform: scaleX(1); opacity: 1; }
.strength-message { min-height: 16px; color: var(--accent-ink); }
.strength-note { margin-top: 12px; font-size: 10px; }
`,
    js: String.raw`
const input = document.querySelector('#strength-password');
const bars = [...document.querySelectorAll('.strength-bars span')];
const message = document.querySelector('#strength-message');
function update() {
  const value = input.value;
  const checks = [value.length >= 8, value.length >= 12, /[a-z]/.test(value) && /[A-Z]/.test(value), /[^a-zA-Z\s]/.test(value)];
  const score = checks.filter(Boolean).length;
  bars.forEach((bar, index) => { bar.dataset.filled = String(index < score); });
  message.textContent = !value ? 'Start with a memorable phrase.' : !checks[1] ? 'Try 12 or more characters.' : !checks[2] ? 'Try a mix of upper and lowercase.' : !checks[3] ? 'A number or symbol adds variety.' : 'All four demo checks are met.';
}
input.addEventListener('input', update);
Demo.onReplay(() => { input.value = 'paper'; update(); void bars[0].offsetWidth; input.value = 'Paperplanes!27'; update(); });
`,
  },
  {
    id: 'character-budget',
    title: 'Room for one more thought',
    category: 'feedback',
    description: 'A compact character budget pairs an exact remaining count with a restrained circular meter.',
    purpose: 'State indication',
    useWhen: 'A short bio, caption, or message has a real character limit that people need to understand before submitting.',
    avoidWhen: 'Arbitrary limits, bouncing counts on every keystroke, or announcing each typed character through a live region.',
    principle: 'The count and input remain immediate; a small secondary ring expresses the remaining space.',
    duration: '160 ms ring · immediate typing',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Edit the bio or replay',
    tech: 'CSS', color: 'sand', tags: ['textarea', 'character count', 'limit', 'bio', 'meter'],
    intent: 'everyday', collections: ['product-ui'], complexity: 'starter', added: '2026-10-10',
    reducedMotion: 'The remaining count and meter update immediately without stroke travel.',
    source: 'animate/SKILL.md',
    html: `<main class="stage form-stage"><section class="form-panel"><label class="form-label" for="budget-bio">A little about you</label><textarea class="form-input budget-bio" id="budget-bio" rows="2" maxlength="80" aria-describedby="budget-count">Designer. Builder.</textarea><div class="budget-footer"><span class="form-meta">Keep it under 80 characters.</span><span class="budget-reading"><svg width="26" height="26" viewBox="0 0 30 30" fill="none" aria-hidden="true"><circle cx="15" cy="15" r="11" stroke="var(--line)" stroke-width="2.5"/><circle class="budget-ring" cx="15" cy="15" r="11" pathLength="100" stroke="var(--accent-ink)" stroke-width="2.5" stroke-linecap="round" transform="rotate(-90 15 15)"/></svg><output id="budget-count" for="budget-bio" class="form-meta form-number" aria-live="off">62 left</output></span></div></section></main>`,
    css: shared + String.raw`
.budget-bio { display: block; height: 76px; min-height: 76px; resize: none; line-height: 1.4; }
.budget-footer { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 10px; }
.budget-footer > .form-meta { max-width: 130px; font-size: 10px; }
.budget-reading { display: inline-flex; align-items: center; gap: 6px; flex: none; }
.budget-reading output { min-width: 39px; text-align: right; }
.budget-ring { stroke-dasharray: 100; stroke-dashoffset: 77.5; transition: stroke-dashoffset calc(160ms * var(--time-scale)) var(--ease-out); }
.budget-reading[data-near="true"] output { color: var(--danger); }
`,
    js: String.raw`
const input = document.querySelector('#budget-bio');
const output = document.querySelector('#budget-count');
const ring = document.querySelector('.budget-ring');
function update() {
  const used = input.value.length;
  const remaining = Math.max(0, input.maxLength - used);
  output.textContent = remaining + ' left';
  output.parentElement.dataset.near = String(remaining <= 12);
  ring.style.strokeDashoffset = String(100 - Math.min(1, used / input.maxLength) * 100);
}
input.addEventListener('input', update);
Demo.onReplay(() => { input.value = ''; update(); void ring.getBoundingClientRect(); input.value = 'Designer. Builder. Always curious.'; update(); });
`,
  },
  {
    id: 'search-clear',
    title: 'Clear without losing your place',
    category: 'feedback',
    description: 'An inline clear action appears only when useful and returns focus to a real, immediately filtered search field.',
    purpose: 'Feedback',
    useWhen: 'A search box needs an easy way to clear its query and continue typing without moving focus.',
    avoidWhen: 'Animating filtered results or delaying search text in a frequently used keyboard workflow.',
    principle: 'Keep search results instant; the only motion is a small supporting clear affordance.',
    duration: '140 ms clear affordance · immediate results',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Type, clear the query, or replay',
    tech: 'CSS', color: 'blue', tags: ['search', 'clear', 'filter', 'input', 'focus', 'ghost'],
    intent: 'everyday', collections: ['product-ui', 'dashboards'], complexity: 'starter', added: '2026-10-10',
    reducedMotion: 'The clear control, query, and results change immediately; focus returns to the input.',
    source: 'emil-design-eng/SKILL.md',
    html: `<main class="stage form-stage"><section class="form-panel search-panel"><label class="form-label" for="clear-search">Find a page block</label><div class="search-field"><input class="form-input" id="clear-search" type="search" value="hero" autocomplete="off" spellcheck="false" aria-controls="clear-results"><button class="form-icon-button search-clear" type="button" aria-label="Clear search">${recipeIcon('close', 15)}</button></div><ul id="clear-results" class="search-results"><li data-name="hero section">${file}<span>Hero section</span></li><li data-name="pricing table" hidden>${file}<span>Pricing table</span></li><li data-name="footer links" hidden>${file}<span>Footer links</span></li></ul><p class="form-meta search-count" role="status">1 block found</p></section></main>`,
    css: shared + String.raw`
.search-field { display: flex; align-items: center; border: 1px solid var(--line); border-radius: 9px; }
.search-field input { border: 0; background: transparent; padding-right: 0; }
.search-field input::-webkit-search-cancel-button { -webkit-appearance: none; }
.search-clear { transition: opacity calc(140ms * var(--time-scale)) var(--ease-out), scale calc(140ms * var(--time-scale)) var(--ease-out); }
.search-clear[data-empty="true"] { opacity: 0; scale: .95; pointer-events: none; }
.search-results { height: 78px; padding: 5px 0 0; margin: 0; list-style: none; }
.search-results li { display: flex; align-items: center; gap: 7px; height: 24px; color: var(--ink); font-size: 11px; }
.search-results svg { width: 13px; height: 13px; color: var(--muted); }
.search-count { font-size: 10px; }
`,
    js: String.raw`
const input = document.querySelector('#clear-search');
const clear = document.querySelector('.search-clear');
const results = [...document.querySelectorAll('.search-results li')];
const count = document.querySelector('.search-count');
function update() {
  const query = input.value.toLowerCase().trim();
  const empty = input.value.length === 0;
  clear.dataset.empty = String(empty);
  clear.disabled = empty;
  clear.setAttribute('aria-hidden', String(empty));
  results.forEach(row => { row.hidden = !row.dataset.name.includes(query); });
  const total = results.filter(row => !row.hidden).length;
  count.textContent = total ? total + (total === 1 ? ' block found' : ' blocks found') : 'No matching blocks';
}
input.addEventListener('input', update);
clear.addEventListener('click', () => { input.value = ''; update(); input.focus(); });
Demo.onReplay(() => { input.value = ''; update(); void clear.offsetWidth; input.value = 'hero'; update(); });
`,
  },
  {
    id: 'copy-confirm',
    title: 'Copied, with certainty',
    category: 'feedback',
    description: 'A copy action swaps its icon and label only after the clipboard confirms success, with a useful manual fallback.',
    purpose: 'Feedback',
    useWhen: 'Someone copies an invite code, reference number, or reusable snippet and needs a local confirmation.',
    avoidWhen: 'Claiming success before the clipboard resolves, repeatedly interrupting with a toast, or copying automatically on load.',
    principle: 'Keep feedback beside the action and tie the success state to its actual result.',
    duration: '140 ms press · 180 ms icon swap',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Copy code; replay previews feedback without copying',
    tech: 'CSS', color: 'lavender', tags: ['clipboard', 'copy', 'confirmation', 'code', 'fallback', 'solid'],
    intent: 'everyday', collections: ['product-ui', 'dashboards'], complexity: 'intermediate', added: '2026-10-10',
    reducedMotion: 'The result, icon, and label update instantly; clipboard failure still offers manual selection.',
    source: 'emil-design-eng/SKILL.md',
    html: `<main class="stage form-stage"><section class="form-panel copy-panel"><p class="form-kicker">Bring someone along</p><label class="form-label" for="copy-code">Demo invite code</label><div class="copy-code-row"><input class="form-input form-number" id="copy-code" value="FIELD-2026" readonly spellcheck="false"><button class="form-action copy-action" type="button"><span class="copy-symbols" aria-hidden="true"><span class="copy-original">${icon('<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>', 16)}</span><span class="copy-done">${recipeIcon('check', 16)}</span></span><span class="copy-label">Copy</span></button></div><p class="copy-message form-meta" role="status">Ready when you are.</p></section></main>`,
    css: shared + String.raw`
.copy-code-row { display: flex; gap: 8px; }
.copy-code-row input { font-size: 14px; letter-spacing: .02em; }
.copy-action { min-width: 92px; padding-inline: 10px; }
.copy-symbols { position: relative; display: block; width: 16px; height: 16px; }
.copy-symbols > span { position: absolute; inset: 0; transition: opacity calc(180ms * var(--time-scale)) var(--ease-out), transform calc(180ms * var(--time-scale)) var(--ease-out); }
.copy-done { opacity: 0; transform: translateY(25%); }
.copy-action[data-confirmed="true"] .copy-original { opacity: 0; transform: translateY(-25%); }
.copy-action[data-confirmed="true"] .copy-done { opacity: 1; transform: translateY(0); }
.copy-message { margin-top: 12px; min-height: 31px; }
@media (pointer: coarse) { .copy-code-row input { font-size: 16px; } }
`,
    js: String.raw`
const input = document.querySelector('#copy-code');
const button = document.querySelector('.copy-action');
const label = document.querySelector('.copy-label');
const message = document.querySelector('.copy-message');
let generation = 0;
function show(title, detail, confirmed) { label.textContent = title; message.textContent = detail; button.dataset.confirmed = String(confirmed); }
button.addEventListener('click', async () => {
  const run = ++generation;
  let copied = false;
  try { await navigator.clipboard.writeText(input.value); copied = true; } catch {
    if (run !== generation) return;
    input.focus(); input.select();
    try { copied = document.execCommand('copy'); } catch { /* Keep the native selection for manual copying. */ }
  }
  if (run !== generation) return;
  if (copied) {
    show('Copied', 'Invite code copied to your clipboard.', true);
    if (document.activeElement === input) button.focus();
  } else {
    show('Copy', 'Code selected. Use your device’s Copy command.', false);
    input.focus(); input.select();
  }
});
Demo.onReplay(() => { generation += 1; show('Copy', 'Ready when you are.', false); void button.offsetWidth; show('Preview', 'Replay preview · clipboard unchanged.', true); });
Demo.onCleanup(() => { generation += 1; });
`,
  },
  {
    id: 'upload-queue',
    title: 'One file after another',
    category: 'feedback',
    description: 'Two clearly labeled demo files progress through a cancellable upload queue with stable rows and completion marks.',
    purpose: 'State indication',
    useWhen: 'A file transfer has distinct queued, uploading, canceled, and complete states that should remain visible.',
    avoidWhen: 'Inventing progress for a real request. Replace these finite simulated transfers with actual byte or request events.',
    principle: 'Keep file identity stable and make cancellation available while a bounded sequence is in progress.',
    duration: '1.5 s simulated queue · 160 ms completion marks',
    easing: 'linear progress; cubic-bezier(0.23, 1, 0.32, 1) feedback',
    trigger: 'Start demo, cancel, or replay',
    tech: 'WAAPI', color: 'blue', tags: ['upload', 'queue', 'files', 'progress', 'cancel', 'transfer', 'solid', 'outline'],
    intent: 'everyday', collections: ['product-ui', 'dashboards'], complexity: 'intermediate', added: '2026-10-10',
    reducedMotion: 'Both demo files complete immediately without progress travel; cancellation retains a readable state.',
    source: 'animate/SKILL.md',
    html: `<main class="stage form-stage"><section class="form-panel upload-panel"><div class="form-heading"><h2>Upload queue</h2><span class="form-meta">Local demo</span></div><ol class="upload-list">
  <li><span class="upload-file">${file}</span><div class="upload-content"><div><strong>cover.png</strong><span class="upload-state">Queued</span></div><div class="upload-track" role="progressbar" aria-label="cover.png demo transfer" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div></div><span class="upload-check" aria-hidden="true">${recipeIcon('check', 15)}</span></li>
  <li><span class="upload-file">${file}</span><div class="upload-content"><div><strong>notes.pdf</strong><span class="upload-state">Queued</span></div><div class="upload-track" role="progressbar" aria-label="notes.pdf demo transfer" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div></div><span class="upload-check" aria-hidden="true">${recipeIcon('check', 15)}</span></li>
</ol><div class="form-actions upload-actions"><button class="form-action upload-start" type="button">Start demo</button><button class="form-action secondary upload-cancel" type="button" disabled>Cancel</button><span class="form-sr upload-status" role="status">Two files queued.</span></div></section></main>`,
    css: shared + String.raw`
.upload-panel .form-heading { margin-bottom: 8px; }
.upload-list { list-style: none; margin: 0; padding: 0; }
.upload-list li { display: flex; align-items: center; gap: 9px; min-height: 44px; }
.upload-file { color: var(--muted); }
.upload-content { min-width: 0; flex: 1; }
.upload-content > div:first-child { display: flex; justify-content: space-between; gap: 8px; font-size: 10px; }
.upload-content strong { font-weight: 600; }
.upload-state { color: var(--muted); font-size: 9px; }
.upload-track { height: 3px; overflow: hidden; border-radius: 3px; margin-top: 6px; background: var(--line); }
.upload-track i { display: block; width: 100%; height: 100%; background: var(--accent-ink); transform: scaleX(0); transform-origin: left; }
.upload-check { width: 15px; color: var(--success); opacity: 0; transform: scale(.9); transition: opacity calc(160ms * var(--time-scale)) var(--ease-out), transform calc(160ms * var(--time-scale)) var(--ease-out); }
.upload-list [data-done="true"] .upload-check { opacity: 1; transform: scale(1); }
.upload-actions { margin-top: 10px; }
.upload-actions .form-action { flex: 1; }
`,
    js: String.raw`
const rows = [...document.querySelectorAll('.upload-list li')];
const start = document.querySelector('.upload-start');
const cancel = document.querySelector('.upload-cancel');
const status = document.querySelector('.upload-status');
let generation = 0, animation, busy = false;
function stop() {
  generation += 1;
  for (const row of rows) { const fill = row.querySelector('i'); fill.style.transform = getComputedStyle(fill).transform; }
  animation?.cancel(); animation = null; busy = false; cancel.disabled = true;
}
function complete() {
  const restoreFocus = document.activeElement === cancel;
  stop();
  rows.forEach(row => {
    row.dataset.done = 'true'; row.querySelector('i').style.transform = 'scaleX(1)';
    const progress = row.querySelector('[role="progressbar"]');
    progress.setAttribute('aria-valuenow', '100'); progress.setAttribute('aria-valuetext', 'Complete');
    row.querySelector('.upload-state').textContent = 'Complete';
  });
  start.textContent = 'Run again'; status.textContent = 'Two demo files uploaded.';
  if (restoreFocus) start.focus();
}
async function upload() {
  stop();
  rows.forEach(row => {
    row.dataset.done = 'false'; row.querySelector('i').style.transform = 'scaleX(0)';
    const progress = row.querySelector('[role="progressbar"]');
    progress.setAttribute('aria-valuenow', '0'); progress.setAttribute('aria-valuetext', 'Queued');
    row.querySelector('.upload-state').textContent = 'Queued';
  });
  if (Demo.duration(1) === 0 || Demo.paused) { complete(); return; }
  const run = generation; busy = true; cancel.disabled = false; start.textContent = 'Restart';
  for (const [index, row] of rows.entries()) {
    const progress = row.querySelector('[role="progressbar"]');
    // This local demonstration has no measured transfer bytes to announce.
    progress.removeAttribute('aria-valuenow'); progress.setAttribute('aria-valuetext', 'Uploading');
    row.querySelector('.upload-state').textContent = 'Uploading';
    status.textContent = 'Uploading demo file ' + (index + 1) + ' of 2.';
    animation = Demo.animate(row.querySelector('i'), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: index === 0 ? 900 : 600, easing: 'linear' });
    try { await animation.finished; } catch { return; }
    if (run !== generation) return;
    row.querySelector('i').style.transform = 'scaleX(1)'; animation.cancel(); animation = null;
    row.dataset.done = 'true'; progress.setAttribute('aria-valuenow', '100'); progress.setAttribute('aria-valuetext', 'Complete'); row.querySelector('.upload-state').textContent = 'Complete';
  }
  complete();
}
start.addEventListener('click', upload);
cancel.addEventListener('click', () => {
  stop();
  rows.forEach(row => {
    if (row.dataset.done === 'true') return;
    const progress = row.querySelector('[role="progressbar"]');
    progress.removeAttribute('aria-valuenow'); progress.setAttribute('aria-valuetext', 'Canceled before completion');
    row.querySelector('.upload-state').textContent = 'Canceled';
  });
  start.textContent = 'Start again'; status.textContent = 'Demo transfer canceled.'; start.focus();
});
Demo.onReplay(upload);
Demo.onSettings(() => { if (Demo.reduced && busy) complete(); });
Demo.onCleanup(stop);
`,
  },
  {
    id: 'upload-dropzone',
    title: 'A place to drop it',
    category: 'feedback',
    description: 'A native file picker and drop target acknowledge an attachment without reading or uploading its contents.',
    purpose: 'Feedback',
    useWhen: 'A file attachment field benefits from clear drag-over feedback and a keyboard-accessible picker.',
    avoidWhen: 'A drop-only control, hiding file restrictions, or implying a selected file has already been uploaded.',
    principle: 'Make drag-over and selected states clear while keeping the native picker as the primary accessible path.',
    duration: '140 ms press · 180 ms drop feedback',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Choose a file, drop a file, or try the demo attachment',
    tech: 'CSS', color: 'sand', tags: ['upload', 'dropzone', 'file picker', 'attachment', 'drag and drop', 'outline'],
    intent: 'everyday', collections: ['product-ui'], complexity: 'intermediate', added: '2026-10-10',
    reducedMotion: 'Drag-over and selected states change instantly; the picker, filenames, and status stay usable.',
    source: 'mobile-native/SKILL.md',
    html: `<main class="stage form-stage"><section class="form-panel drop-panel"><h2>Add an attachment</h2><label class="form-choice drop-target"><input class="form-sr" id="drop-file" type="file"><span class="drop-symbol" aria-hidden="true">${icon('<path d="M12 16V3m-5 5 5-5 5 5M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>', 23)}</span><span class="drop-name">Choose or drop one file</span><span class="form-meta drop-detail">Selected locally · never uploaded</span></label><div class="drop-footer"><button class="form-action secondary drop-demo" type="button">Try demo file</button><span class="form-meta drop-status" role="status">No file selected</span></div></section></main>`,
    css: shared + String.raw`
.drop-panel > h2 { margin-bottom: 9px; }
.drop-target { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; min-height: 94px; border: 1px dashed var(--muted); border-radius: 11px; padding: 9px; cursor: pointer; }
.drop-target:focus-within { outline: 3px solid var(--accent-ink); outline-offset: 3px; }
.drop-target[data-over="true"] { border-color: var(--accent-ink); background: var(--accent-soft); }
.drop-symbol { color: var(--accent-ink); transition: transform calc(180ms * var(--time-scale)) var(--ease-out); }
.drop-target[data-over="true"] .drop-symbol { transform: translateY(-12%); }
.drop-target[data-selected="true"] .drop-symbol { transform: translateY(0); }
.drop-name { width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: center; font-size: 12px; font-weight: 600; }
.drop-detail { font-size: 9px; }
.drop-footer { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
.drop-footer .form-action { flex: none; }
.drop-status { min-width: 0; font-size: 9px; }
`,
    js: String.raw`
const target = document.querySelector('.drop-target');
const input = document.querySelector('#drop-file');
const name = document.querySelector('.drop-name');
const detail = document.querySelector('.drop-detail');
const status = document.querySelector('.drop-status');
let depth = 0;
function select(attachment, demo = false) {
  depth = 0; target.dataset.over = 'false';
  if (!attachment) {
    target.dataset.selected = 'false'; name.textContent = 'Choose or drop one file'; name.removeAttribute('title');
    detail.textContent = 'Selected locally · never uploaded'; status.textContent = 'No file selected'; return;
  }
  if (input.files[0] !== attachment) {
    const selection = new DataTransfer(); selection.items.add(attachment); input.files = selection.files;
  }
  target.dataset.selected = 'true';
  const selected = input.files[0];
  name.textContent = selected.name; name.title = selected.name;
  detail.textContent = (selected.size < 1024 ? selected.size + ' B' : Math.round(selected.size / 1024) + ' KB') + ' · selected locally';
  status.textContent = demo ? 'Demo file selected' : 'File selected. Nothing uploaded.';
}
input.addEventListener('change', () => select(input.files[0]));
target.addEventListener('dragenter', event => { event.preventDefault(); depth += 1; target.dataset.over = 'true'; });
target.addEventListener('dragover', event => { event.preventDefault(); if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'; });
target.addEventListener('dragleave', () => { depth = Math.max(0, depth - 1); if (!depth) target.dataset.over = 'false'; });
target.addEventListener('drop', event => { event.preventDefault(); const attachment = event.dataTransfer?.files[0]; if (attachment) select(attachment); depth = 0; target.dataset.over = 'false'; });
function demo() { select(new File(['A local demo attachment for Animation Playground.'], 'project-notes.txt', { type: 'text/plain' }), true); }
document.querySelector('.drop-demo').addEventListener('click', demo);
Demo.onReplay(() => { target.dataset.over = 'true'; void target.offsetWidth; demo(); });
Demo.onCleanup(() => { depth = 0; });
`,
  },
  {
    id: 'connection-status',
    title: 'Connected, or still in control',
    category: 'feedback',
    description: 'A compact connection indicator switches between online and offline states while explaining what remains available.',
    purpose: 'State indication',
    useWhen: 'An editing workspace must make a connection change legible without interrupting the current task.',
    avoidWhen: 'Using a decorative pulse as a connectivity check or repeatedly animating a stable connection.',
    principle: 'Describe the impact of the state change; a quiet connection line supports the text without looping.',
    duration: '140 ms press · 180 ms connection line',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Simulate going offline or online',
    tech: 'CSS', color: 'green', tags: ['connection', 'offline', 'online', 'status', 'workspace', 'outline'],
    intent: 'everyday', collections: ['product-ui', 'dashboards'], complexity: 'starter', added: '2026-10-10',
    reducedMotion: 'The status and connecting line change instantly; the explanation is always visible.',
    source: 'emil-design-eng/SKILL.md',
    html: `<main class="stage form-stage"><section class="form-panel connection-panel" data-online="true"><div class="form-heading"><div><p class="form-kicker">Connection demo</p><h2>Your workspace</h2></div><span class="connection-art" aria-hidden="true"><span></span><i></i><span></span></span></div><div class="connection-copy" role="status"><strong class="connection-label">Online</strong><p class="form-meta connection-detail">Your changes can sync.</p></div><button class="form-action secondary connection-toggle" type="button">Go offline</button></section></main>`,
    css: shared + String.raw`
.connection-art { display: flex; align-items: center; width: 58px; }
.connection-art span { width: 9px; height: 9px; flex: none; border: 2px solid var(--accent-ink); border-radius: 50%; }
.connection-art i { flex: 1; height: 2px; background: var(--accent-ink); transform: scaleX(1); transform-origin: left; transition: transform calc(180ms * var(--time-scale)) var(--ease-out), opacity calc(180ms * var(--time-scale)) var(--ease-out); }
.connection-panel[data-online="false"] .connection-art i { transform: scaleX(.18); opacity: .35; }
.connection-copy { margin: 14px 0; }
.connection-label { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--success); }
.connection-label::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.connection-panel[data-online="false"] .connection-label { color: var(--muted); }
.connection-detail { margin-top: 4px; }
`,
    js: String.raw`
const panel = document.querySelector('.connection-panel');
const label = document.querySelector('.connection-label');
const detail = document.querySelector('.connection-detail');
const button = document.querySelector('.connection-toggle');
function setOnline(online) {
  panel.dataset.online = String(online);
  label.textContent = online ? 'Online' : 'Offline';
  detail.textContent = online ? 'Your changes can sync.' : 'You can keep editing this demo.';
  button.textContent = online ? 'Go offline' : 'Go online';
}
button.addEventListener('click', () => setOnline(panel.dataset.online !== 'true'));
Demo.onReplay(() => { setOnline(false); void panel.offsetWidth; setOnline(true); });
`,
  },
  {
    id: 'sync-status',
    title: 'Save the version you meant',
    category: 'feedback',
    description: 'A revision-aware sync indicator cancels stale completion feedback if the title changes while a demo save is pending.',
    purpose: 'State indication',
    useWhen: 'An editor needs to distinguish unsynced changes, an in-flight revision, and the revision that actually finished saving.',
    avoidWhen: 'Claiming newer edits are saved when an earlier request finishes; the demo delay must be replaced with the real persistence promise.',
    principle: 'Feedback belongs to a specific revision. Typing stays immediate and invalidates any stale success result.',
    duration: '800 ms simulated sync · immediate confirmation',
    easing: 'linear sync; cubic-bezier(0.23, 1, 0.32, 1) feedback',
    trigger: 'Edit the title, sync, or replay',
    tech: 'WAAPI', color: 'graphite', tags: ['sync', 'autosave', 'revision', 'editor', 'race condition', 'status', 'outline'],
    intent: 'everyday', collections: ['product-ui', 'dashboards'], complexity: 'intermediate', added: '2026-10-10',
    reducedMotion: 'The latest demo revision saves immediately; edits still cancel older completion callbacks.',
    source: 'emil-design-eng/SKILL.md',
    html: `<main class="stage form-stage"><section class="form-panel sync-panel"><div class="form-heading"><label class="form-title" for="sync-title">Page title</label><span class="sync-symbol" aria-hidden="true">${cloud}</span></div><input class="form-input" id="sync-title" value="A quieter homepage" autocomplete="off" aria-describedby="sync-status"><div class="sync-footer"><p class="form-meta sync-status" id="sync-status" role="status">Revision 1 · unsynced</p><button class="form-action secondary sync-action" type="button">Sync demo</button></div></section></main>`,
    css: shared + String.raw`
.sync-symbol { color: var(--muted); }
.sync-panel[data-saved="true"] .sync-symbol { color: var(--success); }
.sync-footer { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 12px; }
.sync-status { max-width: 125px; font-size: 10px; }
.sync-action { flex: none; }
`,
    js: String.raw`
const input = document.querySelector('#sync-title');
const panel = document.querySelector('.sync-panel');
const symbol = document.querySelector('.sync-symbol');
const status = document.querySelector('.sync-status');
const button = document.querySelector('.sync-action');
let revision = 1, generation = 0, animation, busy = false;
function stop() { generation += 1; animation?.cancel(); animation = null; symbol.style.opacity = '1'; busy = false; }
function saved() { stop(); panel.dataset.saved = 'true'; status.textContent = 'Revision ' + revision + ' · synced locally'; button.textContent = 'Sync again'; }
async function sync() {
  stop(); panel.dataset.saved = 'false';
  if (Demo.duration(1) === 0 || Demo.paused) { saved(); return; }
  const run = generation, savingRevision = revision;
  busy = true; status.textContent = 'Syncing revision ' + savingRevision + '…'; button.textContent = 'Restart sync';
  animation = Demo.animate(symbol, [{ opacity: .4 }, { opacity: 1 }, { opacity: .4 }, { opacity: 1 }], { duration: 800, easing: 'linear' });
  try { await animation.finished; } catch { return; }
  if (run === generation && revision === savingRevision) saved();
}
input.addEventListener('input', () => { stop(); revision += 1; panel.dataset.saved = 'false'; status.textContent = 'Revision ' + revision + ' · unsynced'; button.textContent = 'Sync demo'; });
button.addEventListener('click', sync);
Demo.onReplay(() => { stop(); revision = 1; input.value = 'A quieter homepage'; sync(); });
Demo.onSettings(() => { if (Demo.reduced && busy) saved(); });
Demo.onCleanup(stop);
`,
  },
  {
    id: 'form-success',
    title: 'A clear finish',
    category: 'feedback',
    description: 'A valid local form becomes a compact receipt, with an explicit path back to the details you entered.',
    purpose: 'Feedback',
    useWhen: 'An occasional completed form deserves a clear receipt and a predictable next action.',
    avoidWhen: 'Celebrating before a real submission succeeds, hiding invalid fields, or making a receipt disappear on a timer.',
    principle: 'An occasional completion earns a restrained reveal; move focus to the result and preserve a way to edit.',
    duration: '140 ms press · 220 ms receipt',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Send the local demo form, edit details, or replay',
    tech: 'WAAPI', color: 'green', tags: ['form', 'success', 'receipt', 'confirmation', 'submit', 'focus', 'solid', 'outline'],
    intent: 'everyday', collections: ['product-ui', 'landing-pages'], complexity: 'intermediate', added: '2026-10-10',
    reducedMotion: 'The receipt appears immediately, with the same focus movement and edit action.',
    source: 'animate/SKILL.md',
    html: `<main class="stage form-stage"><section class="form-panel success-panel"><form class="success-form"><h2>Request a preview</h2><label class="form-label" for="success-email">Email address</label><input class="form-input" id="success-email" type="email" value="hello@example.com" required autocomplete="off" autocapitalize="none"><button class="form-action" type="submit">Send demo request</button><p class="form-meta">Local demo · nothing is sent</p></form><div class="success-receipt" hidden><span class="success-seal" aria-hidden="true">${recipeIcon('check', 24)}</span><h2 tabindex="-1">You’re on the demo list.</h2><p class="form-meta">Your details stay in this preview.</p><button class="form-action secondary success-edit" type="button">Edit details</button></div></section></main>`,
    css: shared + String.raw`
.success-panel { padding: 12px 14px; }
.success-form h2 { margin-bottom: 8px; }
.success-form .form-label { font-size: 11px; margin-bottom: 3px; }
.success-form .form-action { width: 100%; margin-top: 8px; }
.success-form > p { text-align: center; font-size: 9px; margin-top: 6px; }
.success-receipt { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 166px; text-align: center; gap: 9px; }
.success-seal { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; background: var(--accent-soft); color: var(--accent-ink); }
.success-receipt h2 { font-size: 14px; }
.success-receipt .form-meta { font-size: 10px; }
.success-edit { margin-top: 3px; }
`,
    js: String.raw`
const form = document.querySelector('.success-form');
const receipt = document.querySelector('.success-receipt');
const input = document.querySelector('#success-email');
const edit = document.querySelector('.success-edit');
let animation;
function showReceipt(focus) {
  animation?.cancel(); form.hidden = true; receipt.hidden = false;
  if (focus) receipt.querySelector('h2').focus({ preventScroll: true });
  animation = Demo.animate(receipt, [{ opacity: .25, transform: 'translateY(5%)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 220, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
}
function showForm(focus) { animation?.cancel(); receipt.hidden = true; form.hidden = false; if (focus) input.focus({ preventScroll: true }); }
form.addEventListener('submit', event => { event.preventDefault(); if (form.reportValidity()) showReceipt(true); });
edit.addEventListener('click', () => showForm(true));
Demo.onReplay(() => { showForm(false); showReceipt(false); });
Demo.onCleanup(() => animation?.cancel());
`,
  },
  {
    id: 'retry-feedback',
    title: 'A useful second try',
    category: 'feedback',
    description: 'An unavailable preview keeps its context during a cancellable retry, then reveals the recovered result.',
    purpose: 'State indication',
    useWhen: 'A failed request can be retried in place without discarding the surrounding page or the person’s work.',
    avoidWhen: 'Automatic retry loops, hiding the original error while waiting, or showing success before the real request finishes.',
    principle: 'Keep recovery local, show what is happening, and let the person cancel the wait.',
    duration: '900 ms simulated retry · 180 ms result',
    easing: 'linear wait; cubic-bezier(0.23, 1, 0.32, 1) result',
    trigger: 'Try again, cancel, reset, or replay',
    tech: 'WAAPI', color: 'peach', tags: ['retry', 'error', 'recovery', 'loading', 'cancel', 'preview', 'solid', 'outline'],
    intent: 'everyday', collections: ['product-ui', 'dashboards'], complexity: 'intermediate', added: '2026-10-10',
    reducedMotion: 'Retry immediately reveals the recovered demo preview; result text and controls remain available.',
    source: 'emil-design-eng/SKILL.md',
    html: `<main class="stage form-stage"><section class="form-panel retry-panel"><div class="retry-preview" aria-hidden="true"><div class="retry-art"><span></span><i></i><i></i></div><span class="retry-error">${icon('<circle cx="12" cy="12" r="9"/><path d="M12 7v6m0 4h.01"/>', 25)}</span><i class="retry-wait"></i></div><div class="retry-copy" role="status"><h2>Preview unavailable</h2><p class="form-meta">The demo request failed.</p></div><div class="form-actions"><button class="form-action retry-action" type="button">Try again</button><button class="form-action secondary retry-cancel" type="button" disabled>Cancel</button></div></section></main>`,
    css: shared + String.raw`
.retry-preview { height: 52px; position: relative; overflow: hidden; border-radius: 9px; background: var(--demo-bg); margin-bottom: 10px; }
.retry-error { position: absolute; inset: 0; display: grid; place-items: center; color: var(--muted); }
.retry-art { display: flex; align-items: center; gap: 8px; padding: 10px 14px; height: 100%; opacity: 0; }
.retry-art span { width: 32px; height: 32px; flex: none; border-radius: 8px; background: var(--art-1); }
.retry-art i { width: 28%; height: 5px; border-radius: 3px; background: var(--line); }
.retry-wait { position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background: var(--accent-ink); transform: scaleX(0); transform-origin: left; }
.retry-copy { margin-bottom: 10px; }
.retry-copy h2 { font-size: 13px; }
.retry-copy p { margin-top: 3px; font-size: 10px; }
.retry-panel .form-action { flex: 1; }
`,
    js: String.raw`
const panel = document.querySelector('.retry-panel');
const title = document.querySelector('.retry-copy h2');
const message = document.querySelector('.retry-copy p');
const art = document.querySelector('.retry-art');
const error = document.querySelector('.retry-error');
const fill = document.querySelector('.retry-wait');
const button = document.querySelector('.retry-action');
const cancel = document.querySelector('.retry-cancel');
let generation = 0, animations = [], state = 'error';
function stop() { generation += 1; animations.forEach(animation => animation.cancel()); animations = []; cancel.disabled = true; button.disabled = false; panel.setAttribute('aria-busy', 'false'); }
function reset() { stop(); state = 'error'; art.style.opacity = '0'; error.hidden = false; fill.style.transform = 'scaleX(0)'; title.textContent = 'Preview unavailable'; message.textContent = 'The demo request failed.'; button.textContent = 'Try again'; }
function finish() {
  const restoreFocus = document.activeElement === cancel;
  stop(); state = 'ready'; error.hidden = true; fill.style.transform = 'scaleX(0)'; art.style.opacity = '1'; title.textContent = 'Preview is ready'; message.textContent = 'Recovered locally. Nothing was fetched.'; button.textContent = 'Reset demo';
  animations.push(Demo.animate(art, [{ opacity: .25 }, { opacity: 1 }], { duration: 180, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }));
  if (restoreFocus) button.focus();
}
async function retry() {
  reset();
  if (Demo.duration(1) === 0 || Demo.paused) { finish(); return; }
  const run = generation; state = 'waiting'; panel.setAttribute('aria-busy', 'true'); button.disabled = true; cancel.disabled = false;
  title.textContent = 'Trying again…'; message.textContent = 'Previous demo request failed. Retrying locally.';
  const waiting = Demo.animate(fill, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 900, easing: 'linear' }); animations.push(waiting);
  try { await waiting.finished; } catch { return; }
  if (run === generation) finish();
}
button.addEventListener('click', () => state === 'ready' ? reset() : retry());
cancel.addEventListener('click', () => { reset(); message.textContent = 'Retry canceled. You can try again.'; button.focus(); });
Demo.onReplay(retry);
Demo.onSettings(() => { if (Demo.reduced && state === 'waiting') finish(); });
Demo.onCleanup(stop);
`,
  },
  {
    id: 'undo-removal',
    title: 'A reversible goodbye',
    category: 'feedback',
    description: 'A removable demo draft leaves through a short, reversible path while an inline undo action keeps recovery close.',
    purpose: 'Spatial consistency',
    useWhen: 'A reversible local removal should be easy to undo without a modal confirmation or a disappearing timer.',
    avoidWhen: 'Irreversible deletion, silently removing persisted data, or hiding undo before someone can reach it.',
    principle: 'Keep the item’s place and provide forgiveness; undo returns along the same path and restores focus.',
    duration: '140 ms press · 180 ms reversible exit',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Remove the demo draft, undo, or replay',
    tech: 'CSS', color: 'sand', tags: ['undo', 'remove', 'delete', 'reversible', 'draft', 'focus', 'outline', 'ghost'],
    intent: 'everyday', collections: ['product-ui', 'dashboards'], complexity: 'intermediate', added: '2026-10-10',
    reducedMotion: 'The draft and undo state change immediately, with identical focus recovery and no travel.',
    source: 'apple-design/SKILL.md',
    html: `<main class="stage form-stage"><section class="form-panel undo-panel" data-removed="false"><div class="form-heading"><h2>Page drafts</h2><span class="form-meta">Local demo</span></div><div class="undo-row undo-current">${file}<span>Current homepage</span><span class="form-meta">Keep</span></div><div class="undo-slot"><div class="undo-row undo-draft">${file}<span>Old hero draft</span><button class="form-icon-button undo-remove" type="button" aria-label="Remove old hero draft">${recipeIcon('close', 15)}</button></div><p class="undo-placeholder form-meta" aria-hidden="true">Draft moved to demo trash</p></div><div class="undo-footer"><p class="undo-status form-meta" role="status">Nothing is removed permanently.</p><button class="form-action secondary undo-restore" type="button" hidden>${recipeIcon('undo', 14)}Undo</button></div></section></main>`,
    css: shared + String.raw`
.undo-panel .form-heading { margin-bottom: 6px; }
.undo-row { display: flex; align-items: center; gap: 8px; min-height: 44px; font-size: 11px; }
.undo-row > svg { width: 16px; color: var(--muted); }
.undo-row > span:nth-child(2) { flex: 1; }
.undo-current > .form-meta { font-size: 9px; }
.undo-slot { position: relative; height: 44px; }
.undo-draft { position: relative; z-index: 1; background: var(--paper); transition: opacity calc(180ms * var(--time-scale)) var(--ease-out), transform calc(180ms * var(--time-scale)) var(--ease-out); }
.undo-placeholder { position: absolute; inset: 0; display: flex; align-items: center; font-size: 10px; opacity: 0; transition: opacity calc(180ms * var(--time-scale)) var(--ease-out); }
.undo-panel[data-removed="true"] .undo-draft { opacity: 0; transform: translateX(6%); pointer-events: none; }
.undo-panel[data-removed="true"] .undo-placeholder { opacity: 1; }
.undo-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 44px; margin-top: 8px; border-top: 1px solid var(--line); padding-top: 7px; }
.undo-status { max-width: 145px; font-size: 9px; }
`,
    js: String.raw`
const panel = document.querySelector('.undo-panel');
const draft = document.querySelector('.undo-draft');
const remove = document.querySelector('.undo-remove');
const undo = document.querySelector('.undo-restore');
const status = document.querySelector('.undo-status');
function setRemoved(removed, focus = false) {
  panel.dataset.removed = String(removed);
  draft.inert = removed; draft.setAttribute('aria-hidden', String(removed));
  undo.hidden = !removed;
  status.textContent = removed ? 'Old hero draft removed. Undo is available.' : 'Nothing is removed permanently.';
  if (focus) (removed ? undo : remove).focus({ preventScroll: true });
}
remove.addEventListener('click', () => setRemoved(true, true));
undo.addEventListener('click', () => setRemoved(false, true));
Demo.onReplay(() => { setRemoved(false); void draft.offsetWidth; setRemoved(true); });
`,
  },
  {
    id: 'rating-stars',
    title: 'A rating that settles',
    category: 'feedback',
    description: 'Five native radio choices fill a restrained star rating and keep its selected value explicit in text.',
    purpose: 'Feedback',
    useWhen: 'An occasional review or feedback form asks for one clearly labeled rating.',
    avoidWhen: 'Decorative ratings, hover-only values, or delaying keyboard arrow navigation with playful bounces.',
    principle: 'Use native exclusive selection and a readable value; a small settle supports the pointer choice.',
    duration: '140 ms press · 160 ms star fill',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Choose one to five stars or replay',
    tech: 'CSS', color: 'sand', tags: ['rating', 'stars', 'review', 'radio', 'feedback form'],
    intent: 'everyday', collections: ['product-ui', 'landing-pages'], complexity: 'starter', added: '2026-10-10',
    reducedMotion: 'The selected radio value, stars, and text update instantly without scale travel.',
    source: 'emil-design-eng/SKILL.md',
    html: `<main class="stage form-stage"><fieldset class="form-panel rating-panel"><legend>How useful was this?</legend><p class="form-meta">Choose a rating for this demo.</p><div class="rating-options">${[1, 2, 3, 4, 5].map(value => `<label class="form-choice rating-choice" data-filled="${value <= 3}"><input class="form-sr" type="radio" name="rating" value="${value}" aria-label="${value} ${value === 1 ? 'star' : 'stars'}"${value === 3 ? ' checked' : ''}><svg class="rating-star" width="29" height="29" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3-5.6-3-5.6 3 1.1-6.3L3 9.6l6.2-.9Z"/></svg></label>`).join('')}</div><p class="rating-value form-meta" role="status">3 of 5 · A good start</p></fieldset></main>`,
    css: shared + String.raw`
.rating-panel { border: 0; margin: 0; }
.rating-panel legend { float: left; width: 100%; padding: 0 0 6px; font-size: 15px; font-weight: 650; text-align: center; }
.rating-panel > .form-meta { clear: both; text-align: center; }
.rating-options { display: flex; justify-content: center; gap: 2px; margin: 14px 0 8px; }
.rating-choice { position: relative; display: grid; place-items: center; width: 44px; height: 44px; flex: none; cursor: pointer; border-radius: 8px; }
.rating-choice:has(input:focus-visible) { outline: 3px solid var(--accent-ink); outline-offset: 2px; }
.rating-star { color: var(--muted); transform: scale(.94); transition: transform calc(160ms * var(--time-scale)) var(--ease-out); }
.rating-choice[data-filled="true"] .rating-star { fill: var(--accent); color: var(--accent-ink); transform: scale(1); }
.rating-value { min-height: 17px; color: var(--accent-ink); }
`,
    js: String.raw`
const choices = [...document.querySelectorAll('[name="rating"]')];
const output = document.querySelector('.rating-value');
const descriptions = ['Not useful yet', 'Needs a little more', 'A good start', 'Really helpful', 'Exactly what I needed'];
function select(value) {
  choices.forEach(input => { input.checked = Number(input.value) === value; input.parentElement.dataset.filled = String(Number(input.value) <= value); });
  output.textContent = value + ' of 5 · ' + descriptions[value - 1];
}
choices.forEach(input => input.addEventListener('change', () => select(Number(input.value))));
Demo.onReplay(() => { select(1); void choices[0].parentElement.offsetWidth; select(4); });
`,
  },
  {
    id: 'range-feedback',
    title: 'A range that keeps up',
    category: 'feedback',
    description: 'A native range input keeps its number and volume bars in direct, immediate agreement with the thumb.',
    purpose: 'State indication',
    useWhen: 'A continuous setting such as preview volume or intensity needs a precise value and a simple visual cue.',
    avoidWhen: 'Easing the functional value behind a drag, playing actual sound without consent, or hiding the native keyboard range control.',
    principle: 'Direct manipulation must stay attached to the input. Only explicit replay demonstrates a short fill transition.',
    duration: 'Immediate input · 160 ms replay · 140 ms thumb press',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Drag the range, use arrow keys, or replay',
    tech: 'WAAPI', color: 'blue', tags: ['range', 'slider', 'volume', 'continuous input', 'direct manipulation'],
    intent: 'everyday', collections: ['product-ui', 'dashboards'], complexity: 'starter', added: '2026-10-10',
    reducedMotion: 'The native value and visual bars always track input immediately; replay also becomes instant.',
    source: 'apple-design/SKILL.md',
    html: `<main class="stage form-stage"><section class="form-panel range-panel"><label class="form-label" for="volume-range">Preview volume</label><div class="range-reading"><output class="range-value form-number" for="volume-range" aria-live="off">48<span>%</span></output><div class="range-bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div></div><input id="volume-range" class="volume-range" type="range" min="0" max="100" value="48" aria-describedby="range-note"><p class="form-meta" id="range-note">Live visual feedback · no audio plays</p></section></main>`,
    css: shared + String.raw`
.range-reading { display: flex; justify-content: space-between; align-items: center; margin: 10px 0 3px; }
.range-value { font-size: 38px; font-weight: 600; letter-spacing: -.05em; line-height: 1.1; }
.range-value span { font-size: 17px; color: var(--muted); letter-spacing: 0; margin-left: 3px; }
.range-bars { display: flex; align-items: flex-end; gap: 5px; height: 38px; }
.range-bars i { width: 9px; height: 100%; border-radius: 3px; background: var(--accent-ink); transform-origin: bottom; transform: scaleY(.48); }
.range-bars i:nth-child(1) { height: 35%; } .range-bars i:nth-child(2) { height: 50%; } .range-bars i:nth-child(3) { height: 68%; } .range-bars i:nth-child(4) { height: 84%; }
.volume-range { display: block; width: 100%; height: 44px; margin: 0; padding: 0; background: transparent; accent-color: var(--accent-ink); cursor: pointer; touch-action: pan-y; }
.volume-range::-webkit-slider-thumb { transition: scale calc(140ms * var(--time-scale)) var(--ease-out); }
.volume-range:active::-webkit-slider-thumb { scale: .97; }
.volume-range::-moz-range-thumb { transition: scale calc(140ms * var(--time-scale)) var(--ease-out); }
.volume-range:active::-moz-range-thumb { scale: .97; }
:root[data-keyboard="true"] .volume-range:active::-webkit-slider-thumb, :root[data-reduced="true"] .volume-range:active::-webkit-slider-thumb { scale: 1; }
:root[data-keyboard="true"] .volume-range:active::-moz-range-thumb, :root[data-reduced="true"] .volume-range:active::-moz-range-thumb { scale: 1; }
@media (prefers-reduced-motion: reduce) { :root:not([data-reduced="false"]) .volume-range:active::-webkit-slider-thumb { scale: 1; } :root:not([data-reduced="false"]) .volume-range:active::-moz-range-thumb { scale: 1; } }
.range-panel > .form-meta { font-size: 10px; }
`,
    js: String.raw`
const input = document.querySelector('#volume-range');
const output = document.querySelector('.range-value');
const bars = [...document.querySelectorAll('.range-bars i')];
let animations = [];
function stop() { animations.forEach(animation => animation.cancel()); animations = []; }
function update() {
  stop();
  const value = Number(input.value);
  output.firstChild.textContent = String(value);
  bars.forEach(bar => { bar.style.transform = 'scaleY(' + Math.max(.08, value / 100) + ')'; bar.style.opacity = value === 0 ? '.3' : '1'; });
}
input.addEventListener('input', update);
Demo.onReplay(() => {
  input.value = '72'; update();
  animations = bars.map(bar => Demo.animate(bar, [{ transform: 'scaleY(.48)' }, { transform: 'scaleY(.72)' }], { duration: 160, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }));
});
Demo.onCleanup(stop);
`,
  },
  {
    id: 'bulk-selection-toolbar',
    title: 'Actions for the selection',
    category: 'feedback',
    description: 'A contextual action bar arrives only when tasks are selected, with a native mixed-state select-all control.',
    purpose: 'State indication',
    useWhen: 'A short task or file list exposes actions that apply to the current selection.',
    avoidWhen: 'Hiding essential actions behind selection, moving a frequently used keyboard list, or inaccessible custom checkboxes.',
    principle: 'Keep row positions stable; a quiet, reserved action region makes the selection’s scope explicit.',
    duration: '140 ms press · 180 ms toolbar',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Select tasks, select all, clear, or replay',
    tech: 'CSS', color: 'graphite', tags: ['bulk actions', 'selection', 'checkbox', 'indeterminate', 'toolbar', 'tasks', 'outline'],
    intent: 'everyday', collections: ['product-ui', 'dashboards'], complexity: 'intermediate', added: '2026-10-10',
    reducedMotion: 'Selection, the mixed checkbox, and contextual actions update immediately without toolbar travel.',
    source: 'emil-design-eng/SKILL.md',
    html: `<main class="stage form-stage"><section class="form-panel bulk-panel"><label class="form-check bulk-all"><input type="checkbox" id="bulk-all"><span>Page tasks</span><span class="form-sr"> — select all tasks</span></label><label class="form-check bulk-row"><input type="checkbox" name="bulk-task" value="hero"><span>Hero layout</span><span class="form-meta">Design</span></label><label class="form-check bulk-row"><input type="checkbox" name="bulk-task" value="footer"><span>Footer links</span><span class="form-meta">Content</span></label><div class="bulk-toolbar" aria-hidden="true" inert><span class="bulk-count form-number" role="status">0 selected</span><button class="form-action secondary bulk-clear" type="button">Clear selection</button></div></section></main>`,
    css: shared + String.raw`
.bulk-panel { padding: 9px 13px; }
.bulk-all { gap: 10px; font-size: 12px; font-weight: 650; border-bottom: 1px solid var(--line); }
.bulk-row { font-size: 11px; gap: 10px; }
.bulk-row > span:nth-child(2) { flex: 1; }
.bulk-row > .form-meta { font-size: 9px; }
.bulk-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 8px; min-height: 44px; color: var(--ink); opacity: 0; transform: translateY(12%); visibility: hidden; transition: opacity calc(180ms * var(--time-scale)) var(--ease-out), transform calc(180ms * var(--time-scale)) var(--ease-out), visibility 0s calc(180ms * var(--time-scale)); }
.bulk-toolbar[data-visible="true"] { opacity: 1; transform: translateY(0); visibility: visible; transition-delay: 0s; }
.bulk-count { font-size: 10px; }
.bulk-clear { min-height: 44px; font-size: 10px; }
@media (min-height: 300px) { .bulk-panel { padding: 14px 20px; } .bulk-row, .bulk-all { min-height: 50px; } .bulk-toolbar { margin-top: 6px; } }
`,
    js: String.raw`
const all = document.querySelector('#bulk-all');
const tasks = [...document.querySelectorAll('[name="bulk-task"]')];
const toolbar = document.querySelector('.bulk-toolbar');
const count = document.querySelector('.bulk-count');
function update() {
  const selected = tasks.filter(input => input.checked).length;
  all.checked = selected === tasks.length; all.indeterminate = selected > 0 && selected < tasks.length;
  toolbar.dataset.visible = String(selected > 0); toolbar.inert = selected === 0; toolbar.setAttribute('aria-hidden', String(selected === 0));
  count.textContent = selected + ' selected';
}
tasks.forEach(input => input.addEventListener('change', update));
all.addEventListener('change', () => { tasks.forEach(input => { input.checked = all.checked; }); update(); });
document.querySelector('.bulk-clear').addEventListener('click', () => { tasks.forEach(input => { input.checked = false; }); update(); all.focus({ preventScroll: true }); });
Demo.onReplay(() => { tasks.forEach(input => { input.checked = false; }); update(); void toolbar.offsetWidth; tasks[0].checked = true; update(); });
`,
  },
  {
    id: 'notification-badge',
    title: 'Unread, without the noise',
    category: 'feedback',
    description: 'A small unread badge appears for new demo activity and disappears when the list is marked read.',
    purpose: 'State indication',
    useWhen: 'An inbox or activity area needs a restrained indication that unread items exist.',
    avoidWhen: 'Pulsing an idle badge, animating every incoming count, or using a number without an accessible unread description.',
    principle: 'Animate only the empty-to-unread boundary; count changes remain immediate and the indicator never loops.',
    duration: '140 ms press · 160 ms badge',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Add demo activity, mark read, or replay',
    tech: 'CSS', color: 'lavender', tags: ['notification', 'badge', 'unread', 'inbox', 'activity', 'counter', 'solid', 'outline'],
    intent: 'everyday', collections: ['product-ui', 'dashboards'], complexity: 'starter', added: '2026-10-10',
    reducedMotion: 'The badge and unread description change instantly without scale or fade travel.',
    source: 'emil-design-eng/SKILL.md',
    html: `<main class="stage form-stage"><section class="form-panel badge-panel"><div class="badge-overview"><span class="badge-icon" aria-hidden="true">${icon('<path d="M6 9a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9m3 12a3 3 0 0 0 6 0"/>', 27)}<span class="unread-badge form-number" data-visible="true">2</span></span><div><h2>Project activity</h2><p class="form-meta badge-status" role="status">2 unread demo updates</p></div></div><div class="badge-latest form-meta">A new note on the homepage.</div><div class="form-actions"><button class="form-action secondary badge-add" type="button">Add demo</button><button class="form-action badge-read" type="button">Mark read</button></div></section></main>`,
    css: shared + String.raw`
.badge-overview { display: flex; align-items: center; gap: 16px; }
.badge-icon { position: relative; display: grid; place-items: center; width: 47px; height: 47px; flex: none; border: 1px solid var(--line); border-radius: 13px; color: var(--ink); }
.unread-badge { position: absolute; right: -6px; top: -5px; min-width: 19px; height: 19px; padding: 0 4px; display: grid; place-items: center; border: 2px solid var(--paper); border-radius: 12px; background: var(--accent); color: var(--on-accent); font-size: 9px; font-weight: 650; opacity: 0; transform: scale(.94); transition: opacity calc(160ms * var(--time-scale)) var(--ease-out), transform calc(160ms * var(--time-scale)) var(--ease-out); }
.unread-badge[data-visible="true"] { opacity: 1; transform: scale(1); }
.badge-status { margin-top: 4px; font-size: 10px; }
.badge-latest { margin: 15px 0; padding-left: 10px; border-left: 2px solid var(--line); font-size: 11px; }
.badge-panel .form-action { flex: 1; }
`,
    js: String.raw`
const badge = document.querySelector('.unread-badge');
const status = document.querySelector('.badge-status');
const latest = document.querySelector('.badge-latest');
const read = document.querySelector('.badge-read');
const add = document.querySelector('.badge-add');
let unread = 2;
function update() {
  badge.dataset.visible = String(unread > 0); badge.textContent = unread > 9 ? '9+' : String(unread);
  status.textContent = unread ? unread + (unread === 1 ? ' unread demo update' : ' unread demo updates') : 'All demo updates read';
  latest.textContent = unread ? 'A new note on the homepage.' : 'You’re all caught up.';
  if (unread === 0 && document.activeElement === read) add.focus({ preventScroll: true });
  read.disabled = unread === 0;
}
add.addEventListener('click', () => { unread = Math.min(99, unread + 1); update(); });
read.addEventListener('click', () => { unread = 0; update(); });
Demo.onReplay(() => { unread = 0; update(); void badge.offsetWidth; unread = 2; update(); });
`,
  },
  {
    id: 'segmented-progress',
    title: 'Progress with checkpoints',
    category: 'feedback',
    description: 'A finite export demo completes four named phases, preserving finished segments if the remaining work is canceled.',
    purpose: 'State indication',
    useWhen: 'A bounded background operation has meaningful completed phases, such as preparing, rendering, and checking an export.',
    avoidWhen: 'Navigation between form steps, fabricated real-world completion, or smooth percentages when only discrete phases are known.',
    principle: 'Show known checkpoints instead of invented precision; each short segment represents a named piece of work.',
    duration: '4 × 240 ms simulated phases · 140 ms press',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Run the demo export, cancel, or replay',
    tech: 'WAAPI', color: 'green', tags: ['progress', 'segments', 'pipeline', 'export', 'checkpoints', 'cancel', 'solid', 'outline'],
    intent: 'everyday', collections: ['product-ui', 'dashboards'], complexity: 'intermediate', added: '2026-10-10',
    reducedMotion: 'All four demo checkpoints complete immediately; labels and cancellation state remain explicit.',
    source: 'animate/SKILL.md',
    html: `<main class="stage form-stage"><section class="form-panel phase-panel"><div class="form-heading"><div><p class="form-kicker">Export preview</p><h2>From draft to ready</h2></div><span class="form-mark">${file}</span></div><div class="phase-progress" role="progressbar" aria-label="Demo export checkpoints" aria-valuemin="0" aria-valuemax="4" aria-valuenow="0" aria-valuetext="0 of 4 phases complete"><span><i></i></span><span><i></i></span><span><i></i></span><span><i></i></span></div><div class="phase-labels" aria-hidden="true"><span>Prepare</span><span>Render</span><span>Check</span><span>Ready</span></div><p class="phase-status form-meta" role="status">Four phases · local simulation</p><div class="form-actions"><button class="form-action phase-start" type="button">Run demo</button><button class="form-action secondary phase-cancel" type="button" disabled>Cancel</button></div></section></main>`,
    css: shared + String.raw`
.phase-panel .form-heading { margin-bottom: 14px; }
.phase-progress, .phase-labels { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 5px; }
.phase-progress > span { height: 7px; border-radius: 5px; overflow: hidden; background: var(--line); }
.phase-progress i { display: block; width: 100%; height: 100%; background: var(--accent-ink); transform: scaleX(0); transform-origin: left; }
.phase-labels { margin-top: 6px; font-size: 9px; color: var(--muted); }
.phase-status { margin: 12px 0 10px; min-height: 16px; font-size: 10px; }
.phase-panel .form-action { flex: 1; }
`,
    js: String.raw`
const progress = document.querySelector('.phase-progress');
const fills = [...progress.querySelectorAll('i')];
const status = document.querySelector('.phase-status');
const start = document.querySelector('.phase-start');
const cancel = document.querySelector('.phase-cancel');
const names = ['Preparing the demo', 'Rendering the demo', 'Checking the demo', 'Finishing the demo'];
let generation = 0, animation, completed = 0, busy = false;
function stop() { generation += 1; animation?.cancel(); animation = null; busy = false; cancel.disabled = true; fills.forEach((fill, index) => { fill.style.transform = index < completed ? 'scaleX(1)' : 'scaleX(0)'; }); }
function announce() { progress.setAttribute('aria-valuenow', String(completed)); progress.setAttribute('aria-valuetext', completed + ' of 4 phases complete'); }
function finish() { const restoreFocus = document.activeElement === cancel; completed = 4; stop(); announce(); status.textContent = 'All four phases complete · demo ready'; start.textContent = 'Run again'; if (restoreFocus) start.focus(); }
async function run() {
  completed = 0; stop(); announce();
  if (Demo.duration(1) === 0 || Demo.paused) { finish(); return; }
  const token = generation; busy = true; cancel.disabled = false; start.textContent = 'Restart';
  for (const [index, fill] of fills.entries()) {
    status.textContent = names[index] + '…';
    animation = Demo.animate(fill, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 240, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    try { await animation.finished; } catch { return; }
    if (token !== generation) return;
    fill.style.transform = 'scaleX(1)'; animation.cancel(); animation = null; completed += 1; announce();
  }
  finish();
}
start.addEventListener('click', run);
cancel.addEventListener('click', () => { stop(); status.textContent = 'Canceled · ' + completed + ' of 4 phases complete'; start.textContent = 'Start again'; start.focus(); });
Demo.onReplay(run);
Demo.onSettings(() => { if (Demo.reduced && busy) finish(); });
Demo.onCleanup(stop);
`,
  },
];
