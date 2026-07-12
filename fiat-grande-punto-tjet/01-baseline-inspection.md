# 01 — Baseline Inspection (Phase 0)

**Status: ⬜ NOT STARTED** — This is the first job. Nothing expensive gets bought before this is done.
Estimated cost: EGP 1,500–3,500 (diagnostic labor + OBD scan + compression test). Confidence: Medium.

Record results directly in the tables below (✅ OK / ⚠️ Wear / ❌ Fail + notes). Findings feed the job cards.

---

## A. Engine

- [ ] Cold start behavior (cranking speed, smoke color, idle stability)
- [ ] Compression test all 4 cylinders (target ~12–14 bar, max 10% spread) — **record values**
- [ ] Leak-down test if compression uneven
- [ ] Oil level + condition; check for mayonnaise under filler cap (head gasket)
- [ ] Oil consumption history (km per liter top-up) — T-Jet PCV membrane check
- [ ] Cam cover / PCV: whistle at idle, vacuum at oil filler cap = torn membrane
- [ ] Timing belt: age/mileage evidence (sticker, invoice) — if unknown → 🔴 replace
- [ ] Accessory belt condition, tensioner noise
- [ ] Engine mounts (rock test in gear) — 3 mounts
- [ ] Oil leaks: cam cover gasket, crank seal, oil pressure switch, sump
- [ ] Full OBD scan (MultiECUScan preferred for Fiat) — **save fault list + freeze frames**

## B. Turbo & Boost System

- [ ] Boost pressure test (log with MultiECUScan; T-Jet 120 target ~0.8–0.9 bar peak)
- [ ] Turbo shaft play (radial/axial) with intake pipe off
- [ ] Oil in intercooler pipes (light mist = normal; pooling = wear)
- [ ] Wastegate actuator rod movement (hand-pump test ~0.6–0.8 bar)
- [ ] Boost solenoid (Pierburg) clicking test / swap test
- [ ] Blow-off/diverter valve diaphragm
- [ ] All boost hoses + clamps (cracks, oil swelling)
- [ ] Intercooler fins condition, no leaks at end tanks

## C. Cooling

- [ ] Pressure-test system (1.0–1.2 bar, hold 15 min)
- [ ] Coolant color/level — red Paraflu UP? contamination?
- [ ] Radiator fins (sand erosion is common in Egypt), end-tank crust
- [ ] Thermostat: reach 88–90 °C and stay there (gauge/OBD live data)
- [ ] Both fan speeds trigger (A/C on, and at temperature)
- [ ] Expansion tank + cap (cap is a EGP-cheap failure that cooks engines)
- [ ] All hoses squeezed hot/cold; check quick-connect fittings
- [ ] Water pump weep hole, bearing noise (replaced with timing belt anyway)

## D. Transmission & Clutch

- [ ] Clutch bite point height + slip test (5th gear, 2,000 rpm, full throttle uphill)
- [ ] Judder on take-off, pedal weight, release bearing noise (pedal down, in neutral)
- [ ] Gearbox oil level + condition (often never changed — do it regardless: Tutela CS Speed / 75W-85)
- [ ] Shift quality all gears hot/cold; synchro crunch 2nd/3rd
- [ ] Driveshaft CV boots (4×), CV joint click on full-lock circles
- [ ] Gearbox mount condition

## E. Suspension & Steering

- [ ] Bounce test + visual: front strut leakage, rear shock leakage
- [ ] Front lower control arm bushes + ball joints (pry bar test)
- [ ] Anti-roll bar drop links + D-bushes (knock over bumps)
- [ ] Top mounts + strut bearings (clunk on full lock at standstill)
- [ ] Rear axle bushes (twist-beam) condition
- [ ] Wheel bearings (noise on load change lane weave, spin test)
- [ ] Track rod ends + inner tie rods (play at 3–9 o'clock)
- [ ] Dualdrive EPS: assist consistent? "City" mode works? Any steering DTCs?
- [ ] 4-wheel alignment printout (after any arm/rod replacement)

## F. Brakes

- [ ] Pad thickness F/R (record mm), disc thickness vs. min spec (record mm)
- [ ] Disc runout/scoring, handbrake travel (clicks)
- [ ] Brake fluid boiling point / moisture test (DOT 4, change if unknown age)
- [ ] Hoses: cracking, bulging under pressure
- [ ] Calipers: sticking pins, even pad wear, dust boot condition
- [ ] ABS ring/sensor DTCs, ABS light self-test

## G. Fuel & Ignition

- [ ] Spark plugs out: read color, gap, part fitted (T-Jet needs correct heat range — misfires otherwise)
- [ ] Coil pack visual (cracks) + misfire counters in live data
- [ ] Fuel pressure at rail (3.5 bar regulator typical)
- [ ] Injector balance via live data / misfire counts
- [ ] Fuel tank/pump: noise, delivery on WOT pull
- [ ] Evap/purge valve rattle + vacuum leak check

## H. Electrical, Battery, Charging, Sensors

- [ ] Battery: CCA test + voltage rest/cranking (record)
- [ ] Alternator: 13.8–14.5 V at idle with loads on; ripple test
- [ ] Starter draw, engagement noise
- [ ] Ground straps (engine-body-battery) clean/tight
- [ ] All sensors via live data: MAP, IAT, coolant temp, lambda pre/post, knock, cam/crank plausibility
- [ ] Body Computer (BSI) DTCs, proxi alignment status
- [ ] All fuses/relay boxes: corrosion, water ingress (scuttle drain blockage is common)

## I. A/C

- [ ] Vent temp at idle + 2,000 rpm (target ≤ 8–10 °C in Egyptian summer with working system)
- [ ] Compressor clutch engagement, cycling behavior
- [ ] Condenser fins (sand/stone damage), fan operation
- [ ] UV dye / electronic leak test before any regas
- [ ] Cabin filter state, evaporator smell (mold)

## J. Exterior / Underbody / Rust / Exhaust

- [ ] Full underbody lift inspection: sills, jacking points, subframe, floor pans, spare wheel well
- [ ] Rust map (photo every spot — Egypt is dry, but check A/C drain area + windshield frame)
- [ ] Exhaust: hangers, flex pipe, cat rattle, leaks (soot traces)
- [ ] Windshield scuttle drains clear (BSI water damage prevention)
- [ ] Door drains clear, seals condition

## K. Wheels & Tires

- [ ] Tire DOT date (>5 years in Egyptian heat = replace regardless of tread)
- [ ] Tread depth ×4 + spare, uneven wear pattern (→ alignment/suspension evidence)
- [ ] Rim runout/bends (common on Egyptian roads), balance
- [ ] Wheel bolts torque 86 Nm

## L. Interior / Lighting

- [ ] Every switch, window, mirror, lock, key remote
- [ ] Instrument cluster pixels, warning lamp bulb check on ignition
- [ ] All exterior lights + alignment of headlights
- [ ] Seatbelt retraction + latch, airbag light behavior

---

## Deliverables from this inspection

1. Compression values ×4
2. OBD fault list (saved)
3. Boost log
4. Brake measurements (mm)
5. Suspension defect list
6. A/C vent temperature
7. Photo set: underbody, engine bay, rust spots

→ Results update every job card in [`job-cards/`](job-cards/) and re-prioritize [`06-roadmap.md`](06-roadmap.md).
