import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, Heart, Upload, LayoutGrid, Sparkles,
  Image as ImageIcon, Home, ChevronRight, LogIn
} from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const [likeCount, setLikeCount] = useState(0);

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Handle scroll state for navbar background blur
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch like count from backend
  useEffect(() => {
    const fetchLikeCount = () => {
      if (user?.primaryEmailAddress?.emailAddress) {
        const email = user.primaryEmailAddress.emailAddress;
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/likes/like-count?user_email=${email}`)
          .then(res => res.json())
          .then(data => setLikeCount(data.count))
          .catch(err => console.error('Failed to fetch like count:', err));
      }
    };

    fetchLikeCount();

    const handleLikeUpdate = () => fetchLikeCount();
    window.addEventListener('likeUpdated', handleLikeUpdate);
    return () => window.removeEventListener('likeUpdated', handleLikeUpdate);
  }, [user]);

  const navLinks = [
    { path: '/', name: 'Home', icon: Home },
    { path: '/all-images', name: 'Explore', icon: LayoutGrid },
    { path: '/post', name: 'Posts', icon: ImageIcon },
    { path: '/generator', name: 'Generator', icon: Sparkles },
  ];

  const userActions = [
    { path: '/liked', name: 'Favorites', icon: Heart, count: likeCount },
    { path: '/upload', name: 'Upload', icon: Upload },
    { path: '/my-dashboard', name: 'Dashboard', icon: LayoutGrid },
  ];

  const handleProtectedRoute = (path) => {
    if (!user) {
      openSignIn();
    } else {
      navigate(path);
      setIsOpen(false);
      window.scrollTo(0, 0);
    }
  };

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-zinc-950/70 backdrop-blur-xl border-b border-white/10 shadow-lg' : 'bg-transparent border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2 group transition-all duration-300">
                <div className="relative flex items-center justify-center w-10 h-10 bg-indigo-500/10 rounded-xl border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all">
                  <motion.div whileHover={{ rotate: 15, scale: 1.1 }} className="text-xl">
                    📷
                  </motion.div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent tracking-tight">
                  PixelHub
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 glass rounded-full px-2 py-1.5 shadow-none border-white/5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 group relative ${
                      active
                        ? 'text-white'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-white/10 rounded-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon className="w-4 h-4 mr-2 relative z-10" />
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop: User Actions + Auth */}
            <div className="hidden md:flex items-center space-x-3">
              {user && userActions.map((action) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.path}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleProtectedRoute(action.path)}
                    className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all duration-200 relative group shadow-sm"
                    title={action.name}
                  >
                    <div className="relative">
                      <Icon className="w-4 h-4" />
                      {action.count > 0 && (
                        <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-[9px] font-bold h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full shadow-lg border border-zinc-900">
                          {action.count}
                        </span>
                      )}
                    </div>
                    {/* Tooltip */}
                    <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-zinc-100 text-xs rounded-md px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-xl border border-zinc-700 pointer-events-none">
                      {action.name}
                    </span>
                  </motion.button>
                );
              })}

              {!user ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openSignIn}
                  className="bg-indigo-600 hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-500/20 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 shadow-lg shadow-indigo-500/25 flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </motion.button>
              ) : (
                <div className="ml-2 pl-4 border-l border-white/10 relative group flex items-center">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: 'w-10 h-10 ring-2 ring-zinc-800 hover:ring-indigo-500 transition-all duration-200',
                        userButtonPopoverCard: 'bg-zinc-900 border border-zinc-800 shadow-2xl rounded-2xl text-white',
                        userPreviewMainIdentifier: 'text-zinc-100',
                        userPreviewSecondaryIdentifier: 'text-zinc-400',
                      },
                    }}
                    afterSignOutUrl="/"
                  />
                </div>
              )}
            </div>

            {/* Mobile: Hamburger Icon only */}
            <div className="md:hidden flex items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-300 hover:text-white transition-all glass"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </motion.button>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] md:hidden"
            />

            {/* Sidebar Panel */}
            <motion.aside
              key="sidebar"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-zinc-950 border-l border-zinc-800 shadow-2xl z-[70] md:hidden flex flex-col overflow-y-auto"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-xl border border-indigo-500/20 flex items-center justify-center">
                    <span className="text-xl">📷</span>
                  </div>
                  <span className="text-xl font-bold text-zinc-100 tracking-tight">PixelHub</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Sidebar Auth / User Profile Header */}
              {user ? (
                <div className="px-6 py-6 border-b border-zinc-800/50 bg-gradient-to-b from-zinc-900/50 to-transparent">
                  <div className="flex items-center gap-4">
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonAvatarBox: 'w-12 h-12 ring-2 ring-indigo-500/50',
                          userButtonPopoverCard: 'shadow-2xl rounded-2xl border border-zinc-800 bg-zinc-900',
                        },
                      }}
                      afterSignOutUrl="/"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-base font-semibold text-zinc-100 truncate">
                        {user.fullName || user.firstName || 'User'}
                      </span>
                      <span className="text-sm text-zinc-500 truncate">
                        {user.primaryEmailAddress?.emailAddress}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-6 py-6 border-b border-zinc-800/50 bg-gradient-to-b from-zinc-900/50 to-transparent">
                  <button
                    onClick={() => { setIsOpen(false); openSignIn(); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-500/25"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In to PixelHub
                  </button>
                </div>
              )}

              {/* Navigation Links */}
              <div className="flex-1 px-4 py-6">
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 px-4 mb-4">
                  Navigation
                </p>
                <div className="space-y-1.5">
                  {navLinks.map((link, i) => {
                    const Icon = link.icon;
                    const active = isActive(link.path);
                    return (
                      <motion.div
                        key={link.path}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.05 + 0.1 }}
                      >
                        <Link
                          to={link.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                            active
                              ? 'bg-zinc-800/80 text-white shadow-sm border border-zinc-700/50'
                              : 'text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200 border border-transparent'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 ${active ? 'text-indigo-400' : ''}`} />
                            {link.name}
                          </span>
                          {active && <ChevronRight className="w-4 h-4 text-indigo-400" />}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* User Actions Section */}
                {user && (
                  <>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 px-4 mt-8 mb-4">
                      My Account
                    </p>
                    <div className="space-y-1.5">
                      {userActions.map((action, i) => {
                        const Icon = action.icon;
                        const active = isActive(action.path);
                        return (
                          <motion.div
                            key={action.path}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: (navLinks.length + i) * 0.05 + 0.1 }}
                          >
                            <button
                              onClick={() => handleProtectedRoute(action.path)}
                              className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                active
                                  ? 'bg-zinc-800/80 text-white shadow-sm border border-zinc-700/50'
                                  : 'text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200 border border-transparent'
                              }`}
                            >
                              <span className="flex items-center gap-3">
                                <Icon className={`w-5 h-5 ${active ? 'text-indigo-400' : ''}`} />
                                {action.name}
                              </span>
                              {action.count > 0 && (
                                <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                                  {action.count}
                                </span>
                              )}
                              {active && !action.count && <ChevronRight className="w-4 h-4 text-indigo-400" />}
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Sidebar Footer */}
              <div className="px-6 py-6 border-t border-zinc-800/50 mt-auto">
                <p className="text-xs text-zinc-600 text-center font-medium">
                  © {new Date().getFullYear()} PixelHub
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;