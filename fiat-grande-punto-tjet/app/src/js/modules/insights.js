/* Insight modules — real screens bound to the shared data layer.
   Analytics + Roadmap are fully data-driven; Value, Photos, Search,
   AI Assistant have complete UI/data structure, expandable later. */
(function () {
  const { el } = App.util; const ui = App.ui; const money = App.config.money;

  /* ---- Analytics ---- */
  App.router.register({
    id: 'analytics', label: 'Analytics', group: 'Insights', icon: App.config.icon('analytics'),
    render(view) {
      const d = App.store.veh().data;
      view.appendChild(ui.secHead('15', 'Analytics', 'تحليلات'));
      // spend by year (from service)
      const byYear = {}; d.service.forEach(s => { const y = (s.date || '').slice(0, 4) || '?'; byYear[y] = (byYear[y] || 0) + (s.paid || 0); });
      view.appendChild(barChart('Repair spend by year (EGP)', Object.keys(byYear).sort().map(k => ({ label: k, val: byYear[k] }))));
      // spend by category (budget spent)
      view.appendChild(barChart('Budget spent by category', d.budget.filter(c => c.spent).map(c => ({ label: c.cat, val: c.spent }))));
      // most expensive repairs
      view.appendChild(el('h3', { class: 'h-disp', style: 'font-size:16px;margin:18px 0 10px', text: 'Most expensive repairs' }));
      const top = d.service.slice().sort((a, b) => (b.paid || 0) - (a.paid || 0)).slice(0, 6);
      view.appendChild(App.DataTable([{ key: 'work', label: 'Work', sort: true }, { key: 'date', label: 'Date', render: r => App.util.shortDate(r.date) }, { key: 'paid', label: 'Paid', sort: true, render: r => money(r.paid) }], top, { title: 'top-repairs', pageSize: 6 }));
    }
  });

  function barChart(title, data) {
    const card = el('div', { class: 'card', style: 'margin-bottom:16px' });
    const max = Math.max.apply(null, data.map(d => d.val).concat([1]));
    let bars = data.map(d => `<div style="display:flex;align-items:center;gap:10px;margin:6px 0">
      <span class="mono" style="width:64px;font-size:10px;color:var(--ink-soft);text-align:right">${d.label}</span>
      <div style="flex:1;background:var(--paper);border:1.5px solid var(--ink);border-radius:3px;height:18px;overflow:hidden">
        <div style="height:100%;width:${(d.val / max) * 100}%;background:repeating-linear-gradient(-45deg,var(--rosso-deep) 0 8px,var(--rosso) 8px 16px)"></div></div>
      <span class="mono" style="width:78px;font-size:11px">${App.util.num(d.val)}</span></div>`).join('');
    if (!data.length) bars = '<div class="empty">No data yet.</div>';
    card.innerHTML = `<div class="pad"><div class="mono muted" style="font-size:10px;letter-spacing:.14em;text-transform:uppercase;margin-bottom:8px">${title}</div>${bars}</div>`;
    return card;
  }

  /* ---- Restoration Roadmap ---- */
  App.router.register({
    id: 'roadmap', label: 'Restoration Roadmap', group: 'Insights', icon: App.config.icon('roadmap'),
    render(view) {
      const d = App.store.veh().data;
      view.appendChild(ui.secHead('13', 'Restoration Roadmap', 'خريطة الترميم'));
      const grid = el('div', { class: 'grid-2 stagger' });
      d.roadmap.forEach(p => {
        const card = el('div', { class: 'card' }, [el('div', { class: 'spine', style: 'background:var(--rosso)' })]);
        card.appendChild(el('div', { class: 'pad' }, [
          el('div', { style: 'display:flex;justify-content:space-between;align-items:baseline' }, [
            el('span', { class: 'h-disp', style: 'font-size:16px', text: 'Phase ' + p.phase + ' · ' + p.title }),
            el('span', { class: 'mono', style: 'font-size:12px', text: money(p.budget) })]),
          ui.meter(p.progress, p.progress >= 100 ? 'f-green' : 'f-amber'),
          el('div', { class: 'mono muted', style: 'font-size:11px;margin-top:6px', text: p.note })
        ]));
        grid.appendChild(card);
      });
      view.appendChild(grid);
    }
  });

  /* ---- Vehicle Value ---- */
  App.router.register({
    id: 'value', label: 'Vehicle Value', group: 'Insights', icon: App.config.icon('value'),
    render(view) {
      const v = App.store.veh(); const val = v.data.value;
      const invested = v.data.installed.reduce((s, x) => s + (x.paid || 0), 0) + (val.invested || 0);
      view.appendChild(ui.secHead('14', 'Vehicle Value', 'قيمة العربية'));
      view.appendChild(el('div', { class: 'tiles stagger' }, [
        ui.tile('Purchase (' + (val.purchaseYear || '') + ')', money(val.purchase), 'buy-in'),
        ui.tile('Invested', money(invested), 'documented repairs', { color: 'var(--green)' }),
        ui.tile('Repairs ahead', money(val.repairEstimate), 'Phase 1–2 est.', { color: 'var(--amber)' }),
        ui.tile('Market value', money(val.estResale), 'today', { color: 'var(--steel)' })
      ]));
      const nominal = val.estResale - val.purchase;
      // real-terms in USD: 2013 EGP≈6.9/USD, 2026≈48/USD
      const usdThen = Math.round(val.purchase / 6.9), usdNow = Math.round(val.estResale / 48);
      view.appendChild(el('div', { class: 'card', style: 'margin-top:16px' }, [el('div', { class: 'pad' }, [
        el('div', { class: 'mono muted', style: 'font-size:10px;letter-spacing:.14em;text-transform:uppercase', text: 'Nominal change (EGP)' }),
        el('div', { class: 'h-disp', style: 'font-size:26px;margin-top:4px;color:var(--green)', text: '+' + money(nominal) }),
        el('div', { class: 'mono muted', style: 'font-size:11.5px;margin-top:8px;line-height:1.7', html:
          'Reality check: most of that "gain" is <b>EGP devaluation</b>, not real appreciation.<br>' +
          'In USD: bought ≈ <b>$' + usdThen.toLocaleString() + '</b> (2013) → worth ≈ <b>$' + usdNow.toLocaleString() + '</b> today.<br>' +
          'So in real terms it depreciated like a normal car. The win is <b>cheap, reliable motoring</b> if kept — restoration is for keeping, not profit.' })
      ])]));
    }
  });

  /* ---- Photo Timeline ---- */
  App.router.register({
    id: 'photos', label: 'Photo Timeline', group: 'Archive', icon: App.config.icon('photos'), soon: true,
    render(view) {
      const d = App.store.veh().data;
      view.appendChild(ui.secHead('12', 'Photo Timeline', 'ألبوم قبل / بعد'));
      view.appendChild(el('div', { class: 'card', style: 'margin-bottom:16px' }, [el('div', { class: 'pad mono muted', style: 'font-size:11.5px', text: 'Before / during / after per repair. Attach images to any record (data model ready: record.attachments[]).' })]));
      ['before', 'during', 'after'].forEach(stage => {
        const items = d.photos.filter(p => p.stage === stage);
        view.appendChild(el('h3', { class: 'h-disp', style: 'font-size:15px;margin:14px 0 8px', text: stage.toUpperCase() }));
        const g = el('div', { class: 'grid-3' });
        if (!items.length) g.appendChild(ui.empty('No ' + stage + ' photos linked.'));
        items.forEach(p => g.appendChild(el('div', { class: 'card' }, [el('div', { class: 'pad' }, [el('div', { style: 'height:80px;border:1.5px dashed var(--line-strong);border-radius:6px;display:grid;place-items:center;color:var(--ink-soft)', text: '🖼' }), el('div', { style: 'font-size:12px;margin-top:6px', text: p.label }), el('div', { class: 'mono muted', style: 'font-size:10px', text: p.date })])])));
        view.appendChild(g);
      });
    }
  });

  /* ---- Search (dedicated page) ---- */
  App.router.register({
    id: 'search', label: 'Search Engine', group: 'Archive', icon: App.config.icon('search'),
    render(view) {
      view.appendChild(ui.secHead('16', 'Global Search', 'بحث شامل'));
      const out = el('div');
      const input = el('input', { class: 'inp', type: 'search', placeholder: 'Search parts, OEM, fault codes, invoices, workshops…', style: 'max-width:420px', oninput: e => run(e.target.value) });
      view.appendChild(input); view.appendChild(el('div', { style: 'height:14px' })); view.appendChild(out);
      function run(q) {
        const res = App.store.search(q); out.innerHTML = '';
        if (!q) { out.appendChild(ui.empty('Type to search everything in this vehicle.')); return; }
        if (!res.length) { out.appendChild(ui.empty('No matches.')); return; }
        const collToMod = { parts: 'parts', faults: 'diagnostics', service: 'service', workshops: 'workshops', suppliers: 'suppliers', inventory: 'inventory', documents: 'documents' };
        res.forEach(r => out.appendChild(el('div', { class: 'card card-hover', style: 'margin-bottom:8px;cursor:pointer', onclick: () => App.router.go(collToMod[r.coll]) }, [
          el('div', { class: 'pad' }, [el('b', { text: r.label }), el('span', { class: 'mono muted', style: 'float:right;font-size:10px', text: r.coll.toUpperCase() }), r.rec.oem ? el('div', { class: 'mono', style: 'font-size:11px;color:var(--rosso)', text: r.rec.oem }) : null])
        ])));
      }
      run('');
    }
  });

  /* ---- AI Assistant (UI only; no AI wired) ---- */
  App.router.register({
    id: 'assistant', label: 'AI Assistant', group: 'Insights', icon: App.config.icon('assistant'), soon: true,
    render(view) {
      view.appendChild(ui.secHead('17', 'AI Maintenance Advisor', 'مستشار الصيانة'));
      view.appendChild(el('div', { class: 'card', style: 'margin-bottom:14px' }, [el('div', { class: 'pad mono muted', style: 'font-size:11.5px', html: '🧠 Extension point — UI ready, no AI wired yet (flag <code>aiAdvisor</code>). It will reason over the same data layer (parts, faults, fuel, budget).' })]));
      const qs = ['Why is fuel consumption increasing?', 'What should I repair first?', 'What can safely wait?', 'Am I over budget in any category?'];
      const chat = el('div', { class: 'card' }, [el('div', { class: 'pad' })]);
      const pad = chat.querySelector('.pad');
      qs.forEach(q => pad.appendChild(el('button', { class: 'btn sm ghost', style: 'margin:0 6px 8px 0', onclick: () => answer(q) }, q)));
      const ans = el('div', { style: 'margin-top:10px' }); pad.appendChild(ans);
      view.appendChild(chat);
      function answer(q) {
        const d = App.store.veh().data; let txt = '';
        if (/fuel/i.test(q)) txt = 'Top suspects from your data: torn intake hose (51822558), overdue plugs, then a smoke test + fuel-trim read. Fix the hose first and re-measure.';
        else if (/first/i.test(q)) txt = 'Critical open faults: ' + d.faults.filter(f => !f.solved && f.priority === 'critical').map(f => f.code).join(', ') + '. Start with the rear-harness wiring (B1023) + coolant leak + intake hose.';
        else if (/wait/i.test(q)) txt = 'Safe to defer: radiator (pending pressure test), front shocks (inspect first), all Phase 2–3 cosmetic items.';
        else txt = 'Categories over budget: ' + (d.budget.filter(c => c.spent > c.budget).map(c => c.cat).join(', ') || 'none yet') + '.';
        ans.innerHTML = '<div class="card" style="border-color:var(--steel)"><div class="pad" style="font-size:13px;line-height:1.6"><b class="mono" style="color:var(--steel)">ADVISOR ·</b> ' + txt + '</div></div>';
      }
    }
  });
})();
