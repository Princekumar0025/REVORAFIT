import ProductGrid from '@/components/ProductGrid';

const CATEGORY_META = {
  fitness: { title: 'Fitness Equipment', desc: 'Shop premium fitness equipment — resistance bands, dumbbells, yoga mats & more.', icon: '🏋️' },
  physiotherapy: { title: 'Physiotherapy Equipment', desc: 'Professional physiotherapy tools — TENS machines, therapy balls, massage rollers.', icon: '🧠' },
  medical: { title: 'Medical Equipment', desc: 'Medical recovery products — knee supports, back belts, compression sleeves.', icon: '🩺' },
};

export async function generateMetadata({ params }) {
  const { category } = await params;
  const meta = CATEGORY_META[category] || { title: category, desc: '' };
  return { title: meta.title, description: meta.desc };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const meta = CATEGORY_META[category] || { title: category, desc: '', icon: '📦' };
  return (
    <div className="page-content">
      <div style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)', padding: '48px 0' }}>
        <div className="container">
          <div className="section-label">{meta.icon} Category</div>
          <h1 className="heading-lg">{meta.title}</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '500px' }}>{meta.desc}</p>
        </div>
      </div>
      <div className="container section">
        <div className="shop-layout">
          <aside className="filter-sidebar">
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '24px' }}>Filters</h3>
            <div className="filter-section">
              <p className="filter-section-title">Price Range</p>
              <div className="price-range-inputs">
                <input type="number" className="form-input" placeholder="Min" />
                <input type="number" className="form-input" placeholder="Max" />
              </div>
            </div>
            <div className="filter-section">
              <p className="filter-section-title">Sort By</p>
              {['Newest', 'Price: Low to High', 'Price: High to Low', 'Best Rated'].map((opt) => (
                <label key={opt} className="filter-option"><input type="radio" name="sort" /> {opt}</label>
              ))}
            </div>
          </aside>
          <div>
            <ProductGrid category={category} />
          </div>
        </div>
      </div>
    </div>
  );
}
