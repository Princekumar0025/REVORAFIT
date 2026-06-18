'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FaGoogle, FaApple } from 'react-icons/fa';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn('credentials', { ...form, redirect: false });
    if (result?.error) { toast.error(result.error); }
    else { toast.success('Welcome back!'); router.push('/'); router.refresh(); }
    setLoading(false);
  };

  const handleOAuthSignIn = (provider) => {
    signIn(provider, { callbackUrl: '/' });
  };

  return (
    <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img src="/logo.png" alt="REVORAFIT" style={{ height: '48px', margin: '0 auto 20px' }} />
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to your account</p>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '36px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="Enter password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', width: '100%', padding: '14px' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', color: 'var(--text-muted)', margin: '10px 0' }}>
            <div style={{ flex: 1, borderBottom: '1px solid var(--border)' }}></div>
            <span style={{ padding: '0 10px', fontSize: '0.85rem' }}>OR</span>
            <div style={{ flex: 1, borderBottom: '1px solid var(--border)' }}></div>
          </div>

          <button onClick={() => handleOAuthSignIn('google')} className="btn btn-outline" style={{ justifyContent: 'center', width: '100%', padding: '14px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <FaGoogle /> Sign in with Google
          </button>
          <button onClick={() => handleOAuthSignIn('apple')} className="btn btn-outline" style={{ justifyContent: 'center', width: '100%', padding: '14px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <FaApple /> Sign in with Apple
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '10px' }}>Don't have an account? <Link href="/auth/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register</Link></p>
        </div>
      </div>
    </div>
  );
}
