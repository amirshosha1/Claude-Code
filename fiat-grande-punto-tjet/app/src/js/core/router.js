/* ============================================================
   App.router — module registry + hash routing + app shell
   Modules register with App.router.register({...}) and are
   rendered lazily into the view on navigation.
   ============================================================ */
window.App = window.App || {};
App.router = (function () {
  const { el, $ } = App.util;
  const modules = [];
  let current = null;

  function register(mod) { modules.push(mod); } // {id,label,icon,group,soon,render(el)}
  function get(id) { return modules.find(m => m.id === id); }

  const GROUPS = ['Overview', 'Vehicle', 'Money', 'Logistics', 'Archive', 'Insights'];

  function buildShell() {
    const v = App.store.veh();
    const app = el('div', { class: 'app' });

    /* sidebar */
    const side = el('aside', { class: 'side', id: 'side' });
    const brand = el('div', { class: 'brand' }, [
      el('div', { class: 'dno', text: '№ GP-2010-TJET · DOSSIER' }),
      el('h1', { html: 'GRANDE PUNTO <em>T-JET</em>' }),
      el('div', { class: 'veh', id: 'brandVeh', text: v.year + ' · ' + v.engine.split('(')[0].trim() })
    ]);
    side.appendChild(brand);

    // vehicle switcher (multi-vehicle ready)
    const sel = el('select', { class: 'inp veh-switch', id: 'vehSwitch', onchange: e => { App.store.setActiveVehicle(e.target.value); location.hash = '#/command'; go('command', true); } });
    App.store.vehicles().forEach(x => sel.appendChild(el('option', { value: x.id, text: x.make + ' ' + x.model + ' ' + x.year })));
    sel.value = App.store.state().activeVehicleId;
    side.appendChild(sel);

    GROUPS.forEach(g => {
      const items = modules.filter(m => m.group === g);
      if (!items.length) return;
      const grp = el('div', { class: 'nav-group' }, [el('div', { class: 'gt', text: g })]);
      items.forEach(m => grp.appendChild(el('div', {
        class: 'nav-item', data: { id: m.id }, role: 'button', tabindex: '0',
        onclick: () => go(m.id), onkeydown: e => { if (e.key === 'Enter') go(m.id); }
      }, [el('span', { class: 'ic', text: m.icon || '•' }), el('span', { text: m.label }),
        m.soon ? el('span', { class: 'soon', text: 'BETA' }) : null])));
      side.appendChild(grp);
    });

    /* main */
    const main = el('div', { class: 'main' });
    const topbar = el('div', { class: 'topbar' }, [
      el('button', { class: 'icon-btn hamb', 'aria-label': 'Menu', onclick: toggleSide }, '≡'),
      el('div', { class: 'crumb', id: 'crumb', html: 'GARAGE OS · <b>Command</b>' }),
      el('div', { class: 'spacer' }),
      searchBox(),
      el('button', { class: 'icon-btn', 'aria-label': 'Theme', 'data-tip': 'Light / Dark', onclick: toggleTheme }, '◐'),
      el('button', { class: 'icon-btn no-print', 'aria-label': 'Print', 'data-tip': 'Print', onclick: () => window.print() }, '⎙')
    ]);
    const view = el('main', { class: 'view', id: 'view' });
    main.appendChild(topbar); main.appendChild(view);

    const backdrop = el('div', { class: 'backdrop', id: 'backdrop', onclick: toggleSide });

    app.appendChild(side); app.appendChild(main);
    document.body.appendChild(app); document.body.appendChild(backdrop);
  }

  function searchBox() {
    const results = el('div', { class: 'search-results', id: 'searchResults' });
    const input = el('input', { class: 'inp', type: 'search', placeholder: 'Search parts, codes, invoices…', 'aria-label': 'Search',
      oninput: e => runSearch(e.target.value, results),
      onblur: () => setTimeout(() => results.classList.remove('open'), 180) });
    return el('div', { class: 'search-box' }, [input, results]);
  }
  function runSearch(q, box) {
    const res = App.store.search(q);
    box.innerHTML = '';
    if (!q) { box.classList.remove('open'); return; }
    if (!res.length) { box.appendChild(el('div', { class: 'sr-item' }, 'No matches')); box.classList.add('open'); return; }
    const collToMod = { parts: 'parts', faults: 'diagnostics', service: 'service', workshops: 'workshops', suppliers: 'suppliers', inventory: 'inventory', documents: 'documents' };
    res.forEach(r => box.appendChild(el('div', { class: 'sr-item', onmousedown: () => { go(collToMod[r.coll] || 'command'); } }, [
      el('div', { class: 't', text: r.label }), el('div', { class: 'm', text: r.coll.toUpperCase() + (r.rec.oem ? ' · ' + r.rec.oem : '') })
    ])));
    box.classList.add('open');
  }

  function toggleSide() { $('#side').classList.toggle('open'); $('#backdrop').classList.toggle('open'); }
  function toggleTheme() {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next); localStorage.setItem('gp-os-theme', next);
  }

  function go(id, force) {
    const mod = get(id) || get('command');
    if (current === mod.id && !force) return;
    current = mod.id;
    if (location.hash !== '#/' + id) history.replaceState(null, '', '#/' + id);
    App.util.$$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.id === mod.id));
    const crumb = $('#crumb'); if (crumb) crumb.innerHTML = 'GARAGE OS · <b>' + mod.label + '</b>';
    const view = $('#view'); view.innerHTML = ''; view.scrollTop = 0;
    mod.render(view);
    if (window.innerWidth <= 900) { $('#side').classList.remove('open'); $('#backdrop').classList.remove('open'); }
  }

  function start() {
    const saved = localStorage.getItem('gp-os-theme'); if (saved) document.documentElement.setAttribute('data-theme', saved);
    buildShell();
    const id = (location.hash || '').replace('#/', '') || 'command';
    go(id, true);
    window.addEventListener('hashchange', () => { const h = (location.hash || '').replace('#/', ''); if (h && h !== current) go(h); });
    App.store.subscribe(() => { const b = $('#brandVeh'); const v = App.store.veh(); if (b) b.textContent = v.year + ' · ' + v.engine.split('(')[0].trim(); });
  }

  return { register, get, go, start, modules: () => modules };
})();
