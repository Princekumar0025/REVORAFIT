'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, email: form.email, password: form.password }) });
    const data = await res.json();
    if (data.error) toast.error(data.error);
    else { toast.success('Account created! Please sign in.'); router.push('/auth/login'); }
    setLoading(false);
  };

  return (
    <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img src="/logo.png" alt="REVORAFIT" style={{ height: '48px', margin: '0 auto 20px' }} />
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)' }}>Join the REVORAFIT community</p>
        </div>
        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '36px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[['name', 'Full Name', 'text', 'John Doe'], ['email', 'Email', 'email', 'you@example.com'], ['password', 'Password', 'password', 'Min 6 characters'], ['confirm', 'Confirm Password', 'password', 'Repeat password']].map(([key, label, type, placeholder]) => (
            <div key={key} className="form-group">
              <label className="form-label">{label}</label>
              <input type={type} className="form-input" placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required />
            </div>
          ))}
          <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', width: '100%', padding: '14px' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Already have an account? <Link href="/auth/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link></p>
        </form>
      </div>
    </div>
  );
}
