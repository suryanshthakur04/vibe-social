const express = require('express');
const router = express.Router();
const spotifyController = require('../controllers/spotifyController');
const auth = require('../middleware/authMiddleware');

// @route   GET /api/spotify/search
// @desc    Search Spotify for tracks
// @access  Private
router.get('/search', auth, spotifyController.searchTracks);

module.exports = router;
