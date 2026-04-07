import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { imagesByCategory } from '../assets/images';
import ImageCard from '../components/ImageCard';
import { Search, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AllImages = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const allImages = Object.entries(imagesByCategory)
    .flatMap(([category, images]) => 
      images.map(img => ({ ...img, category }))
    ).sort((a, b) => a.title.localeCompare(b.title));

  const allCategories = Object.keys(imagesByCategory);

  const filteredImages = allImages.filter(image => {
    const matchesSearch = image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         image.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || 
                          selectedCategories.includes(image.category);
    return matchesSearch && matchesCategory;
  });

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
  };

  return (
    <div className="pt-24 px-6 md:px-12 lg:px-24 min-h-screen relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-[50%] h-[300px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-zinc-100 to-zinc-500 bg-clip-text text-transparent mb-4 tracking-tight drop-shadow-sm">
            Explore The Gallery
          </h1>
          <p className="text-lg text-zinc-400 font-medium tracking-wide">
            {allImages.length} extraordinary assets across {allCategories.length} categories
          </p>
        </motion.div>

        <div className="mb-12 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="relative w-full md:w-2/3"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-indigo-400" />
              </div>
              <input
                type="text"
                placeholder="Search premium assets or themes..."
                className="block w-full pl-12 pr-12 py-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 shadow-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <X className="h-5 w-5 text-zinc-400 hover:text-zinc-200" />
                </button>
              )}
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="relative w-full md:w-auto"
            >
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl shadow-xl transition-all duration-300 w-full justify-center md:w-auto ${
                   isFilterOpen || selectedCategories.length > 0 
                     ? 'bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-500' 
                     : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Filter className="h-5 w-5" />
                <span className="font-medium">Filter</span>
                {selectedCategories.length > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold text-indigo-600 bg-white rounded-md shadow-sm">
                    {selectedCategories.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div 
                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.95 }}
                     className="absolute right-0 mt-3 w-64 origin-top-right bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl z-20 p-5 hidden md:block"
                  >
                    <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
                      <h3 className="font-semibold text-zinc-100">Categories</h3>
                      {selectedCategories.length > 0 && (
                        <button
                          onClick={clearFilters}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                      {allCategories.map((category) => (
                        <div key={category} className="flex items-center group">
                          <input
                            id={`filter-${category}`}
                            type="checkbox"
                            className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-indigo-600 focus:ring-offset-zinc-900 focus:ring-indigo-500 cursor-pointer"
                            checked={selectedCategories.includes(category)}
                            onChange={() => toggleCategory(category)}
                          />
                          <label
                            htmlFor={`filter-${category}`}
                            className="ml-3 text-sm text-zinc-400 group-hover:text-zinc-200 capitalize cursor-pointer transition-colors"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            {/* Mobile Filter view inline */}
            <AnimatePresence>
               {isFilterOpen && (
                  <motion.div 
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: 'auto', opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     className="w-full bg-zinc-900 border border-zinc-800 rounded-xl mt-2 p-4 md:hidden overflow-hidden"
                  >
                     <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-zinc-100">Categories</h3>
                        <button onClick={clearFilters} className="text-xs text-indigo-400 hover:text-indigo-300">Clear</button>
                     </div>
                     <div className="grid grid-cols-2 gap-2">
                        {allCategories.map((category) => (
                           <label key={category} className="flex items-center space-x-2 text-sm text-zinc-400">
                             <input
                               type="checkbox"
                               className="rounded border-zinc-700 bg-zinc-800 text-indigo-600 focus:ring-offset-zinc-900"
                               checked={selectedCategories.includes(category)}
                               onChange={() => toggleCategory(category)}
                             />
                             <span className="capitalize">{category}</span>
                           </label>
                        ))}
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {selectedCategories.length > 0 && (
              <motion.div 
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 exit={{ opacity: 0, height: 0 }}
                 className="mt-6 flex flex-wrap gap-2 justify-center"
              >
                {selectedCategories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
                  >
                    {category}
                    <button
                      type="button"
                      className="flex-shrink-0 ml-2 inline-flex text-indigo-400 hover:text-indigo-200 transition-colors"
                      onClick={() => toggleCategory(category)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mb-8 flex justify-between items-center border-b border-zinc-800/50 pb-4">
          <p className="text-zinc-500 font-medium">
            Showing <span className="text-zinc-200">{filteredImages.length}</span> results
          </p>
          {filteredImages.length === 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-rose-400 hover:text-rose-300 flex items-center transition-colors"
            >
              <X className="h-4 w-4 mr-1" />
              Reset views
            </button>
          )}
        </div>

        {filteredImages.length > 0 ? (
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 mb-16"
          >
            {filteredImages.map((image) => (
              <ImageCard 
                key={`${image.category}-${image.imageId}`} 
                image={image} 
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="text-center py-24 flex flex-col items-center"
          >
            <div className="flex items-center justify-center h-20 w-20 rounded-full bg-zinc-900 border border-zinc-800 mb-6 shadow-xl">
              <Search className="h-8 w-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-2">No assets match</h3>
            <p className="text-zinc-500 mb-8 max-w-sm">
              We couldn't find any images matching your current criteria. Consider broadening your search or clearing filters.
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-8 py-3 rounded-full shadow-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/25"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllImages;