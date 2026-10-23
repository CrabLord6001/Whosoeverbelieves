/* ── SITE UPDATES ────────────────────────────────────────────────────────────
   The "What's New?" timeline. One source of truth for two places:
   the homepage block (newest five) and /updates (all of them).

   Edit THIS file only. Both pages carry a copy of the current entries written
   into their markup as a no-JavaScript fallback; those copies go stale on
   their own and are not worth chasing for a handful of readers without JS.

   Each entry:
     date  ISO, used for sorting and display
     text  3-5 words, commit-note style, title case
     url   internal, absolute and extensionless (site convention)

   WHERE ENTRIES COME FROM. The "Site Updates" tab of the Claude Master Task Log
   (sheet 1kpO14xJUrGsCATN33AsZbFjHCO1KUDIR0fHuaxTyyMk) is the queue. The Daily
   Website Rollup appends candidates there as Proposed; Jonathan flips a row to
   Approved or Rejected. Syncing means: take every Approved row, newest first,
   write them into the array below, and regenerate the inline fallback rows in
   index.html and updates.html to match. Nothing else writes this file.

   ONE EVENT PER ENTRY, NOT ONE PUSH. A run of related work is a single line:
   twenty KJV audio pushes across a fortnight are "KJV Audio for Reading Plans"
   on the day the run finished, not twenty rows. Only what a reader would care
   about belongs here at all -- bug fixes, refactors and tooling do not.
*/

const siteUpdates = [
  { date: "2026-10-22", text: "Book of Abraham Article Published",     url: "/articles/book-of-abraham-testable-claim" },
  { date: "2026-10-21", text: "KJV Audio for Reading Plans",           url: "/bible-reading-plans" },
  { date: "2026-10-21", text: "Five More Memory Rooms Added",          url: "/memory-rooms" },
  { date: "2026-10-20", text: "Galatians 6:16 Exegesis Corrected",     url: "/greek/galatians/galatians-6-11-18" },
  { date: "2026-10-16", text: "Eschatology Glossary Entries Added",    url: "/free-grace-glossary" }
];

/* Fills an <ol class="upd-list"> with the newest entries.
   hostId  element to fill
   limit   how many to show (0 or omitted = all)
   year    true to append the year to each date (used on /updates) */
function wbUpdatesRender(hostId, limit, year) {
  var host = document.getElementById(hostId);
  if (!host || typeof siteUpdates === 'undefined' || !siteUpdates.length) return;

  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function when(iso) {
    var p = iso.split('-');
    var out = MON[Number(p[1]) - 1] + ' ' + Number(p[2]);
    return year ? out + ', ' + p[0] : out;
  }

  var rows = siteUpdates.slice().sort(function (a, b) {
    return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
  });
  if (limit) rows = rows.slice(0, limit);

  host.innerHTML = '';
  rows.forEach(function (u) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.className = 'upd-row';
    a.href = u.url;

    var d = document.createElement('span');
    d.className = 'upd-date';
    d.textContent = when(u.date);

    var t = document.createElement('span');
    t.className = 'upd-text';
    t.textContent = u.text;

    a.appendChild(d);
    a.appendChild(t);
    li.appendChild(a);
    host.appendChild(li);
  });
}
