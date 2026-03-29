#!/usr/bin/env python3
"""
Bible Audio Uploader — eBible.org → Cloudflare R2
==================================================
Downloads every Bible chapter MP3 from eBible.org (Winfred W. Henson, WEB)
and uploads it to your R2 bucket.  No 6 GB of local storage needed — each
file is downloaded and immediately streamed up to R2.

SETUP (one time, in your terminal):
    python -m pip install boto3 requests beautifulsoup4

RUN:
    python upload_bible_audio.py

The script skips files already in R2, so you can stop and resume any time.
Progress is also written to  upload_progress.txt  in the same folder.
"""

import boto3, requests, time
from bs4 import BeautifulSoup
from botocore.config import Config

# ── Cloudflare R2 credentials ─────────────────────────────────────────────────
ACCOUNT_ID    = "da3af124ac6391bc777c7880438e7dfb"
ACCESS_KEY_ID = "ec77c386e4449c6fe52a5946378024a7"
SECRET_KEY    = "cfdc2f5de1f5eb8f583f4e9ac7c033802660e1de82eb08dae65e5d103c8197b7"
BUCKET_NAME   = "bible-audio"
R2_ENDPOINT   = f"https://{ACCOUNT_ID}.r2.cloudflarestorage.com"
PUBLIC_BASE   = "https://pub-c4105367c474429f812253bea5afdc20.r2.dev"

EBIBLE_BASE   = "https://ebible.org/eng-web/audio"

# ── All 66 book folders exactly as eBible names them ─────────────────────────
# Each entry: (standard book name used in your reading plans, eBible folder)
BOOKS = [
    ("Genesis",          "01_Genesis"),
    ("Exodus",           "02_Exodus"),
    ("Leviticus",        "03_Leviticus"),
    ("Numbers",          "04_Numbers"),
    ("Deuteronomy",      "05_Deuteronomy"),
    ("Joshua",           "06_Joshua"),
    ("Judges",           "07_Judges"),
    ("Ruth",             "08_Ruth"),
    ("1 Samuel",         "09_First_Samuel"),
    ("2 Samuel",         "10_Second_Samuel"),
    ("1 Kings",          "11_First_Kings"),
    ("2 Kings",          "12_Second_Kings"),
    ("1 Chronicles",     "13_First_Chronicles"),
    ("2 Chronicles",     "14_Second_Chronicles"),
    ("Ezra",             "15_Ezra"),
    ("Nehemiah",         "16_Nehemiah"),
    ("Esther",           "17_Esther"),
    ("Job",              "18_Job"),
    ("Psalms",           "19_Psalms"),
    ("Proverbs",         "20_Proverbs"),
    ("Ecclesiastes",     "21_Ecclesiastes"),
    ("Song of Solomon",  "22_Song_of_Solomon"),
    ("Isaiah",           "23_Isaiah"),
    ("Jeremiah",         "24_Jeremiah"),
    ("Lamentations",     "25_Lamentations"),
    ("Ezekiel",          "26_Ezekiel"),
    ("Daniel",           "27_Daniel"),
    ("Hosea",            "28_Hosea"),
    ("Joel",             "29_Joel"),
    ("Amos",             "30_Amos"),
    ("Obadiah",          "31_Obadiah"),
    ("Jonah",            "32_Jonah"),
    ("Micah",            "33_Micah"),
    ("Nahum",            "34_Nahum"),
    ("Habakkuk",         "35_Habakkuk"),
    ("Zephaniah",        "36_Zephaniah"),
    ("Haggai",           "37_Haggai"),
    ("Zechariah",        "38_Zechariah"),
    ("Malachi",          "39_Malachi"),
    ("Matthew",          "40_Matthew"),
    ("Mark",             "41_Mark"),
    ("Luke",             "42_Luke"),
    ("John",             "43_John"),
    ("Acts",             "44_Acts"),
    ("Romans",           "45_Romans"),
    ("1 Corinthians",    "46_First_Corinthians"),
    ("2 Corinthians",    "47_Second_Corinthians"),
    ("Galatians",        "48_Galatians"),
    ("Ephesians",        "49_Ephesians"),
    ("Philippians",      "50_Philippians"),
    ("Colossians",       "51_Colossians"),
    ("1 Thessalonians",  "52_First_Thessalonians"),
    ("2 Thessalonians",  "53_Second_Thessalonians"),
    ("1 Timothy",        "54_First_Timothy"),
    ("2 Timothy",        "55_Second_Timothy"),
    ("Titus",            "56_Titus"),
    ("Philemon",         "57_Philemon"),
    ("Hebrews",          "58_Hebrews"),
    ("James",            "59_James"),
    ("1 Peter",          "60_First_Peter"),
    ("2 Peter",          "61_Second_Peter"),
    ("1 John",           "62_First_John"),
    ("2 John",           "63_Second_John"),
    ("3 John",           "64_Third_John"),
    ("Jude",             "65_Jude"),
    ("Revelation",       "66_Revelations"),   # eBible spells it with an 's'
]

