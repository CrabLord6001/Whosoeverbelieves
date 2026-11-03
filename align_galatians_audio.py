#!/usr/bin/env python3
"""
Greek exegesis timings — Byzantine text -> per-verse and per-word start times
============================================================================
Forced-aligns each chapter of the Marilyn Phemister Greek recording against the
Robinson-Pierpont Byzantine text, and writes the times the Greek exegesis pages
use to play a verse, a word, or the whole passage.

Covers both series; pick one with --book (default galatians):

    galatians   6 chapters, text from 'Claude outputs/_tc/gal_aligned.json'
    james       5 chapters, text from 'Claude outputs/james_spans.json'
    titus       3 chapters, text from 'Claude outputs/titus_spans.json'

The file name still says galatians for the sake of the history behind it.

Same idea as align_bible_audio.py, with three differences: the text is Greek, two
independent models are run and compared (a verse where they disagree is flagged
for review), and verse starts are optionally snapped to the reader's own pauses.

Output, for the book chosen (galatians shown):

    greek/galatians/galatians-verse-times.js   window.GALATIANS_VERSE_TIMES
    greek/galatians/galatians-word-times.js    window.GALATIANS_WORD_TIMES
    greek/galatians/verse-times-report.json    per-verse scores and flags

WORD TIMES
    The alignment is already per character, and a verse start is just the span
    of its first character. Word starts are the same span list read at the
    index of each word's first character, so they cost nothing extra: any
    chapter you align emits both tables. A chapter that has not been re-run
    since this was added simply has no word entry, and the pages fall back to
    their per-verse behaviour for it.

    Word level is held to a tighter standard than verse level, because the
    error is visible: a verse start a second early is barely noticed, a word
    highlight a second early is plainly on the wrong word. So the two models
    are compared again at word level, at WORD_DISAGREE rather than 2.5s, and
    the per-word CTC scores are kept in the report. Judge a chapter on those
    two numbers before trusting it.

SETUP (one time):
    python -m pip install torch torchaudio transformers
    # ffmpeg must be on PATH
    # For GPU, install the CUDA build of torch from pytorch.org rather than the
    # default CPU wheel, or --device cuda will fall back to CPU.

RUN (from the repo root):
    py align_galatians_audio.py --device cuda                    # Galatians, all
    py align_galatians_audio.py --book james --device cuda       # James, all
    py align_galatians_audio.py --book titus --device cuda       # Titus, all
    py align_galatians_audio.py --device cuda -c 1               # just chapter 1
    py align_galatians_audio.py --device cuda --no-snap
    py align_galatians_audio.py --device cuda --single           # one model only

Resumable: a chapter already in the report is skipped unless you name it with -c.

WHY A SECOND PASS
    One model can wander through a passage and still look plausible. Two models
    that independently agree within a second are almost certainly right; where
    they disagree, the verse is flagged so you can check those few by ear instead
    of auditing all 149.

    This only works if both models can actually read the text. normalise() keeps
    only characters in the model's own vocabulary, so a model whose vocabulary
    is not plain lowercase Greek keeps nothing: every verse becomes a run of word
    delimiters, the alignment is meaningless, and the verse starts it returns
    still look plausible enough to be compared -- flagging most of the chapter as
    "disagreement" when the truth is that one model never read anything. That is
    what happened on the Nov 3 run, where the second model produced 0 word times
    for every chapter. A model that keeps almost nothing is now skipped, loudly,
    before it costs a forward pass, and the chapter is reported as having had no
    cross-check rather than as having disagreements.

VALIDATION
    Per chapter the script reports the Pearson correlation between verse DURATION
    and verse TEXT LENGTH. A good alignment sits above ~0.9. It also checks that
    starts increase monotonically. A single CPU-aligned pass previously scored
    0.92-0.95 for chapters 2-6 but only 0.825 for chapter 1, which is the reason
    this script exists.
"""
import argparse, json, os, re, statistics, subprocess, sys, unicodedata, wave

import numpy as np
import torch
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor

SR = 16000
FRAME_STRIDE = 320                      # wav2vec2: one frame per 320 samples (50/s)

# Primary is a widely used Greek CTC model; the second is an independent Greek
# model used only to cross-check. Both have native Greek character vocabularies,
# so no romanisation step is needed.
MODELS = [
    "jonatasgrosman/wav2vec2-large-xlsr-53-greek",
    "lighteternal/wav2vec2-large-xlsr-53-greek",
]

HERE = os.path.dirname(os.path.abspath(__file__))

# Each series keeps its own text, audio and outputs; everything else is shared.
# "shape" is how that text file stores a verse, since the two were built by
# different tools: gal_aligned.json carries a parsed record per verse, while
# james_spans.json carries [part of speech, word] pairs.
BOOKS = {
    "galatians": {
        # Both series are announced ("Galatians, chapter three"), and that has
        # to be cut off before aligning or the opening words of the text land
        # on it. I assumed Galatians was unannounced and never asked; the giveaway
        # was in the data all along, with chapter 6's first "word" running 3.24s
        # against a 0.36s median because it had swallowed the announcement.
        "name": "Galatians", "chapters": 6, "shape": "aligned", "announced": True,
        # Chapter 6 needs the cut placed exactly on the pause rather than a
        # margin inside it. Confirmed by ear: the announcement ends at 2.4s and
        # the first word runs 2.57-3.77, but with the usual 0.15s margin the
        # aligner squeezed that word to 0.06s and parked it on top of the next
        # one. (An earlier override of 3.77 here was wrong -- it would have cut
        # the first word off altogether.)
        "lead_override": {"6": 2.57},
        # Galatians 6:1, first word. The aligner will not place it wherever the
        # announcement is cut -- given audio starting exactly on the word it
        # still puts it 1.35s late, squeezed to 0.06s on top of the second word.
        # Confirmed by ear that it runs 2.57-3.77 and that everything from the
        # second word on is right. Applied after alignment so a re-run keeps it.
        "time_fix": {"6": {"1": {"verse": 2.57, "words": {0: [2.57, 3.77]}}}},
        "text": os.path.join("Claude outputs", "_tc", "gal_aligned.json"),
        "hint": "Extract galatians-build-toolchain.tar.gz into 'Claude outputs/_tc' first.",
    },
    "james": {
        "name": "James", "chapters": 5, "shape": "spans", "announced": True,
        "text": os.path.join("Claude outputs", "james_spans.json"),
        "hint": "james_spans.json holds the Byzantine text as [part of speech, word] per verse.",
    },
    "titus": {
        # 3 chapters, 8m29s of audio in all -- by far the quickest book to align.
        "name": "Titus", "chapters": 3, "shape": "spans", "announced": True,
        "text": os.path.join("Claude outputs", "titus_spans.json"),
        "hint": "titus_spans.json holds the Byzantine text as [part of speech, word] per verse.",
    },
}

# Set by main() once --book is known.
BOOK = None
TEXT = AUDIO_DIR = OUT_JS = OUT_WORDS_JS = OUT_REPORT = None


def use_book(slug):
    """Point the module's paths at one series."""
    global BOOK, TEXT, AUDIO_DIR, OUT_JS, OUT_WORDS_JS, OUT_REPORT
    BOOK = dict(BOOKS[slug], slug=slug)
    d = os.path.join(HERE, "greek", slug)
    TEXT = os.path.join(HERE, BOOK["text"])
    AUDIO_DIR = os.path.join(d, "audio")
    OUT_JS = os.path.join(d, f"{slug}-verse-times.js")
    OUT_WORDS_JS = os.path.join(d, f"{slug}-word-times.js")
    OUT_REPORT = os.path.join(d, "verse-times-report.json")

DISAGREE_FLAG = 2.5                     # seconds between models before flagging a verse
WORD_DISAGREE = 0.4                     # ... and before flagging a word
SNAP_TOLERANCE = 1.2                    # only snap to a pause this close


