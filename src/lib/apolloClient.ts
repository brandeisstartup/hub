import { ApolloClient, InMemoryCache } from "@apollo/client";

// ✅ Detect the environment and set the correct GraphQL URL
const uri = process.env.NEXT_PUBLIC_GRAPHQL_URL;

const client = new ApolloClient({
  uri, // ✅ Now dynamically uses the environment variable
  cache: new InMemoryCache()
});

export default client;
