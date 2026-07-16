/* Settings — vehicle profile, preferences, backup/restore, cloud sync
   sign-in, and an honest list of what's shipped vs. planned. */
(function () {
  const { el } = App.util; const ui = App.ui; const cfg = App.config;
  App.router.register({
    id: 'settings', label: 'Settings', group: 'Insights', icon: cfg.icon('settings'),
    render(view) {
      view.appendChild(ui.secHead('', 'Settings', 'الإعدادات'));

      const notice = App.store.state().meta && App.store.state().meta.recoveryNotice;
      if (notice) view.appendChild(el('div', { class: 'card', style: 'margin-bottom:16px;border-color:var(--rosso)' }, [
        el('div', { class: 'pad', style: 'font-size:13px;line-height:1.6' }, [
          el('b', { style: 'color:var(--rosso)', text: '⚠ Data recovery notice: ' }), el('span', { text: notice })
        ])
      ]));

      const v = App.store.veh();
      view.appendChild(section('Vehicle Profile', vehForm(v)));

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

      view.appendChild(section('Backup & Restore', backupSection()));
      view.appendChild(section('Cloud Sync — Supabase', cloudForm()));
      view.appendChild(section('Shipped vs. Planned', featureList(c)));
    }
  });

  /* ---------------- Backup & Restore ---------------- */
  function backupSection() {
    const actions = el('div', { class: 'qa', style: 'margin-bottom:12px' }, [
      el('button', { class: 'btn sm', onclick: exportBackup }, '⇩ Export JSON backup'),
      el('button', { class: 'btn sm ghost', onclick: importBackup }, '⇧ Import JSON'),
      el('button', { class: 'btn sm ghost', onclick: () => { App.store.snapshot('manual'); App.util.toast('Snapshot saved'); App.router.go('settings', true); } }, '📸 Snapshot now'),
      el('button', { class: 'btn sm rosso', onclick: factoryReset }, '⟲ Factory reset (clears everything)')
    ]);
    const corrupt = App.store.corruptBackups();
    const corruptUI = corrupt.length ? el('div', { style: 'margin-top:14px' }, [
      el('div', { class: 'h-disp', style: 'font-size:13px;color:var(--rosso);margin-bottom:6px', text: 'Recovered Data (' + corrupt.length + ')' }),
      el('div', { class: 'mono muted', style: 'font-size:11px;margin-bottom:8px', text: 'Data that failed to load safely was preserved here instead of being silently discarded. Export or discard each.' }),
      el('div', { class: 'chips' }, corrupt.map(k => el('span', { class: 'tag' }, [
        el('span', { text: k.replace('gp-os-corrupt-', 'backup @ ') + '  ' }),
        el('button', { class: 'btn sm ghost', style: 'padding:1px 6px;font-size:9px', onclick: () => downloadCorrupt(k) }, '⇩'),
        el('button', { class: 'btn sm ghost', style: 'padding:1px 6px;font-size:9px', onclick: () => { if (confirm('Permanently discard this recovered copy?')) { App.store.discardCorruptBackup(k); App.router.go('settings', true); } } }, '✕')
      ])))
    ]) : null;
    return el('div', {}, [actions, backupList(), corruptUI].filter(Boolean));
  }
  function exportBackup() {
    const a = el('a', { href: 'data:application/json;charset=utf-8,' + encodeURIComponent(App.store.exportJSON()), download: 'garage-os-backup-' + new Date().toISOString().slice(0, 10) + '.json' });
    document.body.appendChild(a); a.click(); a.remove(); App.util.toast('Backup exported');
  }
  function downloadCorrupt(key) {
    const raw = App.store.readCorruptBackup(key) || '';
    const a = el('a', { href: 'data:application/json;charset=utf-8,' + encodeURIComponent(raw), download: key + '.json' });
    document.body.appendChild(a); a.click(); a.remove();
  }
  function importBackup() {
    const inp = el('input', { type: 'file', accept: '.json', style: 'display:none' });
    inp.onchange = () => {
      const f = inp.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try { App.store.importJSON(r.result); App.util.toast('Restored — a snapshot of your previous data was kept.'); location.reload(); }
        catch (e) { showError('Import failed', e.message || 'Unknown error'); }
      };
      r.readAsText(f);
    };
    document.body.appendChild(inp); inp.click(); inp.remove();
  }
  function factoryReset() {
    const msg = 'Factory reset clears EVERYTHING on this device: vehicle data, all snapshots, preferences, and any saved Supabase URL/key. This cannot be undone by this app.\n\nA backup will be downloaded automatically first. Continue?';
    if (!confirm(msg)) return;
    exportBackup();
    App.store.hardReset();
    cfg.reset();
    if (App.auth) App.auth.hardClear();
    App.util.toast('Everything cleared — reloading…');
    setTimeout(() => location.reload(), 400);
  }
  function backupList() {
    const list = App.store.backups();
    if (!list.length) return ui.empty('No snapshots yet.');
    return App.DataTable([
      { key: 'at', label: 'When', render: r => App.util.shortDate(r.at) + ' ' + new Date(r.at).toLocaleTimeString() },
      { key: 'label', label: 'Label' },
      { key: '_r', label: '', render: r => el('button', { class: 'btn sm ghost', onclick: () => {
        if (!confirm('Restore this snapshot? Current data will be replaced (a safety snapshot of it will not be auto-taken — export a backup first if unsure).')) return;
        const res = App.store.restoreBackup(r.at);
        if (res.ok) location.reload(); else showError('Restore failed', res.error);
      } }, 'Restore') }
    ], list, { title: 'backups', pageSize: 5 });
  }
  function showError(title, msg) {
    const body = el('div', {}, [el('pre', { style: 'white-space:pre-wrap;font-family:var(--mono);font-size:12px;background:var(--card2);padding:10px;border-radius:6px' }, msg)]);
    App.util.modal(title, body);
  }

  /* ---------------- Cloud Sync (Supabase Auth + sync) ---------------- */
  function cloudForm() {
    const c = cfg.get(); const cl = c.cloud;
    const fields = [['url', 'Supabase Project URL', 'https://xxxx.supabase.co'], ['anonKey', 'Anon public key', 'eyJ...'], ['table', 'Table name', 'garage_state'], ['rowId', 'Row id', 'gp-tjet-2010']];
    const body = el('div', { class: 'grid-2' });
    fields.forEach(f => body.appendChild(el('label', { class: 'fld' }, [el('span', { class: 'lb', text: f[1] }), el('input', { class: 'inp', value: cl[f[0]] || '', placeholder: f[2], data: { key: f[0] } })])));

    const signedIn = App.auth.isSignedIn(); const user = App.auth.getUser();
    const authBox = el('div', { style: 'margin-top:10px' });
    if (signedIn) {
      authBox.appendChild(el('div', { style: 'display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px' }, [
        el('span', { class: 'mono', style: 'font-size:12px' }, ['Signed in as ', el('b', { text: (user && user.email) || '(unknown)' })]),
        el('button', { class: 'btn sm ghost', onclick: async () => { await App.auth.signOut(); App.router.go('settings', true); } }, 'Sign out')
      ]));
    } else {
      const emailInp = el('input', { class: 'inp', type: 'email', placeholder: 'you@email.com' });
      const codeRow = el('div', { style: 'display:none;margin-top:8px;gap:8px', class: 'qa' });
      const codeInp = el('input', { class: 'inp', style: 'max-width:140px', placeholder: '6-digit code' });
      const sendBtn = el('button', { class: 'btn sm', onclick: async () => {
        if (!emailInp.value) return App.util.toast('Enter an email first');
        sendBtn.disabled = true; sendBtn.textContent = 'Sending…';
        const r = await App.auth.requestCode(emailInp.value.trim());
        sendBtn.disabled = false; sendBtn.textContent = 'Send code';
        if (r.ok) { codeRow.style.display = 'flex'; App.util.toast('Code sent — check your email'); } else App.util.toast('Failed: ' + r.error);
      } }, 'Send code');
      const verifyBtn = el('button', { class: 'btn rosso', onclick: async () => {
        const r = await App.auth.verifyCode(emailInp.value.trim(), codeInp.value.trim());
        if (r.ok) { App.util.toast('Signed in ✓'); App.router.go('settings', true); } else App.util.toast('Failed: ' + r.error);
      } }, 'Verify & sign in');
      codeRow.appendChild(codeInp); codeRow.appendChild(verifyBtn);
      authBox.appendChild(el('label', { class: 'fld' }, [el('span', { class: 'lb', text: 'Sign in (required for sync — scopes your data to your account only)' }), emailInp]));
      authBox.appendChild(el('div', { class: 'qa' }, [sendBtn]));
      authBox.appendChild(codeRow);
    }

    const stat = App.sync.status();
    const status = el('div', { class: 'mono muted', style: 'font-size:11px;margin:10px 0', text:
      'Status: ' + (stat.enabled ? 'ENABLED & signed in' : (!stat.signedIn ? 'sign in required' : (stat.ready ? 'configured (flag off)' : 'not configured'))) });
    const toggle = el('label', { class: 'fld', style: 'display:flex;gap:8px;align-items:center' }, [
      (function () { const cb = el('input', { type: 'checkbox', checked: c.features.cloudSync ? 'checked' : null, data: { key: '_enable' } }); return cb; })(),
      el('span', { class: 'lb', style: 'margin:0', text: 'Enable cloud sync' })
    ]);
    const wrap = el('div', {}, [
      el('div', { class: 'mono muted', style: 'font-size:11.5px;margin-bottom:10px', html:
        'Free Supabase + Cloudflare. Paste your project URL &amp; anon key, run the SQL in <b>HOSTING.md</b> (creates the table with row-level security scoped to your account), sign in below, enable the flag, Save.' }),
      body, authBox, toggle, status,
      el('div', { class: 'qa' }, [
        el('button', { class: 'btn sm rosso', onclick: save }, 'Save cloud config'),
        el('button', { class: 'btn sm ghost', onclick: doTest }, '🔌 Test connection'),
        el('button', { class: 'btn sm ghost', onclick: async () => { const r = await App.sync.push(); App.util.toast(r.ok ? 'Pushed to cloud ↑' : 'Push failed: ' + r.reason); } }, '↑ Push now'),
        el('button', { class: 'btn sm ghost', onclick: () => App.sync.syncNow() }, '↕ Sync now')
      ])
    ]);
    function save() {
      const patch = {};
      body.querySelectorAll('[data-key]').forEach(i => patch[i.dataset.key] = i.value.trim());
      cfg.set({ cloud: Object.assign({}, cl, patch) });
      cfg.setPath('features', 'cloudSync', toggle.querySelector('input').checked);
      App.util.toast('Cloud config saved'); App.sync.init(); App.router.go('settings', true);
    }
    async function doTest() { const r = await App.sync.test(); App.util.toast(r.ok ? (r.empty ? 'Connected ✓ (no row yet)' : 'Connected ✓ cloud row found') : 'Failed: ' + (r.reason || 'check URL/key/RLS/sign-in')); }
    return wrap;
  }
  /* ---------------- Shipped vs. Planned (no fake stub toggles) ---------------- */
  function featureList(c) {
    const shipped = [
      'Multi-vehicle data layer', 'Parts / Diagnostics / Service Book / Fuel / Budget / Planner',
      'Workshops / Suppliers / Inventory / Documents', 'Global search', 'JSON backup + restore + rolling snapshots',
      'Cloud sync with Supabase Auth + row-level security (once you sign in above)'
    ];
    const planned = ['OBD-II Live Diagnostics', 'AI Maintenance Advisor (currently: canned rule-based answers only, not a real AI)',
      'Expense Forecasting', 'VIN Decoder', 'OCR Invoice Scanner', 'Barcode / QR Parts Scanner', 'Multi-user Collaboration'];
    return el('div', {}, [
      el('div', { class: 'h-disp', style: 'font-size:13px;margin-bottom:6px', text: '✓ Shipped' }),
      el('ul', { style: 'margin:0 0 14px 18px;font-size:12.5px;line-height:1.7' }, shipped.map(s => el('li', { text: s }))),
      el('div', { class: 'h-disp', style: 'font-size:13px;margin-bottom:6px;color:var(--ink-soft)', text: '◷ Planned — not implemented yet' }),
      el('ul', { style: 'margin:0 0 0 18px;font-size:12.5px;line-height:1.7;color:var(--ink-soft)' }, planned.map(s => el('li', { text: s })))
    ]);
  }

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
})();
