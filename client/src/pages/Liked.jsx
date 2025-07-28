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
    fetch(`http://localhost:8000/api/likes/liked-images?user_email=${userEmail}`)
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
      const res = await fetch('http://localhost:8000/api/likes/unlike', {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-6 md:px-12 lg:px-24 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6"
        >
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors mb-4 group"
            >
              <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
              Back to Gallery
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Your Favorites
                </h1>
                <p className="text-gray-600 mt-1">
                  {likedImages.length} {likedImages.length === 1 ? 'treasured image' : 'carefully curated images'}
                </p>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/all-images')}
            className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 shadow-indigo-100 hover:shadow-indigo-200"
          >
            Explore More
            <ChevronRight className="ml-1" size={20} />
          </motion.button>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
              <Heart className="absolute inset-0 m-auto w-6 h-6 text-indigo-500 fill-current" />
            </div>
            <p className="text-gray-600">Collecting your favorite moments...</p>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && likedImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 mb-6 relative">
              <Sparkles className="h-10 w-10 text-indigo-400 absolute" />
              <Heart className="h-8 w-8 text-indigo-600 fill-current relative z-10" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Your favorites collection is empty
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Like images to save them here for easy access. Start exploring to discover beautiful visuals you'll love!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/all-images')}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 shadow-md shadow-indigo-100"
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
                    whileHover={{ y: -8 }}
                    className="relative rounded-2xl cursor-pointer overflow-hidden shadow-md group"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={image.src}
                        alt={image.title}
                        className="w-full h-full object-cover cursor-pointer transform transition-transform duration-500 group-hover:scale-110"
                        onClick={() =>
                          navigate(`/category/${image.category}/${image.title.toLowerCase().replace(/\s+/g, '-')}`)
                        }
                      />
                    </div>

                    {/* Image Info Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex justify-between items-end">
                        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-white font-medium text-lg truncate">{image.title}</h3>
                          <span className="text-sm text-white/80 capitalize bg-black/30 px-2 py-1 rounded-full">
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
                          className={`p-2 rounded-full shadow ${
                            removingId === image.imageId 
                              ? 'bg-gray-400' 
                              : 'bg-white/90 hover:bg-red-500 hover:text-white'
                          } transition-colors`}
                          title="Remove from favorites"
                        >
                          {removingId === image.imageId ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Heart className="w-5 h-5 fill-current text-red-500 group-hover:text-white" />
                          )}
                        </motion.button>
                      </div>
                    </div>

                    {/* Quick Info Badge */}
                    <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-current text-red-400" />
                      <span>Favorited</span>
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
            className="mt-16 text-center"
          >
            <h3 className="text-xl font-medium text-gray-800 mb-4">
              Found {likedImages.length} gems? There's more to discover!
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/all-images')}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 shadow-md shadow-indigo-100"
            >
              <Sparkles className="w-5 h-5" />
              Explore Gallery
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Liked;