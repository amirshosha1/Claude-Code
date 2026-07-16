/* ============================================================
   App.router — module registry + hash routing + app shell

   Navigation model:
   - go(id) is the app-internal "navigate to a section" call. It always
     pushes a new history entry (history.pushState), so the Back/Forward
     buttons step through the sections a user actually visited.
   - popstate (fired only on Back/Forward, never by pushState itself) is
     handled by re-rendering the target route WITHOUT touching history
     again — otherwise Back would push yet another entry and trap you.
   - An invalid or missing hash is normalized to '#/command' via
     history.replaceState on first load, so a bad URL never lingers in
     the address bar while a different screen is shown underneath it.
   ============================================================ */
window.App = window.App || {};
App.router = (function () {
  const { el, $ } = App.util;
  const modules = [];
  let current = null;

  function register(mod) { modules.push(mod); } // {id,label,icon,group,soon,soonLabel,render(el)}
  function get(id) { return modules.find(m => m.id === id); }

  const GROUPS = ['Overview', 'Vehicle', 'Money', 'Logistics', 'Archive', 'Insights'];

  function buildShell() {
    const v = App.store.veh();
    const app = el('div', { class: 'app' });

    /* sidebar */
    const side = el('aside', { class: 'side', id: 'side' });
    const brand = el('div', { class: 'brand' }, [
      el('div', { class: 'dno', text: '№ GP-2010-TJET · DOSSIER' }),
      el('h1', { html: 'GRANDE PUNTO <em>T-JET</em>' }), // static developer literal, not stored data
      el('div', { class: 'veh', id: 'brandVeh', text: v.year + ' · ' + v.engine.split('(')[0].trim() })
    ]);
    side.appendChild(brand);

    // vehicle switcher (multi-vehicle ready)
    const sel = el('select', { class: 'inp veh-switch', id: 'vehSwitch', 'aria-label': 'Switch vehicle',
      onchange: e => { App.store.setActiveVehicle(e.target.value); go('command', true); } });
    App.store.vehicles().forEach(x => sel.appendChild(el('option', { value: x.id, text: x.make + ' ' + x.model + ' ' + x.year })));
    sel.value = App.store.state().activeVehicleId;
    side.appendChild(sel);

    GROUPS.forEach(g => {
      const items = modules.filter(m => m.group === g);
      if (!items.length) return;
      const grp = el('div', { class: 'nav-group' }, [el('div', { class: 'gt', text: g })]);
      items.forEach(m => grp.appendChild(el('button', {
        class: 'nav-item', type: 'button', data: { id: m.id }, onclick: () => go(m.id)
      }, [el('span', { class: 'ic', 'aria-hidden': 'true', text: m.icon || '•' }), el('span', { text: m.label }),
        m.soon ? el('span', { class: 'soon', text: m.soonLabel || 'BETA' }) : null])));
      side.appendChild(grp);
    });

    /* main */
    const main = el('div', { class: 'main' });
    const crumb = el('div', { class: 'crumb', id: 'crumb' }, ['GARAGE OS · ', el('b', { text: 'Command' })]);
    const topbar = el('div', { class: 'topbar' }, [
      el('button', { class: 'icon-btn hamb', type: 'button', 'aria-label': 'Toggle menu', onclick: toggleSide }, '≡'),
      crumb,
      el('div', { class: 'spacer' }),
      searchBox(),
      el('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Toggle light/dark theme', 'data-tip': 'Light / Dark', onclick: toggleTheme }, '◐'),
      el('button', { class: 'icon-btn no-print', type: 'button', 'aria-label': 'Print', 'data-tip': 'Print', onclick: () => window.print() }, '⎙')
    ]);
    const view = el('main', { class: 'view', id: 'view', tabindex: '-1' });
    main.appendChild(topbar); main.appendChild(view);

    const backdrop = el('div', { class: 'backdrop', id: 'backdrop', onclick: toggleSide });

    app.appendChild(side); app.appendChild(main);
    document.body.appendChild(app); document.body.appendChild(backdrop);

    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      const results = $('#searchResults'); if (results && results.classList.contains('open')) results.classList.remove('open');
      const s = $('#side'); if (s && s.classList.contains('open')) toggleSide();
    });
  }

  function searchBox() {
    const results = el('div', { class: 'search-results', id: 'searchResults', role: 'listbox' });
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
    res.forEach(r => box.appendChild(el('button', { class: 'sr-item', type: 'button', role: 'option',
      // onmousedown (not onclick) fires before the input's onblur hides this dropdown
      onmousedown: () => { go(collToMod[r.coll] || 'command'); } }, [
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

  /* Renders a route into the shell WITHOUT touching browser history —
     used for the initial load, popstate (Back/Forward), and anywhere
     else history is already correct (e.g. after a hash the browser
     itself just navigated to). */
  function renderRoute(id, force) {
    const mod = get(id) || get('command');
    if (current === mod.id && !force) return;
    current = mod.id;
    App.util.$$('.nav-item').forEach(n => {
      const active = n.dataset.id === mod.id;
      n.classList.toggle('active', active);
      if (active) n.setAttribute('aria-current', 'page'); else n.removeAttribute('aria-current');
    });
    const crumb = $('#crumb');
    if (crumb) { crumb.textContent = ''; crumb.appendChild(document.createTextNode('GARAGE OS · ')); crumb.appendChild(el('b', { text: mod.label })); }
    const view = $('#view'); view.innerHTML = ''; view.scrollTop = 0;
    mod.render(view);
    if (window.innerWidth <= 900) { $('#side').classList.remove('open'); $('#backdrop').classList.remove('open'); }
  }

  /* Public "navigate" entry point — always pushes history so Back/Forward
     work between sections a user actually visited. */
  function go(id, force) {
    const mod = get(id) || get('command');
    const target = '#/' + mod.id;
    if (location.hash !== target) history.pushState(null, '', target);
    renderRoute(mod.id, force);
  }

  function start() {
    const saved = localStorage.getItem('gp-os-theme'); if (saved) document.documentElement.setAttribute('data-theme', saved);
    buildShell();
    const raw = (location.hash || '').replace('#/', '');
    const isValid = !!(raw && get(raw));
    if (!isValid) history.replaceState(null, '', '#/command'); // normalize bad/missing hash, no ghost entry
    renderRoute(isValid ? raw : 'command', true);
    window.addEventListener('popstate', () => {
      const h = (location.hash || '').replace('#/', '');
      renderRoute(get(h) ? h : 'command', true);
    });
    App.store.subscribe(() => { const b = $('#brandVeh'); const v = App.store.veh(); if (b) b.textContent = v.year + ' · ' + v.engine.split('(')[0].trim(); });
  }

  return { register, get, go, start, modules: () => modules };
})();
