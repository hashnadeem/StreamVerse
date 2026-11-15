import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStream } from '../context/StreamContext';
import TitleCard from '../components/TitleCard';
import '../styles/browse.css';

const MyListPage = () => {
  const { activeProfile } = useAuth();
  const { visibleTitles } = useStream();

  const savedTitles = visibleTitles.filter((t) =>
    activeProfile?.myList?.includes(t.id)
  );

  const continueWatchingEntries = (activeProfile?.continueWatching || [])
    .map((entry) => {
      const titleObj = visibleTitles.find((t) => t.id === entry.titleId);
      return titleObj ? { titleObj, entry } : null;
    })
    .filter(Boolean);

  return (
    <div className="container page-offset">
      <div className="browse-header">
        <div>
          <h1>{activeProfile?.name || 'My'}&apos;s Watchlist & History</h1>
          <p>
            Personal titles bookmarked for later and playback resume checkpoints for this profile.
          </p>
        </div>
        <span className="results-counter">{savedTitles.length} Saved in My List</span>
      </div>

      {savedTitles.length === 0 ? (
        <div className="empty-browse-state" style={{ marginBottom: '3rem' }}>
          <h3>Your Watchlist is Empty</h3>
          <p>
            Click the &ldquo;＋ My List&rdquo; button on any movie or series card to save it to{' '}
            <strong>{activeProfile?.name}</strong>&apos;s personal list.
          </p>
          <Link to="/browse" className="btn btn-primary">
            Explore Movies & Series
          </Link>
        </div>
      ) : (
        <div className="browse-catalog-grid" style={{ marginBottom: '3.5rem' }}>
          {savedTitles.map((item) => (
            <TitleCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {continueWatchingEntries.length > 0 && (
        <div>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.45rem' }}>
            Continue Watching Progress
          </h2>
          <div className="browse-catalog-grid">
            {continueWatchingEntries.map(({ titleObj, entry }) => (
              <TitleCard
                key={titleObj.id}
                item={titleObj}
                progressInfo={entry}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListPage;

