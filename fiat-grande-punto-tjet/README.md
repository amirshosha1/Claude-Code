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

---

## Executive Summary (current state)

At **155,000 km with no verified service history in hand**, the plan assumes nothing. The project starts with a **baseline diagnostic inspection** (Phase 0/1) — compression + leak-down, boost pressure, OBD scan, suspension shake-down, brake measurement — before any expensive part is bought.

Known statistical weak points of the 1.4 T-Jet that this plan watches closely:

1. **Timing belt system** — belt-driven engine; a snapped belt destroys valves/pistons. Unknown history = 🔴 Must Replace immediately (belt + tensioner + water pump).
2. **Ignition coils & spark plugs** — classic T-Jet misfire source, aggravated by heat and low-octane fuel.
3. **PCV membrane in cam cover** — causes oil consumption, rough idle, whistling.
4. **Turbo wastegate actuator & boost solenoid (Pierburg)** — limp mode / low boost.
5. **Thermostat housing & plastic cooling parts** — brittle at this age in hot climate.
6. **Front suspension wear** (control arm bushes, drop links, top mounts) — universal at 155k on Egyptian roads.
7. **Dualdrive electric power steering** — column motor faults (do NOT buy before diagnosis; expensive).

**Budget snapshot** (see [`05-budget.md`](05-budget.md)): Minimum (safety only) ≈ **EGP 45–65k** · Recommended full mechanical restoration ≈ **EGP 120–170k** · Premium incl. cosmetic ≈ **EGP 220–300k**. Confidence: **Low–Medium** — Egyptian parts prices move with exchange rate; re-quote everything at purchase time.

---

## How to use this system

1. Complete the **baseline inspection** and record results in `01-baseline-inspection.md`.
2. Report symptoms/findings back into this project — each conversation **updates** the job cards, budget and trackers instead of starting over.
3. Buy parts only when the relevant job card says **Must Replace** or a diagnosis is **Confirmed**.
4. Log every purchase in `04-purchase-tracker.md` and every workshop visit in `07-workshop-log.md`.
5. Follow the phase order in `06-roadmap.md` — safety before comfort, comfort before cosmetics.
