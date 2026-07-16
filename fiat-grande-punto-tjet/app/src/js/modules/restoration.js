/* Restoration Dashboard — preserves 100% of V1: instrument cluster,
   priority board, editable buying list, service timeline, budget bars,
   phase-1 checklist. Buying-list prices + checklist persist under the
   original localStorage keys so nothing the owner entered is lost. */
(function () {
  const { el, EGP } = App.util; const ui = App.ui;
  const CK = 'gp-tjet-checklist-v2';
  const CHECK = [
    ['tank', 'Expansion tank + cap + pressure test → radiator verdict', 'leak confirmed · refill Paraflu UP/G12+'],
    ['hose', 'Air-intake hose 51822558 + clamps', 'torn — protects the original turbo'],
    ['beltset', 'Accessory belt + tensioner + idler set', 'idle whistle · dealer belt 650 + idler 450'],
    ['rearwire', 'Repair REAR harness — B1023 plate-light short', 'impact zone · solder+heatshrink · start here'],
    ['battxt', 'Battery replace (weak: 12.0V / 10.3V cranking)', 'drops CAN nodes — do early'],
    ['airbagcon', 'Airbag ECU connector + ground — wiggle test', 'U1726 node drops · do NOT buy ECU'],
    ['loadnoise', 'Load-noise tests: CV vs 3rd mount (NOT clutch)', 'circles · 4th-gear load · pry-bar'],
    ['oil', 'Engine oil 5W-40 C3 + oil filter', 'last @149k → due ~157k'],
    ['filters', 'Air filter + cabin filter', 'check airbox for dust'],
    ['plugs', 'Spark plugs ×4 — NGK 55212466', 'overdue at 43k km'],
    ['rearbrakes', 'Rear discs + new pads', 'owner-confirmed worn'],
    ['fluid', 'Brake fluid flush + caliper service', 'NOT the master cylinder first'],
    ['smoke', 'Smoke test for air/boost leaks', 'confirms consumption cause'],
    ['acdrain', 'Clear A/C evaporator drain + dry carpet', 'water in driver footwell · also electrical risk'],
    ['susp', 'Suspension shake-down: front + rear', 'thud symptom · rear shocks likely'],
    ['tires', 'Tire DOT dates + tread', '>5 yrs Egypt heat = replace'],
    ['ac', 'A/C vent temp + leak test', 'diagnose before parts'],
    ['obd', 'Full OBD scan — clear crash flag after wiring fix', 'engine · ABS · airbag · BSI']
  ];
  const SUBS = ['Cluster', 'Priorities', 'Buying List', 'History', 'Budget', 'Checklist'];

  App.router.register({
    id: 'restoration', label: 'Restoration Dashboard', group: 'Overview', icon: App.config.icon('restoration'),
    render(view) {
      view.appendChild(ui.secHead('02', 'Restoration Dashboard', 'لوحة الترميم'));
      const tabs = el('div', { class: 'filters' });
      const body = el('div');
      let active = 'Cluster';
      SUBS.forEach(s => tabs.appendChild(el('button', { class: 'fbtn' + (s === active ? ' active' : ''), onclick: () => { active = s; sync(); } }, s)));
      view.appendChild(tabs); view.appendChild(body);
      function sync() {
        App.util.$$('.fbtn', tabs).forEach(b => b.classList.toggle('active', b.textContent === active));
        body.innerHTML = ''; body.appendChild(RENDER[active]());
      }
      sync();
    }
  });

  const RENDER = {
    Cluster() {
      const v = App.store.veh();
      const wrap = el('div', {}, [
        el('div', { class: 'grid-3 stagger' }, [
          ui.dial(v.scores.health, 'Health / Safety', 'CAN fault · coolant · hose', 'var(--amber)'),
          ui.dial(61, 'Timing Belt Life Used', '43k of ~70k km', 'var(--amber)'),
          ui.dial(checkPct(), 'Phase-1 Progress', 'from checklist', checkPct() >= 50 ? 'var(--amber)' : 'var(--rosso)')
        ]),
        alertCard(),
        beltCard()
      ]);
      return wrap;
    },
    Priorities() {
      const d = App.store.veh().data;
      const cards = [];
      d.faults.filter(f => !f.solved).slice(0, 4).forEach(f => cards.push(priCard('p-crit', f.code + ' · ' + f.system, f.symptom, '🔴 ' + (f.state || 'OPEN'), f.root)));
      d.parts.filter(p => p.priority === 'high' && p.verdict === 'buy').slice(0, 6).forEach(p => cards.push(priCard('p-high', p.name, p.ar, '🟠 BUY', p.notes || '')));
      d.parts.filter(p => p.verdict === 'hold').slice(0, 4).forEach(p => cards.push(priCard('p-med', p.name, p.ar, '🟡 HOLD', p.notes || '')));
      return el('div', { class: 'tasks stagger' }, cards);
    },
    'Buying List'() {
      const rows = App.store.all('parts');
      let plan = 0, spent = 0;
      const recalc = () => { plan = 0; spent = 0; rows.forEach(p => { if (p.priceNewEg) { const t = p.priceNewEg * (p.qty || 1); plan += t; if (p.status === 'bought') spent += t; } }); totNode.innerHTML = '<b>Plan</b> ' + EGP(plan) + ' &nbsp; <b>Bought</b> ' + EGP(spent) + ' &nbsp; <b>Left</b> ' + EGP(plan - spent); };
      const cols = [
        { key: 'status', label: '✔', render: p => { const c = el('input', { type: 'checkbox', checked: p.status === 'bought' ? 'checked' : null }); c.onchange = () => { App.store.update('parts', p.id, { status: c.checked ? 'bought' : p.verdict === 'buy' ? 'to-order' : 'hold' }); recalc(); }; return c; } },
        { key: 'verdict', label: '', render: p => ui.verdict(p.verdict) },
        { key: 'name', label: 'Part', sort: true, render: p => el('div', {}, [el('b', { text: p.name }), el('div', { class: 'mono muted', style: 'font-size:10px', text: p.ar || '' })]) },
        { key: 'oem', label: 'OEM', render: p => el('span', { class: 'mono', style: 'color:var(--rosso-deep)', text: p.oem || '—' }) },
        { key: 'euRef', label: '🌍 EU' },
        { key: 'qty', label: 'Qty', render: p => { const i = el('input', { class: 'inp num', type: 'number', value: p.qty || 1, style: 'width:52px' }); i.onchange = () => { App.store.update('parts', p.id, { qty: +i.value || 1 }); recalc(); }; return i; } },
        { key: 'priceNewEg', label: 'Your EGP', render: p => { const i = el('input', { class: 'inp num', type: 'number', value: p.priceNewEg == null ? '' : p.priceNewEg, placeholder: '—', style: 'width:92px' }); i.oninput = () => { App.store.update('parts', p.id, { priceNewEg: i.value === '' ? null : +i.value }); recalc(); }; return i; } },
        { key: '_t', label: 'Total', render: p => el('span', { class: 'mono', text: p.priceNewEg ? EGP(p.priceNewEg * (p.qty || 1)) : '—' }) }
      ];
      const totNode = el('div', { class: 'mono', style: 'background:var(--ink);color:var(--paper);padding:12px 16px;border-radius:8px;margin-top:12px;font-size:13px' });
      const dt = App.DataTable(cols, rows, { title: 'buying-list', pageSize: 30, searchKeys: ['name', 'ar', 'oem', 'brand'] });
      setTimeout(recalc, 0);
      return el('div', {}, [
        el('div', { class: 'mono muted rtl', style: 'font-size:12px;margin-bottom:10px' }, 'اكتب سعرك في خانة Your EGP — بيتحفظ تلقائيًا. ⚠️ أكّد أرقام OEM بالشاسيه.'),
        dt, totNode
      ]);
    },
    History() {
      const d = App.store.veh().data;
      const line = el('div', { class: 'timeline stagger' });
      const evs = d.service.slice().sort((a, b) => (a.km || 0) - (b.km || 0));
      evs.forEach(s => line.appendChild(el('div', { class: 'ev' }, [
        el('div', { class: 'ev-km', text: App.util.shortDate(s.date) + ' · ' + App.util.num(s.km) + ' KM' }),
        el('h4', { text: s.work }), el('p', { text: s.parts || '' }),
        s.paid ? el('div', { class: 'paid', html: 'PAID <span>' + App.config.money(s.paid) + '</span>' }) : null
      ])));
      line.appendChild(el('div', { class: 'ev now' }, [el('div', { class: 'ev-km', text: 'JUL 2026 · 155,000 KM — أنت هنا' }), el('h4', { text: 'Phase 1 in progress' }), el('p', { text: 'Coolant leak · torn intake hose · post-impact CAN fault · rear brakes · catch-up service.' })]));
      return line;
    },
    Budget() { const el2 = App.util.el('div'); App.router.get('budget').render(el2); // reuse budget view
      // strip its sec-head (first child) to avoid duplicate title
      if (el2.firstChild) el2.removeChild(el2.firstChild); return el2; },
    Checklist() {
      const saved = load();
      const done = CHECK.filter(c => saved[c[0]]).length;
      const head = el('div', { style: 'display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px 10px;margin-bottom:12px' }, [
        el('h3', { class: 'h-disp', style: 'font-size:16px;min-width:0', text: 'Phase-1 Checklist' }),
        el('span', { class: 'mono', style: 'white-space:nowrap;flex-shrink:0', html: '<b style="color:var(--green)">' + done + '</b>/' + CHECK.length + ' COMPLETE' })
      ]);
      const list = el('ul', { style: 'list-style:none;display:grid;gap:7px' });
      CHECK.forEach(c => {
        const li = el('li', { class: 'card', style: 'cursor:pointer;display:flex;gap:11px;align-items:flex-start;padding:10px 12px' + (saved[c[0]] ? ';opacity:.6' : '') }, [
          el('span', { style: 'flex:0 0 20px;height:20px;border:2px solid var(--ink);border-radius:3px;display:grid;place-items:center;background:' + (saved[c[0]] ? 'var(--green)' : 'transparent') + ';color:#fff;font-size:13px', text: saved[c[0]] ? '✓' : '' }),
          el('div', {}, [el('div', { style: 'font-size:13px' + (saved[c[0]] ? ';text-decoration:line-through' : ''), text: c[1] }), el('div', { class: 'mono muted', style: 'font-size:10px', text: c[2] })])
        ]);
        li.onclick = () => { saved[c[0]] = !saved[c[0]]; localStorage.setItem(CK, JSON.stringify(saved)); App.router.go('restoration', true); };
        list.appendChild(li);
      });
      return el('div', {}, [head, list]);
    }
  };

  function checkPct() { const s = load(); const d = CHECK.filter(c => s[c[0]]).length; return Math.round(d / CHECK.length * 100); }
  function load() { try { return JSON.parse(localStorage.getItem(CK)) || {}; } catch (e) { return {}; } }

  function priCard(cls, title, ar, badge, body) {
    return el('div', { class: 'card card-hover ' + cls }, [
      el('div', { class: 'spine', style: 'background:' + spineColor(cls) }),
      el('div', { class: 'pad' }, [
        el('div', { style: 'display:flex;justify-content:space-between;gap:8px;align-items:flex-start' }, [
          el('span', { class: 'h-disp', style: 'font-size:15px', text: title }), el('span', { class: 'mono', style: 'font-size:9.5px;white-space:nowrap', text: badge })]),
        ar ? el('div', { class: 'mono muted rtl', style: 'font-size:12px;margin-top:3px', text: ar }) : null,
        body ? el('div', { style: 'font-size:12.5px;color:#413a30;line-height:1.6;margin-top:8px;border-top:1px dashed var(--line);padding-top:8px', text: body }) : null
      ])
    ]);
  }
  function spineColor(c) { return { 'p-crit': 'var(--rosso)', 'p-high': 'var(--amber)', 'p-med': 'var(--steel)' }[c] || 'var(--ink)'; }

  function alertCard() {
    return el('div', { class: 'card', style: 'margin-top:16px;border-color:var(--rosso)' }, [
      el('div', { style: 'background:var(--rosso);color:var(--paper);padding:8px 16px;font-family:var(--disp);font-weight:700;text-transform:uppercase;letter-spacing:.06em;font-size:14px', text: 'عطل السلامة — الأسبوع ده' }),
      el('div', { class: 'pad rtl', style: 'font-size:13px;line-height:1.75', html: '<b>١)</b> تسريب قربة المياه ← قربة+غطاء+اختبار ضغط+Paraflu. <b>٢)</b> خرطوم السحب 51822558 (خطر التيربو). <b>٣)</b> كهربا الصدمة (CAN) — إصلاح أسلاك + بطارية، <b>مش موديول</b>.' })
    ]);
  }
  function beltCard() {
    const c = el('div', { class: 'card', style: 'margin-top:16px' });
    c.innerHTML = '<div class="pad"><div style="display:flex;justify-content:space-between;flex-wrap:wrap"><span class="h-disp" style="font-size:16px">⏱ Next Timing Belt</span><span class="mono" style="color:var(--amber);font-size:11px">DUE ~176,000 KM · OCT 2027</span></div>' +
      '<div class="meter" style="margin-top:12px;height:22px"><div class="fill f-red" style="width:63%"></div></div>' +
      '<div class="mono muted" style="font-size:11px;margin-top:8px">Done @112k. Bundle next: tensioner + water pump + accessory belt + coolant switch.</div></div>';
    return c;
  }
})();
