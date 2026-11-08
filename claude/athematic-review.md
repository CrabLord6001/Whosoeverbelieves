# Athematic branch and 32 new lexemes — for review

Built 08 November 2026. Pool goes 1,190 → **1,565 forms** and 89 → **121 lexemes**;
top-100 coverage goes 88 → **99** (only οἶδα is unreachable).

Mechanical checks that passed: every segmentation reassembles into its exact form,
all 1,565 entries solve on the page, 53/53 routing cases including the full athematic
paradigm, zero edges through nodes and zero edge crossings on the chart, no page errors,
and the spelling guard is clean.

**What a check cannot tell you is whether a morpheme split is _right_.** That is this
file. The athematic paradigms are irregular, so these are the least certain segmentations
I have produced — δίδωμι, τίθημι, ἵστημι and ἀφίημι especially.

## Deliberately excluded

| Forms | Why |
|---|---|
| οἶδα, οἴδαμεν, ᾔδει — all 244 tokens | A perfect with a present meaning and nothing visible to mark it. The chart says Present, confidently and wrongly. |
| ἦν, ἦσαν, ἤμην (456) and ἔφη (43) | ἦ-ν puts its ending straight on the stem, exactly like ἔστη, so the athematic-aorist question claims it. Nothing in the form separates them. |
| ἤνεγκα and προσήνεγκα (7) | The κ is stem-final. Called a formative it is a kappa aorist; called nothing it is athematic. Both are lies. |
| φάγεσαι, φάγεται, φάγονται (3) | Future middle with no formative at all. |
| ἀφέωνται, εὐλόγηκεν, ᾠκοδόμητο, ἀφεῖς (5) | Perfects and a pluperfect with no reduplication, so the perfect branch is unreachable. |

## One example per verb per pattern


### δίδωμι — I give (32 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἐδόθη | Aorist Passive Indicative, 3rd Singular | ἐ *aug* + δό *stem* + θη *fmt* |
| ἐδόθησαν | Aorist Passive Indicative, 3rd Plural | ἐ *aug* + δό *stem* + θη *fmt* + σαν *end* |
| δοθήσεται | Future Passive Indicative, 3rd Singular | δο *stem* + θήσ *fmt* + εται *end* |
| δώσω | Future Active Indicative, 1st Singular | δώ *stem* + σ *fmt* + ω *end* |
| ἔδωκαν | Aorist Active Indicative, 3rd Plural | ἔ *aug* + δω *stem* + κ *fmt* + αν *end* |
| ἐδίδου | Imperfect Active Indicative, 3rd Singular | ἐ *aug* + δί *redup* + δο *stem* + υ *end* |
| δίδωμι | Present Active Indicative, 1st Singular | δί *redup* + δω *stem* + μι *end* |
| δίδοται | Present Passive Indicative, 3rd Singular | δί *redup* + δο *stem* + ται *end* |
| δέδωκεν | Perfect Active Indicative, 3rd Singular | δέ *redup* + δω *stem* + κ *fmt* + εν *end* |
| δέδοται | Perfect Passive Indicative, 3rd Singular | δέ *redup* + δο *stem* + ται *end* |
| δεδώκει | Pluperfect Active Indicative, 3rd Singular | δε *redup* + δώ *stem* + κ *fmt* + ει *end* |

### τίθημι — I put, place (23 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἐτέθησαν | Aorist Passive Indicative, 3rd Plural | ἐ *aug* + τέ *stem* + θη *fmt* + σαν *end* |
| ἐτέθη | Aorist Passive Indicative, 3rd Singular | ἐ *aug* + τέ *stem* + θη *fmt* |
| θήσω | Future Active Indicative, 1st Singular | θή *stem* + σ *fmt* + ω *end* |
| ἔθηκεν | Aorist Active Indicative, 3rd Singular | ἔ *aug* + θη *stem* + κ *fmt* + εν *end* |
| ἐτίθουν | Imperfect Active Indicative, 3rd Plural | ἐ *aug* + τί *redup* + θ *stem* + ουν *end* |
| τίθημι | Present Active Indicative, 1st Singular | τί *redup* + θη *stem* + μι *end* |
| τέθεικά | Perfect Active Indicative, 1st Singular | τέ *redup* + θει *stem* + κ *fmt* + ά *end* |
| τέθειται | Perfect Passive Indicative, 3rd Singular | τέ *redup* + θει *stem* + ται *end* |
| ἔθετο | Aorist Middle Indicative, 3rd Singular | ἔ *aug* + θε *stem* + το *end* |

