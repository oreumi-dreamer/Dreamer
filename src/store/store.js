import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./authSlice";
import modalReducer from "./modalSlice";
import activeStateSlice from "./activeStateSlice";

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isLoading", "error", "isRegistrationComplete"],
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    modal: modalReducer,
    activeState: activeStateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
