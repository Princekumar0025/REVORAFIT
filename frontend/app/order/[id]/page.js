'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const STATUS_STEPS = ['placed', 'confirmed', 'packed', 'shipped', 'delivered'];

export default function OrderPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://revorafit.vercel.app/api/orders/${id}`).then((r) => r.json()).then((d) => { setOrder(d); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-content loading-container"><div className="spinner" /></div>;
  if (!order || order.error) return <div className="page-content" style={{ textAlign: 'center', padding: '100px 0' }}><h2>Order not found</h2></div>;

  const currentStep = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div className="page-content">
      <div className="container" style={{ paddingTop: '48px', paddingBottom: '80px', maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-glow)', border: '3px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 20px' }}>✓</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Order Confirmed!</h1>
          <p style={{ color: 'var(--text-muted)' }}>Order ID: <strong style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>#{order._id?.slice(-8).toUpperCase()}</strong></p>
        </div>

        {/* Detailed Vertical Status Tracker */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '28px' }}>Delivery Tracking</h2>
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', paddingLeft: '16px' }}>
            {STATUS_STEPS.map((step, i) => {
              const historyEntry = order.statusHistory?.find(h => h.status === step);
              const isCompleted = !!historyEntry || i <= currentStep; // Fallback for older orders without full statusHistory
              const isCurrent = i === currentStep;
              
              return (
                <div key={step} style={{ display: 'flex', gap: '20px', paddingBottom: i < STATUS_STEPS.length - 1 ? '32px' : '0', position: 'relative' }}>
                  {/* Vertical Line */}
                  {i < STATUS_STEPS.length - 1 && (
                    <div style={{ position: 'absolute', top: '32px', bottom: '0', left: '15px', width: '2px', background: isCompleted && currentStep > i ? 'var(--primary)' : 'var(--border)', zIndex: 0 }} />
                  )}
                  
                  {/* Circle Indicator */}
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isCompleted ? 'var(--primary)' : 'var(--bg-elevated)', border: `2px solid ${isCompleted ? 'var(--primary)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: isCompleted ? '#000' : 'var(--text-muted)', zIndex: 1, flexShrink: 0, boxShadow: isCurrent ? '0 0 0 4px rgba(0, 255, 136, 0.2)' : 'none' }}>
                    {isCompleted ? '✓' : i + 1}
                  </div>
                  
                  {/* Content */}
                  <div style={{ flex: 1, paddingTop: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: isCompleted ? 'var(--text)' : 'var(--text-muted)', textTransform: 'capitalize' }}>
                        {step}
                      </span>
                      {historyEntry && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          {new Date(historyEntry.timestamp).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
                        </span>
                      )}
                    </div>
                    {historyEntry ? (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                        {historyEntry.note || `Order has been ${step}.`}
                      </p>
                    ) : isCompleted ? (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                        Order status updated to {step}.
                      </p>
                    ) : (
                      <p style={{ fontSize: '0.85rem', color: 'var(--border)', margin: 0 }}>Pending</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Items */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px' }}>Order Items</h2>
          {order.items?.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', paddingBottom: '16px', borderBottom: i < order.items.length - 1 ? '1px solid var(--border)' : 'none', marginBottom: i < order.items.length - 1 ? '16px' : 0 }}>
              <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0, background: 'var(--bg-elevated)' }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{(item.price * item.quantity)?.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', marginBottom: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div><h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-muted)' }}>DELIVERY ADDRESS</h3><p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{order.shippingAddress?.name}<br/>{order.shippingAddress?.street}, {order.shippingAddress?.city}<br/>{order.shippingAddress?.state} - {order.shippingAddress?.pincode}<br/>{order.shippingAddress?.phone}</p></div>
          <div><h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-muted)' }}>PAYMENT</h3><p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{order.paymentMethod?.toUpperCase()}</p><p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '8px' }}>₹{order.total?.toLocaleString()}</p></div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/shop" className="btn btn-primary btn-lg">Continue Shopping →</Link>
          <Link href="/" className="btn btn-outline btn-lg">Go Home</Link>
        </div>
      </div>
    </div>
  );
}
