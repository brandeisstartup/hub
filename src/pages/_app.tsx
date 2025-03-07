import type { AppProps } from "next/app";
import { CompetitionProvider } from "@/context/EventContext"; // Import CompetitionProvider
import { ApolloProvider } from "@apollo/client"; // Import ApolloProvider
import client from "@/lib/apolloClient"; // Import Apollo Client
import "@/styles/globals.css"; // Import global styles
import Layout from "@/pages/layouts/layout"; // Import Layout component

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <CompetitionProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CompetitionProvider>
    </ApolloProvider>
  );
}
