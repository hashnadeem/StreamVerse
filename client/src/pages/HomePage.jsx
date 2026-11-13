import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStream } from '../context/StreamContext';
import HeroBanner from '../components/HeroBanner';
import ContentRow from '../components/ContentRow';
import '../styles/home.css';

const HomePage = () => {
  const { activeProfile } = useAuth();
  const { visibleTitles } = useStream();

  const featuredTitle =
    visibleTitles.find((t) => t.featured) || visibleTitles[0] || null;

  // Map continue watching progress for the active profile
  const progressMap = {};
  (activeProfile?.continueWatching || []).forEach((cw) => {
    progressMap[cw.titleId] = cw;
  });

  const continueWatchingItems = (activeProfile?.continueWatching || [])
    .map((cw) => visibleTitles.find((t) => t.id === cw.titleId))
    .filter(Boolean);

  const myListItems = visibleTitles.filter((t) =>
    activeProfile?.myList?.includes(t.id)
  );

  const trendingItems = visibleTitles.filter((t) => t.trending);
  const newReleaseItems = visibleTitles.filter((t) => t.newRelease);
  const topRatedItems = [...visibleTitles].sort(
    (a, b) => b.averageRating - a.averageRating
  );
  const sciFiActionItems = visibleTitles.filter((t) =>
    t.genres.some((g) => ['Sci-Fi', 'Action', 'Thriller'].includes(g))
  );
  const familyKidsItems = visibleTitles.filter(
    (t) => t.isKidsSafe || t.genres.includes('Kids & Family')
  );

  return (
    <div className="home-page">
      <HeroBanner titleItem={featuredTitle} />

      {activeProfile?.isKids && (
        <div className="container">
          <div className="kids-mode-banner">
            <div>
              <strong>🌟 Kids Safe Profile Active ({activeProfile.name})</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Showing only age-appropriate titles rated G, PG, TV-Y, and TV-G.
              </p>
            </div>
            <Link to="/profiles" className="btn btn-outline btn-sm">
              Switch Profile
            </Link>
          </div>
        </div>
      )}

      <div className="content-rows-stack" style={{ marginTop: '1.8rem' }}>
        {continueWatchingItems.length > 0 && (
          <ContentRow
            heading={`Continue Watching for ${activeProfile?.name || 'You'}`}
            subtitle="Pick up right where you left off"
            items={continueWatchingItems}
            progressMap={progressMap}
          />
        )}

        {myListItems.length > 0 && (
          <ContentRow
            heading="My List"
            subtitle="Your personal saved watchlist"
            items={myListItems}
          />
        )}

        <ContentRow
          heading="Trending Now"
          subtitle="Most-streamed movies and series this week on StreamVerse"
          items={trendingItems}
        />

        <ContentRow
          heading="New Releases"
          subtitle="Fresh originals and latest season premieres"
          items={newReleaseItems}
        />

        <ContentRow
          heading="Top Rated on StreamVerse"
          subtitle="Highest community ratings and reviews"
          items={topRatedItems}
        />

        {sciFiActionItems.length > 0 && (
          <ContentRow
            heading="Sci-Fi, Cyberpunk & High-Octane Thrillers"
            items={sciFiActionItems}
          />
        )}

        {familyKidsItems.length > 0 && (
          <ContentRow
            heading="Kids, Animation & Family Adventures"
            items={familyKidsItems}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;

