import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HeroBanner = ({ titleItem }) => {
  const navigate = useNavigate();
  const { activeProfile, toggleMyList } = useAuth();

  if (!titleItem) return null;

  const inMyList = activeProfile?.myList?.includes(titleItem.id);

  return (
    <section
      className="hero-banner"
      style={{ backgroundImage: `url(${titleItem.backdropUrl})` }}
    >
      <div className="hero-gradient-vignette" />

      <div className="hero-content container">
        <div className="hero-top-tags">
          <span className="hero-series-tag">
            <strong>S</strong> STREAMVERSE ORIGINAL • {titleItem.type.toUpperCase()}
          </span>
          {titleItem.isKidsSafe && <span className="badge badge-kids">FAMILY SAFE</span>}
        </div>

        <h1 className="hero-title">{titleItem.title}</h1>

        <div className="hero-meta-row">
          <span className="badge-match">98% Match</span>
          <span>{titleItem.releaseYear}</span>
          <span className="badge badge-maturity">{titleItem.maturityRating}</span>
          <span>{titleItem.duration}</span>
          <span className="badge badge-hd">4K HDR</span>
          <span className="hero-star">★ {titleItem.averageRating.toFixed(1)}</span>
        </div>

        <p className="hero-synopsis">{titleItem.synopsis}</p>

        <div className="hero-actions">
          <button
            type="button"
            className="btn btn-light hero-play-btn"
            onClick={() => navigate(`/watch/${titleItem.id}`)}
          >
            ▶ Play Now
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(`/title/${titleItem.id}`)}
          >
            ⓘ More Info & Episodes
          </button>

          <button
            type="button"
            className="btn btn-outline"
            onClick={() => toggleMyList(titleItem.id)}
          >
            {inMyList ? '✓ In My List' : '＋ My List'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

