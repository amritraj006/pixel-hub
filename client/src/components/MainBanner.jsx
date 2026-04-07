import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const heroImages = [
  'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
];

const slides = [
  {
    title: 'Elevate Your Digital Assets',
    description: 'Immerse yourself in a curated gallery of high-end photography tailored for modern creators.',
    cta: 'Explore Gallery',
    path: '/all-images',
    accent: 'bg-indigo-500/20'
  },
  {
    title: 'Shape the Community',
    description: 'Share your unparalleled perspective and get featured on our dynamic community feed.',
    cta: 'Start Uploading',
    path: '/upload',
    accent: 'bg-purple-500/20'
  },
  {
    title: 'Precision AI Generation',
    description: 'Breathe life into your imagination using our state-of-the-art AI generation tools.',
    cta: 'Try Generator',
    path: '/generator',
    accent: 'bg-rose-500/20'
  }
];

const MainBanner = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setCurrentSlide((prevIndex) =>
          prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        ),
      6000
    );
    return () => {
      resetTimeout();
    };
  }, [currentSlide]);

  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const goToSlide = (index) => setCurrentSlide(index);

  return (
    <section className="relative w-full h-[100vh] min-h-[600px] max-h-[1080px] overflow-hidden bg-black group/banner pt-20">
      {/* Slides Context */}
      <AnimatePresence mode="wait">
        <motion.div
           key={currentSlide}
           initial={{ opacity: 0, scale: 1.05 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 1.2, ease: "easeInOut" }}
           className="absolute inset-0"
        >
          {/* Base Image */}
          <img
            src={heroImages[currentSlide]}
            alt={slides[currentSlide].title}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            loading="eager"
          />

          {/* Premium Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-0" />
          <div className={`absolute inset-0 ${slides[currentSlide].accent} mix-blend-overlay transition-colors duration-1000 z-0`} />
          
          {/* Radial mask for soft fade at the far top edges */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_black_100%)] opacity-80" />
        </motion.div>
      </AnimatePresence>

      {/* Slide Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center relative z-20 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="max-w-3xl space-y-6"
          >
            <motion.div 
               initial={{ opacity: 0, width: 0 }}
               animate={{ opacity: 1, width: "3rem" }}
               transition={{ duration: 1, delay: 0.6 }}
               className="h-1 bg-indigo-500 rounded-full mb-4" 
            />
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white drop-shadow-2xl">
              {slides[currentSlide].title}
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-300 max-w-xl leading-relaxed drop-shadow-md">
              {slides[currentSlide].description}
            </p>
            
            <div className="flex space-x-4 pt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(slides[currentSlide].path)}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-indigo-500/25 flex items-center"
              >
                {slides[currentSlide].cta}
                <ChevronRight className="w-5 h-5 ml-2 text-indigo-400 group-hover:text-white transition-colors" />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Side Navigation Arrows (Fade in on hover of section) */}
      <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none z-30 opacity-0 group-hover/banner:opacity-100 transition-opacity duration-500">
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.15)" }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          className="pointer-events-auto p-4 rounded-full bg-black/40 border border-white/10 backdrop-blur-md transition-all duration-300"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white" strokeWidth={2} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.15)" }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          className="pointer-events-auto p-4 rounded-full bg-black/40 border border-white/10 backdrop-blur-md transition-all duration-300"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white" strokeWidth={2} />
        </motion.button>
      </div>

      {/* Premium Pagination Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-3 bg-black/50 backdrop-blur-lg border border-white/10 px-5 py-3 rounded-full">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ease-in-out ${
              index === currentSlide ? 'bg-indigo-500 w-8 shadow-[0_0_10px_rgba(99,102,241,0.8)]' : 'bg-zinc-600 hover:bg-zinc-400 w-2.5'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-zinc-500 hidden md:block">
         <motion.div 
            animate={{ y: [0, 8, 0] }} 
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center"
         >
            <span className="text-[10px] uppercase tracking-widest font-bold mb-2">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-zinc-500 to-transparent" />
         </motion.div>
      </div>
      
    </section>
  );
};

export default MainBanner;