# Going live — Cloudflare Pages + Supabase

Your OS is a static site. This guide puts it on your Cloudflare domain and
wires free Supabase cloud sync so data follows you across phone + laptop.

Publish folder (the only path Cloudflare needs):
```
fiat-grande-punto-tjet/app/dist
```

---

## Part 1 — Host it on your domain (Cloudflare Pages)

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
2. Pick the repo `amirshosha1/claude-code` and the branch you want live.
3. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty — the file is prebuilt)*
   - **Build output directory:** `fiat-grande-punto-tjet/app/dist`
4. **Save and Deploy** → you get a `*.pages.dev` URL to test.
5. **Custom domains** (in the Pages project) → **Set up a domain** → enter your
   domain/subdomain. Since your domain's DNS is already on Cloudflare, it adds
   the record for you. HTTPS is automatic.

### Lock it down (do this — it holds personal data)
Cloudflare **Zero Trust → Access → Applications → Add application → Self-hosted**:
- Domain = your site.
- Policy = **Allow** → include your email (One-time PIN). Now only you can open it.
Free for personal use.

Every push to the chosen branch auto-redeploys, so future updates go live on their own.

---

## Part 2 — Cloud sync (Supabase, free)

### 2a. Create the table
Supabase → your project → **SQL Editor** → run:

```sql
create table if not exists garage_state (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table garage_state enable row level security;

-- Personal app kept behind Cloudflare Access. The anon key is public by
-- design; these policies let the app read/write this one table. For stricter
-- security later, switch to Supabase Auth and scope policies to auth.uid().
create policy "app read"   on garage_state for select using (true);
create policy "app insert" on garage_state for insert with check (true);
create policy "app update" on garage_state for update using (true) with check (true);
```

### 2b. Get your keys
Supabase → **Project Settings → API**:
- **Project URL** → e.g. `https://abcd1234.supabase.co`
- **anon public** key (the long `eyJ...` one — this is safe to put in a static site)

### 2c. Turn it on in the app
Open the live site → **Settings → Cloud Sync — Supabase**:
1. Paste **Project URL** and **anon key**. Leave table = `garage_state`, rowId = `gp-tjet-2010`.
2. Tick **Enable cloud sync**.
3. **Save cloud config** → **Test connection** (should say *Connected ✓*) → **Push now**.

Done. From now on:
- Every change is pushed to Supabase in the background (debounced).
- On another device, open the site → it pulls the newer copy automatically.
- Offline still works (localStorage); it re-syncs when back online.

---

## How sync behaves (so nothing surprises you)
- **localStorage-first:** the app is instant and fully offline-capable.
- **Conflict rule:** newest `updated_at` wins (last-write-wins on the whole
  state blob). Avoid editing the *same* record on two devices while both are
  offline; otherwise it's seamless.
- **Backups:** Settings → Backup & Restore still exports/imports JSON and keeps
  rolling local snapshots, independent of the cloud.

## Security summary
- Site gated by **Cloudflare Access** (only your email).
- Supabase **RLS on**; anon key is public (that's normal for static apps).
- Want bank-grade later? Add **Supabase Auth** (email magic link) and scope the
  RLS policies to `auth.uid()` — the sync layer already speaks REST, so only the
  policies + a login button change; no module rewrites.

## Rebuilding after changes
Edit `src/`, then `python3 build.py` → commit/push → Cloudflare redeploys.
