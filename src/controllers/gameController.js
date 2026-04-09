/**
 * Game Controller
 * Handles all game-related operations: sessions, scores, leaderboards, achievements
 */

const Game = require('../models/Game');
const GameSession = require('../models/GameSession');
const User = require('../models/User');
const Leaderboard = require('../models/Leaderboard');
const Notification = require('../models/Notification');
const asyncHandler = require('../middleware/asyncHandler');
const { POINTS_REWARDS, GAME_RESULTS, GAME_CONFIG, ACHIEVEMENTS, LEADERBOARD_CONFIG } = require('../config/gameConstants');
const { success, error } = require('../utils/response');

const FRONTEND_GAME_CATALOG = [
  {
    title: 'Snake',
    slug: 'snake',
    category: 'casual',
    description: 'Classic arcade with a sharp neon board.',
    badge: 'Arcade',
    controlModes: ['touch', 'keyboard'],
    isPlayable: true,
  },
  {
    title: 'Asteroids',
    slug: 'asteroids',
    category: 'action',
    description: 'Dodge debris and survive the field.',
    badge: 'Action',
    controlModes: ['touch', 'keyboard'],
    isPlayable: true,
  },
  {
    title: 'Flappy Bird',
    slug: 'flappy-bird',
    category: 'casual',
    description: 'Tap into a brighter take on the classic flyer.',
    badge: 'Arcade',
    controlModes: ['touch', 'keyboard'],
    isPlayable: true,
  },
  {
    title: 'Tic Tac Toe',
    slug: 'tic-tac-toe',
    category: 'casual',
    description: 'Fast matches with a clean neon board.',
    badge: 'Quick Play',
    controlModes: ['touch', 'keyboard'],
    isPlayable: true,
  },
  {
    title: '2048',
    slug: '2048',
    category: 'puzzle',
    description: 'Merge tiles and push the score higher.',
    badge: 'Puzzle',
    controlModes: ['touch', 'keyboard'],
    isPlayable: true,
  },
  {
    title: 'Sudoku',
    slug: 'sudoku',
    category: 'puzzle',
    description: 'Focus, logic, and a polished puzzle grid.',
    badge: 'Logic',
    controlModes: ['touch', 'keyboard'],
    isPlayable: true,
  },
  {
    title: 'Memory Match',
    slug: 'memory-match',
    category: 'puzzle',
    description: 'Train your recall with crisp feedback.',
    badge: 'Brain',
    controlModes: ['touch', 'keyboard'],
    isPlayable: true,
  },
  {
    title: 'Chess',
    slug: 'chess',
    category: 'multiplayer',
    description: 'A classic strategy board with a dark polish.',
    badge: 'Strategy',
    controlModes: ['touch', 'keyboard'],
    isPlayable: true,
  },
  {
    title: 'Minesweeper',
    slug: 'minesweeper',
    category: 'puzzle',
    description: 'Careful reveals and a crisp victory path.',
    badge: 'Tactical',
    controlModes: ['touch', 'keyboard'],
    isPlayable: true,
  },
  {
    title: 'Pong',
    slug: 'pong',
    category: 'arcade',
    description: 'Retro paddle action with a modern skin.',
    badge: 'Retro',
    controlModes: ['touch', 'keyboard'],
    isPlayable: true,
  },
  {
    title: 'Breakout',
    slug: 'breakout',
    category: 'arcade',
    description: 'Smash through bricks with reactive play.',
    badge: 'Arcade',
    controlModes: ['touch', 'keyboard'],
    isPlayable: true,
  },
  {
    title: 'Coming Soon',
    slug: 'coming-soon',
    category: 'unique',
    description: 'New experiences are already in the queue.',
    badge: 'Next up',
    controlModes: ['touch', 'keyboard'],
    isPlayable: false,
  },
];

// ============================================
// GAME LISTING & DISCOVERY
// ============================================

/**
 * Get all games with optional filtering
 * GET /api/v1/games
 * Query: category, search, limit, page, sort
 */
