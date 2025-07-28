// src/pages/AllCategory.jsx
import React, { useEffect } from 'react';
import { imagesByCategory } from '../assets/images';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Grid } from 'lucide-react';
import { motion } from 'framer-motion';

const AllCategory = () => {
  const categories = Object.entries(imagesByCategory);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="py-16 px-6 md:px-12 lg:px-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 mb-4">
            <Grid className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">All Collections</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Complete Gallery
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through all our curated collections of stunning imagery
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-8">
          {categories.map(([categoryName, images], index) => (
            <motion.div
              key={categoryName}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full cursor-pointer"
              onClick={() => navigate(`/category/${categoryName}`)}
            >
              <div className="relative h-72 w-full">
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[0].src}
                      alt={images[0].title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Coming Soon</span>
                  </div>
                )}
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
                <div className="transform transition-all duration-300 group-hover:-translate-y-2">
                  <h3 className="text-xl font-bold capitalize mb-1">
                    {categoryName}
                  </h3>
                  <p className="text-gray-200 text-sm">
                    {images.length} {images.length === 1 ? 'image' : 'images'}
                  </p>
                </div>
                
                <button
                  className="w-max px-4 py-1.5 mt-3 bg-white/90 text-gray-900 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/category/${categoryName}`);
                  }}
                >
                  View
                  <ArrowRight className="h-4 w-4 ml-1 inline" />
                </button>
              </div>

              {images.length > 10 && (
                <div className="absolute top-4 right-4 bg-white/90 text-gray-900 px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm">
                  Popular
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for?
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="inline-flex items-center px-6 py-2.5 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-all"
          >
            Request a Custom Collection
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default AllCategory;