### ἵστημι — I stand, set (20 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἐστάθη | Aorist Passive Indicative, 3rd Singular | ἐ *aug* + στά *stem* + θη *fmt* |
| ἐστάθησαν | Aorist Passive Indicative, 3rd Plural | ἐ *aug* + στά *stem* + θη *fmt* + σαν *end* |
| σταθήσεται | Future Passive Indicative, 3rd Singular | στα *stem* + θήσ *fmt* + εται *end* |
| στήσει | Future Active Indicative, 3rd Singular | στή *stem* + σ *fmt* + ει *end* |
| στήσονται | Future Middle Deponent Indicative, 3rd Plural | στή *stem* + σ *fmt* + ονται *end* |
| ἱστάνομεν | Present Active Indicative, 1st Plural | ἱ *redup* + στάν *stem* + ομεν *end* |
| ἑστήκατε | Perfect Active Indicative, 2nd Plural | ἑ *redup* + στή *stem* + κ *fmt* + ατε *end* |
| εἱστήκεισαν | Pluperfect Active Indicative, 3rd Plural | εἱ *redup* + στή *stem* + κ *fmt* + εισαν *end* |
| ἔστησαν | Aorist Active Indicative, 3rd Plural | ἔ *aug* + στη *stem* + σαν *end* |
| ἔστη | Aorist Active Indicative, 3rd Singular | ἔ *aug* + στη *stem* |

### ἀνίστημι — I raise up, rise (8 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἀνέστησεν | Aorist Active Indicative, 3rd Singular | ἀν *prep* + έ *aug* + στη *stem* + σε *fmt* + ν *end* |
| ἀναστήσει | Future Active Indicative, 3rd Singular | ἀνα *prep* + στή *stem* + σ *fmt* + ει *end* |
| ἀναστήσονται | Future Middle Indicative, 3rd Plural | ἀνα *prep* + στή *stem* + σ *fmt* + ονται *end* |
| ἀνίσταται | Present Middle Indicative, 3rd Singular | ἀν *prep* + ί *redup* + στα *stem* + ται *end* |
| ἀνέστη | Aorist Active Indicative, 3rd Singular | ἀν *prep* + έ *aug* + στη *stem* |

### ἀφίημι — I forgive, let go (22 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἀφέθησαν | Aorist Passive Indicative, 3rd Plural | ἀφ *prep* + έ *aug* + θη *fmt* + σαν *end* |
| ἀφεθήσεταί | Future Passive Indicative, 3rd Singular | ἀφ *prep* + ε *stem* + θήσ *fmt* + εταί *end* |
| ἀφήσει | Future Active Indicative, 3rd Singular | ἀφ *prep* + ή *stem* + σ *fmt* + ει *end* |
| ἀφῆκεν | Aorist Active Indicative, 3rd Singular | ἀφ *prep* + ῆ *augst* + κ *fmt* + εν *end* |
| ἤφιεν | Imperfect Active Indicative, 3rd Singular | ἤφ *augst* + ι *redup* + εν *end* |
| ἀφίουσιν | Present Active Indicative, 3rd Plural | ἀφ *prep* + ί *redup* + ουσιν *end* |
| ἀφίησιν | Present Active Indicative, 3rd Singular | ἀφ *prep* + ί *redup* + η *stem* + σιν *end* |
| ἀφίενταί | Present Passive Indicative, 3rd Plural | ἀφ *prep* + ί *redup* + ε *stem* + νταί *end* |

