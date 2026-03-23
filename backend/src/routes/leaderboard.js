const express = require('express');
const { param, query } = require('express-validator');
const leaderboardController = require('../controllers/leaderboardController');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.get(
  '/',
  [
    query('period').optional().isIn(['all_time', 'monthly', 'weekly', 'daily']),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  handleValidationErrors,
  leaderboardController.getGlobalLeaderboard
);

router.get(
  '/:gameSlug',
  [
    param('gameSlug').trim().notEmpty(),
    query('period').optional().isIn(['all_time', 'monthly', 'weekly', 'daily']),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  handleValidationErrors,
  leaderboardController.getGameLeaderboard
);

router.get(
  '/:gameSlug/user/:userId',
  [
    param('gameSlug').trim().notEmpty(),
    param('userId').isMongoId(),
    query('period').optional().isIn(['all_time', 'monthly', 'weekly', 'daily']),
  ],
  handleValidationErrors,
  leaderboardController.getUserRank
);

module.exports = router;