/* ============================================================
   App.store — the data layer.
   - Vehicle-scoped collections (array of records = future DB rows).
   - Pluggable persistence ADAPTER so we can swap localStorage for
     SQLite / Supabase / Postgres later WITHOUT touching the UI.
     Any adapter must implement: load() -> state|null, save(state).
   - Pub/sub so modules re-render on change.
   ============================================================ */
window.App = window.App || {};
App.store = (function () {
  const KEY = 'gp-os-v2';

  /* ---- persistence adapters (swap here for a real DB) ---- */
  const adapters = {
    local: {
      load() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } },
      save(state) { localStorage.setItem(KEY, JSON.stringify(state)); }
    }
    /* Example future adapter (same signature, async-capable):
       supabase: { async load(){...}, async save(s){...} }
       Only this object changes; modules keep calling App.store.* */
  };
  let adapter = adapters.local;

  let state = null;
  const subs = [];

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function migrate(s) {
    // simple forward-migration hook; bump seed.meta.schema when shape changes
    if (!s || !s.meta || s.meta.schema !== App.seed.meta.schema) return clone(App.seed);
    return s;
  }

  function load() {
    state = migrate(adapter.load());
    return state;
  }
  function persist() {
    state.meta.savedAt = new Date().toISOString();
    adapter.save(state);
    subs.forEach(fn => fn(state));
  }
  function subscribe(fn) { subs.push(fn); return () => { const i = subs.indexOf(fn); if (i > -1) subs.splice(i, 1); }; }

  /* ---- vehicle scope ---- */
  function vehicles() { return state.vehicles; }
  function activeVehicle() { return state.vehicles.find(v => v.id === state.activeVehicleId) || state.vehicles[0]; }
  function setActiveVehicle(id) { state.activeVehicleId = id; persist(); }
  function addVehicle(v) {
    v.id = v.id || 'veh-' + Date.now();
    v.data = v.data || emptyData();
    state.vehicles.push(v); state.activeVehicleId = v.id; persist(); return v;
  }
  function emptyData() {
    return { parts: [], installed: [], faults: [], scans: [], service: [], fuel: [], budget: [],
      planner: [], workshops: [], suppliers: [], inventory: [], documents: [], roadmap: [], photos: [],
      value: { purchase: 0, invested: 0, repairEstimate: 0, modEstimate: 0, estResale: 0 } };
  }

  /* ---- record normalization: every record gets id + audit fields ---- */
  function normalize(coll, rec) {
    const now = new Date().toISOString();
    rec.id = rec.id || coll + '-' + Date.now() + '-' + Math.floor(Math.random() * 1e4);
    if (!rec.createdAt) rec.createdAt = now;
    rec.updatedAt = now;
    if (rec.notes == null) rec.notes = rec.notes || '';
    if (!Array.isArray(rec.tags)) rec.tags = rec.tags || [];
    if (!Array.isArray(rec.attachments)) rec.attachments = rec.attachments || [];
    return rec;
  }

  /* ---- generic collection CRUD (vehicle-scoped) ---- */
  function all(coll) { const v = activeVehicle(); return (v.data[coll] = v.data[coll] || []); }
  function add(coll, rec) { normalize(coll, rec); all(coll).unshift(rec); persist(); return rec; }
  function update(coll, id, patch) { const r = all(coll).find(x => x.id === id); if (r) { Object.assign(r, patch); r.updatedAt = new Date().toISOString(); persist(); } return r; }
  function remove(coll, id) { const a = all(coll); const i = a.findIndex(x => x.id === id); if (i > -1) { a.splice(i, 1); persist(); } }

  /* ---- automatic backup / restore (rolling snapshots) ---- */
  const BKEY = 'gp-os-backups';
  function backups() { try { return JSON.parse(localStorage.getItem(BKEY)) || []; } catch (e) { return []; } }
  function snapshot(label) {
    const keep = (App.config && App.config.get().backup.autoKeep) || 5;
    const list = backups();
    list.unshift({ at: new Date().toISOString(), label: label || 'auto', json: JSON.stringify(state) });
    localStorage.setItem(BKEY, JSON.stringify(list.slice(0, keep)));
  }
  function restoreBackup(at) { const b = backups().find(x => x.at === at); if (b) { state = migrate(JSON.parse(b.json)); persist(); } }

  /* ---- vehicle fields ---- */
  function veh() { return activeVehicle(); }
  function setVeh(patch) { Object.assign(activeVehicle(), patch); persist(); }

  function exportJSON() { return JSON.stringify(state, null, 2); }
  function importJSON(txt) { const parsed = JSON.parse(txt); state = migrate(parsed); persist(); }
  function reset() { state = clone(App.seed); persist(); }

  /* ---- global search across collections ---- */
  function search(q) {
    q = (q || '').trim().toLowerCase(); if (!q) return [];
    const out = []; const v = activeVehicle();
    const map = { parts: ['name', 'ar', 'oem', 'fiat', 'alt', 'brand', 'category', 'notes'],
      faults: ['code', 'system', 'desc', 'symptom', 'root'], service: ['work', 'workshop', 'parts', 'date'],
      workshops: ['name', 'spec', 'phone'], suppliers: ['name', 'contact'], inventory: ['item', 'category'],
      documents: ['name', 'type', 'ref'] };
    Object.keys(map).forEach(coll => (v.data[coll] || []).forEach(rec => {
      if (map[coll].some(f => (rec[f] || '').toString().toLowerCase().includes(q)))
        out.push({ coll, rec, label: rec.name || rec.code || rec.work || rec.item || rec.title || '—' });
    }));
    return out.slice(0, 24);
  }

  return { load, persist, subscribe, state: () => state, vehicles, activeVehicle, setActiveVehicle, addVehicle,
    all, add, update, remove, veh, setVeh, exportJSON, importJSON, reset, search,
    backups, snapshot, restoreBackup, useAdapter: a => { adapter = adapters[a] || adapter; } };
})();
