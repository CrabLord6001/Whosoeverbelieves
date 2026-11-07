#!/usr/bin/env python3
"""Underline the quizzed Greek word's English counterpart in greek/parsing-pool.json.

Each pool entry may carry "wi": [first, last] -- the word-index span in the WEB verse
(greek/parsing-verses.json) that renders the Greek form. The parsing game underlines it.

    python3 claude/align-underlines.py            # report only, nothing written
    python3 claude/align-underlines.py --apply    # write wi back into the pool

Matching is stem-based, not tense-based: the WEB often renders a Greek present as an
English past (historic present in Revelation and Mark), so tense is deliberately ignored.
"""
import json, os, re, sys, unicodedata

APPLY = '--apply' in sys.argv
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Never underline these: they carry no lexical content and stole matches in earlier runs.
STOP = set('''a an the this that these those i you he she it we they me him her us them my your his
its our their thee thou thy ye to of in on at by for with from as and or but not no nor so then than
be am is are was were been being have has had do does did doing done shall should will would can could
may might must let there here who whom whose which what when where why how all any some such own same
very just only also even own one two three up out down off over under again more most other another
into unto upon about against among between before after while because if though although yes amen o oh
lo behold now thus therefore'''.split())
# Modals never win: "will you do" must underline "do", not "will".
MODAL = {'will','shall','would','should','may','might','must','can','could','let'}
# Contractions whose stripped stem would collide with a real word.
NO_EXPAND = {'do','does','did'}

IRREG = {}
for base, forms in {
 'say':'said says saying','go':'went gone goes going','come':'came comes coming','see':'saw seen sees seeing',
 'know':'knew known knows knowing','give':'gave given gives giving','take':'took taken takes taking',
 'make':'made makes making','do':'did done does doing','have':'had has having','be':'was were been is are am being',
 'speak':'spoke spoken speaks speaking','write':'wrote written writes writing','bear':'bore borne born bears bearing',
 'send':'sent sends sending','bring':'brought brings bringing','think':'thought thinks thinking',
 'teach':'taught teaches teaching','seek':'sought seeks seeking','buy':'bought buys buying',
 'catch':'caught catches catching','fight':'fought fights fighting','tell':'told tells telling',
 'sell':'sold sells selling','hold':'held holds holding','stand':'stood stands standing',
 'understand':'understood understands understanding','find':'found finds finding','bind':'bound binds binding',
 'lead':'led leads leading','feed':'fed feeds feeding','flee':'fled flees fleeing','hear':'heard hears hearing',
 'keep':'kept keeps keeping','sleep':'slept sleeps sleeping','weep':'wept weeps weeping',
 'leave':'left leaves leaving','lose':'lost loses losing','build':'built builds building',
 'sit':'sat sits sitting','eat':'ate eaten eats eating','drink':'drank drunk drinks drinking',
 'fall':'fell fallen falls falling','rise':'rose risen rises rising','run':'ran runs running',
 'begin':'began begun begins beginning','become':'became becomes becoming','grow':'grew grown grows growing',
 'throw':'threw thrown throws throwing','draw':'drew drawn draws drawing','cast':'casts casting',
 'put':'puts putting','set':'sets setting','cut':'cuts cutting','read':'reads reading',
 'forgive':'forgave forgiven forgives forgiving','forget':'forgot forgotten forgets forgetting',
 'arise':'arose arisen arises arising','abide':'abode abides abiding','bid':'bade bidden bids bidding',
}.items():
    IRREG[base] = base
    for f in forms.split(): IRREG[f] = base

def norm(w):
    """Lowercase, strip accents/punctuation/curly quotes, expand contractions."""
    w = unicodedata.normalize('NFKD', w)
    w = ''.join(c for c in w if not unicodedata.combining(c))
    w = w.replace('’', "'").replace('‘', "'")
    w = re.sub(r"[^a-zA-Z']", '', w).lower().strip("'")
    if "'" in w:
        head, _, tail = w.partition("'")
        if tail in ('t','s','re','ve','ll','d','m') and head not in NO_EXPAND:
            w = {'ca':'can','wo':'will','sha':'shall'}.get(head, head)
        else:
            w = head or w
    return w

