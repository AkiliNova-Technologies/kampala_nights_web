import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import businessReducer from "./slices/businessSlice";
import eventReducer from "./slices/eventSlice";
import profileReducer from "./slices/profileSlice";
import djProfileReducer from "./slices/djProfileSlice";
import hotOrNotReducer from "./slices/hotOrNotSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    business: businessReducer,
    event: eventReducer,
    profile: profileReducer,
    djProfile: djProfileReducer,
    hotOrNot: hotOrNotReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/AUTH"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
