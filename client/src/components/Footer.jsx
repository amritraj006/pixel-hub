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
    <footer className="bg-black/40 backdrop-blur-md border-t border-white/5 mt-24 relative overflow-hidden">
      {/* Decorative top gradient */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center space-x-3 group transition-all duration-300">
                <div className="w-10 h-10 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition-all">
                  <div className="text-xl transition-transform duration-300 group-hover:scale-110">📷</div>
                </div>
                <span className="text-xl font-bold hidden sm:inline-block bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent tracking-tight">
                  PixelHub
                </span>
              </Link>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Discover and collect beautiful high-resolution images for your creative projects in a premium dark experience.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: Instagram, href: "https://instagram.com", hoverClass: "hover:text-pink-500 hover:bg-pink-500/10 hover:border-pink-500/30" },
                { icon: Twitter, href: "https://twitter.com", hoverClass: "hover:text-sky-500 hover:bg-sky-500/10 hover:border-sky-500/30" },
                { icon: Github, href: "https://github.com", hoverClass: "hover:text-zinc-100 hover:bg-zinc-100/10 hover:border-zinc-100/30" },
                { icon: Mail, href: "mailto:contact@pixelgallery.com", hoverClass: "hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30" }
              ].map((social, i) => (
                 <motion.a 
                    key={i}
                    whileHover={{ y: -3 }}
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 transition-all duration-300 ${social.hoverClass}`}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <h3 className="text-sm font-semibold text-zinc-100 tracking-wider uppercase">Explore</h3>
            <ul className="space-y-3">
              {[
                { label: 'All Images', path: '/all-images' },
                { label: 'Popular', path: '/popular' },
                { label: 'Categories', path: '/categories' },
                { label: 'Your Favorites', path: '/liked' },
              ].map((link, i) => (
                <li key={i}>
                  <motion.a 
                    whileHover={{ x: 5 }}
                    href={link.path} 
                    className="flex items-center text-sm text-zinc-400 hover:text-zinc-100 transition-colors group"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-indigo-400" />
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-sm font-semibold text-zinc-100 tracking-wider uppercase">Top Categories</h3>
            <ul className="space-y-3">
              {[
                { label: 'Nature', path: '/category/nature' },
                { label: 'Architecture', path: '/category/architecture' },
                { label: 'Technology', path: '/category/technology' },
                { label: 'People', path: '/category/people' },
              ].map((link, i) => (
                <li key={i}>
                  <motion.a 
                    whileHover={{ x: 5 }}
                    href={link.path} 
                    className="flex items-center text-sm text-zinc-400 hover:text-zinc-100 transition-colors group"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-indigo-400" />
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-sm font-semibold text-zinc-100 tracking-wider uppercase">Stay Updated</h3>
            <p className="text-sm text-zinc-400">
              Subscribe to get curated collections directly in your inbox.
            </p>
            <form className="flex flex-col space-y-3">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full pl-4 pr-10 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  required
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 bg-zinc-100 text-zinc-900 font-medium rounded-xl hover:bg-white transition-all shadow-lg text-sm"
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
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-zinc-800/50 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-zinc-500 text-sm">
            &copy; {currentYear} PixelHub. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="/privacy" className="text-zinc-500 hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-zinc-500 hover:text-zinc-300 transition-colors">Terms of Service</a>
          </div>
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -3 }}
            className="p-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-100 rounded-xl transition-all group"
            aria-label="Scroll to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-y-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;