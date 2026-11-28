# Search Console indexing — diagnosis and fix list (ticket 175)

Snapshot 27 Nov 2026. GSC data last updated 11/22/26. Indexed 57, Not indexed 70.

## Summary

Nothing is broken. Verified clean:

- `robots.txt` is `Allow: /` with no `Disallow`.
- Sitemap status **Success**, 93 pages discovered, last read Nov 22, 2026. Real varied `lastmod` dates, no `priority`/`changefreq` padding.
- Every internal link is a static `<a href>` (no JS-injected navigation) and every one is extensionless.
- `search-index.js` and `llms.txt` contain zero `.html` URLs.
- `_to_delete/` returns 404 (Jekyll skips underscore directories), and the untracked `Claude outputs/` folder is not deployed. Neither is reaching Google.
- Admin pages (`taskboard`, `analytics`, `moderate-comments`, `mailing`) all carry `noindex, nofollow`.

The 70 is two unrelated situations plus three benign rows.

## 1. Google is overriding the canonical on 15 pages (cosmetic)

URL Inspection on `https://whosoeverbelieves.com/charts/esther-in-context.html`:

- User-declared canonical: `https://whosoeverbelieves.com/charts/esther-in-context`
- Google-selected canonical: **Inspected URL** (the `.html` one)
- Last crawl Nov 16, 2026. Crawl allowed yes, fetch successful, indexing allowed yes.

So Google is keeping the old `.html` URL and ignoring the canonical tag. It does that because the extensionless twin has never been crawled, and GitHub Pages cannot serve a 301 from `/foo.html` to `/foo` — the file *is* the page. A canonical tag alone is a hint, not a directive, and it loses to a URL that already has crawl history.

These 15 pages are indexed and findable, just under the old URL. Their extensionless twins make up 15 of the 49 "Discovered - currently not indexed". No traffic is being lost; link equity is split between two forms.

esther-in-context · kjv-dragons-tannin · james-3-1-12 · james-4-7-17 · Millennial-Kingdom-Isaiah · bookending-the-ot · seventy-weeks · kings-israel-judah · memory-rooms · studies/titus · Call-On-The-Lord-Romans-10 · pauls-letters · pauls-journeys · implications-of-gods-transcendence · free-grace-gospel

## 2. About 36 pages are in Google under neither URL form (the real problem)

These were discovered (mostly from the sitemap, submitted Sep 26, 2026) and have **never been crawled** — every one shows Last crawled `N/A`. That is crawl rationing on a low-authority site, not a page defect. Whole clusters are affected while their neighbours are indexed: 8 of 13 Galatians pages, 8 chart pages, and most section landers.

The lever that works is Request Indexing in URL Inspection, which forces a crawl. The quota is roughly 10-12 per day.

### Batch 1 — hubs and tools (highest value)
```
https://whosoeverbelieves.com/free-grace-glossary
https://whosoeverbelieves.com/greek/
https://whosoeverbelieves.com/greek/flashcards
https://whosoeverbelieves.com/greek/vocabulary
https://whosoeverbelieves.com/greek/Verb-Parsing
https://whosoeverbelieves.com/greek/titus/
https://whosoeverbelieves.com/greek/1john/
https://whosoeverbelieves.com/articles/Davidic-Covenant-Overview
https://whosoeverbelieves.com/articles/Holy-Spirit-Role-in-Believers
https://whosoeverbelieves.com/articles/osborne-hermeneutical-spiral
```

### Batch 2 — articles with no indexed form at all
```
https://whosoeverbelieves.com/articles/Age-Of-The-Universe-Problems-Solutions
https://whosoeverbelieves.com/articles/Faithful-Saying-2-Timothy-211-13
https://whosoeverbelieves.com/articles/Jesus-Challenging-Presuppositions
https://whosoeverbelieves.com/articles/New-Covenant-Jeremiah-31
https://whosoeverbelieves.com/articles/Book-Of-Daniel-Outline
https://whosoeverbelieves.com/articles/bible-memory-rooms
https://whosoeverbelieves.com/greek/james/james-1-13-27
https://whosoeverbelieves.com/greek/james/james-2-1-13
https://whosoeverbelieves.com/greek/james/james-5-12-20
https://whosoeverbelieves.com/greek/1john/1john-4-1-16
```

### Batch 3 — Galatians
```
https://whosoeverbelieves.com/greek/galatians/galatians-1-11-24
https://whosoeverbelieves.com/greek/galatians/galatians-2-1-10
https://whosoeverbelieves.com/greek/galatians/galatians-2-11-21
https://whosoeverbelieves.com/greek/galatians/galatians-3-1-14
https://whosoeverbelieves.com/greek/galatians/galatians-4-1-16
https://whosoeverbelieves.com/greek/galatians/galatians-4-17-31
https://whosoeverbelieves.com/greek/galatians/galatians-5-1-12
https://whosoeverbelieves.com/greek/galatians/galatians-5-13-26
```

### Batch 4 — charts
```
https://whosoeverbelieves.com/charts/exodus-route
https://whosoeverbelieves.com/charts/future-events
https://whosoeverbelieves.com/charts/genesis-generations
https://whosoeverbelieves.com/charts/herodian-dynasty
https://whosoeverbelieves.com/charts/job-debate
https://whosoeverbelieves.com/charts/judges-cycle
https://whosoeverbelieves.com/charts/psalms-five-books
https://whosoeverbelieves.com/charts/zechariah
```

### Batch 5 — optional, cosmetic
The 15 extensionless twins from section 1. Only worth doing once batches 1-4 are through; the content is already findable.

## 3. Benign rows — nothing to do

- **Page with redirect (2)**: `http://whosoeverbelieves.com/` and `http://www.whosoeverbelieves.com/`, both redirecting to the canonical HTTPS host. Correct.
- **Alternate page with proper canonical tag (9)**: `.html` twins being deduped onto the extensionless canonical. This is the migration working. The count climbing is good news.
- **Not found 404 (0)**: nothing.
- **Duplicate, Google chose different canonical than user (1)**: `/articles/Gods-Forever-Dwelling-Psalm-132.html`, last crawled Jul 1, 2026. The extensionless form is indexed (crawled Jul 31). Stale entry; it should clear on its own.

## 4. Small cleanups to decide on

- `/claude/herod-family-chart` returns 200 and is publicly reachable. It is the only file under `claude/` that is served (the `.md` files all 404). It is not in the sitemap and probably should not be a public page — either add `noindex` or move it.
- `privacy`, `greek/compare/` and `claude/herod-family-chart` are live but absent from `sitemap.xml`. The first two are already indexed anyway, so this is tidiness rather than a fix.
- `/articles/` returns 404 because `articles.html` wins at `/articles` and there is no `articles/index.html`. Known and accepted; no inbound links point at `/articles/`.

## 5. Do not press "Validate Fix" yet

Two validation runs have already failed: Alternate-canonical started 10/7/26, failed 10/13/26; Crawled-not-indexed started 10/5/26, failed 11/6/26. They failed because nothing had actually changed between submission and validation. Running validation again before the URLs have been resubmitted just resets the clock and produces another failure.

Request indexing first. Validate after the counts start moving.
