const mongoose = require('mongoose');

const gameStatusSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Expert', 'easy', 'medium', 'hard', 'expert'],
    required: true
  },
  time: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GameStatus', gameStatusSchema);
