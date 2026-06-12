import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  // Scroll listener to toggle translucent background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location]);

  // Dropdown Categories
  const menuGroups = [
    {
      label: 'Directory',
      items: [
        { name: 'Office Bearers', path: '/bearers' },
        { name: 'Committees', path: '/committees' }
      ]
    },
    {
      label: 'Programs',
      items: [
        { name: 'Activities Timeline', path: '/activities' },
        { name: 'Events & Conferences', path: '/events' },
        { name: 'Professional Development', path: '/pd' }
      ]
    },
    {
      label: 'Portals',
      items: [
        { name: 'Join Membership', path: '/membership' },
        { name: 'Awards Nominations', path: '/awards' },
        { name: 'Publications & Outreach', path: '/publications' }
      ]
    },
    {
      label: 'Media Centre',
      items: [
        { name: 'News', path: '/media?tab=news' },
        { name: 'Photo', path: '/media?tab=photos' },
        { name: 'Video', path: '/media?tab=videos' }
      ]
    }
  ];

  const toggleDropdown = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  const isActive = (path) => {
    const [pathName, queryStr] = path.split('?');
    if (queryStr) {
      return location.pathname === pathName && location.search === `?${queryStr}`;
    }
    return location.pathname === pathName;
  };
  
  const isGroupActive = (group) => {
    return group.items.some(item => {
      const [pathName] = item.path.split('?');
      return location.pathname === pathName;
    });
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-dark/80 backdrop-blur-md border-b border-white/5 py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src={logoImg} 
            alt="UMA Logo" 
            className="w-14 h-14 rounded-xl object-cover shadow-md shadow-brand-primary/20 group-hover:scale-105 transition-transform" 
          />
          <span className="font-semibold text-lg tracking-wider bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent group-hover:text-white transition-colors">
            UDUPI MANAGEMENT ASSOCIATION
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${
              isActive('/') ? 'text-brand-primary' : 'text-gray-400 hover:text-white'
            }`}
          >
            Home
          </Link>
          
          <Link 
            to="/about" 
            className={`text-sm font-medium transition-colors ${
              isActive('/about') ? 'text-brand-primary' : 'text-gray-400 hover:text-white'
            }`}
          >
            About
          </Link>

          {/* Render Groups with Dropdowns */}
          {menuGroups.map((group, index) => (
            <div 
              key={index} 
              className="relative group/dropdown"
              onMouseEnter={() => setActiveDropdown(index)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`flex items-center gap-1 text-sm font-medium transition-colors py-2 ${
                isGroupActive(group) ? 'text-brand-primary' : 'text-gray-400 hover:text-white'
              }`}>
                {group.label}
                <ChevronDown size={14} className="group-hover/dropdown:rotate-180 transition-transform" />
              </button>

              <AnimatePresence>
                {activeDropdown === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-56 bg-dark-card border border-white/5 rounded-xl shadow-xl shadow-black/40 p-2 mt-1 backdrop-blur-glass"
                  >
                    {group.items.map((item, itemIndex) => (
                      <Link
                        key={itemIndex}
                        to={item.path}
                        className={`block px-4 py-2.5 rounded-lg text-sm transition-colors ${
                          isActive(item.path)
                            ? 'bg-brand-primary/10 text-white font-medium'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}


          <Link 
            to="/contact" 
            className={`text-sm font-medium transition-colors ${
              isActive('/contact') ? 'text-brand-primary' : 'text-gray-400 hover:text-white'
            }`}
          >
            Contact
          </Link>
        </div>

        {/* Portal CTAs */}
        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated && (
            <div className="flex items-center gap-3">
              {user?.role === 'admin' ? (
                <Link to="/admin/dashboard" className="btn-secondary px-4 py-2 rounded-xl text-sm flex items-center gap-1.5 border-brand-primary/20 text-brand-primary hover:border-brand-primary/40">
                  <ShieldAlert size={15} />
                  Dashboard
                </Link>
              ) : (
                <span className="text-gray-400 text-sm flex items-center gap-1.5">
                  <User size={15} />
                  {user?.username}
                </span>
              )}
              <button onClick={logout} className="text-xs text-gray-500 hover:text-brand-primary transition-colors">
                Log Out
              </button>
            </div>
          )}
          <Link to="/membership" className="btn-primary px-4 py-2 rounded-xl text-sm font-medium">
            Join UMA
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-50 w-72 bg-dark-card border-l border-white/5 p-6 shadow-2xl backdrop-blur-glass flex flex-col justify-between"
          >
            <div className="flex flex-col gap-6 overflow-y-auto pr-2">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="font-bold text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text">Navigation</span>
                <button onClick={() => setIsOpen(false)} className="p-1 text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <Link to="/" className={`text-base font-medium ${isActive('/') ? 'text-brand-primary' : 'text-gray-300'}`}>
                  Home
                </Link>
                <Link to="/about" className={`text-base font-medium ${isActive('/about') ? 'text-brand-primary' : 'text-gray-300'}`}>
                  About
                </Link>

                {/* Mobile Dropdowns */}
                {menuGroups.map((group, index) => (
                  <div key={index} className="flex flex-col gap-1.5">
                    <button 
                      onClick={() => toggleDropdown(index)} 
                      className={`flex justify-between items-center text-base font-medium text-left ${
                        isGroupActive(group) ? 'text-brand-primary' : 'text-gray-300'
                      }`}
                    >
                      {group.label}
                      <ChevronDown size={16} className={`transition-transform duration-200 ${
                        activeDropdown === index ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    {activeDropdown === index && (
                      <div className="flex flex-col gap-2 pl-4 border-l border-white/5 py-1">
                        {group.items.map((item, itemIndex) => (
                          <Link 
                            key={itemIndex} 
                            to={item.path} 
                            className={`text-sm py-1 transition-colors ${
                              isActive(item.path) ? 'text-brand-primary' : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <Link to="/contact" className={`text-base font-medium ${isActive('/contact') ? 'text-brand-primary' : 'text-gray-300'}`}>
                  Contact
                </Link>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex flex-col gap-3 pt-6 border-t border-white/5">
              {isAuthenticated && (
                <>
                  <Link 
                    to={user?.role === 'admin' ? '/admin/dashboard' : '/'} 
                    className="btn-secondary py-2.5 rounded-xl text-center text-sm border-white/5 hover:bg-white/5"
                  >
                    {user?.role === 'admin' ? 'Admin Dashboard' : `Signed in as ${user?.username}`}
                  </Link>
                  <button onClick={logout} className="text-sm text-gray-500 hover:text-brand-primary py-1 text-center">
                    Log Out
                  </button>
                </>
              )}
              <Link to="/membership" className="btn-primary py-2.5 rounded-xl text-center text-sm font-medium">
                Join UMA
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
