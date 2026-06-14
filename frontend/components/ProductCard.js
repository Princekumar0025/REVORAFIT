'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import toast from 'react-hot-toast';

const StarRating = ({ rating, reviews }) => (
  <div className="product-card-rating">
    <div className="stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= Math.round(rating || 0) ? 'var(--warning)' : 'var(--border)' }}>★</span>
      ))}
    </div>
    {reviews > 0 && <span>({reviews})</span>}
  </div>
);

export default function ProductCard({ product }) {
  const { dispatch } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'ADD_ITEM', payload: product });
    toast.success('Added to cart!');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) removeFromWishlist(product._id);
    else addToWishlist(product);
  };

  const discountPct = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <Link href={`/product/${product.slug || product._id}`} className="product-card">
      {/* Image */}
      <div className="product-card-image">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'}
          alt={product.name}
          loading="lazy"
        />

        {/* Badges */}
        <div className="product-card-badges">
          {product.newArrival && <span className="badge badge-info">New</span>}
          {product.bestseller && <span className="badge badge-warning">Bestseller</span>}
          {discountPct > 0 && <span className="badge badge-danger">{discountPct}% OFF</span>}
        </div>

        {/* Hover Actions */}
        <div className="product-card-actions">
          <button
            className={`product-action-btn ${inWishlist ? 'active' : ''}`}
            onClick={handleWishlist}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {inWishlist ? '❤️' : '🤍'}
          </button>
          <span
            className="product-action-btn"
            title="Quick view"
          >
            👁️
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="product-card-body">
        <span className="product-card-category">{product.category}</span>
        <h3 className="product-card-name">{product.name}</h3>
        <StarRating rating={product.averageRating} reviews={product.numReviews} />
      </div>

      {/* Footer */}
      <div className="product-card-footer">
        <div className="price-group">
          <span className="price-current">₹{(product.discountPrice || product.price).toLocaleString()}</span>
          {product.discountPrice && (
            <span className="price-original">₹{product.price.toLocaleString()}</span>
          )}
        </div>
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          style={{ flexShrink: 0, width: 'auto', padding: '10px 16px' }}
        >
          {product.stock === 0 ? 'Out of Stock' : '+ Cart'}
        </button>
      </div>
    </Link>
  );
}
