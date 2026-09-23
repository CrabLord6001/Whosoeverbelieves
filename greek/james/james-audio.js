/* ==========================================================================
   James — Greek audio player (fixed bar at the bottom of the page)
   Reads the chapters for this page from <div id="audio-bar" data-chapters="3,4">
   ========================================================================== */
(function () {
  const host = document.getElementById('audio-bar');
  if (!host) return;
  const chapters = (host.dataset.chapters || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!chapters.length) return;

  const SPEEDS = [1, 0.75, 1.25];
  let speedIdx = 0;
  let current = chapters[0];

  host.innerHTML = `
    <div class="ab-inner">
      <button class="ab-btn ab-play" type="button" aria-label="Play">&#9654;</button>
      <button class="ab-btn ab-back" type="button" aria-label="Back 5 seconds" title="Back 5 seconds">&#8634;5</button>
      <div class="ab-chapters">
        ${chapters.map(c => `<button type="button" class="ab-ch" data-ch="${c}">James ${c}</button>`).join('')}
      </div>
      <input class="ab-seek" type="range" min="0" max="1000" value="0" step="1" aria-label="Seek" />
      <span class="ab-time">0:00 / 0:00</span>
      <button class="ab-btn ab-speed" type="button" aria-label="Playback speed" title="Playback speed">1&#215;</button>
    </div>
    <div class="ab-credit">
      Greek audio: <a href="https://archive.org/details/AudiogreeknewtestamentOfWescott.hort.readByMarilynPhemister" target="_blank" rel="noopener">Marilyn Phemister (&#169;2001)</a>,
      Westcott&#8211;Hort text &#183;
      <a href="https://creativecommons.org/licenses/by-nc/3.0/us/" target="_blank" rel="noopener">CC BY-NC 3.0</a>
    </div>`;

  const audio = new Audio();
  audio.preload = 'metadata';
  const $ = s => host.querySelector(s);
  const playBtn = $('.ab-play'), seek = $('.ab-seek'), time = $('.ab-time'), speedBtn = $('.ab-speed');
  let dragging = false;

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
  };

  function load(ch, autoplay) {
    current = ch;
    audio.src = 'audio/james-' + ch + '.mp3';
    audio.playbackRate = SPEEDS[speedIdx];
    seek.value = 0;
    if (autoplay) audio.play().catch(() => {});
    render();
  }

  playBtn.addEventListener('click', () => { audio.paused ? audio.play().catch(() => {}) : audio.pause(); });
  $('.ab-back').addEventListener('click', () => { audio.currentTime = Math.max(0, audio.currentTime - 5); });
  host.querySelectorAll('.ab-ch').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.ch !== current) load(b.dataset.ch, !audio.paused);
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
  // Start times (seconds) per chapter → verse, in james-verse-times.js (JAMES_VERSE_TIMES)
  const TIMES = window.JAMES_VERSE_TIMES || {};
  let pendingSeek = null;
  audio.addEventListener('loadedmetadata', () => {
    if (pendingSeek !== null) { audio.currentTime = pendingSeek; pendingSeek = null; render(); }
  });
  function jumpTo(ch, v, play) {
    const t = TIMES[ch] && TIMES[ch][v];
    if (t === undefined) return;
    if (ch !== current) { load(ch, false); pendingSeek = t; }
    else if (audio.readyState >= 1) audio.currentTime = t;
    else pendingSeek = t;
    if (play) audio.play().catch(() => {});
    render();
  }
  // ▶ button beside each verse label
  document.querySelectorAll('.verse-num').forEach(el => {
    const m = el.textContent.match(/James\s+(\d+):(\d+)/);
    if (!m || !(TIMES[m[1]] && TIMES[m[1]][m[2]] !== undefined)) return;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'verse-play';
    b.setAttribute('aria-label', 'Play James ' + m[1] + ':' + m[2]);
    b.innerHTML = '&#9654; Listen';
    b.addEventListener('click', () => jumpTo(m[1], m[2], true));
    el.appendChild(b);
  });

  // Highlight the verse being read
  const blocks = {};
  document.querySelectorAll('.verse-num').forEach(el => {
    const m = el.textContent.match(/James\s+(\d+):(\d+)/);
    if (m) blocks[m[1] + ':' + m[2]] = el.closest('.verse-block');
  });
  let lit = null;
  audio.addEventListener('timeupdate', () => {
    const vt = TIMES[current] || {};
    let best = null;
    for (const v in vt) if (vt[v] <= audio.currentTime + 0.05 && (best === null || vt[v] > vt[best])) best = v;
    const el = best !== null ? blocks[current + ':' + best] : null;
    if (el !== lit) { if (lit) lit.classList.remove('now-playing'); if (el) el.classList.add('now-playing'); lit = el; }
  });

  document.body.classList.add('has-audio-bar');
  load(current, false);
  // Start the bar at this page's first verse (e.g. 2:14 rather than 2:1)
  const first = (host.dataset.start || '').split(':');
  if (first.length === 2) jumpTo(first[0], first[1], false);
})();
