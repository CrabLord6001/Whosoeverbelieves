/* ==========================================================================
   WHOSOEVER — Shared Scripts
   Free Grace Theology & Biblical Studies
   ========================================================================== */

// Favicons are declared statically in each page's <head> (/favicon.ico, /site.webmanifest).


/* ── FONT SIZE ─────────────────────────────────────────────────────────── */

function setSize(size) {
  const sizes = ['default', 'font-small', 'font-large'];
  sizes.forEach(s => document.documentElement.classList.remove(s));
  if (size !== 'default') document.documentElement.classList.add(size);
  localStorage.setItem('fontPref', size);
  const labels = { default:'A', 'font-small':'A\u2212', 'font-large':'A+' };
  document.querySelectorAll('.nav-tools button, .font-size-group button').forEach(b => {
    b.classList.toggle('active', b.textContent === labels[size]);
  });
}

setSize(localStorage.getItem('fontPref') || 'default');


/* ── THEME ─────────────────────────────────────────────────────────────── */

function setTheme(theme) {
  if (theme === 'light') {
    document.documentElement.classList.add('light-mode');
  } else {
    document.documentElement.classList.remove('light-mode');
  }
  localStorage.setItem('themePref', theme);
}

const savedTheme = localStorage.getItem('themePref');
if (savedTheme === 'light') {
  document.documentElement.classList.add('light-mode');
}


/* ── SEARCH ────────────────────────────────────────────────────────────── */

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSnippet(content, query) {
  const index = content.toLowerCase().indexOf(query);
  if (index === -1) return '';
  const start = Math.max(0, index - 60);
  const end = Math.min(content.length, index + query.length + 60);
  let snippet = (start > 0 ? '…' : '') + content.slice(start, end) + (end < content.length ? '…' : '');
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  snippet = snippet.replace(regex, `<mark style="background:rgba(201,168,76,0.3); color:var(--gold); border-radius:2px; padding:0 2px;">$1</mark>`);
  return snippet;
}

function runSearch(query) {
  const q = query.trim().toLowerCase();
  const resultsBox = document.getElementById('search-results');

  // Reset all cards to visible
  document.querySelectorAll('.article-card').forEach(card => {
    card.style.display = '';
  });

  if (!q) { resultsBox.style.display = 'none'; resultsBox.innerHTML = ''; return; }

  const matches = searchIndex.filter(a =>
    (a.title + ' ' + a.excerpt + ' ' + a.content + ' ' + a.tags.join(' ')).toLowerCase().includes(q)
  );

  if (!matches.length) {
    resultsBox.style.display = 'block';
    resultsBox.innerHTML = '<p style="padding:0.75rem 2.5rem 1rem; color:var(--text-faint); font-style:italic; font-size:0.9rem;">No results found.</p>';
    return;
  }

  resultsBox.style.display = 'block';
  resultsBox.innerHTML = matches.map(a => {
    const snippet = getSnippet(a.content, q) || getSnippet(a.excerpt, q);
    return `
      <a href="${a.url}" style="display:block; padding:0.75rem 2.5rem; text-decoration:none; border-bottom:1px solid var(--rule); transition:background 0.15s;"
         onmouseover="this.style.background='var(--glass)'" onmouseout="this.style.background='none'">
        <span style="font-family:'Cormorant Garamond',serif; font-size:1.05rem; color:var(--text);">${a.title}</span>
        ${snippet ? `<span style="display:block; font-size:0.82rem; color:var(--text-mid); font-style:italic; margin-top:0.3rem; line-height:1.5;">${snippet}</span>` : ''}
      </a>
    `;
  }).join('');
}

/* ── INJECT VERSE TOOLTIP ──────────────────────────────────────────────── */

