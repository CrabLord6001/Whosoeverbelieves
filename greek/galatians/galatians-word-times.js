/* Word start times (seconds) per verse in each Galatians chapter recording
   (Marilyn Phemister). Chapter -> verse -> one time per word, in the order the
   words are printed on the page.

   Written by align_galatians_audio.py. Empty until a chapter has been aligned
   since word times were added:

       py align_galatians_audio.py --device cuda -c 3

   A chapter absent here simply has no word jumping; its per-verse Listen
   buttons are unaffected. */
window.GALATIANS_WORD_TIMES = {};
