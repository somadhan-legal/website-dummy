import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

process.env.NODE_ENV = 'production';
const { faqCategories, parseFaqHash } = await import('../dist-ssr/entry-server.js');
const read = file => readFile(new URL(`../dist/${file}`, import.meta.url), 'utf8');
const home = await read('index.html');
const about = await read('about.html');
const faq = await read('faq.html');
const manifest = JSON.parse(await read('.vite/manifest.json'));
for (const [file, title, route] of [['terms.html', 'Terms and Conditions', '/terms'], ['privacy.html', 'Privacy Policy', '/privacy']]) {
  const html = await read(file);
  assert(html.includes(`<title>${title} | Somadhan</title>`));
  assert(html.includes(`rel="canonical" href="https://somadhan.com${route}"`));
  assert(html.includes('Loading published policy'));
  assert.doesNotMatch(html, /Welcome to Somadhan|Cyber Security Act|Last updated:|March 16, 2026|June 6, 2026/);
  assert.doesNotMatch(html, /<link rel="preload"[^>]*hero-crowd/);
}

for (const [name, html] of [['home', home], ['about', about], ['faq', faq]]) {
  assert.doesNotMatch(html, /join (?:our |the )?waitlist|ওয়েটলিস্ট|waitlist_submissions/i, `${name} exposes a waitlist entry`);
}
assert(!Object.keys(manifest).some(key => /WaitlistPage/.test(key)), 'Waitlist form must not be in the public bundle');
assert.match(home, /href="https:\/\/play\.google\.com\/store\/apps\/details\?id=legal\.somadhan\.app"/);
assert.match(faq, /<h1[^>]*>Frequently Asked Questions<\/h1>/);
assert.match(faq, /<title>Frequently Asked Questions \| Somadhan<\/title>/);
assert.match(faq, /<link rel="canonical" href="https:\/\/somadhan\.com\/faq"/);
assert.match(faq, /<meta name="description"\s+content="Find answers about the Somadhan app/);
assert.match(faq, /<link rel="alternate" type="text\/plain" href="\/llms\.txt"/);
assert.doesNotMatch(faq, /<link rel="preload"[^>]*hero-crowd/);

const ids = new Set();
let count = 0;
for (const category of faqCategories) {
  assert.equal(parseFaqHash(`#${category.id}`).questionId, null);
  for (const item of category.faqs) {
    const fragment = `${category.id}/${item.id}`;
    assert(!ids.has(fragment), `Duplicate question link: ${fragment}`);
    ids.add(fragment);
    for (const key of ['qEn', 'qBn', 'aEn', 'aBn']) assert(item[key]?.trim(), `${fragment} is missing ${key}`);
    assert.deepEqual(parseFaqHash(`#${fragment}`), { categoryId: category.id, questionId: item.id });
    assert.deepEqual(parseFaqHash(`#${encodeURIComponent(fragment)}`), { categoryId: category.id, questionId: item.id });
    count++;
  }
}
const fallback = { categoryId: 'getting-started', questionId: 'what-is-somadhan' };
for (const hash of ['', '#faq', '#missing', '#calls/missing', '#calls/how-calls-work/extra', '#%E0%A4%A']) {
  assert.deepEqual(parseFaqHash(hash), fallback);
}
const schema = JSON.parse(faq.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
assert.equal(schema['@graph'][0]['@id'], 'https://somadhan.com/faq');
assert.equal(schema['@graph'][0].mainEntity.length, count);
console.log(`Public-page checks passed: no waitlist form bundle, FAQ metadata, ${faqCategories.length} bilingual categories, ${count} stable question links, malformed-fragment fallbacks.`);
