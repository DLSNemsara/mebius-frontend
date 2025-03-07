import { createSlice } from "@reduxjs/toolkit";

// Function to load cart from localStorage
const loadCart = () => {
  try {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return [];
  }
};

// Initial state with cart loaded from localStorage
const initialState = {
  value: loadCart(),
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const foundItem = state.value.find(
        (item) => item.product._id === product._id
      );

      if (foundItem) {
        // Check if adding one more would exceed stock
        if (foundItem.quantity >= product.stock) {
          return;
        }
        foundItem.quantity += 1;
      } else {
        state.value.push({ product, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(state.value)); // Save to localStorage
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.value.find((item) => item.product._id === productId);

      if (item && quantity <= item.product.stock) {
        item.quantity = quantity;
        localStorage.setItem("cart", JSON.stringify(state.value)); // Save to localStorage
      }
    },
    removeFromCart: (state, action) => {
      state.value = state.value.filter(
        (item) => item.product._id !== action.payload
      );

      localStorage.setItem("cart", JSON.stringify(state.value)); // Save to localStorage
    },
    clearCart: (state) => {
      state.value = [];
      localStorage.removeItem("cart"); // Clear localStorage
    },
  },
});

// Export actions
export const { addToCart, updateQuantity, removeFromCart, clearCart } =
  cartSlice.actions;

// Export reducer
export default cartSlice.reducer;
