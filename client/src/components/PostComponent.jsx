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
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold md:text-5xl text-gray-900 mb-4 inline-block tracking-tight">
          Latest Community Posts
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover the most recent contributions from our creative community
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-none"
      >
        {latestPosts.map((post) => (
          <UserPostCard 
            key={post.id} 
            post={post} 
          />
        ))}
      </motion.div>

      <motion.div 
        className="flex justify-center mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={() => navigate('/post')}
            className="inline-flex items-center px-8 py-3 bg-gray-900 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 hover:bg-black"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore All Posts
          <FiArrowRight className="ml-2" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PostComponent;