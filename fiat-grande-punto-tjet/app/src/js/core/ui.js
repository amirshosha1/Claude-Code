/* ============================================================
   App.ui — reusable component builders shared by all modules
   ============================================================ */
window.App = window.App || {};
App.ui = (function () {
  const { el, EGP, num } = App.util;

  function secHead(fileno, title, ar) {
    return el('div', { class: 'sec-head' }, [
      fileno ? el('span', { class: 'fileno', text: fileno }) : null,
      el('h2', { text: title }),
      el('div', { class: 'rule' }),
      ar ? el('span', { class: 'ar', text: ar }) : null
    ]);
  }

  function tile(k, v, sub, opts) {
    opts = opts || {};
    const vNode = el('div', { class: 'v' });
    const t = el('div', { class: 'tile' }, [
      el('div', { class: 'k', text: k }), vNode, sub ? el('div', { class: 'sub', text: sub }) : null
    ]);
    if (opts.count != null) App.util.countUp(vNode, opts.count, opts);
    else vNode.innerHTML = v;
    if (opts.color) vNode.style.color = opts.color;
    return t;
  }

  function dial(pct, label, sub, color) {
    const d = el('div', { class: 'dial' });
    d.innerHTML = App.util.gaugeSVG(0, color) +
      `<div class="val" style="color:${color || 'var(--amber)'}">${pct}%</div>` +
      `<div class="lab">${label}</div>` + (sub ? `<div class="sub">${sub}</div>` : '');
    // animate after mount
    setTimeout(() => {
      const deg = -90 + (pct / 100) * 180, off = 251 - (pct / 100) * 251;
      const n = d.querySelector('.needle'), a = d.querySelector('.arc');
      if (n) n.style.transform = 'rotate(' + deg + 'deg)';
      if (a) a.style.strokeDashoffset = off;
    }, 60);
    return d;
  }

  function meter(pct, cls) {
    const m = el('div', { class: 'meter' }); const f = el('div', { class: 'fill ' + (cls || 'f-amber') });
    m.appendChild(f); setTimeout(() => f.style.width = Math.min(100, pct) + '%', 60); return m;
  }

  function badge(text, cls) { return el('span', { class: 'badge ' + (cls || 'b-ink'), text }); }
  function verdict(v) {
    const map = { buy: ['buy', '✓ BUY'], hold: ['hold', '⏸ HOLD'], stop: ['stop', '✕ STOP'], later: ['later', '◷ LATER'], installed: ['installed', '● IN'] };
    const m = map[v] || map.buy; return el('span', { class: 'vd ' + m[0], text: m[1] });
  }

  function table(cols, rows) {
    const wrap = el('div', { class: 'tbl-scroll' });
    const t = el('table', { class: 'tbl' });
    const thead = el('thead', {}, [el('tr', {}, cols.map(c => el('th', { text: c })))]);
    const tb = el('tbody');
    rows.forEach(r => tb.appendChild(el('tr', { class: r._cls || '' }, r.cells.map(c =>
      el('td', typeof c === 'object' && c.nodeType ? {} : {}, [typeof c === 'object' && c && c.nodeType ? c : document.createTextNode(c == null ? '—' : c)])))));
    t.appendChild(thead); t.appendChild(tb); wrap.appendChild(t); return wrap;
  }

  function empty(msg) { return el('div', { class: 'empty', text: msg || 'No records yet.' }); }

  function priorityBadge(p) {
    const m = { critical: 'b-crit', high: 'b-high', medium: 'b-med', low: 'b-med', cosmetic: 'b-plan' };
    return badge((p || 'medium').toUpperCase(), m[p] || 'b-med');
  }

  return { secHead, tile, dial, meter, badge, verdict, table, empty, priorityBadge };
})();
