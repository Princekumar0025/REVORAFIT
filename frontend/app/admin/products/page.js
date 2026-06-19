'use client';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', slug: '', shortDescription: '', description: '', category: 'fitness', price: '', discountPrice: '', stock: '', benefits: '', tags: '', featured: false, newArrival: false, bestseller: false, images: [] };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageUrls, setImageUrls] = useState(['']);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const load = async () => {
    setLoading(true);
    const API_URL = 'https://revorafit.vercel.app';
    const res = await fetch(`${API_URL}/api/products?limit=100`);
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setImageUrls(['']); setEditId(null); setShowForm(true); };

  const openEdit = (p) => {
    setForm({ name: p.name, slug: p.slug, shortDescription: p.shortDescription || '', description: p.description, category: p.category, price: p.price, discountPrice: p.discountPrice || '', stock: p.stock, benefits: (p.benefits || []).join(', '), tags: (p.tags || []).join(', '), featured: p.featured, newArrival: p.newArrival, bestseller: p.bestseller, images: p.images || [] });
    setImageUrls(p.images?.length ? p.images : ['']);
    setEditId(p._id);
    setShowForm(true);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) {
      setImageUrls((prev) => { const n = [...prev]; n[0] = data.url; return n; });
      setForm((f) => ({ ...f, images: [data.url, ...f.images.slice(1)] }));
      toast.success('Image uploaded!');
    } else toast.error(data.error || 'Upload failed');
    setUploading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      stock: Number(form.stock),
      benefits: form.benefits.split(',').map((b) => b.trim()).filter(Boolean),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      images: imageUrls.filter(Boolean),
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    const API_URL = 'https://revorafit.vercel.app';
    const url = editId ? `${API_URL}/api/products/${editId}` : `${API_URL}/api/products`;
    const method = editId ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (data.error) toast.error(data.error);
    else { toast.success(editId ? 'Product updated!' : 'Product added!'); setShowForm(false); load(); }
    setSaving(false);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const API_URL = 'https://revorafit.vercel.app';
    const res = await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.error) toast.error(data.error);
    else { toast.success('Product deleted'); load(); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-subtitle">{products.length} total products</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>

      <div className="data-table-wrap">
        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td><div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--bg-elevated)' }}><img src={p.images?.[0] || ''} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div></td>
                  <td><div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.name}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/{p.slug}</div></td>
                  <td><span className="badge badge-info" style={{ textTransform: 'capitalize' }}>{p.category}</span></td>
                  <td><div style={{ fontWeight: 700 }}>₹{(p.discountPrice || p.price)?.toLocaleString()}</div>{p.discountPrice && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{p.price?.toLocaleString()}</div>}</td>
                  <td><span className={`badge badge-${p.stock > 10 ? 'primary' : p.stock > 0 ? 'warning' : 'danger'}`}>{p.stock === 0 ? 'Out of Stock' : p.stock}</span></td>
                  <td><div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>{p.featured && <span className="badge badge-warning">Featured</span>}{p.bestseller && <span className="badge badge-info">Bestseller</span>}{p.newArrival && <span className="badge badge-primary">New</span>}</div></td>
                  <td><div style={{ display: 'flex', gap: '8px' }}><button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>✏️ Edit</button><button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id, p.name)}>🗑️</button></div></td>
                </tr>
              ))}
              {products.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No products yet. <button style={{ color: 'var(--primary)', background: 'none', cursor: 'pointer' }} onClick={openAdd}>Add your first product</button></td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="modal" style={{ maxWidth: '720px' }}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{editId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Product Name *</label>
                    <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} required placeholder="e.g. Resistance Bands Set" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Slug</label>
                    <input className="form-input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      <option value="fitness">Fitness Equipment</option>
                      <option value="physiotherapy">Physiotherapy Equipment</option>
                      <option value="medical">Medical Equipment</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock *</label>
                    <input type="number" className="form-input" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required min="0" placeholder="0" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price (MRP) *</label>
                    <input type="number" className="form-input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min="1" placeholder="1499" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Discount Price</label>
                    <input type="number" className="form-input" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} min="1" placeholder="999" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Short Description</label>
                  <input className="form-input" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} placeholder="One-line product summary" />
                </div>
                <div className="form-group">
                  <label className="form-label">Full Description *</label>
                  <textarea className="form-input" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required placeholder="Detailed product description..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Benefits (comma separated)</label>
                  <input className="form-input" value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} placeholder="Improve strength, Portable, Versatile" />
                </div>
                <div className="form-group">
                  <label className="form-label">Image Upload or URL</label>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                    <input
                      className="form-input"
                      placeholder="Paste image URL"
                      value={imageUrls[0] || ''}
                      onChange={(e) => {
                        const urls = [...imageUrls];
                        urls[0] = e.target.value;
                        setImageUrls(urls);
                        setForm((f) => ({ ...f, images: urls.filter(Boolean) }));
                      }}
                    />
                    <button type="button" className="btn btn-ghost btn-sm" style={{ whiteSpace: 'nowrap', flexShrink: 0 }} onClick={() => fileRef.current?.click()}>
                      {uploading ? 'Uploading...' : '📂 Upload'}
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
                  </div>
                  {imageUrls[0] && <img src={imageUrls[0]} alt="preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} />}
                </div>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  {[['featured', 'Featured'], ['newArrival', 'New Arrival'], ['bestseller', 'Bestseller']].map(([key, label]) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                      <input type="checkbox" checked={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editId ? 'Update Product' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
