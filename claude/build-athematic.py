# -*- coding: utf-8 -*-
"""Segment the athematic and replacement verbs into the pool's morpheme roles.

Same machinery as build-group-a.py: patterns are written in bare base letters,
matching strips diacritics, and the emitted pieces are sliced out of the real
form so accents land in whichever morpheme carries them.
"""
import json, io, unicodedata, collections, re, glob, os, sys

def clusters(s):
    d = unicodedata.normalize('NFD', s)
    out = []
    for ch in d:
        if unicodedata.combining(ch):
            if out: out[-1][1] += ch
        else: out.append([ch.lower(), ch])
    return [(b, unicodedata.normalize('NFC', t)) for b, t in out]

def try_pattern(form, parts):
    cl = clusters(form)
    base = ''.join(b.replace('ς','σ') for b, _ in cl)
    i, out = 0, []
    for role, want in parts:
        alts = want if isinstance(want, list) else [want]
        hit = None
        for a in sorted(alts, key=len, reverse=True):
            if a == '': hit=''; break
            if base[i:i+len(a)] == a: hit = a; break
        if hit is None: return None
        if hit:
            out.append([role, ''.join(t for _, t in cl[i:i+len(hit)])]); i += len(hit)
    if i < len(cl): out.append(['end', ''.join(t for _, t in cl[i:])])
    return out

T = {}
def add(lex, rows):
    T.setdefault(lex, {})
    for code, node, label, parts in rows:
        T[lex].setdefault(code, []).append((node, label, parts))

