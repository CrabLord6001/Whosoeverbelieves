#!/usr/bin/env python3
"""
Verse Timing Builder — WEB narration -> per-verse start times
==============================================================
Forced-aligns each chapter of the Winfred Henson WEB recording against the WEB
text already in this repo, and writes the verse start times the reading-plan
page uses to follow the narrator instead of estimating his pacing.

Output, one file per book:

    bible/timings/web/<book-slug>.json
    { "book": "Psalms", "model": "...",
      "c": { "23": { "dur": 174.76, "v": [11.46, 18.2, ...],
                     "conf": -0.21, "check": 0.0 } } }

"v" is each verse's start in seconds. "conf" is the mean CTC alignment score
(closer to 0 is better); "check" is how far, in seconds, a second independent
pass disagreed — anything over 2.5s is marked "flag": true for review.

The page only trusts a chapter's times when the MP3 it loads matches "dur", so a
stale or re-cut file falls back to the old estimate rather than mistiming.

SETUP (one time):
    python -m pip install torch torchaudio soundfile numpy
    # ffmpeg must be on PATH

RUN (from the repo root):
    python align_bible_audio.py                  # every book
    python align_bible_audio.py Psalms John      # just these
    python align_bible_audio.py --device cuda    # use the GPU if you have one

Resumable: a chapter already in its book's output file is skipped, so stopping
and re-running costs nothing. Roughly 7x faster than real time per CPU core, so
the whole Bible is about 11 hours on two cores and well under an hour on a GPU.

Model: wav2vec2 base (960h English, CTC). Downloaded once to the torch cache.
"""
import argparse, difflib, io, json, os, re, subprocess, sys, tempfile, time
import numpy as np
import soundfile as sf
import torch, torchaudio

R2_BASE = "https://pub-c4105367c474429f812253bea5afdc20.r2.dev"
# Set from --translation. WEB is the eBible narration (one narrator, spoken
# chapter announcements, mis-numbered files in four books); KJV is the LibriVox
# set (many readers, no announcements, files named by their real chapter).
TRANS = 'web'
TEXT_DIR = os.path.join('bible', 'web')
OUT_DIR = os.path.join('bible', 'timings', 'web')
MODEL_NAME = 'wav2vec2_base_960h'
CHECK_TOLERANCE = 2.5
WINDOW_S = 100          # audio is run in windows this long to bound memory
OVERLAP_S = 2

# eBible folder per book, as uploaded to R2 by upload_bible_audio.py.
FOLDERS = {
 'Genesis':'01_Genesis','Exodus':'02_Exodus','Leviticus':'03_Leviticus',
 'Numbers':'04_Numbers','Deuteronomy':'05_Deuteronomy','Joshua':'06_Joshua',
 'Judges':'07_Judges','Ruth':'08_Ruth','1 Samuel':'09_First_Samuel',
 '2 Samuel':'10_Second_Samuel','1 Kings':'11_First_Kings','2 Kings':'12_Second_Kings',
 '1 Chronicles':'13_First_Chronicles','2 Chronicles':'14_Second_Chronicles',
 'Ezra':'15_Ezra','Nehemiah':'16_Nehemiah','Esther':'17_Esther','Job':'18_Job',
 'Psalms':'19_Psalms','Proverbs':'20_Proverbs','Ecclesiastes':'21_Ecclesiastes',
 'Song of Songs':'22_Song_of_Solomon','Isaiah':'23_Isaiah','Jeremiah':'24_Jeremiah',
 'Lamentations':'25_Lamentations','Ezekiel':'26_Ezekiel','Daniel':'27_Daniel',
 'Hosea':'28_Hosea','Joel':'29_Joel','Amos':'30_Amos','Obadiah':'31_Obadiah',
 'Jonah':'32_Jonah','Micah':'33_Micah','Nahum':'34_Nahum','Habakkuk':'35_Habakkuk',
 'Zephaniah':'36_Zephaniah','Haggai':'37_Haggai','Zechariah':'38_Zechariah',
 'Malachi':'39_Malachi','Matthew':'40_Matthew','Mark':'41_Mark','Luke':'42_Luke',
 'John':'43_John','Acts':'44_Acts','Romans':'45_Romans',
 '1 Corinthians':'46_First_Corinthians','2 Corinthians':'47_Second_Corinthians',
 'Galatians':'48_Galatians','Ephesians':'49_Ephesians','Philippians':'50_Philippians',
 'Colossians':'51_Colossians','1 Thessalonians':'52_First_Thessalonians',
 '2 Thessalonians':'53_Second_Thessalonians','1 Timothy':'54_First_Timothy',
 '2 Timothy':'55_Second_Timothy','Titus':'56_Titus','Philemon':'57_Philemon',
 'Hebrews':'58_Hebrews','James':'59_James','1 Peter':'60_First_Peter',
 '2 Peter':'61_Second_Peter','1 John':'62_First_John','2 John':'63_Second_John',
 '3 John':'64_Third_John','Jude':'65_Jude','Revelation':'66_Revelations',
}

