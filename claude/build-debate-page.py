"""Builds debate.html (served at /debate) from the standalone prototype.

The prototype is the page without the site's head: no canonical, no analytics,
no favicons, no auth.js, no footer. This script adds those and nothing else, so
the two copies never drift. Every insert is asserted, because a replace that
silently matches nothing has cost us two rendering bugs already.

Run:  py claude/build-debate-page.py <prototype.html>
      defaults to claude/debate-prototype.html, writes debate.html beside it.
"""
import sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'claude', 'debate-prototype.html')
OUT = os.path.join(ROOT, 'debate.html')
src = open(SRC, encoding='utf-8').read()
DESC = ("Build a debate format block by block, then run it with a timer that holds each side to its "
        "time and writes a log you can line up with your recording.")
TITLE = "Debate Format Runner — Whosoever Believes"
URL = "https://whosoeverbelieves.com/debate"
IMG = "https://whosoeverbelieves.com/images/cross-sunrise.png"
fonts = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=Public+Sans:wght@400;500;600&family=Spectral:wght@500;600&display=swap" rel="stylesheet">\n')
new_head = f'''<head>
<link rel="canonical" href="{URL}" />
<!-- Google tag (gtag.js) -->
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());
  gtag('config', 'G-05VNP2PXN4');
  // Analytics loads just after the page finishes, so it doesn't slow the first paint.
  window.addEventListener('load', function () {{ setTimeout(function () {{ var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=G-05VNP2PXN4'; document.head.appendChild(s); }}, 1500); }});
</script>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{TITLE}</title>
<meta name="description" content="{DESC}" />
{fonts}<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/images/favicon.svg">
<link rel="icon" type="image/png" sizes="96x96" href="/images/icon-96.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Whosoever Believes" />
<meta property="og:url" content="{URL}" />
<meta property="og:title" content="{TITLE}" />
<meta property="og:description" content="{DESC}" />
<meta property="og:image" content="{IMG}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{TITLE}" />
<meta name="twitter:description" content="{DESC}" />
<meta name="twitter:image" content="{IMG}" />
<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {{ "@type": "ListItem", "position": 1, "name": "Whosoever Believes", "item": "https://whosoeverbelieves.com/" }},
    {{ "@type": "ListItem", "position": 2, "name": "Debate Format Runner", "item": "{URL}" }}
  ]
}}
</script>
'''
out = src[:src.index('<head>')] + new_head + src[src.index('<style>'):]
FOOT_ANCHOR = '</section>\n\n</div>\n\n<script>'
assert out.count(FOOT_ANCHOR) == 1, 'footer anchor missing or ambiguous — the page changed shape'
out = out.replace(FOOT_ANCHOR,
                  '</section>\n\n<footer class="pagefoot"><a href="/">Whosoever Believes</a></footer>\n\n</div>\n\n<script src="/auth.js" defer></script>\n\n<script>', 1)
open(OUT, 'w', encoding='utf-8', newline='').write(out)
import re
blocks = re.findall(r'<script>(.*?)</script>', out, re.S)
for needle, label in [('.promptbox{', 'Analyze stylesheet'),
                      ('.pagefoot{', 'footer stylesheet'),
                      ('class="pagefoot"', 'footer markup'),
                      ('src="/auth.js"', 'auth script'),
                      ('panel-analyze', 'Analyze panel')]:
    assert needle in out, 'missing from the built page: ' + label
checks = {
  'bytes': len(out),
  'promptbox css': out.count('.promptbox{'),
  'footer': out.count('class="pagefoot"'),
  'analyze panel': int('panel-analyze' in out),
  'script blocks': len(blocks),
}
print(checks)
print('wrote', OUT)
