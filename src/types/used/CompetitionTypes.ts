import { Entry, EntrySkeletonType } from "contentful";

export interface CompetitionFields {
  title: string;
  showInHub: boolean;
  description: string;
  startDate: string;
  endDate: string;
  isGrant: boolean;
  faqs: Array<{ question: string; answer: string }>;
  contactInformation: Array<{ name: string; email: string }>;
  requirements: Array<{ requirement: string; explanation: Array<string> }>;
  about: string;
  showIntroVideo: boolean;
  showPersonSpotlight: boolean;
  personSpotlightImage: ImageFile;
  personSpotlightText: string;
  personSpotlightLInk: string;
  personSpotlightFirstName: string;
  personSpotlightLastName: string;
}

export interface ImageFile {
  fields: {
    title: string;
    description: string;
    file: {
      url: string;
      details: {
        size: number;
        image: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
}

export interface Competition {
  fields: CompetitionFields;
}

export interface Props {
  competition: Competition;
}

// Ensure the correct `EntrySkeletonType` with explicit contentTypeId
export type CompetitionSkeleton = EntrySkeletonType<
  CompetitionFields,
  "competitions"
>;

// Define the typed Contentful Entry
export type CompetitionEntry = Entry<CompetitionSkeleton>;
