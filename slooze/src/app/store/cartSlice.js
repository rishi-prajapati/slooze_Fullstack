import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const { menuItem, quantity } = action.payload;
      const existingItem = state.find((item) => item.menuItem === menuItem);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.push({ menuItem, quantity });
      }
    },
    removeFromCart: (state, action) =>
      state.filter((item) => item.menuItem !== action.payload),
    clearCart: () => [],
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
