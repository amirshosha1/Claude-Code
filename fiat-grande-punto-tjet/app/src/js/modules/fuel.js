/* Fuel Dashboard — refills, consumption, cost/km, trend chart (SVG) */
(function () {
  const { el } = App.util; const ui = App.ui; const money = App.config.money, num = App.util.num;
  App.router.register({
    id: 'fuel', label: 'Fuel Dashboard', group: 'Money', icon: App.config.icon('fuel'),
    render(view) {
      const d = App.store.veh().data;
      const fuel = d.fuel.slice().sort((a, b) => (a.km || 0) - (b.km || 0));
      view.appendChild(ui.secHead('06', 'Fuel Dashboard', 'لوحة البنزين'));

      // compute per-fill consumption
      const rows = [];
      let totLiters = 0, totCost = 0, totDist = 0;
      for (let i = 0; i < fuel.length; i++) {
        const f = fuel[i]; const prev = fuel[i - 1];
        const dist = prev ? f.km - prev.km : null;
        const cons = dist ? (f.liters / dist) * 100 : null;
        const total = f.liters * f.pricePerL;
        totLiters += f.liters; totCost += total; if (dist) totDist += dist;
        rows.push(Object.assign({}, f, { dist, cons, total }));
      }
      const avg = totDist ? (fuel.slice(1).reduce((s, x) => s + x.liters, 0) / totDist) * 100 : null;
      const costPerKm = totDist ? totCost / totDist : null;

      view.appendChild(el('div', { class: 'tiles', style: 'margin-bottom:16px' }, [
        ui.tile('Avg Consumption', avg ? avg.toFixed(1) : '—', 'L/100km', { color: avg > 8.5 ? 'var(--rosso)' : 'var(--green)' }),
        ui.tile('Cost / km', costPerKm ? money(costPerKm) : '—', ''),
        ui.tile('Total spent', money(totCost), num(totLiters) + ' L'),
        ui.tile('Target', '7–7.5', 'L/100km (spec)', { color: 'var(--steel)' })
      ]));

      // trend chart
      view.appendChild(chart(rows.filter(r => r.cons != null)));

      // table
      view.appendChild(el('h3', { class: 'h-disp', style: 'font-size:16px;margin:18px 0 10px', text: 'Refill Log' }));
      view.appendChild(App.DataTable([
        { key: 'date', label: 'Date', sort: true, render: r => App.util.shortDate(r.date) },
        { key: 'km', label: 'KM', sort: true, render: r => num(r.km) },
        { key: 'liters', label: 'Liters', sort: true },
        { key: 'pricePerL', label: '/L', render: r => money(r.pricePerL) },
        { key: 'total', label: 'Total', render: r => money(r.liters * r.pricePerL) },
        { key: 'cons', label: 'L/100km', sort: true, render: r => r.cons ? r.cons.toFixed(1) : '—' },
        { key: 'station', label: 'Station' }
      ], rows.slice().reverse(), { title: 'fuel', pageSize: 10, actions: [{ label: '+ Add Refill', cls: 'rosso', fn: addRefill }] }));
    }
  });

  function chart(data) {
    if (data.length < 2) return el('div', { class: 'card' }, [el('div', { class: 'pad' }, [ui.empty('Add at least 2 refills to see the consumption trend.')])]);
    const w = 640, h = 180, pad = 30;
    const vals = data.map(d => d.cons);
    const min = Math.min.apply(null, vals) - 0.5, max = Math.max.apply(null, vals) + 0.5;
    const x = i => pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = v => h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
    let path = '', dots = '';
    data.forEach((d, i) => { path += (i ? 'L' : 'M') + x(i) + ' ' + y(d.cons) + ' '; dots += `<circle cx="${x(i)}" cy="${y(d.cons)}" r="3.5" fill="var(--rosso)"/>`; });
    const target = y(7.25);
    const card = el('div', { class: 'card' });
    card.innerHTML = `<div class="pad"><div class="mono muted" style="font-size:10px;letter-spacing:.14em;text-transform:uppercase;margin-bottom:6px">Consumption trend · L/100km</div>
      <div style="overflow-x:auto"><svg viewBox="0 0 ${w} ${h}" style="width:100%;min-width:420px">
      <line x1="${pad}" y1="${target}" x2="${w - pad}" y2="${target}" stroke="var(--green)" stroke-dasharray="4 4" stroke-width="1.5"/>
      <text x="${w - pad}" y="${target - 4}" text-anchor="end" font-family="monospace" font-size="9" fill="var(--green)">target 7.25</text>
      <path d="${path}" fill="none" stroke="var(--rosso)" stroke-width="2.5"/>${dots}</svg></div></div>`;
    return card;
  }

  function addRefill() {
    const { el } = App.util; const lastKm = (App.store.veh().mileage) || '';
    const body = el('div', {}, [
      lbl('Date', el('input', { class: 'inp', type: 'date', value: new Date().toISOString().slice(0, 10), data: { key: 'date' } })),
      lbl('Mileage (km)', el('input', { class: 'inp', type: 'number', value: lastKm, data: { key: 'km' } })),
      lbl('Liters', el('input', { class: 'inp', type: 'number', data: { key: 'liters' } })),
      lbl('Price / liter', el('input', { class: 'inp', type: 'number', value: '12.5', data: { key: 'pricePerL' } })),
      lbl('Station', el('input', { class: 'inp', data: { key: 'station' } })),
      lbl('Fuel type', el('input', { class: 'inp', value: '95', data: { key: 'type' } })),
      el('button', { class: 'btn rosso', style: 'margin-top:8px', onclick: save }, 'Add Refill')
    ]);
    const m = App.util.modal('New Refill', body);
    function save() {
      const p = {}; body.querySelectorAll('[data-key]').forEach(i => p[i.dataset.key] = i.type === 'number' ? +i.value : i.value);
      App.store.add('fuel', p);
      if (p.km) App.store.setVeh({ mileage: p.km });
      m.close(); App.router.go('fuel', true); App.util.toast('Refill added');
    }
    function lbl(t, n) { return el('label', { class: 'fld' }, [el('span', { class: 'lb', text: t }), n]); }
  }
})();
