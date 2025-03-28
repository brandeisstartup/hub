// pages/_app.tsx
import type { AppProps } from "next/app";
import { CompetitionProvider } from "@/context/EventContext";
import dynamic from "next/dynamic";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apolloClient";
import "@/styles/globals.css";
import Layout from "@/pages/layouts/layout";
import { ClerkProvider } from "@clerk/nextjs";
import React, { Suspense } from "react";

// Import and configure NProgress
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Configure NProgress to start on route change
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

// Dynamically import the UserProvider (client-only)
const UserProvider = dynamic(
  () => import("@/context/UserContext").then((mod) => mod.UserProvider),
  { ssr: false }
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          logoImageUrl: "/missing.webp",
          logoPlacement: "center",
          privacyPolicyUrl: "/privacy",
          termsOfServiceUrl: "/terms"
        },
        variables: {
          colorPrimary: "#6366F1",
          fontFamily: "Inter, sans-serif",
          borderRadius: "0.375rem"
        },
        elements: {
          rootBox: "p-2",
          headerTitle: "text-2xl font-bold mb-4",
          formButtonPrimary:
            "bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded",
          formFieldInput:
            "border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        }
      }}
      {...pageProps}>
      <ApolloProvider client={client}>
        <CompetitionProvider>
          <UserProvider>
            {/* Suspense fallback can be a spinner, loader, etc. */}
            <Suspense
              fallback={
                <div className="fixed top-0 left-0 right-0 bg-gray-100 p-4 text-center">
                  Loading...
                </div>
              }>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </Suspense>
          </UserProvider>
        </CompetitionProvider>
      </ApolloProvider>
    </ClerkProvider>
  );
}
