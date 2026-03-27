require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('PlayVerse Backend API');
});

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const scoreRoutes = require('./routes/score');
const progressRoutes = require('./routes/progress');
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/score', scoreRoutes);
app.use('/leaderboard', scoreRoutes); // leaderboard is a GET on /leaderboard
app.use('/progress', progressRoutes);

// TODO: Add routes for score, leaderboard, progress

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
