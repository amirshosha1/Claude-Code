# 09 — Diagnostic Findings · نتائج الفحص (2026-07, @ ~155,000 km)

Owner's full symptom report, converted to official baseline findings. Classifications: **Confirmed / Likely / Possible / Inspection Needed**.
هذا الملف يحل محل قسم كبير من `01-baseline-inspection.md` — البنود المتبقية هناك تُفحص في زيارة الورشة.

---

## 1. Cooling System · دورة التبريد — 🔴 CRITICAL

| Finding | Class | Action |
|---|---|---|
| **Coolant leak from expansion tank** تسريب من قربة المياه | **Confirmed** | Replace expansion tank + cap (never reuse old cap) |
| Suspected radiator hole اشتباه خرم بالردياتير | Possible | **Pressure test decides** (1.0–1.2 bar, 15 min) — do NOT buy a radiator before the test with the new tank fitted; a leaking tank can mimic a radiator leak |
| All hoses فحص الخراطيم | Inspection Needed | Squeeze test hot/cold during pressure test |
| Full coolant change | Confirmed need | With repair — and since system is open: **switch to Paraflu UP/G12+ NOW** (the Mannol flush moves up from the belt job) |
| Cap / thermostat / water pump | Inspection Needed | Cap: replace with tank. Thermostat: verify 88–90 °C via OBD. Pump: 43k km old, check weep hole only |

**⚠️ Driving rule until fixed:** watch the temp gauge like a hawk, keep cabin heater usable as emergency cooler, top up with distilled water only, no highway pulls. An overheat on this engine = head gasket EGP 15–25k+.
**Parts:** tank ~600–1,200 · cap 150–400 · hoses 400–1,500 ea · radiator (only if confirmed) Valeo/Behr/Denso 4,500–8,000 + labor 500–1,000.

## 2. Intake & Turbo · السحب والتيربو — 🔴 CRITICAL

| Finding | Class | Action |
|---|---|---|
| **Air intake hose (filter → turbo) torn** خرطوم السحب مقطوع | **Confirmed** | **Replace immediately.** This hose feeds the ORIGINAL 155k-km turbo — a tear here lets **unfiltered dusty Egyptian air straight into the compressor wheel = turbo killer**, and unmetered air wrecks fueling |
| All boost hoses + clamps | Inspection Needed | With hose replacement — smoke test ideally |
| Boost leak | Possible | Boost log after hose fix |
| PCV system | Inspection Needed | Separator was replaced @~122k — verify no whistle at oil cap |

**Parts:** intake hose genuine ~800–2,500 · clamps cheap · smoke test 300–600.
**This single torn hose is prime suspect #1 for both the fuel consumption AND possibly the idle whistle.**

## 3. Engine Service Items · الصيانة الدورية — 🟠

