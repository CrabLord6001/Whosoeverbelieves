#!/usr/bin/env python3
"""
KJV Audio Uploader — local chapter files → Cloudflare R2
=========================================================
Uploads the KJV chapter MP3s prepared in

    Claude outputs/kjv_audio/kjv/<book folder>/<book folder>_<chapter>.mp3

to the bible-audio R2 bucket under the same path, e.g.

    kjv/23_Isaiah/23_Isaiah_40.mp3

Recordings: LibriVox volunteers (public domain), cut into chapters with the
LibriVox intros/outros removed and volume matched to the WEB narration.

SETUP (one time):
    python -m pip install boto3

RUN (PowerShell — keys live only in this window, never in a file):
    $env:R2_ACCESS_KEY_ID     = "paste Access Key ID here"
    $env:R2_SECRET_ACCESS_KEY = "paste Secret Access Key here"
    python upload_kjv_audio.py

Re-running is safe: a file already in R2 with identical content is skipped, and
a file that was re-cut is replaced. Content is compared by MD5 (R2's ETag), not
just size: the MP3s are constant-bitrate, so a re-cut chapter of the same length
has exactly the same size (ticket 77 found all 45 cleaned Sundiata files would
otherwise have been skipped).
"""

import os, sys, pathlib, hashlib
import boto3
from botocore.config import Config

ACCOUNT_ID  = "da3af124ac6391bc777c7880438e7dfb"
BUCKET_NAME = "bible-audio"
PUBLIC_BASE = "https://pub-c4105367c474429f812253bea5afdc20.r2.dev"
SRC_ROOT    = pathlib.Path(__file__).parent / "Claude outputs" / "kjv_audio"
CHUNK       = 8 * 1024 * 1024   # boto3's default multipart threshold and part size


def local_etag(path):
    """The ETag R2 would report for this file if boto3 uploaded it: a plain MD5
    for single-part uploads, md5-of-part-md5s plus '-N' for multipart ones."""
    size = path.stat().st_size
    with open(path, "rb") as fh:
        if size < CHUNK:
            return hashlib.md5(fh.read()).hexdigest()
        parts = [hashlib.md5(chunk).digest() for chunk in iter(lambda: fh.read(CHUNK), b"")]
    return f"{hashlib.md5(b''.join(parts)).hexdigest()}-{len(parts)}"


def main():
    key_id = os.environ.get("R2_ACCESS_KEY_ID")
    secret = os.environ.get("R2_SECRET_ACCESS_KEY")
    if not key_id or not secret:
        sys.exit("Set R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY first (see the top of this file).")

    files = sorted(SRC_ROOT.glob("kjv/*/*.mp3"))
    if not files:
        sys.exit(f"No MP3s found under {SRC_ROOT / 'kjv'}")

    s3 = boto3.client(
        "s3",
        endpoint_url=f"https://{ACCOUNT_ID}.r2.cloudflarestorage.com",
        aws_access_key_id=key_id,
        aws_secret_access_key=secret,
        config=Config(signature_version="s3v4", retries={"max_attempts": 5}),
        region_name="auto",
    )

    print("Checking what is already in R2…")
    existing = {}
    for page in s3.get_paginator("list_objects_v2").paginate(Bucket=BUCKET_NAME, Prefix="kjv/"):
        for obj in page.get("Contents", []):
            existing[obj["Key"]] = (obj["Size"], obj["ETag"].strip('"'))
    print(f"  {len(existing)} KJV files already in R2, {len(files)} prepared locally\n")

    uploaded = skipped = 0
    failed = []
    for i, f in enumerate(files, 1):
        key = f.relative_to(SRC_ROOT).as_posix()
        have = existing.get(key)
        if have and have[0] == f.stat().st_size and have[1] == local_etag(f):
            skipped += 1
            continue
        try:
            s3.upload_file(str(f), BUCKET_NAME, key, ExtraArgs={
                "ContentType": "audio/mpeg",
                "CacheControl": "public, max-age=86400",
            })
            uploaded += 1
            print(f"  [{i}/{len(files)}] {key}  ({f.stat().st_size // 1024} KB)")
        except Exception as e:
            failed.append((key, str(e)))
            print(f"  [{i}/{len(files)}] {key}  FAILED — {e}")

    print("\n" + "=" * 60)
    print(f"  Uploaded: {uploaded}   Unchanged: {skipped}   Failed: {len(failed)}")
    if failed:
        print("  Run the script again to retry the failures.")
    else:
        sample = files[0].relative_to(SRC_ROOT).as_posix()
        print(f"  Test one: {PUBLIC_BASE}/{sample}")
    print("=" * 60)


if __name__ == "__main__":
    main()
