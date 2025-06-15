import { configureStore, createSlice } from '@reduxjs/toolkit';

// ———— User Slice ————
const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser: (_state, action) => action.payload,
    clearUser: () => null,
  },
});
export const { setUser, clearUser } = userSlice.actions;

// ———— Cart Slice ————
const cartSlice = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const { menuItem, quantity } = action.payload;
      const existing = state.find(item => item.menuItem === menuItem);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.push({ menuItem, quantity });
      }
    },
    removeFromCart: (state, action) =>
      state.filter(item => item.menuItem !== action.payload),
    clearCart: () => [],
  },
});
export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

// ———— Store ————
export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    cart: cartSlice.reducer,
  },
});