exports.getAllGames = asyncHandler(async (req, res) => {
  const { category, search, limit = 20, page = 1, sort = '-createdAt' } = req.query;

  let query = { isPublished: true };

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Search by title
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [games, total] = await Promise.all([
    Game.find(query)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .select('-gameData'),
    Game.countDocuments(query),
  ]);

  return success(res, {
    games,
    pagination: {
      total,
      limit: parseInt(limit),
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * Get featured games
 * GET /api/v1/games/featured
 */
exports.getFeaturedGames = asyncHandler(async (req, res) => {
  const games = await Game.find({ isPublished: true, isFeatured: true })
    .limit(8)
    .sort('-stats.averageRating');

  return success(res, { games });
});

/**
 * Get frontend-aligned catalog
 * GET /api/v1/games/catalog
 */
exports.getGameCatalog = asyncHandler(async (req, res) => {
  const databaseGames = await Game.find({ isPublished: true })
    .sort('title')
    .select('title slug category description isFeatured isComingSoon platforms features stats');

  if (databaseGames.length > 0) {
    return success(res, {
      games: databaseGames.map((game) => ({
        title: game.title,
        slug: game.slug,
        category: game.category,
        description: game.description || 'Tap to launch a game.',
        badge: game.isComingSoon ? 'Next up' : game.isFeatured ? 'Featured' : 'Play',
        controlModes: game.platforms && game.platforms.length > 0 ? game.platforms : ['touch', 'keyboard'],
        isPlayable: !game.isComingSoon,
      })),
      total: databaseGames.length,
      inputModes: ['touch', 'keyboard'],
    });
  }

  return success(res, {
    games: FRONTEND_GAME_CATALOG,
    total: FRONTEND_GAME_CATALOG.length,
    inputModes: ['touch', 'keyboard'],
  });
});

/**
 * Get games by category
 * GET /api/v1/games/category/:category
 */
exports.getGamesByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { limit = 20, page = 1 } = req.query;

  const skip = (page - 1) * limit;

  const [games, total] = await Promise.all([
    Game.find({ category, isPublished: true })
      .sort('-stats.totalPlays')
      .limit(limit)
      .skip(skip),
    Game.countDocuments({ category, isPublished: true }),
  ]);

  return success(res, {
    category,
    games,
    pagination: {
      total,
      limit: parseInt(limit),
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * Get single game details
 * GET /api/v1/games/:slug
 */
exports.getGameBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const game = await Game.findOne({ slug, isPublished: true });

  if (!game) {
    return error(res, 'Game not found', 404);
  }

  return success(res, { game });
});

// ============================================
// GAME SESSION MANAGEMENT
// ============================================

/**
 * Start new game session
 * POST /api/v1/games/:slug/start
 * Body: { difficulty, isMultiplayer, opponents? }
 */
exports.startGameSession = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { difficulty = 'medium', isMultiplayer = false, opponents = [] } = req.body;
  const userId = req.user.id;

  // Validate game exists
  const game = await Game.findOne({ slug, isPublished: true });
  if (!game) {
    return error(res, 'Game not found', 404);
  }

  // Create session
  const sessionId = `${userId}-${slug}-${Date.now()}`;
  const session = await GameSession.create({
    player: userId,
    game: game._id,
    gameTitle: game.title,
    gameSlug: slug,
    sessionId,
    difficulty,
    isMultiplayer,
    opponents,
    startTime: new Date(),
  });

  // Update game stats
  game.stats.totalPlays += 1;
  await game.save();

  return success(res, { session }, 'Game session started', 201);
});

/**
 * Submit game score/result
 * POST /api/v1/games/:slug/submit-score
 * Body: { sessionId, score, result, level, gameData, accuracy }
 */
exports.submitGameScore = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { sessionId, score, result, level = 1, gameData = {}, accuracy = 100 } = req.body;
  const userId = req.user.id;

  // Validate result type
  if (!Object.values(GAME_RESULTS).includes(result)) {
    return error(res, 'Invalid game result', 400);
  }

  // Find session
  const session = await GameSession.findOne({ sessionId, player: userId });
  if (!session) {
    return error(res, 'Game session not found', 404);
  }

  // Find game
  const game = await Game.findOne({ slug });
  if (!game) {
    return error(res, 'Game not found', 404);
  }

  // Calculate rewards
  const rewards = calculateRewards(result, game, score, level, accuracy);

  // Update session
  session.endTime = new Date();
  session.duration = (session.endTime - session.startTime) / 1000; // seconds
  session.score = score;
  session.result = result;
  session.level = level;
  session.gameData = gameData;
  session.accuracy = accuracy;
  session.pointsEarned = rewards.points;
  session.coinsEarned = rewards.coins;
  session.xpEarned = rewards.xp;
  session.bonusPoints = rewards.bonus;

  // Check if new personal record
  const previousBest = await GameSession.findOne({
    player: userId,
    game: game._id,
    score: { $gt: score },
  }).sort('-score');

  session.isNewPersonalRecord = !previousBest;

  await session.save();

  // Update user
  const user = await User.findById(userId);
  user.points += rewards.points;
  user.level = calculateLevel(user.points);
  user.coins = (user.coins || 0) + rewards.coins;
  user.xp = (user.xp || 0) + rewards.xp;
  await user.save();

  // Update game stats
  if (result === GAME_RESULTS.WIN) {
    game.stats.totalWins = (game.stats.totalWins || 0) + 1;
  }
  game.stats.averageScore = (game.stats.averageScore || 0) * 0.9 + score * 0.1;
  await game.save();

  // Update leaderboard
  await updateLeaderboard(userId, game._id, slug, score);

  // Create notification
  if (session.isNewPersonalRecord) {
    await Notification.create({
      user: userId,
      type: 'achievement',
      title: 'New Personal Record',
      message: `You set a new personal record in ${game.title}!`,
      link: `/games/${slug}/stats`,
    });
  }

  return success(res, {
    session,
    rewards,
    isNewPersonalRecord: session.isNewPersonalRecord,
    userStats: {
      points: user.points,
      level: user.level,
      coins: user.coins,
      xp: user.xp,
    },
  });
});

/**
 * Get player's game history
 * GET /api/v1/games/player/:userId/history
 */
exports.getPlayerGameHistory = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { limit = 20, page = 1, gameSlug } = req.query;

  let query = { player: userId };
  if (gameSlug) {
    query.gameSlug = gameSlug;
  }

  const skip = (page - 1) * limit;

  const [sessions, total] = await Promise.all([
    GameSession.find(query)
      .sort('-endTime')
      .limit(limit)
      .skip(skip)
      .populate('game', 'title slug'),
    GameSession.countDocuments(query),
  ]);

  return success(res, {
    sessions,
    pagination: {
      total,
      limit: parseInt(limit),
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * Get player stats for specific game
 * GET /api/v1/games/:slug/player-stats
 */
exports.getPlayerGameStats = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const userId = req.user.id;

  const game = await Game.findOne({ slug });
  if (!game) {
    return error(res, 'Game not found', 404);
  }

  const stats = await GameSession.aggregate([
    {
      $match: {
        player: userId,
        game: game._id,
      },
    },
    {
      $group: {
        _id: '$game',
        totalPlays: { $sum: 1 },
        totalWins: { $sum: { $cond: [{ $eq: ['$result', GAME_RESULTS.WIN] }, 1, 0] } },
        totalLosses: { $sum: { $cond: [{ $eq: ['$result', GAME_RESULTS.LOSS] }, 1, 0] } },
        averageScore: { $avg: '$score' },
        highestScore: { $max: '$score' },
        totalPoints: { $sum: '$pointsEarned' },
        totalCoins: { $sum: '$coinsEarned' },
        averageAccuracy: { $avg: '$accuracy' },
        averageDuration: { $avg: '$duration' },
      },
    },
  ]);

  const playerStats = stats[0] || {
    totalPlays: 0,
    totalWins: 0,
    totalLosses: 0,
    averageScore: 0,
    highestScore: 0,
    totalPoints: 0,
    totalCoins: 0,
    averageAccuracy: 0,
    averageDuration: 0,
  };

  const winRate = playerStats.totalPlays > 0 
    ? ((playerStats.totalWins / playerStats.totalPlays) * 100).toFixed(2)
    : 0;

  return success(res, {
    game: {
      title: game.title,
      slug: game.slug,
    },
    stats: {
      ...playerStats,
      winRate: parseFloat(winRate),
    },
  });
});

// ============================================
// LEADERBOARD
// ============================================

/**
 * Get game leaderboard
 * GET /api/v1/games/:slug/leaderboard
 * Query: period, limit, page
 */
exports.getGameLeaderboard = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { period = 'all_time', limit = 100, page = 1 } = req.query;

  const game = await Game.findOne({ slug });
  if (!game) {
    return error(res, 'Game not found', 404);
  }

  // Get from leaderboard collection
  const leaderboard = await Leaderboard.findOne({
    game: game._id,
    period,
  }).populate('topPlayers.player', 'username avatar level');

  if (!leaderboard) {
    return success(res, { leaderboard: null, topPlayers: [] });
  }

  const topPlayers = leaderboard.topPlayers.slice(0, parseInt(limit));

  return success(res, {
    game: { title: game.title, slug },
    period,
    topPlayers,
    total: leaderboard.topPlayers.length,
  });
});

/**
 * Get friends leaderboard
 * GET /api/v1/games/:slug/friends-leaderboard
 */
exports.getFriendsLeaderboard = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const userId = req.user.id;

  const game = await Game.findOne({ slug });
  if (!game) {
    return error(res, 'Game not found', 404);
  }

  // Get user's friends
  const user = await User.findById(userId).select('following');

  // Get sessions of friends
  const friendIds = user.following || [];
  friendIds.push(userId); // Include self

  const sessions = await GameSession.aggregate([
    {
      $match: {
        game: game._id,
        player: { $in: friendIds },
        result: GAME_RESULTS.WIN,
      },
    },
    {
      $sort: { score: -1 },
    },
    {
      $group: {
        _id: '$player',
        score: { $max: '$score' },
        wins: { $sum: 1 },
      },
    },
    {
      $limit: 50,
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'player',
      },
    },
    {
      $unwind: '$player',
    },
    {
      $project: {
        _id: 0,
        player: {
          _id: '$player._id',
          username: '$player.username',
          avatar: '$player.avatar',
          level: '$player.level',
        },
        score: 1,
        wins: 1,
      },
    },
  ]);

  return success(res, {
    game: { title: game.title, slug },
    leaderboard: sessions,
  });
});

