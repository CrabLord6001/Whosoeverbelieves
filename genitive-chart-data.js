/* ==========================================================================
   GENITIVE USES — chart data
   Source: Daniel B. Wallace, Greek Grammar Beyond the Basics, genitive chapter.
   Categories, names and glosses below are exactly as supplied by Jonathan from
   the Logos table of contents. Nothing here is invented.

   TO FILL IN (left empty — Jonathan supplies):
     example   verse reference, e.g. "Galatians 3:2"
     verse     WEB text of that verse (powers the site's hover/tap tooltip)
     notes     your note for the row
   The Example and Notes columns stay hidden until at least one row has
   something in them, so the table reads clean while it is still a scaffold.
   `notes` is rendered as HTML, so it may hold <em> or a link. Everything
   else is plain text.

   gloss       Wallace's gloss, shown in the "Key Meaning" column.
               A11 is marked incomplete (cut off in the source screenshot).

   tags        "gal" = used in Galatians 3:2, 5 — the row is highlighted.
               Rows flagged earlier as relevant to Titus 3:5 were A10, A14,
               A15, B2 and all of group C; that marking is off for now. To
               bring it back, add "titus" to those rows' tags and restore the
               `titus` entry in `legend` below.

   pair        links A5 / A6 as the Attributive–Attributed pair.
   ========================================================================== */

