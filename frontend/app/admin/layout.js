'use client';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '📦' },
  { href: '/admin/orders', label: 'Orders', icon: '📋' },
  { href: '/admin/coupons', label: 'Coupons', icon: '🎟️' },
  { href: '/admin/banners', label: 'Banners', icon: '🖼️' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
];

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
    if (status === 'authenticated' && session?.user?.role !== 'admin') router.push('/');
  }, [status, session]);

  if (status === 'loading') return <div className="loading-container" style={{ minHeight: '100vh' }}><div className="spinner" /></div>;
  if (!session || session.user?.role !== 'admin') return null;

  return (
    <div className="admin-layout">
      {/* Overlay for mobile */}
      {sidebarOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }} onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <img src="/logo.png" alt="REVORAFIT" style={{ height: '36px', width: 'auto' }} />
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Admin Panel</p>
        </div>
        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
          <Link href="/" className="admin-nav-item" style={{ marginBottom: '4px' }}>
            <span className="admin-nav-icon">🏠</span>
            View Store
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
            className="admin-nav-item"
            style={{ width: '100%', textAlign: 'left', cursor: 'pointer', color: 'var(--danger)' }}
          >
            <span className="admin-nav-icon">🚪</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <div className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1rem', color: 'var(--text-secondary)' }}
            >
              ☰
            </button>
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
              {NAV_ITEMS.find((n) => n.href === pathname)?.label || 'Admin'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Welcome, <strong style={{ color: 'var(--primary)' }}>{session.user.name}</strong></span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-glow)', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--primary)' }}>{session.user.name?.[0]}</div>
          </div>
        </div>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
