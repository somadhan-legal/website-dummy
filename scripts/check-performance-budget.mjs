import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const manifest = JSON.parse(readFileSync(path.join(dist, '.vite/manifest.json'), 'utf8'));
const entry = Object.entries(manifest).find(([, chunk]) => chunk.isEntry);
assert(entry, 'No Vite entry found. Run npm run build first.');

const visited = new Set();
const scripts = new Set();
const styles = new Set();
function visit(key) {
  if (visited.has(key)) return;
  visited.add(key);
  const chunk = manifest[key];
  assert(chunk, `Missing manifest chunk: ${key}`);
  scripts.add(chunk.file);
  for (const css of chunk.css ?? []) styles.add(css);
  for (const imported of chunk.imports ?? []) visit(imported);
}
visit(entry[0]);

function check(label, bytes, limitKiB) {
  console.log(`${label}: ${(bytes / 1024).toFixed(1)} KiB / ${limitKiB} KiB`);
  assert(bytes <= limitKiB * 1024, `${label} exceeds its performance budget.`);
}
const compressedBytes = (files) => [...files].reduce((sum, file) => sum + gzipSync(readFileSync(path.join(dist, file))).length, 0);
const assetBytes = (files) => files.reduce((sum, file) => sum + statSync(path.join(root, 'public', file)).size, 0);

check('Initial JavaScript (gzip, excluding dynamic imports)', compressedBytes(scripts), 105);
const crowdWorkers = readdirSync(path.join(dist, 'assets'))
  .filter((file) => /^crowd-canvas\.worker-.+\.js$/.test(file))
  .map((file) => `assets/${file}`);
assert.equal(crowdWorkers.length, 1, 'Expected one bundled crowd renderer worker.');
check('Crowd renderer worker (gzip)', compressedBytes(crowdWorkers), 4);
check('Initial CSS (gzip)', compressedBytes(styles), 16);
check('Three first-screen English font faces', assetBytes([
  'fonts/optimized/dm-sans-normal-latin.woff2',
  'fonts/optimized/playfair-display-normal-latin.woff2',
  'fonts/optimized/playfair-display-italic-latin.woff2',
]), 140);
check('Mobile crowd sprite', assetBytes(['images/optimized/hero-crowd-mobile.webp']), 250);
check('Bangla semi-condensed font', assetBytes(['fonts/optimized/anek-bangla-semicondensed.woff2']), 250);
check('Eight service images at 480px', assetBytes([
  'corporate-business', 'family-personal-law', 'property-legal-consultation',
  'criminal-defense', 'dispute-resolution', 'intellectual-property',
  'labor-employment', 'immigration',
].map((name) => `images/optimized/${name}-480.webp`)), 600);
check('Five phone screens at 640px', assetBytes([
  'categories', 'service-summary', 'call-connecting',
  'service-progress-files', 'service-progress',
].map((name) => `images/optimized/phone-${name}-640.webp`)), 400);
console.log('Performance size budgets passed. Measure live Lighthouse separately.');
