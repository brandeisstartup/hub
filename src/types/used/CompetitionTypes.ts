import { Entry, EntrySkeletonType } from "contentful";

export interface CompetitionFields {
  title: string;
  showInHub: boolean;
  description: string;
  startDate: string;
  endDate: string;
  isGrant: boolean;

  showIntroVideo: boolean;
  introVideoYoutubeId: string;

  showAbout: boolean;
  about: string;

  showRequirements: boolean;
  requirements: Array<{ requirement: string; explanation: Array<string> }>;

  showSchedule: boolean;
  scheduleEvents: ScheduleItem[];

  showPersonSpotlight: boolean;
  personSpotlightImage: ImageFile;
  personSpotlightText: string;
  personSpotlightLInk: string;
  personSpotlightFirstName: string;
  personSpotlightLastName: string;

  showFaq: boolean;
  faqs: Array<{ question: string; answer: string }>;

  showContactInformation: boolean;
  contactInformation: Array<{ name: string; email: string }>;
}

export interface ScheduleItem {
  title: string;
  description: string;
  date: string;
  dateTime: string;
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
