import { AppProps } from "next/app";
import { useEffect } from "react";
import "../styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    // Perform any global initialization if required
  }, []);

  return (
    <div className="app-container">
      <Component {...pageProps} />
    </div>
  );
};

export default MyApp;
