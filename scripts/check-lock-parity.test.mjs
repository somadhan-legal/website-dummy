import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const fixture = () => ({
  manifest: { dependencies: { example: '^1.0.0' } },
  npm: { lockfileVersion: 3, packages: {
    '': { dependencies: { example: '^1.0.0' } },
    'node_modules/example': { version: '1.0.0', integrity: 'sha512-example', dependencies: { bundled: '^1' }, bundleDependencies: ['bundled'], optionalDependencies: { platform: '^1' } },
    'node_modules/example/node_modules/bundled': { version: '1.0.0', inBundle: true },
    'node_modules/platform': { version: '1.0.0', integrity: 'sha512-platform', optional: true, os: ['win32'] },
  } },
  bun: { lockfileVersion: 1, workspaces: { '': { dependencies: { example: '^1.0.0' } } }, packages: {
    example: ['example@1.0.0', '', { optionalDependencies: { platform: '^1' } }, 'sha512-example'],
    platform: ['platform@1.0.0', '', { os: 'win32' }, 'sha512-platform'],
  } },
});

async function runFixture(edit = () => {}) {
  const dir = await mkdtemp(path.join(tmpdir(), 'somadhan-lock-parity-'));
  try {
    const data = fixture(); edit(data);
    await mkdir(path.join(dir, 'scripts'));
    await cp(path.join(root, 'scripts/check-lock-parity.mjs'), path.join(dir, 'scripts/check-lock-parity.mjs'));
    await symlink(path.join(root, 'node_modules'), path.join(dir, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
    for (const [name, value] of [['package.json', data.manifest], ['package-lock.json', data.npm], ['bun.lock', data.bun]]) {
      await writeFile(path.join(dir, name), JSON.stringify(value));
    }
    return spawnSync(process.execPath, [path.join(dir, 'scripts/check-lock-parity.mjs')], { encoding: 'utf8' });
  } finally { await rm(dir, { recursive: true, force: true }); }
}

test('matches platform-optional packages while accounting for bundled tarball internals', async () => {
  const result = await runFixture();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /2 package identities/);
});

test('rejects root, version, integrity, dependency, optional, and peer drift', async () => {
  for (const edit of [
    data => { data.bun.workspaces[''].dependencies = {}; },
    data => { data.npm.packages[''].dependencies = {}; },
    data => { data.bun.packages.example[0] = 'example@1.0.1'; },
    data => { data.bun.packages.example[3] = 'sha512-different'; },
    data => { data.bun.packages.example[2].dependencies = { other: '^1' }; },
    data => { delete data.bun.packages.platform; },
    data => { data.bun.packages.example[2].optionalDependencies = {}; },
    data => { data.bun.packages.example[2].peerDependencies = { react: '^19' }; },
    data => {
      data.npm.packages['node_modules/example/node_modules/platform'] = { version: '2.0.0', integrity: 'sha512-platform-two' };
      data.bun.packages['example/platform'] = ['platform@2.0.0', '', {}, 'sha512-platform-two'];
    },
  ]) {
    const result = await runFixture(edit);
    assert.notEqual(result.status, 0, result.stdout);
    assert.match(result.stderr, /AssertionError/);
  }
});
