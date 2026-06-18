'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://revorafit.vercel.app/api/analytics').then((r) => r.json()).then((d) => { setStats(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const STATUS_COLOR = { placed: 'info', confirmed: 'warning', packed: 'warning', shipped: 'info', delivered: 'primary', cancelled: 'danger' };

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="stat-cards">
        {[
          { icon: '💰', label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}` },
          { icon: '📋', label: 'Total Orders', value: stats?.totalOrders || 0 },
          { icon: '📦', label: 'Products', value: stats?.totalProducts || 0 },
          { icon: '👥', label: 'Customers', value: stats?.totalUsers || 0 },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-card-icon">{s.icon}</div>
            <div className="stat-card-value">{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Recent Orders */}
        <div className="data-table-wrap">
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Recent Orders</h2>
            <Link href="/admin/orders" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>View All</Link>
          </div>
          <table className="data-table">
            <thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {stats?.recentOrders?.map((o) => (
                <tr key={o._id}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--primary)', fontSize: '0.8rem' }}>#{o._id?.slice(-6).toUpperCase()}</td>
                  <td>{o.user?.name || o.guestEmail || 'Guest'}</td>
                  <td style={{ fontWeight: 700 }}>₹{o.total?.toLocaleString()}</td>
                  <td><span className={`badge badge-${STATUS_COLOR[o.orderStatus] || 'info'}`}>{o.orderStatus}</span></td>
                </tr>
              )) || <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>No orders yet</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Top Products */}
        <div className="data-table-wrap">
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Top Products</h2>
            <Link href="/admin/products" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>View All</Link>
          </div>
          <table className="data-table">
            <thead><tr><th>Product</th><th>Sold</th><th>Revenue</th></tr></thead>
            <tbody>
              {stats?.topProducts?.map((p) => (
                <tr key={p._id?.toString()}>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td><span className="badge badge-primary">{p.totalSold}</span></td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{p.revenue?.toLocaleString()}</td>
                </tr>
              )) || <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>No sales yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Revenue Table */}
      {stats?.monthlyRevenue?.length > 0 && (
        <div className="data-table-wrap" style={{ marginTop: '24px' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Monthly Performance</h2>
          </div>
          <table className="data-table">
            <thead><tr><th>Month</th><th>Year</th><th>Orders</th><th>Revenue</th></tr></thead>
            <tbody>
              {stats.monthlyRevenue.map((m, i) => {
                const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return (
                  <tr key={i}>
                    <td>{months[m._id.month]}</td>
                    <td>{m._id.year}</td>
                    <td>{m.orders}</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{m.revenue?.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
