// ══════════════════════════════════════════════════════════════
// FULL BIBLE VERSE DATA
// Format: [chapters, [verses per chapter]]
// Source: KJV/WEB standard versification
// ══════════════════════════════════════════════════════════════
const BIBLE = {
  // ── OLD TESTAMENT ──
  "Genesis":      {t:"OT", chapters:[31,25,24,26,32,22,24,22,29,32,32,20,18,24,21,16,27,33,38,18,34,24,20,67,34,35,46,22,35,43,55,32,20,31,29,43,36,30,23,23,57,38,34,34,28,34,31,22,33,26]},
  "Exodus":       {t:"OT", chapters:[22,25,22,31,23,30,25,32,35,29,10,51,22,31,27,36,16,27,25,26,36,31,33,18,40,37,21,43,46,38,18,35,23,35,35,38,29,31,43,38]},
  "Leviticus":    {t:"OT", chapters:[17,16,17,35,19,30,38,36,24,20,47,8,59,57,33,34,16,30,37,27,24,33,44,23,55,46,34]},
  "Numbers":      {t:"OT", chapters:[54,34,51,49,31,27,89,26,23,36,35,16,33,45,41,50,13,32,22,29,35,41,30,25,18,65,23,31,40,16,54,42,56,29,34,13]},
  "Deuteronomy":  {t:"OT", chapters:[46,37,29,49,33,25,26,20,29,22,32,32,18,29,23,22,20,22,21,20,23,30,25,22,19,19,26,68,29,20,30,52,29,12]},
  "Joshua":       {t:"OT", chapters:[18,24,17,24,15,27,26,35,27,43,23,24,33,15,63,10,18,28,51,9,45,34,16,33]},
  "Judges":       {t:"OT", chapters:[36,23,31,24,31,40,25,35,57,18,40,15,25,20,20,31,13,31,30,48,25]},
  "Ruth":         {t:"OT", chapters:[22,23,18,22]},
  "1 Samuel":     {t:"OT", chapters:[28,36,21,22,12,21,17,22,27,27,15,25,23,52,35,23,58,30,24,42,15,23,29,22,44,25,12,25,11,31,13]},
  "2 Samuel":     {t:"OT", chapters:[27,32,39,12,25,23,29,18,13,19,27,31,39,33,37,23,29,33,43,26,22,51,39,25]},
  "1 Kings":      {t:"OT", chapters:[53,46,28,34,18,38,51,66,28,29,43,33,34,31,34,34,24,46,21,43,29,53]},
  "2 Kings":      {t:"OT", chapters:[18,25,27,44,27,33,20,29,37,36,21,21,25,29,38,20,41,37,37,21,26,20,37,20,30]},
  "1 Chronicles": {t:"OT", chapters:[54,55,24,43,26,81,40,40,44,14,47,40,14,17,29,43,27,17,19,8,30,19,32,31,31,32,34,21,30]},
  "2 Chronicles": {t:"OT", chapters:[17,18,17,22,14,42,22,18,31,19,23,16,22,15,19,14,19,34,11,37,20,12,21,27,28,23,9,27,36,27,21,33,25,33,27,23]},
  "Ezra":         {t:"OT", chapters:[11,70,13,24,17,22,28,36,15,44]},
  "Nehemiah":     {t:"OT", chapters:[11,20,32,23,19,19,73,18,38,39,36,47,31]},
  "Esther":       {t:"OT", chapters:[22,23,15,17,14,14,10,17,32,3]},
  "Job":          {t:"OT", chapters:[22,13,26,21,27,30,21,22,35,22,20,25,28,22,35,22,16,21,29,29,34,30,17,25,6,14,23,28,25,31,40,22,33,37,16,33,24,41,30,24,34,17]},
  "Psalms":       {t:"OT", chapters:[6,12,8,8,12,10,17,9,20,18,7,8,6,7,5,11,15,50,14,9,13,31,6,10,22,12,14,9,11,12,24,11,22,22,28,12,40,22,13,17,13,11,5,26,17,11,9,14,20,23,19,9,6,7,23,13,11,11,17,12,8,12,11,10,13,20,7,35,36,5,24,20,28,23,10,12,20,72,13,19,16,8,18,12,13,17,7,18,52,17,16,15,5,23,11,13,12,9,9,5,8,28,22,35,45,48,43,13,31,7,10,10,9,8,18,19,2,29,176,7,8,9,4,8,5,6,5,6,8,8,3,18,3,3,21,26,9,8,24,13,10,7,12,15,21,10,20,14,9,6]},
  "Proverbs":     {t:"OT", chapters:[33,22,35,27,23,35,27,36,18,32,31,28,25,35,33,33,28,24,29,30,31,29,35,34,28,28,27,28,27,33,31]},
  "Ecclesiastes": {t:"OT", chapters:[18,26,22,16,20,12,29,17,18,20,10,14]},
  "Song of Songs":{t:"OT", chapters:[17,17,11,16,16,13,13,14]},
  "Isaiah":       {t:"OT", chapters:[31,22,26,6,30,13,25,22,21,34,16,6,22,32,9,14,14,7,25,6,17,25,18,23,12,21,13,29,24,33,9,20,24,17,10,22,38,22,8,31,29,25,28,28,25,13,15,22,26,11,23,15,12,17,13,12,21,14,21,22,11,12,19,12,25,24]},
  "Jeremiah":     {t:"OT", chapters:[19,37,25,31,31,30,34,22,26,25,23,17,27,22,21,21,27,23,15,18,14,30,40,10,38,24,22,17,32,24,40,44,26,22,19,32,21,28,18,16,18,22,13,30,5,28,7,47,39,46,64,34]},
  "Lamentations": {t:"OT", chapters:[22,22,66,22,22]},
  "Ezekiel":      {t:"OT", chapters:[28,10,27,17,17,14,27,18,11,22,25,28,23,23,8,63,24,32,14,49,32,31,49,27,17,21,36,26,21,26,18,32,33,31,15,38,28,23,29,49,26,20,27,31,25,24,23,35]},
  "Daniel":       {t:"OT", chapters:[21,49,30,37,31,28,28,27,27,21,45,13]},
  "Hosea":        {t:"OT", chapters:[11,23,5,19,15,11,16,14,17,15,12,14,16,9]},
  "Joel":         {t:"OT", chapters:[20,32,21]},
  "Amos":         {t:"OT", chapters:[15,16,15,13,27,14,17,14,15]},
  "Obadiah":      {t:"OT", chapters:[21]},
  "Jonah":        {t:"OT", chapters:[17,10,10,11]},
  "Micah":        {t:"OT", chapters:[16,13,12,13,15,16,20]},
  "Nahum":        {t:"OT", chapters:[15,13,19]},
  "Habakkuk":     {t:"OT", chapters:[17,20,19]},
  "Zephaniah":    {t:"OT", chapters:[18,15,20]},
  "Haggai":       {t:"OT", chapters:[15,23]},
  "Zechariah":    {t:"OT", chapters:[21,13,10,14,11,15,14,23,17,12,17,14,9,21]},
  "Malachi":      {t:"OT", chapters:[14,17,18,6]},

  // ── NEW TESTAMENT ──
  "Matthew":      {t:"NT", chapters:[25,23,17,25,48,34,29,34,38,42,30,50,58,36,39,28,27,35,30,34,46,46,39,51,46,75,66,20]},
  "Mark":         {t:"NT", chapters:[45,28,35,41,43,56,37,38,50,52,33,44,37,72,47,20]},
  "Luke":         {t:"NT", chapters:[80,52,38,44,39,49,50,56,62,42,54,59,35,35,32,31,37,43,48,47,38,71,56,53]},
  "John":         {t:"NT", chapters:[51,25,36,54,47,71,53,59,41,42,57,50,38,31,27,33,26,40,42,31,25]},
  "Acts":         {t:"NT", chapters:[26,47,26,37,42,15,60,40,43,48,30,25,52,28,41,40,34,28,41,38,40,30,35,27,27,32,44,31]},
  "Romans":       {t:"NT", chapters:[32,29,31,25,21,23,25,39,33,21,36,21,14,23,33,27]},
  "1 Corinthians":{t:"NT", chapters:[31,16,23,21,13,20,40,13,27,33,34,31,13,40,58,24]},
  "2 Corinthians":{t:"NT", chapters:[24,17,18,18,21,18,16,24,15,18,33,21,14]},
  "Galatians":    {t:"NT", chapters:[24,21,29,31,26,18]},
  "Ephesians":    {t:"NT", chapters:[23,22,21,32,33,24]},
  "Philippians":  {t:"NT", chapters:[30,30,21,23]},
  "Colossians":   {t:"NT", chapters:[29,23,25,18]},
  "1 Thessalonians":{t:"NT",chapters:[10,20,13,18,28]},
  "2 Thessalonians":{t:"NT",chapters:[12,17,18]},
  "1 Timothy":    {t:"NT", chapters:[20,15,16,16,25,21]},
  "2 Timothy":    {t:"NT", chapters:[18,26,17,22]},
  "Titus":        {t:"NT", chapters:[16,15,15]},
  "Philemon":     {t:"NT", chapters:[25]},
  "Hebrews":      {t:"NT", chapters:[14,18,19,16,14,20,28,13,28,39,40,29,25]},
  "James":        {t:"NT", chapters:[27,26,18,17,20]},
  "1 Peter":      {t:"NT", chapters:[25,25,22,19,14]},
  "2 Peter":      {t:"NT", chapters:[21,22,18]},
  "1 John":       {t:"NT", chapters:[10,29,24,21,21]},
  "2 John":       {t:"NT", chapters:[13]},
  "3 John":       {t:"NT", chapters:[14]},
  "Jude":         {t:"NT", chapters:[25]},
  "Revelation":   {t:"NT", chapters:[20,29,22,11,14,17,17,13,21,11,19,17,18,20,8,21,18,24,21,15,27,21]}
};

// ── BIBLEGATEWAY BOOK NAME MAP (URL-safe names) ──
const BG_NAMES = {
  "Genesis":"Genesis","Exodus":"Exodus","Leviticus":"Leviticus","Numbers":"Numbers",
  "Deuteronomy":"Deuteronomy","Joshua":"Joshua","Judges":"Judges","Ruth":"Ruth",
  "1 Samuel":"1+Samuel","2 Samuel":"2+Samuel","1 Kings":"1+Kings","2 Kings":"2+Kings",
  "1 Chronicles":"1+Chronicles","2 Chronicles":"2+Chronicles","Ezra":"Ezra",
  "Nehemiah":"Nehemiah","Esther":"Esther","Job":"Job","Psalms":"Psalms",
  "Proverbs":"Proverbs","Ecclesiastes":"Ecclesiastes","Song of Songs":"Song+of+Songs",
  "Isaiah":"Isaiah","Jeremiah":"Jeremiah","Lamentations":"Lamentations",
  "Ezekiel":"Ezekiel","Daniel":"Daniel","Hosea":"Hosea","Joel":"Joel",
  "Amos":"Amos","Obadiah":"Obadiah","Jonah":"Jonah","Micah":"Micah",
  "Nahum":"Nahum","Habakkuk":"Habakkuk","Zephaniah":"Zephaniah","Haggai":"Haggai",
  "Zechariah":"Zechariah","Malachi":"Malachi","Matthew":"Matthew","Mark":"Mark",
  "Luke":"Luke","John":"John","Acts":"Acts","Romans":"Romans",
  "1 Corinthians":"1+Corinthians","2 Corinthians":"2+Corinthians",
  "Galatians":"Galatians","Ephesians":"Ephesians","Philippians":"Philippians",
  "Colossians":"Colossians","1 Thessalonians":"1+Thessalonians",
  "2 Thessalonians":"2+Thessalonians","1 Timothy":"1+Timothy","2 Timothy":"2+Timothy",
  "Titus":"Titus","Philemon":"Philemon","Hebrews":"Hebrews","James":"James",
  "1 Peter":"1+Peter","2 Peter":"2+Peter","1 John":"1+John","2 John":"2+John",
  "3 John":"3+John","Jude":"Jude","Revelation":"Revelation"
};

// ══════════════════════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════════════════════
let selectedBooks = [];
let currentPlan   = [];   // array of day objects
let currentTab    = 'ot';
let reflections   = {};   // dayIndex -> text
let checkStates   = {};   // dayIndex -> bool

// ══════════════════════════════════════════════════════════════
// BOOK GRID RENDER
// ══════════════════════════════════════════════════════════════
function showTestament(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach((b,i) => {
    b.classList.toggle('active', ['ot','nt'][i] === tab);
  });
  renderBookGrid();
}

function renderBookGrid() {
  const grid = document.getElementById('book-grid');
  grid.innerHTML = '';
  Object.keys(BIBLE).forEach(book => {
    const info = BIBLE[book];
    if (info.t.toLowerCase() !== currentTab) return;
    const chip = document.createElement('button');
    chip.className = 'book-chip' + (selectedBooks.includes(book) ? ' selected' : '');
    chip.textContent = book;
    chip.onclick = () => toggleBook(book, chip);
    grid.appendChild(chip);
  });
}

function toggleBook(book, chip) {
  const idx = selectedBooks.indexOf(book);
  if (idx === -1) { selectedBooks.push(book); chip.classList.add('selected'); }
  else            { selectedBooks.splice(idx, 1); chip.classList.remove('selected'); }
  updateBookSummary();
  renderOrderCard();
}

function updateBookSummary() {
  const el = document.getElementById('book-summary');
  if (!selectedBooks.length) { el.textContent = 'No books selected.'; return; }
  const total = selectedBooks.reduce((sum, b) => sum + BIBLE[b].chapters.reduce((s,v) => s+v, 0), 0);
  const chaps = selectedBooks.reduce((sum, b) => sum + BIBLE[b].chapters.length, 0);
  el.textContent = `${selectedBooks.length} book${selectedBooks.length>1?'s':''} selected — ${chaps} chapters, ${total.toLocaleString()} verses`;
}

// ══════════════════════════════════════════════════════════════
// BOOK ORDER CARD
// ══════════════════════════════════════════════════════════════
let dragSrcIdx = null;

function renderOrderCard() {
  const card = document.getElementById('book-order-card');
  const list = document.getElementById('book-order-list');

  if (selectedBooks.length < 2) {
    card.style.display = 'none';
    return;
  }

  // Animate in if newly visible
  if (card.style.display === 'none') {
    card.style.display = 'block';
    card.style.animation = 'fadeUp 0.35s ease both';
  }

  list.innerHTML = '';

  selectedBooks.forEach((book, idx) => {
    const info  = BIBLE[book];
    const chaps = info.chapters.length;
    const verses = info.chapters.reduce((s,v) => s+v, 0);

    const li = document.createElement('li');
    li.className = 'book-order-item';
    li.draggable = true;
    li.dataset.idx = idx;

    li.innerHTML = `
      <span class="book-order-drag-handle" title="Drag to reorder">⠿</span>
      <span class="book-order-num">${idx + 1}.</span>
      <span class="book-order-name">${book}</span>
      <span class="book-order-meta">${chaps} ch · ${verses.toLocaleString()} v</span>
      <div class="book-order-arrows">
        <button class="book-order-arrow" title="Move up"
          onclick="moveBook(${idx}, -1)" ${idx === 0 ? 'disabled' : ''}>▲</button>
        <button class="book-order-arrow" title="Move down"
          onclick="moveBook(${idx}, 1)" ${idx === selectedBooks.length - 1 ? 'disabled' : ''}>▼</button>
      </div>`;

    // Drag events
    li.addEventListener('dragstart', e => {
      dragSrcIdx = idx;
      li.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    li.addEventListener('dragend', () => {
      li.classList.remove('dragging');
      list.querySelectorAll('.book-order-item').forEach(el => el.classList.remove('drag-over'));
    });
    li.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      list.querySelectorAll('.book-order-item').forEach(el => el.classList.remove('drag-over'));
      li.classList.add('drag-over');
    });
    li.addEventListener('drop', e => {
      e.preventDefault();
      if (dragSrcIdx === null || dragSrcIdx === idx) return;
      const moved = selectedBooks.splice(dragSrcIdx, 1)[0];
      selectedBooks.splice(idx, 0, moved);
      dragSrcIdx = null;
      renderOrderCard();
    });

    list.appendChild(li);
  });
}

function moveBook(idx, dir) {
  const target = idx + dir;
  if (target < 0 || target >= selectedBooks.length) return;
  const tmp = selectedBooks[idx];
  selectedBooks[idx] = selectedBooks[target];
  selectedBooks[target] = tmp;
  renderOrderCard();
}

function getSelectedRestDays() {
  const btns = document.querySelectorAll('.rest-day-btn.active');
  return new Set([...btns].map(b => parseInt(b.dataset.day)));
}

function toggleRestDay(btn) {
  btn.classList.toggle('active');
  updateGracePreview();
}

function updateGracePreview() {
  // Rest days were removed; this element no longer exists.
  if (!document.getElementById('grace-day-pattern-desc')) return;
  const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const selected  = getSelectedRestDays();
  const el        = document.getElementById('grace-day-pattern-desc');
  const hasDate   = !!document.getElementById('start-date').value;
  if (selected.size === 0) {
    el.textContent = 'No rest days — all days are reading days.';
  } else if (!hasDate) {
    const names = [...selected].sort((a,b)=>a-b).map(d => DAY_NAMES[d]).join(', ');
    el.textContent = `Rest days: ${names}. Set a start date to apply these to your plan.`;
  } else {
    const names = [...selected].sort((a,b)=>a-b).map(d => DAY_NAMES[d]).join(', ');
    el.textContent = `Rest days: ${names}.`;
  }
}

// ══════════════════════════════════════════════════════════════
// PLAN TEMPLATES
// ══════════════════════════════════════════════════════════════
const TEMPLATES = {
  'gospels': {
    name:  'The Four Gospels',
    books: ['Matthew','Mark','Luke','John'],
    days:  30
  },
  'pauline': {
    name:  'Pauline Epistles',
    books: ['Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians',
            'Philippians','Colossians','1 Thessalonians','2 Thessalonians',
            '1 Timothy','2 Timothy','Titus','Philemon'],
    days:  45
  },
  'general': {
    name:  'General Epistles',
    books: ['Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude'],
    days:  14
  },
  'pentateuch': {
    name:  'The Pentateuch',
    books: ['Genesis','Exodus','Leviticus','Numbers','Deuteronomy'],
    days:  90
  },
  'major-prophets': {
    name:  'Major Prophets',
    books: ['Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel'],
    days:  60
  },
  'minor-prophets': {
    name:  'Minor Prophets',
    books: ['Hosea','Joel','Amos','Obadiah','Jonah','Micah',
            'Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi'],
    days:  30
  },
  'end-times': {
    name:  'End Times',
    books: ['Daniel','1 Thessalonians','2 Thessalonians','Revelation'],
    days:  30
  },
  'wisdom': {
    name:  'Wisdom Literature',
    books: ['Job','Psalms','Proverbs','Ecclesiastes','Song of Songs'],
    days:  21
  }
};

function applyTemplate(key) {
  if (!key) return;

  const tpl = TEMPLATES[key];
  if (!tpl) return;

  // Clear current selection
  selectedBooks = [...tpl.books];

  // Set days and plan name
  document.getElementById('total-days').value = tpl.days;
  document.getElementById('plan-name').value  = tpl.name;

  // Refresh the book grid chips to reflect selection
  // Switch to the tab matching the first book's testament
  const firstTestament = BIBLE[tpl.books[0]]?.t?.toLowerCase() || 'ot';
  currentTab = firstTestament;
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    b.classList.toggle('active', ['ot','nt'][i] === currentTab);
  });
  renderBookGrid();
  updateBookSummary();
  renderOrderCard();

  // Show a confirmation toast
  showToast(`"${tpl.name}" template applied — ${tpl.days} days`, 'success');

  // Reset dropdown back to placeholder so it feels like a one-shot action
  setTimeout(() => {
    document.getElementById('template-select').value = '';
  }, 300);
}

// ══════════════════════════════════════════════════════════════
// PLAN GENERATOR ALGORITHM
// ══════════════════════════════════════════════════════════════

/**
 * Build a flat chapter list from selected books.
 * Returns: [{book, chapter, verses}, ...]
 */
function buildChapterList() {
  const list = [];
  for (const book of selectedBooks) {
    BIBLE[book].chapters.forEach((verses, i) => {
      list.push({ book, chapter: i + 1, verses });
    });
  }
  return list;
}

/**
 * Cluster chapters into exactly N reading days.
 * Uses a two-pass approach:
 *   Pass 1 — greedy fill toward per-day verse target
 *   Pass 2 — if we ended up with fewer days than needed,
 *             split the largest day(s) until we reach N
 * This guarantees no blank days regardless of book/day count.
 */
