'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <img src="/logo.png" alt="REVORAFIT" className="footer-brand-logo" />
            <p className="footer-brand-desc">
              Your ultimate destination for premium fitness equipment, physiotherapy tools, and medical recovery products. Recover smarter. Train harder.
            </p>
            <div className="footer-social" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="https://www.instagram.com/p/DYrqIOnoiU9/?igsh=azBkeTZlcnByMWh5" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ justifyContent: 'center', width: 'fit-content' }}>
                📸 Follow us on Instagram
              </a>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[['Facebook', 'https://facebook.com'], ['YouTube', 'https://youtube.com'], ['Twitter', 'https://twitter.com']].map(([name, href]) => (
                  <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="social-btn" title={name}>
                    {name === 'Facebook' ? '📘' : name === 'YouTube' ? '🎥' : '🐦'}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Shop</h4>
            <ul className="footer-links">
              {[['Fitness Equipment', '/shop/fitness'], ['Physiotherapy', '/shop/physiotherapy'], ['Medical Equipment', '/shop/medical'], ['New Arrivals', '/shop?newArrival=true'], ['Best Sellers', '/shop?bestseller=true'], ['Offers & Deals', '/shop?sale=true']].map(([label, href]) => (
                <li key={href}><Link href={href}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              {[['Track Order', '/track-order'], ['Shipping Policy', '/shipping'], ['Return Policy', '/returns'], ['FAQ', '/faq'], ['Contact Us', '/contact'], ['💬 Chat on WhatsApp', `https://wa.me/919027706460`]].map(([label, href]) => (
                <li key={href}>
                  {href.startsWith('http') ? (
                    <a href={href} target="_blank" rel="noopener noreferrer">{label}</a>
                  ) : (
                    <Link href={href}>{label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-links">
              <li style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                📧 <a href="mailto:manualclinicphysio2308@gmail.com" style={{ textDecoration: 'underline' }}>manualclinicphysio2308@gmail.com</a>
              </li>
              <li style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                📞 <a href="tel:+919027706460" style={{ textDecoration: 'underline' }}>+91-9027706460</a>
              </li>
              <li style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '8px' }}>
                Mon-Sat: 9AM - 7PM IST
              </li>
            </ul>
            <div style={{ marginTop: '20px' }}>
              <h4 className="footer-heading">We Accept</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                {['UPI', 'Card', 'COD', 'GPay'].map((m) => (
                  <span key={m} style={{
                    padding: '4px 10px',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                  }}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', width: '100%' }}>
          <p>© {new Date().getFullYear()} REVORAFIT. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            {[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms']].map(([label, href]) => (
              <Link key={href} href={href} style={{ transition: 'color var(--transition)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '')}
              >{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
