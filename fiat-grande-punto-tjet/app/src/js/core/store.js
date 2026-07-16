/* ============================================================
   App.store — the data layer.
   - Vehicle-scoped collections (array of records = future DB rows).
   - Pluggable persistence ADAPTER so we can swap localStorage for
     SQLite / Supabase / Postgres later WITHOUT touching the UI.
     Any adapter must implement: load() -> parsed|undefined(corrupt)|null(empty),
     loadRaw() -> string|null, save(state).
   - Pub/sub so modules re-render on change.

   DATA-SAFETY CONTRACT (read before touching load/migrate/import):
   - A missing/empty store is the ONLY case that may install the seed
     silently (first run — nothing existed to lose).
   - Corrupt JSON or a payload that fails validateState() is NEVER
     silently discarded. The raw bytes are preserved under a
     'gp-os-corrupt-<ts>' key, a recoveryNotice is attached to the
     in-memory state for the UI to surface loudly, and nothing is
     written back to the primary key until the user acts.
   - Only reset()/hardReset() (an explicit, user-confirmed action) may
     replace existing good data with the seed.
   ============================================================ */
window.App = window.App || {};
App.store = (function () {
  const KEY = 'gp-os-v2';
  const CORRUPT_PREFIX = 'gp-os-corrupt-';

  /* ---- persistence adapters (swap here for a real DB) ---- */
  const adapters = {
    local: {
      loadRaw() { try { return localStorage.getItem(KEY); } catch (e) { return null; } },
      // returns: null = nothing stored yet · undefined = stored but not valid JSON · object = parsed
      load() {
        const raw = this.loadRaw();
        if (raw == null) return null;
        try { return JSON.parse(raw); } catch (e) { return undefined; }
      },
      save(state) { localStorage.setItem(KEY, JSON.stringify(state)); }
    }
    /* Example future adapter (same signature, async-capable):
       supabase: { async load(){...}, async loadRaw(){...}, async save(s){...} }
       Only this object changes; modules keep calling App.store.* */
  };
  let adapter = adapters.local;

  let state = null;
  const subs = [];
  const ARRAY_COLLECTIONS = ['parts', 'installed', 'faults', 'scans', 'service', 'fuel', 'budget',
    'planner', 'workshops', 'suppliers', 'inventory', 'documents', 'roadmap', 'photos'];

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* ---- shape validation (also used to screen imports + cloud pulls) ---- */
  function validateState(obj) {
    const errors = [];
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) { errors.push('root is not an object'); return { valid: false, errors }; }
    if (!obj.meta || typeof obj.meta.schema !== 'number') errors.push('missing meta.schema (number)');
    if (!Array.isArray(obj.vehicles) || obj.vehicles.length === 0) {
      errors.push('missing vehicles[] (non-empty array)');
    } else {
      obj.vehicles.forEach((v, i) => {
        if (!v || typeof v !== 'object') { errors.push('vehicles[' + i + '] is not an object'); return; }
        if (typeof v.id !== 'string' || !v.id) errors.push('vehicles[' + i + '].id missing');
        if (!v.data || typeof v.data !== 'object') errors.push('vehicles[' + i + '].data missing');
        else ARRAY_COLLECTIONS.forEach(c => {
          if (v.data[c] != null && !Array.isArray(v.data[c])) errors.push('vehicles[' + i + '].data.' + c + ' must be an array');
        });
      });
      if (typeof obj.activeVehicleId !== 'string' || !obj.activeVehicleId) errors.push('missing activeVehicleId');
    }
    return { valid: errors.length === 0, errors };
  }

  /* ---- version-by-version migrations ----
     Add one entry per released schema bump: MIGRATIONS[N] transforms a
     state at schema N into schema N+1. Never skip versions — the
     runner walks the chain step by step so nothing is silently lost
     between releases. */
  const MIGRATIONS = {
    // Example scaffold for the first future bump (schema 2 -> 3).
    // Replace/extend when the shape actually changes; keep old entries
    // forever so old backups can still be replayed forward.
    // 2: function migrate_2_to_3(s) { /* transform s in place, return s */ return s; }
  };

  function runMigrations(raw) {
    const s = raw;
    const current = App.seed.meta.schema;
    if (typeof s.meta.schema !== 'number') s.meta.schema = 1;
    if (s.meta.schema > current) {
      // Data saved by a NEWER app version than this one understands.
      // Do not guess a downgrade transform — pass it through untouched
      // and flag it so the UI can warn instead of quietly mangling it.
      s.meta.schemaAhead = true;
      return s;
    }
    let steps = 0;
    while (s.meta.schema < current) {
      const fn = MIGRATIONS[s.meta.schema];
      if (!fn) break; // no known path from here — stop rather than guess
      const before = s.meta.schema;
      fn(s);
      s.meta.schema = before + 1;
      if (++steps > 50) break; // guard against a buggy migration looping forever
    }
    return s;
  }

  function preserveCorrupt(rawStr) {
    try { localStorage.setItem(CORRUPT_PREFIX + Date.now(), rawStr == null ? '' : rawStr); } catch (e) { /* best effort */ }
  }
  function corruptBackups() {
    const out = [];
    try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.indexOf(CORRUPT_PREFIX) === 0) out.push(k); } } catch (e) { }
    return out.sort().reverse();
  }
  function readCorruptBackup(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function discardCorruptBackup(key) { try { localStorage.removeItem(key); } catch (e) { } }

  function load() {
    const raw = adapter.load();
    if (raw === null) { // nothing stored — legitimate first run, nothing to lose
      state = clone(App.seed);
      persistSafe();
      return state;
    }
    if (raw === undefined) { // stored but not valid JSON at all
      preserveCorrupt(adapter.loadRaw ? adapter.loadRaw() : null);
      state = clone(App.seed);
      state.meta.recoveryNotice = 'Saved data could not be parsed (corrupted). The raw file was preserved — see Settings → Backup & Restore → Recovered Data. Showing defaults; nothing was overwritten.';
      return state;
    }
    const migrated = runMigrations(raw);
    const { valid, errors } = validateState(migrated);
    if (!valid) {
      preserveCorrupt(JSON.stringify(raw));
      state = clone(App.seed);
      state.meta.recoveryNotice = 'Saved data did not match the expected format (' + errors.slice(0, 3).join('; ') + '). A copy was preserved — see Settings → Backup & Restore → Recovered Data. Showing defaults; nothing was overwritten.';
      return state;
    }
    state = migrated;
    return state;
  }

  function persistSafe() {
    try {
      state.meta.savedAt = new Date().toISOString();
      adapter.save(state);
      return true;
    } catch (e) {
      console.error('App.store: write failed —', e);
      App.util && App.util.toast && App.util.toast('⚠ Could not save (storage full or blocked). Export a backup from Settings.');
      return false;
    }
  }
  function persist() { const ok = persistSafe(); subs.forEach(fn => fn(state)); return ok; }
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
    try {
      const keep = (App.config && App.config.get().backup.autoKeep) || 5;
      const list = backups();
      list.unshift({ at: new Date().toISOString(), label: label || 'auto', json: JSON.stringify(state) });
      localStorage.setItem(BKEY, JSON.stringify(list.slice(0, keep)));
      return true;
    } catch (e) {
      console.error('App.store.snapshot failed —', e);
      App.util && App.util.toast && App.util.toast('⚠ Snapshot failed (storage full?)');
      return false;
    }
  }
  function clearBackups() { try { localStorage.removeItem(BKEY); } catch (e) { } }
  function restoreBackup(at) {
    const b = backups().find(x => x.at === at);
    if (!b) return { ok: false, error: 'Backup not found' };
    let parsed; try { parsed = JSON.parse(b.json); } catch (e) { return { ok: false, error: 'Backup is corrupted' }; }
    const migrated = runMigrations(parsed);
    const { valid, errors } = validateState(migrated);
    if (!valid) return { ok: false, error: 'Backup failed validation: ' + errors.join('; ') };
    state = migrated; persist(); return { ok: true };
  }

  /* ---- vehicle fields ---- */
  function veh() { return activeVehicle(); }
  function setVeh(patch) { Object.assign(activeVehicle(), patch); persist(); }

  /* adopt remote state (from cloud sync). Validated exactly like an
     import — a malformed or malicious cloud payload must never
     silently corrupt or replace good local data. */
  function adopt(data) {
    const migrated = runMigrations(clone(data));
    const { valid, errors } = validateState(migrated);
    if (!valid) return { ok: false, error: 'Cloud data failed validation: ' + errors.join('; ') };
    state = migrated;
    persistSafe();
    subs.forEach(fn => fn(state));
    return { ok: true };
  }

  function exportJSON() { return JSON.stringify(state, null, 2); }

  /* Import: parse -> migrate -> validate -> ONLY THEN commit. A safety
     snapshot of the CURRENT state is taken first so a bad-but-valid
     import can always be undone from Settings → Backup & Restore. */
  function importJSON(txt) {
    let parsed;
    try { parsed = JSON.parse(txt); } catch (e) { throw new Error('That file is not valid JSON.'); }
    const migrated = runMigrations(parsed);
    const { valid, errors } = validateState(migrated);
    if (!valid) throw new Error('This backup does not match the expected format:\n- ' + errors.join('\n- '));
    snapshot('pre-import-safety');
    state = migrated;
    persist();
  }

  /* Explicit, user-confirmed destructive actions only. */
  function reset() { state = clone(App.seed); persist(); }
  function hardReset() { reset(); clearBackups(); }

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
    all, add, update, remove, veh, setVeh, adopt, exportJSON, importJSON, reset, hardReset, search,
    backups, snapshot, clearBackups, restoreBackup, validateState, runMigrations,
    corruptBackups, readCorruptBackup, discardCorruptBackup,
    useAdapter: a => { adapter = adapters[a] || adapter; } };
})();
