# 🚗 Fiat Grande Punto T-Jet — Complete Restoration Project

**Project Management System — v1.0** | Opened: 2026-07-12

---

## Vehicle Profile

| Field | Value |
|---|---|
| Vehicle | Fiat Grande Punto T-Jet (Type 199) |
| Model Year | 2010 |
| Engine | 1.4 T-Jet 16v Turbo (engine family **198A4000**, 120 HP — verify code on engine block / V5) |
| Transmission | 5/6-speed manual (confirm — C510/C635, affects clutch part numbers) |
| Mileage | 155,000 km |
| Country / Market | Egypt — Egyptian aftermarket + Genuine Fiat + Imported used (Estirad) |
| Fuel | 95 RON recommended (turbo engine — avoid 80/92 octane) |
| Engine Oil Spec | 5W-40 ACEA C3 / Fiat 9.55535-S2 (Selenia K P.E. or equivalent: Mobil, Motul, Liqui Moly) |
| Coolant | Paraflu UP (red OAT) — **never mix with green coolant** |

> ⚠️ **VIN rule:** Every OEM part number in this project must be confirmed against the VIN in ePER (or by the Fiat dealer parts desk) before purchase. Type 199 had running changes (2005–2012). Part numbers here are the commonly correct ones for a 2010 T-Jet but are marked with confidence levels.

---

## Project Goal

Restore to **excellent mechanical condition first → comfort → appearance**.
Philosophy: **Buy once, buy right.** Quality OEM / top-tier aftermarket only. No unnecessary replacements — diagnose first.

Decision classes used everywhere in this project:

- **Must Replace** — age/mileage-expired safety or reliability item
- **Recommended** — high value while labor is already paid (e.g., water pump with timing belt)
- **Inspect First** — replace only on confirmed failure
- **Cosmetic Only** — no mechanical effect

Diagnosis confidence classes: **Confirmed Failure / Likely Failure / Possible Failure / Inspection Needed**

---

## Priority Legend

| Symbol | Level | Meaning |
|---|---|---|
| 🔴 | Critical | Car should not continue driving until fixed |
| 🟠 | High | Repair within weeks |
| 🟡 | Medium | Next scheduled maintenance |
| 🟢 | Cosmetic | Whenever budget allows |

---

## File Index (the system)

| File | Purpose |
|---|---|
| [`01-baseline-inspection.md`](01-baseline-inspection.md) | **START HERE** — full 22-system inspection checklist to establish current condition |
| [`job-cards/JC-01-engine-turbo.md`](job-cards/JC-01-engine-turbo.md) | Engine, turbo, ignition, fuel |
| [`job-cards/JC-02-cooling.md`](job-cards/JC-02-cooling.md) | Cooling system |
| [`job-cards/JC-03-transmission-clutch.md`](job-cards/JC-03-transmission-clutch.md) | Gearbox, clutch, driveshafts |
| [`job-cards/JC-04-suspension-steering.md`](job-cards/JC-04-suspension-steering.md) | Suspension, steering |
| [`job-cards/JC-05-brakes.md`](job-cards/JC-05-brakes.md) | Brakes, ABS |
| [`job-cards/JC-06-electrical-ac.md`](job-cards/JC-06-electrical-ac.md) | Electrical, charging, A/C, lighting |
| [`job-cards/JC-07-body-interior.md`](job-cards/JC-07-body-interior.md) | Interior, exterior, audio, cosmetic |
| [`02-service-intervals.md`](02-service-intervals.md) | All consumables — intervals, status, urgency |
| [`03-parts-database.md`](03-parts-database.md) | Master parts list with OEM numbers, brands, status |
| [`04-purchase-tracker.md`](04-purchase-tracker.md) | Purchasing dashboard |
| [`05-budget.md`](05-budget.md) | Master budget (min / recommended / premium) |
| [`06-roadmap.md`](06-roadmap.md) | Phases 1–7 with costs, time, dependencies |
| [`07-workshop-log.md`](07-workshop-log.md) | Workshop visits, invoices, warranties |
| [`08-service-history.md`](08-service-history.md) | **Verified service history** from owner's ledger (Car.pdf) |
| [`09-diagnostic-findings-2026-07.md`](09-diagnostic-findings-2026-07.md) | **Diagnostic findings** — owner's July 2026 symptom report + ranked diagnoses |
| [`dashboard.html`](dashboard.html) | Interactive garage dashboard (open in any browser) |