function clusterChapters(chapterList, readingDays) {
  if (!chapterList.length || readingDays <= 0) return [];

  const totalVerses = chapterList.reduce((s, c) => s + c.verses, 0);
  const target = totalVerses / readingDays;

  // ── Pass 1: greedy clustering ──
  const days = [];
  let current = { chapters: [], verseCount: 0 };

  for (let i = 0; i < chapterList.length; i++) {
    const ch = chapterList[i];
    current.chapters.push(ch);
    current.verseCount += ch.verses;

    const isLast = i === chapterList.length - 1;
    const daysLeft = readingDays - days.length - 1; // -1 for current
    const chaptersLeft = chapterList.length - i - 1;

    if (isLast) {
      days.push(current);
      break;
    }

    // Must flush now if remaining chapters === remaining day slots
    const mustFlush = chaptersLeft <= daysLeft && daysLeft > 0;

    // Want to flush if we're at or past target
    const nextCh = chapterList[i + 1];
    const withNext    = Math.abs(current.verseCount + nextCh.verses - target);
    const withoutNext = Math.abs(current.verseCount - target);
    const shouldFlush = current.verseCount >= target * 0.8 && withoutNext <= withNext;

    if ((shouldFlush || mustFlush) && days.length < readingDays - 1) {
      days.push(current);
      current = { chapters: [], verseCount: 0 };
    }
  }

  // ── Pass 2: if we have too few days, split largest days ──
  while (days.length < readingDays) {
    // Find the day with the most chapters to split
    let splitIdx = 0;
    for (let i = 1; i < days.length; i++) {
      if (days[i].chapters.length > days[splitIdx].chapters.length) splitIdx = i;
    }
    const toSplit = days[splitIdx];
    if (toSplit.chapters.length < 2) break; // can't split single-chapter days further

    const mid = Math.floor(toSplit.chapters.length / 2);
    const firstHalf  = toSplit.chapters.slice(0, mid);
    const secondHalf = toSplit.chapters.slice(mid);

    days.splice(splitIdx, 1,
      { chapters: firstHalf,  verseCount: firstHalf.reduce((s,c)  => s + c.verses, 0) },
      { chapters: secondHalf, verseCount: secondHalf.reduce((s,c) => s + c.verses, 0) }
    );
  }

  // ── Pass 3: if we somehow have too many days, merge smallest adjacent pair ──
  while (days.length > readingDays) {
    let mergeIdx = 0;
    let minVerses = Infinity;
    for (let i = 0; i < days.length - 1; i++) {
      const combined = days[i].verseCount + days[i+1].verseCount;
      if (combined < minVerses) { minVerses = combined; mergeIdx = i; }
    }
    const merged = {
      chapters:   [...days[mergeIdx].chapters, ...days[mergeIdx+1].chapters],
      verseCount: days[mergeIdx].verseCount + days[mergeIdx+1].verseCount
    };
    days.splice(mergeIdx, 2, merged);
  }

  return days;
}

/**
 * Insert rest days into the plan.
 * restDaySet: a Set of weekday numbers (0=Sun … 6=Sat) to mark as rest days.
 * startDateVal: YYYY-MM-DD string; required for rest days to be applied.
 * Returns a full calendar array where rest days have no chapters.
 */
function insertGraceDays(readingDayData, totalCalendarDays, restDaySet, startDateVal) {
  const calendar = [];
  let rdIdx = 0;
  const sd = startDateVal ? new Date(startDateVal + 'T00:00:00') : null;

  for (let d = 0; d < totalCalendarDays; d++) {
    let isGrace = false;
    if (restDaySet.size > 0 && sd) {
      const date = new Date(sd); date.setDate(sd.getDate() + d);
      isGrace = restDaySet.has(date.getDay());
    }

    if (isGrace) {
      calendar.push({ dayNum: d + 1, isGrace: true, chapters: [], verseCount: 0, checked: false });
    } else {
      const rd = readingDayData[rdIdx] || { chapters: [], verseCount: 0 };
      calendar.push({ dayNum: d + 1, isGrace: false, chapters: rd.chapters, verseCount: rd.verseCount, checked: false });
      rdIdx++;
    }
  }

  // If we still have reading days left (totalCalendarDays too short), append them
  while (rdIdx < readingDayData.length) {
    const rd = readingDayData[rdIdx];
    calendar.push({ dayNum: calendar.length + 1, isGrace: false, chapters: rd.chapters, verseCount: rd.verseCount, checked: false });
    rdIdx++;
  }

  return calendar;
}

/**
 * Format passage reference: "John 1-3" or "John 1:1-51; John 2"
 * Returns a display string and a BibleGateway URL.
 */
function formatPassage(chapters) {
  if (!chapters || !chapters.length) return { label: '', url: '' };

  const translation = document.getElementById('translation').value;
  const groups = [];

  // Group consecutive chapters of same book
  let cur = null;
  for (const ch of chapters) {
    if (!cur || cur.book !== ch.book) {
      if (cur) groups.push(cur);
      cur = { book: ch.book, start: ch.chapter, end: ch.chapter };
    } else {
      cur.end = ch.chapter;
    }
  }
  if (cur) groups.push(cur);

  const label = groups.map(g =>
    g.start === g.end ? `${g.book} ${g.start}` : `${g.book} ${g.start}–${g.end}`
  ).join('; ');

  const urlParts = groups.map(g => {
    const bg = BG_NAMES[g.book] || g.book.replace(/ /g, '+');
    return g.start === g.end ? `${bg}+${g.start}` : `${bg}+${g.start}-${bg}+${g.end}`;
  }).join('%3B');

  const url = `https://www.biblegateway.com/passage/?search=${urlParts}&version=${translation}`;
  return { label, url };
}

// ══════════════════════════════════════════════════════════════
// PLAN BUILDER COLLAPSIBLE
// ══════════════════════════════════════════════════════════════
function togglePlanBuilder(forceCollapse) {
  const body    = document.getElementById('plan-builder-body');
  const chevron = document.getElementById('plan-builder-chevron');
  const isOpen  = !body.classList.contains('collapsed');
  if (forceCollapse === true || isOpen) {
    body.classList.add('collapsed');
    chevron.classList.remove('open');
  } else {
    body.classList.remove('collapsed');
    chevron.classList.add('open');
  }
}

// ══════════════════════════════════════════════════════════════
// MAIN GENERATE FUNCTION
// ══════════════════════════════════════════════════════════════
// A plan switch stops the audio: the player's queue and day number belong to
// the old plan, and left running they mark the wrong day as Playing.
function _audioStopForPlanChange() {
  const bar = document.getElementById('audio-player-bar');
  if (bar && bar.style.display !== 'none') audioClose();
}

function generatePlan() {
  if (!selectedBooks.length) {
    alert('Please select at least one book.');
    return;
  }

  const totalDays    = parseInt(document.getElementById('total-days').value) || 30;
  const startDateVal = document.getElementById('start-date').value;
  const restDaySet   = startDateVal ? getSelectedRestDays() : new Set();

  // Calculate reading days (count actual rest days in the date range)
  let graceDays = 0;
  if (restDaySet.size > 0 && startDateVal) {
    const sd = new Date(startDateVal + 'T00:00:00');
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(sd); d.setDate(sd.getDate() + i);
      if (restDaySet.has(d.getDay())) graceDays++;
    }
  }
  const readingDays  = Math.max(1, totalDays - graceDays);

  const chapters     = buildChapterList();
  const clustered    = clusterChapters(chapters, readingDays);
  const calendar     = insertGraceDays(clustered, totalDays, restDaySet, startDateVal);

  // Attach dates if start date given
  if (startDateVal) {
    const sd = new Date(startDateVal + 'T00:00:00');
    calendar.forEach((day, i) => {
      const d = new Date(sd); d.setDate(sd.getDate() + i);
      day.date = d.toISOString().slice(0, 10); // YYYY-MM-DD for badge parsing
    });
  }

  _audioStopForPlanChange();
  currentPlan   = calendar;
  checkStates   = {};
  reflections   = {};
  currentPlanId = null;  // new generation = new plan, don't overwrite existing saved plan
  lastMilestoneFired = 0;

  // Close builder modal and show the plan view
  closeBuilderModal();
  showPlanView();
  renderPlanTabs();

  renderPlan();
  updateProgress();
}

// ══════════════════════════════════════════════════════════════
// VIEW STATE
// ══════════════════════════════════════════════════════════════
let currentView    = 'month';
let calWeekOffset  = 0;

function setView(v) {
  currentView = v;
  ['month','week','list'].forEach(x => {
    const btn = document.getElementById('vbtn-' + x);
    if (btn) btn.classList.toggle('active', x === v);
  });
  if (v !== 'week') calWeekOffset = 0;
  renderPlan();
}

// ══════════════════════════════════════════════════════════════
// RENDER PLAN — dispatches to view
// ══════════════════════════════════════════════════════════════
function renderPlan() {
  const grid = document.getElementById('calendar-grid');
  const name = document.getElementById('plan-name').value || 'My Reading Plan';
  grid.innerHTML = '';
  document.getElementById('plan-title-display').textContent = name;
  document.getElementById('plan-section').style.display = 'block';
  document.getElementById('progress-section').style.display = 'block';

  // ── Render plan-level reminder card ──
  let reminderCard = document.getElementById('plan-reminder-card');
  if (!reminderCard) {
    reminderCard = document.createElement('div');
    reminderCard.id = 'plan-reminder-card';
    reminderCard.style.cssText = `
      background:var(--surface); border:1px solid var(--rule);
      border-radius:8px; padding:1.1rem 1.5rem; margin:2.5rem 0 1.5rem;
    `;
    reminderCard.innerHTML = `
      <button type="button" id="plan-reminder-head" aria-expanded="false" aria-controls="plan-reminder-body" style="
        font-family:'Cinzel',serif; font-size:0.8rem; letter-spacing:0.16em;
        text-transform:uppercase; color:var(--gold); width:100%;
        display:flex; align-items:center; gap:0.6rem; background:none; border:0; padding:0; cursor:pointer;
      ">Email Reminders
        <span style="flex:1;height:1px;background:var(--rule);display:block;"></span>
        <span id="plan-reminder-chev" aria-hidden="true" style="transition:transform .2s;">&#9662;</span>
      </button>
      <div id="plan-reminder-body" hidden style="margin-top:1rem;">
      <p style="font-family:'Cormorant Garamond',serif;font-style:italic;
        color:var(--text-mid);font-size:0.95rem;margin-bottom:0.9rem;">
        Get a daily email with a link to today's reading passage for this plan.
      </p>
      <div style="margin-bottom:0.6rem;">
        <label style="display:flex;align-items:center;gap:0.6rem;cursor:pointer;">
          <input type="checkbox" id="plan-reminder-enabled">
          <span style="font-family:'EB Garamond',serif;font-size:1rem;color:var(--text);">
            Send me daily reading reminders
          </span>
        </label>
      </div>
      <div id="plan-reminder-time-row" style="display:none;flex-wrap:wrap;
        align-items:center;gap:0.75rem;margin-bottom:0.9rem;">
        <label style="font-family:'Cormorant Garamond',serif;font-size:0.9rem;
          color:var(--text-mid);margin:0;">Remind me at:</label>
        <select id="plan-reminder-hour" style="width:auto;padding:0.35rem 0.6rem;font-size:0.95rem;">
          <option value="01">1</option><option value="02">2</option>
          <option value="03">3</option><option value="04">4</option>
          <option value="05">5</option><option value="06">6</option>
          <option value="07">7</option><option value="08">8</option>
          <option value="09" selected>9</option><option value="10">10</option>
          <option value="11">11</option><option value="12">12</option>
        </select>
        <select id="plan-reminder-ampm" style="width:auto;padding:0.35rem 0.6rem;font-size:0.95rem;">
          <option value="AM">AM</option>
          <option value="PM" selected>PM</option>
        </select>
        <label style="font-family:'Cormorant Garamond',serif;font-size:0.9rem;
          color:var(--text-mid);margin:0;">Timezone:</label>
        <select id="plan-reminder-tz" style="width:auto;padding:0.35rem 0.6rem;font-size:0.95rem;">
          <option value="America/New_York">Eastern (ET)</option>
          <option value="America/Chicago">Central (CT)</option>
          <option value="America/Denver">Mountain (MT)</option>
          <option value="America/Los_Angeles">Pacific (PT)</option>
          <option value="America/Anchorage">Alaska (AKT)</option>
          <option value="Pacific/Honolulu">Hawaii (HT)</option>
          <option value="Europe/London">London (GMT/BST)</option>
          <option value="Europe/Paris">Central Europe (CET)</option>
          <option value="Asia/Kolkata">India (IST)</option>
          <option value="Asia/Tokyo">Japan (JST)</option>
          <option value="Australia/Sydney">Sydney (AEST)</option>
        </select>
      </div>
      <button onclick="savePlanReminderSettings()" style="
        font-family:'Cinzel',serif; font-size:0.62rem; letter-spacing:0.12em;
        text-transform:uppercase; padding:0.4rem 1rem;
        background:var(--gold-faint); border:1px solid rgba(201,168,76,0.5);
        color:var(--gold); border-radius:2px; cursor:pointer; transition:all 0.2s;
      ">Save Reminder</button>
      <span id="plan-reminder-saved" style="display:none; margin-left:0.75rem;
        color:var(--gold); font-family:'Cormorant Garamond',serif;
        font-style:italic; font-size:0.9rem;">✓ Saved!</span>
          </div>
    `;
    reminderCard.querySelector('#plan-reminder-head').addEventListener('click', function () {
      const body = document.getElementById('plan-reminder-body');
      const open = body.hidden;
      body.hidden = !open;
      this.setAttribute('aria-expanded', String(open));
      document.getElementById('plan-reminder-chev').style.transform = open ? 'rotate(180deg)' : '';
    });
    // Wire up checkbox toggle
    reminderCard.querySelector('#plan-reminder-enabled')
      .addEventListener('change', function() {
        document.getElementById('plan-reminder-time-row').style.display
          = this.checked ? 'flex' : 'none';
      });
    // Insert after the progress section (below calendar)
    // Reminders sit below the calendar
    const calGrid = document.getElementById('calendar-grid');
    calGrid.parentNode.insertBefore(reminderCard, calGrid.nextSibling);
  }
  // Pre-fill if we have a saved plan loaded
  if (currentPlanId) loadPlanReminderSettings();

  // Always render month view
  renderMonthView(grid);

  // Highlight today's reading in the calendar
  highlightToday();

  // Update delete/restart button visibility
  updatePlanActionButtons();

  document.getElementById('plan-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── LIST VIEW (original card layout) ──────────────────────────
function renderListView(grid) {
  grid.className = 'calendar-grid';
  currentPlan.forEach((day, idx) => {
    const card = document.createElement('div');
    card.className = 'day-card' + (day.isGrace ? ' grace' : '') + (checkStates[idx] ? ' completed' : '');
    card.id = `day-${idx}`;
    card.style.animationDelay = `${Math.min(idx * 0.025, 0.6)}s`;

    let dateBadge = '';
    if (day.date) {
      const d = new Date(day.date + 'T00:00:00');
      const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      const dayNum = d.getDate();
      const dow   = d.toLocaleDateString('en-US', { weekday: 'short' });
      dateBadge = `<div class="day-date-badge">
        <span class="day-date-month">${month}</span>
        <span class="day-date-day">${dayNum}</span>
        <span class="day-date-dow">${dow}</span>
      </div>`;
    }

    let inner = `
      <div class="day-top">
        <span class="day-num">Day ${day.dayNum}</span>
        ${dateBadge}
      </div>`;

    if (day.isGrace) {
      inner += `<div class="grace-label">✦ Rest Day</div>
        <div class="day-verse-count" style="font-style:italic;color:#b84040;">Rest — catch up or reflect today.</div>`;
    } else {
      const { label, url } = formatPassage(day.chapters);
      inner += `
        <div class="day-passage">
          ${label ? `<button class="passage-open" onclick="openReader(${idx})">${label}</button>` : label}
        </div>
        <div class="day-verse-count" data-day="${idx}">${readingTimeLabel(day)}</div>
        <div class="day-check-row">
          <input type="checkbox" class="day-checkbox" id="chk-${idx}"
            ${checkStates[idx] ? 'checked' : ''}
            onchange="toggleCheck(${idx}); if(checkStates[${idx}]) launchConfetti(this);">
          <label class="day-check-label" for="chk-${idx}">
            ${checkStates[idx] ? 'Completed' : 'Mark Complete'}
          </label>
        </div>
        ${reflections[idx] ? `<div class="reflection-preview" id="refl-preview-${idx}">${reflections[idx].replace(/<[^>]*>/g,'').slice(0,120)}${reflections[idx].replace(/<[^>]*>/g,'').length > 120 ? '…' : ''}</div>` : ''}
        <button class="reflection-open-btn" onclick="openJournal(${idx})" id="refl-btn-${idx}">
          ${reflections[idx] ? '✎ Notes' : '✦ Notes'}
        </button>
        <button class="listen-btn" data-day="${idx}" onclick="listenDay(${idx})">🔊 Listen</button>`;
    }

    card.innerHTML = inner;
    grid.appendChild(card);
  });
}

// ── COMPACT CALENDAR CELL ──────────────────────────────────────
function renderCalCell(day, idx) {
  const el = document.createElement('div');
  el.className = 'cal-cell' + (day.isGrace ? ' grace' : '') + (checkStates[idx] ? ' completed' : '');
  el.id = `cal-cell-${idx}`;
  el.onclick = () => openDayPopover(idx);

  // Day number label — date number if we have a date, else plan day number
  const numLabel = day.date ? new Date(day.date + 'T00:00:00').getDate() : day.dayNum;
  let html = `<span class="cal-cell-num">${numLabel}</span>`;

  if (checkStates[idx]) html += `<span class="cal-cell-check">✓</span>`;

  if (day.isGrace) {
    html += `<span class="cal-cell-grace-lbl">✦ Rest</span>`;
  } else {
    const { label } = formatPassage(day.chapters);
    const short = label.length > 22 ? label.slice(0, 20) + '…' : label;
    html += `<span class="cal-cell-passage">${short}</span>`;
    html += `<span class="cal-cell-verses" data-day="${idx}">${readingTimeLabel(day)}</span>`;
  }

  el.innerHTML = html;
  return el;
}

// ── MONTH VIEW ─────────────────────────────────────────────────
function renderMonthView(grid) {
  grid.className = ''; // no card grid class
  const hasDate = currentPlan.length > 0 && !!currentPlan[0].date;

  if (!hasDate) {
    // No start date — show in 7-column week groups
    const DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const totalWeeks = Math.ceil(currentPlan.length / 7);
    for (let w = 0; w < totalWeeks; w++) {
      const lbl = document.createElement('div');
      lbl.className = 'cal-month-label';
      lbl.textContent = `Week ${w + 1}`;
      grid.appendChild(lbl);

      const cg = document.createElement('div');
      cg.className = 'cal-grid-7';
      DOW.forEach(d => {
        const hdr = document.createElement('div');
        hdr.className = 'cal-dow'; hdr.textContent = d;
        cg.appendChild(hdr);
      });
      for (let i = 0; i < 7; i++) {
        const planIdx = w * 7 + i;
        if (planIdx < currentPlan.length) {
          cg.appendChild(renderCalCell(currentPlan[planIdx], planIdx));
        } else {
          const empty = document.createElement('div');
          empty.className = 'cal-cell empty';
          cg.appendChild(empty);
        }
      }
      grid.appendChild(cg);
    }
    return;
  }

  // Build a date→index map
  const dayMap = {};
  currentPlan.forEach((day, idx) => { if (day.date) dayMap[day.date] = idx; });

  const firstDate = new Date(currentPlan[0].date + 'T00:00:00');
  const lastDate  = new Date(currentPlan[currentPlan.length - 1].date + 'T00:00:00');

  // Iterate month by month
  let monthStart = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
  while (monthStart <= lastDate) {
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);

    const lbl = document.createElement('div');
    lbl.className = 'cal-month-label';
    lbl.textContent = monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    grid.appendChild(lbl);

    const cg = document.createElement('div');
    cg.className = 'cal-grid-7';

    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
      const hdr = document.createElement('div');
      hdr.className = 'cal-dow'; hdr.textContent = d;
      cg.appendChild(hdr);
    });

    // Leading empty cells
    for (let i = 0; i < new Date(monthStart).getDay(); i++) {
      const e = document.createElement('div'); e.className = 'cal-cell empty';
      cg.appendChild(e);
    }

    // Days in month
    for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
      const ds = d.toISOString().slice(0, 10);
      if (ds in dayMap) {
        cg.appendChild(renderCalCell(currentPlan[dayMap[ds]], dayMap[ds]));
      } else {
        const oor = document.createElement('div');
        oor.className = 'cal-cell out-of-range';
        oor.innerHTML = `<span class="cal-cell-num" style="opacity:0.3">${d.getDate()}</span>`;
        cg.appendChild(oor);
      }
    }

    grid.appendChild(cg);
    monthStart = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);
  }
}

// ── WEEK VIEW ──────────────────────────────────────────────────
function prevWeek() { if (calWeekOffset > 0) { calWeekOffset--; renderPlan(); } }
function nextWeek() { calWeekOffset++; renderPlan(); }

