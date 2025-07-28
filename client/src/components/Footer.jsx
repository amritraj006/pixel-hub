import React from 'react';
import { Heart, Instagram, Twitter, Github, Mail, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center space-x-2 group transition-all duration-200">
                    <div className="text-2xl transition-transform duration-300 group-hover:scale-110">📷</div>
                    <span className="text-xl font-bold hidden sm:inline-block bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">GalleryHub</span>
                </Link>
              
            </div>
            <p className="text-gray-600">
              Discover and collect beautiful high-resolution images for your creative projects.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                whileHover={{ y: -3 }}
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-pink-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a 
                whileHover={{ y: -3 }}
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a 
                whileHover={{ y: -3 }}
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a 
                whileHover={{ y: -3 }}
                href="mailto:contact@pixelgallery.com" 
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">Explore</h3>
            <ul className="space-y-2">
              <li>
                <motion.a 
                  whileHover={{ x: 5 }}
                  href="/all-images" 
                  className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  All Images
                </motion.a>
              </li>
              <li>
                <motion.a 
                  whileHover={{ x: 5 }}
                  href="/popular" 
                  className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Popular
                </motion.a>
              </li>
              <li>
                <motion.a 
                  whileHover={{ x: 5 }}
                  href="/categories" 
                  className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Categories
                </motion.a>
              </li>
              <li>
                <motion.a 
                  whileHover={{ x: 5 }}
                  href="/liked" 
                  className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Your Favorites
                </motion.a>
              </li>
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
            <ul className="space-y-2">
              <li>
                <motion.a 
                  whileHover={{ x: 5 }}
                  href="/category/nature" 
                  className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Nature
                </motion.a>
              </li>
              <li>
                <motion.a 
                  whileHover={{ x: 5 }}
                  href="/category/architecture" 
                  className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Architecture
                </motion.a>
              </li>
              <li>
                <motion.a 
                  whileHover={{ x: 5 }}
                  href="/category/technology" 
                  className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Technology
                </motion.a>
              </li>
              <li>
                <motion.a 
                  whileHover={{ x: 5 }}
                  href="/category/people" 
                  className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  People
                </motion.a>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">Stay Updated</h3>
            <p className="text-gray-600">
              Subscribe to our newsletter for new image collections and updates.
            </p>
            <form className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all"
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-500 mb-4 md:mb-0">
            &copy; {currentYear} PixelGallery. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="/privacy" className="text-gray-500 hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-gray-500 hover:text-indigo-600 transition-colors">Terms of Service</a>
            <a href="/cookies" className="text-gray-500 hover:text-indigo-600 transition-colors">Cookies</a>
          </div>
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -3 }}
            className="mt-4 md:mt-0 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Back to top
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;