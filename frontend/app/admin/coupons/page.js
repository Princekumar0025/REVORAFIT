'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percentage', value: '', minOrderAmount: 0, maxDiscount: '', expiryDate: '', maxUses: 0, active: true });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch('https://revorafit.vercel.app/api/coupons');
    const data = await res.json();
    setCoupons(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, code: form.code.toUpperCase(), value: Number(form.value), minOrderAmount: Number(form.minOrderAmount), maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined, maxUses: Number(form.maxUses) };
    const res = await fetch('https://revorafit.vercel.app/api/coupons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (data.error) toast.error(data.error);
    else { toast.success('Coupon created!'); setShowForm(false); load(); }
    setSaving(false);
  };

  const toggleStatus = async (id, current) => {
    const res = await fetch(`https://revorafit.vercel.app/api/coupons/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !current }) });
    if (res.ok) { toast.success('Status updated'); load(); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    const res = await fetch(`https://revorafit.vercel.app/api/coupons/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Coupon deleted'); load(); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div><h1 className="admin-page-title">Coupons</h1><p className="admin-page-subtitle">Manage discount codes</p></div>
        <button className="btn btn-primary" onClick={() => { setForm({ code: '', type: 'percentage', value: '', minOrderAmount: 0, maxDiscount: '', expiryDate: '', maxUses: 0, active: true }); setShowForm(true); }}>+ Create Coupon</button>
      </div>

      <div className="data-table-wrap">
        {loading ? <div className="loading-container"><div className="spinner" /></div> : (
          <table className="data-table">
            <thead><tr><th>Code</th><th>Discount</th><th>Min Order</th><th>Usage</th><th>Expiry</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id}>
                  <td style={{ fontWeight: 700, letterSpacing: '1px' }}>{c.code}</td>
                  <td>{c.type === 'percentage' ? `${c.value}%` : c.type === 'flat' ? `₹${c.value}` : 'Free Shipping'}{c.maxDiscount ? ` (Up to ₹${c.maxDiscount})` : ''}</td>
                  <td>₹{c.minOrderAmount}</td>
                  <td>{c.usedCount} {c.maxUses > 0 ? `/ ${c.maxUses}` : '(unlimited)'}</td>
                  <td style={{ fontSize: '0.85rem' }}>{c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : 'Never'}</td>
                  <td><button onClick={() => toggleStatus(c._id, c.active)} className={`badge badge-${c.active ? 'primary' : 'danger'}`} style={{ cursor: 'pointer', border: 'none' }}>{c.active ? 'Active' : 'Inactive'}</button></td>
                  <td><button className="btn btn-ghost btn-sm" onClick={() => handleDelete(c._id)} style={{ color: 'var(--danger)' }}>🗑️</button></td>
                </tr>
              ))}
              {coupons.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>No coupons found</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="modal" style={{ maxWidth: '500px' }}>
            <div className="modal-header"><h2>Create Coupon</h2><button onClick={() => setShowForm(false)} style={{ background: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button></div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group"><label className="form-label">Code</label><input className="form-input" style={{ textTransform: 'uppercase' }} required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. FESTIVAL10" /></div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="form-group" style={{ flex: 1 }}><label className="form-label">Type</label><select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="percentage">Percentage (%)</option><option value="flat">Flat Amount (₹)</option><option value="freeshipping">Free Shipping</option></select></div>
                  {form.type !== 'freeshipping' && <div className="form-group" style={{ flex: 1 }}><label className="form-label">Value</label><input type="number" className="form-input" required min="1" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder={form.type === 'percentage' ? '10' : '500'} /></div>}
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="form-group" style={{ flex: 1 }}><label className="form-label">Min Order Amount (₹)</label><input type="number" className="form-input" required min="0" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} /></div>
                  {form.type === 'percentage' && <div className="form-group" style={{ flex: 1 }}><label className="form-label">Max Discount (₹)</label><input type="number" className="form-input" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} placeholder="Optional" /></div>}
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="form-group" style={{ flex: 1 }}><label className="form-label">Usage Limit</label><input type="number" className="form-input" required min="0" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} placeholder="0 for unlimited" /></div>
                  <div className="form-group" style={{ flex: 1 }}><label className="form-label">Expiry Date</label><input type="date" className="form-input" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} /></div>
                </div>
              </div>
              <div className="modal-footer"><button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button><button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Create'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
