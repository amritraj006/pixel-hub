import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { imagesByCategory } from '../assets/images';
import ImageCard from '../components/ImageCard';
import { ArrowLeft, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const SubCategoryPage = () => {
  const { subcategory } = useParams();
  const navigate = useNavigate();
  const images = imagesByCategory[subcategory] || [];

  return (
    <div className="pt-24 px-6 md:px-12 lg:px-24 min-h-screen relative overflow-hidden">
       {/* Background glow effects */}
       <div className="absolute top-10 right-1/4 w-[30%] h-[300px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <motion.div 
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="mb-16 text-center"
        >
          <div className="flex justify-center mb-6">
             <button 
                onClick={() => navigate('/all-categories')}
                className="flex items-center text-zinc-500 hover:text-indigo-400 transition-colors group text-sm font-medium"
             >
                <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Categories
             </button>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-zinc-100 to-zinc-500 bg-clip-text text-transparent mb-4 capitalize tracking-tight">
            {subcategory} Collection
          </h2>
          <p className="text-lg text-zinc-400 font-medium">
            {images.length} stunning curated assets in {subcategory}
          </p>
        </motion.div>

        {/* Image Grid */}
        {images.length > 0 ? (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 mb-20"
            >
              {images.map((img) => (
                <ImageCard 
                  key={img.imageId} 
                  image={img} 
                />
              ))}
            </motion.div>

            {/* Back to Gallery Button */}
            <div className="text-center mb-16 border-t border-zinc-800/50 pt-10">
              <button
                onClick={() => navigate('/all-images')}
                className="inline-flex items-center px-8 py-3.5 border border-transparent text-sm font-semibold rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 hover:shadow-indigo-500/25"
              >
                Explore All Images
                <ArrowLeft className="w-4 h-4 ml-3 rotate-180" />
              </button>
            </div>
          </>
        ) : (
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="text-center py-24 flex flex-col items-center"
          >
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-zinc-900 border border-zinc-800 mb-6 shadow-xl">
               <Search className="h-8 w-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-2 tracking-tight">No assets found</h3>
            <p className="text-zinc-500 mb-8 max-w-sm">
               This specific collection doesn't contain any images yet. Check back later!
            </p>
            <button
              onClick={() => navigate('/all-categories')}
              className="inline-flex items-center px-8 py-3 rounded-full text-sm font-semibold text-white bg-zinc-800 hover:bg-zinc-700 shadow-xl transition-all duration-300 hover:scale-105"
            >
              Browse All Categories
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SubCategoryPage;