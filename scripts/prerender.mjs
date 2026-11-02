import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

process.env.NODE_ENV = 'production';
const root = fileURLToPath(new URL('../', import.meta.url));
const template = await readFile(path.join(root, 'dist/index.html'), 'utf8');
const marker = '<div id="root"></div>';
assert(template.includes(marker), 'Missing React root in the built HTML template.');
const { render, faqCategories } = await import('../dist-ssr/entry-server.js');

for (const [url, file] of [['/', 'index.html'], ['/about', 'about.html'], ['/faq', 'faq.html'], ['/terms', 'terms.html'], ['/privacy', 'privacy.html']]) {
  const html = await render(url);
  assert(html.includes('<h1'), `No page heading rendered for ${url}.`);
  assert(!html.includes('<!--$!-->'), `Unresolved Suspense boundary on ${url}.`);
  let page = template.replace(marker, () => `<div id="root" data-prerendered="true">${html}</div>`);
  const routeMeta = {
    '/faq': ['Frequently Asked Questions | Somadhan', 'Find answers about the Somadhan app, legal consultations, bookings, payments, and support.'],
    '/terms': ['Terms and Conditions | Somadhan', 'Read the published Somadhan Terms and Conditions.'],
    '/privacy': ['Privacy Policy | Somadhan', 'Read the published Somadhan Privacy Policy.'],
  }[url];
  if (routeMeta) {
    const [title, description] = routeMeta;
    const canonical = `https://somadhan.com${url}`;
    page = page.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
      .replace(/(<meta name="description"\s+content=")[^"]*(")/, `$1${description}$2`)
      .replace(/(<meta (?:property="og:title"|name="twitter:title")\s+content=")[^"]*(")/g, `$1${title}$2`)
      .replace(/(<meta (?:property="og:description"|name="twitter:description")\s+content=")[^"]*(")/g, `$1${description}$2`)
      .replace(/(<meta (?:property="og:url"|name="twitter:url")\s+content=")[^"]*(")/g, `$1${canonical}$2`)
      .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${canonical}$2`)
      .replace(/(<link rel="alternate" hreflang=")(en-BD|bn-BD|x-default)(" href=")[^"]*(")/g, (_, before, locale, middle, after) => `${before}${locale}${middle}${canonical}${locale === 'x-default' ? '' : `?lang=${locale === 'bn-BD' ? 'bn' : 'en'}`}${after}`)
      .replace(/\s*<link rel="preload"[^>]*hero-crowd[^>]*>/g, '');
  }
  if (url === '/terms' || url === '/privacy') {
    // Build only a loading shell: embedding a snapshot would become stale after admin publication.
    page = page.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, (_, open, content, close) => {
      const schema = JSON.parse(content);
      schema['@graph'] = [{ '@type': 'WebPage', '@id': `https://somadhan.com${url}`, name: routeMeta[0], url: `https://somadhan.com${url}` }];
      return `${open}${JSON.stringify(schema)}${close}`;
    });
  }
  if (url === '/' || url === '/faq') {
    page = page.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, (_, open, content, close) => {
      const schema = JSON.parse(content);
      const faq = {
        '@type': 'FAQPage',
        '@id': `https://somadhan.com/${url === '/faq' ? 'faq' : '#faq'}`,
        mainEntity: faqCategories.flatMap(category => category.faqs.map(item => ({
          '@type': 'Question', name: item.qEn,
          acceptedAnswer: { '@type': 'Answer', text: item.aEn },
        }))),
      };
      if (url === '/faq') {
        schema['@graph'] = [faq];
      } else {
        // Keep the homepage's existing compact schema, with answers from the shared source.
        schema['@graph'] = schema['@graph'].map(item => item['@type'] === 'FAQPage'
          ? { ...faq, mainEntity: item.mainEntity.map(question => faq.mainEntity.find(entry => entry.name === question.name) || question) }
          : item);
      }
      return `${open}${JSON.stringify(schema).replace(/</g, '\\u003c')}${close}`;
    });
  }
  await writeFile(path.join(root, 'dist', file), page);
  console.log(`Pre-rendered ${url}: ${Buffer.byteLength(html)} bytes of page HTML`);
}
