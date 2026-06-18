'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FaGoogle, FaApple } from 'react-icons/fa';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    const res = await fetch('https://revorafit.vercel.app/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, email: form.email, password: form.password }) });
    const data = await res.json();
    if (data.error) toast.error(data.error);
    else { toast.success('Account created! Please sign in.'); router.push('/auth/login'); }
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
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)' }}>Join the REVORAFIT community</p>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '36px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[['name', 'Full Name', 'text', 'John Doe'], ['email', 'Email', 'email', 'you@example.com'], ['password', 'Password', 'password', 'Min 6 characters'], ['confirm', 'Confirm Password', 'password', 'Repeat password']].map(([key, label, type, placeholder]) => (
              <div key={key} className="form-group">
                <label className="form-label">{label}</label>
                <input type={type} className="form-input" placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required />
              </div>
            ))}
            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', width: '100%', padding: '14px' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', color: 'var(--text-muted)', margin: '10px 0' }}>
            <div style={{ flex: 1, borderBottom: '1px solid var(--border)' }}></div>
            <span style={{ padding: '0 10px', fontSize: '0.85rem' }}>OR</span>
            <div style={{ flex: 1, borderBottom: '1px solid var(--border)' }}></div>
          </div>

          <button onClick={() => handleOAuthSignIn('google')} className="btn btn-outline" style={{ justifyContent: 'center', width: '100%', padding: '14px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <FaGoogle /> Sign up with Google
          </button>
          <button onClick={() => handleOAuthSignIn('apple')} className="btn btn-outline" style={{ justifyContent: 'center', width: '100%', padding: '14px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <FaApple /> Sign up with Apple
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '10px' }}>Already have an account? <Link href="/auth/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}
