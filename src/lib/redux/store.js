import { configureStore } from '@reduxjs/toolkit';
import adminPostsReducer from './adminPostsSlice';

export const store = configureStore({
  reducer: {
    adminPosts: adminPostsReducer,
  },
});
