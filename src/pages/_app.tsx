import type { AppProps } from "next/app";
import { CompetitionProvider } from "@/context/EventContext"; // Import CompetitionProvider
import "@/styles/globals.css"; // Import global styles if any
import Layout from "@/pages/layouts/layout"; // Import Layout component

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CompetitionProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CompetitionProvider>
  );
}
