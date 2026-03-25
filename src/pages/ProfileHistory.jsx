import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  LayoutGrid,
  Users, 
  PlusCircle, 
  Compass, 
  User as UserIcon,
  HelpCircle,
  Flame,
  ArrowRight,
  Camera
} from 'lucide-react';
import { useRef } from 'react';

const ProfileHistory = () => {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/profile-photo', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) {
         if (res.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return;
         }
         throw new Error('Failed to upload photo');
      }
      
      const data = await res.json();
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      console.error(error);
      alert('Failed to update profile photo: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };
  
  // Generating exact visual blocks for the Vibe History graph
  const generateGraphSpaces = () => {
    const colors = [
      'bg-[#1a1c29]', // Empty/Dark
      'bg-[#1a1c29]',
      'bg-[#1a1c29]',
      'bg-[#6d4c82]', // Purple Dark
      'bg-[#996bb3]', // Purple Light
      'bg-[#088395]', // Teal Dark
      'bg-[#05bfdb]', // Teal Light
      'bg-[#8c5230]', // Orange Dark
      'bg-[#c97445]', // Orange Light
    ];
    
    // We want specifically 4 rows of 7 columns = 28 blocks
    return Array.from({ length: 28 }, (_, i) => {
       // deterministic randomness for the mockup look
       let colorIndex = 0;
       if (i % 7 === 3 || i % 7 === 4) colorIndex = (i % 3) + 5; // Teals
       else if (i % 7 === 2 || i % 7 === 6) colorIndex = (i % 2) + 3; // Purples
       else if (i % 7 === 5) colorIndex = (i % 2) + 7; // Oranges
       else colorIndex = Math.floor(Math.random() * 3); // Empties

       // Exact hardcoded aesthetics from Figma to look stunning
       const figmaMockup = [
          1, 1, 4, 6, 5, 8, 4,
          3, 1, 5, 5, 7, 3, 3,
          1, 1, 3, 6, 5, 8, 4,
          4, 3, 1, 1, 5, 8, 4
       ];
       
       const finalColor = colors[figmaMockup[i]];
       return (
          <div 
             key={i} 
             className={`aspect-square rounded-md ${finalColor} w-full transition-all hover:scale-105 hover:brightness-125 cursor-pointer shadow-inner`}
          />
       );
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#0b0c10] text-gray-200 font-sans">
      
      {/* Left Sidebar (Matches Dashboard UI exactly) */}
      <aside className="w-64 border-r border-white/5 bg-[#0b0c10] flex flex-col justify-between hidden md:flex sticky top-16 h-[calc(100vh-4rem)]">
         <div className="p-6">
            <div className="flex items-center space-x-3 mb-10">
               <div className="w-10 h-10 rounded-full bg-surface border border-white/5 flex items-center justify-center">
                 <Sparkles size={20} className="text-gray-400" />
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
               
               {/* ACTIVE PROFILE LINK */}
               <Link to="/profile" className="flex items-center space-x-3 bg-surface border border-white/5 rounded-xl px-4 py-3 text-sm text-[#fb9cf7] font-medium shadow-[0_4px_20px_-5px_rgba(207,149,252,0.15)]">
                 <UserIcon size={18} />
                 <span>Profile</span>
               </Link>
            </nav>
         </div>

         <div className="p-6">
            <button className="w-full bg-gradient-to-r from-brand to-secondary text-white font-medium text-sm py-3 rounded-xl mb-8 opacity-80 hover:opacity-100 transition-opacity">
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
      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto overflow-y-auto mb-20">
         
         {/* Hero Profile Block */}
         <div className="flex flex-col items-center justify-center mt-8 mb-16 text-center">
            {/* Glowing Avatar */}
            <div className="relative group">
               {/* Giant Glow */}
               <div className="absolute inset-0 bg-gradient-to-tr from-brand to-orange-400 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700 rounded-full"></div>
               
               <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-purple-500 via-pink-400 to-orange-400 p-1 relative z-10 shadow-2xl mx-auto group/avatar cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                 <div className="w-full h-full bg-[#141620] rounded-full overflow-hidden border-4 border-[#141620] relative">
                    <img 
                      src={user?.profile_photo_url ? `http://localhost:5000${user.profile_photo_url}` : `https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&q=80&w=400`} 
                      alt="Profile Avatar" 
                      className="w-full h-full object-cover transition-all group-hover/avatar:opacity-40"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                       <Camera size={24} className="text-white mb-1" />
                       <span className="text-[10px] font-bold text-white uppercase tracking-widest">{isUploading ? 'SYNCING...' : 'CHANGE'}</span>
                    </div>
                 </div>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
               </div>
               
               {/* Floating Streak Pill */}
               <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full shadow-[0_4px_15px_rgba(249,115,22,0.5)] px-4 py-1.5 flex items-center space-x-1.5 z-20 whitespace-nowrap">
                  <Flame size={12} className="text-white fill-current" />
                  <span className="text-xs font-bold text-white tracking-wide">7 Days Streak!</span>
               </div>
            </div>

            <h1 className="text-4xl font-extrabold text-white mt-10 mb-3 tracking-tight">
               {user?.name || 'Alex Rivera'}
            </h1>
            <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed mb-8">
               Curating digital frequencies. Minimalist enthusiast.<br/>
               Finding beauty in the neon nights.
            </p>

            <div className="flex items-center space-x-4">
               <button className="bg-white/10 hover:bg-white/20 border border-white/5 text-white font-medium px-6 py-2 rounded-full text-sm transition-colors">
                  Edit Vibe
               </button>
               <button className="bg-gradient-to-r from-[#6d4c82] to-[#996bb3] hover:from-[#855e9e] hover:to-[#a777c2] border border-white/10 text-white font-medium px-6 py-2 rounded-full text-sm transition-all shadow-lg">
                  Connect
               </button>
            </div>
         </div>

         {/* Grid Middle Section */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            
            {/* Vibe History Git-style Graph */}
            <div className="lg:col-span-2 bg-[#141620] rounded-3xl p-8 border border-white/5 shadow-xl">
               <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Vibe History</h2>
                    <p className="text-xs text-gray-500">Your emotional frequency over the last 30 days</p>
                  </div>
                  <div className="flex space-x-1.5 pt-2">
                     <span className="w-2.5 h-2.5 rounded-full bg-[#fb9cf7]"></span>
                     <span className="w-2.5 h-2.5 rounded-full bg-[#04def9]"></span>
                     <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span>
                  </div>
               </div>

               {/* Graph rendering */}
               <div>
                  {/* Days headers */}
                  <div className="grid grid-cols-7 gap-3 mb-3 px-2">
                     {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                        <div key={day} className="text-[9px] font-bold text-gray-500 text-center tracking-widest uppercase">
                           {day}
                        </div>
                     ))}
                  </div>
                  
                  {/* Calendar blocks */}
                  <div className="grid grid-cols-7 gap-3 px-2">
                     {generateGraphSpaces()}
                  </div>
               </div>
            </div>

            {/* Right Column Stats */}
            <div className="flex flex-col space-y-6">
               
               {/* Top Vibe Card */}
               <div className="bg-[#141620] rounded-3xl p-6 border border-white/5 shadow-xl flex-1 flex flex-col justify-center">
                  <h3 className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-4">Top Vibe This Week</h3>
                  <h4 className="text-4xl font-extrabold text-[#04def9] mb-2 drop-shadow-[0_0_15px_rgba(4,222,249,0.3)]">Serenity</h4>
                  <p className="text-sm text-gray-400 italic">"Floating through the digital clouds."</p>
               </div>

               {/* Friends Online Card */}
               <div className="bg-[#141620] rounded-3xl p-6 border border-white/5 shadow-xl flex-1 flex flex-col justify-between">
                  <div>
                     <h3 className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-4">Friends Online</h3>
                     <div className="flex items-center space-x-[-12px] mb-6 relative z-10">
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 rounded-full border-2 border-[#141620] object-cover relative z-30" alt="Friend" />
                        <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 rounded-full border-2 border-[#141620] object-cover relative z-20" alt="Friend" />
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 rounded-full border-2 border-[#141620] object-cover relative z-10" alt="Friend" />
                        <div className="w-10 h-10 rounded-full border-2 border-[#141620] bg-surface flex items-center justify-center text-[10px] font-bold text-white relative z-0">
                           +12
                        </div>
                     </div>
                  </div>
                  <button className="w-full bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 py-3 rounded-xl transition-colors">
                     View All Activity
                  </button>
               </div>

            </div>
         </div>

         {/* Bottom Section: Highlights gallery */}
         <div>
            <div className="flex justify-between items-end mb-6">
               <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Highlights</h2>
                  <p className="text-sm text-gray-400">Moments that defined your aesthetic</p>
               </div>
               <a href="#" className="flex items-center text-xs font-bold text-[#fb9cf7] hover:text-white transition-colors">
                  View Gallery <ArrowRight size={14} className="ml-1" />
               </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {/* 4 Graphic Cards */}
               <div className="aspect-[3/4] rounded-2xl overflow-hidden group relative cursor-pointer shadow-lg">
                  <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=500" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Abstract Lines" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               </div>
               <div className="aspect-[3/4] rounded-2xl overflow-hidden group relative cursor-pointer shadow-lg">
                  <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=500" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Neon Swirls" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               </div>
               <div className="aspect-[3/4] rounded-2xl overflow-hidden group relative cursor-pointer shadow-lg">
                  <img src="https://images.unsplash.com/photo-1505322022379-7c3353ee6291?auto=format&fit=crop&q=80&w=500" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Night lights" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               </div>
               <div className="aspect-[3/4] rounded-2xl overflow-hidden group relative cursor-pointer shadow-lg">
                  <img src="https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&q=80&w=500" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Vaporwave grid" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               </div>
            </div>
         </div>

      </main>
    </div>
  );
};

export default ProfileHistory;
