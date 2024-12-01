// src/components/Providers.js
"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store/store";
import AuthStateHandler from "./auth/AuthStateHandler";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthStateHandler />
        {children}
      </PersistGate>
    </Provider>
  );
}
