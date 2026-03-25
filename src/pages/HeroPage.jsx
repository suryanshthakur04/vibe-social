import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Play, Activity, Music, Share2, Shield, Users } from 'lucide-react';

const HeroPage = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand/20 blur-[120px] rounded-full point-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-secondary font-medium text-sm mb-6 tracking-wider">
              <span className="w-8 h-px bg-secondary"></span>
              <span>THE FUTURE OF CONNECTION</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Vibe: Your <br />
              <span className="text-gradient">Digital Aurora</span>
            </h1>
            <p className="text-lg text-gray-400 mb-10 max-w-lg leading-relaxed">
              Capture your mood, share your thoughts, and sync your music. 
              A daily space for emotional connection and self-expression.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto shadow-[0_0_20px_-5px_rgba(207,149,252,0.4)]">Go to Dashboard</Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button size="lg" className="w-full sm:w-auto shadow-[0_0_20px_-5px_rgba(207,149,252,0.4)]">Start Your Vibe</Button>
                </Link>
              )}
              <Link to="/community">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto text-white">Explore Community</Button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            {/* Dashboard Mockup Card */}
            <Card className="p-8 border-brand/30 shadow-[0_0_50px_-12px_rgba(207,149,252,0.3)] bg-surface/80">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-white font-medium">Daily Vibe Board</h3>
                  <p className="text-xs text-gray-400">Wednesday, Oct 24</p>
                </div>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 rounded-full bg-brand/20"></div>
                  <div className="w-8 h-8 rounded-full bg-secondary/20 -ml-4"></div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-2 text-xs text-gray-400 mb-2">
                    <span className="text-brand">●</span> Current Mood
                  </div>
                  <h4 className="text-xl text-white font-semibold">Ethereal & Focused</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-surface p-4 rounded-xl border border-white/5 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <QuoteIcon className="text-brand/50 w-6 h-6 mb-2" />
                      <p className="text-sm text-gray-300 italic">"The light is not a reflection of me, but of my essence..."</p>
                   </div>
                   <div className="bg-surface rounded-xl border border-white/5 relative overflow-hidden flex flex-col">
                      <div className="h-20 bg-gradient-to-r from-blue-900 to-emerald-900 w-full"></div>
                      <div className="p-3 flex items-center justify-between flex-1">
                        <div>
                          <p className="text-xs text-brand font-medium">NOW PLAYING</p>
                          <p className="text-sm text-white truncate w-24">Midnight City</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                           <Play size={14} className="text-white ml-0.5" />
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 bg-surface/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Setting Your Vibe</h2>
          <p className="text-gray-400 mb-16 max-w-2xl mx-auto">Three simple steps to transform your digital presence into an ethereal reflection of your soul.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
               number="1. Select Mood" 
               desc="Choose your current emotional frequency. Our engine generates a color palette unique to you."
               icon={<Activity size={24} className="text-brand" />}
            />
            <StepCard 
               number="2. Express Yourself" 
               desc="Add a thought, an image, or sync your current track. Build your board as a sensory extension of yourself."
               icon={<Music size={24} className="text-secondary" />}
            />
            <StepCard 
               number="3. Share the Vibe" 
               desc="Publish to the community, or keep it private. Connect with others vibrating at your wavelength."
               icon={<Share2 size={24} className="text-accent" />}
            />
          </div>
        </div>
      </section>
      
      {/* Vibe Aura Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div className="flex justify-center relative">
             <div className="w-64 h-64 rounded-full border border-gray-700 flex items-center justify-center relative z-10 shadow-[0_0_100px_-20px_rgba(0,255,242,0.2)]">
               <div className="text-center">
                 <div className="text-5xl font-bold text-white mb-2">24</div>
                 <div className="text-xs text-gray-400 tracking-widest uppercase">Day Streak</div>
                 <div className="flex justify-center space-x-1 mt-3">
                   <span className="w-2 h-2 rounded-full bg-brand"></span>
                   <span className="w-2 h-2 rounded-full bg-secondary"></span>
                   <span className="w-2 h-2 rounded-full bg-accent"></span>
                 </div>
               </div>
               
               {/* Decorative Ring */}
               <svg className="absolute inset-0 w-full h-full -rotate-90">
                 <circle cx="128" cy="128" r="126" stroke="url(#gradient)" strokeWidth="4" fill="none" strokeDasharray="790" strokeDashoffset="200" className="opacity-80" />
                 <defs>
                   <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="#cf95fc" />
                     <stop offset="100%" stopColor="#00fff2" />
                   </linearGradient>
                 </defs>
               </svg>
             </div>
           </div>
           
           <div>
              <div className="text-xs font-semibold tracking-wider text-brand mb-4 bg-brand/10 inline-block px-3 py-1 rounded-full">GAMIFIED IDENTITY</div>
              <h2 className="text-4xl font-bold mb-6">Your Digital <br/><span className="text-secondary">Vibe Aura</span></h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Every day you log your vibe, your Aura grows stronger. Unlock unique color profiles and prestige badges as you maintain your streak and deepen your self-expression.
              </p>
              
              <ul className="space-y-4">
                <FeatureItem text="Dynamic color shifts based on consistency" />
                <FeatureItem text="Unlockable 'Prism' icons for profile flair" />
                <FeatureItem text="Global leaderboard for atmospheric expression" />
              </ul>
           </div>
        </div>
      </section>

      {/* Synchronized Expression Box */}
      <section className="py-24 max-w-7xl mx-auto px-6 text-center">
         <h2 className="text-3xl font-bold mb-4">Synchronized Expression</h2>
         <p className="text-gray-400 mb-16">More than a journal. Vibe is a sensory extension of your digital self.</p>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureBox icon={<Activity className="text-brand"/>} title="Mood Palettes" />
            <FeatureBox icon={<Share2 className="text-secondary"/>} title="Realtime Presence" />
            <FeatureBox icon={<Music className="text-accent"/>} title="Music Sync" />
            <FeatureBox icon={<Shield className="text-brand-light"/>} title="Safe Space" />
         </div>
      </section>
    </div>
  );
};

// Helper Components
const StepCard = ({ number, desc, icon }) => (
  <Card className="p-8 text-left h-full border-border/50 hover:bg-surface-hover/50 transition-colors">
     <div className="w-12 h-12 rounded-2xl bg-surface border border-white/5 flex items-center justify-center mb-6 shadow-lg shadow-black/20">
       {icon}
     </div>
     <h3 className="text-xl font-semibold text-white mb-3">{number}</h3>
     <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </Card>
);

const FeatureItem = ({ text }) => (
  <li className="flex items-center space-x-3 text-gray-300">
    <div className="w-5 h-5 rounded-full bg-brand/20 flex items-center justify-center border border-brand/30 flex-shrink-0">
      <svg className="w-3 h-3 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <span>{text}</span>
  </li>
);

const FeatureBox = ({ icon, title }) => (
  <Card className="p-6 flex flex-col items-center justify-center text-center gap-4 hover:border-white/20 cursor-pointer">
    <div className="p-3 bg-surface rounded-full border border-white/5">
      {icon}
    </div>
    <span className="font-medium text-white">{title}</span>
  </Card>
);

const QuoteIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
);

export default HeroPage;
