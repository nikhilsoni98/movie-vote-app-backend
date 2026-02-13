const mongoose = require('mongoose');

const voterSchema = new mongoose.Schema({
  voterId: { type: String, required: true, unique: true },
  votedForMovieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }
});

module.exports = mongoose.model('Voter', voterSchema);