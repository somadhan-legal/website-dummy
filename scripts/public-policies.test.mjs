import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readPublishedPolicy, validatePublicPolicy, PUBLIC_POLICY_API } from '../lib/publicPolicies.ts';

const published = {
  slug: 'terms-of-service', html: '<p>Published fixture</p>',
  effectiveDate: '2026-11-02', publishedAt: '2026-11-02T08:00:00.000Z',
};

test('validates only the fixed public published response contract', () => {
  assert.deepEqual(validatePublicPolicy(published, 'terms-of-service'), published);
  assert.equal(validatePublicPolicy({ ...published, effectiveDate: null }, 'terms-of-service').effectiveDate, null);
  for (const invalid of [
    null, [], {}, { ...published, slug: 'privacy-policy' },
    { ...published, html: '' }, { ...published, html: ' '.repeat(4) },
    { ...published, effectiveDate: '2026-02-31' }, { ...published, effectiveDate: '2026-11-02T00:00:00Z' },
    { ...published, publishedAt: null }, { ...published, publishedAt: 'not-a-date' },
    { ...published, publishedAt: '2026-11-02T08:00:00' },
    { ...published, publishedAt: '2026-02-31T08:00:00Z' }, { ...published, publishedAt: '2026-11-02T24:00:00Z' },
    { ...published, draftContentJson: { type: 'doc' } }, { ...published, isPublished: false },
    { ...published, status: 'draft' }, { ...published, html: 'x'.repeat(4 * 1024 * 1024 + 1) },
  ]) assert.throws(() => validatePublicPolicy(invalid, 'terms-of-service'));
});

test('reads canonical public detail without cookies, auth, redirects, or browser cache', async () => {
  let observed;
  const controller = new AbortController();
  const policy = await readPublishedPolicy('terms-of-service', controller.signal, async (url, init) => {
    observed = { url, init };
    return new Response(JSON.stringify(published), { status: 200 });
  });
  assert.deepEqual(policy, published);
  assert.equal(observed.url, `${PUBLIC_POLICY_API}/terms-of-service`);
  assert.equal(observed.init.method, 'GET');
  assert.equal(observed.init.cache, 'no-store');
  assert.equal(observed.init.credentials, 'omit');
  assert.equal(observed.init.redirect, 'error');
  assert.equal(observed.init.signal, controller.signal);
  assert.deepEqual(observed.init.headers, { Accept: 'application/json' });
});

test('404 means no published policy; other failures are never treated as legal text', async () => {
  assert.equal(await readPublishedPolicy('terms-of-service', undefined, async () => new Response('{}', { status: 404 })), null);
  for (const status of [401, 403, 500, 502, 503]) {
    await assert.rejects(readPublishedPolicy('terms-of-service', undefined, async () => new Response('{}', { status })));
  }
  await assert.rejects(readPublishedPolicy('terms-of-service', undefined, async () => new Response('<html>Sign in</html>', { status: 200 })));
  await assert.rejects(readPublishedPolicy('terms-of-service', undefined, async () => { throw new Error('offline'); }));
});

test('performs a fresh detail request on every read, not a stale list or embedded fallback', async () => {
  let count = 0;
  const request = async () => new Response(JSON.stringify({ ...published, html: `<p>Published ${++count}</p>` }), { status: 200 });
  assert.equal((await readPublishedPolicy('terms-of-service', undefined, request)).html, '<p>Published 1</p>');
  assert.equal((await readPublishedPolicy('terms-of-service', undefined, request)).html, '<p>Published 2</p>');
});
