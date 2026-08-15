#!/usr/bin/env python3
"""
Fetch the exact 137 X-media images listed in morocco-image-manifest.json and
convert them to the local WebP assets expected by the Morocco profile.

Run from the repository root:
    python download-morocco-images.py

Requires:
    pip install requests pillow
"""
from pathlib import Path
import io, json, sys, time
import requests
from PIL import Image

ROOT = Path(__file__).resolve().parent
manifest = json.loads((ROOT / "morocco-image-manifest.json").read_text(encoding="utf-8"))

session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (compatible; The211Files/1.0)"
})

failed = []
for i, item in enumerate(manifest, 1):
    target = ROOT / item["local"]
    target.parent.mkdir(parents=True, exist_ok=True)

    if target.exists() and target.stat().st_size > 0:
        print(f"[{i:03d}/{len(manifest)}] exists  {target}")
        continue

    try:
        response = session.get(item["source"], timeout=30)
        response.raise_for_status()
        image = Image.open(io.BytesIO(response.content)).convert("RGB")
        image.save(target, "WEBP", quality=89, method=6)
        print(f"[{i:03d}/{len(manifest)}] saved   {target}")
        time.sleep(0.05)
    except Exception as exc:
        failed.append((item["source"], str(exc)))
        print(f"[{i:03d}/{len(manifest)}] FAILED  {exc}", file=sys.stderr)

if failed:
    print("\nFailed downloads:", file=sys.stderr)
    for url, error in failed:
        print(f"- {url}: {error}", file=sys.stderr)
    raise SystemExit(1)

print(f"\nDone. {len(manifest)} source images are now local WebP assets.")