def variants(w):
    """Every lemma form w might reduce to. A set, because English spelling is ambiguous:
    'baptized' -> {'baptiz','baptize'}, 'cried' -> {'cry','cri'}, 'running' -> {'run','runn'}.
    Matching succeeds on any overlap, which is what lets a gloss meet an inflected verse word."""
    out = {w}
    if w in IRREG:
        out.add(IRREG[w]); return out
    for suf, repl in (('ied','y'), ('ies','y'), ('iest','y'), ('ier','y')):
        if w.endswith(suf) and len(w) > len(suf) + 1:
            out.add(w[:-len(suf)] + repl); return out
    for suf in ('edly','ingly','ing','ed','es','s'):
        if w.endswith(suf) and len(w) > len(suf) + 2:
            base = w[:-len(suf)]
            out.add(base)
            out.add(base + 'e')            # baptiz -> baptize, rejoic -> rejoice
            if len(base) > 2 and base[-1] == base[-2] and base[-1] not in 'lsz':
                out.add(base[:-1])         # stopped -> stop, running -> run
            for b in list(out):
                if b in IRREG: out.add(IRREG[b])
            return out
    return out

def stem(w):
    """Back-compat single key: the shortest plausible lemma."""
    return sorted(variants(w), key=len)[0]

def keys_from_gloss(gl):
    """Content-word stems from a lexicon gloss like 'I cry out, call out'."""
    out = []
    for w in re.split(r'[\s,;/()]+', gl or ''):
        n = norm(w)
        if n and n not in STOP and len(n) > 1:
            out.extend(variants(n))
    return out

# Hand-set spans for forms the gloss cannot reach, or where the verse contains another
# inflection of the same lemma and first-hit picks the wrong one.
# Key: (Greek form, reference) -> [first, last] word index in the WEB verse, plus why.
MANUAL = {
 ('\u03b6\u1ff6\u03c3\u03b9\u03bd', 'Luke 20:38'): ([16, 16],
    "WEB renders the finite verb as 'alive'; 'living,' earlier in the verse is the "
    "participle \u03b6\u03ce\u03bd\u03c4\u03c9\u03bd, a different word"),
}

def align(entry, verse):
    man = MANUAL.get((entry.get('f'), entry.get('ref')))
    if man:
        span = man[0]
        return span if span[1] < len(verse.split()) else None
    want = set(keys_from_gloss(entry.get('gl', '')))
    if not want: return None
    words = verse.split()
    hits = []
    for i, w in enumerate(words):
        n = norm(w)
        if not n or n in STOP or n in MODAL: continue
        if variants(n) & want: hits.append(i)
    if not hits: return None
    # contiguous run around the first hit (so "cry out" underlines both words)
    first = last = hits[0]
    for i in hits[1:]:
        if i == last + 1: last = i
        else: break
    return [first, last]

pool = json.load(open(os.path.join(ROOT, 'greek/parsing-pool.json'), encoding='utf-8'))
verses = json.load(open(os.path.join(ROOT, 'greek/parsing-verses.json'), encoding='utf-8'))

had = sum(1 for e in pool if e.get('wi'))
new, changed, still = [], [], []
for e in pool:
    v = verses.get(e.get('ref', ''))
    if not v: continue
    got = align(e, v)
    if not got:
        if not e.get('wi'): still.append(e)
        continue
    words = v.split()
    marked = ' '.join(words[got[0]:got[1] + 1])
    if not e.get('wi'):
        new.append((e, marked, got))
    elif e['wi'] != got:
        changed.append((e, marked, got, e['wi'], ' '.join(words[e['wi'][0]:e['wi'][1] + 1])))

print('pool %d entries | %d already had wi | %d still unmatched after this pass'
      % (len(pool), had, len(still)))
print('NEW matches this pass: %d' % len(new))
print('WOULD CHANGE an existing wi: %d  <-- review these, they are the risky ones' % len(changed))
print()
print('--- sample of NEW matches (verify the underlined word is right) ---')
for e, marked, _ in new[:25]:
    print('  %-14s %-26s %r' % (e['f'], e['ref'], marked))
if changed:
    print()
    print('--- EXISTING wi that would change ---')
    for e, marked, _, oldwi, oldmark in changed[:25]:
        print('  %-14s %-26s %r -> %r' % (e['f'], e['ref'], oldmark, marked))

if APPLY:
    n = 0
    for e, _, got in new:
        e['wi'] = got; n += 1
    with open(os.path.join(ROOT, 'greek/parsing-pool.json'), 'w', encoding='utf-8', newline='') as f:
        json.dump(pool, f, ensure_ascii=False, separators=(',', ':'))
    print('\nAPPLIED: %d new wi written. Existing wi left untouched.' % n)
else:
    print('\n(report only -- re-run with --apply to write)')
