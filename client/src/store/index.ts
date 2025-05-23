import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import pollsReducer from './slices/pollsSlice';
import authReducer from './slices/authSlice';

// Create Redux store with slices
export const store = configureStore({
  reducer: {
    polls: pollsReducer,
    auth: authReducer,
    // Add more reducers as needed
  },
  // Add middleware and devTools configuration if needed
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  // devTools: process.env.NODE_ENV !== 'production',
});

// Define types for dispatch and state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for better TypeScript integration
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
