import React, { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Users, Calendar, Award, UserCheck, 
  Layers, BookOpen, Image, Newspaper, Mail, GraduationCap, 
  Settings, LogOut, Menu, X, ShieldAlert 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, isAdmin, user, logout, loading } = useAuth();

  // If loading authentication state, show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-t-2 border-brand-primary animate-spin" />
          <span className="text-gray-400 text-sm tracking-widest font-mono">AUTHENTICATING...</span>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated or not an admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // Sidebar Menu Items
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Memberships', path: '/admin/members', icon: Users },
    { name: 'Events & Conf.', path: '/admin/events', icon: Calendar },
    { name: 'Award Nom.', path: '/admin/awards', icon: Award },
    { name: 'Office Bearers', path: '/admin/bearers', icon: UserCheck },
    { name: 'Committees', path: '/admin/committees', icon: Layers },
    { name: 'Publications', path: '/admin/publications', icon: BookOpen },
    { name: 'Media Gallery', path: '/admin/gallery', icon: Image },
    { name: 'News & Press', path: '/admin/news', icon: Newspaper },
    { name: 'Contacts Inbox', path: '/admin/contacts', icon: Mail },
    { name: 'Training Progs', path: '/admin/training', icon: GraduationCap },
    { name: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-dark text-dark-text flex relative overflow-hidden">
      {/* Glow decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-64 w-96 h-96 rounded-full bg-brand-secondary/5 blur-3xl pointer-events-none" />

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-dark-card border-r border-white/5 p-5 flex flex-col justify-between backdrop-blur-glass transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col gap-6 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <Link to="/" className="flex items-center gap-2.5">
              <img 
                src={logoImg} 
                alt="UMA Logo" 
                className="w-11 h-11 rounded-lg object-cover shadow-sm" 
              />
              <span className="font-bold text-xs tracking-widest text-white uppercase">
                UMA Admin Portal
              </span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* User info */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-brand-primary/25 flex items-center justify-center text-brand-primary">
              <ShieldAlert size={16} />
            </div>
            <div className="flex flex-col truncate">
              <span className="text-sm font-semibold text-white truncate">{user?.username}</span>
              <span className="text-xxs text-gray-500 font-mono tracking-wider">SYSTEM ADMINISTRATOR</span>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-brand-primary/10 border-l-2 border-brand-primary text-white shadow-md shadow-brand-primary/5'
                      : 'text-gray-400 border-l-2 border-transparent hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={18} className={isActive(item.path) ? 'text-brand-primary' : 'text-gray-400'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-white/5">
          <button 
            onClick={logout} 
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 px-6 flex justify-between items-center bg-dark/25 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <h2 className="font-semibold text-lg text-white">
              {menuItems.find(item => isActive(item.path))?.name || 'Administrator'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xs text-gray-400 hover:text-brand-primary transition-colors border border-white/10 px-3 py-1.5 rounded-lg bg-white/5">
              View Site
            </Link>
            <span className="text-xs text-gray-500 font-mono">v1.0.0</span>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-grow p-6 md:p-8 relative z-10 max-w-7xl w-full mx-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
