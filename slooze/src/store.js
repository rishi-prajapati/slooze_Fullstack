// slooze/src/store.js
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
import storage from 'redux-persist/lib/storage';

// ===== User Slice =====
const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser: (_, action) => action.payload,
    clearUser: () => null,
  },
});

export const { setUser, clearUser } = userSlice.actions;

// ===== Cart Slice =====
const cartSlice = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const { menuItem, quantity } = action.payload;
      const existingItem = state.find(item => item.menuItem === menuItem);
      
      if (existingItem) {
        existingItem.quantity += quantity;
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

// ===== Persist Configuration =====
const userPersistConfig = {
  key: 'user',
  storage,
};

// ===== Persisted Reducer =====
const persistedUserReducer = persistReducer(userPersistConfig, userSlice.reducer);

// ===== Store Configuration =====
export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    cart: cartSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// ===== Persistor =====
export const persistor = persistStore(store);