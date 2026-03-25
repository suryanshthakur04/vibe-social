import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import HeroPage from './pages/HeroPage';
import LoginPage from './pages/LoginPage';
import DailyVibeBoard from './pages/DailyVibeBoard';
import ProfileHistory from './pages/ProfileHistory';
import FriendsFeed from './pages/FriendsFeed';
import CreateVibe from './pages/CreateVibe';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

const LayoutContainer = ({ children, hideFooter = false }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow pt-20">
      {children}
    </main>
    {!hideFooter && <Footer />}
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutContainer><HeroPage /></LayoutContainer>} />
      <Route path="/login" element={<LayoutContainer hideFooter><LoginPage /></LayoutContainer>} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <LayoutContainer hideFooter>
            <DailyVibeBoard />
          </LayoutContainer>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <LayoutContainer hideFooter>
            <ProfileHistory />
          </LayoutContainer>
        </ProtectedRoute>
      } />
      
      <Route path="/friends" element={
        <ProtectedRoute>
          <LayoutContainer hideFooter>
            <FriendsFeed />
          </LayoutContainer>
        </ProtectedRoute>
      } />
      
      <Route path="/create-vibe" element={
        <ProtectedRoute>
          <LayoutContainer hideFooter>
            <CreateVibe />
          </LayoutContainer>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
