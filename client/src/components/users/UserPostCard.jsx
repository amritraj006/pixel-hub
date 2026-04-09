import { FiHeart, FiDownload, FiMessageCircle, FiX, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import toast, { Toaster } from 'react-hot-toast';
import { saveAs } from 'file-saver';
import axios from 'axios';

const UserPostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  // Comment States
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const { user } = useUser();
  const { openSignIn } = useClerk();

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/comments/${post.id}`);
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

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/comments`, payload);
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
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/comments/${commentId}`, {
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
    if (!user) {
      openSignIn();
      return;
    }
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/upload/toggle-like`, {
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
      const toastId = toast.loading('Downloading image...', {
         style: { background: '#18181b', color: '#e4e4e7', border: '1px solid #27272a' }
      });
      const downloadUrl = post.image_url?.startsWith('http') ? post.image_url : `${import.meta.env.VITE_BACKEND_URL}/uploads/${post.image_url}`;
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      saveAs(blob, post.title || 'creative-image');
      toast.success('Download completed!', { id: toastId });
    } catch (error) {
      toast.error('Failed to download image');
      console.error('Download error:', error);
    }
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#fff',
            border: '1px solid #3f3f46',
            backdropFilter: 'blur(10px)',
          },
          success: {
            icon: <FiCheck className="text-indigo-400" />,
          },
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="glass-card rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 w-full relative flex flex-col break-inside-avoid group border-zinc-800"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50">
          <div className="flex items-center gap-3">
            {post.user_avatar ? (
              <img
                src={post.user_avatar}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-zinc-800 group-hover:border-indigo-500/50 transition-colors"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
                {(post.user_name || post.uploaded_by || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col">
              <p className="text-[13px] font-semibold text-zinc-100 tracking-tight leading-tight">
                {post.user_name || post.uploaded_by || 'Anonymous'}
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} • {post.category}
              </p>
            </div>
          </div>
        </div>

        {/* Image Area */}
        <div className="w-full bg-zinc-900 flex items-center justify-center relative overflow-hidden aspect-video sm:aspect-auto sm:min-h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
          <img
            src={post.image_url?.startsWith('http') ? post.image_url : `${import.meta.env.VITE_BACKEND_URL}/uploads/${post.image_url}`}
            alt={post.title}
            onClick={() => setShowFullImage(true)}
            className="w-full h-full object-cover cursor-zoom-in transition-transform duration-700 ease-out group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/fallback.jpg';
            }}
          />
        </div>

        {/* Action Bar */}
        <div className="px-4 py-3 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center space-x-5">
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={handleLike}
              className={`text-xl transition-colors ${isLiked ? 'text-rose-500' : 'text-zinc-400 hover:text-white'}`}
              title="Like"
            >
              <FiHeart className={isLiked ? 'fill-current' : ''} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={toggleComments}
              className={`text-xl transition-colors ${showComments ? 'text-indigo-400' : 'text-zinc-400 hover:text-white'}`}
              title="Comment"
            >
              <FiMessageCircle className={showComments ? 'fill-current' : ''}/>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={handleDownload}
              className="text-xl text-zinc-400 hover:text-indigo-400 transition-colors"
              title="Download HD"
            >
              <FiDownload />
            </motion.button>
          </div>
        </div>

        {/* Caption & Likes */}
        <div className="px-4 pb-4 bg-zinc-950/80">
          <p className="font-semibold text-xs text-zinc-300 mb-1.5">{likeCount} {likeCount === 1 ? 'like' : 'likes'}</p>
          <div className="text-sm line-clamp-3 leading-relaxed">
            <span className="font-semibold text-zinc-100 mr-2">{post.uploaded_by || 'Anonymous'}</span>
            <span className="text-zinc-300">{post.title}</span>
            {post.description && <span className="text-zinc-500 text-xs block mt-1 leading-snug">{post.description}</span>}
          </div>
          <button
            onClick={toggleComments}
            className="text-xs text-zinc-500 font-medium hover:text-zinc-400 mt-2 transition-colors uppercase tracking-wider"
          >
            {showComments ? 'Hide comments' : 'View all comments'}
          </button>
        </div>

        {/* Inline Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-zinc-800 bg-zinc-950"
            >
              <div className="p-4 max-h-80 overflow-y-auto space-y-5 custom-scrollbar">
                {comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 opacity-50">
                    <FiMessageCircle className="text-2xl text-zinc-600 mb-2" />
                    <p className="text-center text-xs text-zinc-400">No comments yet. Be the first!</p>
                  </div>
                ) : (
                  comments.filter(c => !c.parent_id).map(parent => (
                    <div key={parent.id} className="space-y-3">
                      <div className="flex gap-3">
                        {parent.user_avatar ? (
                          <img src={parent.user_avatar} className="w-8 h-8 rounded-full border border-zinc-800 object-cover" alt="avatar" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {parent.user_name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="bg-zinc-900 border border-zinc-800/80 p-3 rounded-2xl rounded-tl-sm shadow-sm backdrop-blur-md">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-semibold text-xs text-zinc-200">{parent.user_name}</span>
                              <span className="text-[10px] text-zinc-500">{new Date(parent.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-zinc-400 whitespace-pre-wrap leading-relaxed">{parent.text}</p>
                          </div>
                          <div className="mt-1.5 px-1 flex gap-4 text-[10px] font-semibold">
                            {user && <button onClick={() => setReplyingTo(parent)} className="text-zinc-500 hover:text-indigo-400 transition-colors uppercase">Reply</button>}
                            {user?.id === parent.user_id && <button onClick={() => handleDeleteComment(parent.id)} className="text-zinc-600 hover:text-rose-500 transition-colors uppercase">Delete</button>}
                          </div>
                        </div>
                      </div>

                      {/* Render Replies */}
                      {comments.filter(c => c.parent_id === parent.id).length > 0 && (
                        <div className="pl-11 space-y-3 relative before:absolute before:left-6 before:top-0 before:bottom-0 before:w-px before:bg-zinc-800">
                          {comments.filter(c => c.parent_id === parent.id).map(reply => (
                            <div key={reply.id} className="flex gap-2.5 relative">
                              <div className="absolute -left-5 top-3 w-4 h-px bg-zinc-800" />
                              {reply.user_avatar ? (
                                <img src={reply.user_avatar} className="w-6 h-6 rounded-full border border-zinc-800 object-cover relative z-10 bg-zinc-900" alt="avatar" />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-[10px] font-bold shrink-0 relative z-10 border border-zinc-900">
                                  {reply.user_name.charAt(0)}
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="bg-zinc-900 border border-zinc-800/80 p-2.5 rounded-xl block">
                                  <span className="font-semibold text-[11px] text-zinc-200 mr-2">{reply.user_name}</span>
                                  <span className="text-[11px] text-zinc-400">{reply.text}</span>
                                </div>
                                {user?.id === reply.user_id && (
                                  <div className="mt-1 flex gap-3 text-[9px] font-semibold ml-1">
                                    <button onClick={() => handleDeleteComment(reply.id)} className="text-zinc-600 hover:text-rose-500 uppercase tracking-widest transition-colors">Delete</button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comment Input Box */}
        {user && showComments ? (
          <form onSubmit={handleAddComment} className="p-3 border-t border-zinc-800 bg-zinc-950 flex flex-col">
            {replyingTo && (
              <div className="flex items-center justify-between text-xs px-3 py-1.5 mb-3 text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-md">
                <span>Replying to <span className="font-semibold text-indigo-300">{replyingTo.user_name}</span></span>
                <button type="button" onClick={() => setReplyingTo(null)} className="hover:text-white p-0.5"><FiX /></button>
              </div>
            )}
            <div className="flex gap-2 items-center relative">
              <input
                type="text"
                placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full text-sm bg-zinc-900 text-white border border-zinc-800 focus:border-indigo-500/50 rounded-xl outline-none placeholder-zinc-500 pl-4 pr-16 py-2.5 transition-all"
              />
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmittingComment}
                className="absolute right-2 text-indigo-400 font-semibold text-sm hover:text-indigo-300 disabled:text-zinc-600 disabled:bg-transparent px-2 py-1 transition-colors"
              >
                {isSubmittingComment ? '...' : 'Post'}
              </button>
            </div>
          </form>
        ) : !user && showComments ? (
          <div className="p-4 border-t border-zinc-800 bg-zinc-900 text-center">
            <p className="text-zinc-500 text-xs font-medium">Log in to like or comment.</p>
          </div>
        ) : null}
      </motion.div>

      {/* Full Image Modal */}
      <AnimatePresence>
        {showFullImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 sm:p-8 backdrop-blur-xl"
            onClick={() => setShowFullImage(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowFullImage(false)}
                className="absolute -top-12  right-0 sm:-right-8 sm:-top-2 bg-black/50 border border-zinc-800 hover:bg-zinc-800 text-white rounded-full p-2.5 transition-all z-10 backdrop-blur-md"
                title="Close dialog"
              >
                <FiX className="h-5 w-5" />
              </button>

              <div className="relative group w-auto h-auto max-w-full max-h-[80vh]">
                <img
                  src={post.image_url?.startsWith('http') ? post.image_url : `${import.meta.env.VITE_BACKEND_URL}/uploads/${post.image_url}`}
                  alt={post.title}
                  className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg shadow-2xl shadow-indigo-500/10 border border-zinc-800/50"
                />
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={handleDownload}
                    className="bg-zinc-900/80 hover:bg-indigo-600 border border-zinc-700 hover:border-indigo-500 text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center space-x-2 backdrop-blur-md text-sm font-medium transition-all"
                  >
                    <FiDownload className="h-4 w-4" />
                    <span>Download</span>
                  </button>
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