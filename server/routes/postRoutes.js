const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/authMiddleware');
const upload = require('../config/upload'); // Import the Multer setup

// @route   POST /api/posts
// @desc    Create a new vibe post
// Custom Safe Upload Wrapper to prevent unhandled Node crashes from severing CORS connections
const safeUpload = (req, res, next) => {
    upload.single('image')(req, res, function (err) {
        if (err) {
            console.error("MULTER ERROR INTERCEPTED:", err);
            return res.status(400).json({ message: "File upload error: " + err.message });
        }
        next();
    });
};
// @access  Private
router.post('/', auth, safeUpload, postController.createPost);

// @route   GET /api/posts
// @desc    Get all community vibe posts
// @access  Public
router.get('/', postController.getPosts);

// @route   GET /api/posts/me
// @desc    Get current user's latest vibes
// @access  Private
router.get('/me', auth, postController.getMyPosts);

// @route   DELETE /api/posts/:id
// @desc    Delete a specific post created by the user
// @access  Private
router.delete('/:id', auth, postController.deletePost);

// @route   PUT /api/posts/:id
// @desc    Update text content of a specific post created by the user
// @access  Private
router.put('/:id', auth, postController.updatePost);

module.exports = router;
