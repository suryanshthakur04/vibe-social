const pool = require('../config/db');

// Create a new post/vibe
exports.createPost = async (req, res) => {
    console.log("--> CREATE POST TRIGGERED");
    console.log("Headers:", req.headers['content-type']);
    console.log("Body:", req.body);
    console.log("File:", req.file ? req.file.filename : 'none');

    try {
        const { content, mood, song, preset_image_url } = req.body;
        const userId = req.user.id; // Accessed from authMiddleware
        
        // If the user attached an image, multer handles it into req.file
        // Alternatively, if they passed a preset aesthetic URL, map it natively
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : (preset_image_url || null);

        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const newPost = await pool.query(
            'INSERT INTO posts (user_id, content, mood, song, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, content, mood, song, imageUrl]
        );

        // Fetch user data along with post creation to return complete object
        const userQuery = await pool.query('SELECT name FROM users WHERE id = $1', [userId]);
        
        const responseData = {
           ...newPost.rows[0],
           user_name: userQuery.rows[0].name
        };

        res.status(201).json(responseData);
    } catch (err) {
        console.error("Create Post Error:", err.message);
        res.status(500).json({ message: 'Server error creating post' });
    }
};

// Fetch all posts efficiently sorted
exports.getPosts = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT posts.id, posts.content, posts.mood, posts.song, posts.image_url, posts.created_at, posts.user_id, users.name as user_name
            FROM posts 
            JOIN users ON posts.user_id = users.id 
            ORDER BY posts.created_at DESC
        `);

        res.json(result.rows);
    } catch (err) {
        console.error("Fetch Posts Error:", err.message);
        res.status(500).json({ message: 'Server error fetching posts' });
    }
};

// Delete a post safely based on ownership verification
exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        // Verify post exists and belongs to the user
        const post = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
        
        if (post.rows.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.rows[0].user_id !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this post' });
        }

        await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
        
        res.json({ message: 'Post successfully removed', id: postId });
    } catch (err) {
        console.error("Delete Post Error:", err.message);
        res.status(500).json({ message: 'Server error deleting post' });
    }
};

// Fetch personal latest vibe and compute continuous active streak
exports.getMyPosts = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Fetch all user posts to chronologically calculate the 24-hour unbroken streak
        const result = await pool.query(`
            SELECT * FROM posts 
            WHERE user_id = $1 
            ORDER BY created_at DESC 
        `, [userId]);

        const posts = result.rows;
        let streakCount = 0;
        let nextDeadline = null;

        if (posts.length > 0) {
            const now = new Date();
            const latestPostTime = new Date(posts[0].created_at);
            const msSinceLatest = now - latestPostTime;
            const msIn24H = 24 * 60 * 60 * 1000;

            if (msSinceLatest <= msIn24H) {
                let validPostsInChain = [posts[0]];
                for (let i = 0; i < posts.length - 1; i++) {
                    const curr = new Date(posts[i].created_at);
                    const prev = new Date(posts[i+1].created_at);
                    if ((curr - prev) <= msIn24H) {
                        validPostsInChain.push(posts[i+1]);
                    } else {
                        break;
                    }
                }
                const uniqueDays = new Set(validPostsInChain.map(p => new Date(p.created_at).toDateString()));
                streakCount = uniqueDays.size;
                nextDeadline = new Date(latestPostTime.getTime() + msIn24H).toISOString();
            }
        }

        const latestPost = posts.length > 0 ? posts[0] : null;
        res.json({
           latestVibe: latestPost,
           streak: streakCount,
           nextDeadline: nextDeadline
        });
    } catch (err) {
        console.error("Fetch Personal Posts Error:", err.message);
        res.status(500).json({ message: 'Server error fetching personal posts' });
    }
};

// Update a specific post safely based on ownership verification
exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Content is required for update' });
        }

        // Verify post exists and belongs to the user
        const post = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
        
        if (post.rows.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.rows[0].user_id !== userId) {
            return res.status(403).json({ message: 'Unauthorized to edit this post' });
        }

        const updatedPost = await pool.query(
            'UPDATE posts SET content = $1 WHERE id = $2 RETURNING *',
            [content, postId]
        );
        
        res.json(updatedPost.rows[0]);
    } catch (err) {
        console.error("Update Post Error:", err.message);
        res.status(500).json({ message: 'Server error updating post' });
    }
};
