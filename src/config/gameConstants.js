/* Game Platform Constants & Configuration */

// ============================================
// GAME CATEGORIES
// ============================================
const GAME_CATEGORIES = {
  CASUAL: 'casual',
  ARCADE: 'arcade',
  PUZZLE: 'puzzle',
  ACTION: 'action',
  MULTIPLAYER: 'multiplayer',
  UNIQUE: 'unique',
};

// ============================================
// GAME TYPES (SLUGS)
// ============================================
const GAME_TYPES = {
  // Casual
  SNAKE: 'snake',
  FLAPPY_BIRD: 'flappy-bird',
  TIC_TAC_TOE: 'tic-tac-toe',
  TWENTY_FORTY_EIGHT: '2048',
  STACK_GAME: 'stack-game',
  COLOR_SWITCH: 'color-switch',
  ENDLESS_RUNNER: 'endless-runner',

  // Arcade
  BRICK_BREAKER: 'brick-breaker',
  SPACE_SHOOTER: 'space-shooter',
  PACMAN: 'pacman',
  PINBALL: 'pinball',
  FRUIT_NINJA: 'fruit-ninja',

  // Puzzle
  SUDOKU: 'sudoku',
  MATCH_THREE: 'match-three',
  WORD_PUZZLE: 'word-puzzle',
  MEMORY_GAME: 'memory-game',
  MAZE_GAME: 'maze-game',

  // Action
  SHOOTING_GAME: 'shooting-game',
  ZOMBIE_SURVIVAL: 'zombie-survival',
  CAR_RACING: 'car-racing',
  PLATFORMER: 'platformer',

  // Multiplayer
  LUDO: 'ludo',
  CHESS: 'chess',
  ONE_VS_ONE_SHOOTER: '1v1-shooter',
  QUIZ_BATTLE: 'quiz-battle',
  REAL_TIME_RACING: 'real-time-racing',

  // Unique
  AI_OPPONENT: 'ai-opponent',
  VOICE_CONTROLLED: 'voice-controlled',
  AR_GAME: 'ar-game',
  REACTION_TEST: 'reaction-test',
  BRAIN_TRAINER: 'brain-trainer',
};

// ============================================
// DIFFICULTY LEVELS
// ============================================
const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

// ============================================
// GAME PLATFORMS
// ============================================
const PLATFORMS = {
  WEB: 'web',
  MOBILE: 'mobile',
  BOTH: 'both',
};

// ============================================
// GAME RESULT TYPES
// ============================================
const GAME_RESULTS = {
  WIN: 'win',
  LOSS: 'loss',
  DRAW: 'draw',
  INCOMPLETE: 'incomplete',
  QUIT: 'quit',
};

// ============================================
// GAME FEATURES
// ============================================
const GAME_FEATURES = {
  LEADERBOARD: 'leaderboard',
  ACHIEVEMENTS: 'achievements',
  DAILY_CHALLENGE: 'daily_challenge',
  MULTIPLAYER: 'multiplayer',
  AI_OPPONENT: 'ai_opponent',
  SOUND: 'sound',
  VIBRATION: 'vibration',
  LEVELS: 'levels',
  POWER_UPS: 'power_ups',
  PROGRESSION: 'progression',
};

// ============================================
// ACHIEVEMENTS
// ============================================
const ACHIEVEMENTS = {
  // General
  FIRST_PLAY: 'first_play',
  TEN_PLAYS: 'ten_plays',
  HUNDRED_PLAYS: 'hundred_plays',
  FIRST_WIN: 'first_win',
  WIN_STREAK_5: 'win_streak_5',
  WIN_STREAK_10: 'win_streak_10',
  PERFECT_GAME: 'perfect_game',
  HIGH_SCORE: 'high_score',
  LEADERBOARD_TOP_10: 'leaderboard_top_10',
  LEADERBOARD_TOP_1: 'leaderboard_top_1',

  // Game Specific
  SNAKE_MASTER: 'snake_master',
  FLAPPY_CHAMPION: 'flappy_champion',
  PUZZLE_SOLVER: 'puzzle_solver',
  SPEED_DEMON: 'speed_demon',
  TACTICAL_GENIUS: 'tactical_genius',
};

