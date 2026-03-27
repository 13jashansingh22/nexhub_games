const Progress = require('../models/Progress');

exports.saveProgress = async (req, res) => {
  try {
    const { game, level, unlocked } = req.body;
    let progress = await Progress.findOne({ user: req.user.id, game });
    if (progress) {
      progress.level = level;
      progress.unlocked = unlocked;
      progress.lastPlayed = new Date();
      await progress.save();
    } else {
      progress = new Progress({
        user: req.user.id,
        game,
        level,
        unlocked,
        lastPlayed: new Date(),
      });
      await progress.save();
    }
    res.status(201).json({ message: 'Progress saved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
