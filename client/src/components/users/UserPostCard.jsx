import { FiHeart, FiDownload, FiMessageCircle, FiX, FiCheck, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import toast, { Toaster } from 'react-hot-toast';
import { saveAs } from 'file-saver';
import axios from 'axios';

const UserPostCard = ({ post, onDelete }) => {
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  // Comment States
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const { user } = useUser();

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/comments/${post.id}`);
      setComments(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch comments', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmittingComment(true);
    try {
      const payload = {
        postId: post.id,
        userId: user.id,
        userName: user.fullName || user.username || 'Anonymous',
        userAvatar: user.imageUrl || '',
        text: newComment,
        parentId: replyingTo?.id || null
      };

      const res = await axios.post('http://localhost:8000/api/comments', payload);
      setComments([...comments, res.data.data]);
      setNewComment('');
      setReplyingTo(null);
    } catch (err) {
      toast.error('Failed to post comment');
      console.error(err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8000/api/comments/${commentId}`, {
        data: { userId: user.id }
      });
      setComments(comments.filter(c => c.id !== commentId && c.parent_id !== commentId));
    } catch (err) {
      toast.error('Failed to delete comment');
    }
  };

  const toggleComments = () => {
    if (!showComments) fetchComments();
    setShowComments(!showComments);
    setReplyingTo(null);
    setNewComment('');
  };

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

  const isOwner = user && (user.id === post.user_id || user.primaryEmailAddress?.emailAddress === post.uploaded_by);

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
        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow w-full mb-8 relative flex flex-col"
      >
        {/* 1. Header */}
        <div className="flex justify-between items-center p-4 bg-white">
          <div className="flex items-center">
            {user?.uploaded_by || post.user_avatar ? (
              <img
                src={user?.uploaded_by || post.user_avatar}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border border-gray-100"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm">
                {post.uploaded_by ? post.uploaded_by.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="ml-3">
              <p className="text-sm font-semibold text-gray-900 tracking-tight">
                {user?.fullName || post.uploaded_by || 'Anonymous'}
              </p>
              <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} • {post.category}</p>
            </div>
          </div>
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`p-2 rounded-full ${isDeleting ? 'text-gray-400' : 'text-gray-400 hover:text-red-500 hover:bg-gray-50'} transition-colors`}
              title="Delete post"
            >
              {isDeleting ? <FiRefreshCw className="animate-spin" /> : <FiTrash2 />}
            </button>
          )}
        </div>

        <div className="w-full bg-gray-50 border-y border-gray-100 flex items-center justify-center relative group min-h-[300px]">
          <img
            src={`http://localhost:8000/uploads/${post.image_url}`}
            alt={post.title}
            onClick={() => setShowFullImage(true)}
            className="w-full h-auto max-h-[700px] object-contain cursor-pointer transition-transform duration-500 group-hover:scale-[1.01]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/fallback.jpg';
            }}
          />
        </div>

        {/* 3. Action Bar */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`text-2xl transition-transform hover:scale-110 active:scale-95 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-700 hover:text-gray-900'
                }`}
              title="Like"
            >
              <FiHeart className={isLiked ? 'fill-current' : ''} />
            </button>
            <button
              onClick={toggleComments}
              className="text-2xl text-gray-700 hover:text-gray-900 hover:scale-110 active:scale-95 transition-transform"
              title="Comment"
            >
              <FiMessageCircle />
            </button>
            <button
              onClick={handleDownload}
              className="text-2xl text-gray-700 hover:text-gray-900 hover:scale-110 active:scale-95 transition-transform"
              title="Download HD"
            >
              <FiDownload />
            </button>
          </div>
        </div>

        {/* 4. Likes & Caption */}
        <div className="px-4 pb-2">
          <p className="font-semibold text-sm text-gray-900 mb-1">{likeCount} likes</p>
          <div className="text-sm mb-1 line-clamp-3">
            <span className="font-semibold text-gray-900 mr-2">{post.uploaded_by || 'Anonymous'}</span>
            <span className="text-gray-800 font-medium">{post.title}</span>
            {post.description && <span className="text-gray-600 block mt-0.5">{post.description}</span>}
          </div>
          <button
            onClick={toggleComments}
            className="text-sm text-gray-500 font-medium hover:text-gray-700 mt-1"
          >
            {showComments ? 'Hide comments' : 'View comments'}
          </button>
        </div>

        {/* 5. Inline Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-gray-100 bg-gray-50"
            >
              <div className="p-4 max-h-80 overflow-y-auto space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center text-sm text-gray-500 py-4">No comments yet. Be the first!</p>
                ) : (
                  comments.filter(c => !c.parent_id).map(parent => (
                    <div key={parent.id} className="space-y-2">
                      <div className="flex gap-3">
                        {parent.user_avatar ? (
                          <img src={parent.user_avatar} className="w-8 h-8 rounded-full border border-gray-200 object-cover" alt="avatar" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {parent.user_name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-sm text-gray-900">{parent.user_name}</span>
                            <span className="text-[10px] text-gray-400">{new Date(parent.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{parent.text}</p>
                          <div className="mt-2 flex gap-3 text-xs font-semibold">
                            {user && <button onClick={() => setReplyingTo(parent)} className="text-gray-500 hover:text-indigo-600">Reply</button>}
                            {user?.id === parent.user_id && <button onClick={() => handleDeleteComment(parent.id)} className="text-gray-400 hover:text-red-500">Delete</button>}
                          </div>
                        </div>
                      </div>

                      {/* Render Replies */}
                      <div className="pl-11 space-y-2">
                        {comments.filter(c => c.parent_id === parent.id).map(reply => (
                          <div key={reply.id} className="flex gap-2.5">
                            {reply.user_avatar ? (
                              <img src={reply.user_avatar} className="w-6 h-6 rounded-full border border-gray-200 object-cover" alt="avatar" />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                                {reply.user_name.charAt(0)}
                              </div>
                            )}
                            <div className="flex-1 bg-white p-2.5 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                              <span className="font-semibold text-xs text-gray-900 mr-2">{reply.user_name}</span>
                              <span className="text-[13px] text-gray-700">{reply.text}</span>
                              {user?.id === reply.user_id && (
                                <div className="mt-1 flex gap-3 text-[10px] font-semibold">
                                  <button onClick={() => handleDeleteComment(reply.id)} className="text-gray-400 hover:text-red-500">Delete</button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 6. Comment Input Box */}
        {user ? (
          <form onSubmit={handleAddComment} className="p-3 border-t border-gray-100 bg-white flex flex-col">
            {replyingTo && (
              <div className="flex items-center justify-between text-xs px-2 py-1 mb-2 text-indigo-600 bg-indigo-50 rounded">
                <span>Replying to <span className="font-bold">{replyingTo.user_name}</span></span>
                <button type="button" onClick={() => setReplyingTo(null)} className="hover:text-indigo-900 font-bold p-1"><FiX /></button>
              </div>
            )}
            <div className="flex gap-3 items-center relative">
              <input
                type="text"
                placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full text-sm bg-transparent border-none focus:ring-0 outline-none placeholder-gray-500 pl-2 pr-12 py-1"
              />
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmittingComment}
                className="absolute right-2 text-indigo-600 font-semibold text-sm hover:text-indigo-800 disabled:text-indigo-300 disabled:bg-transparent bg-transparent"
              >
                {isSubmittingComment ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
            <p className="text-gray-600 text-sm font-medium">Log in to like or comment.</p>
          </div>
        )}
      </motion.div>

      {/* Full Image Modal */}
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
              className="relative max-w-5xl w-full max-h-[90vh] flex justify-center"
            >
              <img
                src={`http://localhost:8000/uploads/${post.image_url}`}
                alt={post.title}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />

              <button
                onClick={() => setShowFullImage(false)}
                className="absolute -top-12 right-0 md:-right-12 md:top-0 bg-white/20 hover:bg-white/40 text-white rounded-full p-2.5 transition-all backdrop-blur-md"
                title="Close"
              >
                <FiX className="h-6 w-6" />
              </button>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <button
                  onClick={handleDownload}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 backdrop-blur-md font-medium transition-colors"
                >
                  <FiDownload className="h-5 w-5" />
                  <span>Download High-Res</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserPostCard;