const Game = require('../models/Game');
const User = require('../models/User');
const GameSession = require('../models/GameSession');
const { asyncHandler } = require('../middleware/errorHandler');
const { successResponse } = require('../utils/response');

exports.getPlatformStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalGames, totalSessions, summary] = await Promise.all([
    User.countDocuments({}),
    Game.countDocuments({}),
    GameSession.countDocuments({}),
    GameSession.aggregate([
      {
        $group: {
          _id: null,
          totalScore: { $sum: '$score' },
          averageScore: { $avg: '$score' },
          averageDuration: { $avg: '$duration' },
          wins: {
            $sum: {
              $cond: [{ $eq: ['$result', 'win'] }, 1, 0],
            },
          },
        },
      },
    ]),
  ]);

  const aggregate = summary[0] || {
    totalScore: 0,
    averageScore: 0,
    averageDuration: 0,
    wins: 0,
  };

  const winRate = totalSessions > 0 ? (aggregate.wins / totalSessions) * 100 : 0;

  return successResponse(res, 200, 'Platform stats fetched successfully', {
    users: {
      total: totalUsers,
    },
    games: {
      total: totalGames,
    },
    sessions: {
      total: totalSessions,
      totalScore: aggregate.totalScore,
      averageScore: Number(aggregate.averageScore.toFixed(2)),
      averageDuration: Number((aggregate.averageDuration || 0).toFixed(2)),
      winRate: Number(winRate.toFixed(2)),
    },
  });
});

exports.getGameStats = asyncHandler(async (req, res) => {
  const { gameSlug } = req.params;

  const game = await Game.findOne({ slug: gameSlug }).select('title slug category isPublished');

  if (!game) {
    return res.status(404).json({
      success: false,
      message: 'Game not found',
    });
  }

  const [summary, topScores] = await Promise.all([
    GameSession.aggregate([
      { $match: { gameSlug } },
      {
        $group: {
          _id: null,
          totalPlays: { $sum: 1 },
          averageScore: { $avg: '$score' },
          highestScore: { $max: '$score' },
          averageDuration: { $avg: '$duration' },
          wins: {
            $sum: {
              $cond: [{ $eq: ['$result', 'win'] }, 1, 0],
            },
          },
        },
      },
    ]),
    GameSession.aggregate([
      { $match: { gameSlug } },
      { $sort: { score: -1, createdAt: 1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: 'player',
          foreignField: '_id',
          as: 'playerUser',
        },
      },
      { $unwind: '$playerUser' },
      {
        $project: {
          _id: 0,
          username: '$playerUser.username',
          score: 1,
          level: 1,
          achievedAt: '$createdAt',
        },
      },
    ]),
  ]);

  const aggregate = summary[0] || {
    totalPlays: 0,
    averageScore: 0,
    highestScore: 0,
    averageDuration: 0,
    wins: 0,
  };

  const winRate = aggregate.totalPlays > 0 ? (aggregate.wins / aggregate.totalPlays) * 100 : 0;

  return successResponse(res, 200, 'Game stats fetched successfully', {
    game,
    stats: {
      totalPlays: aggregate.totalPlays,
      averageScore: Number(aggregate.averageScore.toFixed(2)),
      highestScore: aggregate.highestScore,
      averageDuration: Number((aggregate.averageDuration || 0).toFixed(2)),
      winRate: Number(winRate.toFixed(2)),
    },
    topScores,
  });
});