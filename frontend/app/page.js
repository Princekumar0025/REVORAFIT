import Link from 'next/link';
import ProductGrid from '@/components/ProductGrid';
import FeedbackSection from '@/components/FeedbackSection';

export const metadata = {
  title: 'REVORAFIT — Recover • Rehab • Perform',
  description:
    'Premium fitness equipment, physiotherapy tools & medical recovery products. Shop REVORAFIT.',
};

const CATEGORIES = [
  {
    id: 'fitness',
    name: 'Fitness Equipment',
    icon: '🏋️',
    desc: 'Resistance bands, dumbbells, yoga mats & more',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
    count: '50+',
  },
  {
    id: 'physiotherapy',
    name: 'Physiotherapy',
    icon: '🧠',
    desc: 'TENS machines, therapy balls, massage rollers',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600',
    count: '30+',
  },
  {
    id: 'medical',
    name: 'Medical Equipment',
    icon: '🩹',
    desc: 'Knee support, back belts, compression sleeves',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600',
    count: '40+',
  },
];



const TICKER_ITEMS = [
  '🚚 Free shipping on orders above ₹999',
  '💳 EMI available on all orders',
  '🔄 Easy 30-day returns',
  '✅ 100% original products',
  '🎁 Use code RFIT10 for 10% off',
  '⚡ COD available across India',
];

export default function HomePage() {
  return (
    <div className="page-content">
      {/* Ticker */}
      <div className="ticker">
        <div className="ticker-inner">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="ticker-item">
              {item} <span className="ticker-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section className="hero" style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div className="hero-bg" />
        <div className="hero-grid" />
        
        <div className="container" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* HUGE RECTANGULAR LOGO DISPLAY */}
          <div style={{
            width: '100%',
            maxWidth: '1200px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '40px',
            aspectRatio: '16/9'
          }}>
            <img src="/logo.png" alt="REVORAFIT" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>

          <div className="hero-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="hero-tag">
              <span>🏆</span> India&apos;s Premium Recovery Brand
            </div>
            <p className="hero-subtitle">
              Professional-grade fitness equipment, physiotherapy tools &amp; medical recovery
              products — trusted by athletes and clinics across India.
            </p>
            <div className="hero-actions">
              <Link href="/shop" className="btn btn-primary btn-lg">
                Shop Now →
              </Link>
              <Link href="/shop/fitness" className="btn btn-outline btn-lg">
                Explore Collection
              </Link>
            </div>
            <div className="hero-stats">
              {[
                ['10K+', 'Happy Customers'],
                ['120+', 'Products'],
                ['4.8★', 'Rating'],
                ['48hr', 'Delivery'],
              ].map(([num, label]) => (
                <div key={label}>
                  <div className="hero-stat-number">{num}</div>
                  <div className="hero-stat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section" style={{ background: 'var(--bg-elevated)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label">Shop By Category</div>
            <h2 className="section-title">
              Everything You Need to <span className="text-gradient">Perform</span>
            </h2>
            <p className="section-desc">
              From strength training to rehabilitation — all in one place.
            </p>
          </div>
          <div className="category-grid">
            {CATEGORIES.map((cat) => (
              <Link key={cat.id} href={`/shop/${cat.id}`} className="category-card">
                <img src={cat.image} alt={cat.name} className="category-card-bg" />
                <div className="category-card-overlay" />
                <div className="category-card-content">
                  <div className="category-card-icon">{cat.icon}</div>
                  <h3 className="category-card-name">{cat.name}</h3>
                  <p className="category-card-count">{cat.count} Products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS — uses ProductGrid client component */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            <div>
              <div className="section-label">Featured Products</div>
              <h2 className="section-title" style={{ margin: 0 }}>
                Top Picks for <span className="text-gradient">You</span>
              </h2>
            </div>
            <Link href="/shop" className="btn btn-outline btn-sm">
              View All →
            </Link>
          </div>
          <ProductGrid featured={true} limit={8} />
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(126,217,87,0.1) 0%, rgba(126,217,87,0.02) 100%)',
              border: '1px solid rgba(126,217,87,0.2)',
              borderRadius: 'var(--radius-xl)',
              padding: '48px 40px',
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '32px',
              alignItems: 'center',
            }}
          >
            <div>
              <div className="section-label">Limited Offer</div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: '12px' }}>
                Get <span className="text-gradient">10% OFF</span> Your First Order
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Use code{' '}
                <strong
                  style={{
                    color: 'var(--primary)',
                    fontFamily: 'monospace',
                    fontSize: '1.1rem',
                  }}
                >
                  RFIT10
                </strong>{' '}
                at checkout
              </p>
              <Link href="/shop" className="btn btn-primary">
                Shop Now →
              </Link>
            </div>
            <div style={{ fontSize: '5rem', opacity: 0.6 }}>🎁</div>
          </div>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section
        className="section"
        style={{ background: 'var(--bg-elevated)', paddingTop: '60px', paddingBottom: '60px' }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            <div>
              <div className="section-label">Bestsellers</div>
              <h2 className="section-title" style={{ margin: 0 }}>
                Customer <span className="text-gradient">Favourites</span>
              </h2>
            </div>
            <Link href="/shop?bestseller=true" className="btn btn-outline btn-sm">
              View All →
            </Link>
          </div>
          <ProductGrid bestseller={true} limit={4} />
        </div>
      </section>

      {/* REVIEWS & FEEDBACK FORM */}
      <section className="section">
        <FeedbackSection />
      </section>

      {/* NEWSLETTER */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="newsletter-section">
            <div className="section-label" style={{ justifyContent: 'center' }}>
              Stay Updated
            </div>
            <h2
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                fontWeight: 800,
                marginBottom: '12px',
              }}
            >
              Get <span className="text-gradient">Exclusive Offers</span> in Your Inbox
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Subscribe for product launches, health tips &amp; special discounts.
            </p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email address" />
              <Link href="/shop" className="btn btn-primary">
                Subscribe
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
