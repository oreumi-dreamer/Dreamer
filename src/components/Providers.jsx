// src/components/Providers.js
"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store/store";
import AuthStateHandler from "./auth/AuthStateHandler";

import Loading from "./Loading";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading type="full" />} persistor={persistor}>
        <AuthStateHandler>{children}</AuthStateHandler>
      </PersistGate>
    </Provider>
  );
}
