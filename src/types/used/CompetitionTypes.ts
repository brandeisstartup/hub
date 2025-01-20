import { Entry, EntrySkeletonType } from "contentful";

// ✅ Define the Contentful Fields separately
export interface CompetitionFields {
  title: string;
  showInHub: boolean;
  description: string;
  startDate: string;
  endDate: string;
  isGrant: boolean;
}

export interface Competition {
  fields: CompetitionFields;
}

export interface Props {
  competition: Competition;
}

// ✅ Ensure the correct `EntrySkeletonType` with explicit contentTypeId
export type CompetitionSkeleton = EntrySkeletonType<
  CompetitionFields,
  "competitions"
>;

// ✅ Define the typed Contentful Entry
export type CompetitionEntry = Entry<CompetitionSkeleton>;
