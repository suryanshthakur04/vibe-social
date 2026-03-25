import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { User, LogOut } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isTransparent = location.pathname === '/';

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isTransparent ? "bg-transparent pt-6" : "bg-background/80 backdrop-blur-md border-b border-border/50 py-4"
    )}>
      <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          Vibe<span className="text-brand">.</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Overview</Link>
          <Link to="/trending" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Trending</Link>
          <Link to="/community" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Community</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/friends" className="text-sm font-medium text-gray-300 hover:text-white">Feed</Link>
              <Link to="/dashboard" className="text-sm font-medium text-gray-300 hover:text-white">Dashboard</Link>
              <Link to="/profile" className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-brand to-secondary overflow-hidden">
                <User size={16} className="text-gray-900" />
              </Link>
              <button onClick={logout} className="text-gray-400 hover:text-white">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white hidden md:block">
                Login
              </Link>
              <Link to="/login">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
