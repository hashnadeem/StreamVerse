import Title from '../models/Title.js';
import Review from '../models/Review.js';

export const getAllTitles = async (req, res) => {
  try {
    const { genre, type, kidsOnly } = req.query;
    const filter = {};
    if (genre && genre !== 'All') filter.genres = genre;
    if (type && type !== 'All') filter.type = type;
    if (kidsOnly === 'true') filter.isKidsSafe = true;

    const titles = await Title.find(filter).sort({ createdAt: -1 });
    res.json(titles);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch titles', error: error.message });
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

export const addTitleReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { profileName, rating, comment } = req.body;
    const review = await Review.create({
      titleId: id,
      userId: req.user?.id || 'guest',
      profileName,
      rating,
      comment,
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: 'Failed to post review', error: error.message });
  }
};

