import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks for API calls
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const token = await window.Clerk?.session?.getToken();
      const response = await fetch(
        "https://mebius-backend-sinel.onrender.com/api/wishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const token = await window.Clerk?.session?.getToken();
      const response = await fetch(
        "https://mebius-backend-sinel.onrender.com/api/wishlist",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add to wishlist");
      }

      const data = await response.json();
      return data.wishlistItem;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const token = await window.Clerk?.session?.getToken();
      const response = await fetch(
        "https://mebius-backend-sinel.onrender.com/api/wishlist",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove from wishlist");
      }

      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    },
    clearWishlist: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch wishlist
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add to wishlist
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        // Add the new item to the beginning of the list
        state.items.unshift(action.payload);
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Remove from wishlist
    builder
      .addCase(removeFromWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        // Remove the item from the list
        state.items = state.items.filter(
          (item) => item.productId._id !== action.payload
        );
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearWishlistError, clearWishlist } = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistLoading = (state) => state.wishlist.loading;
export const selectWishlistError = (state) => state.wishlist.error;
export const selectIsInWishlist = (state, productId) =>
  state.wishlist.items.some((item) => item.productId._id === productId);
export const selectWishlistCount = (state) => state.wishlist.items.length;

export default wishlistSlice.reducer;
