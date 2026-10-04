import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

process.env.NODE_ENV = 'production';
const root = fileURLToPath(new URL('../', import.meta.url));
const template = await readFile(path.join(root, 'dist/index.html'), 'utf8');
const marker = '<div id="root"></div>';
assert(template.includes(marker), 'Missing React root in the built HTML template.');
const { render } = await import('../dist-ssr/entry-server.js');

for (const [url, file] of [['/', 'index.html'], ['/about', 'about.html'], ['/terms', 'terms.html'], ['/privacy', 'privacy.html']]) {
  const html = await render(url);
  assert(html.includes('<h1'), `No page heading rendered for ${url}.`);
  assert(!html.includes('<!--$!-->'), `Unresolved Suspense boundary on ${url}.`);
  const page = template.replace(marker, () => `<div id="root" data-prerendered="true">${html}</div>`);
  await writeFile(path.join(root, 'dist', file), page);
  console.log(`Pre-rendered ${url}: ${Buffer.byteLength(html)} bytes of page HTML`);
}
