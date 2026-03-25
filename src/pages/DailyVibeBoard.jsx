import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vibeService, spotifyService } from '../services/api';
import { 
  Sparkles, 
  LayoutGrid, 
  Users, 
  PlusCircle, 
  Compass, 
  User as UserIcon,
  HelpCircle,
  Flame,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Plus,
  Check,
  Heart,
  Zap,
  MessageSquare
} from 'lucide-react';

const DailyVibeBoard = () => {
  const { user } = useAuth();
  const [boardData, setBoardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [streakData, setStreakData] = useState({ count: 0, deadline: null });
  const [timeLeft, setTimeLeft] = useState('--:--:--');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!streakData.deadline) return;
    const interval = setInterval(() => {
      const now = new Date();
      const deadline = new Date(streakData.deadline);
      const diff = deadline - now;
      if (diff <= 0) {
         setTimeLeft('00:00:00');
         setStreakData(prev => ({ ...prev, count: 0 }));
         clearInterval(interval);
      } else {
         const h = Math.floor(diff / (1000 * 60 * 60));
         const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
         const s = Math.floor((diff % (1000 * 60)) / 1000);
         setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [streakData.deadline]);

  // Task State mapped securely to LocalStorage caching for session persistence
  const defaultTasks = [
    { id: 1, text: 'Morning Meditation (15 min)', completed: false },
    { id: 2, text: 'Review Weekly Vibe Analytics', completed: true },
    { id: 3, text: 'Curate Mood Board for Project X', completed: false }
  ];

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('vibe_daily_goals');
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalText, setNewGoalText] = useState('');

  const presetGoals = [
    "Drink 2L of water",
    "Read 10 pages of a book",
    "30 minute deep workout",
    "Journal for 5 minutes",
    "No screen time before bed"
  ];

  useEffect(() => {
    localStorage.setItem('vibe_daily_goals', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const fetchVibe = async () => {
      try {
        const response = await vibeService.getDailyVibe();
        if (response.data) {
          setBoardData(response.data.latestVibe || null);
          setStreakData({ 
             count: response.data.streak || 0, 
             deadline: response.data.nextDeadline || null 
          });
        }
      } catch (error) {
        console.error('Failed to fetch daily vibe', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVibe();
  }, []);

  const toggleTask = (taskId) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const addCustomGoal = (e) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    const newTask = { id: Date.now(), text: newGoalText.trim(), completed: false };
    setTasks([...tasks, newTask]);
    setNewGoalText('');
    setShowAddGoal(false);
  };

  const addPresetGoal = (text) => {
    const newTask = { id: Date.now(), text, completed: false };
    setTasks([...tasks, newTask]);
    setShowAddGoal(false);
  };

  // Remove existing goal functionality mapped securely to long clicks or just a delete button integration over hover.
  const deleteTask = (taskId, e) => {
    e.stopPropagation(); // prevent toggling the parent
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleUpdateThought = async () => {
    if (!editContent.trim() || editContent === boardData?.content) {
      setIsEditing(false);
      return;
    }
    
    // Optimistic UI Update natively updating the dashboard instantly without waiting on full reloads
    const previousContent = boardData.content;
    setBoardData({ ...boardData, content: editContent });
    setIsEditing(false);
    
    try {
       await vibeService.updateVibe(boardData.id, { content: editContent });
    } catch (error) {
       console.error("Failed to update thought", error);
       alert("Failed to update your vibe thought. Server rejected the edit.");
       // Revert optimistic update
       setBoardData({ ...boardData, content: previousContent });
    }
  };
  // Parse Mood Data securely maintaining pure JSON compatibility with arbitrary Aura Palettes
  let currentMoodName = 'Radiant';
  let currentMoodEmoji = '✨';
  let currentMoodColor = 'from-[#f895fb] via-[#b682fa] to-[#04def9]';
  let currentMoodDesc = 'Energy levels are peaking. Perfect for creative flow.';

  if (boardData?.mood) {
      if (boardData.mood.startsWith('{')) {
          try {
              const moodObj = JSON.parse(boardData.mood);
              currentMoodName = moodObj.name || currentMoodName;
              currentMoodEmoji = moodObj.emoji || currentMoodEmoji;
              currentMoodColor = moodObj.color || currentMoodColor;
              currentMoodDesc = moodObj.desc || currentMoodDesc;
          } catch(e) {}
      } else {
          // Backward compatibility for raw legacy string presets seamlessly routed
          const rawMood = boardData.mood.charAt(0).toUpperCase() + boardData.mood.slice(1);
          currentMoodName = rawMood;
          if (rawMood.toLowerCase() === 'cyber') { currentMoodEmoji = '⚡'; currentMoodColor = 'from-[#04def9] to-[#088395]'; currentMoodDesc = 'Wired into the mainframe. High frequency.'; }
          if (rawMood.toLowerCase() === 'melancholy') { currentMoodEmoji = '🌧️'; currentMoodColor = 'from-[#a1c4fd] to-[#c2e9fb]'; currentMoodDesc = 'Embracing the slow currents within.'; }
          if (rawMood.toLowerCase() === 'ethereal') { currentMoodEmoji = '🦋'; currentMoodColor = 'from-[#e0c3fc] to-[#8ec5fc]'; currentMoodDesc = 'Floating above it all seamlessly.'; }
      }
  }
  const currentThought = boardData?.content || "The energy you put out is the life you receive. Keep vibrating high and the universe will follow your lead.";

  // Parse Song Data securely decoding Spotify API payloads fallback compliant
  const [activeTrack, setActiveTrack] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [isFetchingRecommendations, setIsFetchingRecommendations] = useState(false);

  useEffect(() => {
     if (boardData?.song) {
        try {
           const parsed = JSON.parse(boardData.song);
           setActiveTrack(parsed);
           setPlaylist([parsed]);
        } catch (e) {
           // Fallback for older static text posts
           const title = boardData.song.split('-')[0]?.trim() || boardData.song;
           const artist = boardData.song.split('-')[1]?.trim() || "Unknown Artist";
           const staticTrack = { title, artist, albumArt: null, previewUrl: null, id: 'static' };
           setActiveTrack(staticTrack);
           setPlaylist([staticTrack]);
        }
     }
  }, [boardData]);

  const handleNextTrack = async () => {
      if (!activeTrack) return;
      const currentIndex = playlist.findIndex(t => t.id === activeTrack.id);
      
      // Playout local caches sequentially
      if (currentIndex > -1 && currentIndex < playlist.length - 1) {
          setActiveTrack(playlist[currentIndex + 1]);
          setProgress(0);
          setIsPlaying(true);
          return;
      }

      // Reaching the queue boundary fetches dynamic Proxy Recommendations 
      if (!activeTrack.artist || activeTrack.artist === "Unknown Artist" || isFetchingRecommendations) return;
      
      setIsFetchingRecommendations(true);
      try {
          // Native seamless API seeding to automatically generate radio tracks mathematically mirroring the local vibe
          const res = await spotifyService.searchTracks(activeTrack.artist + " top tracks");
          const newTracks = res.data.filter(t => !playlist.some(p => p.id === t.id) && t.previewUrl);
          
          if (newTracks.length > 0) {
              const updatedPlaylist = [...playlist, ...newTracks];
              setPlaylist(updatedPlaylist);
              setActiveTrack(newTracks[0]);
              setProgress(0);
              setIsPlaying(true);
          } else if (playlist.length > 1) {
              // Radio looping mechanism if queue buffers drop completely
              setActiveTrack(playlist[0]);
              setProgress(0);
              setIsPlaying(true);
          }
      } catch (err) {
          console.error("Failed to dynamically fetch next tracks natively:", err);
      } finally {
          setIsFetchingRecommendations(false);
      }
  };

  const handlePrevTrack = () => {
      if (!activeTrack) return;
      const currentIndex = playlist.findIndex(t => t.id === activeTrack.id);
      if (currentIndex > 0) {
          setActiveTrack(playlist[currentIndex - 1]);
          setProgress(0);
          setIsPlaying(true);
      } else if (playlist.length > 1) {
          // Loop globally around boundary drops
          setActiveTrack(playlist[playlist.length - 1]);
          setProgress(0);
          setIsPlaying(true);
      }
  };

  const handleTimeUpdate = () => {
      if (audioRef.current) {
          const current = audioRef.current.currentTime;
          const total = audioRef.current.duration;
          if (total) setProgress((current / total) * 100);
      }
  };

  const handleSeek = (e) => {
      if (audioRef.current && previewUrl) {
          const bounds = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - bounds.left;
          const percentage = x / bounds.width;
          audioRef.current.currentTime = percentage * audioRef.current.duration;
          setProgress(percentage * 100);
      }
  };

  const currentSong = activeTrack?.title || "Ethereal Echoes";
  const songArtist = activeTrack?.artist || "Lofi Girl • Midnight Session";
  const albumArtUrl = activeTrack?.albumArt || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200";
  const previewUrl = activeTrack?.previewUrl || null;

  const audioRef = useRef(null);
  
  // Auto-play/pause logic wrapping the invisible HTML5 browser API natively
  useEffect(() => {
     if (audioRef.current && previewUrl) {
        if (isPlaying) {
            audioRef.current.play().catch(e => {
                console.error("Audio playback natively failed:", e);
                setIsPlaying(false);
            });
        } else {
            audioRef.current.pause();
        }
     }
  }, [isPlaying, previewUrl]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#0b0c10] text-gray-200 font-sans">
      
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0b0c10] flex flex-col justify-between hidden md:flex sticky top-16 h-[calc(100vh-4rem)]">
         <div className="p-6">
            <div className="flex items-center space-x-3 mb-10">
               <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center">
                 <Sparkles size={20} className="text-brand" />
               </div>
               <div>
                  <h3 className="text-white font-bold text-sm">Your Vibe</h3>
                  <p className="text-[10px] text-gray-500">Daily Streak: {streakData.count > 0 ? `${streakData.count} days` : 'Broken'}</p>
               </div>
            </div>

            <nav className="space-y-2">
               <Link to="/dashboard" className="flex items-center space-x-3 bg-surface border border-white/5 rounded-xl px-4 py-3 text-sm text-brand font-medium shadow-[0_4px_20px_-5px_rgba(207,149,252,0.15)]">
                 <LayoutGrid size={18} />
                 <span>Main Board</span>
               </Link>
               <Link to="/friends" className="flex items-center space-x-3 hover:bg-white/5 rounded-xl px-4 py-3 text-sm text-gray-400 hover:text-white transition-colors">
                 <Users size={18} />
                 <span>Friends</span>
               </Link>
               <Link to="/create-vibe" className="flex items-center space-x-3 hover:bg-white/5 rounded-xl px-4 py-3 text-sm text-gray-400 hover:text-white transition-colors">
                 <PlusCircle size={18} />
                 <span>Create</span>
               </Link>
               <Link to="/trending" className="flex items-center space-x-3 hover:bg-white/5 rounded-xl px-4 py-3 text-sm text-gray-400 hover:text-white transition-colors">
                 <Compass size={18} />
                 <span>Explore</span>
               </Link>
               <Link to="/profile" className="flex items-center space-x-3 hover:bg-white/5 rounded-xl px-4 py-3 text-sm text-gray-400 hover:text-white transition-colors">
                 <UserIcon size={18} />
                 <span>Profile</span>
               </Link>
            </nav>
         </div>

         <div className="p-6">
            <button className="w-full bg-gradient-to-r from-brand to-secondary text-white font-medium text-sm py-3 rounded-xl mb-8 shadow-[0_0_20px_-5px_rgba(207,149,252,0.4)] hover:shadow-[0_0_25px_-5px_rgba(207,149,252,0.6)] transition-all">
               Share Mood
            </button>
            <div className="space-y-4 px-2">
               <a href="#" className="flex items-center space-x-3 text-xs text-gray-500 hover:text-gray-300 transition-colors">
                 <HelpCircle size={14} />
                 <span>Help</span>
               </a>
               <a href="#" className="flex items-center space-x-3 text-xs text-gray-500 hover:text-gray-300 transition-colors">
                 {/* Lucide doesn't have ShieldOutline directly, using Shield equivalent */}
                 <span className="w-3.5 h-3.5 rounded-sm border border-current flex items-center justify-center text-[8px]">S</span>
                 <span>Privacy</span>
               </a>
            </div>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto overflow-y-auto">
         
         {/* Top Header - added mt-6 to prevent underlapping the fixed global Navbar */}
         <header className="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-6 mt-6">
            <div>
               <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Welcome back, {user?.name ? user.name.split(' ')[0] : 'Suryansh'}</h1>
               <p className="text-gray-400 text-sm">Your vibe is radiant today. Ready to set the tone?</p>
            </div>
            <div className="flex items-center justify-between space-x-6 bg-[#141620] border border-white/5 px-6 py-3 rounded-2xl shadow-lg">
               <div>
                  <p className="text-[10px] text-brand tracking-widest font-bold uppercase mb-0.5">24h Streak</p>
                  <p className="text-xl font-bold text-white leading-none">{streakData.count > 0 ? `${streakData.count} POST` + (streakData.count > 1 ? 'S' : '') : 'BROKEN'}</p>
               </div>
               {streakData.count > 0 && streakData.deadline && (
                  <div className="text-center bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                     <p className="text-[9px] text-gray-500 tracking-widest uppercase mb-0.5">Expires In</p>
                     <p className="text-xs font-bold text-orange-400 font-mono tracking-wider tabular-nums">{timeLeft}</p>
                  </div>
               )}
               <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${streakData.count > 0 ? 'bg-gradient-to-br from-orange-400 to-red-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-white/5 border border-white/10 grayscale'}`}>
                 <Flame size={20} className={`text-white ${streakData.count > 0 ? 'fill-current' : 'opacity-50'}`} />
               </div>
            </div>
         </header>

         {/* Upper Grid: Mood & Music */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Mood Card */}
            <div className="lg:col-span-2 relative rounded-3xl overflow-hidden shadow-2xl group flex flex-col justify-between p-8 min-h-[380px]">
               {/* Vivid Background Gradient or Dynamic Uploaded Image */}
               {boardData?.image_url ? (
                 <>
                   <img src={boardData.image_url.startsWith('http') ? boardData.image_url : `https://vibe-social-frb9.onrender.com${boardData.image_url}`} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Vibe Visual Anchor" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>
                 </>
               ) : (
                 <div className={`absolute inset-0 bg-gradient-to-br ${currentMoodColor} opacity-90 transition-transform duration-700 group-hover:scale-105`}></div>
               )}
               
               {/* Decorative Shapes overlay */}
               <div className="absolute top-10 right-10 opacity-30 pointer-events-none">
                  <div className="text-[140px] blur-[3px] -mr-8 -mt-12 select-none drop-shadow-2xl">
                     {currentMoodEmoji}
                  </div>
               </div>

               <div className="relative z-10 flex flex-col h-full justify-between">
                 <div>
                   <span className="inline-block bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 shadow-sm">
                     Mood of the Day
                   </span>
                   <div className="flex items-start mt-2">
                     <div className="text-4xl md:text-5xl mr-5 drop-shadow-lg flex-shrink-0 mt-2 select-none">{currentMoodEmoji}</div>
                     <div>
                       <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight tracking-tight drop-shadow-sm">
                         {currentMoodName}
                       </h2>
                       <p className="text-white/90 text-sm font-medium drop-shadow-sm max-w-sm">
                         {currentMoodDesc}
                       </p>
                     </div>
                   </div>
                 </div>

                 <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mt-10 shadow-lg relative group/edit transition-all min-h-[140px] flex flex-col justify-center">
                    <div className="absolute -top-3 -left-2 text-white/40 text-4xl font-serif select-none pointer-events-none">"</div>
                    <h4 className="text-white font-bold text-xs mb-2 flex items-center tracking-wider">
                       <span className="mr-2 opacity-80">💭</span> THOUGHT OF THE DAY
                    </h4>
                    
                    {!isEditing ? (
                       <p 
                          onClick={() => {
                            if (boardData) {
                              setEditContent(currentThought);
                              setIsEditing(true);
                            }
                          }}
                          className="text-white/90 text-sm md:text-base italic font-medium leading-relaxed group-hover/edit:text-white cursor-text transition-colors w-full"
                          title="Click to edit your vibe"
                       >
                          "{currentThought}"
                       </p>
                    ) : (
                       <div className="flex flex-col w-full relative z-20">
                          <textarea
                             value={editContent}
                             onChange={(e) => setEditContent(e.target.value)}
                             onBlur={handleUpdateThought}
                             onKeyDown={(e) => {
                               if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleUpdateThought();
                               }
                             }}
                             autoFocus
                             className="w-full bg-black/20 border-b-2 border-brand focus:border-white text-white/90 text-sm md:text-base italic font-medium rounded-t-lg p-3 outline-none resize-none overflow-hidden placeholder-white/30 transition-all shadow-inner"
                             rows={3}
                          />
                          <span className="text-[10px] text-brand/70 absolute -bottom-5 right-1">Press Enter to save</span>
                       </div>
                    )}
                 </div>
               </div>
            </div>

            {/* Music Player Card */}
            <div className="bg-[#141620] rounded-3xl p-6 border border-white/5 shadow-xl flex flex-col shadow-black/40 min-h-[380px]">
               <h3 className="text-[10px] font-bold text-secondary tracking-widest uppercase mb-6">Song of the Day</h3>
               
               {/* Album Art Container */}
               <div className="flex-1 bg-[#f5efe6] rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center p-8 group shadow-inner">
                  {/* Dynamic Album Art / Mock Vinyl Graphic */}
                  <div className={`text-center transition-all ${isPlaying ? 'scale-110 drop-shadow-2xl' : 'group-hover:scale-105'}`}>
                     <div className="w-24 h-24 border-4 border-[#b9ae9a] rounded-t-full relative overflow-hidden mx-auto border-b-0 shadow-lg">
                        <img src={albumArtUrl} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-85'}`} alt="Album Art" />
                        <div className="absolute inset-x-2 top-2 bottom-0 border-4 border-[#c8bfae]/60 rounded-t-full border-b-0"></div>
                        <div className="absolute inset-x-5 top-5 bottom-0 border-4 border-[#d5ccbe]/60 rounded-t-full border-b-0"></div>
                        <div className="absolute inset-x-8 top-8 bottom-0 border-4 border-[#ab9f89]/60 rounded-t-full border-b-0"></div>
                     </div>
                     <p className="text-[#8c816d] text-[6px] tracking-widest mt-4 font-serif">M O R I A N  A R T</p>
                     <div className="w-16 h-px bg-[#8c816d]/30 mx-auto mt-1"></div>
                  </div>
               </div>
               
               <div className="text-center mb-6">
                 <h4 className="text-white font-bold text-lg">{currentSong}</h4>
                 <p className="text-gray-400 text-xs mt-1">{songArtist}</p>
               </div>
               
               {/* Player Controls */}
               <div className="mt-auto">
                 {/* Hidden HTML5 Native Audio Proxy */}
                 {previewUrl && (
                    <audio 
                       ref={audioRef} 
                       src={previewUrl} 
                       onEnded={handleNextTrack} 
                       onTimeUpdate={handleTimeUpdate}
                       className="hidden" 
                    />
                 )}
                 
                 <div 
                    onClick={handleSeek}
                    className={`w-full bg-[#202336] h-1.5 rounded-full mb-4 overflow-hidden relative cursor-pointer ${isPlaying ? 'shadow-[0_0_10px_rgba(207,149,252,0.3)]' : ''}`}
                 >
                    <div 
                       className="h-full bg-secondary rounded-full transition-all duration-100 ease-linear" 
                       style={{ width: `${progress}%` }}
                    ></div>
                 </div>
                 <div className="flex items-center justify-between px-2">
                    <button className="text-gray-500 hover:text-white transition-colors"><Shuffle size={16} /></button>
                    <button onClick={handlePrevTrack} className="text-white hover:text-brand transition-colors"><SkipBack size={18} className="fill-current" /></button>
                    {!previewUrl ? (
                        <button 
                          className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-black/50 cursor-not-allowed shadow-none"
                          title="No audio preview available for this track"
                        >
                          <Play size={20} className="fill-current ml-1" />
                        </button>
                    ) : (
                        <button 
                          onClick={() => setIsPlaying(!isPlaying)}
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform ${isPlaying ? 'bg-gradient-to-br from-[#c88df4] to-[#f895fb] shadow-[0_0_20px_rgba(200,141,244,0.6)]' : 'bg-white shadow-[0_0_15px_-3px_rgba(255,255,255,0.4)]'}`}
                        >
                          {isPlaying ? <Pause size={20} className="fill-current text-white drop-shadow-md" /> : <Play size={20} className="fill-current ml-1 drop-shadow-md" />}
                        </button>
                    )}
                    <button 
                       onClick={handleNextTrack} 
                       className={`transition-colors ${isFetchingRecommendations ? 'text-brand animate-pulse' : 'text-white hover:text-brand'}`}
                    >
                       <SkipForward size={18} className={`fill-current ${isFetchingRecommendations ? 'opacity-50' : 'opacity-100'}`} />
                    </button>
                    <button className="text-gray-500 hover:text-white transition-colors"><Repeat size={16} /></button>
                 </div>
               </div>
            </div>
         </div>

         {/* Middle Section: Daily Goals */}
         <div className="bg-[#141620] rounded-3xl p-8 border border-white/5 shadow-xl mb-8 relative">
            <div className="flex items-center justify-between mb-6">
               <div>
                 <h2 className="text-2xl font-bold text-white mb-1">Daily Goals</h2>
                 <p className="text-xs text-gray-500">Consistency is the key to mastery.</p>
               </div>
               <button 
                 onClick={() => setShowAddGoal(!showAddGoal)}
                 className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${showAddGoal ? 'bg-brand/20 border-brand/50 rotate-45' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
               >
                 <Plus size={18} className={showAddGoal ? 'text-brand' : 'text-gray-400'} />
               </button>
            </div>
            
            {showAddGoal && (
               <div className="mb-8 p-6 bg-surface/50 border border-white/5 rounded-2xl shadow-inner">
                  <h4 className="text-sm font-bold text-white mb-3">Add Custom Goal</h4>
                  <form onSubmit={addCustomGoal} className="flex space-x-3 mb-6">
                    <input 
                       type="text" 
                       value={newGoalText}
                       onChange={(e) => setNewGoalText(e.target.value)}
                       placeholder="e.g., Code for 2 hours..."
                       className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand transition-colors"
                    />
                    <button type="submit" className="bg-brand text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-brand/80 transition-colors">
                       Add
                    </button>
                  </form>
                  
                  <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">Or choose a preset</h4>
                  <div className="flex flex-wrap gap-2">
                     {presetGoals.map(goal => (
                        <button 
                           key={goal}
                           onClick={() => addPresetGoal(goal)}
                           className="bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 text-xs py-1.5 px-3 rounded-full transition-colors flex items-center"
                        >
                           <Plus size={12} className="mr-1.5 opacity-70" /> {goal}
                        </button>
                     ))}
                  </div>
               </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {tasks.map(task => (
                 <div key={task.id} 
                      onClick={() => toggleTask(task.id)}
                      className={`group flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all ${task.completed ? 'bg-surface/30 border-white/5 opacity-70' : 'bg-surface border-white/10 hover:border-white/20 shadow-md'}`}>
                    <div className="flex items-center space-x-4">
                       <div className={`w-6 h-6 rounded-md flex justify-center items-center flex-shrink-0 transition-colors ${task.completed ? 'bg-gradient-to-br from-[#c88df4] to-[#fb9cf7] text-white shadow-sm' : 'border border-gray-600 bg-transparent'}`}>
                          {task.completed && <Check size={14} strokeWidth={3} />}
                       </div>
                       <p className={`text-sm font-medium transition-colors ${task.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                          {task.text}
                       </p>
                    </div>
                    {/* Hover delete icon to cleanly remove goals */}
                    <button 
                      onClick={(e) => deleteTask(task.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all p-1"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                 </div>
               ))}
            </div>
         </div>
         
         {/* Bottom Section: Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#141620] p-6 rounded-3xl border border-white/5 flex items-center space-x-6 shadow-lg shadow-black/20 hover:scale-[1.02] transition-transform">
               <div className="w-12 h-12 rounded-2xl bg-[#ffcca1]/10 flex items-center justify-center border border-[#ffcca1]/20">
                 <Heart size={20} className="text-[#ff9d71] fill-[#ff9d71]" />
               </div>
               <div>
                  <h3 className="text-3xl font-bold text-white mb-1">128</h3>
                  <p className="text-[10px] text-gray-400 tracking-widest uppercase font-bold">Community Highs</p>
               </div>
            </div>

            <div className="bg-[#141620] p-6 rounded-3xl border border-white/5 flex items-center space-x-6 shadow-lg shadow-black/20 hover:scale-[1.02] transition-transform">
               <div className="w-12 h-12 rounded-2xl bg-[#a1fdff]/10 flex items-center justify-center border border-[#a1fdff]/20">
                 <Zap size={20} className="text-[#04def9] fill-current" />
               </div>
               <div>
                  <h3 className="text-3xl font-bold text-white mb-1">84%</h3>
                  <p className="text-[10px] text-gray-400 tracking-widest uppercase font-bold">Vibe Alignment</p>
               </div>
            </div>

            <div className="bg-[#141620] p-6 rounded-3xl border border-white/5 flex items-center space-x-6 shadow-lg shadow-black/20 hover:scale-[1.02] transition-transform">
               <div className="w-12 h-12 rounded-2xl bg-[#fea1ff]/10 flex items-center justify-center border border-[#fea1ff]/20">
                 <MessageSquare size={20} className="text-[#fb9cf7] fill-current" />
               </div>
               <div>
                  <h3 className="text-3xl font-bold text-white mb-1">12</h3>
                  <p className="text-[10px] text-gray-400 tracking-widest uppercase font-bold">Unseen Vibes</p>
               </div>
            </div>
         </div>

      </main>
    </div>
  );
};

export default DailyVibeBoard;

