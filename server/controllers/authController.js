const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if user already exists
        const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert user into database
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        );

        const user = newUser.rows[0];

        // 4. Generate JWT Token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '5h' }, 
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token, user });
            }
        );

    } catch (err) {
        console.error("Registration error:", err.message);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// Login existing user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const user = userResult.rows[0];

        // 2. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // 3. Generate JWT Token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '5h' }, 
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token, 
                    user: { id: user.id, name: user.name, email: user.email } 
                });
            }
        );

    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// Update Profile Photo
exports.updateProfilePhoto = async (req, res) => {
    try {
        const userId = req.user.id;
        
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        const updatedUser = await pool.query(
            'UPDATE users SET profile_photo_url = $1 WHERE id = $2 RETURNING id, name, email, profile_photo_url',
            [imageUrl, userId]
        );

        res.json({ user: updatedUser.rows[0], message: 'Profile photo updated successfully' });
    } catch (err) {
        console.error("Profile photo upload error:", err.message);
        res.status(500).json({ message: 'Server error during photo upload' });
    }
};
