import ProductGrid from '@/components/ProductGrid';

export const metadata = { title: 'Shop All Products', description: 'Browse all REVORAFIT products - fitness, physiotherapy & medical equipment.' };

export default function ShopPage({ searchParams }) {
  const { search, newArrival, bestseller, sale } = searchParams;
  return (
    <div className="page-content">
      <div className="container section">
        <div style={{ marginBottom: '32px' }}>
          <div className="section-label">Shop</div>
          <h1 className="heading-lg">All Products</h1>
          {search && <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Results for: <strong style={{ color: 'var(--primary)' }}>"{search}"</strong></p>}
        </div>
        <div className="shop-layout">
          <aside className="filter-sidebar">
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '24px' }}>Filters</h3>
            <div className="filter-section">
              <p className="filter-section-title">Category</p>
              {[['All', ''], ['Fitness', 'fitness'], ['Physiotherapy', 'physiotherapy'], ['Medical', 'medical']].map(([label, val]) => (
                <label key={val} className="filter-option">
                  <input type="radio" name="cat" value={val} defaultChecked={!val} />
                  {label}
                </label>
              ))}
            </div>
            <div className="filter-section">
              <p className="filter-section-title">Price Range</p>
              <div className="price-range-inputs">
                <input type="number" className="form-input" placeholder="Min" />
                <input type="number" className="form-input" placeholder="Max" />
              </div>
            </div>
            <div className="filter-section">
              <p className="filter-section-title">Availability</p>
              <label className="filter-option"><input type="checkbox" /> In Stock</label>
              <label className="filter-option"><input type="checkbox" /> On Sale</label>
              <label className="filter-option"><input type="checkbox" /> New Arrivals</label>
            </div>
          </aside>
          <div>
            <ProductGrid search={search} newArrival={newArrival === 'true'} bestseller={bestseller === 'true'} />
          </div>
        </div>
      </div>
    </div>
  );
}
