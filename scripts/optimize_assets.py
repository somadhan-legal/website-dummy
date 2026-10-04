"""Regenerate browser assets without altering the original artwork or fonts.

Requires Pillow and fonttools[woff]. Run from the repository root with Python 3.
"""

from __future__ import annotations

import argparse
import base64
import io
import json
from pathlib import Path
from urllib.request import urlopen
import xml.etree.ElementTree as ET

from fontTools.ttLib import TTFont
from fontTools import subset
from fontTools.varLib.instancer import instantiateVariableFont
from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
IMAGE_DEST = PUBLIC / "images/optimized"
FONT_DEST = PUBLIC / "fonts/optimized"
ANEK_URL = "https://raw.githubusercontent.com/google/fonts/main/ofl/anekbangla/AnekBangla%5Bwdth%2Cwght%5D.ttf"
ANEK_LICENSE_URL = "https://raw.githubusercontent.com/google/fonts/main/ofl/anekbangla/OFL.txt"
CROWD_URL = "https://cdn.21st.dev/assets/localized/abdb8990a7bef8c2f5af3e45f0a3c969c4b0603fba8be92e81347de4ea4e1ed7.png"
SERVICE_NAMES = (
    "corporate-business", "family-personal-law", "property-legal-consultation",
    "criminal-defense", "dispute-resolution", "intellectual-property",
    "labor-employment", "immigration",
)
PHONE_NAMES = (
    "categories", "service-summary", "call-connecting",
    "service-progress-files", "service-progress",
)
FONTS = {
    "PlayfairDisplay-VariableFont_wght.ttf": "playfair-display-normal",
    "PlayfairDisplay-Italic-VariableFont_wght.ttf": "playfair-display-italic",
    "DMSans-VariableFont_opsz,wght.ttf": "dm-sans-normal",
    "DMSans-Italic-VariableFont_opsz,wght.ttf": "dm-sans-italic",
    "OpenSans-VariableFont_wdth,wght.ttf": "open-sans-normal",
    "OpenSans-Italic-VariableFont_wdth,wght.ttf": "open-sans-italic",
    "Inter-VariableFont_opsz,wght.ttf": "inter-normal",
    "Inter-Italic-VariableFont_opsz,wght.ttf": "inter-italic",
}
UI_FEATURE_SUBSETS = {
    "dm-sans-normal", "playfair-display-normal", "playfair-display-italic",
}
LATIN_RANGES = (
    (0x0000, 0x00FF), (0x0131, 0x0131), (0x0152, 0x0153),
    (0x02BB, 0x02BC), (0x02C6, 0x02C6), (0x02DA, 0x02DA),
    (0x02DC, 0x02DC), (0x0304, 0x0304), (0x0308, 0x0308),
    (0x0329, 0x0329), (0x2000, 0x206F), (0x2074, 0x2074),
    (0x20AC, 0x20AC), (0x2122, 0x2122), (0x2191, 0x2191),
    (0x2193, 0x2193), (0x2212, 0x2212), (0x2215, 0x2215),
    (0xFEFF, 0xFEFF), (0xFFFD, 0xFFFD),
)


def download(url: str) -> bytes:
    with urlopen(url, timeout=60) as response:
        return response.read()


def image_variants(image: Image.Image, stem: str, widths: tuple[int, ...],
                   *, quality: int = 84, lossless: bool = False) -> list[dict]:
    variants = []
    for width in widths:
        height = round(image.height * width / image.width)
        resized = image.resize((width, height), Image.Resampling.LANCZOS)
        output = IMAGE_DEST / f"{stem}-{width}.webp"
        resized.save(output, format="WEBP", quality=quality, lossless=lossless,
                     method=6, exact=True)
        decoded = Image.open(output)
        assert decoded.size == (width, height)
        variants.append({"src": f"/images/optimized/{output.name}",
                         "width": width, "height": height,
                         "bytes": output.stat().st_size})
    return variants


