import React, { useEffect } from 'react';
import { imagesByCategory } from '../assets/images';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Category = () => {
  const categories = Object.entries(imagesByCategory).slice(0, 6); // Show only 6 categories on home
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="relative py-24">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <motion.div 
           initial={{ opacity: 0, y: -20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-zinc-100 to-zinc-500 bg-clip-text text-transparent mb-5 tracking-tight">
            Curated Collections
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Explore stunning visuals across various themes tailored for endless inspiration.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          {categories.map(([categoryName, images], index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={categoryName}
              className="group relative overflow-hidden rounded-2xl glass-card transition-all duration-500 cursor-pointer border-zinc-800 hover:border-indigo-500/50"
              onClick={() => navigate(`/category/${categoryName}`)}
            >
              <div className="relative h-72 w-full bg-zinc-900 overflow-hidden">
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[0].src}
                      alt={images[0].title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 opacity-70 group-hover:opacity-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-300" />
                  </>
                ) : (
                  <div className="w-full h-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                    <span className="text-zinc-600 font-medium">Coming Soon</span>
                  </div>
                )}
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10 pointer-events-none">
                <div className="transform transition-transform duration-500 group-hover:-translate-y-4">
                  <h3 className="text-2xl font-bold capitalize mb-1 text-zinc-100 tracking-tight">
                    {categoryName}
                  </h3>
                  <p className="text-indigo-400 text-sm font-medium">
                    {images.length} {images.length === 1 ? 'Asset' : 'Assets'}
                  </p>
                </div>
                
                <button
                  className="w-max px-6 py-2.5 bg-white text-black rounded-full font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/category/${categoryName}`);
                  }}
                >
                  Explore Theme
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>

              {images.length > 5 && (
                <div className="absolute top-4 right-4 bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xl">
                  Popular
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button
            onClick={() => navigate('/all-categories')}
            className="inline-flex items-center px-8 py-3.5 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-full font-medium transition-all duration-300 hover:border-indigo-400 hover:text-white hover:bg-zinc-800 shadow-xl group"
          >
            Browse All Categories
            <ArrowRight className="h-4 w-4 ml-3 text-zinc-500 group-hover:text-indigo-400 transition-colors group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Category;