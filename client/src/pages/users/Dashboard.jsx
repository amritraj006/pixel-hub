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

  const fetchUserStats = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/upload/user-stats?user_email=${user?.primaryEmailAddress?.emailAddress}`);
      setUserStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/upload/user-posts?user_email=${user?.primaryEmailAddress?.emailAddress}`
      );
      setUserPosts(res.data);
    } catch (error) {
      toast.error('Failed to fetch posts');
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserStats();
      if (selectedTab === 1) fetchUserPosts();
    }
  }, [user, selectedTab]);

  const handleDelete = async (id, imageUrl) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/upload/delete-post/${id}`, {
        data: { image_url: imageUrl }
      });
      setUserPosts(userPosts.filter(post => post.id !== id));
      fetchUserStats();
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

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
        `${import.meta.env.VITE_BACKEND_URL}/upload/edit-post/${editingPost.id}`,
        formData
      );
      setEditingPost(null);
      fetchUserPosts();
      fetchUserStats();
      toast.success('Post updated successfully');
    } catch (error) {
      toast.error('Failed to update post');
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 relative overflow-hidden">
      <Toaster position="top-center" toastOptions={{ style: { background: '#18181b', color: '#fff', border: '1px solid #3f3f46' } }} />
      
      {/* Glow Effects */}
      <div className="absolute top-0 right-1/3 w-[30%] h-[300px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-10 tracking-tight">
          Creator Studio
        </motion.h1>

        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-2 rounded-2xl bg-zinc-900/50 w-full sm:w-max p-1.5 border border-zinc-800 shadow-xl backdrop-blur-md overflow-x-auto">
            {['Overview', 'Published Assets'].map((tab, idx) => (
              <Tab
                key={idx}
                className={({ selected }) =>
                  `px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 focus:outline-none whitespace-nowrap ${
                    selected ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
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
          
          <Tab.Panels className="mt-8">
            {/* Overview Section */}
            <Tab.Panel>
              <AnimatePresence mode="wait">
                <motion.div 
                   key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} 
                   className="glass-card rounded-[2xl] p-8 md:p-12 border border-zinc-800 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full" />
                  
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-40 h-40 rounded-full overflow-hidden border-2 border-zinc-800 shadow-2xl shrink-0">
                      <img src={user?.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                    </motion.div>
                    
                    <div className="flex-1 w-full text-center md:text-left">
                      <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-zinc-100 to-zinc-400 bg-clip-text text-transparent mb-1">
                        {user?.fullName}
                      </h2>
                      <p className="text-zinc-500 mb-8 font-medium">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { title: 'Total Assets', value: userStats?.totalPosts || 0 },
                          { title: 'Total Engagement', value: userStats?.totalLikes || 0 },
                          { title: 'Top Category', value: userStats?.popularCategory || 'N/A' },
                          { title: 'Conversion', value: userStats?.engagementRate ? `${userStats.engagementRate}%` : '0%' }
                        ].map((stat, index) => (
                          <motion.div 
                             key={index}
                             initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                             className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl"
                          >
                            <h3 className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-2">{stat.title}</h3>
                            <p className="text-3xl font-bold text-white">{stat.value}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </Tab.Panel>

            {/* Published Assets Section */}
            <Tab.Panel>
              <AnimatePresence mode="wait">
                <motion.div key="posts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {userPosts.length > 0 ? (
                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                      {userPosts.map((post) => (
                        <motion.div 
                          key={post.id}
                          className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl break-inside-avoid group"
                        >
                          <div className="relative overflow-hidden">
                            <img
                              src={post.image_url?.startsWith('http') ? post.image_url : `${import.meta.env.VITE_BACKEND_URL}/uploads/${post.image_url}`}
                              alt={post.title}
                              className="w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end pointer-events-none">
                               <p className="text-zinc-300 text-sm font-medium">{post.description}</p>
                            </div>
                          </div>
                          <div className="p-5">
                            <h2 className="text-xl font-bold text-white mb-2 tracking-tight">{post.title}</h2>
                            <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-zinc-800 border border-zinc-700 text-indigo-400 rounded-md">
                              {post.category}
                            </span>
                            <div className="flex justify-between mt-6 gap-2">
                              <button
                                onClick={() => openEditModal(post)}
                                className="flex-1 flex items-center justify-center px-4 py-2 bg-zinc-800 text-zinc-300 text-sm font-medium rounded-xl hover:bg-zinc-700 transition-colors"
                              >
                                <FiEdit className="mr-2 w-4 h-4" /> Edit
                              </button>
                              <button
                                onClick={() => handleDelete(post.id, post.image_url)}
                                className="flex-1 flex items-center justify-center px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-medium rounded-xl hover:bg-rose-500/20 transition-colors"
                              >
                                <FiTrash2 className="mr-2 w-4 h-4" /> Delete
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-[2xl] border border-zinc-800 p-16 text-center shadow-xl">
                      <div className="mx-auto w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                        <FiImage className="text-zinc-600 text-3xl" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">No Published Assets</h3>
                      <p className="text-zinc-500">Your portfolio is currently empty. Head to the upload studio to share your work.</p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        {/* Edit Modal Custom Dark UI */}
        <AnimatePresence>
          {editingPost && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
              >
                <div className="flex justify-between items-center p-6 border-b border-zinc-800/50">
                  <h2 className="text-xl font-bold text-white tracking-tight">Modify Asset Details</h2>
                  <button onClick={() => setEditingPost(null)} className="text-zinc-500 hover:text-white transition-colors">
                    <FiX size={20} />
                  </button>
                </div>
                <form onSubmit={handleEditSubmit} className="p-6">
                  <div className="space-y-5">
                     <div>
                       <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">Title</label>
                       <input type="text" name="title" value={formData.title} onChange={handleEditChange} className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium shadow-inner" required />
                     </div>
                     <div>
                       <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">Category</label>
                       <input type="text" name="category" value={formData.category} onChange={handleEditChange} className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium shadow-inner" required />
                     </div>
                     <div>
                       <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">Description</label>
                       <textarea name="description" value={formData.description} onChange={handleEditChange} className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium shadow-inner resize-none" rows="4" required />
                     </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-8">
                    <button type="button" onClick={() => setEditingPost(null)} className="px-6 py-3 bg-zinc-800 text-zinc-300 rounded-xl hover:bg-zinc-700 transition-colors font-bold text-sm">
                      Cancel
                    </button>
                    <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 shadow-indigo-500/25 shadow-lg transition-colors font-bold flex items-center text-sm">
                      <FiSave className="mr-2 w-4 h-4" /> Save Configuration
                    </button>
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