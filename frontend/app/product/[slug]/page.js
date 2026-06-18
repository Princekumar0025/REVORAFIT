'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import toast from 'react-hot-toast';

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const { dispatch } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const router = useRouter();

  useEffect(() => {
    const API_URL = 'https://revorafit.vercel.app';
    fetch(`${API_URL}/api/products/${slug}`)
      .then((r) => r.json())
      .then((d) => { setProduct(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    const variantStr = Object.entries(selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ');
    dispatch({ type: 'ADD_ITEM', payload: { ...product, quantity, selectedVariant: variantStr } });
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await fetch('https://revorafit.vercel.app/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: product._id, name: reviewName, rating: reviewRating, comment: reviewText }) });
      toast.success('Review submitted!');
      setReviewText(''); setReviewName(''); setReviewRating(5);
      const API_URL = 'https://revorafit.vercel.app';
      const res = await fetch(`${API_URL}/api/products/${slug}`);
      setProduct(await res.json());
    } catch { toast.error('Failed to submit review'); }
    setSubmittingReview(false);
  };

  if (loading) return <div className="page-content loading-container"><div className="spinner" /></div>;
  if (!product || product.error) return <div className="page-content" style={{ textAlign: 'center', padding: '100px 0' }}><h2>Product not found</h2><Link href="/shop" className="btn btn-primary" style={{ marginTop: '20px' }}>Back to Shop</Link></div>;

  const inWishlist = isInWishlist(product._id);
  const discountPct = product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  return (
    <div className="page-content">
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '32px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', transition: 'color var(--transition)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = ''}>Home</Link>
          <span>/</span>
          <Link href="/shop" style={{ color: 'var(--text-muted)' }}>Shop</Link>
          <span>/</span>
          <Link href={`/shop/${product.category}`} style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{product.category}</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
          {/* Images */}
          <div>
            <div style={{ aspectRatio: '1', borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--border)', marginBottom: '16px' }}>
              <img src={product.images?.[activeImage] || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                {product.images.map((img, i) => (
                  <div key={i} onClick={() => setActiveImage(i)} style={{ width: '80px', height: '80px', flexShrink: 0, borderRadius: 'var(--radius-sm)', overflow: 'hidden', cursor: 'pointer', border: `2px solid ${i === activeImage ? 'var(--primary)' : 'var(--border)'}`, transition: 'border-color var(--transition)' }}>
                    <img src={img} alt={`${product.name} ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '12px', textTransform: 'capitalize' }}>{product.category}</span>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: '12px', lineHeight: 1.2 }}>{product.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div className="stars">{Array.from({ length: 5 }).map((_, i) => <span key={i} style={{ color: i < Math.round(product.averageRating || 4) ? 'var(--warning)' : 'var(--border)' }}>★</span>)}</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({product.numReviews || 0} reviews)</span>
              {product.stock > 0 ? <span className="badge badge-primary">✓ In Stock</span> : <span className="badge badge-danger">Out of Stock</span>}
            </div>

            <div className="price-group" style={{ marginBottom: '24px' }}>
              <span className="price-current" style={{ fontSize: '2rem' }}>₹{(product.discountPrice || product.price)?.toLocaleString()}</span>
              {product.discountPrice && <><span className="price-original" style={{ fontSize: '1.2rem' }}>₹{product.price?.toLocaleString()}</span><span className="price-discount">{discountPct}% OFF</span></>}
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>{product.shortDescription || product.description?.slice(0, 150)}</p>

            {/* Variants */}
            {product.variants?.map((v) => (
              <div key={v.name} style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '10px', color: 'var(--text-secondary)' }}>Select {v.name}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {v.options.map((opt) => (
                    <button key={opt} onClick={() => setSelectedVariants({ ...selectedVariants, [v.name]: opt })} style={{ padding: '8px 16px', border: `1.5px solid ${selectedVariants[v.name] === opt ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', background: selectedVariants[v.name] === opt ? 'var(--primary-glow)' : 'var(--bg-elevated)', color: selectedVariants[v.name] === opt ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all var(--transition)' }}>{opt}</button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '10px', color: 'var(--text-secondary)' }}>Quantity</p>
              <div className="qty-controls" style={{ width: 'fit-content' }}>
                <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span className="qty-num" style={{ padding: '0 16px', fontSize: '1rem' }}>{quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
              <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn btn-outline" style={{ flex: 1, minWidth: '140px' }}>Add to Cart</button>
              <button onClick={handleBuyNow} disabled={product.stock === 0} className="btn btn-primary" style={{ flex: 1, minWidth: '140px' }}>Buy Now →</button>
              <button onClick={() => inWishlist ? removeFromWishlist(product._id) : addToWishlist(product)} className="btn btn-ghost btn-icon" title="Wishlist" style={{ fontSize: '1.2rem' }}>{inWishlist ? '❤️' : '🤍'}</button>
            </div>

            {/* Delivery info */}
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[['🚚', 'Free Delivery', 'On orders above ₹999'], ['↩️', 'Easy Returns', '30-day return policy'], ['✅', 'Genuine Product', '100% authentic'], ['🔒', 'Secure Payment', 'Razorpay secured']].map(([icon, title, sub]) => (
                <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                  <div><p style={{ fontSize: '0.8rem', fontWeight: 700 }}>{title}</p><p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{sub}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div style={{ marginTop: '60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="card" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Description</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{product.description}</p>
            {product.benefits?.length > 0 && <>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '20px', marginBottom: '12px' }}>Key Benefits</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {product.benefits.map((b) => <li key={b} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}><span style={{ color: 'var(--primary)' }}>✓</span>{b}</li>)}
              </ul>
            </>}
          </div>
          <div className="card" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Specifications</h2>
            {product.specifications?.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {product.specifications.map((s) => (
                    <tr key={s.key} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, width: '40%' }}>{s.key}</td>
                      <td style={{ padding: '10px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p style={{ color: 'var(--text-muted)' }}>No specifications listed.</p>}
          </div>
        </div>

        {/* Reviews */}
        <div style={{ marginTop: '48px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '28px' }}>Customer Reviews ({product.numReviews || 0})</h2>
          {product.reviews?.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '40px' }}>
              {product.reviews.map((r, i) => (
                <div key={i} className="review-card">
                  <div className="review-header">
                    <div className="review-avatar">{(r.name || 'U')[0]}</div>
                    <div><p className="review-name">{r.name || 'Anonymous'}</p></div>
                  </div>
                  <div className="stars" style={{ marginBottom: '8px' }}>{Array.from({ length: 5 }).map((_, s) => <span key={s} style={{ color: s < r.rating ? 'var(--warning)' : 'var(--border)' }}>★</span>)}</div>
                  <p className="review-text">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px' }}>Write a Review</h3>
            <form onSubmit={handleReview} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input className="form-input" value={reviewName} onChange={(e) => setReviewName(e.target.value)} required placeholder="Enter your name" />
              </div>
              <div className="form-group">
                <label className="form-label">Rating</label>
                <div className="stars" style={{ fontSize: '1.5rem', cursor: 'pointer' }}>
                  {[1,2,3,4,5].map((s) => <span key={s} onClick={() => setReviewRating(s)} style={{ color: s <= reviewRating ? 'var(--warning)' : 'var(--border)' }}>★</span>)}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Your Review</label>
                <textarea className="form-input" rows={4} value={reviewText} onChange={(e) => setReviewText(e.target.value)} required placeholder="Share your experience..." />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submittingReview} style={{ alignSelf: 'flex-start' }}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
