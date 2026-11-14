#!/usr/bin/env python3
from pathlib import Path
import json,requests,time,sys
ROOT=Path(__file__).resolve().parent
manifest=json.loads((ROOT/"dominica-image-manifest.json").read_text(encoding="utf-8"))
s=requests.Session(); s.headers.update({"User-Agent":"Mozilla/5.0 (compatible; The211Files/1.0)"})
failed=[]
for i,item in enumerate(manifest,1):
 p=ROOT/item["local"]; p.parent.mkdir(parents=True,exist_ok=True)
 if p.exists() and p.stat().st_size>0: print(f"[{i:03d}/{len(manifest)}] exists  {p}"); continue
 try:
  r=s.get(item["source"],timeout=30); r.raise_for_status(); p.write_bytes(r.content); print(f"[{i:03d}/{len(manifest)}] saved   {p}"); time.sleep(.05)
 except Exception as e: failed.append((item["source"],str(e))); print(f"FAILED {e}",file=sys.stderr)
if failed: raise SystemExit(1)
print(f"Done. {len(manifest)} Dominica source images saved under original filenames.")
