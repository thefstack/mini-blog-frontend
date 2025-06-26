import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.SERVER_URL || 'http://localhost:4000/admin/posts';

export const fetchAdminPosts = createAsyncThunk('adminPosts/fetch', async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
});

export const createAdminPost = createAsyncThunk('adminPosts/create', async (post) => {
  const res = await axios.post(BASE_URL, post);
  return res.data;
});

export const updateAdminPost = createAsyncThunk('adminPosts/update', async ({ id, post }) => {
  const res = await axios.put(`${BASE_URL}/${id}`, post);
  return res.data;
});

export const deleteAdminPost = createAsyncThunk('adminPosts/delete', async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
  return id;
});

const adminPostsSlice = createSlice({
  name: 'adminPosts',
  initialState: {
    posts: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAdminPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchAdminPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createAdminPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      })
      .addCase(updateAdminPost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.posts[index] = action.payload;
      })
      .addCase(deleteAdminPost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(p => p.id !== action.payload);
      });
  },
});

export default adminPostsSlice.reducer;
