'use client';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ initialProducts = [], category, search, featured, newArrival, bestseller, limit }) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length === 0);
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      if (featured) params.set('featured', 'true');
      if (newArrival) params.set('newArrival', 'true');
      if (bestseller) params.set('bestseller', 'true');
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      params.set('sort', sort);
      params.set('order', order);
      params.set('page', page);
      params.set('limit', limit || 12);
      const API_URL = 'https://revorafit.vercel.app';
      const res = await fetch(`${API_URL}/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [category, search, featured, newArrival, bestseller, sort, order, minPrice, maxPrice, page]);

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {loading ? 'Loading...' : `${products.length} products`}
        </p>
        <select
          className="form-select"
          style={{ width: 'auto' }}
          onChange={(e) => {
            const [s, o] = e.target.value.split(':');
            setSort(s);
            setOrder(o);
          }}
        >
          <option value="createdAt:desc">Newest First</option>
          <option value="price:asc">Price: Low to High</option>
          <option value="price:desc">Price: High to Low</option>
          <option value="rating:desc">Best Rated</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="products-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div className="skeleton" style={{ aspectRatio: '1', width: '100%' }} />
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="skeleton" style={{ height: '12px', width: '60%', borderRadius: '6px' }} />
                <div className="skeleton" style={{ height: '16px', width: '90%', borderRadius: '6px' }} />
                <div className="skeleton" style={{ height: '14px', width: '40%', borderRadius: '6px' }} />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</p>
          <p>No products found.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`btn ${page === p ? 'btn-primary' : 'btn-ghost'} btn-sm`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
