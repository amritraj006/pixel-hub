import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { toast, Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiCheck, FiX, FiLoader, FiLogIn, FiCamera } from 'react-icons/fi';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UploadForm = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef(null);
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  const categories = ['Nature', 'Travel', 'Food', 'Architecture', 'Portrait', 'Art', 'Technology', 'Fashion', 'Sports', 'Other'];

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();
  const removeImage = () => {
    setImage(null); setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category || !image || !description) {
      toast.error('Please fill all fields and select an image.', { style: { background: '#18181b', color: '#fff', border: '1px solid #3f3f46' } });
      return;
    }

    setUploading(true);
    const loadingToast = toast.loading('Uploading your asset...', { style: { background: '#18181b', color: '#fff', border: '1px solid #3f3f46' } });

    await new Promise(resolve => setTimeout(resolve, 1500));

    const data = new FormData();
    data.append('title', title);
    data.append('category', category);
    data.append('description', description);
    data.append('uploaded_by', user?.primaryEmailAddress?.emailAddress || 'anonymous');
    data.append('user_name', user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress || 'Anonymous');
    data.append('user_avatar', user?.imageUrl || '');
    data.append('image', image);

    try {
  await axios.post(`${import.meta.env.VITE_BACKEND_URL}/upload/upload-image`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  toast.dismiss(loadingToast);

  toast.success('Upload successful!', {
    style: { background: '#18181b', color: '#fff', border: '1px solid #3f3f46' }
  });

  // Reset form
  setTitle('');
  setCategory('');
  setDescription('');
  setImage(null);
  setPreview(null);

  // ⏳ Wait, then navigate + scroll
  setTimeout(() => {
    navigate('/post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 1500); // adjust time (ms) if needed

} catch (err) {
      toast.dismiss(loadingToast);
      toast.error('Upload failed. Please try again.', { style: { background: '#18181b', color: '#fff', border: '1px solid #3f3f46' } });
    } finally {
      setUploading(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        <Toaster position="top-center" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5, ease: "easeOut" }}
           className="glass-card rounded-[2rem] overflow-hidden max-w-md w-full relative z-10 border-zinc-800 p-10 text-center shadow-2xl shadow-indigo-500/10"
        >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="mx-auto w-20 h-20 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center mb-6 shadow-xl">
               <FiCamera className="h-8 w-8 text-indigo-400" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Join the Curators</h2>
            <p className="text-zinc-400 mb-8 font-medium">Log in to publish your artwork and contribute to the premier creator gallery.</p>
            
            <SignInButton mode="modal">
               <button className="w-full py-4 px-6 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-indigo-500/20 transition-all hover:-translate-y-1">
                 <FiLogIn className="h-5 w-5" />
                 <span>Authenticate to Continue</span>
               </button>
            </SignInButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden pb-12">
      <Toaster position="top-center" />
      <div className="absolute top-0 right-1/4 w-[40%] h-[400px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent mb-3 tracking-tight">Publish Asset</h1>
          <p className="text-lg text-zinc-500 font-medium tracking-wide">Share your creative vision with the community.</p>
        </div>

        <motion.div className="glass-card rounded-[2rem] shadow-2xl border border-zinc-800/80 overflow-hidden">
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Left Column */}
                 <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Artwork Title</label>
                      <input type="text" placeholder="e.g. Neon Cyberpunk City" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition duration-300" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Category</label>
                      <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition duration-300 appearance-none">
                        <option value="" className="text-zinc-500">Select thematic category</option>
                        {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Description</label>
                      <textarea placeholder="Describe the aesthetic, mood, or process..." value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="w-full px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition duration-300 resize-none" />
                    </div>
                 </div>

                 {/* Right Column: Image */}
                 <div className="flex flex-col h-full min-h-[300px]">
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Media File</label>
                    <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" ref={fileInputRef} />
                    
                    <div className="flex-1 bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-2xl relative overflow-hidden group">
                       <AnimatePresence mode="wait">
                         {preview ? (
                           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full absolute inset-0">
                             <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button type="button" onClick={removeImage} className="bg-rose-500 text-white rounded-full p-4 shadow-xl hover:bg-rose-600 transition-transform hover:scale-110">
                                   <FiX className="w-6 h-6" />
                                </button>
                             </div>
                           </motion.div>
                         ) : (
                           <motion.div 
                              onClick={triggerFileInput}
                              onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}
                              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-zinc-800/30"
                           >
                              <FaCloudUploadAlt className={`h-12 w-12 mb-4 transition-all duration-500 ${isHovered ? 'text-indigo-400 scale-110' : 'text-zinc-600'}`} />
                              <p className="text-sm font-semibold text-zinc-300">Click or Drag Image Here</p>
                              <p className="text-xs text-zinc-600 mt-2 font-medium">JPG, PNG, WEBP (Max 10MB)</p>
                           </motion.div>
                         )}
                       </AnimatePresence>
                    </div>
                 </div>
              </div>

              <div className="pt-6 border-t border-zinc-800/50">
                <button type="submit" disabled={uploading} className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-xl flex items-center justify-center space-x-3 ${uploading ? 'bg-zinc-800 cursor-not-allowed text-zinc-500' : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/25'}`}>
                   {uploading ? (
                      <><FiLoader className="animate-spin h-5 w-5" /> <span>Transmitting...</span></>
                   ) : (
                      <><FiUpload className="h-5 w-5" /> <span>Publish to Gallery</span></>
                   )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UploadForm;