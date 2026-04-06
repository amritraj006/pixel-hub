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
      <nav className="fixed w-full bg-white/90 backdrop-blur-lg z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2 group transition-all duration-300">
                <motion.div whileHover={{ rotate: 15, scale: 1.1 }} className="text-2xl">
                  📷
                </motion.div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">
                  PixelHub
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 group ${
                      isActive(link.path)
                        ? 'text-gray-900 bg-gray-100'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    <span className="group-hover:translate-x-0.5 transition-transform">{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop: User Actions + Auth */}
            <div className="hidden md:flex items-center space-x-2">
              {user && userActions.map((action) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.path}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleProtectedRoute(action.path)}
                    className="p-2.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-all duration-200 relative group"
                    title={action.name}
                  >
                    <div className="relative">
                      <Icon className="w-5 h-5" />
                      {action.count > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {action.count}
                        </span>
                      )}
                    </div>
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md">
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
                  className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Sign In
                </motion.button>
              ) : (
                <div className="ml-1 relative group">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: 'w-9 h-9 ring-2 ring-gray-100 hover:ring-gray-300 transition-all duration-200',
                        userButtonPopoverCard: 'shadow-2xl rounded-2xl border border-gray-100',
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
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-all duration-200"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
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
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
            />

            {/* Sidebar Panel */}
            <motion.aside
              key="sidebar"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-[80vw] max-w-xs bg-white shadow-2xl z-[70] md:hidden flex flex-col overflow-y-auto"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">📷</span>
                  <span className="text-lg font-bold text-gray-900 tracking-tight">PixelHub</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-all"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Clerk User Profile Section */}
              {user ? (
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: 'w-10 h-10 ring-2 ring-indigo-100',
                        userButtonPopoverCard: 'shadow-2xl rounded-2xl border border-gray-100',
                      },
                    }}
                    afterSignOutUrl="/"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {user.fullName || user.firstName || 'User'}
                    </span>
                    <span className="text-xs text-gray-500 truncate">
                      {user.primaryEmailAddress?.emailAddress}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="px-5 py-4 border-b border-gray-100">
                  <button
                    onClick={() => { setIsOpen(false); openSignIn(); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gray-900 hover:bg-black transition-all duration-200 shadow-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In to PixelHub
                  </button>
                </div>
              )}

              {/* Nav Links */}
              <div className="flex-1 px-3 py-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 mb-2">
                  Navigation
                </p>
                <div className="space-y-1">
                  {navLinks.map((link, i) => {
                    const Icon = link.icon;
                    const active = isActive(link.path);
                    return (
                      <motion.div
                        key={link.path}
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          to={link.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            active
                              ? 'bg-gray-900 text-white shadow-sm'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <Icon className="w-5 h-5" />
                            {link.name}
                          </span>
                          {active && <ChevronRight className="w-4 h-4 opacity-60" />}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* User Actions */}
                {user && (
                  <>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 mt-6 mb-2">
                      My Account
                    </p>
                    <div className="space-y-1">
                      {userActions.map((action, i) => {
                        const Icon = action.icon;
                        const active = isActive(action.path);
                        return (
                          <motion.div
                            key={action.path}
                            initial={{ x: 30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: (navLinks.length + i) * 0.05 }}
                          >
                            <button
                              onClick={() => handleProtectedRoute(action.path)}
                              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                active
                                  ? 'bg-gray-900 text-white shadow-sm'
                                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                              }`}
                            >
                              <span className="flex items-center gap-3">
                                <Icon className="w-5 h-5" />
                                {action.name}
                              </span>
                              {action.count > 0 && (
                                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  {action.count}
                                </span>
                              )}
                              {active && !action.count && <ChevronRight className="w-4 h-4 opacity-60" />}
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Sidebar Footer */}
              <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-400 text-center">
                  © {new Date().getFullYear()} PixelHub · All rights reserved
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