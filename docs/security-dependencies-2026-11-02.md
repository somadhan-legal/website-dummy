# Security dependency patch review

This separate local patch updates vulnerable dependencies without changing website
components, layout, legal wording, account-deletion submissions, or backend data.
It is based on production commit `bfdd318` and remains subject to release review.

## Dependency versions

Only three manifest minimums change: `react-router-dom` to `^7.18.2`, Vite to
`^6.4.4`, and PostCSS to `^8.5.23`. Targeted npm resolution keeps existing majors
and selects the following compatible versions. Required Babel support packages,
browser compatibility data, and `set-cookie-parser` update with their parents.
No transitive package is promoted to a direct dependency and no override is added.

| Package | Previous npm lock | Updated npm and Bun locks |
| --- | --- | --- |
| react-router and react-router-dom | 7.13.1 | 7.18.5 |
| vite | 6.4.2 | 6.4.5 |
| postcss | 8.5.14 | 8.5.32 |
| @babel/core | 7.28.5 | 7.29.7 |
| source-map-js | 1.2.1 | 1.2.2 |
| nanoid | 3.3.11 | 3.3.20 |
| browserslist | 4.28.1 | 4.29.5 |
| baseline-browser-mapping | 2.9.18 | 2.11.34 |

## Advisory coverage

The updated locked versions fall outside all 26 open GitHub alert ranges checked
on November 2, 2026. A fresh npm audit also identified three additional advisories:
[Nano ID negative sizes](https://github.com/advisories/GHSA-28wg-ghj8-5hjv),
[Nano ID zero sizes](https://github.com/advisories/GHSA-2v37-7h3g-55p8), and
[Browserslist cache growth](https://github.com/advisories/GHSA-c83g-rgw3-j3cx).
All 29 distinct baseline npm advisory ranges were checked against the new lock.
Full npm audit, production-only npm audit, and Bun audit report zero known
vulnerabilities in the updated local graph. GitHub alerts will not close remotely
until an approved release reaches the default branch and GitHub re-evaluates it.

The current site uses Declarative BrowserRouter and custom build-time StaticRouter
rendering, not a Framework/RSC server. The
[Router deserialization RCE advisory](https://github.com/advisories/GHSA-49rj-9fvp-4h2h)
excludes Declarative Mode. This limits applicability of that finding; it does not
replace updating affected versions or establish that the application is free of
all security risks.

## Lockfile consistency

The old Bun root omitted four existing manifest dependencies and seven package
identities. The updated Bun lock was generated from the updated npm lock using
`bun pm migrate` in an isolated directory, rather than independently resolving it.
See the [official migration documentation](https://bun.com/docs/pm/lockfile).

`npm run check:locks` now compares manifest dependency groups, every external
package identity and integrity, and dependency, optional-dependency, and peer
range maps. All 173 external package identities match. npm separately records six
bundled wasm tarball internals; Bun covers those through the identical parent
tarball integrity. They are not missing external resolutions.

The checker fails closed on unknown lock formats or multiple versions of one
package name, which would require path-aware resolution review. Its fixture tests
cover valid bundled/platform-optional records and root, version, integrity,
dependency, optional, peer, and multi-version drift. Both checks run in `verify`.

## Verification

Tested with Node 24.4.0, npm 11.4.2, and Bun 1.3.6:

- Clean `npm ci` followed by `npm run verify` passes.
- An isolated `bun install --frozen-lockfile` followed by `bun run verify` passes.
- Both builds produce identical client manifests and generated CSS.
- Sixty before/after screenshot comparisons are pixel-identical: home, About,
  FAQ, Terms, and Privacy in EN/BN at 1440, 390, and 320 pixels. Animated canvases
  are masked for this visual comparison.
- Both installs pass FAQ keyboard/history/reload/anchor/locale checks and policy
  API parity, refresh/retry, unpublished/error/timeout, unsafe HTML, and stale
  response checks. Account-deletion tests use intercepted responses only.
- Initial JavaScript rises from 88.0 to 88.7 KiB gzip, below the existing 105 KiB
  budget. Initial CSS remains 13.0 KiB; all asset/font budgets pass.

Local homepage Lighthouse 13.6.0 measurements use the same Chrome Canary binary
and desktop/mobile presets for the unchanged baseline and the update:

| Build | Desktop performance | Mobile performance |
| --- | --- | --- |
| Unchanged bfdd318 | 100 | 100 |
| Updated dependencies | 98 first run, 100 repeat | 100 |

All five runs have zero layout shift and no Lighthouse runtime errors or warnings.
The updated desktop repeat has 218 ms LCP and zero blocking time; the mobile run
has 759 ms LCP and 67 ms blocking time. These are local lab results, not a new live
PageSpeed or rolling real-user Core Web Vitals assessment.

## Release review

This batch must remain local until the diff and gates are reviewed. No Vercel
settings, credentials, database records, or legal publications are changed.

The repository does not pin a package-manager version. Confirm the release build
uses the tested workflow before deployment. Bun 1.4 can read version-1 locks but
writes version 2 during migration; the new parity checker deliberately requires
format review before accepting that change. See the
[Bun 1.4 lockfile notes](https://bun.com/blog/bun-v1.4).

The current authenticated Vercel CLI session cannot access the production project
scope, so its actual build-time package manager/version could not be confirmed
from logs. That remains a release check; no account or project settings were changed.
