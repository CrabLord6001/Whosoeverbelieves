#!/usr/bin/env python3
"""American-spelling guard for whosoeverbelieves.com.

Jonathan is an American writing on Biblical scholarship; British spellings in his
own prose undercut that. Claude repeatedly reintroduced them, so this check exists
so the rule does not depend on anyone remembering it.

    python3 claude/check-spelling.py          # scan, exit 1 on any hit
    python3 claude/check-spelling.py --fix    # rewrite in place, then report

As a pre-commit hook (.git/hooks/pre-commit):
    #!/bin/sh
    python3 claude/check-spelling.py || exit 1
"""
import os, re, sys

FIX = '--fix' in sys.argv

# British -> American. Word-boundary matched, case preserved.
MAP = {
 'colour':'color','colours':'colors','coloured':'colored','colouring':'coloring',
 'behaviour':'behavior','behaviours':'behaviors','behavioural':'behavioral',
 'neighbour':'neighbor','neighbours':'neighbors','neighbouring':'neighboring',
 'centre':'center','centres':'centers','centred':'centered','centrepiece':'centerpiece',
 'licence':'license','licences':'licenses','defence':'defense','defences':'defenses',
 'offence':'offense','offences':'offenses','pretence':'pretense',
 'labour':'labor','labours':'labors','laboured':'labored','labouring':'laboring',
 'honour':'honor','honours':'honors','honoured':'honored','honouring':'honoring',
 'favourite':'favorite','favourites':'favorites','favour':'favor','favours':'favors',
 'rumour':'rumor','rumours':'rumors','armour':'armor','saviour':'savior','saviours':'saviors',
 'endeavour':'endeavor','splendour':'splendor','valour':'valor','vigour':'vigor',
 'grey':'gray','greys':'grays','greyed':'grayed','greying':'graying',
 'programme':'program','programmes':'programs',
 'fulfil':'fulfill','fulfils':'fulfills','fulfilment':'fulfillment','fulfilments':'fulfillments',
 'instalment':'installment','enrolment':'enrollment','skilful':'skillful','wilful':'willful',
 'instil':'instill','distil':'distill','appal':'appall',
 'mould':'mold','moulds':'molds','moulded':'molded','moulding':'molding',
 'labelled':'labeled','labelling':'labeling','cancelled':'canceled','cancelling':'canceling',
 'modelling':'modeling','signalling':'signaling','travelled':'traveled','travelling':'traveling',
 'traveller':'traveler','travellers':'travelers','counsellor':'counselor','counsellors':'counselors',
 'marvellous':'marvelous','jeweller':'jeweler','focussed':'focused',
 'practise':'practice','practises':'practices','practised':'practiced','practising':'practicing',
 'judgement':'judgment','judgements':'judgments','judgemental':'judgmental',
 'acknowledgement':'acknowledgment','acknowledgements':'acknowledgments','abridgement':'abridgment',
 'sceptic':'skeptic','sceptics':'skeptics','sceptical':'skeptical','scepticism':'skepticism',
 'enquiry':'inquiry','enquiries':'inquiries','storey':'story','storeys':'stories',
 'plough':'plow','manoeuvre':'maneuver','moustache':'mustache','speciality':'specialty',
 'jewellery':'jewelry','woollen':'woolen','kerb':'curb','sulphur':'sulfur',
 'analyse':'analyze','analysed':'analyzed','analyses':'analyzes','analysing':'analyzing',
 'paralyse':'paralyze','paralysed':'paralyzed','catalyse':'catalyze',
}
# -ise/-isation families: generated so new ones are caught without editing the map.
for stem in ('organ','recogn','emphas','real','memor','neutral','author','character','summar',
             'apolog','critic','baptis','evangel','special','general','minim','maxim','prior',
             'harmon','categor','util','visual','normal','standard','civil','symbol','sympath',
             'empath','rational','legal','idol','theor','synthes','spiritual','allegor',
             'individual','universal','system','moral','catech','scrutin','advert'):
    for suf, rep in (('ise','ize'),('ises','izes'),('ised','ized'),('ising','izing'),
                     ('isation','ization'),('isations','izations')):
        MAP.setdefault(stem+suf, stem+rep)
