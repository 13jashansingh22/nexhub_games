const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  game: { type: String, required: true },
  level: { type: Number, default: 1 },
  unlocked: { type: Boolean, default: false },
  lastPlayed: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Progress', progressSchema);
