# Asset Optimization

`optimize_assets.py` creates browser-ready files without changing the original
photographs, app screenshots, logos, or font sources.

Dependencies: Python 3, Pillow, and `fonttools[woff]`.

```sh
python3 scripts/optimize_assets.py --report /tmp/somadhan-assets-report.json
```

The existing JPEGs become responsive WebP files at widths 480 and 800. Phone
screenshots become high-quality WebP at widths 360, 640, and 960. Dark logos
contain transparent PNGs inside SVG wrappers; their replacements use lossless
WebP at widths 480 and 960, preserving aspect ratio and transparency.

The crowd sprite comes from the same URL used by the original component. Its
WebP is lossless with unchanged dimensions; generation verifies that decoded
RGBA pixels are identical. Its original artwork and source remain unchanged.
A separate mobile sheet keeps the same 15-by-7 grid at half resolution, resizing
each character independently to prevent filtering across sprite boundaries.
Its encoding is also lossless, including transparency. Canvas consumers should
keep character display dimensions consistent when switching between sheets.
White logo SVGs remain unchanged, with explicit intrinsic dimensions in the
mapping to reserve their layout space.

English variable fonts retain their full Unicode coverage and variation axes in
WOFF2. Additional `-latin.woff2` faces include Latin characters and common
punctuation. Declare the full face first as a fallback, then the Latin face with
the `latinUnicodeRange` from the generated report. This avoids downloading a
full font for English while preserving access to all original characters.
Latin faces retain only required name metadata, variation names, and licensing;
the generator also verifies face metrics and every retained character's advance
and left side bearing against the original font.
DM Sans normal and both Playfair Latin faces keep FontTools' default layout
features plus `tnum`, matching the current UI while reducing unused alternate
glyphs. All variation axes remain intact. Future optional styling such as small
caps or stylistic sets needs its feature tag added to these Latin subsets;
unsupported features do not automatically select the full fallback face.

Anek Bangla is downloaded from the Google Fonts source repository under its
included SIL Open Font License. Only its width axis is fixed at 87.5 percent;
all original Unicode characters and its variable weight axis remain available.
The build validates font coverage and variation axes after decoding every file.

Local source caches can be passed with `--anek-source` and `--crowd-source`.
The helper `lib/optimizedAssets.ts` maps original paths to responsive variants,
and returns the original path for any asset without an optimized replacement.

Run `npm run verify` to build, type-check, and enforce first-screen JavaScript,
CSS, font, and image size budgets. These checks catch payload regressions; they
do not replace mobile/desktop Lighthouse measurements or interaction tests.

The production build also pre-renders `/`, `/about`, `/terms`, and `/privacy`
from the same React components. The browser hydrates this HTML; the Vite dev
server still uses normal client rendering. `dist-ssr` is a build-only artifact
and is not deployed. Vercel serves the HTML files through extensionless URLs
and redirects `.html` and trailing-slash aliases to the canonical page URLs.
