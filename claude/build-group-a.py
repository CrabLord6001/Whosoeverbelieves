# -*- coding: utf-8 -*-
"""Segment the group-A verb forms into the pool's own morpheme roles.

Patterns are written in bare base letters; matching strips diacritics but the
emitted pieces are sliced out of the original form, so accents and breathings
land in whichever morpheme actually carries them.
"""
import json, io, unicodedata, collections

def clusters(s):
    """[(base letter, original text with its marks)] — one entry per letter."""
    d = unicodedata.normalize('NFD', s)
    out = []
    for ch in d:
        if unicodedata.combining(ch):
            if out: out[-1][1] += ch
        else:
            out.append([ch.lower(), ch])
    return [(b, unicodedata.normalize('NFC', t)) for b, t in out]

def final_sigma(x):
    return x.replace('ς', 'σ')

P, L = [], []
def pat(lexes, systems, node, label, parts):
    """parts: list of (role, base-letters) or (role, [alt1, alt2]) tried longest first."""
    for lex in lexes:
        for sysname in systems:
            P.append((lex, sysname, node, label, parts))

ERX = lambda prep, cap: [
  (cap+'PNI', 'T_pres',    'Present Middle Deponent Indicative',   [('prep',prep),('stem','ερχ')]),
  (cap+'INI', 'T_impf',    'Imperfect Middle Deponent Indicative', [('prep',prep),('augst','ηρχ')]),
  (cap+'IMI', 'T_impf',    'Imperfect Middle Indicative',          [('prep',prep),('augst','ηρχ')]),
  (cap+'FDI', 'T_fut_am',  'Future Middle Deponent Indicative',    [('prep',prep),('stem','ελευ'),('fmt','σ')]),
  (cap+'2AAI','T_2aor_am', 'Aorist (2nd) Active Indicative',       [('prep',prep),('augst','ηλθ')]),
  (cap+'2RAI','T_perf_2a', 'Perfect (2nd) Active Indicative',      [('prep',prep),('redup','ελ'),('stem','ηλυθ')]),
  (cap+'2LAI','T_plup',    'Pluperfect Active Indicative',         [('prep',prep),('redup','ελ'),('stem','ηλυθ')]),
]

TABLE = {}
def add(lex, rows):
    TABLE.setdefault(lex, {})
    for code, node, label, parts in rows:
        TABLE[lex].setdefault(code, []).append((node, label, parts))

add('λέγω', [
  ('PAI','T_pres','Present Active Indicative',[('stem','λεγ')]),
  ('PPI','T_pres','Present Passive Indicative',[('stem','λεγ')]),
  ('IAI','T_impf','Imperfect Active Indicative',[('aug','ε'),('stem','λεγ')]),
  ('FAI','T_fut_liq','Future Active Indicative',[('stem','ερ'),('fmt',['ει','ου','ω'])]),
  ('2AAI','T_2aor_am','Aorist (2nd) Active Indicative',[('augst','ειπ')]),
  ('RAI','T_perf_1a','Perfect Active Indicative',[('redup','ει'),('stem','ρη'),('fmt','κ')]),
  ('RPI','T_perf_mp','Perfect Passive Indicative',[('redup','ει'),('stem','ρη')]),
  ('LAI','T_plup','Pluperfect Active Indicative',[('redup','ει'),('stem','ρη'),('fmt','κ')]),
  ('API','T_1aor_p','Aorist Passive Indicative',[('aug','ε'),('stem','ρρε'),('fmt','θη')]),
])
add('ἔρχομαι', [(c,n,l,p) for c,n,l,p in ERX('', '')])
for lex, prep in (('εἰσέρχομαι','εισ'),('ἐξέρχομαι','εξ'),('ἀπέρχομαι','απ'),('προσέρχομαι','προσ')):
    add(lex, [(c,n,l,p) for c,n,l,p in ERX(prep,'')])
