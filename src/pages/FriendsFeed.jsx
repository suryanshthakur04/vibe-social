import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vibeService } from '../services/api';
import { 
  Sparkles, 
  LayoutGrid, 
  Users, 
  PlusCircle, 
  Compass, 
  User as UserIcon,
  HelpCircle,
  Search,
  Music,
  Disc,
  Headphones,
  Zap,
  MessageSquare,
  Heart,
  PenTool
} from 'lucide-react';

const FriendsFeed = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hardcoded visual fallbacks matching exact Figma mockups for when DB is sparse
  const figmaFallbacks = [
    {
      id: 'f1',
      name: 'Luna Ray',
      time: '2m ago',
      mood: 'ETHEREAL',
      moodGradient: 'from-[#c88df4] to-[#fb9cf7]',
      moodPrefix: '✨',
      avatarBg: 'bg-[#2a1b38]',
      content: '"Finally finished the gallery walls. The light in here at 4 PM is literally magic."',
      songTitle: 'Midnight City',
      songArtist: 'M83 • Digital Shades',
      songIcon: <Music size={14} className="text-[#fb9cf7]" />,
      stats: [
        { icon: <Sparkles size={14} />, count: 12 },
        { icon: <Heart size={14} className="fill-[#ff6b6b] text-[#ff6b6b]" />, count: 8 }
      ],
      comments: 3,
      commentList: []
    },
    {
      id: 'f2',
      name: 'Kaelan V.',
      time: '45m ago',
      mood: 'FLOW STATE',
      moodGradient: 'from-[#04def9] to-[#088395]',
      moodPrefix: '🌊',
      avatarBg: 'bg-[#1b2f38]',
      content: '"Deep diving into some generative art projects. The code is finally starting to make sense."',
      songTitle: 'After Dark',
      songArtist: 'Mr. Kitty • Time',
      songIcon: <Headphones size={14} className="text-[#04def9]" />,
      stats: [
        { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, count: 42 },
        { icon: <Zap size={14} className="fill-current" />, count: 15 }
      ],
      comments: 12,
      commentList: [{ user: 'Luna Ray:', text: 'Keep pushing that creative energy!' }]
    },
    {
      id: 'f3',
      name: 'Marcus T.',
      time: '3h ago',
      mood: 'PURE CHAOS',
      moodGradient: 'from-[#ff9d71] to-[#e85c2c]',
      moodPrefix: '⚡',
      avatarBg: 'bg-[#38241b]',
      content: '"Third espresso. Let\'s go. Productivity is at an all-time high or I\'m about to explode."',
      songTitle: 'Harder, Better, Faster',
      songArtist: 'Daft Punk • Discovery',
      songIcon: <Disc size={14} className="text-[#ff9d71]" />,
      stats: [
        { icon: <Zap size={14} className="fill-current text-[#ff9d71]" />, count: 89 },
        { icon: <Sparkles size={14} />, count: 21 }
      ],
      comments: 5,
      commentList: []
    }
  ];

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await vibeService.getFriendsFeed();
        // If the database has posts, randomly apply our Figma visual styles to them so they look stunning
        if (response.data && response.data.length > 0) {
           const stylizedFeed = response.data.map((post, index) => {
              const styleTemplate = figmaFallbacks[index % 3];
              return {
                 id: post.id,
                 name: post.name || styleTemplate.name,
                 time: 'Just now',
                 mood: post.mood ? post.mood.toUpperCase() : styleTemplate.mood,
                 moodGradient: styleTemplate.moodGradient,
                 moodPrefix: styleTemplate.moodPrefix,
                 avatarBg: styleTemplate.avatarBg,
                 content: `"${post.vibe}"`,
                 songTitle: post.song || styleTemplate.songTitle,
                 songArtist: styleTemplate.songArtist,
                 songIcon: styleTemplate.songIcon,
                 stats: styleTemplate.stats,
                 comments: styleTemplate.comments,
                 commentList: styleTemplate.commentList
              };
           });
           setFeed([...stylizedFeed, ...figmaFallbacks].slice(0, 6)); // Ensure we have enough posts to look good
        } else {
           setFeed(figmaFallbacks);
        }
      } catch (error) {
        console.error('Error fetching friends feed', error);
        setFeed(figmaFallbacks); // Fallback to Figma mocks if network drops
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  if (loading) return <div className="min-h-screen pt-20 flex justify-center text-gray-400 bg-[#0b0c10]">Syncing frequencies...</div>;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#0b0c10] text-[#e2e8f0] font-sans">
      
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0b0c10] flex flex-col justify-between hidden md:flex sticky top-16 h-[calc(100vh-4rem)]">
         <div className="p-6">
            <div className="flex items-center space-x-3 mb-10">
               <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center">
                 <Sparkles size={20} className="text-[#fb9cf7]" />
               </div>
               <div>
                  <h3 className="text-white font-bold text-sm">Your Vibe</h3>
                  <p className="text-[10px] text-gray-500">Daily Streak: 5 days</p>
               </div>
            </div>

            <nav className="space-y-2">
               <Link to="/dashboard" className="flex items-center space-x-3 hover:bg-white/5 rounded-xl px-4 py-3 text-sm text-gray-400 hover:text-white transition-colors">
                 <LayoutGrid size={18} />
                 <span>Main Board</span>
               </Link>
               
               {/* ACTIVE FRIENDS LINK */}
               <Link to="/friends" className="flex items-center space-x-3 bg-surface border border-white/5 rounded-xl px-4 py-3 text-sm text-[#fb9cf7] font-medium shadow-[0_4px_20px_-5px_rgba(207,149,252,0.15)]">
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
            <button className="w-full bg-gradient-to-r from-brand to-secondary text-white font-medium text-sm py-3 rounded-xl mb-8 shadow-[0_0_20px_-5px_rgba(207,149,252,0.4)] hover:scale-[1.02] transition-all">
               Share Mood
            </button>
            <div className="space-y-4 px-2">
               <a href="#" className="flex items-center space-x-3 text-xs text-gray-500 hover:text-gray-300 transition-colors">
                 <HelpCircle size={14} />
                 <span>Help</span>
               </a>
               <a href="#" className="flex items-center space-x-3 text-xs text-gray-500 hover:text-gray-300 transition-colors">
                 <span className="w-3.5 h-3.5 rounded-sm border border-current flex items-center justify-center text-[8px]">S</span>
                 <span>Privacy</span>
               </a>
            </div>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto overflow-y-auto relative pb-32">
         
         {/* Header */}
         <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 mt-2">
            <div>
               <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">Friends Feed</h1>
               <p className="text-gray-400 text-sm md:text-base max-w-md leading-relaxed">
                  Catch the waves your circle is riding today. Real-time mood snapshots from the people you care about.
               </p>
            </div>
            
            <div className="flex items-center bg-[#141620] rounded-full p-1 border border-white/5 shadow-md">
               <button className="px-5 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors rounded-full">All Activities</button>
               <button className="px-5 py-2 text-xs font-bold text-[#c88df4] bg-white/5 border border-white/10 rounded-full shadow-inner tracking-wider">Just Moods</button>
            </div>
         </header>

         {/* Feed Grid (Masonry-like layout) */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feed.map((post) => (
               <div key={post.id} className="bg-[#141620] rounded-3xl p-6 border border-white/5 shadow-xl hover:border-white/10 transition-colors group flex flex-col h-full">
                  
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-6">
                     <div className="flex items-center space-x-3">
                        <div className="relative">
                           <div className={`w-12 h-12 rounded-full flex items-center justify-center ${post.avatarBg}`}>
                              <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${post.name}`} className="w-10 h-10 rounded-full opacity-80" alt="avatar" />
                           </div>
                           <div className="absolute -bottom-1 -right-1 bg-[#1a1c29] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#141620] text-[10px]">
                              {post.moodPrefix}
                           </div>
                        </div>
                        <div>
                           <h3 className="font-bold text-white text-sm">{post.name}</h3>
                           <p className={`text-[9px] font-extrabold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r ${post.moodGradient}`}>
                              FEELING {post.mood}
                           </p>
                        </div>
                     </div>
                     <span className="text-xs text-gray-500 font-medium">{post.time}</span>
                  </div>

                  {/* Vibe Quote */}
                  <p className="text-white/90 text-[15px] font-medium leading-relaxed mb-6">
                     {post.content}
                  </p>

                  {/* Anthem Block */}
                  <div className="bg-[#1a1c29] border border-white/5 rounded-2xl p-4 flex items-center mb-6 shadow-inner">
                     <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mr-3">
                        {post.songIcon}
                     </div>
                     <div className="flex-1">
                        <h4 className="text-white text-xs font-bold">{post.songTitle}</h4>
                        <p className="text-[10px] text-gray-400">{post.songArtist}</p>
                     </div>
                     <div className="w-8 flex items-center justify-center opacity-50">
                        {/* Audio wave simple visualization */}
                        <div className="flex items-end space-x-0.5 h-3">
                           <div className="w-[2px] bg-brand h-1/2 rounded-full animate-pulse"></div>
                           <div className="w-[2px] bg-brand h-full rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                           <div className="w-[2px] bg-brand h-3/4 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                        </div>
                     </div>
                  </div>

                  {/* Interaction Pills */}
                  <div className="flex space-x-3 mb-6 mt-auto">
                     {post.stats.map((stat, i) => (
                        <button key={i} className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full px-4 py-1.5 transition-colors">
                           <span className="text-gray-400">{stat.icon}</span>
                           <span className="text-xs font-bold text-white shadow-sm">{stat.count}</span>
                        </button>
                     ))}
                     <button className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full px-4 py-1.5 ml-auto transition-colors">
                        <MessageSquare size={14} className="text-gray-400" />
                        <span className="text-xs font-bold text-white shadow-sm">{post.comments}</span>
                     </button>
                  </div>

                  {/* Legacy Comments embedded in card */}
                  {post.commentList && post.commentList.length > 0 && (
                     <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 mb-4 shadow-sm w-fit max-w-full">
                        <p className="text-[11px] text-gray-300 truncate">
                           <span className="font-bold text-white mr-1">{post.commentList[0].user}</span>
                           {post.commentList[0].text}
                        </p>
                     </div>
                  )}

                  {/* Add Comment Input */}
                  <div className="flex items-center space-x-3 pt-4 border-t border-white/5">
                     <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                        <UserIcon size={12} className="text-gray-400" />
                     </div>
                     <input 
                        type="text" 
                        placeholder="Add a thought..." 
                        className="bg-transparent text-[11px] outline-none flex-1 text-white placeholder-gray-500 font-medium"
                     />
                  </div>

               </div>
            ))}
         </div>

         {/* Floating Action Button */}
         <div className="fixed bottom-10 right-10">
            <Link to="/create-vibe" className="flex items-center bg-gradient-to-r from-[#fb9cf7] to-[#c88df4] text-black font-extrabold px-6 py-4 rounded-full shadow-[0_10px_35px_rgba(200,141,244,0.4)] hover:scale-105 transition-transform text-sm tracking-wide">
               <PenTool size={16} className="mr-2 fill-current" /> Update Vibe
            </Link>
         </div>

      </main>
    </div>
  );
};

export default FriendsFeed;
