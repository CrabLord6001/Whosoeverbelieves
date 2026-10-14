#!/usr/bin/env python3
"""
Galatians verse timings — Byzantine Greek text -> per-verse start times
=======================================================================
Forced-aligns each chapter of the Marilyn Phemister Greek recording against the
Robinson-Pierpont Byzantine text, and writes the verse start times the Galatians
exegesis pages use for their per-verse Listen buttons.

Same idea as align_bible_audio.py, with three differences: the text is Greek, two
independent models are run and compared (a verse where they disagree is flagged
for review), and verse starts are optionally snapped to the reader's own pauses.

Output:

    greek/galatians/galatians-verse-times.js   window.GALATIANS_VERSE_TIMES
    greek/galatians/verse-times-report.json    per-verse scores and flags

SETUP (one time):
    python -m pip install torch torchaudio transformers
    # ffmpeg must be on PATH
    # For GPU, install the CUDA build of torch from pytorch.org rather than the
    # default CPU wheel, or --device cuda will fall back to CPU.

RUN (from the repo root):
    python align_galatians_audio.py --device cuda          # all six chapters
    python align_galatians_audio.py --device cuda -c 1     # just chapter 1
    python align_galatians_audio.py --device cuda --no-snap
    python align_galatians_audio.py --device cuda --single # skip the 2nd model

Resumable: a chapter already in the report is skipped unless you name it with -c.

WHY A SECOND PASS
    One model can wander through a passage and still look plausible. Two models
    that independently agree within a second are almost certainly right; where
    they disagree, the verse is flagged so you can check those few by ear instead
    of auditing all 149.

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
TEXT = os.path.join(HERE, "Claude outputs", "_tc", "gal_aligned.json")
AUDIO_DIR = os.path.join(HERE, "greek", "galatians", "audio")
OUT_JS = os.path.join(HERE, "greek", "galatians", "galatians-verse-times.js")
OUT_REPORT = os.path.join(HERE, "greek", "galatians", "verse-times-report.json")

DISAGREE_FLAG = 2.5                     # seconds between models before flagging
SNAP_TOLERANCE = 1.2                    # only snap to a pause this close


# ---------------------------------------------------------------- text helpers
def load_text():
    if not os.path.exists(TEXT):
        sys.exit(f"Byzantine text not found at:\n  {TEXT}\n"
                 "Extract galatians-build-toolchain.tar.gz into 'Claude outputs/_tc' first.")
    return json.load(open(TEXT, encoding="utf-8"))


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

    path = os.path.join(AUDIO_DIR, f"galatians-{ch}.mp3")
    wave_t = load_audio(path)
    dur = wave_t.shape[1] / SR

    verses = verses_of(gal, ch)
    tokens, verse_tok_start = [], []
    for _, text in verses:
        verse_tok_start.append(len(tokens))
        for c in normalise(text, vocab):
            tid = vocab.get("|" if c == " " else c)
            if tid is not None:
                tokens.append(tid)
        if delim is not None:
            tokens.append(delim)

    log_probs = logits_for(model, wave_t, device, chunk_s, overlap_s)
    targets = torch.tensor([tokens], dtype=torch.int32)
    path_idx, scores = forced_align(log_probs, targets, blank=blank)
    spans = merge_tokens(path_idx[0], scores[0], blank=blank)

    sec_per_frame = dur / log_probs.shape[1]
    starts = [round(spans[i].start * sec_per_frame, 2) if i < len(spans) else None
              for i in verse_tok_start]

    del model, log_probs
    if device == "cuda":
        torch.cuda.empty_cache()
    return starts, dur, [n for n, _ in verses], [len(normalise(t, vocab)) for _, t in verses]


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
    ap.add_argument("--device", default="cpu", help="cpu or cuda")
    ap.add_argument("-c", "--chapters", type=int, nargs="*", help="chapters to (re)do")
    ap.add_argument("--chunk", type=float, default=None, help="window seconds")
    ap.add_argument("--overlap", type=float, default=4.0)
    ap.add_argument("--single", action="store_true", help="primary model only")
    ap.add_argument("--no-snap", action="store_true", help="skip pause snapping")
    args = ap.parse_args()

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
    todo = args.chapters if args.chapters else [c for c in range(1, 7) if str(c) not in report]
    if not todo:
        print("nothing to do (use -c N to redo a chapter)")
    models = MODELS[:1] if args.single else MODELS

    for ch in todo:
        print(f"\n=== chapter {ch} ===", flush=True)
        path = os.path.join(AUDIO_DIR, f"galatians-{ch}.mp3")
        runs = []
        for mi, mname in enumerate(models):
            print(f"  [{mi+1}/{len(models)}] {mname}", flush=True)
            starts, dur, nums, lens = align_one(mname, ch, gal, device, chunk_s, args.overlap)
            if any(s is None for s in starts):
                print("    incomplete alignment - skipping this model"); continue
            r, cv, mono = quality(starts, dur, lens)
            print(f"      r={r:.3f} cv={cv:.3f} mono={mono}")
            runs.append({"model": mname, "starts": starts, "r": r, "cv": cv,
                         "mono": mono, "dur": dur, "nums": nums, "lens": lens})

        if not runs:
            print("  no usable alignment"); continue

        # keep each run's own text lengths: the two vocabularies normalise to
        # slightly different strings, so the quality metric must use its own.
        best = max(runs, key=lambda x: x["r"] - x["cv"])
        starts = best["starts"]
        wave_len, nums, lens = best["dur"], best["nums"], best["lens"]

        # cross-check
        flags = []
        if len(runs) > 1:
            other = [x for x in runs if x is not best][0]
            diffs = [abs(a - b) for a, b in zip(best["starts"], other["starts"])]
            flags = [nums[i] for i, d in enumerate(diffs) if d > DISAGREE_FLAG]
            print(f"  models agree within {DISAGREE_FLAG}s on "
                  f"{len(diffs)-len(flags)}/{len(diffs)} verses"
                  + (f"; flagged {flags}" if flags else ""))

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

        report[str(ch)] = {
            "model": best["model"], "r": round(r, 3), "cv": round(cv, 3),
            "monotonic": mono, "duration": round(wave_len, 2),
            "flagged_verses": flags, "verdict": verdict,
            "times": {str(n): s for n, s in zip(nums, starts)},
        }
        json.dump(report, open(OUT_REPORT, "w"), indent=1)   # save after each chapter

    # ---- emit the JS the pages load
    if report:
        lines = ["/* Verse start times (seconds) in each Galatians chapter recording "
                 "(Marilyn Phemister).",
                 "   Generated by CTC forced alignment against the Byzantine text;",
                 "   adjust a single number if a verse starts early or late. */",
                 "window.GALATIANS_VERSE_TIMES = {"]
        chs = sorted(report, key=int)
        for i, ch in enumerate(chs):
            t = report[ch]["times"]
            inner = ", ".join(f'"{v}": {t[v]}' for v in sorted(t, key=int))
            lines.append(f'  "{ch}": {{{inner}}}' + ("," if i < len(chs) - 1 else ""))
        lines.append("};")
        open(OUT_JS, "w", encoding="utf-8").write("\n".join(lines) + "\n")
        print(f"\nwrote {OUT_JS}")
        print(f"wrote {OUT_REPORT}")
        print("\n=== summary ===")
        for ch in chs:
            d = report[ch]
            print(f"  ch{ch}: r={d['r']:.3f} cv={d['cv']:.3f} {d['verdict']}"
                  + (f"  flagged: {d['flagged_verses']}" if d["flagged_verses"] else ""))


if __name__ == "__main__":
    main()
