/* ============================================================
   App.sync — Supabase cloud sync (localStorage-first, background).
   - Pure REST via fetch(); no external library, so the offline
     build stays dependency-free and degrades gracefully offline.
   - Whole app state is stored as one JSONB row (id,data,updated_at).
     Trivial to normalize into per-collection tables later.
   - Config (url, anon key, table, rowId) comes from App.config.cloud
     and the `cloudSync` feature flag — never hardcoded.
   Security: the anon key is PUBLIC by design; keep the hosted site
   behind Cloudflare Access + enable RLS on the table (see HOSTING.md).
   ============================================================ */
window.App = window.App || {};
App.sync = (function () {
  let enabled = false, timer = null, busy = false;

  function conf() { return App.config.get().cloud || {}; }
  function ready() { const c = conf(); return !!(c.url && c.anonKey); }
  function base() { return conf().url.replace(/\/+$/, '') + '/rest/v1/'; }
  function headers(extra) {
    const c = conf();
    return Object.assign({ apikey: c.anonKey, Authorization: 'Bearer ' + c.anonKey, 'Content-Type': 'application/json' }, extra || {});
  }

  async function pull() {
    if (!ready()) return { ok: false, reason: 'not configured' };
    const c = conf();
    const url = base() + encodeURIComponent(c.table) + '?id=eq.' + encodeURIComponent(c.rowId) + '&select=data,updated_at';
    const r = await fetch(url, { headers: headers() });
    if (!r.ok) return { ok: false, reason: 'HTTP ' + r.status };
    const rows = await r.json();
    if (!rows.length) return { ok: true, empty: true };
    return { ok: true, data: rows[0].data, updatedAt: rows[0].updated_at };
  }

  async function push(state) {
    if (!ready()) return { ok: false, reason: 'not configured' };
    const c = conf();
    const url = base() + encodeURIComponent(c.table) + '?on_conflict=id';
    const body = [{ id: c.rowId, data: state || App.store.state(), updated_at: new Date().toISOString() }];
    const r = await fetch(url, { method: 'POST', headers: headers({ Prefer: 'resolution=merge-duplicates,return=minimal' }), body: JSON.stringify(body) });
    return { ok: r.ok, reason: r.ok ? '' : 'HTTP ' + r.status };
  }

  function schedulePush() {
    if (!enabled) return;
    clearTimeout(timer);
    timer = setTimeout(async () => { try { await push(); } catch (e) { /* offline: keep local */ } }, 1500);
  }

  async function init() {
    enabled = ready() && !!App.config.get().features.cloudSync;
    if (!enabled) return;
    try {
      const res = await pull();
      if (res.ok && res.data) {
        const localAt = new Date((App.store.state().meta || {}).savedAt || 0).getTime();
        const remoteAt = new Date(res.updatedAt || 0).getTime();
        if (remoteAt > localAt) {
          App.store.adopt(res.data);
          App.util.toast('Synced from cloud ↓');
          if (App.router) App.router.go((location.hash || '').replace('#/', '') || 'command', true);
        } else {
          schedulePush(); // local is newer → upload
        }
      } else if (res.ok && res.empty) {
        schedulePush(); // first upload
      }
    } catch (e) { /* offline: silently stay on localStorage */ }
    App.store.subscribe(() => schedulePush());
  }

  async function test() { try { return await pull(); } catch (e) { return { ok: false, reason: e.message || 'network' }; } }
  function status() { return { enabled, ready: ready() }; }

  return { init, pull, push, test, status, schedulePush };
})();
