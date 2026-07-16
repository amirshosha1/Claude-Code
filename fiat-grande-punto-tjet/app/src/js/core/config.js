/* ============================================================
   App.config — central configuration (theme, units, currency,
   language, icons, feature flags, notification rules).
   Everything configurable lives here; modules read from it,
   never hardcode. Persisted user overrides in localStorage.
   ============================================================ */
window.App = window.App || {};
App.config = (function () {
  const KEY = 'gp-os-config';
  const DEFAULTS = {
    version: '2.0',
    locale: { language: 'en', rtlSupport: true },
    units: { distance: 'km', volume: 'L', consumption: 'L/100km' },
    currency: { code: 'EGP', symbol: 'EGP', locale: 'en-US' },
    theme: { mode: 'light', accent: 'rosso' },
    icons: {
      command: '⌂', restoration: '🔧', parts: '⚙', diagnostics: '⚠', service: '📘', fuel: '⛽',
      budget: '💰', planner: '🗓', workshops: '🏭', suppliers: '🚚', inventory: '📦', documents: '🗄',
      analytics: '📊', value: '💎', photos: '🖼', roadmap: '🗺', assistant: '🧠', search: '🔎',
      settings: '⚙️', notifications: '🔔'
    },
    /* notification rules (data-driven, evaluated by App.notify) */
    reminders: {
      oilChangeKm: 10000, oilChangeMonths: 12,
      serviceDueKmWindow: 3000, serviceDueDaysWindow: 30,
      warrantyWarnDays: 30, insuranceWarnDays: 30, licenseWarnDays: 45,
      timingBeltKm: 70000, timingBeltYears: 4
    },
    /* feature flags — future modules become active by flipping to true */
    features: {
      obdLive: false, aiAdvisor: false, expenseForecast: false, vinDecoder: false,
      ocrInvoice: false, barcodeScanner: false, cloudSync: false, multiUser: false
    },
    backup: { autoKeep: 5 },
    /* cloud sync (Supabase) — filled in Settings; anon key is public by
       design, so keep the hosted site behind Cloudflare Access */
    cloud: { provider: 'supabase', url: '', anonKey: '', table: 'garage_state', rowId: 'gp-tjet-2010' }
  };

  let cfg = null;
  function load() {
    try { cfg = Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY)) || {}); }
    catch (e) { cfg = Object.assign({}, DEFAULTS); }
    // deep-merge nested defaults so new keys appear after upgrades
    ['locale', 'units', 'currency', 'theme', 'icons', 'reminders', 'features', 'backup', 'cloud'].forEach(k =>
      cfg[k] = Object.assign({}, DEFAULTS[k], cfg[k] || {}));
    return cfg;
  }
  function get() { return cfg || load(); }
  function set(patch) { cfg = Object.assign(get(), patch); localStorage.setItem(KEY, JSON.stringify(cfg)); }
  function setPath(section, key, val) { const c = get(); c[section] = c[section] || {}; c[section][key] = val; localStorage.setItem(KEY, JSON.stringify(c)); }
  function reset() { localStorage.removeItem(KEY); cfg = null; return load(); }
  function icon(id) { return get().icons[id] || '•'; }
  function money(n) { const c = get().currency; return c.symbol + ' ' + Math.round(+n || 0).toLocaleString(c.locale); }

  return { DEFAULTS, load, get, set, setPath, reset, icon, money };
})();