NUM_WORDS = ['ZERO','ONE','TWO','THREE','FOUR','FIVE','SIX','SEVEN','EIGHT','NINE','TEN',
 'ELEVEN','TWELVE','THIRTEEN','FOURTEEN','FIFTEEN','SIXTEEN','SEVENTEEN','EIGHTEEN','NINETEEN']
TENS_WORDS = {20:'TWENTY',30:'THIRTY',40:'FORTY',50:'FIFTY',60:'SIXTY',70:'SEVENTY',
 80:'EIGHTY',90:'NINETY'}


def audio_file_number(book, chapter):
    """Which MP3 actually holds a chapter.

    The upload numbered files by the order links appeared on eBible's index
    pages, so where that listing repeated or reordered a file the numbering
    drifted off the chapter it contains. Confirmed by transcribing the spoken
    announcement of all 1,189 files (Oct 2026). Must stay in step with
    audioFileNumber() in bible-reading-plans.html.
    """
    if TRANS != 'web':
        return chapter            # the KJV files were cut and named by hand
    if book == 'Psalms' and chapter >= 72:
        return chapter + 1          # Psalm 71 listed twice; 150 is in _151
    if book == 'Luke' and chapter >= 18:
        return chapter + 1          # ch 17 listed twice; 24 is in _25
    if book == 'Isaiah' and chapter in (16, 17):
        return 33 - chapter         # files 16 and 17 swapped
    if book == '2 Thessalonians':
        return {1: 2, 2: 3, 3: 1}[chapter]
    return chapter


