// Production build for the Mwarubaini Solutions site.
//
// Source files (index.html, *.jsx) are left untouched — they stay exactly as
// the live-edit tool (Tweaks panel / EDITMODE blocks) expects, and remain a
// working Babel-in-browser preview on their own.
//
// This script produces a separate dist/ folder for actual deployment:
//   - dist/index.html has the real page markup already in <div id="root">
//     (server-rendered from the same components), instead of an empty div
//     that only fills in after JS runs.
//   - dist/bundle.js is the same *.jsx files, precompiled once here instead
//     of being transpiled in every visitor's browser on every load.
//   - React/ReactDOM are the production UMD builds, bundled locally instead
//     of fetched from a CDN.
// The client still boots the same App component and takes over via
// ReactDOM.hydrateRoot, so the page stays fully interactive.

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const babel = require('@babel/core');
const React = require('react');
const { renderToString } = require('react-dom/server');

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DIST = path.join(ROOT, 'dist');

// Load order matters — it must match the <script> order in index.html,
// since these files share one top-level scope instead of using ES modules.
const SOURCE_FILES = [
  'tweaks-panel.jsx',
  'components.jsx',
  'tree-section.jsx',
  'physics-hero.jsx',
  'app.jsx',
];

function transpile(file) {
  const code = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const result = babel.transform(code, {
    filename: file,
    presets: ['@babel/preset-react'],
  });
  return `// ── ${file} ──\n${result.code}`;
}

console.log('Transpiling JSX sources...');
const transpiledParts = SOURCE_FILES.map(transpile);
const browserBundle = transpiledParts.join('\n\n');

console.log('Rendering initial HTML from the App component...');
// The four component files each end with `Object.assign(window, {...})` to
// publish themselves — the only reason this sandbox needs a `window` at all.
// Everything else that touches real browser APIs (window.scrollY, document,
// IntersectionObserver, etc.) lives inside effects/callbacks, which React
// never invokes during a server render, so they're never reached here.
const sandbox = { window: {}, console, React };
vm.createContext(sandbox);
const ssrScript = `${browserBundle}\n;globalThis.__APP__ = App;\n`;
new vm.Script(ssrScript, { filename: 'ssr-bundle.js' }).runInContext(sandbox);

const App = sandbox.__APP__;
if (typeof App !== 'function') {
  throw new Error('Could not find App component after evaluating the bundle.');
}

const prerenderedHTML = renderToString(React.createElement(App));

console.log('Assembling dist/index.html...');
const sourceHTML = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

const scriptBlockPattern =
  /  <script src="https:\/\/unpkg\.com\/react@[\s\S]*?<script type="text\/babel" src="app\.jsx"><\/script>\n/;

const distScriptBlock =
  '  <script src="vendor/react.production.min.js" defer></script>\n' +
  '  <script src="vendor/react-dom.production.min.js" defer></script>\n' +
  '  <script src="https://unpkg.com/matter-js@0.19.0/build/matter.min.js"></script>\n' +
  '  <script src="bundle.js" defer></script>\n';

if (!scriptBlockPattern.test(sourceHTML)) {
  throw new Error('Could not locate the CDN/JSX <script> block in index.html — did its structure change?');
}

let distHTML = sourceHTML.replace(scriptBlockPattern, distScriptBlock);
distHTML = distHTML.replace(
  '<div id="root"></div>',
  `<div id="root">${prerenderedHTML}</div>`
);

if (distHTML === sourceHTML) {
  throw new Error('index.html replacement had no effect — aborting so we do not ship a stale build.');
}

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, 'vendor'), { recursive: true });

fs.writeFileSync(path.join(DIST, 'index.html'), distHTML);
fs.writeFileSync(path.join(DIST, 'bundle.js'), browserBundle);
fs.copyFileSync(
  path.join(ROOT, 'node_modules/react/umd/react.production.min.js'),
  path.join(DIST, 'vendor/react.production.min.js')
);
fs.copyFileSync(
  path.join(ROOT, 'node_modules/react-dom/umd/react-dom.production.min.js'),
  path.join(DIST, 'vendor/react-dom.production.min.js')
);

for (const asset of ['favicon.svg', 'robots.txt', 'sitemap.xml']) {
  const from = path.join(ROOT, asset);
  if (fs.existsSync(from)) fs.copyFileSync(from, path.join(DIST, asset));
}

console.log(`Build complete → ${path.relative(process.cwd(), DIST)}/`);
