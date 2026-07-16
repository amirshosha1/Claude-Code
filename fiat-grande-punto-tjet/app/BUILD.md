# Grande Punto — Automotive OS · Build & Architecture

Version 2 of the dashboard: a modular, multi-vehicle **Automotive Operating System**.
V1 (`../dashboard.html`) is kept untouched as a fallback.

## Two artifacts, one source of truth

| Path | What | Use |
|---|---|---|
| `src/` | Modular source (HTML + CSS + JS modules + data) | Edit here |
| `dist/dashboard.html` | Single self-contained offline build | Open this on the phone |

**Everything you change in `src/` is reflected in the build after running the bundler.**

## Build

```bash
cd app
python3 build.py        # → dist/dashboard.html (offline, self-contained)
```

The bundler (`build.py`) reads `src/index.html`, inlines every `<link>` CSS and
ordered `<script src>` into one file, and strips build markers. No Node, npm,
CDN, or internet required — the output opens by double-tapping over `file://`
on Android/desktop.

## Why namespaced modules instead of ES6 `import`/`export`

ES6 module scripts **cannot load over `file://`** (browsers block them by CORS),
and this app must run offline by opening the file directly. So each module is a
classic script that attaches to a global `App.*` namespace. This gives the same
modularity and dependency ordering, and makes the bundle a trivial, reliable
concatenation. If a web server is ever used, the same files work unchanged.

## Architecture

```
src/
  index.html                 shell + ordered includes (bundler manifest)
  css/  theme · components · layout          (design tokens, primitives, shell/responsive/print)
  js/core/
    util.js        DOM + formatting helpers, modal, toast, gauge SVG
    config.js      App.config — theme, units, currency, language, icons,
                   reminder rules, FEATURE FLAGS (future modules)
    seed.js        initial data (multi-vehicle schema)
    store.js       DATA LAYER — vehicle-scoped collections, CRUD with
                   auto id + createdAt/updatedAt/notes/tags/attachments,
                   pub/sub, backups, global search, pluggable ADAPTER
    ui.js          reusable component builders (tiles, dials, meters, badges)
    datatable.js   App.DataTable — search · sort · filter · paginate · CSV
    crud.js        App.crud — schema→module factory (DRY directory modules)
    notify.js      App.notify — data-driven reminder/notification engine
    router.js      module registry + hash routing + app shell (sidebar/topbar)
  js/modules/      one concern each; self-register with App.router
  js/app.js        bootstrap (load config+store, mount router, wire bell)
```

## Data layer & future cloud sync

The store persists via a swappable **adapter** (`adapters.local` today). Any adapter
implements `load() → state` and `save(state)`. To move to SQLite / Supabase /
Postgres, add one adapter object with the same signature and call
`App.store.useAdapter('supabase')` — **no UI or module changes required**.
Every record is a plain object (a future DB row) with `id`, `createdAt`,
`updatedAt`, `notes`, `tags`, `attachments`.

## Multi-vehicle

State shape: `{ activeVehicleId, vehicles:[ { id, vin, make, model, year, engine,
transmission, mileage, data:{ parts, faults, service, fuel, budget, planner,
workshops, suppliers, inventory, documents, roadmap, photos, value } } ] }`.
Add vehicles with `App.store.addVehicle({...})`; the sidebar switcher scopes
every module to the active vehicle. First release ships one vehicle
(2010 Fiat Grande Punto T-Jet).

## Modules (V2)

Fully implemented: Command Center · Restoration Dashboard (100% of V1
preserved) · Parts Database · Diagnostics Center · Digital Service Book ·
Maintenance Planner · Fuel Dashboard · Budget Manager · Workshop Directory ·
Suppliers · Garage Inventory · Documents Vault · Settings.

Real screens bound to the data layer, to be expanded: Analytics · Restoration
Roadmap · Vehicle Value · Photo Timeline · Global Search · AI Assistant.

## Extension points (feature flags in `config.features`)

`obdLive · aiAdvisor · expenseForecast · vinDecoder · ocrInvoice ·
barcodeScanner · cloudSync · multiUser` — toggled in Settings; each will plug
into the existing data layer + UI hooks without refactoring.

## Standards enforced

Data-driven UI · unique IDs · audit fields · reusable DataTable (search/sort/
filter/paginate/CSV) · central config · independent modules on one store ·
JSON backup/restore + rolling snapshots · notification engine · light+dark ·
keyboard (`/` focuses search) · ARIA roles · reduced-motion support · print mode.
