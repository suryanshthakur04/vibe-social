import { Link } from 'react-router-dom';
import { Twitter, Instagram, Youtube } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold tracking-tight mb-4 inline-block">
              Vibe<span className="text-brand">.</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-xs mb-6">
              The atmospheric journaling platform designed to turn your mood into an immersive digital legacy. 
              Find emotional connection through expression.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Youtube size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/moods" className="hover:text-brand transition-colors">Moods</Link></li>
              <li><Link to="/trending" className="hover:text-brand transition-colors">Trending</Link></li>
              <li><Link to="/community" className="hover:text-brand transition-colors">Community</Link></li>
              <li><Link to="/personal" className="hover:text-brand transition-colors">Personal Vibes</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-brand transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-brand transition-colors">Careers</Link></li>
              <li><Link to="/privacy" className="hover:text-brand transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-brand transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© 2026 Vibe Labs. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span>Designed for the Digital Aurora.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
