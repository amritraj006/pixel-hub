import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Bell, Heart, MessageCircle, CheckCircle2, X } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const { user, isSignedIn } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      fetchNotifications();
    }
  }, [isSignedIn, user]);

  useEffect(() => {
    if (socket) {
      socket.on('new-notification', (notification) => {
        setNotifications((prev) => {
          // Prevent duplicates if already fetched
          if (prev.find(n => n.id === notification.id)) return prev;
          return [notification, ...prev];
        });
      });
      return () => socket.off('new-notification');
    }
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const email = user.primaryEmailAddress.emailAddress;
      const clerkId = user.id;
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/notifications?userId=${email}&clerkId=${clerkId}`);
      setNotifications(res.data.data);

      // Mark as read after fetching
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/notifications/read`, { userId: email, clerkId: clerkId });
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      const clerkId = user?.id;
      if (!email && !clerkId) return;

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/notifications/clear-all`, { userId: email, clerkId: clerkId });
      setNotifications([]);
    } catch (err) {
      console.error('Failed to clear notifications:', err);
    }
  };

  const deleteSingleNotification = async (e, id) => {
    e.stopPropagation(); // Prevent navigation to post
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      const clerkId = user?.id;
      if ((!email && !clerkId) || !id) return;

      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/notifications/${id}?userId=${email}&clerkId=${clerkId}`);
      setNotifications((prev) => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  /**
   * Navigate to the post page.
   * - For like notifications  → open /post and scroll to/highlight that post
   * - For comment notifications → open comments panel AND pre-fill a reply
   */
  const handleNotifClick = (notif) => {
    if (!notif.post_id) return;

    if (notif.type === 'comment' || notif.type === 'reply') {
      navigate('/post', {
        state: {
          targetPostId: notif.post_id,
          openComments: true,
          parentId: notif.comment_id, // Pass the parent ID so card can set replyingTo correctly
          replyTo: {
            sender_name: notif.sender_name,
            comment_text: notif.message, // the stored comment text
          },
        },
      });
    } else {
      // Like notification — just scroll to that post
      navigate('/post', {
        state: {
          targetPostId: notif.post_id,
          openComments: false,
        },
      });
    }
  };

  if (!isSignedIn) return null;

  return (
    <div className="pt-24 px-6 md:px-12 lg:px-24 min-h-screen relative overflow-hidden bg-black">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-[40%] h-[400px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-end border-b border-zinc-800/50 pb-6"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent tracking-tight flex items-center gap-3">
              <Bell className="w-8 h-8 text-indigo-400" />
              Notifications
            </h1>
            <p className="text-sm text-zinc-500 mt-2 font-medium">Activity on your posts</p>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </motion.div>

        {loading ? (
          <div className="flex flex-col space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-zinc-900/50 rounded-2xl animate-pulse border border-zinc-800/50" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 glass-card rounded-[2rem] border border-zinc-800 shadow-xl"
          >
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border border-zinc-800">
              <Bell className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-zinc-200 mb-2">No notifications yet</h3>
            <p className="text-sm text-zinc-500 font-medium">When people interact with your artwork, you'll see it here.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif, idx) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`glass-card p-4 rounded-2xl border transition-colors cursor-pointer group ${
                  !notif.is_read ? 'bg-zinc-900/80 border-indigo-500/30' : 'bg-zinc-950/50 border-zinc-800/50 hover:bg-zinc-900/50'
                }`}
                onClick={() => handleNotifClick(notif)}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {notif.sender_avatar ? (
                      <img src={notif.sender_avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover border border-zinc-800" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold border border-zinc-700">
                        {notif.sender_name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-lg ${notif.type === 'like' ? 'bg-rose-500' : 'bg-indigo-500'}`}>
                      {notif.type === 'like' ? <Heart className="w-3 h-3 text-white" /> : <MessageCircle className="w-3 h-3 text-white" />}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-300 leading-snug">
                      <span className="font-semibold text-white mr-1.5">
                        {notif.sender_name || 'Someone'}
                      </span>
                      {notif.type === 'like' ? 'liked your post.' : 
                       notif.type === 'reply' ? 'replied to your comment.' : 
                       'commented on your post.'}
                    </p>

                    {/* Show comment text preview for comment/reply notifications */}
                    {(notif.type === 'comment' || notif.type === 'reply') && notif.message && (
                      <p className="mt-1.5 text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 line-clamp-2 italic">
                        "{notif.message}"
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-1.5">
                      <p className="text-xs text-zinc-600">
                        {new Date(notif.created_at).toLocaleString()}
                      </p>
                      {notif.type === 'comment' && (
                        <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                          Click to reply
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Post thumbnail */}
                  {notif.post_image && (
                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-zinc-800 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                      <img
                        src={notif.post_image?.startsWith('http') ? notif.post_image : `${import.meta.env.VITE_BACKEND_URL}/uploads/${notif.post_image}`}
                        alt="Post thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Individual delete button */}
                  <button
                    onClick={(e) => deleteSingleNotification(e, notif.id)}
                    className="p-1.5 text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-all opacity-0 group-hover:opacity-100 shrink-0"
                    title="Remove individual notification"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