### παραδίδωμι — I hand over, betray (25 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| παρεδόθην | Aorist Passive Indicative, 1st Singular | παρ *prep* + ε *aug* + δό *stem* + θη *fmt* + ν *end* |
| παρεδόθη | Aorist Passive Indicative, 3rd Singular | παρ *prep* + ε *aug* + δό *stem* + θη *fmt* |
| παραδοθήσεται | Future Passive Indicative, 3rd Singular | παρα *prep* + δο *stem* + θήσ *fmt* + εται *end* |
| παραδώσουσιν | Future Active Indicative, 3rd Plural | παρα *prep* + δώ *stem* + σ *fmt* + ουσιν *end* |
| παρεδώκατε | Aorist Active Indicative, 2nd Plural | παρ *prep* + ε *aug* + δώ *stem* + κ *fmt* + ατε *end* |
| παρεδίδου | Imperfect Active Indicative, 3rd Singular | παρ *prep* + ε *aug* + δί *redup* + δο *stem* + υ *end* |
| παρεδίδετο | Imperfect Passive Indicative, 3rd Singular | παρ *prep* + ε *aug* + δί *redup* + δ *stem* + ετο *end* |
| παραδίδως | Present Active Indicative, 2nd Singular | παρα *prep* + δί *redup* + δω *stem* + ς *end* |
| παραδιδόμεθα | Present Passive Indicative, 1st Plural | παρα *prep* + δι *redup* + δό *stem* + μεθα *end* |
| παραδέδοται | Perfect Passive Indicative, 3rd Singular | παρα *prep* + δέ *redup* + δο *stem* + ται *end* |
| παραδεδώκεισαν | Pluperfect Active Indicative, 3rd Plural | παρα *prep* + δε *redup* + δώ *stem* + κ *fmt* + εισαν *end* |
| παρέδοσαν | Aorist Active Indicative, 3rd Plural | παρ *prep* + έ *aug* + δο *stem* + σαν *end* |

### ἀποδίδωμι — I give back, repay (11 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἀποδώσει | Future Active Indicative, 3rd Singular | ἀπο *prep* + δώ *stem* + σ *fmt* + ει *end* |
| ἀπέδωκεν | Aorist Active Indicative, 3rd Singular | ἀπ *prep* + έ *aug* + δω *stem* + κ *fmt* + εν *end* |
| ἀπεδίδουν | Imperfect Active Indicative, 3rd Plural | ἀπ *prep* + ε *aug* + δί *redup* + δο *stem* + υν *end* |
| ἀποδίδωσιν | Present Active Indicative, 3rd Singular | ἀπο *prep* + δί *redup* + δω *stem* + σιν *end* |
| ἀπέδοσθε | Aorist Middle Indicative, 2nd Plural | ἀπ *prep* + έ *aug* + δο *stem* + σθε *end* |

### ἀπόλλυμι — I destroy, lose (15 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἀπώλεσεν | Aorist Active Indicative, 3rd Singular | ἀπ *prep* + ώλε *augst* + σε *fmt* + ν *end* |
| ἀπώλεσα | Aorist Active Indicative, 1st Singular | ἀπ *prep* + ώλε *augst* + σα *fmt* |
| ἀπώλετο | Aorist (2nd) Middle Indicative, 3rd Singular | ἀπ *prep* + ώλ *augst* + ετο *end* |
| ἀπολῶ | Future Active Indicative, 1st Singular | ἀπ *prep* + ολ *stem* + ῶ *fmt* |
| ἀπολέσει | Future Active Indicative, 3rd Singular | ἀπ *prep* + ολ *stem* + έ *fmt* + σει *end* |
| ἀπολεῖται | Future Middle Indicative, 3rd Singular | ἀπ *prep* + ολ *stem* + εῖ *fmt* + ται *end* |
| ἀπώλλυντο | Imperfect Passive Indicative, 3rd Plural | ἀπ *prep* + ώλλυ *augst* + ντο *end* |
| ἀπολλύει | Present Active Indicative, 3rd Singular | ἀπ *prep* + ολλύ *stem* + ει *end* |
| ἀπολλύμεθα | Present Middle Indicative, 1st Plural | ἀπ *prep* + ολλύ *stem* + μεθα *end* |
| ἀπόλλυται | Present Passive Indicative, 3rd Singular | ἀπ *prep* + όλλυ *stem* + ται *end* |

