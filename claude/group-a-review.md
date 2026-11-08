# Group A — 15 verbs added to the parsing pool, for review

Built 08 November 2026 from STEPBible TAGNT (NA28 words only); rebuild with
`claude/build-group-a.py`. 238 forms across 15 lexemes, taking the pool to 1,190
forms and 89 lexemes. All 1,190 solve on the page; 204 of the 238 carry a verse
underline, the other 34 fall into the same alignment gap as the existing 115.

Below is one example per verb per pattern — check the morpheme split, which is the
field a student reads. Every segmentation reassembles into its form exactly; that is
checked, but a check cannot tell whether the split is *right*.


## λέγω — I say, speak (42 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἐρρέθη | Aorist Passive Indicative, 3rd Singular | ἐ *aug* + ρρέ *stem* + θη *fmt* |
| ἐρρέθησαν | Aorist Passive Indicative, 3rd Plural | ἐ *aug* + ρρέ *stem* + θη *fmt* + σαν *end* |
| εἶπεν | Aorist (2nd) Active Indicative, 3rd Singular | εἶπ *augst* + εν *end* |
| ἐρεῖς | Future Active Indicative, 2nd Singular | ἐρ *stem* + εῖ *fmt* + ς *end* |
| ἐρεῖ | Future Active Indicative, 3rd Singular | ἐρ *stem* + εῖ *fmt* |
| ἔλεγον | Imperfect Active Indicative, 3rd Plural | ἔ *aug* + λεγ *stem* + ον *end* |
| εἰρήκατε | Perfect Active Indicative, 2nd Plural | εἰ *redup* + ρή *stem* + κ *fmt* + ατε *end* |
| εἴρηται | Perfect Passive Indicative, 3rd Singular | εἴ *redup* + ρη *stem* + ται *end* |
| εἰρήκει | Pluperfect Active Indicative, 3rd Singular | εἰ *redup* + ρή *stem* + κ *fmt* + ει *end* |
| λέγει | Present Active Indicative, 3rd Singular | λέγ *stem* + ει *end* |
| λέγεται | Present Passive Indicative, 3rd Singular | λέγ *stem* + εται *end* |

## ἔρχομαι — I come, go (28 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἦλθον | Aorist (2nd) Active Indicative, 3rd Plural | ἦλθ *augst* + ον *end* |
| ἐλεύσεται | Future Middle Deponent Indicative, 3rd Singular | ἐλεύ *stem* + σ *fmt* + εται *end* |
| ἤρχου | Imperfect Middle Deponent Indicative, 2nd Singular | ἤρχ *augst* + ου *end* |
| ἤρχετο | Imperfect Middle Indicative, 3rd Singular | ἤρχ *augst* + ετο *end* |
| ἐλήλυθας | Perfect (2nd) Active Indicative, 2nd Singular | ἐλ *redup* + ήλυθ *stem* + ας *end* |
| ἐληλύθει | Pluperfect Active Indicative, 3rd Singular | ἐλ *redup* + ηλύθ *stem* + ει *end* |
| ἔρχεται | Present Middle Deponent Indicative, 3rd Singular | ἔρχ *stem* + εται *end* |

## εἰσέρχομαι — I go in, enter (15 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| εἰσῆλθον | Aorist (2nd) Active Indicative, 3rd Plural | εἰσ *prep* + ῆλθ *augst* + ον *end* |
| εἰσελεύσονται | Future Middle Deponent Indicative, 3rd Plural | εἰσ *prep* + ελεύ *stem* + σ *fmt* + ονται *end* |
| εἰσεληλύθασιν | Perfect (2nd) Active Indicative, 3rd Plural | εἰσ *prep* + ελ *redup* + ηλύθ *stem* + ασιν *end* |
| εἰσερχόμεθα | Present Middle Deponent Indicative, 1st Plural | εἰσ *prep* + ερχ *stem* + όμεθα *end* |

## ἐξέρχομαι — I go out, come out (16 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἐξῆλθεν | Aorist (2nd) Active Indicative, 3rd Singular | ἐξ *prep* + ῆλθ *augst* + εν *end* |
| ἐξελεύσονται | Future Middle Deponent Indicative, 3rd Plural | ἐξ *prep* + ελεύ *stem* + σ *fmt* + ονται *end* |
| ἐξήρχοντο | Imperfect Middle Deponent Indicative, 3rd Plural | ἐξ *prep* + ήρχ *augst* + οντο *end* |
| ἐξελήλυθεν | Perfect (2nd) Active Indicative, 3rd Singular | ἐξ *prep* + ελ *redup* + ήλυθ *stem* + εν *end* |
| ἐξεληλύθει | Pluperfect Active Indicative, 3rd Singular | ἐξ *prep* + ελ *redup* + ηλύθ *stem* + ει *end* |
| ἐξέρχεται | Present Middle Deponent Indicative, 3rd Singular | ἐξ *prep* + έρχ *stem* + εται *end* |

