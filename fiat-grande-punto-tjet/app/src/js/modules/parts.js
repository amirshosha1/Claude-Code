/* Parts Database — full CRUD with searchable/sortable/exportable table */
(function () {
  const { el } = App.util; const ui = App.ui;
  App.router.register({
    id: 'parts', label: 'Parts Database', group: 'Vehicle', icon: App.config.icon('parts'),
    render(view) {
      const rows = App.store.all('parts');
      view.appendChild(ui.secHead('03', 'Parts Database', 'قاعدة القطع'));

      const cats = Array.from(new Set(rows.map(r => r.category))).sort();
      const cols = [
        { key: 'verdict', label: '', filterLabel: 'Verdict', render: r => ui.verdict(r.verdict), filter: ['buy', 'hold', 'stop', 'later'] },
        { key: 'name', label: 'Part', sort: true, render: r => el('div', {}, [el('b', { text: r.name }), el('div', { class: 'mono muted', style: 'font-size:10px', text: r.ar || '' })]) },
        { key: 'oem', label: 'OEM #', sort: true, render: r => el('span', { class: 'mono', style: 'color:var(--rosso-deep);font-weight:700', text: r.oem || '—' }) },
        { key: 'brand', label: 'Brand', sort: true },
        { key: 'category', label: 'Category', sort: true, filter: cats },
        { key: 'priceNewEg', label: 'Part EGP', sort: true, render: r => r.priceNewEg ? App.util.num(r.priceNewEg) : '—' },
        { key: 'laborEg', label: 'Labor EGP', sort: true, render: r => r.laborEg ? App.util.num(r.laborEg) : el('span', { class: 'mono muted', text: '— add' }) },
        { key: '_total', label: 'Total', sort: false, render: r => partTotal(r) != null ? el('span', { class: 'mono', style: 'font-weight:700', text: App.util.num(partTotal(r)) }) : '—' },
        { key: 'euRef', label: '🌍 EU' },
        { key: 'priority', label: 'Priority', sort: true, render: r => ui.priorityBadge(r.priority), filter: ['critical', 'high', 'medium', 'low', 'cosmetic'] },
        { key: 'vinOk', label: 'VIN', render: r => r.vinOk ? '✅' : el('span', { class: 'mono', style: 'color:var(--amber)', text: 'verify' }) }
      ];
      const dt = App.DataTable(cols, rows, {
        title: 'parts', pageSize: 14, searchKeys: ['name', 'ar', 'oem', 'brand', 'alt', 'notes', 'category'],
        onRow: r => openPart(r),
        actions: [{ label: '+ Add Part', cls: 'rosso', fn: () => openPart(null) }]
      });
      view.appendChild(dt);

      const grand = rows.reduce((s, r) => s + (partTotal(r) || 0), 0);
      const missingLabor = rows.filter(r => r.priceNewEg && r.laborEg == null).length;
      view.appendChild(el('div', { class: 'card', style: 'margin-top:14px' }, [el('div', { class: 'pad', style: 'display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;align-items:center' }, [
        el('span', { class: 'mono muted', style: 'font-size:11px', text: missingLabor ? missingLabor + ' item(s) still need a labor/installation price' : 'Labor filled in for all priced parts' }),
        el('span', { class: 'h-disp', style: 'font-size:18px;color:var(--rosso)', text: 'Grand total (parts+labor): ' + App.config.money(grand) })
      ])]));
    }
  });

  /* (price × qty) + labor — the number to actually budget for this line */
  function partTotal(r) {
    if (r.priceNewEg == null && r.laborEg == null) return null;
    return (r.priceNewEg || 0) * (r.qty || 1) + (r.laborEg || 0);
  }

  function openPart(rec) {
    const isNew = !rec; rec = rec || { verdict: 'buy', priority: 'medium', category: 'Engine', vinOk: false };
    const { el } = App.util;
    const f = (lb, key, val, type) => el('label', { class: 'fld' }, [el('span', { class: 'lb', text: lb }),
      el('input', { class: 'inp', type: type || 'text', value: rec[key] == null ? '' : rec[key], data: { key } })]);
    const body = el('div', {}, [
      f('Part name', 'name'), f('Arabic name', 'ar'), f('OEM number', 'oem'), f('Fiat number', 'fiat'),
      f('Alternative numbers', 'alt'), f('Brand', 'brand'),
      el('label', { class: 'fld' }, [el('span', { class: 'lb', text: 'Category' }),
        selectFrom('category', ['Engine', 'Cooling', 'Turbo', 'Suspension', 'Steering', 'Electrical', 'Brakes', 'Interior', 'Exterior', 'Body', 'Transmission', 'Accessories'], rec.category)]),
      f('Price new (EGP)', 'priceNewEg', null, 'number'), f('Price used (EGP)', 'priceUsedEg', null, 'number'),
      f('Labor / installation (EGP)', 'laborEg', null, 'number'), f('Quantity', 'qty', null, 'number'),
      f('EU reference', 'euRef'), f('Supplier', 'supplier'), f('Compatibility', 'compat'), f('Warranty', 'warranty'),
      el('label', { class: 'fld' }, [el('span', { class: 'lb', text: 'Verdict' }), selectFrom('verdict', ['buy', 'hold', 'stop', 'later', 'installed'], rec.verdict)]),
      el('label', { class: 'fld' }, [el('span', { class: 'lb', text: 'Priority' }), selectFrom('priority', ['critical', 'high', 'medium', 'low', 'cosmetic'], rec.priority)]),
      el('label', { class: 'fld' }, [el('span', { class: 'lb', text: 'VIN verified' }), selectFrom('vinOk', ['false', 'true'], String(rec.vinOk))]),
      el('label', { class: 'fld' }, [el('span', { class: 'lb', text: 'Tags (comma)' }), el('input', { class: 'inp', value: (rec.tags || []).join(', '), data: { key: 'tags' } })]),
      el('label', { class: 'fld' }, [el('span', { class: 'lb', text: 'Notes' }), el('textarea', { class: 'inp', rows: '2', data: { key: 'notes' } }, rec.notes || '')]),
      el('div', { style: 'display:flex;gap:8px;margin-top:8px' }, [
        el('button', { class: 'btn rosso', onclick: () => save() }, isNew ? 'Add Part' : 'Save'),
        isNew ? null : el('button', { class: 'btn ghost', onclick: () => { App.store.remove('parts', rec.id); m.close(); App.router.go('parts', true); App.util.toast('Deleted'); } }, 'Delete')
      ])
    ]);
    const m = App.util.modal(isNew ? 'New Part' : rec.name, body);
    function save() {
      const patch = {};
      body.querySelectorAll('[data-key]').forEach(i => {
        let val = i.value;
        if (i.dataset.key === 'tags') val = val.split(',').map(s => s.trim()).filter(Boolean);
        if (i.dataset.key === 'vinOk') val = val === 'true';
        if (['priceNewEg', 'priceUsedEg', 'laborEg', 'qty'].includes(i.dataset.key)) val = val === '' ? null : +val;
        patch[i.dataset.key] = val;
      });
      if (isNew) App.store.add('parts', patch); else App.store.update('parts', rec.id, patch);
      m.close(); App.router.go('parts', true); App.util.toast('Saved');
    }
  }
  function selectFrom(key, opts, cur) {
    const { el } = App.util;
    const s = el('select', { class: 'inp', data: { key } });
    opts.forEach(o => s.appendChild(el('option', { value: o, text: o, selected: String(cur) === String(o) ? 'selected' : null })));
    return s;
  }
  App._selectFrom = selectFrom;
})();
