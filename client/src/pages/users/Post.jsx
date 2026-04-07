import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiX, FiEye, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { FaPaintBrush, FaPalette, FaCamera, FaCode } from 'react-icons/fa';
import UserPostCard from '../../components/users/UserPostCard';

const Post = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const userId = user?.id || '';
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/upload/fetch-images?user_id=${userId}`);
        setImages(res.data);
      } catch (err) {
        setError('Failed to fetch images. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    if (isLoaded) fetchImages();
  }, [user, isLoaded]);

  const categories = [...new Set(images.map(img => img.category))];

  const filteredImages = images.filter(img => {
    const matchesSearch = img.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         img.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || 
                          selectedCategories.includes(img.category);
    return matchesSearch && matchesCategory;
  });

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
  };

  const getCategoryIcon = (category) => {
    switch(category.toLowerCase()) {
      case 'art': return <FaPaintBrush className="mr-2 text-rose-400" />;
      case 'design': return <FaPalette className="mr-2 text-indigo-400" />;
      case 'photography': return <FaCamera className="mr-2 text-amber-400" />;
      case 'code': return <FaCode className="mr-2 text-emerald-400" />;
      default: return <FaPaintBrush className="mr-2 text-zinc-400" />;
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <div className="w-16 h-16 border-4 border-zinc-800 border-t-indigo-500 rounded-full" />
        </motion.div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-[2rem] border-zinc-800 overflow-hidden max-w-md w-full p-10 text-center relative z-10 shadow-2xl">
           <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl text-indigo-400">
              <FiEye className="h-8 w-8" />
           </motion.div>
           <h2 className="text-3xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent mb-3 tracking-tight">Community Feed</h2>
           <p className="text-zinc-500 mb-8 font-medium">Authenticate to explore unrestricted access to our global creator network.</p>
           
           <SignInButton mode="modal">
             <button className="w-full py-4 px-6 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center hover:bg-indigo-500 hover:shadow-indigo-500/25 shadow-lg transition-all">
               Sign In to View Gallery
             </button>
           </SignInButton>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="glass-card p-10 rounded-3xl border border-rose-500/20 text-center max-w-md">
           <FiAlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
           <h3 className="text-xl font-bold text-white mb-2">Connection Interrupted</h3>
           <p className="text-zinc-500 mb-6">{error}</p>
           <button onClick={() => window.location.reload()} className="px-6 py-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors font-bold text-sm">
             Re-establish Connection
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[40%] h-[400px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1920px] mx-auto relative z-10">
        
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
               <FiEye /> Community Feed
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-zinc-100 to-zinc-500 bg-clip-text text-transparent mb-5 tracking-tight">
             Global Network
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto font-medium">
             Discover, connect, and elevate with creative minds worldwide.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            
            <div className="relative w-full md:w-2/3">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-indigo-400" />
              </div>
              <input type="text" placeholder="Search by title or description..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full pl-12 pr-12 py-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 shadow-xl transition-all" />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-white">
                  <FiX className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="relative w-full md:w-auto">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl shadow-xl transition-all w-full md:w-auto ${
                   isFilterOpen || selectedCategories.length > 0 
                     ? 'bg-indigo-600 text-white border border-indigo-500' 
                     : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <FiFilter className="h-5 w-5" />
                <span className="font-bold">Filter</span>
                {selectedCategories.length > 0 && (
                  <span className="inline-flex items-center justify-center px-2 text-[10px] bg-white text-indigo-600 rounded-md font-bold">
                    {selectedCategories.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-3 w-64 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-2xl p-5 z-20 shadow-2xl hidden md:block">
                    <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
                       <h3 className="font-bold text-white">Categories</h3>
                       {selectedCategories.length > 0 && <button onClick={clearFilters} className="text-xs text-indigo-400 font-bold uppercase hover:text-indigo-300">Clear</button>}
                    </div>
                    <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                       {categories.map((category) => (
                         <div key={category} className="flex items-center group">
                            <input type="checkbox" id={`cat-${category}`} checked={selectedCategories.includes(category)} onChange={() => toggleCategory(category)} className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-indigo-600 focus:ring-0 cursor-pointer" />
                            <label htmlFor={`cat-${category}`} className="ml-3 text-sm text-zinc-400 capitalize flex items-center cursor-pointer group-hover:text-white">
                               {getCategoryIcon(category)} {category}
                            </label>
                         </div>
                       ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Mobile inline filter */}
            <AnimatePresence>
               {isFilterOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 md:hidden overflow-hidden">
                     <div className="flex justify-between mb-3"><span className="font-bold text-white">Categories</span><button onClick={clearFilters} className="text-xs text-indigo-400 font-bold">Clear</button></div>
                     <div className="grid grid-cols-2 gap-2">
                        {categories.map(c => (
                          <label key={c} className="flex items-center text-sm text-zinc-400"><input type="checkbox" className="mr-2 rounded border-zinc-700 bg-zinc-800 text-indigo-600" checked={selectedCategories.includes(c)} onChange={()=>toggleCategory(c)} /><span className="capitalize">{c}</span></label>
                        ))}
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {selectedCategories.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 flex flex-wrap gap-2 justify-center">
                {selectedCategories.map((category) => (
                  <span key={category} className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 uppercase tracking-wider">
                    {getCategoryIcon(category)}{category}
                    <button type="button" className="ml-2 text-indigo-400 hover:text-indigo-200" onClick={() => toggleCategory(category)}>
                      <FiX className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Metadata */}
        <div className="mb-8 flex justify-between items-center border-b border-zinc-800/50 pb-4">
           <p className="text-zinc-500 font-medium">Monitoring <span className="text-white">{filteredImages.length}</span> publications</p>
           {(searchTerm || selectedCategories.length > 0) && (
              <button onClick={clearFilters} className="text-sm font-medium text-rose-500 hover:text-rose-400 flex items-center">
                 <FiX className="mr-1 w-4 h-4" /> Reset Filters
              </button>
           )}
        </div>

        {/* Gallery Grid */}
        {filteredImages.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            <AnimatePresence>
              {filteredImages.map((img) => (
                <motion.div key={img.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }} className="break-inside-avoid">
                  <UserPostCard post={img} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card border border-zinc-800 rounded-[2rem] p-16 text-center shadow-2xl flex flex-col items-center">
            <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mb-6 shadow-xl">
               <FiSearch className="h-10 w-10 text-zinc-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Zero Network Results</h3>
            <p className="text-zinc-500 max-w-sm font-medium mb-8">
              Adjust parameters or wait for new telemetry data to populate.
            </p>
            <button onClick={clearFilters} className="px-8 py-3.5 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:bg-indigo-500 hover:shadow-indigo-500/25 transition-all">
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Post;