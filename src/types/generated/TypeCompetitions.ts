// import type { Entry, EntryFields } from "contentful";

// export interface TypeCompetitionsFields {
//   title: EntryFields.Symbol;
//   showInHub: EntryFields.Boolean;
//   description: EntryFields.Symbol;
// }
// //@ts-ignore
// export type TypeCompetitions = Entry<TypeCompetitionsFields>;

import type { Entry, EntryFields, EntrySkeletonType } from "contentful";

// ✅ Define the correct EntrySkeletonType with `contentTypeId`
export interface TypeCompetitionsFields {
  title: EntryFields.Symbol;
  showInHub: EntryFields.Boolean;
  description: EntryFields.Symbol;
}

// ✅ Ensure the `contentTypeId` is explicitly set
export type TypeCompetitionsSkeleton = EntrySkeletonType<
  TypeCompetitionsFields,
  "competitions"
>;

// ✅ Define the Contentful Entry type correctly
export type TypeCompetitions = Entry<TypeCompetitionsSkeleton>;
