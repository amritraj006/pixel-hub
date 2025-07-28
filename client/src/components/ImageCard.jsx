// src/components/ImageCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ShieldCheck } from 'lucide-react';

const ImageCard = ({ image }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/category/${image.category}/${encodeURIComponent(image.title.toLowerCase().replace(/\s+/g, '-'))}`);
  };

  return (
    <div 
      className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 ease-in-out transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Admin badge */}
      
        <div className="absolute top-2 right-2 z-10 flex items-center bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
          <ShieldCheck size={14} className="mr-1 text-blue-600" />
          Admin
        </div>
   

      <div className="aspect-w-4 aspect-h-3">
        <img 
          src={image.src} 
          alt={image.title} 
          className="w-full h-64 object-cover transition-all duration-700 ease-in-out group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Overlay with buttons */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-between p-4 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="space-y-3 transform transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <h3 className="font-bold text-xl text-white">{image.title}</h3>
          <button
            onClick={handleViewDetails}
            className="flex items-center px-4 py-2 bg-white/90 text-gray-900 rounded-full font-medium hover:bg-white transition-all duration-300 transform hover:scale-[1.02]"
          >
            <Eye size={18} className="mr-2" />
            View Details
          </button>
        </div>
      </div>

      {/* Always visible title on card bottom */}
      <div className="p-4 bg-white transition-all duration-300 group-hover:bg-gray-50">
        <div className="flex justify-between items-center">
          <p className="font-medium text-gray-800 truncate">{image.title}</p>
          {image.isAdmin && (
            <ShieldCheck size={16} className="text-blue-600" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCard;