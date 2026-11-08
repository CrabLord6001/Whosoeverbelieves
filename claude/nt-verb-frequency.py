#!/usr/bin/env python3
"""Top verb lemmas in the Greek New Testament, counted from the tagged text.

Source: STEPBible TAGNT (Translators Amalgamated Greek NT), CC BY 4.0 — the same
dataset the parsing pool's word-level glosses came from. Counts NA28 words only,
so textual variants in TR/Byz are not double counted.

TAGNT files a verb under its own headword, which splits three verbs a learner
treats as one: λέγω from its suppletive εἶπον/ἐρῶ, ἐσθίω from its aorist φαγεῖν,
and οἶδα from εἶδον — the last two share Strong's G1492 and are separated here by
tense code (perfect stem → οἶδα, second aorist → ὁράω). Without that merge λέγω
ranks second rather than first and ἐσθίω falls out of the top 100 altogether.

Usage:  python3 nt-verb-frequency.py <dir with the two TAGNT .txt files>
"""
import collections, glob, io, json, os, sys, unicodedata

MERGE_RAW = {
    'ἔπω, ἐρῶ, εἶπον': 'λέγω',
    'φαγεῖν': 'ἐσθίω',
    # middle/deponent headwords spelled active in TAGNT
    'ἀποκρίνω': 'ἀποκρίνομαι', 'πορεύω': 'πορεύομαι', 'φοβέω': 'φοβέομαι',
    'ἄρχω': 'ἄρχομαι', 'ἀπολλύω': 'ἀπόλλυμι', 'ἀποθνήσκω': 'ἀποθνῄσκω',
    'εὐαγγελίζομαι': 'εὐαγγελίζω', 'χράομαι': 'χράομαι',
}
# G1492 carries two verbs; the tense code tells them apart.
MERGE = None  # built at import after nfc() is defined

OIDA_TENSES = {'RAI','RAP','RAN','RAS','RAM','2LAI','LAI','PAI','FAI'}

def nfc(s):
    # TAGNT writes accents as combining marks in places, so a literal written
    # here will not match the file's bytes unless both are normalized first.
    # Without this, λέγω and its suppletive stem stay two separate counts.
    return unicodedata.normalize('NFC', s)


def tense(code):
    p = code.split('-')
    return p[1] if len(p) > 1 else code

def main(root):
    global MERGE
    MERGE = {nfc(k): nfc(v) for k, v in MERGE_RAW.items()}
    files = sorted(glob.glob(os.path.join(root, 'TAGNT *.txt')))
    if not files:
        sys.exit('no TAGNT files in ' + root)
    cnt = collections.Counter()
    for fn in files:
        for line in io.open(fn, encoding='utf-8-sig'):
            if not line or line[0] == '#':
                continue
            p = line.rstrip('\n').split('\t')
            if len(p) < 6 or '.' not in p[0] or '#' not in p[0]:
                continue
            if 'NA28' not in p[5]:
                continue
            if '=V-' not in p[3]:
                continue
            lem = nfc(p[4].split('=')[0].strip())
            if not lem:
                continue
            if lem == 'εἴδω':
                lem = nfc('οἶδα') if tense(p[3].split('=')[1]) in OIDA_TENSES else nfc('ὁράω')
            lem = MERGE.get(lem, lem)
            cnt[lem] += 1
    return cnt

if __name__ == '__main__':
    cnt = main(sys.argv[1] if len(sys.argv) > 1 else '.')
    rows = [{'rank': i, 'lex': k, 'n': v} for i, (k, v) in enumerate(cnt.most_common(), 1)]
    io.open('nt-verb-frequency.json', 'w', encoding='utf-8').write(
        json.dumps(rows[:300], ensure_ascii=False, indent=1))
    print('verb tokens %d, distinct lemmas %d' % (sum(cnt.values()), len(cnt)))
    for r in rows[:100]:
        print('%3d %-16s %d' % (r['rank'], r['lex'], r['n']))
