# Parsing pool against the top 100 New Testament verbs

Counted 08 November 2026 from STEPBible's tagged Greek New Testament (TAGNT, CC BY 4.0),
NA28 words only. Rebuild with `claude/nt-verb-frequency.py`; the full ranking
is in `claude/nt-verb-frequency.json`.

Three merges matter and are the reason a raw lemma count is not usable as it stands:
TAGNT files λέγω and its suppletive εἶπον/ἐρῶ separately (λέγω ranks 2nd, not 1st,
without the merge), likewise ἐσθίω and its aorist φαγεῖν, and οἶδα shares Strong's
G1492 with εἶδον, split here by tense code.

## Where the pool stands

- 74 lexemes, 952 attested forms
- 73 of the 74 are inside the real top 100
- λύω is rank 107, kept as the textbook paradigm verb
- 27 of the top 100 are absent

## A. Absent, and the flowchart already handles them (15)

Ordinary ω-verbs. Several are second aorists with a suppletive or altered stem —
λέγω → εἶπον, ἔρχομαι → ἦλθον — which is the branch the chart handles best.

| Rank | Verb | Occurrences |
|---:|---|---:|
| 2 | λέγω | 2352 |
| 5 | ἔρχομαι | 632 |
| 7 | ὁράω | 454 |
| 14 | ἀποκρίνομαι | 231 |
| 16 | ἐξέρχομαι | 218 |
| 19 | εἰσέρχομαι | 194 |
| 20 | γράφω | 191 |
| 22 | ἐσθίω | 158 |
| 35 | ἀπέρχομαι | 117 |
| 56 | προσέρχομαι | 86 |
| 72 | φέρω | 66 |
| 94 | προσφέρω | 47 |
| 98 | διώκω | 45 |
| 99 | κατοικέω | 44 |
| 100 | ἐπιγινώσκω | 44 |

4879 NT tokens between them.

## B. Absent, and the flowchart cannot walk them as drawn (12)

Adding these is a change to the chart, not to the pool. The decision tree is built
on the ω-verb path of stem, augment, reduplication and tense formative; μι-verbs
reduplicate with iota and carry their own endings.

| Rank | Verb | Occurrences | Why |
|---:|---|---:|---|
| 1 | εἰμί | 2461 | irregular; no augment-plus-formative anatomy to walk |
| 9 | δίδωμι | 415 | μι-verb |
| 10 | οἶδα | 317 | perfect form with present meaning |
| 23 | ἵστημι | 154 | μι-verb |
| 27 | ἀφίημι | 143 | μι-verb |
| 33 | παραδίδωμι | 119 | μι-verb (δίδωμι compound) |
| 41 | ἀνίστημι | 108 | μι-verb (ἵστημι compound) |
| 43 | δεῖ | 101 | impersonal, third singular only |
| 45 | τίθημι | 100 | μι-verb |
| 52 | ἀπόλλυμι | 89 | μι-verb (-νυμι) |
| 73 | φημί | 66 | μι-verb |
| 92 | ἀποδίδωμι | 48 | μι-verb (δίδωμι compound) |

4121 NT tokens between them.

## Bearing on what the page may claim

With group A added the pool covers 88 of the top 100. With group B too it covers
all 100, but only if the chart grows a μι-verb path. Until one of those is true,
the page cannot describe the pool as the top 100 verbs.
