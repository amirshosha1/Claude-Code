/* ============================================================
   App.crud — factory that turns a field schema into a full
   module (DataTable + add/edit/delete modal). Removes duplication
   across the simpler collection modules. Records auto-get
   id/createdAt/updatedAt/notes/tags/attachments from the store.
     spec: { id,label,group,icon,coll,fileno,ar,
             cols:[{key,label,sort,filter,render}],
             fields:[{key,label,type:'text|number|date|select|textarea',options?}],
             searchKeys:[], title }
   ============================================================ */
window.App = window.App || {};
App.crud = function (spec) {
  const { el } = App.util; const ui = App.ui;
  App.router.register({
    id: spec.id, label: spec.label, group: spec.group, icon: spec.icon, soon: spec.soon,
    render(view) {
      const rows = App.store.all(spec.coll);
      view.appendChild(ui.secHead(spec.fileno || '', spec.label, spec.ar || ''));
      if (spec.intro) { const c = el('div', { class: 'card', style: 'margin-bottom:16px' }, [el('div', { class: 'pad', html: spec.intro })]); view.appendChild(c); }
      const cols = spec.cols.slice();
      const dt = App.DataTable(cols, rows, {
        title: spec.title || spec.coll, pageSize: spec.pageSize || 12,
        searchKeys: spec.searchKeys || spec.fields.map(f => f.key),
        onRow: r => openForm(r),
        actions: [{ label: '+ Add', cls: 'rosso', fn: () => openForm(null) }].concat(spec.actions || [])
      });
      view.appendChild(dt);
    }
  });

  function openForm(rec) {
    const isNew = !rec; rec = rec || {};
    const { el } = App.util;
    const body = el('div');
    spec.fields.forEach(fl => {
      let input;
      if (fl.type === 'select') input = App._selectFrom(fl.key, fl.options, rec[fl.key]);
      else if (fl.type === 'textarea') input = el('textarea', { class: 'inp', rows: '2', data: { key: fl.key } }, rec[fl.key] || '');
      else input = el('input', { class: 'inp', type: fl.type || 'text', value: rec[fl.key] == null ? '' : rec[fl.key], data: { key: fl.key } });
      body.appendChild(el('label', { class: 'fld' }, [el('span', { class: 'lb', text: fl.label }), input]));
    });
    body.appendChild(el('label', { class: 'fld' }, [el('span', { class: 'lb', text: 'Tags (comma)' }), el('input', { class: 'inp', value: (rec.tags || []).join(', '), data: { key: 'tags' } })]));
    body.appendChild(el('label', { class: 'fld' }, [el('span', { class: 'lb', text: 'Notes' }), el('textarea', { class: 'inp', rows: '2', data: { key: 'notes' } }, rec.notes || '')]));
    body.appendChild(el('div', { style: 'display:flex;gap:8px;margin-top:8px' }, [
      el('button', { class: 'btn rosso', onclick: save }, isNew ? 'Add' : 'Save'),
      isNew ? null : el('button', { class: 'btn ghost', onclick: () => { App.store.remove(spec.coll, rec.id); m.close(); App.router.go(spec.id, true); App.util.toast('Deleted'); } }, 'Delete')
    ]));
    const m = App.util.modal(isNew ? 'New ' + spec.label : (rec[spec.fields[0].key] || 'Edit'), body);
    function save() {
      const patch = {};
      body.querySelectorAll('[data-key]').forEach(i => {
        let val = i.value;
        const fl = spec.fields.find(f => f.key === i.dataset.key);
        if (i.dataset.key === 'tags') val = val.split(',').map(s => s.trim()).filter(Boolean);
        else if (fl && fl.type === 'number') val = val === '' ? null : +val;
        patch[i.dataset.key] = val;
      });
      if (isNew) App.store.add(spec.coll, patch); else App.store.update(spec.coll, rec.id, patch);
      m.close(); App.router.go(spec.id, true); App.util.toast('Saved');
    }
  }
};
