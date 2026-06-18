'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const STATUSES = ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLOR = { placed: 'info', confirmed: 'warning', packed: 'warning', shipped: 'info', delivered: 'primary', cancelled: 'danger' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch('https://revorafit.vercel.app/api/orders?limit=50');
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (orderId, status) => {
    const res = await fetch(`https://revorafit.vercel.app/api/orders/${orderId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderStatus: status }) });
    const data = await res.json();
    if (data.error) toast.error(data.error);
    else { toast.success(`Order marked as ${status}`); load(); if (selected?._id === orderId) setSelected({ ...selected, orderStatus: status }); }
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 className="admin-page-title">Orders</h1>
        <p className="admin-page-subtitle">{orders.length} total orders</p>
      </div>
      <div className="data-table-wrap">
        {loading ? <div className="loading-container"><div className="spinner" /></div> : (
          <table className="data-table">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Update</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} style={{ cursor: 'pointer' }}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--primary)', fontSize: '0.8rem' }}>#{o._id?.slice(-8).toUpperCase()}</td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{o.user?.name || 'Guest'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.shippingAddress?.phone || o.guestEmail}</div>
                  </td>
                  <td>{o.items?.length} item(s)</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{o.total?.toLocaleString()}</td>
                  <td>
                    <span className={`badge badge-${o.paymentStatus === 'paid' ? 'primary' : 'warning'}`}>{o.paymentStatus}</span>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{o.paymentMethod}</div>
                  </td>
                  <td><span className={`badge badge-${STATUS_COLOR[o.orderStatus] || 'info'}`}>{o.orderStatus}</span></td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    <select
                      className="form-select"
                      style={{ padding: '6px 30px 6px 10px', fontSize: '0.78rem', width: '120px' }}
                      value={o.orderStatus}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                    >
                      {STATUSES.map((s) => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No orders yet</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
