'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

const FREE_SHIPPING_THRESHOLD = 999;

export default function CartDrawer({ onClose }) {
  const { items, dispatch, subtotal, itemCount, shippingCharge, discount, total } = useCart();

  const updateQty = (item, newQty) => {
    if (newQty < 1) {
      dispatch({ type: 'REMOVE_ITEM', payload: item });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { ...item, quantity: newQty } });
    }
  };

  const progressPct = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-drawer">
        {/* Header */}
        <div className="cart-drawer-header">
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Your Cart</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            ✕
          </button>
        </div>

        {/* Free Shipping Bar */}
        {subtotal < FREE_SHIPPING_THRESHOLD && (
          <div style={{ padding: '0 16px', paddingTop: '12px' }}>
            <div className="free-shipping-bar">
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {remaining > 0
                  ? <>Add <strong style={{ color: 'var(--primary)' }}>₹{remaining}</strong> more for FREE shipping!</>
                  : <span style={{ color: 'var(--primary)' }}>🎉 You unlocked free shipping!</span>}
              </p>
              <div className="free-shipping-progress">
                <div className="free-shipping-fill" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Items */}
        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                color: 'var(--text-muted)',
                padding: '60px 0',
              }}
            >
              <span style={{ fontSize: '3rem' }}>🛒</span>
              <p style={{ fontSize: '0.9rem' }}>Your cart is empty</p>
              <Link href="/shop" className="btn btn-primary btn-sm" onClick={onClose}>
                Shop Now
              </Link>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item._id}-${item.selectedVariant}-${idx}`} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={item.images?.[0] || '/placeholder.jpg'}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.name}</p>
                  {item.selectedVariant && (
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      {item.selectedVariant}
                    </p>
                  )}
                  <p className="cart-item-price">
                    ₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                    <div className="qty-controls">
                      <button className="qty-btn" onClick={() => updateQty(item, item.quantity - 1)}>−</button>
                      <span className="qty-num">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQty(item, item.quantity + 1)}>+</button>
                    </div>
                    <button
                      onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item })}
                      style={{ color: 'var(--danger)', background: 'none', cursor: 'pointer', fontSize: '1rem' }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total-row">
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="cart-total-row">
              <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
              <span style={{ color: shippingCharge === 0 ? 'var(--primary)' : 'inherit' }}>
                {shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}
              </span>
            </div>
            {discount > 0 && (
              <div className="cart-total-row">
                <span style={{ color: 'var(--text-muted)' }}>Discount</span>
                <span style={{ color: 'var(--primary)' }}>−₹{discount}</span>
              </div>
            )}
            <div className="cart-total-row total">
              <span>Total</span>
              <span className="amount">₹{total.toLocaleString()}</span>
            </div>
            <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }} onClick={onClose}>
              Proceed to Checkout →
            </Link>
            <Link href="/cart" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }} onClick={onClose}>
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