MI_P = 'Present %s Indicative'; MI_I = 'Imperfect %s Indicative'
add('δίδωμι', [
 ('PAI','T_mi_pres','Present Active Indicative',[('redup','δι'),('stem',['δω','δο'])]),
 ('PPI','T_mi_pres','Present Passive Indicative',[('redup','δι'),('stem','δο')]),
 ('IAI','T_mi_impf','Imperfect Active Indicative',[('aug','ε'),('redup','δι'),('stem','δο')]),
 ('FAI','T_fut_am','Future Active Indicative',[('stem','δω'),('fmt','σ')]),
 ('FPI','T_fut_1p','Future Passive Indicative',[('stem','δο'),('fmt','θησ')]),
 ('AAI','T_kaor','Aorist Active Indicative',[('aug','ε'),('stem','δω'),('fmt','κ')]),
 ('API','T_1aor_p','Aorist Passive Indicative',[('aug','ε'),('stem','δο'),('fmt','θη')]),
 ('RAI','T_perf_1a','Perfect Active Indicative',[('redup','δε'),('stem','δω'),('fmt','κ')]),
 ('RPI','T_perf_mp','Perfect Passive Indicative',[('redup','δε'),('stem','δο')]),
 ('LAI','T_plup','Pluperfect Active Indicative',[('redup','δε'),('stem','δω'),('fmt','κ')]),
])
add('τίθημι', [
 ('PAI','T_mi_pres','Present Active Indicative',[('redup','τι'),('stem',['θη','θε'])]),
 ('IAI','T_mi_impf','Imperfect Active Indicative',[('aug','ε'),('redup','τι'),('stem','θ')]),
 ('AAI','T_kaor','Aorist Active Indicative',[('aug','ε'),('stem','θη'),('fmt','κ')]),
 ('2AMI','T_raor','Aorist Middle Indicative',[('aug','ε'),('stem',['θε','θ'])]),
 ('API','T_1aor_p','Aorist Passive Indicative',[('aug','ε'),('stem','τε'),('fmt','θη')]),
 ('FAI','T_fut_am','Future Active Indicative',[('stem','θη'),('fmt','σ')]),
 ('RAI','T_perf_1a','Perfect Active Indicative',[('redup','τε'),('stem','θει'),('fmt','κ')]),
 ('RPI','T_perf_mp','Perfect Passive Indicative',[('redup','τε'),('stem','θει')]),
])
add('ἵστημι', [
 ('PAI','T_mi_pres','Present Active Indicative',[('redup','ι'),('stem','σταν')]),
 ('2AAI','T_raor','Aorist Active Indicative',[('aug','ε'),('stem','στη')]),
 ('API','T_1aor_p','Aorist Passive Indicative',[('aug','ε'),('stem','στα'),('fmt','θη')]),
 ('FAI','T_fut_am','Future Active Indicative',[('stem','στη'),('fmt','σ')]),
 ('FDI','T_fut_am','Future Middle Deponent Indicative',[('stem','στη'),('fmt','σ')]),
 ('FPI','T_fut_1p','Future Passive Indicative',[('stem','στα'),('fmt','θησ')]),
 ('RAI','T_perf_1a','Perfect Active Indicative',[('redup','ε'),('stem','στη'),('fmt','κ')]),
 ('LAI','T_plup','Pluperfect Active Indicative',[('redup','ει'),('stem','στη'),('fmt','κ')]),
])
add('ἀνίστημι', [
 ('2AAI','T_raor','Aorist Active Indicative',[('prep','αν'),('aug','ε'),('stem','στη')]),
 ('AAI','T_1aor_am','Aorist Active Indicative',[('prep','αν'),('aug','ε'),('stem','στη'),('fmt',['σε','σα'])]),
 ('FAI','T_fut_am','Future Active Indicative',[('prep','ανα'),('stem','στη'),('fmt','σ')]),
 ('FMI','T_fut_am','Future Middle Indicative',[('prep','ανα'),('stem','στη'),('fmt','σ')]),
 ('PMI','T_mi_pres','Present Middle Indicative',[('prep','αν'),('redup','ι'),('stem','στα')]),
])
add('ἀφίημι', [
 ('PAI','T_mi_pres','Present Active Indicative',[('prep','αφ'),('redup','ι'),('stem',['η','ε',''])]),
 ('PPI','T_mi_pres','Present Passive Indicative',[('prep','αφ'),('redup','ι'),('stem','ε')]),
 ('IAI','T_mi_impf','Imperfect Active Indicative',[('augst','ηφ'),('redup','ι')]),
 ('AAI','T_kaor','Aorist Active Indicative',[('prep','αφ'),('augst','η'),('fmt','κ')]),
 ('API','T_1aor_p','Aorist Passive Indicative',[('prep','αφ'),('aug','ε'),('fmt','θη')]),
 ('FAI','T_fut_am','Future Active Indicative',[('prep','αφ'),('stem','η'),('fmt','σ')]),
 ('FPI','T_fut_1p','Future Passive Indicative',[('prep','αφ'),('stem','ε'),('fmt','θησ')]),
])
add('παραδίδωμι', [
 ('AAI','T_kaor','Aorist Active Indicative',[('prep','παρ'),('aug','ε'),('stem','δω'),('fmt','κ')]),
 ('2AAI','T_raor','Aorist Active Indicative',[('prep','παρ'),('aug','ε'),('stem','δο')]),
 ('API','T_1aor_p','Aorist Passive Indicative',[('prep','παρ'),('aug','ε'),('stem','δο'),('fmt','θη')]),
 ('FAI','T_fut_am','Future Active Indicative',[('prep','παρα'),('stem','δω'),('fmt','σ')]),
 ('FPI','T_fut_1p','Future Passive Indicative',[('prep','παρα'),('stem','δο'),('fmt','θησ')]),
 ('IAI','T_mi_impf','Imperfect Active Indicative',[('prep','παρ'),('aug','ε'),('redup','δι'),('stem','δο')]),
 ('IPI','T_mi_impf','Imperfect Passive Indicative',[('prep','παρ'),('aug','ε'),('redup','δι'),('stem','δ')]),
 ('PAI','T_mi_pres','Present Active Indicative',[('prep','παρα'),('redup','δι'),('stem','δω')]),
 ('PPI','T_mi_pres','Present Passive Indicative',[('prep','παρα'),('redup','δι'),('stem','δο')]),
 ('LAI','T_plup','Pluperfect Active Indicative',[('prep','παρα'),('redup','δε'),('stem','δω'),('fmt','κ')]),
 ('RPI','T_perf_mp','Perfect Passive Indicative',[('prep','παρα'),('redup','δε'),('stem','δο')]),
])
add('ἀποδίδωμι', [
 ('2AAI','T_kaor','Aorist Active Indicative',[('prep','απ'),('aug','ε'),('stem','δω'),('fmt','κ')]),
 ('2AMI','T_raor','Aorist Middle Indicative',[('prep','απ'),('aug','ε'),('stem',['δε','δο','δ'])]),
 ('FAI','T_fut_am','Future Active Indicative',[('prep','απο'),('stem','δω'),('fmt','σ')]),
 ('IAI','T_mi_impf','Imperfect Active Indicative',[('prep','απ'),('aug','ε'),('redup','δι'),('stem','δο')]),
 ('PAI','T_mi_pres','Present Active Indicative',[('prep','απο'),('redup','δι'),('stem','δω')]),
])
add('ἀπόλλυμι', [
 ('PAI','T_pres','Present Active Indicative',[('prep','απ'),('stem','ολλυ')]),
 ('PMI','T_pres','Present Middle Indicative',[('prep','απ'),('stem','ολλυ')]),
 ('PPI','T_pres','Present Passive Indicative',[('prep','απ'),('stem','ολλυ')]),
 ('IPI','T_impf','Imperfect Passive Indicative',[('prep','απ'),('augst','ωλλυ')]),
 ('AAI','T_1aor_am','Aorist Active Indicative',[('prep','απ'),('augst','ωλε'),('fmt',['σα','σε'])]),
 ('FAI','T_fut_liq','Future Active Indicative',[('prep','απ'),('stem','ολ'),('fmt',['ε','ω'])]),
 ('FMI','T_fut_liq','Future Middle Indicative',[('prep','απ'),('stem','ολ'),('fmt',['ει','ου'])]),
 ('2FMI','T_fut_liq','Future Middle Indicative',[('prep','απ'),('stem','ολ'),('fmt',['ει','ου'])]),
 ('2AMI','T_2aor_am','Aorist (2nd) Middle Indicative',[('prep','απ'),('augst','ωλ')]),
])
# --- εἰμί, φημί, δεῖ: only the slots the chart can honestly reach ---
add('εἰμί', [
 ('PAI','T_pres','Present Active Indicative',[('stem',['εσ','ει'])]),
 ('FDI','T_fut_am','Future Middle Deponent Indicative',[('stem','ε'),('fmt','σ')]),
])
add('φημί', [('PAI','T_pres','Present Active Indicative',[('stem',['φη','φα'])])])
add('δεῖ', [
 ('PAI','T_pres','Present Active Indicative',[('stem','δ')]),
 ('IAI','T_impf','Imperfect Active Indicative',[('aug','ε'),('stem','δ')]),
])
# --- the eight replacements ---
add('θαυμάζω', [
 ('PAI','T_pres','Present Active Indicative',[('stem','θαυμαζ')]),
 ('IAI','T_impf','Imperfect Active Indicative',[('aug','ε'),('stem','θαυμαζ')]),
 ('AAI','T_1aor_am','Aorist Active Indicative',[('aug','ε'),('stem','θαυμα'),('fmt',['σα','σε'])]),
 ('API','T_1aor_p','Aorist Passive Indicative',[('aug','ε'),('stem','θαυμασ'),('fmt','θη')]),
 ('FPI','T_fut_1p','Future Passive Indicative',[('stem','θαυμασ'),('fmt','θησ')]),
])
add('θεραπεύω', [
 ('PAI','T_pres','Present Active Indicative',[('stem','θεραπευ')]),
 ('PPI','T_pres','Present Passive Indicative',[('stem','θεραπευ')]),
 ('IAI','T_impf','Imperfect Active Indicative',[('aug','ε'),('stem','θεραπευ')]),
 ('IPI','T_impf','Imperfect Passive Indicative',[('aug','ε'),('stem','θεραπευ')]),
 ('AAI','T_1aor_am','Aorist Active Indicative',[('aug','ε'),('stem','θεραπευ'),('fmt',['σα','σε'])]),
 ('API','T_1aor_p','Aorist Passive Indicative',[('aug','ε'),('stem','θεραπευ'),('fmt','θη')]),
 ('FAI','T_fut_am','Future Active Indicative',[('stem','θεραπευ'),('fmt','σ')]),
])
add('φωνέω', [
 ('PAI','T_pres','Present Active Indicative',[('stem','φων')]),
 ('IAI','T_impf','Imperfect Active Indicative',[('aug','ε'),('stem','φων')]),
 ('AAI','T_1aor_am','Aorist Active Indicative',[('aug','ε'),('stem','φωνη'),('fmt',['σα','σε'])]),
 ('FAI','T_fut_am','Future Active Indicative',[('stem','φωνη'),('fmt','σ')]),
])
add('ἁμαρτάνω', [
 ('PAI','T_pres','Present Active Indicative',[('stem','αμαρταν')]),
 ('2AAI','T_2aor_am','Aorist (2nd) Active Indicative',[('augst','ημαρτ')]),
 ('FAI','T_fut_am','Future Active Indicative',[('stem','αμαρτη'),('fmt','σ')]),
 ('RAI','T_perf_1a','Perfect Active Indicative',[('redup','η'),('stem','μαρτη'),('fmt','κ')]),
])
add('εὐλογέω', [
 ('PAI','T_pres','Present Active Indicative',[('stem','ευλογ')]),
 ('PPI','T_pres','Present Passive Indicative',[('stem','ευλογ')]),
 ('AAI','T_1aor_am','Aorist Active Indicative',[('stem','ευλογη'),('fmt',['σα','σε'])]),
 ('FAI','T_fut_am','Future Active Indicative',[('stem','ευλογη'),('fmt','σ')]),
])
add('εὐχαριστέω', [
 ('PAI','T_pres','Present Active Indicative',[('stem','ευχαριστ')]),
 ('AAI','T_1aor_am','Aorist Active Indicative',[('augst','ηυχαριστη'),('fmt',['σα','σε'])]),
 ('AAI','T_1aor_am','Aorist Active Indicative',[('stem','ευχαριστη'),('fmt',['σα','σε'])]),
])
add('οἰκοδομέω', [
 ('PAI','T_pres','Present Active Indicative',[('stem','οικοδομ')]),
 ('PPI','T_pres','Present Passive Indicative',[('stem','οικοδομ')]),
 ('IAI','T_impf','Imperfect Active Indicative',[('augst','ωκοδομ')]),
 ('AAI','T_1aor_am','Aorist Active Indicative',[('augst','ωκοδομη'),('fmt',['σα','σε'])]),
 ('AAI','T_1aor_am','Aorist Active Indicative',[('stem','οικοδομη'),('fmt',['σα','σε'])]),
 ('API','T_1aor_p','Aorist Passive Indicative',[('stem','οικοδομη'),('fmt','θη')]),
 ('FAI','T_fut_am','Future Active Indicative',[('stem','οικοδομη'),('fmt','σ')]),
 ('FPI','T_fut_1p','Future Passive Indicative',[('stem','οικοδομη'),('fmt','θησ')]),
])
add('δικαιόω', [
 ('PAI','T_pres','Present Active Indicative',[('stem','δικαι')]),
 ('PPI','T_pres','Present Passive Indicative',[('stem','δικαι')]),
 ('AAI','T_1aor_am','Aorist Active Indicative',[('aug','ε'),('stem','δικαιω'),('fmt',['σα','σε'])]),
 ('API','T_1aor_p','Aorist Passive Indicative',[('aug','ε'),('stem','δικαιω'),('fmt','θη')]),
 ('FAI','T_fut_am','Future Active Indicative',[('stem','δικαιω'),('fmt','σ')]),
 ('FPI','T_fut_1p','Future Passive Indicative',[('stem','δικαιω'),('fmt','θησ')]),
 ('RPI','T_perf_mp','Perfect Passive Indicative',[('redup','δε'),('stem','δικαιω')]),
])
add('πάσχω', [
 ('PAI','T_pres','Present Active Indicative',[('stem','πασχ')]),
 ('2AAI','T_2aor_am','Aorist (2nd) Active Indicative',[('aug','ε'),('stem','παθ')]),
 ('2RAI','T_perf_2a','Perfect (2nd) Active Indicative',[('redup','πε'),('stem','πον')]),
])
add('ἐγγίζω', [
 ('PAI','T_pres','Present Active Indicative',[('stem','εγγιζ')]),
 ('IAI','T_impf','Imperfect Active Indicative',[('augst','ηγγιζ')]),
 ('AAI','T_1aor_am','Aorist Active Indicative',[('augst','ηγγι'),('fmt',['σα','σε'])]),
 ('FAI','T_fut_liq','Future Active Indicative',[('stem','εγγι'),('fmt',['ει','ου'])]),
 ('RAI','T_perf_1a','Perfect Active Indicative',[('redup','η'),('stem','γγι'),('fmt','κ')]),
])
add('κλαίω', [
 ('PAI','T_pres','Present Active Indicative',[('stem','κλαι')]),
 ('IAI','T_impf','Imperfect Active Indicative',[('aug','ε'),('stem','κλαι')]),
 ('AAI','T_1aor_am','Aorist Active Indicative',[('aug','ε'),('stem','κλαυ'),('fmt',['σα','σε'])]),
 ('FAI','T_fut_am','Future Active Indicative',[('stem','κλαυ'),('fmt','σ')]),
])
add('ἐργάζομαι', [
 ('PNI','T_pres','Present Middle Deponent Indicative',[('stem','εργαζ')]),
 ('INI','T_impf','Imperfect Middle Deponent Indicative',[('augst','ηργαζ')]),
 ('ADI','T_1aor_am','Aorist Middle Deponent Indicative',[('augst','ηργα'),('fmt',['σα','σά'])]),
 ('ADI','T_1aor_am','Aorist Middle Deponent Indicative',[('augst','ειργα'),('fmt',['σα','σά'])]),
])
add('λογίζομαι', [
 ('PNI','T_pres','Present Middle Deponent Indicative',[('stem','λογιζ')]),
 ('INI','T_impf','Imperfect Middle Deponent Indicative',[('aug','ε'),('stem','λογιζ')]),
 ('API','T_1aor_p','Aorist Passive Deponent Indicative',[('aug','ε'),('stem','λογισ'),('fmt','θη')]),
 ('FPI','T_fut_1p','Future Passive Deponent Indicative',[('stem','λογισ'),('fmt','θησ')]),
])
add('ἑτοιμάζω', [
 ('AAI','T_1aor_am','Aorist Active Indicative',[('augst','ητοιμα'),('fmt',['σα','σε'])]),
 ('RAI','T_perf_1a','Perfect Active Indicative',[('redup','η'),('stem','τοιμα'),('fmt','κ')]),
 ('RPI','T_perf_mp','Perfect Passive Indicative',[('redup','η'),('stem','τοιμασ')]),
])
add('μισέω', [
 ('PAI','T_pres','Present Active Indicative',[('stem','μισ')]),
 ('IAI','T_impf','Imperfect Active Indicative',[('aug','ε'),('stem','μισ')]),
 ('AAI','T_1aor_am','Aorist Active Indicative',[('aug','ε'),('stem','μιση'),('fmt',['σα','σε'])]),
 ('FAI','T_fut_am','Future Active Indicative',[('stem','μιση'),('fmt','σ')]),
 ('RAI','T_perf_1a','Perfect Active Indicative',[('redup','με'),('stem','μιση'),('fmt','κ')]),
])
add('πράσσω', [
 ('PAI','T_pres','Present Active Indicative',[('stem','πρασσ')]),
 ('AAI','T_1aor_am','Aorist Active Indicative',[('aug','ε'),('stem','πρα'),('fusa',['ξα','ξε'])]),
 ('FAI','T_fut_am','Future Active Indicative',[('stem','πρα'),('fuse','ξ')]),
 ('RAI','T_perf_2a','Perfect (2nd) Active Indicative',[('redup','πε'),('stem','πραχ')]),
])
add('περισσεύω', [
 ('PAI','T_pres','Present Active Indicative',[('stem','περισσευ')]),
 ('PMI','T_pres','Present Middle Indicative',[('stem','περισσευ')]),
 ('IAI','T_impf','Imperfect Active Indicative',[('aug','ε'),('stem','περισσευ')]),
 ('AAI','T_1aor_am','Aorist Active Indicative',[('aug','ε'),('stem','περισσευ'),('fmt',['σα','σε'])]),
 ('FPI','T_fut_1p','Future Passive Indicative',[('stem','περισσευ'),('fmt','θησ')]),
])
add('ἅπτω', [
 ('PAI','T_pres','Present Active Indicative',[('stem','απτ')]),
 ('PMI','T_pres','Present Middle Indicative',[('stem','απτ')]),
 ('ADI','T_1aor_am','Aorist Middle Indicative',[('augst','η'),('fusa',['ψα'])]),
])
add('πλανάω', [
 ('PAI','T_pres','Present Active Indicative',[('stem','πλαν')]),
 ('PPI','T_pres','Present Passive Indicative',[('stem','πλαν')]),
 ('AAI','T_1aor_am','Aorist Active Indicative',[('aug','ε'),('stem','πλανη'),('fmt',['σα','σε'])]),
 ('API','T_1aor_p','Aorist Passive Indicative',[('aug','ε'),('stem','πλανη'),('fmt','θη')]),
 ('FAI','T_fut_am','Future Active Indicative',[('stem','πλανη'),('fmt','σ')]),
 ('RPI','T_perf_mp','Perfect Passive Indicative',[('redup','πε'),('stem','πλανη')]),
])
add('πειράζω', [
 ('PAI','T_pres','Present Active Indicative',[('stem','πειραζ')]),
 ('PPI','T_pres','Present Passive Indicative',[('stem','πειραζ')]),
 ('IAI','T_impf','Imperfect Active Indicative',[('aug','ε'),('stem','πειραζ')]),
 ('AAI','T_1aor_am','Aorist Active Indicative',[('aug','ε'),('stem','πειρα'),('fmt',['σα','σε'])]),
])
add('ἐπιτίθημι', [
 ('PAI','T_mi_pres','Present Active Indicative',[('prep','επι'),('redup','τι'),('stem',['θη','θε'])]),
 ('IAI','T_mi_impf','Imperfect Active Indicative',[('prep','επ'),('aug','ε'),('redup','τι'),('stem','θ')]),
 ('AAI','T_kaor','Aorist Active Indicative',[('prep','επ'),('aug','ε'),('stem','θη'),('fmt','κ')]),
 ('2AAI','T_kaor','Aorist Active Indicative',[('prep','επ'),('aug','ε'),('stem','θη'),('fmt','κ')]),
 ('2AMI','T_raor','Aorist Middle Indicative',[('prep','επ'),('aug','ε'),('stem',['θε','θ'])]),
 ('FAI','T_fut_am','Future Active Indicative',[('prep','επι'),('stem','θη'),('fmt','σ')]),
 ('FMI','T_fut_am','Future Middle Indicative',[('prep','επι'),('stem','θη'),('fmt','σ')]),
])
print(json.dumps({'lexemes': len(T)}))

