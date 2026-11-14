import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStream } from '../context/StreamContext';
import { GENRE_LIST } from '../data/seedCatalog';
import TitleCard from '../components/TitleCard';
import '../styles/browse.css';

const BrowsePage = () => {
  const { visibleTitles } = useStream();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    const qParam = searchParams.get('q');
    if (qParam !== null) {
      setQuery(qParam);
    }
  }, [searchParams]);

  const filteredTitles = useMemo(() => {
    return visibleTitles
      .filter((item) => {
        const matchesQuery =
          !query.trim() ||
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.synopsis.toLowerCase().includes(query.toLowerCase()) ||
          item.cast.some((actor) => actor.toLowerCase().includes(query.toLowerCase()));

        const matchesGenre =
          selectedGenre === 'All' || item.genres.includes(selectedGenre);

        const matchesType =
          selectedType === 'All' || item.type === selectedType;

        const matchesYear =
          selectedYear === 'All' || String(item.releaseYear) === selectedYear;

        const matchesRating = item.averageRating >= Number(minRating);

        return (
          matchesQuery &&
          matchesGenre &&
          matchesType &&
          matchesYear &&
          matchesRating
        );
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.averageRating - a.averageRating;
        if (sortBy === 'newest') return b.releaseYear - a.releaseYear;
        if (sortBy === 'az') return a.title.localeCompare(b.title);
        return (b.viewsCount || 0) - (a.viewsCount || 0);
      });
  }, [visibleTitles, query, selectedGenre, selectedType, selectedYear, minRating, sortBy]);

  const resetFilters = () => {
    setQuery('');
    setSelectedGenre('All');
    setSelectedType('All');
    setSelectedYear('All');
    setMinRating(0);
    setSortBy('popular');
  };

  return (
    <div className="browse-page container page-offset">
      <div className="browse-header">
        <div>
          <h1>Explore Catalogue</h1>
          <p>
            Search by title or cast, and filter across genres, media types, release years, and
            community ratings.
          </p>
        </div>
        <span className="results-counter">{filteredTitles.length} Titles Found</span>
      </div>

      <div className="filter-toolbar">
        <div className="filter-search-box">
          <input
            type="search"
            placeholder="Search movies, series, or cast members..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="filter-controls-grid">
          <div className="filter-item">
            <label>Media Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Movie">Movies Only</option>
              <option value="Series">TV Series Only</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Release Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="All">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Minimum Rating</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
            >
              <option value={0}>Any Rating</option>
              <option value={4.5}>★ 4.5 & Above</option>
              <option value={4.7}>★ 4.7 & Above</option>
              <option value={4.8}>★ 4.8 & Above</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="popular">Most Watched</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Release</option>
              <option value="az">Title (A–Z)</option>
            </select>
          </div>
        </div>

        <div className="genre-chips-bar">
          {GENRE_LIST.map((genre) => (
            <button
              type="button"
              key={genre}
              className={`genre-chip ${selectedGenre === genre ? 'active' : ''}`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
          <button type="button" className="reset-chip-btn" onClick={resetFilters}>
            Reset All
          </button>
        </div>
      </div>

      {filteredTitles.length === 0 ? (
        <div className="empty-browse-state">
          <h3>No matching titles found</h3>
          <p>Try clearing some filters or searching for a different keyword.</p>
          <button type="button" className="btn btn-primary" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="browse-catalog-grid">
          {filteredTitles.map((item) => (
            <TitleCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowsePage;