function renderWeekView(grid) {
  grid.className = '';
  const hasDate    = currentPlan.length > 0 && !!currentPlan[0].date;
  const totalWeeks = Math.ceil(currentPlan.length / 7);

  // Clamp offset
  if (calWeekOffset >= totalWeeks) calWeekOffset = totalWeeks - 1;

  // Build nav bar
  let weekLabel = '';
  if (hasDate) {
    const startIdx = Math.min(calWeekOffset * 7, currentPlan.length - 1);
    const endIdx   = Math.min(startIdx + 6, currentPlan.length - 1);
    const sd = new Date(currentPlan[startIdx].date + 'T00:00:00');
    const ed = new Date(currentPlan[endIdx].date   + 'T00:00:00');
    weekLabel = sd.toLocaleDateString('en-US', { month:'short', day:'numeric' })
              + ' – '
              + ed.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  } else {
    weekLabel = `Week ${calWeekOffset + 1} of ${totalWeeks}`;
  }

  const nav = document.createElement('div');
  nav.className = 'cal-week-nav';
  nav.innerHTML = `
    <button class="cal-nav-btn" onclick="prevWeek()" ${calWeekOffset === 0 ? 'disabled' : ''}>‹</button>
    <span class="cal-week-label">${weekLabel}</span>
    <button class="cal-nav-btn" onclick="nextWeek()" ${calWeekOffset >= totalWeeks - 1 ? 'disabled' : ''}>›</button>
  `;
  grid.appendChild(nav);

  const cg = document.createElement('div');
  cg.className = 'cal-grid-7';
  grid.appendChild(cg);

  if (hasDate) {
    // Anchor to actual calendar week (Sun-Sat) for the first plan day in this week group
    const anchorIdx = Math.min(calWeekOffset * 7, currentPlan.length - 1);
    const anchor = new Date(currentPlan[anchorIdx].date + 'T00:00:00');
    const sunday = new Date(anchor); sunday.setDate(anchor.getDate() - anchor.getDay());

    const dayMap = {};
    currentPlan.forEach((day, idx) => { if (day.date) dayMap[day.date] = idx; });

    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
      const hdr = document.createElement('div');
      hdr.className = 'cal-dow'; hdr.textContent = d;
      cg.appendChild(hdr);
    });

    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday); d.setDate(sunday.getDate() + i);
      const ds = d.toISOString().slice(0, 10);
      if (ds in dayMap) {
        const cell = renderCalCell(currentPlan[dayMap[ds]], dayMap[ds]);
        cell.style.minHeight = '120px';
        cg.appendChild(cell);
      } else {
        const oor = document.createElement('div');
        oor.className = 'cal-cell out-of-range';
        oor.style.minHeight = '120px';
        oor.innerHTML = `<span class="cal-cell-num" style="opacity:0.25">${d.getDate()}</span>`;
        cg.appendChild(oor);
      }
    }
  } else {
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
      const hdr = document.createElement('div');
      hdr.className = 'cal-dow'; hdr.textContent = d;
      cg.appendChild(hdr);
    });

    for (let i = 0; i < 7; i++) {
      const planIdx = calWeekOffset * 7 + i;
      if (planIdx < currentPlan.length) {
        const cell = renderCalCell(currentPlan[planIdx], planIdx);
        cell.style.minHeight = '120px';
        cg.appendChild(cell);
      } else {
        const e = document.createElement('div');
        e.className = 'cal-cell empty'; e.style.minHeight = '120px';
        cg.appendChild(e);
      }
    }
  }
}

// ── DAY DETAIL POPOVER ─────────────────────────────────────────
function openDayPopover(idx) {
  const day  = currentPlan[idx];
  if (!day) return;
  // A reading day opens straight into the text; only rest days need the popover.
  if (!day.isGrace) { openReader(idx); return; }
  const body = document.getElementById('popover-body');

  let dateBadge = '';
  if (day.date) {
    const d   = new Date(day.date + 'T00:00:00');
    const mon = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const dn  = d.getDate();
    const dow = d.toLocaleDateString('en-US', { weekday: 'long' });
    dateBadge = `<div class="day-date-badge">
      <span class="day-date-month">${mon}</span>
      <span class="day-date-day">${dn}</span>
      <span class="day-date-dow">${dow}</span>
    </div>`;
  }

  const rightCol = dateBadge
    ? `<div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.2rem;">
        <button class="popover-close" onclick="closeDayPopover()" aria-label="Close">ESC ✕</button>
        ${dateBadge}
      </div>`
    : `<button class="popover-close" style="position:absolute;top:0.5rem;right:0.9rem;" onclick="closeDayPopover()" aria-label="Close">ESC ✕</button>`;

  let html = `<div class="day-top">
    <span class="day-num">Day ${day.dayNum}</span>
    ${rightCol}
  </div>`;

  if (day.isGrace) {
    html += `<div class="grace-label">✦ Rest Day</div>
      <div class="day-verse-count" style="font-style:italic;color:#b84040;margin-top:0.4rem;">Rest — catch up or reflect today.</div>`;
  } else {
    const { label, url } = formatPassage(day.chapters);
    html += `
      <div class="day-passage" style="margin-top:0.5rem;">
        ${url ? `<a href="${url}" target="_blank" rel="noopener">${label}</a>` : label}
      </div>
      <div class="day-verse-count" data-day="${idx}">${readingTimeLabel(day)}</div>
      <div class="day-check-row">
        <input type="checkbox" class="day-checkbox" id="pop-chk-${idx}"
          ${checkStates[idx] ? 'checked' : ''}
          onchange="toggleCheck(${idx}); if(checkStates[${idx}]) launchConfetti(this);">
        <label class="day-check-label" for="pop-chk-${idx}">
          ${checkStates[idx] ? 'Completed' : 'Mark Complete'}
        </label>
      </div>
      ${reflections[idx] ? `<div class="reflection-preview" style="margin-top:0.4rem;">${reflections[idx].replace(/<[^>]*>/g,'').slice(0,120)}${reflections[idx].replace(/<[^>]*>/g,'').length > 120 ? '…' : ''}</div>` : ''}
      <button class="reflection-open-btn" style="margin-top:0.4rem;" onclick="closeDayPopover(); setTimeout(()=>openJournal(${idx}),150);">
        ${reflections[idx] ? '✎ Notes' : '✦ Notes'}
      </button>
      <button class="listen-btn" data-day="${idx}" onclick="listenDay(${idx})" style="margin-top:0.4rem;">🔊 Listen</button>`;
  }

  body.innerHTML = html;
  document.getElementById('popover-overlay').classList.add('open');
  document.getElementById('day-popover').classList.add('open');
}

function closeDayPopover() {
  document.getElementById('popover-overlay').classList.remove('open');
  document.getElementById('day-popover').classList.remove('open');
}

// Close popover on Escape key
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDayPopover(); });
  
// ══════════════════════════════════════════════════════════════
// CONFETTI
// ══════════════════════════════════════════════════════════════
function launchConfetti(originEl) {
  const COLORS = ['#e63946','#f4a261','#f9c74f','#43aa8b','#4361ee','#7b2d8b','#ff6b9d','#06d6a0','#118ab2','#ffd166'];
  const SHAPES = ['square','circle'];
  const rect = originEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top  + rect.height / 2;
  const count = 38;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';

    const color  = COLORS[Math.floor(Math.random() * COLORS.length)];
    const shape  = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const size   = 6 + Math.random() * 7;
    const angle  = Math.random() * 360;
    const spread = 90 + Math.random() * 120;
    const rad    = (angle * Math.PI) / 180;
    const tx     = Math.cos(rad) * spread;
    const ty     = Math.sin(rad) * spread - 60; // bias upward

    piece.style.cssText = `
      left: ${cx}px; top: ${cy}px;
      width: ${size}px; height: ${size}px;
      background: ${color};
      border-radius: ${shape === 'circle' ? '50%' : '2px'};
      animation: confettiFall ${0.9 + Math.random() * 0.7}s ease-out forwards;
      animation-delay: ${Math.random() * 0.15}s;
      transform: translate(${tx}px, ${ty}px) rotate(${Math.random()*360}deg);
    `;

    // Override animation to use tx/ty offsets via keyframe
    const styleEl = document.createElement('style');
    const id = `cf-${Date.now()}-${i}`;
    piece.id = id;
    styleEl.textContent = `
      #${id} {
        animation: none;
        position: fixed;
        left: ${cx + tx * 0}px;
        top: ${cy}px;
        opacity: 1;
        transition: none;
      }
    `;
    document.head.appendChild(styleEl);

    // Simple JS-driven animation instead
    document.body.appendChild(piece);
    piece.style.left = cx + 'px';
    piece.style.top  = cy + 'px';
    piece.style.position = 'fixed';
    piece.style.zIndex   = '9999';
    piece.style.opacity  = '1';
    piece.style.transition = 'none';
    piece.style.animation = 'none';
    piece.style.transform = 'translate(0,0) rotate(0deg) scale(1)';

    const duration = 900 + Math.random() * 700;
    const startTime = performance.now();

    (function animate(now) {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      piece.style.left    = (cx + tx * eased) + 'px';
      piece.style.top     = (cy + ty * eased + 80 * t * t) + 'px'; // gravity
      piece.style.opacity = t < 0.7 ? 1 : 1 - ((t - 0.7) / 0.3);
      piece.style.transform = `rotate(${t * 540}deg) scale(${1 - t * 0.5})`;
      if (t < 1) requestAnimationFrame(animate);
      else { piece.remove(); styleEl.remove(); }
    })(startTime);
  }
}

// ══════════════════════════════════════════════════════════════
// INTERACTIONS
// ══════════════════════════════════════════════════════════════
function toggleCheck(idx) {
  checkStates[idx] = !checkStates[idx];

  // Update list view card
  const card = document.getElementById(`day-${idx}`);
  const lbl  = document.querySelector(`#day-${idx} .day-check-label`);
  if (card) card.classList.toggle('completed', checkStates[idx]);
  if (lbl)  lbl.textContent = checkStates[idx] ? '✓ Completed' : 'Mark Complete';

  // Update popover label if open
  const popLbl = document.querySelector(`label[for="pop-chk-${idx}"]`);
  if (popLbl) popLbl.textContent = checkStates[idx] ? '✓ Completed' : 'Mark Complete';

  // Update calendar cell (month/week view)
  const cell = document.getElementById(`cal-cell-${idx}`);
  if (cell) {
    cell.classList.toggle('completed', checkStates[idx]);
    let checkEl = cell.querySelector('.cal-cell-check');
    if (checkStates[idx] && !checkEl) {
      const sp = document.createElement('span');
      sp.className = 'cal-cell-check'; sp.textContent = '✓';
      cell.insertBefore(sp, cell.children[1] || null);
    } else if (!checkStates[idx] && checkEl) {
      checkEl.remove();
    }
  }

  updateProgress();
}

let quillInstance = null;
let quillDayIdx   = null;
let quillDebounce = null;

// The PDF and note-editor libraries are only downloaded the first time someone uses them.
const _libLoads = {};
function loadLib(src, css) {
  if (!_libLoads[src]) {
    _libLoads[src] = new Promise((resolve, reject) => {
      if (css) {
        const l = document.createElement('link');
        l.rel = 'stylesheet'; l.href = css;
        // Put the editor's stylesheet before this page's own styles so the page's tweaks still win.
        document.head.insertBefore(l, document.head.querySelector('style'));
      }
      const sc = document.createElement('script');
      sc.src = src;
      sc.onload = resolve;
      sc.onerror = () => { delete _libLoads[src]; reject(new Error('Could not load ' + src)); };
      document.head.appendChild(sc);
    });
  }
  return _libLoads[src];
}
const QUILL_JS  = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.min.js';
const QUILL_CSS = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css';

function openJournal(idx) {
  if (!window.Quill) {
    loadLib(QUILL_JS, QUILL_CSS)
      .then(() => openJournal(idx))
      .catch(() => showToast('Could not load the note editor. Check your connection and try again.', 'error'));
    return;
  }
  quillDayIdx = idx;
  const day = currentPlan[idx];
  if (!day) return;

  // Set title
  const { label } = day.isGrace ? { label: 'Rest Day' } : formatPassage(day.chapters);
  document.getElementById('journal-title').textContent = `Day ${day.dayNum} · ${label} — Notes`;

  // Open overlay
  document.getElementById('journal-overlay').classList.add('open');

  // Init Quill once
  if (!quillInstance) {
    quillInstance = new Quill('#quill-editor', {
      theme: 'snow',
      placeholder: 'Write your reflection here…',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ 'header': [1, 2, 3, false] }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'color': ['#4a90d9','#4a9d58','#f9d776','#f4a460','#e57373','#ba68c8','#f48fb1','#1a1a1a','#ffffff','#4dd0e1'] }],
          ['link'],
          ['clean']
        ]
      }
    });

    // Auto-save on text change
    quillInstance.on('text-change', () => {
      if (quillDayIdx === null) return;
      const html = quillInstance.root.innerHTML;
      const plainText = quillInstance.root.innerText.trim();
      reflections[quillDayIdx] = plainText ? html : '';
      clearTimeout(quillDebounce);
      quillDebounce = setTimeout(() => {
        persistReflection(quillDayIdx, reflections[quillDayIdx] || '');
      }, 1200);
    });
  }

  // Load existing content
  const existing = reflections[idx] || '';
  if (existing && existing.startsWith('<')) {
    quillInstance.root.innerHTML = existing;
  } else if (existing) {
    quillInstance.setText(existing);
  } else {
    quillInstance.setText('');
  }

  setTimeout(() => quillInstance.focus(), 100);
}

function closeJournal() {
  document.getElementById('journal-overlay').classList.remove('open');
  if (quillDayIdx !== null) {
    const html = quillInstance ? quillInstance.root.innerHTML : '';
    const plainText = quillInstance ? quillInstance.root.innerText.trim() : '';
    reflections[quillDayIdx] = plainText ? html : '';

    // Update preview and button on the day card
    const preview = document.getElementById(`refl-preview-${quillDayIdx}`);
    const btn     = document.getElementById(`refl-btn-${quillDayIdx}`);
    if (btn) btn.textContent = reflections[quillDayIdx] ? '✎ Notes' : '✦ Notes';
    if (preview) {
      preview.textContent = plainText.slice(0, 120) + (plainText.length > 120 ? '…' : '');
      preview.style.display = plainText ? '' : 'none';
    } else if (plainText) {
      // Create preview element if it doesn't exist yet
      const newPreview = document.createElement('div');
      newPreview.className = 'reflection-preview';
      newPreview.id = `refl-preview-${quillDayIdx}`;
      newPreview.textContent = plainText.slice(0, 120) + (plainText.length > 120 ? '…' : '');
      if (btn) btn.parentNode.insertBefore(newPreview, btn);
    }
  }
  quillDayIdx = null;
}

// Redo plan
let redoPlanId = null;

function openRedo(planId, planTitle, e) {
  e.stopPropagation();
  redoPlanId = planId;
  document.getElementById('redo-plan-title').textContent = `Redo — ${planTitle}`;
  document.getElementById('redo-start-date').value = new Date().toISOString().slice(0,10);
  document.getElementById('redo-overlay').classList.add('open');
}

function closeRedo() {
  document.getElementById('redo-overlay').classList.remove('open');
  redoPlanId = null;
}

async function confirmRedo() {
  if (!redoPlanId) return;
  const newStartDate = document.getElementById('redo-start-date').value;
  if (!newStartDate) { showToast('Pick a new start date.', 'error'); return; }
  const planId = redoPlanId;
  closeRedo();

  // Load the saved plan exactly as it is (readings, notes, same plan ID)
  await loadPlanFromDb(planId);
  if (currentPlanId !== planId || !currentPlan.length) return;

  // Tie each note to its reading (not its calendar slot), since re-dating
  // can move rest days around and shift day numbers
  const readingNotes = [], restNotes = [];
  currentPlan.forEach((d, idx) => {
    (d.isGrace ? restNotes : readingNotes).push(reflections[idx] || '');
  });

  // Same readings, same rest weekdays, new dates
  currentPlan = redatePlan(currentPlan, newStartDate);

  // Put the notes back on the matching days
  reflections = {};
  let r = 0, g = 0;
  currentPlan.forEach((d, idx) => {
    const note = d.isGrace ? restNotes[g++] : readingNotes[r++];
    if (note && note.trim()) reflections[idx] = note;
  });
  // If the new dates have fewer rest days, keep any leftover rest-day notes
  const leftover = restNotes.slice(g).filter(n => n && n.trim());
  if (leftover.length) {
    const lastIdx = currentPlan.length - 1;
    reflections[lastIdx] = [reflections[lastIdx], ...leftover].filter(Boolean).join('\n\n');
  }

  // Reset progress
  checkStates = {};
  lastMilestoneFired = 0;
  document.getElementById('start-date').value = newStartDate;
  document.getElementById('total-days').value = currentPlan.length;

  // Save over the same plan (update, not a new plan) and un-mark it completed
  await savePlanToDb();
  const { error: restartErr } = await _supabase.from('plans').update({ completed_at: null }).eq('id', planId);
  if (restartErr) showToast('Could not restart the plan. Please try again.', 'error');
  const cached = cachedPlans.find(p => p.id === planId);
  if (cached) cached.completed_at = null;

  renderPlanTabs();
  renderPlan();
  updateProgress();
  showToast('Plan restarted with your notes carried over ✓', 'success');
}

function toggleReflection(idx) {
  // Legacy fallback — now opens journal
  openJournal(idx);
}

function saveReflection(idx, val) {
  reflections[idx] = val;
  const saved = document.getElementById(`saved-${idx}`);
  if (saved) {
    saved.style.display = 'block';
    clearTimeout(saved._t);
    saved._t = setTimeout(() => { saved.style.display = 'none'; }, 1800);
  }
}

function toggleGrace(idx) {
  if (!currentPlan[idx]) return;
  currentPlan[idx].isGrace = !currentPlan[idx].isGrace;

  // Re-cluster chapters around the updated grace map — simple rebuild
  const graceIndices = currentPlan.map((d,i) => d.isGrace ? i : -1).filter(i => i >= 0);
  const readingSlots = currentPlan.filter(d => !d.isGrace).length;
  const chapters = buildChapterList();
  const clustered = clusterChapters(chapters, readingSlots);

  let ri = 0;
  currentPlan.forEach((d, i) => {
    if (!d.isGrace) { d.chapters = clustered[ri]?.chapters || []; d.verseCount = clustered[ri]?.verseCount || 0; ri++; }
  });

  renderPlan();
  updateProgress();
}

  // ══════════════════════════════════════════════════════════════
// SHARE FEATURES
// ══════════════════════════════════════════════════════════════
let lastMilestoneFired = 0; // guards the completion modal: fires once per plan

// Describes the plan, not the reader's progress: the button shares the plan
// itself, so a percentage would be both off-topic and a little boastful.
function getPlanShareText() {
  const nameEl = document.getElementById('plan-name');
  const name   = (nameEl ? nameEl.value : '').trim();
  const tail   = ' — a Bible reading plan on WhosoeverBelieves.com';
  if (name) return '"' + name + '"' + tail;
  if (!selectedBooks.length) return 'A Bible reading plan on WhosoeverBelieves.com';
  const days  = currentPlan.length ||
                parseInt(document.getElementById('total-days').value, 10) || 30;
  const books = selectedBooks.length === 1 ? selectedBooks[0]
              : selectedBooks.length <= 3 ? selectedBooks.join(', ')
              : selectedBooks.length + ' books';
  return books + ' in ' + days + ' days' + tail;
}

const SHARE_BASE = 'https://whosoeverbelieves.com/bible-reading-plans';

// ══════════════════════════════════════════════════════════════
// SHAREABLE PLAN LINKS
// A plan is a pure function of its settings, so a link only has to
// carry the settings — no stored row, no share token.
//   b = books (3-letter codes, ranges allowed)   d = total days
//   n = plan name (display label only)
// A shared plan always starts on the day it is opened. The sharer's
// own start date is deliberately never carried across.
// ══════════════════════════════════════════════════════════════
const BOOK_CODES = {
  "Genesis":"gen","Exodus":"exo","Leviticus":"lev","Numbers":"num","Deuteronomy":"deu",
  "Joshua":"jos","Judges":"jdg","Ruth":"rut","1 Samuel":"1sa","2 Samuel":"2sa",
  "1 Kings":"1ki","2 Kings":"2ki","1 Chronicles":"1ch","2 Chronicles":"2ch","Ezra":"ezr",
  "Nehemiah":"neh","Esther":"est","Job":"job","Psalms":"psa","Proverbs":"pro",
  "Ecclesiastes":"ecc","Song of Songs":"sng","Isaiah":"isa","Jeremiah":"jer","Lamentations":"lam",
  "Ezekiel":"ezk","Daniel":"dan","Hosea":"hos","Joel":"jol","Amos":"amo",
  "Obadiah":"oba","Jonah":"jon","Micah":"mic","Nahum":"nam","Habakkuk":"hab",
  "Zephaniah":"zep","Haggai":"hag","Zechariah":"zec","Malachi":"mal",
  "Matthew":"mat","Mark":"mrk","Luke":"luk","John":"jhn","Acts":"act","Romans":"rom",
  "1 Corinthians":"1co","2 Corinthians":"2co","Galatians":"gal","Ephesians":"eph",
  "Philippians":"php","Colossians":"col","1 Thessalonians":"1th","2 Thessalonians":"2th",
  "1 Timothy":"1ti","2 Timothy":"2ti","Titus":"tit","Philemon":"phm","Hebrews":"heb",
  "James":"jas","1 Peter":"1pe","2 Peter":"2pe","1 John":"1jn","2 John":"2jn",
  "3 John":"3jn","Jude":"jud","Revelation":"rev"
};
const CODE_BOOKS = {};
Object.keys(BOOK_CODES).forEach(b => { CODE_BOOKS[BOOK_CODES[b]] = b; });

function canonIndex(book) { return Object.keys(BIBLE).indexOf(book); }

// Collapse runs of three or more canonically consecutive books into gen-deu
function encodeBookList(books) {
  const canon = Object.keys(BIBLE);
  const out = [];
  let i = 0;
  while (i < books.length) {
    let j = i;
    while (j + 1 < books.length &&
           canonIndex(books[j + 1]) === canonIndex(books[j]) + 1) j++;
    if (j - i >= 2) out.push(BOOK_CODES[books[i]] + '-' + BOOK_CODES[books[j]]);
    else for (let k = i; k <= j; k++) out.push(BOOK_CODES[books[k]]);
    i = j + 1;
  }
  return out.filter(Boolean).join(',');
}