# ---------------------------------------------------------------- text helpers
def load_text():
    """-> {"ch:v": {"ch": int, "v": int, "accented": str}} whatever the source."""
    if not os.path.exists(TEXT):
        sys.exit(f"Byzantine text not found at:\n  {TEXT}\n" + BOOK["hint"])
    raw = json.load(open(TEXT, encoding="utf-8"))
    if BOOK["shape"] == "aligned":
        return raw
    out = {}
    for key, words in raw.items():
        ch, v = key.split(":")
        # [part of speech, word] pairs, in the order the page prints them
        out[key] = {"ch": int(ch), "v": int(v),
                    "accented": " ".join(w for _, w in words)}
    return out


def verses_of(gal, ch):
    vs = [(v["v"], v["accented"]) for v in gal.values() if v["ch"] == ch]
    return [(n, t) for n, t in sorted(vs)]


def normalise(text, vocab):
    """Accented Byzantine Greek -> characters the model's vocabulary knows."""
    t = unicodedata.normalize("NFD", text.lower())
    t = "".join(c for c in t if not unicodedata.combining(c))
    t = unicodedata.normalize("NFC", t).replace("ς", "σ")   # final sigma
    t = re.sub(r"[^Ͱ-Ͽ ]+", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    return "".join(c for c in t if c in vocab or c == " ")


# --------------------------------------------------------------- audio helpers
def load_audio(path):
    """ffmpeg -> 16k mono s16 wav, read with the stdlib.

    torchaudio.load now routes through torchcodec, which is an extra dependency
    we do not need just to read a plain wav.
    """
    tmp = os.path.join(HERE, "_align_tmp.wav")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", path,
                    "-ac", "1", "-ar", str(SR), "-sample_fmt", "s16", tmp], check=True)
    with wave.open(tmp, "rb") as f:
        raw = f.readframes(f.getnframes())
    os.remove(tmp)
    a = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
    return torch.from_numpy(a.copy()).unsqueeze(0)


ANNOUNCE_MIN_SIL = 0.12   # silences shorter than this are breaths, not breaks
ANNOUNCE_AFTER = 1.0      # the announcement cannot have ended before this
ANNOUNCE_BEFORE = 4.5     # ... nor after it
ANNOUNCE_MARGIN = 0.15    # start a shade early, so the first word is not clipped


def announcement_end(path):
    """Seconds of spoken announcement to cut before aligning, 0 if none found.

    The announcement is followed by the clearest pause in the opening seconds,
    so the rule is the LONGEST silence ending inside the window -- not the first
    one, which on James 3 is a 0.16s breath inside the announcement itself and
    cuts 1.67s too early, and not the longest anywhere, which on Galatians 3
    finds a 5.4s pause well into verse 1.

    Checked against the five James verse-1 times that were in use before any
    word-level work: this lands within 0.03s on all five, and gives a consistent
    2.42-2.68s across the six Galatians chapters.
    """
    out = subprocess.run(
        ["ffmpeg", "-hide_banner", "-nostats", "-i", path,
         "-af", f"silencedetect=noise=-35dB:d={ANNOUNCE_MIN_SIL}", "-f", "null", "-"],
        capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r"silence_start: ([-\d.]+)", out)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", out)]
    best = None
    for a, b in zip(starts, ends):
        if ANNOUNCE_AFTER < b < ANNOUNCE_BEFORE and (best is None or (b - a) > best[1]):
            best = (b, b - a)
    return max(0.0, round(best[0] - ANNOUNCE_MARGIN, 2)) if best else 0.0


def pause_ends(path, noise_db=-30, min_d=0.25):
    out = subprocess.run(
        ["ffmpeg", "-hide_banner", "-nostats", "-i", path,
         "-af", f"silencedetect=noise={noise_db}dB:d={min_d}", "-f", "null", "-"],
        capture_output=True, text=True).stderr
    return [float(x) for x in re.findall(r"silence_end: ([\d.]+)", out)]


