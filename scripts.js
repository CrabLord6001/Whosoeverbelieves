/* ==========================================================================
   WHOSOEVER — Shared Scripts
   Free Grace Theology & Biblical Studies
   ========================================================================== */

// Auto-inject favicon
const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/png';
favicon.href = '/images/Bible-Book-32.png';
document.head.appendChild(favicon);


/* ── FONT SIZE ─────────────────────────────────────────────────────────── */

function setSize(size) {
  const sizes = ['default', 'font-small', 'font-large'];
  sizes.forEach(s => document.documentElement.classList.remove(s));
  if (size !== 'default') document.documentElement.classList.add(size);
  localStorage.setItem('fontPref', size);
  const labels = { default:'A', 'font-small':'A-', 'font-large':'A+' };
  document.querySelectorAll('.font-size-group button').forEach(b => {
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

function getSnippet(content, query) {
  const index = content.toLowerCase().indexOf(query);
  if (index === -1) return '';
  const start = Math.max(0, index - 60);
  const end = Math.min(content.length, index + query.length + 60);
  let snippet = (start > 0 ? '…' : '') + content.slice(start, end) + (end < content.length ? '…' : '');
  const regex = new RegExp(`(${query})`, 'gi');
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


/* ── SCRIPTURE TOOLTIP ─────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  const tooltip = document.getElementById('verse-tooltip');
  if (!tooltip) return;

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
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('section').forEach(s => {
    s.style.opacity = '1';
    observer.observe(s);
  });
});
