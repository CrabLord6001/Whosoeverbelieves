/* ==========================================================================
   Galatians — Greek audio player (fixed bar at the bottom of the page)
   Reads the chapters for this page from <div id="audio-bar" data-chapters="3">
   Adapted from james-audio.js; only the labels, the audio path and the
   verse-times global differ.
   ========================================================================== */
(function () {
  const host = document.getElementById('audio-bar');
  if (!host) return;
  const chapters = (host.dataset.chapters || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!chapters.length) return;

  // 0.5 is here for pronunciation: slow enough to hear where the stress and
  // the vowel lengths actually fall. Ordered so the slow speeds come first.
  const SPEEDS = [1, 0.75, 0.5, 1.25];
  let speedIdx = 0;
  let current = chapters[0];

  host.innerHTML = `
    <div class="ab-inner">
      <button class="ab-btn ab-play" type="button" aria-label="Play">&#9654;</button>
      <button class="ab-btn ab-back" type="button" aria-label="Back 5 seconds" title="Back 5 seconds">&#8634;5</button>
      <div class="ab-chapters">
        ${chapters.map(c => `<button type="button" class="ab-ch" data-ch="${c}">Galatians ${c}</button>`).join('')}
      </div>
      <input class="ab-seek" type="range" min="0" max="1000" value="0" step="1" aria-label="Seek" />
      <span class="ab-time">0:00 / 0:00</span>
      <button class="ab-btn ab-speed" type="button" aria-label="Playback speed" title="Playback speed">1&#215;</button>
    </div>
    <div class="ab-credit">
      Greek audio: <a href="https://archive.org/details/AudiogreeknewtestamentOfWescott.hort.readByMarilynPhemister" target="_blank" rel="noopener">Marilyn Phemister (&#169;2001)</a>,
      Westcott&#8211;Hort text &#183;
      <a href="https://creativecommons.org/licenses/by-nc/3.0/us/" target="_blank" rel="noopener">CC BY-NC 3.0</a>
      &#183; the reading follows Westcott&#8211;Hort, so it differs from the Byzantine text printed above in a few places (see the textual notes)
    </div>`;

  const audio = new Audio();
  audio.preload = 'metadata';
  const $ = s => host.querySelector(s);
  const playBtn = $('.ab-play'), seek = $('.ab-seek'), time = $('.ab-time'), speedBtn = $('.ab-speed');
  let dragging = false;
  let heldAt = 0;        // last time the reader scrolled, so following defers to them
  let fromSeek = false;  // this play() came from a verse or word jump, not the play button
  let stopAt = null;     // absolute time in `current` to stop at; null runs on
  let stopTimer = null;  // the accurate stop. timeupdate is only a backstop
  let segments = [];     // remaining pieces of a passage that crosses chapters

  const fmt = t => {
    if (!isFinite(t)) return '0:00';
    const m = Math.floor(t / 60), s = Math.floor(t % 60);
    return m + ':' + String(s).padStart(2, '0');
  };
  const render = () => {
    playBtn.innerHTML = audio.paused ? '&#9654;' : '&#10074;&#10074;';
    playBtn.setAttribute('aria-label', audio.paused ? 'Play' : 'Pause');
    if (!dragging && audio.duration) seek.value = Math.round(audio.currentTime / audio.duration * 1000);
    time.textContent = fmt(audio.currentTime) + ' / ' + fmt(audio.duration);
    host.querySelectorAll('.ab-ch').forEach(b => b.classList.toggle('active', b.dataset.ch === current));
    document.body.classList.toggle('ab-playing', !audio.paused);
  };

  function load(ch, autoplay) {
    current = ch;
    audio.src = 'audio/galatians-' + ch + '.mp3';
    audio.playbackRate = SPEEDS[speedIdx];
    seek.value = 0;
    if (autoplay) audio.play().catch(() => {});
    render();
  }

  playBtn.addEventListener('click', () => { audio.paused ? audio.play().catch(() => {}) : audio.pause(); });
  $('.ab-back').addEventListener('click', () => {
    cancelBounds();   // five seconds back lands outside the clip you were in
    audio.currentTime = Math.max(0, audio.currentTime - 5);
  });
  host.querySelectorAll('.ab-ch').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.ch !== current) { cancelBounds(); load(b.dataset.ch, !audio.paused); }
  }));
  speedBtn.addEventListener('click', () => {
    speedIdx = (speedIdx + 1) % SPEEDS.length;
    audio.playbackRate = SPEEDS[speedIdx];
    speedBtn.innerHTML = SPEEDS[speedIdx] + '&#215;';
  });
  seek.addEventListener('input', () => {
    dragging = true;
    if (audio.duration) time.textContent = fmt(seek.value / 1000 * audio.duration) + ' / ' + fmt(audio.duration);
  });
  seek.addEventListener('change', () => {
    cancelBounds();   // dragging the scrubber is a deliberate exit from a clip
    if (audio.duration) audio.currentTime = seek.value / 1000 * audio.duration;
    dragging = false;
  });
  ['play', 'pause', 'timeupdate', 'loadedmetadata', 'ended'].forEach(e => audio.addEventListener(e, render));

  // Space bar toggles play when focus isn't in a text field
  document.addEventListener('keydown', e => {
    if (e.code !== 'Space' || /INPUT|TEXTAREA|SELECT|BUTTON/.test(document.activeElement.tagName)) return;
    e.preventDefault();
    audio.paused ? audio.play().catch(() => {}) : audio.pause();
  });

  // ── Verse jumping ────────────────────────────────────────────────
  // Start times (seconds) per chapter → verse, in galatians-verse-times.js
  const TIMES = window.GALATIANS_VERSE_TIMES || {};
  let pendingSeek = null;
  audio.addEventListener('loadedmetadata', () => {
    if (pendingSeek !== null) { audio.currentTime = pendingSeek; pendingSeek = null; render(); }
  });
  function seekTo(ch, t, play) {
    if (t === undefined || !isFinite(t)) return;
    if (ch !== current) { load(ch, false); pendingSeek = t; }
    else if (audio.readyState >= 1) audio.currentTime = t;
    else pendingSeek = t;
    if (play) {
      // The 'play' handler below scrolls to the verse the highlight is on. On
      // an explicit jump that highlight is still the old verse -- on a page
      // opened and not yet played, the first verse at the top -- so letting it
      // run would throw the reader to the top of the page before the timeupdate
      // moved the highlight to the verse they actually clicked. The jump does
      // its own following a moment later, and correctly.
      fromSeek = true;
      audio.play().catch(() => { fromSeek = false; });
    }
    heldAt = 0;   // an explicit jump resumes following at once
    render();
  }
  function jumpTo(ch, v, play) {
    seekTo(ch, TIMES[ch] && TIMES[ch][v], play);
  }

  // ── Bounded playback: word, verse, passage ───────────────────────
  // Each control plays its own unit and stops: a word for pronunciation, a
  // verse to hear a clause whole, the passage to hear the page read through.
  // The bar at the bottom stays free play, so pressing it after a clip runs on
  // from wherever the clip left you.
  //
  // The stop is a timer, not a timeupdate test. timeupdate fires about four
  // times a second and a word here averages half of one, so a quarter-second
  // overshoot would spill into the next word -- the very thing being isolated.
  // timeupdate still checks as a backstop, for a timer a background tab throttles.
  function cancelBounds() {
    stopAt = null; segments = [];
    if (stopTimer) { clearTimeout(stopTimer); stopTimer = null; }
  }
  function scheduleStop() {
    if (stopTimer) { clearTimeout(stopTimer); stopTimer = null; }
    if (stopAt === null || audio.paused) return;
    const left = (stopAt - audio.currentTime) / (audio.playbackRate || 1);
    stopTimer = setTimeout(reachStop, Math.max(0, left * 1000));
  }
  function reachStop() {
    if (stopTimer) { clearTimeout(stopTimer); stopTimer = null; }
    stopAt = null;
    if (segments.length) { playRange(segments.shift()); return; }
    audio.pause();
    render();
  }
  function playRange(seg) {
    // seg: {ch, from, to}. A null `to` means run to the end of the recording.
    if (!seg || !isFinite(seg.from)) return;
    stopAt = null;
    if (seg.ch !== current) { load(seg.ch, false); pendingSeek = seg.from; }
    else if (audio.readyState >= 1) audio.currentTime = seg.from;
    else pendingSeek = seg.from;
    stopAt = isFinite(seg.to) ? seg.to : null;
    fromSeek = true;
    audio.play().catch(() => { fromSeek = false; });
    heldAt = 0;
    render();
    scheduleStop();
  }
  ['play', 'seeked', 'ratechange'].forEach(e => audio.addEventListener(e, scheduleStop));
  audio.addEventListener('timeupdate', () => {
    if (stopAt !== null && audio.currentTime >= stopAt) reachStop();
  });

  // Where a unit ends. A verse ends where the next verse starts. A word ends at
  // whichever comes first of the next word and the next verse, so the last word
  // of a verse stops on the verse line instead of running into the next one.
  const bounds = {};
  function boundsFor(ch) {
    if (bounds[ch]) return bounds[ch];
    const all = [];
    const vt = TIMES[ch] || {};
    for (const v in vt) all.push(vt[v]);
    (wordSeq[ch] || []).forEach(w => all.push(w.t));
    all.sort((a, b) => a - b);
    return (bounds[ch] = all);
  }
  function nextBoundary(ch, t) {
    const all = boundsFor(ch);
    for (let i = 0; i < all.length; i++) if (all[i] > t + 0.01) return all[i];
    return null;
  }
  const verseStart = (ch, v) => (TIMES[ch] || {})[v];
  const verseEnd = (ch, v) => verseStart(ch, String(Number(v) + 1));

  // Where a verse's audio actually stops: the end of its last word where that
  // is known, otherwise the next verse's start, which carries that verse's
  // first sound with it exactly as a word clip would.
  function verseStop(ch, v) {
    const ws = wordsIn[ch + ':' + v];
    const last = ws && ws.length ? ws[ws.length - 1] : null;
    if (last && isFinite(last.end)) return clipEnd(ch, last.t, last.end);
    return verseEnd(ch, v);
  }
  function playVerse(ch, v) {
    cancelBounds();
    playRange({ ch: ch, from: verseStart(ch, v), to: verseStop(ch, v) });
  }
  // How a clip ends. The aligner gives each word its own end, which sits before
  // the next word starts; the space between them is the transition, and leaving
  // it out is what stops a clip carrying the next word's first sound. TAIL keeps
  // a little of it so a final consonant is not clipped off, GAP holds the clip
  // clear of the next onset, and GAP wins where they disagree. Raise TAIL if
  // words sound cut short, raise GAP if you still hear the next word.
  const WORD_TAIL = 0.06;
  const WORD_GAP = 0.03;
  // CTC alignment is peaky: it marks a character at the frame or two where the
  // model is most certain, not across the whole sound. So a word's measured end
  // runs early, and badly so for one-letter words -- across Galatians 288 of
  // 2247 words measure under a tenth of a second, which is not long enough to
  // hear. The floor is what stops those being clipped to nothing; the next
  // word's onset still wins over it.
  const WORD_MIN = 0.18;
  function clipEnd(ch, from, end) {
    const next = nextBoundary(ch, from);
    let to = isFinite(end) ? end + WORD_TAIL : next;
    if (to === null) return null;                        // nothing known: run on
    to = Math.max(to, from + WORD_MIN);
    if (next !== null) to = Math.max(Math.min(to, next - WORD_GAP), from + 0.08);
    return to;
  }
  function playWord(ch, from, end) {
    cancelBounds();
    playRange({ ch: ch, from: from, to: clipEnd(ch, from, end) });
  }

  // The passage printed on this page, as runs of consecutive verses within one
  // chapter. Only james-3-13-4-6 currently crosses a chapter; the queue is
  // cheap and without it that page would stop halfway through.
  function passageSegments() {
    const out = [];
    document.querySelectorAll('.verse-block').forEach(bl => {
      const el = bl.querySelector('.verse-num');
      const m = el && el.textContent.match(/Galatians\s+(\d+):(\d+)/);
      if (!m || verseStart(m[1], m[2]) === undefined) return;
      const last = out[out.length - 1];
      if (last && last.ch === m[1]) last.lastV = m[2];
      else out.push({ ch: m[1], firstV: m[2], lastV: m[2] });
    });
    out.forEach(s => { s.from = verseStart(s.ch, s.firstV); s.to = verseStop(s.ch, s.lastV); });
    return out;
  }
  function playPassage() {
    const segs = passageSegments();
    if (!segs.length) return;
    cancelBounds();
    segments = segs.slice(1);
    playRange(segs[0]);
  }
  // ▶ button beside each verse label
  document.querySelectorAll('.verse-num').forEach(el => {
    const m = el.textContent.match(/Galatians\s+(\d+):(\d+)/);
    if (!m || !(TIMES[m[1]] && TIMES[m[1]][m[2]] !== undefined)) return;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'verse-play';
    b.setAttribute('aria-label', 'Play Galatians ' + m[1] + ':' + m[2]);
    b.innerHTML = '&#9654; Listen';
    b.addEventListener('click', () => playVerse(m[1], m[2]));
    el.appendChild(b);
  });

  // ── Following the voice ──────────────────────────────────────────
  // The highlight marks the verse being read and the page scrolls to keep it
  // in view, the way the reading plan's reader does. Two restraints keep that
  // from becoming a nuisance on a study page: a verse already comfortably on
  // screen is left where it is, so the page doesn't nudge at every verse, and
  // any scrolling of the reader's own holds following off for a few seconds —
  // long enough to read a parsing table without being dragged back to the text.
  const FOLLOW_HOLD = 6000;
  const blocks = {};
  document.querySelectorAll('.verse-num').forEach(el => {
    const m = el.textContent.match(/Galatians\s+(\d+):(\d+)/);
    if (m) blocks[m[1] + ':' + m[2]] = el.closest('.verse-block');
  });

  let lit = null;
  const hold = () => { heldAt = Date.now(); };
  // Reader intent is read from wheel, touch and the scrolling keys rather than
  // from the scroll event, which our own smooth scrolling also fires.
  ['wheel', 'touchmove'].forEach(e => addEventListener(e, hold, { passive: true }));
  addEventListener('keydown', e => {
    if (/^(ArrowUp|ArrowDown|PageUp|PageDown|Home|End)$/.test(e.key)) hold();
  });
  const smoothly = !matchMedia('(prefers-reduced-motion: reduce)').matches;

  function follow(el) {
    if (audio.paused || Date.now() - heldAt < FOLLOW_HOLD) return;
    // Clear space is what the sticky nav leaves at the top and the audio bar
    // at the bottom; both are measured rather than assumed.
    const nav = document.querySelector('nav');
    const top = (nav ? Math.max(0, nav.getBoundingClientRect().bottom) : 0) + 12;
    const bottom = window.innerHeight - (host.offsetHeight || 0) - 12;
    const r = el.getBoundingClientRect();
    if (r.top >= top && r.bottom <= bottom) return;   // already where it can be read
    // A third of the way down the clear space, so the verses after it show too.
    const want = top + Math.max(0, (bottom - top - r.height) / 3);
    window.scrollTo({ top: window.scrollY + r.top - want, behavior: smoothly ? 'smooth' : 'auto' });
  }

  // Pressing play brings the verse the bar is cued to into view. The highlight
  // is already on it, so it never changes and timeupdate would not fire this.
  // A reader who has just scrolled is still left alone, as while playing.
  audio.addEventListener('play', () => {
    if (fromSeek) { fromSeek = false; return; }
    if (lit) follow(lit);
  });

  // ── Click a word to jump to it ───────────────────────────────────
  // Word times are chapter -> verse -> one start per word in printed order, so
  // the Nth Greek-bearing span of a verse is the Nth time. Punctuation sits in
  // its own span and is skipped. Where the counts disagree the verse is left
  // alone rather than guessed at: landing on the wrong word is worse than not
  // being clickable. Chapters with no word times are simply untouched, which is
  // every chapter until the aligner has been re-run for it.
  const WORDS = window.GALATIANS_WORD_TIMES || {};
  const wordSeq = {};        // chapter -> [{t, end, el}] in spoken order
  const wordsIn = {};        // 'ch:v' -> its words, for where a verse ends
  let litWord = null;
  const HAS_GREEK = /[\u0370-\u03ff\u1f00-\u1fff]/;
  Object.keys(blocks).forEach(key => {
    const [ch, v] = key.split(':');
    const times = WORDS[ch] && WORDS[ch][v];
    const line = times && blocks[key] && blocks[key].querySelector('.greek-line');
    if (!line) return;
    const words = Array.prototype.filter.call(
      line.querySelectorAll('span'), el => HAS_GREEK.test(el.textContent));
    if (words.length !== times.length) return;
    words.forEach((el, i) => {
      // An entry is [start, end]; a bare number is the older file, still read.
      const e = times[i];
      const from = Array.isArray(e) ? e[0] : e;
      const end = Array.isArray(e) ? e[1] : undefined;
      if (!isFinite(from)) return;
      el.classList.add('word-seek');
      el.addEventListener('click', () => playWord(ch, from, end));
      (wordSeq[ch] = wordSeq[ch] || []).push({ t: from, end: end, el: el });
      (wordsIn[key] = wordsIn[key] || []).push({ t: from, end: end });
    });
  });
  // Verse blocks are walked in page order, which is spoken order, but sort
  // anyway so the search below cannot be wrong if a page is ever reordered.
  Object.keys(wordSeq).forEach(c => wordSeq[c].sort((a, b) => a.t - b.t));

  audio.addEventListener('timeupdate', () => {
    const vt = TIMES[current] || {};
    let best = null;
    for (const v in vt) if (vt[v] <= audio.currentTime + 0.05 && (best === null || vt[v] > vt[best])) best = v;
    const el = best !== null ? blocks[current + ':' + best] : null;
    if (el === lit) return;
    if (lit) lit.classList.remove('now-playing');
    if (el) el.classList.add('now-playing');
    lit = el;
    if (el) follow(el);
  });

  // The word being spoken. Separate from the verse handler above because it
  // changes several times a second rather than once a verse, so it does its
  // own early-out and never touches the scroll: following at word level would
  // mean the page creeping constantly while you are trying to read a line.
  audio.addEventListener('timeupdate', () => {
    const seq = wordSeq[current];
    let el = null;
    if (seq && seq.length) {
      const t = audio.currentTime + 0.05;
      let lo = 0, hi = seq.length - 1, pick = -1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (seq[mid].t <= t) { pick = mid; lo = mid + 1; } else { hi = mid - 1; }
      }
      if (pick >= 0) el = seq[pick].el;
    }
    if (el === litWord) return;
    if (litWord) litWord.classList.remove('word-now');
    if (el) el.classList.add('word-now');
    litWord = el;
  });

  // ── Play the whole passage ───────────────────────────────────────
  // Built here rather than written into each page, so it appears wherever the
  // bar does and its label always matches the verses actually printed.
  (function () {
    const bodyEl = document.querySelector('.exegesis-page');
    const segs = passageSegments();
    if (!bodyEl || !segs.length) return;
    const lastSeg = segs[segs.length - 1];
    const label = 'Galatians ' + segs[0].ch + ':' + segs[0].firstV + '\u2013'
                + (segs.length > 1 ? lastSeg.ch + ':' : '') + lastSeg.lastV;
    const wrap = document.createElement('div');
    wrap.className = 'passage-play';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pp-btn';
    const paint = () => {
      const playing = !audio.paused;
      btn.innerHTML = (playing ? '&#10074;&#10074; Pause' : '&#9654; Play all')
                    + ' &#183; ' + label;
      btn.setAttribute('aria-label', (playing ? 'Pause' : 'Play') + ' ' + label);
    };
    btn.addEventListener('click', () => {
      if (!audio.paused) { audio.pause(); return; }
      playPassage();
    });
    paint();
    ['play', 'pause'].forEach(e => audio.addEventListener(e, paint));
    wrap.appendChild(btn);
    bodyEl.insertBefore(wrap, bodyEl.firstChild);
  })();

  document.body.classList.add('has-audio-bar');
  load(current, false);
  // Start the bar at this page's first verse (e.g. 3:15 rather than 3:1)
  const first = (host.dataset.start || '').split(':');
  if (first.length === 2) jumpTo(first[0], first[1], false);
})();
