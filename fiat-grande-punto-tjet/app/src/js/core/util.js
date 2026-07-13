/* ============================================================
   App.util — DOM + formatting helpers (namespaced, no ES imports
   so the bundle works over file:// offline)
   ============================================================ */
window.App = window.App || {};
App.util = (function () {
  function el(tag, attrs, children) {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else if (k.startsWith('on') && typeof attrs[k] === 'function') n.addEventListener(k.slice(2), attrs[k]);
      else if (k === 'data') for (const d in attrs[k]) n.dataset[d] = attrs[k][d];
      else if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    }
    (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c == null) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));

  const EGP = n => 'EGP ' + Math.round(+n || 0).toLocaleString('en-US');
  const num = n => (+n || 0).toLocaleString('en-US');
  function shortDate(d) { if (!d) return '—'; const t = new Date(d); return isNaN(t) ? d : t.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }

  function countUp(node, to, opts) {
    opts = opts || {}; const dur = opts.dur || 1100, dec = opts.dec || 0, pre = opts.pre || '', suf = opts.suf || '';
    let t0 = null;
    function step(ts) { if (!t0) t0 = ts; const p = Math.min((ts - t0) / dur, 1); const e = 1 - Math.pow(1 - p, 3);
      node.textContent = pre + (to * e).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
      if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }

  function toast(msg) {
    let t = $('#toast'); if (!t) { t = el('div', { id: 'toast' }); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2200);
  }

  function modal(title, bodyNode) {
    let back = $('#modalBack');
    if (!back) { back = el('div', { id: 'modalBack', class: 'modal-back' }); document.body.appendChild(back); }
    back.innerHTML = '';
    const close = () => back.classList.remove('open');
    const box = el('div', { class: 'modal' }, [
      el('div', { class: 'm-head' }, [el('h3', { text: title }), el('button', { class: 'x-btn', 'aria-label': 'Close', onclick: close }, '×')]),
      el('div', { class: 'm-body' }, [bodyNode])
    ]);
    back.appendChild(box);
    back.onclick = e => { if (e.target === back) close(); };
    back.classList.add('open');
    return { close };
  }

  function gaugeSVG(pct, color) {
    color = color || 'var(--amber)';
    const deg = -90 + (pct / 100) * 180, off = 251 - (pct / 100) * 251;
    return `<svg viewBox="0 0 200 120" role="img" aria-label="${pct} percent">
      <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="var(--line)" stroke-width="12" stroke-linecap="round"/>
      <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round" stroke-dasharray="251" stroke-dashoffset="${off}" class="arc"/>
      <line x1="100" y1="100" x2="100" y2="36" stroke="var(--ink)" stroke-width="3.5" stroke-linecap="round" class="needle" style="transform:rotate(${deg}deg)"/>
      <circle cx="100" cy="100" r="7" fill="var(--rosso)"/></svg>`;
  }

  return { el, $, $$, EGP, num, shortDate, countUp, toast, modal, gaugeSVG };
})();
