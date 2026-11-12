import mongoose from 'mongoose';

const watchProgressSchema = new mongoose.Schema(
  {
    titleId: { type: String, required: true },
    episodeId: { type: String, default: null },
    progressSeconds: { type: Number, default: 0 },
    durationSeconds: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  avatarColor: { type: String, default: '#e50914' },
  avatarIcon: { type: String, default: '🎬' },
  isKids: { type: Boolean, default: false },
  myList: [{ type: String }],
  continueWatching: [watchProgressSchema],
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    subscriptionPlan: {
      type: String,
      enum: ['basic', 'standard', 'premium'],
      default: 'standard',
    },
    profiles: {
      type: [profileSchema],
      validate: [
        (arr) => arr.length <= 4,
        'An account can have a maximum of 4 viewing profiles.',
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);