## ἀπέρχομαι — I go away, depart (11 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἀπῆλθεν | Aorist (2nd) Active Indicative, 3rd Singular | ἀπ *prep* + ῆλθ *augst* + εν *end* |
| ἀπελεύσομαι | Future Middle Deponent Indicative, 1st Singular | ἀπ *prep* + ελεύ *stem* + σ *fmt* + ομαι *end* |
| ἀπελήλυθεν | Perfect (2nd) Active Indicative, 3rd Singular | ἀπ *prep* + ελ *redup* + ήλυθ *stem* + εν *end* |
| ἀπεληλύθεισαν | Pluperfect Active Indicative, 3rd Plural | ἀπ *prep* + ελ *redup* + ηλύθ *stem* + εισαν *end* |

## προσέρχομαι — I come to, approach (8 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| προσῆλθεν | Aorist (2nd) Active Indicative, 3rd Singular | προσ *prep* + ῆλθ *augst* + εν *end* |
| προσήρχοντο | Imperfect Middle Deponent Indicative, 3rd Plural | προσ *prep* + ήρχ *augst* + οντο *end* |
| προσεληλύθατε | Perfect (2nd) Active Indicative, 2nd Plural | προσ *prep* + ελ *redup* + ηλύθ *stem* + ατε *end* |
| προσέρχεται | Present Middle Deponent Indicative, 3rd Singular | προσ *prep* + έρχ *stem* + εται *end* |

## ὁράω — I see, perceive (41 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ὤφθησαν | Aorist Passive Indicative, 3rd Plural | ὤφ *augst* + θη *fmt* + σαν *end* |
| ὤφθη | Aorist Passive Indicative, 3rd Singular | ὤφ *augst* + θη *fmt* |
| εἶδεν | Aorist (2nd) Active Indicative, 3rd Singular | εἶδ *augst* + εν *end* |
| ὀφθήσομαί | Future Passive Indicative, 1st Singular | ὀφ *stem* + θήσ *fmt* + ομαί *end* |
| ὄψονται | Future Middle Deponent Indicative, 3rd Plural | ὄ *stem* + ψ *fuse* + ονται *end* |
| ἑώρακας | Perfect Active Indicative, 2nd Singular | ἑ *redup* + ώρα *stem* + κ *fmt* + ας *end* |
| ἑωράκει | Pluperfect Active Indicative, 3rd Singular | ἑ *redup* + ωρά *stem* + κ *fmt* + ει *end* |
| ὁρῶ | Present Active Indicative, 1st Singular | ὁρ *stem* + ῶ *end* |

## γράφω — I write (13 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἔγραψαν | Aorist Active Indicative, 3rd Plural | ἔ *aug* + γρα *stem* + ψα *fusa* + ν *end* |
| ἔγραψα | Aorist Active Indicative, 1st Singular | ἔ *aug* + γρα *stem* + ψα *fusa* |
| ἐγράφη | Aorist (2nd) Passive Indicative, 3rd Singular | ἐ *aug* + γράφ *stem* + η *fmt* |
| γράψω | Future Active Indicative, 1st Singular | γρά *stem* + ψ *fuse* + ω *end* |
| ἔγραφεν | Imperfect Active Indicative, 3rd Singular | ἔ *aug* + γραφ *stem* + εν *end* |
| γέγραφα | Perfect (2nd) Active Indicative, 1st Singular | γέ *redup* + γραφ *stem* + α *end* |
| γέγραπται | Perfect Passive Indicative, 3rd Singular | γέ *redup* + γραπ *stem* + ται *end* |
| γράφει | Present Active Indicative, 3rd Singular | γράφ *stem* + ει *end* |

## ἐσθίω — I eat (9 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἔφαγεν | Aorist (2nd) Active Indicative, 3rd Singular | ἔ *aug* + φαγ *stem* + εν *end* |
| ἤσθιον | Imperfect Active Indicative, 3rd Plural | ἤσθι *augst* + ον *end* |
| ἐσθίει | Present Active Indicative, 3rd Singular | ἐσθί *stem* + ει *end* |

## ἀποκρίνομαι — I answer, reply (9 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἀπεκρίνατο | Aorist Middle Indicative, 3rd Singular | ἀπ *prep* + ε *aug* + κρίν *stem* + α *fmt* + το *end* |
| ἀπεκρίθη | Aorist Passive Deponent Indicative, 3rd Singular | ἀπ *prep* + ε *aug* + κρί *stem* + θη *fmt* |
| ἀπεκρίθην | Aorist Passive Deponent Indicative, 1st Singular | ἀπ *prep* + ε *aug* + κρί *stem* + θη *fmt* + ν *end* |
| ἀποκριθήσονται | Future Passive Deponent Indicative, 3rd Plural | ἀπο *prep* + κρι *stem* + θήσ *fmt* + ονται *end* |
| ἀποκρίνῃ | Present Middle Deponent Indicative, 2nd Singular | ἀπο *prep* + κρίν *stem* + ῃ *end* |

