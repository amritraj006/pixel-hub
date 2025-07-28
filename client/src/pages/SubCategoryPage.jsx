// src/pages/SubCategoryPage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { imagesByCategory } from '../assets/images';
import ImageCard from '../components/ImageCard';

const SubCategoryPage = () => {
  const { subcategory } = useParams();
  const navigate = useNavigate();
  const images = imagesByCategory[subcategory] || [];

  

  return (
    <div className="pt-24 px-6 md:px-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 capitalize">
            {subcategory} Collection
          </h2>
          <p className="text-lg text-gray-600">
            {images.length} stunning {subcategory} images
          </p>
        </div>

        {/* Image Grid */}
        {images.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
              {images.map((img) => (
                <ImageCard 
                  key={img.imageId} 
                  image={img} 
                  
                />
              ))}
            </div>

            {/* Back to Gallery Button */}
            <div className="text-center mb-16">
              <button
                onClick={() => navigate('/all-images')}
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Explore All Images
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No images found</h3>
            <p className="text-gray-500 mb-6">This category doesn't contain any images yet.</p>
            <button
              onClick={() => navigate('/all-images')}
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:scale-105"
            >
              Browse All Images
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubCategoryPage;