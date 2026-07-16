/* ============================================================
   App.seed — initial data (multi-vehicle schema).
   One vehicle now; the shape supports many. All values are the
   real project data gathered in the dossier.
   Every collection is an array of plain objects -> trivially
   portable to SQLite/Supabase/Postgres tables later.
   ============================================================ */
window.App = window.App || {};
App.seed = {
  meta: { schema: 2, app: 'Grande Punto Automotive OS', savedAt: null },
  activeVehicleId: 'gp-tjet-2010',
  vehicles: [{
    id: 'gp-tjet-2010',
    vin: '', // owner to fill
    make: 'Fiat', model: 'Grande Punto T-Jet', year: 2010, type: '199',
    engine: '1.4 16v Turbo (198A4000, 120 hp)', transmission: 'Manual',
    fuel: '95 RON', oilSpec: '5W-40 ACEA C3 / 9.55535-S2',
    wheels: '4×98 · CB 58.1 · ET35–43 · 195/55 R16',
    mileage: 155000, market: 'Egypt',
    scores: { health: 55, safety: 42, reliability: 68 },
    phase: 'Phase 1 — Safety',
    data: {
      /* ---- PARTS DATABASE ---- */
      parts: [
        { id: 'p-hose', name: 'Air intake hose (filter→turbo)', ar: 'خرطوم السحب', oem: '51822558', fiat: '51822558', alt: '5180472 (adjacent)', brand: 'Genuine', tier: 5, category: 'Turbo', priceNewEg: null, priceUsedEg: null, euRef: '€25–60', supplier: 'ELKHLANY', laborEg: null, warranty: '', status: 'to-order', priority: 'critical', vinOk: true, compat: 'GP T-Jet · Abarth GP', verdict: 'buy', notes: 'Confirmed torn; number read off the part. Buy genuine (shaped).' },
        { id: 'p-tank', name: 'Expansion tank + cap', ar: 'قربة المياه + غطاء', oem: '51718005', fiat: '51718005', alt: 'cap 55700508', brand: 'Behr/Genuine', tier: 5, category: 'Cooling', priceNewEg: null, priceUsedEg: null, euRef: '€20–47', supplier: '', laborEg: null, warranty: '', status: 'to-order', priority: 'critical', vinOk: false, compat: 'GP 199 · Punto Evo', verdict: 'buy', notes: 'Leak confirmed.' },
        { id: 'p-coolant', name: 'Coolant Paraflu UP (G12+)', ar: 'مية تبريد', oem: '', fiat: 'Paraflu UP', alt: 'any G12+/OAT', brand: 'Petronas', tier: 5, category: 'Cooling', euRef: '€8–12/L', status: 'to-order', priority: 'critical', vinOk: true, compat: '50/50 demin.', verdict: 'buy', qty: 4, notes: 'Switch from Mannol now (system open).' },
        { id: 'p-belt', name: 'Accessory belt', ar: 'سير المجموعة', oem: '', fiat: 'via ePER', alt: 'Gates/Dayco/Contitech', brand: 'Gates', tier: 5, category: 'Engine', euRef: '€10–20', priceNewEg: 650, supplier: 'ELKHLANY', status: 'to-order', priority: 'high', vinOk: false, compat: 'Fiat 1.4 w/ AC', verdict: 'buy', notes: 'Dealer quote 650. Idle whistle.' },
        { id: 'p-tens', name: 'Belt tensioner + idler', ar: 'شداد + بلي', oem: '55190813', fiat: '55190813', alt: 'INA/SKF/Gates', brand: 'INA', tier: 5, category: 'Engine', euRef: '€45–90', priceNewEg: 450, supplier: 'ELKHLANY', status: 'to-order', priority: 'high', vinOk: false, compat: 'Fiat 1.4 16v', verdict: 'buy', notes: 'Dealer idler 450. Buy as set with belt.' },
        { id: 'p-plugs', name: 'Spark plugs iridium ×4', ar: 'بوجيهات', oem: '55212466', fiat: '55212466', alt: 'NGK IKR9F8', brand: 'NGK', tier: 5, category: 'Engine', euRef: '€10–16 ea', status: 'to-order', priority: 'high', vinOk: true, compat: 'all 1.4 T-Jet', verdict: 'buy', qty: 4, notes: 'Overdue at 43k km.' },
        { id: 'p-ofilt', name: 'Oil filter', ar: 'فلتر زيت', oem: '55223416', fiat: '55223416', alt: 'UFI/Mann/Mahle', brand: 'UFI', tier: 5, category: 'Engine', euRef: '€5–10', status: 'to-order', priority: 'high', vinOk: true, compat: '1.4 Fire/T-Jet', verdict: 'buy' },
        { id: 'p-afilt', name: 'Air filter', ar: 'فلتر هواء', oem: '55192012', fiat: '55192012', alt: 'Mann/Mahle', brand: 'Mann', tier: 5, category: 'Engine', euRef: '€10–20', status: 'to-order', priority: 'high', vinOk: false, compat: 'GP T-Jet (turbo airbox)', verdict: 'buy' },
        { id: 'p-cfilt', name: 'Cabin filter', ar: 'فلتر تكييف', oem: '77363370', fiat: '77363370', alt: 'Mann/Bosch', brand: 'Mann', tier: 4, category: 'Interior', euRef: '€8–15', status: 'to-order', priority: 'medium', vinOk: false, compat: 'GP · Evo', verdict: 'buy' },
        { id: 'p-oil', name: 'Engine oil 5W-40 C3 (4L)', ar: 'زيت موتور', oem: '', fiat: '9.55535-S2', alt: 'Selenia/Motul/Mobil', brand: 'Selenia', tier: 5, category: 'Engine', euRef: '€30–45', status: 'to-order', priority: 'high', vinOk: true, compat: 'all T-Jet', verdict: 'buy' },
        { id: 'p-bfluid', name: 'Brake fluid DOT4 (1L)', ar: 'زيت فرامل', oem: '', fiat: 'DOT4', alt: 'ATE/Bosch/TRW', brand: 'ATE', tier: 5, category: 'Brakes', euRef: '€8–15', status: 'to-order', priority: 'high', vinOk: true, compat: 'serves clutch master too', verdict: 'buy' },
        { id: 'p-rdiscs', name: 'Rear discs pair', ar: 'دسكات ورا', oem: '51971354', fiat: '51971354', alt: 'Brembo/TRW/ATE', brand: 'Brembo', tier: 5, category: 'Brakes', euRef: '€25–45 ea', status: 'to-order', priority: 'high', vinOk: false, compat: 'GP/Evo/MiTo/Corsa D', verdict: 'buy', qty: 2, notes: 'Owner-confirmed worn. MEASURE size first.' },
        { id: 'p-rpads', name: 'Rear pads set', ar: 'تيل ورا', oem: '', fiat: 'via ePER', alt: 'TRW/Ferodo/Brembo', brand: 'TRW', tier: 5, category: 'Brakes', euRef: '€20–40', status: 'to-order', priority: 'high', vinOk: false, compat: 'as rear discs', verdict: 'buy' },
        { id: 'p-battery', name: 'Battery ~60Ah 540CCA', ar: 'بطارية', oem: 'L2', fiat: '', alt: 'Varta/Bosch', brand: 'Varta', tier: 5, category: 'Electrical', euRef: '€70–110', status: 'to-order', priority: 'critical', vinOk: true, compat: 'check tray', verdict: 'buy', notes: 'Weak: 12.0V rest / 10.3V cranking — drops CAN nodes.' },
        { id: 'p-wipers', name: 'Wiper blades pair', ar: 'مساحات', oem: '', fiat: 'by length', alt: 'Bosch Aerotwin', brand: 'Bosch', tier: 4, category: 'Exterior', euRef: '€15–25', status: 'to-order', priority: 'medium', vinOk: true, compat: 'by length', verdict: 'buy' },
        { id: 'p-cowl', name: 'Cowl / scuttle panel', ar: 'فبرة المساحات', oem: '', fiat: 'via ePER', alt: 'genuine/used', brand: 'Genuine', tier: 3, category: 'Body', euRef: '€15–40', status: 'to-order', priority: 'medium', vinOk: false, compat: 'GP · Evo', verdict: 'buy', notes: 'Confirmed broken; protects BSI from water.' },
        { id: 'p-master', name: 'Brake master cylinder', ar: 'ماستر فرامل', oem: '', fiat: '', alt: 'LAST suspect', brand: '', tier: 0, category: 'Brakes', euRef: '—', priceNewEg: 3500, supplier: 'ELKHLANY', status: 'hold', priority: 'low', vinOk: false, compat: '—', verdict: 'stop', notes: 'Dealer 3500 — DO NOT BUY. Do rear brakes+fluid+calipers first.' },
        { id: 'p-radiator', name: 'Radiator (TURBO version)', ar: 'ردياتير', oem: '51780659', fiat: '51780659', alt: 'Valeo/Denso/Nissens', brand: 'Valeo', tier: 5, category: 'Cooling', euRef: '€70–150', status: 'hold', priority: 'medium', vinOk: false, compat: 'GP 1.4 Turbo (NOT NA)', verdict: 'hold', notes: 'Only after pressure test.' },
        { id: 'p-cv', name: 'Driveshaft RH / inner CV', ar: 'عمود إحليل يمين', oem: 'SGR.21220', fiat: 'via ePER', alt: 'GKN/Löbro/SKF', brand: 'GKN', tier: 5, category: 'Transmission', euRef: 'joint €40–90 / shaft €100–180', status: 'hold', priority: 'medium', vinOk: false, compat: 'by gearbox code', verdict: 'hold', notes: 'After load-noise tests.' },
        { id: 'p-mount', name: 'Rear engine mount', ar: 'قاعدة موتور خلفية', oem: '51782714', fiat: '51782714', alt: 'Corteco/Febi', brand: 'Corteco', tier: 4, category: 'Engine', euRef: '€25–50', status: 'hold', priority: 'medium', vinOk: false, compat: 'GP 1.4 · Evo', verdict: 'hold' },
        { id: 'p-rshock', name: 'Rear shocks pair', ar: 'مساعدين ورا', oem: '', fiat: 'via ePER', alt: 'KYB/Sachs/Monroe', brand: 'KYB', tier: 5, category: 'Suspension', euRef: '€35–60 ea', priceNewEg: 3800, supplier: 'ELKHLANY', status: 'hold', priority: 'medium', vinOk: false, compat: 'GP/Evo/Corsa D', verdict: 'hold', qty: 2, notes: 'Dealer 3800 "original" — confirm brand.' },
        { id: 'p-fshock', name: 'Front struts pair', ar: 'مساعدين قدام', oem: '', fiat: 'via ePER', alt: 'KYB/Sachs (avoid Chinese)', brand: 'KYB', tier: 5, category: 'Suspension', euRef: '€60–100 ea', priceNewEg: 4800, supplier: 'ELKHLANY', status: 'hold', priority: 'medium', vinOk: false, compat: 'GP/Evo/Corsa D', verdict: 'hold', qty: 2, notes: 'Dealer 4800 Turkish / 3800 Chinese — inspect first; avoid Chinese.' },
        { id: 'p-o2', name: 'O2 sensor front', ar: 'حساس أكسجين', oem: '', fiat: 'via ePER', alt: 'Bosch/NGK-NTK', brand: 'Bosch', tier: 5, category: 'Engine', euRef: '€50–100', status: 'hold', priority: 'low', vinOk: false, compat: '1.4 T-Jet pre-cat', verdict: 'hold', notes: 'Only if fuel trims confirm.' },
        { id: 'p-acclutch', name: 'A/C compressor clutch', ar: 'كباس الكومبروسور', oem: '', fiat: 'Denso', alt: 'Denso kit', brand: 'Denso', tier: 5, category: 'Electrical', euRef: '€40–80', status: 'hold', priority: 'low', vinOk: false, compat: 'match comp. label', verdict: 'hold' },
        { id: 'p-headunit', name: '9" Android head unit', ar: 'شاشة أندرويد', oem: '', fiat: '+canbus adapter', alt: 'Pioneer/Kenwood/Sony', brand: '', tier: 4, category: 'Accessories', euRef: '€120–300', status: 'later', priority: 'cosmetic', vinOk: true, compat: 'GP 2-DIN + 199 canbus', verdict: 'later' },
        { id: 'p-speakers', name: 'Door speakers ×4 (165mm)', ar: 'سماعات', oem: '', fiat: '6.5"', alt: 'Focal/JBL/Pioneer', brand: '', tier: 4, category: 'Accessories', euRef: '€40–120/pair', status: 'later', priority: 'cosmetic', vinOk: true, compat: 'GP doors', verdict: 'later', qty: 2 },
        { id: 'p-ledlow', name: 'LED low beam (pair)', ar: 'LED واطي', oem: '', fiat: 'check base', alt: 'Philips Ultinon/Osram', brand: 'Philips', tier: 5, category: 'Exterior', euRef: '€60–130', status: 'later', priority: 'cosmetic', vinOk: false, compat: 'match reflector', verdict: 'later', notes: 'Verify beam pattern on a wall.' },
        { id: 'p-leather', name: 'Leather seat covers (F+R)', ar: 'كسوة جلد', oem: '', fiat: 'upholstery', alt: 'local trimmer', brand: '', tier: 4, category: 'Interior', euRef: 'workshop', status: 'later', priority: 'cosmetic', vinOk: true, compat: 'GP seats', verdict: 'later' }
      ],
      /* installed history parts (for reference) */
      installed: [
        { name: 'Front suspension overhaul', km: 102000, date: '2021-09-04', paid: 4195 },
        { name: 'Timing belt + water pump + plugs', km: 112000, date: '2023-10-08', paid: 5400 },
        { name: 'Fuel pump + PCV oil separator', km: 118000, date: '2023-10-30', paid: 3100 },
        { name: 'Clutch (LuK) + 2 mounts + fluids', km: 125000, date: '2024-01-15', paid: 16200 },
        { name: 'Alternator', km: 128000, date: '2024-03-01', paid: 3300 },
        { name: 'Flywheel + front brakes + steering rack', km: 140000, date: '2025-12-10', paid: 15800 }
      ],
      /* ---- DIAGNOSTICS (real scan codes) ---- */
      faults: [
        { code: 'U0422', system: 'Engine ECU', desc: 'Fire Prevention (crash fuel-cut) data from BCM', symptom: '"fuel cut off" message', root: 'Latched crash flag from the ~144k impact', prob: 95, cost: 'clear + wiring', solved: false, priority: 'critical', state: 'present→intermittent' },
        { code: 'U1711', system: 'Engine ECU', desc: 'CAN network (NCM–NCR)', symptom: 'stalling / assist drop', root: 'CAN bus disturbance', prob: 90, cost: 'wiring', solved: false, priority: 'critical', state: 'stored' },
        { code: 'U0001', system: 'Engine ECU', desc: 'C-CAN line error', symptom: 'intermittent multi-module', root: 'Damaged CAN wiring (impact)', prob: 90, cost: 'wiring', solved: false, priority: 'critical', state: 'intermittent' },
        { code: 'C1221', system: 'ABS/ESP', desc: 'Engine Control (NCM) signal not valid', symptom: 'ESP + Hill Holder unavailable', root: 'Loses engine node over CAN', prob: 90, cost: 'wiring', solved: false, priority: 'critical', state: 'intermittent→present' },
        { code: 'U1726', system: 'Body Computer', desc: 'Airbag Node (NAB) — no node on B-CAN', symptom: 'airbag light (intermittent)', root: 'Airbag node drops off B-CAN (connection)', prob: 88, cost: 'connector/wiring', solved: false, priority: 'critical', state: 'intermittent (ctr 14→32)' },
        { code: 'B1023', system: 'Body Computer', desc: 'Number-plate lights — short to ground/overload', symptom: 'lights fault', root: 'Rear harness damage in the impact zone', prob: 92, cost: 'rear harness repair', solved: false, priority: 'critical', state: 'PRESENT' },
        { code: 'B1045', system: 'Body Computer', desc: 'Lights control — intermittent', symptom: 'light flicker', root: 'CAN/harness + weak battery', prob: 70, cost: 'wiring', solved: false, priority: 'high', state: 'intermittent' }
      ],
      scans: [
        { date: '2026-07-11', tool: 'AlfaOBD', by: 'Owner', note: 'Full multi-module scan — 7+ CAN codes; battery 12.0V, dips 10.3V cranking' },
        { date: '2025-12', tool: 'MultiECUScan', by: 'Eng. Louai', note: 'Proxi alignment — cleared fault, recurred later (milder)' },
        { date: '2024-06-27', tool: 'MultiECUScan', by: 'Owner', note: 'car_report.pdf — scan (before cleaning)' },
        { date: '2024-06-27', tool: 'MultiECUScan', by: 'Owner', note: 'car_report_after_cleaning.pdf — scan (after cleaning)' }
      ],
      /* ---- SERVICE BOOK ---- */
      service: [
        { date: '2021-09-04', km: 102000, workshop: '(ledger)', mechanic: '', work: 'Front suspension overhaul + alignment', parts: 'shocks, mounts, links, arms, inner rod', labor: null, paid: 4195, invoice: '', warranty: '' },
        { date: '2023-10-08', km: 112000, workshop: '(ledger)', mechanic: '', work: 'Timing belt kit + water pump + spark plugs; coolant (Mannol)', parts: 'belt, tensioner, pump, plugs', labor: null, paid: 5400, invoice: '', warranty: '' },
        { date: '2024-01-15', km: 125000, workshop: '(ledger)', mechanic: '', work: 'Clutch (LuK) + release brg + 2 engine mounts + gearbox oil + brake fluid', parts: 'clutch kit, mounts', labor: null, paid: 16200, invoice: '', warranty: '' },
        { date: '2024-03-01', km: 128000, workshop: '(ledger)', mechanic: '', work: 'Alternator', parts: 'alternator', labor: null, paid: 3300, invoice: '', warranty: '' },
        { date: '2025-11-10', km: 135000, workshop: '(ledger)', mechanic: '', work: 'Rear brake pads', parts: 'rear pads', labor: null, paid: 800, invoice: '', warranty: '' },
        { date: '2025-12-10', km: 140000, workshop: '(ledger)', mechanic: '', work: 'Flywheel + front discs/pads + steering rack', parts: 'flywheel, discs, pads, rack', labor: null, paid: 15800, invoice: '', warranty: '' },
        { date: '2026-05-01', km: 149000, workshop: '(ledger)', mechanic: '', work: 'Oil change 5W-40', parts: 'oil, filter', labor: null, paid: 1400, invoice: '', warranty: '' }
      ],
      /* ---- FUEL ---- */
      fuel: [
        { date: '2026-06-20', km: 154200, liters: 40, pricePerL: 12.5, station: 'Wataniya', type: '95' },
        { date: '2026-07-01', km: 154650, liters: 42, pricePerL: 12.5, station: 'Misr', type: '95' },
        { date: '2026-07-10', km: 155000, liters: 41, pricePerL: 12.5, station: 'Wataniya', type: '95' }
      ],
      /* ---- BUDGET (categories) ---- */
      budget: [
        { cat: 'Engine', budget: 12000, spent: 0 }, { cat: 'Cooling', budget: 9000, spent: 0 },
        { cat: 'Turbo', budget: 4000, spent: 0 }, { cat: 'Suspension', budget: 14000, spent: 0 },
        { cat: 'Steering', budget: 0, spent: 0 }, { cat: 'Electrical', budget: 8000, spent: 0 },
        { cat: 'Brakes', budget: 7000, spent: 0 }, { cat: 'Interior', budget: 12000, spent: 0 },
        { cat: 'Exterior', budget: 10000, spent: 0 }, { cat: 'Body', budget: 15000, spent: 0 },
        { cat: 'Accessories', budget: 9000, spent: 0 }
      ],
      /* ---- MAINTENANCE PLANNER ---- */
      planner: [
        { title: 'Catch-up service (oil+filters+plugs)', dueKm: 157000, dueDate: '2026-08-01', kind: 'service', done: false },
        { title: 'Rear discs + pads', dueKm: 156000, dueDate: '2026-07-25', kind: 'brakes', done: false },
        { title: 'Timing belt + water pump', dueKm: 176000, dueDate: '2027-10-01', kind: 'critical', done: false },
        { title: 'Brake fluid flush (2yr)', dueKm: null, dueDate: '2027-01-15', kind: 'brakes', done: false }
      ],
      /* ---- WORKSHOPS ---- */
      workshops: [
        { name: 'Eng. Louai (Fiat CAN specialist)', spec: 'Electrical / MultiECUScan / proxi', phone: '', rating: 5, price: '$$', maps: '', notes: 'Did proxi alignment; best for the CAN fault.' },
        { name: 'Mechanic (smoke-test)', spec: 'Engine / smoke test', phone: '01099520389', rating: 4, price: '$$', maps: '', notes: 'From task list — air/boost leak test.' },
        { name: 'Smakri (bodywork)', spec: 'Panel beating / fiber / paint', phone: '', rating: 4, price: '$$', maps: 'https://goo.gl/maps/vckxcfmQ4wpbQWzm6', notes: 'Bumpers fiber+weld, polish, door adjust.' }
      ],
      /* ---- SUPPLIERS ---- */
      suppliers: [
        { name: 'ELKHLANY', contact: '+20 10 26840287', whatsapp: '+201026840287', website: '', brands: 'OEM + aftermarket', delivery: '', notes: 'belt 650, idler 450, front shock 4800TR/3800CN, rear 3800, master 3500.' },
        { name: 'El Asmar Fiat spare parts', contact: '', whatsapp: '', website: '', brands: 'Fiat specialist', delivery: '', notes: 'plugs 3100 (original, no NGK), air filter 250, belt 450, tensioner set 1150/idler 450, master ~3000, front shock set Turkish ~6000.' },
        { name: 'ELHakim Car Hub', contact: '', whatsapp: '', website: 'FB store', brands: 'X-max, SK Vision, Winca screens', delivery: '', notes: 'GP 9": X-max 2/32=4750, 4/64=6500, SK Vision 2K=7500 — incl frame+camera+AHD+install+1yr warranty. Best screen value.' },
        { name: 'Screens — Alexandria', contact: '+20 11 12336552', whatsapp: '+201112336552', website: '', brands: 'Enjoying/Winca/Max + ambient', delivery: '', notes: 'Max 2/32=6000, Winca 2/32=6500 4/64=10000, ambient light=1850.' },
        { name: 'el zaghal com.', contact: '', whatsapp: '', website: '', brands: 'TS18 screens', delivery: '', notes: 'TS18 2/64=6200, 7"=8000.' },
        { name: 'Top Car (اولاد رزق)', contact: '', whatsapp: '', website: '', brands: 'TS18 screens', delivery: '', notes: 'TS18 2/32=7600, GP frame available.' },
        { name: 'المعتز M7', contact: '01068666112', whatsapp: '', website: '', brands: 'screens/accessories', delivery: '', notes: 'TS18=9000 (expensive).' },
        { name: 'Italians House', contact: '+20 12 26277620', whatsapp: '+201226277620', website: '', brands: 'body panels + suspension', delivery: '', notes: 'front bumper 4500, rear bumper 4000 w/lights, cowl 1500, front shocks 6000, rear 2500.' },
        { name: 'Leather trim', contact: '+20 10 90421285', whatsapp: '+201090421285', website: '', brands: 'seat covers', delivery: '', notes: 'leather seat set 3700 installed, fits GP.' },
        { name: 'Canadian Auto Service Center', contact: '01007766683', whatsapp: '', website: '12 شارع المنارة', brands: 'detailing', delivery: '', notes: 'base 200; headlight polish 300; A/C sanitize 200; wax 3mo 300.' }
      ],
      /* ---- GARAGE INVENTORY ---- */
      inventory: [
        { item: 'Injector cleaner (Liqui Moly)', category: 'Fluids', qty: 1, location: 'Garage', notes: '' },
        { item: 'Silicone spray', category: 'Cleaning', qty: 1, location: 'Garage', notes: '' },
        { item: 'Tire compressor', category: 'Tools', qty: 1, location: 'Boot', notes: '' },
        { item: 'Jack + tools', category: 'Tools', qty: 1, location: 'Boot', notes: '' }
      ],
      /* ---- DOCUMENTS ---- */
      documents: [
        { name: 'Owner service ledger (Car.pdf)', type: 'Invoice/History', date: '2025-12-07', ref: 'Car.pdf', notes: '2021–2025 spend' },
        { name: 'AlfaOBD scan screenshots', type: 'Diagnostics', date: '2026-07', ref: 'images', notes: 'CAN fault codes' }
      ],
      /* ---- ROADMAP ---- */
      roadmap: [
        { phase: 1, title: 'Safety', progress: 0, budget: 30000, note: 'cooling leak · intake hose · CAN wiring · battery · rear brakes' },
        { phase: 2, title: 'Reliability', progress: 0, budget: 20000, note: 'service · suspension · CV/mount' },
        { phase: 3, title: 'Comfort', progress: 0, budget: 15000, note: 'A/C drain · interior · audio' },
        { phase: 4, title: 'Cosmetic', progress: 0, budget: 30000, note: 'bodywork · bumpers fiber · paint · LED' }
      ],
      /* ---- PHOTO TIMELINE ---- */
      photos: [
        { stage: 'before', label: 'Torn intake hose (51822558)', date: '2026-07' },
        { stage: 'before', label: 'Rear-impact zone / cowl panel', date: '2026-07' }
      ],
      /* ---- VALUE ---- */
      value: { purchase: 72000, purchaseYear: 2013, invested: 12000, runningLogged: 36612, repairEstimate: 40000, modEstimate: 25000, estResale: 325000 }
    }
  }]
};
