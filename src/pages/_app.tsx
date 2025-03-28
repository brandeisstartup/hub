import type { AppProps } from "next/app";
import { CompetitionProvider } from "@/context/EventContext";
import dynamic from "next/dynamic";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apolloClient";
import "@/styles/globals.css";
import Layout from "@/pages/layouts/layout";
import { ClerkProvider } from "@clerk/nextjs";

const UserProvider = dynamic(
  () => import("@/context/UserContext").then((mod) => mod.UserProvider),
  { ssr: false }
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          logoImageUrl: "/missing.webp", // Your custom logo from the public folder
          logoPlacement: "center", // Example of centering the logo
          privacyPolicyUrl: "/privacy", // Optional: links to your policies
          termsOfServiceUrl: "/terms"
        },
        variables: {
          colorPrimary: "#6366F1", // Your primary color (Tailwind indigo-500, for example)
          fontFamily: "Inter, sans-serif", // Custom font
          borderRadius: "0.375rem" // Example: 6px rounded corners
        },
        elements: {
          rootBox: "p-2", // Customize the outer container styles
          headerTitle: "text-2xl font-bold mb-4", // Style for the header text
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
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </UserProvider>
        </CompetitionProvider>
      </ApolloProvider>
    </ClerkProvider>
  );
}
