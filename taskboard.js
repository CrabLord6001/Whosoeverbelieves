/* ==========================================================================
   WHOSOEVER — Taskboard
   --------------------------------------------------------------------------
   Private, admin-only board. Replaces the ClickUp "WB Believes" list.

   Security note: the gate below only decides what is DRAWN. What actually
   protects the data is the row-level security policy on public.tasks
   ("Own tasks, admins only": auth.uid() = user_id and is_admin()). A reader
   who finds this URL gets an empty board because Postgres returns nothing,
   not because this file hid it.

   Depends on /auth.js (WBAuth) for the Supabase client and session.
   ========================================================================== */

(function () {
  'use strict';

  var STATUSES = [
    { key: 'draft',       name: 'Draft / Brainstorm', color: '#a18072' },
    { key: 'todo',        name: 'To Do',              color: '#ff0008' },
    { key: 'paused',      name: 'Paused',             color: '#0091ff' },
    { key: 'in_progress', name: 'In Progress',        color: '#5f55ee' },
    { key: 'reviewing',   name: 'Reviewing',          color: '#f76808' },
    { key: 'complete',    name: 'Complete',           color: '#008844' }
  ];
  var byKey = {};
  STATUSES.forEach(function (s) { byKey[s.key] = s; });

  var client = null;
  var tasks = [];
  var showArchived = false;
  var filter = '';
  var editing = null;        // task object, or {} for a new one
  var dragId = null;

  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;   // textContent, never innerHTML
    return n;
  }

  // ── GATE ────────────────────────────────────────────────────────────────

  function gate(msg, isError) {
    var g = $('tb-gate');
    g.hidden = false;
    g.className = 'tb-msg' + (isError ? ' tb-err' : '');
    g.textContent = '';
    g.appendChild(document.createTextNode(msg));
    $('tb-app').hidden = true;
  }

  function start() {
    if (!window.WBAuth) { gate('Sign-in did not load. Reload the page.', true); return; }

    WBAuth.ready().then(function (user) {
      if (!user) {
        gate('');
        var g = $('tb-gate');
        g.appendChild(document.createTextNode('You need to be signed in to view this page.'));
        g.appendChild(document.createElement('br'));
        var b = el('button', 'tb-btn', 'Sign In');
        b.type = 'button';
        b.addEventListener('click', function () { WBAuth.open('signin'); });
        g.appendChild(b);
        return;
      }
      return WBAuth.client().then(function (c) {
        client = c;
        return c.from('profiles').select('is_admin').eq('id', user.id).maybeSingle();
      }).then(function (res) {
        if (!res || !res.data || !res.data.is_admin) {
          gate('This page is not available on your account.');
          return;
        }
        $('tb-gate').hidden = true;
        $('tb-app').hidden = false;
        wire();
        return load();
      });
    }).catch(function (err) {
      console.error('[taskboard]', err);
      gate('Could not load the board: ' + (err && err.message ? err.message : 'unknown error'), true);
    });

    // Signing out while the board is open should close it, not leave stale rows on screen.
    WBAuth.onChange(function (user) {
      if (!user && client) { tasks = []; location.reload(); }
    });
  }

  // ── DATA ────────────────────────────────────────────────────────────────

  function load() {
    return client.from('tasks').select('*')
      .eq('archived', showArchived)
      .order('position', { ascending: true })
      .order('created_at', { ascending: true })
      .then(function (res) {
        if (res.error) throw res.error;
        tasks = res.data || [];
        render();
      });
  }

  function save(id, patch) {
    return client.from('tasks').update(patch).eq('id', id).then(function (res) {
      if (res.error) throw res.error;
    });
  }

  // ── RENDER ──────────────────────────────────────────────────────────────

  function matches(t) {
    if (!filter) return true;
    var hay = (t.title + ' ' + (t.description || '')).toLowerCase();
    return hay.indexOf(filter) !== -1;
  }

  function dueTag(t) {
    if (!t.due_date) return null;
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var d = new Date(t.due_date + 'T00:00:00');
    var days = Math.round((d - today) / 86400000);
    var cls = 'tb-tag due' + (days < 0 ? ' past' : days <= 14 ? ' soon' : '');
    var label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    if (d.getFullYear() !== today.getFullYear()) label += ' ' + d.getFullYear();
    if (days < 0) label = 'Overdue · ' + label;
    return el('span', cls, label);
  }

  function card(t, kids) {
    var c = el('div', 'tb-card');
    c.draggable = true;
    c.dataset.id = t.id;
    c.style.borderLeftColor = byKey[t.status] ? byKey[t.status].color : 'transparent';

    c.appendChild(el('div', 'tb-card-title', t.title));

    var meta = el('div', 'tb-card-meta');
    if (t.priority) meta.appendChild(el('span', 'tb-tag ' + t.priority, t.priority));
    var dt = dueTag(t); if (dt) meta.appendChild(dt);
    if (t.description) meta.appendChild(el('span', 'tb-tag', 'notes'));
    if (t.claude_session_url) {
      var a = el('a', 'tb-chat', '💬');
      a.href = t.claude_session_url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.title = t.claude_session_title || 'Open the Claude chat this started in';
      a.addEventListener('click', function (e) { e.stopPropagation(); });
      meta.appendChild(a);
    }
    if (meta.childNodes.length) c.appendChild(meta);

    if (kids && kids.length) {
      var ul = el('ul', 'tb-kids');
      kids.forEach(function (k) {
        var li = el('li', 'tb-kid' + (k.status === 'complete' ? ' done' : ''));
        var dot = el('span', 'tb-dot');
        dot.style.background = byKey[k.status] ? byKey[k.status].color : '#666';
        li.appendChild(dot);
        li.appendChild(el('span', 'tb-kid-t', k.title));
        li.addEventListener('click', function (e) { e.stopPropagation(); openEditor(k); });
        ul.appendChild(li);
      });
      c.appendChild(ul);
    }

    c.addEventListener('click', function () { openEditor(t); });
    c.addEventListener('dragstart', function (e) {
      dragId = t.id;
      c.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', t.id); } catch (_) {}
    });
    c.addEventListener('dragend', function () { dragId = null; c.classList.remove('dragging'); });
    return c;
  }

  function render() {
    var board = $('tb-board');
    board.textContent = '';

    var kidsOf = {};
    tasks.forEach(function (t) {
      if (t.parent_id) { (kidsOf[t.parent_id] = kidsOf[t.parent_id] || []).push(t); }
    });

    var shown = 0;
    STATUSES.forEach(function (s) {
      var col = el('div', 'tb-col');
      col.dataset.status = s.key;

      var head = el('div', 'tb-col-head');
      var dot = el('span', 'tb-dot'); dot.style.background = s.color;
      head.appendChild(dot);
      head.appendChild(el('span', 'tb-col-name', s.name));
      var n = el('span', 'tb-col-n');
      head.appendChild(n);
      col.appendChild(head);

      var rows = tasks.filter(function (t) {
        return t.status === s.key && !t.parent_id && matches(t);
      });
      n.textContent = rows.length;
      shown += rows.length;
      rows.forEach(function (t) { col.appendChild(card(t, kidsOf[t.id])); });

      var add = el('button', 'tb-add', '+');
      add.type = 'button';
      add.title = 'New task in ' + s.name;
      add.addEventListener('click', function () { openEditor({ status: s.key }); });
      col.appendChild(add);

      col.addEventListener('dragover', function (e) { e.preventDefault(); col.classList.add('over'); });
      col.addEventListener('dragleave', function () { col.classList.remove('over'); });
      col.addEventListener('drop', function (e) {
        e.preventDefault();
        col.classList.remove('over');
        var id = dragId || (e.dataTransfer && e.dataTransfer.getData('text/plain'));
        if (!id) return;
        var t = tasks.find(function (x) { return x.id === id; });
        if (!t || t.status === s.key) return;
        var before = t.status;
        t.status = s.key;                    // optimistic
        render();
        save(id, { status: s.key }).catch(function (err) {
          t.status = before;                 // put it back if the write failed
          render();
          alert('Could not move that task: ' + (err.message || 'unknown error'));
        });
      });

      board.appendChild(col);
    });

    var sub = tasks.filter(function (t) { return t.parent_id; }).length;
    $('tb-count').textContent = shown + (shown === 1 ? ' task' : ' tasks') +
      (sub ? ', ' + sub + ' subtask' + (sub === 1 ? '' : 's') : '') +
      (showArchived ? ' · archived' : '');
  }

  // ── EDITOR ──────────────────────────────────────────────────────────────

  function fillSelects(t) {
    var st = $('tb-status');
    st.textContent = '';
    STATUSES.forEach(function (s) {
      var o = document.createElement('option');
      o.value = s.key; o.textContent = s.name;
      st.appendChild(o);
    });

    var p = $('tb-parent');
    p.textContent = '';
    var none = document.createElement('option');
    none.value = ''; none.textContent = '— none —';
    p.appendChild(none);
    tasks.filter(function (x) {
      return !x.parent_id && x.id !== t.id;   // one level of nesting only
    }).forEach(function (x) {
      var o = document.createElement('option');
      o.value = x.id; o.textContent = x.title;
      p.appendChild(o);
    });
  }

  function openEditor(t) {
    editing = t || {};
    fillSelects(editing);
    $('tb-mt').textContent = editing.id ? 'Edit task' : 'New task';
    $('tb-me').textContent = '';
    $('tb-title').value  = editing.title || '';
    $('tb-desc').value   = editing.description || '';
    $('tb-status').value = editing.status || 'draft';
    $('tb-prio').value   = editing.priority || '';
    $('tb-due').value    = editing.due_date || '';
    $('tb-parent').value = editing.parent_id || '';
    $('tb-chat').value   = editing.claude_session_url || '';
    $('tb-delbtn').hidden  = !editing.id;
    $('tb-archbtn').hidden = !editing.id;
    $('tb-archbtn').textContent = showArchived ? 'Unarchive' : 'Archive';
    $('tb-ov').classList.add('open');
    setTimeout(function () { $('tb-title').focus(); }, 30);
  }

  function closeEditor() { $('tb-ov').classList.remove('open'); editing = null; }

  function commit() {
    var title = $('tb-title').value.trim();
    if (!title) { $('tb-me').textContent = 'A title is required.'; return; }

    var row = {
      title: title,
      description: $('tb-desc').value.trim() || null,
      status: $('tb-status').value,
      priority: $('tb-prio').value || null,
      due_date: $('tb-due').value || null,
      parent_id: $('tb-parent').value || null,
      claude_session_url: $('tb-chat').value.trim() || null
    };

    var p;
    if (editing.id) {
      p = save(editing.id, row);
    } else {
      row.position = tasks.length;
      p = client.from('tasks').insert(row).then(function (res) {
        if (res.error) throw res.error;
      });
    }
    p.then(function () { closeEditor(); return load(); })
     .catch(function (err) { $('tb-me').textContent = err.message || 'Could not save that.'; });
  }

  function archive() {
    if (!editing.id) return;
    save(editing.id, { archived: !showArchived })
      .then(function () { closeEditor(); return load(); })
      .catch(function (err) { $('tb-me').textContent = err.message || 'Could not archive that.'; });
  }

  function remove() {
    if (!editing.id) return;
    var kids = tasks.filter(function (t) { return t.parent_id === editing.id; }).length;
    var warn = 'Delete "' + editing.title + '" permanently?';
    if (kids) warn += '\n\nThis also deletes its ' + kids + ' subtask' + (kids === 1 ? '' : 's') + '.';
    warn += '\n\nArchiving keeps it and hides it instead.';
    if (!confirm(warn)) return;
    client.from('tasks').delete().eq('id', editing.id).then(function (res) {
      if (res.error) throw res.error;
      closeEditor();
      return load();
    }).catch(function (err) { $('tb-me').textContent = err.message || 'Could not delete that.'; });
  }

  // ── WIRING ──────────────────────────────────────────────────────────────

  function wire() {
    $('tb-new').addEventListener('click', function () { openEditor({ status: 'draft' }); });

    $('tb-q').addEventListener('input', function (e) {
      filter = e.target.value.trim().toLowerCase();
      render();
    });

    $('tb-arch').addEventListener('click', function () {
      showArchived = !showArchived;
      this.classList.toggle('on', showArchived);
      this.textContent = showArchived ? 'Showing Archived' : 'Show Archived';
      load();
    });

    $('tb-reload').addEventListener('click', function () {
      var b = this; b.disabled = true;
      load().then(function () { b.disabled = false; }, function () { b.disabled = false; });
    });

    $('tb-ov').addEventListener('click', function (e) {
      if (e.target === $('tb-ov')) { closeEditor(); return; }
      var btn = e.target.closest('[data-tb]');
      if (!btn) return;
      var a = btn.getAttribute('data-tb');
      if (a === 'close') closeEditor();
      else if (a === 'save') commit();
      else if (a === 'archive') archive();
      else if (a === 'delete') remove();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && $('tb-ov').classList.contains('open')) closeEditor();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