def say_number(n):
    out = []
    if n >= 100:
        out += [NUM_WORDS[n // 100], 'HUNDRED']; n %= 100
    if n >= 20:
        out.append(TENS_WORDS[n // 10 * 10]); n %= 10
        if n:
            out.append(NUM_WORDS[n])
    elif n:
        out.append(NUM_WORDS[n])
    return out


def slug(book):
    return re.sub(r'[^a-z0-9]+', '-', book.lower()).strip('-')


def norm_words(text):
    t = text.upper().replace('’', "'").replace("'", '')
    t = t.replace('—', ' ').replace('-', ' ')
    return [w for w in re.sub(r'[^A-Z ]', ' ', t).split() if w]


def chapter_announcement(book, chapter):
    # Verified Oct 2026 across eight reader ranges: every KJV chapter file
    # opens directly on verse 1, so there is nothing to absorb. Feeding in an
    # announcement that isn't there would consume real verse-1 audio.
    if TRANS != 'web':
        return []
    if book == 'Psalms':
        return ['PSALM'] + say_number(chapter)
    return norm_words(book) + ['CHAPTER'] + say_number(chapter)


def fetch(url, path):
    r = subprocess.run(['curl', '-sS', '--max-time', '600', '--retry', '4',
                        '--retry-all-errors', '-o', path, '-w', '%{http_code}', url],
                       capture_output=True, text=True)
    return (r.stdout or '').strip()[-3:] in ('200', '206')


def decode(mp3, wav):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', mp3, '-ar', '16000', '-ac', '1',
                        wav, '-y'], capture_output=True)
    return r.returncode == 0 and os.path.exists(wav)


class Aligner:
    def __init__(self, device='cpu'):
        bundle = torchaudio.pipelines.WAV2VEC2_ASR_BASE_960H
        self.device = torch.device(device)
        self.model = bundle.get_model().to(self.device).eval()
        self.labels = bundle.get_labels()
        self.idx = {c: i for i, c in enumerate(self.labels)}

    def emission(self, wav_path):
        """CTC emissions for a whole chapter, in overlapping windows.

        A ten-minute chapter in a single pass needs several GB; windowing keeps
        memory flat. Each window carries OVERLAP_S of context either side and
        only its own frames are kept, so the joins leave no seam.
        """
        w, sr = sf.read(wav_path, dtype='float32')
        if w.ndim > 1:
            w = w.mean(axis=1)
        n = len(w)
        win, ov = int(WINDOW_S * sr), int(OVERLAP_S * sr)
        parts, times, pos = [], [], 0
        while pos < n:
            end = min(n, pos + win)
            a, b = max(0, pos - ov), min(n, end + ov)
            seg = torch.from_numpy(w[a:b]).unsqueeze(0).to(self.device)
            with torch.inference_mode():
                em, _ = self.model(seg)
            em = torch.log_softmax(em, dim=-1)[0].cpu()
            stride = (b - a) / em.shape[0]
            fs = a + torch.arange(em.shape[0], dtype=torch.float64) * stride
            keep = (fs >= pos) & (fs < end)
            parts.append(em[keep]); times.append(fs[keep] / sr)
            pos = end
        return torch.cat(parts).unsqueeze(0), torch.cat(times).numpy(), n / sr

    def greedy_words(self, em, ftimes):
        ids = em[0].argmax(-1).tolist()
        words, cur, start, prev = [], [], None, -1
        for i, t in enumerate(ids):
            if t != prev and t != 0:
                ch = self.labels[t]
                if ch == '|':
                    if cur:
                        words.append((''.join(cur), float(ftimes[start])))
                        cur, start = [], None
                else:
                    if not cur:
                        start = i
                    cur.append(ch)
            prev = t
        if cur:
            words.append((''.join(cur), float(ftimes[start])))
        return words

    def align(self, em, ftimes, words):
        tok = [[self.idx[c] for c in w if c in self.idx] for w in words]
        tok = [t if t else [self.idx['|']] for t in tok]
        flat = torch.tensor([[x for t in tok for x in t]])
        if flat.shape[1] >= em.shape[1]:
            raise RuntimeError(f'more tokens ({flat.shape[1]}) than frames ({em.shape[1]})')
        ali, sc = torchaudio.functional.forced_align(em, flat, blank=0)
        spans = torchaudio.functional.merge_tokens(ali[0], sc[0])
        out, i = [], 0
        for t in tok:
            conf = float(np.mean([x.score for x in spans[i:i + len(t)]]))
            out.append((float(ftimes[spans[i].start]), conf))
            i += len(t)
        return out


def align_chapter(al, book, chapter, verses, tmp, title=None):
    folder = FOLDERS[book]
    fileno = audio_file_number(book, chapter)
    mp3 = os.path.join(tmp, f'{folder}_{fileno}.mp3')
    wav = mp3[:-4] + '.wav'
    try:
        prefix = '' if TRANS == 'web' else TRANS + '/'
        if not fetch(f'{R2_BASE}/{prefix}{folder}/{folder}_{fileno}.mp3', mp3):
            return {'error': 'download'}
        if not decode(mp3, wav):
            return {'error': 'decode'}
        em, ftimes, dur = al.emission(wav)

        # The narrator reads the announcement, and in the Psalms the
        # superscription ("For the Chief Musician. By David...") which this text
        # keeps in `titles` rather than in verse 1. Feeding both in as throwaway
        # tokens lets them be consumed instead of smeared into verse 1 — Psalm
        # 18's superscription alone runs about 20 seconds.
        lead = chapter_announcement(book, chapter)
        if title:
            lead = lead + norm_words(title)
        vwords = [norm_words(v) for v in verses]
        flat, owner = list(lead), [-1] * len(lead)
        for vi, ws in enumerate(vwords):
            flat += ws; owner += [vi] * len(ws)

        aligned = al.align(em, ftimes, flat)
        starts, confs = [None] * len(verses), [[] for _ in verses]
        for (t, c), vi in zip(aligned, owner):
            if vi < 0:
                continue
            if starts[vi] is None:
                starts[vi] = t
            confs[vi].append(c)

        # Independent cross-check: a plain transcript of the audio, matched back
        # to the reference words. It shares the emissions but not the alignment,
        # so a real mistiming shows up as disagreement.
        gw = al.greedy_words(em, ftimes)
        sm = difflib.SequenceMatcher(a=[w for w, _ in gw], b=flat, autojunk=False)
        ref_time = {}
        for blk in sm.get_matching_blocks():
            for k in range(blk.size):
                ref_time.setdefault(blk.b + k, gw[blk.a + k][1])
        check_starts, pos = [None] * len(verses), len(lead)
        for vi, ws in enumerate(vwords):
            for k in range(len(ws)):
                if pos + k in ref_time:
                    check_starts[vi] = ref_time[pos + k]; break
            pos += len(ws)
        diffs = [abs(a - b) for a, b in zip(starts, check_starts)
                 if a is not None and b is not None]

        # Verses with no words here (a few sit in the WEB's footnotes) inherit
        # the previous time; keep the series monotonic either way.
        last = 0.0
        for i, s in enumerate(starts):
            if s is None or s < last:
                starts[i] = last
            last = starts[i]

        med = round(float(np.median(diffs)), 2) if diffs else None
        return {'dur': round(dur, 2),
                'v': [round(s, 2) for s in starts],
                'conf': round(float(np.mean([c for cs in confs for c in cs])), 3)
                        if any(confs) else None,
                'check': med,
                'check_max': round(float(max(diffs)), 2) if diffs else None,
                'flag': bool(med is not None and med > CHECK_TOLERANCE)}
    finally:
        for p in (mp3, wav):
            if os.path.exists(p):
                os.remove(p)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('books', nargs='*')
    ap.add_argument('--device', default='cpu', help='cpu or cuda')
    ap.add_argument('--translation', default='web', choices=['web', 'kjv'],
                    help='which recording to align (default web)')
    args = ap.parse_args()

    global TRANS, TEXT_DIR, OUT_DIR
    TRANS = args.translation
    TEXT_DIR = os.path.join('bible', TRANS)
    OUT_DIR = os.path.join('bible', 'timings', TRANS)
    print(f'aligning the {TRANS.upper()} recording: text from {TEXT_DIR}, '
          f'timings to {OUT_DIR}', flush=True)

    if not os.path.isdir(TEXT_DIR):
        sys.exit(f'run this from the repo root ({TEXT_DIR} not found)')
    books = args.books or list(FOLDERS.keys())
    unknown = [b for b in books if b not in FOLDERS]
    if unknown:
        sys.exit('unknown book(s): ' + ', '.join(unknown))

    os.makedirs(OUT_DIR, exist_ok=True)
    al = Aligner(args.device)
    tmp = tempfile.mkdtemp()
    t_start = time.time()
    done = flagged = 0

    for book in books:
        tpath = os.path.join(TEXT_DIR, slug(book) + '.json')
        if not os.path.exists(tpath):
            print(f'!! no text for {book} at {tpath}'); continue
        doc = json.load(io.open(tpath, encoding='utf-8'))
        opath = os.path.join(OUT_DIR, slug(book) + '.json')
        out = json.load(open(opath)) if os.path.exists(opath) else \
            {'book': book, 'model': MODEL_NAME, 'c': {}}

        for ci, verses in enumerate(doc['c'], start=1):
            if str(ci) in out['c'] or not verses:
                continue
            t0 = time.time()
            title = (doc.get('titles') or {}).get(str(ci))
            try:
                res = align_chapter(al, book, ci, verses, tmp, title)
            except Exception as e:
                res = {'error': str(e)[:140]}
            if 'error' in res:
                print(f'{book} {ci}: ERROR {res["error"]}', flush=True)
                continue
            out['c'][str(ci)] = res
            with open(opath, 'w') as f:
                json.dump(out, f, separators=(',', ':'), sort_keys=True)
            done += 1
            flagged += bool(res['flag'])
            print(f'{book} {ci}: {len(verses)}v dur={res["dur"]}s v1={res["v"][0]} '
                  f'conf={res["conf"]} check={res["check"]}'
                  f'{"  FLAG" if res["flag"] else ""} [{time.time()-t0:.0f}s]', flush=True)

    mins = (time.time() - t_start) / 60
    print(f'\n{done} chapters aligned in {mins:.0f} min; {flagged} flagged for review')


if __name__ == '__main__':
    main()
