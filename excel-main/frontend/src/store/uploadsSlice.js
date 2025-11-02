import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  uploads: [],
  selectedUpload: null,
  loading: false,
};

const uploadsSlice = createSlice({
  name: 'uploads',
  initialState,
  reducers: {
    setUploads: (state, action) => {
      state.uploads = action.payload;
    },
    addUpload: (state, action) => {
      state.uploads.unshift(action.payload);
    },
    setSelectedUpload: (state, action) => {
      state.selectedUpload = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUploads, addUpload, setSelectedUpload, setLoading } = uploadsSlice.actions;
export default uploadsSlice.reducer;
