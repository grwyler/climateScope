import Head from "next/head";
import "@fortawesome/fontawesome-free/css/all.min.css";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

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
