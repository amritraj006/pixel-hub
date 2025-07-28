import { FiHeart, FiDownload, FiEye, FiX, FiCheck, FiTrash2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import toast, { Toaster } from 'react-hot-toast';
import { saveAs } from 'file-saver';
import axios from 'axios';

const UserPostCard = ({ post, onDelete }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [showFullImage, setShowFullImage] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useUser();

  const handleLike = async () => {
    try {
      const res = await axios.post('http://localhost:8000/upload/toggle-like', {
        imageId: post.id,
        userId: user.id,
      });

      if (res.data.liked) {
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
        toast.success('Liked!');
      } else {
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
        toast.success('Unliked!');
      }
    } catch (err) {
      console.error('Like error:', err);
      toast.error('Failed to update like');
    }
  };

  const handleDownload = async () => {
    try {
      const toastId = toast.loading('Downloading image...');
      const response = await fetch(`http://localhost:8000/uploads/${post.image_url}`);
      const blob = await response.blob();
      saveAs(blob, post.title || 'creative-image');
      toast.success('Download completed!', { id: toastId });
    } catch (error) {
      toast.error('Failed to download image');
      console.error('Download error:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    setIsDeleting(true);
    try {
      const toastId = toast.loading('Deleting post...');
      await axios.delete(`http://localhost:8000/upload/delete-post/${post.id}`);
      toast.success('Post deleted successfully', { id: toastId });
      if (onDelete) onDelete(post.id);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete post');
      setIsDeleting(false);
    }
  };

  const toggleFullImage = () => {
    setShowFullImage(!showFullImage);
  };

  const isOwner = user && (user.id === post.user_id || user.primaryEmailAddress.email === post.uploaded_by);

  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#4F46E5',
            color: '#fff',
          },
          success: {
            icon: <FiCheck className="text-green-300" />,
          },
          loading: {
            duration: 5000,
          }
        }}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5 }}
        className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 relative"
      >
        {isOwner && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            disabled={isDeleting}
            className={`absolute top-2 left-2 z-10 p-2 rounded-full ${isDeleting ? 'bg-gray-300' : 'bg-red-500 hover:bg-red-600'} text-white shadow-md transition-colors`}
            title="Delete post"
          >
            {isDeleting ? <FiRefreshCw className="animate-spin" /> : <FiTrash2 />}
          </motion.button>
        )}

        <div className="relative group">
          <img
            src={`http://localhost:8000/uploads/${post.image_url}`}
            alt={post.title}
            className="w-full h-64 object-cover cursor-pointer transition-all duration-300 group-hover:scale-105 transform origin-center"
            onClick={toggleFullImage}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/fallback.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                toggleFullImage();
              }}
              className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow-md backdrop-blur-sm"
              title="View full size"
            >
              <FiEye className="text-gray-800" />
            </motion.button>
            <div className="w-full">
              <h3 className="text-white font-medium text-lg truncate">{post.title}</h3>
              <p className="text-white/90 text-sm line-clamp-1">{post.description}</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center mb-3">
            {user?.uploaded_by ? (
              <img 
                src={user.uploaded_by} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
                {post.uploaded_by ? post.uploaded_by.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {user?.fullName || post.uploaded_by || 'Anonymous'}
              </p>
              <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-1 line-clamp-1">{post.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.description}</p>
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className={`p-2 rounded-full flex items-center space-x-1 ${
                  isLiked ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                } transition-colors duration-200`}
                title="Like"
              >
                <FiHeart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{likeCount}</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleDownload}
                className="p-2 rounded-full text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 transition-colors duration-200 group relative"
                title="Download"
              >
                <FiDownload className="h-5 w-5" />
                <span className="sr-only">Download</span>
              </motion.button>
            </div>

            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full shadow-sm">
              {post.category}
            </span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showFullImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full max-h-[90vh]"
            >
              <img
                src={`http://localhost:8000/uploads/${post.image_url}`}
                alt={post.title}
                className="w-full h-full object-contain max-h-[80vh] rounded-lg"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleFullImage}
                className="absolute -top-12 right-0 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all"
              >
                <FiX className="h-6 w-6" />
              </motion.button>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                {isOwner && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      toggleFullImage();
                      handleDelete();
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full shadow-lg flex items-center space-x-2"
                  >
                    <FiTrash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full shadow-lg flex items-center space-x-2"
                >
                  <FiDownload className="h-4 w-4" />
                  <span>Download</span>
                </motion.button>
              </div>
              <div className="absolute top-4 left-4 right-4 bg-black/50 text-white p-4 rounded-lg backdrop-blur-sm">
                <h3 className="font-bold text-lg">{post.title}</h3>
                <p className="text-sm opacity-90">{post.description}</p>
                <div className="flex items-center mt-2 space-x-2 text-xs opacity-80">
                  <span>By {user?.fullName || post.uploaded_by || 'Anonymous'}</span>
                  <span>•</span>
                  <span>{new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-full">{post.category}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserPostCard;