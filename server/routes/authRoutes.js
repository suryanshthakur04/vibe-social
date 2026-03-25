const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const upload = require('../config/upload');

const safeUpload = (req, res, next) => {
    const uploadSingle = upload.single('image');
    uploadSingle(req, res, function (err) {
        if (err) return res.status(400).json({ message: err.message });
        next();
    });
};

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

// @route   GET /api/auth/me
// @desc    Get current user profile securely
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const pool = require('../config/db');
        const userQuery = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [req.user.id]);
        
        if (userQuery.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(userQuery.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/auth/profile-photo
// @desc    Update user profile photo
// @access  Private
router.put('/profile-photo', auth, safeUpload, authController.updateProfilePhoto);

module.exports = router;
