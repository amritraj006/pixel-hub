import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { FiEdit, FiTrash2, FiSave, FiX, FiUser, FiImage } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Tab } from '@headlessui/react';

const Dashboard = () => {
  const { user } = useUser();
  const [selectedTab, setSelectedTab] = useState(0);
  const [userPosts, setUserPosts] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    category: '', 
    description: '' 
  });

  // Animation variants
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const cardVariants = {
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }
  };

  // Fetch user stats
  const fetchUserStats = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/upload/user-stats?user_email=${user?.primaryEmailAddress?.emailAddress}`);
      setUserStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  // Fetch user posts
  const fetchUserPosts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/upload/user-posts?user_email=${user?.primaryEmailAddress?.emailAddress}`
      );
      setUserPosts(res.data);
    } catch (error) {
      toast.error('Failed to fetch posts');
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserStats();
      if (selectedTab === 1) fetchUserPosts();
    }
  }, [user, selectedTab]);

  // Delete post
  const handleDelete = async (id, imageUrl) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`http://localhost:8000/upload/delete-post/${id}`, {
        data: { image_url: imageUrl }
      });
      setUserPosts(userPosts.filter(post => post.id !== id));
      fetchUserStats();
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
      console.error('Delete error:', error);
    }
  };

  // Edit post handlers
  const openEditModal = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      category: post.category,
      description: post.description
    });
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8000/upload/edit-post/${editingPost.id}`,
        formData
      );
      setEditingPost(null);
      fetchUserPosts();
      fetchUserStats();
      toast.success('Post updated successfully');
    } catch (error) {
      toast.error('Failed to update post');
      console.error('Update error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#1e293b',
            color: '#fff',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-gray-800 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
        >
          Dashboard
        </motion.h1>

        {/* Enhanced Tab Component */}
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-white p-1 shadow-md max-w-md">
            {['Profile', 'Posts'].map((tab, idx) => (
              <Tab
                key={idx}
                className={({ selected }) =>
                  `w-full py-3 px-4 text-sm font-medium rounded-lg transition-all duration-300 ${
                    selected
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`
                }
              >
                <div className="flex items-center justify-center">
                  {idx === 0 ? <FiUser className="mr-2" /> : <FiImage className="mr-2" />}
                  {tab}
                </div>
              </Tab>
            ))}
          </Tab.List>
          
          <Tab.Panels className="mt-6">
            {/* Profile Section */}
            <Tab.Panel>
              <AnimatePresence mode="wait">
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-xl p-6 overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    <motion.div 
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg"
                    >
                      <img 
                        src={user?.imageUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <div className="flex-1">
                      <motion.h2 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl font-bold text-gray-800"
                      >
                        {user?.fullName}
                      </motion.h2>
                      <motion.p 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-600 mb-6"
                      >
                        {user?.primaryEmailAddress?.emailAddress}
                      </motion.p>

                      <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {[
                          { title: 'Total Posts', value: userStats?.totalPosts || 0, color: 'bg-indigo-100 text-indigo-800' },
                          { title: 'Total Likes', value: userStats?.totalLikes || 0, color: 'bg-purple-100 text-purple-800' },
                          { title: 'Popular Category', value: userStats?.popularCategory || 'N/A', color: 'bg-green-100 text-green-800' },
                          { title: 'Engagement Rate', value: userStats?.engagementRate ? `${userStats.engagementRate}%` : '0%', color: 'bg-amber-100 text-amber-800' }
                        ].map((stat, index) => (
                          <motion.div 
                            key={index}
                            variants={itemVariants}
                            className={`p-4 rounded-xl shadow-sm ${stat.color}`}
                          >
                            <h3 className="text-sm font-medium mb-1">{stat.title}</h3>
                            <p className="text-2xl font-bold">{stat.value}</p>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </Tab.Panel>

            {/* Posts Section */}
            <Tab.Panel>
              <AnimatePresence mode="wait">
                <motion.div
                  key="posts"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {userPosts.length > 0 ? (
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {userPosts.map((post) => (
                        <motion.div 
                          key={post.id}
                          variants={itemVariants}
                          whileHover="hover"
                          variants={cardVariants}
                          className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300"
                        >
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={`http://localhost:8000/uploads/${post.image_url}`}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                              <p className="text-white text-sm">{post.description}</p>
                            </div>
                          </div>
                          <div className="p-4">
                            <h2 className="text-xl font-semibold text-gray-800">{post.title}</h2>
                            <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                              {post.category}
                            </span>
                            <div className="flex justify-between mt-4">
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openEditModal(post)}
                                className="flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                              >
                                <FiEdit className="mr-1" /> Edit
                              </motion.button>
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDelete(post.id, post.image_url)}
                                className="flex items-center px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              >
                                <FiTrash2 className="mr-1" /> Delete
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-2xl shadow-xl p-8 text-center"
                    >
                      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FiImage className="text-gray-400 text-3xl" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-700 mb-2">No Posts Yet</h3>
                      <p className="text-gray-500">You haven't uploaded any images yet.</p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        {/* Edit Modal */}
        <AnimatePresence>
          {editingPost && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              >
                <div className="flex justify-between items-center p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-800">Edit Post</h2>
                  <button 
                    onClick={() => setEditingPost(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                <form onSubmit={handleEditSubmit} className="p-6">
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleEditChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleEditChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2 font-medium">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleEditChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      rows="4"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <motion.button
                      type="button"
                      onClick={() => setEditingPost(null)}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center"
                    >
                      <FiSave className="mr-1" /> Save Changes
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Dashboard;