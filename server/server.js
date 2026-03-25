const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Route Imports
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

// Initialize app securely
const app = express();

// Global Middleware
app.use(cors());
app.use(express.json()); // Parses incoming request body

// Serve uploaded static image files logically under the same root
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route 
app.get('/', (req, res) => {
    res.send('API is running successfully!');
});

// Primary Base Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/spotify', require('./routes/spotifyRoutes'));

// Wildcard Fallback Route
app.use((req, res) => {
    res.status(404).json({ message: 'Resource not found' });
});

// Centralized Server initialization
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 API Server successfully started on port ${PORT}`);
});