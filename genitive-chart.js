/* ==========================================================================
   GENITIVE USES CHART — behavior
   One flat table: sort by any column, collapse the whole thing out of the
   way, enlarge it to full screen.

   Loaded with `defer`, after genitive-chart-data.js and before scripts.js
   wires the Scripture tooltips, so any example verse gets the site's normal
   hover/tap verse popup.

   Mount point in the article:
     <div id="genitive-chart" data-title="Your heading (optional)"></div>

   Optional attributes on the mount point:
     data-title   heading in the bar you click to collapse the table.
                  Omit it and the bar just reads "Genitive uses".
     data-closed  present = start collapsed. Default: open.
   ========================================================================== */

(function () {
  'use strict';

  var MOUNT = '#genitive-chart';
  var SCALES = { small: 0.9, normal: 1, large: 1.2 };
  var SCALE_KEY = 'genitiveChartScale';

  var rows = [];      // flattened, in Wallace's order
  var sortKey = null; // null = canonical order
  var sortDir = 1;

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function hasTag(r, t) { return !!(r.tags && r.tags.indexOf(t) !== -1); }

  /* ── cells ───────────────────────────────────────────────────────────── */

  function cellCat(r) {
    return '<span class="gu-cat">' + esc(r.catName) + '</span>';
  }

  function cellRef(r) {
    return '<span class="gu-ref">' + esc(r.id) + '</span>';
  }

  function cellUse(r) {
    var h = '<span class="gu-name">' + esc(r.name) + '</span>';
    if (r.alt) h += '<span class="gu-alt">' + esc(r.alt) + '</span>';
    return h;
  }

  function cellGloss(r) {
    if (!r.gloss) return '<span class="gu-empty">&mdash;</span>';
    return '<span class="gu-gloss' + (r.glossIncomplete ? ' gu-todo' : '') + '">' +
      esc(r.gloss) + '</span>';
  }

  function cellExample(r) {
    if (!r.example) return '<span class="gu-empty">&mdash;</span>';
    var url = 'https://www.biblegateway.com/passage/?search=' +
      encodeURIComponent(r.example) + '&version=WEB';
    return '<a class="scripture-ref" href="' + esc(url) + '" target="_blank" rel="noopener"' +
      ' data-ref="' + esc(r.example) + '" data-verse="' + esc(r.verse || '') + '">' +
      esc(r.example) + '</a>';
  }

  function cellNotes(r) {
    return r.notes ? r.notes : '<span class="gu-empty">&mdash;</span>';
  }

  /* Columns. `sort` gives the value a click on that header sorts by.
     `live` decides whether the column appears at all: Example and Notes stay
     hidden until at least one row fills them. */
  var COLS = [
    { key: 'cat',   label: 'Category',    cls: 'gu-c-cat',   cell: cellCat,
      sort: function (r) { return r.catIndex; } },
    { key: 'ref',   label: '#',           cls: 'gu-c-ref',   cell: cellRef,
      sort: function (r) { return r.order; } },
    { key: 'use',   label: 'Use',         cls: 'gu-c-use',   cell: cellUse,
      sort: function (r) { return r.name.toLowerCase(); } },
    { key: 'gloss', label: 'Key Meaning', cls: 'gu-c-gloss', cell: cellGloss,
      sort: function (r) { return (r.gloss || '￿').toLowerCase(); } },
    { key: 'ex',    label: 'Example',     cls: 'gu-c-ex',    cell: cellExample,
      sort: function (r) { return (r.example || '￿').toLowerCase(); },
      live: function () { return rows.some(function (r) { return !!r.example; }); } }
  ];

  function activeCols() {
    return COLS.filter(function (c) { return !c.live || c.live(); });
  }

  function rowClass(r) {
    var c = [];
    if (hasTag(r, 'gal')) c.push('gu-gal');
    if (r.pair === 'A6') c.push('gu-p-attr');
    if (r.pair === 'A5') c.push('gu-p-attrd');
    return c.join(' ');
  }

  /* ── sorting ─────────────────────────────────────────────────────────── */

  function sorted() {
    if (!sortKey) return rows.slice();
    var col = COLS.filter(function (c) { return c.key === sortKey; })[0];
    if (!col) return rows.slice();
    return rows.slice().sort(function (a, b) {
      var x = col.sort(a), y = col.sort(b);
      if (x < y) return -1 * sortDir;
      if (x > y) return 1 * sortDir;
      return a.order - b.order;   // canonical order breaks every tie
    });
  }

  /* ── markup ──────────────────────────────────────────────────────────── */

  function headHtml() {
    return '<tr>' + activeCols().map(function (c) {
      var on = sortKey === c.key;
      var arrow = on ? (sortDir === 1 ? '↑' : '↓') : '';
      var aria = on ? (sortDir === 1 ? 'ascending' : 'descending') : 'none';
      return '<th scope="col" class="' + c.cls + '" aria-sort="' + aria + '">' +
        '<button type="button" class="gu-sort' + (on ? ' on' : '') + '" data-sort="' + c.key + '">' +
        esc(c.label) + '<span class="gu-arrow">' + arrow + '</span></button></th>';
    }).join('') + '</tr>';
  }

  function tableHtml() {
    var cols = activeCols();

    var body = sorted().map(function (r) {
      var cls = rowClass(r);
      var tr = '<tr' + (cls ? ' class="' + cls + '"' : '') + '>' +
        cols.map(function (c) {
          return '<td class="' + c.cls + '">' + c.cell(r) + '</td>';
        }).join('') + '</tr>';
      /* A note gets the full width of the table rather than a cramped sixth
         column, so it can run to a sentence or two without hanging words. */
      if (r.notes) {
        tr += '<tr class="gu-noterow' + (cls ? ' ' + cls : '') + '">' +
          '<td colspan="' + cols.length + '"><span class="gu-notelabel">Note</span>' +
          '<span class="gu-notetext">' + r.notes + '</span></td></tr>';
      }
      return tr;
    }).join('');

    return '<table class="gu-table"><thead>' + headHtml() + '</thead>' +
      '<tbody>' + body + '</tbody></table>';
  }

  function cardsHtml() {
    var cols = activeCols();
    return '<div class="gu-cards">' + sorted().map(function (r) {
      var cls = rowClass(r);
      /* On a card an empty field is just noise, so leave it out entirely —
         unlike the table, where the column has to line up row to row. */
      var fields = cols.filter(function (c) {
        if (c.key === 'cat' || c.key === 'ref' || c.key === 'use') return false;
        return c.key === 'gloss' ? !!r.gloss : !!r.example;
      }).map(function (c) {
        return '<div><dt>' + esc(c.label) + '</dt><dd>' + c.cell(r) + '</dd></div>';
      }).join('');
      if (r.notes) fields += '<div><dt>Note</dt><dd>' + cellNotes(r) + '</dd></div>';
      return '<div class="gu-card' + (cls ? ' ' + cls : '') + '">' +
        '<div class="gu-card-cat">' + esc(r.catName) + '</div>' +
        '<div class="gu-card-top">' + cellRef(r) + '<span>' + cellUse(r) + '</span></div>' +
        '<dl class="gu-fields">' + fields + '</dl>' +
      '</div>';
    }).join('') + '</div>';
  }

  /* On phones and iPad portrait the table header is swapped out for cards,
     so sorting needs a control of its own down there. */
  function sortSelectHtml() {
    var opts = '<option value="">Wallace order</option>' +
      activeCols().filter(function (c) { return c.key !== 'ref'; })
        .map(function (c) {
          return '<option value="' + c.key + '">' + esc(c.label) + '</option>';
        }).join('');
    return '<label class="gu-sortsel">Sort' +
      '<select aria-label="Sort the chart">' + opts + '</select></label>';
  }

  function toolbarHtml() {
    return '<div class="gu-toolbar">' +
      sortSelectHtml() +
      '<span class="gu-tlabel">Text</span>' +
      '<div class="gu-tgroup" role="group" aria-label="Chart text size">' +
        '<button type="button" data-size="small"  aria-label="Smaller text">A&minus;</button>' +
        '<button type="button" data-size="normal" aria-label="Default text size">A</button>' +
        '<button type="button" data-size="large"  aria-label="Larger text">A+</button>' +
      '</div>' +
      '<div class="gu-tgroup"><button type="button" data-act="theme"></button></div>' +
      '<button type="button" class="gu-reset" data-act="reset" hidden>Reset order</button>' +
      '<span class="gu-spacer"></span>' +
      '<button type="button" class="gu-primary" data-act="fs"></button>' +
    '</div>';
  }

  function legendHtml(data) {
    var L = data.legend || {};
    var bits = [];
    if (L.gal) bits.push('<span class="gu-key-gal">' + esc(L.gal.label) + '</span>');
    if (L.titus) bits.push('<span class="gu-key-titus">' + esc(L.titus.label) + '</span>');
    if (rows.some(function (r) { return r.pair; })) {
      bits.push('<span class="gu-key-pair">Attributive / Attributed pair</span>');
    }
    return bits.length ? '<div class="gu-legend">' + bits.join('') + '</div>' : '';
  }

  /* ── build ───────────────────────────────────────────────────────────── */

  function build(host, data) {
    var title = host.getAttribute('data-title') || 'Genitive uses';
    var closed = host.hasAttribute('data-closed');

    data.groups.forEach(function (g, gi) {
      g.rows.forEach(function (r) {
        r.catName = g.name;
        r.catLetter = g.letter;
        r.catIndex = gi;
        r.order = rows.length;
        rows.push(r);
      });
    });

    host.className = 'gu-chart';
    host.innerHTML =
      '<details class="gu-wrap"' + (closed ? '' : ' open') + '>' +
        '<summary class="gu-bar">' +
          '<span class="gu-chev" aria-hidden="true"></span>' +
          '<span class="gu-title">' + esc(title) + '</span>' +
          '<span class="gu-count">' + rows.length + ' uses</span>' +
        '</summary>' +
        '<div class="gu-body">' +
          (data.reference ? '<p class="gu-source">' + esc(data.reference) + '</p>' : '') +
          toolbarHtml() +
          legendHtml(data) +
          '<div class="gu-grid">' + tableHtml() + cardsHtml() + '</div>' +
        '</div>' +
      '</details>';

    return host;
  }

  /* ── behavior ────────────────────────────────────────────────────────── */

  function wire(root) {
    var tbody = root.querySelector('.gu-table tbody');
    var thead = root.querySelector('.gu-table thead');
    var cards = root.querySelector('.gu-cards');
    var themeBtn = root.querySelector('[data-act="theme"]');
    var fsBtn = root.querySelector('[data-act="fs"]');
    var resetBtn = root.querySelector('[data-act="reset"]');
    var sizeBtns = root.querySelectorAll('[data-size]');

    /* Rows are moved, never rebuilt: a re-render would drop the Scripture
       tooltip listeners that scripts.js attached to the example links. */
    var trs = Array.prototype.slice.call(tbody.children);
    var cds = Array.prototype.slice.call(cards.children);
    var ti = 0;
    rows.forEach(function (r, i) {
      r._tr = trs[ti++];
      r._note = r.notes ? trs[ti++] : null;   // the note's own full-width row
      r._card = cds[i];
    });

    var sortSel = root.querySelector('.gu-sortsel select');

    function redraw() {
      sorted().forEach(function (r) {
        tbody.appendChild(r._tr);
        if (r._note) tbody.appendChild(r._note);
        cards.appendChild(r._card);
      });
      thead.innerHTML = headHtml();
      sortSel.value = sortKey || '';
      resetBtn.hidden = !sortKey;
    }

    sortSel.addEventListener('change', function () {
      sortKey = sortSel.value || null;
      sortDir = 1;
      redraw();
    });

    function setScale(name, remember) {
      if (!SCALES[name]) name = 'normal';
      root.style.setProperty('--gu-scale', SCALES[name]);
      Array.prototype.forEach.call(sizeBtns, function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-size') === name ? 'true' : 'false');
      });
      if (remember) { try { localStorage.setItem(SCALE_KEY, name); } catch (e) {} }
    }

    function isLight() { return document.documentElement.classList.contains('light-mode'); }

    function paintTheme() {
      themeBtn.textContent = isLight() ? '☾ Dark' : '☀ Light';
      themeBtn.setAttribute('aria-label', isLight() ? 'Switch to dark mode' : 'Switch to light mode');
    }

    function paintFs() {
      var on = root.classList.contains('gu-fs') || document.fullscreenElement === root;
      fsBtn.textContent = on ? 'Close ✕' : 'Enlarge';
      fsBtn.setAttribute('aria-label', on ? 'Close full screen' : 'Enlarge to full screen');
    }

    function openFs() {
      root.querySelector('.gu-wrap').open = true;
      root.classList.add('gu-fs');
      document.body.classList.add('gu-fs-open');
      if (root.requestFullscreen && window.matchMedia('(min-width: 761px)').matches) {
        root.requestFullscreen().catch(function () {});
      }
      paintFs();
      root.setAttribute('tabindex', '-1');
      root.focus({ preventScroll: true });
      root.scrollTop = 0;
    }

    function closeFs() {
      root.classList.remove('gu-fs');
      document.body.classList.remove('gu-fs-open');
      if (document.fullscreenElement === root && document.exitFullscreen) {
        document.exitFullscreen().catch(function () {});
      }
      paintFs();
    }

    root.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn || !root.contains(btn)) return;

      var key = btn.getAttribute('data-sort');
      if (key) {
        if (sortKey === key) sortDir = -sortDir;
        else { sortKey = key; sortDir = 1; }
        return redraw();
      }

      var size = btn.getAttribute('data-size');
      if (size) return setScale(size, true);

      switch (btn.getAttribute('data-act')) {
        case 'reset':
          sortKey = null; sortDir = 1; redraw(); break;
        case 'theme':
          if (typeof window.setTheme === 'function') window.setTheme(isLight() ? 'dark' : 'light');
          else document.documentElement.classList.toggle('light-mode');
          paintTheme(); break;
        case 'fs':
          if (root.classList.contains('gu-fs')) closeFs(); else openFs(); break;
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('gu-fs')) closeFs();
    });

    document.addEventListener('fullscreenchange', function () {
      if (!document.fullscreenElement && root.classList.contains('gu-fs')) closeFs();
    });

    /* The site's own light/dark toggle lives in the nav, so watch the root
       class and keep this button's label honest either way. */
    if (window.MutationObserver) {
      new MutationObserver(paintTheme).observe(document.documentElement, {
        attributes: true, attributeFilter: ['class']
      });
    }

    var saved = 'normal';
    try { saved = localStorage.getItem(SCALE_KEY) || 'normal'; } catch (e) {}
    setScale(saved, false);
    paintTheme();
    paintFs();
  }

  function init() {
    var host = document.querySelector(MOUNT);
    if (!host || !window.GENITIVE_USES) return;
    wire(build(host, window.GENITIVE_USES));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
