import { createClient, Entry, EntrySkeletonType } from "contentful";

// ✅ Ensure Contentful expects the correct type
export interface CompetitionFields {
  title: string;
  showInHub: boolean;
}

// ✅ Define the structure for Contentful API response
export type CompetitionSkeleton = EntrySkeletonType<CompetitionFields>;

// ✅ Define the typed Contentful Entry
export type CompetitionEntry = Entry<CompetitionSkeleton>;

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || "",
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || ""
});

export default client;
