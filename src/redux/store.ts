import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import businessReducer from "./slices/businessSlice";
import eventReducer from "./slices/eventSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    business: businessReducer,
    event: eventReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
