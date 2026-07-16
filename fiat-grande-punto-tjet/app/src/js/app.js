/* ============================================================
   Bootstrap — load config + store, mount router, wire the
   notification bell. Modules self-register on load (they run
   before this file per the include order in index.html/build).
   ============================================================ */
(function () {
  App.config.load();
  App.store.load();
  // auto-snapshot once per session for safety
  try { App.store.snapshot('session-open'); } catch (e) { }

  App.router.start();
  wireBell();

  // cloud sync (no-op unless configured + enabled in Settings)
  try { App.sync.init(); } catch (e) { }

  App.store.subscribe(() => updateBell());

  function wireBell() {
    const { el } = App.util;
    const topbar = App.util.$('.topbar');
    if (!topbar) return;
    const panel = el('div', { class: 'notif-panel', id: 'notifPanel' });
    const btn = el('button', { class: 'icon-btn bell', 'aria-label': 'Notifications', onclick: () => { renderPanel(panel); panel.classList.toggle('open'); } }, App.config.icon('notifications'));
    const wrap = el('div', { style: 'position:relative' }, [btn, panel]);
    // insert before theme button (after search)
    const spacer = topbar.querySelector('.spacer');
    topbar.insertBefore(wrap, spacer.nextSibling.nextSibling || null);
    document.addEventListener('click', e => { if (!wrap.contains(e.target)) panel.classList.remove('open'); });
    updateBell();
  }
  function updateBell() {
    const btn = App.util.$('.bell'); if (!btn) return;
    const n = App.notify.count();
    let dot = btn.querySelector('.dot');
    if (n > 0) { if (!dot) { dot = App.util.el('span', { class: 'dot' }); btn.appendChild(dot); } dot.textContent = n; }
    else if (dot) dot.remove();
  }
  function renderPanel(panel) {
    const { el } = App.util;
    const alerts = App.notify.evaluate();
    panel.innerHTML = '';
    panel.appendChild(el('div', { style: 'padding:10px 12px;border-bottom:1.5px solid var(--ink)', class: 'h-disp', text: 'Notifications (' + alerts.length + ')' }));
    if (!alerts.length) panel.appendChild(el('div', { class: 'pad muted mono', style: 'font-size:12px', text: 'All clear.' }));
    alerts.forEach(a => panel.appendChild(el('div', { class: 'sr-item' }, [
      el('div', { class: 't', text: a.title }), el('div', { class: 'm', text: (a.kind || '').toUpperCase() + ' · ' + a.detail })
    ])));
  }

  // keyboard: '/' focuses search
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      const s = App.util.$('.search-box input'); if (s) { e.preventDefault(); s.focus(); }
    }
  });
})();
