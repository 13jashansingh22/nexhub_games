const mongoose = require('mongoose');
const GameSession = require('../models/GameSession');
const { asyncHandler } = require('../middleware/errorHandler');
const { successResponse } = require('../utils/response');

const getPeriodStartDate = (period) => {
  const now = new Date();

  switch (period) {
    case 'daily':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case 'weekly': {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(now.getFullYear(), now.getMonth(), diff);
    }
    case 'monthly':
      return new Date(now.getFullYear(), now.getMonth(), 1);
    default:
      return null;
  }
};

const getLeaderboardPipeline = ({ gameSlug, period, limit }) => {
  const match = {
    score: { $gte: 0 },
  };

  if (gameSlug) {
    match.gameSlug = gameSlug;
  }

  const periodStartDate = getPeriodStartDate(period);
  if (periodStartDate) {
    match.createdAt = { $gte: periodStartDate };
  }

  return [
    { $match: match },
    {
      $group: {
        _id: '$player',
        bestScore: { $max: '$score' },
        totalScore: { $sum: '$score' },
        gamesPlayed: { $sum: 1 },
        wins: {
          $sum: {
            $cond: [{ $eq: ['$result', 'win'] }, 1, 0],
          },
        },
        lastPlayedAt: { $max: '$createdAt' },
      },
    },
    { $sort: { bestScore: -1, totalScore: -1, lastPlayedAt: 1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 0,
        playerId: '$_id',
        username: '$user.username',
        avatar: '$user.avatar',
        level: '$user.level',
        bestScore: 1,
        totalScore: 1,
        gamesPlayed: 1,
        wins: 1,
        winRate: {
          $cond: [
            { $eq: ['$gamesPlayed', 0] },
            0,
            {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: ['$wins', '$gamesPlayed'],
                    },
                    100,
                  ],
                },
                2,
              ],
            },
          ],
        },
      },
    },
  ];
};

exports.getGlobalLeaderboard = asyncHandler(async (req, res) => {
  const { period = 'all_time' } = req.query;
  const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);

  const leaderboard = await GameSession.aggregate(
    getLeaderboardPipeline({
      period,
      limit,
    })
  );

  const ranked = leaderboard.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));

  return successResponse(res, 200, 'Global leaderboard fetched successfully', {
    period,
    limit,
    count: ranked.length,
    leaderboard: ranked,
  });
});

exports.getGameLeaderboard = asyncHandler(async (req, res) => {
  const { gameSlug } = req.params;
  const { period = 'all_time' } = req.query;
  const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);

  const leaderboard = await GameSession.aggregate(
    getLeaderboardPipeline({
      gameSlug,
      period,
      limit,
    })
  );

  const ranked = leaderboard.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));

  return successResponse(res, 200, 'Game leaderboard fetched successfully', {
    gameSlug,
    period,
    limit,
    count: ranked.length,
    leaderboard: ranked,
  });
});

exports.getUserRank = asyncHandler(async (req, res) => {
  const { gameSlug, userId } = req.params;
  const { period = 'all_time' } = req.query;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return successResponse(res, 200, 'User rank fetched successfully', {
      gameSlug,
      period,
      rank: null,
    });
  }

  const leaderboard = await GameSession.aggregate(
    getLeaderboardPipeline({
      gameSlug,
      period,
      limit: 1000,
    })
  );

  const targetIndex = leaderboard.findIndex(
    (entry) => String(entry.playerId) === String(userId)
  );

  return successResponse(res, 200, 'User rank fetched successfully', {
    gameSlug,
    period,
    rank: targetIndex === -1 ? null : targetIndex + 1,
    totalPlayers: leaderboard.length,
  });
});