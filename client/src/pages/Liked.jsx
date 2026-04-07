import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { imagesByCategory } from '../assets/images';
import { Heart, ArrowLeft, ChevronRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const Liked = () => {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const [likedImages, setLikedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const navigate = useNavigate();

  // Fetch all liked images
  useEffect(() => {
    if (!userEmail) return;

    setLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/likes/liked-images?user_email=${userEmail}`)
      .then(res => res.json())
      .then(data => {
        const liked = data.map(item => {
          const categoryImages = imagesByCategory[item.category] || [];
          const matchedImage = categoryImages.find(img => img.title === item.title);
          return matchedImage ? { ...matchedImage, category: item.category } : null;
        }).filter(Boolean);
        setLikedImages(liked);
      })
      .catch(err => {
        console.error('Failed to load liked images:', err);
        toast.error('Failed to load your favorites');
      })
      .finally(() => setLoading(false));
  }, [userEmail]);

  // Remove image from liked
  const handleRemoveLike = async (image) => {
    setRemovingId(image.imageId);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/likes/unlike`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: userEmail,
          category: image.category,
          title: image.title
        }),
      });

      if (res.ok) {
        setLikedImages(prev => prev.filter(img => img.imageId !== image.imageId));
        window.dispatchEvent(new Event('likeUpdated'));
        toast.success('Removed from favorites');
      } else {
        console.error('Failed to unlike image');
        toast.error('Failed to remove from favorites');
      }
    } catch (err) {
      console.error('Error unliking image:', err);
      toast.error('An error occurred while removing');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-20 left-1/4 w-[40%] h-[400px] bg-rose-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1920px] mx-auto relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6"
        >
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-zinc-500 hover:text-rose-400 transition-colors mb-6 group text-sm font-medium"
            >
              <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Gallery
            </button>
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                <Heart className="w-7 h-7 fill-current" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-zinc-100 to-zinc-400 bg-clip-text text-transparent tracking-tight">
                  Your Favorites
                </h1>
                <p className="text-zinc-500 mt-2 font-medium">
                  {likedImages.length} {likedImages.length === 1 ? 'treasured asset' : 'carefully curated assets'}
                </p>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/all-images')}
            className="hidden md:flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-800 text-zinc-100 font-semibold rounded-2xl hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-300"
          >
            Explore More
            <ChevronRight className="w-4 h-4 text-indigo-400" />
          </motion.button>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 gap-6"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-rose-500"></div>
              <Heart className="absolute w-6 h-6 text-rose-500 fill-current animate-pulse" />
            </div>
            <p className="text-zinc-500 font-medium tracking-wide">Retrieving your collection...</p>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && likedImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-24 flex flex-col items-center"
          >
            <div className="flex items-center justify-center h-24 w-24 rounded-full bg-zinc-900 border border-zinc-800 mb-8 shadow-xl relative">
              <Sparkles className="h-10 w-10 text-rose-500/30 absolute -top-4 -right-4" />
              <Heart className="h-8 w-8 text-rose-500 fill-current relative z-10" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-100 mb-3 tracking-tight">
              Awaiting Inspiration
            </h3>
            <p className="text-zinc-500 mb-10 max-w-md mx-auto leading-relaxed">
              You haven't added any favorites yet. Start exploring our stunning collections to build your own personal moodboard.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/all-images')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-500 hover:shadow-lg transition-all duration-300 shadow-indigo-500/25"
            >
              <ImageIcon className="w-5 h-5" />
              Browse Gallery
            </motion.button>
          </motion.div>
        )}

        {/* Liked Images Grid */}
        {!loading && likedImages.length > 0 && (
          <div className="relative">
            <AnimatePresence>
              <motion.div 
                layout
                className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
              >
                {likedImages.map((image) => (
                  <motion.div
                    onClick={() => navigate(`/category/${image.category}/${image.title.toLowerCase().replace(/\s+/g, '-')}`)}
                    key={image.imageId}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -6 }}
                    className="relative rounded-2xl cursor-pointer overflow-hidden shadow-xl border border-zinc-800 hover:border-rose-500/30 group break-inside-avoid bg-zinc-900"
                  >
                    <div className="w-full">
                      <img
                        src={image.src}
                        alt={image.title}
                        className="w-full h-auto object-cover cursor-zoom-in transform transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    {/* Image Info Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="flex justify-between items-end">
                        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-white font-bold text-lg tracking-tight mb-1">{image.title}</h3>
                          <span className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold bg-white/10 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-md">
                            {image.category}
                          </span>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveLike(image);
                          }}
                          disabled={removingId === image.imageId}
                          className={`p-2.5 rounded-full shadow-lg pointer-events-auto backdrop-blur-md border border-white/10 ${
                            removingId === image.imageId 
                              ? 'bg-zinc-800' 
                              : 'bg-black/40 hover:bg-rose-500 text-white'
                          } transition-colors duration-300`}
                          title="Remove from favorites"
                        >
                          {removingId === image.imageId ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Heart className="w-5 h-5 fill-current text-rose-500 group-hover:text-white" />
                          )}
                        </motion.button>
                      </div>
                    </div>

                    {/* Quick Info Badge */}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Heart className="w-3 h-3 fill-current text-rose-500" />
                      <span>Saved</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && likedImages.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-20 text-center border-t border-zinc-800/50 pt-10"
          >
            <h3 className="text-xl font-semibold text-zinc-200 mb-5 tracking-tight">
              Found {likedImages.length} gems? There's more to discover.
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/all-images')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-zinc-900 border border-zinc-800 text-zinc-100 font-semibold rounded-full hover:bg-zinc-800 hover:border-indigo-500/50 transition-all duration-300 shadow-xl"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Explore Gallery
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Liked;