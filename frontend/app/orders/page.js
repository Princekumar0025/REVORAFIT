'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MyOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch(`https://revorafit.vercel.app/api/orders?userId=${session.user.id}`);
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [session, status]);

  if (loading || status === 'loading') {
    return <div className="page-content loading-container"><div className="spinner" /></div>;
  }

  return (
    <div className="page-content">
      <div className="container" style={{ paddingTop: '48px', paddingBottom: '80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 className="heading-md">My Orders</h1>
          <span style={{ color: 'var(--text-muted)' }}>{orders.length} order{orders.length !== 1 && 's'}</span>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>📦</span>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No orders yet</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Looks like you haven't made your first purchase.</p>
            <Link href="/shop" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map((order) => {
              const statusColorMap = { placed: 'info', confirmed: 'warning', packed: 'warning', shipped: 'primary', delivered: 'success', cancelled: 'danger' };
              const colorClass = statusColorMap[order.orderStatus] || 'info';

              return (
                <div key={order._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'transform 0.2s, box-shadow 0.2s' }} className="hover-card">
                  
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>#{order._id?.slice(-8).toUpperCase()}</span>
                        <span className={`badge badge-${colorClass}`} style={{ textTransform: 'capitalize' }}>{order.orderStatus}</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)' }}>₹{order.total?.toLocaleString()}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.items?.length} item{order.items?.length > 1 && 's'}</p>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {order.items?.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-elevated)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', minWidth: '200px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                          <img src={item.image || 'https://via.placeholder.com/40'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <p style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{item.name}</p>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                    <Link href={`/order/${order._id}`} className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
                      Track Order & Details ➔
                    </Link>
                  </div>
                  
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style jsx>{`
        .hover-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
          border-color: var(--primary);
        }
      `}</style>
    </div>
  );
}