def build_images(crowd_source: Path | None) -> tuple[dict, list[dict]]:
    IMAGE_DEST.mkdir(parents=True, exist_ok=True)
    mapping = {}
    report = []
    for name in SERVICE_NAMES:
        source = PUBLIC / f"images/{name}.jpeg"
        with Image.open(source) as original:
            image = ImageOps.exif_transpose(original).convert("RGB")
            variants = image_variants(image, name, (480, 800), quality=84)
            mapping[f"/images/{name}.jpeg"] = {
                "src": variants[0]["src"],
                "srcSet": ", ".join(f"{v['src']} {v['width']}w" for v in variants),
                "width": image.width, "height": image.height,
            }
        report.append({"source": str(source.relative_to(ROOT)),
                       "originalBytes": source.stat().st_size, "variants": variants})
    for name in PHONE_NAMES:
        source = PUBLIC / f"images/app-screens/{name}.png"
        with Image.open(source) as original:
            image = ImageOps.exif_transpose(original).convert("RGB")
            variants = image_variants(image, f"phone-{name}", (360, 640, 960), quality=94)
            mapping[f"/images/app-screens/{name}.png"] = {
                "src": variants[1]["src"],
                "srcSet": ", ".join(f"{v['src']} {v['width']}w" for v in variants),
                "width": image.width, "height": image.height,
            }
        report.append({"source": str(source.relative_to(ROOT)),
                       "originalBytes": source.stat().st_size, "variants": variants})

    # These SVGs contain only a large transparent PNG and its clip wrapper.
    for language in ("ELT", "BLT"):
        source = PUBLIC / f"Somadhan {language}.svg"
        svg = ET.parse(source).getroot()
        nodes = svg.findall(".//{http://www.w3.org/2000/svg}image")
        assert len(nodes) == 1, "Logo structure changed; inspect before extracting."
        href = nodes[0].get("{http://www.w3.org/1999/xlink}href")
        assert href and href.startswith("data:image/png;base64,")
        image = Image.open(io.BytesIO(base64.b64decode(href.split(",", 1)[1]))).convert("RGBA")
        viewbox_width, viewbox_height = map(float, svg.get("viewBox").split()[2:])
        if image.size != (round(viewbox_width), round(viewbox_height)):
            canvas = Image.new("RGBA", (round(viewbox_width), round(viewbox_height)))
            canvas.paste(image, (0, 0))
            image = canvas
        variants = image_variants(image, f"somadhan-{language.lower()}", (480, 960), lossless=True)
        mapping[f"/Somadhan {language}.svg"] = {
            "src": variants[0]["src"],
            "srcSet": ", ".join(f"{v['src']} {v['width']}w" for v in variants),
            "width": image.width, "height": image.height,
        }
        report.append({"source": str(source.relative_to(ROOT)),
                       "originalBytes": source.stat().st_size, "variants": variants})

    for language in ("ELW", "BLW"):
        source = PUBLIC / f"Somadhan {language}.svg"
        svg = ET.parse(source).getroot()
        width, height = map(float, svg.get("viewBox").split()[2:])
        mapping[f"/Somadhan {language}.svg"] = {
            "src": f"/Somadhan {language}.svg",
            "width": round(width), "height": round(height),
        }

    crowd_bytes = crowd_source.read_bytes() if crowd_source else download(CROWD_URL)
    image = Image.open(io.BytesIO(crowd_bytes)).convert("RGBA")
    output = IMAGE_DEST / "hero-crowd.webp"
    image.save(output, format="WEBP", lossless=True, method=6, exact=True)
    decoded = Image.open(output).convert("RGBA")
    assert decoded.size == image.size and decoded.tobytes() == image.tobytes()
    report.append({"source": CROWD_URL, "originalBytes": len(crowd_bytes),
                   "outputBytes": output.stat().st_size, "dimensions": image.size,
                   "losslessPixelsVerified": True})
    # Resize each sprite independently so filtering cannot bleed across cells.
    columns, rows = 15, 7
    assert image.width % columns == 0 and image.height % rows == 0
    cell_width, cell_height = image.width // columns, image.height // rows
    mobile_cell = (cell_width // 2, cell_height // 2)
    mobile = Image.new("RGBA", (mobile_cell[0] * columns, mobile_cell[1] * rows))
    for row in range(rows):
        for column in range(columns):
            sprite = image.crop((column * cell_width, row * cell_height,
                                 (column + 1) * cell_width, (row + 1) * cell_height))
            resized = sprite.resize(mobile_cell, Image.Resampling.LANCZOS)
            mobile.paste(resized, (column * mobile_cell[0], row * mobile_cell[1]))
    mobile_output = IMAGE_DEST / "hero-crowd-mobile.webp"
    mobile.save(mobile_output, format="WEBP", lossless=True, method=6, exact=True)
    mobile_decoded = Image.open(mobile_output).convert("RGBA")
    assert mobile_decoded.size == mobile.size
    assert mobile_decoded.tobytes() == mobile.tobytes()
    report.append({"source": CROWD_URL, "output": str(mobile_output.relative_to(ROOT)),
                   "desktopBytes": output.stat().st_size,
                   "outputBytes": mobile_output.stat().st_size, "dimensions": mobile.size,
                   "spriteColumns": columns, "spriteRows": rows,
                   "spriteDimensions": mobile_cell, "losslessResizedPixelsVerified": True})
    return mapping, report


def axes(font: TTFont) -> list[tuple]:
    if "fvar" not in font:
        return []
    return [(axis.axisTag, axis.minValue, axis.defaultValue, axis.maxValue)
            for axis in font["fvar"].axes]


def face_metrics(font: TTFont) -> tuple:
    return (font["head"].unitsPerEm, font["hhea"].ascent, font["hhea"].descent,
            font["hhea"].lineGap, font["OS/2"].sTypoAscender,
            font["OS/2"].sTypoDescender, font["OS/2"].sTypoLineGap,
            font["OS/2"].usWinAscent, font["OS/2"].usWinDescent)


def character_metrics(font: TTFont, codepoints: set[int]) -> dict:
    cmap = font.getBestCmap()
    return {codepoint: font["hmtx"].metrics[cmap[codepoint]] for codepoint in codepoints}


def convert_font(source: Path | io.BytesIO, name: str, *, anek: bool = False) -> dict:
    font = TTFont(source, recalcTimestamp=False)
    original_cmap = font.getBestCmap()
    original_axes = axes(font)
    if anek:
        font = instantiateVariableFont(font, {"wdth": 87.5}, inplace=True)
    output = FONT_DEST / f"{name}.woff2"
    font.flavor = "woff2"
    font.save(output)
    decoded = TTFont(output)
    assert decoded.getBestCmap() == original_cmap, "Font Unicode coverage changed."
    expected_axes = [axis for axis in original_axes if not anek or axis[0] != "wdth"]
    assert axes(decoded) == expected_axes, "Unexpected variable axis change."
    report = {"output": str(output.relative_to(ROOT)), "outputBytes": output.stat().st_size,
              "glyphs": len(decoded.getGlyphOrder()), "unicodeCodepoints": len(original_cmap),
              "axes": axes(decoded), "unicodeCoverageVerified": True}
    if isinstance(source, Path):
        report["originalBytes"] = source.stat().st_size
    if anek:
        report["fixedWidth"] = 87.5
    else:
        # Keep the full face as fallback, and use this face only for its range.
        latin_font = TTFont(source, recalcTimestamp=False)
        codepoints = {codepoint for codepoint in original_cmap
                      if any(start <= codepoint <= end for start, end in LATIN_RANGES)}
        original_face_metrics = face_metrics(latin_font)
        original_character_metrics = character_metrics(latin_font, codepoints)
        options = subset.Options()
        if name in UI_FEATURE_SUBSETS:
            options.layout_features.append("tnum")
        else:
            options.layout_features = ["*"]
        # FontTools retains referenced variation names; also retain licensing.
        options.name_IDs.extend([13, 14])
        subsetter = subset.Subsetter(options=options)
        subsetter.populate(unicodes=codepoints)
        subsetter.subset(latin_font)
        latin_font.flavor = "woff2"
        latin_output = FONT_DEST / f"{name}-latin.woff2"
        latin_font.save(latin_output)
        latin_decoded = TTFont(latin_output)
        assert set(latin_decoded.getBestCmap()) == codepoints
        assert axes(latin_decoded) == original_axes
        assert face_metrics(latin_decoded) == original_face_metrics
        assert character_metrics(latin_decoded, codepoints) == original_character_metrics
        for name_id in (0, 1, 2, 3, 4, 5, 6, 13, 14):
            assert latin_decoded["name"].getDebugName(name_id) == font["name"].getDebugName(name_id)
        for axis in latin_decoded["fvar"].axes:
            assert latin_decoded["name"].getDebugName(axis.axisNameID)
        report["latinOutput"] = str(latin_output.relative_to(ROOT))
        report["latinBytes"] = latin_output.stat().st_size
        report["latinGlyphs"] = len(latin_decoded.getGlyphOrder())
        report["latinNameRecords"] = len(latin_decoded["name"].names)
        report["latinFaceAndCharacterMetricsVerified"] = True
        report["latinUnicodeRange"] = ",".join(
            f"U+{start:04X}" if start == end else f"U+{start:04X}-{end:04X}"
            for start, end in LATIN_RANGES)
        report["fullFallbackUnicodeCoveragePreserved"] = True
    return report


def build_fonts(anek_source: Path | None) -> list[dict]:
    FONT_DEST.mkdir(parents=True, exist_ok=True)
    report = [convert_font(PUBLIC / "fonts/english" / source, name)
              for source, name in FONTS.items()]
    anek_bytes = anek_source.read_bytes() if anek_source else download(ANEK_URL)
    anek = convert_font(io.BytesIO(anek_bytes), "anek-bangla-semicondensed", anek=True)
    anek["originalBytes"] = len(anek_bytes)
    report.append(anek)
    (FONT_DEST / "OFL-anek-bangla.txt").write_bytes(download(ANEK_LICENSE_URL))
    return report


def write_mapping(mapping: dict) -> None:
    output = ROOT / "lib/optimizedAssets.ts"
    output.write_text(
        "// Generated by scripts/optimize_assets.py; original files remain untouched.\n"
        "export type OptimizedImage = {\n  src: string;\n  srcSet?: string;\n"
        "  width?: number;\n  height?: number;\n};\n\n"
        "const optimizedImages: Record<string, OptimizedImage> = "
        + json.dumps(mapping, ensure_ascii=True, indent=2)
        + ";\n\nexport function getOptimizedImage(originalSrc: string): OptimizedImage {\n"
        "  return Object.prototype.hasOwnProperty.call(optimizedImages, originalSrc)\n"
        "    ? optimizedImages[originalSrc]\n"
        "    : { src: originalSrc };\n}\n",
        encoding="utf-8",
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--anek-source", type=Path)
    parser.add_argument("--crowd-source", type=Path)
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()
    mapping, images = build_images(args.crowd_source)
    fonts = build_fonts(args.anek_source)
    write_mapping(mapping)
    report = {"images": images, "fonts": fonts}
    if args.report:
        args.report.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