add('ὁράω', [
  ('PAI','T_pres','Present Active Indicative',[('stem','ορ')]),
  ('2AAI','T_2aor_am','Aorist (2nd) Active Indicative',[('augst','ειδ')]),
  ('RAI','T_perf_1a','Perfect Active Indicative',[('redup','ε'),('stem',['ωρα','ορα']),('fmt','κ')]),
  ('LAI','T_plup','Pluperfect Active Indicative',[('redup','ε'),('stem','ωρα'),('fmt','κ')]),
  ('API','T_1aor_p','Aorist Passive Indicative',[('augst','ωφ'),('fmt','θη')]),
  ('ADI','T_1aor_p','Aorist Passive Indicative',[('augst','ωφ'),('fmt','θη')]),
  ('FDI','T_fut_am','Future Middle Deponent Indicative',[('stem','ο'),('fuse','ψ')]),
  ('FPI','T_fut_1p','Future Passive Indicative',[('stem','οφ'),('fmt','θησ')]),
])
add('γράφω', [
  ('PAI','T_pres','Present Active Indicative',[('stem','γραφ')]),
  ('IAI','T_impf','Imperfect Active Indicative',[('aug','ε'),('stem','γραφ')]),
  ('FAI','T_fut_am','Future Active Indicative',[('stem','γρα'),('fuse','ψ')]),
  ('2AAI','T_1aor_am','Aorist Active Indicative',[('aug','ε'),('stem','γρα'),('fusa',['ψα','ψε'])]),
  ('AAI','T_1aor_am','Aorist Active Indicative',[('aug','ε'),('stem','γρα'),('fusa',['ψα','ψε'])]),
  ('2API','T_2aor_p','Aorist (2nd) Passive Indicative',[('aug','ε'),('stem','γραφ'),('fmt','η')]),
  ('2RAI','T_perf_2a','Perfect (2nd) Active Indicative',[('redup','γε'),('stem','γραφ')]),
  ('RPI','T_perf_mp','Perfect Passive Indicative',[('redup','γε'),('stem','γραπ')]),
])
add('ἐσθίω', [
  ('PAI','T_pres','Present Active Indicative',[('stem','εσθι')]),
  ('IAI','T_impf','Imperfect Active Indicative',[('augst','ησθι')]),
  ('AAI','T_2aor_am','Aorist (2nd) Active Indicative',[('aug','ε'),('stem','φαγ')]),
])
add('ἐπιγινώσκω', [
  ('PAI','T_pres','Present Active Indicative',[('prep','επι'),('stem','γινωσκ')]),
  ('IAI','T_impf','Imperfect Active Indicative',[('prep','επ'),('aug','ε'),('stem','γινωσκ')]),
  ('2AAI','T_2aor_am','Aorist (2nd) Active Indicative',[('prep','επ'),('aug','ε'),('stem','γνω')]),
  ('2API','T_2aor_p','Aorist (2nd) Passive Indicative',[('prep','επ'),('aug','ε'),('stem','γνωσ'),('fmt','θη')]),
  ('FDI','T_fut_am','Future Middle Deponent Indicative',[('prep','επι'),('stem','γνω'),('fmt','σ')]),
])
add('ἀποκρίνομαι', [
  ('PNI','T_pres','Present Middle Deponent Indicative',[('prep','απο'),('stem','κριν')]),
  ('ADI','T_1aor_p','Aorist Passive Deponent Indicative',[('prep','απ'),('aug','ε'),('stem','κρι'),('fmt','θη')]),
  ('ADI','T_1aor_liq','Aorist Middle Indicative',[('prep','απ'),('aug','ε'),('stem','κριν'),('fmt',['α'])]),
  ('FOI','T_fut_1p','Future Passive Deponent Indicative',[('prep','απο'),('stem','κρι'),('fmt','θησ')]),
])
add('διώκω', [
  ('PAI','T_pres','Present Active Indicative',[('stem','διωκ')]),
  ('PPI','T_pres','Present Passive Indicative',[('stem','διωκ')]),
  ('IAI','T_impf','Imperfect Active Indicative',[('aug','ε'),('stem','διωκ')]),
  ('AAI','T_1aor_am','Aorist Active Indicative',[('aug','ε'),('stem','διω'),('fusa',['ξα','ξε'])]),
  ('FAI','T_fut_am','Future Active Indicative',[('stem','διω'),('fuse','ξ')]),
  ('FPI','T_fut_1p','Future Passive Indicative',[('stem','διωχ'),('fmt','θησ')]),
])
add('κατοικέω', [
  ('PAI','T_pres','Present Active Indicative',[('prep','κατ'),('stem','οικ')]),
  ('AAI','T_1aor_am','Aorist Active Indicative',[('prep','κατ'),('augst','ωκη'),('fmt',['σε','σα'])]),
])
for lex, prep in (('φέρω',''),('προσφέρω','προσ')):
    add(lex, [
      ('PAI','T_pres','Present Active Indicative',[('prep',prep),('stem','φερ')]),
      ('PPI','T_pres','Present Passive Indicative',[('prep',prep),('stem','φερ')]),
      ('IAI','T_impf','Imperfect Active Indicative',[('prep',prep),('aug','ε'),('stem','φερ')]),
      ('IPI','T_impf','Imperfect Passive Indicative',[('prep',prep),('aug','ε'),('stem','φερ')]),
      ('API','T_1aor_p','Aorist Passive Indicative',[('prep',prep),('augst','ηνεχ'),('fmt','θη')]),
      ('FAI','T_fut_am','Future Active Indicative',[('prep',prep),('stem','οι'),('fmt','σ')]),
      ('2RAI','T_perf_2a','Perfect (2nd) Active Indicative',[('prep',prep),('redup','εν'),('stem','ηνοχ')]),
    ])

