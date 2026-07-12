# JC-01 — Engine, Turbo, Ignition & Fuel

**Engine:** 1.4 T-Jet 16v (198A4000, 120 HP) · **Mileage:** 155,000 km
**Status (rev. 2026-07-12):** diagnostic report received — see [`../09-diagnostic-findings-2026-07.md`](../09-diagnostic-findings-2026-07.md).
🔴 **CONFIRMED: air-intake hose (filter → turbo) torn — replace immediately** (dust ingestion risk to the original turbo; prime suspect for 10 L/100km consumption).
🟠 **Idle whistle** (disappears on throttle) → replace accessory belt + tensioner + idler as a set (43k km old); smoke-test for vacuum leaks.
🟠 Fuel consumption 10 L/100km → fix hose + plugs + air filter FIRST, then read fuel trims via MultiECUScan before touching O2/coils. **T-Jet is MAP-based — there is no MAF sensor.**
All OEM numbers: **verify by VIN in ePER before ordering** — Type 199 had running changes.

---

## 1. Timing Belt System — 🟡 SCHEDULED (done @112k Oct 2023 → next ~172–180k km or Oct 2027)

✅ **Done 08-Oct-2023 @ 112,000 km** (belt+tensioner kit 2,200 · acc. belt 200 · acc. tensioner 300 · water pump 800 — per ledger). Currently 43,000 km / 33 months old.
**Next due: whichever comes first — ~172–180k km or Oct 2027** (hot-climate 60–70k/4yr rule). Not an emergency; budget reserved in [`../05-budget.md`](../05-budget.md) §C. The reference info below stays for that next job.

Interference engine: belt failure = bent valves ≈ EGP 35,000–60,000 head rebuild — do not stretch the interval.

| # | Item | Detail |
|---|---|---|
| Category | Engine — timing drive |
| Component | Timing belt + tensioner + water pump (+ accessory belt while there) |
| Current symptoms | None needed — **age/history unknown at 155k km = expired by definition** |
| Root cause | Rubber ages ≤5 yrs in Egyptian heat regardless of km; interval 105k km / 5 yr (use 60–80k / 4 yr in hot climate) |
| Recommended inspection | Look for replacement sticker/invoice only — do not "inspect and reuse" an unknown belt |
| Decision | **Must Replace** (belt, tensioner, water pump, coolant, accessory belt) |
| OEM part names | Cinghia distribuzione kit + pompa acqua |
| OEM numbers (verify ePER) | Belt kit ~**71771499** / belt **55183527**; water pump **55221397** / metal-impeller updates exist — confidence Medium |
| Quantity | 1 kit + 1 pump + 4–5 L Paraflu UP + accessory belt |
| Compatible aftermarket kit numbers | Gates **KP15646XS** (kit + pump) / K015646XS (kit only); SKF **VKMC 02390**; INA 530 0621 30; Dayco KTBWP4680 — cross-check application lists for 1.4 16v turbo |
| Best OEM-line brand | Gates / INA (OE belt suppliers) ★★★★★ |
| Aftermarket ranking | Gates ★★★★★ · SKF ★★★★★ · INA ★★★★★ · Dayco ★★★★☆ · Contitech ★★★★☆ · unbranded ☆ never |

**Pricing (EGP, confidence LOW–MEDIUM — re-quote at purchase):**
Genuine kit+pump 8,000–12,000 · Gates/SKF kit+pump 4,500–7,500 · Estirad: **do not buy used rubber** · Labor 1,200–2,000 (3–4 h incl. coolant refill/bleed) · **Total ≈ 6,000–9,500 aftermarket premium brand**

**Risk if ignored:** belt snap → valve/piston contact → engine-out head rebuild EGP 35–60k, car stranded. Worst case: full engine replacement.

---

## 2. Spark Plugs & Ignition Coils — 🟠 HIGH

