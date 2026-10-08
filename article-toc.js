/* "On this page" sidebar for article pages.
   Load after scripts.js:  <script src="/article-toc.js" defer></script>

   Built from the article's own h2/h3 headings, exactly like the charts
   sidebar. Headings get ids generated from their text, so no article HTML
   has to change — this works on every existing article as-is. A heading can
   override its sidebar label with data-toc="Shorter name" when the real
   heading is too long for the column.

   Wide screens only (see article-toc.css). It sits in the left margin and
   never overlaps the text. */
(function () {
  function build() {
    var article = document.querySelector('.article-body');
    if (!article) return;

    var heads = Array.prototype.slice
      .call(article.querySelectorAll('h2, h3'))
      .filter(function (h) {
        return h.textContent.trim() && !h.closest('.footnotes');
      });
    if (heads.length < 4) return;

    /* ids from the heading text, deduped */
    heads.forEach(function (h) {
      if (h.id) return;
      var base = h.textContent
        .toLowerCase()
        .replace(/[‘’“”'"]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'section';
      var slug = base, n = 2;
      while (document.getElementById(slug)) slug = base + '-' + n++;
      h.id = slug;
    });

    var nav = document.createElement('aside');
    nav.className = 'article-toc';
    nav.setAttribute('aria-label', 'On this page');
    nav.innerHTML =
      '<b>On this page</b><ol>' +
      heads.map(function (h) {
        var label = h.getAttribute('data-toc') || h.textContent;
        return '<li class="at-' + h.tagName.toLowerCase() + '"><a href="#' + h.id + '">' +
          label.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</a></li>';
      }).join('') +
      '</ol>';
    document.body.appendChild(nav);

    var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
    links.forEach(function (a, i) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        heads[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + heads[i].id);
      });
    });

    var ticking = false;
    function update() {
      ticking = false;
      var cur = 0;
      heads.forEach(function (h, i) {
        if (h.getBoundingClientRect().top < 160) cur = i;
      });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        cur = heads.length - 1;
      }
      links.forEach(function (a, i) { a.classList.toggle('on', i === cur); });
      var r = article.getBoundingClientRect();
      nav.classList.toggle('hide', r.bottom < nav.offsetTop + nav.offsetHeight + 40);
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
