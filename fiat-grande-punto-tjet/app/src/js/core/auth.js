/* ============================================================
   App.auth — Supabase Auth (GoTrue) via plain fetch, no SDK.
   Email one-time-code sign-in. The session's access_token is what
   makes cloud sync SAFE: without it, sync.js refuses to run, because
   an anon key alone cannot scope rows to a single owner (RLS needs
   auth.uid(), which only exists once a user is signed in).
   Session is cached in localStorage under its own key, separate from
   both app state and app config, so a data-only reset never silently
   signs the user out and a config wipe doesn't strand a live session.
   ============================================================ */
window.App = window.App || {};
App.auth = (function () {
  const KEY = 'gp-os-auth';
  let session = load();

  function load() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
  function save(s) { session = s; try { if (s) localStorage.setItem(KEY, JSON.stringify(s)); else localStorage.removeItem(KEY); } catch (e) { } }

  function conf() { return App.config.get().cloud || {}; }
  function authBase() { return conf().url.replace(/\/+$/, '') + '/auth/v1/'; }
  function apiKeyHeaders() { return { apikey: conf().anonKey, 'Content-Type': 'application/json' }; }

  function isSignedIn() { return !!(session && session.access_token && session.expires_at > Date.now()); }
  function getUser() { return session ? session.user : null; }

  /* Step 1: request a 6-digit email code. */
  async function requestCode(email) {
    if (!conf().url || !conf().anonKey) return { ok: false, error: 'Configure the Supabase URL + anon key first.' };
    try {
      const r = await fetch(authBase() + 'otp', { method: 'POST', headers: apiKeyHeaders(), body: JSON.stringify({ email, create_user: true }) });
      if (!r.ok) { const j = await safeJson(r); return { ok: false, error: (j && j.msg) || ('HTTP ' + r.status) }; }
      return { ok: true };
    } catch (e) { return { ok: false, error: e.message || 'Network error' }; }
  }

  /* Step 2: verify the code the user received by email. */
  async function verifyCode(email, token) {
    try {
      const r = await fetch(authBase() + 'verify', { method: 'POST', headers: apiKeyHeaders(), body: JSON.stringify({ email, token, type: 'email' }) });
      const j = await safeJson(r);
      if (!r.ok || !j || !j.access_token) return { ok: false, error: (j && (j.msg || j.error_description)) || ('HTTP ' + r.status) };
      save({ access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Date.now() + (j.expires_in || 3600) * 1000, user: j.user });
      return { ok: true, user: j.user };
    } catch (e) { return { ok: false, error: e.message || 'Network error' }; }
  }

  /* Silent refresh; called by sync before any authenticated request if the token is near/past expiry. */
  async function ensureFreshSession() {
    if (!session || !session.refresh_token) return false;
    if (session.expires_at > Date.now() + 30000) return true; // still fresh enough
    try {
      const r = await fetch(authBase() + 'token?grant_type=refresh_token', { method: 'POST', headers: apiKeyHeaders(), body: JSON.stringify({ refresh_token: session.refresh_token }) });
      const j = await safeJson(r);
      if (!r.ok || !j || !j.access_token) { save(null); return false; }
      save({ access_token: j.access_token, refresh_token: j.refresh_token || session.refresh_token, expires_at: Date.now() + (j.expires_in || 3600) * 1000, user: j.user || session.user });
      return true;
    } catch (e) { return false; }
  }

  async function signOut() {
    if (session && session.access_token) {
      try { await fetch(authBase() + 'logout', { method: 'POST', headers: Object.assign(apiKeyHeaders(), { Authorization: 'Bearer ' + session.access_token }) }); } catch (e) { /* best effort */ }
    }
    save(null);
  }

  function accessToken() { return session ? session.access_token : null; }
  async function safeJson(r) { try { return await r.json(); } catch (e) { return null; } }

  return { isSignedIn, getUser, requestCode, verifyCode, ensureFreshSession, signOut, accessToken, hardClear: () => save(null) };
})();
