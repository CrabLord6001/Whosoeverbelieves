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

  var canon = document.querySelector('link[rel="canonical"]');
  var pageUrl = canon ? canon.href : location.href.split('#')[0];

  var ICON_FB = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15z"/></svg>';
  var ICON_X = '<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>';
  var ICON_MAIL = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m3.5 6 8.5 7 8.5-7"/></svg>';
  var ICON_SHARE = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M7.5 7.5 12 3l4.5 4.5"/><path d="M5 12v7.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V12"/></svg>';

  // Phones get one Share button that opens the phone's own share menu.
  var useNativeShare = !!navigator.share && window.matchMedia('(hover: none)').matches;

  function makeToolbar(extraClass) {
    var u = encodeURIComponent(pageUrl), t = encodeURIComponent(articleTitle);
    var share = useNativeShare
      ? '<button type="button" class="at-btn" data-act="share" title="Share this article">' + ICON_SHARE + '<span>Share</span></button>'
      : '<a class="at-btn" href="https://www.facebook.com/sharer/sharer.php?u=' + u + '" target="_blank" rel="noopener" title="Share on Facebook">' + ICON_FB + '<span>Facebook</span></a>' +
        '<a class="at-btn" href="https://x.com/intent/post?url=' + u + '&text=' + t + '" target="_blank" rel="noopener" title="Share on X">' + ICON_X + '<span>X</span></a>' +
        '<a class="at-btn" href="mailto:?subject=' + t + '&body=' + t + '%0A%0A' + u + '" title="Share by email">' + ICON_MAIL + '<span>Email</span></a>';
    var bar = document.createElement('div');
    bar.className = 'article-tools ' + (extraClass || '');
    bar.innerHTML =
      '<div class="at-group">' +
        '<button type="button" class="at-btn" data-act="print" title="Print this article">' + ICON_PRINT + '<span>Print</span></button>' +
        '<button type="button" class="at-btn" data-act="pdf" title="Save as PDF (choose &quot;Save as PDF&quot; in the print window)">' + ICON_PDF + '<span>PDF</span></button>' +
      '</div>' +
      '<div class="at-group at-share" aria-label="Share this article">' + share + '</div>';
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button.at-btn');
      if (!b) return;
      var act = b.getAttribute('data-act');
      if (act === 'share') { navigator.share({ title: articleTitle, url: pageUrl }).catch(function () {}); return; }
      printArticle(act === 'pdf');
    });
    return bar;
  }

  // 1) Buttons at the end of the article
  article.appendChild(makeToolbar('article-tools-end'));

  // 2) Source line that appears only on paper / PDF
  var src = document.createElement('p');
  src.className = 'print-source';
  src.textContent = 'Source: ' + pageUrl;
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