(function() {
  if (document.getElementById('verse-tooltip')) return;
  const tooltip = document.createElement('div');
  tooltip.id = 'verse-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.innerHTML = `
    <div class="tt-ref" id="tt-ref"></div>
    <div class="tt-text" id="tt-text"></div>
    <div class="tt-version">World English Bible</div>
  `;
  document.body.appendChild(tooltip);
})();

/* ── SCRIPTURE TOOLTIP ─────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  const tooltip = document.getElementById('verse-tooltip');
  if (!tooltip) return;
  if (window.matchMedia('(hover: none)').matches) return;

  const ttRef  = document.getElementById('tt-ref');
  const ttText = document.getElementById('tt-text');
  let hideTimer;

  document.querySelectorAll('.scripture-ref').forEach(link => {
    link.addEventListener('mouseenter', e => {
      clearTimeout(hideTimer);
      ttRef.textContent  = link.dataset.ref   || '';
      ttText.textContent = link.dataset.verse  || '';
      tooltip.classList.add('visible');
      positionTooltip(e);
    });

    link.addEventListener('mousemove', positionTooltip);

    link.addEventListener('mouseleave', () => {
      hideTimer = setTimeout(() => tooltip.classList.remove('visible'), 200);
    });
  });

  tooltip.addEventListener('mouseenter', () => clearTimeout(hideTimer));
  tooltip.addEventListener('mouseleave', () => {
    hideTimer = setTimeout(() => tooltip.classList.remove('visible'), 200);
  });

  function positionTooltip(e) {
    const pad = 12;
    const tw  = tooltip.offsetWidth;
    const th  = tooltip.offsetHeight;
    let x = e.clientX + pad;
    let y = e.clientY + pad;
    if (x + tw > window.innerWidth  - pad) x = e.clientX - tw - pad;
    if (y + th > window.innerHeight - pad) y = e.clientY - th - pad;
    tooltip.style.left = x + 'px';
    tooltip.style.top  = y + 'px';
  }
});

/* ── SCRIPTURE TOOLTIP — MOBILE TAP ───────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  const isTorch = () => window.matchMedia('(hover: none)').matches;
  if (!isTorch()) return;

  document.querySelectorAll('.scripture-ref').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();

      // Remove any other open inline boxes first
      document.querySelectorAll('.scripture-inline').forEach(el => el.remove());

      // Build the inline box
      const box = document.createElement('div');
      box.className = 'scripture-inline';
      box.innerHTML = `
        <div class="tt-ref">${link.dataset.ref || ''}</div>
        <div class="tt-text">${link.dataset.verse || ''}</div>
        <div class="tt-version">World English Bible</div>
      `;

      // Insert it after the link's parent paragraph or directly after the link
      link.insertAdjacentElement('afterend', box);

      // Tap outside to dismiss
      setTimeout(() => {
        document.addEventListener('click', function dismiss(ev) {
          if (!box.contains(ev.target)) {
            box.remove();
            document.removeEventListener('click', dismiss);
          }
        });
      }, 10);
    });
  });
});


/* ── SCROLL REVEAL ─────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('section').forEach(s => {
    s.style.opacity = '1';
    observer.observe(s);
  });
});

// Auto-set canonical to current page URL (normalized)
if (!document.querySelector('link[rel="canonical"]')) {
  const link = document.createElement('link');
  link.rel = 'canonical';
  link.href = window.location.href.split('?')[0].split('#')[0];
  document.head.appendChild(link);
}
/* ── DROPDOWN NAV (touch support) ─────────────────────────────────────── */

document.querySelectorAll('.nav-dropdown').forEach(function(dropdown) {
  dropdown.addEventListener('click', function(e) {
    // Only handle touch/click on the button itself, not hover-opened menus
    if (e.target.closest('.nav-dropdown-menu')) return;
    const isOpen = dropdown.classList.contains('open');
    // Close all other dropdowns first
    document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
    if (!isOpen) dropdown.classList.add('open');
  });
});

// Close dropdown when clicking anywhere outside
document.addEventListener('click', function(e) {
  if (!e.target.closest('.nav-dropdown')) {
    document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
  }
});

/* ── CLOSE SEARCH RESULTS ──────────────────────────────────────────────── */

document.addEventListener('click', e => {
  const box = document.getElementById('search-results');
  if (box && !e.target.closest('#search-results, #site-search')) box.style.display = 'none';
});
document.addEventListener('keydown', e => {
  const box = document.getElementById('search-results');
  if (e.key === 'Escape' && box) box.style.display = 'none';
});
document.addEventListener('focusin', e => {
  if (e.target.id === 'site-search' && e.target.value.trim()) runSearch(e.target.value);
});


// ── NAV: "Study Tools" dropdown (click/tap to toggle; hover and keyboard work via CSS) ──
(function () {
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.nav-drop-btn');
    document.querySelectorAll('.nav-drop.open').forEach(function (d) {
      if (!btn || d !== btn.parentNode) { d.classList.remove('open'); d.querySelector('.nav-drop-btn').setAttribute('aria-expanded', 'false'); }
    });
    if (btn) {
      var d = btn.parentNode, on = d.classList.toggle('open');
      btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.nav-drop.open').forEach(function (d) { d.classList.remove('open'); });
  });
})();

/* ── NAV: with a mouse, only one menu at a time, and it lets go on the way out ── */
(function () {
  if (!window.matchMedia || !window.matchMedia('(hover: hover)').matches) return;

  function closeDrop(d) {
    d.classList.remove('open');
    var btn = d.querySelector('.nav-drop-btn');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    // :focus-within also holds a menu open, so a clicked button has to let go of focus
    if (d.contains(document.activeElement) && document.activeElement.blur) document.activeElement.blur();
  }

  document.querySelectorAll('.nav-drop').forEach(function (drop) {
    drop.addEventListener('mouseenter', function () {
      document.querySelectorAll('.nav-drop').forEach(function (d) {
        if (d !== drop) closeDrop(d);
      });
    });
    drop.addEventListener('mouseleave', function () { closeDrop(drop); });
  });
})();

/* ==========================================================================
   Bible book abbreviations for tight display areas (homepage progress box,
   plan tabs). Keyed by the same canonical names as BOOK_CODES in
   reading-plans.js — the two maps must stay in step; wbCheckBookAbbr()
   below reports any key that is in one and not the other.
   ========================================================================== */
window.WB_BOOK_ABBR = {
  "Genesis":"Gen","Exodus":"Ex","Leviticus":"Lev","Numbers":"Num","Deuteronomy":"Deut",
  "Joshua":"Josh","Judges":"Judg","Ruth":"Ruth","1 Samuel":"1 Sam","2 Samuel":"2 Sam",
  "1 Kings":"1 Kgs","2 Kings":"2 Kgs","1 Chronicles":"1 Chr","2 Chronicles":"2 Chr",
  "Ezra":"Ezra","Nehemiah":"Neh","Esther":"Esth","Job":"Job","Psalms":"Ps",
  "Proverbs":"Prov","Ecclesiastes":"Eccl","Song of Songs":"Song","Isaiah":"Isa",
  "Jeremiah":"Jer","Lamentations":"Lam","Ezekiel":"Ezek","Daniel":"Dan","Hosea":"Hos",
  "Joel":"Joel","Amos":"Amos","Obadiah":"Obad","Jonah":"Jonah","Micah":"Mic",
  "Nahum":"Nah","Habakkuk":"Hab","Zephaniah":"Zeph","Haggai":"Hag","Zechariah":"Zech",
  "Malachi":"Mal","Matthew":"Matt","Mark":"Mark","Luke":"Luke","John":"John",
  "Acts":"Acts","Romans":"Rom","1 Corinthians":"1 Cor","2 Corinthians":"2 Cor",
  "Galatians":"Gal","Ephesians":"Eph","Philippians":"Phil","Colossians":"Col",
  "1 Thessalonians":"1 Thess","2 Thessalonians":"2 Thess","1 Timothy":"1 Tim",
  "2 Timothy":"2 Tim","Titus":"Titus","Philemon":"Phlm","Hebrews":"Heb","James":"Jas",
  "1 Peter":"1 Pet","2 Peter":"2 Pet","1 John":"1 John","2 John":"2 John",
  "3 John":"3 John","Jude":"Jude","Revelation":"Rev"
};

/* "Numbers 29" -> "Num 29". Longest book name first, so "1 John" is not
   matched as "John". An unknown book is returned untouched. */
window.wbAbbrevPassage = (function () {
  var keys = Object.keys(window.WB_BOOK_ABBR).sort(function (a, b) { return b.length - a.length; });
  return function (passage) {
    if (!passage) return passage;
    for (var i = 0; i < keys.length; i++) {
      if (passage.indexOf(keys[i]) === 0) {
        return window.WB_BOOK_ABBR[keys[i]] + passage.slice(keys[i].length);
      }
    }
    return passage;
  };
})();

/* Dev guard: call from the console on the reading-plans page. */
window.wbCheckBookAbbr = function () {
  if (typeof BOOK_CODES === 'undefined') return 'BOOK_CODES not on this page';
  var a = Object.keys(window.WB_BOOK_ABBR), b = Object.keys(BOOK_CODES);
  var missing = b.filter(function (k) { return a.indexOf(k) < 0; });
  var extra   = a.filter(function (k) { return b.indexOf(k) < 0; });
  return (missing.length || extra.length)
    ? { missingFromAbbr: missing, notInBookCodes: extra }
    : 'in step: ' + a.length + ' books';
};

/* ── FIRST-PARTY PAGE ANALYTICS (ticket 162) ────────────────────────────────
   One row per page view into Supabase `page_views`, one per settled site
   search into `search_events`. Read back only by /analytics, which is gated
   by is_admin() inside every admin_* RPC.

   No library needed - a plain fetch to the REST endpoint - so this runs on
   every page whether or not auth.js has finished loading supabase-js. It is
   here in scripts.js rather than in its own file because all 93 pages
   already load scripts.js; a separate file would mean 93 script tags.

   Deliberately anonymous: no cookie, no IP, no user-agent string, no
   cross-visit id. The session id is random, lives in sessionStorage and dies
   with the tab, so it counts sessions without being able to link two visits
   by the same reader. It counts every visitor, signed in or not - `anon` is
   Supabase's not-signed-in role and it holds the INSERT grant.

   Switches, per browser:
     localStorage['wb-analytics-off']   = '1'  -> never log from this browser
     localStorage['wb-analytics-local'] = '1'  -> also log from localhost
   -------------------------------------------------------------------------- */
(function () {
  'use strict';

  var REST = 'https://tgzsyfmnzagqijjlzxsa.supabase.co/rest/v1/';
  var KEY  = 'sb_publishable_gck7v-L2PDbW2JKUoxTHDA_FidLWw8H';
  var host = location.hostname;

  function flag(name) {
    try { return localStorage.getItem(name) === '1'; } catch (e) { return false; }
  }

  var isLocal = !host || host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
  if (flag('wb-analytics-off')) return;
  if (isLocal && !flag('wb-analytics-local')) return;
  if (navigator.globalPrivacyControl === true) return;   // legal opt-out in several US states
  if (/^\/analytics(\.html)?$/.test(location.pathname)) return;   // don't inflate its own numbers

  var SID = (function () {
    try {
      var k = 'wb-sid', v = sessionStorage.getItem(k);
      if (!v) {
        v = (Date.now().toString(36) + Math.random().toString(36).slice(2, 12)).slice(0, 24);
        sessionStorage.setItem(k, v);
      }
      return v;
    } catch (e) {
      return 'nostore-' + Math.random().toString(36).slice(2, 12);
    }
  })();

  /* Referrer buckets. AI is tested before search on purpose: gemini.google.com
     would otherwise match the google. search rule and be filed as a search. */
  var AI = ['chatgpt.com', 'openai.com', 'claude.ai', 'anthropic.com', 'perplexity.ai',
            'copilot.microsoft.com', 'gemini.google.com', 'poe.com', 'you.com'];
  var SEARCH = ['google.', 'bing.com', 'duckduckgo.com', 'yahoo.', 'ecosia.org',
                'startpage.com', 'qwant.com', 'brave.com', 'yandex.', 'baidu.com',
                'mojeek.com', 'marginalia.nu'];
  var SOCIAL = ['facebook.com', 'fb.me', 't.co', 'twitter.com', 'x.com', 'instagram.com',
                'reddit.com', 'youtube.com', 'youtu.be', 'linkedin.com', 'pinterest.',
                'tiktok.com', 'discord.com', 'threads.net', 'substack.com', 'bsky.app',
                'tumblr.com'];

  function hit(list, h) {
    for (var i = 0; i < list.length; i++) if (h.indexOf(list[i]) > -1) return true;
    return false;
  }

  function classify(refHost) {
    if (!refHost) return 'direct';
    if (refHost === host || refHost === 'www.' + host || 'www.' + refHost === host) return 'internal';
    if (hit(AI, refHost))     return 'ai';
    if (hit(SEARCH, refHost)) return 'search';
    if (hit(SOCIAL, refHost)) return 'social';
    return 'referral';
  }

  function deviceClass() {
    var w = window.innerWidth || (screen && screen.width) || 0;
    if (w && w <= 640)  return 'mobile';
    if (w && w <= 1024) return 'tablet';
    return 'desktop';
  }

  function trim(s, n) { return s ? String(s).slice(0, n) : null; }

  function post(table, row) {
    try {
      fetch(REST + table, {
        method: 'POST',
        keepalive: true,
        headers: {
          'apikey': KEY,
          'Authorization': 'Bearer ' + KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(row)
      })['catch'](function () {});      // analytics must never break a page
    } catch (e) { /* ignore */ }
  }

  /* ── the page view ───────────────────────────────────────────────────── */
  var refHost = '', refPath = '';
  if (document.referrer) {
    try {
      var u = new URL(document.referrer);
      refHost = u.hostname || '';
      refPath = (u.pathname || '') + (u.search || '');
    } catch (e) { /* malformed referrer */ }
  }

  post('page_views', {
    path: trim(location.pathname + location.search, 400) || '/',
    title: trim(document.title, 300),
    referrer_host: trim(refHost, 160),
    referrer_path: trim(refPath, 400),
    source: classify(refHost),
    device: deviceClass(),
    session_id: SID
  });

  /* -- site searches ------------------------------------------------------
     This box filters as you type, so there is no submit event and no natural
     "the search is finished" moment. The first version guessed at one with a
     debounce, and guessed wrong: a slow typist pausing longer than the delay
     logged "John 3:", "John 3:1" and "John 3:16" as three separate searches.
     No delay fixes that - whatever you pick is too short for someone, and too
     long is worse, because a considered phrase like "free grace theology Zane
     Hodges John 3" takes a while to type and must not be cut into fragments.

     So nothing is timed. A search is logged when the reader does something
     that means they are done with it:

       Enter            - explicit
       clicks a result  - found it; the term that produced the click is logged
       leaves the box   - searched, clicked nothing. The most useful row here,
                          because it is somebody who did not find what they
                          wanted, whether or not there were results
       leaves the page  - same, caught on the way out

     One row per search: committing a term blocks it from being logged again
     until the term changes, so the blur that precedes a result click does not
     double up. Clearing the box resets that, since searching the same thing
     again later is a real second search.

     admin_top_searches still collapses a term that a longer term from the
     same session extends. Belt and braces: it also tidies the case where
     somebody blurs mid-phrase and comes back to finish it.

     The result count repeats runSearch's own filter because that function
     does not return one - if you change the filter there, change it here. */
  var pendingTerm = '';     // what is in the box right now
  var committedTerm = '';   // lower-cased, already logged

  function resultCountFor(term) {
    var key = term.toLowerCase(), n = 0;
    try {
      if (typeof searchIndex !== 'undefined' && searchIndex && searchIndex.length) {
        n = searchIndex.filter(function (a) {
          return (a.title + ' ' + a.excerpt + ' ' + a.content + ' ' + (a.tags || []).join(' '))
            .toLowerCase().indexOf(key) > -1;
        }).length;
      }
    } catch (e) { /* index not loaded yet */ }
    return n;
  }

  function commitSearch() {
    var term = pendingTerm;
    if (term.length < 3 || term.length > 120) return;
    if (term.toLowerCase() === committedTerm) return;
    committedTerm = term.toLowerCase();
    post('search_events', {
      term: term.slice(0, 120),
      results_count: Math.max(0, Math.min(resultCountFor(term), 32767)),
      path: trim(location.pathname, 400),
      session_id: SID
    });
  }

  if (typeof window.runSearch === 'function') {
    var innerRunSearch = window.runSearch;
    window.runSearch = function (q) {
      var t = String(q == null ? '' : q).trim();
      pendingTerm = t;
      if (!t) committedTerm = '';     // box cleared - the next search starts fresh
      return innerRunSearch.apply(this, arguments);
    };
  }

  document.addEventListener('keydown', function (e) {
    if (e.target && e.target.id === 'site-search' && e.key === 'Enter') commitSearch();
  });

  /* Capture phase, so the row is written before the browser starts leaving.
     keepalive on the fetch is what lets it survive the navigation. */
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t && t.closest && t.closest('#search-results a')) commitSearch();
  }, true);

  document.addEventListener('focusout', function (e) {
    if (e.target && e.target.id === 'site-search') commitSearch();
  });

  window.addEventListener('pagehide', commitSearch);
})();
