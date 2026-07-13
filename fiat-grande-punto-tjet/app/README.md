# app/ — Grande Punto Automotive OS (Version 2)

Modular, multi-vehicle vehicle-management OS. See [BUILD.md](BUILD.md) for architecture.

- **Open on your phone:** `dist/dashboard.html` (self-contained, offline).
- **Edit source:** `src/` then run `python3 build.py` to rebuild the bundle.
- **V1 fallback:** the original single-file dashboard remains at `../dashboard.html`.

19 modules, DB-swappable data layer, notification engine, backup/restore, light+dark, print.
