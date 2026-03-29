#!/usr/bin/env python3
"""
Bible Audio Uploader — AudioTreasure → Cloudflare R2
=====================================================
Downloads every Bible chapter MP3 from AudioTreasure.com (David Williams, WEB)
and uploads it straight into your R2 bucket. No local storage needed.

SETUP (one time):
  pip install boto3 requests

RUN:
  python upload_bible_audio.py

The script skips files already in R2, so you can stop and resume any time.
Completed files are also logged to  upload_progress.txt  in the same folder.
"""

import boto3
import requests
import time
import sys
from botocore.config import Config

# ── Cloudflare R2 credentials ────────────────────────────────────────────────
ACCOUNT_ID     = "da3af124ac6391bc777c7880438e7dfb"
ACCESS_KEY_ID  = "ec77c386e4449c6fe52a5946378024a7"
SECRET_KEY     = "cfdc2f5de1f5eb8f583f4e9ac7c033802660e1de82eb08dae65e5d103c8197b7"
BUCKET_NAME    = "bible-audio"
R2_ENDPOINT    = f"https://{ACCOUNT_ID}.r2.cloudflarestorage.com"

# Public base URL (for reference — already set in your HTML)
PUBLIC_BASE    = "https://pub-c4105367c474429f812253bea5afdc20.r2.dev"

# ── Book name → AudioTreasure URL segment ────────────────────────────────────
AT_BOOK_MAP = {
    'Song of Solomon':  'SongofSolomon',
    '1 Samuel':         '1Samuel',
    '2 Samuel':         '2Samuel',
    '1 Kings':          '1Kings',
    '2 Kings':          '2Kings',
    '1 Chronicles':     '1Chronicles',
    '2 Chronicles':     '2Chronicles',
    '1 Corinthians':    '1Corinthians',
    '2 Corinthians':    '2Corinthians',
    '1 Thessalonians':  '1Thessalonians',
    '2 Thessalonians':  '2Thessalonians',
    '1 Timothy':        '1Timothy',
    '2 Timothy':        '2Timothy',
    '1 Peter':          '1Peter',
    '2 Peter':          '2Peter',
    '1 John':           '1John',
    '2 John':           '2John',
    '3 John':           '3John',
}

def at_book_name(book):
    return AT_BOOK_MAP.get(book, book.replace(' ', ''))

# ── Full Bible: (book, chapter_count) ────────────────────────────────────────
BIBLE_BOOKS = [
    ('Genesis', 50), ('Exodus', 40), ('Leviticus', 27), ('Numbers', 36),
    ('Deuteronomy', 34), ('Joshua', 24), ('Judges', 21), ('Ruth', 4),
    ('1 Samuel', 31), ('2 Samuel', 24), ('1 Kings', 22), ('2 Kings', 25),
    ('1 Chronicles', 29), ('2 Chronicles', 36), ('Ezra', 10), ('Nehemiah', 13),
    ('Esther', 10), ('Job', 42), ('Psalms', 150), ('Proverbs', 31),
    ('Ecclesiastes', 12), ('Song of Solomon', 8), ('Isaiah', 66),
    ('Jeremiah', 52), ('Lamentations', 5), ('Ezekiel', 48), ('Daniel', 12),
    ('Hosea', 14), ('Joel', 3), ('Amos', 9), ('Obadiah', 1),
    ('Jonah', 4), ('Micah', 7), ('Nahum', 3), ('Habakkuk', 3),
    ('Zephaniah', 3), ('Haggai', 2), ('Zechariah', 14), ('Malachi', 4),
    ('Matthew', 28), ('Mark', 16), ('Luke', 24), ('John', 21),
    ('Acts', 28), ('Romans', 16), ('1 Corinthians', 16), ('2 Corinthians', 13),
    ('Galatians', 6), ('Ephesians', 6), ('Philippians', 4), ('Colossians', 4),
    ('1 Thessalonians', 5), ('2 Thessalonians', 3), ('1 Timothy', 6),
    ('2 Timothy', 4), ('Titus', 3), ('Philemon', 1), ('Hebrews', 13),
    ('James', 5), ('1 Peter', 5), ('2 Peter', 3), ('1 John', 5),
    ('2 John', 1), ('3 John', 1), ('Jude', 1), ('Revelation', 22),
]

TOTAL_CHAPTERS = sum(c for _, c in BIBLE_BOOKS)  # 1,189

# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    # Connect to R2
    s3 = boto3.client(
        's3',
        endpoint_url='https://da3af124ac6391bc777c7880438e7dfb.r2.cloudflarestorage.com',
        aws_access_key_id='ec77c386e4449c6fe52a5946378024a7',
        aws_secret_access_key='cfdc2f5de1f5eb8f583f4e9ac7c033802660e1de82eb08dae65e5d103c8197b7',
        config=Config(signature_version='s3v4'),
        region_name='auto',
    )

    # Build set of already-uploaded keys so we can skip them
    print("Checking what is already in R2 (this may take a moment)...")
    existing = set()
    paginator = s3.get_paginator('list_objects_v2')
    for page in paginator.paginate(Bucket=BUCKET_NAME):
        for obj in page.get('Contents', []):
            existing.add(obj['Key'])
    print(f"  {len(existing)} / {TOTAL_CHAPTERS} chapters already uploaded\n")

    session = requests.Session()
    session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'

    done = 0
    skipped = 0
    uploaded = 0
    failed = []
    progress_file = open('upload_progress.txt', 'a', encoding='utf-8')

    for book, num_chapters in BIBLE_BOOKS:
       for book, num_chapters in BIBLE_BOOKS:
        b = at_book_name(book)
        
        # Special handling for Psalms (different naming convention)
        if book == "Psalms":
            folder = "Psalms"
            for ch in range(1, num_chapters + 1):
                done += 1
                key = f"Psalms/psalm{ch:03d}.mp3"          # e.g. Psalms/psalm001.mp3
                chapter_str = f"{ch:03d}"                   # 001, 002, ..., 150
                
                if key in existing:
                    skipped += 1
                    print(f" [{done:4}/{TOTAL_CHAPTERS}] SKIP {key}")
                    continue

                src_url = f"https://www.audiotreasure.com/mp3/Psalms/psalm{chapter_str}.mp3"

                print(f" [{done:4}/{TOTAL_CHAPTERS}] GET {src_url} ", end='', flush=True)
                
                try:
                    resp = session.get(src_url, timeout=60)
                    if resp.status_code == 200:
                        size_kb = len(resp.content) // 1024
                        s3.put_object(
                            Bucket=BUCKET_NAME,
                            Key=key,
                            Body=resp.content,
                            ContentType='audio/mpeg',
                            CacheControl='public, max-age=31536000',
                        )
                        uploaded += 1
                        print(f"→ uploaded ({size_kb} KB)")
                        progress_file.write(f"OK {key}\n")
                        progress_file.flush()
                    else:
                        print(f"→ HTTP {resp.status_code} — skipped")
                        failed.append((key, f"HTTP {resp.status_code}"))
                        progress_file.write(f"ERR {key} HTTP {resp.status_code}\n")
                except Exception as e:
                    print(f"→ ERROR: {e}")
                    failed.append((key, str(e)))
                    progress_file.write(f"ERR {key} {e}\n")
                
                time.sleep(0.4)
            continue   # Skip the normal logic for Psalms
            done += 1
            
            # Key stored in R2 (clean format with leading zero)
            key = f"{b}/{b}_{ch:02d}.mp3"
            
            # Already uploaded — skip
            if key in existing:
                skipped += 1
                print(f" [{done:4}/{TOTAL_CHAPTERS}] SKIP {key}")
                continue

            # Correct AudioTreasure URL (this was the main problem)
            folder = f"{book_index:02d}_{b}"
            chapter_str = f"{ch:02d}"
            src_url = f"https://www.audiotreasure.com/mp3/{folder}/{b}_{chapter_str}.mp3"

            print(f" [{done:4}/{TOTAL_CHAPTERS}] GET {src_url} ", end='', flush=True)
            
            try:
                resp = session.get(src_url, timeout=60)
                if resp.status_code == 200:
                    size_kb = len(resp.content) // 1024
                    s3.put_object(
                        Bucket=BUCKET_NAME,
                        Key=key,
                        Body=resp.content,
                        ContentType='audio/mpeg',
                        CacheControl='public, max-age=31536000',
                    )
                    uploaded += 1
                    print(f"→ uploaded ({size_kb} KB)")
                    progress_file.write(f"OK {key}\n")
                    progress_file.flush()
                else:
                    print(f"→ HTTP {resp.status_code} — skipped")
                    failed.append((key, f"HTTP {resp.status_code}"))
                    progress_file.write(f"ERR {key} HTTP {resp.status_code}\n")
            except Exception as e:
                print(f"→ ERROR: {e}")
                failed.append((key, str(e)))
                progress_file.write(f"ERR {key} {e}\n")
            
            # Polite delay to avoid rate-limiting
            time.sleep(0.4)

    print(f"\n{'='*60}")
    print(f"  Done!  Uploaded: {uploaded}  |  Skipped: {skipped}  |  Failed: {len(failed)}")
    print(f"  Public base URL: {PUBLIC_BASE}")
    if failed:
        print(f"\n  Failed chapters ({len(failed)}):")
        for key, reason in failed:
            print(f"    {key}  —  {reason}")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
