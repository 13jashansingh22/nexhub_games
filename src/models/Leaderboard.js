/* Leaderboard Model - Aggregated leaderboard data */
const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema(
  {
    // Player
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: String,
    avatar: String,

    // Game specific
    gameType: {
      type: String,
      enum: ['all', 'snake', 'flappy_bird', 'tic_tac_toe'],
      required: true,
    },

    // Stats
    totalScore: {
      type: Number,
      default: 0,
    },
    gamesPlayed: {
      type: Number,
      default: 0,
    },
    gamesWon: {
      type: Number,
      default: 0,
    },
    gamesLost: {
      type: Number,
      default: 0,
    },
    winRate: Number, // percentage
    averageScore: Number,
    bestScore: Number,

    // Ranking
    rank: {
      type: Number,
      required: true,
    },
    rankChange: Number, // +/- from previous period

    // Time Period
    period: {
      type: String,
      enum: ['all_time', 'monthly', 'weekly', 'daily'],
      required: true,
    },

    // Points
    totalPoints: {
      type: Number,
      default: 0,
    },

    // Metadata
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for leaderboard retrieval
leaderboardSchema.index({ gameType: 1, period: 1, rank: 1 });
leaderboardSchema.index({ player: 1, gameType: 1, period: 1 }, { unique: true });
leaderboardSchema.index({ totalScore: -1 });
leaderboardSchema.index({ totalPoints: -1 });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
