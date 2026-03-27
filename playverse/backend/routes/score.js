const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { saveScore, getLeaderboard } = require('../controllers/scoreController');

router.post('/save', auth, saveScore);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