---

## Executive Summary (revised 2026-07-12 — service history received)

The owner's maintenance ledger ([`08-service-history.md`](08-service-history.md)) proves this car is **well maintained, not neglected** — the restoration scope shrank dramatically:

**Already done (verified):** timing belt + tensioner + water pump + plugs @ 112k (Oct 2023) · PCV/oil separator @ ~122k · fuel pump @ 115k · clutch (LuK) + engine mounts @ 125k · alternator @ 128k · rear pads @ 135k (Nov 2025) · flywheel + front discs/pads + steering rack @ 140k (Dec 2025) · full front suspension overhaul @ 102k (Sep 2021) · turbo + exhaust manifold work (date unconfirmed ❓).

**What actually needs attention now (155k km — July 2026 diagnostic report in [`09-diagnostic-findings-2026-07.md`](09-diagnostic-findings-2026-07.md)):**

1. 🔴 **Electrical/SAFETY — ROOT CAUSE CONFIRMED (AlfaOBD scans): post-impact CAN bus fault.** A rear-right impact (~144k) latched the crash fuel-cutoff and damaged rear wiring (B1023 plate-light short-to-ground, present). Result: intermittent CAN faults → ESP/Hill Holder + airbag node drop, "fuel cut off" message. **It's a WIRING repair + weak battery, NOT a failed module — do NOT buy airbag/BSI/ESP ECU.** Start at the rear harness. See findings §12.
2. 🔴 **Coolant leak from expansion tank (Confirmed)** + suspected radiator hole → pressure test decides. Coolant switch to Paraflu UP/G12+ moves up to NOW (system is open anyway).
3. 🔴 **Torn air-intake hose (filter → turbo, OEM 51822558) — Confirmed.** Feeds unfiltered dust to the ORIGINAL 155k turbo; prime suspect for the 10 L/100km consumption. Replace immediately.
3. 🟠 **Noise under load, right side, 2nd/3rd gear** → ranked: inner CV joint > 3rd engine mount > clutch (clutch is 30k km young — **do NOT buy a clutch kit before the tests**).
4. 🟠 **Brakes weak + pulling/judder** despite Dec-2025 front discs → rear brakes + fluid flush + caliper service first, then re-judge master/servo.
5. 🟠 **Hard thudding over bumps** → rear shocks (original!) + front mounts/bump stops prime suspects.
6. 🟠 **Idle whistle** → accessory belt tensioner/idler set replacement (43k km old) + the torn hose itself.
7. 🟠 Spark plugs overdue (43k km) · oil service due (~157k) · battery/tires/A/C tests.
8. 🟡 Next timing belt ~172–180k or Oct 2027 (coolant switch no longer waits for it — see #1).
9. 🟢 Healthy/done: gearbox oil, clutch+flywheel, front discs, steering rack (EPS is electric — no hydraulic pump/hoses exist on this car), alternator, fuel pump, PCV.

**Budget snapshot (revised)** (see [`05-budget.md`](05-budget.md)): Immediate catch-up service ≈ **EGP 8–14k** · Probable near-term (suspension refresh + battery + tires as tests demand) ≈ **EGP 25–55k** · Full recommended incl. next belt + comfort ≈ **EGP 60–100k** · Premium incl. cosmetic ≈ **EGP 130–200k**. Confidence: **Low–Medium** — re-quote at purchase; the owner's own ledger prices are the best local benchmark.

---

## How to use this system

1. Complete the **baseline inspection** and record results in `01-baseline-inspection.md`.
2. Report symptoms/findings back into this project — each conversation **updates** the job cards, budget and trackers instead of starting over.
3. Buy parts only when the relevant job card says **Must Replace** or a diagnosis is **Confirmed**.
4. Log every purchase in `04-purchase-tracker.md` and every workshop visit in `07-workshop-log.md`.
5. Follow the phase order in `06-roadmap.md` — safety before comfort, comfort before cosmetics.
