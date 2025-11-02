import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import uploadsReducer from './uploadsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    uploads: uploadsReducer,
  },
});
