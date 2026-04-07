import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Image as ImageIcon, Zap, Layers } from 'lucide-react';
import { useUser, SignInButton, SignUpButton } from '@clerk/clerk-react';

const GeneratorLanding = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const handleTryGenerator = () => {
    if (isSignedIn) navigate('/image-generator');
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 relative overflow-hidden">
      {/* Abstract Background Effects */}
      <div className="absolute top-0 right-0 w-[50%] h-[500px] bg-indigo-600/15 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[500px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />

      <main className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Hero Section */}
        <section className="text-center mb-32 relative z-10 pt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-10 max-w-4xl mx-auto"
          >
            <motion.div 
               animate={{ scale: [1, 1.05, 1] }} 
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-8"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-xs font-bold uppercase tracking-widest">Next-Gen AI Engine</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">
              Bring Your Imagination <br className="hidden md:block"/>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent">To Reality</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-400 font-medium leading-relaxed max-w-3xl mx-auto mb-12">
              Harness the power of our advanced neural networks to generate breathtaking, high-resolution visuals from simple text descriptions.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              {isSignedIn ? (
                <motion.button
                  onClick={handleTryGenerator}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-indigo-600 text-white rounded-full font-bold text-lg shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-indigo-500/50 transition-all flex items-center justify-center"
                >
                  <Zap className="w-5 h-5 mr-3" /> Initialize Engine
                </motion.button>
              ) : (
                <SignInButton mode="modal" afterSignInUrl="/image-generator">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 bg-indigo-600 text-white rounded-full font-bold text-lg shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-indigo-500/50 transition-all flex items-center justify-center"
                  >
                    Authenticate to Access
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </motion.button>
                </SignInButton>
              )}
            </div>
          </motion.div>
        </section>

        {/* Concept Architecture Section */}
        <section className="mb-32 relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">The Generation Pipeline</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="glass-card p-10 rounded-[2rem] border border-zinc-800 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 bg-zinc-900 border border-zinc-700 rounded-2xl flex items-center justify-center mb-8 relative z-10 shadow-xl">
                <ImageIcon className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 tracking-tight">1. Conceptualize</h3>
              <p className="text-zinc-500 font-medium leading-relaxed">
                Provide the engine with a detailed textual description. Dictate lighting, styling, atmosphere, and composition.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-10 rounded-[2rem] border border-zinc-800 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 bg-zinc-900 border border-zinc-700 rounded-2xl flex items-center justify-center mb-8 relative z-10 shadow-xl text-purple-400">
                <Layers className="w-8 h-8 text-current" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 tracking-tight">2. Synthesize</h3>
              <p className="text-zinc-500 font-medium leading-relaxed">
                Our state-of-the-art models interpret semantics and synthesize unique ultra-realistic imagery instantly.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="glass-card p-10 rounded-[2rem] border border-zinc-800 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 bg-zinc-900 border border-zinc-700 rounded-2xl flex items-center justify-center mb-8 relative z-10 shadow-xl text-rose-400">
                <ArrowRight className="w-8 h-8 text-current -rotate-45" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 tracking-tight">3. Deploy</h3>
              <p className="text-zinc-500 font-medium leading-relaxed">
                Extract high-resolution assets directly or catalog them within your personal curator history.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Global CTA */}
        <section className="relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-[3rem] p-12 md:p-20 text-center bg-zinc-900 border border-zinc-800 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] opacity-40 mix-blend-overlay" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">Begin Synthesis</h2>
              <p className="text-zinc-400 mb-10 text-lg md:text-xl font-medium">
                Step into the vanguard of digital art creation. Access the AI engine and redefine your creative workflow today.
              </p>
              
              {isSignedIn ? (
                <motion.button
                  onClick={handleTryGenerator}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-white text-black rounded-full font-bold text-lg shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all"
                >
                  Enter Station
                </motion.button>
              ) : (
                <SignUpButton mode="modal" afterSignUpUrl="/image-generator">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 bg-white text-black rounded-full font-bold text-lg shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all"
                  >
                    Acquire Authorization
                  </motion.button>
                </SignUpButton>
              )}
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default GeneratorLanding;