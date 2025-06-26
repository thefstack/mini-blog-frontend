'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast'; // For notifications
import {
  fetchAdminPosts,
  createAdminPost,
  updateAdminPost,
  deleteAdminPost,
} from '@/lib/redux/adminPostsSlice';

// A simple Skeleton Loader for a better UX
const SkeletonLoader = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white p-5 rounded-lg shadow-sm animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    ))}
  </div>
);


export default function AdminPage() {
  const dispatch = useDispatch();
  const { posts, status, error } = useSelector((state) => state.adminPosts);

  const [form, setForm] = useState({ title: '', body: '', id: null });
  const [editing, setEditing] = useState(false);
  const formRef = useRef(null); // To scroll to the form when editing

  useEffect(() => {
    dispatch(fetchAdminPosts());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ title: '', body: '', id: null });
    setEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = editing
      ? updateAdminPost({ id: form.id, post: { title: form.title, body: form.body } })
      : createAdminPost({ title: form.title, body: form.body });

    toast.promise(
      dispatch(action).unwrap(), // .unwrap() is key for promise handling
      {
        loading: editing ? 'Updating post...' : 'Creating post...',
        success: `Post ${editing ? 'updated' : 'created'} successfully!`,
        error: `Failed to ${editing ? 'update' : 'create'} post.`,
      }
    );
    resetForm();
  };

  const handleEdit = (post) => {
    setForm({ ...post });
    setEditing(true);
    formRef.current?.scrollIntoView({ behavior: 'smooth' }); // Scroll to form
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this post?')) {
      toast.promise(
        dispatch(deleteAdminPost(id)).unwrap(),
        {
          loading: 'Deleting post...',
          success: 'Post deleted successfully!',
          error: 'Failed to delete post.',
        }
      );
    }
  };

  return (
    <>
      {/* Place Toaster at the root, it will handle all toast notifications */}
      <Toaster position="top-right" reverseOrder={false} />
      
      <main className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <header>
            <h1 className="text-3xl font-extrabold text-gray-900">🛠 Admin Post Manager</h1>
            <p className="text-gray-500 mt-1">Create, edit, and manage your posts from one place.</p>
          </header>

          {/* Form Card */}
          <div ref={formRef} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Post' : 'Create a New Post'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  id="title"
                  name="title"
                  placeholder="Enter post title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                <textarea
                  id="body"
                  name="body"
                  placeholder="Write your post content here..."
                  value={form.body}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={5}
                  required
                />
              </div>
              <div className="flex items-center gap-4">
                <button type="submit" className="bg-blue-600 text-white font-bold px-5 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
                  {editing ? 'Update Post' : 'Create Post'}
                </button>
                {editing && (
                  <button type="button" onClick={resetForm} className="text-gray-600 font-bold px-5 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Status and Posts List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Published Posts</h2>
            {status === 'loading' && <SkeletonLoader />}
            {status === 'failed' && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md"><p><strong>Error:</strong> {error}</p></div>}
            
            {status === 'succeeded' && posts.map((post) => (
              <div key={post.id} className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
                <p className="text-gray-600 mt-1 line-clamp-2">{post.body}</p>
                <div className="flex gap-4 mt-4 pt-3 border-t border-gray-100">
                  <button onClick={() => handleEdit(post)} className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                    {/* Heroicon: pencil-square */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 1 10 6H4.75A.75.75 0 0 0 4 6.75v8.5A.75.75 0 0 0 4.75 16h8.5A.75.75 0 0 0 14 15.25V10a.75.75 0 0 1 1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-8.5c-.69 0-1.25-.56-1.25-1.25v-8.5Z" /></svg>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(post.id)} className="flex items-center gap-1.5 text-sm text-red-600 hover:underline">
                    {/* Heroicon: trash */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 1 0 .53 1.422a18.159 18.159 0 0 1 2.335-.468v.443c0 1.517 1.233 2.75 2.75 2.75h2.5A2.75 2.75 0 0 0 14 5.636v-.443c.795-.077 1.58-.22 2.365-.468a.75.75 0 1 0-.53-1.422A18.159 18.159 0 0 1 13.5 3.307v.443A2.75 2.75 0 0 0 10.75 1h-2ZM6.5 7.75A.75.75 0 0 1 7.25 7h5.5a.75.75 0 0 1 0 1.5h-5.5A.75.75 0 0 1 6.5 7.75Z" clipRule="evenodd" /></svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}