import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    let result;
    if (isLogin) {
      result = await login({ email: email.trim(), password });
    } else {
      result = await register({ name: name.trim(), email: email.trim(), password });
    }
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setIsLoading(false);
      alert(isLogin ? `Login failed: ${result.message}` : `Registration failed: ${result.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 pt-16 -mt-20">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 blur-[120px] rounded-full pointer-events-none" />
      
      <Card className="w-full max-w-md p-8 relative z-10 border-white/10 shadow-2xl bg-surface/60 backdrop-blur-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Vibe<span className="text-brand">.</span></h1>
          <p className="text-gray-400 text-sm">{isLogin ? 'Welcome back' : 'Create your aura'}</p>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{isLogin ? 'Login_Session_V1' : 'Registration_V1'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Display Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors text-sm"
                placeholder="Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors text-sm"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-medium text-gray-400">Password</label>
              {isLogin && <a href="#" className="text-xs text-brand hover:text-brand-light">Forgot?</a>}
            </div>
            <input 
              type="password" 
              required
              className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="pt-2">
            <Button type="submit" className="w-full py-6 text-base shadow-[0_0_20px_-5px_rgba(207,149,252,0.4)]" disabled={isLoading}>
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </div>
        </form>
        
        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface/60 px-2 text-gray-500 rounded backdrop-blur-md">Or continue with</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button className="flex items-center justify-center py-2.5 border border-border rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">
            Google
          </button>
          <button className="flex items-center justify-center py-2.5 border border-border rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">
            Apple
          </button>
        </div>
      </Card>
      
      <div className="absolute bottom-10 text-center w-full">
        <p className="text-sm text-gray-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"} {' '}
          <span 
            onClick={() => setIsLogin(!isLogin)}
            className="text-brand font-medium hover:underline cursor-pointer"
          >
            {isLogin ? "Start your Vibe" : "Log in instead"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
