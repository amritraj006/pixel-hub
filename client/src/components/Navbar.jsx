import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, Upload, LayoutGrid, Sparkles, Image as ImageIcon, Home } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const [likeCount, setLikeCount] = useState(0);

  // Fetch like count from backend
  useEffect(() => {
    const fetchLikeCount = () => {
      if (user?.primaryEmailAddress?.emailAddress) {
        const email = user.primaryEmailAddress.emailAddress;
        fetch(`http://localhost:8000/api/likes/like-count?user_email=${email}`)
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
    { path: "/", name: "Home", icon: <Home className="w-4 h-4 mr-2" /> },
    { path: "/all-images", name: "Explore", icon: <LayoutGrid className="w-4 h-4 mr-2" /> },
    {path: "/post", name: "Posts", icon: <ImageIcon className='w-4 h-4 mr-2' />},
    { path: "/generator", name: "Generator", icon: <Sparkles className="w-4 h-4 mr-2" /> },
    
  ];

  const userActions = [
    { path: "/liked", name: "Favorites", icon: Heart, count: likeCount },
    { path: "/upload", name: "Upload", icon: Upload },
    { path: "/my-dashboard", name: "Dashboard", icon: LayoutGrid }
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

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-lg z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 group transition-all duration-300"
            >
              <motion.div 
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="text-2xl"
              >
                📷
              </motion.div>
              <span className="text-xl font-bold hidden sm:inline-block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                GalleryHub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-all duration-200 group"
              >
                {link.icon}
                <span className="group-hover:translate-x-0.5 transition-transform">
                  {link.name}
                </span>
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {/* User Actions */}
            {user && userActions.map((action) => (
              <motion.button
                key={action.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleProtectedRoute(action.path)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-indigo-600 transition-all duration-200 relative group"
                title={action.name}
              >
                <div className="relative">
                  <action.icon className="w-5 h-5" />
                  {action.count > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-xs px-1.5 rounded-full">
                      {action.count}
                    </span>
                  )}
                </div>
                <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {action.name}
                </span>
              </motion.button>
            ))}

            {/* Auth Button */}
            {!user ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={openSignIn}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Sign In
              </motion.button>
            ) : (
              <div className="ml-1 relative group">
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8 ring-2 ring-indigo-500/30 hover:ring-indigo-500/50 transition-all duration-200",
                      userButtonPopoverCard: "shadow-lg rounded-xl border border-gray-100",
                    }
                  }}
                  afterSignOutUrl="/"
                />
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-indigo-600 transition-all duration-200"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-100 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <motion.div
                  key={link.path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50/50 transition-all duration-200 mx-2"
                  >
                    {link.icon}
                    <span className="ml-3">{link.name}</span>
                  </Link>
                </motion.div>
              ))}

              {user && userActions.map((action, index) => (
                <motion.div
                  key={action.path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <button
                    onClick={() => { setIsOpen(false); handleProtectedRoute(action.path); }}
                    className="flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50/50 transition-all duration-200 mx-2"
                  >
                    <action.icon className="w-5 h-5" />
                    <span className="ml-3">{action.name}</span>
                    {action.count > 0 && (
                      <span className="ml-auto bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                        {action.count}
                      </span>
                    )}
                  </button>
                </motion.div>
              ))}

              {!user && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.15 }}
                  className="mx-2 mt-2"
                >
                  <button
                    onClick={() => { setIsOpen(false); openSignIn(); }}
                    className="w-full px-4 py-3 rounded-lg text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Sign In
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;