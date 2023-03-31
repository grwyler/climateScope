import Head from "next/head";
import MapComponent from "@/MapComponent";
import "ol/ol.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>ClimateScope</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MapComponent />
    </>
  );
}