for w in ('unrecognised','unemphasised','unorganised','disorganised'):
    MAP.setdefault(w, w.replace('ised','ized'))

# Never flag these, with the reason, so nobody "fixes" them later. This is enforced
# below, not just documentation: if a word here is ever added to MAP, ALLOW still wins.
ALLOW = {
 'tyre':       'Tyre, the Phoenician city (proper noun)',
 'blaising':   'Craig Blaising, scholar (surname)',
 'cambyses':   'Cambyses, Persian king (proper noun)',
 'burnt':      'Scripture quotation: "burnt offering" (Gen 22 etc.)',
 'towards':    'standard in American English, not a Briticism',
 'knelt':      'standard in American English',
 'labelledby': 'aria-labelledby, a required HTML attribute',
 'dialogue':   'standard in American English',
 'catalogue':  'acceptable in American English',
}
SKIP_DIRS = {'.git', 'node_modules'}
# Trees excluded as a whole, by path relative to the repo root:
#   bible/            - Scripture text (KJV wording is not ours to modernize)
#   greek/compare/data/ - imported Strong's lexicon glosses, whose wording is KJV-era
#                       ('cloke', 'shew', 'enquire', 'colour', 'fulfil'). Quoted
#                       reference data, not site copy: Americanizing it would
#                       misrepresent the source lexicon.
#   Claude outputs/   - untracked scratch and backups, never served
SKIP_TREES = ('bible', 'greek/compare/data', 'Claude outputs')
EXTS = ('.html', '.css', '.js', '.md', '.txt', '.xml', '.json')
PAT = re.compile(r'\b(%s)\b' % '|'.join(sorted(MAP, key=len, reverse=True)), re.I)

def cased(src, rep):
    if src.isupper(): return rep.upper()
    if src[0].isupper(): return rep[0].upper() + rep[1:]
    return rep

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
hits, fixed = [], 0
for dirpath, dirs, files in os.walk(root):
    dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
    for fn in sorted(files):
        if not fn.endswith(EXTS): continue
        p = os.path.join(dirpath, fn)
        rel = os.path.relpath(p, root).replace(os.sep, '/')
        try: text = open(p, encoding='utf-8', errors='ignore').read()
        except OSError: continue
        if rel.startswith(SKIP_TREES): continue
        if not PAT.search(text): continue
        def sub(m):
            global fixed
            w = m.group(0)
            if w.lower() in ALLOW: return w
            fixed += 1
            return cased(w, MAP[w.lower()])
        if FIX:
            new, _ = PAT.subn(sub, text)
            if new != text: open(p, 'w', encoding='utf-8', newline='').write(new)
        else:
            for m in PAT.finditer(text):
                if m.group(0).lower() in ALLOW: continue
                line = text.count('\n', 0, m.start()) + 1
                ls = text.rfind('\n', 0, m.start()) + 1
                le = text.find('\n', m.end())
                ctx = text[ls:le if le > 0 else len(text)].strip()[:100]
                hits.append((rel, line, m.group(0), MAP[m.group(0).lower()], ctx))

if FIX:
    print('Fixed %d occurrence(s). Re-run without --fix to confirm.' % fixed)
    sys.exit(0)
if not hits:
    print('OK: no British spellings found.')
    sys.exit(0)
print('Found %d British spelling(s) -- site copy must be American English:\n' % len(hits))
for rel, line, got, want, ctx in hits:
    print('  %s:%d  %s -> %s' % (rel, line, got, want))
    print('      %s' % ctx)
print('\nRun with --fix to correct them. Deliberate exceptions go in ALLOW in this file.')
sys.exit(1)
