/* Budget Manager — per-category budget/spent/remaining/forecast + bars */
(function () {
  const { el } = App.util; const ui = App.ui; const money = App.config.money;
  App.router.register({
    id: 'budget', label: 'Budget Manager', group: 'Money', icon: App.config.icon('budget'),
    render(view) {
      const d = App.store.veh().data;
      // derive spent from service history by rough category if not set; else use stored
      const cats = d.budget;
      const totalBudget = cats.reduce((s, c) => s + (c.budget || 0), 0);
      const totalSpent = cats.reduce((s, c) => s + (c.spent || 0), 0);
      view.appendChild(ui.secHead('07', 'Budget Manager', 'إدارة الميزانية'));

      view.appendChild(el('div', { class: 'tiles', style: 'margin-bottom:16px' }, [
        ui.tile('Planned', money(totalBudget), 'across categories'),
        ui.tile('Spent', money(totalSpent), '', { color: 'var(--green)' }),
        ui.tile('Remaining', money(totalBudget - totalSpent), '', { color: 'var(--amber)' }),
        ui.tile('Recommended', 'EGP 75–120k', 'full mechanical', { color: 'var(--steel)' })
      ]));

      const grid = el('div', { class: 'grid-2 stagger' });
      cats.forEach(c => {
        const pct = c.budget ? Math.min(100, (c.spent / c.budget) * 100) : 0;
        const over = c.spent > c.budget;
        const card = el('div', { class: 'card card-hover' }, [el('div', { class: 'spine', style: 'background:' + (over ? 'var(--rosso)' : 'var(--steel)') })]);
        const pad = el('div', { class: 'pad' }, [
          el('div', { style: 'display:flex;justify-content:space-between;align-items:baseline' }, [
            el('span', { class: 'h-disp', style: 'font-size:15px', text: c.cat }),
            el('span', { class: 'mono', style: 'font-size:12px', text: money(c.spent) + ' / ' + money(c.budget) })
          ]),
          ui.meter(pct, over ? 'f-red' : 'f-steel'),
          el('div', { class: 'mono muted', style: 'font-size:10.5px;margin-top:6px', text: over ? 'Over by ' + money(c.spent - c.budget) : money(c.budget - c.spent) + ' remaining' })
        ]);
        // click to edit spent/budget
        pad.style.cursor = 'pointer';
        pad.addEventListener('click', () => edit(c));
        card.appendChild(pad); grid.appendChild(card);
      });
      view.appendChild(grid);
    }
  });

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
