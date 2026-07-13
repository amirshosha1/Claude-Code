/* Settings — vehicle profile, preferences, backup/restore, feature
   flags (future extension points), notifications overview. */
(function () {
  const { el } = App.util; const ui = App.ui; const cfg = App.config;
  App.router.register({
    id: 'settings', label: 'Settings', group: 'Insights', icon: cfg.icon('settings'),
    render(view) {
      view.appendChild(ui.secHead('', 'Settings', 'الإعدادات'));
      const v = App.store.veh();

      /* vehicle profile */
      view.appendChild(section('Vehicle Profile', vehForm(v)));

      /* preferences */
      const c = cfg.get();
      const pref = el('div', { class: 'grid-3' }, [
        prefSelect('Theme', ['light', 'dark'], c.theme.mode, val => { cfg.setPath('theme', 'mode', val); document.documentElement.setAttribute('data-theme', val); localStorage.setItem('gp-os-theme', val); }),
        prefSelect('Language', ['en', 'ar'], c.locale.language, val => cfg.setPath('locale', 'language', val)),
        prefSelect('Distance', ['km', 'mi'], c.units.distance, val => cfg.setPath('units', 'distance', val)),
        prefText('Currency symbol', c.currency.symbol, val => cfg.setPath('currency', 'symbol', val)),
        prefText('Oil interval (km)', c.reminders.oilChangeKm, val => cfg.setPath('reminders', 'oilChangeKm', +val)),
        prefText('Timing belt (km)', c.reminders.timingBeltKm, val => cfg.setPath('reminders', 'timingBeltKm', +val))
      ]);
      view.appendChild(section('Preferences', pref));

      /* backup / restore */
      const backupUI = el('div', {}, [
        el('div', { class: 'qa', style: 'margin-bottom:12px' }, [
          el('button', { class: 'btn sm', onclick: exportBackup }, '⇩ Export JSON backup'),
          el('button', { class: 'btn sm ghost', onclick: importBackup }, '⇧ Import JSON'),
          el('button', { class: 'btn sm ghost', onclick: () => { App.store.snapshot('manual'); App.util.toast('Snapshot saved'); App.router.go('settings', true); } }, '📸 Snapshot now'),
          el('button', { class: 'btn sm ghost', onclick: () => { if (confirm('Reset ALL data to seed?')) { App.store.reset(); location.reload(); } } }, '⟲ Factory reset')
        ]),
        backupList()
      ]);
      view.appendChild(section('Backup & Restore', backupUI));

      /* future extension points */
      const flags = c.features;
      const fl = el('div', { class: 'grid-2' });
      [['obdLive', 'OBD-II Live Diagnostics'], ['aiAdvisor', 'AI Maintenance Advisor'], ['expenseForecast', 'Expense Forecasting'], ['vinDecoder', 'VIN Decoder'], ['ocrInvoice', 'OCR Invoice Scanner'], ['barcodeScanner', 'Barcode / QR Parts Scanner'], ['cloudSync', 'Cloud Sync'], ['multiUser', 'Multi-user Collaboration']].forEach(f => {
        fl.appendChild(el('label', { class: 'card', style: 'display:flex;justify-content:space-between;align-items:center;padding:11px 14px;cursor:pointer' }, [
          el('span', { text: f[1] }),
          (function () { const cb = el('input', { type: 'checkbox', checked: flags[f[0]] ? 'checked' : null }); cb.onchange = () => { cfg.setPath('features', f[0], cb.checked); App.util.toast(f[1] + (cb.checked ? ' enabled (stub)' : ' disabled')); }; return cb; })()
        ]));
      });
      view.appendChild(section('Extension Points (roadmap)', el('div', {}, [el('div', { class: 'mono muted', style: 'font-size:11px;margin-bottom:10px', text: 'Feature flags — flip on as each module is built. Data layer + UI hooks already exist.' }), fl])));
    }
  });

  function section(title, node) {
    return el('details', { class: 'exp', open: 'open' }, [el('summary', { text: title }), el('div', { class: 'exp-body' }, [node])]);
  }
  function vehForm(v) {
    const fields = [['make', 'Make'], ['model', 'Model'], ['year', 'Year'], ['vin', 'VIN'], ['engine', 'Engine'], ['transmission', 'Transmission'], ['mileage', 'Mileage (km)'], ['wheels', 'Wheels'], ['insuranceExpiry', 'Insurance expiry (date)'], ['licenseExpiry', 'License expiry (date)']];
    const body = el('div', { class: 'grid-3' });
    fields.forEach(f => body.appendChild(el('label', { class: 'fld' }, [el('span', { class: 'lb', text: f[1] }), el('input', { class: 'inp', value: v[f[0]] == null ? '' : v[f[0]], data: { key: f[0] } })])));
    const wrap = el('div', {}, [body, el('button', { class: 'btn rosso', style: 'margin-top:8px', onclick: () => { const p = {}; body.querySelectorAll('[data-key]').forEach(i => p[i.dataset.key] = i.dataset.key === 'mileage' || i.dataset.key === 'year' ? +i.value : i.value); App.store.setVeh(p); App.util.toast('Vehicle saved'); } }, 'Save Vehicle')]);
    return wrap;
  }
  function prefSelect(label, opts, cur, fn) {
    const s = App._selectFrom('x', opts, cur); s.onchange = () => fn(s.value);
    return el('label', { class: 'fld' }, [el('span', { class: 'lb', text: label }), s]);
  }
  function prefText(label, cur, fn) {
    const i = el('input', { class: 'inp', value: cur }); i.onchange = () => fn(i.value);
    return el('label', { class: 'fld' }, [el('span', { class: 'lb', text: label }), i]);
  }
  function exportBackup() {
    const a = el('a', { href: 'data:application/json;charset=utf-8,' + encodeURIComponent(App.store.exportJSON()), download: 'garage-os-backup-' + new Date().toISOString().slice(0, 10) + '.json' });
    document.body.appendChild(a); a.click(); a.remove(); App.util.toast('Backup exported');
  }
  function importBackup() {
    const inp = el('input', { type: 'file', accept: '.json', style: 'display:none' });
    inp.onchange = () => { const f = inp.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { App.store.importJSON(r.result); App.util.toast('Restored'); location.reload(); } catch (e) { App.util.toast('Invalid file'); } }; r.readAsText(f); };
    document.body.appendChild(inp); inp.click(); inp.remove();
  }
  function backupList() {
    const list = App.store.backups();
    if (!list.length) return ui.empty('No snapshots yet.');
    return App.DataTable([
      { key: 'at', label: 'When', render: r => App.util.shortDate(r.at) + ' ' + new Date(r.at).toLocaleTimeString() },
      { key: 'label', label: 'Label' },
      { key: '_r', label: '', render: r => el('button', { class: 'btn sm ghost', onclick: () => { if (confirm('Restore this snapshot?')) { App.store.restoreBackup(r.at); location.reload(); } } }, 'Restore') }
    ], list, { title: 'backups', pageSize: 5 });
  }
})();
