import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to handle image upload
export const uploadImages = createAsyncThunk(
  'images/uploadImages',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch('https://realstate4-q8lsvtei.b4a.run/api/image/upload', {
        method: 'POST',
        body: formData, // Sending the FormData containing the files
      });

      if (!response.ok) {
        throw new Error('Error uploading images');
      }

      const data = await response.json();
      return data.urls; // Returning the URLs from the response
    } catch (error) {
      return rejectWithValue(error.message); // Reject the promise with an error message
    }
  }
);

// Create slice for image upload state
const imageUploadSlice = createSlice({
  name: 'images',
  initialState: {
    images: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImages.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload; // Save the URLs in the state
      })
      .addCase(uploadImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error message
      });
  },
});

export const { clearError } = imageUploadSlice.actions;
export default imageUploadSlice.reducer;
