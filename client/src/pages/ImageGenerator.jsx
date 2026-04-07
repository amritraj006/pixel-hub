import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { FiDownload, FiTrash2, FiClock, FiSettings, FiImage, FiCpu, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { Toaster, toast } from 'sonner';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const { isSignedIn, user } = useUser();

  const fetchHistory = async () => {
    if (!isSignedIn || !user) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ai/history/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  React.useEffect(() => {
    if (isSignedIn && user) fetchHistory();
  }, [isSignedIn, user]);

  const generateImage = async () => {
    if (!isSignedIn) return;
    if (!prompt.trim()) { toast.error('Enter a valid prompt'); return; }

    setLoading(true); setImage(null); setDownloadProgress(0);

    try {
      // Simulate progress
      await new Promise(resolve => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 5; setDownloadProgress(Math.min(progress, 80));
          if (progress >= 80) { clearInterval(interval); resolve(); }
        }, 100);
      });

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ai/generate-image`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), userId: user.id }),
      });

      if (!response.ok) throw new Error('API Request Failed');

      const data = await response.json();
      setDownloadProgress(100);
      setImage(data.imageUrl);
      setHistory(prev => [data.data, ...prev]);

      setTimeout(() => setDownloadProgress(0), 300);
    } catch (error) {
      toast.error('Synthesis failed. Adjust parameters and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); generateImage(); }
  };

  const downloadImage = async () => {
    if (!image) return;
    try {
      toast.loading('Extracting asset...');
      setDownloadProgress(0);
      const response = await fetch(image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = `synthesis-${Date.now()}.jpg`;
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      toast.dismiss(); toast.success('Extraction complete');
    } catch (err) {
      toast.dismiss(); toast.error('Download failed');
    }
  };

  const deleteHistoryItem = async (id) => {
    if (!window.confirm('Purge record?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ai/history/${id}`, {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      if (res.ok) setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) {}
  };

  return (
    <div className="min-h-screen bg-black pt-24 relative overflow-hidden flex flex-col pb-6">
      <Toaster theme="dark"  />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black pointer-events-none" />

      {/* Embedded Custom Header */}
      <div className="absolute top-0 left-0 w-full z-50 h-20 flex items-center bg-black/40 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group transition-all duration-300">
            <div className="relative flex items-center justify-center w-10 h-10 bg-indigo-500/10 rounded-xl border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all">
              <span className="text-xl group-hover:rotate-12 transition-transform">📷</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent tracking-tight">
              PixelHub
            </span>
          </Link>
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-10 h-10 border border-zinc-800" } }} />
          ) : (
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-500 transition-colors">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </div>

      <div className={`max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6 relative z-10 transition-all duration-500`}>
        
        {/* Main Interface Window */}
        <div className={`flex-1 flex flex-col gap-6 ${showHistory ? 'lg:w-3/4' : 'w-full'}`}>
          <div className="flex justify-between items-end mb-4">
             <div>
               <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight flex items-center gap-4 mb-2">
                 Neural Synthesis <span className="text-[10px] uppercase bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20 tracking-widest">Active</span>
               </h1>
               <p className="text-zinc-500 font-medium tracking-wide">
                 Input parameters in natural language to compile high-fidelity graphics.
               </p>
             </div>
             {isSignedIn && (
               <button onClick={() => setShowHistory(!showHistory)} className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-zinc-300 rounded-xl hover:bg-zinc-800 border border-zinc-800 transition-colors text-sm font-bold shadow-lg">
                 <FiClock /> {showHistory ? 'Hide Terminal' : 'View Terminal Log'}
               </button>
             )}
          </div>

          <div className="glass-card rounded-[2rem] border border-zinc-800 p-6 md:p-10 shadow-2xl relative overflow-hidden flex flex-col min-h-[400px]">
             
             {/* Input Area */}
             <div className="relative mb-6">
                <textarea
                  placeholder="Initiate prompt sequence. (e.g. A hyper-realistic obsidian monolith in a vivid neon desert, 8k resolution, cinematic lighting...)"
                  value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={handleKeyPress}
                  disabled={!isSignedIn || loading}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-2xl p-6 text-lg focus:outline-none focus:border-indigo-500/50 shadow-inner resize-none placeholder-zinc-700 min-h-[160px]"
                />
                {!isSignedIn && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <SignInButton mode="modal">
                      <button className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg flex items-center gap-2">
                        <FiCpu /> Authenticate to Initialize
                      </button>
                    </SignInButton>
                  </div>
                )}
             </div>

             {/* Action Bar */}
             <div className="flex justify-end border-b border-zinc-800/50 pb-8 mb-8">
               <button 
                 onClick={generateImage} disabled={loading || !isSignedIn}
                 className={`flex items-center px-10 py-4 rounded-xl font-bold text-white transition-all overflow-hidden relative shadow-xl ${loading || !isSignedIn ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700' : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/25'}`}
               >
                  {loading ? (
                    <span className="flex items-center z-10"><FiLoader className="animate-spin mr-3" /> Processing... {downloadProgress}%</span>
                  ) : <span className="flex items-center gap-3 z-10"><FiCpu /> Compile Image</span>}
                  
                  {loading && <div className="absolute left-0 top-0 h-full bg-indigo-400/20" style={{ width: `${downloadProgress}%` }} />}
               </button>
             </div>

             {/* Output Area */}
             <div className="flex-1 flex flex-col justify-center items-center">
                <AnimatePresence mode="wait">
                  {image ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-full flex flex-col items-center gap-6">
                       <div className="rounded-2xl overflow-hidden shadow-2xl relative group bg-black max-w-4xl mx-auto w-full border border-zinc-800">
                         <img src={image} alt="Generated output" className="w-full object-contain max-h-[60vh] z-10 relative" />
                         <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm gap-4 z-20">
                            <button onClick={downloadImage} className="px-6 py-3 bg-white text-black font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform"><FiDownload /> Extract</button>
                         </div>
                       </div>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-600 flex flex-col items-center text-center p-10 max-w-md">
                       <FiImage className="w-16 h-16 mb-4 text-zinc-800" />
                       <h3 className="font-bold text-zinc-500 text-xl tracking-tight mb-2">Output Receiver Empty</h3>
                       <p className="text-sm font-medium">Input parameters and compile to view generated asset.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>

          </div>
        </div>

        {/* History Terminal (Right Panel) */}
        <AnimatePresence>
          {showHistory && isSignedIn && (
            <motion.div 
              initial={{ opacity: 0, x: 20, width: 0 }} 
              animate={{ opacity: 1, x: 0, width: '25%' }} 
              exit={{ opacity: 0, x: 20, width: 0 }}
              className="lg:flex hidden h-[calc(100vh-140px)] sticky top-28 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex-col shadow-2xl"
            >
              <div className="p-5 border-b border-zinc-800 bg-zinc-950 flex justify-between items-center">
                 <h3 className="font-bold text-white text-sm tracking-widest uppercase flex items-center gap-2">
                   <FiClock className="text-indigo-500" /> Terminal Log
                 </h3>
                 <span className="text-[10px] font-bold text-zinc-500">{history.length} FILES</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {history.length === 0 ? (
                  <div className="text-center text-zinc-600 mt-10 text-sm font-medium">Log empty. Initiate synthesis.</div>
                ) : (
                  history.map(item => (
                    <div key={item.id} onClick={() => { setImage(item.image_url?.startsWith('http') ? item.image_url : `${import.meta.env.VITE_BACKEND_URL}/uploads/${item.image_url}`); setPrompt(item.prompt); }} className="relative group cursor-pointer border border-zinc-800 rounded-xl overflow-hidden bg-black aspect-square">
                       <img src={item.image_url?.startsWith('http') ? item.image_url : `${import.meta.env.VITE_BACKEND_URL}/uploads/${item.image_url}`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-3 pointer-events-none">
                          <p className="text-[10px] text-zinc-300 line-clamp-2 uppercase tracking-wide font-medium leading-tight">{item.prompt}</p>
                       </div>
                       <button onClick={(e) => { e.stopPropagation(); deleteHistoryItem(item.id); }} className="absolute top-2 right-2 bg-black/60 rounded-md p-1.5 opacity-0 group-hover:opacity-100 hover:text-rose-500 text-zinc-400 transition-all shadow-md z-10 border border-zinc-700">
                          <FiTrash2 className="w-3 h-3" />
                       </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default ImageGenerator;
