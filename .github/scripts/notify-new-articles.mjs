#!/usr/bin/env node
// Emails Jonathan one "ready to send" link per newly published article.
// Nothing reaches subscribers here: the broadcast goes out only when he
// clicks Send to All Subscribers on /announce.
//
// Reads the article list from $ADDED (JSON, produced by detect-new-articles.mjs).

const SITE = 'https://whosoeverbelieves.com';
const FROM = 'Whosoever Believes <updates@whosoeverbelieves.com>';

const apiKey = process.env.RESEND_API_KEY;
const to = process.env.NOTIFY_EMAIL;
if (!apiKey) { console.error('RESEND_API_KEY is not set.'); process.exit(1); }
if (!to) { console.error('ANNOUNCE_NOTIFY_EMAIL is not set.'); process.exit(1); }

let added = [];
try { added = JSON.parse(process.env.ADDED || '[]'); } catch { added = []; }
if (!Array.isArray(added) || added.length === 0) {
  console.log('Nothing new to announce.');
  process.exit(0);
}

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

let failed = 0;

for (const a of added) {
  const announce = `${SITE}/announce?article=${encodeURIComponent(a.url)}`;
  const live = `${SITE}${a.url}`;
  const subject = `Ready to announce: ${a.title}`;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#f5efe0;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;background:#f5efe0;">
    <div style="background:#0d1117;padding:22px 32px;text-align:center;border-bottom:2px solid #c9a84c;">
      <p style="font-size:13px;letter-spacing:0.24em;color:#c9a84c;margin:0;text-transform:uppercase;">Whosoever Believes</p>
    </div>
    <div style="padding:32px 32px 28px;color:#1a1a1a;font-size:16px;line-height:1.7;">
      <p style="margin:0 0 18px;">A new article is live on the site, and the mailing list has not been told yet.</p>
      <p style="font-size:20px;line-height:1.3;margin:0 0 6px;font-weight:bold;">${esc(a.title)}</p>
      ${a.excerpt ? `<p style="font-size:15px;color:#4a4035;margin:0 0 20px;">${esc(a.excerpt)}</p>` : ''}
      <p style="margin:0 0 22px;">Read it on the live site first, then open the send page. The article will already be selected there, with the subject line and excerpt filled in. Send yourself a test before sending to everyone.</p>
      <p style="margin:0 0 10px;">
        <a href="${esc(announce)}" style="display:inline-block;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#0d1117;background:#c9a84c;padding:11px 24px;border-radius:3px;text-decoration:none;">Open the send page &rarr;</a>
      </p>
      <p style="margin:0;font-size:14px;"><a href="${esc(live)}" style="color:#8a6a1f;">Read it live first</a></p>
    </div>
    <div style="border-top:1px solid #d4c9b0;padding:16px 32px;text-align:center;background:#ede8da;">
      <p style="font-size:12px;color:#6a6358;margin:0;">Sent by the new-article check on your own repository. No subscriber has been emailed.</p>
    </div>
  </div>
</body>
</html>`;

  const text = `A new article is live on the site, and the mailing list has not been told yet.

${a.title}
${a.excerpt ? a.excerpt + '\n' : ''}
Read it live first: ${live}
Open the send page: ${announce}

The article will already be selected there, with the subject line and excerpt filled in. Send yourself a test before sending to everyone.

No subscriber has been emailed.`;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], subject, html, text }),
  });

  if (!r.ok) {
    console.error(`Resend rejected the notice for ${a.url}: ${r.status} ${await r.text()}`);
    failed++;
    continue;
  }
  console.log(`Notified: ${a.title}`);
}

if (failed) process.exit(1);