### εἰμί — I am (25 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἔσεσθέ | Future Middle Deponent Indicative, 2nd Plural | ἔ *stem* + σ *fmt* + εσθέ *end* |
| ἐστιν | Present Active Indicative, 3rd Singular | ἐσ *stem* + τιν *end* |
| εἶ | Present Active Indicative, 2nd Singular | εἶ *stem* |

### φημί — I say (5 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| φησὶν | Present Active Indicative, 3rd Singular | φη *stem* + σὶν *end* |

### δεῖ — it is necessary (2 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἔδει | Imperfect Active Indicative, 3rd Singular | ἔ *aug* + δ *stem* + ει *end* |
| δεῖ | Present Active Indicative, 3rd Singular | δ *stem* + εῖ *end* |

### θαυμάζω — I marvel, wonder (10 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἐθαύμασα | Aorist Active Indicative, 1st Singular | ἐ *aug* + θαύμα *stem* + σα *fmt* |
| ἐθαύμασας | Aorist Active Indicative, 2nd Singular | ἐ *aug* + θαύμα *stem* + σα *fmt* + ς *end* |
| ἐθαυμάσθη | Aorist Passive Indicative, 3rd Singular | ἐ *aug* + θαυμάσ *stem* + θη *fmt* |
| θαυμασθήσονται | Future Passive Indicative, 3rd Plural | θαυμασ *stem* + θήσ *fmt* + ονται *end* |
| ἐθαύμαζον | Imperfect Active Indicative, 3rd Plural | ἐ *aug* + θαύμαζ *stem* + ον *end* |
| θαυμάζετε | Present Active Indicative, 2nd Plural | θαυμάζ *stem* + ετε *end* |

### θεραπεύω — I heal (10 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἐθεράπευσεν | Aorist Active Indicative, 3rd Singular | ἐ *aug* + θεράπευ *stem* + σε *fmt* + ν *end* |
| ἐθεραπεύθησαν | Aorist Passive Indicative, 3rd Plural | ἐ *aug* + θεραπεύ *stem* + θη *fmt* + σαν *end* |
| ἐθεραπεύθη | Aorist Passive Indicative, 3rd Singular | ἐ *aug* + θεραπεύ *stem* + θη *fmt* |
| θεραπεύσω | Future Active Indicative, 1st Singular | θεραπεύ *stem* + σ *fmt* + ω *end* |
| ἐθεράπευον | Imperfect Active Indicative, 3rd Plural | ἐ *aug* + θεράπευ *stem* + ον *end* |
| ἐθεραπεύοντο | Imperfect Passive Indicative, 3rd Plural | ἐ *aug* + θεραπεύ *stem* + οντο *end* |
| θεραπεύει | Present Active Indicative, 3rd Singular | θεραπεύ *stem* + ει *end* |
| θεραπεύεται | Present Passive Indicative, 3rd Singular | θεραπεύ *stem* + εται *end* |

### φωνέω — I call, cry out (7 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἐφώνησεν | Aorist Active Indicative, 3rd Singular | ἐ *aug* + φώνη *stem* + σε *fmt* + ν *end* |
| φωνήσει | Future Active Indicative, 3rd Singular | φωνή *stem* + σ *fmt* + ει *end* |
| ἐφώνει | Imperfect Active Indicative, 3rd Singular | ἐ *aug* + φών *stem* + ει *end* |
| φωνεῖ | Present Active Indicative, 3rd Singular | φων *stem* + εῖ *end* |

### ἁμαρτάνω — I sin (8 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἥμαρτον | Aorist (2nd) Active Indicative, 1st Singular | ἥμαρτ *augst* + ον *end* |
| ἁμαρτήσει | Future Active Indicative, 3rd Singular | ἁμαρτή *stem* + σ *fmt* + ει *end* |
| ἡμαρτήκαμεν | Perfect Active Indicative, 1st Plural | ἡ *redup* + μαρτή *stem* + κ *fmt* + αμεν *end* |
| ἁμαρτάνει | Present Active Indicative, 3rd Singular | ἁμαρτάν *stem* + ει *end* |

