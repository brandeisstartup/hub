import { createClient } from "contentful";
import { CompetitionEntry } from "@/types/used/CompetitionTypes"; // ✅ Import types

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || "",
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || ""
});

export default client;
