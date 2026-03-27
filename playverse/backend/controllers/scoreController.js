const Score = require('../models/Score');

exports.saveScore = async (req, res) => {
  try {
    const { game, score } = req.body;
    const newScore = new Score({
      user: req.user.id,
      game,
      score,
    });
    await newScore.save();
    res.status(201).json({ message: 'Score saved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const { game } = req.query;
    const leaderboard = await Score.find(game ? { game } : {})
      .sort({ score: -1, createdAt: 1 })
      .limit(50)
      .populate('user', 'username avatar');
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
