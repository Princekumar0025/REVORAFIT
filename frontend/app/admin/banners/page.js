'use client';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', subtitle: '', image: '', link: '', active: true, order: 0 });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const load = async () => {
    setLoading(true);
    const res = await fetch('https://revorafit.vercel.app/api/banners');
    const data = await res.json();
    setBanners(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) { setForm({ ...form, image: data.url }); toast.success('Image uploaded!'); } else toast.error('Upload failed');
    setUploading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.image) return toast.error('Image is required');
    const res = await fetch('https://revorafit.vercel.app/api/banners', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (data.error) toast.error(data.error);
    else { toast.success('Banner added'); setShowForm(false); load(); }
  };

  const toggleStatus = async (id, current) => {
    const res = await fetch(`https://revorafit.vercel.app/api/banners/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !current }) });
    if (res.ok) { toast.success('Status updated'); load(); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete banner?')) return;
    const res = await fetch(`https://revorafit.vercel.app/api/banners/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Banner deleted'); load(); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div><h1 className="admin-page-title">Banners</h1><p className="admin-page-subtitle">Manage homepage hero banners</p></div>
        <button className="btn btn-primary" onClick={() => { setForm({ title: '', subtitle: '', image: '', link: '', active: true, order: banners.length }); setShowForm(true); }}>+ Add Banner</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {loading ? <div className="loading-container"><div className="spinner" /></div> : banners.map((b) => (
          <div key={b._id} style={{ display: 'flex', gap: '24px', background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', alignItems: 'center' }}>
            <div style={{ width: '200px', height: '100px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#000' }}>
              <img src={b.image} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>{b.title || '(No Title)'}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px' }}>{b.subtitle}</p>
              {b.link && <a href={b.link} target="_blank" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Link: {b.link}</a>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
              <button onClick={() => toggleStatus(b._id, b.active)} className={`badge badge-${b.active ? 'primary' : 'danger'}`} style={{ cursor: 'pointer', border: 'none' }}>{b.active ? 'Active' : 'Inactive'}</button>
              <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(b._id)} style={{ color: 'var(--danger)' }}>🗑️ Delete</button>
            </div>
          </div>
        ))}
        {!loading && banners.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No banners yet.</p>}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="modal" style={{ maxWidth: '500px' }}>
            <div className="modal-header"><h2>Add Banner</h2><button onClick={() => setShowForm(false)} style={{ background: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button></div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Hero Heading" /></div>
                <div className="form-group"><label className="form-label">Subtitle</label><input className="form-input" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Sub text" /></div>
                <div className="form-group"><label className="form-label">Link (Optional)</label><input className="form-input" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/shop" /></div>
                <div className="form-group">
                  <label className="form-label">Image *</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input className="form-input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL" required />
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()}>{uploading ? '...' : 'Upload'}</button>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
                  </div>
                  {form.image && <img src={form.image} alt="preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginTop: '8px' }} />}
                </div>
              </div>
              <div className="modal-footer"><button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button><button type="submit" className="btn btn-primary">Save Banner</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
