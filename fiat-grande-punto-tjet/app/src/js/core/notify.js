/* ============================================================
   App.notify — notification engine.
   Evaluates data-driven rules (config.reminders) against the
   active vehicle and returns a list of alerts. Pure/derived:
   no state of its own, so it stays correct as data changes.
   Rule kinds: maintenance · warranty · insurance · license ·
   oil · mileage · critical-fault.
   ============================================================ */
window.App = window.App || {};
App.notify = (function () {
  function daysUntil(d) { if (!d) return null; return Math.round((new Date(d) - Date.now()) / 86400000); }

  function evaluate() {
    const v = App.store.veh(); const r = App.config.get().reminders; const out = [];
    const km = v.mileage || 0;

    // upcoming maintenance (planner)
    (v.data.planner || []).forEach(p => {
      if (p.done) return;
      const dk = p.dueKm != null ? p.dueKm - km : null;
      const dd = daysUntil(p.dueDate);
      if ((dk != null && dk <= r.serviceDueKmWindow) || (dd != null && dd <= r.serviceDueDaysWindow)) {
        out.push({ kind: p.kind === 'critical' ? 'critical' : 'maintenance', sev: dk != null && dk <= 0 ? 'crit' : 'warn',
          title: p.title, detail: (dk != null ? (dk <= 0 ? 'Overdue by ' + Math.abs(dk) + ' km' : 'in ' + dk + ' km') : '') + (dd != null ? (dk != null ? ' · ' : '') + (dd <= 0 ? 'past due' : 'in ' + dd + ' days') : '') });
      }
    });

    // open critical faults
    (v.data.faults || []).filter(f => !f.solved && f.priority === 'critical').forEach(f =>
      out.push({ kind: 'fault', sev: 'crit', title: 'Fault ' + f.code + ' — ' + f.system, detail: f.desc }));

    // warranty expiries on parts / service
    (v.data.parts || []).forEach(p => { const d = daysUntil(p.warrantyExpiry); if (d != null && d <= r.warrantyWarnDays)
      out.push({ kind: 'warranty', sev: d <= 0 ? 'crit' : 'warn', title: 'Warranty: ' + p.name, detail: d <= 0 ? 'expired' : 'in ' + d + ' days' }); });

    // vehicle documents: insurance / license
    const ins = daysUntil(v.insuranceExpiry); if (ins != null && ins <= r.insuranceWarnDays)
      out.push({ kind: 'insurance', sev: ins <= 0 ? 'crit' : 'warn', title: 'Insurance', detail: ins <= 0 ? 'expired' : 'in ' + ins + ' days' });
    const lic = daysUntil(v.licenseExpiry); if (lic != null && lic <= r.licenseWarnDays)
      out.push({ kind: 'license', sev: lic <= 0 ? 'crit' : 'warn', title: 'License renewal', detail: lic <= 0 ? 'overdue' : 'in ' + lic + ' days' });

    // oil reminder (last service of type oil)
    const oil = (v.data.service || []).filter(s => /oil/i.test(s.work)).sort((a, b) => (b.km || 0) - (a.km || 0))[0];
    if (oil) { const since = km - (oil.km || 0); if (since >= r.oilChangeKm - 1500)
      out.push({ kind: 'oil', sev: since >= r.oilChangeKm ? 'crit' : 'warn', title: 'Engine oil', detail: since + ' km since last change' }); }

    return out;
  }

  function count() { return evaluate().length; }
  return { evaluate, count, daysUntil };
})();
