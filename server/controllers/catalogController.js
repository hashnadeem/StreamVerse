import Title from '../models/Title.js';
import Review from '../models/Review.js';
import User from '../models/User.js';

export const getAllTitles = async (req, res) => {
  try {
    const { genre, type, kidsOnly, search } = req.query;
    const filter = {};

    if (genre && genre !== 'All') filter.genres = genre;
    if (type && type !== 'All') filter.type = type;
    if (kidsOnly === 'true') filter.isKidsSafe = true;
    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { synopsis: { $regex: search.trim(), $options: 'i' } },
        { cast: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const titles = await Title.find(filter).sort({ createdAt: -1 });
    res.json(titles);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch titles', error: error.message });
  }
};

export const getTitleById = async (req, res) => {
  try {
    const { id } = req.params;
    const title = await Title.findById(id);
    if (!title) {
      return res.status(404).json({ message: 'Title not found' });
    }
    const reviews = await Review.find({ titleId: id }).sort({ createdAt: -1 });
    res.json({ title, reviews });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch title details', error: error.message });
  }
};

export const createCatalogTitle = async (req, res) => {
  try {
    const created = await Title.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create title', error: error.message });
  }
};

export const updateCatalogTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Title.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: 'Title not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update title', error: error.message });
  }
};

export const deleteCatalogTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Title.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Title not found' });
    }
    // Also remove associated reviews
    await Review.deleteMany({ titleId: id });
    res.json({ message: 'Title and related reviews deleted successfully', id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete title', error: error.message });
  }
};

export const addEpisode = async (req, res) => {
  try {
    const { id } = req.params;
    const series = await Title.findById(id);
    if (!series || series.type !== 'Series') {
      return res.status(404).json({ message: 'Series title not found' });
    }

    const { episodeNumber, seasonNumber, title, duration, synopsis, videoUrl } = req.body;
    const newEp = {
      episodeNumber: Number(episodeNumber) || series.episodes.length + 1,
      seasonNumber: Number(seasonNumber) || 1,
      title: title.trim(),
      duration: duration || '45m',
      synopsis: synopsis.trim(),
      videoUrl,
    };

    series.episodes.push(newEp);
    await series.save();
    res.status(201).json(series);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add episode', error: error.message });
  }
};

export const deleteEpisode = async (req, res) => {
  try {
    const { id, epId } = req.params;
    const series = await Title.findById(id);
    if (!series) {
      return res.status(404).json({ message: 'Series title not found' });
    }

    series.episodes = series.episodes.filter(
      (ep) => String(ep._id) !== epId && String(ep.id) !== epId
    );
    await series.save();
    res.json(series);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete episode', error: error.message });
  }
};

export const getCatalogStats = async (_req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTitles = await Title.countDocuments();
    const moviesCount = await Title.countDocuments({ type: 'Movie' });
    const seriesCount = await Title.countDocuments({ type: 'Series' });

    const titles = await Title.find().select('title viewsCount averageRating');
    const totalStreams = titles.reduce((acc, t) => acc + (t.viewsCount || 0), 0);
    const mostWatched = [...titles].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))[0] || null;

    res.json({
      totalUsers,
      totalTitles,
      moviesCount,
      seriesCount,
      totalStreams,
      mostWatched,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch catalog statistics', error: error.message });
  }
};

export const addTitleReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { profileName, rating, comment } = req.body;
    const numericRating = Math.max(1, Math.min(5, Number(rating) || 5));

    const review = await Review.create({
      titleId: id,
      userId: req.user?.id || 'guest',
      profileName: profileName || 'Viewer',
      rating: numericRating,
      comment: comment ? comment.trim() : '',
    });

    // Update title average rating in MongoDB
    const titleReviews = await Review.find({ titleId: id });
    const avg =
      titleReviews.reduce((acc, r) => acc + Number(r.rating), 0) / titleReviews.length;

    await Title.findByIdAndUpdate(id, {
      averageRating: Number(avg.toFixed(1)),
      ratingsCount: titleReviews.length,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: 'Failed to post review', error: error.message });
  }
};