## ἐπιγινώσκω — I know fully, recognize (11 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἐπέγνωμεν | Aorist (2nd) Active Indicative, 1st Plural | ἐπ *prep* + έ *aug* + γνω *stem* + μεν *end* |
| ἐπεγνώσθην | Aorist (2nd) Passive Indicative, 1st Singular | ἐπ *prep* + ε *aug* + γνώσ *stem* + θη *fmt* + ν *end* |
| ἐπιγνώσομαι | Future Middle Deponent Indicative, 1st Singular | ἐπι *prep* + γνώ *stem* + σ *fmt* + ομαι *end* |
| ἐπεγίνωσκον | Imperfect Active Indicative, 3rd Plural | ἐπ *prep* + ε *aug* + γίνωσκ *stem* + ον *end* |
| ἐπιγινώσκεις | Present Active Indicative, 2nd Singular | ἐπι *prep* + γινώσκ *stem* + εις *end* |

## φέρω — I bring, carry (10 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἠνέχθη | Aorist Passive Indicative, 3rd Singular | ἠνέχ *augst* + θη *fmt* |
| οἴσουσιν | Future Active Indicative, 3rd Plural | οἴ *stem* + σ *fmt* + ουσιν *end* |
| ἔφερον | Imperfect Active Indicative, 3rd Plural | ἔ *aug* + φερ *stem* + ον *end* |
| ἐφερόμεθα | Imperfect Passive Indicative, 1st Plural | ἐ *aug* + φερ *stem* + όμεθα *end* |
| φέρουσιν | Present Active Indicative, 3rd Plural | φέρ *stem* + ουσιν *end* |

## προσφέρω — I bring to, offer (9 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| προσηνέχθη | Aorist Passive Indicative, 3rd Singular | προσ *prep* + ηνέχ *augst* + θη *fmt* |
| προσηνέχθησαν | Aorist Passive Indicative, 3rd Plural | προσ *prep* + ηνέχ *augst* + θη *fmt* + σαν *end* |
| προσέφερεν | Imperfect Active Indicative, 3rd Singular | προσ *prep* + έ *aug* + φερ *stem* + εν *end* |
| προσενήνοχεν | Perfect (2nd) Active Indicative, 3rd Singular | προσ *prep* + εν *redup* + ήνοχ *stem* + εν *end* |
| προσφέρει | Present Active Indicative, 3rd Singular | προσ *prep* + φέρ *stem* + ει *end* |
| προσφέρονται | Present Passive Indicative, 3rd Plural | προσ *prep* + φέρ *stem* + ονται *end* |

## διώκω — I pursue, persecute (12 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἐδίωξαν | Aorist Active Indicative, 3rd Plural | ἐ *aug* + δίω *stem* + ξα *fusa* + ν *end* |
| ἐδίωξα | Aorist Active Indicative, 1st Singular | ἐ *aug* + δίω *stem* + ξα *fusa* |
| διωχθήσονται | Future Passive Indicative, 3rd Plural | διωχ *stem* + θήσ *fmt* + ονται *end* |
| διώξετε | Future Active Indicative, 2nd Plural | διώ *stem* + ξ *fuse* + ετε *end* |
| ἐδίωκον | Imperfect Active Indicative, 1st Singular | ἐ *aug* + δίωκ *stem* + ον *end* |
| διώκεις | Present Active Indicative, 2nd Singular | διώκ *stem* + εις *end* |
| διώκομαι | Present Passive Indicative, 1st Singular | διώκ *stem* + ομαι *end* |

## κατοικέω — I dwell, inhabit (4 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| κατῴκησεν | Aorist Active Indicative, 3rd Singular | κατ *prep* + ῴκη *augst* + σε *fmt* + ν *end* |
| κατοικεῖτε | Present Active Indicative, 2nd Plural | κατ *prep* + οικ *stem* + εῖτε *end* |

## Deliberately left out (10 forms)

These three groups have no honest path on the chart as it stands.

| Forms | Verb | Why |
|---|---|---|
| ἤνεγκα, ἤνεγκεν, ἤνεγκαν | φέρω | Suppletive alpha aorist. The only node with that shape is the liquid aorist, whose own hint reads *stems in λ, μ, ν, ρ* — ἐνεγκ- is not one, so routing it there would teach something false. |
| προσήνεγκα, προσήνεγκεν, προσήνεγκαν, προσηνέγκατε | προσφέρω | Same form, compounded. |
| φάγεσαι, φάγεται, φάγονται | ἐσθίω | Future middle with no formative at all. The future question offers σ, εσ, θησ and ησ; this form has none of them. |