function decodeBookList(str) {
  const canon = Object.keys(BIBLE);
  const books = [];
  String(str).split(',').forEach(tok => {
    const t = tok.trim().toLowerCase();
    if (!t) return;
    if (t.indexOf('-') > 0) {
      const parts = t.split('-');
      const a = CODE_BOOKS[parts[0]], b = CODE_BOOKS[parts[1]];
      if (!a || !b) return;
      const ia = canon.indexOf(a), ib = canon.indexOf(b);
      if (ia < 0 || ib < 0 || ib < ia) return;
      for (let k = ia; k <= ib; k++) books.push(canon[k]);
    } else if (CODE_BOOKS[t]) {
      books.push(CODE_BOOKS[t]);
    }
  });
  return books.filter((b, i) => books.indexOf(b) === i);
}

function buildPlanShareUrl() {
  if (!selectedBooks.length) return SHARE_BASE;
  const params = [];
  params.push('b=' + encodeBookList(selectedBooks));
  // currentPlan is the source of truth for length: a plan loaded from the
  // database restores its books but not the total-days input box.
  const days = currentPlan.length ||
               parseInt(document.getElementById('total-days').value, 10) || 30;
  if (days !== 30) params.push('d=' + days);
  const nameEl = document.getElementById('plan-name');
  const name   = (nameEl ? nameEl.value : '').trim().slice(0, 60);
  if (name) params.push('n=' + encodeURIComponent(name).replace(/%20/g, '+'));
  return SHARE_BASE + '?' + params.join('&');
}

function todayISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
           .toISOString().slice(0, 10);
}

function showSharedPlanNote() {
  const section = document.getElementById('plan-section');
  if (!section || document.getElementById('shared-plan-note')) return;
  const note = document.createElement('div');
  note.id = 'shared-plan-note';
  note.style.cssText =
    'border-left:2px solid var(--gold);background:var(--glass);' +
    'padding:0.75rem 1rem;margin-bottom:1.25rem;border-radius:0 4px 4px 0;' +
    "font-family:'Cormorant Garamond',serif;font-size:1rem;color:var(--text-mid);";
  // Fixed copy, no user data - safe to set as markup.
  note.innerHTML =
    'Someone shared this Bible reading plan with you! It starts today. ' +
    '<a href="#" id="shared-plan-later" style="color:var(--gold);' +
    'text-decoration:underline;text-decoration-color:rgba(201,168,76,0.4);">' +
    'Start it later</a>';
  section.insertBefore(note, section.firstChild);
  const later = document.getElementById('shared-plan-later');
  if (later) later.addEventListener('click', function (e) {
    e.preventDefault();
    openBuilderModal();   // books, length and name are already filled in
  });
}

// Returns true when a shared plan was applied, so sign-in does not
// auto-load a different plan over the top of it.
function applySharedPlanFromUrl() {
  let params;
  try { params = new URLSearchParams(window.location.search); }
  catch (e) { return false; }

  const b = params.get('b');
  if (!b) return false;

  const books = decodeBookList(b);
  if (!books.length) return false;

  selectedBooks = books;

  const days = parseInt(params.get('d'), 10);
  document.getElementById('total-days').value =
    (days > 0 && days <= 3650) ? days : 30;

  const name = (params.get('n') || '').slice(0, 60);
  document.getElementById('plan-name').value = name || 'Shared Reading Plan';

  // A shared plan always begins on the day it is opened.
  document.getElementById('start-date').value = todayISO();

  renderBookGrid();
  updateBookSummary();
  renderOrderCard();
  generatePlan();
  showSharedPlanNote();
  // Rendering the plan leaves the page scrolled down, which would hide the
  // note behind the sticky header on desktop.
  window.scrollTo(0, 0);
  return true;
}

function copyShareLink() {
  // Just the link: pasted into a message, the preview does the rest.
  const text = buildPlanShareUrl();
  navigator.clipboard.writeText(text).then(() => {
    showToast('Plan link copied ✓', 'success');
  }).catch(() => {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Plan link copied ✓', 'success');
  });
}

// SVG icon strings for share buttons


// Completion modal for 100%
function showCompletionModal() {
  const name = document.getElementById('plan-name').value || 'Your Bible Reading Plan';
  const readingDays = currentPlan.filter(d => !d.isGrace);
  const totalVerses = readingDays.reduce((s, d) => s + d.verseCount, 0);

  document.getElementById('completion-heading').textContent = `You Finished ${name}!`;
  document.getElementById('completion-sub').textContent =
    `${readingDays.length} readings completed · ${totalVerses.toLocaleString()} verses read`;
  // Restarting needs a saved plan to carry notes back into, so the button
  // only appears for a plan that is actually in the account.
  document.getElementById('completion-restart-btn').style.display =
    currentPlanId ? '' : 'none';
  document.getElementById('completion-overlay').classList.add('open');

  // Mark plan as completed in DB if saved
  if (currentUser && currentPlanId) {
    _supabase.from('plans').update({ completed_at: new Date().toISOString() }).eq('id', currentPlanId);
  }
}

function closeCompletion() {
  document.getElementById('completion-overlay').classList.remove('open');
}

// Completion detection — called from updateProgress().
// The 25/50/75% congratulatory toasts were removed in Oct 2026: their markup
// had never been on the page, and the progress bar's own share options cover
// that ground. lastMilestoneFired stays as the once-only guard for the modal.
function checkMilestones(pct) {
  if (pct < 100 || lastMilestoneFired >= 100) return;
  lastMilestoneFired = 100;
  showCompletionModal();
}
  
function updateProgress() {
  const readingDays = currentPlan.filter(d => !d.isGrace);
  const done  = readingDays.filter((d,i) => checkStates[currentPlan.indexOf(d)]).length;
  const total = readingDays.length;
  const pct   = total ? Math.round((done / total) * 100) : 0;
  const versesRead = readingDays
    .filter((d, i) => checkStates[currentPlan.indexOf(d)])
    .reduce((s, d) => s + d.verseCount, 0);

  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-pct-text').textContent = pct + '%';
  document.getElementById('stat-done').textContent = done;
  document.getElementById('stat-reading').textContent = total;
  document.getElementById('stat-verses').textContent = versesRead.toLocaleString();

  checkMilestones(pct);
}

// ══════════════════════════════════════════════════════════════
// SUPABASE INIT
// ══════════════════════════════════════════════════════════════
// ⚠️  REPLACE these two values with your actual Supabase project credentials.
// Find them in: Supabase Dashboard → Project Settings → API
const SUPABASE_URL  = 'https://tgzsyfmnzagqijjlzxsa.supabase.co';
const SUPABASE_ANON = 'sb_publishable_gck7v-L2PDbW2JKUoxTHDA_FidLWw8H';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

// ── AUTH STATE ──
let currentUser    = null;
let currentPlanId  = null;   // UUID of the saved plan in DB (null if unsaved)
let saveDebounce   = null;

// ══════════════════════════════════════════════════════════════
// AUTH HELPERS
// ══════════════════════════════════════════════════════════════
async function initAuth() {
  try {
    if (sessionStorage.getItem('rpSignedOut')) {
      sessionStorage.removeItem('rpSignedOut');
      showToast('Signed out successfully.', 'success');
    }
  } catch (e) {}
  const { data: { session } } = await _supabase.auth.getSession();
  if (session?.user) await onSignedIn(session.user);

  _supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      // User clicked the reset link in their email — open modal to set new password
      openAuthModal();
      switchAuthTab('newpassword');
    } else if (session?.user) {
      await onSignedIn(session.user);
    } else {
      onSignedOut();
    }
  });
}

async function signInWithGoogle() {
  const { error } = await _supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: 'https://whosoeverbelieves.com/bible-reading-plans.html' }
  });
  if (error) showAuthError('signin', error.message);
}

async function signInWithDiscord() {
  const { error } = await _supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: { redirectTo: 'https://whosoeverbelieves.com/bible-reading-plans.html' }
  });
  if (error) showAuthError('signin', error.message);
}

async function sendPasswordReset() {
  const email = document.getElementById('reset-email').value.trim();
  const err   = document.getElementById('reset-error');
  const ok    = document.getElementById('reset-success');
  err.textContent = ''; ok.textContent = '';
  if (!email) { err.textContent = 'Please enter your email address.'; return; }
  const { error } = await _supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://whosoeverbelieves.com/bible-reading-plans.html'
  });
  if (error) { err.textContent = error.message; }
  else { ok.textContent = 'Reset link sent — check your inbox.'; }
}

async function setNewPassword() {
  const pass = document.getElementById('newpassword-input').value;
  const err  = document.getElementById('newpassword-error');
  const ok   = document.getElementById('newpassword-success');
  err.textContent = ''; ok.textContent = '';
  if (pass.length < 6) { err.textContent = 'Password must be at least 6 characters.'; return; }
  const { error } = await _supabase.auth.updateUser({ password: pass });
  if (error) { err.textContent = error.message; }
  else {
    ok.textContent = 'Password updated! You are now signed in.';
    setTimeout(() => closeModal(), 2000);
  }
}

async function onSignedIn(user) {
  currentUser = user;
  document.getElementById('user-bar').style.display = 'block';
  document.getElementById('user-email-display').textContent = user.email;
  // Swap nav buttons: hide Sign In, show My Plans
  document.getElementById('nav-signin-btn').style.display = 'none';
  closeModal();
  await ensureProfile(user);
  await loadSavedPlans(true);  // auto-load most recent plan

  // If we were mid-save, complete it now
  if (currentPlan.length && !currentPlanId) {
    showToast('Signed in! Saving your plan…', 'success');
    await savePlanToDb();
  }
}

function onSignedOut() {
  // A real sign-out (not the first check on page load): wipe the page so a
  // personal plan and notes are not left on screen. Reloading gives a clean
  // signed-out page; nothing about the plan is stored in the browser.
  if (currentUser) {
    currentUser = null; currentPlan = []; reflections = {}; checkStates = {}; cachedPlans = [];
    try { _audio.pause(); } catch (e) {}
    try { sessionStorage.setItem('rpSignedOut', '1'); } catch (e) {}
    location.replace(location.pathname);
    return;
  }
  currentUser   = null;
  currentPlanId = null;
  cachedPlans   = [];
  document.getElementById('user-bar').style.display = 'none';
  // Swap nav buttons back
  document.getElementById('nav-signin-btn').style.display = '';
  // Reset to welcome state if no plan is currently generated
  if (!currentPlan.length) showWelcomeState();
  else renderPlanTabs();
}

async function ensureProfile(user) {
  const { data } = await _supabase.from('profiles').select('id').eq('id', user.id).single();
  if (!data) {
    const { error: profErr } = await _supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      display_name: user.user_metadata?.display_name || null
    });
    if (profErr) console.warn('[plans] could not create the profile row:', profErr.message);
  }
}

// ── SIGN IN ──
async function signIn() {
  clearAuthErrors();
  const email = document.getElementById('signin-email').value.trim();
  const pass  = document.getElementById('signin-password').value;
  if (!email || !pass) { showAuthError('signin', 'Please enter your email and password.'); return; }

  const { error } = await _supabase.auth.signInWithPassword({ email, password: pass });
  if (error) showAuthError('signin', error.message);
}

// ── SIGN UP ──
async function signUp() {
  clearAuthErrors();
  const name  = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const pass  = document.getElementById('signup-password').value;
  if (!email || !pass) { showAuthError('signup', 'Email and password are required.'); return; }
  if (pass.length < 6) { showAuthError('signup', 'Password must be at least 6 characters.'); return; }

  const { error } = await _supabase.auth.signUp({
    email, password: pass,
    options: { data: { display_name: name } }
  });
  if (error) showAuthError('signup', error.message);
  else document.getElementById('signup-success').textContent = 'Account created! Check your email to confirm, then sign in.';
}

// ── MAGIC LINK ──
async function sendMagicLink() {
  clearAuthErrors();
  const email = document.getElementById('magic-email').value.trim();
  if (!email) { showAuthError('magic', 'Please enter your email address.'); return; }

  const { error } = await _supabase.auth.signInWithOtp({ email });
  if (error) showAuthError('magic', error.message);
  else document.getElementById('magic-success').textContent = 'Magic link sent! Check your inbox.';
}

async function signOut() {
  await _supabase.auth.signOut();
}

// ── MODAL HELPERS ──
function switchAuthTab(tab) {
  const tabs  = ['signin','signup','magic','reset','newpassword'];
  document.querySelectorAll('.auth-tab').forEach((t, i) => {
    t.classList.toggle('active', tabs[i] === tab);
  });
  document.querySelectorAll('.auth-form').forEach((f, i) => {
    f.classList.toggle('active', tabs[i] === tab);
  });
  clearAuthErrors();
}
function showAuthError(form, msg) { document.getElementById(`${form}-error`).textContent = msg; }
function clearAuthErrors() {
  ['signin-error','signup-error','magic-error','signup-success','magic-success','reset-error','reset-success','newpassword-error','newpassword-success']
    .forEach(id => { const el = document.getElementById(id); if (el) el.textContent = ''; });
}
/* ── NAV: FONT SIZE ── */
function rpSetSize(size) {
  const html = document.documentElement;
  ['font-small', 'font-large'].forEach(c => html.classList.remove(c));
  if (size !== 'default') html.classList.add(size);
  localStorage.setItem('fontPref', size);
  // Update active state on nav buttons
  document.getElementById('nav-font-small').classList.toggle('active', size === 'font-small');
  document.getElementById('nav-font-default').classList.toggle('active', size === 'default');
  document.getElementById('nav-font-large').classList.toggle('active', size === 'font-large');
}

/* ── NAV: THEME TOGGLE ── */
function rpToggleTheme() {
  const isLight = document.documentElement.classList.toggle('light-mode');
  localStorage.setItem('themePref', isLight ? 'light' : 'dark');
  document.getElementById('nav-theme-btn').textContent = isLight ? '🌙' : '☀︎';
}

/* ── NAV: OPEN AUTH MODAL ── */
function openAuthModal() { document.getElementById('auth-modal').classList.add('open'); }

function showSaveModal() { document.getElementById('auth-modal').classList.add('open'); }
function closeModal()    { document.getElementById('auth-modal').classList.remove('open'); clearAuthErrors(); }

// ══════════════════════════════════════════════════════════════
// PLAN PERSISTENCE
// ══════════════════════════════════════════════════════════════

// Called by the Save Plan button
async function handleSavePlan() {
  if (!currentPlan.length) { showToast('Generate a plan first.', 'error'); return; }
  if (!currentUser) { showSaveModal(); return; }

  // Check for duplicate plan names
  const nameInput = document.getElementById('plan-name');
  let name = nameInput.value.trim().slice(0, 60) || 'Untitled Plan';

  const { data: existing } = await _supabase
    .from('plans')
    .select('id, title')
    .eq('user_id', currentUser.id)
    .eq('title', name);

  if (existing?.length) {
    // Auto-append (Copy) and notify — no dialog needed
    name = `${name} (Copy)`;
    nameInput.value = name;
    showToast(`Saved as "${name}" — a plan with that name already exists.`, 'success');
  }

  await savePlanToDb();
}

// Flash the auto-save indicator
function flashAutosave(text = 'Auto-saved') {
  const toast = document.getElementById('autosave-toast');
  const dot   = document.getElementById('autosave-toast-dot');
  const label = document.getElementById('autosave-toast-text');
  if (!toast) return;
  label.textContent = text;
  dot.classList.add('saving');
  toast.classList.add('show');
  clearTimeout(flashAutosave._t);
  flashAutosave._t = setTimeout(() => {
    toast.classList.remove('show');
    dot.classList.remove('saving');
  }, 2500);
}

async function savePlanToDb() {
  const btn  = document.getElementById('save-plan-btn');
  const name = document.getElementById('plan-name').value.slice(0, 60) || 'Untitled Plan';
  if (btn) { btn.textContent = 'Saving…'; btn.disabled = true; }

  try {
    // ── 1. Upsert the plan row ──
    const planPayload = {
      user_id:      currentUser.id,
      title:        name,
      books:        selectedBooks,
      total_days:   currentPlan.length,
      reading_days: currentPlan.filter(d => !d.isGrace).length,
      grace_day_pattern: 'custom',
      grace_days:   currentPlan.map((d,i) => d.isGrace ? i : -1).filter(i => i >= 0),
      translation:  document.getElementById('translation').value,
      start_date:   document.getElementById('start-date').value || null
    };

    let planId = currentPlanId;

    if (planId) {
      const { error: planErr } = await _supabase.from('plans').update(planPayload).eq('id', planId);
      if (planErr) throw planErr;
    } else {
      const { data, error } = await _supabase.from('plans').insert(planPayload).select('id').single();
      if (error) throw error;
      planId = data.id;
      currentPlanId = planId;
    }

    // ── 2. Upsert plan_days ──
    const dayRows = currentPlan.map((day, idx) => {
      const { label, url } = day.isGrace ? { label: '', url: '' } : formatPassage(day.chapters);
      return {
        plan_id:         planId,
        day_number:      day.dayNum,
        is_grace_day:    day.isGrace,
        passages:        day.chapters ? day.chapters.map(c => `${c.book} ${c.chapter}`) : [],
        verse_count:     day.verseCount || 0,
        checked_off:     !!checkStates[idx],
        checked_at:      checkStates[idx] ? new Date().toISOString() : null,
        date_assigned:   day.date || null,
        biblegateway_url: url || null
      };
    });

    // Delete old days and re-insert (simplest safe upsert for ordered arrays)
    const { error: delErr } = await _supabase.from('plan_days').delete().eq('plan_id', planId);
    if (delErr) throw delErr;
    const { error: dayErr } = await _supabase.from('plan_days').insert(dayRows);
    if (dayErr) throw dayErr;

    // ── 3. Upsert reflections ──
    const reflRows = [];
    for (const [idxStr, body] of Object.entries(reflections)) {
      const idx = parseInt(idxStr);
      if (!body?.trim()) continue;
      reflRows.push({ user_id: currentUser.id, plan_day_index: idx, body, plan_id: planId });
    }
    if (reflRows.length) {
      // We'll store reflections with plan_id + day_number as the key
      // Use the plan_days IDs we just inserted
      const { data: savedDays } = await _supabase
        .from('plan_days').select('id, day_number').eq('plan_id', planId);

      if (savedDays) {
        const reflInserts = reflRows.map(r => {
          const match = savedDays.find(d => d.day_number === currentPlan[r.plan_day_index]?.dayNum);
          return match ? { user_id: currentUser.id, plan_day_id: match.id, body: r.body } : null;
        }).filter(Boolean);

        if (reflInserts.length) {
          const { error: reflErr } = await _supabase.from('reflections').upsert(reflInserts, {
            onConflict: 'user_id,plan_day_id'
          });
          if (reflErr) throw reflErr;
        }
      }
    }

    showToast('Plan saved ✓', 'success');
    if (btn) btn.textContent = '✓ Saved';
    setTimeout(() => { if (btn) { btn.textContent = 'Save'; btn.disabled = false; } }, 2000);

    // Refresh tab bar to include newly saved plan
    if (currentUser) {
      const { data: freshPlans } = await _supabase
        .from('plans')
        .select('id, title, books, total_days, reading_days, created_at, completed_at')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });
      if (freshPlans) { cachedPlans = freshPlans; renderPlanTabs(); }
    }

  } catch (err) {
    console.error('Save error:', err);
    showToast('Save failed — please try again.', 'error');
    if (btn) { btn.textContent = 'Save'; btn.disabled = false; }
  }
}

// ── AUTO-SAVE check state ──
async function persistCheckState(idx) {
  if (!currentUser || !currentPlanId) return;
  const day = currentPlan[idx];
  if (!day) return;

  const { data: pd } = await _supabase
    .from('plan_days')
    .select('id')
    .eq('plan_id', currentPlanId)
    .eq('day_number', day.dayNum)
    .single();

  if (pd) {
    const { error: checkErr } = await _supabase.from('plan_days').update({
      checked_off: !!checkStates[idx],
      checked_at:  checkStates[idx] ? new Date().toISOString() : null
    }).eq('id', pd.id);
    if (checkErr) {
      // Put the tick back where it was. Saying "Auto-saved" over a failed
      // write loses the reader's day without either of us finding out.
      checkStates[idx] = !checkStates[idx];
      renderPlan();
      updateProgress();
      flashAutosave('Not saved — check your connection');
      return;
    }
    flashAutosave();
  }
}

// ── AUTO-SAVE reflection ──
async function persistReflection(idx, body) {
  if (!currentUser || !currentPlanId) return;
  const day = currentPlan[idx];
  if (!day) return;

  const { data: pd } = await _supabase
    .from('plan_days')
    .select('id')
    .eq('plan_id', currentPlanId)
    .eq('day_number', day.dayNum)
    .single();

  if (pd) {
    const { error: noteErr } = await _supabase.from('reflections').upsert(
      { user_id: currentUser.id, plan_day_id: pd.id, body },
      { onConflict: 'user_id,plan_day_id' }
    );
    if (noteErr) { flashAutosave('Note not saved — check your connection'); return; }
    flashAutosave('Note auto-saved');
  }
}

