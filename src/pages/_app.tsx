import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../store";
import "bootstrap/dist/css/bootstrap.css";
import "ol/ol.css";
import "ol-layerswitcher/dist/ol-layerswitcher.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