def try_pattern(form, parts):
    cl = clusters(form)
    base = ''.join(final_sigma(b) for b, _ in cl)
    i, out = 0, []
    for role, want in parts:
        alts = want if isinstance(want, list) else [want]
        hit = None
        for a in sorted(alts, key=len, reverse=True):
            if not a:
                hit = ''
                break
            if base[i:i+len(a)] == a:
                hit = a
                break
        if hit is None:
            return None
        if hit:
            out.append([role, ''.join(t for _, t in cl[i:i+len(hit)])])
            i += len(hit)
    if i < len(cl):
        out.append(['end', ''.join(t for _, t in cl[i:])])
    return out

PN = {'1S':'1st Singular','2S':'2nd Singular','3S':'3rd Singular',
      '1P':'1st Plural','2P':'2nd Plural','3P':'3rd Plural'}

raw = json.load(io.open('/tmp/build/raw.json', encoding='utf-8'))
done, misses = [], []
for r in raw:
    f = r['f']
    f = f[0].lower() + f[1:] if f else f
    f = f.strip('[]')
    cands = TABLE.get(r['lex'], {}).get(r['code'], [])
    got = None
    for node, label, parts in cands:
        seg = try_pattern(f, parts)
        if seg:
            got = (node, label, seg)
            break
    if not got:
        misses.append(dict(r, f=f)); continue
    node, label, seg = got
    done.append({'f': f, 'end': node, 'p': '%s, %s' % (label, PN[r['pn']]),
                 'lex': r['lex'], 'ref': r['ref'], 'seg': seg, '_code': r['code']})
# collapse accent-variant duplicates (enclitic acute) on identical parsing
uniq = {}
for e in done:
    k = (unicodedata.normalize('NFD', e['f']), e['p'])
    uniq.setdefault(k, e)
done = list(uniq.values())
json.dump(done, io.open('/tmp/build/segmented.json','w',encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump(misses, io.open('/tmp/build/misses.json','w',encoding='utf-8'), ensure_ascii=False, indent=1)
print('segmented %d   unmatched %d' % (len(done), len(misses)))
mc = collections.Counter((m['lex'], m['code']) for m in misses)
for (lex, code), n in mc.most_common():
    ex = [m['f'] for m in misses if m['lex']==lex and m['code']==code][:4]
    print('   %-14s %-6s %2d   %s' % (lex, code, n, ' '.join(ex)))
