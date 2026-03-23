/* GameScore Model - Tracks game sessions and scores */
const mongoose = require('mongoose');

const gameScoreSchema = new mongoose.Schema(
  {
    // Player
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    playerUsername: String, // Denormalized for quick display

    // Game Info
    gameType: {
      type: String,
      enum: ['snake', 'flappy_bird', 'tic_tac_toe'],
      required: true,
    },
    gameMode: {
      type: String,
      enum: ['single_player', 'multiplayer', 'ai'],
      default: 'single_player',
    },

    // Score Details
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    level: Number,
    duration: Number, // in seconds
    maxCombo: Number,

    // Multiplayer
    opponent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    opponentScore: Number,
    isMultiplayer: {
      type: Boolean,
      default: false,
    },

    // Result
    result: {
      type: String,
      enum: ['win', 'loss', 'draw', 'incomplete'],
      default: 'incomplete',
    },

    // Rewards
    pointsEarned: {
      type: Number,
      default: 0,
    },
    bonusPointsEarned: Number,

    // Game Session Data
    gameState: mongoose.Schema.Types.Mixed, // Stores game progression data
    deviceInfo: {
      platform: String, // 'web', 'mobile'
      userAgent: String,
    },

    // Analysis
    accuracy: Number, // percentage
    consistency: String, // quick assessment

    // Status
    isAIOpponent: {
      type: Boolean,
      default: false,
    },
    aiDifficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
    },

    // Metadata
    createdAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes for leaderboard queries
gameScoreSchema.index({ gameType: 1, score: -1 });
gameScoreSchema.index({ player: 1, gameType: 1 });
gameScoreSchema.index({ createdAt: -1 });
gameScoreSchema.index({ result: 1 });
gameScoreSchema.index({ pointsEarned: -1 });

module.exports = mongoose.model('GameScore', gameScoreSchema);
