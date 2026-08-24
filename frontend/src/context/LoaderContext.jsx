import { createContext, useContext, useState } from "react";
import Loader from "../components/common/Loader/Loader";

const LoaderContext = createContext();

export function LoaderProvider({ children }) {
  const [loading, setLoading] = useState(false);

  const showLoader = () => {
    setLoading(true);
  };

  const hideLoader = () => {
    setLoading(false);
  };

  return (
    <LoaderContext.Provider
      value={{
        loading,
        showLoader,
        hideLoader,
      }}
    >
      {loading && <Loader />}
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const context = useContext(LoaderContext);

  if (!context) {
    throw new Error("useLoader must be used inside LoaderProvider");
  }

  return context;
}