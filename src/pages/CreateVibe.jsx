import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { vibeService, spotifyService } from '../services/api';
import { 
  Sparkles, 
  LayoutGrid, 
  Users, 
  PlusCircle, 
  Compass, 
  User as UserIcon,
  HelpCircle,
  Upload, 
  Check, 
  Heart,
  Search,
  CheckCircle2,
  Circle,
  Plus,
  Send
} from 'lucide-react';

const CreateVibe = () => {
  const [selectedMood, setSelectedMood] = useState('sparkles');
  const [selectedAura, setSelectedAura] = useState('ethereal');
  const [reflection, setReflection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isCustomMood, setIsCustomMood] = useState(false);
  const [customEmoji, setCustomEmoji] = useState('🔮');
  const [customLabel, setCustomLabel] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);

  
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsSearching(true);
        try {
          const res = await spotifyService.searchTracks(searchQuery);
          setSearchResults(res.data);
        } catch (err) {
            console.error("Spotify Search failed:", err);
        } finally {
            setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const moods = [
    { id: 'sparkles', emoji: '✨' },
    { id: 'wave', emoji: '🌊' },
    { id: 'cloud', emoji: '☁️' },
    { id: 'fire', emoji: '🔥' },
    { id: 'moon', emoji: '🌙' },
    { id: 'planet', emoji: '🪐' },
  ];

  const auras = [
    { id: 'ethereal', label: 'Ethereal', color: 'from-[#c88df4] to-[#f895fb]' },
    { id: 'cyber', label: 'Cyber', color: 'from-[#04def9] to-[#088395]' },
    { id: 'sunset', label: 'Sunset', color: 'from-[#ff9d71] to-[#e85c2c]' },
    { id: 'neon', label: 'Neon', color: 'from-[#f12ca1] to-[#6d4c82]' }
  ];

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        alert('Please select an image file (jpeg, png, webp)');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async () => {
    if (!reflection.trim()) {
       alert("Please enter a reflection text inside THOUGHT STREAM");
       return;
    }
    
    setIsSubmitting(true);
    try {
       const formData = new FormData();
       formData.append('content', reflection);
       
       const finalEmoji = isCustomMood ? customEmoji : (moods.find(m => m.id === selectedMood)?.emoji || '✨');
       const finalLabel = isCustomMood ? (customLabel || 'Mystic') : (moods.find(m => m.id === selectedMood)?.label || 'Radiant');
       const moodPayload = JSON.stringify({
           name: finalLabel,
           emoji: finalEmoji,
           color: selectedAura,
           desc: 'Energy levels are peaking. Perfect for creative flow.' // Placeholder aesthetic text
       });
       formData.append('mood', moodPayload); // Sending the full visual configuration dynamically
       
       if (selectedTrack) {
         formData.append('song', JSON.stringify(selectedTrack));
       } else {
         formData.append('song', "Digital Aurora - Midnight Collective");  // Aesthetic fallback
       }
       
       if (selectedImage) {
         formData.append('image', selectedImage);
       } else if (imagePreview && imagePreview.startsWith('http')) {
         formData.append('preset_image_url', imagePreview);
       }

       const token = localStorage.getItem('token');
       const res = await fetch('https://vibe-social-frb9.onrender.com/api/posts', {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${token}`
         },
         body: formData
       });

       if (!res.ok) {
         if (res.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return;
         }
         const errorText = await res.text();
         throw new Error(errorText || `Status ${res.status}`);
       }

       navigate('/dashboard'); 
    } catch (error) {
       console.error("Failed to publish", error);
       alert("Failed to publish your vibe: " + error.message);
       setIsSubmitting(false);
    }
  };

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
               <Link to="/friends" className="flex items-center space-x-3 hover:bg-white/5 rounded-xl px-4 py-3 text-sm text-gray-400 hover:text-white transition-colors">
                 <Users size={18} />
                 <span>Friends</span>
               </Link>
               
               {/* ACTIVE CREATE LINK */}
               <Link to="/create-vibe" className="flex items-center space-x-3 bg-surface border border-white/5 rounded-xl px-4 py-3 text-sm text-[#fb9cf7] font-medium shadow-[0_4px_20px_-5px_rgba(207,149,252,0.15)]">
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
      <main className="flex-1 p-6 md:p-12 max-w-6xl mx-auto overflow-y-auto pb-32">
         
         <header className="mb-12 mt-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
               Create Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#fb9cf7] via-[#c88df4] to-[#f895fb] italic pr-2">Vibe</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-xl leading-relaxed">
               Express your current state of being. Mix, match, and curate your digital aurora to share with your community.
            </p>
         </header>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column */}
            <div className="space-y-8 flex flex-col">
               
               {/* Current Mood */}
               {/* Current Mood */}
               <div className="bg-[#141620] rounded-3xl p-8 border border-white/5 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-[10px] font-bold text-[#fb9cf7] tracking-widest uppercase">Current Mood</h3>
                     <button onClick={() => setIsCustomMood(!isCustomMood)} className="text-xs text-[#fb9cf7] hover:text-white transition-colors font-medium">
                        {isCustomMood ? 'Use Presets' : '+ Custom Mood'}
                     </button>
                  </div>
                  
                  {isCustomMood ? (
                     <div className="flex space-x-3 w-full animate-in slide-in-from-top-2 duration-300">
                        <button type="button" className="w-14 h-14 rounded-full bg-black/40 border-2 border-[#fb9cf7]/50 flex items-center justify-center text-2xl hover:bg-white/5 transition-colors relative overflow-hidden group shadow-[0_0_15px_rgba(251,156,247,0.2)]">
                           {customEmoji}
                           <input type="text" maxLength="2" className="absolute inset-0 opacity-0 cursor-pointer text-center" value={customEmoji} onChange={(e) => setCustomEmoji(e.target.value.replace(/[\w\s]/gi, '') || '🔮')} title="Type an emoji" />
                        </button>
                        <input 
                           type="text" 
                           placeholder="Name your vibe..." 
                           value={customLabel}
                           onChange={(e) => setCustomLabel(e.target.value)}
                           className="flex-1 bg-black/40 border border-[#fb9cf7]/30 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-[#fb9cf7] transition-colors shadow-inner"
                        />
                     </div>
                  ) : (
                     <div className="flex flex-wrap gap-4">
                        {moods.map((m) => (
                           <button 
                             key={m.id}
                             onClick={() => setSelectedMood(m.id)}
                             className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${selectedMood === m.id ? 'bg-[#1a1c29] border-2 border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-[#0f111a] border border-white/5 hover:border-white/20 hover:scale-105'}`}
                           >
                              {m.emoji}
                           </button>
                        ))}
                     </div>
                  )}
               </div>

               {/* Aura Palette */}
               <div className="bg-[#141620] rounded-3xl p-8 border border-white/5 shadow-xl">
                  <h3 className="text-[10px] font-bold text-[#04def9] tracking-widest uppercase mb-6">Aura Palette</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {auras.map((aura) => (
                        <div key={aura.id} onClick={() => setSelectedAura(aura.id)} className="flex flex-col cursor-pointer group">
                           <div className={`aspect-square rounded-2xl bg-gradient-to-br ${aura.color} mb-3 transition-transform duration-300 group-hover:scale-105 shadow-lg ${selectedAura === aura.id ? 'ring-2 ring-white ring-offset-4 ring-offset-[#141620]' : ''}`}></div>
                           <span className="text-[10px] font-bold text-center text-gray-300">{aura.label}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Vibe Anthem with Live Spotify API */}
               <div className="bg-[#141620] rounded-3xl p-8 border border-white/5 shadow-xl flex-1 relative overflow-visible z-50">
                  <h3 className="text-[10px] font-bold text-[#b682fa] tracking-widest uppercase mb-6 flex items-center justify-between">
                     <span>Vibe Anthem</span>
                     {isSearching && <span className="animate-pulse text-[#04def9]">Syncing frequencies...</span>}
                  </h3>
                  
                  <div className="bg-black/40 rounded-xl px-4 py-3 flex items-center mb-4 border border-white/5 relative z-50">
                     <Search size={18} className="text-gray-500 mr-3" />
                     <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Spotify tracks..." 
                        className="bg-transparent text-sm w-full outline-none text-white placeholder-gray-500 font-medium" 
                     />
                  </div>

                  {/* Dropdown Autosuggest */}
                  {searchResults.length > 0 && !selectedTrack && (
                     <div className="absolute top-[130px] left-8 right-8 bg-[#1a1c29] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200 hide-scrollbar max-h-[300px] overflow-y-auto">
                        {searchResults.map((track) => (
                           <div 
                              key={track.id} 
                              onClick={() => { setSelectedTrack(track); setSearchQuery(''); setSearchResults([]); }}
                              className="flex items-center p-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                           >
                              <img src={track.albumArt} className="w-10 h-10 rounded shadow-md object-cover" alt="Album" />
                              <div className="ml-3 flex-1 overflow-hidden">
                                 <h4 className="text-xs font-bold text-white truncate">{track.title}</h4>
                                 <p className="text-[10px] text-gray-400 truncate">{track.artist}</p>
                              </div>
                              {track.previewUrl && <Sparkles size={12} className="text-[#fb9cf7] opacity-60 ml-2" />}
                           </div>
                        ))}
                     </div>
                  )}

                  {/* Active Selected Track */}
                  {selectedTrack ? (
                     <div className="bg-gradient-to-r from-[#1a1c29] to-[#2a1b38] rounded-2xl p-4 flex items-center border border-[#c88df4]/20 transition-all cursor-pointer group shadow-lg relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>
                        <img src={selectedTrack.albumArt} className="w-14 h-14 rounded-lg shadow-xl object-cover shrink-0 z-10" alt="Selected Track" />
                        <div className="ml-4 flex-1 z-10 overflow-hidden">
                           <h4 className="text-sm font-extrabold text-white mb-0.5 truncate drop-shadow-sm">{selectedTrack.title}</h4>
                           <p className="text-[11px] text-gray-300 font-medium truncate">{selectedTrack.artist}</p>
                        </div>
                        <div className="flex flex-col items-end z-10">
                           <button onClick={(e) => { e.stopPropagation(); setSelectedTrack(null); }} className="text-[10px] text-gray-400 hover:text-white uppercase tracking-widest font-bold px-2 py-1 bg-black/30 rounded-md transition-colors">Change</button>
                        </div>
                     </div>
                  ) : (
                     <div className="bg-[#1a1c29] rounded-2xl p-4 flex items-center border border-white/5 transition-colors shadow-sm opacity-50">
                        <div className="w-14 h-14 rounded-lg bg-black/40 shrink-0 border border-white/5 flex items-center justify-center">
                           <Search size={16} className="text-gray-600" />
                        </div>
                        <div className="ml-4 flex-1">
                           <div className="h-3 w-32 bg-white/5 rounded-full mb-2"></div>
                           <div className="h-2 w-20 bg-white/5 rounded-full"></div>
                        </div>
                     </div>
                  )}
               </div>

            </div>

            {/* Right Column */}
            <div className="space-y-8 flex flex-col relative">
               
               {/* Thought Stream */}
               <div className="bg-[#141620] rounded-3xl p-8 border border-white/5 shadow-xl flex flex-col min-h-[220px]">
                  <h3 className="text-[10px] font-bold text-[#e85c2c] tracking-widest uppercase mb-6">Thought Stream</h3>
                  <textarea 
                     value={reflection}
                     onChange={(e) => setReflection(e.target.value)}
                     placeholder="What's on your mind?"
                     className="flex-1 w-full bg-black/30 rounded-2xl p-6 text-sm text-[#e2e8f0] focus:outline-none focus:ring-1 focus:ring-white/20 border border-white/5 placeholder-gray-600 resize-none font-medium leading-relaxed shadow-inner"
                  />
               </div>

               {/* Manifestations */}
               <div className="bg-[#141620] rounded-3xl p-8 border border-white/5 shadow-xl">
                  <h3 className="text-[10px] font-bold text-[#088395] tracking-widest uppercase mb-6">Manifestations</h3>
                  <div className="space-y-4 mb-6">
                     <div className="flex items-center space-x-3 cursor-pointer group">
                        <CheckCircle2 size={18} className="text-[#04def9]" />
                        <span className="text-sm text-gray-300">Daily Meditation</span>
                     </div>
                     <div className="flex items-center space-x-3 cursor-pointer group">
                        <Circle size={18} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
                        <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Finish Journaling</span>
                     </div>
                     <div className="flex items-center space-x-3 cursor-pointer group">
                        <Circle size={18} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
                        <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Connect with nature</span>
                     </div>
                  </div>
                  <button className="flex items-center text-xs font-bold text-[#04def9] hover:text-white transition-colors">
                     <Plus size={14} className="mr-1" /> Add New Goal
                  </button>
               </div>

               {/* Visual Backdrop */}
               <div className="bg-[#141620] rounded-3xl p-8 border border-white/5 shadow-xl">
                  <h3 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-6">Visual Backdrop</h3>
                  
                  {imagePreview ? (
                     <div className="relative w-full h-32 rounded-2xl overflow-hidden mb-6 border border-white/10 group shadow-md">
                        <img src={imagePreview} className="w-full h-full object-cover" alt="Selected Preview" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                           <button onClick={(e) => { e.preventDefault(); setImagePreview(null); setSelectedImage(null); }} className="text-xs bg-red-500/80 hover:bg-red-500 text-white px-3 py-1.5 rounded-full backdrop-blur font-bold">Remove</button>
                        </div>
                     </div>
                  ) : (
                     <div className="grid grid-cols-3 gap-4 mb-6">
                        <div 
                           onClick={() => setImagePreview('https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=200')} 
                           className="aspect-square rounded-2xl bg-[url('https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=200')] bg-cover opacity-80 cursor-pointer hover:opacity-100 hover:ring-2 hover:ring-white transition-all shadow-md">
                        </div>
                        <div 
                           onClick={() => setImagePreview('https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=200')}
                           className="aspect-square rounded-2xl bg-[url('https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=200')] bg-cover opacity-80 cursor-pointer hover:opacity-100 hover:ring-2 hover:ring-white transition-all shadow-md">
                        </div>
                        <div 
                           onClick={() => setImagePreview('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200')}
                           className="aspect-square rounded-2xl bg-[url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200')] bg-cover opacity-80 cursor-pointer hover:opacity-100 hover:ring-2 hover:ring-white transition-all shadow-md">
                        </div>
                     </div>
                  )}

                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                  
                  <button onClick={() => fileInputRef.current.click()} className="w-full bg-[#1a1c29] border border-white/5 hover:border-white/20 text-xs font-bold text-gray-300 hover:text-white py-4 rounded-2xl transition-all flex items-center justify-center shadow-inner">
                     <Upload size={14} className="mr-2" /> Upload Custom Image
                  </button>
               </div>

               {/* Absolute Floating Bottom Share Button */}
               <div className="pt-6 w-full flex justify-end absolute -bottom-24 right-0 pb-4">
                  <button 
                     onClick={handlePublish} 
                     disabled={isSubmitting}
                     className="bg-gradient-to-r from-[#c88df4] via-[#fb9cf7] to-[#e85c2c] text-black font-extrabold px-12 py-4 rounded-full flex items-center text-sm lg:text-base hover:scale-105 hover:shadow-[0_10px_35px_rgba(200,141,244,0.4)] transition-all disabled:opacity-70 disabled:hover:scale-100"
                  >
                     <Send size={18} className="mr-2" /> {isSubmitting ? 'Transmitting...' : 'Share My Vibe'}
                  </button>
               </div>

            </div>
         </div>

      </main>
    </div>
  );
};

export default CreateVibe;