| # | Item | Detail |
|---|---|---|
| Category | Ignition |
| Component | 4× spark plugs, 4× pencil coils |
| Current symptoms | TBD at inspection — T-Jet classics: misfire under boost, flashing MIL, hesitation 3,000+ rpm |
| History | Plugs fitted 08-Oct-2023 @ 112,000 km (EGP 1,900) → now **43,000 km old, past the 30–40k turbo interval** |
| Root cause | Coils crack from engine-bay heat; wrong/old plugs foul under turbo load; low-octane fuel worsens knock retard |
| Recommended inspection | Pull plugs (read color/gap/type — reveals mixture/oil state too), read misfire counters live, swap-test suspect coil |
| Decision | Plugs: **Must Replace — overdue**. Coils: **Inspect First** — replace only failed ones unless ≥2 failed, then do all 4 |
| OEM part names | Candela accensione / Bobina |
| OEM numbers (verify ePER) | Plug **55212466** (NGK IKR9F8-type iridium, gap ~0.8) — do NOT fit generic heat range. Coil **55200486** (Eldor/Bosch) — confidence Medium-High |
| Quantity | 4 + 4 |
| Best brands | Plugs: **NGK ★★★★★ (OE)** · Denso iridium ★★★★☆. Coils: genuine/Eldor ★★★★★ · Bosch ★★★★★ · Magneti Marelli ★★★★☆ · cheap Chinese coils ☆ cause repeat misfires |

**Pricing (EGP, LOW confidence):** NGK iridium plug 450–750 ×4 · Genuine coil 1,800–2,800 each / Bosch 1,200–2,000 · Labor 300–500 · **Plugs-only total ≈ 2,100–3,500**

**Risk if ignored:** misfire → raw fuel melts catalytic converter (EGP 8–15k) → limp mode. Worst case: detonation damage to piston ring lands.

---

## 3. PCV / Cam Cover Membrane — 🟢 DONE · verify only

✅ **Oil separator (مبخر زيت) replaced ~Oct 2023 @ ~122,000 km (EGP 1,000 — km entry has a ❓ in the ledger).** Now ~33k km old — should be healthy. At each oil change: quick oil-cap vacuum check + listen for whistle; no purchase planned. Reference below kept for the future.

| # | Item | Detail |
|---|---|---|
| Symptoms to check | Whistle at idle, rough idle, oil use >1L/5,000 km, vacuum felt at oil cap, oil in intake pipes |
| Root cause | Rubber PCV diaphragm in cam cover hardens/tears with heat cycles |
| Inspection | Oil-cap vacuum test + listen for hiss; smoke test intake |
| Decision | If torn: replace **complete cam cover** (membrane integrated) + cam cover gasket + fresh plugs-well seals |
| OEM number (verify) | Cam cover ~**55231491** (T-Jet; supersessions exist) — confidence Medium |
| Brands | Genuine ★★★★★ · Metelli/Febi cover kits ★★★☆☆ (verify membrane quality) — genuine preferred here |
| Pricing (EGP, LOW) | Genuine cover 3,500–6,000 · Labor 400–800 · **Total ≈ 4,000–7,000** |
| Risk if ignored | Rising oil consumption → fouled plugs/coils, oil into turbo inlet, smoke, cat damage |

---

## 4. Turbocharger & Boost Control — 🟡 MEDIUM · **Inspect First — do NOT pre-buy**

> ✅ **Owner confirmed (2026-07-12): turbo and exhaust manifold are ORIGINAL at 155,000 km** — ledger figures were quotes only. An original turbo at 155k with documented oil care is normal, but it is now the highest-mileage major component on the engine. Baseline boost log + shaft-play check move up in importance: catch wear early, before it feeds debris downstream.

| # | Item | Detail |
|---|---|---|
| Components | IHI turbo, wastegate actuator, Pierburg boost solenoid, blow-off/diverter valve, boost hoses, intercooler |
| Symptoms to check | Low boost/limp (P0299), overboost cut, turbo whine change, oil smoke on overrun |
| Root causes (ranked) | 1) Boost solenoid failure (cheap) 2) Cracked/soft boost hose 3) Wastegate actuator diaphragm 4) Sticking wastegate 5) Actual turbo wear (least likely if oil changes done) |
| Inspection | Boost log via MultiECUScan → shaft play check → actuator hand-pump test → solenoid swap. **Never replace the turbo before these steps** |
| Decision | Solenoid/hoses: cheap consumables, replace on suspicion. Actuator: Confirmed Failure only. Turbo: Confirmed Failure only |
| OEM numbers (verify) | Turbo assy ~**55212917** (IHI RHF3-P family); solenoid Pierburg **7.02256.04** cross; actuator often only with turbo from Fiat — aftermarket actuators exist (Melett) |
| Brands | Turbo: genuine IHI ★★★★★ · Melett rebuild kit ★★★★☆ · no-name Chinese turbo ☆. Solenoid: Pierburg ★★★★★ · Bosch ★★★★☆ |
| Pricing (EGP, LOW) | Solenoid 1,500–3,000 · Hose each 800–2,500 · Genuine/IHI turbo 25,000–45,000 · Estirad used turbo 8,000–15,000 (⚠️ only with shaft-play check + warranty) · Turbo R&R labor 2,500–4,500 |
| Risk if ignored | Limp mode (safe but slow); a truly failing turbo can dump oil → runaway risk (rare) or debris into intercooler → new engine killer. Overboost from stuck wastegate → head gasket/piston damage |

