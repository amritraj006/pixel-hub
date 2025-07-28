// components/UploadForm.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { toast, Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiImage, FiCheck, FiX, FiLoader, FiLogIn, FiCamera } from 'react-icons/fi';
import { FaCloudUploadAlt } from 'react-icons/fa';

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

  const categories = [
    'Nature',
    'Travel',
    'Food',
    'Architecture',
    'Portrait',
    'Art',
    'Technology',
    'Fashion',
    'Sports',
    'Other'
  ];

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !category || !image || !description) {
      toast.error('Please fill all fields and select an image.', {
        icon: <FiX className="text-red-500" />,
      });
      return;
    }

    setUploading(true);
    const loadingToast = toast.loading(
      <div className="flex items-center space-x-2">
        <FiLoader className="animate-spin" />
        <span>Uploading your image...</span>
      </div>,
      { duration: Infinity }
    );

    await new Promise(resolve => setTimeout(resolve, 1500));

    const data = new FormData();
    data.append('title', title);
    data.append('category', category);
    data.append('description', description);
    data.append('uploaded_by', user?.primaryEmailAddress?.emailAddress || 'anonymous');
    data.append('image', image);

    try {
      const res = await axios.post(
        'http://localhost:8000/upload/upload-image',
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      toast.dismiss(loadingToast);
      toast.success(
        <div className="flex items-center space-x-2">
          <FiCheck className="text-green-500" />
          <span>Upload successful!</span>
        </div>,
        { duration: 4000 }
      );

      setTitle('');
      setCategory('');
      setDescription('');
      setImage(null);
      setPreview(null);
      console.log(res.data);
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(
        <div className="flex items-center space-x-2">
          <FiX className="text-red-500" />
          <span>Upload failed. Please try again.</span>
        </div>,
        { duration: 4000 }
      );
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Toaster position="top-center" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full"
        >
          <div className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  duration: 3 
                }}
              >
                <FiCamera className="h-12 w-12 text-blue-500" />
              </motion.div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Join Our Creative Community</h2>
            <p className="text-gray-600 mb-6">Sign in to share your photos and connect with other creators</p>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SignInButton mode="modal">
                <button className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium flex items-center justify-center space-x-2 hover:shadow-lg transition-all">
                  <FiLogIn className="h-5 w-5" />
                  <span>Sign In to Upload</span>
                </button>
              </SignInButton>
            </motion.div>
            
            <p className="mt-4 text-sm text-gray-500">
              By signing in, you agree to our Terms of Service
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: 'bg-white shadow-lg rounded-lg',
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-extrabold text-gray-900 sm:text-4xl"
          >
            Share Your Creativity
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-xl text-gray-600"
          >
            Welcome back, {user.firstName}! Upload your latest work
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter a descriptive title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-5 py-3 text-gray-700 bg-gray-100 rounded-lg border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white transition duration-200"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-5 py-3 text-gray-700 bg-gray-100 rounded-lg border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white transition duration-200 appearance-none"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Tell us about your image"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-5 py-3 text-gray-700 bg-gray-100 rounded-lg border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white transition duration-200"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                  ref={fileInputRef}
                />

                <AnimatePresence>
                  {preview ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative group"
                    >
                      <div className="overflow-hidden rounded-lg border-2 border-dashed border-gray-300">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-64 object-cover"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition"
                      >
                        <FiX className="h-4 w-4" />
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onHoverStart={() => setIsHovered(true)}
                      onHoverEnd={() => setIsHovered(false)}
                      onClick={triggerFileInput}
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${isHovered ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                    >
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <motion.div
                          animate={{ 
                            y: isHovered ? [-5, 5, -5] : 0,
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <FaCloudUploadAlt className={`h-10 w-10 text-blue-500 ${isHovered ? 'animate-pulse' : ''}`} />
                        </motion.div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Drag and drop your image here, or click to browse
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Supports JPG, PNG up to 10MB
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={uploading}
                  className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all duration-300 ${uploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg'}`}
                >
                  {uploading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <FiLoader className="animate-spin h-5 w-5" />
                      <span>Uploading...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <FiUpload className="h-5 w-5" />
                      <span>Upload Image</span>
                    </span>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UploadForm;