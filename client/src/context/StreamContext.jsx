import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_TITLES, INITIAL_REVIEWS } from '../data/seedCatalog';
import { useAuth } from './AuthContext';

const StreamContext = createContext(null);

const STORAGE_TITLES_KEY = 'streamverse_titles_v1';
const STORAGE_REVIEWS_KEY = 'streamverse_reviews_v1';

export const StreamProvider = ({ children }) => {
  const { activeProfile } = useAuth();

  const [titles, setTitles] = useState(() => {
    const saved = localStorage.getItem(STORAGE_TITLES_KEY);
    if (!saved) return INITIAL_TITLES;
    try {
      if (saved.includes('commondatastorage.googleapis.com')) {
        // Automatically sanitize broken legacy Google Cloud Storage sample URLs
        const sanitized = saved
          .replace(/https:\/\/commondatastorage\.googleapis\.com\/gtv-videos-bucket\/sample\/TearsOfSteel\.mp4/g, 'https://media.w3.org/2010/05/sintel/trailer.mp4')
          .replace(/https:\/\/commondatastorage\.googleapis\.com\/gtv-videos-bucket\/sample\/BigBuckBunny\.mp4/g, 'https://media.w3.org/2010/05/bunny/trailer.mp4')
          .replace(/https:\/\/commondatastorage\.googleapis\.com\/gtv-videos-bucket\/sample\/Sintel\.mp4/g, 'https://media.w3.org/2010/05/sintel/trailer.mp4')
          .replace(/https:\/\/commondatastorage\.googleapis\.com\/gtv-videos-bucket\/sample\/ElephantsDream\.mp4/g, 'https://vjs.zencdn.net/v/oceans.mp4')
          .replace(/https:\/\/commondatastorage\.googleapis\.com\/gtv-videos-bucket\/sample\/ForBiggerBlazes\.mp4/g, 'https://www.w3schools.com/html/mov_bbb.mp4')
          .replace(/https:\/\/commondatastorage\.googleapis\.com\/gtv-videos-bucket\/sample\/ForBiggerEscapes\.mp4/g, 'https://media.w3.org/2010/05/sintel/trailer.mp4')
          .replace(/https:\/\/commondatastorage\.googleapis\.com\/gtv-videos-bucket\/sample\/ForBiggerFun\.mp4/g, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4')
          .replace(/https:\/\/commondatastorage\.googleapis\.com\/gtv-videos-bucket\/sample\/ForBiggerJoyrides\.mp4/g, 'https://media.w3.org/2010/05/bunny/trailer.mp4')
          .replace(/https:\/\/commondatastorage\.googleapis\.com\/gtv-videos-bucket\/sample\/ForBiggerMeltdowns\.mp4/g, 'https://www.w3schools.com/html/mov_bbb.mp4')
          .replace(/https:\/\/commondatastorage\.googleapis\.com\/gtv-videos-bucket\/sample\/WeAreGoingOnBullrun\.mp4/g, 'https://vjs.zencdn.net/v/oceans.mp4')
          .replace(/https:\/\/commondatastorage\.googleapis\.com\/gtv-videos-bucket\/sample\/[A-Za-z0-9_-]+\.mp4/g, 'https://media.w3.org/2010/05/sintel/trailer.mp4');
        return JSON.parse(sanitized);
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_TITLES;
    }
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem(STORAGE_REVIEWS_KEY);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_TITLES_KEY, JSON.stringify(titles));
  }, [titles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(reviews));
  }, [reviews]);

  // Automatically filter titles when active profile is a Kids profile
  const visibleTitles = useMemo(() => {
    if (activeProfile?.isKids) {
      return titles.filter(
        (t) => t.isKidsSafe || ['G', 'PG', 'TV-Y', 'TV-G'].includes(t.maturityRating)
      );
    }
    return titles;
  }, [titles, activeProfile]);

  const getTitleById = (id) => titles.find((t) => t.id === id) || null;

  const getReviewsForTitle = (titleId) =>
    reviews.filter((r) => r.titleId === titleId);

  const addReview = ({ titleId, userId, profileName, rating, comment }) => {
    const numericRating = Number(rating);
    const newRev = {
      id: `rev-${Date.now()}`,
      titleId,
      userId,
      profileName,
      rating: numericRating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    const updatedReviews = [newRev, ...reviews];
    setReviews(updatedReviews);

    // Recalculate average rating for this title
    const titleReviews = updatedReviews.filter((r) => r.titleId === titleId);
    const avg =
      titleReviews.reduce((acc, r) => acc + Number(r.rating), 0) / titleReviews.length;

    setTitles((prev) =>
      prev.map((t) =>
        t.id === titleId
          ? {
              ...t,
              averageRating: Number(avg.toFixed(1)),
              ratingsCount: titleReviews.length,
            }
          : t
      )
    );
  };

  const incrementViews = (titleId) => {
    setTitles((prev) =>
      prev.map((t) =>
        t.id === titleId ? { ...t, viewsCount: (t.viewsCount || 0) + 1 } : t
      )
    );
  };

  // Admin CRUD operations
  const createTitle = (payload) => {
    const newItem = {
      id: `sv-${Date.now()}`,
      title: payload.title.trim(),
      type: payload.type || 'Movie',
      synopsis: payload.synopsis.trim(),
      genres: Array.isArray(payload.genres)
        ? payload.genres
        : payload.genres
            .split(',')
            .map((g) => g.trim())
            .filter(Boolean),
      releaseYear: Number(payload.releaseYear) || 2026,
      maturityRating: payload.maturityRating || 'PG-13',
      isKidsSafe: Boolean(payload.isKidsSafe),
      duration: payload.duration || '1h 45m',
      cast: Array.isArray(payload.cast)
        ? payload.cast
        : (payload.cast || '')
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean),
      director: payload.director || 'StreamVerse Studios',
      posterUrl:
        payload.posterUrl ||
        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
      backdropUrl:
        payload.backdropUrl ||
        payload.posterUrl ||
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
      trailerUrl:
        payload.videoUrl ||
        'https://media.w3.org/2010/05/sintel/trailer.mp4',
      videoUrl:
        payload.videoUrl ||
        'https://media.w3.org/2010/05/sintel/trailer.mp4',
      featured: Boolean(payload.featured),
      trending: Boolean(payload.trending),
      newRelease: true,
      averageRating: 4.7,
      ratingsCount: 1,
      viewsCount: 1,
      episodes: payload.episodes || [],
    };
    setTitles((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updateTitle = (id, updates) => {
    setTitles((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const parsedGenres = Array.isArray(updates.genres)
          ? updates.genres
          : typeof updates.genres === 'string'
          ? updates.genres
              .split(',')
              .map((g) => g.trim())
              .filter(Boolean)
          : t.genres;
        const parsedCast = Array.isArray(updates.cast)
          ? updates.cast
          : typeof updates.cast === 'string'
          ? updates.cast
              .split(',')
              .map((c) => c.trim())
              .filter(Boolean)
          : t.cast;

        return {
          ...t,
          ...updates,
          genres: parsedGenres,
          cast: parsedCast,
          releaseYear: Number(updates.releaseYear || t.releaseYear),
        };
      })
    );
  };

  const deleteTitle = (id) => {
    setTitles((prev) => prev.filter((t) => t.id !== id));
  };

  const addEpisodeToSeries = (seriesId, episodeData) => {
    setTitles((prev) =>
      prev.map((t) => {
        if (t.id !== seriesId) return t;
        const nextEp = {
          id: `ep-${Date.now()}`,
          seasonNumber: Number(episodeData.seasonNumber) || 1,
          episodeNumber: Number(episodeData.episodeNumber) || (t.episodes?.length || 0) + 1,
          title: episodeData.title.trim(),
          duration: episodeData.duration || '45m',
          synopsis: episodeData.synopsis.trim(),
          videoUrl:
            episodeData.videoUrl ||
            'https://media.w3.org/2010/05/sintel/trailer.mp4',
        };
        return {
          ...t,
          episodes: [...(t.episodes || []), nextEp],
        };
      })
    );
  };

  const deleteEpisodeFromSeries = (seriesId, episodeId) => {
    setTitles((prev) =>
      prev.map((t) => {
        if (t.id !== seriesId) return t;
        return {
          ...t,
          episodes: (t.episodes || []).filter((ep) => ep.id !== episodeId),
        };
      })
    );
  };

  return (
    <StreamContext.Provider
      value={{
        titles,
        visibleTitles,
        reviews,
        getTitleById,
        getReviewsForTitle,
        addReview,
        incrementViews,
        createTitle,
        updateTitle,
        deleteTitle,
        addEpisodeToSeries,
        deleteEpisodeFromSeries,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
};

export const useStream = () => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error('useStream must be used within a StreamProvider');
  }
  return context;
};

