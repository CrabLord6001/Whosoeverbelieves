/* ==========================================================================
   WHOSOEVER — Shared Sign-In
   --------------------------------------------------------------------------
   One login for the whole site. Any page can use it by adding:

       <script src="/auth.js"></script>

   It loads Supabase on its own, adds its own sign-in window, and (if the
   page has a <nav>) adds a Sign In / Sign Out link to the end of the nav.

   Because every page on whosoeverbelieves.com talks to the same Supabase
   project, a reader who signs in here is also signed in on the Bible
   Reading Plans page, and the other way round.

   Other scripts on the page can use:

       WBAuth.ready()          → Promise<user | null>   (after first check)
       WBAuth.onChange(fn)     → fn(user | null) now and on every change
       WBAuth.open(tab)        → show the sign-in window ('signin', 'signup', 'account', …)
       WBAuth.signOut()
       WBAuth.client()         → Promise<SupabaseClient>
   ========================================================================== */

(function () {
  'use strict';
  if (window.WBAuth) return;

  // Same public credentials as bible-reading-plans.html. The publishable key
  // is safe to expose; row-level security decides what it can do.
  var SUPABASE_URL = 'https://tgzsyfmnzagqijjlzxsa.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_gck7v-L2PDbW2JKUoxTHDA_FidLWw8H';
  var SUPABASE_LIB = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';

  var client = null;
  var clientPromise = null;
  var currentUser = null;
  var listeners = [];
  var resolveReady;
  var readyPromise = new Promise(function (r) { resolveReady = r; });
  var modal = null;
  var navLink = null;

  // After Google / Discord / email links, come back to the page the reader
  // was on (without any #hash).
  function here() {
    return window.location.origin + window.location.pathname;
  }

  // ── SUPABASE ───────────────────────────────────────────────────────────

  function loadLibrary() {
    if (window.supabase && window.supabase.createClient) return Promise.resolve();
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-wb-supabase]');
      var s = existing || document.createElement('script');
      s.addEventListener('load', function () { resolve(); });
      s.addEventListener('error', function () { reject(new Error('Could not load sign-in.')); });
      if (!existing) {
        s.src = SUPABASE_LIB;
        s.setAttribute('data-wb-supabase', '');
        document.head.appendChild(s);
      }
    });
  }

  function getClient() {
    if (!clientPromise) {
      clientPromise = loadLibrary().then(function () {
        client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        return client;
      });
    }
    return clientPromise;
  }

  function setUser(user) {
    var changed = (currentUser && currentUser.id) !== (user && user.id);
    currentUser = user || null;
    updateNav();
    if (changed || !readyPromise._done) {
      listeners.forEach(function (fn) { try { fn(currentUser); } catch (e) { console.error(e); } });
    }
  }

  // plans and reflections reference profiles, so make sure one exists.
  function ensureProfile(user) {
    return client.from('profiles').select('id').eq('id', user.id).maybeSingle()
      .then(function (res) {
        if (res.data) return;
        return client.from('profiles').insert({
          id: user.id,
          email: user.email,
          display_name: (user.user_metadata && (user.user_metadata.display_name ||
                         user.user_metadata.full_name || user.user_metadata.name)) || null
        });
      })
      .catch(function () { /* never block sign-in on this */ });
  }

  function init() {
    getClient().then(function (c) {
      c.auth.onAuthStateChange(function (event, session) {
        if (event === 'PASSWORD_RECOVERY') {
          open('newpassword');
        }
        var user = session && session.user;
        if (user && (!currentUser || currentUser.id !== user.id)) {
          Promise.resolve(ensureProfile(user)).then(function () { applySignupChoice(user); });
          if (modal && modal.classList.contains('open') && event === 'SIGNED_IN') close();
        }
        setUser(user);
      });
      return c.auth.getSession();
    }).then(function (res) {
      setUser(res && res.data && res.data.session ? res.data.session.user : null);
    }).catch(function (err) {
      console.warn('[auth]', err);
      setUser(null);
    }).then(function () {
      readyPromise._done = true;
      resolveReady(currentUser);
    });
  }

  // ── STYLES ─────────────────────────────────────────────────────────────

  var CSS = [
    '.wba-overlay{display:none;position:fixed;inset:0;z-index:2000;background:rgba(10,18,30,.75);',
    '  backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);align-items:center;justify-content:center;padding:1rem}',
    '.wba-overlay.open{display:flex}',
    '.wba-modal{background:var(--surface,#131922);border:1px solid var(--rule,rgba(255,255,255,.08));border-radius:8px;',
    '  padding:2.25rem 1.75rem;max-width:430px;width:100%;text-align:center;position:relative;max-height:92vh;overflow-y:auto;',
    '  color:var(--text,#e8e6e0);font-family:"EB Garamond",Georgia,serif;line-height:1.5}',
    '.wba-modal h2{font-family:"Cinzel",serif;font-size:1.3rem;font-weight:400;color:var(--text);margin:0 0 .5rem}',
    '.wba-lede{font-family:"Cormorant Garamond",serif;font-size:1.05rem;font-style:italic;color:var(--text-mid);margin:0 0 1.4rem}',
    '.wba-close{position:absolute;top:.6rem;right:.9rem;background:none;border:none;color:var(--text-mid);font-size:1.3rem;cursor:pointer}',
    '.wba-close:hover{color:var(--gold)}',
    '.wba-tabs{display:flex;flex-wrap:wrap;margin-bottom:1.4rem;border-bottom:1px solid var(--rule)}',
    '.wba-tab{flex:1;padding:.55rem .25rem;font-family:"Cinzel",serif;font-size:.6rem;letter-spacing:.08em;text-transform:uppercase;',
    '  background:none;border:none;color:var(--text-faint);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px}',
    '.wba-tab.active{color:var(--gold);border-bottom-color:var(--gold)}',
    '.wba-form{display:none}.wba-form.active{display:block}',
    '.wba-help{font-family:"Cormorant Garamond",serif;font-style:italic;color:var(--text-mid);font-size:.95rem;margin:0 0 1rem}',
    '.wba-field{margin-bottom:1rem;text-align:left}',
    '.wba-field label{display:block;font-size:.85rem;margin-bottom:.3rem;color:var(--text-mid)}',
    '.wba-field input{width:100%;box-sizing:border-box;background:var(--bg);border:1px solid var(--rule);border-radius:4px;color:var(--text);',
    '  font-family:"EB Garamond",serif;font-size:1rem;padding:.5rem .75rem;outline:none}',
    '.wba-field input:focus{border-color:var(--gold)}',
    '.wba-error{color:#e57373;font-family:"Cormorant Garamond",serif;font-size:.95rem;font-style:italic;margin-bottom:.75rem;min-height:1.2em}',
    '.wba-ok{color:#4f9a5a;font-family:"Cormorant Garamond",serif;font-size:.95rem;font-style:italic;margin-bottom:.75rem;min-height:1.2em}',
    '.wba-actions{display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap}',
    '.wba-btn{font-family:"Cinzel",serif;font-size:.68rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);',
    '  border:2px solid rgba(201,168,76,.7);padding:.65rem 1.3rem;background:none;cursor:pointer;border-radius:2px}',
    '.wba-btn:hover{color:var(--gold-light);border-color:var(--gold)}',
    '.wba-btn.secondary{color:var(--text-faint);border-color:var(--rule)}',
    '.wba-btn:disabled{opacity:.5;cursor:default}',
    '.wba-social{display:flex;flex-direction:column;gap:.6rem;margin-bottom:1.1rem}',
    '.wba-social button{display:flex;align-items:center;justify-content:center;gap:.75rem;width:100%;padding:.6rem 1rem;',
    '  font-family:"Cinzel",serif;font-size:.63rem;letter-spacing:.12em;text-transform:uppercase;border-radius:3px;',
    '  border:1px solid var(--rule);background:var(--glass);color:var(--text);cursor:pointer}',
    '.wba-social button:hover{border-color:rgba(201,168,76,.4)}',
    '.wba-social svg{width:18px;height:18px;flex-shrink:0}',
    '.wba-divider{display:flex;align-items:center;gap:.75rem;margin:1.1rem 0;color:var(--text-faint);',
    '  font-family:"Cinzel",serif;font-size:.58rem;letter-spacing:.15em;text-transform:uppercase}',
    '.wba-divider::before,.wba-divider::after{content:"";flex:1;height:1px;background:var(--rule)}',
    '.wba-check{display:flex;gap:.6rem;align-items:flex-start;text-align:left;font-size:.95rem;color:var(--text-mid);margin:0 0 1.1rem;cursor:pointer}',
    '.wba-check input{margin-top:.3rem;accent-color:var(--gold,#c9a84c);width:1rem;height:1rem;flex-shrink:0}',
    '.wba-modal.acct .wba-tabs,.wba-modal.acct .wba-lede{display:none}',
    '.wba-acct-email{font-family:"Cormorant Garamond",serif;font-size:1.1rem;color:var(--text);margin:0 0 1.2rem;word-break:break-all}',
    'nav a.wba-nav-link{cursor:pointer}'
  ].join('\n');

  function injectStyles() {
    if (document.getElementById('wba-styles')) return;
    var st = document.createElement('style');
    st.id = 'wba-styles';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  // ── MODAL ──────────────────────────────────────────────────────────────

  var GOOGLE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>';
  var DISCORD_SVG = '<svg viewBox="0 0 24 24" fill="#5865F2" aria-hidden="true"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.057a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>';

  var MODAL_HTML =
    '<div class="wba-modal" role="dialog" aria-modal="true" aria-labelledby="wba-title">' +
    '<button type="button" class="wba-close" data-wba="close" aria-label="Close">✕</button>' +
    '<h2 id="wba-title">Welcome</h2>' +
    '<p class="wba-lede">One account for reading plans, the discipleship challenge, and comments.</p>' +
    '<div class="wba-tabs">' +
      '<button type="button" class="wba-tab active" data-tab="signin">Sign In</button>' +
      '<button type="button" class="wba-tab" data-tab="signup">Create Account</button>' +
      '<button type="button" class="wba-tab" data-tab="magic">Magic Link</button>' +
      '<button type="button" class="wba-tab" data-tab="reset">Forgot Password</button>' +
    '</div>' +

    '<div class="wba-form active" data-form="signin">' +
      '<div class="wba-error"></div>' +
      '<div class="wba-social">' +
        '<button type="button" data-wba="google">' + GOOGLE_SVG + 'Continue with Google</button>' +
        '<button type="button" data-wba="discord">' + DISCORD_SVG + 'Continue with Discord</button>' +
      '</div>' +
      '<div class="wba-divider">or sign in with email</div>' +
      '<div class="wba-field"><label for="wba-signin-email">Email</label><input type="email" id="wba-signin-email" autocomplete="email" placeholder="you@example.com"></div>' +
      '<div class="wba-field"><label for="wba-signin-pass">Password</label><input type="password" id="wba-signin-pass" autocomplete="current-password" placeholder="••••••••"></div>' +
      '<div class="wba-actions"><button type="button" class="wba-btn" data-wba="signin">Sign In</button><button type="button" class="wba-btn secondary" data-wba="close">Cancel</button></div>' +
    '</div>' +

    '<div class="wba-form" data-form="signup">' +
      '<div class="wba-error"></div><div class="wba-ok"></div>' +
      '<div class="wba-field"><label for="wba-signup-name">Display Name (optional)</label><input type="text" id="wba-signup-name" autocomplete="name" placeholder="Your name"></div>' +
      '<div class="wba-field"><label for="wba-signup-email">Email</label><input type="email" id="wba-signup-email" autocomplete="email" placeholder="you@example.com"></div>' +
      '<div class="wba-field"><label for="wba-signup-pass">Password (min 6 chars)</label><input type="password" id="wba-signup-pass" autocomplete="new-password" placeholder="••••••••"></div>' +
      '<label class="wba-check"><input type="checkbox" id="wba-signup-updates"> Email me when a new article is published</label>' +
      '<div class="wba-actions"><button type="button" class="wba-btn" data-wba="signup">Create Account</button><button type="button" class="wba-btn secondary" data-wba="close">Cancel</button></div>' +
    '</div>' +

    '<div class="wba-form" data-form="magic">' +
      '<div class="wba-error"></div><div class="wba-ok"></div>' +
      '<p class="wba-help">Enter your email and we’ll send a one-click sign-in link — no password needed.</p>' +
      '<div class="wba-field"><label for="wba-magic-email">Email</label><input type="email" id="wba-magic-email" autocomplete="email" placeholder="you@example.com"></div>' +
      '<div class="wba-actions"><button type="button" class="wba-btn" data-wba="magic">Send Link</button><button type="button" class="wba-btn secondary" data-wba="close">Cancel</button></div>' +
    '</div>' +

    '<div class="wba-form" data-form="reset">' +
      '<div class="wba-error"></div><div class="wba-ok"></div>' +
      '<p class="wba-help">Enter your email and we’ll send a password reset link.</p>' +
      '<div class="wba-field"><label for="wba-reset-email">Email</label><input type="email" id="wba-reset-email" autocomplete="email" placeholder="you@example.com"></div>' +
      '<div class="wba-actions"><button type="button" class="wba-btn" data-wba="reset">Send Reset Link</button><button type="button" class="wba-btn secondary" data-wba="close">Cancel</button></div>' +
    '</div>' +

    '<div class="wba-form" data-form="newpassword">' +
      '<div class="wba-error"></div><div class="wba-ok"></div>' +
      '<p class="wba-help">Enter your new password below.</p>' +
      '<div class="wba-field"><label for="wba-new-pass">New Password (min 6 chars)</label><input type="password" id="wba-new-pass" autocomplete="new-password" placeholder="New password"></div>' +
      '<div class="wba-actions"><button type="button" class="wba-btn" data-wba="newpassword">Update Password</button></div>' +
    '</div>' +

    '<div class="wba-form" data-form="account">' +
      '<div class="wba-error"></div><div class="wba-ok"></div>' +
      '<p class="wba-acct-email" id="wba-acct-email"></p>' +
      '<label class="wba-check"><input type="checkbox" id="wba-account-updates" disabled> Email me when a new article is published</label>' +
      '<div class="wba-actions"><button type="button" class="wba-btn" data-wba="signout">Sign Out</button><button type="button" class="wba-btn secondary" data-wba="close">Close</button></div>' +
    '</div>' +
    '</div>';

  function $(sel) { return modal.querySelector(sel); }
  function val(id) { var i = document.getElementById(id); return i ? i.value.trim() : ''; }

  function clearMessages() {
    modal.querySelectorAll('.wba-error,.wba-ok').forEach(function (n) { n.textContent = ''; });
  }
  function msg(form, text, ok) {
    var n = $('[data-form="' + form + '"] ' + (ok ? '.wba-ok' : '.wba-error'));
    if (n) n.textContent = text;
  }

  function switchTab(tab) {
    modal.querySelectorAll('.wba-tab').forEach(function (t) {
      t.classList.toggle('active', t.getAttribute('data-tab') === tab);
    });
    modal.querySelectorAll('.wba-form').forEach(function (f) {
      f.classList.toggle('active', f.getAttribute('data-form') === tab);
    });
    clearMessages();
  }

  function buildModal() {
    if (modal) return modal;
    injectStyles();
    modal = document.createElement('div');
    modal.className = 'wba-overlay';
    modal.innerHTML = MODAL_HTML;   // static markup only — no user data
    document.body.appendChild(modal);

    modal.addEventListener('click', function (e) {
      if (e.target === modal) { close(); return; }
      var tab = e.target.closest('[data-tab]');
      if (tab) { switchTab(tab.getAttribute('data-tab')); return; }
      var btn = e.target.closest('[data-wba]');
      if (!btn) return;
      var action = btn.getAttribute('data-wba');
      if (action === 'close') close();
      else handle(action, btn);
    });
    modal.addEventListener('change', function (e) {
      if (e.target && e.target.id === 'wba-account-updates') setEmailUpdates(e.target);
    });
    modal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
      if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        var form = e.target.closest('.wba-form');
        var primary = form && form.querySelector('.wba-btn:not(.secondary)');
        if (primary) primary.click();
      }
    });
    return modal;
  }

  function handle(action, btn) {
    clearMessages();
    getClient().then(function (c) {
      var p;
      switch (action) {
        case 'google':
        case 'discord':
          p = c.auth.signInWithOAuth({ provider: action, options: { redirectTo: here() } })
            .then(function (r) { if (r.error) msg('signin', r.error.message); });
          break;
        case 'signin':
          if (!val('wba-signin-email') || !document.getElementById('wba-signin-pass').value) {
            msg('signin', 'Please enter your email and password.'); return;
          }
          p = c.auth.signInWithPassword({
            email: val('wba-signin-email'),
            password: document.getElementById('wba-signin-pass').value
          }).then(function (r) { if (r.error) msg('signin', r.error.message); });
          break;
        case 'signup':
          var pass = document.getElementById('wba-signup-pass').value;
          if (!val('wba-signup-email') || !pass) { msg('signup', 'Email and password are required.'); return; }
          if (pass.length < 6) { msg('signup', 'Password must be at least 6 characters.'); return; }
          p = c.auth.signUp({
            email: val('wba-signup-email'),
            password: pass,
            options: { data: { display_name: val('wba-signup-name'), email_updates: !!(document.getElementById('wba-signup-updates') || {}).checked }, emailRedirectTo: here() }
          }).then(function (r) {
            if (r.error) msg('signup', r.error.message);
            else msg('signup', 'Account created! Check your email to confirm, then sign in.', true);
          });
          break;
        case 'magic':
          if (!val('wba-magic-email')) { msg('magic', 'Please enter your email address.'); return; }
          p = c.auth.signInWithOtp({ email: val('wba-magic-email'), options: { emailRedirectTo: here() } })
            .then(function (r) {
              if (r.error) msg('magic', r.error.message);
              else msg('magic', 'Magic link sent! Check your inbox.', true);
            });
          break;
        case 'reset':
          if (!val('wba-reset-email')) { msg('reset', 'Please enter your email address.'); return; }
          p = c.auth.resetPasswordForEmail(val('wba-reset-email'), { redirectTo: here() })
            .then(function (r) {
              if (r.error) msg('reset', r.error.message);
              else msg('reset', 'Reset link sent — check your inbox.', true);
            });
          break;
        case 'signout':
          p = c.auth.signOut().then(function () { close(); });
          break;
        case 'newpassword':
          var np = document.getElementById('wba-new-pass').value;
          if (np.length < 6) { msg('newpassword', 'Password must be at least 6 characters.'); return; }
          p = c.auth.updateUser({ password: np }).then(function (r) {
            if (r.error) msg('newpassword', r.error.message);
            else {
              msg('newpassword', 'Password updated! You are now signed in.', true);
              setTimeout(close, 1800);
            }
          });
          break;
      }
      if (p && btn) {
        btn.disabled = true;
        p.then(function () { btn.disabled = false; }, function () { btn.disabled = false; });
      }
    }).catch(function (err) {
      msg('signin', err.message || 'Sign-in is unavailable right now.');
    });
  }

  // ── EMAIL UPDATES (new-article emails) ────────────────────────────────

  function emailPrefs(method, body) {
    return getClient().then(function (c) {
      return c.functions.invoke('email-prefs', { method: method, body: body });
    }).then(function (r) {
      if (r.error) throw r.error;
      return r.data || {};
    });
  }

  function loadAccount() {
    var box = document.getElementById('wba-account-updates');
    var who = document.getElementById('wba-acct-email');
    if (who) who.textContent = currentUser ? 'Signed in as ' + (currentUser.email || '') : '';
    if (!box) return;
    box.disabled = true;
    emailPrefs('GET').then(function (d) {
      box.checked = !!d.email_updates;
      box.disabled = false;
    }).catch(function () {
      msg('account', 'Email settings are unavailable right now.');
    });
  }

  function setEmailUpdates(box) {
    var want = box.checked;
    box.disabled = true;
    clearMessages();
    emailPrefs('POST', { subscribe: want }).then(function (d) {
      box.checked = !!d.email_updates;
      msg('account', d.email_updates ? 'You’ll get an email when a new article is published.' : 'Email updates turned off.', true);
    }).catch(function () {
      box.checked = !want;
      msg('account', 'Could not save that change. Please try again.');
    }).then(function () { box.disabled = false; });
  }

  // A reader who ticked the box at sign-up is subscribed on first sign-in.
  function applySignupChoice(user) {
    var m = (user && user.user_metadata) || {};
    if (m.email_updates !== true || m.email_updates_synced) return;
    emailPrefs('POST', { subscribe: true }).then(function () {
      return getClient().then(function (c) { return c.auth.updateUser({ data: { email_updates_synced: true } }); });
    }).catch(function (e) { console.warn('[auth] email updates', e); });
  }

  function open(tab) {
    buildModal();
    var acct = tab === 'account';
    modal.querySelector('.wba-modal').classList.toggle('acct', acct);
    modal.querySelector('#wba-title').textContent = acct ? 'Your Account' : 'Welcome';
    switchTab(tab || 'signin');
    if (acct) loadAccount();
    modal.classList.add('open');
    getClient();   // start loading Supabase while the reader types
    var first = modal.querySelector('.wba-form.active input');
    if (first) setTimeout(function () { first.focus(); }, 30);
  }

  function close() {
    if (modal) { modal.classList.remove('open'); clearMessages(); }
  }

  function signOut() {
    return getClient().then(function (c) { return c.auth.signOut(); });
  }

  // ── NAV LINK ───────────────────────────────────────────────────────────

  function addNavLink() {
    var nav = document.querySelector('nav');
    if (!nav || nav.querySelector('#nav-signin-btn') || nav.querySelector('.wba-nav-link')) return;
    navLink = document.createElement('a');
    navLink.href = '#';
    navLink.className = 'wba-nav-link';
    navLink.textContent = 'Sign In';
    navLink.addEventListener('click', function (e) {
      e.preventDefault();
      if (currentUser) {
        open('account');
      } else {
        open('signin');
      }
    });
    nav.appendChild(navLink);
    updateNav();
  }

  function updateNav() {
    if (!navLink) return;
    navLink.textContent = currentUser ? 'Account' : 'Sign In';
    navLink.title = currentUser ? 'Signed in as ' + (currentUser.email || '') : 'Sign in or create an account';
  }

  // ── PUBLIC API ─────────────────────────────────────────────────────────

  window.WBAuth = {
    ready: function () { return readyPromise; },
    onChange: function (fn) {
      listeners.push(fn);
      if (readyPromise._done) { try { fn(currentUser); } catch (e) { console.error(e); } }
    },
    get user() { return currentUser; },
    open: open,
    close: close,
    signOut: signOut,
    client: getClient,
    displayName: function (user) {
      user = user || currentUser;
      if (!user) return '';
      var m = user.user_metadata || {};
      return m.display_name || m.full_name || m.name || m.user_name || '';
    }
  };

  function boot() {
    injectStyles();
    addNavLink();
    init();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
