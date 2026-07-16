/* ============================================================
   App.sync — Supabase cloud sync (localStorage-first, background).
   - Pure REST via fetch(); no external library, so the offline
     build stays dependency-free and degrades gracefully offline.
   - REQUIRES a signed-in Supabase Auth session (App.auth). Without one,
     sync refuses to run — an anon key alone cannot scope a row to one
     owner, so "logged out" must mean "no cloud read/write", full stop.
   - Row-level security: the table's `owner` column defaults to
     auth.uid() server-side and RLS restricts every policy to
     owner = auth.uid(). See HOSTING.md for the exact SQL.
   - Conflict handling: whole-state last-write-wins is replaced with a
     timestamp check against the last successful sync. If BOTH the
     local copy and the cloud copy changed since that point, sync stops
     and asks the user which one to keep instead of guessing.
     (This is still a whole-document compare, not a per-record 3-way
     merge — a real per-record merge would need each collection in its
     own table with row timestamps. That's a larger follow-up; this at
     least turns silent overwrite into an explicit, informed choice.)
   ============================================================ */
window.App = window.App || {};
App.sync = (function () {
  let enabled = false, timer = null, resolvingConflict = false;
  const LAST_SYNC_KEY = 'gp-os-sync-lastAt';

  function conf() { return App.config.get().cloud || {}; }
  function ready() { const c = conf(); return !!(c.url && c.anonKey); }
  function base() { return conf().url.replace(/\/+$/, '') + '/rest/v1/'; }
  async function authedHeaders(extra) {
    await App.auth.ensureFreshSession();
    const c = conf(); const token = App.auth.accessToken();
    return Object.assign({ apikey: c.anonKey, Authorization: 'Bearer ' + (token || c.anonKey), 'Content-Type': 'application/json' }, extra || {});
  }

  function lastSyncedAt() { try { return localStorage.getItem(LAST_SYNC_KEY) || null; } catch (e) { return null; } }
  function setLastSyncedAt(iso) { try { localStorage.setItem(LAST_SYNC_KEY, iso); } catch (e) { } }

  async function pull() {
    if (!ready()) return { ok: false, reason: 'not configured' };
    if (!App.auth.isSignedIn()) return { ok: false, reason: 'not signed in' };
    const c = conf();
    const url = base() + encodeURIComponent(c.table) + '?id=eq.' + encodeURIComponent(c.rowId) + '&select=data,updated_at';
    const r = await fetch(url, { headers: await authedHeaders() });
    if (!r.ok) return { ok: false, reason: 'HTTP ' + r.status };
    const rows = await r.json();
    if (!rows.length) return { ok: true, empty: true };
    return { ok: true, data: rows[0].data, updatedAt: rows[0].updated_at };
  }

  async function push(state) {
    if (!ready()) return { ok: false, reason: 'not configured' };
    if (!App.auth.isSignedIn()) return { ok: false, reason: 'not signed in' };
    const c = conf();
    const url = base() + encodeURIComponent(c.table) + '?on_conflict=owner,id';
    const nowIso = new Date().toISOString();
    // NOTE: no `owner` field sent — the column DEFAULTs to auth.uid()
    // server-side; RLS then guarantees this can only ever touch the
    // caller's own row regardless of what id/table values are supplied.
    const body = [{ id: c.rowId, data: state || App.store.state(), updated_at: nowIso }];
    const r = await fetch(url, { method: 'POST', headers: await authedHeaders({ Prefer: 'resolution=merge-duplicates,return=minimal' }), body: JSON.stringify(body) });
    if (r.ok) setLastSyncedAt(nowIso);
    return { ok: r.ok, reason: r.ok ? '' : 'HTTP ' + r.status };
  }

  /* Ask the user which copy to keep. Resolves 'local' | 'remote' | 'cancel'. */
  function confirmConflict(localAt, remoteAt) {
    return new Promise(resolve => {
      const { el } = App.util;
      const body = el('div', {}, [
        el('p', { style: 'font-size:13.5px;line-height:1.6;margin-bottom:12px', text:
          'Both this device and the cloud have changes since the last sync. This device was last saved ' + new Date(localAt).toLocaleString() +
          '; the cloud copy was last saved ' + new Date(remoteAt).toLocaleString() + '. Whole-state sync can only keep one — pick which to keep.' }),
        el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap' }, [
          el('button', { class: 'btn rosso', onclick: () => { resolve('local'); m.close(); } }, 'Keep THIS device'),
          el('button', { class: 'btn ghost', onclick: () => { resolve('remote'); m.close(); } }, 'Keep CLOUD copy'),
          el('button', { class: 'btn ghost', onclick: () => { resolve('cancel'); m.close(); } }, 'Cancel (decide later)')
        ])
      ]);
      const m = App.util.modal('Sync conflict', body);
    });
  }

  function schedulePush() {
    if (!enabled) return;
    clearTimeout(timer);
    timer = setTimeout(async () => { try { await syncNow(); } catch (e) { /* offline: keep local, retry next change */ } }, 1500);
  }

  /* Core sync decision: pull first, compare timestamps, act or ask. */
  async function syncNow() {
    if (!enabled || resolvingConflict) return;
    const res = await pull();
    if (!res.ok) return; // offline or misconfigured — stay on local silently, no data at risk
    const localSavedAt = (App.store.state().meta || {}).savedAt || null;
    const last = lastSyncedAt();
    const localChangedSinceSync = !last || (localSavedAt && new Date(localSavedAt) > new Date(last));
    const remoteChangedSinceSync = res.empty ? false : (!last || new Date(res.updatedAt) > new Date(last));

    if (res.empty) { await push(); return; } // first upload ever
    if (remoteChangedSinceSync && localChangedSinceSync) {
      resolvingConflict = true;
      const choice = await confirmConflict(localSavedAt, res.updatedAt);
      resolvingConflict = false;
      if (choice === 'local') await push();
      else if (choice === 'remote') { const r = App.store.adopt(res.data); if (r.ok) { setLastSyncedAt(res.updatedAt); App.util.toast('Kept cloud copy ↓'); rerender(); } else App.util.toast('Cloud data rejected: ' + r.error); }
      // 'cancel' — do nothing; will ask again on next change
      return;
    }
    if (remoteChangedSinceSync) {
      const r = App.store.adopt(res.data);
      if (r.ok) { setLastSyncedAt(res.updatedAt); App.util.toast('Synced from cloud ↓'); rerender(); }
      else App.util.toast('Cloud data rejected: ' + r.error);
      return;
    }
    if (localChangedSinceSync) { await push(); return; }
  }

  function rerender() { if (App.router) App.router.go((location.hash || '').replace('#/', '') || 'command', true); }

  async function init() {
    enabled = ready() && !!App.config.get().features.cloudSync && App.auth.isSignedIn();
    if (!enabled) return;
    try { await syncNow(); } catch (e) { /* offline: silently stay on localStorage */ }
    App.store.subscribe(() => schedulePush());
  }

  async function test() {
    if (!App.auth.isSignedIn()) return { ok: false, reason: 'Sign in first (Settings → Cloud Sync)' };
    try { return await pull(); } catch (e) { return { ok: false, reason: e.message || 'network' }; }
  }
  function status() { return { enabled, ready: ready(), signedIn: App.auth.isSignedIn() }; }

  return { init, pull, push, test, status, schedulePush, syncNow };
})();
