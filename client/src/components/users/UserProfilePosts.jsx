import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';

const UserProfilePosts = () => {
  const { user } = useUser();
  const [userPosts, setUserPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: '', description: '' });

  const fetchUserPosts = async () => {
    try {
      const res = await fetch(`http://localhost:8000/upload/user-posts?user_email=${user?.primaryEmailAddress?.emailAddress}`);
      const data = await res.json();
      setUserPosts(data);
    } catch (error) {
      console.error('Failed to fetch user posts:', error);
    }
  };

  useEffect(() => {
    if (user) fetchUserPosts();
  }, [user]);

  const handleDelete = async (id, imageUrl) => {
    const confirm = window.confirm('Are you sure you want to delete this post?');
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:8000/upload/delete-post/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl })
      });

      const result = await res.json();
      if (res.ok) {
        setUserPosts(userPosts.filter((post) => post.id !== id));
        alert(result.message);
      } else {
        alert(result.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const openEditModal = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      category: post.category,
      description: post.description
    });
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8000/upload/edit-post/${editingPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      if (res.ok) {
        setEditingPost(null);
        fetchUserPosts();
        alert(result.message);
      } else {
        alert(result.error || 'Failed to update post');
      }
    } catch (error) {
      console.error('Edit failed:', error);
    }
  };

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {userPosts.length > 0 ? (
        userPosts.map((post) => (
          <div key={post.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <img
              src={`http://localhost:8000/uploads/${post.image_url}`}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-600">Category: {post.category}</p>
              <p className="text-gray-500 mt-2">{post.description}</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => openEditModal(post)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id, post.image_url)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center col-span-full">You haven't uploaded any images yet.</p>
      )}

      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Edit Post</h2>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleEditChange}
                className="w-full mb-3 p-2 border rounded"
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleEditChange}
                className="w-full mb-3 p-2 border rounded"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleEditChange}
                className="w-full mb-3 p-2 border rounded"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-3 py-1 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePosts;
