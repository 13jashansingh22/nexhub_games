/* Game Session Model - Tracks individual game plays and progress */
const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema(
  {
    // References
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
    gameTitle: String, // Denormalized
    gameSlug: String, // Denormalized for quick access

    // Session Details
    sessionId: {
      type: String,
      unique: true,
      required: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: Date,
    duration: Number, // in seconds

    // Gameplay
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
    },
    score: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    combo: {
      type: Number,
      default: 0,
    },
    maxCombo: {
      type: Number,
      default: 0,
    },

    // Multiplayer
    isMultiplayer: {
      type: Boolean,
      default: false,
    },
    opponents: [
      {
        playerId: mongoose.Schema.Types.ObjectId,
        playerName: String,
        score: Number,
        rank: Number,
      },
    ],
    multiplayer: {
      roomId: String,
      playersCount: Number,
    },

    // Result
    result: {
      type: String,
      enum: ['win', 'loss', 'draw', 'incomplete', 'quit'],
      default: 'incomplete',
    },
    isNewPersonalRecord: {
      type: Boolean,
      default: false,
    },

    // Rewards
    pointsEarned: {
      type: Number,
      default: 0,
    },
    coinsEarned: {
      type: Number,
      default: 0,
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
    bonusPoints: {
      type: Number,
      default: 0,
    },
    achievements: [String], // Achievement IDs unlocked

    // Game-Specific Data
    gameData: mongoose.Schema.Types.Mixed, // Store game state/progress

    // Statistics
    accuracy: Number, // Percentage (0-100)
    efficiency: String, // e.g., 'perfect', 'good', 'needs improvement'
    performanceMetrics: {
      averageReactionTime: Number,
      successRate: Number,
      consistency: String,
    },

    // Device Info
    platform: {
      type: String,
      enum: ['web', 'mobile'],
    },
    deviceInfo: {
      type: String,
      userAgent: String,
    },

    // Timestamps
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

// Indexes
gameSessionSchema.index({ player: 1, game: 1, createdAt: -1 });
gameSessionSchema.index({ game: 1, score: -1 });
gameSessionSchema.index({ player: 1, createdAt: -1 });
gameSessionSchema.index({ result: 1 });
gameSessionSchema.index({ sessionId: 1 });
gameSessionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('GameSession', gameSessionSchema);
