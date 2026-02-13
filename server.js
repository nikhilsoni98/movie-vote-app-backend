require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const Movie = require('./models/Movie');
const Voter = require('./models/Voter');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// UPDATED: Only allow requests from your frontend URL
app.use(cors({
  origin: 'http://localhost:5173' 
}));

app.use(bodyParser.json());

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// --- API ROUTES ---

// 1. Create a Movie Entry
app.post('/api/movies', async (req, res) => {
  try {
    const { movieName, collegeName, creatorName } = req.body;
    const newMovie = new Movie({ movieName, collegeName, creatorName });
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create movie' });
  }
});

// 2. Get All Movies (For the voting page)
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// 3. Vote for a Movie
app.post('/api/vote', async (req, res) => {
  const { movieId, voterId } = req.body;

  try {
    // Check if this user has already voted
    const existingVoter = await Voter.findOne({ voterId });
    if (existingVoter) {
      return res.status(403).json({ message: 'You have already voted!' });
    }

    // Register the vote
    await Movie.findByIdAndUpdate(movieId, { $inc: { votes: 1 } });
    
    // Mark voter as having voted
    const newVoter = new Voter({ voterId, votedForMovieId: movieId });
    await newVoter.save();

    res.json({ message: 'Vote cast successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Voting failed' });
  }
});

// 4. Check status (Optional: to disable UI if already voted)
app.get('/api/voter-status/:voterId', async (req, res) => {
    const { voterId } = req.params;
    const existingVoter = await Voter.findOne({ voterId });
    res.json({ hasVoted: !!existingVoter });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));