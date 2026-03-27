const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { saveProgress } = require('../controllers/progressController');

router.post('/save', auth, saveProgress);

module.exports = router;
