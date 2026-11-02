import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const read = name => readFile(new URL(`../${name}`, import.meta.url), 'utf8');
const manifest = JSON.parse(await read('package.json'));
const npm = JSON.parse(await read('package-lock.json'));
const parsed = ts.parseConfigFileTextToJson('bun.lock', await read('bun.lock'));
assert(!parsed.error, parsed.error && ts.flattenDiagnosticMessageText(parsed.error.messageText, '\n'));
const bun = parsed.config;
assert.equal(npm.lockfileVersion, 3, 'Review the checker when changing npm lock format.');
assert.equal(bun.lockfileVersion, 1, 'Review the checker when changing Bun lock format.');

for (const group of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
  for (const [name, root] of [['npm', npm.packages['']], ['Bun', bun.workspaces['']]]) {
    assert.deepEqual(root[group] ?? {}, manifest[group] ?? {}, `${name} root ${group} differs from package.json`);
  }
}

const npmGraph = new Map();
const versionsByName = new Map();
let bundledEntries = 0;
for (const [path, entry] of Object.entries(npm.packages)) {
  if (!path) continue;
  // npm records bundled tarball internals; Bun represents them through the parent integrity.
  if (entry.inBundle) { bundledEntries++; continue; }
  const name = entry.name ?? path.slice(path.lastIndexOf('node_modules/') + 'node_modules/'.length);
  // A flat identity comparison is conclusive only while each name has one resolution.
  assert(!versionsByName.has(name) || versionsByName.get(name) === entry.version, `Multiple versions of ${name} require path-aware lock parity review.`);
  versionsByName.set(name, entry.version);
  const id = `${name}@${entry.version}`;
  const bundled = new Set([entry.bundleDependencies, entry.bundledDependencies].flatMap(value => Array.isArray(value) ? value : []));
  const edges = group => Object.fromEntries(Object.entries(entry[group] ?? {}).filter(([dependency]) => !bundled.has(dependency)));
  const record = { integrity: entry.integrity, dependencies: edges('dependencies'), optionalDependencies: edges('optionalDependencies'), peerDependencies: edges('peerDependencies') };
  assert.equal(typeof record.integrity, 'string', `${id} has no npm integrity`);
  if (npmGraph.has(id)) assert.deepEqual(npmGraph.get(id), record, `Ambiguous npm resolution for ${id}`);
  npmGraph.set(id, record);
}

const bunGraph = new Map();
for (const [path, entry] of Object.entries(bun.packages)) {
  assert(Array.isArray(entry) && entry.length >= 4, `Unsupported Bun entry ${path}`);
  const [id, , metadata, integrity] = entry;
  const record = { integrity, dependencies: metadata.dependencies ?? {}, optionalDependencies: metadata.optionalDependencies ?? {}, peerDependencies: metadata.peerDependencies ?? {} };
  if (bunGraph.has(id)) assert.deepEqual(bunGraph.get(id), record, `Ambiguous Bun resolution for ${id}`);
  bunGraph.set(id, record);
}

assert.deepEqual([...bunGraph.keys()].sort(), [...npmGraph.keys()].sort(), 'npm/Bun package versions differ');
for (const [id, expected] of npmGraph) assert.deepEqual(bunGraph.get(id), expected, `npm/Bun integrity or dependency edges differ for ${id}`);
console.log(`Lock parity passed: ${npmGraph.size} package identities, integrity hashes, dependency/optional/peer edges, and manifest roots match (${bundledEntries} npm-only bundled tarball internals).`);
