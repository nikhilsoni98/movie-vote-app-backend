const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  movieName: { type: String, required: true },
  collegeName: { type: String, required: true },
  creatorName: { type: String, required: true },
  votes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Movie', movieSchema);