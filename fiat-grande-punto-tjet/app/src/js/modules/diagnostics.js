/* Diagnostics Center — fault codes with root cause, probability, scan log */
(function () {
  const { el } = App.util; const ui = App.ui;
  App.router.register({
    id: 'diagnostics', label: 'Diagnostics Center', group: 'Vehicle', icon: App.config.icon('diagnostics'),
    render(view) {
      const d = App.store.veh().data;
      view.appendChild(ui.secHead('04', 'Diagnostics Center', 'مركز الأعطال'));

      // summary tiles
      const open = d.faults.filter(f => !f.solved);
      const crit = open.filter(f => f.priority === 'critical');
      const tiles = el('div', { class: 'tiles', style: 'margin-bottom:16px' }, [
        ui.tile('Open Faults', String(open.length), '', { color: 'var(--rosso)' }),
        ui.tile('Critical', String(crit.length), '', { color: 'var(--rosso)' }),
        ui.tile('Scans logged', String(d.scans.length), ''),
        ui.tile('Root theme', 'CAN', 'post-impact wiring', { color: 'var(--steel)' })
      ]);
      view.appendChild(tiles);

      // fault cards (expandable)
      const list = el('div', { class: 'stagger' });
      d.faults.forEach(f => {
        const det = el('details', { class: 'exp' });
        det.appendChild(el('summary', {}, [
          el('span', {}, [el('span', { class: 'mono', style: 'color:var(--rosso);font-weight:700', text: f.code }), '  ', el('span', { text: f.system })]),
          el('span', { class: 'chips' }, [ui.priorityBadge(f.priority), f.solved ? ui.badge('SOLVED', 'b-done') : ui.badge(f.state || 'OPEN', 'b-high')])
        ]));
        const kv = el('div', { class: 'kv', style: 'margin-top:6px' });
        [['Description', f.desc], ['Symptom', f.symptom], ['Root cause', f.root], ['Probability', (f.prob || 0) + '%'], ['Est. fix', f.cost]].forEach(p =>
          { kv.appendChild(el('div', { class: 'k', text: p[0] })); kv.appendChild(el('div', { text: p[1] || '—' })); });
        const actions = el('div', { style: 'margin-top:10px;display:flex;gap:8px' }, [
          el('button', { class: 'btn sm ' + (f.solved ? 'ghost' : 'rosso'), onclick: () => { App.store.update('faults', f.id, { solved: !f.solved }); App.router.go('diagnostics', true); } }, f.solved ? 'Mark unsolved' : 'Mark solved')
        ]);
        det.appendChild(el('div', { class: 'exp-body' }, [kv, actions]));
        list.appendChild(det);
      });
      view.appendChild(list);

      // scan history
      view.appendChild(el('h3', { class: 'h-disp', style: 'font-size:16px;margin:20px 0 10px', text: 'Scan History' }));
      view.appendChild(App.DataTable(
        [{ key: 'date', label: 'Date', sort: true, render: r => App.util.shortDate(r.date) }, { key: 'tool', label: 'Tool' }, { key: 'by', label: 'By' }, { key: 'note', label: 'Note' }],
        d.scans, { title: 'scans', pageSize: 6, actions: [{ label: '+ Add Scan', cls: 'rosso', fn: addScan }] }
      ));

      // extension point note
      const ext = el('div', { class: 'card', style: 'margin-top:16px' }, [el('div', { class: 'pad mono muted', style: 'font-size:11.5px', html: '🔌 Extension point ready: <b>OBD-II Live Diagnostics</b> (feature flag <code>obdLive</code>) — will stream live PIDs into this module without UI changes.' })]);
      view.appendChild(ext);
    }
  });

  function addScan() {
    const { el } = App.util;
    const body = el('div', {}, [
      lbl('Date', el('input', { class: 'inp', type: 'date', data: { key: 'date' } })),
      lbl('Tool', el('input', { class: 'inp', value: 'AlfaOBD', data: { key: 'tool' } })),
      lbl('By', el('input', { class: 'inp', data: { key: 'by' } })),
      lbl('Note', el('textarea', { class: 'inp', rows: '2', data: { key: 'note' } })),
      el('button', { class: 'btn rosso', style: 'margin-top:8px', onclick: save }, 'Add Scan')
    ]);
    const m = App.util.modal('New Scan', body);
    function save() { const p = {}; body.querySelectorAll('[data-key]').forEach(i => p[i.dataset.key] = i.value); App.store.add('scans', p); m.close(); App.router.go('diagnostics', true); App.util.toast('Scan logged'); }
    function lbl(t, n) { return el('label', { class: 'fld' }, [el('span', { class: 'lb', text: t }), n]); }
  }
})();