Confirmed to change: **oil + oil filter + air filter + plugs** (already in plan — air filter now doubly critical because of the torn hose: inspect the airbox for dust trails).
Inspection: fuel filter (T-Jet: in-tank strainer, service only on pressure evidence) · throttle body clean · **MAP sensor clean (T-Jet has NO MAF — it's MAP-based; ignore MAF)** · injector clean (ledger price 250) · coils check via misfire counters.

## 4. Fuel Consumption · استهلاك البنزين — 10 L/100km (target 7–7.5)

**Diagnosis order (cheapest-first, most-likely-first):**
1. **Fix torn intake hose** (Confirmed) — unmetered/dirty air = rich running. Re-measure consumption after.
2. **Plugs** (overdue 43k km) + air filter.
3. Boost leak check post-fix.
4. Read **fuel trims + lambda live data** via MultiECUScan — this pinpoints O2 sensor vs. leak vs. thermostat in minutes, no parts-cannon.
5. Thermostat stuck-open check (slow warm-up on gauge).
6. Only then consider: O2 sensor (155k km is plausible age — but test first, 1,800–3,500), coils.

Also: 95 RON discipline + tire pressures. Expect the hose+plugs alone to recover most of the gap.

## 5. Engine Noise · صفير في السلانسيه (disappears with throttle)

| Suspect (ranked) | Test |
|---|---|
| 1. Accessory belt tensioner/idler bearing بلي السير (43k km on it) | Stethoscope on tensioner; remove belt 30 sec → noise gone = pulley/bearing |
| 2. Torn intake hose whistling | Fixes itself with §2 |
| 3. Vacuum leak hiss | Smoke test |
| 4. Alternator/AC-clutch bearing | Stethoscope |

**Decision: replace accessory belt + tensioner + idler as a set** (سير + شداد + بلي) — cheap insurance at 43k km and it's on the confirmed change list anyway. Gates/SKF/INA kit ~1,200–2,500 + labor 300–600.

## 6. Clutch & CV Joints · الدبرياج والكبالن — ⚠️ ONE symptom, read carefully

**Symptom:** strong noise under load (2nd/3rd gear, on throttle), **from the RIGHT side**, disappears when out of gear / off throttle. No slipping reported.

**Ranked diagnosis:**
1. **Inner CV joint (right) — MOST LIKELY.** Load-dependent, side-specific, gear-independent-but-torque-dependent = classic inner tripod. Right shaft is the long one on this platform and fails first.
2. **The 3rd engine mount** (only 2 of 3 were replaced @125k — likely the rear torque rod): under load the engine rocks and knocks, stops off-throttle.
3. Driveshaft/intermediate bearing.
4. **Clutch — LEAST likely: it's 30k km old (LuK @125k + new flywheel @140k)** and there's no slip/judder/pedal symptom.

**🚫 DO NOT buy a clutch kit.** Tests first (30 min at workshop): full-lock circle test both directions · 4th-gear low-rpm load test · pry-bar on mounts · boot inspection ×4. Clutch master cylinder: shares reservoir with brakes — flushing brake fluid (already planned) services both; inspect for leaks at the pedal.
**If confirmed:** inner CV 2,500 (owner ledger) or complete GKN shaft 4,000–7,000 + labor 500–900 · rear mount 900–1,800.

## 7. Suspension · التعليق — 🟠 Confirmed symptomatic

**Symptom: hard thudding on bumps (هبدة قوية).** Front overhaul is 53k km old; rear shocks likely original (155k!).
Inspection list confirmed by owner: front+rear shocks ✅ flagged, plus mounts, bump stops, arms, bushes, ARB + links, tie rods, ball joints.
**Prediction:** rear shocks + front strut mounts/bump stops are the thud source. Replace in pairs, KYB/Sachs + SNR/SKF mounts. Front pair ≈ 8,500–13,500 · rear pair ≈ 2,000–4,500 · then alignment.

## 8. Brakes · الفرامل — 🟠 (symptoms despite new front discs!)

**Symptoms: weak braking + pulling/judder (حدف) + friction noise + whine.**
Front discs/pads are only 7 months old (Dec 2025) — so suspects are:

| Suspect | Test |
|---|---|
| Rear discs/pads worn (rear discs already owner-confirmed worn) | Measure — already on buy list |
| Old fluid + air in circuit (last change @125k) | Full flush + bleed (planned) — shared reservoir also feeds clutch master |
| Sticking caliper sliders / seized piston (pulling!) | Strip + service both front calipers |
| Cheap/glazed front pads or disc runout (judder) | Identify brand stamping; dial-gauge runout; deglaze or re-do under warranty if the Dec-25 workshop fitted low-grade parts |
| Servo/master weak | Engine-off pedal-pump test + hold test |

**Order of operations:** rear brakes + fluid flush + caliper service FIRST → re-test → only then judge master/servo. Don't buy a master cylinder on day one.

## 9. Interior & Audio · الإنتيريور والصوت — 🟢 Phase 2 (owner scope confirmed)

Leather covers front seats + rear bench · full interior deep clean incl. headliner + floor · **9" Android head unit + 4 door speakers + repair the built-in subwoofer** (Grande Punto HiFi option — check amp/sub in boot floor first; often it's the amp connector, not the sub).

## 10. Exterior & Lighting · الإكستيريور — 🟢 Phase 3 (owner scope confirmed)

Compound + polish + wax full detail · headlight polish + UV seal · chrome clean · **cowl/scuttle panel (فبرة المساحات) replacement — Confirmed broken** (ledger had مصفحة قديمة quotes; genuine or good used, ~450–1,500) — this also protects the BSI from water, so it's functional not just cosmetic · **LED upgrade low/high (+fogs)**: quality only (Philips Ultinon Pro / Osram LEDriving with correct beam pattern) — cheap LED kits scatter light and blind oncoming traffic; verify pattern against a wall.

## 11. Age-Based Inspection List (16 years) — merged into workshop checklist

Engine mounts (3rd one!) · gearbox mounts · exhaust hangers · catalytic converter rattle · O2 sensor (via fuel trims) · EVAP purge valve · radiator mounts · A/C compressor + serpentine (single belt drives alternator+AC) · all rubber bushes.
**Correction ✏️:** the Grande Punto has **Dualdrive ELECTRIC power steering — there is no hydraulic pump, no PS fluid, no PS hoses, no PS belt.** Those items are removed from the list; the EPS is checked via OBD fault read only (and the rack is new @140k anyway).

---

## Owner's 3-Phase Plan → adopted into [`06-roadmap.md`](06-roadmap.md)

| Owner phase | Scope | Maps to |
|---|---|---|
| **1 — سلامة واعتمادية** | Cooling, intake, service, brakes, suspension, CV, clutch-diagnosis, fuel consumption | Roadmap Phases 0–3 (merged) |
| **2 — راحة** | Interior, screen, speakers, subwoofer | Phase 4–5 |
| **3 — الشكل** | Polish, headlights, LED, detail, cowl panel | Phase 6–7 |