// ══════════════════════════════════════════════════════════════
// LOAD SAVED PLANS
// ══════════════════════════════════════════════════════════════
async function loadSavedPlans(autoLoad) {
  if (!currentUser) return;

  // Load plans from Supabase
  const { data: plans, error } = await _supabase
    .from('plans')
    .select('id, title, books, total_days, reading_days, created_at, completed_at, show_on_home')
    .eq('user_id', currentUser.id)
    .order('created_at', { ascending: false });

  if (error || !plans?.length) {
    cachedPlans = [];
    renderPlanTabs();
    if (!currentPlan.length) showWelcomeState();
    return;
  }

  // Cache for tab rendering
  cachedPlans = plans;
  renderPlanTabs();

  // Which plan to open, in order: the one named in the link (the homepage sends
  // ?plan=<id> so both pages agree), then the one pinned to the homepage, then
  // the most recent. Before this, the homepage could show one plan and this page
  // open another, because each picked on its own.
  if (autoLoad && !currentPlan.length) {
    let wanted = null;
    try { wanted = new URLSearchParams(window.location.search).get('plan'); } catch (e) {}
    const target = (wanted && plans.find(p => p.id === wanted && !p.completed_at))
                || plans.find(p => p.show_on_home && !p.completed_at)
                || plans.find(p => !p.completed_at);
    if (target) {
      await loadPlanFromDb(target.id);
      // Arriving from the homepage's Read button means today's reading, not the
      // top of the plan. goToToday needs the meta pass that renderPlan triggers.
      if (wanted) setTimeout(function () {
        var btn = document.getElementById('rp-today-btn');
        if (btn && !btn.hidden) goToToday();
      }, 600);
      return;
    }
  }

  // If we have plans but nothing loaded, show tabs + welcome
  if (!currentPlan.length) {
    const firstActive = plans.find(p => !p.completed_at);
    if (firstActive) {
      showPlanView();
    } else {
      showWelcomeState();
    }
  }
}

/* ── Header inline rename ── */
function startHeaderRename() {
  if (!currentPlanId) return;
  const titleEl = document.getElementById('plan-title-display');
  const renameBtn = document.getElementById('header-rename-btn');
  if (!titleEl) return;

  const current = titleEl.textContent;

  // Hide pencil while editing
  if (renameBtn) renameBtn.style.display = 'none';

  // Replace title with input
  const input = document.createElement('input');
  input.className = 'header-rename-input';
  input.value = current;
  titleEl.replaceWith(input);
  input.focus();
  input.select();

  const commit = async () => {
    const newTitle = input.value.trim() || current;

    // Restore the title element
    const restored = document.createElement('div');
    restored.className = 'plan-title';
    restored.id = 'plan-title-display';
    restored.textContent = newTitle;
    input.replaceWith(restored);

    // Show pencil again
    if (renameBtn) renameBtn.style.display = '';

    if (newTitle === current) return;

    // Update in Supabase
    const { error } = await _supabase
      .from('plans')
      .update({ title: newTitle })
      .eq('id', currentPlanId)
      .eq('user_id', currentUser.id);

    if (error) {
      showToast('Could not rename plan.', 'error');
      restored.textContent = current;
    } else {
      showToast('Plan renamed.', 'success');
      // Sync the builder name field
      const nameInput = document.getElementById('plan-name');
      if (nameInput) nameInput.value = newTitle;
      // Update cached plan title so tabs reflect the change
      const cached = cachedPlans.find(p => p.id === currentPlanId);
      if (cached) cached.title = newTitle;
      renderPlanTabs();
    }
  };

  input.addEventListener('blur', commit);
  input.addEventListener('keydown', ev => {
    if (ev.key === 'Enter')  { ev.preventDefault(); input.blur(); }
    if (ev.key === 'Escape') { input.value = current; input.blur(); }
  });
}

async function loadPlanFromDb(planId) {
  showToast('Loading plan…', 'success');

  const { data: plan } = await _supabase
    .from('plans').select('*').eq('id', planId).single();

  const { data: days } = await _supabase
    .from('plan_days').select('*, reflections(body)')
    .eq('plan_id', planId).order('day_number', { ascending: true });

  if (!plan || !days) { showToast('Could not load plan.', 'error'); return; }

  // Restore state
  _audioStopForPlanChange();
  currentPlanId   = planId;
  selectedBooks   = plan.books || [];
  checkStates     = {};
  reflections     = {};
  lastMilestoneFired = 0;

  // Re-render book chips and order card
  renderBookGrid();
  renderOrderCard();
  document.getElementById('plan-name').value = plan.title;
  document.getElementById('translation').value = plan.translation || 'WEB';
  if (plan.start_date) document.getElementById('start-date').value = plan.start_date;

  // Rebuild currentPlan from saved days
  currentPlan = days.map((d, idx) => {
    const chapters = (d.passages || []).map(p => {
      const parts = p.split(' ');
      const ch    = parseInt(parts[parts.length - 1]);
      const book  = parts.slice(0, parts.length - 1).join(' ');
      const verses = BIBLE[book]?.chapters[ch - 1] || 0;
      return { book, chapter: ch, verses };
    });
    if (d.checked_off) checkStates[idx] = true;
    if (d.reflections?.[0]?.body) reflections[idx] = d.reflections[0].body;
    return {
      dayNum:      d.day_number,
      isGrace:     d.is_grace_day,
      chapters,
      verseCount:  d.verse_count,
      checked:     d.checked_off,
      date:        d.date_assigned
    };
  });

  // Show the plan view and update tabs
  showPlanView();
  renderPlanTabs();

  renderPlan();
  updateProgress();
  showToast(`"${plan.title}" loaded ✓`, 'success');
  document.getElementById('plan-section').scrollIntoView({ behavior:'smooth' });
  const saveBtn = document.getElementById('save-plan-btn');
  if (saveBtn) saveBtn.textContent = 'Save';
}

