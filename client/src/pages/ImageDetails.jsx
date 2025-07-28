import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { imagesByCategory } from '../assets/images';
import { Heart, Download, ArrowLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { Toaster, toast } from 'sonner';

const ImageDetails = () => {
  const { category, title } = useParams();
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const [isLiked, setIsLiked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showLoginToast, setShowLoginToast] = useState(false);

  const decodedTitle = decodeURIComponent(title).replace(/-/g, ' ');
  const currentImage = imagesByCategory[category]?.find(
    img => img.title.toLowerCase() === decodedTitle.toLowerCase()
  );

  const relatedImages = imagesByCategory[category]?.filter(
    img => img.imageId !== currentImage?.imageId
  ).slice(0, 4) || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!currentImage || !isSignedIn) return;

    fetch(`http://localhost:8000/api/likes/is-liked?user_email=${userEmail}&category=${category}&title=${currentImage.title}`)
      .then(res => res.json())
      .then(data => setIsLiked(data.liked))
      .catch(err => console.error(err));
  }, [currentImage, isSignedIn, userEmail, category]);

  const handleLike = async () => {
    if (!isSignedIn) {
      toast.error('Please login to like images', {
        position: 'top-center',
        duration: 2000,
        
      });
      return;
    }

    const endpoint = isLiked ? 'unlike' : 'like';
    const method = isLiked ? 'DELETE' : 'POST';

    try {
      const response = await fetch(`http://localhost:8000/api/likes/${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: userEmail,
          category,
          title: currentImage.title,
        }),
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        window.dispatchEvent(new Event('likeUpdated'));
        toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites', {
          position: 'top-center',
          duration: 2000
        });
      } else {
        console.error('Failed to update like status');
        toast.error('Failed to update like status');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    }
  };

  const handleDownload = async () => {
    if (!isSignedIn) {
      toast.error('Please login to download images', {
        position: 'top-center',
        duration: 2000,
        
      });
      return;
    }

    setIsDownloading(true);
    
    
    try {
      const response = await fetch(currentImage.src);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = currentImage.title.replace(/\s+/g, '_') + '.jpg';
      document.body.appendChild(link);
      link.click();
      
      toast.success('Download complete!', { duration: 3000 });

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        setIsDownloading(false);
      }, 100);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed. Please try again.');
      setIsDownloading(false);
    }
  };

  if (!currentImage) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Image Not Found</h1>
          <button
            onClick={() => navigate('/all-images')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Browse All Images
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Toaster richColors position="top-center" />
      
      <div className="pt-6 px-6 md:px-12 lg:px-24">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors group"
        >
          <ArrowLeft 
            className="mr-1 group-hover:-translate-x-1 transition-transform" 
            size={20} 
          />
          Back to Gallery
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="relative rounded-2xl overflow-hidden shadow-xl bg-gray-50"
          >
            <div className="aspect-[4/3] w-full flex items-center justify-center">
              <img
                src={currentImage.src}
                alt={currentImage.title}
                className="w-full h-full object-contain max-h-[70vh]"
                loading="eager"
              />
            </div>
            
            <div className="absolute bottom-6 right-6 flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLike}
                className={`p-3 rounded-full backdrop-blur-sm ${isLiked ? 'bg-red-500/90 text-white' : 'bg-white/90 text-gray-800'} shadow-md transition-colors duration-300`}
                aria-label={isLiked ? 'Unlike' : 'Like'}
              >
                <Heart 
                  size={24} 
                  fill={isLiked ? 'currentColor' : 'none'} 
                  className="transition-all duration-300"
                />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                disabled={isDownloading}
                className="p-3 rounded-full backdrop-blur-sm bg-white/90 text-gray-800 shadow-md hover:bg-indigo-100 transition-colors"
                aria-label="Download"
              >
                {isDownloading ? (
                  <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Download size={24} />
                )}
              </motion.button>
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold text-gray-900"
            >
              {currentImage.title}
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4"
            >
              <span className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 rounded-full text-sm font-medium capitalize">
                {currentImage.category}
              </span>
              <span className="text-gray-500 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                {currentImage.date}
              </span>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-lg leading-relaxed"
            >
              {currentImage.description || 'No description available for this image.'}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-4 flex flex-wrap gap-4"
            >
              <button
                onClick={() => navigate(`/category/${currentImage.category}`)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                View All {currentImage.category} Images
                <ChevronRight className="ml-2" size={20} />
              </button>
              
              <button
                onClick={() => navigate('/all-categories')}
                className="inline-flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 hover:scale-[1.02]"
              >
                Explore All Categories
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {relatedImages.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-b from-gray-50 to-white py-16 px-6 md:px-12 lg:px-24"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                More from <span className="text-indigo-600 capitalize">{category}</span>
              </h2>
              <button
                onClick={() => navigate(`/category/${category}`)}
                className="text-indigo-600 hover:text-indigo-800 flex items-center group"
              >
                View all
                <ChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedImages.map((image) => (
                <motion.div
                  key={image.imageId}
                  whileHover={{ y: -8 }}
                  onClick={() => navigate(`/category/${category}/${image.title.toLowerCase().replace(/\s+/g, '-')}`)}
                  className="cursor-pointer group"
                >
                  <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-48">
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                      <div>
                        <h3 className="text-white font-medium">{image.title}</h3>
                        <p className="text-gray-200 text-sm">{image.category}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="py-16 px-6 md:px-12 lg:px-24 text-center bg-white"
      >
        <button
          onClick={() => navigate('/all-images')}
          className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:shadow-xl hover:scale-105"
        >
          Discover More Images
          <ChevronRight className="ml-2" size={24} />
        </button>
      </motion.div>
    </div>
  );
};

export default ImageDetails;