'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function FeedbackSection() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(`https://revorafit.vercel.app/api/reviews`);
      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status} when fetching from /api/reviews`);
      }
      const data = await res.json();
      setFeedbacks(data || []);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      return toast.error('Please provide a name and message');
    }

    setSubmitting(true);
    try {
      const res = await fetch(`https://revorafit.vercel.app/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rating, message }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Backend Error (${res.status}): ${text.substring(0, 50)} | URL: /api/reviews`);
      }

      const data = await res.json();
      toast.success('Thank you for your feedback!');
      setName('');
      setRating(5);
      setMessage('');
      fetchFeedbacks();
    } catch (error) {
      console.error("Submit Feedback Error:", error);
      toast.error(error.message, { duration: 6000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="section-header">
        <div className="section-label">Customer Reviews</div>
        <h2 className="section-title">
          What Our <span className="text-gradient">Customers Say</span>
        </h2>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Loading reviews...
        </div>
      ) : feedbacks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          No reviews yet. Be the first to share your thoughts!
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '48px',
          }}
        >
          {feedbacks.map((r, i) => (
            <div key={r._id || i} className="review-card">
              <div className="review-header">
                <div className="review-avatar">{r.name[0].toUpperCase()}</div>
                <div>
                  <p className="review-name">{r.name}</p>
                  <p className="review-date">{new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
              <div className="stars" style={{ marginBottom: '10px' }}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <span key={s} style={{ color: s < r.rating ? 'var(--warning)' : 'var(--border)' }}>★</span>
                ))}
              </div>
              <p className="review-text">&quot;{r.message}&quot;</p>
            </div>
          ))}
        </div>
      )}

      {/* Feedback Form */}
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        background: 'var(--bg-elevated)', 
        padding: '32px', 
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)' 
      }}>
        <h3 style={{ marginBottom: '24px', textAlign: 'center' }}>Leave Your Feedback</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div>
            <label className="form-label">Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Your name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Rating</label>
            <div style={{ display: 'flex', gap: '8px', fontSize: '1.5rem', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  onClick={() => setRating(star)}
                  style={{ color: star <= rating ? 'var(--warning)' : 'var(--border)' }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Message</label>
            <textarea 
              className="form-input" 
              rows="4" 
              placeholder="Tell us about your experience..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={submitting}
            style={{ marginTop: '8px' }}
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
}