// ============================================
// DAILY CHALLENGE
// ============================================

/**
 * Get today's daily challenge
 * GET /api/v1/games/daily-challenge
 */
exports.getDailyChallenge = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const challenges = await Game.find({
    isPublished: true,
    'dailyChallenge.enabled': true,
  }).select('title slug category dailyChallenge');

  if (challenges.length === 0) {
    return error(res, 'No daily challenges available', 404);
  }

  // Select different challenge each day using date seed
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const challenge = challenges[dayOfYear % challenges.length];

  return success(res, { challenge });
});

/**
 * Complete daily challenge
 * POST /api/v1/games/daily-challenge/complete
 * Body: { gameSlug, score, result }
 */
exports.completeDailyChallenge = asyncHandler(async (req, res) => {
  const { gameSlug, score, result } = req.body;
  const userId = req.user.id;

  const game = await Game.findOne({ slug: gameSlug });
  if (!game || !game.dailyChallenge?.enabled) {
    return error(res, 'Daily challenge not available', 404);
  }

  // Check if already completed today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const existing = await GameSession.findOne({
    player: userId,
    game: game._id,
    startTime: { $gte: today, $lt: tomorrow },
  });

  if (existing) {
    return error(res, 'Daily challenge already completed today', 400);
  }

  if (result !== GAME_RESULTS.WIN) {
    return error(res, 'Daily challenge must be won to earn rewards', 400);
  }

  // Award bonus
  const baseReward = game.dailyChallenge.reward || 100;
  const user = await User.findById(userId);
  const currentStreak = (user.dailyChallengeStreak || 0) + 1;

  user.points += baseReward * currentStreak; // Multiplier for streak
  user.coins = (user.coins || 0) + baseReward;
  user.dailyChallengeStreak = currentStreak;
  user.lastDailyChallenge = new Date();
  await user.save();

  return success(res, {
    reward: baseReward * currentStreak,
    streak: currentStreak,
    message: `Daily challenge completed! Streak: ${currentStreak}`,
  });
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate points, coins, and XP rewards
 */
