# Going live — Cloudflare Pages + Supabase

Your OS is a static site. This guide puts it on your Cloudflare domain
and wires Supabase cloud sync — properly scoped to your account, not
just an open API key behind a login page.

---

## Which build to deploy, and why it matters for security

There are two build artifacts:

| Path | What | Use for |
|---|---|---|
| `app/src/` | Multi-file source (external `.css`/`.js`) | **Hosted deployment** (Cloudflare Pages, Git-connected or "Upload assets" pointed at this folder) |
| `app/dist/dashboard.html` | Everything inlined into one file | **Offline/local use** — open by tapping it, no server, no internet |

**Deploy `app/src`, not `app/dist`, when hosting on your domain.**
The offline bundle inlines every `<script>`/`<style>` into one HTML file
so it can be opened directly from disk — but a real Content-Security-
-Policy needs `script-src 'self'` with **no** inline scripts, which only
works when the scripts are separate same-origin files. `app/src` already
is that (it's what the offline build gets bundled *from*). Keep
`app/dist/dashboard.html` around for offline use; it intentionally
carries no CSP since file:// pages aren't a CSP-relevant context.

Publish folder for Cloudflare Pages: **`fiat-grande-punto-tjet/app/src`**

---

## Part 1 — Host it on your domain (Cloudflare Pages)

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
2. Pick the repo and branch you want live.
3. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `fiat-grande-punto-tjet/app/src`
4. **Save and Deploy** → you get a `*.pages.dev` URL to test.
5. **Custom domains** → **Set up a domain** → enter your domain/subdomain.

`app/src/_headers` ships with the deployment and sets:
```
Content-Security-Policy: default-src 'self'; script-src 'self';
  style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';
  connect-src 'self' https://*.supabase.co; frame-ancestors 'none';
  base-uri 'self'; form-action 'self'; object-src 'none'
```
**Honest scope of this CSP:** `script-src 'self'` has no `unsafe-inline` —
the actual code-execution attack surface is fully locked down. `style-src`
still allows `'unsafe-inline'` because the UI sets hundreds of inline
`style="…"` attributes procedurally for layout/color; removing that is a
separate, larger refactor (moving every inline style to CSS classes) and
isn't done here. Inline *styles* are a much narrower risk (CSS injection,
not code execution) than inline *scripts*, so this is a deliberate,
documented trade-off, not an oversight.

### Still lock the site itself
Even with real per-user auth on the data layer, keep the site private:
Cloudflare **Zero Trust → Access → Applications → Add → Self-hosted** →
your domain → policy **Allow** → your email. This stops randoms from even
loading the app shell; it is a second layer, not the only one — the
first layer is now Supabase Auth + RLS below, which is what actually
protects your data if the anon key or the URL ever leaks.

---

## Part 2 — Cloud sync (Supabase), properly scoped to you

Cloudflare Access protects the *page*. It does **not** protect direct
calls from that page to the Supabase REST API — anyone with the anon
key (which is necessarily public in a static site) could otherwise read
or write the table directly, bypassing Access entirely. The fix is to
require a signed-in Supabase user for every read/write and restrict rows
to their owner with Row Level Security, so the anon key alone is not
enough to touch anyone's data.

### 2a. Create the table (owner-scoped, RLS on)
Supabase → your project → **SQL Editor** → run:

```sql
create table if not exists garage_state (
  owner uuid not null default auth.uid() references auth.users(id) on delete cascade,
  id text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (owner, id)
);

alter table garage_state enable row level security;

-- Every policy is scoped to the signed-in user's own rows only.
create policy "select own rows" on garage_state
  for select using (owner = auth.uid());
create policy "insert own rows" on garage_state
  for insert with check (owner = auth.uid());
create policy "update own rows" on garage_state
  for update using (owner = auth.uid()) with check (owner = auth.uid());
create policy "delete own rows" on garage_state
  for delete using (owner = auth.uid());
```

Because `owner` defaults to `auth.uid()`, the app never needs to know or
send its own user id — it just omits the column on insert, and Postgres
fills it in from the authenticated request. RLS then makes every select/
update/delete a no-op for anyone else's rows, even if they have the
anon key and guess a row id.

### 2b. Enable email sign-in
Supabase → **Authentication → Providers → Email** → make sure Email is
enabled. The app uses a 6-digit one-time code (not just a magic link):
Supabase's default "Magic Link" email template already includes
`{{ .Token }}` (the numeric code) alongside the link — if you've
customized the template, keep that token placeholder so users can type
the code back into the app instead of only clicking a link.

### 2c. Get your keys
Supabase → **Project Settings → API**:
- **Project URL** → e.g. `https://abcd1234.supabase.co`
- **anon public** key (the long `eyJ...` one — safe to ship in a static
  site; it identifies the *project*, not a user — actual access is
  gated by the signed-in session + RLS above, not by keeping this secret)

### 2d. Turn it on in the app
Open the live site → **Settings → Cloud Sync — Supabase**:
1. Paste **Project URL** and **anon key** (table/row id can stay default).
2. **Save cloud config.**
3. Enter your email → **Send code** → check your inbox → enter the code →
   **Verify & sign in**.
4. Tick **Enable cloud sync** → **Save cloud config** again → **Test
   connection** (should say *Connected ✓*) → **↕ Sync now**.

From here, changes push to Supabase in the background and other signed-
-in devices pull the newer copy automatically — see the conflict
behavior below.

---

## How sync behaves (read this so nothing surprises you)

- **localStorage-first:** the app is instant and fully usable offline;
  sync is a background layer on top, and does nothing at all unless
  you're signed in and the flag is enabled.
- **No login, no sync — by design.** Without a Supabase session there is
  no user for RLS to scope rows to, so the app refuses to read or write
  the cloud table rather than falling back to some unscoped shared state.
- **Conflict handling:** before syncing, the app compares this device's
  last-saved time against the cloud row's last-updated time against the
  last time *this device* successfully synced. If only one side changed,
  it syncs automatically (pull if cloud is newer, push if only local
  changed). If **both** changed since the last sync — e.g. you edited on
  your phone and your laptop offline at the same time — you get an
  explicit prompt: *"Keep this device / Keep cloud / Cancel"*. Nothing
  is silently overwritten.
  - **Known limitation:** this compares the *whole* saved state as one
    document, not each record individually. If you resolve a conflict by
    keeping one device's copy, any edits made only on the *other* device
    since the last sync are the ones you're choosing to discard for that
    round. A true per-record merge would require splitting each
    collection into its own table with row-level timestamps — a larger
    follow-up, not implemented here. In practice: avoid editing the same
    vehicle on two offline devices at once, and this rarely matters.
- **Backups are independent of sync:** Settings → Backup & Restore still
  exports/imports JSON and keeps rolling local snapshots regardless of
  whether cloud sync is configured.
- **Corrupt or invalid data is never silently discarded** — on load,
  import, or cloud pull, anything that fails validation is preserved
  under a `gp-os-corrupt-*` key and surfaced as a banner in Settings
  instead of being replaced with defaults behind your back.

## Rebuilding after changes
Edit files under `app/src/`. For the **offline** bundle, run
`python3 build.py` to regenerate `app/dist/dashboard.html`. The **hosted**
deployment (pointed at `app/src`) picks up changes on the next deploy —
no build step needed since nothing there is generated.
