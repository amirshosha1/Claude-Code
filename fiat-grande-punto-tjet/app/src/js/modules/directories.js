/* Directory-style modules built from schemas via App.crud:
   Service Book · Maintenance Planner · Workshops · Suppliers ·
   Garage Inventory · Documents Vault. All share the data store. */
(function () {
  const num = App.util.num, money = App.config.money, sd = App.util.shortDate, ui = App.ui;

  /* ---- Digital Service Book ---- */
  App.crud({
    id: 'service', label: 'Digital Service Book', group: 'Vehicle', icon: App.config.icon('service'), fileno: '05', ar: 'دفتر الصيانة',
    coll: 'service', title: 'service-book', searchKeys: ['work', 'workshop', 'mechanic', 'parts', 'date'],
    cols: [
      { key: 'date', label: 'Date', sort: true, render: r => sd(r.date) },
      { key: 'km', label: 'KM', sort: true, render: r => num(r.km) },
      { key: 'work', label: 'Work', sort: true },
      { key: 'workshop', label: 'Workshop' },
      { key: 'paid', label: 'Paid', sort: true, render: r => r.paid ? money(r.paid) : '—' }
    ],
    fields: [
      { key: 'date', label: 'Date', type: 'date' }, { key: 'km', label: 'Mileage (km)', type: 'number' },
      { key: 'work', label: 'Work done' }, { key: 'workshop', label: 'Workshop' }, { key: 'mechanic', label: 'Mechanic' },
      { key: 'parts', label: 'Parts used' }, { key: 'labor', label: 'Labor (EGP)', type: 'number' },
      { key: 'paid', label: 'Total paid (EGP)', type: 'number' }, { key: 'invoice', label: 'Invoice #' },
      { key: 'warranty', label: 'Warranty' }, { key: 'warrantyExpiry', label: 'Warranty expiry', type: 'date' }
    ]
  });

  /* ---- Maintenance Planner ---- */
  App.crud({
    id: 'planner', label: 'Maintenance Planner', group: 'Vehicle', icon: App.config.icon('planner'), fileno: '08', ar: 'مخطط الصيانة',
    coll: 'planner', title: 'planner', searchKeys: ['title', 'kind'],
    cols: [
      { key: 'title', label: 'Task', sort: true },
      { key: 'dueKm', label: 'Due KM', sort: true, render: r => r.dueKm ? num(r.dueKm) : '—' },
      { key: 'dueDate', label: 'Due Date', sort: true, render: r => sd(r.dueDate) },
      { key: 'kind', label: 'Type', filter: ['service', 'brakes', 'critical', 'inspection'] },
      { key: 'done', label: 'Done', render: r => r.done ? ui.badge('DONE', 'b-done') : ui.badge('OPEN', 'b-high') }
    ],
    fields: [
      { key: 'title', label: 'Task' }, { key: 'dueKm', label: 'Due at km', type: 'number' },
      { key: 'dueDate', label: 'Due date', type: 'date' },
      { key: 'kind', label: 'Type', type: 'select', options: ['service', 'brakes', 'critical', 'inspection'] },
      { key: 'done', label: 'Done', type: 'select', options: ['false', 'true'] }
    ]
  });

  /* ---- Workshop Directory ---- */
  App.crud({
    id: 'workshops', label: 'Workshop Directory', group: 'Logistics', icon: App.config.icon('workshops'), fileno: '09', ar: 'دليل الورش',
    coll: 'workshops', title: 'workshops', searchKeys: ['name', 'spec', 'phone'],
    cols: [
      { key: 'name', label: 'Workshop', sort: true }, { key: 'spec', label: 'Specialization' },
      { key: 'phone', label: 'Phone', render: r => r.phone ? App.util.el('a', { class: 'mono', href: 'tel:' + r.phone, text: r.phone }) : '—' },
      { key: 'rating', label: 'Rating', sort: true, render: r => '★'.repeat(r.rating || 0) },
      { key: 'price', label: 'Price' },
      { key: 'maps', label: 'Map', render: r => r.maps ? App.util.el('a', { href: r.maps, target: '_blank', text: '📍' }) : '—' }
    ],
    fields: [
      { key: 'name', label: 'Workshop' }, { key: 'spec', label: 'Specialization' }, { key: 'phone', label: 'Phone' },
      { key: 'rating', label: 'Rating (1-5)', type: 'number' }, { key: 'price', label: 'Price level ($/$$/$$$)' },
      { key: 'maps', label: 'Google Maps URL' }
    ]
  });

  /* ---- Suppliers ---- */
  App.crud({
    id: 'suppliers', label: 'Suppliers', group: 'Logistics', icon: App.config.icon('suppliers'), fileno: '10', ar: 'الموردون',
    coll: 'suppliers', title: 'suppliers', searchKeys: ['name', 'contact', 'brands'],
    cols: [
      { key: 'name', label: 'Supplier', sort: true },
      { key: 'contact', label: 'Contact', render: r => r.contact ? App.util.el('span', { class: 'mono', text: r.contact }) : '—' },
      { key: 'whatsapp', label: 'WhatsApp', render: r => r.whatsapp ? App.util.el('a', { href: 'https://wa.me/' + r.whatsapp.replace(/\D/g, ''), target: '_blank', text: '💬' }) : '—' },
      { key: 'brands', label: 'Brands' }
    ],
    fields: [
      { key: 'name', label: 'Supplier' }, { key: 'contact', label: 'Contact / phone' }, { key: 'whatsapp', label: 'WhatsApp' },
      { key: 'website', label: 'Website' }, { key: 'brands', label: 'Brands / OEM availability' }, { key: 'delivery', label: 'Delivery' }
    ]
  });

  /* ---- Garage Inventory ---- */
  App.crud({
    id: 'inventory', label: 'Garage Inventory', group: 'Logistics', icon: App.config.icon('inventory'), fileno: '11', ar: 'مخزن الجراج',
    coll: 'inventory', title: 'inventory', searchKeys: ['item', 'category', 'location'],
    cols: [
      { key: 'item', label: 'Item', sort: true }, { key: 'category', label: 'Category', sort: true, filter: ['Fluids', 'Filters', 'Tools', 'Bulbs', 'Fuses', 'Spare Parts', 'Cleaning'] },
      { key: 'qty', label: 'Qty', sort: true }, { key: 'location', label: 'Location' }
    ],
    fields: [
      { key: 'item', label: 'Item' }, { key: 'category', label: 'Category', type: 'select', options: ['Fluids', 'Filters', 'Tools', 'Bulbs', 'Fuses', 'Spare Parts', 'Cleaning'] },
      { key: 'qty', label: 'Quantity', type: 'number' }, { key: 'location', label: 'Location' }
    ]
  });

  /* ---- Documents Vault ---- */
  App.crud({
    id: 'documents', label: 'Documents Vault', group: 'Archive', icon: App.config.icon('documents'), fileno: '', ar: 'خزنة المستندات',
    coll: 'documents', title: 'documents', searchKeys: ['name', 'type', 'ref'],
    intro: '<div class="mono muted" style="font-size:12px">Offline vault: store registration, insurance, invoices, warranty, manuals & photo references. Attach files/links per record.</div>',
    cols: [
      { key: 'name', label: 'Document', sort: true }, { key: 'type', label: 'Type', sort: true, filter: ['Invoice/History', 'Diagnostics', 'Registration', 'Insurance', 'Warranty', 'Manual', 'Photo'] },
      { key: 'date', label: 'Date', sort: true, render: r => sd(r.date) }, { key: 'ref', label: 'Reference' }
    ],
    fields: [
      { key: 'name', label: 'Document name' }, { key: 'type', label: 'Type', type: 'select', options: ['Invoice/History', 'Diagnostics', 'Registration', 'Insurance', 'Warranty', 'Manual', 'Photo'] },
      { key: 'date', label: 'Date', type: 'date' }, { key: 'ref', label: 'Reference / link' }
    ]
  });
})();