### εὐλογέω — I bless (5 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| εὐλόγησεν | Aorist Active Indicative, 3rd Singular | εὐλόγη *stem* + σε *fmt* + ν *end* |
| εὐλογήσω | Future Active Indicative, 1st Singular | εὐλογή *stem* + σ *fmt* + ω *end* |
| εὐλογοῦμεν | Present Active Indicative, 1st Plural | εὐλογ *stem* + οῦμεν *end* |
| εὐλογοῦνται | Present Passive Indicative, 3rd Plural | εὐλογ *stem* + οῦνται *end* |

### εὐχαριστέω — I give thanks (7 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| εὐχαρίστησεν | Aorist Active Indicative, 3rd Singular | εὐχαρίστη *stem* + σε *fmt* + ν *end* |
| ηὐχαρίστησαν | Aorist Active Indicative, 3rd Plural | ηὐχαρίστη *augst* + σα *fmt* + ν *end* |
| εὐχαριστῶ | Present Active Indicative, 1st Singular | εὐχαριστ *stem* + ῶ *end* |

### οἰκοδομέω — I build, edify (12 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| οἰκοδόμησεν | Aorist Active Indicative, 3rd Singular | οἰκοδόμη *stem* + σε *fmt* + ν *end* |
| ᾠκοδόμησεν | Aorist Active Indicative, 3rd Singular | ᾠκοδόμη *augst* + σε *fmt* + ν *end* |
| οἰκοδομήθη | Aorist Passive Indicative, 3rd Singular | οἰκοδομή *stem* + θη *fmt* |
| οἰκοδομηθήσεται | Future Passive Indicative, 3rd Singular | οἰκοδομη *stem* + θήσ *fmt* + εται *end* |
| οἰκοδομήσετέ | Future Active Indicative, 2nd Plural | οἰκοδομή *stem* + σ *fmt* + ετέ *end* |
| ᾠκοδόμουν | Imperfect Active Indicative, 3rd Plural | ᾠκοδόμ *augst* + ουν *end* |
| οἰκοδομεῖ | Present Active Indicative, 3rd Singular | οἰκοδομ *stem* + εῖ *end* |
| οἰκοδομεῖται | Present Passive Indicative, 3rd Singular | οἰκοδομ *stem* + εῖται *end* |

### δικαιόω — I justify, declare righteous (13 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἐδικαίωσεν | Aorist Active Indicative, 3rd Singular | ἐ *aug* + δικαίω *stem* + σε *fmt* + ν *end* |
| ἐδικαιώθη | Aorist Passive Indicative, 3rd Singular | ἐ *aug* + δικαιώ *stem* + θη *fmt* |
| ἐδικαιώθητε | Aorist Passive Indicative, 2nd Plural | ἐ *aug* + δικαιώ *stem* + θη *fmt* + τε *end* |
| δικαιωθήσονται | Future Passive Indicative, 3rd Plural | δικαιω *stem* + θήσ *fmt* + ονται *end* |
| δικαιώσει | Future Active Indicative, 3rd Singular | δικαιώ *stem* + σ *fmt* + ει *end* |
| δεδικαίωται | Perfect Passive Indicative, 3rd Singular | δε *redup* + δικαίω *stem* + ται *end* |
| δικαιοῖ | Present Active Indicative, 3rd Singular | δικαι *stem* + οῖ *end* |
| δικαιοῦται | Present Passive Indicative, 3rd Singular | δικαι *stem* + οῦται *end* |

### πάσχω — I suffer (9 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἔπαθεν | Aorist (2nd) Active Indicative, 3rd Singular | ἔ *aug* + παθ *stem* + εν *end* |
| πέπονθεν | Perfect (2nd) Active Indicative, 3rd Singular | πέ *redup* + πον *stem* + θεν *end* |
| πάσχει | Present Active Indicative, 3rd Singular | πάσχ *stem* + ει *end* |

