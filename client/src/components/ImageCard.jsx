import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const ImageCard = ({ image }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/category/${image.category}/${encodeURIComponent(image.title.toLowerCase().replace(/\s+/g, '-'))}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "100px" }}
      className="group relative rounded-2xl overflow-hidden glass-card transition-all duration-500 ease-out transform hover:-translate-y-2 break-inside-avoid shadow-black/50 hover:shadow-indigo-500/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Admin badge */}
      <div className="absolute top-3 right-3 z-10 flex items-center bg-black/60 backdrop-blur-md text-zinc-100 px-3 py-1.5 rounded-full text-xs font-semibold border border-zinc-700 shadow-xl">
        <ShieldCheck size={14} className="mr-1.5 text-indigo-400" />
        Admin
      </div>

      <div className="aspect-w-4 aspect-h-3 w-full bg-zinc-900 relative">
        <img 
          src={image.src} 
          alt={image.title} 
          className="w-full h-72 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Soft overlay that is always slightly visible at bottom for text contrast, and full on hover */}
        <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${isHovered ? 'opacity-100 bg-black/40' : 'opacity-100 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent'}`} />
      </div>

      {/* Overlay Content (Revealed on hover) */}
      <div className={`absolute inset-0 flex flex-col justify-end p-5 transition-all duration-500 z-20 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="space-y-4">
          <button
            onClick={handleViewDetails}
            className="w-full flex items-center justify-center px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl font-medium transition-all duration-300 shadow-lg group/btn"
          >
            <Eye size={18} className="mr-2 group-hover/btn:scale-110 transition-transform" />
            View Details
          </button>
        </div>
      </div>

      {/* Info Bar (Always visible) */}
      <div className="p-4 bg-zinc-950/50 backdrop-blur-lg border-t border-zinc-800/80">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-zinc-100 truncate tracking-tight text-sm">
            {image.title}
          </p>
          {image.isAdmin && (
            <div className="bg-indigo-500/10 p-1.5 rounded-lg border border-indigo-500/20">
              <ShieldCheck size={14} className="text-indigo-400" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ImageCard;