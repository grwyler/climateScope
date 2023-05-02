import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../store";
import "bootstrap/dist/css/bootstrap.css";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "../styles/MapComponent.module.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