### ἐγγίζω — I draw near (8 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἤγγισεν | Aorist Active Indicative, 3rd Singular | ἤγγι *augst* + σε *fmt* + ν *end* |
| ἐγγιεῖ | Future Active Indicative, 3rd Singular | ἐγγι *stem* + εῖ *fmt* |
| ἤγγιζεν | Imperfect Active Indicative, 3rd Singular | ἤγγιζ *augst* + εν *end* |
| ἤγγικεν | Perfect Active Indicative, 3rd Singular | ἤ *redup* + γγι *stem* + κ *fmt* + εν *end* |
| ἐγγίζομεν | Present Active Indicative, 1st Plural | ἐγγίζ *stem* + ομεν *end* |

### κλαίω — I weep (10 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἔκλαυσεν | Aorist Active Indicative, 3rd Singular | ἔ *aug* + κλαυ *stem* + σε *fmt* + ν *end* |
| κλαύσουσιν | Future Active Indicative, 3rd Plural | κλαύ *stem* + σ *fmt* + ουσιν *end* |
| ἔκλαιον | Imperfect Active Indicative, 1st Singular | ἔ *aug* + κλαι *stem* + ον *end* |
| κλαίουσιν | Present Active Indicative, 3rd Plural | κλαί *stem* + ουσιν *end* |

### ἐργάζομαι — I work (9 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| εἰργάσαντο | Aorist Middle Deponent Indicative, 3rd Plural | εἰργά *augst* + σα *fmt* + ντο *end* |
| ἠργάζετο | Imperfect Middle Deponent Indicative, 3rd Singular | ἠργάζ *augst* + ετο *end* |
| ἐργάζομαι | Present Middle Deponent Indicative, 1st Singular | ἐργάζ *stem* + ομαι *end* |

### λογίζομαι — I reckon, count (9 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἐλογίσθη | Aorist Passive Deponent Indicative, 3rd Singular | ἐ *aug* + λογίσ *stem* + θη *fmt* |
| ἐλογίσθημεν | Aorist Passive Deponent Indicative, 1st Plural | ἐ *aug* + λογίσ *stem* + θη *fmt* + μεν *end* |
| λογισθήσεται | Future Passive Deponent Indicative, 3rd Singular | λογισ *stem* + θήσ *fmt* + εται *end* |
| ἐλογιζόμην | Imperfect Middle Deponent Indicative, 1st Singular | ἐ *aug* + λογιζ *stem* + όμην *end* |
| λογίζῃ | Present Middle Deponent Indicative, 2nd Singular | λογίζ *stem* + ῃ *end* |

### ἑτοιμάζω — I prepare (5 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἡτοίμασεν | Aorist Active Indicative, 3rd Singular | ἡτοίμα *augst* + σε *fmt* + ν *end* |
| ἡτοίμακα | Perfect Active Indicative, 1st Singular | ἡ *redup* + τοίμα *stem* + κ *fmt* + α *end* |
| ἡτοίμασται | Perfect Passive Indicative, 3rd Singular | ἡ *redup* + τοίμασ *stem* + ται *end* |

### μισέω — I hate (13 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἐμίσησα | Aorist Active Indicative, 1st Singular | ἐ *aug* + μίση *stem* + σα *fmt* |
| ἐμίσησεν | Aorist Active Indicative, 3rd Singular | ἐ *aug* + μίση *stem* + σε *fmt* + ν *end* |
| μισήσουσιν | Future Active Indicative, 3rd Plural | μισή *stem* + σ *fmt* + ουσιν *end* |
| ἐμίσουν | Imperfect Active Indicative, 3rd Plural | ἐ *aug* + μίσ *stem* + ουν *end* |
| μεμίσηκεν | Perfect Active Indicative, 3rd Singular | με *redup* + μίση *stem* + κ *fmt* + εν *end* |
| μισῶ | Present Active Indicative, 1st Singular | μισ *stem* + ῶ *end* |

