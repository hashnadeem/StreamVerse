import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStream } from '../context/StreamContext';

const ReviewSection = ({ titleId, titleName }) => {
  const { currentUser, activeProfile } = useAuth();
  const { getReviewsForTitle, addReview } = useStream();

  const titleReviews = getReviewsForTitle(titleId);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittedMsg, setSubmittedMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addReview({
      titleId,
      userId: currentUser?.id || 'guest',
      profileName: activeProfile?.name || currentUser?.name || 'Viewer',
      rating,
      comment,
    });

    setComment('');
    setRating(5);
    setSubmittedMsg('Your rating and review have been published!');
    setTimeout(() => setSubmittedMsg(''), 3500);
  };

  return (
    <section className="reviews-section">
      <div className="reviews-layout">
        <div className="review-form-box">
          <h3>Rate & Review {titleName}</h3>
          <p className="review-sub">
            Share your thoughts as <strong>{activeProfile?.name || 'Viewer'}</strong>.
          </p>

          {submittedMsg && <div className="review-success-banner">{submittedMsg}</div>}

          <form onSubmit={handleSubmit} className="review-form">
            <div className="star-picker-row">
              <span>Your Rating:</span>
              <div className="star-buttons">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className={`star-btn ${star <= rating ? 'filled' : ''}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
              <span className="rating-numeric">{rating} / 5</span>
            </div>

            <textarea
              rows={3}
              placeholder="Write your review of the storyline, acting, or cinematography..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />

            <button type="submit" className="btn btn-primary">
              Post Review
            </button>
          </form>
        </div>

        <div className="reviews-feed-box">
          <h3>Community Reviews ({titleReviews.length})</h3>
          {titleReviews.length === 0 ? (
            <p className="no-reviews-note">
              No reviews yet for this title. Be the first to rate it!
            </p>
          ) : (
            <div className="reviews-list">
              {titleReviews.map((rev) => (
                <article key={rev.id} className="review-card">
                  <div className="review-card-top">
                    <strong>{rev.profileName}</strong>
                    <span className="review-stars">
                      {'★'.repeat(rev.rating)}
                      {'☆'.repeat(5 - rev.rating)}
                    </span>
                  </div>
                  <p className="review-comment">{rev.comment}</p>
                  <span className="review-date">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;

