#!/usr/bin/env python3
"""
Download the exact X-media assets from Ecuador.docx.

The downloader:
- preserves every original X-media filename;
- preserves the original .jpg/.png extension;
- writes the response bytes directly, with no conversion.

Run from repository root:

    pip install requests
    python download-ecuador-images.py
"""

from pathlib import Path
import json
import sys
import time
import requests

ROOT = Path(__file__).resolve().parent
manifest = json.loads(
    (ROOT / "ecuador-image-manifest.json").read_text(encoding="utf-8")
)

session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (compatible; The211Files/1.0)"
})

failed = []

for index, item in enumerate(manifest, 1):
    target = ROOT / item["local"]
    target.parent.mkdir(parents=True, exist_ok=True)

    if target.exists() and target.stat().st_size > 0:
        print(f"[{index:03d}/{len(manifest)}] exists  {target}")
        continue

    try:
        response = session.get(item["source"], timeout=30)
        response.raise_for_status()
        target.write_bytes(response.content)
        print(f"[{index:03d}/{len(manifest)}] saved   {target}")
        time.sleep(0.05)
    except Exception as exc:
        failed.append((item["source"], str(exc)))
        print(f"[{index:03d}/{len(manifest)}] FAILED  {exc}", file=sys.stderr)

if failed:
    print("\nFailed downloads:", file=sys.stderr)
    for url, error in failed:
        print(f"- {url}: {error}", file=sys.stderr)
    raise SystemExit(1)

print(f"\nDone. {len(manifest)} Ecuador source images are stored under their original filenames.")
