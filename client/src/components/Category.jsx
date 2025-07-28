// src/components/Category.jsx
import React, { useEffect } from 'react';
import { imagesByCategory } from '../assets/images';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Category = () => {
  const categories = Object.entries(imagesByCategory).slice(0, 6); // Show only 6 categories on home
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="py-16 px-6 md:px-12 lg:px-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Our Collections
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore stunning images across various categories curated for your inspiration
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-8">
          {categories.map(([categoryName, images]) => (
            <div
              key={categoryName}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full cursor-pointer"
              onClick={() => navigate(`/category/${categoryName}`)}
            >
              <div className="relative h-80 w-full">
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[0].src}
                      alt={images[0].title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">Coming Soon</span>
                  </div>
                )}
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
                <div className="transform transition-all duration-300 group-hover:-translate-y-2">
                  <h3 className="text-2xl font-bold capitalize mb-2">
                    {categoryName}
                  </h3>
                  <p className="text-gray-200 mb-4">
                    {images.length} {images.length === 1 ? 'image' : 'images'}
                  </p>
                </div>
                
                <button
                  className="w-max px-6 py-2 bg-white text-gray-900 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/category/${categoryName}`);
                  }}
                >
                  Explore
                  <ArrowRight className="h-5 w-5 ml-2 inline" />
                </button>
              </div>

              {images.length > 5 && (
                <div className="absolute top-4 right-4 bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                  Popular
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/all-categories')}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Explore All Categories
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Category;