function calculateRewards(result, game, score, level, accuracy) {
  let points = 0,
    coins = 0,
    xp = 0,
    bonus = 0;

  const gameConfig = GAME_CONFIG[game.slug] || { basePoints: 100 };

  // Base points
  switch (result) {
    case GAME_RESULTS.WIN:
      points = gameConfig.basePoints || POINTS_REWARDS.BASE_WIN;
      coins = POINTS_REWARDS.WIN_COIN;
      xp = POINTS_REWARDS.WIN_XP;
      break;
    case GAME_RESULTS.LOSS:
      points = POINTS_REWARDS.BASE_LOSS;
      coins = 0;
      xp = POINTS_REWARDS.PLAY_XP;
      break;
    case GAME_RESULTS.DRAW:
      points = POINTS_REWARDS.BASE_DRAW;
      coins = POINTS_REWARDS.PLAY_COIN;
      xp = POINTS_REWARDS.PLAY_XP;
      break;
    case GAME_RESULTS.INCOMPLETE:
    case GAME_RESULTS.QUIT:
      points = 0;
      coins = 0;
      xp = 0;
      break;
  }

  // Accuracy bonus
  if (accuracy >= 90) {
    bonus += points * 0.2;
  }

  // Level bonus
  if (level > 1) {
    bonus += points * (level - 1) * 0.1;
  }

  // Score bonus
  if (score > (gameConfig.basePoints * 2 || 200)) {
    bonus += POINTS_REWARDS.NEW_PERSONAL_RECORD_BONUS;
  }

  return {
    points: Math.floor(points),
    coins: Math.floor(coins),
    xp: Math.floor(xp),
    bonus: Math.floor(bonus),
  };
}

