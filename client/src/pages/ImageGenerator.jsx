import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  UserButton,
  useUser,
  SignInButton,
  SignUpButton 
} from '@clerk/clerk-react';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPromptFocused, setIsPromptFocused] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isHoveringGenerate, setIsHoveringGenerate] = useState(false);
  const { isSignedIn } = useUser();

  const {user} = useUser();

  const generateImage = async () => {
    if (!isSignedIn) return;
    
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }
    
    setLoading(true);
    setImage(null);
    setError('');

    try {
      const encodedPrompt = encodeURIComponent(prompt.trim());
      const timestamp = Date.now();
      
      await new Promise(resolve => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 5;
          setDownloadProgress(Math.min(progress, 80));
          if (progress >= 80) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });
      
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${timestamp}&model=flux&nologo=true`;
      
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setDownloadProgress(100);
          setTimeout(() => {
            setDownloadProgress(0);
            resolve();
          }, 300);
        };
        img.onerror = reject;
        img.src = imageUrl;
      });
      
      setImage(imageUrl);
      
    } catch (error) {
      console.error('Error generating image:', error);
      setError('Failed to generate image. Please try again with a different prompt.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateImage();
    }
  };

  const downloadImage = async () => {
    if (!image) return;
    
    try {
      setDownloadProgress(0);
      const response = await fetch(image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-generated-${prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      
      const reader = new FileReader();
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          setDownloadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
      reader.onloadend = () => {
        setTimeout(() => setDownloadProgress(0), 500);
      };
      reader.readAsDataURL(blob);
      
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
      setError('Download failed. Please try again.');
    }
  };

  const generateNewVariation = () => {
    if (prompt.trim()) {
      generateImage();
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 group transition-all duration-300"
            >
              <motion.div 
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="text-2xl"
              >
                📷
              </motion.div>
              <span className="text-xl font-bold hidden sm:inline-block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                GalleryHub
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-gray-600 hover:text-indigo-600 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all"
                  >
                    Sign Up
                  </motion.button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl pt-24 mx-auto px-6 py-8">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              AI Image Generator
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
              {user.firstName}, Transform your ideas into stunning visuals with our AI-powered image generation
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-10 transition-all duration-300 hover:shadow-3xl"
          >
            <div className="p-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="prompt" className="block text-lg font-medium text-gray-700 mb-3">
                    Describe Your Vision
                  </label>
                  <motion.div 
                    animate={{
                      borderColor: isPromptFocused ? '#7c3aed' : '#e5e7eb',
                      boxShadow: isPromptFocused ? '0 0 0 3px rgba(124, 58, 237, 0.1)' : 'none'
                    }}
                    className="relative"
                  >
                    <textarea
                      id="prompt"
                      placeholder="Describe anything you can imagine...\nExamples:\n• A futuristic cityscape at sunset\n• A portrait of a cyberpunk samurai\n• A magical forest with glowing mushrooms"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyPress={handleKeyPress}
                      onFocus={() => setIsPromptFocused(true)}
                      onBlur={() => setIsPromptFocused(false)}
                      className="w-full p-5 border-2 border-gray-200 rounded-xl focus:outline-none resize-none transition-all duration-200 text-gray-700 bg-gray-50"
                      rows="5"
                      maxLength="500"
                      disabled={!isSignedIn}
                    />
                    {!isSignedIn && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
                        <SignInButton mode="modal">
                          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                            Sign In to Generate
                          </button>
                        </SignInButton>
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-2 px-1">
                      <span className="text-sm text-gray-400">
                        {prompt.length}/500 characters
                      </span>
                      <span className="text-sm text-gray-400 hidden md:block">
                        Press Enter to generate
                      </span>
                    </div>
                  </motion.div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <motion.button
                    onClick={generateImage}
                    onHoverStart={() => setIsHoveringGenerate(true)}
                    onHoverEnd={() => setIsHoveringGenerate(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex-1 py-4 px-8 rounded-xl font-semibold text-lg overflow-hidden ${
                      loading 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : isSignedIn 
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                          : 'bg-gray-300 cursor-not-allowed'
                    }`}
                    disabled={loading || !isSignedIn}
                  >
                    {loading && (
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${downloadProgress}%` }}
                        className="absolute top-0 left-0 h-full bg-indigo-500 bg-opacity-30 transition-all duration-300"
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-center">
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating ({downloadProgress}%)
                        </>
                      ) : isSignedIn ? (
                        <>
                          <AnimatePresence>
                            {isHoveringGenerate && (
                              <motion.span 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="absolute -left-2"
                              >
                                ✨
                              </motion.span>
                            )}
                          </AnimatePresence>
                          Generate Image
                          <AnimatePresence>
                            {isHoveringGenerate && (
                              <motion.span 
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="absolute -right-2"
                              >
                                ✨
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        'Sign In to Generate'
                      )}
                    </span>
                  </motion.button>
                  
                  {image && (
                    <motion.button
                      onClick={generateNewVariation}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                      disabled={loading || !isSignedIn}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      New Variation
                    </motion.button>
                  )}
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-600 font-medium">{error}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {image && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-10"
            >
              <div className="p-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                  <h3 className="text-2xl font-bold text-gray-800">Your Generated Masterpiece</h3>
                  <div className="flex gap-3">
                    <motion.button
                      onClick={downloadImage}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-md"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Download
                    </motion.button>
                    {downloadProgress > 0 && downloadProgress < 100 && (
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">Downloading...</span>
                        <span>{downloadProgress}%</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-center mb-8">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative group overflow-hidden rounded-xl"
                  >
                    <img 
                      src={image} 
                      alt={`AI Generated: ${prompt}`}
                      className="rounded-xl shadow-lg max-w-full h-auto transition-all duration-500 group-hover:scale-102"
                      style={{ maxHeight: '600px' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <p className="text-white text-lg font-medium truncate">"{prompt}"</p>
                    </div>
                  </motion.div>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-gray-100">
                  <p className="text-gray-700 font-medium mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Prompt Used:
                  </p>
                  <p className="text-gray-600 pl-7">"{prompt}"</p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div 
            variants={itemVariants}
            className="mt-12 text-center"
          >
            <div className="bg-white rounded-xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Pro Tips for Better Results
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-indigo-500 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-600"><strong className="text-gray-800">Be Specific:</strong> Include details about style, colors, mood, and composition.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-indigo-500 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-600"><strong className="text-gray-800">Art Styles:</strong> Try "oil painting", "anime style", "photorealistic", "watercolor".</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-indigo-500 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-600"><strong className="text-gray-800">Add Context:</strong> Mention the setting, time of day, weather conditions.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-indigo-500 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-600"><strong className="text-gray-800">Lighting:</strong> Use terms like "dramatic lighting", "soft glow", "neon lights".</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-indigo-500 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-600"><strong className="text-gray-800">Quality Words:</strong> Add "high resolution", "4K", "detailed", "ultra-realistic".</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-indigo-500 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-600"><strong className="text-gray-800">Perspective:</strong> Try "close-up", "wide angle", "aerial view", "macro shot".</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ImageGenerator;