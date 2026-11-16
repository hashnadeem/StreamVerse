import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Title from './models/Title.js';
import Review from './models/Review.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/streamverse';

const SEED_TITLES = [
  {
    title: 'Chrono Nexus: Eclipse',
    type: 'Series',
    synopsis:
      'When a quantum communications array in low Earth orbit begins receiving transmissions from 48 hours in the future, a team of astrophysicists and cyber-intelligence operatives must race to prevent a global cascade failure.',
    genres: ['Sci-Fi', 'Thriller', 'Drama'],
    releaseYear: 2026,
    maturityRating: 'TV-14',
    isKidsSafe: false,
    duration: '2 Seasons',
    cast: ['Elena Vance', 'Marcus Sterling', 'Zainab Tariq', 'Kenji Takahashi'],
    director: 'Nolan Verma',
    posterUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    featured: true,
    trending: true,
    newRelease: true,
    averageRating: 4.8,
    ratingsCount: 142,
    viewsCount: 18420,
    episodes: [
      {
        episodeNumber: 1,
        seasonNumber: 1,
        title: 'Signal From Tomorrow',
        duration: '52m',
        synopsis:
          'Dr. Elena Vance intercepts an encrypted telemetry packet originating from her own orbital station—dated two days in the future.',
        videoUrl:
          'https://media.w3.org/2010/05/sintel/trailer.mp4',
      },
      {
        episodeNumber: 2,
        seasonNumber: 1,
        title: 'The Paradox Protocol',
        duration: '49m',
        synopsis:
          'As power grids flicker across three continents, Marcus uncovers a covert syndicate manipulating temporal market data.',
        videoUrl:
          'https://vjs.zencdn.net/v/oceans.mp4',
      },
      {
        episodeNumber: 3,
        seasonNumber: 1,
        title: 'Event Horizon Zero',
        duration: '55m',
        synopsis:
          'The crew executes an unauthorized spacewalk to recalibrate the relay before the predicted solar storm hits.',
        videoUrl:
          'https://www.w3schools.com/html/mov_bbb.mp4',
      },
    ],
  },
  {
    title: 'Shadow Vanguard: Bosphorus Protocol',
    type: 'Movie',
    synopsis:
      'A disgraced covert operative is summoned out of retirement in Istanbul when a bio-synthetic biometric cipher is stolen from a NATO summit vault.',
    genres: ['Action', 'Thriller', 'Mystery'],
    releaseYear: 2026,
    maturityRating: 'R',
    isKidsSafe: false,
    duration: '2h 14m',
    cast: ['Tariq Al-Mansoor', 'Svetlana Rostova', 'Julian Kane'],
    director: 'Denis Renault',
    posterUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    backdropUrl:
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    videoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    featured: false,
    trending: true,
    newRelease: true,
    averageRating: 4.6,
    ratingsCount: 98,
    viewsCount: 14200,
    episodes: [],
  },
  {
    title: 'Aero: Cloud Kingdom Explorers',
    type: 'Movie',
    synopsis:
      'Join Pip the flying fox and his whimsical robot companion, Gears, on an airborne treasure quest above the floating islands of Nimbus.',
    genres: ['Kids & Family', 'Animation', 'Adventure'],
    releaseYear: 2026,
    maturityRating: 'G',
    isKidsSafe: true,
    duration: '1h 32m',
    cast: ['Tara Strong', 'Tom Kenny', 'Ben Schwartz'],
    director: 'Maya Lin',
    posterUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdropUrl:
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    videoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    featured: false,
    trending: false,
    newRelease: true,
    averageRating: 4.9,
    ratingsCount: 210,
    viewsCount: 22100,
    episodes: [],
  },
  {
    title: 'Neon Odyssey: Tokyo Syndicate',
    type: 'Series',
    synopsis:
      'In a rainy neo-Tokyo where memory implants are traded like currency, an unlicensed cyber-detective investigates an impossible digital ghost.',
    genres: ['Sci-Fi', 'Mystery', 'Action'],
    releaseYear: 2025,
    maturityRating: 'TV-MA',
    isKidsSafe: false,
    duration: '1 Season',
    cast: ['Ryo Kusanagi', 'Maya Lin', 'Caleb Thorne'],
    director: 'Shinji Ogawa',
    posterUrl:
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
    backdropUrl:
      'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    featured: false,
    trending: true,
    newRelease: false,
    averageRating: 4.7,
    ratingsCount: 88,
    viewsCount: 11200,
    episodes: [
      {
        episodeNumber: 1,
        seasonNumber: 1,
        title: 'Shinjuku Neon Drift',
        duration: '48m',
        synopsis: 'A routine memory extraction job goes sideways in the rain-soaked alleys.',
        videoUrl:
          'https://media.w3.org/2010/05/sintel/trailer.mp4',
      },
    ],
  },
];

async function seedDatabase() {
  try {
    console.log('[Seed] Connecting to MongoDB at', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected to database');

    await User.deleteMany({});
    await Title.deleteMany({});
    await Review.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // Seed default evaluated users
    const adminUser = await User.create({
      name: 'Haris Hassaan',
      email: 'harishassaan2004@gmail.com',
      passwordHash,
      role: 'admin',
      subscriptionPlan: 'premium',
      profiles: [
        {
          name: 'Haris',
          avatarColor: '#e50914',
          avatarIcon: '🎬',
          isKids: false,
          myList: [],
          continueWatching: [],
        },
        {
          name: 'Hashir',
          avatarColor: '#3b82f6',
          avatarIcon: '🚀',
          isKids: false,
          myList: [],
          continueWatching: [],
        },
        {
          name: 'Kids Zone',
          avatarColor: '#00b4d8',
          avatarIcon: '🌟',
          isKids: true,
          myList: [],
          continueWatching: [],
        },
      ],
    });

    const standardUser = await User.create({
      name: 'Hashir Nadeem',
      email: 'nadeemhashir53@gmail.com',
      passwordHash,
      role: 'user',
      subscriptionPlan: 'standard',
      profiles: [
        {
          name: 'Hashir',
          avatarColor: '#e50914',
          avatarIcon: '🎮',
          isKids: false,
          myList: [],
          continueWatching: [],
        },
        {
          name: 'Junior',
          avatarColor: '#10b981',
          avatarIcon: '🧸',
          isKids: true,
          myList: [],
          continueWatching: [],
        },
      ],
    });

    console.log(`[Seed] Created ${[adminUser, standardUser].length} users`);

    // Seed titles
    const createdTitles = await Title.insertMany(SEED_TITLES);
    console.log(`[Seed] Created ${createdTitles.length} catalogue titles`);

    // Seed initial reviews
    await Review.create({
      titleId: String(createdTitles[0]._id),
      userId: String(adminUser._id),
      profileName: 'Haris',
      rating: 5,
      comment: 'Incredible sci-fi world-building and pacing. Episode 3 kept me on the edge of my seat!',
    });

    await Review.create({
      titleId: String(createdTitles[0]._id),
      userId: String(standardUser._id),
      profileName: 'Hashir',
      rating: 5,
      comment: 'The soundtrack and visuals are cinema quality. Super excited for Season 2.',
    });

    console.log('[Seed] Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
}

seedDatabase();
