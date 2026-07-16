# JC-02 — Cooling System

**Priority context:** Egypt heat + turbo engine = cooling is a reliability pillar, not an accessory.
**Status (rev. 2026-07-12): 🔴 ACTIVE FAILURE — coolant leak CONFIRMED from expansion tank; radiator hole suspected.** See [`../09-diagnostic-findings-2026-07.md`](../09-diagnostic-findings-2026-07.md) §1.

**Immediate plan:** replace expansion tank + cap → pressure test with new tank fitted → radiator only if the test confirms it → all hoses squeezed during the test → full refill with **Paraflu UP/G12+ 50/50 demineralized** (the Mannol switch happens NOW, not at the belt job). Until fixed: distilled-water top-ups only, watch the gauge, no highway pulls.

---

## 1. Water Pump — 🔴 (bundled with timing belt)

Done inside JC-01 timing job. Never reuse a 155k pump behind a new belt: a seizing pump throws the new belt.
Brands: Graf/Metelli ★★★★★ (often OE) · SKF ★★★★★ · Gates ★★★★☆. Prefer **metal impeller** version.

## 2. Thermostat + Housing — 🟠 HIGH · **Recommended** (replace during timing job)

| Item | Detail |
|---|---|
| Symptoms to check | Slow warm-up (stuck open), overheat in traffic (stuck closed), weep at housing seam |
| Root cause | Plastic housing + wax element aged 16 years; brittle in heat |
| Decision | **Recommended** while coolant is drained anyway — cheap insurance |
| OEM number (verify ePER) | ~**55224022** (integrated housing w/ sensor, T-Jet) — confidence Medium |
| Brands | Genuine ★★★★★ · Behr/Mahle ★★★★★ · Calorstat/Vernet ★★★★☆ · Metelli ★★★☆☆ |
| Pricing (EGP, LOW) | Part 1,200–2,500 · labor folded into timing job · **Total ≈ 1,500–2,800** |
| Risk if ignored | Stuck-closed = overheat → head gasket EGP 15–25k. Stuck-open = rich running, oil dilution, sluggish heater |

## 3. Radiator — 🟡 · **Inspect First**

Pressure test + fin condition first. Egyptian sand erodes fins; crusty white end tanks = seeping.
Brands: Behr ★★★★★ · Valeo ★★★★★ (often OE) · Denso ★★★★☆ · Magneti Marelli ★★★★☆ · cheap copies ☆ (thin cores overheat in traffic).
Pricing (LOW): Valeo/Behr 4,500–8,000 · labor 500–1,000. Only on **Confirmed** leak/blockage.

## 4. Expansion Tank + Cap — 🟠 · **Must Replace cap, Inspect tank**

Cap spring fatigues → system never reaches pressure → boils at lower temp. Cheapest overheat insurance on the car.
Tank: replace if crazed/brown. Pricing (LOW): cap 150–400 · tank 600–1,200. Brands: genuine/Behr ★★★★★.

## 5. Hoses & Quick Connectors — 🟠 · **Inspect First, low threshold to replace**

Squeeze test hot/cold: crunchy, soft, or ballooned = replace. Plastic quick-connect collars get brittle — handle carefully during timing job; keep 2 spare O-ring sets on hand.
Brands: genuine ★★★★★ · Gates ★★★★☆ · Sasic/Metalcaucho ★★★☆☆. Pricing each (LOW): 400–1,500.

## 6. Cooling Fans + Resistor — 🟡 · **Inspect First**

Both speeds must work (test with A/C on). Failed low-speed resistor is common → car only cools at high speed, late.
Brands: genuine/Gate ★★★★★ · Magneti Marelli ★★★★☆. Pricing (LOW): resistor 500–1,200 · fan assy 3,000–6,000.

## 7. Coolant Temperature Sensor — 🟢/🟡

Usually integrated in thermostat housing on T-Jet (covered by item 2). Verify in ePER.

---

## Job Card Summary

| Task | Decision | Priority | Est. total (EGP) |
|---|---|---|---|
| **Expansion tank + cap (leak Confirmed)** | Must Replace NOW | 🔴 | 750–1,600 |
| **Pressure test (radiator verdict)** | Must Do NOW | 🔴 | 300–600 |
| Radiator | Only if test confirms hole | 🔴 if confirmed | 0–9,000 |
| Hoses | Inspect during test — low threshold | 🟠 | 0–4,000 |
| **Coolant full change → Paraflu UP/G12+** | Must Replace NOW (system open) | 🔴 | 1,100–2,000 |
| Thermostat | Verify 88–90 °C via OBD while refilling | 🟡 | 0–2,800 |
| Water pump (43k km old) | Weep-hole check only — next belt job | 🟢 | 0 |
| Fans/resistor | Test both speeds during refill | 🟡 | 0–7,000 |

**Risk narrative:** the T-Jet tolerates overheating badly (alloy head, turbo heat soak). One overheat event can cost more than this entire job card. In Egyptian summer traffic, cooling is a 🔴-class system even when nothing is "broken."
