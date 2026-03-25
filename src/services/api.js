import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vibe-social-frb9.onrender.com/api', // Pointing directly to our express server
  timeout: 10000
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiry or global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Immediately redirect back to the registration screen
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },
  
  register: async (userData) => {
    return api.post('/auth/register', userData);
  }
};

export const vibeService = {
  createVibe: async (vibeData) => {
    return api.post('/posts', vibeData);
  },
  
  deleteVibe: async (vibeId) => {
    return api.delete(`/posts/${vibeId}`);
  },

  updateVibe: async (vibeId, contentData) => {
    return api.put(`/posts/${vibeId}`, contentData);
  },

  getDailyVibe: async () => {
    // Fetches the user's latest active vibe directly from the Postgres database
    return api.get('/posts/me');
  },
  
  getFriendsFeed: async () => {
     // Fills the feed page with REAL posts from the PostgreSQL backend
     // Mapping to fit our UI
     const res = await api.get('/posts');
     return {
       data: res.data.map((post) => ({
         id: post.id,
         name: post.user_name,
         vibe: post.content,
         likes: Math.floor(Math.random() * 500) + 10, // Mock random likes for visual
         image: post.image_url || ['bg-green-200', 'bg-pink-300', 'bg-orange-200', 'bg-teal-200'][post.id % 4]
       }))
     };
  }
};

export const spotifyService = {
  searchTracks: async (query) => {
    return api.get(`/spotify/search?q=${encodeURIComponent(query)}`);
  }
};

export default api;
