/* Article tools: Print / PDF buttons and Previous / Next article links.
   Load on article pages after scripts.js:  <script src="/article-tools.js" defer></script>
   Previous/Next order comes from search-index.js (by date), so new articles
   join the chain automatically once they're added to the index. */
(function () {
  var article = document.querySelector('.article-body');
  if (!article) return;

  var ICON_PRINT = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="1.5"/><path d="M6 14h12v7H6z"/></svg>';
  var ICON_PDF = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z"/><path d="M14 3v5h5"/><path d="M12 11v6M9.5 14.5 12 17l2.5-2.5"/></svg>';

  var titleEl = document.querySelector('.article-title');
  var articleTitle = titleEl ? titleEl.textContent.trim() : document.title;

  function printArticle(asPdf) {
    var oldTitle = document.title;
    // Browsers use the page title as the default PDF file name.
    if (asPdf) document.title = articleTitle + ' - Whosoever Believes';
    window.print();
    setTimeout(function () { document.title = oldTitle; }, 500);
  }

  function makeToolbar(extraClass) {
    var bar = document.createElement('div');
    bar.className = 'article-tools ' + (extraClass || '');
    bar.innerHTML =
      '<button type="button" class="at-btn" data-act="print" title="Print this article">' + ICON_PRINT + '<span>Print</span></button>' +
      '<button type="button" class="at-btn" data-act="pdf" title="Save as PDF (choose &quot;Save as PDF&quot; in the print window)">' + ICON_PDF + '<span>PDF</span></button>';
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('.at-btn');
      if (b) printArticle(b.getAttribute('data-act') === 'pdf');
    });
    return bar;
  }

  // 1) Buttons at the end of the article
  article.appendChild(makeToolbar('article-tools-end'));

  // 2) Source line that appears only on paper / PDF
  var src = document.createElement('p');
  src.className = 'print-source';
  var canon = document.querySelector('link[rel="canonical"]');
  src.textContent = 'Source: ' + (canon ? canon.href : location.href.split('#')[0]);
  article.appendChild(src);

  // 3) Previous / Next — wait for search-index.js (the page loads it lazily)
  var here = location.pathname.replace(/\.html$/, '').replace(/\/$/, '');
  var tries = 0;
  (function waitForIndex() {
    if (typeof searchIndex === 'undefined') {
      if (++tries < 60) setTimeout(waitForIndex, 100);
      return;
    }
    var list = searchIndex
      .map(function (x, i) { return { x: x, i: i }; })
      .filter(function (o) { return o.x.url && o.x.url.indexOf('/articles/') === 0; })
      .sort(function (a, b) { return (a.x.date || '').localeCompare(b.x.date || '') || a.i - b.i; })
      .map(function (o) { return o.x; });
    var pos = -1;
    for (var k = 0; k < list.length; k++) {
      if (list[k].url.replace(/\.html$/, '').toLowerCase() === here.toLowerCase()) { pos = k; break; }
    }
    if (pos === -1) return;
    var prev = list[pos - 1], next = list[pos + 1];
    if (!prev && !next) return;

    function card(item, dir) {
      if (!item) return '<span class="an-card an-empty" aria-hidden="true"></span>';
      var label = dir === 'prev' ? '&#8592; Previous' : 'Next &#8594;';
      var t = document.createElement('span'); t.textContent = item.title;
      return '<a class="an-card an-' + dir + '" href="' + item.url + '" rel="' + dir + '" aria-label="' + (dir === 'prev' ? 'Previous' : 'Next') + ' article: ' + t.innerHTML.replace(/"/g, '&quot;') + '">' +
             '<span class="an-label">' + label + '</span>' +
             '<span class="an-title">' + t.innerHTML + '</span></a>';
    }
    var nav = document.createElement('div');
    nav.setAttribute('role', 'navigation');
    nav.className = 'article-nav';
    nav.setAttribute('aria-label', 'More articles');
    nav.innerHTML = card(prev, 'prev') + card(next, 'next');
    article.insertAdjacentElement('afterend', nav);
  })();
})();