---

## 5. Engine Oil Service — 🟠 HIGH · **Must Do Now** (baseline)

| Item | Detail |
|---|---|
| Spec | 5W-40 ACEA C3, Fiat 9.55535-S2 — turbo engines in hot climate: change every **7,500–10,000 km max** (not 15k) |
| Filter OEM (verify) | Oil filter **55223416** (UFI 23.475.00 = OE) · Air filter **55192012** · verify in ePER |
| Brands | Oil: Selenia ★★★★★ (OE) · Motul/Mobil/Liqui Moly 5W-40 ★★★★★. Filters: UFI ★★★★★ (OE) · Mann ★★★★★ · Mahle ★★★★★ · Fram ★★☆☆☆ |
| Pricing (EGP, MEDIUM) | 4 L quality 5W-40: 1,800–2,800 · Oil filter 250–450 · Air filter 350–600 · Labor 150–300 · **Total ≈ 2,600–4,100** |
| Note | First service: also engine flush is NOT recommended blindly on unknown history — just shorten first two intervals to 5,000 km |

---

## 6. Engine Mounts — 🟢 mostly done · **Inspect remaining**

✅ 2 mounts replaced @ 125,000 km with clutch job (EGP 1,700); one more mount entry @ 103k (EGP 120 ❓). Identify which of the 3 (RH hydraulic, LH gearbox, rear torque rod) was NOT replaced and rock-test it — rear torque rod fails first.
OEM numbers via ePER by VIN. Brands: Corteco ★★★★★ · Febi ★★★★☆ · Magneti Marelli ★★★★☆ · unbranded ☆.
Pricing (LOW): rear torque mount 900–1,800; side mounts 1,500–3,000 each; labor 400–900.
Risk if ignored: drivetrain shunt loads crack exhaust flex pipe and stress driveshafts.

---

## 7. Fuel System — 🟢 healthy · **Inspect only**

- ✅ Fuel pump replaced @ 115,000 km (EGP 2,100) — 40k km old, fine. Test rail pressure only if symptoms appear. Brands: Bosch ★★★★★ · Magneti Marelli ★★★★★ (often OE) · VDO ★★★★☆.
- Injectors: clean/flow-test first (EGP 800–1,500 for 4) — almost never need replacement on T-Jet.
- Purge valve: cheap, rattles/vacuum leak — Bosch ★★★★★.
- ⚠️ Egypt fuel note: use 95 RON. Persistent 92 use on a turbo = knock retard, heat, long-term piston damage.

---

## Job Card Summary (rev. 2026-07-12)

| Task | Decision | Priority | Est. total (EGP) |
|---|---|---|---|
| **Air-intake hose (torn — Confirmed)** | Must Replace NOW | 🔴 | 1,100–3,100 incl. clamps/labor |
| **Accessory belt + tensioner + idler set** (idle whistle) | Must Replace | 🟠 | 1,500–3,100 |
| Oil + filters service (last @149k, 5W-40) | Due ~157k — do at catch-up visit | 🟠 | 1,600–2,400 |
| Spark plugs (43k km old) | Must Replace — overdue | 🟠 | 2,200–3,500 |
| Throttle body + MAP + injector clean | Recommended with service | 🟡 | 500–1,200 |
| Coils | Inspect First | 🟡 | 0–8,000 |
| Timing belt + WP + coolant | ✅ done @112k → next ~172–180k / Oct 2027 | 🟡 scheduled | 5,500–8,000 reserved |
| PCV/oil separator | ✅ done ~122k — verify only | 🟢 | 0 |
| Fuel pump | ✅ done @115k | 🟢 | 0 |
| Engine mounts | ✅ 2 done @125k — check 3rd | 🟢 | 0–1,800 |
| Boost system small parts | Inspect First — **turbo is original @155k: boost log + shaft-play check mandatory at baseline** | 🟡 | 0–5,000 |

All prices EGP, confidence Low–Medium, re-quote at purchase.