/**
 * Calculate user level based on points
 */
function calculateLevel(points) {
  if (points < 1000) return 1;
  if (points < 5000) return 2;
  if (points < 15000) return 3;
  if (points < 30000) return 4;
  if (points < 50000) return 5;
  if (points < 75000) return 6;
  if (points < 100000) return 7;
  return Math.floor(points / 100000) + 7;
}

/**
 * Update leaderboard with new score
 */
async function updateLeaderboard(userId, gameId, slug, score) {
  try {
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisWeek = new Date(today.setDate(today.getDate() - today.getDay()));

    // Update all-time leaderboard
    await Leaderboard.findOneAndUpdate(
      { game: gameId, period: LEADERBOARD_CONFIG.PERIODS.ALL_TIME },
      {
        $pull: { topPlayers: { player: userId } },
      }
    );

    await Leaderboard.findOneAndUpdate(
      { game: gameId, period: LEADERBOARD_CONFIG.PERIODS.ALL_TIME },
      {
        $push: {
          topPlayers: {
            $each: [{ player: userId, score, timestamp: new Date() }],
            $sort: { score: -1 },
            $slice: LEADERBOARD_CONFIG.LIMIT.GLOBAL,
          },
        },
      },
      { upsert: true, new: true }
    );

    // Similar updates for monthly and weekly
    // (omitted for brevity - same pattern as above)
  } catch (err) {
    console.error('Error updating leaderboard:', err);
  }
}

module.exports = exports;