GLOSS_EXTRA = {
 'πάσχω':'I suffer','ἐγγίζω':'I draw near','κλαίω':'I weep','ἐργάζομαι':'I work',
 'λογίζομαι':'I reckon, count','ἑτοιμάζω':'I prepare','μισέω':'I hate','πράσσω':'I do, practice',
 'περισσεύω':'I abound','ἅπτω':'I touch','πλανάω':'I lead astray, deceive','πειράζω':'I tempt, test',
 'ἐπιτίθημι':'I lay on, put upon'}
# ---- extract, segment, report ----
BOOK={'Mat':'Matthew','Mrk':'Mark','Luk':'Luke','Jhn':'John','Act':'Acts','Rom':'Romans',
 '1Co':'1 Corinthians','2Co':'2 Corinthians','Gal':'Galatians','Eph':'Ephesians','Php':'Philippians',
 'Col':'Colossians','1Th':'1 Thessalonians','2Th':'2 Thessalonians','1Ti':'1 Timothy','2Ti':'2 Timothy',
 'Tit':'Titus','Phm':'Philemon','Heb':'Hebrews','Jas':'James','1Pe':'1 Peter','2Pe':'2 Peter',
 '1Jn':'1 John','2Jn':'2 John','3Jn':'3 John','Jud':'Jude','Rev':'Revelation'}
LEMMA_FIX={'ἀπολλύω':'ἀπόλλυμι'}
nfc=lambda s: unicodedata.normalize('NFC', s)
WANT={nfc(k) for k in T}
rows=[]
for fn in sorted(glob.glob(os.path.join(sys.argv[1],"TAGNT *.txt"))):
    for line in io.open(fn,encoding='utf-8-sig'):
        if not line or line[0]=='#': continue
        p=line.rstrip('\n').split('\t')
        if len(p)<6 or '.' not in p[0] or '#' not in p[0] or 'NA28' not in p[5]: continue
        if '=V-' not in p[3]: continue
        lem=nfc(p[4].split('=')[0].strip()); lem=nfc(LEMMA_FIX.get(lem,lem))
        if lem not in WANT: continue
        parts=p[3].split('=')[1].split('-')
        if len(parts)<3 or not parts[1].endswith('I'): continue
        m=re.match(r'([A-Za-z0-9]+)\.(\d+)\.(\d+)#', p[0])
        if not m or m.group(1) not in BOOK: continue
        f=nfc(p[1].split(' (')[0]).strip('¶')
        f=re.sub(r'[\.,;:·«»“”"\'’\!\?\(\)\[\]]+$','',f)
        rows.append({'f':f,'code':parts[1],'pn':parts[2],'lex':lem,
                     'ref':'%s %s:%s'%(BOOK[m.group(1)],m.group(2),m.group(3))})
