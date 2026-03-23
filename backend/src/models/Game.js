/* Game Model - Stores game metadata and configuration */
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    // Game Info
    title: {
      type: String,
      required: [true, 'Game title is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[a-z0-9-]+$/,
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    thumbnail: {
      url: String,
      publicId: String,
    },
    coverImage: {
      url: String,
      publicId: String,
    },

    // Category
    category: {
      type: String,
      enum: [
        'casual',
        'arcade',
        'puzzle',
        'action',
        'multiplayer',
        'unique',
      ],
      required: true,
    },

    // Game Details
    developer: String,
    version: {
      type: String,
      default: '1.0.0',
    },
    releaseDate: Date,
    lastUpdated: Date,

    // Gameplay
    minPlayers: {
      type: Number,
      default: 1,
    },
    maxPlayers: {
      type: Number,
      default: 1,
    },
    isMultiplayer: {
      type: Boolean,
      default: false,
    },
    hasAI: {
      type: Boolean,
      default: false,
    },
    difficultyLevels: [
      {
        type: String,
        enum: ['easy', 'medium', 'hard'],
      },
    ],
    averageDuration: Number, // in seconds

    // Features
    features: [String], // ['leaderboard', 'achievements', 'daily_challenge']
    soundEnabled: {
      type: Boolean,
      default: true,
    },
    vibrationEnabled: {
      type: Boolean,
      default: true,
    },

    // Platform Support
    platforms: [
      {
        type: String,
        enum: ['web', 'mobile', 'both'],
      },
    ],

    // Availability
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isComingSoon: {
      type: Boolean,
      default: false,
    },

    // Stats
    totalDownloads: {
      type: Number,
      default: 0,
    },
    totalPlays: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },

    // Content
    instructions: String,
    rules: [String],
    tips: [String],

    // Settings
    basePoints: {
      type: Number,
      default: 100,
    }, // Points awarded for playing
    maxScore: Number, // Can be unlimited
    leaderboardEnabled: {
      type: Boolean,
      default: true,
    },
    achievementsEnabled: {
      type: Boolean,
      default: true,
    },

    // Daily Challenges
    dailyChallenge: {
      isEnabled: {
        type: Boolean,
        default: false,
      },
      reward: Number,
      resetTime: {
        type: String,
        default: '00:00', // UTC time
      },
    },

    // Rewards
    rewards: {
      winCoins: Number,
      playCoins: Number,
      firstWinBonus: Number,
    },

    // Metadata
    tags: [String],
    keywords: [String],

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for queries
gameSchema.index({ slug: 1 });
gameSchema.index({ category: 1, isPublished: 1 });
gameSchema.index({ totalPlays: -1 });
gameSchema.index({ averageRating: -1 });
gameSchema.index({ isFeatured: 1 });

module.exports = mongoose.model('Game', gameSchema);
