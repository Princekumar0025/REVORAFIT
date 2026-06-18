'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'razorpay', label: 'Pay Online', sub: 'UPI, Cards, NetBanking, Wallets', icon: '💳' },
  { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when you receive', icon: '💵' },
];

export default function CheckoutPage() {
  const { items, subtotal, shippingCharge, discount, total, dispatch } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', street: '', city: '', state: '', pincode: '' });

  useEffect(() => {
    if (session?.user) {
      setForm((f) => ({ ...f, name: session.user.name || '', email: session.user.email || '' }));
    }
  }, [session]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) { toast.error('Your cart is empty'); return; }
    setPlacing(true);
    try {
      const orderData = {
        user: session?.user?.id || null,
        guestEmail: form.email,
        items: items.map((i) => ({ product: i._id, name: i.name, image: i.images?.[0], price: i.discountPrice || i.price, quantity: i.quantity, variant: i.selectedVariant })),
        shippingAddress: form,
        subtotal, shippingCharge, discount, total,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      };

      if (paymentMethod === 'cod') {
        const res = await fetch(`https://revorafit.vercel.app/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData) });
        const order = await res.json();
        dispatch({ type: 'CLEAR_CART' });
        router.push(`/order/${order._id}`);
      } else {
        const loaded = await loadRazorpay();
        if (!loaded) { toast.error('Payment gateway failed to load'); setPlacing(false); return; }
        const rzpOrderRes = await fetch(`https://revorafit.vercel.app/api/payment/create-order`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: total }) });
        const rzpOrder = await rzpOrderRes.json();
        if (rzpOrder.error) { toast.error(rzpOrder.error); setPlacing(false); return; }
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: rzpOrder.amount,
          currency: 'INR',
          name: 'REVORAFIT',
          description: `Order - ${items.length} item(s)`,
          order_id: rzpOrder.id,
          prefill: { name: form.name, email: form.email, contact: form.phone },
          theme: { color: '#7ED957' },
          handler: async (response) => {
            const verifyRes = await fetch(`https://revorafit.vercel.app/api/payment/verify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(response) });
            const verifyData = await verifyRes.json();
            if (verifyData.message === 'Payment verified successfully') {
              orderData.paymentStatus = 'paid';
              orderData.razorpayOrderId = rzpOrder.id;
              orderData.razorpayPaymentId = response.razorpay_payment_id;
              const orderRes = await fetch(`https://revorafit.vercel.app/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData) });
              const createdOrder = await orderRes.json();
              dispatch({ type: 'CLEAR_CART' });
              router.push(`/order/${createdOrder._id}`);
            } else { toast.error('Payment verification failed'); }
          },
          modal: { ondismiss: () => { setPlacing(false); } },
        };
        new window.Razorpay(options).open();
        return;
      }
    } catch (err) { toast.error('Something went wrong: ' + err.message); }
    setPlacing(false);
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
        <h1 className="heading-md" style={{ marginBottom: '32px' }}>Checkout</h1>
        <form onSubmit={placeOrder}>
          <div className="checkout-layout">
            <div>
              {/* Delivery Info */}
              <div className="checkout-section">
                <h2 className="checkout-section-title"><span>1</span> Delivery Information</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[['name', 'Full Name', 'text'], ['email', 'Email', 'email'], ['phone', 'Phone Number', 'tel'], ['street', 'Street Address', 'text'], ['city', 'City', 'text'], ['state', 'State', 'text'], ['pincode', 'Pincode', 'text']].map(([name, label, type]) => (
                    <div key={name} className="form-group" style={name === 'street' ? { gridColumn: '1/-1' } : {}}>
                      <label className="form-label">{label}</label>
                      <input type={type} name={name} className="form-input" value={form[name]} onChange={handleChange} required placeholder={`Enter ${label.toLowerCase()}`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="checkout-section">
                <h2 className="checkout-section-title"><span>2</span> Payment Method</h2>
                <div className="payment-options">
                  {PAYMENT_METHODS.map((m) => (
                    <label key={m.id} className={`payment-option ${paymentMethod === m.id ? 'selected' : ''}`}>
                      <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id} onChange={(e) => setPaymentMethod(e.target.value)} style={{ accentColor: 'var(--primary)' }} />
                      <span className="payment-option-icon">{m.icon}</span>
                      <div><p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{m.label}</p><p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{m.sub}</p></div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="order-summary">
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px' }}>Order Summary</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0, background: 'var(--bg-elevated)' }}>
                      <img src={item.images?.[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>{item.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</p>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="divider" />
              {[['Subtotal', `₹${subtotal.toLocaleString()}`], ['Shipping', shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`], ...(discount > 0 ? [['Discount', `-₹${discount}`]] : [])].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '10px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{l}</span>
                  <span style={{ color: l === 'Discount' ? 'var(--primary)' : l === 'Shipping' && v === 'FREE' ? 'var(--primary)' : 'inherit' }}>{v}</span>
                </div>
              ))}
              <div className="divider" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem', marginBottom: '24px' }}>
                <span>Total</span><span style={{ color: 'var(--primary)' }}>₹{total.toLocaleString()}</span>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }} disabled={placing}>
                {placing ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order (COD)' : `Pay ₹${total.toLocaleString()}`}
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px' }}>🔒 Secured by Razorpay</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
