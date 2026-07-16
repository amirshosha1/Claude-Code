/* Command Center — at-a-glance dashboard for the active vehicle */
(function () {
  const { el } = App.util; const ui = App.ui;
  App.router.register({
    id: 'command', label: 'Command Center', group: 'Overview', icon: App.config.icon('command'),
    render(view) {
      const v = App.store.veh(); const d = v.data;
      const partsSpentPlan = d.parts.filter(p => p.verdict === 'buy').length;
      const openFaults = d.faults.filter(f => !f.solved).length;
      const critFaults = d.faults.filter(f => !f.solved && f.priority === 'critical').length;
      const totalSpent = d.installed.reduce((s, x) => s + (x.paid || 0), 0);
      const fuelAvg = avgConsumption(d.fuel);
      const alerts = App.notify.evaluate();

      view.appendChild(ui.secHead('01', 'Command Center', 'مركز القيادة'));

      // score dials
      const dials = el('div', { class: 'grid-3 stagger' }, [
        ui.dial(v.scores.health, 'Health', 'overall condition', 'var(--amber)'),
        ui.dial(v.scores.safety, 'Safety', 'airbag/ESP/CAN open', 'var(--rosso)'),
        ui.dial(v.scores.reliability, 'Reliability', 'major items fresh', 'var(--green)')
      ]);
      view.appendChild(dials);

      // stat tiles
      const tiles = el('div', { class: 'tiles stagger', style: 'margin-top:16px' });
      tiles.appendChild(ui.tile('Mileage', '', 'km', { count: v.mileage }));
      tiles.appendChild(ui.tile('Open Repairs', '', critFaults + ' critical', { count: openFaults, color: 'var(--rosso)' }));
      tiles.appendChild(ui.tile('To Buy', '', 'parts flagged BUY', { count: partsSpentPlan }));
      tiles.appendChild(ui.tile('Fuel', fuelAvg ? fuelAvg.toFixed(1) : '—', 'L/100km', { color: 'var(--steel)' }));
      tiles.appendChild(ui.tile('Invested', App.config.money(totalSpent), 'logged repairs'));
      tiles.appendChild(ui.tile('Phase', v.phase.split('—')[0], v.phase.split('—')[1] || ''));
      view.appendChild(tiles);

      // two columns: alerts + quick actions/upcoming
      const grid = el('div', { class: 'cc-grid', style: 'margin-top:16px' });

      const alertsCard = el('div', { class: 'card' }, [el('div', { class: 'spine', style: 'background:var(--rosso)' })]);
      const ab = el('div', { class: 'pad' }, [el('h3', { class: 'h-disp', style: 'font-size:16px;margin-bottom:8px', text: 'Critical Alerts' })]);
      if (!alerts.length) ab.appendChild(ui.empty('No alerts — all clear.'));
      alerts.slice(0, 8).forEach(a => ab.appendChild(el('div', { class: 'alert-row' }, [
        el('div', { class: 'alert-dot ' + (a.sev === 'crit' ? 'crit' : 'warn') }),
        el('div', {}, [el('div', { class: 'at', text: a.title }), el('div', { class: 'ad', text: a.detail })])
      ])));
      alertsCard.appendChild(ab);

      const rightCard = el('div', { class: 'card' }, [el('div', { class: 'spine', style: 'background:var(--ink)' })]);
      const rb = el('div', { class: 'pad' });
      rb.appendChild(el('h3', { class: 'h-disp', style: 'font-size:16px;margin-bottom:8px', text: 'Quick Actions' }));
      const qa = el('div', { class: 'qa' }, [
        el('button', { class: 'btn sm', onclick: () => App.router.go('fuel') }, '⛽ Add Refill'),
        el('button', { class: 'btn sm ghost', onclick: () => App.router.go('service') }, '📘 Log Service'),
        el('button', { class: 'btn sm ghost', onclick: () => App.router.go('parts') }, '⚙ Parts'),
        el('button', { class: 'btn sm ghost', onclick: () => App.router.go('diagnostics') }, '⚠ Faults')
      ]);
      rb.appendChild(qa);
      rb.appendChild(el('h3', { class: 'h-disp', style: 'font-size:16px;margin:16px 0 8px', text: 'Upcoming' }));
      const up = d.planner.filter(p => !p.done).slice(0, 4);
      if (!up.length) rb.appendChild(ui.empty('Nothing scheduled.'));
      up.forEach(p => rb.appendChild(el('div', { class: 'alert-row' }, [
        el('div', { class: 'alert-dot warn' }),
        el('div', {}, [el('div', { class: 'at', text: p.title }),
          el('div', { class: 'ad', text: (p.dueKm ? p.dueKm.toLocaleString() + ' km' : '') + (p.dueDate ? ' · ' + App.util.shortDate(p.dueDate) : '') })])
      ])));
      rightCard.appendChild(rb);

      grid.appendChild(alertsCard); grid.appendChild(rightCard);
      view.appendChild(grid);
    }
  });

  function avgConsumption(fuel) {
    if (!fuel || fuel.length < 2) return null;
    const s = fuel.slice().sort((a, b) => (a.km || 0) - (b.km || 0));
    let dist = 0, liters = 0;
    for (let i = 1; i < s.length; i++) { dist += (s[i].km - s[i - 1].km); liters += s[i].liters; }
    return dist > 0 ? (liters / dist) * 100 : null;
  }
  App._avgConsumption = avgConsumption;
})();
