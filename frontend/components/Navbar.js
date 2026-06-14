'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Fitness', href: '/shop/fitness' },
    { label: 'Physiotherapy', href: '/shop/physiotherapy' },
    { label: 'Medical', href: '/shop/medical' },
    { label: 'Offers', href: '/shop?sale=true' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          {/* Logo */}
          <Link href="/" className="navbar-logo">
            <img src="/logo.png" alt="REVORAFIT" style={{ height: '42px', width: 'auto' }} />
          </Link>

          {/* Desktop Nav */}
          <div className="navbar-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="navbar-search">
            <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Actions */}
          <div className="navbar-actions">
            <Link href="/wishlist" className="navbar-icon-btn" title="Wishlist">
              ❤️
              {wishlist.length > 0 && (
                <span className="cart-badge">{wishlist.length}</span>
              )}
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="navbar-icon-btn"
              title="Cart"
            >
              🛒
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </button>

            {/* User Menu */}
            <div ref={userMenuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="navbar-icon-btn"
                title="Account"
              >
                {session?.user?.avatar ? (
                  <img
                    src={session.user.avatar}
                    alt="avatar"
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  '👤'
                )}
              </button>
              {userMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    minWidth: '180px',
                    zIndex: 200,
                    boxShadow: 'var(--shadow)',
                    animation: 'fadeInUp 0.2s ease',
                    overflow: 'hidden',
                  }}
                >
                  {session ? (
                    <>
                      <div
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid var(--border)',
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {session.user.name}
                      </div>
                      {session.user.role === 'admin' && (
                        <Link
                          href="/admin"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '12px 16px',
                            fontSize: '0.875rem',
                            color: 'var(--primary)',
                            transition: 'background var(--transition)',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          ⚙️ Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => { signOut(); setUserMenuOpen(false); }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          textAlign: 'left',
                          background: 'none',
                          color: 'var(--danger)',
                          fontSize: '0.875rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                      >
                        🚪 Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        style={{
                          display: 'block',
                          padding: '12px 16px',
                          fontSize: '0.875rem',
                          transition: 'background var(--transition)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        🔑 Sign In
                      </Link>
                      <Link
                        href="/auth/register"
                        style={{
                          display: 'block',
                          padding: '12px 16px',
                          fontSize: '0.875rem',
                          color: 'var(--primary)',
                          transition: 'background var(--transition)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        ✨ Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'var(--bg-card)',
              borderBottom: '1px solid var(--border)',
              padding: '16px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              animation: 'fadeInUp 0.2s ease',
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
                onClick={() => setMobileOpen(false)}
                style={{ padding: '12px 16px' }}
              >
                {link.label}
              </Link>
            ))}
            <form onSubmit={handleSearch} style={{ marginTop: '8px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        )}
      </nav>

      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </>
  );
}
