import type { AppProps } from "next/app";
import { CompetitionProvider } from "@/context/EventContext"; // Import CompetitionProvider
import "@/styles/globals.css"; // Import global styles if any

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CompetitionProvider>
      <Component {...pageProps} />
    </CompetitionProvider>
  );
}
