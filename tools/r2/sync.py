#!/usr/bin/env python3
"""Copy the 3D game's Vercel Blob files to Cloudflare R2 and check every one.

Run by .github/workflows/r2-sync.yml. Reads the Blob addresses in
sporeholm3d/assets.js, newmons.js and bookvoice-data.js, makes sure the R2
bucket exists with public read (its r2.dev address) and CORS for the game,
copies each file R2 does not already hold at the same size, then checks each
file downloads from R2 with the right size and a CORS header.

The last line of the log is "R2_REPORT {json}" with the public R2 address and
any files that failed, so the game's addresses can be switched to R2 safely.
Needs CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID in the environment.
"""
import concurrent.futures as cf
import json
import os
import re
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request

BLOB = "https://ocejqvdipitcrjfy.public.blob.vercel-storage.com/"
SOURCES = ["sporeholm3d/assets.js", "sporeholm3d/newmons.js", "sporeholm3d/bookvoice-data.js"]
BUCKET = os.environ.get("R2_BUCKET", "alienmon-assets")
TYPES = {
    ".glb": "model/gltf-binary",
    ".gltf": "model/gltf+json",
    ".mp3": "audio/mpeg",
    ".ogg": "audio/ogg",
    ".wav": "audio/wav",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".json": "application/json",
}
CACHE = "public, max-age=2592000"
ORIGIN = "https://3d.alienmon.com"
UA = "alienmon-r2-sync"
URL_RE = re.compile(re.escape(BLOB) + r"""[^"'\s\\)<>]+""")


def wrangler(*args, ok_if=None):
    p = subprocess.run(["wrangler", *args], capture_output=True, text=True)
    out = (p.stdout or "") + (p.stderr or "")
    if p.returncode != 0 and not (ok_if and ok_if in out.lower()):
        raise RuntimeError(f"wrangler {' '.join(args[:3])} failed:\n{out[-1500:]}")
    return out


def head(url, origin=None):
    """Return (status, size, has_cors) for a HEAD request."""
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": UA})
    if origin:
        req.add_header("Origin", origin)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            size = r.headers.get("Content-Length")
            return r.status, int(size) if size else -1, bool(r.headers.get("Access-Control-Allow-Origin"))
    except urllib.error.HTTPError as e:
        return e.code, -1, False
    except Exception:
        return 0, -1, False


def download(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=600) as r, open(dest, "wb") as f:
        while True:
            chunk = r.read(1 << 20)
            if not chunk:
                break
            f.write(chunk)
    return os.path.getsize(dest)


def setup_bucket():
    wrangler("r2", "bucket", "create", BUCKET, ok_if="already exists")
    wrangler("r2", "bucket", "dev-url", "enable", BUCKET, "-y", ok_if="already")
    wrangler("r2", "bucket", "cors", "set", BUCKET, "--file", "tools/r2/cors.json", "-y")
    out = wrangler("r2", "bucket", "dev-url", "get", BUCKET)
    m = re.search(r"https://[a-z0-9.-]+\.r2\.dev", out)
    if not m:
        raise RuntimeError("Could not read the bucket's r2.dev address:\n" + out[-800:])
    return m.group(0)


def copy_one(url, base):
    path = url[len(BLOB):]
    key = urllib.parse.unquote(path)
    r2 = base + "/" + path
    ext = os.path.splitext(key)[1].lower()
    st, blob_size, _ = head(url)
    if st != 200:
        return {"url": url, "result": "failed", "why": f"Blob answered {st}"}
    st, r2_size, _ = head(r2)
    if st == 200 and r2_size == blob_size:
        return {"url": url, "result": "skipped", "bytes": blob_size}
    with tempfile.TemporaryDirectory() as d:
        f = os.path.join(d, "file" + ext)
        size = download(url, f)
        if size != blob_size:
            return {"url": url, "result": "failed", "why": f"downloaded {size} of {blob_size} bytes"}
        args = ["r2", "object", "put", f"{BUCKET}/{key}", "--file", f, "--remote", "--cache-control", CACHE]
        if ext in TYPES:
            args += ["--content-type", TYPES[ext]]
        last = None
        for attempt in range(3):
            try:
                wrangler(*args)
                last = None
                break
            except RuntimeError as e:
                last = str(e)
                time.sleep(5 * (attempt + 1))
        if last:
            return {"url": url, "result": "failed", "why": last[-300:]}
    return {"url": url, "result": "copied", "bytes": blob_size}


def check_one(url, base, want):
    r2 = base + "/" + url[len(BLOB):]
    for attempt in range(6):
        st, size, cors = head(r2, ORIGIN)
        if st == 200 and size == want and cors:
            return None
        time.sleep(10)
    return f"R2 answered {st}, {size} bytes (want {want}), CORS header {'present' if cors else 'missing'}"


def main():
    urls = []
    for src in SOURCES:
        with open(src, encoding="utf-8") as fh:
            for u in URL_RE.findall(fh.read()):
                if u not in urls:
                    urls.append(u)
    print(f"{len(urls)} Blob files listed in the game")
    base = setup_bucket()
    print("R2 public address:", base)

    results = []
    with cf.ThreadPoolExecutor(max_workers=6) as pool:
        for i, r in enumerate(pool.map(lambda u: copy_one(u, base), urls), 1):
            results.append(r)
            print(f"[{i}/{len(urls)}] {r['result']}: {r['url'][len(BLOB):]}" + (f" ({r.get('why')})" if r.get("why") else ""), flush=True)

    failed = {r["url"]: r["why"] for r in results if r["result"] == "failed"}
    good = [r for r in results if r["result"] != "failed"]
    with cf.ThreadPoolExecutor(max_workers=8) as pool:
        for r, why in zip(good, pool.map(lambda r: check_one(r["url"], base, r["bytes"]), good)):
            if why:
                failed[r["url"]] = why

    total = sum(r.get("bytes", 0) for r in good)
    copied = sum(1 for r in results if r["result"] == "copied")
    skipped = sum(1 for r in results if r["result"] == "skipped")
    lines = [
        f"R2 address: {base}",
        f"Files listed: {len(urls)}; copied: {copied}; already there: {skipped}; failed: {len(failed)}",
        f"Total size: {total / 1e9:.2f} GB",
    ]
    lines += [f"FAILED {u[len(BLOB):]}: {w}" for u, w in failed.items()]
    print("\n".join(lines))
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a") as fh:
            fh.write("\n".join("- " + l for l in lines) + "\n")
    report = {"base": base, "listed": len(urls), "copied": copied, "skipped": skipped,
              "bytes": total, "failed": sorted(u[len(BLOB):] for u in failed)}
    print("R2_REPORT " + json.dumps(report))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