// ============================================
// POINTS & REWARDS SYSTEM
// ============================================
const POINTS_REWARDS = {
  // Base Points (per game)
  BASE_PLAY: 10, // For playing
  BASE_WIN: 50, // For winning
  BASE_LOSS: 5, // For losing
  BASE_DRAW: 25, // For draw

  // Bonuses
  FIRST_PLAY_BONUS: 20,
  WIN_STREAK_BONUS: 10, // Per streak
  NEW_PERSONAL_RECORD_BONUS: 100,
  PERFECT_GAME_BONUS: 500,
  DAILY_CHALLENGE_WIN: 100,
  DAILY_CHALLENGE_LOSS: 10,

  // Coins
  PLAY_COIN: 1,
  WIN_COIN: 5,
  ACHIEVEMENT_COIN: 10,
  DAILY_CHALLENGE_COIN: 25,

  // XP
  PLAY_XP: 5,
  WIN_XP: 20,
  ACHIEVEMENT_XP: 50,
};

// ============================================
// GAME SPECIFIC CONFIG
// ============================================
const GAME_CONFIG = {
  SNAKE: {
    basePoints: 100,
    defaultDifficulty: 'medium',
    maxScore: null, // Unlimited
    scoringRules: {
      pointPerFood: 10,
      speedMultiplier: 1.1,
    },
    features: [
      GAME_FEATURES.LEADERBOARD,
      GAME_FEATURES.ACHIEVEMENTS,
      GAME_FEATURES.DAILY_CHALLENGE,
    ],
  },

  FLAPPY_BIRD: {
    basePoints: 100,
    defaultDifficulty: 'easy',
    maxScore: null,
    scoringRules: {
      pointPerPipe: 10,
      difficultyBonus: 1.5,
    },
    features: [
      GAME_FEATURES.LEADERBOARD,
      GAME_FEATURES.ACHIEVEMENTS,
    ],
  },

  TIC_TAC_TOE: {
    basePoints: 50,
    defaultDifficulty: 'medium',
    maxScore: 100,
    scoringRules: {
      winPoints: 50,
      drawPoints: 25,
      lossPoints: 10,
    },
    features: [
      GAME_FEATURES.LEADERBOARD,
      GAME_FEATURES.AI_OPPONENT,
      GAME_FEATURES.MULTIPLAYER,
    ],
  },

  TWENTY_FORTY_EIGHT: {
    basePoints: 100,
    defaultDifficulty: 'medium',
    maxScore: null,
    scoringRules: {
      tileMultiplier: 10,
      mergeBonus: 5,
    },
    features: [
      GAME_FEATURES.LEADERBOARD,
      GAME_FEATURES.ACHIEVEMENTS,
    ],
  },

  SPACE_SHOOTER: {
    basePoints: 200,
    defaultDifficulty: 'hard',
    maxScore: null,
    scoringRules: {
      pointPerEnemy: 10,
      accuracyBonus: 1.2,
      survivalBonus: 50,
    },
    features: [
      GAME_FEATURES.LEADERBOARD,
      GAME_FEATURES.LEVELS,
      GAME_FEATURES.ACHIEVEMENTS,
    ],
  },

  CHESS: {
    basePoints: 100,
    defaultDifficulty: 'medium',
    maxScore: 200,
    scoringRules: {
      winPoints: 100,
      drawPoints: 50,
      lossPoints: 20,
      aiDifficultyMultiplier: 1.5,
    },
    features: [
      GAME_FEATURES.LEADERBOARD,
      GAME_FEATURES.AI_OPPONENT,
      GAME_FEATURES.MULTIPLAYER,
    ],
  },
};

// ============================================
// LEADERBOARD CONFIG
// ============================================
const LEADERBOARD_CONFIG = {
  PERIODS: {
    ALL_TIME: 'all_time',
    MONTHLY: 'monthly',
    WEEKLY: 'weekly',
    DAILY: 'daily',
  },
  LIMIT: {
    GLOBAL: 100,
    FRIENDS: 50,
  },
};

// ============================================
// MATCH MAKING CONFIG (For multiplayer)
// ============================================
const MATCHMAKING = {
  MAX_WAIT_TIME: 30000, // 30 seconds
  SKILL_RANGE: 100, // Rank points
  REGIONS: ['US', 'EU', 'ASIA', 'GLOBAL'],
};

// ============================================
// DAILY CHALLENGE CONFIG
// ============================================
const DAILY_CHALLENGE = {
  RESET_TIME: '00:00', // UTC
  MAX_ATTEMPTS: 5,
  BASE_REWARD: 100,
  STREAK_REWARD_MULTIPLIER: 1.2,
};

module.exports = {
  GAME_CATEGORIES,
  GAME_TYPES,
  DIFFICULTY_LEVELS,
  PLATFORMS,
  GAME_RESULTS,
  GAME_FEATURES,
  ACHIEVEMENTS,
  POINTS_REWARDS,
  GAME_CONFIG,
  LEADERBOARD_CONFIG,
  MATCHMAKING,
  DAILY_CHALLENGE,
};