// ══════════════════════════════════════════════════════════════
// EXPORT / DOWNLOAD
// ══════════════════════════════════════════════════════════════
function esc(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Build the printable worksheet, then hand off to the browser's print
// dialog, where "Save as PDF" is the usual destination. Printing rather
// than drawing a PDF keeps the site's own fonts and renders each saved
// reflection as the formatted note it already is.
function downloadPDF() {
  if (!currentPlan.length) { showToast('Generate a plan first.', 'error'); return; }

  const name = document.getElementById('plan-name').value || 'My Reading Plan';
  const translation = document.getElementById('translation').value || 'WEB';
  const readingDays = currentPlan.filter(d => !d.isGrace).length;
  const restDays    = currentPlan.filter(d =>  d.isGrace).length;

  const fmt = iso => iso
    ? new Date(iso + 'T00:00:00').toLocaleDateString('en-US',
        { month: 'short', day: 'numeric' })
    : '';
  const fmtLong = iso => iso
    ? new Date(iso + 'T00:00:00').toLocaleDateString('en-US',
        { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  // Every day is a reading day unless the plan carries rest days, so the
  // reading-day count is only worth printing when the two actually differ.
  let meta = `${currentPlan.length} days`;
  if (restDays) meta += ` · ${readingDays} reading days · ${restDays} rest days`;
  const first = currentPlan[0]?.date, last = currentPlan[currentPlan.length - 1]?.date;
  if (first && last) meta += ` · ${fmtLong(first)} to ${fmtLong(last)}`;
  meta += ` · ${translation}`;

  let html = '';
  html += `<p class="pw-eyebrow">WhosoeverBelieves.com · Bible Reading Plan</p>`;
  html += `<h1 class="pw-title">${esc(name)}</h1>`;
  html += `<hr class="pw-rule"><hr class="pw-rule-thin">`;
  html += `<p class="pw-meta">${esc(meta)}</p>`;
  if (selectedBooks.length)
    html += `<p class="pw-books">${esc(selectedBooks.join(' · '))}</p>`;

  let lastWeek = -1;
  currentPlan.forEach((day, idx) => {
    const week = Math.floor((day.dayNum - 1) / 7) + 1;
    if (week !== lastWeek) {
      lastWeek = week;
      html += `<div class="pw-week">Week ${week}</div>`;
    }

    const rest    = day.isGrace;
    const passage = rest ? 'Rest day — catch up, or simply rest'
                         : formatPassage(day.chapters).label;
    const note    = (reflections[idx] || '').trim();
    const time    = rest ? '' : readingTimeLabel(day);

    html += `<div class="pw-day${rest ? ' pw-rest' : ''}">`;
    html +=   `<div class="pw-head">`;
    if (!rest) html += `<span class="pw-box"></span>`;
    html +=     `<span class="pw-date">${esc(day.date ? fmt(day.date) : 'Day ' + day.dayNum)}</span>`;
    html +=     `<span class="pw-passage">${esc(passage)}</span>`;
    if (time) html += `<span class="pw-time">${esc(time)}</span>`;
    html +=   `</div>`;
    if (note) html += `<div class="pw-notes">${note}</div>`;
    // Lines to write on — the reason to print the plan at all.
    if (!rest) html += `<div class="pw-lines">${'<span></span>'.repeat(note ? 2 : 4)}</div>`;
    html += `</div>`;
  });


  // Chrome supports @page margin boxes, so the footer repeats on every sheet
  // with a live page number. Written here because it carries the plan name.
  const cssName = name.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  let pageStyle = document.getElementById('pw-page-style');
  if (!pageStyle) {
    pageStyle = document.createElement('style');
    pageStyle.id = 'pw-page-style';
    document.head.appendChild(pageStyle);
  }
  pageStyle.textContent =
    '@media print { @page { size: auto; margin: 13mm 12mm 16mm; ' +
      '@bottom-left { content: "' + cssName + '"; ' +
        'font-family: Georgia, serif; font-size: 8.5pt; font-style: italic; color: #555; } ' +
      '@bottom-right { content: "Page " counter(page) " of " counter(pages); ' +
        'font-family: Georgia, serif; font-size: 8.5pt; color: #555; } } }';

  const view = document.getElementById('plan-print-view');
  view.innerHTML = html;

  const title = document.title;
  document.title = name;              // becomes the suggested PDF filename
  window.addEventListener('afterprint', function restore() {
    document.title = title;
    window.removeEventListener('afterprint', restore);
  });
  window.print();
}


// ══════════════════════════════════════════════════════════════
// REMINDER SETTINGS (plan-level)
// ══════════════════════════════════════════════════════════════

function loadPlanReminderSettings() {
  if (!currentPlanId) return;
  _supabase
    .from('plans')
    .select('reminder_enabled, reminder_time, reminder_timezone')
    .eq('id', currentPlanId)
    .single()
    .then(({ data, error }) => {
      if (error || !data) return;
      const chk = document.getElementById('plan-reminder-enabled');
      const tz  = document.getElementById('plan-reminder-tz');
      if (!chk) return;
      chk.checked = data.reminder_enabled;
      if (data.reminder_time) {
        const [hStr] = data.reminder_time.slice(0, 5).split(':');
        let h = parseInt(hStr);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        document.getElementById('plan-reminder-hour').value = String(h).padStart(2, '0');
        document.getElementById('plan-reminder-ampm').value = ampm;
      }
      if (data.reminder_timezone) tz.value = data.reminder_timezone;
      document.getElementById('plan-reminder-time-row').style.display
        = data.reminder_enabled ? 'flex' : 'none';
    });
}

async function savePlanReminderSettings() {
  if (!currentUser)   { showToast('Sign in to save reminder settings.', 'error'); return; }
  if (!currentPlanId) { showToast('Save your plan first, then set a reminder.', 'error'); return; }

  const enabled = document.getElementById('plan-reminder-enabled').checked;
  let h = parseInt(document.getElementById('plan-reminder-hour').value);
  const ampm = document.getElementById('plan-reminder-ampm').value;
  if (ampm === 'PM' && h !== 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  const time = String(h).padStart(2, '0') + ':00';
  const tz   = document.getElementById('plan-reminder-tz').value;

  const { data: saved, error } = await _supabase
    .from('plans')
    .update({ reminder_enabled: enabled, reminder_time: time, reminder_timezone: tz })
    .eq('id', currentPlanId)
    .select('id');

  // An update that matches no rows isn't an error to Supabase, so check that the plan was actually saved.
  if (!error && saved && saved.length) {
    const msg = document.getElementById('plan-reminder-saved');
    msg.style.display = 'inline';
    setTimeout(() => msg.style.display = 'none', 3000);
  } else {
    showToast('Could not save reminder settings.', 'error');
  }
}

// ══════════════════════════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════════════════════════
let toastTimer;
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.className = ''; }, 3200);
}

// ══════════════════════════════════════════════════════════════
// PATCH toggleCheck + saveReflection TO AUTO-PERSIST
// ══════════════════════════════════════════════════════════════
const _origToggleCheck = toggleCheck;
window.toggleCheck = function(idx) {
  checkStates[idx] = !checkStates[idx];

  // Update list view card
  const card = document.getElementById(`day-${idx}`);
  const lbl  = document.querySelector(`#day-${idx} .day-check-label`);
  const chk  = document.getElementById(`chk-${idx}`);
  if (card) card.classList.toggle('completed', checkStates[idx]);
  if (lbl)  lbl.textContent = checkStates[idx] ? '✓ Completed' : 'Mark Complete';

  // Update popover label if open
  const popLbl = document.querySelector(`label[for="pop-chk-${idx}"]`);
  if (popLbl) popLbl.textContent = checkStates[idx] ? '✓ Completed' : 'Mark Complete';

  // Update calendar cell (month/week view)
  const cell = document.getElementById(`cal-cell-${idx}`);
  if (cell) {
    cell.classList.toggle('completed', checkStates[idx]);
    let checkEl = cell.querySelector('.cal-cell-check');
    if (checkStates[idx] && !checkEl) {
      const sp = document.createElement('span');
      sp.className = 'cal-cell-check'; sp.textContent = '✓';
      cell.insertBefore(sp, cell.children[1] || null);
    } else if (!checkStates[idx] && checkEl) {
      checkEl.remove();
    }
  }

  if (checkStates[idx] && chk) launchConfetti(chk);
  updateProgress();
  persistCheckState(idx);
};

window.saveReflection = function(idx, val) {
  // Legacy textarea fallback — Quill uses its own auto-save via text-change event
  reflections[idx] = val;
  clearTimeout(saveDebounce);
  saveDebounce = setTimeout(() => persistReflection(idx, val), 1200);
};

// ══════════════════════════════════════════════════════════════
// BUILDER MODAL + PLAN TABS + WELCOME STATE
// ══════════════════════════════════════════════════════════════

// Move builder cards into the modal container on first open
let builderMoved = false;
function moveBuilderToModal() {
  if (builderMoved) return;
  const source = document.getElementById('plan-builder-body');
  const target = document.getElementById('builder-modal-content');
  if (source && target) {
    // Move all children from the collapsible body into the modal
    while (source.firstChild) target.appendChild(source.firstChild);
    builderMoved = true;
  }
}

function startTemplate(key) {
  openBuilderModal();
  const sel = document.getElementById('template-select');
  if (sel) sel.value = key;
  applyTemplate(key);
}

function openBuilderModal() {
  moveBuilderToModal();
  document.getElementById('builder-modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeBuilderModal() {
  document.getElementById('builder-modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Show plan view (calendar + progress), hide welcome state
function showPlanView() {
  document.getElementById('welcome-state').style.display = 'none';
  document.getElementById('plan-section').style.display = 'block';
  document.getElementById('progress-section').style.display = 'block';
}

// Show welcome state, hide plan view
function showWelcomeState() {
  document.getElementById('welcome-state').style.display = '';
  const note = document.getElementById('rp-signin-note');
  if (note) note.hidden = !!currentUser;
  document.getElementById('plan-section').style.display = 'none';
  document.getElementById('progress-section').style.display = 'none';
}

// Cached plans list for tab rendering
let cachedPlans = [];

// Build the plan tab bar (now rendered inline above the calendar)
function renderPlanTabs() {
  const container = document.getElementById('plan-tabs-inline');
  if (!container) return;
  container.innerHTML = '';
  container.className = 'plan-tab-bar';

  const allPlans = cachedPlans;
  const plans = allPlans.filter(p => !p.completed_at);
  const completedPlans = allPlans.filter(p => p.completed_at);
  const allTabbable = [...plans, ...completedPlans];

  if (!allTabbable.length && !currentPlan.length) {
    showWelcomeState();
    return;
  }

  allTabbable.forEach(plan => {
    const tab = document.createElement('button');
    tab.className = 'plan-tab' + (plan.id === currentPlanId ? ' active' : '');
    tab.textContent = plan.title || 'Untitled Plan';
    tab.onclick = () => loadPlanFromDb(plan.id);
    container.appendChild(tab);
  });

  // If a plan is loaded but unsaved, show it as a tab too
  if (currentPlan.length && !currentPlanId) {
    const tab = document.createElement('button');
    tab.className = 'plan-tab active';
    tab.textContent = document.getElementById('plan-name').value || 'Unsaved Plan';
    container.appendChild(tab);
  }

  // + New Plan button
  const newBtn = document.createElement('button');
  newBtn.className = 'plan-tab-new';
  newBtn.textContent = '+ New Plan';
  newBtn.title = 'Create a new plan';
  newBtn.onclick = () => openBuilderModal();
  container.appendChild(newBtn);

  // Show/hide delete & restart buttons based on whether current plan is completed
  updatePlanActionButtons();
}

// Apply today highlight to calendar cells and list cards
// ── Plan action menus ──
function rpCloseMenus() {
  document.querySelectorAll('.rp-menu.open').forEach(m => m.classList.remove('open'));
  document.querySelectorAll('.rp-menu-wrap [aria-expanded="true"]')
    .forEach(b => b.setAttribute('aria-expanded', 'false'));
}

function rpToggleMenu(id, btn) {
  const menu = document.getElementById(id);
  if (!menu) return;
  const willOpen = !menu.classList.contains('open');
  rpCloseMenus();
  if (willOpen) {
    menu.classList.add('open');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }
}

document.addEventListener('click', e => {
  if (!e.target.closest('.rp-menu-wrap')) rpCloseMenus();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') rpCloseMenus(); });

// Show or hide Delete / Restart buttons based on current plan state
function updatePlanActionButtons() {
  const restartCol = document.getElementById('restart-plan-btn-col');
  const deleteCol  = document.getElementById('delete-plan-btn-col');
  const saveCol    = document.getElementById('save-plan-btn-col');
  const renameBtn  = document.getElementById('header-rename-btn');
  if (!restartCol || !deleteCol) return;

  const isSaved = !!currentPlanId;
  const plan = cachedPlans.find(p => p.id === currentPlanId);
  const isCompleted = plan && !!plan.completed_at;

  // Save only for unsaved plans; Copy, Restart & Delete for saved plans
  const copyCol = document.getElementById('copy-plan-btn-col');
  restartCol.style.display = isSaved ? '' : 'none';
  deleteCol.style.display  = isSaved ? '' : 'none';
  if (saveCol) saveCol.style.display = isSaved ? 'none' : '';
  if (copyCol) copyCol.style.display = isSaved ? '' : 'none';
  // Nothing behind the ellipsis until a plan is saved, so hide it entirely.
  const moreWrap = document.getElementById('plan-more-wrap');
  if (moreWrap) moreWrap.style.display = isSaved ? '' : 'none';
  // Show rename pencil only for saved plans
  if (renameBtn) renameBtn.style.display = isSaved ? '' : 'none';
}

// Delete the currently loaded plan
async function deleteCurrentPlan() {
  if (!currentPlanId) return;
  if (!confirm('Delete this plan and all its reflections? This cannot be undone.')) return;
  const { error: delPlanErr } = await _supabase.from('plans').delete().eq('id', currentPlanId);
  if (delPlanErr) { showToast('Could not delete the plan. Please try again.', 'error'); return; }
  currentPlanId = null;
  showToast('Plan deleted.', 'success');
  await loadSavedPlans();
}

// ── COPY PLAN ──
function localDateStr(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function openCopyPlan() {
  if (!currentPlanId || !currentPlan.length) return;
  if (!currentUser) { showSaveModal(); return; }
  const title = document.getElementById('plan-name').value.trim() || 'Untitled Plan';
  document.getElementById('copy-plan-title').textContent = `Copy — ${title}`;
  document.getElementById('copy-start-date').value = localDateStr(new Date());
  document.getElementById('copy-overlay').classList.add('open');
}

function closeCopyPlan() {
  document.getElementById('copy-overlay').classList.remove('open');
}

// "Gospel of John" -> "Gospel of John (Copy)"; if taken, "(Copy 2)", "(Copy 3)"...
function makeCopyTitle(title) {
  const base = title.replace(/\s*\(Copy(?: \d+)?\)$/, '');
  const taken = new Set(cachedPlans.map(p => p.title));
  let name = `${base} (Copy)`;
  for (let n = 2; taken.has(name); n++) name = `${base} (Copy ${n})`;
  return name;
}

// Re-date the plan from a new start. Readings stay in the same order; rest days
// stay on the same weekdays as the original (or the same positions if undated).
function redatePlan(plan, startStr) {
  const readings = plan.filter(d => !d.isGrace);
  const restWeekdays = new Set(plan.filter(d => d.isGrace && d.date)
    .map(d => new Date(d.date + 'T00:00:00').getDay()));
  const hadDates = plan.some(d => d.date);
  const sd = new Date(startStr + 'T00:00:00');
  const out = [];

  if (!hadDates || !restWeekdays.size) {
    // Keep the exact day-by-day layout, just assign new dates
    plan.forEach((d, i) => {
      const dt = new Date(sd); dt.setDate(sd.getDate() + i);
      out.push({ ...d, date: localDateStr(dt), checked: false });
    });
  } else {
    let r = 0;
    for (let i = 0; r < readings.length; i++) {
      const dt = new Date(sd); dt.setDate(sd.getDate() + i);
      if (restWeekdays.has(dt.getDay())) {
        out.push({ isGrace: true, chapters: [], verseCount: 0, date: localDateStr(dt), checked: false });
      } else {
        out.push({ ...readings[r++], date: localDateStr(dt), checked: false });
      }
    }
  }
  out.forEach((d, i) => { d.dayNum = i + 1; });
  return out;
}

async function confirmCopyPlan() {
  const startStr = document.getElementById('copy-start-date').value;
  if (!startStr) { showToast('Pick a start date for the copy.', 'error'); return; }
  const btn = document.getElementById('copy-confirm-btn');
  if (btn) btn.disabled = true;

  const origTitle = document.getElementById('plan-name').value.trim() || 'Untitled Plan';
  const newTitle  = makeCopyTitle(origTitle);

  _audioStopForPlanChange();
  currentPlan   = redatePlan(currentPlan, startStr);
  checkStates   = {};
  reflections   = {};
  lastMilestoneFired = 0;
  currentPlanId = null;               // forces an insert, never touches the original
  document.getElementById('plan-name').value  = newTitle;
  document.getElementById('start-date').value = startStr;
  document.getElementById('total-days').value = currentPlan.length;

  closeCopyPlan();
  await savePlanToDb();
  if (btn) btn.disabled = false;

  renderPlanTabs();
  renderPlan();
  updateProgress();
  if (currentPlanId) showToast(`Created "${newTitle}" ✓`, 'success');
}

// Close the completion modal, then hand off to the existing restart flow.
function restartFromCompletion() {
  closeCompletion();
  restartCurrentPlan();
}

// Restart the currently loaded plan (keeps notes, resets checkmarks)
function restartCurrentPlan() {
  if (!currentPlanId) return;
  const plan = cachedPlans.find(p => p.id === currentPlanId);
  const title = plan ? plan.title.replace(/'/g, "\\'") : 'this plan';
  // Reuse the existing redo overlay
  redoPlanId = currentPlanId;
  document.getElementById('redo-plan-title').textContent = `Redo — ${plan ? plan.title : 'Plan'}`;
  document.getElementById('redo-start-date').value = new Date().toISOString().slice(0,10);
  document.getElementById('redo-overlay').classList.add('open');
}

function highlightToday() {
  // Remove existing highlights
  document.querySelectorAll('.cal-cell.today, .day-card.today').forEach(el => el.classList.remove('today'));

  const today = new Date();
  const todayStr = today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');

  let todayIdx = -1;
  currentPlan.forEach((day, idx) => {
    if (day.date === todayStr) {
      todayIdx = idx;
      const cell = document.getElementById(`cal-cell-${idx}`);
      const card = document.getElementById(`day-${idx}`);
      if (cell) cell.classList.add('today');
      if (card) card.classList.add('today');
    }
  });
  updatePlanMeta(todayIdx);
}

// Date range + translation under the plan title, and the "Today" button
function updatePlanMeta(todayIdx) {
  const sub = document.getElementById('rp-plan-sub');
  const btn = document.getElementById('rp-today-btn');
  const fmt = iso => {
    const p = iso.split('-').map(Number);
    return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  const dated = currentPlan.filter(d => d.date);
  const tr = (document.getElementById('translation') || {}).value || 'WEB';
  const trName = tr === 'WEB' ? 'World English Bible' : tr;
  if (sub) sub.textContent = dated.length
    ? fmt(dated[0].date) + ' – ' + fmt(dated[dated.length - 1].date) + ' · ' + trName
    : trName;
  if (btn) {
    btn.hidden = todayIdx < 0;
    if (todayIdx >= 0) {
      btn.textContent = 'Today: Day ' + (todayIdx + 1);
      btn.dataset.idx = todayIdx;
    }
  }
}

function goToToday() {
  const idx = Number(document.getElementById('rp-today-btn').dataset.idx);
  const cell = document.getElementById(`cal-cell-${idx}`) || document.getElementById(`day-${idx}`);
  if (cell) cell.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => openDayPopover(idx), 350);
}

// ══════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════

// Apply persisted font size & theme on load (same keys as scripts.js)
(function() {
  const savedFont  = localStorage.getItem('fontPref')  || 'default';
  const savedTheme = localStorage.getItem('themePref');
  rpSetSize(savedFont);
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-mode');
    const btn = document.getElementById('nav-theme-btn');
    if (btn) btn.textContent = '🌙';
  }
})();

// Move builder into modal immediately so forms are ready
moveBuilderToModal();

renderBookGrid();
updateGracePreview();
renderOrderCard();

// Close journal/redo/builder on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeJournal(); closeRedo(); closeCopyPlan(); closeCompletion(); closeBuilderModal(); }
});

// ── HANDLE PASSWORD RESET / MAGIC LINK REDIRECT ──
// Supabase puts the session tokens in the URL hash after the user clicks
// a reset or magic-link email. We need to grab them before initAuth() runs
// so they aren't lost on slower page loads.
(function() {
  const hash = window.location.hash;
  if (!hash || !hash.includes('access_token')) return;

  const params       = new URLSearchParams(hash.slice(1));
  const type         = params.get('type');
  const accessToken  = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  if (!accessToken) return;

  // Clean the tokens out of the URL bar (cosmetic)
  window.history.replaceState(null, '', window.location.pathname);

  if (type === 'recovery') {
    // Set the session then show the new-password form
    _supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(() => {
        openAuthModal();
        switchAuthTab('newpassword');
      });
  }
  // Magic link / email confirm — Supabase handles automatically via onAuthStateChange,
  // but setSession here ensures it fires even if the listener isn't ready yet.
  else {
    _supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  }
})();

initAuth();

/* ═══════════════════════════════════════════════════════════════
   AUDIO PLAYER  —  eBible.org WEB Recording (Winfred W. Henson)
   Files hosted on Cloudflare R2.
   R2 key pattern: {folder}/{folder}_{chapter}.mp3
   e.g. 01_Genesis/01_Genesis_1.mp3
   ═══════════════════════════════════════════════════════════════ */

// Map standard book names → eBible folder prefix (used as R2 key prefix)
const EBIBLE_FOLDER = {
  'Genesis':         '01_Genesis',
  'Exodus':          '02_Exodus',
  'Leviticus':       '03_Leviticus',
  'Numbers':         '04_Numbers',
  'Deuteronomy':     '05_Deuteronomy',
  'Joshua':          '06_Joshua',
  'Judges':          '07_Judges',
  'Ruth':            '08_Ruth',
  '1 Samuel':        '09_First_Samuel',
  '2 Samuel':        '10_Second_Samuel',
  '1 Kings':         '11_First_Kings',
  '2 Kings':         '12_Second_Kings',
  '1 Chronicles':    '13_First_Chronicles',
  '2 Chronicles':    '14_Second_Chronicles',
  'Ezra':            '15_Ezra',
  'Nehemiah':        '16_Nehemiah',
  'Esther':          '17_Esther',
  'Job':             '18_Job',
  'Psalms':          '19_Psalms',
  'Proverbs':        '20_Proverbs',
  'Ecclesiastes':    '21_Ecclesiastes',
  'Song of Songs':   '22_Song_of_Solomon',
  'Isaiah':          '23_Isaiah',
  'Jeremiah':        '24_Jeremiah',
  'Lamentations':    '25_Lamentations',
  'Ezekiel':         '26_Ezekiel',
  'Daniel':          '27_Daniel',
  'Hosea':           '28_Hosea',
  'Joel':            '29_Joel',
  'Amos':            '30_Amos',
  'Obadiah':         '31_Obadiah',
  'Jonah':           '32_Jonah',
  'Micah':           '33_Micah',
  'Nahum':           '34_Nahum',
  'Habakkuk':        '35_Habakkuk',
  'Zephaniah':       '36_Zephaniah',
  'Haggai':          '37_Haggai',
  'Zechariah':       '38_Zechariah',
  'Malachi':         '39_Malachi',
  'Matthew':         '40_Matthew',
  'Mark':            '41_Mark',
  'Luke':            '42_Luke',
  'John':            '43_John',
  'Acts':            '44_Acts',
  'Romans':          '45_Romans',
  '1 Corinthians':   '46_First_Corinthians',
  '2 Corinthians':   '47_Second_Corinthians',
  'Galatians':       '48_Galatians',
  'Ephesians':       '49_Ephesians',
  'Philippians':     '50_Philippians',
  'Colossians':      '51_Colossians',
  '1 Thessalonians': '52_First_Thessalonians',
  '2 Thessalonians': '53_Second_Thessalonians',
  '1 Timothy':       '54_First_Timothy',
  '2 Timothy':       '55_Second_Timothy',
  'Titus':           '56_Titus',
  'Philemon':        '57_Philemon',
  'Hebrews':         '58_Hebrews',
  'James':           '59_James',
  '1 Peter':         '60_First_Peter',
  '2 Peter':         '61_Second_Peter',
  '1 John':          '62_First_John',
  '2 John':          '63_Second_John',
  '3 John':          '64_Third_John',
  'Jude':            '65_Jude',
  'Revelation':      '66_Revelations',
};


// ══════════════════════════════════════════════════════════════
// SCRIPTURE READER  (WEB + KJV, both public domain)
// Text is served from this site at /bible/<trans>/<book>.json — no
// third-party API, no rate limit, cached by the browser after first load.
// Opens as a full-screen reading surface over the plan.
// ══════════════════════════════════════════════════════════════

const READER_TRANSLATIONS = {
  WEB: { label: 'WEB', name: 'World English Bible', note: 'public domain' },
  KJV: { label: 'KJV', name: 'King James Version',  note: 'public domain' }
};

function _lsGet(k, fallback) {
  try { const v = localStorage.getItem(k); return v === null ? fallback : v; }
  catch (e) { return fallback; }
}
function _lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

// Locked to whatever translation the plan was created with — switching mid-plan
// would desync the audio narration (always WEB) from the displayed text for no
// real benefit, so there's no in-reader picker any more.
function _readerTransForPlan() {
  const t = (document.getElementById('translation') || {}).value;
  return READER_TRANSLATIONS[t] ? t : 'WEB';
}
let _readerTrans = _readerTransForPlan();

const _bibleCache = {};   // "WEB|John" -> book doc
const _bibleFetch = {};   // in-flight promises, so opening twice fetches once
let   _readerDay  = -1;   // day index currently open, or -1

function _bibleSlug(book) {
  return book.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function _escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function _bibleLoad(trans, book) {
  const key = trans + '|' + book;
  if (_bibleCache[key]) return Promise.resolve(_bibleCache[key]);
  if (_bibleFetch[key]) return _bibleFetch[key];

  const url = `/bible/${trans.toLowerCase()}/${_bibleSlug(book)}.json`;
  _bibleFetch[key] = fetch(url)
    .then(r => { if (!r.ok) throw new Error(`${r.status} for ${url}`); return r.json(); })
    .then(doc => { _bibleCache[key] = doc; delete _bibleFetch[key]; return doc; })
    .catch(err => { delete _bibleFetch[key]; throw err; });
  return _bibleFetch[key];
}

// ══════════════════════════════════════════════════════════════
// OPEN / CLOSE
// ══════════════════════════════════════════════════════════════

// ─── ESTIMATED READING TIME ───
// Calibrated against the narration: across Numbers 21, Psalm 23 and John 1 the
// narrator runs 0.0889 s per character once the spoken chapter announcement is
// removed, consistent to within 5%. A reader without the dramatic pauses moves
// faster, so this uses 80% of that rate.

const READ_SECONDS_PER_CHAR = 0.0711;
const CHARS_PER_VERSE = 110;        // fallback when the length table is absent
let _chapLengths = null;

fetch('/bible/lengths.json')
  .then(r => (r.ok ? r.json() : null))
  .then(d => { if (d) { _chapLengths = d; _refreshReadingTimes(); } })
  .catch(() => {});

function readingTimeLabel(day) {
  if (!day || day.isGrace) return '';
  let chars = 0;
  if (_chapLengths && day.chapters) {
    for (const c of day.chapters) {
      const book = _chapLengths[c.book];
      const n = book && book[c.chapter - 1];
      if (!n) { chars = 0; break; }
      chars += n;
    }
  }
  if (!chars) chars = (day.verseCount || 0) * CHARS_PER_VERSE;
  if (!chars) return '';
  return '~' + Math.max(1, Math.round(chars * READ_SECONDS_PER_CHAR / 60)) + ' min';
}

// Fill in the exact figures once the table lands, without re-rendering the plan.
function _refreshReadingTimes() {
  document.querySelectorAll('.cal-cell-verses[data-day], .day-verse-count[data-day]').forEach(el => {
    const d = currentPlan[Number(el.dataset.day)];
    if (d) el.textContent = readingTimeLabel(d);
  });
}

// ══════════════════════════════════════════════════════════════
// READER SETTINGS — theme, typeface, size, spacing, layout
// Scoped to the reader so a reading can be set up for comfort without
// changing how the rest of the site looks.
// ══════════════════════════════════════════════════════════════
const R_FONTS = {
  garamond:  "'EB Garamond', Georgia, serif",
  cormorant: "'Cormorant Garamond', Georgia, serif",
  sans:      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
};
const R_THEMES   = ['navy', 'parchment', 'sepia', 'black'];
const R_SIZE_DEF = 1.08;

let _rPrefs = {
  theme:  _lsGet('wb-reader-theme',  'navy'),
  font:   _lsGet('wb-reader-font',   'garamond'),
  size:   parseFloat(_lsGet('wb-reader-size', String(R_SIZE_DEF))) || R_SIZE_DEF,
  lh:     parseFloat(_lsGet('wb-reader-lh',   '1.8')) || 1.8,
  layout: _lsGet('wb-reader-layout', 'verse')
};

function _readerApplyPrefs() {
  const o = document.getElementById('reader-overlay');
  if (!o) return;
  if (R_THEMES.indexOf(_rPrefs.theme) < 0) _rPrefs.theme = 'navy';
  if (!R_FONTS[_rPrefs.font]) _rPrefs.font = 'garamond';
  _rPrefs.size = Math.min(1.75, Math.max(0.9, _rPrefs.size));
  _rPrefs.lh   = Math.min(2.4,  Math.max(1.4, _rPrefs.lh));

  o.setAttribute('data-rtheme', _rPrefs.theme);
  // Mirrored onto <html> so the notes window, which lives outside the reader
  // in the DOM, resolves the same palette.
  document.documentElement.setAttribute('data-rtheme', _rPrefs.theme);
  o.setAttribute('data-rlayout', _rPrefs.layout === 'paragraph' ? 'paragraph' : 'verse');
  o.style.setProperty('--r-font', R_FONTS[_rPrefs.font]);
  o.style.setProperty('--r-size', _rPrefs.size.toFixed(2) + 'rem');
  o.style.setProperty('--r-lh',   _rPrefs.lh.toFixed(2));

  o.querySelectorAll('.rs-theme').forEach(b  => b.classList.toggle('on', b.dataset.v === _rPrefs.theme));
  o.querySelectorAll('.rs-font').forEach(b   => b.classList.toggle('on', b.dataset.v === _rPrefs.font));
  o.querySelectorAll('.rs-layout').forEach(b => b.classList.toggle('on', b.dataset.v === _rPrefs.layout));

  const sz = document.getElementById('rs-size'); if (sz) sz.value = _rPrefs.size;
  const lh = document.getElementById('rs-lh');   if (lh) lh.value = _rPrefs.lh;
  const szv = document.getElementById('rs-size-val');
  if (szv) szv.textContent = Math.round((_rPrefs.size / R_SIZE_DEF) * 100) + '%';
  const lhv = document.getElementById('rs-lh-val');
  if (lhv) lhv.textContent = _rPrefs.lh.toFixed(2).replace(/0$/, '');
}

function readerSetPref(key, val) {
  if (key === 'size' || key === 'lh') val = parseFloat(val);
  _rPrefs[key] = val;
  _lsSet('wb-reader-' + key, String(val));
  _readerApplyPrefs();
}

function toggleReaderSheet(force) {
  const o = document.getElementById('reader-overlay');
  if (!o) return;
  const open = (force === undefined) ? !o.classList.contains('sheet-open') : !!force;

  // The player bar sits above the reader, so the sheet stops short of it
  // rather than hiding the controls for whatever is playing.
  const bar = document.getElementById('audio-player-bar');
  const barH = (bar && document.body.classList.contains('audio-active')) ? bar.offsetHeight : 0;
  o.style.setProperty('--r-sheet-bottom', barH + 'px');

  o.classList.toggle('sheet-open', open);
  const btn = document.getElementById('reader-settings-btn');
  if (btn) {
    btn.classList.toggle('on', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (open) _readerShowHead();
}

// ── Header hides as you read down, returns as you read back up ──
let _rLastScroll  = 0;
let _rAutoScrollAt = 0;
let _rHintTimer   = null;

function _readerShowHead() {
  const o = document.getElementById('reader-overlay');
  if (o) o.classList.remove('head-hidden');
}

function _readerWireChrome() {
  const o    = document.getElementById('reader-overlay');
  if (!o || o.dataset.chromeWired) return;
  const head = o.querySelector('.reader-head');
  const body = o.querySelector('.sp-body');
  if (!head || !body) return;
  o.dataset.chromeWired = '1';

  const measure = () => o.style.setProperty('--r-head-h', head.offsetHeight + 'px');
  measure();
  if (window.ResizeObserver) new ResizeObserver(measure).observe(head);
  window.addEventListener('resize', measure);

  body.addEventListener('scroll', () => {
    const y = body.scrollTop;
    // Leave the header alone while the sheet is open or the sync is scrolling for us.
    if (o.classList.contains('sheet-open') || Date.now() - _rAutoScrollAt < 1200) {
      _rLastScroll = y; return;
    }
    if (y < 72)                     o.classList.remove('head-hidden');
    else if (y > _rLastScroll + 8)  o.classList.add('head-hidden');
    else if (y < _rLastScroll - 8)  o.classList.remove('head-hidden');
    _rLastScroll = y;
  }, { passive: true });

  // Tapping the page brings the header back, which is what a reader reaches for.
  body.addEventListener('click', e => {
    if (o.classList.contains('head-hidden') && !e.target.closest('button, a')) _readerShowHead();
  });
}

function _readerShowHint() {
  const o = document.getElementById('reader-overlay');
  if (!o || _lsGet('wb-reader-hint', '') === 'off') return;
  if (o.classList.contains('hint-on')) return;
  o.classList.add('hint-on');
  clearTimeout(_rHintTimer);
  _rHintTimer = setTimeout(() => o.classList.remove('hint-on'), 7000);
}

function readerDismissHint(forever) {
  const o = document.getElementById('reader-overlay');
  if (o) o.classList.remove('hint-on');
  clearTimeout(_rHintTimer);
  if (forever) _lsSet('wb-reader-hint', 'off');
}

function openReader(dayIdx) {
  const day = currentPlan[dayIdx];
  if (!day || day.isGrace) return;

  _readerTrans = _readerTransForPlan();   // re-check in case a different plan is now active
  _readerDay = dayIdx;
  const overlay = document.getElementById('reader-overlay');
  const { label } = formatPassage(day.chapters);

  let dayLine = 'Day ' + day.dayNum;
  if (day.date) {
    const d = new Date(day.date + 'T00:00:00');
    dayLine += ' · ' + d.toLocaleDateString('en-US',
      { weekday: 'short', month: 'short', day: 'numeric' });
  }
  overlay.querySelector('.reader-day').textContent = dayLine;
  overlay.querySelector('.reader-ref').textContent = label;
  overlay.classList.add('open');
  document.body.classList.add('reader-open');
  overlay.classList.remove('head-hidden', 'sheet-open', 'hint-on');
  _rLastScroll = 0;
  _readerApplyPrefs();
  _readerWireChrome();

  _renderReaderActions(dayIdx);
  _syncRefreshNudge();
  renderScripture(dayIdx);
  _syncPrepare();
}

// The day's own controls live in the reader, so opening a day is one step.
// Notes and Listen sit in the header; marking the day done waits at the foot of
// the reading, which is where you actually finish it.
function _renderReaderActions(dayIdx) {
  const el = document.querySelector('#reader-overlay .reader-day-tools');
  if (!el) return;
  const playing = (_activeDayIdx === dayIdx && !_audio.paused);
  el.innerHTML = `
    <button class="reader-btn" onclick="readerOpenJournal(${dayIdx})"
            aria-label="Notes for this day" title="Notes">
      <span class="ico">${reflections[dayIdx] ? '✎' : '✦'}</span><span class="lbl">Notes</span>
    </button>
    <button class="reader-btn listen-btn${playing ? ' playing' : ''}" data-day="${dayIdx}"
            onclick="listenDay(${dayIdx})"
            aria-label="Listen to this reading" title="Listen">
      <span class="ico">▶︎</span><span class="lbl">${playing ? 'Playing' : 'Listen'}</span>
    </button>`;
}

function _readerFinishHtml(dayIdx) {
  const done = !!checkStates[dayIdx];
  return `<div class="reader-finish">
    <button class="reader-done-btn${done ? ' done' : ''}" onclick="readerToggleCheck(${dayIdx}, this)">
      <span class="tick">${done ? '✓' : '○'}</span>
      <span>${done ? 'Completed' : 'Mark this day complete'}</span>
    </button>
  </div>`;
}

function _refreshReaderFinish(dayIdx) {
  const wrap = document.querySelector('#reader-overlay .reader-finish');
  if (wrap) wrap.outerHTML = _readerFinishHtml(dayIdx);
}

function readerToggleCheck(dayIdx, input) {
  toggleCheck(dayIdx);
  if (checkStates[dayIdx] && typeof launchConfetti === 'function') launchConfetti(input);
  _renderReaderActions(dayIdx);
  _refreshReaderFinish(dayIdx);
}

function readerOpenJournal(dayIdx) {
  openJournal(dayIdx);   // opens over the reader; the text stays where it was
}

function closeReader() {
  const o = document.getElementById('reader-overlay');
  o.classList.remove('sheet-open', 'head-hidden', 'hint-on');
  o.classList.remove('open');
  document.body.classList.remove('reader-open');
  _readerDay = -1;
}

function toggleReader(dayIdx) {
  if (_readerDay === dayIdx) closeReader();
  else openReader(dayIdx);
}


// ══════════════════════════════════════════════════════════════
// RENDER
// ══════════════════════════════════════════════════════════════

function renderScripture(dayIdx) {
  const day = currentPlan[dayIdx];
  if (!day || day.isGrace) return;

  const trans = _readerTrans;
  const meta  = READER_TRANSLATIONS[trans];
  const books = [...new Set(day.chapters.map(c => c.book))];
  const body  = document.querySelector('#reader-overlay .sp-body');
  const { url } = formatPassage(day.chapters);   // kept only for the load-failure fallback link below

  body.innerHTML = `<div class="sp-msg">Loading ${_escHtml(meta.name)}…</div>`;

  Promise.all(books.map(b => _bibleLoad(trans, b)))
    .then(docs => {
      if (_readerDay !== dayIdx) return;   // reader moved on while loading
      const byBook = {};
      books.forEach((b, i) => { byBook[b] = docs[i]; });

      let html = '';
      day.chapters.forEach(ch => {
        const doc = byBook[ch.book];
        const verses = (doc.c || [])[ch.chapter - 1] || [];
        html += `<div class="sp-chapter">${_escHtml(ch.book)} ${ch.chapter}</div>`;
        const title = doc.titles && doc.titles[String(ch.chapter)];
        if (title) html += `<div class="sp-psalm-title">${_escHtml(title)}</div>`;
        if (!verses.length) {
          html += `<div class="sp-msg">This chapter isn't available in ${_escHtml(meta.label)}.</div>`;
          return;
        }
        html += '<div class="sp-verses">';
        verses.forEach((text, i) => {
          // A few verses (Luke 17:36, Acts 8:37, 15:34, 24:7) are absent from the
          // Greek the WEB follows and sit in its footnotes. Say so rather than
          // printing a bare verse number.
          const inner = text
            ? _escHtml(text)
            : `<span class="sv-absent">Not in the text this translation follows.</span>`;
          html += `<span class="sv${text ? '' : ' empty'}" data-book="${_escHtml(ch.book)}" ` +
                  `data-ch="${ch.chapter}" data-v="${i + 1}">` +
                  `<span class="sv-num">${i + 1}</span>${inner}</span> `;
        });
        html += '</div>';
      });

      body.innerHTML = html + _readerFinishHtml(dayIdx);
      _wireVerseTaps();
      _syncPrepare();
      _syncUpdate(true);
    })
    .catch(err => {
      console.warn('[reader] load failed:', err);
      if (_readerDay !== dayIdx) return;
      body.innerHTML = `<div class="sp-msg">The text couldn't be loaded just now. ` +
        `<a href="${_escHtml(url)}" target="_blank" rel="noopener" style="color:var(--gold);">` +
        `Open it on BibleGateway</a> instead.</div>`;
    });
}

// ══════════════════════════════════════════════════════════════
// AUDIO ↔ VERSE SYNC
//
// The recordings carry no verse timing data, so verse starts are estimated:
// the chapter's duration is divided across its verses in proportion to how
// long each verse is, after an allowance for the spoken chapter announcement.
//
// The narration also reads editorial section headings that are not in this
// text, and its pacing is dramatized rather than even, so the estimate runs
// ahead of the voice. Two corrections are offered instead of a better guess:
// a persistent offset the reader sets once for this narrator, and tapping a
// verse to jump and re-anchor from that point.
// ══════════════════════════════════════════════════════════════

let _syncStarts   = null;  // estimated start time (s) of each verse
let _syncKey      = '';    // "John|1" the starts were built for
let _syncAnchor   = null;  // {i, t} a verse the reader jumped to
let _syncActive   = -1;    // index of the currently highlighted verse
let _spScrolledAt = 0;     // last manual scroll, so we don't fight the reader
let _syncOffset   = parseFloat(_lsGet('wb-sync-offset', '0')) || 0;

// Measured by forced-aligning this narration against the text: verse 1 begins
// 10.7s into Psalm 23 and 7.5s into Psalm 117, against the 1-3s the old
// proportional lead allowed. The announcement is roughly a fixed cost, not a
// share of the chapter, so it is modelled as one.
const SYNC_LEAD_FLAT = 8.0;
const SYNC_TAIL_MAX = 2.0;
const SYNC_OFFSET_MIN = -5;
const SYNC_OFFSET_MAX = 20;

// ── MEASURED VERSE TIMINGS ──────────────────────────────
// Built by forced-aligning this same narration against this same WEB text, so
// the highlight follows the voice instead of guessing at it. One file per book:
//
//   /bible/timings/web/<book>.json
//   { "c": { "23": { "dur": 174.76, "v": [11.46, 18.2, ...] } } }
//
// "v" holds each verse's start in seconds. Where a chapter has been aligned the
// reader uses these times and no nudging is needed; anything not yet aligned
// falls back to the proportional estimate below, with the nudge still offered.
const _timingCache = {};   // book -> doc | null (null = asked, none published)
const _timingFetch = {};   // in-flight promises
let   _syncExact   = false;

// Aligned times belong to the exact file they were measured from, so the
// duration the browser loaded has to match before they can be trusted.
//
// The match has to be proportional, not a fixed number of seconds. These MP3s
// carry no VBR header, so a browser cannot read the true length and estimates
// it from the bitrate; the aligner measures the decoded length instead. On
// Numbers 26 that is 842.43s against 844.36s — under two seconds apart on a
// fourteen-minute chapter, but enough to fail a 1.5s test, and it differs by
// browser, which is why a desktop could reject what a phone accepted.
// One percent, with a floor for short chapters, absorbs that disagreement
// while still rejecting a genuinely different recording: a re-cut file differs
// by far more than one percent, since trimming an intro alone costs seconds.
function _timingTolerance(dur) {
  return Math.max(2.5, dur * 0.01);
}

// Keyed by narration as well as book: the WEB and KJV recordings are different
// readers with different pacing, so each has its own timing files.
function _timingKey(book, trans) { return `${trans || 'WEB'}|${book}`; }

function _timingLoad(book, trans) {
  const key = _timingKey(book, trans);
  if (key in _timingCache) return Promise.resolve(_timingCache[key]);
  if (_timingFetch[key]) return _timingFetch[key];
  const dir = (trans || 'WEB').toLowerCase();
  const url = `/bible/timings/${dir}/${_bibleSlug(book)}.json`;
  _timingFetch[key] = fetch(url)
    .then(r => (r.ok ? r.json() : null))
    .then(doc => { _timingCache[key] = doc; delete _timingFetch[key]; return doc; })
    .catch(() => { _timingCache[key] = null; delete _timingFetch[key]; return null; });
  return _timingFetch[key];
}

function _timingFor(book, chapter, duration, trans) {
  const doc = _timingCache[_timingKey(book, trans)];
  if (!doc || !doc.c) return null;
  const rec = doc.c[String(chapter)];
  if (!rec || !rec.v || !rec.v.length) return null;
  if (!(Math.abs(rec.dur - duration) <= _timingTolerance(rec.dur))) return null;

  // Put the measured times on the browser's clock. Without a VBR header the
  // browser works out its own length for the file, slightly different from the
  // decoded length these times were measured against, and it scales both
  // currentTime and seeking to that. The gap is a fixed fraction of the
  // chapter, so it is nothing at the start and grows to about two seconds by
  // the end of a long one: clicking Numbers 26:63 landed on "by Moses and
  // Eleazar" rather than "These are those". Scaling by the ratio of the two
  // lengths maps our timeline onto theirs and holds for any browser.
  const scale = duration / rec.dur;
  return (scale > 0 && isFinite(scale) && Math.abs(scale - 1) > 1e-6)
    ? rec.v.map(t => t * scale)
    : rec.v;
}

function _syncBuildStarts(verses, duration, trans) {
  // The KJV clips are cut to start at verse 1 and stop after the last word,
  // so they have no spoken announcement to allow for.
  const lead = trans === 'KJV' ? 0.4 : Math.min(duration * 0.15, SYNC_LEAD_FLAT);
  const tail = trans === 'KJV' ? 0.3 : Math.min(SYNC_TAIL_MAX, duration * 0.01);
  const span = Math.max(1, duration - lead - tail);
  const lens = verses.map(v => Math.max(12, v.length));
  const total = lens.reduce((a, b) => a + b, 0) || 1;
  const starts = [];
  let acc = 0;
  for (const L of lens) { starts.push(lead + (acc / total) * span); acc += L; }
  return starts;
}

// Shift the estimate so it passes exactly through a verse the reader tapped,
// keeping it monotonic on both sides of that anchor.
function _syncRemap(starts, duration, anchor) {
  if (!anchor || !starts || !starts.length) return starts;
  const { i, t } = anchor;
  const s0 = starts[i];
  return starts.map((s, j) => {
    if (j === i) return t;
    if (j < i) return s0 > 0 ? (s / s0) * t : 0;
    const rem = duration - s0;
    return rem > 0 ? t + (s - s0) * ((duration - t) / rem) : t;
  });
}

function _syncCurrentTrack() {
  if (!_audioQueue.length || _audioIdx < 0 || _audioIdx >= _audioQueue.length) return null;
  return _audioQueue[_audioIdx];
}

function _syncPrepare() {
  const track = _syncCurrentTrack();
  const live  = !!track && _readerDay >= 0 && _activeDayIdx === _readerDay;
  const overlay = document.getElementById('reader-overlay');
  if (overlay) overlay.classList.toggle('synced', live);
  if (live) _readerShowHint(); else readerDismissHint(false);

  if (!live || !_audio.duration || !isFinite(_audio.duration)) { _syncStarts = null; return; }

  const key = `${track.book}|${track.chapter}`;
  const doc = _bibleCache[_readerTrans + '|' + track.book];
  if (!doc) { _syncStarts = null; return; }
  const verses = (doc.c || [])[track.chapter - 1] || [];
  if (!verses.length) { _syncStarts = null; return; }

  if (key !== _syncKey) { _syncAnchor = null; _syncActive = -1; }
  _syncKey = key;

  const measured = _timingFor(track.book, track.chapter, _audio.duration, track.trans);
  if (measured) {
    _syncExact   = true;
    _syncStarts  = measured;
    _syncAnchor  = null;          // measured times need no anchoring
    _syncNote('Timed to this recording \u00b7 tap a verse to jump there');
  } else {
    _syncExact  = false;
    _syncStarts = _syncBuildStarts(verses, _audio.duration, track.trans);
    _syncNote('Estimated pacing \u00b7 tap a verse to jump there');
    // First time this book comes up, see whether timings exist for it.
    if (!(_timingKey(track.book, track.trans) in _timingCache)) {
      _timingLoad(track.book, track.trans).then(doc => {
        if (doc && _syncKey === key) { _syncPrepare(); _syncUpdate(true); }
      });
    }
  }
  if (overlay) overlay.classList.toggle('exact', _syncExact);
  _syncRefreshNudge();
}

function _syncNote(msg) {
  const el = document.querySelector('#reader-overlay .sp-sync-note');
  if (el) el.textContent = msg;
}

function _syncRefreshNudge() {
  const el = document.querySelector('#reader-overlay .sync-nudge-val');
  if (!el) return;
  el.textContent = _syncOffset === 0
    ? 'no delay'
    : (_syncOffset > 0 ? '+' : '') + _syncOffset.toFixed(1) + 's delay';
}

// Positive offset holds the highlight back, for a narrator slower than the estimate.
function syncNudge(delta) {
  _syncOffset = Math.min(SYNC_OFFSET_MAX, Math.max(SYNC_OFFSET_MIN,
    Math.round((_syncOffset + delta) * 10) / 10));
  _lsSet('wb-sync-offset', String(_syncOffset));
  _syncRefreshNudge();
  _syncActive = -1;
  _syncUpdate(true);
}

function _syncUpdate(force) {
  if (!_syncStarts || _readerDay < 0 || _activeDayIdx !== _readerDay) return;
  const track = _syncCurrentTrack();
  if (!track) return;

  // Measured times are used as they are; only the estimate gets remapped to an
  // anchor, and only the estimate honours the reader's manual delay.
  const starts = _syncExact
    ? _syncStarts
    : _syncRemap(_syncStarts, _audio.duration, _syncAnchor);
  const t = _audio.currentTime - (_syncExact ? 0 : _syncOffset);
  let idx = 0;
  for (let i = 0; i < starts.length; i++) { if (t >= starts[i]) idx = i; else break; }
  if (idx === _syncActive && !force) return;
  _syncActive = idx;

  const body = document.querySelector('#reader-overlay .sp-body');
  if (!body) return;
  body.querySelectorAll('.sv.active').forEach(el => el.classList.remove('active'));
  const sel = `.sv[data-book="${CSS.escape(track.book)}"][data-ch="${track.chapter}"]`;
  const target = body.querySelectorAll(sel)[idx];
  if (!target) return;
  target.classList.add('active');

  if (Date.now() - _spScrolledAt > 6000) {
    _rAutoScrollAt = Date.now();
    const top = target.offsetTop - body.offsetTop - body.clientHeight / 2 + target.offsetHeight / 2;
    body.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }
}

// On a phone the note is behind the i; on desktop it is always on the line.
function toggleAudioEditionNote(btn) {
  const info = btn.closest('.audio-track-info');
  if (info) info.classList.toggle('show-note');
}

function _wireVerseTaps() {
  const body = document.querySelector('#reader-overlay .sp-body');
  if (!body) return;
  if (!body.dataset.wired) {
    body.dataset.wired = '1';
    body.addEventListener('scroll', () => { _spScrolledAt = Date.now(); }, { passive: true });
  }
  body.querySelectorAll('.sv').forEach(el => {
    el.onclick = () => {
      const track = _syncCurrentTrack();
      if (!track || !_syncStarts) return;                      // not playing — plain text
      const book = el.dataset.book, ch = Number(el.dataset.ch);
      const i = Number(el.dataset.v) - 1;

      if (book !== track.book || ch !== track.chapter) {
        // Another chapter of the day (forwards or back): switch to its track,
        // then jump once the new recording's length is known. Readers don't
        // always notice the next/previous buttons, so a silent tap looked broken.
        const idx = _audioQueue.findIndex(t => t.book === book && t.chapter === ch);
        if (idx < 0) return;
        _syncPendingJump = { book, ch, i };
        _syncNote('Loading ' + book + ' ' + ch + '\u2026');
        _audioLoadTrack(idx);
        return;
      }
      _syncJumpToVerse(i);
    };
  });
}

// A verse tap on another chapter waits here until that chapter's audio loads.
let _syncPendingJump = null;   // {book, ch, i}

function _syncJumpToVerse(i) {
  const starts = _syncExact
    ? _syncStarts
    : _syncRemap(_syncStarts, _audio.duration, _syncAnchor);
  const target = starts[i];
  if (!isFinite(target)) return;

  _audio.currentTime = target + (_syncExact ? 0 : _syncOffset);
  // On a measured chapter the tap is just a jump; on an estimate it also
  // re-anchors the guess so the rest of the chapter follows from here.
  if (!_syncExact) _syncAnchor = { i, t: target };
  _spScrolledAt = 0;
  _syncActive = -1;
  _syncUpdate(true);
  if (_audio.paused) _audio.play().catch(() => {});
  _syncNote(_syncExact
    ? 'Timed to this recording \u00b7 jumped to verse ' + (i + 1)
    : 'Synced from verse ' + (i + 1));
}

// Called once the new track's timings are ready (see loadedmetadata below).
function _syncApplyPendingJump() {
  const p = _syncPendingJump;
  if (!p) return;
  _syncPendingJump = null;
  const track = _syncCurrentTrack();
  if (!track || track.book !== p.book || track.chapter !== p.ch || !_syncStarts) return;
  _syncJumpToVerse(p.i);
}

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape' || _readerDay < 0) return;
  const o = document.getElementById('reader-overlay');
  if (o && o.classList.contains('sheet-open')) { toggleReaderSheet(false); return; }
  closeReader();
});

// ── Chapter → audio file number ─────────────────────────────
// The chapter MP3s were uploaded in the order their links appeared on eBible's
// index pages, so wherever that listing repeated or reordered a file, the
// numbering drifted off the chapter it actually contains. Verified by
// transcribing the spoken announcement of all 1,189 files (Oct 2026):
//
//   Psalms           eBible lists Psalm 71 twice — files 71 and 72 are byte
//                    identical — so chapters 72-150 sit one file later and
//                    Psalm 150 is in _151.mp3.
//   Luke             the same duplicate at chapter 17, so 18-24 sit one later
//                    and Luke 24 is in _25.mp3.
//   Isaiah           files 16 and 17 hold each other's chapter.
//   2 Thessalonians  rotated: ch 1 is in file 2, ch 2 in file 3, ch 3 in file 1.
//
// Every other chapter matches its filename. Fixing it here rather than renaming
// in R2 keeps one source of truth; if the bucket is ever re-uploaded cleanly,
// delete this function and the call to it.
function audioFileNumber(book, chapter) {
  if (book === 'Psalms' && chapter >= 72) return chapter + 1;
  if (book === 'Luke'   && chapter >= 18) return chapter + 1;
  if (book === 'Isaiah' && (chapter === 16 || chapter === 17)) return 33 - chapter;
  if (book === '2 Thessalonians') return { 1: 2, 2: 3, 3: 1 }[chapter] || chapter;
  return chapter;
}

// Human-read KJV chapters: LibriVox volunteer recordings (public domain), cut
// into one file per chapter with the LibriVox intros and outros removed, and
// hosted beside the WEB audio under kjv/. Each entry is [first, last, reader].
// A KJV plan plays these where they exist and falls back to the WEB narration
// for books not yet prepared.
const KJV_AUDIO = {
  'Genesis':   [[1, 50, 'Darren L. Slider']],
  'Exodus':    [[1, 40, 'Darren L. Slider']],
  'Leviticus': [[1, 27, 'Darren L. Slider']],
  'Numbers':   [[1, 2, 'Michael Packard'], [3, 4, 'Ron Nieuwsma'], [5, 8, 'Sundiata'], [9, 11, 'Juan Federico'],
                [12, 32, 'theunknownchristian'], [33, 36, 'Michael Packard']],
  'Deuteronomy': [[1, 2, 'Mark Penfold'], [3, 4, 'Michael Packard'], [5, 7, 'Bob Gonzalez'], [8, 13, 'Michael Packard'],
                  [14, 16, 'Rob Paire'], [17, 25, 'TriciaG'], [26, 27, 'GabrielleC'], [28, 28, 'Janet Williams'],
                  [29, 31, 'GabrielleC'], [32, 34, 'Michael Packard']],
  'Joshua':    [[1, 24, 'Joy Chan']],
  'Judges':    [[1, 21, 'Joy Chan']],
  'Ruth':      [[1, 4, 'TriciaG']],
  '1 Samuel':  [[1, 31, 'Joy Chan']],
  '2 Samuel':  [[1, 24, 'Joy Chan']],
  '1 Kings':   [[1, 22, 'Joy Chan']],
  '2 Kings':   [[1, 25, 'Joy Chan']],
  '1 Chronicles': [[1, 29, 'Joy Chan']],
  '2 Chronicles': [[1, 8, 'Joy Chan'], [9, 36, 'Kimberly Krause']],
  'Ezra':      [[1, 10, 'Sundiata']],
  'Nehemiah':  [[1, 3, 'Sundiata'], [4, 6, 'Michael Packard'], [7, 10, 'A. E. Maroney'], [11, 13, 'TriciaG']],
  'Esther':    [[1, 10, 'Rachel, Esther ben Simonides and others']],
  'Job':       [[1, 42, 'TriciaG, Algy Pug and others']],
  'Proverbs':  [[1, 31, 'Michael Packard']],
  'Ecclesiastes': [[1, 3, 'Michael Packard'], [4, 6, 'Brian Dole'], [7, 9, 'Beth Thomas'], [10, 12, 'TriciaG']],
  'Song of Songs': [[1, 8, 'Ezwa, TriciaG, Algy Pug']],
  'Isaiah': [[1, 6, 'Michael Packard'], [7, 12, 'Sundiata'], [13, 15, 'Abigail Rasmussen'],
             [16, 18, 'Sundiata'], [19, 24, 'Abigail Rasmussen'], [25, 33, 'Beth Thomas'],
             [34, 36, 'debolee'], [37, 45, 'Sundiata'], [46, 48, 'debolee'], [49, 51, 'Sundiata'],
             [52, 54, 'TriciaG'], [55, 57, 'Sundiata'], [58, 60, 'Brian Dole'],
             [61, 66, 'Michael Packard']],
  'Jeremiah': [[1, 4, 'Michael Packard'], [5, 15, 'Nicole Lee'], [16, 19, 'Abigail Rasmussen'],
               [20, 23, 'mcgovern1934'], [24, 27, 'Nicole Lee'], [28, 32, 'Abigail Rasmussen'],
               [33, 38, 'Jonathan Lange'], [39, 45, 'TriciaG'], [46, 52, 'Michael Packard']],
  'Lamentations': [[1, 5, 'Michael Armenta']],
  'Ezekiel':  [[1, 48, 'J L Raimundo']],
  'Daniel':  [[1, 2, 'Patti Cunningham'], [3, 4, 'Sharon V.'], [5, 6, 'ThomasO'],
             [7, 8, 'theunknownchristian'], [9, 10, 'TriciaG'], [11, 12, 'Sundiata']],
  'Matthew':  [[1, 28, 'Michael Packard']],
  'Mark':     [[1, 16, 'Sundiata']],
  'Luke':     [[1, 10, 'Susan Denney'], [11, 24, 'Fr. Richard Zeile of Detroit']],
  'John':   [[1, 4, 'Michael Packard'], [5, 8, 'Sundiata'], [9, 12, 'Beth Thomas'],
             [13, 17, 'GabrielleC'], [18, 21, 'Sundiata']],
  'Acts':     [[1, 10, 'Jason Justice'], [11, 28, 'Kimberly Krause']],
  'Romans':   [[1, 16, 'Kimberly Krause']],
  '1 Corinthians': [[1, 4, 'Sundiata'], [5, 6, 'David Lawrence'], [7, 10, 'Sundiata'],
                    [11, 12, 'Rick Tabisz'], [13, 16, 'TriciaG']],
  '2 Corinthians': [[1, 13, 'Sundiata']],
  'Galatians': [[1, 6, 'Kimberly Krause']],
  'Ephesians':  [[1, 6, 'Ned Troxel']],
  'Philippians': [[1, 4, 'Victoria Martin']],
  'Colossians': [[1, 4, 'Michael Packard']],
  '1 Thessalonians': [[1, 5, 'David Lawrence']],
  '2 Thessalonians': [[1, 3, 'David Lawrence']],
  '1 Timothy':  [[1, 6, 'David Lawrence']],
  '2 Timothy':  [[1, 4, 'David Lawrence']],
  'Titus':      [[1, 3, 'David Lawrence']],
  'Philemon':   [[1, 1, 'David Lawrence']],
  'Hebrews':  [[1, 3, 'Patti Cunningham'], [4, 6, 'J. McKnight'], [7, 9, 'Sundiata'],
              [10, 11, 'Michael Packard'], [12, 13, 'Snapdragon']],
  'James':     [[1, 5, 'Susan Denney']],
  '1 Peter':    [[1, 5, 'Sundiata']],
  '2 Peter':    [[1, 3, 'Michelle Remington']],
  '1 John':    [[1, 5, 'Rick Tabisz']],
  '2 John':    [[1, 1, 'Rick Tabisz']],
  '3 John':    [[1, 1, 'Rick Tabisz']],
  'Jude':      [[1, 1, 'Susan Denney']],
  'Hosea':     [[1, 14, 'TriciaG']],
  'Joel':      [[1, 3, 'TriciaG']],
  'Amos':      [[1, 9, 'TriciaG']],
  'Obadiah':   [[1, 1, 'TriciaG']],
  'Jonah':     [[1, 4, 'TriciaG']],
  'Micah':     [[1, 7, 'TriciaG']],
  'Nahum':     [[1, 3, 'TriciaG']],
  'Habakkuk':  [[1, 3, 'TriciaG']],
  'Zephaniah': [[1, 3, 'TriciaG']],
  'Haggai':    [[1, 2, 'TriciaG']],
  'Zechariah': [[1, 14, 'TriciaG']],
  'Malachi':   [[1, 4, 'TriciaG']],
  'Revelation': [[1, 22, 'Phil Chenevert']],
};

function kjvReader(book, chapter) {
  const r = (KJV_AUDIO[book] || []).find(([a, b]) => chapter >= a && chapter <= b);
  return r ? r[2] : null;
}

function getAudioUrl(book, chapter, trans) {
  const folder = EBIBLE_FOLDER[book] || ('00_' + book.replace(/\s+/g, '_'));
  // KJV files are named by their real chapter, so no eBible renumbering here.
  if (trans === 'KJV') {
    return `https://pub-c4105367c474429f812253bea5afdc20.r2.dev/kjv/${folder}/${folder}_${chapter}.mp3`;
  }
  const fileNo = audioFileNumber(book, chapter);
  return `https://pub-c4105367c474429f812253bea5afdc20.r2.dev/${folder}/${folder}_${fileNo}.mp3`;
}

// ── Player state ──────────────────────────────────────────────
let _audio        = new Audio();
let _audioQueue   = [];   // [{book, chapter, label}]
let _audioIdx     = 0;
let _audioSeeking = false;
let _activeDayIdx = -1;   // which day card owns the current queue
let _audioLoadId  = 0;    // incremented each load to cancel stale stall-retry handlers

function _audioFmtTime(sec) {
  if (!isFinite(sec) || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function _audioRefreshScrubber() {
  const scrub = document.getElementById('audio-scrubber');
  if (!scrub || !_audio.duration) return;
  const pct = (_audio.currentTime / _audio.duration) * 100;
  scrub.value = pct;
  scrub.style.background =
    `linear-gradient(to right, var(--audio-gold) ${pct}%, var(--audio-track) ${pct}%)`;
  document.getElementById('audio-time-cur').textContent = _audioFmtTime(_audio.currentTime);
  document.getElementById('audio-time-dur').textContent = _audioFmtTime(_audio.duration);
}

function _audioSetListenBtn(dayIdx, playing) {
  // Both the day card and the reader header carry this button, so update each.
  document.querySelectorAll(`.listen-btn[data-day="${dayIdx}"]`).forEach(btn => {
    const lbl = btn.querySelector('.lbl');
    if (lbl) lbl.textContent = playing ? 'Playing' : 'Listen';
    else     btn.textContent = playing ? '🔊 Playing…' : '🔊 Listen';
    btn.classList.toggle('playing', playing);
  });
}

function _audioLoadTrack(idx) {
  if (idx < 0 || idx >= _audioQueue.length) return;
  _audioIdx = idx;
  const loadId = ++_audioLoadId; // bumped on every new load; lets stale retries self-cancel
  const track  = _audioQueue[idx];
  const url    = getAudioUrl(track.book, track.chapter, track.trans);
  _audioSetEditionNote(track);

  // ── UI: show loading state ─────────────────────────────────
  const pb    = document.getElementById('audio-play-btn');
  const label = document.getElementById('audio-track-label');
  const scrub = document.getElementById('audio-scrubber');
  if (label) label.textContent = `${track.label} — loading…`;
  _audioRefreshSkipBtns();
  _audioRefreshMuteBtn();
  _audioUpdateMediaSession(track);
  document.getElementById('audio-queue-label').textContent =
    _audioQueue.length > 1 ? `Track ${idx + 1} of ${_audioQueue.length}` : '';
  document.getElementById('audio-time-cur').textContent = '0:00';
  document.getElementById('audio-time-dur').textContent = '0:00';
  if (scrub) { scrub.value = 0; scrub.style.background = 'var(--audio-track)'; }
  document.getElementById('audio-player-bar').style.display = 'flex';
  document.body.classList.add('audio-active');
  if (pb) pb.textContent = '⟳';

  // ── Stop previous playback and assign new src ──────────────
  // NOTE: We set src directly on the <audio> element — no fetch(), no blob.
  // fetch() is blocked by CORS when the page is served from file:// (null origin).
  // The <audio> element bypasses CORS for media, so direct src always works.
  _audio.pause();
  _audio.src = url;
  _audio.playbackRate = _audioSpeed;
  _audio.load(); // start buffering immediately

  // ── Stall-retry: AudioTreasure throttles streams aggressively ──
  // The 'stalled' event fires after ~3 s of no data. Calling .load() again
  // re-issues the HTTP request and usually gets a fresh window of data.
  let _stallRetries = 0;
  const MAX_RETRIES = 8; // give up after ~40 s of continuous stalling

  function _onStall() {
    if (_audioLoadId !== loadId) return; // track changed — abort
    if (_audio.readyState >= 3) return;  // HAVE_FUTURE_DATA — we're fine
    _stallRetries++;
    if (_stallRetries <= MAX_RETRIES) {
      console.log(`[audio] stall #${_stallRetries} on ${track.label} — retrying…`);
      const t = _audio.currentTime;
      _audio.load();
      if (t > 0) _audio.currentTime = t; // restore position after reload
      _audio.play().catch(() => {});
    } else {
      // Too many retries; tell the user but keep the bar open so they can retry
      if (label) label.textContent = `${track.label} — server is slow, tap ▶ to retry`;
      if (pb) pb.textContent = '▶';
      console.warn('[audio] giving up after', MAX_RETRIES, 'stall retries');
    }
  }
  _audio.addEventListener('stalled', _onStall);
  // Clean up this listener when the track changes or ends
  _audio.addEventListener('playing', function _clearStallHandler() {
    if (loadId === _audioLoadId && label)
      label.textContent = track.label; // clear "loading…" text once playing
    _audio.removeEventListener('playing', _clearStallHandler);
  });
  // Remove the stall handler when this track is superseded
  const _origLoadId = loadId;
  function _cleanupStall() {
    if (_audioLoadId !== _origLoadId) {
      _audio.removeEventListener('stalled', _onStall);
    }
  }
  _audio.addEventListener('emptied', _cleanupStall, { once: true });

  _audio.play().catch(err => {
    if (_audioLoadId !== loadId) return;
    if (pb) pb.textContent = '▶';
    console.warn('play() rejected on initial load:', err.name, err.message);
  });
}

// ── Public API ────────────────────────────────────────────────
// The note behind the "i" in the player describes the recording now playing.
function _audioSetEditionNote(track) {
  const pre = document.querySelector('#audio-player-bar .audio-edition-note-prefix');
  const txt = document.querySelector('#audio-player-bar .audio-edition-note-text');
  if (!pre || !txt) return;
  if (track.trans === 'KJV') {
    pre.textContent = '\u2014 King James Version, public domain';
    txt.textContent = ` (read by ${track.reader} for LibriVox)`;
  } else if (_readerTransForPlan() === 'KJV') {
    pre.textContent = '\u2014 World English Bible narration';
    txt.textContent = " (KJV audio for this book isn't ready yet, so the wording differs from the text shown)";
  } else {
    pre.textContent = '\u2014 World English Bible, public domain';
    txt.textContent = ' (the narration predates the 2020 text shown here; some wording differs)';
  }
}

function listenDay(dayIdx) {
  const day = currentPlan[dayIdx];
  if (!day || day.isGrace) return;

  // Build playlist queue for this day's chapters
  const planKjv = _readerTransForPlan() === 'KJV';
  _audioQueue = day.chapters.map(c => {
    const reader = planKjv ? kjvReader(c.book, c.chapter) : null;
    return {
      book:    c.book,
      chapter: c.chapter,
      label:   `${c.book} ${c.chapter}`,
      trans:   reader ? 'KJV' : 'WEB',
      reader:  reader
    };
  });

  // Clear previous active button
  if (_activeDayIdx >= 0 && _activeDayIdx !== dayIdx) {
    _audioSetListenBtn(_activeDayIdx, false);
  }
  _activeDayIdx = dayIdx;
  _audioSetListenBtn(dayIdx, true);
  _syncAnchor = null;
  _syncKey = '';

  _audioLoadTrack(0);
}

function audioTogglePlay() {
  if (_audio.paused) {
    const pb = document.getElementById('audio-play-btn');
    if (pb) pb.textContent = '⟳';
    _audio.play().catch(err => {
      if (pb) pb.textContent = '▶';
      console.warn('Audio play() rejected:', err.name, err.message);
    });
    // 'play' event listener will flip to ⏸ once playback actually starts
  } else {
    _audio.pause();
    document.getElementById('audio-play-btn').textContent = '▶';
  }
}

function audioRewind() {
  _audio.currentTime = Math.max(0, _audio.currentTime - 10);
}

function audioGoPrev() {
  // If >5 s in, restart current track; otherwise go to previous
  if (_audio.currentTime > 5) {
    _audio.currentTime = 0;
  } else if (_audioIdx > 0) {
    _audioLoadTrack(_audioIdx - 1);
  }
}

function audioGoNext() {
  if (_audioIdx < _audioQueue.length - 1) {
    _audioLoadTrack(_audioIdx + 1);
  }
}

function audioClose() {
  _audioLoadId++;           // signals all stall-retry handlers to stop
  _audio.pause();
  _audio.src = '';          // release the media resource
  audioToggleSettings(false);
  document.getElementById('audio-player-bar').style.display = 'none';
  document.body.classList.remove('audio-active');
  document.querySelectorAll('.sv.active').forEach(el => el.classList.remove('active'));
  const _ro = document.getElementById('reader-overlay');
  if (_ro) _ro.classList.remove('synced');
  _syncStarts = null; _syncAnchor = null; _syncKey = ''; _syncActive = -1;
  _syncPendingJump = null;
  if (_activeDayIdx >= 0) {
    _audioSetListenBtn(_activeDayIdx, false);
    _activeDayIdx = -1;
  }
}

// ── Playback speed, skip ahead, mute ──────────────────────────
// Speed is remembered per browser (localStorage), like the font and theme
// toggles. Mute deliberately is not: coming back the next day to silence
// reads as a broken player.
//
// Speed needs no special handling in the verse sync. The highlight compares
// _audio.currentTime against absolute verse start times, and currentTime is
// media time, so it stays correct at any rate.
const AUDIO_SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2];
let _audioSpeed = parseFloat(_lsGet('wb-audio-speed', '1')) || 1;
if (AUDIO_SPEEDS.indexOf(_audioSpeed) === -1) _audioSpeed = 1;
_audio.playbackRate = _audioSpeed;

function _audioSpeedLabel(r) {
  return (r === 1 ? '1' : String(r)) + '×';
}

// The speed pills are built once from AUDIO_SPEEDS, so the list of rates only
// has to be right in one place.
function _audioBuildSpeedPills() {
  const wrap = document.getElementById('audio-speed-pills');
  if (!wrap || wrap.dataset.built) return;
  AUDIO_SPEEDS.forEach(r => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = _audioSpeedLabel(r);
    b.setAttribute('aria-label', 'Play at ' + _audioSpeedLabel(r) + ' speed');
    b.onclick = () => audioSetSpeed(r);
    wrap.appendChild(b);
  });
  wrap.dataset.built = '1';
}

function _audioRefreshSpeedPills() {
  const wrap = document.getElementById('audio-speed-pills');
  if (!wrap) return;
  AUDIO_SPEEDS.forEach((r, i) => {
    const b = wrap.children[i];
    if (!b) return;
    b.classList.toggle('on', r === _audioSpeed);
    b.setAttribute('aria-pressed', r === _audioSpeed ? 'true' : 'false');
  });
}

function audioSetSpeed(r) {
  _audioSpeed = r;
  _audio.playbackRate = r;
  _lsSet('wb-audio-speed', String(r));
  _audioRefreshSpeedPills();
  _audioUpdatePosition();
}

// ── Settings sheet ────────────────────────────────────────────
function audioToggleSettings(force) {
  const panel = document.getElementById('audio-settings');
  const btn   = document.getElementById('audio-settings-btn');
  if (!panel) return;
  const open = typeof force === 'boolean' ? force : panel.hidden;
  panel.hidden = !open;
  if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (open) { _audioBuildSpeedPills(); _audioRefreshSpeedPills(); _audioRefreshMuteBtn(); }
}

// A tap outside, or Escape, closes it — the reader's own settings sheet
// behaves this way, so the two feel the same.
document.addEventListener('click', e => {
  const panel = document.getElementById('audio-settings');
  if (!panel || panel.hidden) return;
  if (e.target.closest('#audio-settings') || e.target.closest('#audio-settings-btn')) return;
  audioToggleSettings(false);
});
document.addEventListener('keydown', e => {
  const panel = document.getElementById('audio-settings');
  if (e.key === 'Escape' && panel && !panel.hidden) audioToggleSettings(false);
});

// Chapter skips earn their place only on a day with more than one chapter.
function _audioRefreshSkipBtns() {
  const multi = _audioQueue.length > 1;
  ['audio-prev-btn', 'audio-next-btn'].forEach(id => {
    const b = document.getElementById(id);
    if (b) b.style.display = multi ? '' : 'none';
  });
}

function audioForward() {
  const d = _audio.duration;
  _audio.currentTime = isFinite(d) && d > 0
    ? Math.min(d - 0.1, _audio.currentTime + 10)
    : _audio.currentTime + 10;
}

function _audioRefreshMuteBtn() {
  const b = document.getElementById('audio-mute-btn');
  if (!b) return;
  b.textContent = _audio.muted ? '🔇' : '🔊';
  b.setAttribute('aria-label', _audio.muted ? 'Unmute' : 'Mute');
  b.setAttribute('aria-pressed', _audio.muted ? 'true' : 'false');
}

function audioToggleMute() {
  _audio.muted = !_audio.muted;
  _audioRefreshMuteBtn();
}

// ── Lock-screen and headphone controls ────────────────────────
// Media Session puts the chapter on the iOS lock screen and Android
// notification shade, and wires the hardware play/pause, skip and
// next-track controls to this player. Everything is feature-detected and
// wrapped, because Safari throws on action handlers it doesn't implement.
function _audioUpdateMediaSession(track) {
  if (!('mediaSession' in navigator)) return;
  const ms = navigator.mediaSession;
  try {
    ms.metadata = new MediaMetadata({
      title:  track.label,
      artist: track.trans === 'KJV' ? 'King James Version — LibriVox'
                                    : 'World English Bible — Winfred W. Henson',
      album:  'Whosoever Believes — Bible Reading Plan',
      artwork: [{ src: location.origin + '/images/cross-sunrise.png',
                  sizes: '512x512', type: 'image/png' }]
    });
  } catch (e) { /* MediaMetadata unsupported — controls still work */ }

  const set = (action, fn) => { try { ms.setActionHandler(action, fn); } catch (e) {} };
  set('play',  () => { _audio.play().catch(() => {}); });
  set('pause', () => { _audio.pause(); });
  set('seekbackward', d => {
    const o = (d && d.seekOffset) || 10;
    _audio.currentTime = Math.max(0, _audio.currentTime - o);
  });
  set('seekforward', () => audioForward());
  set('seekto', d => {
    if (!d) return;
    if (d.fastSeek && typeof _audio.fastSeek === 'function') _audio.fastSeek(d.seekTime);
    else _audio.currentTime = d.seekTime;
    _audioUpdatePosition();
  });
  // Only offer track skips that actually go somewhere, so the lock screen
  // greys out the rest instead of showing dead buttons.
  set('previoustrack', (_audioIdx > 0 || _audio.currentTime > 5) ? () => audioGoPrev() : null);
  set('nexttrack', _audioIdx < _audioQueue.length - 1 ? () => audioGoNext() : null);
}

function _audioUpdatePosition() {
  if (!('mediaSession' in navigator) || !navigator.mediaSession.setPositionState) return;
  const d = _audio.duration;
  if (!isFinite(d) || d <= 0) return;
  try {
    navigator.mediaSession.setPositionState({
      duration: d,
      playbackRate: _audio.playbackRate || 1,
      position: Math.max(0, Math.min(_audio.currentTime, d))
    });
  } catch (e) {}
}

// Keep the lock screen and the chosen speed in step with the element.
let _msPosAt = 0;
_audio.addEventListener('loadedmetadata', () => {
  _audio.playbackRate = _audioSpeed;   // a new src can reset the rate
  _audioUpdatePosition();
});
_audio.addEventListener('ratechange', _audioUpdatePosition);
_audio.addEventListener('play', () => {
  if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
  _audioUpdatePosition();
});
_audio.addEventListener('pause', () => {
  if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
});
_audio.addEventListener('timeupdate', () => {
  const now = Date.now();
  if (now - _msPosAt > 1000) { _msPosAt = now; _audioUpdatePosition(); }
});

// ── Wire up events ────────────────────────────────────────────
(function initAudioPlayer() {
  // Auto-advance to next track in queue
  _audio.addEventListener('ended', () => {
    if (_audioIdx < _audioQueue.length - 1) {
      _audioLoadTrack(_audioIdx + 1);
    } else {
      document.getElementById('audio-play-btn').textContent = '▶';
      if (_activeDayIdx >= 0) _audioSetListenBtn(_activeDayIdx, false);
    }
  });

  // Live scrubber updates
  _audio.addEventListener('timeupdate', () => {
    if (!_audioSeeking) _audioRefreshScrubber();
    _syncUpdate();
  });
  _audio.addEventListener('loadedmetadata', () => {
    _audioRefreshScrubber();
    _syncPrepare();
    _syncUpdate(true);
    _syncApplyPendingJump();   // a verse tapped in this chapter while another was playing
  });
  _audio.addEventListener('pause', () => {
    document.getElementById('audio-play-btn').textContent = '▶';
  });
  _audio.addEventListener('play', () => {
    document.getElementById('audio-play-btn').textContent = '⏸';
  });
  // Show spinner while buffering / stalled
  const _showLoading = () => {
    const pb = document.getElementById('audio-play-btn');
    if (pb && !_audio.paused) pb.textContent = '⟳';
  };
  _audio.addEventListener('waiting', _showLoading);
  _audio.addEventListener('stalled', _showLoading);
  _audio.addEventListener('playing', () => {
    document.getElementById('audio-play-btn').textContent = '⏸';
  });

  // Scrubber seek interaction
  const scrub = document.getElementById('audio-scrubber');
  if (scrub) {
    scrub.addEventListener('mousedown',  () => { _audioSeeking = true; });
    scrub.addEventListener('touchstart', () => { _audioSeeking = true; }, { passive: true });
    scrub.addEventListener('input', () => {
      if (_audio.duration) {
        const t = (scrub.value / 100) * _audio.duration;
        document.getElementById('audio-time-cur').textContent = _audioFmtTime(t);
        scrub.style.background =
          `linear-gradient(to right, var(--audio-gold) ${scrub.value}%, var(--audio-track) ${scrub.value}%)`;
      }
    });
    scrub.addEventListener('change', () => {
      if (_audio.duration) _audio.currentTime = (scrub.value / 100) * _audio.duration;
      _audioSeeking = false;
    });
    scrub.addEventListener('mouseup', () => { _audioSeeking = false; });
  }
})();


// ══════════════════════════════════════════════════════════════
// Apply a shared plan if this page was opened from a share link.
// Must run LAST: rendering a plan reaches declarations further down
// this file, which are still in the temporal dead zone earlier on.
// ══════════════════════════════════════════════════════════════
try { applySharedPlanFromUrl(); } catch (e) { console.error('Shared plan link could not be applied:', e); }