# ── Helpers ───────────────────────────────────────────────────────────────────

def get_chapter_urls(session, folder):
    """Scrape eBible index page for a book and return sorted list of MP3 URLs."""
    url = f"{EBIBLE_BASE}/{folder}/"
    r = session.get(url, timeout=30)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")
    links = [a["href"] for a in soup.find_all("a", href=True) if a["href"].endswith(".mp3")]
    links.sort()
    return [f"{EBIBLE_BASE}/{folder}/{fn}" for fn in links]

def r2_key(folder, chapter_index):
    """
    Normalized R2 key: 01_Genesis/01_Genesis_1.mp3
    chapter_index is 1-based.
    """
    return f"{folder}/{folder}_{chapter_index}.mp3"

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    s3 = boto3.client(
        "s3",
        endpoint_url="https://da3af124ac6391bc777c7880438e7dfb.r2.cloudflarestorage.com",
        aws_access_key_id='ec77c386e4449c6fe52a5946378024a7',
        aws_secret_access_key='cfdc2f5de1f5eb8f583f4e9ac7c033802660e1de82eb08dae65e5d103c8197b7',
        config=Config(signature_version="s3v4"),
        region_name="auto",
    )

    # Build set of already-uploaded keys so we can resume
    print("Checking what is already in R2…")
    existing = set()
    paginator = s3.get_paginator("list_objects_v2")
    for page in paginator.paginate(Bucket=BUCKET_NAME):
        for obj in page.get("Contents", []):
            existing.add(obj["Key"])
    print(f"  {len(existing)} files already uploaded\n")

    session = requests.Session()
    session.headers["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"

    total_books = len(BOOKS)
    uploaded = skipped = failed_count = 0
    failed = []

    with open("upload_progress.txt", "a", encoding="utf-8") as log:
        for book_i, (book_name, folder) in enumerate(BOOKS, 1):
            print(f"\n[{book_i}/{total_books}] {book_name}  ({folder})")

            # Get the list of chapter MP3 URLs from eBible index
            try:
                chapter_urls = get_chapter_urls(session, folder)
            except Exception as e:
                print(f"  ERROR fetching index: {e}")
                failed.append((folder, str(e)))
                continue

            for ch_i, src_url in enumerate(chapter_urls, 1):
                key = r2_key(folder, ch_i)

                if key in existing:
                    skipped += 1
                    print(f"  ch {ch_i:3d}  SKIP")
                    continue

                print(f"  ch {ch_i:3d}  GET  {src_url.split('/')[-1]} … ", end="", flush=True)
                try:
                    resp = session.get(src_url, timeout=120)
                    resp.raise_for_status()
                    size_kb = len(resp.content) // 1024
                    s3.put_object(
                        Bucket=BUCKET_NAME,
                        Key=key,
                        Body=resp.content,
                        ContentType="audio/mpeg",
                        CacheControl="public, max-age=31536000",
                    )
                    uploaded += 1
                    print(f"uploaded ({size_kb} KB)")
                    log.write(f"OK  {key}\n")
                    log.flush()
                except Exception as e:
                    failed_count += 1
                    failed.append((key, str(e)))
                    print(f"FAILED — {e}")
                    log.write(f"ERR {key}  {e}\n")

                time.sleep(0.3)   # be polite to eBible

    print(f"\n{'='*60}")
    print(f"  Done!  Uploaded: {uploaded}  Skipped: {skipped}  Failed: {failed_count}")
    print(f"  Public base: {PUBLIC_BASE}")
    if failed:
        print(f"\n  Failed items:")
        for k, reason in failed:
            print(f"    {k}  —  {reason}")
    print("="*60)

if __name__ == "__main__":
    main()
