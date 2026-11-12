import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    titleId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    profileName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);

