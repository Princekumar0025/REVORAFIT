export const metadata = {
  title: 'Not Found',
  description: 'Page not found',
};

export default function NotFound() {
  return (
    <div
      className="page-content"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        gap: '24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '8rem',
          lineHeight: 1,
          background: 'linear-gradient(135deg, var(--primary), transparent)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 900,
          letterSpacing: '-0.05em',
        }}
      >
        404
      </div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Page Not Found</h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a href="/" className="btn btn-primary btn-lg">
        Go Home →
      </a>
    </div>
  );
}
