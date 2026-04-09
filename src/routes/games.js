/**
 * Game Routes
 * All API endpoints for game operations
 */

const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const gameController = require('../controllers/gameController');
const { authMiddleware } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// ============================================
// GAME LISTING & DISCOVERY (Public Routes)
// ============================================

/**
 * GET /api/v1/games/catalog
 * Frontend-aligned catalog for the mobile/web game shelf.
 */
router.get('/catalog', gameController.getGameCatalog);

/**
 * GET /api/v1/games
 * Get all games with filtering
 * Query: category, search, limit, page, sort
 * Example: /api/v1/games?category=casual&search=snake&limit=20&page=1
 */
router.get('/', 
  [
    query('category').optional().trim(),
    query('search').optional().trim(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('page').optional().isInt({ min: 1 }),
    query('sort').optional().trim(),
  ],
  handleValidationErrors,
  gameController.getAllGames
);

/**
 * GET /api/v1/games/featured
 * Get featured games (max 8)
 */
router.get('/featured', gameController.getFeaturedGames);

/**
 * GET /api/v1/games/category/:category
 * Get games by category
 * Example: /api/v1/games/category/casual
 */
router.get('/category/:category',
  [
    param('category').trim(),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('page').optional().isInt({ min: 1 }),
  ],
  handleValidationErrors,
  gameController.getGamesByCategory
);

/**
 * GET /api/v1/games/challenge/daily
 * Get today's daily challenge
 */
router.get('/challenge/daily', gameController.getDailyChallenge);

/**
 * GET /api/v1/games/player/:userId/history
 * Get player's game history
 * Query: limit, page, gameSlug
 */
router.get('/player/:userId/history',
  authMiddleware,
  [
    param('userId').isMongoId().withMessage('Valid user ID required'),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('page').optional().isInt({ min: 1 }),
    query('gameSlug').optional().trim(),
  ],
  handleValidationErrors,
  gameController.getPlayerGameHistory
);

/**
 * GET /api/v1/games/:slug/leaderboard
 * Get game leaderboard
 */
router.get('/:slug/leaderboard',
  [
    param('slug').trim(),
    query('period').optional().isIn(['all_time', 'monthly', 'weekly', 'daily']),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('page').optional().isInt({ min: 1 }),
  ],
  handleValidationErrors,
  gameController.getGameLeaderboard
);

/**
 * GET /api/v1/games/:slug/friends-leaderboard
 * Get leaderboard of only your friends
 */
router.get('/:slug/friends-leaderboard',
  authMiddleware,
  [param('slug').trim()],
  handleValidationErrors,
  gameController.getFriendsLeaderboard
);

/**
 * GET /api/v1/games/:slug/player-stats
 * Get player stats for specific game
 */
router.get('/:slug/player-stats',
  authMiddleware,
  [param('slug').trim()],
  handleValidationErrors,
  gameController.getPlayerGameStats
);

/**
 * GET /api/v1/games/daily-challenge
 * Get today's daily challenge
 */
router.get('/daily-challenge', gameController.getDailyChallenge);

/**
 * GET /api/v1/games/:slug
 * Get single game details
 * Example: /api/v1/games/snake
 */
router.get('/:slug',
  [param('slug').trim()],
  handleValidationErrors,
  gameController.getGameBySlug
);

// ============================================
// GAME SESSION (Protected Routes)
// ============================================

/**
 * POST /api/v1/games/:slug/start
 * Start new game session
 */
router.post('/:slug/start',
  authMiddleware,
  [
    param('slug').trim(),
    body('difficulty').optional().isIn(['easy', 'medium', 'hard']),
    body('isMultiplayer').optional().isBoolean(),
    body('opponents').optional().isArray(),
  ],
  handleValidationErrors,
  gameController.startGameSession
);

/**
 * POST /api/v1/games/:slug/submit-score
 * Submit game score and complete session
 */
router.post('/:slug/submit-score',
  authMiddleware,
  [
    param('slug').trim(),
    body('sessionId').notEmpty().withMessage('Session ID required'),
    body('score').isInt({ min: 0 }).withMessage('Valid score required'),
    body('result').isIn(['win', 'loss', 'draw', 'incomplete', 'quit']).withMessage('Valid result required'),
    body('level').optional().isInt({ min: 1 }),
    body('accuracy').optional().isFloat({ min: 0, max: 100 }),
  ],
  handleValidationErrors,
  gameController.submitGameScore
);

/**
 * POST /api/v1/games/daily-challenge/complete
 * Complete daily challenge
 */
router.post('/daily-challenge/complete',
  authMiddleware,
  [
    body('gameSlug').trim().notEmpty(),
    body('score').isInt({ min: 0 }),
    body('result').isIn(['win', 'loss', 'draw', 'incomplete', 'quit']),
  ],
  handleValidationErrors,
  gameController.completeDailyChallenge
);

module.exports = router;