# ------------------------------------------------------------------ alignment
def logits_for(model, wave_t, device, chunk_s, overlap_s):
    """Chunked forward pass, stitched.

    A whole chapter in one pass needs roughly 6GB for a 'large' model. On an 8GB
    card (or an 8GB container) that is fatal, so run overlapping windows and trim
    the seams, where convolutional edge frames are unreliable.
    """
    n = wave_t.shape[1]
    step = int((chunk_s - overlap_s) * SR)
    fps = SR / FRAME_STRIDE
    trim = int((overlap_s / 2) * fps)
    pieces, pos = [], 0
    while pos < n:
        seg = wave_t[:, pos:pos + int(chunk_s * SR)].to(device)
        if seg.shape[1] < int(0.5 * SR):
            break
        with torch.inference_mode():
            lg = model(seg).logits
        lp = torch.log_softmax(lg.float(), dim=-1).cpu()
        a = 0 if pos == 0 else trim
        b = lp.shape[1] if pos + int(chunk_s * SR) >= n else lp.shape[1] - trim
        pieces.append(lp[:, a:b, :].clone())
        del lg, lp, seg
        if device == "cuda":
            torch.cuda.empty_cache()
        pos += step
    return torch.cat(pieces, dim=1)


def align_one(model_name, ch, gal, device, chunk_s, overlap_s):
    """-> (starts list, duration) for one chapter with one model."""
    from torchaudio.functional import forced_align, merge_tokens

    proc = Wav2Vec2Processor.from_pretrained(model_name)
    model = Wav2Vec2ForCTC.from_pretrained(model_name).eval().to(device)
    vocab = proc.tokenizer.get_vocab()
    blank = proc.tokenizer.pad_token_id
    delim = vocab.get("|")

    verses = verses_of(gal, ch)

    # Does this model's vocabulary actually contain the letters of the text?
    # Checked before the audio is loaded or a forward pass is spent: a model
    # that keeps nothing produces confident-looking garbage (see WHY A SECOND
    # PASS above), which is worse than no second model at all.
    kept = "".join(normalise(t, vocab) for _, t in verses).replace(" ", "")
    want = sum(len(re.findall(r"[\u0370-\u03ff\u1f00-\u1fff]", t)) for _, t in verses)
    if want and len(kept) < 0.5 * want:
        print(f"    vocabulary keeps {len(kept)}/{want} of the Greek characters"
              f" - skipping this model", flush=True)
        return None

    path = os.path.join(AUDIO_DIR, f"{BOOK['slug']}-{ch}.mp3")
    wave_t = load_audio(path)
    dur = wave_t.shape[1] / SR

    # Cut the announcement before aligning, and put the offset back on every
    # time afterwards so everything downstream still speaks in file seconds.
    lead = 0.0
    if BOOK.get("announced"):
        over = (BOOK.get("lead_override") or {}).get(str(ch))
        lead = float(over) if over is not None else announcement_end(path)
        if over is not None:
            print(f"    announcement: using the recorded override for this chapter")
    if BOOK.get("announced") and lead <= 0:
        print("    WARNING: no announcement found - alignment will be wrong if "
              "this chapter has one", flush=True)
    if lead > 0:
        print(f"    announcement: aligning from {lead}s", flush=True)
        wave_t = wave_t[:, int(lead * SR):]
        dur = wave_t.shape[1] / SR

    tokens, verse_tok_start, word_tok_span = [], [], []
    for _, text in verses:
        verse_tok_start.append(len(tokens))
        spans_here = []               # [first char index, last char index] per word
        at_word_start = True          # first character of the verse opens a word
        for c in normalise(text, vocab):
            tid = vocab.get("|" if c == " " else c)
            if tid is None:
                continue
            if c == " ":
                at_word_start = True  # the next real character opens the next word
            else:
                if at_word_start:
                    spans_here.append([len(tokens), len(tokens)])
                else:
                    spans_here[-1][1] = len(tokens)
                at_word_start = False
            tokens.append(tid)
        word_tok_span.append(spans_here)
        if delim is not None:
            tokens.append(delim)

    log_probs = logits_for(model, wave_t, device, chunk_s, overlap_s)
    targets = torch.tensor([tokens], dtype=torch.int32)
    path_idx, scores = forced_align(log_probs, targets, blank=blank)
    spans = merge_tokens(path_idx[0], scores[0], blank=blank)

    sec_per_frame = dur / log_probs.shape[1]
    starts = [round(spans[i].start * sec_per_frame, 2) if i < len(spans) else None
              for i in verse_tok_start]

    # merge_tokens returns one span per target token, in target order, which is
    # why a verse start can be read at its own token index. A word's start is
    # that list at the index of its first character; its END is the end of its
    # last character's span.
    #
    # The end matters as much as the start. Taking a word to run until the next
    # word begins means playing it with the next word's first sound attached,
    # because in connected speech there is no gap to stop in -- and any error in
    # the next word's start leaks straight into this clip. The character's own
    # end is a real boundary with the transition left outside it.
    word_starts, word_ends, word_scores = [], [], []
    for idxs in word_tok_span:
        word_starts.append([round(spans[a].start * sec_per_frame, 2)
                            if a < len(spans) else None for a, b in idxs])
        word_ends.append([round(spans[b].end * sec_per_frame, 2)
                          if b < len(spans) else None for a, b in idxs])
        word_scores.append([round(float(spans[a].score), 3)
                            if a < len(spans) else None for a, b in idxs])

    if lead:
        shift = lambda x: None if x is None else round(x + lead, 2)
        starts = [shift(x) for x in starts]
        word_starts = [[shift(x) for x in row] for row in word_starts]
        word_ends = [[shift(x) for x in row] for row in word_ends]
        dur += lead

    del model, log_probs
    if device == "cuda":
        torch.cuda.empty_cache()
    return (starts, dur, [n for n, _ in verses],
            [len(normalise(t, vocab)) for _, t in verses],
            word_starts, word_ends, word_scores)


