import { configureStore } from "@reduxjs/toolkit";
import analyticsReducer from "./slices/analyticsSlice";
import transactionReducer from "./slices/transactionSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    analytics: analyticsReducer,
    transactions: transactionReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
