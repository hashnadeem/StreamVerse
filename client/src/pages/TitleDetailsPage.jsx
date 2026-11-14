import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStream } from '../context/StreamContext';
import ReviewSection from '../components/ReviewSection';
import '../styles/details.css';

const TitleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeProfile, toggleMyList } = useAuth();
  const { getTitleById } = useStream();

  const item = getTitleById(id);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  if (!item) {
    return (
      <div className="container page-offset" style={{ textAlign: 'center' }}>
        <h2>Title Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '0.75rem 0 1.5rem' }}>
          The requested movie or series could not be located in the StreamVerse library.
        </p>
        <Link to="/browse" className="btn btn-primary">
          Back to Catalogue
        </Link>
      </div>
    );
  }

  // Enforce Kids profile restriction
  if (
    activeProfile?.isKids &&
    !item.isKidsSafe &&
    !['G', 'PG', 'TV-Y', 'TV-G'].includes(item.maturityRating)
  ) {
    return (
      <div className="container page-offset" style={{ textAlign: 'center' }}>
        <h2>Restricted in Kids Mode</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '0.75rem 0 1.5rem' }}>
          This title is rated <strong>{item.maturityRating}</strong> and is hidden under the active
          Kids profile.
        </p>
        <Link to="/" className="btn btn-primary">
          Return to Kids Home
        </Link>
      </div>
    );
  }

  const inMyList = activeProfile?.myList?.includes(item.id);
  const resumeEntry = activeProfile?.continueWatching?.find(
    (cw) => cw.titleId === item.id
  );

  const seasons =
    item.type === 'Series' && item.episodes?.length
      ? Array.from(new Set(item.episodes.map((ep) => ep.seasonNumber))).sort()
      : [];

  const seasonEpisodes = (item.episodes || []).filter(
    (ep) => ep.seasonNumber === Number(selectedSeason)
  );

  return (
    <div className="details-page">
      <div
        className="details-hero"
        style={{ backgroundImage: `url(${item.backdropUrl})` }}
      >
        <div className="details-hero-overlay" />

        <div className="details-hero-inner container">
          <img
            src={item.posterUrl}
            alt={item.title}
            className="details-poster-thumb"
          />

          <div className="details-main-info">
            <div className="details-badges-row">
              <span className="badge badge-maturity">{item.maturityRating}</span>
              <span>{item.type}</span>
              <span>•</span>
              <span>{item.releaseYear}</span>
              <span>•</span>
              <span>{item.duration}</span>
              <span className="details-rating-star">
                ★ {item.averageRating.toFixed(1)} ({item.ratingsCount} ratings)
              </span>
            </div>

            <h1>{item.title}</h1>
            <p className="details-synopsis">{item.synopsis}</p>

            <div className="details-credits-grid">
              <div>
                <span className="credit-label">Genres</span>
                <p>{item.genres.join(', ')}</p>
              </div>
              <div>
                <span className="credit-label">Starring Cast</span>
                <p>{item.cast.join(', ')}</p>
              </div>
              <div>
                <span className="credit-label">Director / Creator</span>
                <p>{item.director || 'StreamVerse Original'}</p>
              </div>
            </div>

            <div className="details-cta-bar">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate(`/watch/${item.id}`)}
              >
                ▶ {resumeEntry ? 'Resume Watching' : 'Watch Now'}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowTrailerModal(true)}
              >
                🎞️ Watch Official Trailer
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => toggleMyList(item.id)}
              >
                {inMyList ? '✓ Saved in My List' : '＋ Add to My List'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container details-body-sections">
        {item.type === 'Series' && item.episodes?.length > 0 && (
          <section className="episodes-section">
            <div className="episodes-header">
              <div>
                <h2>Episodes</h2>
                <p>Select an episode to stream directly in the player.</p>
              </div>

              {seasons.length > 1 && (
                <select
                  className="season-selector"
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(Number(e.target.value))}
                >
                  {seasons.map((s) => (
                    <option key={s} value={s}>
                      Season {s}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="episodes-list">
              {seasonEpisodes.map((ep) => (
                <div
                  key={ep.id || ep.episodeNumber}
                  className="episode-row-card"
                  onClick={() => navigate(`/watch/${item.id}?ep=${ep.id || ep.episodeNumber}`)}
                >
                  <div className="episode-number-badge">{ep.episodeNumber}</div>
                  <div className="episode-info">
                    <div className="episode-title-line">
                      <h4>{ep.title}</h4>
                      <span className="episode-duration">{ep.duration}</span>
                    </div>
                    <p>{ep.synopsis}</p>
                  </div>
                  <button type="button" className="btn btn-outline btn-sm">
                    ▶ Play
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        <ReviewSection titleId={item.id} titleName={item.title} />
      </div>

      {showTrailerModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowTrailerModal(false)}
        >
          <div
            className="trailer-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="trailer-modal-header">
              <h3>{item.title} — Official Trailer</h3>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setShowTrailerModal(false)}
              >
                ✕ Close
              </button>
            </div>
            <video
              src={item.trailerUrl || item.videoUrl}
              controls
              autoPlay
              className="trailer-video-element"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TitleDetailsPage;

