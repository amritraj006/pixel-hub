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
    <section className="py-24 px-6 md:px-12 lg:px-24 min-h-screen relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-[40%] h-[400px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-6">
            <Grid className="w-4 h-4 mr-2" />
            <span className="text-xs font-bold uppercase tracking-widest">Library</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-zinc-100 to-zinc-500 bg-clip-text text-transparent mb-5 tracking-tight">
            Complete Theme Catalog
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto font-medium">
            Dive deep into our full spectrum of curated visuals and thematic collections.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
          {categories.map(([categoryName, images], index) => (
            <motion.div
              key={categoryName}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-2xl glass-card transition-all duration-300 h-full cursor-pointer hover:border-indigo-500/30"
              onClick={() => navigate(`/category/${categoryName}`)}
            >
              <div className="relative h-64 w-full bg-zinc-900 border-b border-zinc-800">
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[0].src}
                      alt={images[0].title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-60 group-hover:opacity-90"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-80" />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-zinc-600 font-medium">Coming Soon</span>
                  </div>
                )}
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-6 z-10 pointer-events-none">
                <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                  <h3 className="text-xl font-bold capitalize mb-1 text-zinc-100 tracking-tight">
                    {categoryName}
                  </h3>
                  <p className="text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                    {images.length} {images.length === 1 ? 'Asset' : 'Assets'}
                  </p>
                </div>
                
                <button
                  className="w-max px-4 py-2 mt-3 bg-white text-black rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-[0_0_15px_rgba(255,255,255,0.4)] pointer-events-auto flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/category/${categoryName}`);
                  }}
                >
                  Explore
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>

              {images.length > 10 && (
                <div className="absolute top-4 right-4 bg-indigo-600/20 backdrop-blur-md border border-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl">
                  Featured
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16 p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800"
        >
          <p className="text-zinc-400 mb-6 font-medium text-lg">
            Looking for something specific?
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="inline-flex items-center px-8 py-3 bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-full font-semibold hover:bg-zinc-700 hover:text-white transition-all duration-300 shadow-xl"
          >
            Request a Custom Collection
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default AllCategory;