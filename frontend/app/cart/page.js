'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, dispatch, subtotal, itemCount, shippingCharge, discount, total } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [applying, setApplying] = useState(false);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplying(true);
    try {
      const res = await fetch('https://revorafit.vercel.app/api/coupons/validate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: couponCode, cartTotal: subtotal }) });
      const data = await res.json();
      if (data.valid) { dispatch({ type: 'SET_COUPON', payload: { code: data.coupon.code, discount: data.discount } }); toast.success(`Coupon applied! ₹${data.discount} off`); }
      else toast.error(data.error);
    } catch { toast.error('Failed to apply coupon'); }
    setApplying(false);
  };

  if (items.length === 0) return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '20px' }}>
      <span style={{ fontSize: '4rem' }}>🛒</span>
      <h2>Your cart is empty</h2>
      <Link href="/shop" className="btn btn-primary btn-lg">Start Shopping →</Link>
    </div>
  );

  return (
    <div className="page-content">
      <div className="container" style={{ paddingTop: '48px', paddingBottom: '80px' }}>
        <h1 className="heading-md" style={{ marginBottom: '32px' }}>Shopping Cart <span style={{ color: 'var(--primary)' }}>({itemCount})</span></h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '28px', alignItems: 'start' }}>
          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {items.map((item, idx) => (
              <div key={idx} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: 'var(--radius)', overflow: 'hidden', flexShrink: 0, background: 'var(--bg-elevated)' }}>
                  <img src={item.images?.[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <Link href={`/product/${item.slug || item._id}`} style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', transition: 'color var(--transition)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = ''}>{item.name}</Link>
                  {item.selectedVariant && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{item.selectedVariant}</p>}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <div className="qty-controls">
                      <button className="qty-btn" onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { ...item, quantity: Math.max(1, item.quantity - 1) } })}>−</button>
                      <span className="qty-num">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { ...item, quantity: item.quantity + 1 } })}>+</button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}</span>
                      <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item })} style={{ color: 'var(--danger)', background: 'none', cursor: 'pointer', fontSize: '1.1rem' }} title="Remove">🗑️</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', position: 'sticky', top: 'calc(var(--navbar-height) + 20px)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px' }}>Order Summary</h2>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input className="form-input" placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} />
              <button onClick={applyCoupon} className="btn btn-outline btn-sm" disabled={applying} style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>{applying ? '...' : 'Apply'}</button>
            </div>
            {discount > 0 && (
              <div style={{ background: 'var(--primary-glow)', border: '1px solid rgba(126,217,87,0.2)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: '16px', fontSize: '0.82rem', color: 'var(--primary)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Coupon applied ✓</span>
                <button onClick={() => dispatch({ type: 'REMOVE_COUPON' })} style={{ background: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem' }}>Remove</button>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--border)', marginBottom: '16px' }}>
              {[['Subtotal', `₹${subtotal.toLocaleString()}`], ['Shipping', shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`], ...(discount > 0 ? [['Discount', `-₹${discount}`]] : [])].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{l}</span>
                  <span style={{ color: l === 'Discount' ? 'var(--primary)' : l === 'Shipping' && v === 'FREE' ? 'var(--primary)' : 'var(--text-primary)' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem', marginBottom: '24px' }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>₹{total.toLocaleString()}</span>
            </div>
            <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '10px' }}>Proceed to Checkout →</Link>
            <Link href="/shop" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
