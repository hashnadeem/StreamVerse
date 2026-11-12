import mongoose from 'mongoose';

const episodeSchema = new mongoose.Schema({
  episodeNumber: { type: Number, required: true },
  seasonNumber: { type: Number, default: 1 },
  title: { type: String, required: true },
  duration: { type: String, required: true },
  synopsis: { type: String, required: true },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String },
});

const titleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['Movie', 'Series'], required: true },
    synopsis: { type: String, required: true },
    genres: [{ type: String, required: true }],
    releaseYear: { type: Number, required: true },
    maturityRating: {
      type: String,
      enum: ['G', 'PG', 'TV-Y', 'TV-G', 'PG-13', 'TV-14', 'R', 'TV-MA'],
      default: 'PG-13',
    },
    isKidsSafe: { type: Boolean, default: false },
    duration: { type: String, required: true },
    cast: [{ type: String }],
    director: { type: String },
    posterUrl: { type: String, required: true },
    backdropUrl: { type: String, required: true },
    trailerUrl: { type: String },
    videoUrl: { type: String, required: true },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    newRelease: { type: Boolean, default: false },
    averageRating: { type: Number, default: 4.5 },
    ratingsCount: { type: Number, default: 1 },
    viewsCount: { type: Number, default: 100 },
    episodes: [episodeSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Title', titleSchema);