### πράσσω — I do, practice (11 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἐπράξατε | Aorist Active Indicative, 2nd Plural | ἐ *aug* + πρά *stem* + ξα *fusa* + τε *end* |
| ἔπραξα | Aorist Active Indicative, 1st Singular | ἔ *aug* + πρα *stem* + ξα *fusa* |
| πράξετε | Future Active Indicative, 2nd Plural | πρά *stem* + ξ *fuse* + ετε *end* |
| πέπραχά | Perfect (2nd) Active Indicative, 1st Singular | πέ *redup* + πραχ *stem* + ά *end* |
| πράσσουσιν | Present Active Indicative, 3rd Plural | πράσσ *stem* + ουσιν *end* |

### περισσεύω — I abound (9 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἐπερίσσευσεν | Aorist Active Indicative, 3rd Singular | ἐ *aug* + περίσσευ *stem* + σε *fmt* + ν *end* |
| περισσευθήσεται | Future Passive Indicative, 3rd Singular | περισσευ *stem* + θήσ *fmt* + εται *end* |
| ἐπερίσσευον | Imperfect Active Indicative, 3rd Plural | ἐ *aug* + περίσσευ *stem* + ον *end* |
| περισσεύομεν | Present Active Indicative, 1st Plural | περισσεύ *stem* + ομεν *end* |
| περισσεύονται | Present Middle Indicative, 3rd Plural | περισσεύ *stem* + ονται *end* |

### ἅπτω — I touch (5 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἥψατο | Aorist Middle Indicative, 3rd Singular | ἥ *augst* + ψα *fusa* + το *end* |
| ἅπτει | Present Active Indicative, 3rd Singular | ἅπτ *stem* + ει *end* |
| ἅπτεται | Present Middle Indicative, 3rd Singular | ἅπτ *stem* + εται *end* |

### πλανάω — I lead astray, deceive (8 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἐπλάνησεν | Aorist Active Indicative, 3rd Singular | ἐ *aug* + πλάνη *stem* + σε *fmt* + ν *end* |
| ἐπλανήθησαν | Aorist Passive Indicative, 3rd Plural | ἐ *aug* + πλανή *stem* + θη *fmt* + σαν *end* |
| πλανήσουσιν | Future Active Indicative, 3rd Plural | πλανή *stem* + σ *fmt* + ουσιν *end* |
| πεπλάνησθε | Perfect Passive Indicative, 2nd Plural | πε *redup* + πλάνη *stem* + σθε *end* |
| πλανῶμεν | Present Active Indicative, 1st Plural | πλαν *stem* + ῶμεν *end* |
| πλανῶνται | Present Passive Indicative, 3rd Plural | πλαν *stem* + ῶνται *end* |

### πειράζω — I tempt, test (9 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἐπείρασεν | Aorist Active Indicative, 3rd Singular | ἐ *aug* + πείρα *stem* + σε *fmt* + ν *end* |
| ἐπείραζεν | Imperfect Active Indicative, 3rd Singular | ἐ *aug* + πείραζ *stem* + εν *end* |
| πειράζετε | Present Active Indicative, 2nd Plural | πειράζ *stem* + ετε *end* |
| πειράζομαι | Present Passive Indicative, 1st Singular | πειράζ *stem* + ομαι *end* |

### ἐπιτίθημι — I lay on, put upon (10 forms)

| Example | Parsing | Segmentation |
|---|---|---|
| ἐπιθήσει | Future Active Indicative, 3rd Singular | ἐπι *prep* + θή *stem* + σ *fmt* + ει *end* |
| ἐπιθήσεταί | Future Middle Indicative, 3rd Singular | ἐπι *prep* + θή *stem* + σ *fmt* + εταί *end* |
| ἐπέθηκαν | Aorist Active Indicative, 3rd Plural | ἐπ *prep* + έ *aug* + θη *stem* + κ *fmt* + αν *end* |
| ἐπετίθεσαν | Imperfect Active Indicative, 3rd Plural | ἐπ *prep* + ε *aug* + τί *redup* + θ *stem* + εσαν *end* |
| ἐπιτιθέασιν | Present Active Indicative, 3rd Plural | ἐπι *prep* + τι *redup* + θέ *stem* + ασιν *end* |
| ἐπέθεντο | Aorist Middle Indicative, 3rd Plural | ἐπ *prep* + έ *aug* + θε *stem* + ντο *end* |