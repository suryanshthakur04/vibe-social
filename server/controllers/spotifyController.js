const axios = require('axios');

let cachedToken = null;
let tokenExpiration = null;

async function getSpotifyToken() {
    const now = new Date();
    // Use cached token if valid
    if (cachedToken && tokenExpiration && now < tokenExpiration) {
        return cachedToken;
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
        throw new Error("Missing Spotify credentials deeply in .env");
    }

    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
        headers: {
            'Authorization': `Basic ${authString}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    cachedToken = response.data.access_token;
    tokenExpiration = new Date(now.getTime() + (response.data.expires_in - 60) * 1000); // Buffer 60 seconds
    
    return cachedToken;
}

exports.searchTracks = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ message: 'Search query natively required' });
        }

        const token = await getSpotifyToken();
        const response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        // Filter and strip only the beautiful metadata properties returning to the exact Frontend schema
        const tracksRaw = response.data.tracks.items;
        
        const tracks = await Promise.all(tracksRaw.map(async (track) => {
            let backupPreview = null;
            
            try {
                // CRITICAL SHIFT: Spotify blocked FREE preview_url streams in late 2024. 
                // To keep the Postcard UI fully functional natively, we execute a stealth fallback 
                // hitting the iTunes completely-free public API synchronously to extract matching .m4a payloads!
                const itunesRes = await axios.get(`https://itunes.apple.com/search?term=${encodeURIComponent(track.name + ' ' + track.artists[0].name)}&entity=song&limit=1`);
                if (itunesRes.data.results && itunesRes.data.results.length > 0) {
                    backupPreview = itunesRes.data.results[0].previewUrl;
                }
            } catch (e) {
                console.error("iTunes Audio Engine Error:", e.message);
            }

            return {
                id: track.id,
                title: track.name,
                artist: track.artists.map(a => a.name).join(', '),
                albumArt: track.album.images[0]?.url || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17',
                previewUrl: backupPreview
            };
        }));

        res.json(tracks);
    } catch (err) {
        console.error("Spotify Search Engine Error:", err.response?.data || err.message);
        res.status(500).json({ message: 'Error safely computing direct connections with the Spotify Web API payload block.' });
    }
};
