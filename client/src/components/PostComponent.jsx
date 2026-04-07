import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useUser } from '@clerk/clerk-react';
import UserPostCard from './users/UserPostCard';

const PostComponent = () => {
  const { user, isLoaded } = useUser();
  const [latestPosts, setLatestPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userId = user?.id || '';
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/upload/latest-posts?user_id=${userId}`);
        setLatestPosts(res.data);
      } catch (err) {
        console.error('Failed to fetch latest posts:', err);
      }
    };

    if (isLoaded) {
      fetchPosts();
    }
  }, [user, isLoaded]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, when: "beforeChildren" }
    }
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-16 relative z-10"
      >
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent mb-5 tracking-tight">
          Community Spotlight
        </h2>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto font-medium">
          Discover the most recent artistic shots from creators around the globe.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 w-full max-w-none relative z-10"
      >
        {latestPosts.map((post) => (
          <UserPostCard 
            key={post.id} 
            post={post} 
          />
        ))}
      </motion.div>

      {latestPosts.length > 0 && (
        <motion.div 
          className="flex justify-center mt-16 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={() => navigate('/post')}
            className="flex items-center gap-3 px-8 py-4 bg-zinc-900 border border-zinc-800 text-white rounded-full font-semibold hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300 hover:border-indigo-500/50 hover:bg-zinc-800 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Explore All Posts
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
              <FiArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-white transition-colors group-hover:translate-x-0.5" />
            </div>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default PostComponent;