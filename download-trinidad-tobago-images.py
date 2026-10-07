#!/usr/bin/env python3
from pathlib import Path
import json,sys,time,requests
ROOT=Path(__file__).resolve().parent
manifest=json.loads((ROOT/'trinidad-tobago-image-manifest.json').read_text(encoding='utf-8'))
s=requests.Session(); s.headers.update({'User-Agent':'Mozilla/5.0 (compatible; The211Files/1.0)'})
failed=[]
for i,item in enumerate(manifest,1):
    target=ROOT/item['local']; target.parent.mkdir(parents=True,exist_ok=True)
    if target.exists() and target.stat().st_size>0:
        print(f'[{i:03d}/{len(manifest)}] exists  {target}'); continue
    try:
        r=s.get(item['source'],timeout=30); r.raise_for_status(); target.write_bytes(r.content)
        print(f'[{i:03d}/{len(manifest)}] saved   {target}'); time.sleep(.05)
    except Exception as exc:
        failed.append((item['source'],str(exc))); print(f'[{i:03d}/{len(manifest)}] FAILED {exc}',file=sys.stderr)
if failed: raise SystemExit(1)
print(f'Done. {len(manifest)} Trinidad & Tobago images stored under original filenames.')
