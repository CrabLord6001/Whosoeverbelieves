/* ==========================================================================
   WHOSOEVER — Greek tool progress (vocabulary + verb parsing)
   --------------------------------------------------------------------------
   Keeps track of which words / forms a reader knows, plus quiz right/wrong
   counts and when each item was last reviewed.

   Signed in  → saved to Supabase (table greek_progress, owner-only RLS),
                so it follows the reader to any device.
   Signed out → kept in this browser only, and moved into the account the
                next time the reader signs in.

   Usage:
       var P = GreekProgress('vocab');        // or 'parsing'
       P.onChange(function () { … redraw … });
       P.isKnown(key)  P.setStatus(key, 'known' | 'learning')
       P.record(key, true | false)            // quiz / speed-round answer
       P.lastReviewed(key)  P.knownCount()  P.signedIn()
   ========================================================================== */
(function () {
  'use strict';

  function GreekProgress(tool) {
    var LOCAL_KEY = 'wb-greek-progress-' + tool;
    var map = {};            // key → { status, correct, wrong, last_reviewed }
    var user = null;
    var db = null;
    var listeners = [];
    var pending = {};        // key → true (rows waiting to be saved)
    var timer = null;

    function emit() { listeners.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } }); }

    // ── Browser storage (signed-out readers) ──
    function readLocal() {
      try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}') || {}; } catch (e) { return {}; }
    }
    function writeLocal() {
      try { localStorage.setItem(LOCAL_KEY, JSON.stringify(map)); } catch (e) {}
    }
    function clearLocal() {
      try { localStorage.removeItem(LOCAL_KEY); } catch (e) {}
    }

    function row(key) {
      if (!map[key]) map[key] = { status: 'learning', correct: 0, wrong: 0, last_reviewed: null };
      return map[key];
    }

    // ── Saving ──
    function save(key) {
      if (!user) { writeLocal(); return; }
      pending[key] = true;
      clearTimeout(timer);
      timer = setTimeout(flush, 700);
    }

    function flush() {
      if (!user || !db) return Promise.resolve();
      var keys = Object.keys(pending);
      if (!keys.length) return Promise.resolve();
      pending = {};
      var now = new Date().toISOString();
      var rows = keys.map(function (k) {
        var r = map[k];
        return { user_id: user.id, tool: tool, item_key: k, status: r.status, correct: r.correct, wrong: r.wrong,
                 last_reviewed: r.last_reviewed, updated_at: now };
      });
      return db.from('greek_progress').upsert(rows, { onConflict: 'user_id,tool,item_key' }).then(function (res) {
        if (res.error) { keys.forEach(function (k) { pending[k] = true; }); console.warn('greek_progress save failed', res.error); }
      });
    }

    window.addEventListener('pagehide', function () { flush(); });
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') flush(); });

    // ── Loading from the account ──
    function loadAccount() {
      return db.from('greek_progress').select('item_key,status,correct,wrong,last_reviewed')
        .eq('tool', tool).range(0, 4999)
        .then(function (res) {
          if (res.error) throw res.error;
          var server = {};
          (res.data || []).forEach(function (r) {
            server[r.item_key] = { status: r.status, correct: r.correct, wrong: r.wrong, last_reviewed: r.last_reviewed };
          });
          // Move anything studied while signed out into the account.
          var local = readLocal();
          Object.keys(local).forEach(function (k) {
            if (!server[k]) { server[k] = local[k]; pending[k] = true; }
          });
          clearLocal();
          map = server;
          emit();
          return flush();
        });
    }

    function attach() {
      if (!window.WBAuth) { map = readLocal(); emit(); return; }
      window.WBAuth.onChange(function (u) {
        var was = user && user.id;
        user = u;
        if (u) {
          if (was === u.id) return;
          window.WBAuth.client().then(function (c) { db = c; return loadAccount(); })
            .catch(function (e) { console.warn('greek_progress load failed', e); });
        } else {
          // Signed out: drop the account's progress from the page right away.
          clearTimeout(timer); pending = {};
          map = was ? {} : readLocal();
          emit();
        }
      });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attach);
    else setTimeout(attach, 0);
    map = readLocal();

    return {
      onChange: function (fn) { listeners.push(fn); },
      signedIn: function () { return !!user; },
      isKnown: function (key) { return !!(map[key] && map[key].status === 'known'); },
      lastReviewed: function (key) { return (map[key] && map[key].last_reviewed) || null; },
      setStatus: function (key, status) {
        var r = row(key);
        r.status = status === 'known' ? 'known' : 'learning';
        r.last_reviewed = new Date().toISOString();
        save(key);
      },
      record: function (key, ok) {
        var r = row(key);
        if (ok) r.correct++; else r.wrong++;
        r.last_reviewed = new Date().toISOString();
        save(key);
      },
      knownCount: function (keys) {
        var n = 0;
        if (keys) keys.forEach(function (k) { if (map[k] && map[k].status === 'known') n++; });
        else Object.keys(map).forEach(function (k) { if (map[k].status === 'known') n++; });
        return n;
      },
      flush: flush
    };
  }

  window.GreekProgress = GreekProgress;
})();
