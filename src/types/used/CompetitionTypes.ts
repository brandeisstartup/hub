import { Entry, EntrySkeletonType } from "contentful";

// ✅ Define the Contentful Fields separately
export interface CompetitionFields {
  title: string;
  showInHub: boolean;
  description: string;
}

// ✅ Ensure the correct `EntrySkeletonType`
export type CompetitionSkeleton = EntrySkeletonType<CompetitionFields>;

// ✅ Define the typed Contentful Entry
export type CompetitionEntry = Entry<CompetitionSkeleton>;
