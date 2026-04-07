import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { imagesByCategory } from '../assets/images';
import { Heart, Download, ArrowLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { Toaster, toast } from 'sonner';

const ImageDetails = () => {
  const { category, title } = useParams();
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const [isLiked, setIsLiked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const decodedTitle = decodeURIComponent(title).replace(/-/g, ' ');
  const currentImage = imagesByCategory[category]?.find(
    img => img.title.toLowerCase() === decodedTitle.toLowerCase()
  );

  const relatedImages = imagesByCategory[category]?.filter(
    img => img.imageId !== currentImage?.imageId
  ).slice(0, 4) || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [decodedTitle]);

  useEffect(() => {
    if (!currentImage || !isSignedIn) return;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/likes/is-liked?user_email=${userEmail}&category=${category}&title=${currentImage.title}`)
      .then(res => res.json())
      .then(data => setIsLiked(data.liked))
      .catch(err => console.error(err));
  }, [currentImage, isSignedIn, userEmail, category]);

  const handleLike = async () => {
    if (!isSignedIn) {
      toast.error('Please login to like images', { duration: 2000 });
      return;
    }

    const endpoint = isLiked ? 'unlike' : 'like';
    const method = isLiked ? 'DELETE' : 'POST';

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/likes/${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: userEmail,
          category,
          title: currentImage.title,
        }),
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        window.dispatchEvent(new Event('likeUpdated'));
        toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites', { duration: 2000 });
      } else {
        toast.error('Failed to update like status');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleDownload = async () => {
    if (!isSignedIn) {
      toast.error('Please login to download images', { duration: 2000 });
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
      toast.error('Download failed. Please try again.');
      setIsDownloading(false);
    }
  };

  if (!currentImage) return null;

  return (
    <div className="bg-black min-h-screen relative overflow-hidden">
      <Toaster richColors position="top-center" theme="dark" />

      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[50%] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[300px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Back Button */}
      <div className="pt-24 px-6 md:px-12 lg:px-24 mb-6 relative z-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group font-medium bg-zinc-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-800"
        >
          <ArrowLeft className="mr-1 group-hover:-translate-x-1 transition-transform w-4 h-4" />
          Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Image Showcase Model */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col space-y-6"
          >
            <div className="relative rounded-3xl overflow-hidden glass-card p-2 md:p-4 group">
              <div className="relative rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={currentImage.src}
                  alt={currentImage.title}
                  className="w-full max-h-[75vh] object-contain block z-10 relative"
                />
                {/* Blurred Background effect inside frame for a premium feel */}
                <div
                  className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110 z-0"
                  style={{ backgroundImage: `url(${currentImage.src})` }}
                />

                <div className="absolute bottom-6 right-6 flex space-x-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLike}
                    className={`p-3.5 rounded-full backdrop-blur-md border ${isLiked ? 'bg-rose-500/20 border-rose-500/50 text-rose-500' : 'bg-black/60 border-white/10 text-white'} shadow-2xl transition-all duration-300`}
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Details & Actions Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col justify-center space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-1.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-[10px] uppercase tracking-widest">
                {currentImage.category}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                {currentImage.title}
              </h1>
            </div>

            <div className="flex items-center gap-6 border-y border-zinc-800/50 py-6">
              <div className="flex gap-4">
                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Added On</p>
                  <p className="text-sm text-zinc-300 font-bold">{currentImage.date}</p>
                </div>
              </div>
            </div>

            <p className="text-zinc-400 text-lg leading-relaxed font-medium">
              {currentImage.description || 'Experience the visual excellence of this carefully curated asset, ready for your next creative endeavor.'}
            </p>

            <div className="pt-6 flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 min-w-[200px] flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/30"
              >
                {isDownloading ? (
                  <span className="flex items-center"><svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg> Processing</span>
                ) : (
                  <span className="flex items-center"><Download className="w-5 h-5 mr-2" /> Download High-Res</span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLike}
                className={`flex items-center justify-center px-8 py-4 backdrop-blur-md rounded-2xl font-semibold transition-all border ${isLiked ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'}`}
              >
                <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} /> {isLiked ? 'Saved' : 'Save'}
              </motion.button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate(`/category/${currentImage.category}`)}
                className="text-zinc-500 hover:text-indigo-400 transition-colors text-sm font-medium flex items-center group"
              >
                View more from this collection <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Related Content */ }
      {relatedImages.length > 0 && (
        <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="border-t border-zinc-800/50 py-20 px-4 sm:px-6 lg:px-8 bg-zinc-950/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">Similar Assets</p>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                More from <span className="capitalize text-zinc-400">{category}</span>
              </h2>
            </div>
            <button
              onClick={() => navigate(`/category/${category}`)}
              className="text-zinc-400 hover:text-white flex items-center group font-semibold text-sm"
            >
              View Collection
              <ChevronRight className="ml-1 group-hover:translate-x-1 transition-transform w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedImages.map((image) => (
              <motion.div
                key={image.imageId}
                whileHover={{ y: -8 }}
                onClick={() => navigate(`/category/${category}/${image.title.toLowerCase().replace(/\s+/g, '-')}`)}
                className="cursor-pointer group relative rounded-2xl overflow-hidden glass-card border-zinc-800 h-64"
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent flex items-end p-5 pointer-events-none">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{image.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }
    </div >
  );
};

export default ImageDetails;