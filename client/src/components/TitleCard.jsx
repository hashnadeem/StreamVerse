import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TitleCard = ({ item, progressInfo = null }) => {
  const navigate = useNavigate();
  const { activeProfile, toggleMyList } = useAuth();

  const inMyList = activeProfile?.myList?.includes(item.id);
  const progressPercent =
    progressInfo && progressInfo.durationSeconds > 0
      ? Math.min(
          100,
          Math.round((progressInfo.progressSeconds / progressInfo.durationSeconds) * 100)
        )
      : 0;

  return (
    <article
      className="title-card"
      onClick={() => navigate(`/title/${item.id}`)}
    >
      <div className="title-card-media">
        <img src={item.posterUrl} alt={item.title} loading="lazy" />
        <div className="title-card-badges">
          <span className="card-type-pill">{item.type}</span>
          <span className="card-rating-pill">★ {item.averageRating.toFixed(1)}</span>
        </div>

        <div className="title-card-hover-overlay">
          <div className="card-quick-btns">
            <button
              type="button"
              className="card-circle-btn play"
              title="Play Now"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/watch/${item.id}`);
              }}
            >
              ▶
            </button>
            <button
              type="button"
              className={`card-circle-btn ${inMyList ? 'active' : ''}`}
              title={inMyList ? 'Remove from My List' : 'Add to My List'}
              onClick={(e) => {
                e.stopPropagation();
                toggleMyList(item.id);
              }}
            >
              {inMyList ? '✓' : '＋'}
            </button>
            <button
              type="button"
              className="card-circle-btn"
              title="Title Details"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/title/${item.id}`);
              }}
            >
              ⓘ
            </button>
          </div>
        </div>

        {progressPercent > 0 && (
          <div className="card-progress-bar">
            <div
              className="card-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      <div className="title-card-body">
        <h3 className="title-card-name">{item.title}</h3>
        <div className="title-card-meta">
          <span>{item.releaseYear}</span>
          <span className="badge badge-maturity">{item.maturityRating}</span>
          <span>{item.duration}</span>
        </div>
        <div className="title-card-genres">{item.genres.slice(0, 3).join(' • ')}</div>
      </div>
    </article>
  );
};

export default TitleCard;

