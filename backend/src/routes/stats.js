const express = require('express');
const { param } = require('express-validator');
const statsController = require('../controllers/statsController');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.get('/platform', statsController.getPlatformStats);

router.get(
  '/games/:gameSlug',
  [param('gameSlug').trim().notEmpty()],
  handleValidationErrors,
  statsController.getGameStats
);

module.exports = router;