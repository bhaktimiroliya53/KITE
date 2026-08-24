import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import "./styles/user/global.css";
import { LoaderProvider } from "./context/LoaderContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoaderProvider>
      <App />
    </LoaderProvider>
  </React.StrictMode>
);