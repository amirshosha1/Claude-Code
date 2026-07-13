/* ============================================================
   App.DataTable — reusable production table:
   search · column sort · filters · pagination · CSV export.
   Config-driven; used by Parts, Service, Fuel, Inventory, etc.
     cols:  [{key,label,render?(row)->node|string, sort?:true, filter?:[values]}]
     rows:  array of records
     opts:  {pageSize, searchKeys, title, onRow(row), actions:[{label,fn}]}
   ============================================================ */
window.App = window.App || {};
App.DataTable = function (cols, rows, opts) {
  const { el } = App.util;
  opts = opts || {};
  const pageSize = opts.pageSize || 12;
  let q = '', sortKey = null, sortDir = 1, page = 1;
  const filters = {};

  const root = el('div', { class: 'dt' });
  const bar = el('div', { class: 'dt-bar' });
  const body = el('div');
  root.appendChild(bar); root.appendChild(body);

  function filtered() {
    let data = rows.slice();
    if (q) {
      const keys = opts.searchKeys || cols.map(c => c.key);
      const s = q.toLowerCase();
      data = data.filter(r => keys.some(k => (r[k] == null ? '' : String(r[k])).toLowerCase().includes(s)));
    }
    Object.keys(filters).forEach(k => { if (filters[k]) data = data.filter(r => String(r[k]) === filters[k]); });
    if (sortKey) data.sort((a, b) => {
      let x = a[sortKey], y = b[sortKey];
      if (typeof x === 'number' && typeof y === 'number') return (x - y) * sortDir;
      return String(x == null ? '' : x).localeCompare(String(y == null ? '' : y)) * sortDir;
    });
    return data;
  }

  function exportCSV() {
    const data = filtered();
    const head = cols.map(c => '"' + c.label + '"').join(',');
    const lines = data.map(r => cols.map(c => '"' + String(r[c.key] == null ? '' : r[c.key]).replace(/"/g, '""') + '"').join(','));
    const csv = [head].concat(lines).join('\n');
    const a = el('a', { href: 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv), download: (opts.title || 'export') + '.csv' });
    document.body.appendChild(a); a.click(); a.remove();
    App.util.toast('CSV exported (' + data.length + ' rows)');
  }

  function renderBar() {
    bar.innerHTML = '';
    const search = el('input', { class: 'inp dt-search', type: 'search', placeholder: 'Search…', value: q,
      oninput: e => { q = e.target.value; page = 1; render(); } });
    bar.appendChild(search);
    cols.filter(c => c.filter).forEach(c => {
      const sel = el('select', { class: 'inp dt-filter', onchange: e => { filters[c.key] = e.target.value; page = 1; render(); } });
      sel.appendChild(el('option', { value: '', text: c.label + ': all' }));
      c.filter.forEach(v => sel.appendChild(el('option', { value: v, text: v, selected: filters[c.key] === v ? 'selected' : null })));
      bar.appendChild(sel);
    });
    const spacer = el('div', { class: 'dt-spacer' }); bar.appendChild(spacer);
    (opts.actions || []).forEach(a => bar.appendChild(el('button', { class: 'btn sm ' + (a.cls || 'ghost'), onclick: a.fn }, a.label)));
    bar.appendChild(el('button', { class: 'btn sm ghost', onclick: exportCSV, 'data-tip': 'Export CSV' }, '⇩ CSV'));
  }

  function render() {
    renderBar();
    const data = filtered();
    const pages = Math.max(1, Math.ceil(data.length / pageSize));
    if (page > pages) page = pages;
    const slice = data.slice((page - 1) * pageSize, page * pageSize);

    const wrap = el('div', { class: 'tbl-scroll' });
    const t = el('table', { class: 'tbl' });
    const thead = el('thead', {}, [el('tr', {}, cols.map(c => {
      const arrow = sortKey === c.key ? (sortDir === 1 ? ' ▲' : ' ▼') : '';
      return el('th', { style: c.sort ? 'cursor:pointer' : '', onclick: c.sort ? () => { if (sortKey === c.key) sortDir *= -1; else { sortKey = c.key; sortDir = 1; } render(); } : null }, (c.label + arrow));
    }))]);
    const tb = el('tbody');
    if (!slice.length) tb.appendChild(el('tr', {}, [el('td', { colspan: cols.length }, [App.ui.empty('No matching records.')])]));
    slice.forEach(r => {
      const tr = el('tr', { class: r._dim ? 'dim' : '', style: opts.onRow ? 'cursor:pointer' : '', onclick: opts.onRow ? () => opts.onRow(r) : null },
        cols.map(c => {
          const v = c.render ? c.render(r) : (r[c.key] == null ? '—' : r[c.key]);
          return el('td', {}, [typeof v === 'object' && v && v.nodeType ? v : document.createTextNode(String(v))]);
        }));
      tb.appendChild(tr);
    });
    t.appendChild(thead); t.appendChild(tb); wrap.appendChild(t);

    const foot = el('div', { class: 'dt-foot' }, [
      el('span', { class: 'mono muted', text: data.length + ' record' + (data.length === 1 ? '' : 's') }),
      el('div', { class: 'dt-pager' }, [
        el('button', { class: 'btn sm ghost', disabled: page <= 1 ? 'disabled' : null, onclick: () => { page--; render(); } }, '‹'),
        el('span', { class: 'mono', text: page + ' / ' + pages }),
        el('button', { class: 'btn sm ghost', disabled: page >= pages ? 'disabled' : null, onclick: () => { page++; render(); } }, '›')
      ])
    ]);

    body.innerHTML = ''; body.appendChild(wrap); body.appendChild(foot);
  }

  render();
  return root;
};
