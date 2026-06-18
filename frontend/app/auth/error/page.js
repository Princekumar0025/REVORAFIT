'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div style={{ padding: '100px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--danger)', marginBottom: '20px' }}>Authentication Error</h1>
      <div style={{ background: 'var(--bg-elevated)', padding: '20px', borderRadius: '8px', border: '1px solid var(--danger)', marginBottom: '30px' }}>
        <p style={{ fontWeight: 'bold' }}>Error Code: {error || 'Unknown Error'}</p>
        <p style={{ marginTop: '10px', color: 'var(--text-muted)' }}>
          This usually happens if the backend server is unreachable, your API URL is misconfigured (e.g. missing https://), or your database connection failed.
        </p>
      </div>
      <Link href="/auth/login" className="btn btn-primary">
        Back to Login
      </Link>
    </div>
  );
}