seen={}
for r in rows:
    k=(r['f'],r['code'],r['pn'],r['lex'])
    seen.setdefault(k,r)
PN={'1S':'1st Singular','2S':'2nd Singular','3S':'3rd Singular','1P':'1st Plural','2P':'2nd Plural','3P':'3rd Plural'}
done,misses=[],[]
for r in seen.values():
    f=r['f']; f=f[0].lower()+f[1:] if f else f; f=f.strip('[]')
    got=None
    for node,label,parts in T[r['lex']].get(r['code'],[]):
        seg=try_pattern(f,parts)
        if seg: got=(node,label,seg); break
    if not got: misses.append(dict(r,f=f)); continue
    node,label,seg=got
    done.append({'f':f,'end':node,'p':'%s, %s'%(label,PN[r['pn']]),'lex':r['lex'],
                 'ref':r['ref'],'seg':seg,'_code':r['code']})
uniq={}
for e in done: uniq.setdefault((unicodedata.normalize('NFD',e['f']),e['p']),e)
done=list(uniq.values())
json.dump(done, io.open('/tmp/build/seg3.json','w',encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump(misses, io.open('/tmp/build/miss2.json','w',encoding='utf-8'), ensure_ascii=False, indent=1)
bad=[e for e in done if unicodedata.normalize('NFC',''.join(t for _,t in e['seg']))!=unicodedata.normalize('NFC',e['f'])]
print('segmented %d   unmatched %d   reassembly failures %d' % (len(done),len(misses),len(bad)))
c=collections.Counter((m['lex'],m['code']) for m in misses)
for (lex,code),n in c.most_common():
    ex=[m['f'] for m in misses if m['lex']==lex and m['code']==code][:5]
    print('   %-14s %-6s %2d   %s' % (lex,code,n,' '.join(ex)))
