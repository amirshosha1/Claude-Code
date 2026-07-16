# JC-06 — Electrical, Charging, Lighting & Air Conditioning

**Status:** Awaiting baseline electrical test + A/C performance test.

---

## 1. Battery — 🟠 · **Inspect First (test decides)**

CCA test at baseline. Egyptian heat kills batteries in 2–3 years — if >2 yrs old or CCA <70% rated: **Must Replace**.
Spec: ~60 Ah / 540+ CCA (confirm tray size L2). Brands: Varta ★★★★★ · Bosch ★★★★★ · ACDelco ★★★★☆ · Chloride Egypt ★★★☆☆ (acceptable budget).
Pricing (MEDIUM): 3,500–5,500. Risk: weak battery causes phantom BSI/EPS faults on this platform — replace before chasing electrical ghosts.

## 2. Alternator & Starter — 🟢 alternator done / 🟡 starter inspect

✅ **Alternator replaced @ 128,000 km (EGP 3,300 per ledger)** — 27k km old, verify charging voltage at baseline anyway. Starter: original — test draw/engagement, replace only on Confirmed failure (rebuild 1,500–3,000 · Estirad 2,000–4,500).

## 3. Grounds, Scuttle Drains & Wiring — 🔴 **ROOT-CAUSE SUSPECT (upgraded 2026-07)**

Clean/retighten engine-body-battery grounds; clear windshield scuttle drains. **On this car it's no longer preventive** — with the **cowl panel confirmed broken** and a live **multi-module electrical fault** (airbag no-comms + ESP unavailable), water ingress onto the BSI/connectors under the scuttle is the prime hypothesis. See [`../09-diagnostic-findings-2026-07.md`](../09-diagnostic-findings-2026-07.md) §12. Labor 300–600 + connector cleaning/drying.

## 3b. Multi-Module Fault — Airbag no-comms + ESP/Hill-Holder unavailable — 🔴 SAFETY

Symptoms: airbag light ON, scan tool can't read airbag ECU, ESP + Hill Holder unavailable, "fuel cut off". **Likely ONE shared cause** (power/ground/CAN/water), not five faults — Hill Holder is a function of ESP; airbag "no-comms" = lost power/ground/CAN, not a stored code.
**Diagnose (do NOT buy modules): 1)** full MultiECUScan noting which nodes answer **2)** battery + grounds **3)** airbag fuse + yellow connectors (under seats + module) **4)** water under scuttle (broken cowl!) **5)** only then suspect airbag/BSI module (needs Fiat-capable proxi/coding).
Cost: mostly diagnosis labor; likely fixes are fuse/connector/ground/cowl — cheap. Module replacement is last resort.

## 4. Body Computer (BSI) & Proxi — 🟡

Scan only; repair on evidence. Note for any module replacement: needs **proxi alignment** with MultiECUScan/Examiner — use a workshop that knows Fiat.

## 5. Lighting — 🟡/🟢

- Headlight restoration (polish + UV coat) 400–900 — do at cosmetic phase, but **aim/alignment now** (safety).
- Bulbs: Osram Night Breaker / Philips ★★★★★ (pairs only). H4/H1/H7 per trim — verify.
- Check all exterior lamps, license plate, fog lamps, switch pack.

## 6. A/C System — 🟠 HIGH in Egypt · **Diagnose before regas**

| Item | Detail |
|---|---|
| Ledger clue | Owner's price list includes "كباس كومبرسور" A/C compressor clutch/piston (EGP 1,000) — suggests a suspected compressor-clutch issue. Diagnose engagement first |
| Symptoms to check | Vent temp >10–12 °C, compressor cycling too fast, no engagement, smell |
| Root causes ranked | 1) Low charge from slow leak (condenser stone/sand damage most common) 2) Condenser fan/resistor 3) Blocked cabin filter/evaporator 4) Compressor wear (last) |
| Inspection | UV dye + electronic sniffer FIRST — never repeat-regas a leaking system |
| Decision | Condenser leak Confirmed → replace condenser + receiver drier + full vacuum/regas R134a with correct PAG oil. Compressor: Confirmed only |
| Brands | Compressor: **Denso ★★★★★ (OE)** · Valeo ★★★★★ · Chinese copy ☆ (dies + sends debris = kills whole system). Condenser: Valeo/Denso ★★★★★ · Nissens ★★★★☆ |
| Pricing (EGP, LOW) | Leak test 300–600 · Regas 800–1,500 · Condenser 3,500–6,500 + drier 600–1,200 + labor 800–1,500 · Compressor Denso 8,000–15,000 / Estirad 3,000–6,000 (⚠️ gamble) · Cabin filter 250–500 |
| Risk if ignored | In Egypt this is a comfort-critical + resale-critical system. Running compressor low on oil/charge destroys it → +EGP 10k |

## 7. Sensors (engine bay) — 🟡 · evidence only

MAP/IAT, lambda ×2, knock, cam/crank: replace ONLY on live-data/DTC evidence. Bosch/NGK-NTK/Magneti Marelli ★★★★★. Lambda 1,800–3,500 each (LOW confidence).

---

## Job Card Summary

| Task | Decision | Priority | Est. total (EGP) |
|---|---|---|---|
| Battery test → likely replace | Inspect First | 🟠 | 0–5,500 |
| Grounds + scuttle drains | Must Do | 🟠 | 300–600 |
| A/C leak test + fix path | Inspect First | 🟠 | 1,100–10,000+ |
| Cabin filter | Must Replace | 🟠 | 250–500 |
| Alternator/starter | Confirmed only | 🟡 | 0–12,000 |
| Headlight aim | Must Do | 🟠 | 100–300 |
| Sensors | Evidence only | 🟡 | 0–7,000 |
