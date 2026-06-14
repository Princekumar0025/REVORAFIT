'use client';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  return (
    <div className="page-content">
      <div className="container section">
        <div style={{ marginBottom: '32px' }}>
          <div className="section-label">❤️ Wishlist</div>
          <h1 className="heading-md">My Wishlist <span style={{ color: 'var(--primary)' }}>({wishlist.length})</span></h1>
        </div>
        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: '4rem', marginBottom: '16px' }}>❤️</p>
            <h2 style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Your wishlist is empty</h2>
            <Link href="/shop" className="btn btn-primary btn-lg">Explore Products →</Link>
          </div>
        ) : (
          <div className="products-grid">
            {wishlist.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
