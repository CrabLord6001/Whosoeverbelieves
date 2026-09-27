/* ==========================================================================
   WHOSOEVER — Comments
   --------------------------------------------------------------------------
   Adds a reader comment section to an article page.

   To use it, add ONE line near the bottom of an article page, just before
   the closing </body> tag:

       <script src="../comments.js"></script>

   The section is inserted automatically just above the page footer. If you
   would rather place it somewhere specific, put an empty element with
   id="comments" where you want it and the section renders there instead.

   Nothing a reader submits appears on the site until it is approved in
   moderate-comments.html.
   ========================================================================== */

(function () {
  'use strict';

  // ── CONFIGURATION ──────────────────────────────────────────────────────
  // These are the same public credentials already used by the Bible reading
  // plans page. The publishable key is safe to expose: what it can and
  // cannot do is enforced by row-level security in the database.
  var SUPABASE_URL = 'https://tgzsyfmnzagqijjlzxsa.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_gck7v-L2PDbW2JKUoxTHDA_FidLWw8H';

  var REST = SUPABASE_URL + '/rest/v1/comments';
  var PUBLIC_FIELDS = 'id,parent_id,author_name,body,is_author_reply,created_at';

  // Bots fill forms instantly; people do not.
  var MIN_SECONDS_ON_FORM = 3;

  var formOpenedAt = Date.now();

  // ── OPTIONAL SIGN-IN ───────────────────────────────────────────────────
  // Readers can still comment without an account. If they are signed in
  // (same login as the Bible Reading Plans and Discipleship Challenge), their
  // name and email are filled in and the comment is linked to their account.
  var SESSION_KEY = 'sb-tgzsyfmnzagqijjlzxsa-auth-token';
  var signedInUser = null;
  var formHooks = [];          // each open form's "user changed" handler
  var authLoading = null;

  // Captured while the script is executing — document.currentScript is null
  // by the time DOMContentLoaded fires.
  var SELF_SRC = (document.currentScript && document.currentScript.src) || '';


  // ── HELPERS ────────────────────────────────────────────────────────────

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;   // always textContent, never HTML
    return node;
  }

  function pageSlug() {
    var path = window.location.pathname.toLowerCase();
    path = path.replace(/\/index\.html?$/, '/');
    if (path.length > 1) path = path.replace(/\/+$/, '');
    return path || '/';
  }

  function pageTitle() {
    var h = document.querySelector('.article-title');
    if (h && h.textContent.trim()) return h.textContent.trim().slice(0, 200);
    return (document.title || '').trim().slice(0, 200);
  }

  function initials(name) {
    var parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  function formatDate(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return '';
    var date = d.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    var time = d.toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit'
    }).toLowerCase();
    return date + ' at ' + time;
  }

  // Renders plain text with paragraph breaks preserved. URLs are deliberately
  // NOT turned into links — link spam is most of what an open comment box
  // attracts, and removing the payoff removes most of the incentive.
  function renderBody(text) {
    var wrap = el('div', 'wb-comment-body');
    String(text).split(/\n{2,}/).forEach(function (para) {
      var p = el('p');
      para.split('\n').forEach(function (line, i) {
        if (i) p.appendChild(document.createElement('br'));
        p.appendChild(document.createTextNode(line));
      });
      wrap.appendChild(p);
    });
    return wrap;
  }

  function api(path, options, token) {
    options = options || {};
    options.headers = Object.assign({
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + (token || SUPABASE_KEY),
      'Content-Type': 'application/json'
    }, options.headers || {});
    return fetch(path, options);
  }

  // Load the stylesheet that sits beside this script, unless it is already on
  // the page (so you can also paste the CSS straight into styles.css).
  function ensureStylesheet() {
    if (document.querySelector('link[data-wb-comments]')) return;
    if (document.querySelector('.wb-comments')) return;

    var src = SELF_SRC;
    if (!src) {
      var scripts = document.getElementsByTagName('script');
      for (var i = 0; i < scripts.length; i++) {
        if (/comments\.js(\?|$)/.test(scripts[i].src)) { src = scripts[i].src; break; }
      }
    }
    if (!src) return;

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = src.replace(/comments\.js(\?.*)?$/, 'comments.css');
    link.setAttribute('data-wb-comments', '');
    document.head.appendChild(link);
  }


  function hasStoredSession() {
    try { return !!window.localStorage.getItem(SESSION_KEY); } catch (e) { return false; }
  }

  // Loads auth.js (which sits beside this script) only when it is needed:
  // for readers who are already signed in, or who click "Sign in".
  function loadAuth() {
    if (window.WBAuth) return Promise.resolve(window.WBAuth);
    if (authLoading) return authLoading;
    authLoading = new Promise(function (resolve, reject) {
      var src = (SELF_SRC || '').replace(/comments\.js(\?.*)?$/, 'auth.js') || '/auth.js';
      var s = document.createElement('script');
      s.src = src;
      s.onload = function () { resolve(window.WBAuth); };
      s.onerror = function () { authLoading = null; reject(new Error('auth unavailable')); };
      document.head.appendChild(s);
    }).then(function (auth) {
      auth.onChange(function (user) {
        signedInUser = user || null;
        formHooks.forEach(function (fn) { fn(signedInUser); });
      });
      return auth;
    });
    return authLoading;
  }

  // A fresh access token for the signed-in reader, or null (anonymous).
  function currentToken() {
    if (!signedInUser || !window.WBAuth) return Promise.resolve(null);
    return window.WBAuth.client()
      .then(function (c) { return c.auth.getSession(); })
      .then(function (res) {
        var s = res && res.data && res.data.session;
        return s ? s.access_token : null;
      })
      .catch(function () { return null; });
  }


  // ── FORM ───────────────────────────────────────────────────────────────

  function buildForm(parentId, onDone, onCancel) {
    var form = el('form', 'wb-comment-form' + (parentId ? ' is-reply' : ''));
    form.setAttribute('novalidate', '');

    form.appendChild(el('div', 'wb-form-title',
      parentId ? 'Leave a Reply' : 'Leave a Comment'));

    form.appendChild(el('div', 'wb-form-note',
      'Your email address is never published — it is only so we can reach you '
      + 'if needed. Comments are read before they appear.'));

    var account = el('div', 'wb-form-account');
    form.appendChild(account);

    var row = el('div', 'wb-form-row');

    var nameField = el('div', 'wb-form-field');
    var nameLabel = el('label', 'wb-form-label', 'Name');
    var nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.maxLength = 60;
    nameInput.placeholder = 'Your name';
    nameInput.autocomplete = 'name';
    nameLabel.appendChild(nameInput);
    nameField.appendChild(nameLabel);

    var emailField = el('div', 'wb-form-field');
    var emailLabel = el('label', 'wb-form-label', 'Email (not published)');
    var emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.maxLength = 255;
    emailInput.placeholder = 'you@example.com';
    emailInput.autocomplete = 'email';
    emailLabel.appendChild(emailInput);
    emailField.appendChild(emailLabel);

    row.appendChild(nameField);
    row.appendChild(emailField);
    form.appendChild(row);

    var bodyLabel = el('label', 'wb-form-label', 'Comment');
    var bodyInput = document.createElement('textarea');
    bodyInput.maxLength = 5000;
    bodyInput.placeholder = 'Share your thoughts…';
    bodyLabel.appendChild(bodyInput);
    form.appendChild(bodyLabel);

    // Honeypot
    var hp = document.createElement('input');
    hp.type = 'text';
    hp.className = 'wb-form-hp';
    hp.tabIndex = -1;
    hp.setAttribute('aria-hidden', 'true');
    hp.autocomplete = 'off';
    hp.name = 'website';
    var hpWrap = el('div', 'wb-form-hp');
    hpWrap.appendChild(el('label', null, 'Leave this field empty'));
    hpWrap.appendChild(hp);
    form.appendChild(hpWrap);

    var actions = el('div', 'wb-form-actions');
    var submit = el('button', 'wb-form-submit', parentId ? 'Post Reply' : 'Post Comment');
    submit.type = 'submit';
    actions.appendChild(submit);

    if (onCancel) {
      var cancel = el('button', 'wb-form-cancel', 'Cancel');
      cancel.type = 'button';
      cancel.addEventListener('click', onCancel);
      actions.appendChild(cancel);
    }
    form.appendChild(actions);

    var message = el('div', 'wb-form-message');
    form.appendChild(message);

    // Signed in → fill in name, use the account email, hide the email box.
    // Signed out → offer an optional sign-in link.
    function applyUser(user) {
      account.textContent = '';
      if (user) {
        var who = (window.WBAuth && window.WBAuth.displayName(user)) || user.email || '';
        account.appendChild(document.createTextNode('Signed in as ' + who + '. '));
        if (!nameInput.value.trim() && who && who !== user.email) nameInput.value = who.slice(0, 60);
        emailInput.value = user.email || '';
        emailField.style.display = 'none';
      } else {
        var link = el('a', 'wb-form-signin', 'Sign in');
        link.href = '#';
        link.addEventListener('click', function (e) {
          e.preventDefault();
          loadAuth().then(function (auth) { auth.open('signin'); })
            .catch(function () { fail('Sign-in is unavailable right now. You can still comment without an account.'); });
        });
        account.appendChild(document.createTextNode('Have an account? '));
        account.appendChild(link);
        account.appendChild(document.createTextNode(' to fill this in automatically (optional).'));
        if (emailField.style.display === 'none') { emailInput.value = ''; emailField.style.display = ''; }
      }
    }
    applyUser(signedInUser);
    formHooks.push(applyUser);

    function fail(text) {
      message.className = 'wb-form-message is-error';
      message.textContent = text;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      message.textContent = '';
      message.className = 'wb-form-message';

      var name = nameInput.value.trim();
      var email = emailInput.value.trim();
      var body = bodyInput.value.trim();

      if (name.length < 2) { fail('Please enter your name.'); nameInput.focus(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        fail('Please enter a valid email address. It will not be published.');
        emailInput.focus();
        return;
      }
      if (body.length < 2) { fail('Please write a comment before posting.'); bodyInput.focus(); return; }

      // Silent spam rejections — look successful, save nothing.
      var tooFast = (Date.now() - formOpenedAt) < MIN_SECONDS_ON_FORM * 1000;
      if (hp.value.trim() !== '' || tooFast) { onDone(form); return; }

      submit.disabled = true;
      submit.textContent = 'Sending…';

      currentToken()
        .then(function (token) {
          return api(REST, {
            method: 'POST',
            headers: { 'Prefer': 'return=minimal' },
            body: JSON.stringify({
              page_slug: pageSlug(),
              page_title: pageTitle(),
              parent_id: parentId || null,
              author_name: name,
              author_email: email,
              body: body
            })
          }, token);
        })
        .then(function (res) {
          if (res.ok) { onDone(form); return; }
          return res.json().catch(function () { return {}; }).then(function (err) {
            throw new Error(err.message || 'Your comment could not be sent. Please try again.');
          });
        })
        .catch(function (err) {
          submit.disabled = false;
          submit.textContent = parentId ? 'Post Reply' : 'Post Comment';
          fail(err.message || 'Your comment could not be sent. Please try again.');
        });
    });

    return form;
  }

  function thanksPanel() {
    var panel = el('div', 'wb-form-thanks');
    panel.appendChild(el('strong', null, 'Thank you'));
    panel.appendChild(document.createTextNode(
      'Your comment has been received and will appear here once it has been '
      + 'reviewed. Thank you for taking the time to write.'
    ));
    return panel;
  }


  // ── COMMENT RENDERING ──────────────────────────────────────────────────

  function buildComment(comment, allowReply, onReply) {
    var wrap = el('article', 'wb-comment' + (comment.is_author_reply ? ' is-author' : ''));

    var avatar = el('div', 'wb-comment-avatar', initials(comment.author_name));
    avatar.setAttribute('aria-hidden', 'true');
    wrap.appendChild(avatar);

    var main = el('div', 'wb-comment-main');

    var head = el('div', 'wb-comment-head');
    head.appendChild(el('span', 'wb-comment-author', comment.author_name));
    if (comment.is_author_reply) head.appendChild(el('span', 'wb-comment-badge', 'Author'));
    head.appendChild(el('span', 'wb-comment-date', formatDate(comment.created_at)));
    main.appendChild(head);

    main.appendChild(renderBody(comment.body));

    if (allowReply) {
      var btn = el('button', 'wb-comment-reply-btn', 'Reply');
      btn.type = 'button';
      btn.addEventListener('click', function () { onReply(comment, main, btn); });
      main.appendChild(btn);
    }

    wrap.appendChild(main);
    return wrap;
  }

  function render(container, comments) {
    container.textContent = '';

    var byParent = {};
    var roots = [];
    comments.forEach(function (c) {
      if (c.parent_id) {
        (byParent[c.parent_id] = byParent[c.parent_id] || []).push(c);
      } else {
        roots.push(c);
      }
    });

    if (!roots.length) {
      container.appendChild(el('div', 'wb-comments-empty',
        'No responses yet. Be the first to share your thoughts.'));
      return;
    }

    function openReplyForm(comment, main, btn) {
      if (main.querySelector('.wb-comment-form')) return;
      btn.style.display = 'none';
      formOpenedAt = Date.now();

      var form = buildForm(
        comment.id,
        function (f) { f.replaceWith(thanksPanel()); },
        function () { form.remove(); btn.style.display = ''; }
      );
      main.appendChild(form);
      form.querySelector('input').focus();
    }

    roots.forEach(function (root) {
      var block = el('div', 'wb-comment-block');
      block.appendChild(buildComment(root, true, openReplyForm));

      var children = byParent[root.id];
      if (children && children.length) {
        var replies = el('div', 'wb-comment-replies');
        children.forEach(function (child) {
          replies.appendChild(buildComment(child, true, openReplyForm));
        });
        block.appendChild(replies);
      }
      container.appendChild(block);
    });
  }


  // ── BOOT ───────────────────────────────────────────────────────────────

  function mountPoint() {
    var existing = document.getElementById('comments');
    if (existing) return existing;

    var section = el('section', null);
    section.id = 'comments';

    var footer = document.querySelector('.site-wrapper > footer') ||
                 document.querySelector('footer');
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(section, footer);
    } else {
      document.body.appendChild(section);
    }
    return section;
  }

  function init() {
    ensureStylesheet();
    if (hasStoredSession()) loadAuth().catch(function () {});

    var host = mountPoint();
    host.className = 'wb-comments';

    var inner = el('div', 'wb-comments-inner');
    inner.appendChild(el('p', 'wb-comments-label', 'Join the Conversation'));
    var heading = el('h2', 'wb-comments-heading', 'Responses');
    inner.appendChild(heading);
    inner.appendChild(el('div', 'wb-comments-rule'));

    var status = el('div', 'wb-comments-status', 'Loading responses…');
    inner.appendChild(status);

    var list = el('div', 'wb-comment-list');
    inner.appendChild(list);

    var formWrap = el('div', 'wb-comment-form-wrap');
    formOpenedAt = Date.now();
    formWrap.appendChild(buildForm(null, function (f) {
      f.replaceWith(thanksPanel());
    }, null));
    inner.appendChild(formWrap);

    host.appendChild(inner);

    var url = REST
      + '?select=' + encodeURIComponent(PUBLIC_FIELDS)
      + '&page_slug=eq.' + encodeURIComponent(pageSlug())
      + '&status=eq.approved'
      + '&order=created_at.asc';

    api(url)
      .then(function (res) {
        if (!res.ok) throw new Error('load failed');
        return res.json();
      })
      .then(function (data) {
        status.remove();
        var count = data.length;
        heading.textContent = count
          ? count + (count === 1 ? ' Response' : ' Responses')
          : 'Responses';
        render(list, data);
      })
      .catch(function () {
        // A backend outage must never break the article itself.
        status.textContent = 'Responses could not be loaded right now, but you can still leave a comment below.';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
