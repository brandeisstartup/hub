import type { AppProps } from "next/app";
import { CompetitionProvider } from "@/context/EventContext";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apolloClient";
import "@/styles/globals.css";
import Layout from "@/pages/layouts/layout";
import { ClerkProvider } from "@clerk/nextjs";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <ApolloProvider client={client}>
        <CompetitionProvider>
          <Layout>
            {/* Display SignInButton if user is signed out */}
            <Component {...pageProps} />
          </Layout>
        </CompetitionProvider>
      </ApolloProvider>
    </ClerkProvider>
  );
}
