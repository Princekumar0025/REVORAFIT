'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch('https://revorafit.vercel.app/api/users');
    const data = await res.json();
    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleBlock = async (id, current) => {
    if (!window.confirm(current ? 'Unblock this user?' : 'Block this user? They will not be able to login.')) return;
    const res = await fetch(`https://revorafit.vercel.app/api/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ blocked: !current }) });
    if (res.ok) { toast.success(current ? 'User unblocked' : 'User blocked'); load(); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user ${name}? This cannot be undone.`)) return;
    const res = await fetch(`https://revorafit.vercel.app/api/users/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('User deleted'); load(); }
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 className="admin-page-title">Users</h1>
        <p className="admin-page-subtitle">{users.length} registered customers</p>
      </div>

      <div className="data-table-wrap">
        {loading ? <div className="loading-container"><div className="spinner" /></div> : (
          <table className="data-table">
            <thead><tr><th>Customer</th><th>Contact</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{u.name}</div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.875rem' }}>{u.email}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.phone || 'No phone'}</div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td><span className={`badge badge-${u.blocked ? 'danger' : 'primary'}`}>{u.blocked ? 'Blocked' : 'Active'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className={`btn ${u.blocked ? 'btn-outline' : 'btn-ghost'} btn-sm`} onClick={() => toggleBlock(u._id, u.blocked)}>{u.blocked ? 'Unblock' : 'Block'}</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id, u.name)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>No users found</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