# ----------------------------------------------------------------- refinement
def snap(starts, pauses, tol=SNAP_TOLERANCE):
    """Move each start to the nearest pause within tol, keeping order."""
    out, prev = [], -1.0
    for s in starts:
        best = min(pauses, key=lambda p: abs(p - s)) if pauses else s
        use = best if abs(best - s) <= tol and best > prev else s
        if use <= prev:
            use = s
        out.append(round(use, 2))
        prev = out[-1]
    return out


def pearson(a, b):
    ma, mb = statistics.mean(a), statistics.mean(b)
    num = sum((x - ma) * (y - mb) for x, y in zip(a, b))
    da = sum((x - ma) ** 2 for x in a) ** 0.5
    db = sum((y - mb) ** 2 for y in b) ** 0.5
    return num / (da * db) if da and db else 0.0


def quality(starts, dur, lens):
    ends = starts[1:] + [dur]
    durs = [max(e - s, 0.01) for s, e in zip(starts, ends)]
    r = pearson(durs, lens)
    rate = [d / L for d, L in zip(durs, lens) if L]
    cv = statistics.pstdev(rate) / statistics.mean(rate) if rate else 9.9
    mono = all(b > a for a, b in zip(starts, starts[1:]))
    return r, cv, mono


# ----------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--book", default="galatians", choices=sorted(BOOKS),
                    help="which exegesis series to align")
    ap.add_argument("--device", default="cpu", help="cpu or cuda")
    ap.add_argument("-c", "--chapters", type=int, nargs="*", help="chapters to (re)do")
    ap.add_argument("--chunk", type=float, default=None, help="window seconds")
    ap.add_argument("--overlap", type=float, default=4.0)
    ap.add_argument("--single", action="store_true", help="primary model only")
    ap.add_argument("--no-snap", action="store_true", help="skip pause snapping")
    args = ap.parse_args()

    use_book(args.book)
    print(f"book={BOOK['name']} ({BOOK['chapters']} chapters)")

    device = args.device
    if device == "cuda" and not torch.cuda.is_available():
        print("cuda requested but not available - falling back to cpu")
        device = "cpu"
    # a GPU can take much longer windows, which means fewer seams
    chunk_s = args.chunk if args.chunk else (120.0 if device == "cuda" else 40.0)
    print(f"device={device}  chunk={chunk_s}s  overlap={args.overlap}s")
    if device == "cuda":
        print(f"gpu: {torch.cuda.get_device_name(0)}")

    gal = load_text()
    report = json.load(open(OUT_REPORT)) if os.path.exists(OUT_REPORT) else {}
    todo = args.chapters if args.chapters else [
        c for c in range(1, BOOK["chapters"] + 1) if str(c) not in report]
    if not todo:
        print("nothing to do (use -c N to redo a chapter)")
    models = MODELS[:1] if args.single else MODELS

    for ch in todo:
        print(f"\n=== chapter {ch} ===", flush=True)
        path = os.path.join(AUDIO_DIR, f"{BOOK['slug']}-{ch}.mp3")
        runs = []
        for mi, mname in enumerate(models):
            print(f"  [{mi+1}/{len(models)}] {mname}", flush=True)
            lead_used = 0.0
            if BOOK.get("announced"):
                _o = (BOOK.get("lead_override") or {}).get(str(ch))
                lead_used = (float(_o) if _o is not None else
                             announcement_end(os.path.join(AUDIO_DIR, f"{BOOK['slug']}-{ch}.mp3")))
            res = align_one(mname, ch, gal, device, chunk_s, args.overlap)
            if res is None:
                continue
            starts, dur, nums, lens, wstarts, wends, wscores = res
            if any(s is None for s in starts):
                print("    incomplete alignment - skipping this model"); continue
            r, cv, mono = quality(starts, dur, lens)
            print(f"      r={r:.3f} cv={cv:.3f} mono={mono}")
            runs.append({"model": mname, "starts": starts, "r": r, "cv": cv,
                         "mono": mono, "dur": dur, "nums": nums, "lens": lens,
                         "wstarts": wstarts, "wends": wends, "wscores": wscores,
                         "lead": lead_used})

        if not runs:
            print("  no usable alignment"); continue

        # keep each run's own text lengths: the two vocabularies normalise to
        # slightly different strings, so the quality metric must use its own.
        best = max(runs, key=lambda x: x["r"] - x["cv"])
        starts = best["starts"]
        wave_len, nums, lens = best["dur"], best["nums"], best["lens"]
        wstarts, wends, wscores = best["wstarts"], best["wends"], best["wscores"]

        # cross-check
        flags = []
        word_agree = None
        if len(runs) == 1:
            print("  only one model read the text - no cross-check for this chapter")
        if len(runs) > 1:
            other = [x for x in runs if x is not best][0]
            diffs = [abs(a - b) for a, b in zip(best["starts"], other["starts"])]
            flags = [nums[i] for i, d in enumerate(diffs) if d > DISAGREE_FLAG]
            print(f"  models agree within {DISAGREE_FLAG}s on "
                  f"{len(diffs)-len(flags)}/{len(diffs)} verses"
                  + (f"; flagged {flags}" if flags else ""))

            # The same comparison at word level, which is the number that
            # decides whether clicking a word can be trusted. Only words both
            # models actually placed are counted.
            wtot = wagree = 0
            for va, vb in zip(best["wstarts"], other["wstarts"]):
                for a, b in zip(va, vb):
                    if a is None or b is None:
                        continue
                    wtot += 1
                    wagree += abs(a - b) <= WORD_DISAGREE
            if wtot:
                word_agree = round(wagree / wtot, 3)
                print(f"  models agree within {WORD_DISAGREE}s on "
                      f"{wagree}/{wtot} words ({word_agree:.1%})")
            else:
                # Silence here once meant a missing number with no explanation.
                # Say which side came back empty instead.
                print(f"  no word comparison: best has "
                      f"{sum(len(x) for x in best['wstarts'])} word times, "
                      f"other has {sum(len(x) for x in other['wstarts'])}")

        if not args.no_snap:
            pe = pause_ends(path)
            snapped = snap(starts, pe)
            r2, cv2, mono2 = quality(snapped, wave_len, lens)
            moved = sum(1 for a, b in zip(starts, snapped) if a != b)
            print(f"  snap: moved {moved} verses -> r={r2:.3f} (was {best['r']:.3f})")
            # keep the snap only if it does not make the chapter worse
            if mono2 and r2 >= best["r"] - 0.01:
                starts = snapped
            else:
                print("  snap rejected (would worsen the fit)")

        r, cv, mono = quality(starts, wave_len, lens)
        verdict = "OK" if (r > 0.9 and mono and not flags) else "REVIEW"
        print(f"  final: r={r:.3f} cv={cv:.3f} mono={mono}  {verdict}")

        # Snapping moved the verse starts to the reader's pauses; the words
        # were not snapped, so pin each verse's first word to its verse start
        # and keep the rest non-decreasing behind it.
        words = {}
        for n, vstart, ws, we in zip(nums, starts, wstarts, wends):
            row, prev = [], None
            for j, t in enumerate(ws):
                t = vstart if j == 0 else t
                if t is None:
                    t = prev if prev is not None else vstart
                if prev is not None and t <= prev:
                    t = round(prev + 0.01, 2)
                e = we[j] if j < len(we) else None
                # An end before its own start, or missing, is no use; fall back
                # to the start and let the page treat the word as unbounded.
                if e is None or e <= t:
                    e = None
                row.append([round(t, 2), None if e is None else round(e, 2)])
                prev = row[-1][0]
            words[str(n)] = row

        # Hand-checked corrections for the few places the aligner cannot get
        # right. Applied here rather than edited into the output files, so that
        # re-running the chapter does not quietly throw them away.
        for v, rec in (BOOK.get("time_fix") or {}).get(str(ch), {}).items():
            if "verse" in rec:
                for i, n in enumerate(nums):
                    if str(n) == v:
                        starts[i] = rec["verse"]
            for idx, span in (rec.get("words") or {}).items():
                if v in words and int(idx) < len(words[v]):
                    words[v][int(idx)] = [span[0], span[1]]
            print(f"  applied the recorded correction for {BOOK['name']} {ch}:{v}")

        wflat = [x for row in wscores for x in row if x is not None]
        wgaps = [round(b[0] - a[1], 3) for row in words.values()
                 for a, b in zip(row, row[1:]) if a[1] is not None]
        report[str(ch)] = {
            "model": best["model"], "r": round(r, 3), "cv": round(cv, 3),
            "monotonic": mono, "duration": round(wave_len, 2),
            "lead": round(best.get("lead", 0.0), 2),
            "flagged_verses": flags, "verdict": verdict,
            "times": {str(n): s for n, s in zip(nums, starts)},
            "words": words,
            "word_count": sum(len(v) for v in words.values()),
            "word_agreement": word_agree,
            "word_score_mean": round(sum(wflat) / len(wflat), 3) if wflat else None,
            # How much silence the alignment leaves between one word's end and
            # the next word's start. A median near zero means the reader runs
            # words together and the clips will be tight whatever we do.
            "word_gap_median": (sorted(wgaps)[len(wgaps) // 2] if wgaps else None),
            "word_scores": {str(n): r_ for n, r_ in zip(nums, wscores)},
        }
        json.dump(report, open(OUT_REPORT, "w"), indent=1)   # save after each chapter

    # ---- emit the JS the pages load
    # A report written before announcements were handled holds times that are
    # seconds out, and re-emitting from it silently overwrites good files with
    # bad ones -- which is exactly what happened on Nov 3, when a run that said
    # "nothing to do" still rewrote both timing files from stale records.
    if report and BOOK.get("announced"):
        stale = [c for c in sorted(report, key=int) if "lead" not in report[c]]
        if stale:
            print("\n" + "=" * 68)
            print(f"  NOT WRITING ANY FILES. {BOOK['name']} chapter(s) "
                  f"{', '.join(stale)} were aligned before the announcement was")
            print("  allowed for, so their times are seconds early. Redo them:")
            print(f"      py {os.path.basename(__file__)} --book {BOOK['slug']} "
                  f"--device cuda -c {' '.join(stale)}")
            print("=" * 68)
            return

    if report:
        NAME, GLOBAL = BOOK["name"], BOOK["slug"].upper()
        lines = [f"/* Verse start times (seconds) in each {NAME} chapter recording "
                 "(Marilyn Phemister).",
                 "   Generated by CTC forced alignment against the Byzantine text;",
                 "   adjust a single number if a verse starts early or late. */",
                 f"window.{GLOBAL}_VERSE_TIMES = {{"]
        chs = sorted(report, key=int)
        for i, ch in enumerate(chs):
            t = report[ch]["times"]
            inner = ", ".join(f'"{v}": {t[v]}' for v in sorted(t, key=int))
            lines.append(f'  "{ch}": {{{inner}}}' + ("," if i < len(chs) - 1 else ""))
        lines.append("};")
        open(OUT_JS, "w", encoding="utf-8").write("\n".join(lines) + "\n")

        # Word times: chapter -> verse -> [start of each word, in order]. The
        # pages map the Nth Greek word span of a verse to the Nth entry, so the
        # order here must stay the order of the printed text. Chapters aligned
        # before word times existed have no "words" key and are simply absent,
        # which the pages treat as "no word jumping for this chapter".
        wlines = [f"/* Word times (seconds) per verse in each {NAME} chapter recording",
                  "   (Marilyn Phemister). Generated by the same CTC forced alignment as",
                  "   the verse times: chapter -> verse -> [start, end] per word, in the",
                  "   order the words are printed on the page.",
                  "",
                  "   The end is the end of the word's own last character, not the start",
                  "   of the next word: in connected speech there is no gap between them,",
                  "   so a clip that runs to the next start carries that word's first",
                  "   sound with it. A null end means the aligner could not place one.",
                  "",
                  "   The reading follows Westcott-Hort and the printed text is Byzantine,",
                  "   so where the two differ these times drift until the next verse. See",
                  "   verse-times-report.json for per-chapter scores and the median gap",
                  "   between words. */",
                  f"window.{GLOBAL}_WORD_TIMES = {{"]
        wchs = [c for c in chs if report[c].get("words")]
        for i, ch in enumerate(wchs):
            w = report[ch]["words"]
            wlines.append(f'  "{ch}": {{')
            vs = sorted(w, key=int)
            for j, v in enumerate(vs):
                row = ", ".join("[%s, %s]" % (a, "null" if b is None else b)
                                for a, b in w[v])
                wlines.append(f'    "{v}": [{row}]' + ("," if j < len(vs) - 1 else ""))
            wlines.append("  }" + ("," if i < len(wchs) - 1 else ""))
        wlines.append("};")
        open(OUT_WORDS_JS, "w", encoding="utf-8").write("\n".join(wlines) + "\n")

        print(f"\nwrote {OUT_JS}")
        print(f"wrote {OUT_WORDS_JS}"
              + (f" ({len(wchs)} chapter(s) with word times)" if wchs
                 else " (no chapter has word times yet - re-run a chapter with -c N)"))
        print(f"wrote {OUT_REPORT}")
        print("\n=== summary ===")
        for ch in chs:
            d = report[ch]
            wa = d.get("word_agreement")
            gap = d.get("word_gap_median")
            print(f"  ch{ch}: r={d['r']:.3f} cv={d['cv']:.3f} {d['verdict']}"
                  + (f"  gap {gap}s" if gap is not None else "")
                  + (f"  words agree {wa:.1%}" if wa is not None else "")
                  + (f"  score {d['word_score_mean']}" if d.get("word_score_mean") else "")
                  + (f"  flagged: {d['flagged_verses']}" if d["flagged_verses"] else ""))


if __name__ == "__main__":
    main()