window.GENITIVE_USES = {
  reference: 'Daniel B. Wallace, Greek Grammar Beyond the Basics (Zondervan, 1996)',

  legend: {
    gal: { label: 'Used in Galatians 3:2, 5' }
  },

  groups: [

    /* ───────────────────────── A. ADJECTIVAL ───────────────────────── */
    {
      letter: 'A',
      name: 'Adjectival',
      rows: [
        { id: 'A1',  num: 1,  name: 'Descriptive', alt: '"Aporetic"',
          gloss: 'Characterized by, Described by…',
          example: '', verse: '', notes: '', tags: [] },

        { id: 'A2',  num: 2,  name: 'Possessive', alt: '',
          gloss: 'Belonging to, Possessed By',
          example: '', verse: '', notes: '', tags: [] },

        { id: 'A3',  num: 3,  name: 'Relationship', alt: '',
          gloss: '',
          example: '', verse: '', notes: '', tags: [] },

        { id: 'A4',  num: 4,  name: 'Partitive', alt: '"Wholative"',
          gloss: 'Which Is a Part Of',
          example: '', verse: '', notes: '', tags: [] },

        { id: 'A5',  num: 5,  name: 'Attributive', alt: 'Hebrew Genitive, Genitive of Quality',
          gloss: '',
          example: '', verse: '', notes: '', tags: ['gal'], pair: 'A6' },

        { id: 'A6',  num: 6,  name: 'Attributed', alt: '',
          gloss: '',
          example: '', verse: '', notes: '', tags: [], pair: 'A5' },

        { id: 'A7',  num: 7,  name: 'Material', alt: '',
          gloss: 'Made out of, Consisting Of',
          example: '', verse: '', notes: '', tags: [] },

        { id: 'A8',  num: 8,  name: 'Content', alt: '',
          gloss: 'Full of, Containing',
          example: '', verse: '', notes: '', tags: ['gal'] },

        { id: 'A9',  num: 9,  name: 'Simple Apposition', alt: '',
          gloss: '',
          example: '', verse: '', notes: '', tags: [] },

        { id: 'A10', num: 10, name: 'Apposition', alt: 'Epexegetical, Definition',
          gloss: '',
          example: '', verse: '', notes: '', tags: ['gal'] },

        { id: 'A11', num: 11, name: 'Destination or Purpose', alt: 'a.k.a. Direction',
          gloss: 'Destined for,…', glossIncomplete: true,
          example: '', verse: '', notes: '', tags: ['gal'] },

        { id: 'A12', num: 12, name: 'Predicate', alt: '',
          gloss: '',
          example: '', verse: '', notes: '', tags: [] },

        { id: 'A13', num: 13, name: 'Subordination', alt: '',
          gloss: 'Over',
          example: '', verse: '', notes: '', tags: [] },

        { id: 'A14', num: 14, name: 'Production / Producer', alt: '',
          gloss: 'Produced By',
          example: '', verse: '', notes: '', tags: [] },

        { id: 'A15', num: 15, name: 'Product', alt: '',
          gloss: 'Which Produces',
          example: '', verse: '', notes: '', tags: [] }
      ]
    },

    /* ───────────────────────── B. ABLATIVAL ───────────────────────── */
    {
      letter: 'B',
      name: 'Ablatival',
      rows: [
        { id: 'B1', num: 1, name: 'Separation', alt: '',
          gloss: 'out of, Away from, From',
          example: '', verse: '', notes: '', tags: [] },

        { id: 'B2', num: 2, name: 'Source', alt: 'or Origin',
          gloss: 'out of, Derived from, Dependent On',
          example: '', verse: '', notes: '', tags: ['gal'] },

        { id: 'B3', num: 3, name: 'Comparison', alt: '',
          gloss: 'Than',
          example: '', verse: '', notes: '', tags: [] }
      ]
    },

    /* ────────────────────────── C. VERBAL ────────────────────────── */
    {
      letter: 'C',
      name: 'Verbal',
      rows: [
        { id: 'C1', num: 1, name: 'Subjective', alt: '',
          gloss: '',
          example: '', verse: '', notes: '', tags: [] },

        { id: 'C2', num: 2, name: 'Objective', alt: '',
          gloss: '',
          example: '', verse: '', notes: '', tags: [] },

        { id: 'C3', num: 3, name: 'Plenary', alt: '',
          gloss: '',
          example: '', verse: '', notes: '', tags: [] }
      ]
    },

    /* ───────────────────────── D. ADVERBIAL ───────────────────────── */
    {
      letter: 'D',
      name: 'Adverbial',
      rows: [
        { id: 'D1', num: 1, name: 'Price / Value / Quantity', alt: '',
          gloss: 'For',
          example: '', verse: '', notes: '', tags: [] },

        { id: 'D2', num: 2, name: 'Time', alt: '',
          gloss: '',
          example: '', verse: '', notes: '', tags: [] },

        { id: 'D3', num: 3, name: 'Place / Space', alt: '',
          gloss: '',
          example: '', verse: '', notes: '', tags: [] },

        { id: 'D4', num: 4, name: 'Means', alt: '',
          gloss: 'By',
          example: '', verse: '', notes: '', tags: [] },

        { id: 'D5', num: 5, name: 'Agency', alt: '',
          gloss: 'By',
          example: '', verse: '', notes: '', tags: [] },

        { id: 'D6', num: 6, name: 'Absolute', alt: '',
          gloss: '',
          example: '', verse: '', notes: '', tags: [] },

        { id: 'D7', num: 7, name: 'Reference', alt: '',
          gloss: '',
          example: '', verse: '', notes: '', tags: [] },

        { id: 'D8', num: 8, name: 'Association', alt: '',
          gloss: '',
          example: '', verse: '', notes: '', tags: [] }
      ]
    },

    /* ────────────────── E. AFTER CERTAIN WORDS ────────────────── */
    {
      letter: 'E',
      name: 'After Certain Words',
      rows: [
        { id: 'E1', num: 1, name: 'Verbs', alt: 'direct object',
          gloss: '',
          example: '', verse: '', notes: '', tags: [] },

        { id: 'E2', num: 2, name: 'Adjectives', alt: 'and adverbs',
          gloss: '',
          example: '', verse: '', notes: '', tags: [] },

        { id: 'E3', num: 3, name: 'Nouns', alt: '',
          gloss: '',
          example: '', verse: '', notes: '', tags: [] },

        { id: 'E4', num: 4, name: 'Prepositions', alt: '',
          gloss: '',
          example: '', verse: '', notes: '', tags: [] }
      ]
    }

  ]
};
