import { configureStore, createSlice } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

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

// ———— Cart Slice (not persisted) ————
const cartSlice = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const { menuItem, quantity } = action.payload;
      const existing = state.find((item) => item.menuItem === menuItem);
      if (existing) {
        existing.quantity += quantity;
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

// ———— Persist Config (only user) ————
const userPersistConfig = {
  key: 'user',
  storage,
};

const persistedUserReducer = persistReducer(userPersistConfig, userSlice.reducer);

// ———— Store Setup ————
export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    cart: cartSlice.reducer, // not persisted
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Fix non-serializable Redux persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// ———— Persistor ————
export const persistor = persistStore(store);
