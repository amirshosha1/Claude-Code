/* Budget Manager — categories grouped by Roadmap phase, so the two
   screens always tell the same story. Target: EGP 50-60k total, not
   per-category padding. Click any category to edit budget/spent. */
(function () {
  const { el, phaseBudget, PHASE_COLOR, PHASE_FILL } = App.util; const ui = App.ui; const money = App.config.money;
  const PHASE_NAME = { 1: 'Phase 1 · Safety', 2: 'Phase 2 · Reliability', 3: 'Phase 3 · Comfort', 4: 'Phase 4 · Cosmetic' };

  App.router.register({
    id: 'budget', label: 'Budget Manager', group: 'Money', icon: App.config.icon('budget'),
    render(view) {
      const d = App.store.veh().data;
      const cats = d.budget;
      const totalBudget = cats.reduce((s, c) => s + (c.budget || 0), 0);
      const totalSpent = cats.reduce((s, c) => s + (c.spent || 0), 0);
      const inTarget = totalBudget >= 50000 && totalBudget <= 60000;

      view.appendChild(ui.secHead('07', 'Budget Manager', 'إدارة الميزانية'));

      view.appendChild(el('div', { class: 'tiles stagger' }, [
        ui.tile('Total Budget', money(totalBudget), inTarget ? '✓ within 50–60k target' : 'target 50–60k', { color: inTarget ? 'var(--green)' : 'var(--amber)' }),
        ui.tile('Spent', money(totalSpent), Math.round((totalSpent / (totalBudget || 1)) * 100) + '% of budget', { color: 'var(--steel)' }),
        ui.tile('Remaining', money(totalBudget - totalSpent), ''),
        ui.tile('Phases', '4', 'Safety → Reliability → Comfort → Cosmetic')
      ]));

      // composition bar: one bar, segmented by phase, so Budget visually
      // matches the Roadmap at a glance
      view.appendChild(compositionBar(d));

      // grouped-by-phase cards
      [1, 2, 3, 4].forEach(ph => {
        const { budget, spent, cats: rows } = phaseBudget(d, ph);
        if (!rows.length) return;
        const section = el('div', { style: 'margin-top:22px' });
        section.appendChild(el('div', { style: 'display:flex;align-items:baseline;gap:10px;margin-bottom:10px' }, [
          el('span', { style: 'width:10px;height:10px;border-radius:2px;background:' + PHASE_COLOR[ph] + ';display:inline-block;transform:rotate(45deg)' }),
          el('h3', { class: 'h-disp', style: 'font-size:15px', text: PHASE_NAME[ph] }),
          el('span', { class: 'mono muted', style: 'font-size:11px', text: money(spent) + ' / ' + money(budget) }),
          el('button', { class: 'btn sm ghost', style: 'margin-left:auto', onclick: () => App.router.go('roadmap') }, 'View in Roadmap →')
        ]));
        const grid = el('div', { class: 'grid-2 stagger' });
        rows.forEach(c => grid.appendChild(catCard(c, ph)));
        section.appendChild(grid);
        view.appendChild(section);
      });
    }
  });

  function compositionBar(d) {
    const total = d.budget.reduce((s, c) => s + (c.budget || 0), 0) || 1;
    const segs = [1, 2, 3, 4].map(ph => {
      const { budget } = phaseBudget(d, ph);
      return { ph, pct: (budget / total) * 100, budget };
    }).filter(s => s.budget > 0);
    const bar = el('div', { style: 'display:flex;height:16px;border:1.5px solid var(--ink);border-radius:4px;overflow:hidden;margin:14px 0 6px' });
    segs.forEach(s => bar.appendChild(el('div', { style: 'width:' + s.pct + '%;background:' + PHASE_COLOR[s.ph], 'data-tip': PHASE_NAME[s.ph] + ' · ' + App.config.money(s.budget) })));
    const legend = el('div', { class: 'chips', style: 'margin-bottom:4px' });
    segs.forEach(s => legend.appendChild(el('span', { class: 'tag', style: 'border-color:' + PHASE_COLOR[s.ph] + ';color:' + PHASE_COLOR[s.ph], text: PHASE_NAME[s.ph].split('·')[1].trim() + ' ' + Math.round(s.pct) + '%' })));
    return el('div', { class: 'card', style: 'margin-bottom:6px' }, [el('div', { class: 'pad' }, [
      el('div', { class: 'mono muted', style: 'font-size:10px;letter-spacing:.14em;text-transform:uppercase', text: 'Budget composition by phase' }),
      bar, legend
    ])]);
  }

  function catCard(c, phase) {
    const pct = c.budget ? Math.min(100, (c.spent / c.budget) * 100) : 0;
    const over = c.spent > c.budget;
    const card = el('div', { class: 'card card-hover' }, [el('div', { class: 'spine', style: 'background:' + (over ? 'var(--rosso)' : PHASE_COLOR[phase]) })]);
    const pad = el('div', { class: 'pad', style: 'cursor:pointer' }, [
      el('div', { style: 'display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:6px 10px' }, [
        el('span', { class: 'h-disp', style: 'font-size:15px;flex:1;min-width:0', text: c.cat }),
        el('span', { class: 'mono', style: 'font-size:12px;white-space:nowrap;flex-shrink:0', text: App.config.money(c.spent) + ' / ' + App.config.money(c.budget) })
      ]),
      ui.meter(pct, over ? 'f-red' : PHASE_FILL[phase]),
      c.note ? el('div', { style: 'font-size:11.5px;color:var(--ink-soft);margin-top:8px;line-height:1.5', text: c.note }) : null,
      el('div', { class: 'mono muted', style: 'font-size:10.5px;margin-top:6px', text: over ? 'Over by ' + App.config.money(c.spent - c.budget) : App.config.money(c.budget - c.spent) + ' remaining' })
    ]);
    pad.addEventListener('click', () => edit(c));
    card.appendChild(pad); return card;
  }

  function edit(c) {
    const { el } = App.util;
    const body = el('div', {}, [
      lbl('Category', el('input', { class: 'inp', value: c.cat, disabled: 'disabled' })),
      lbl('Budget (EGP)', el('input', { class: 'inp', type: 'number', value: c.budget, data: { key: 'budget' } })),
      lbl('Spent (EGP)', el('input', { class: 'inp', type: 'number', value: c.spent, data: { key: 'spent' } })),
      el('button', { class: 'btn rosso', style: 'margin-top:8px', onclick: save }, 'Save')
    ]);
    const m = App.util.modal('Budget · ' + c.cat, body);
    function save() { const p = {}; body.querySelectorAll('[data-key]').forEach(i => p[i.dataset.key] = +i.value); Object.assign(c, p); App.store.persist(); m.close(); App.router.go('budget', true); App.util.toast('Saved'); }
    function lbl(t, n) { return el('label', { class: 'fld' }, [el('span', { class: 'lb', text: t }), n]); }
  }
})();
